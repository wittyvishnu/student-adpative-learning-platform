import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import ActivityChart from "@/components/reports/activity-chart"
import LeaderboardTable from "@/components/reports/leaderboard-table"

export default function ReportsPage() {
  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h1 className="text-2xl font-bold">Reports</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select defaultValue="all-time">
                <SelectTrigger>
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">Timeframe: All-time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select defaultValue="dsa">
                <SelectTrigger>
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dsa">Course: DSA</SelectItem>
                  <SelectItem value="algorithms">Algorithms</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Topic: All</SelectItem>
                  <SelectItem value="arrays">Arrays</SelectItem>
                  <SelectItem value="linked-lists">Linked Lists</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">98</div>
              <p className="text-xs text-muted-foreground">1528/2150 XP</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">3,298</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Av. Session Length</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">2m 34s</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
              <div className="text-xs text-muted-foreground flex items-center">
                Month <ChevronDown className="h-3 w-3 ml-1" />
              </div>
            </CardHeader>
            <CardContent>
              <ActivityChart />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Starting Knowledge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">64%</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Knowledge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">86%</div>
              <div className="h-10 w-full">
                <svg className="w-full h-full" viewBox="0 0 100 30">
                  <path
                    d="M0,15 Q10,5 20,15 T40,15 T60,15 T80,15 T100,15"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Knowledge Gain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-500">+34%</div>
              <div className="h-10 w-full">
                <svg className="w-full h-full" viewBox="0 0 100 30">
                  <path d="M0,25 Q10,20 20,15 T40,10 T60,5 T80,5 T100,5" fill="none" stroke="#4f46e5" strokeWidth="2" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Weakest Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Arrays</span>
                  <span className="text-muted-foreground">74% Correct</span>
                </div>
                <Progress value={74} className="h-2 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-200 rounded-full"
                    style={{ width: "74%" }}
                  ></div>
                </Progress>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pointers</span>
                  <span className="text-muted-foreground">52% Correct</span>
                </div>
                <Progress value={52} className="h-2 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-200 rounded-full"
                    style={{ width: "52%" }}
                  ></div>
                </Progress>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Structures</span>
                  <span className="text-muted-foreground">36% Correct</span>
                </div>
                <Progress value={36} className="h-2 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-200 rounded-full"
                    style={{ width: "36%" }}
                  ></div>
                </Progress>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Strongest Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Loops</span>
                  <span className="text-muted-foreground">95% Correct</span>
                </div>
                <Progress value={95} className="h-2 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-200 rounded-full"
                    style={{ width: "95%" }}
                  ></div>
                </Progress>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Recursions</span>
                  <span className="text-muted-foreground">92% Correct</span>
                </div>
                <Progress value={92} className="h-2 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-200 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </Progress>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Functions</span>
                  <span className="text-muted-foreground">89% Correct</span>
                </div>
                <Progress value={89} className="h-2 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-200 rounded-full"
                    style={{ width: "89%" }}
                  ></div>
                </Progress>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">User Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable type="user" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Groups Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable type="group" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
