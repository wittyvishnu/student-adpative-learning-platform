import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-[#9efa35] px-4 py-1 text-sm font-medium rounded-full">
                AI-Powered Learning
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Learning That <br />
                <span className="text-[#9efa35]">Adapts to You</span>
              </h1>
              <p className="text-gray-600 md:text-xl max-w-[600px]">
                Our AI-powered learning platform helps students master any subject — from coding and math to science and
                more — by adapting in real-time to your performance and learning needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                  Start Learning Smarter
                </Button>
                <Button size="lg" variant="outline" className="border-black">
                  View Courses
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">10,000+</span> students already learning
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#9efa35]/20 to-transparent rounded-3xl transform rotate-3"></div>
              <div className="relative z-10 bg-white rounded-3xl shadow-xl p-6 md:p-10">
                <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#9efa35] rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 text-black">▶️</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">Data Structures & Algorithms</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                      <span>John Smith</span>
                    </div>
                    <span className="text-gray-500">12 lessons • 6 hours</span>
                  </div>
                  <div className="pt-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full w-3/4 bg-[#9efa35] rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Progress</span>
                      <span>75%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#9efa35] px-4 py-1 text-sm font-medium rounded-full mb-4">
              Our Features
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">How Positivus Helps You Learn</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Our platform uses advanced AI to create a personalized learning experience that adapts to your needs and
              helps you achieve your goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Learning Path",
                description: "AI-generated curriculum tailored to your skill level, goals, and learning style",
                icon: "🧠",
                color: "bg-blue-50",
              },
              {
                title: "Real-Time Feedback",
                description: "Instant feedback on your work with detailed explanations and improvement suggestions",
                icon: "⚡",
                color: "bg-green-50",
              },
              {
                title: "Adaptive Challenges",
                description: "Problems that adjust in difficulty based on your performance and progress",
                icon: "🎯",
                color: "bg-yellow-50",
              },
              {
                title: "Progress Analytics",
                description: "Detailed insights into your strengths, weaknesses, and learning patterns",
                icon: "📊",
                color: "bg-purple-50",
              },
              {
                title: "Community Support",
                description: "Connect with peers and mentors to collaborate and get help when needed",
                icon: "👥",
                color: "bg-pink-50",
              },
              {
                title: "Certification",
                description: "Earn recognized certificates to showcase your skills and knowledge",
                icon: "🏆",
                color: "bg-orange-50",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <div className="inline-block bg-[#9efa35] px-4 py-1 text-sm font-medium rounded-full mb-4">
                Popular Courses
              </div>
              <h2 className="text-3xl font-bold md:text-4xl">Start Learning Today</h2>
            </div>
            <Link href="/courses" className="mt-4 md:mt-0 flex items-center text-black font-medium hover:underline">
              View all courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Data Structures & Algorithms",
                category: "Computer Science",
                lessons: 24,
                level: "Intermediate",
                rating: 4.9,
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Machine Learning Fundamentals",
                category: "Artificial Intelligence",
                lessons: 32,
                level: "Advanced",
                rating: 4.8,
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Web Development Bootcamp",
                category: "Programming",
                lessons: 48,
                level: "Beginner",
                rating: 4.7,
                image: "/placeholder.svg?height=200&width=400",
              },
            ].map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gray-100 relative">
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-medium">
                    {course.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>{course.lessons} lessons</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{course.rating}</span>
                    </div>
                    <Button className="bg-[#9efa35] text-black hover:bg-[#8de42d]">Enroll Now</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#9efa35] px-4 py-1 text-sm font-medium rounded-full mb-4">
              How It Works
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">Your Learning Journey</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to start your personalized learning experience with Positivus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create an Account",
                description: "Sign up and tell us about your goals and current skill level",
              },
              {
                step: "02",
                title: "Get Your Learning Plan",
                description: "Our AI creates a personalized curriculum just for you",
              },
              {
                step: "03",
                title: "Learn & Progress",
                description: "Complete lessons, get feedback, and track your improvement",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="text-4xl font-bold text-[#9efa35] mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#9efa35] px-4 py-1 text-sm font-medium rounded-full mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">What Our Students Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Engineer",
                image: "/placeholder.svg?height=100&width=100",
                content:
                  "Positivus helped me prepare for technical interviews in just 2 months. The adaptive learning system identified my weak areas and focused my practice there.",
              },
              {
                name: "Michael Chen",
                role: "Computer Science Student",
                image: "/placeholder.svg?height=100&width=100",
                content:
                  "I was struggling with data structures until I found Positivus. The personalized feedback on my code helped me understand complex concepts quickly.",
              },
              {
                name: "Emily Rodriguez",
                role: "Data Scientist",
                image: "/placeholder.svg?height=100&width=100",
                content:
                  "The machine learning course was exactly what I needed to transition into AI. The hands-on projects and real-time guidance made all the difference.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-[#9efa35] px-4 py-1 text-sm font-medium text-black rounded-full">
                Get Started Today
              </div>
              <h2 className="text-3xl font-bold md:text-5xl">Ready to Transform Your Learning?</h2>
              <p className="text-gray-300 md:text-xl">
                Join thousands of students who are already learning smarter, not harder, with our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-[#9efa35] text-black hover:bg-[#8de42d]">
                  Sign Up Free
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Check className="h-5 w-5 text-[#9efa35]" />
                <p className="text-gray-300">No credit card required</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#9efa35]/20 rounded-3xl p-8 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { number: "10K+", label: "Active Students" },
                    { number: "500+", label: "Courses" },
                    { number: "95%", label: "Completion Rate" },
                    { number: "4.9/5", label: "Satisfaction" },
                  ].map((stat, index) => (
                    <div key={index} className="bg-black/80 rounded-lg p-4 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-[#9efa35]">{stat.number}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
