"use client";

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import TopicsList from '@/components/courses/topics-list';

export default function TopicPage() {
  const params = useParams(); // dynamic slug
  const [courseId, setCourseId] = useState(null);

  const course = params.topic?.replace(/-/g, ' ');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("courseId");
    setCourseId(id);
    console.log("Course ID:", id);
  }, []);

  console.log("Course:", course);

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/courses">Courses</Link>
          <span>{">"}</span>
          <span>{course}</span>
        </div>

        {/* Heading */}
        <div className="inline-block bg-[#9efa35] px-4 py-1 text-lg font-medium">
          Topics in {course}
        </div>

        {/* Only render TopicsList once courseId is available */}
        
          <TopicsList courseid={courseId} course={course}/>
        
      </div>
    </div>
  );
}
