"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReportsStore } from "@/store/use-reports-store";
import { db } from "@/utils/db";
import { Courses, Topics, Analytics, Submissions } from "@/utils/schema";
import { eq, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import RefreshButton from "@/components/RefreshButton";

import { 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Lightbulb,
  BookOpen,
  BarChart3,
  Brain,
  Award
} from "lucide-react";

export default function ReportsContent() {
  const { 
    data, 
    setData, 
    courseId, 
    setCourseId, 
    topicId, 
    setTopicId, 
    courses, 
    setCourses, 
    topics, 
    setTopics 
  } = useReportsStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const [debugInfo, setDebugInfo] = useState({
    dataReceived: false,
    analyticsData: null,
    calculationAttempted: false,
    error: null,
  });

  useEffect(() => {
    if (user) {
      loadCourses();
      if (courseId) {
        loadTopics(courseId);
      }
      loadData();
    }
  }, [user, courseId, topicId]);

  const loadCourses = async () => {
    try {
      console.log("[DEBUG] Loading courses directly from schema");
      const coursesData = await db.select().from(Courses);
      console.log("[DEBUG] Courses loaded:", coursesData);
      setCourses(coursesData);
    } catch (error) {
      console.error("[ERROR] Error loading courses:", error);
      setError("Failed to load courses");
      setDebugInfo(prev => ({
        ...prev,
        error: error.message || "Unknown error loading courses",
      }));
    }
  };

  const loadTopics = async (selectedCourseId) => {
    if (!selectedCourseId) return;

    try {
      console.log("[DEBUG] Loading topics for course:", selectedCourseId);
      const topicsData = await db
        .select()
        .from(Topics)
        .where(eq(Topics.courseid, Number.parseInt(selectedCourseId)));

      console.log("[DEBUG] Topics loaded:", topicsData);
      setTopics(topicsData);
    } catch (error) {
      console.error("[ERROR] Error loading topics:", error);
      setError("Failed to load topics");
      setDebugInfo(prev => ({
        ...prev,
        error: error.message || "Unknown error loading topics",
      }));
    }
  };

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      console.log("[DEBUG] Fetching reports data with filters:", {
        courseId,
        topicId,
        userId: user.primaryEmailAddress?.emailAddress,
      });
      const userId = user.primaryEmailAddress?.emailAddress;

      let query = db.select().from(Analytics).where(eq(Analytics.userId, userId));

      if (courseId && courseId !== "all") {
        query = query.where(eq(Analytics.courseId, Number.parseInt(courseId)));
      }

      if (topicId && topicId !== "all") {
        query = query.where(eq(Analytics.topicId, Number.parseInt(topicId)));
      }

      const analyticsData = await query;
      console.log("[DEBUG] Analytics data:", analyticsData);

      const submissionsQuery = db
        .select({
          count: sql`count(*)`,
          correct: sql`sum(case when passed = true then 1 else 0 end)`,
        })
        .from(Submissions)
        .where(eq(Submissions.userId, userId));

      const submissionsData = await submissionsQuery;
      console.log("[DEBUG] Submissions data:", submissionsData);

      const latestAnalytics = analyticsData.length > 0 ? analyticsData[analyticsData.length - 1] : {};
      const totalSubmissions = submissionsData.length > 0 ? Number(submissionsData[0].count) || 0 : 0;
      const correctSubmissions = submissionsData.length > 0 ? Number(submissionsData[0].correct) || 0 : 0;

      setDebugInfo(prev => ({
        ...prev,
        dataReceived: true,
        analyticsData: latestAnalytics,
      }));

      const safeData = {
        ...data,
        questionsAnswered: totalSubmissions,
        correctAnswers: correctSubmissions,
        correctPercentage: totalSubmissions > 0 ? Math.round((correctSubmissions / totalSubmissions) * 100) : 0,
        startingKnowledge: latestAnalytics?.startingKnowledge || 0,
        currentKnowledge: latestAnalytics?.currentKnowledge || 0,
        knowledgeGain: (latestAnalytics?.currentKnowledge || 0) - (latestAnalytics?.startingKnowledge || 0),
        weakTopics: latestAnalytics?.weakTopics || [],
        strongTopics: latestAnalytics?.strongTopics || [],
        suggestions: latestAnalytics?.suggestions || [],
      };

      console.log("[DEBUG] Processed safe data:", safeData);
      setDebugInfo(prev => ({ ...prev, calculationAttempted: true }));

      setData(safeData);
      setLoading(false);
    } catch (error) {
      console.error("[ERROR] Error fetching reports data:", error);
      setError("Failed to load reports data: " + error.message);
      setDebugInfo(prev => ({
        ...prev,
        error: error.message || "Unknown error loading reports data",
      }));
      setLoading(false);
    }
  };

  const handleCourseChange = (value) => {
    console.log("[DEBUG] Course changed to:", value);
    setCourseId(value);
    setTopicId(null);
    loadTopics(value);
  };

  const handleTopicChange = (value) => {
    console.log("[DEBUG] Topic changed to:", value);
    setTopicId(value);
  };

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h1 className="text-2xl font-bold">Reports</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full max-w-md">
            <Select value={courseId || ""} onValueChange={handleCourseChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={topicId || ""} onValueChange={handleTopicChange} disabled={!courseId}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id.toString()}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <RefreshButton onClick={loadData} />
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Reports</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Card className="border-dashed border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-red-700">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="mt-2 p-4 bg-white/80 rounded-md overflow-auto text-xs border border-red-100">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Loading your learning analytics...</p>
      </div>
    );
  }

  const knowledgeGainColor = data.knowledgeGain > 0 
    ? "text-green-600" 
    : data.knowledgeGain < 0 
      ? "text-red-600" 
      : "text-gray-600";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Learning Analytics</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Select value={courseId || ""} onValueChange={handleCourseChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={topicId || ""} onValueChange={handleTopicChange} disabled={!courseId}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id.toString()}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <RefreshButton onClick={loadData} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden border-b-4 border-b-blue-500">
          <CardHeader className="pb-2 bg-blue-50/50 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                Questions Answered
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {data.correctPercentage || 0}% correct
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{data.questionsAnswered || 0}</div>
              <p className="text-xs text-muted-foreground">
                {data.correctAnswers || 0}/{data.questionsAnswered || 0} correct
              </p>
            </div>
            <Progress 
              value={data.correctPercentage || 0} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-b-4 border-b-purple-500">
          <CardHeader className="pb-2 bg-purple-50/50 dark:bg-purple-950/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                Current Level
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{data.currentLevel || 1}</div>
              <p className="text-xs text-muted-foreground">
                {data.currentXP || 0}/{data.nextLevelXP || 100} XP
              </p>
            </div>
            <Progress 
              value={(data.currentXP / data.nextLevelXP) * 100 || 0} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-b-4 border-b-green-500">
          <CardHeader className="pb-2 bg-green-50/50 dark:bg-green-950/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-green-500" />
                Knowledge Growth
              </CardTitle>
              <Badge 
                variant={data.knowledgeGain > 0 ? "default" : "secondary"} 
                className={data.knowledgeGain > 0 ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""}
              >
                {data.knowledgeGain >= 0 ? "+" : ""}{data.knowledgeGain || 0}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-end">
              <div className={`text-2xl font-bold ${knowledgeGainColor}`}>
                {data.currentKnowledge || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Started at {data.startingKnowledge || 0}%
              </p>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className="h-2 rounded-full bg-green-500" 
                      style={{ width: `${data.currentKnowledge || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-b-4 border-b-amber-500">
          <CardHeader className="pb-2 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                Total Points
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{data.totalPoints || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {data.totalSessions || 0} sessions
            </p>
            <p className="text-xs text-muted-foreground">
              Average session: {data.avgSessionLength || "0m 0s"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Strengths and Weaknesses Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <Card className="border border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-green-50/50 dark:bg-green-950/20 border-b border-green-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">Your Strengths</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {data.strongTopics?.length > 0 ? (
              <ul className="space-y-4">
                {data.strongTopics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">{topic}</p>
                      <p className="text-sm text-green-700/70 dark:text-green-400/70 mt-1">
                        You've demonstrated mastery in this area
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 px-4 rounded-lg bg-green-50/30 dark:bg-green-950/10 border border-dashed border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-12 h-12 text-green-300 dark:text-green-700 mx-auto mb-3" />
                <p className="text-green-800 dark:text-green-300 font-medium">No strengths identified yet</p>
                <p className="text-sm text-green-700/70 dark:text-green-400/70 mt-2 max-w-xs mx-auto">
                  Complete more exercises to identify your strong areas
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weaknesses Card */}
        <Card className="border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-lg">Areas for Improvement</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {data.weakTopics?.length > 0 ? (
              <>
                <ul className="space-y-4">
                  {data.weakTopics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900">
                      <div className="flex-shrink-0 mt-0.5">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium text-amber-800 dark:text-amber-300">{topic}</p>
                        <p className="text-sm text-amber-700/70 dark:text-amber-400/70 mt-1">
                          Focus on practicing these concepts
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {data.suggestions?.length > 0 && (
                  <div className="mt-6 p-4 rounded-lg bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900">
                        <Lightbulb className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-medium text-blue-800 dark:text-blue-300">Personalized Suggestions</h3>
                    </div>
                    <ul className="space-y-3 pl-2">
                      {data.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-blue-800 dark:text-blue-200">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                          <p className="text-sm">{suggestion}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 px-4 rounded-lg bg-amber-50/30 dark:bg-amber-950/10 border border-dashed border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-12 h-12 text-amber-300 dark:text-amber-700 mx-auto mb-3" />
                <p className="text-amber-800 dark:text-amber-300 font-medium">No improvement areas identified yet</p>
                <p className="text-sm text-amber-700/70 dark:text-amber-400/70 mt-2 max-w-xs mx-auto">
                  Complete more exercises to get personalized recommendations
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Debug Information - Can be removed in production */}
      {/* <Card className="border-dashed border-gray-300 opacity-60 hover:opacity-100 transition-opacity">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500">Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4 text-sm text-gray-500">
            <div>
              <h3 className="font-semibold mb-1 text-xs">Data Flow:</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${debugInfo.dataReceived ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span>Data received</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${debugInfo.calculationAttempted ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span>Calculation attempted</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <h3 className="font-semibold mb-2 text-xs">Current Store Data:</h3>
              <pre className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md overflow-auto text-xs">
                {JSON.stringify(
                  {
                    courseId,
                    topicId,
                    data: {
                      startingKnowledge: data.startingKnowledge,
                      currentKnowledge: data.currentKnowledge,
                      knowledgeGain: data.knowledgeGain,
                      questionsAnswered: data.questionsAnswered,
                      correctAnswers: data.correctAnswers,
                      correctPercentage: data.correctPercentage,
                      strongTopics: data.strongTopics,
                      weakTopics: data.weakTopics,
                      suggestions: data.suggestions,
                    },
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
