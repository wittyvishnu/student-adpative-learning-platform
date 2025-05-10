"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Star } from "lucide-react"
import Logo from "@/components/layout/logo";
import { useState } from "react"
import Link from "next/link"
import { Menu, BarChart2, LayoutDashboard } from "lucide-react"
import UserMenu from "@/components/layout/user-menu"
import Image from "next/image";
import { useRouter } from "next/navigation";



import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col  bg-[#f9f9f9]">
   <header className="border-b  bg-[#f9f9f9] sticky top-0 z-50">
  <div className="container flex h-16 items-center justify-between px-4">
    <div className="flex items-center gap-6">
      {/* Logo - hidden on small screens */}
      <div className="hidden md:block ml-5 mr-5">
        <Logo />
      </div>

      {/* Mobile menu button */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <nav className="flex flex-col gap-4 mt-8">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How It Works" },
              { href: "#testimonials", label: "Testimonials" },
              { href: "#cta", label: "Get Started" },
            ].map(({ href, label }) => (
              <SheetClose asChild key={href}>
                <a
                  href={href}
                  className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                >
                  {label}
                </a>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop navigation */}
      <nav className="hidden md:flex gap-6 text-sm font-semibold">
        <a href="#features" className="hover:text-[#9efa35] transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-[#9efa35] transition-colors">How It Works</a>
        <a href="#testimonials" className="hover:text-[#9efa35] transition-colors">Testimonials</a>
        
      </nav>
    </div>

    {/* Right - User Menu or Sign Up Button */}
    <div className="flex items-center gap-4">
     <Button onClick={() => router.push("/dashboard")} size="lg"  className="border-black text-black bg-[#9efa35] hover:bg-[#9efa32]- cursor-pointer">
                  Get Started
      </Button>
    </div>
  </div>
</header>

      {/* Hero Section */}
      <section className="w-full  py-20">
  <div className="container mx-auto px-4 md:px-6">
    <div className="flex flex-col-reverse md:flex-row items-center justify-around gap-10">
      {/* Left Content */}
      <div className="text-center md:text-left max-w-xl space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Learning That <br />
          <span className="text-[#9efa35]">Adapts to You</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Our AI-powered learning platform helps students master any subject — from coding and math to science and more — by adapting in real-time to their performance and learning needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <button onClick={() => router.push("/dashboard")}className="bg-black text-white px-6 py-3 rounded-md text-base font-semibold hover:bg-gray-800 transition">
            Start Learning Smarter
          </button>
          <button onClick={() => router.push("/dashboard/courses")} className="border border-black px-6 py-3 rounded-md text-base font-semibold hover:bg-gray-100 transition">
            Check out Courses
          </button>
        </div>
      </div>

      {/* Right Orbit Visual */}
      <div className="flex items-center justify-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer Orbit */}
          <div className="absolute inset-0 border-2 rounded-full border-black animate-spin-slow"></div>

          {/* Inner Orbit */}
          <div className="absolute inset-6 border border-[#9efa35] rounded-full animate-spin-reverse-slower"></div>

          {/* Center Star */}
          <div className="z-10 text-3xl">⭐</div>

          {/* Orbiting Icons */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <div className="w-6 h-6 bg-black rounded-full"></div>
          </div>
          <div className="absolute right-2 top-1/3 animate-bounce">
            <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-xl">💖</div>
          </div>
          <div className="absolute right-0 bottom-1/3 animate-wiggle">
            <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-xl">▶️</div>
          </div>
          <div className="absolute left-0 bottom-1/4 animate-float">
            <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-xl">📍</div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-ping">
            <div className="w-4 h-4 bg-[#9efa35] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
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


      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
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
    <section id="testimonials" className="py-16 md:py-24">
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
          name: "Abhi",
          role: "Software Engineer",
          image:
            "https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
          content:
            "Pin IT helped me prepare for technical interviews in just 2 months. The adaptive learning system identified my weak areas and focused my practice there.",
        },
        {
          name: "Manoj",
          role: "Computer Science Student",
          image:
            "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
          content:
            "I was struggling with data structures until I found Positivus. The personalized feedback on my code helped me understand complex concepts quickly.",
        },
        {
          name: "Mohith",
          role: "Data Scientist",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx4KfQYNlJojREBWzAqUvLyI3M1Fv2T1Ut9Nh9KNCUNki6dQrJIO36LqQEMvmQ6pTY98c&usqp=CAU",
          content:
            "The machine learning course was exactly what I needed to transition into AI. The hands-on projects and real-time guidance made all the difference.",
        },
      ].map((testimonial, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              width={40}
              height={48}
              className="rounded-full object-cover"
            />
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
      <section id="cta" className="py-16 md:py-24 bg-black text-white">
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
                <Button onClick={() => router.push("/dashboard")} size="lg" className="bg-[#9efa35] text-black hover:bg-[#8de42d]">
                  Sign Up Free
                </Button>
                <Button onClick={() => router.push("/dashboard")} size="lg" variant="outline" className="border-white text-black hover:bg-white/10 hover:text-white">
                  Log in
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
