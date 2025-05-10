import { db } from "@/utils/db";
import { Courses, Topics, Analytics, Submissions, AIQuestions, ManualQuestions } from "@/utils/schema";
import { eq, sql, and, or, desc } from "drizzle-orm";
import { calculateLevelFromPoints } from "@/lib/level-utils";

// Helper to get the latest analytics for each question
async function getLatestAnalytics(userEmail) {
  console.log("[DEBUG] Fetching latest analytics for user:", userEmail);
  
  const latestAnalytics = await db.execute(sql`
    WITH RankedAnalytics AS (
      SELECT 
        a.*,
        ROW_NUMBER() OVER (
          PARTITION BY a."questionId", a."questionType" 
          ORDER BY a.id DESC
        ) as rank
      FROM analytics a
      WHERE a."userId" = ${userEmail}
    )
    SELECT * FROM RankedAnalytics WHERE rank = 1
  `);

  console.log("[DEBUG] Latest analytics data:", latestAnalytics);
  return latestAnalytics;
}

// Helper to get best submissions
async function getBestSubmissions(userEmail, filters = {}) {
  console.log("[DEBUG] Fetching best submissions for user:", userEmail, "with filters:", filters);

  try {
    let query = db.select()
      .from(Submissions)
      .where(eq(Submissions.userId, userEmail))
      .orderBy(
        Submissions.questionId,
        Submissions.questionType,
        desc(Submissions.totalTestCasesPassed),
        desc(Submissions.createdAt)
      );

    // Apply course filter if provided
    if (filters.courseId) {
      query = query.where(
        or(
          and(
            eq(Submissions.questionType, 'ai'),
            eq(AIQuestions.courseid, filters.courseId)
          ),
          and(
            eq(Submissions.questionType, 'manual'),
            eq(ManualQuestions.courseid, filters.courseId)
          )
        )
      );
    }

    // Apply topic filter if provided
    if (filters.topicId) {
      query = query.where(
        or(
          and(
            eq(Submissions.questionType, 'ai'),
            eq(AIQuestions.topicid, filters.topicId)
          ),
          and(
            eq(Submissions.questionType, 'manual'),
            eq(ManualQuestions.topicid, filters.topicId)
          )
        )
      );
    }

    // Join with question tables
    query = query
      .leftJoin(AIQuestions, and(
        eq(Submissions.questionId, AIQuestions.id),
        eq(Submissions.questionType, 'ai')
      ))
      .leftJoin(ManualQuestions, and(
        eq(Submissions.questionId, ManualQuestions.id),
        eq(Submissions.questionType, 'manual')
      ));

    const submissions = await query;

    // Group by question to get the best submission per question
    const bestSubmissions = [];
    const seenQuestions = new Set();

    for (const submission of submissions) {
      const questionKey = `${submission.questionId}-${submission.questionType}`;
      if (!seenQuestions.has(questionKey)) {
        bestSubmissions.push(submission);
        seenQuestions.add(questionKey);
      }
    }

    console.log("[DEBUG] Best submissions data:", bestSubmissions);
    return bestSubmissions;
  } catch (error) {
    console.error("[ERROR] Error fetching best submissions:", error);
    throw error;
  }
}

// Helper to generate topic stats
async function generateTopicStats(analyticsData) {
  console.log("[DEBUG] Generating topic stats from analytics data");
  
  const weakTopics = [];
  const strongTopics = [];

  if (analyticsData.length > 0) {
    const latestAnalytics = analyticsData[0];
    
    if (latestAnalytics.weakTopics) {
      try {
        const weakTopicsData = Array.isArray(latestAnalytics.weakTopics) 
          ? latestAnalytics.weakTopics 
          : JSON.parse(latestAnalytics.weakTopics);
        
        for (const topic of weakTopicsData) {
          const topicDetails = await db.select().from(Topics).where(eq(Topics.id, topic.id)).limit(1);
          const courseDetails = await db.select().from(Courses).where(eq(Courses.id, topic.courseid)).limit(1);
          
          if (topicDetails.length > 0 && courseDetails.length > 0) {
            weakTopics.push({
              id: topic.id,
              courseid: topic.courseid,
              name: topicDetails[0].name,
              courseName: courseDetails[0].name,
              correctPercentage: topic.correctPercentage || 0
            });
          }
        }
      } catch (error) {
        console.error("[ERROR] Error parsing weakTopics:", error);
      }
    }

    if (latestAnalytics.strongTopics) {
      try {
        const strongTopicsData = Array.isArray(latestAnalytics.strongTopics) 
          ? latestAnalytics.strongTopics 
          : JSON.parse(latestAnalytics.strongTopics);
        
        for (const topic of strongTopicsData) {
          const topicDetails = await db.select().from(Topics).where(eq(Topics.id, topic.id)).limit(1);
          const courseDetails = await db.select().from(Courses).where(eq(Courses.id, topic.courseid)).limit(1);
          
          if (topicDetails.length > 0 && courseDetails.length > 0) {
            strongTopics.push({
              id: topic.id,
              courseid: topic.courseid,
              name: topicDetails[0].name,
              courseName: courseDetails[0].name,
              correctPercentage: topic.correctPercentage || 0
            });
          }
        }
      } catch (error) {
        console.error("[ERROR] Error parsing strongTopics:", error);
      }
    }
  }

  console.log("[DEBUG] Generated topic stats:", { weakTopics, strongTopics });
  return { weakTopics, strongTopics };
}

