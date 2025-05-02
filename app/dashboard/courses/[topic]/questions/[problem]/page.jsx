"use client"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProblemDescription from "@/components/problem/problem-description"
import CodeEditor from "@/components/problem/code-editor"
import { useCourseStore } from "@/store/useCourse"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProblemPage({
  params
}) {
  const topic = params.topic.charAt(0).toUpperCase() + params.topic.slice(1).replace(/-/g, " ")
  const problem = params.problem
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
 const {solveQuestion,coursename} = useCourseStore();
 
  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/courses">Courses</Link>

          <span>{">"}</span>
          <Link href={`/courses/${coursename}`}>{coursename}</Link>
          <span>{">"}</span>
          <Link href={`/courses/${params.topic}`}>{topic}</Link>
          <span>{">"}</span>
          <span>{problem}</span>
        </div>

        <h1 className="text-3xl font-bold">{problem}</h1>
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
              <ProblemDescription question={solveQuestion.question}/>
              
            </div>
          </TabsContent>
          <TabsContent value="submissions">
            <div className="py-8 text-center text-gray-500">Your submissions will appear here</div>
          </TabsContent>
          <TabsContent value="leaderboard">
            <div className="py-8 text-center text-gray-500">Leaderboard will appear here</div>
          </TabsContent>
          <TabsContent value="discussions">
            <div className="py-8 text-center text-gray-500">Discussions will appear here</div>
          </TabsContent>
          <TabsContent value="analysis">
            <div className="py-8 text-center text-gray-500">Analysis will appear here</div>
          </TabsContent>
        </Tabs>
        </div>
        <div>
        <CodeEditor />
        </div>
        </div>

      </div>
    </div>
  )
}
