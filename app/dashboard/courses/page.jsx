"use client";

import { useState } from "react";
import CourseCategories from "@/components/courses/course-categories";
import TopicsList from "@/components/courses/topics-list";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  return (
    <div className="flex flex-col gap-16  bg-[#f9f9f9] py-5 px-5">
      {/* Top Section */}
      <section className="container px-4 md:px-6 space-y-12">
        <div className="space-y-8">
          <div className="inline-block bg-[#9efa35] px-4 py-1 text-lg font-medium rounded">
            Courses
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Prepare By Topics</h2>
            <CourseCategories onSelectCourse={setSelectedCourseId} />
          </div>
        </div>
      </section>

      {/* Upcoming Courses Section */}
      <section className="container px-4 md:px-6 space-y-8">
        <div className="space-y-4">
          <div className="inline-block bg-[#9efa35] px-4 py-1 text-lg font-medium rounded">
            Upcoming Courses
          </div>
          <h2 className="text-2xl-gray-100 p-2 font-medium">Be the First to Know</h2>
          


          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Example card - replace with real dynamic data if available */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300 bg-white">
              <h3 className="text-xl font-semibold mb-2">Next.js with AI</h3>
              <p className="text-sm text-gray-600 mb-4">
                Learn how to build smart web apps using Next.js integrated with AI tools and APIs.
              </p>
              <Button className="bg-[#9efa35] text-black hover:bg-[#8ce92a] transition">
                Notify Me
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300 bg-white">
              <h3 className="text-xl font-semibold mb-2">Mastering TypeScript</h3>
              <p className="text-sm text-gray-600 mb-4">
                Deep dive into TypeScript essentials for scalable and maintainable applications.
              </p>
              <Button className="bg-[#9efa35] text-black hover:bg-[#8ce92a] transition">
                Notify Me
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300 bg-white">
              <h3 className="text-xl font-semibold mb-2">Backend with Rust</h3>
              <p className="text-sm text-gray-600 mb-4">
                A high-performance backend course for building secure and blazing-fast APIs.
              </p>
              <Button className="bg-[#9efa35] text-black hover:bg-[#8ce92a] transition">
                Notify Me
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
