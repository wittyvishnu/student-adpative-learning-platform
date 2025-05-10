"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/utils/db"
import { Courses, Topics, Submissions, Analytics, AIQuestions, ManualQuestions } from "@/utils/schema"
import { eq, and, gte, desc, sql, or } from "drizzle-orm"
import { LEVEL_THRESHOLDS } from "@/utils/constants"

// Get the current user's email
async function getCurrentUserEmail() {
  const { userId } = auth()

  if (!userId) {
    console.log("[DEBUG] User not authenticated")
    //throw new Error("User not authenticated")
  }

  console.log("[DEBUG] Current user ID:", userId)
  return userId
}

// Calculate level from points
function calculateLevelFromPoints(points) {
  console.log("[DEBUG] Calculating level from points:", points)
  
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i].points) {
      const currentLevel = LEVEL_THRESHOLDS[i].level
      const nextLevelIndex = i < LEVEL_THRESHOLDS.length - 1 ? i + 1 : i
      const nextLevelPoints = LEVEL_THRESHOLDS[nextLevelIndex].points
      
      console.log(`[DEBUG] Found level ${currentLevel} for ${points} points. Next level at ${nextLevelPoints} points`)
      
      return {
        currentLevel,
        currentXP: points,
        nextLevelXP: nextLevelPoints,
      }
    }
  }

  console.log("[DEBUG] No matching level found, defaulting to level 1")
  return {
    currentLevel: 1,
    currentXP: points,
    nextLevelXP: LEVEL_THRESHOLDS[1].points,
  }
}

