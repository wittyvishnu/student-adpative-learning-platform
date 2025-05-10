"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Hash, Info, ChevronDown } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useReportsStore } from "@/store/use-reports-store"
import { fetchReportsData } from "@/lib/reports-service"
import { getLevelName, getLevelColor } from "@/lib/level-utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsContent() {
  const { user, isLoaded } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState(null)
  const [error, setError] = useState(null)

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
    setTopics,
  } = useReportsStore()

  // Get user email when loaded
  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress
      setUserEmail(email)
    }
  }, [isLoaded, user])

  // Set initial course selection
  useEffect(() => {
    if (courses.length > 0 && !courseId) {
      setCourseId(courses[0].id.toString())
    }
  }, [courses, courseId, setCourseId])

  // Set initial topic selection
  useEffect(() => {
    if (topics.length > 0 && courseId && !topicId) {
      const courseTopics = topics.filter(t => t.courseid.toString() === courseId)
      if (courseTopics.length > 0) {
        setTopicId(courseTopics[0].id.toString())
      }
    }
  }, [topics, courseId, topicId, setTopicId])

  // Fetch data when user email is available
  useEffect(() => {
    async function loadData() {
      if (!userEmail) return
      
      setIsLoading(true)
      setError(null)
      try {
        const reportData = await fetchReportsData(userEmail)
        setData(reportData.data)
        setCourses(reportData.courses)
        setTopics(reportData.topics)
      } catch (error) {
        console.error("Error loading report data:", error)
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [userEmail, setData, setCourses, setTopics])

  // Handle filter changes
  const handleFilterChange = async (filterType, value) => {
    if (!userEmail) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      if (filterType === 'course') {
        setCourseId(value)
        setTopicId(null) // Reset topic when course changes
      } else if (filterType === 'topic') {
        setTopicId(value)
      }

      const reportData = await fetchReportsData(userEmail, {
        courseId: filterType === 'course' ? value : courseId,
        topicId: filterType === 'topic' ? value : topicId,
      })
      
      setData(reportData.data)
    } catch (error) {
      console.error("Error fetching filtered data:", error)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoaded || !userEmail) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Skeleton className="h-10 w-full md:w-48" />
            <Skeleton className="h-10 w-full md:w-48" />
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Performance Reports</h1>
            <p className="text-sm text-muted-foreground">Error loading data for {userEmail}</p>
          </div>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-lg">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>We couldn't load your report data. Please try again later.</p>
              <p className="text-sm text-muted-foreground">
                Error: {error.message}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Performance Reports</h1>
          <p className="text-sm text-muted-foreground">
            Analytics dashboard for {userEmail}
          </p>
        </div>

        {/* Filters */}
       <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
  {/* Course Selector */}
  <div className="relative w-full md:w-52">
    <Select 
      value={courseId || ""} 
      onValueChange={(value) => handleFilterChange('course', value)} 
      disabled={isLoading}
    >
      <SelectTrigger className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9efa35] focus:border-[#9efa35] transition duration-200">
        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        {isLoading ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <SelectValue placeholder={courses.length ? "Select course" : "No courses"} />
        )}
      </SelectTrigger>
      <SelectContent className="z-10 bg-white border border-gray-200 shadow-lg rounded-md">
        {courses.map((course) => (
          <SelectItem
            key={course.id}
            value={course.id.toString()}
            className="cursor-pointer px-4 py-2 hover:bg-[#f1ffe0] transition"
          >
            {course.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Topic Selector */}
  <div className="relative w-full md:w-52">
    <Select 
      value={topicId || ""} 
      onValueChange={(value) => handleFilterChange('topic', value)} 
      disabled={isLoading || !courseId}
    >
      <SelectTrigger className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9efa35] focus:border-[#9efa35] transition duration-200">
        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        {isLoading ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <SelectValue placeholder={courseId ? "Select topic" : "Select course first"} />
        )}
      </SelectTrigger>
      <SelectContent className="z-10 bg-white border border-gray-200 shadow-lg rounded-md">
        {topics
          .filter((topic) => topic.courseid.toString() === courseId)
          .map((topic) => (
            <SelectItem
              key={topic.id}
              value={topic.id.toString()}
              className="cursor-pointer px-4 py-2 hover:bg-[#f1ffe0] transition"
            >
              {topic.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  </div>
</div>

      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Current Level" 
              tooltip="Your current proficiency level based on performance"
              value={data.currentLevel || 0} 
              subValue={`${data.currentXP || 0} XP / ${data.nextLevelXP || 0} XP`}
              progress={(data.currentXP / data.nextLevelXP) * 100 || 0}
              badgeText={getLevelName(data.currentLevel)}
              badgeColor={getLevelColor(data.currentLevel)}
              icon={<div className={`w-3 h-3 rounded-full ${getLevelColor(data.currentLevel)}`} />}
            />

            <StatsCard 
              title="Questions Answered" 
              tooltip="Total questions attempted and success rate"
              value={data.questionsAnswered || 0} 
              subValue={`${data.correctAnswers || 0} correct (${data.correctPercentage || 0}%)`}
              icon={<div className="w-3 h-3 rounded-full bg-blue-500" />}
            />

            <StatsCard 
              title="Session Length" 
              tooltip="Average time spent per practice session"
              value={data.avgSessionLength || "0m 0s"} 
              subValue={`Across ${data.totalSessions || 0} sessions`}
              icon={<div className="w-3 h-3 rounded-full bg-purple-500" />}
            />

            <StatsCard 
              title="Total Points" 
              tooltip="Points earned from successful test cases"
              value={data.totalPoints || 0} 
              subValue="Earned from test cases"
              icon={<div className="w-3 h-3 rounded-full bg-green-500" />}
            />
          </div>

          {/* Knowledge Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard 
              title="Starting Knowledge" 
              value={`${data.startingKnowledge || 0}%`} 
              subValue="Initial assessment score"
              icon={<div className="w-3 h-3 rounded-full bg-gray-500" />}
            />

            <StatsCard 
              title="Current Knowledge" 
              value={`${data.currentKnowledge || 0}%`} 
              subValue="Current understanding"
              icon={<div className="w-3 h-3 rounded-full bg-blue-500" />}
            />

            <StatsCard 
              title="Knowledge Gain" 
              value={`${data.knowledgeGain > 0 ? "+" : ""}${data.knowledgeGain || 0}%`} 
              subValue="Progress since starting"
              valueColor={data.knowledgeGain > 0 ? "text-green-500" : data.knowledgeGain < 0 ? "text-red-500" : ""}
              icon={<div className="w-3 h-3 rounded-full bg-green-500" />}
            />
          </div>

          {/* Topics Analysis */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Topics Analysis</h2>
            <TopicsTabs weakTopics={data.weakTopics} strongTopics={data.strongTopics} />
          </div>
        </>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="h-[140px]">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="h-[140px]">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function StatsCard({ title, value, subValue, progress, badgeText, badgeColor, tooltip, valueColor = "", icon }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {title}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="text-muted-foreground">
                  <Info className="h-3.5 w-3.5" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px]">
                  <p className="text-sm">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
          {badgeText && (
            <Badge className={`${badgeColor} text-white text-xs h-5`}>
              {badgeText}
            </Badge>
          )}
        </div>
        {progress !== undefined ? (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{subValue.split(' / ')[0]}</span>
              <span>{subValue.split(' / ')[1]}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            {subValue}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function TopicsTabs({ weakTopics, strongTopics }) {
  return (
    <Tabs defaultValue="weakest">
      <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
        <TabsTrigger value="weakest" className="flex items-center gap-1">
          Weakest Topics
          {weakTopics?.length > 0 && (
            <Badge variant="destructive" className="h-5 px-1.5 py-0 text-xs">
              {weakTopics.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="strongest" className="flex items-center gap-1">
          Strongest Topics
          {strongTopics?.length > 0 && (
            <Badge variant="success" className="h-5 px-1.5 py-0 text-xs">
              {strongTopics.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="weakest">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Areas Needing Improvement</CardTitle>
            <p className="text-sm text-muted-foreground">
              Focus on these topics to boost your performance
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {weakTopics?.length > 0 ? (
              weakTopics.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{topic.name}</span>
                      {topic.courseName && (
                        <Badge variant="outline" className="text-xs">
                          {topic.courseName}
                        </Badge>
                      )}
                    </div>
                    <span className="text-muted-foreground">{topic.correctPercentage}%</span>
                  </div>
                  <Progress 
                    value={topic.correctPercentage} 
                    className="h-2 bg-gray-200"
                    indicatorClassName="bg-gradient-to-r from-red-500 to-orange-400"
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No weak topics identified</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="strongest">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Strongest Areas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Topics where you're performing exceptionally well
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {strongTopics?.length > 0 ? (
              strongTopics.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{topic.name}</span>
                      {topic.courseName && (
                        <Badge variant="outline" className="text-xs">
                          {topic.courseName}
                        </Badge>
                      )}
                    </div>
                    <span className="text-muted-foreground">{topic.correctPercentage}%</span>
                  </div>
                  <Progress 
                    value={topic.correctPercentage} 
                    className="h-2 bg-gray-200"
                    indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-400"
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No strong topics identified</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}