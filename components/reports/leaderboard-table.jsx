import { ArrowDown, ArrowUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

type LeaderboardType = "user" | "group"

const userLeaderboard = [
  { name: "Jesse Thomas", points: 637, correct: "96%", rank: 1, change: "up" },
  { name: "Theal Mathiyazhagan", points: 637, correct: "88%", rank: 2, change: "down" },
  { name: "Helen Chuang", points: 637, correct: "84%", rank: 3, change: "up" },
  { name: "Lura Silverman", points: 637, correct: "82%", rank: 4, change: "up" },
  { name: "Winifred Groton", points: 637, correct: "80%", rank: 5, change: "down" },
  { name: "Ken Alba", points: 637, correct: "78%", rank: 6, change: "up" },
  { name: "Alice Lebeau", points: 637, correct: "76%", rank: 7, change: "down" },
  { name: "Adrian Lu", points: 637, correct: "74%", rank: 8, change: "up" },
  { name: "Evelyn Hamilton", points: 637, correct: "72%", rank: 9, change: "down" },
  { name: "Ross Fiddlebrook", points: 637, correct: "70%", rank: 10, change: "up" },
]

const groupLeaderboard = [
  { name: "Houston Facility", points: 52, correct: "97%", rank: 1, change: "up" },
  { name: "Test Group", points: 52, correct: "95%", rank: 2, change: "down" },
  { name: "Sales Leadership", points: 52, correct: "93%", rank: 3, change: "up" },
  { name: "Northeast Region", points: 52, correct: "91%", rank: 4, change: "up" },
  { name: "Southeast Region", points: 52, correct: "89%", rank: 5, change: "down" },
  { name: "District Managers", points: 52, correct: "87%", rank: 6, change: "up" },
  { name: "Senior Managers", points: 52, correct: "85%", rank: 7, change: "down" },
  { name: "New Hires", points: 52, correct: "83%", rank: 8, change: "up" },
  { name: "Southwest Region", points: 52, correct: "81%", rank: 9, change: "down" },
  { name: "Northwest Region", points: 52, correct: "79%", rank: 10, change: "up" },
]

export default function LeaderboardTable({ type }: { type: LeaderboardType }) {
  const data = type === "user" ? userLeaderboard : groupLeaderboard

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 text-sm text-right">{item.rank}</div>
              {item.change === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              {type === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={item.name} />
                  <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div className="text-sm font-medium">{item.name}</div>
            </div>
            <div className="text-sm text-gray-500">
              {item.points} Points • {item.correct} Correct
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2">
        <Link href="#" className="text-sm text-blue-500 hover:underline">
          View full leaderboard
        </Link>
      </div>
    </div>
  )
}
