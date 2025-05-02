import { Button } from "@/components/ui/button"
import { Linkedin } from "lucide-react"

const teamMembers = [
  {
    name: "John Smith",
    role: "CEO and Founder",
    experience: "10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Jane Doe",
    role: "Director of Operations",
    experience:
      "7+ years of experience in project management and team leadership. Strong organizational and communication skills",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Michael Brown",
    role: "Senior SEO Specialist",
    experience:
      "5+ years of experience in SEO and content marketing. Proficient in keyword research and on-page optimization",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Emily Johnson",
    role: "PPC Manager",
    experience:
      "3+ years of experience in paid search advertising. Skilled in campaign management and performance analysis",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Brian Williams",
    role: "Social Media Specialist",
    experience:
      "4+ years of experience in social media marketing. Proficient in creating and scheduling content, analyzing metrics, and building",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Sarah Kim",
    role: "Content Creator",
    experience:
      "2+ years of experience in writing and editing. Skilled in creating compelling, SEO-optimized content for various",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function TeamSection() {
  return (
    <section className="container px-4 md:px-6">
      <div className="space-y-8">
        <div className="inline-block bg-[#9efa35] px-4 py-1 text-lg font-medium">Team</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#9efa35]/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#9efa35]"></div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                    <Linkedin className="h-3 w-3" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">{member.experience}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Button variant="outline" className="border-black">
            See all team
          </Button>
        </div>
      </div>
    </section>
  )
}
