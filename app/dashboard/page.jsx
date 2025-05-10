"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Award, MessageSquare, FileText, Linkedin } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation";

export default function DashBoardPage() {
   const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
      {/* Hero Section */}
    <section className="flex justify-center items-center min-h-[80vh] px-4 md:px-6 py-16">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl w-full">
    {/* Left: Text */}
    <div className="space-y-6 text-center lg:text-left">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl leading-tight">
        Together for <br />
        <span className="text-[#9efa35]">Success</span>
      </h1>
      <p className="text-gray-600 md:text-lg max-w-xl mx-auto lg:mx-0">
        At Positivus, we help businesses grow by combining creativity, innovation, and data-driven strategies. Together, we build a future of shared success.
      </p>
      <div className="flex gap-4 justify-center lg:justify-start">
      <Button onClick={() => router.push("/dashboard/course")} className="bg-[#9efa35] text-black px-6 py-2 rounded-md font-semibold hover:bg-white border-2 border-[#9efa35] transition-colors duration-300 ease-in-out transform hover:scale-105">
        Take the Mock interview
      </Button>

      <Button onClick={() => router.push("/dashboard/courses")} variant="outline" className="border-2 border-[#9efa35] text-black px-6 py-2 rounded-md font-semibold hover:bg-[#8ce92a] hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-105">
        Enhance your skills
      </Button>


      </div>
    </div>

    {/* Right: Design */}
    <div className="relative w-full max-w-[400px] aspect-square mx-auto">
      {/* Glow */}
      <div className="absolute w-40 h-40 bg-[#9efa35] top-0 left-0 rounded-full blur-3xl opacity-30" />
      {/* Black Square */}
      <div className="absolute w-36 h-36 bg-black rounded-xl top-12 right-6 rotate-12 shadow-lg" />
      {/* White Square */}
      <div className="absolute w-36 h-36 bg-white border border-black rounded-xl bottom-12 left-6 -rotate-12 shadow-md" />
      {/* Center Circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-20 h-20 bg-white border border-black rounded-full flex items-center justify-center shadow-md text-2xl">
          🏆
        </div>
      </div>
      {/* Sparkles */}
      <div className="absolute top-4 right-4 text-xl animate-bounce">✨</div>
      <div className="absolute bottom-4 left-4 text-xl animate-bounce">✨</div>
    </div>
  </div>
</section>



      {/* Courses Section */}
      <section id="courses" className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-block bg-[#9efa35] px-4 py-1 text-lg font-medium mb-4">Courses</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Explore Our Courses</h2>
            <p className="text-gray-500 max-w-[800px]">
              Our comprehensive curriculum covers everything you need to succeed in your technical career. From
              programming fundamentals to advanced algorithms, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Card 1 */}
            <Card className="overflow-hidden border-2 hover:border-[#9efa35] transition-all">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-[#9efa35]" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl mb-1">Data Structures</h3>
                    <p className="text-sm text-gray-500">Master the fundamentals of data organization</p>
                  </div>
                  <Badge className="bg-[#9efa35] text-black">Coming Soon</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    12 hours
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    8 modules
                  </span>
                </div>
                <Button className="w-full bg-black text-white hover:bg-gray-800">Join Waitlist</Button>
              </CardContent>
            </Card>

            {/* Course Card 2 */}
            <Card className="overflow-hidden border-2 hover:border-[#9efa35] transition-all">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-[#9efa35]" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl mb-1">Algorithms</h3>
                    <p className="text-sm text-gray-500">Learn problem-solving techniques</p>
                  </div>
                  <Badge className="bg-[#9efa35] text-black">Coming Soon</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    16 hours
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    10 modules
                  </span>
                </div>
                <Button className="w-full bg-black text-white hover:bg-gray-800">Join Waitlist</Button>
              </CardContent>
            </Card>

            {/* Course Card 3 */}
            <Card className="overflow-hidden border-2 hover:border-[#9efa35] transition-all">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-[#9efa35]" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl mb-1">System Design</h3>
                    <p className="text-sm text-gray-500">Design scalable and robust systems</p>
                  </div>
                  <Badge className="bg-[#9efa35] text-black">Coming Soon</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    20 hours
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    12 modules
                  </span>
                </div>
                <Button className="w-full bg-black text-white hover:bg-gray-800">Join Waitlist</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

  

      
     
      {/* Mock Interviews Section */}
      <section id="mock-interviews" className="py-16 bg-#f9f9f9">
        <div className="container px-4 md:px-6 ">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-block bg-[#9efa35] px-4 py-1 text-lg font-medium mb-4">Mock Interviews</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Practice Makes Perfect</h2>
            <p className="text-gray-500 max-w-[800px]">
              Prepare for technical interviews with our expert-led mock sessions. Get real-time feedback and improve
              your interview skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-[#9efa35] transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#9efa35]/20 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-[#9efa35]" />
                </div>
                <h3 className="font-bold text-xl mb-2">Technical Interviews</h3>
                <p className="text-gray-500 mb-4">
                  Practice coding problems and system design questions with experienced interviewers.
                </p>
                <Badge className="bg-[#9efa35] text-black mb-4">Coming Soon</Badge>
                <Button variant="outline" className="w-full">
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#9efa35] transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#9efa35]/20 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-[#9efa35]" />
                </div>
                <h3 className="font-bold text-xl mb-2">Behavioral Interviews</h3>
                <p className="text-gray-500 mb-4">
                  Master the art of answering behavioral questions with structured frameworks.
                </p>
                <Badge className="bg-[#9efa35] text-black mb-4">Coming Soon</Badge>
                <Button variant="outline" className="w-full">
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#9efa35] transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#9efa35]/20 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-[#9efa35]" />
                </div>
                <h3 className="font-bold text-xl mb-2">Mock Assessments</h3>
                <p className="text-gray-500 mb-4">Simulate real-world technical assessments and coding challenges.</p>
                <Badge className="bg-[#9efa35] text-black mb-4">Coming Soon</Badge>
                <Button variant="outline" className="w-full">
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-block bg-[#9efa35] px-4 py-1 text-lg font-medium mb-4">Certifications</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Validate Your Skills</h2>
            <p className="text-gray-500 max-w-[800px]">
              Earn industry-recognized certifications to showcase your expertise and stand out to employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-[#9efa35] transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#9efa35]/20 flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-[#9efa35]" />
                </div>
                <h3 className="font-bold text-xl mb-2">Data Structures & Algorithms</h3>
                <p className="text-gray-500 mb-4">
                  Demonstrate your proficiency in solving complex algorithmic problems.
                </p>
                <Badge className="bg-[#9efa35] text-black mb-4">Coming Soon</Badge>
                <Button variant="outline" className="w-full">
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#9efa35] transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#9efa35]/20 flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-[#9efa35]" />
                </div>
                <h3 className="font-bold text-xl mb-2">System Design</h3>
                <p className="text-gray-500 mb-4">Prove your ability to design scalable and robust software systems.</p>
                <Badge className="bg-[#9efa35] text-black mb-4">Coming Soon</Badge>
                <Button variant="outline" className="w-full">
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#9efa35] transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#9efa35]/20 flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-[#9efa35]" />
                </div>
                <h3 className="font-bold text-xl mb-2">Full-Stack Development</h3>
                <p className="text-gray-500 mb-4">Showcase your end-to-end development skills across the stack.</p>
                <Badge className="bg-[#9efa35] text-black mb-4">Coming Soon</Badge>
                <Button variant="outline" className="w-full">
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mock Exams Section */}
      <section id="mock-exams" className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-block bg-[#9efa35] px-4 py-1 text-lg font-medium mb-4">Mock Exams</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Test Your Knowledge</h2>
            <p className="text-gray-500 max-w-[800px]">
              Prepare for certification exams with our comprehensive mock tests and practice questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-[#9efa35] transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#9efa35]/20 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-[#9efa35]" />
                </div>
                <h3 className="font-bold text-xl mb-2">Timed Assessments</h3>
                <p className="text-gray-500 mb-4">
                  Practice under exam conditions with timed tests and realistic questions.
                </p>
                <Badge className="bg-[#9efa35] text-black mb-4">Coming Soon</Badge>
                <Button variant="outline" className="w-full">
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#9efa35] transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#9efa35]/20 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-[#9efa35]" />
                </div>
                <h3 className="font-bold text-xl mb-2">Practice Questions</h3>
                <p className="text-gray-500 mb-4">Access thousands of practice questions with detailed explanations.</p>
                <Badge className="bg-[#9efa35] text-black mb-4">Coming Soon</Badge>
                <Button variant="outline" className="w-full">
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#9efa35] transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#9efa35]/20 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-[#9efa35]" />
                </div>
                <h3 className="font-bold text-xl mb-2">Performance Analytics</h3>
                <p className="text-gray-500 mb-4">Track your progress and identify areas for improvement.</p>
                <Badge className="bg-[#9efa35] text-black mb-4">Coming Soon</Badge>
                <Button variant="outline" className="w-full">
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-gray-400 max-w-[600px] mb-8">
              Join thousands of students who are already preparing for their technical careers with our platform.
            </p>
            
          </div>
        </div>
      </section>

      
     
    </div>
  )
}