// Calculate knowledge metrics
function calculateKnowledgeMetrics(analyticsData) {
  if (!analyticsData || analyticsData.length === 0) {
    return {
      startingKnowledge: 0,
      currentKnowledge: 0,
      knowledgeGain: 0
    };
  }

  // Get the most recent analytics entry
  const latestAnalytics = analyticsData[0];
  
  return {
    startingKnowledge: latestAnalytics.startingKnowledge || 0,
    currentKnowledge: latestAnalytics.currentKnowledge || 0,
    knowledgeGain: (latestAnalytics.currentKnowledge || 0) - (latestAnalytics.startingKnowledge || 0)
  };
}

// Calculate question stats
function calculateQuestionStats(bestSubmissions) {
  const totalQuestions = bestSubmissions.length;
  const correctAnswers = bestSubmissions.filter(s => s.passed).length;
  const correctPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return {
    questionsAnswered: totalQuestions,
    correctAnswers,
    correctPercentage
  };
}

// Calculate level and points
function calculateLevelAndPoints(bestSubmissions) {
  const totalPoints = bestSubmissions.reduce((sum, submission) => {
    return sum + (submission.totalTestCasesPassed || 0);
  }, 0);

  const levelData = calculateLevelFromPoints(totalPoints);

  return {
    totalPoints,
    ...levelData
  };
}

// Main function to fetch reports data
export async function fetchReportsData(userEmail, filters = {}) {
  console.log("[DEBUG] Fetching reports data for:", userEmail, "with filters:", filters);

  try {
    // Fetch courses and topics for filters
    const [courses, topics] = await Promise.all([
      db.select().from(Courses),
      db.select().from(Topics)
    ]);
    
    // Fetch analytics data
    const analyticsData = await getLatestAnalytics(userEmail);
    
    // Fetch best submissions with filters
    const bestSubmissions = await getBestSubmissions(userEmail, filters);

    // Generate all metrics
    const { weakTopics, strongTopics } = await generateTopicStats(analyticsData);
    const knowledgeMetrics = calculateKnowledgeMetrics(analyticsData);
    const questionStats = calculateQuestionStats(bestSubmissions);
    const levelAndPoints = calculateLevelAndPoints(bestSubmissions);

    return {
      courses,
      topics,
      data: {
        ...levelAndPoints,
        ...questionStats,
        ...knowledgeMetrics,
        weakTopics,
        strongTopics,
        avgSessionLength: "0m 0s", // Placeholder - implement actual calculation
        totalSessions: 0,          // Placeholder - implement actual calculation
        activityData: []            // Placeholder - implement actual data
      }
    };
  } catch (error) {
    console.error("[ERROR] Error fetching reports data:", error);
    // Return default structure with error indication
    return {
      courses: [],
      topics: [],
      data: {
        currentLevel: 1,
        currentXP: 0,
        nextLevelXP: 100,
        questionsAnswered: 0,
        correctAnswers: 0,
        correctPercentage: 0,
        avgSessionLength: "0m 0s",
        totalSessions: 0,
        activityData: [],
        startingKnowledge: 0,
        currentKnowledge: 0,
        knowledgeGain: 0,
        weakTopics: [],
        strongTopics: [],
        totalPoints: 0,
        error: "Failed to load data"
      }
    };
  }
}