// Get initial data for the reports page
export async function getInitialReportsData() {
  console.log("[DEBUG] Fetching initial reports data")
  const userEmail = await getCurrentUserEmail()
  console.log("[DEBUG] User email:", userEmail)

  try {
    // Fetch courses and topics for filters
    const courses = await db.select().from(Courses)
    console.log(`[DEBUG] Fetched ${courses.length} courses`)

    const topics = await db.select().from(Topics)
    console.log(`[DEBUG] Fetched ${topics.length} topics`)

    // Fetch analytics data
    const analyticsData = await db.select().from(Analytics).where(eq(Analytics.userId, userEmail)).limit(1)
    console.log(`[DEBUG] Fetched analytics data:`, analyticsData.length > 0 ? "Found" : "Not found")

    // Fetch submissions with joined question data
    const submissions = await db.execute(sql`
      SELECT 
        s.*,
        COALESCE(aq.courseid, mq.courseid) as question_courseid,
        COALESCE(aq.topicid, mq.topicid) as question_topicid
      FROM submissions s
      LEFT JOIN ai_questions aq ON s.questionId = aq.id AND s.questionType = 'ai'
      LEFT JOIN manual_questions mq ON s.questionId = mq.id AND s.questionType = 'manual'
      WHERE s.userId = ${userEmail}
      ORDER BY s.createdAt DESC
    `)
    
    console.log(`[DEBUG] Fetched ${submissions.length} submissions`)

    // Calculate total points based on test cases passed
    let totalPoints = 0
    let courseTopicStats = {}
    
    submissions.forEach(submission => {
      const testCasesPassed = submission.totalTestCasesPassed || 0
      const totalTestCases = submission.totalTestCases || 0
      const courseid = submission.question_courseid
      const topicid = submission.question_topicid
      
      // Points calculation: 10 points per test case percentage
      const pointsPercentage = totalTestCases > 0 ? (testCasesPassed / totalTestCases) : 0
      const submissionPoints = Math.round(pointsPercentage * 100)
      
      console.log(`[DEBUG] Submission ${submission.id}: ${testCasesPassed}/${totalTestCases} tests passed = ${submissionPoints} points`)
      
      totalPoints += submissionPoints
      
      // Track stats by course and topic
      const courseTopicKey = `${courseid}-${topicid}`
      if (!courseTopicStats[courseTopicKey]) {
        courseTopicStats[courseTopicKey] = {
          courseid,
          topicid,
          totalQuestions: 0,
          correctQuestions: 0,
          totalPoints: 0,
          testCasesPassed: 0,
          totalTestCases: 0
        }
      }
      
      courseTopicStats[courseTopicKey].totalQuestions++
      if (submission.passed) {
        courseTopicStats[courseTopicKey].correctQuestions++
      }
      courseTopicStats[courseTopicKey].totalPoints += submissionPoints
      courseTopicStats[courseTopicKey].testCasesPassed += testCasesPassed
      courseTopicStats[courseTopicKey].totalTestCases += totalTestCases
    })
    
    console.log(`[DEBUG] Total points: ${totalPoints}`)
    console.log(`[DEBUG] Course-Topic stats:`, Object.keys(courseTopicStats).length)

    // Calculate level based on points
    const levelData = calculateLevelFromPoints(totalPoints)
    console.log(`[DEBUG] Level data:`, levelData)

    // Calculate statistics
    const questionsAnswered = submissions.length
    const correctAnswers = submissions.filter(s => s.passed).length
    const correctPercentage = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0
    
    console.log(`[DEBUG] Questions answered: ${questionsAnswered}, Correct: ${correctAnswers} (${correctPercentage}%)`)

    // Calculate average session length
    const avgSessionLength = calculateAverageSessionLength(submissions)
    console.log(`[DEBUG] Average session length: ${avgSessionLength}`)

    // Count unique sessions (approximated by days with submissions)
    const uniqueDays = new Set(submissions.map(s => new Date(s.createdAt).toDateString())).size
    console.log(`[DEBUG] Unique days with activity: ${uniqueDays}`)

    // Get knowledge data from analytics
    const startingKnowledge = analyticsData[0]?.startingKnowledge || 0
    const currentKnowledge = analyticsData[0]?.currentKnowledge || 0
    const knowledgeGain = currentKnowledge - startingKnowledge
    
    console.log(`[DEBUG] Knowledge: Starting=${startingKnowledge}%, Current=${currentKnowledge}%, Gain=${knowledgeGain}%`)

    // Generate weak and strong topics from course-topic stats
    const topicStats = await generateTopicStats(courseTopicStats)
    console.log(`[DEBUG] Generated topic stats: Weak=${topicStats.weakTopics.length}, Strong=${topicStats.strongTopics.length}`)

    // Generate activity data from submissions
    const activityData = generateActivityDataFromSubmissions(submissions)
    console.log(`[DEBUG] Generated activity data for ${activityData.length} days`)

    return {
      courses,
      topics,
      data: {
        ...levelData,
        questionsAnswered,
        correctAnswers,
        correctPercentage,
        avgSessionLength,
        totalSessions: uniqueDays,
        activityData,
        startingKnowledge,
        currentKnowledge,
        knowledgeGain,
        weakTopics: topicStats.weakTopics,
        strongTopics: topicStats.strongTopics,
        totalPoints,
      },
    }
  } catch (error) {
    console.error("[ERROR] Error fetching initial reports data:", error)
    throw error
  }
}

