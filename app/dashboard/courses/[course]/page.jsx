"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import TopicsList from "@/components/courses/topics-list";

export default function TopicPage() {
  const { course: formattedCourseName } = useParams(); // dynamic slug

  // Decode and format for display
  const decodedCourseName = decodeURIComponent(formattedCourseName?.replace(/-/g, " ") || "");

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/courses">Courses</Link>
          <span>{">"}</span>
          <span>{decodedCourseName}</span>
        </div>

        {/* Heading */}
        <div className="inline-block bg-[#9efa35] px-4 py-1 text-lg font-medium">
          Topics in {decodedCourseName}
        </div>

        {/* Render TopicsList */}
        <TopicsList />
      </div>
    </div>
  );
}
