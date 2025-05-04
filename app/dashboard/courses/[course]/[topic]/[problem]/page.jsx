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
import { ManualQuestions } from "@/utils/schema"
import { and, eq } from "drizzle-orm"
import SubmissionsPage from "@/components/problem/submission"
import LeaderboardPage from "@/components/problem/LeaderboardPage"



export default function ProblemPage() { 
  const router = useRouter();
const { user, isLoaded } = useUser();

const {
  setCourseId,
  setTopicId,
  setUserId,
  setQuestionId,
  userId,
  setType,
  setFullName,
} = useAnswerStore();


const { topic: formattedTopic, problem: formattedProblem, course: formattedCourse } = useParams();
const decodedTopicName = formattedTopic.replace(/-/g, " ").toLowerCase();
const decodedProblemName = formattedProblem.replace(/-/g, " ").toLowerCase();
const decodedCourseName = formattedCourse.replace(/-/g, " ").toLowerCase();


const searchParams = useSearchParams();
const courseid = searchParams.get('courseid');
const topicid = searchParams.get('topicid');
const type = searchParams.get('type');
const questionid = searchParams.get('questionId');

const [solveQuestion, setSolveQuestion] = useState([]);

const tableName = type === "manual" ? "ManualQuestions" : "AIQuestions";
useEffect(() => {
  if (courseid) setCourseId(courseid);
  if (topicid) setTopicId(topicid);
  if (questionid) setQuestionId(questionid);
 if(type) setType(type);
}, [courseid, topicid, questionid,type]);

// ✅ First get userId after Clerk loads
useEffect(() => {
  if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
    
    setUserId(user.primaryEmailAddress.emailAddress);

    setFullName(user.fullName)
  }
}, [isLoaded, user]);

// ✅ Only fetch data after all params (including userId) are available
useEffect(() => {
  const fetchData = async () => {
    if (!courseid || !topicid || !questionid || (tableName === "AIQuestions" && !userId)) {
      console.log("Waiting for all required params to be available...");
      return;
    }

    try {
      let data;
      if (tableName === "ManualQuestions") {
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

      console.log("Data fetched:", data);
      setSolveQuestion(data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [courseid, topicid, questionid, userId, tableName]);

  
 
  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/courses">Courses</Link>

          <span>{">"}</span>
          <Link href={`/dashboard/courses/${formattedCourse}`}>{decodedCourseName}</Link>
          <span>{">"}</span>
          <Link href={`/dashboard/courses//${formattedCourse}/${formattedTopic}`}>{decodedTopicName}</Link>
          <span>{">"}</span>
          <span>{decodedProblemName}</span>
        </div>
        {solveQuestion?.question?.title ? (
          <h1 className="text-3xl font-bold">{solveQuestion.question.title}</h1>
        ) : (
          <h1 className="text-3xl font-bold">{decodedProblemName}</h1>
        )}

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
        <Tabs defaultValue="problem">
          <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger
              value="problem"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              Problem
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              Submissions
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="discussions"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              Discussions
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              Analysis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="problem" className="pt-4">
            <div className="grid  gap-8">
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
          <TabsContent value="discussions">
            <div className="py-8 text-center text-gray-500">Discussions will appear here</div>
          </TabsContent>
          <TabsContent value="analysis">
            <div className="py-8 text-center text-gray-500">Analysis will appear here</div>
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