// Fetch filtered data based on user selections
export async function fetchFilteredReportsData({ timeframe, courseId, topicId, userEmail }) {
  console.log("[DEBUG] Fetching filtered reports data:", { timeframe, courseId, topicId, userEmail })
  
  try {
    const userId = userEmail || await getCurrentUserEmail()
    console.log("[DEBUG] User ID for filtered data:", userId)

    // Build date filter
    let dateFilter = ""
    if (timeframe === "this-week") {
      dateFilter = "AND s.createdAt > NOW() - INTERVAL '7 days'"
    } else if (timeframe === "this-month") {
      dateFilter = "AND s.createdAt > NOW() - INTERVAL '30 days'"
    } else if (timeframe === "this-year") {
      dateFilter = "AND s.createdAt > NOW() - INTERVAL '365 days'"
    } else if (timeframe === "today") {
      dateFilter = "AND DATE(s.createdAt) = CURRENT_DATE"
    }
    
    // Build course and topic filters
    let courseFilter = ""
    if (courseId !== "all") {
      courseFilter = `AND COALESCE(aq.courseid, mq.courseid) = ${courseId}`
    }
    
    let topicFilter = ""
    if (topicId !== "all") {
      topicFilter = `AND COALESCE(aq.topicid, mq.topicid) = ${topicId}`
    }
    
    console.log("[DEBUG] SQL filters:", { dateFilter, courseFilter, topicFilter })

    // Fetch filtered submissions with joined question data
    const submissions = await db.execute(sql`
      SELECT 
        s.*,
        COALESCE(aq.courseid, mq.courseid) as question_courseid,
        COALESCE(aq.topicid, mq.topicid) as question_topicid
      FROM submissions s
      LEFT JOIN ai_questions aq ON s.questionId = aq.id AND s.questionType = 'ai'
      LEFT JOIN manual_questions mq ON s.questionId = mq.id AND s.questionType = 'manual'
      WHERE s.userId = ${userId}
      ${sql.raw(dateFilter)}
      ${sql.raw(courseFilter)}
      ${sql.raw(topicFilter)}
      ORDER BY s.createdAt DESC
    `)
    
    console.log(`[DEBUG] Fetched ${submissions.length} filtered submissions`)

    // Calculate total points based on test cases passed
    let totalPoints = 0
    let courseTopicStats = {}
    
    submissions.forEach(submission => {
      const testCasesPassed = submission.totalTestCasesPassed || 0
      const totalTestCases = submission.totalTestCases || 0
      const courseid = submission.question_courseid
      const topicid = submission.question_topicid
      
      // Points calculation: 10 points per test case percentage
      const pointsPercentage = totalTestCases > 0 ? (testCasesPassed / totalTestCases) : 0
      const submissionPoints = Math.round(pointsPercentage * 100)
      
      console.log(`[DEBUG] Filtered submission ${submission.id}: ${testCasesPassed}/${totalTestCases} tests = ${submissionPoints} points`)
      
      totalPoints += submissionPoints
      
      // Track stats by course and topic
      const courseTopicKey = `${courseid}-${topicid}`
      if (!courseTopicStats[courseTopicKey]) {
        courseTopicStats[courseTopicKey] = {
          courseid,
          topicid,
          totalQuestions: 0,
          correctQuestions: 0,
          totalPoints: 0,
          testCasesPassed: 0,
          totalTestCases: 0
        }
      }
      
      courseTopicStats[courseTopicKey].totalQuestions++
      if (submission.passed) {
        courseTopicStats[courseTopicKey].correctQuestions++
      }
      courseTopicStats[courseTopicKey].totalPoints += submissionPoints
      courseTopicStats[courseTopicKey].testCasesPassed += testCasesPassed
      courseTopicStats[courseTopicKey].totalTestCases += totalTestCases
    })
    
    console.log(`[DEBUG] Filtered total points: ${totalPoints}`)

    // Calculate level based on points
    const levelData = calculateLevelFromPoints(totalPoints)
    console.log(`[DEBUG] Filtered level data:`, levelData)

    // Calculate statistics
    const questionsAnswered = submissions.length
    const correctAnswers = submissions.filter(s => s.passed).length
    const correctPercentage = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0
    
    console.log(`[DEBUG] Filtered questions: ${questionsAnswered}, Correct: ${correctAnswers} (${correctPercentage}%)`)

    // Calculate average session length
    const avgSessionLength = calculateAverageSessionLength(submissions)
    console.log(`[DEBUG] Filtered average session length: ${avgSessionLength}`)

    // Count unique sessions (approximated by days with submissions)
    const uniqueDays = new Set(submissions.map(s => new Date(s.createdAt).toDateString())).size
    console.log(`[DEBUG] Filtered unique days: ${uniqueDays}`)

    // Fetch analytics data for knowledge metrics
    const analyticsData = await db.select().from(Analytics).where(eq(Analytics.userId, userId)).limit(1)
    
    // Get knowledge data from analytics
    const startingKnowledge = analyticsData[0]?.startingKnowledge || 0
    const currentKnowledge = analyticsData[0]?.currentKnowledge || 0
    const knowledgeGain = currentKnowledge - startingKnowledge
    
    console.log(`[DEBUG] Filtered knowledge: Start=${startingKnowledge}%, Current=${currentKnowledge}%, Gain=${knowledgeGain}%`)

    // Generate weak and strong topics from course-topic stats
    const topicStats = await generateTopicStats(courseTopicStats)
    console.log(`[DEBUG] Filtered topic stats: Weak=${topicStats.weakTopics.length}, Strong=${topicStats.strongTopics.length}`)

    // Activity data based on filtered submissions
    const activityData = generateActivityDataFromSubmissions(submissions)
    console.log(`[DEBUG] Filtered activity data for ${activityData.length} days`)

    return {
      ...levelData,
      questionsAnswered,
      correctAnswers,
      correctPercentage,
      avgSessionLength,
      totalSessions: uniqueDays,
      activityData,
      startingKnowledge,
      currentKnowledge,
      knowledgeGain,
      weakTopics: topicStats.weakTopics,
      strongTopics: topicStats.strongTopics,
      totalPoints,
    }
  } catch (error) {
    console.error("[ERROR] Error fetching filtered reports data:", error)
    throw error
  }
}

