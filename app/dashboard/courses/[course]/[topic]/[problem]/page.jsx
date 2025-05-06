"use client"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProblemDescription from "@/components/problem/problem-description"
import CodeEditor from "@/components/problem/code-editor"
import { useAnswerStore } from "@/store/useAnswerStore"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useUser } from '@clerk/nextjs';
import { db } from "@/utils/db"
import { ManualQuestions, AIQuestions } from "@/utils/schema"
import { and, eq } from "drizzle-orm"
import SubmissionsPage from "@/components/problem/submission"
import LeaderboardPage from "@/components/problem/LeaderboardPage"
import {fetchAnalyticsByContext} from "@/utils/aigenerated"
import AnalyticsPage from "@/components/problem/AnalyticsPage"
import { Loader2 } from "lucide-react"

export default function ProblemPage() { 
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { triggertab } = useAnswerStore();
  const [tab, setTab] = useState("problem");
  const [loading, setLoading] = useState(true);
  const [solveQuestion, setSolveQuestion] = useState(null);

  // Get all params and search params
  const { topic: formattedTopic, problem: formattedProblem, course: formattedCourse } = useParams();
  const searchParams = useSearchParams();
  const courseid = searchParams.get('courseid');
  const topicid = searchParams.get('topicid');
  const type = searchParams.get('type');
  const questionid = searchParams.get('questionId');

  // Decode names
  const decodedTopicName = formattedTopic?.replace(/-/g, " ").toLowerCase();
  const decodedProblemName = formattedProblem?.replace(/-/g, " ").toLowerCase();
  const decodedCourseName = formattedCourse?.replace(/-/g, " ").toLowerCase();

  // Zustand store actions
  const {
    setCourseId,
    setTopicId,
    setUserId,
    setQuestionId,
    userId,
    setType,
    setFullName,
    setQuestion,
    setCourseName,
    setTopicName,
    triggerTab
  } = useAnswerStore();

  // Set course and topic names
  useEffect(() => {
    if (decodedCourseName && decodedTopicName) {
      setCourseName(decodedCourseName);
      setTopicName(decodedTopicName);
    }
  }, [decodedCourseName, decodedTopicName]);

  // Set IDs when params are available
  useEffect(() => {
    if (courseid) setCourseId(courseid);
    if (topicid) setTopicId(topicid);
    if (questionid) setQuestionId(questionid);
    if (type) setType(type);
  }, [courseid, topicid, questionid, type]);

  // Set user info when Clerk is loaded
  useEffect(() => {
    if (isLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress || user.id;
      setUserId(email);
      setFullName(user.fullName || "Anonymous User");
    }
  }, [isLoaded, user]);

  // Handle tab switching from Zustand
  useEffect(() => {
    if (triggerTab && triggerTab === 'analysis') {
      setTab('analysis');
    }
  }, [triggerTab]);

  // Main data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      // Wait for all required data to be available
      if (!isLoaded || !user || !courseid || !topicid || !questionid || !type) {
        return;
      }

      try {
        setLoading(true);
        const userId = user.primaryEmailAddress?.emailAddress || user.id;
        
        let data;
        if (type === "manual") {
          data = await db
            .select()
            .from(ManualQuestions)
            .where(
              and(
                eq(ManualQuestions.courseid, courseid),
                eq(ManualQuestions.topicid, topicid),
                eq(ManualQuestions.id, questionid)
              )
            );
        } else {
          data = await db
            .select()
            .from(AIQuestions)
            .where(
              and(
                eq(AIQuestions.courseid, courseid),
                eq(AIQuestions.topicid, topicid),
                eq(AIQuestions.id, questionid),
                eq(AIQuestions.userId, userId)
              )
            );
        }

        if (data.length > 0) {
          setSolveQuestion(data[0]);
          setQuestion(data[0].question);
          await fetchAnalyticsByContext();
        } else {
          console.warn("No question found with the given parameters");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, user, courseid, topicid, questionid, type]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/courses">Courses</Link>
          <span>{">"}</span>
          <Link href={`/dashboard/courses/${formattedCourse}`}>{decodedCourseName}</Link>
          <span>{">"}</span>
          <Link href={`/dashboard/courses/${formattedCourse}/${formattedTopic}`}>{decodedTopicName}</Link>
          <span>{">"}</span>
          <span>{decodedProblemName}</span>
        </div>

        {solveQuestion?.question?.title ? (
          <h1 className="text-3xl font-bold">{solveQuestion.question.title}</h1>
        ) : (
          <h1 className="text-3xl font-bold">{decodedProblemName}</h1>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div>
            <Tabs value={tab} onValueChange={(value) => setTab(value)} className="w-full">
              <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger value="problem" className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-black data-[state=active]:bg-transparent">
                  Problem
                </TabsTrigger>
                <TabsTrigger value="submissions" className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-black data-[state=active]:bg-transparent">
                  Submissions
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-black data-[state=active]:bg-transparent">
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger value="analysis" className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-black data-[state=active]:bg-transparent">
                  Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="problem" className="pt-4">
                <div className="grid gap-8">
                  {solveQuestion?.question ? (
                    <ProblemDescription question={solveQuestion.question} />
                  ) : (
                    <ProblemDescription question={null} />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="submissions">
                <div className="py-8 text-center text-gray-500">
                  <SubmissionsPage />
                </div>
              </TabsContent>

              <TabsContent value="leaderboard">
                <div className="py-8 text-center text-gray-500">
                  <LeaderboardPage />
                </div>
              </TabsContent>

              <TabsContent value="analysis">
                <div className="py-8 text-center text-gray-500">
                  <AnalyticsPage/>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div id="code-editor">
            <CodeEditor solveQuestion={solveQuestion} />
          </div>
        </div>
      </div>
    </div>
  )
}