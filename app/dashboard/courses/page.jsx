"use client"; // Make sure this is at the top

import { useState } from "react";
import CourseCategories from "@/components/courses/course-categories";
import TopicsList from "@/components/courses/topics-list";

export default function CoursesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="container px-4 py-12 md:px-6 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Together for <br />
              Success
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              At Positivus, we help businesses grow by combining creativity, innovation, and data-driven strategies.
              Together, we build a future of shared success.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 bg-[#9efa35] rounded-md transform rotate-12"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 bg-white border-2 border-black rounded-md transform -rotate-12"></div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-24 h-24 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 text-black">🏆</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/4 right-1/4 text-2xl">✨</div>
                  <div className="absolute bottom-1/4 left-1/4 text-2xl">✨</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 space-y-12">
        <div className="space-y-8">
          <div className="inline-block bg-[#9efa35] px-4 py-1 text-lg font-medium">Courses</div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Prepare By Topics</h2>
            <CourseCategories onSelectCourse={setSelectedCourseId} />
          </div>
        </div>

        
      </section>
    </div>
  );
}
