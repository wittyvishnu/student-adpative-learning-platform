"use client";

import { useEffect, useState } from "react";
import {
  Check,
  MessageSquare,
  Trophy,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/utils/db";
import { eq, sql, and } from "drizzle-orm";
import { AIQuestions, ManualQuestions, Topics, Courses } from "@/utils/schema";

export default function LearningDashboard() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [topicInfo, setTopicInfo] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { course, topic } = params;

  useEffect(() => {
    if (course && topic) {
      fetchData();
    }
  }, [course, topic]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("🔍 Raw params:", course, topic);

      const decodedCourseName = course.replace(/-/g, " ").toLowerCase();
      const decodedTopicName = topic.replace(/-/g, " ").toLowerCase();

      console.log("✅ Decoded Course:", decodedCourseName);
      console.log("✅ Decoded Topic:", decodedTopicName);

      const courseData = await db
        .select()
        .from(Courses)
        .where(sql`LOWER(${Courses.name}) = ${decodedCourseName}`);

      if (!courseData.length) {
        console.warn("❌ Course not found");
        setLoading(false);
        return;
      }

      const courseId = courseData[0].id;

      const topicData = await db
        .select()
        .from(Topics)
        .where(
          and(
            sql`LOWER(${Topics.name}) = ${decodedTopicName}`,
            eq(Topics.courseid, courseId)
          )
        );

      if (!topicData.length) {
        console.warn("❌ Topic not found");
        setLoading(false);
        return;
      }

      const topicObj = topicData[0];
      const topicId = topicObj.id;
      const aiTopicId = topicObj.id_ai_questions_topicid;

      setTopicInfo({
        name: topicObj.name,
        course: courseData[0].name,
      });

      // Fetch manual questions
      const manualQuestions = await db
        .select()
        .from(ManualQuestions)
        .where(eq(ManualQuestions.topicid, topicId));

      const formattedManual = manualQuestions.map((q) => ({
        question: q.question,
        questionType: "manual",
        topic: topicObj.name,
        course: courseData[0].name,
        courseid: q.courseid,     // ✅ Add this
        topicid: q.topicid ,
        questionId: q.id,
      }));

      // Fetch AI questions
      const aiQuestions = await db
        .select()
        .from(AIQuestions)
        .where(eq(AIQuestions.topicid, aiTopicId));

      const formattedAI = aiQuestions.map((q) => ({
        
        question: q.question,
        questionType: "ai",
        topic: topicObj.name,
        course: courseData[0].name,
        courseid: q.courseid,     // ✅ Add this
        topicid: q.topicid ,
        questionId: q.id,
      }));

      const combined = [...formattedManual, ...formattedAI];

      console.log("📘 Manual Questions:", formattedManual);
      console.log("🤖 AI Questions:", formattedAI);
      console.log("✅ Combined Questions:", combined);

      setQuestions(combined);
    } catch (err) {
      console.error("⚠️ Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (item) => {
    const formattedTopic = item.topic.toLowerCase().replace(/\s+/g, "-");
    const formattedCourse = item.course.toLowerCase().replace(/\s+/g, "-");
    const formattedProblem = item.question.title.toLowerCase().replace(/\s+/g, "-");

    router.push(
      `/dashboard/courses/${formattedCourse}/${formattedTopic}/${formattedProblem}?courseid=${item.courseid}&topicid=${item.topicid}&type=${item.questionType}&questionId=${item.questionId}` // Pass questionId as a query parameter
    );
    
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-6">
        {topicInfo && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
            <Link href="/dashboard/courses">Courses</Link>
            <span>{">"}</span>
            <span>{topicInfo.course}</span>
            <span>{">"}</span>
            <span>{topicInfo.name}</span>
          </div>
        )}

        <div className="bg-lime-200 inline-block px-4 py-2 rounded-md mb-6">
          <h1 className="text-xl md:text-2xl font-medium">
            Your Adaptive Learning Dashboard
          </h1>
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
            <div className="text-center text-gray-500">No Questions Available</div>
          ) : (
            questions.map((item, index) => (
              <Card key={index} className="mb-4 border rounded-lg overflow-hidden shadow-lg">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 bg-white rounded-full p-1">
                        <Check className="h-5 w-5 text-lime-500" />
                      </div>
                      <div>
                        <h3 className="text-lg text-lime-500">{item.question.title}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          Difficulty: <strong>{item.question.level}</strong>
                        </div>
                        <div className="text-xs text-gray-400 italic mt-1">
                          Type: {item.questionType === "manual" ? "Manual" : "AI Generated"}
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
                        Solve Challenge
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
