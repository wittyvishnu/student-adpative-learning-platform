"use client"

import { useEffect, useState } from "react"
import { useAnswerStore } from "@/store/useAnswerStore"
import { fetchAnalyticsByContext } from "@/utils/aigenerated"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle, TrendingUp, Lightbulb, Target } from "lucide-react"
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";



export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { coursename, topicname } = useAnswerStore()

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)
        const data = await fetchAnalyticsByContext()
        if (data && data.length > 0) {
          setAnalytics(data[0])
        } else {
          setError("No analytics data available yet. Submit your solution to generate insights.")
        }
      } catch (err) {
        console.error("Error fetching analytics:", err)
        setError("Failed to load analytics data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-4" />
        <p className="text-gray-500">Loading your analytics data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!analytics) {
    return (
      <Alert className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          Submit your solution to generate analytics and insights about your coding skills.
        </AlertDescription>
      </Alert>
    )
  }

  // Prepare data for radar chart
  const radarData = [
    ...analytics.strongTopics.map((topic) => ({
      subject: topic,
      value: 80 + Math.floor(Math.random() * 20),
      category: "strength",
    })),
    ...analytics.weakTopics.map((topic) => ({
      subject: topic,
      value: 30 + Math.floor(Math.random() * 30),
      category: "weakness",
    })),
  ]

  // Prepare data for progress chart
  const progressData = [
    { name: "Starting", knowledge: analytics.startingKnowledge },
    { name: "Current", knowledge: analytics.currentKnowledge },
  ]

  // Prepare data for suggestions chart
  const suggestionCategories = {
    "data structure": 0,
    algorithm: 0,
    syntax: 0,
    optimization: 0,
    readability: 0,
  }

  // Categorize suggestions
  analytics.suggestions.forEach((suggestion) => {
    const lowerSuggestion = suggestion.toLowerCase()
    if (
      lowerSuggestion.includes("data structure") ||
      lowerSuggestion.includes("array") ||
      lowerSuggestion.includes("map") ||
      lowerSuggestion.includes("hash")
    ) {
      suggestionCategories["data structure"]++
    } else if (lowerSuggestion.includes("algorithm") || lowerSuggestion.includes("approach")) {
      suggestionCategories["algorithm"]++
    } else if (lowerSuggestion.includes("syntax") || lowerSuggestion.includes("language")) {
      suggestionCategories["syntax"]++
    } else if (
      lowerSuggestion.includes("optimize") ||
      lowerSuggestion.includes("performance") ||
      lowerSuggestion.includes("efficient")
    ) {
      suggestionCategories["optimization"]++
    } else {
      suggestionCategories["readability"]++
    }
  })

  const suggestionData = Object.entries(suggestionCategories).map(([name, count]) => ({
    name,
    count: count > 0 ? count : Math.random() > 0.5 ? 1 : 0,
  }))

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Coding Analytics</h2>
        <p className="text-muted-foreground">
          Insights and analysis for your coding performance in {coursename} - {topicname}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-emerald-500" />
              Knowledge Progress
            </CardTitle>
            <CardDescription>Your knowledge growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorKnowledge" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="knowledge"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorKnowledge)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Current Knowledge</span>
                <span className="text-sm font-medium">{analytics.currentKnowledge}%</span>
              </div>
              <Progress value={analytics.currentKnowledge} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {analytics.currentKnowledge > analytics.startingKnowledge
                  ? `You've improved by ${analytics.currentKnowledge - analytics.startingKnowledge}% since you started!`
                  : "Keep practicing to improve your knowledge."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Target className="mr-2 h-5 w-5 text-blue-500" />
              Skills Radar
            </CardTitle>
            <CardDescription>Your strengths and areas for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#888", fontSize: 10 }} />
                  <Radar name="Strengths" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-lg font-medium flex items-center">
      <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
      Improvement Areas
    </CardTitle>
    <CardDescription>Suggested focus areas for improvement</CardDescription>
  </CardHeader>

  <CardContent>
    <div className="h-[200px] flex justify-start pl-2">
      <ResponsiveContainer width={180} height="100%">
        <BarChart
          data={suggestionData}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 12 }}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>A comprehensive overview of your coding performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Knowledge Level</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Progress value={analytics.currentKnowledge} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">{analytics.currentKnowledge}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getKnowledgeLevelDescription(analytics.currentKnowledge)}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Improvement</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Progress
                        value={Math.max(0, analytics.currentKnowledge - analytics.startingKnowledge)}
                        className="h-2 bg-gray-100"
                        max={100 - analytics.startingKnowledge}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      +{Math.max(0, analytics.currentKnowledge - analytics.startingKnowledge)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getImprovementDescription(analytics.currentKnowledge - analytics.startingKnowledge)}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-md font-medium mb-2">Analysis</h4>
                <p className="text-md leading-relaxed text-gray-700 whitespace-pre-line text-justify left"> {analytics.weakness}</p>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strengths" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Your Strengths
              </CardTitle>
              <CardDescription>Areas where you demonstrate proficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {analytics.strongTopics.map((topic, index) => (
                  <div key={index} className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">{topic}</h4>
                    <p className="text-sm text-green-700">{getStrengthDescription(topic)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weaknesses" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                Areas for Improvement
              </CardTitle>
              <CardDescription>Topics that need more practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {analytics.weakTopics.map((topic, index) => (
                  <div key={index} className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <h4 className="font-medium text-amber-800 mb-2">{topic}</h4>
                    <p className="text-sm text-amber-700">{getWeaknessDescription(topic)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-blue-500" />
                Improvement Suggestions
              </CardTitle>
              <CardDescription>Actionable recommendations to enhance your skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-blue-800">{suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function getKnowledgeLevelDescription(level) {
  if (level >= 90) return "Expert level understanding of the concepts."
  if (level >= 75) return "Advanced understanding with room for refinement."
  if (level >= 60) return "Solid grasp of core concepts with some gaps."
  if (level >= 40) return "Basic understanding with significant room for improvement."
  return "Beginner level - focus on building foundational knowledge."
}

function getImprovementDescription(improvement) {
  if (improvement >= 20) return "Exceptional progress! Keep up the great work."
  if (improvement >= 10) return "Significant improvement shown in your understanding."
  if (improvement >= 5) return "Steady progress - you're on the right track."
  if (improvement > 0) return "Some improvement shown - continue practicing."
  return "Keep practicing to see improvement in your skills."
}

function getStrengthDescription(topic) {
  const descriptions = {
    "Array traversal": [
      "You demonstrate good understanding of array iteration techniques.",
      "Your code shows efficient array traversal patterns.",
    ],
    "Frequency counting": [
      "You effectively implement frequency counting algorithms.",
      "Your approach to counting occurrences is well-structured.",
    ],
    "Applying constraints": [
      "You handle problem constraints effectively in your solutions.",
      "Your code properly accounts for the given constraints.",
    ],
    "Data structures": [
      "You show good knowledge of appropriate data structure selection.",
      "Your implementation of data structures is clean and effective.",
    ],
    "Algorithm design": [
      "Your algorithm design shows good problem-solving skills.",
      "You demonstrate solid understanding of algorithmic patterns.",
    ],
  }

  for (const key in descriptions) {
    if (topic.toLowerCase().includes(key.toLowerCase())) {
      const options = descriptions[key]
      return options[Math.floor(Math.random() * options.length)]
    }
  }

  return `You show good understanding and implementation of ${topic.toLowerCase()}.`
}

function getWeaknessDescription(topic) {
  const descriptions = {
    "Array size": [
      "Consider more dynamic approaches to array sizing.",
      "Practice using dynamic data structures instead of fixed-size arrays.",
    ],
    "String parsing": [
      "Focus on improving string manipulation techniques.",
      "Practice more efficient string parsing approaches.",
    ],
    "Data structure": [
      "Explore more appropriate data structures for different scenarios.",
      "Practice implementing various data structures to understand their trade-offs.",
    ],
    Algorithm: [
      "Work on understanding algorithm complexity and optimization.",
      "Practice implementing different algorithmic approaches to the same problem.",
    ],
    Optimization: [
      "Focus on improving the efficiency of your solutions.",
      "Practice optimizing your code for better time and space complexity.",
    ],
  }

  for (const key in descriptions) {
    if (topic.toLowerCase().includes(key.toLowerCase())) {
      const options = descriptions[key]
      return options[Math.floor(Math.random() * options.length)]
    }
  }

  return `Focus on improving your understanding and implementation of ${topic.toLowerCase()}.`
}