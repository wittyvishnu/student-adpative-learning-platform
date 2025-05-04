"use client"; // Make sure this is at the top

import { useEffect, useState } from "react";
import { BookIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation"; // Use `next/navigation` for App Directory
import { db } from "@/utils/db";
import { Courses } from "@/utils/schema";


export default function CourseCategories() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Use useRouter from next/navigation for App Directory
 
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await db.select().from(Courses);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId, courseName) => {
    // Format the course name to lowercase with dashes in between
    
    const formattedCourseName = courseName.toLowerCase().replace(/\s+/g, "-");

    // Programmatically navigate to /dashboard/courses/{courseId}-{formattedCourseName}
    router.push(`/dashboard/courses/${formattedCourseName}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 border rounded-lg">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))
        : courses.map((course) => (
            <button
              key={course.id}
              onClick={() => handleCourseClick(course.id, course.name)} // Pass courseId and courseName to handleCourseClick
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <BookIcon className="h-4 w-4" />
              </div>
              <span className="font-medium">{course.name}</span>
            </button>
          ))}
    </div>
  );
}
