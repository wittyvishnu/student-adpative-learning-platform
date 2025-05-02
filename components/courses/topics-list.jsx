'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/utils/db";
import { Topics } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useCourseStore } from '@/store/useCourse';
import { Star } from 'lucide-react';

export default function TopicsList({ courseid, course }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starredTopics, setStarredTopics] = useState(new Set());

  const router = useRouter();
  const { setCourse, setTopic } = useCourseStore();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await db
          .select()
          .from(Topics)
          .where(eq(Topics.courseid, Number(courseid)));
        setTopics(data);
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseid) fetchTopics();
  }, [courseid]);

  const handleNavigate = (topicId, topicName) => {
    console.log("Navigating to:", topicId, topicName);
  console.log("Course ID:", courseid, "Course Name:", course);
    const formattedTopicName = topicName.toLowerCase().replace(/\s+/g, "-");
    const formattedCourseName = course.toLowerCase().replace(/\s+/g, "-");

    setCourse(courseid, course);
    setTopic(topicId, topicName);
  
    router.push(
      `/dashboard/courses/${formattedCourseName}/questions?courseId=${courseid}&courseName=${course}&topicId=${topicId}&topicName=${topicName}`
    );
  };

  const toggleStar = (e, topicId) => {
    e.stopPropagation();
    setStarredTopics((prev) => {
      const updated = new Set(prev);
      updated.has(topicId) ? updated.delete(topicId) : updated.add(topicId);
      return updated;
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "text-green-500";
      case "Intermediate":
        return "text-yellow-500";
      case "Advanced":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return <div className="text-sm text-gray-600">No topics found.</div>;
  }

  return (
    <div className="space-y-4">
      {topics.map((item) => {
        return (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-md transition"
            onClick={() => handleNavigate(item.id, item.name)}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className={`text-sm mt-1 ${getLevelColor(item.level)}`}>
                  Level: {item.level || 'Unspecified'}
                </p>
                {item.desc && (
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                )}
              </div>

              <div className="flex gap-2 items-center mx-4">
                {/* Star button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${
                    starredTopics.has(item.id) ? "text-yellow-400" : "text-gray-400"
                  }`}
                  onClick={(e) => toggleStar(e, item.id)}
                >
                  <Star
                    className="h-4 w-4"
                    fill={starredTopics.has(item.id) ? "#facc15" : "none"}
                  />
                </Button>

                {/* Solve Questions button */}
                <Button
                  className="h-10 bg-[#9efa35] text-black hover:bg-[#8de42d] text-sm font-semibold rounded-full transition-all duration-200 transform hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(item.id, item.name);
                  }}
                >
                  Solve Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
