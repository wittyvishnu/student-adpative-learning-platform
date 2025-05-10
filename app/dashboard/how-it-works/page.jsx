import { Button } from "@/components/ui/button"
import { CheckCircle, Code, FileText, MessageSquare, Users } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="container px-4 py-6 md:py-10  bg-[#f9f9f9]">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our proven learning methodology helps you master technical skills and prepare for your career
          </p>
        </div>

        <div className="grid gap-8 mt-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 bg-[#9efa35]/10 rounded-xl p-6 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#9efa35] flex items-center justify-center">
                <FileText className="h-10 w-10 text-black" />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-2xl font-bold">1. Structured Curriculum</h2>
              <p className="text-muted-foreground">
                Our courses are designed by industry experts and follow a structured curriculum that builds your
                knowledge from fundamentals to advanced concepts.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>Comprehensive learning paths</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>Industry-relevant content</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>Regular updates to stay current</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
            <div className="w-full md:w-1/2 bg-[#9efa35]/10 rounded-xl p-6 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#9efa35] flex items-center justify-center">
                <Code className="h-10 w-10 text-black" />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-2xl font-bold">2. Hands-on Practice</h2>
              <p className="text-muted-foreground">
                Theory alone isn't enough. Our platform provides extensive hands-on coding exercises, projects, and
                challenges to reinforce your learning.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>Interactive coding environments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>Real-world projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>Automated code reviews</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 bg-[#9efa35]/10 rounded-xl p-6 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#9efa35] flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-black" />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-2xl font-bold">3. Mock Interviews</h2>
              <p className="text-muted-foreground">
                Practice makes perfect. Our mock interview sessions simulate real technical interviews to help you gain
                confidence and improve your performance.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>One-on-one sessions with experts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>Detailed feedback and improvement areas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>Company-specific interview preparation</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
            <div className="w-full md:w-1/2 bg-[#9efa35]/10 rounded-xl p-6 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#9efa35] flex items-center justify-center">
                <Users className="h-10 w-10 text-black" />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-2xl font-bold">4. Community Support</h2>
              <p className="text-muted-foreground">
                Join a thriving community of learners and professionals. Collaborate, ask questions, and share knowledge
                to accelerate your learning.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>Discussion forums for each topic</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>Study groups and pair programming</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35]" />
                  <span>Networking opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of successful students who have transformed their careers with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#9efa35] hover:bg-[#9efa35]/90 text-black">Explore Courses</Button>
            <Button variant="outline">View Success Stories</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
