"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  MessageSquare,
  Trophy,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourseStore } from "@/store/useCourse";
import { AIQuestions, ManualQuestions } from "@/utils/schema";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LearningDashboard() {
  const [loadingManual, setLoadingManual] = useState(true);
  const [loadingAI, setLoadingAI] = useState(true);

  const {
    courseid,
    topicid,
    coursename,
    topicname,
    manualQuestions,
    aiQuestions,
    setCourse,
    setTopic,
    setManualQuestions,
    setAIQuestions,
    setSolveQuestion, // Get from Zustand store
  } = useCourseStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("course-storage"));
    const saved = localData?.state;

    if (saved) {
      if (!courseid && saved.courseid) {
        setCourse(saved.courseid, saved.coursename);
      }
      if (!topicid && saved.topicid) {
        setTopic(saved.topicid, saved.topicname);
      }
      if (manualQuestions.length === 0 && saved.manualQuestions) {
        setManualQuestions(saved.manualQuestions);
      }
      if (aiQuestions.length === 0 && saved.aiQuestions) {
        setAIQuestions(saved.aiQuestions);
      }
    }

    setTimeout(() => setIsHydrated(true), 700);
  }, []);

  const fetchManualQuestions = async () => {
    setLoadingManual(true);
    try {
      const response = await db
        .select()
        .from(ManualQuestions)
        .where(eq(ManualQuestions.topicid, Number(topicid)));

      setManualQuestions(response);
    } catch (error) {
      console.error("Error fetching manual questions:", error);
    } finally {
      setLoadingManual(false);
    }
  };

  const fetchAIQuestions = async () => {
    setLoadingAI(true);
    try {
      const response = await db
        .select()
        .from(AIQuestions)
        .where(eq(AIQuestions.topicid, Number(topicid)));

      setAIQuestions(response);
    } catch (error) {
      console.error("Error fetching AI questions:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    if (topicid) {
      fetchManualQuestions();
      fetchAIQuestions();
    }
  }, [topicid]);
  const handleClick = (item) => {
    setSolveQuestion(item);
  
    const formattedTopic = topicname.toLowerCase().replace(/\s+/g, "-");
    const formattedProblem = item.question.title.toLowerCase().replace(/\s+/g, "-");
  
    router.push(`/dashboard/courses/${formattedTopic}/questions/${formattedProblem}`);
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link href="/dashboard/courses">Courses</Link>
          <span>{">"}</span>
          <span>{coursename}</span>
          <span>{">"}</span>
          <span>{topicname}</span>
        </div>

        {/* Title */}
        <div className="bg-lime-200 inline-block px-4 py-2 rounded-md mb-6">
          <h1 className="text-xl md:text-2xl font-medium">
            Your Adaptive Learning Dashboard
          </h1>
        </div>

        {/* Generate Question Card */}
        <Card className="mb-8 border-2 rounded-full md:max-w-md">
          <CardContent className="p-0">
            <button className="w-full flex items-center gap-4 p-4">
              <div className="flex-1 text-left ml-6">
                <h2 className="text-lg font-semibold">Generate</h2>
                <p className="text-lg font-semibold">New Question</p>
              </div>
              <div className="w-24 h-24 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-12 h-12 border-2 rounded-full flex items-center justify-center">
                      <span className="text-xl">+</span>
                    </div>
                    <div className="absolute -top-4 -right-4 text-2xl">+</div>
                    <div className="absolute -bottom-4 -left-4 text-2xl">+</div>
                    <div className="absolute -top-4 -left-8 text-2xl">*</div>
                    <div className="absolute -bottom-4 -right-8 text-2xl">*</div>
                  </div>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Previous Questions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Solve Challenges</h2>

          {/* Skeleton while loading */}
          {(loadingManual || loadingAI) && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4 border rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 w-full">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <Skeleton className="h-10 w-32 rounded-md" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Render Questions */}
          {!loadingManual && !loadingAI && (
            <>
              {manualQuestions.length === 0 && aiQuestions.length === 0 ? (
                <div>No Questions Available</div>
              ) : (
                <>
                  {[...manualQuestions, ...aiQuestions].map((item, index) => (
                    <Card key={index} className="mb-4 border rounded-lg overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-2">
                            <div className="mt-1 bg-white rounded-full p-1">
                              <Check className="h-5 w-5 text-lime-500" />
                            </div>
                            <div>
                              <h3 className="text-lg text-lime-500">
                                {item.question.title}
                              </h3>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="mr-4">
                                  Difficulty: <strong>{item.question.level}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 ml-auto">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-5 w-5 text-gray-400" />
                              <Trophy className="h-5 w-5 text-gray-400" />
                              <List className="h-5 w-5 text-gray-400" />
                            </div>
                            <Button
                            variant="default"
                            className="bg-lime-500 text-white hover:bg-lime-600"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleClick(item);
                            }}
                          >
                            Solve Challenge
                          </Button>

                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