// Helper function to calculate average session length
function calculateAverageSessionLength(submissions) {
  if (submissions.length === 0) return "0m 0s"

  // Calculate from actual timeTaken data
  const totalSeconds = submissions.reduce((total, sub) => {
    const timeTaken = sub.timeTaken || "0"
    const seconds = parseInt(timeTaken, 10) || 0
    return total + seconds
  }, 0)

  const avgSeconds = Math.floor(totalSeconds / submissions.length)
  const minutes = Math.floor(avgSeconds / 60)
  const seconds = avgSeconds % 60

  return `${minutes}m ${seconds}s`
}

// Helper function to generate activity data from submissions
function generateActivityDataFromSubmissions(submissions = []) {
  // Get the last 7 days
  const days = []
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push({
      date: date,
      day: dayLabels[date.getDay()],
      value: 0,
    })
  }

  // Count submissions for each day
  submissions.forEach((submission) => {
    const submissionDate = new Date(submission.createdAt)

    for (const day of days) {
      if (
        submissionDate.getDate() === day.date.getDate() &&
        submissionDate.getMonth() === day.date.getMonth() &&
        submissionDate.getFullYear() === day.date.getFullYear()
      ) {
        day.value++
        break
      }
    }
  })

  return days
}

// Helper function to generate topic stats from course-topic stats
async function generateTopicStats(courseTopicStats) {
  const topicStatsArray = []
  
  // Convert the object to an array and fetch topic/course names
  for (const key in courseTopicStats) {
    const stats = courseTopicStats[key]
    
    if (!stats.courseid || !stats.topicid) {
      console.log(`[DEBUG] Skipping invalid course-topic key: ${key}`)
      continue
    }
    
    try {
      // Fetch topic details
      const topicDetails = await db.select().from(Topics).where(eq(Topics.id, stats.topicid)).limit(1)
      
      // Fetch course details
      const courseDetails = await db.select().from(Courses).where(eq(Courses.id, stats.courseid)).limit(1)
      
      if (topicDetails.length > 0 && courseDetails.length > 0) {
        const correctPercentage = stats.totalTestCases > 0 
          ? Math.round((stats.testCasesPassed / stats.totalTestCases) * 100) 
          : 0
        
        topicStatsArray.push({
          id: stats.topicid,
          courseid: stats.courseid,
          name: topicDetails[0].name,
          courseName: courseDetails[0].name,
          correctPercentage,
          totalQuestions: stats.totalQuestions,
          correctQuestions: stats.correctQuestions,
          totalPoints: stats.totalPoints
        })
      }
    } catch (error) {
      console.error(`[ERROR] Error fetching details for topic ${stats.topicid} in course ${stats.courseid}:`, error)
    }
  }
  
  console.log(`[DEBUG] Generated ${topicStatsArray.length} topic stats entries`)
  
  // Sort by correctPercentage
  topicStatsArray.sort((a, b) => a.correctPercentage - b.correctPercentage)
  
  // Get weak topics (lowest 3 correctPercentage)
  const weakTopics = topicStatsArray.slice(0, 3)
  
  // Get strong topics (highest 3 correctPercentage)
  const strongTopics = [...topicStatsArray].sort((a, b) => b.correctPercentage - a.correctPercentage).slice(0, 3)
  
  return { weakTopics, strongTopics }
}

