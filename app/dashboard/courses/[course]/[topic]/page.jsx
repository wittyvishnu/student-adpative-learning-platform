"use client";
import { useEffect, useState } from "react";
import { Check, MessageSquare, Trophy, List, Sparkles, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/utils/db";
import { eq, sql, and } from "drizzle-orm";
import { AIQuestions, ManualQuestions, Topics, Courses, Submissions, Analytics } from "@/utils/schema";
import { useAnswerStore } from "@/store/useAnswerStore";
import { main } from "@/utils/gemini";
import { useUser } from "@clerk/nextjs";

export default function LearningDashboard() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [topicInfo, setTopicInfo] = useState(null);
  const [generatingQuestion, setGeneratingQuestion] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { course, topic } = params;
  const answerStore = useAnswerStore();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && user && course && topic) {
      answerStore.setUserId(user.primaryEmailAddress?.emailAddress || user.id);
      answerStore.setFullName(user.fullName || "Anonymous User");
      fetchData();
    }
  }, [isLoaded, user, course, topic]);

  const fetchData = async () => {
    const debug = {};
    
    try {
      setLoading(true);
      const decodedCourseName = course.replace(/-/g, " ").toLowerCase();
      
      const decodedTopicName = topic.replace(/-/g, " ").toLowerCase();
      
      
      
      // Get course data
      const courseData = await db
        .select()
        .from(Courses)
        .where(sql`LOWER(${Courses.name}) = LOWER(${decodedCourseName})`);
      
     
      console.log("Course data:", courseData);

      if (!courseData.length) {
        console.warn("❌ Course not found");
        setDebugInfo({ error: "Course not found", params: { decodedCourseName } });
        setLoading(false);
        return;
      }

      const courseId = courseData[0].id;
      debug.courseId = courseId;

      // Get topic data
      const topicData = await db
        .select()
        .from(Topics)
        .where(
          and(
            sql`LOWER(${Topics.name}) = LOWER(${decodedTopicName})`,
            eq(Topics.courseid, courseId)
          )
        );
      
      debug.topicData = topicData;
      console.log("Topic data:", topicData);

      if (!topicData.length) {
        console.warn("❌ Topic not found");
        setDebugInfo({ error: "Topic not found", params: { decodedTopicName, courseId } });
        setLoading(false);
        return;
      }

      const topicObj = topicData[0];
      const topicId = topicObj.id;
      debug.topicId = topicId;

      setTopicInfo({
        name: topicObj.name,
        course: courseData[0].name,
        courseId,
        topicId,
      });

      answerStore.setCourseId(courseId);
      answerStore.setTopicId(topicId);
      answerStore.setCourseName(courseData[0].name);
      answerStore.setTopicName(topicObj.name);

      // Fetch manual questions for this topic and course
      const manualQuestions = await db
        .select()
        .from(ManualQuestions)
        .where(
          and(
            eq(ManualQuestions.topicid, topicId),
            eq(ManualQuestions.courseid, courseId)
          )
        );
      
      debug.manualQuestions = manualQuestions;
      console.log("Manual questions for topic and course:", manualQuestions);

      // Fetch submissions for manual questions - NOTE: Submissions doesn't have topicid or courseid
      const manualSubmissions = await db
        .select()
        .from(Submissions)
        .where(
          and(
            eq(Submissions.questionType, "manual"),
            eq(Submissions.userId, user.primaryEmailAddress?.emailAddress || user.id),
            eq(Submissions.passed, true)
          )
        );
      
      debug.manualSubmissions = manualSubmissions;
      console.log("Manual submissions:", manualSubmissions);

      const formattedManual = manualQuestions.map((q) => {
        try {
          // Make sure the question data is properly structured
          const questionData = typeof q.question === 'string' ? JSON.parse(q.question) : q.question;
          
          const submission = manualSubmissions.find(s => s.questionId === q.id);
          return {
            question: questionData,
            questionType: "manual",
            topic: topicObj.name,
            course: courseData[0].name,
            courseid: courseId,
            topicid: topicId,
            questionId: q.id,
            passed: !!submission,
          };
        } catch (err) {
          console.error("Error formatting manual question:", err, q);
          return null;
        }
      }).filter(Boolean); // Remove any null entries
      
      debug.formattedManual = formattedManual;

      // Fetch AI questions for this user, topic, and course
      const aiQuestions = await db
        .select()
        .from(AIQuestions)
        .where(
          and(
            eq(AIQuestions.topicid, topicId),
            eq(AIQuestions.courseid, courseId),
            eq(AIQuestions.userId, user.primaryEmailAddress?.emailAddress || user.id)
          )
        );
      
      debug.aiQuestions = aiQuestions;
      console.log("AI questions for user, topic, and course:", aiQuestions);

      // Fetch submissions for AI questions - NOTE: Submissions doesn't have topicid or courseid
      const aiSubmissions = await db
        .select()
        .from(Submissions)
        .where(
          and(
            eq(Submissions.questionType, "ai"),
            eq(Submissions.userId, user.primaryEmailAddress?.emailAddress || user.id),
            eq(Submissions.passed, true)
          )
        );
      
      debug.aiSubmissions = aiSubmissions;
      console.log("AI submissions:", aiSubmissions);

      const formattedAI = aiQuestions.map((q) => {
        try {
          // Make sure the question data is properly structured
          const questionData = typeof q.question === 'string' ? JSON.parse(q.question) : q.question;
          
          const submission = aiSubmissions.find(s => s.questionId === q.id);
          return {
            question: questionData,
            questionType: "ai",
            topic: topicObj.name,
            course: courseData[0].name,
            courseid: courseId,
            topicid: topicId,
            questionId: q.id,
            passed: !!submission,
          };
        } catch (err) {
          console.error("Error formatting AI question:", err, q);
          return null;
        }
      }).filter(Boolean); // Remove any null entries
      
      debug.formattedAI = formattedAI;

      const combined = [...formattedManual, ...formattedAI];
      debug.combined = combined;
      console.log("Combined questions:", combined);
      
      setQuestions(combined);
      setDebugInfo(debug);
    } catch (err) {
      console.error("⚠️ Error fetching data:", err);
      setDebugInfo({ error: err.message, stack: err.stack, debug });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (item) => {
    const formattedTopic = item.topic.toLowerCase().replace(/\s+/g, "-");
    const formattedCourse = item.course.toLowerCase().replace(/\s+/g, "-");
    const formattedProblem = item.question.title.toLowerCase().replace(/\s+/g, "-");

    router.push(
      `/dashboard/courses/${formattedCourse}/${formattedTopic}/${formattedProblem}?courseid=${item.courseid}&topicid=${item.topicid}&type=${item.questionType}&questionId=${item.questionId}`
    );
  };

  const generateAIQuestion = async () => {
    if (!user || !topicInfo) return;
    
    try {
      setGeneratingQuestion(true);
      
      // Get user's weaknesses from analytics
      const analytics = await db
        .select()
        .from(Analytics)
        .where(
          and(
            eq(Analytics.userId, user.primaryEmailAddress?.emailAddress || user.id),
            eq(Analytics.courseId, topicInfo.courseId),
            eq(Analytics.topicId, topicInfo.topicId)
          )
        );

      let prompt = `
      Course: ${topicInfo.course}
      Topic: ${topicInfo.name}
      
      Generate a coding question that helps the user improve in their weak areas.
      the question should be  simple and mostly asked interview questions.give different questions for this prompt
      The question should follow this exact JSON format:
      {
        "title": "Question Title",
        "level": "easy/medium/hard",
        "description": "Detailed problem description",
        "constraints": ["constraint1", "constraint2"],
        "sampleOutputs": [
          {"input": "sample input", "output": "expected output"},
          {"input": "sample input", "output": "expected output"}
        ],
        "explanation": "Explanation of sample outputs",
        "hints": ["hint1", "hint2"],
        "testcasesForRun": [
          {"input": "test input", "expectedOutput": "expected output"}
        ],
        "testcasesForSubmit": [
          {"input": "hidden test input", "expectedOutput": "expected output"},
          {"input": "hidden test input", "expectedOutput": "expected output"}
        ]
      }
      
      User's weak topics:
      ${analytics.length > 0 ? JSON.stringify(analytics[0].weakTopics) : "No previous weaknesses found"}

       excludeweakness : memory management,  manual garbage collection, kernel internals, array size limitations and memory usage, paging and segmentation, thread-level concurrency,DMA, 

      Create a question that targets these weaknesses.
      `;

      const response = await main(prompt);
      
      let jsonText = response;
      const jsonBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonBlockMatch && jsonBlockMatch[1]) {
        jsonText = jsonBlockMatch[1].trim();
      }
      
      const questionData = JSON.parse(jsonText);

      // Insert into AIQuestions table with courseid
      const [newQuestion] = await db.insert(AIQuestions).values({
        userId: user.primaryEmailAddress?.emailAddress || user.id,
        createdBy: user.fullName || "Anonymous User",
        topicid: topicInfo.topicId,
        courseid: topicInfo.courseId, // Make sure to include courseid
        question: questionData,
        questionType: "ai",
      }).returning();

      // Add to local state with all required fields
      setQuestions(prev => [...prev, {
        question: questionData,
        questionType: "ai",
        topic: topicInfo.name,
        course: topicInfo.course,
        courseid: topicInfo.courseId,
        topicid: topicInfo.topicId,
        questionId: newQuestion.id,
        passed: false,
      }]);

    } catch (error) {
      console.error("[generateAIQuestion] Error:", error);
    } finally {
      setGeneratingQuestion(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-6">
        {topicInfo && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
            <Link href="/dashboard/courses">Courses</Link>
            <span>{">"}</span>
            <Link href={`/dashboard/courses/${course}`}>{topicInfo.course}</Link>
            <span>{">"}</span>
            <span>{topicInfo.name}</span>
          </div>
        )}

        <div className="bg-lime-200 inline-block px-4 py-2 rounded-md mb-6">
          <h1 className="text-xl md:text-2xl font-medium">
            Your Adaptive Learning Dashboard
          </h1>
        </div>

        <div className="mb-4 flex justify-end">
          <Button
            onClick={generateAIQuestion}
            disabled={generatingQuestion}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            {generatingQuestion ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate AI Question
              </>
            )}
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Solve Challenges</h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4 border rounded-lg shadow-lg">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </Card>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">No Questions Available</div>
              
              
            </div>
          ) : (
            questions.map((item, index) => (
              <Card key={index} className="mb-4 border rounded-lg overflow-hidden shadow-lg">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 bg-white rounded-full p-1">
                        {item.passed ? (
                          <Check className="h-5 w-5 text-lime-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-gray-300" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg text-lime-500">{item.question.title}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          Difficulty: <strong>{item.question.level}</strong>
                        </div>
                        <div className="text-xs text-gray-400 italic mt-1">
                          Type: {item.questionType === "manual" ? "Manual" : "AI Generated"}
                          {item.passed && (
                            <span className="ml-2 text-green-500">✓ Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <Trophy className="h-5 w-5 text-gray-400" />
                      <List className="h-5 w-5 text-gray-400" />
                      <Button
                        variant="default"
                        className="bg-lime-500 text-white hover:bg-lime-600"
                        onClick={() => handleClick(item)}
                      >
                        {item.passed ? "View Solution" : "Solve Challenge"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}