'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/utils/db";
import { Courses, Topics } from "@/utils/schema";
import { and, eq, sql } from 'drizzle-orm';
import { Star } from 'lucide-react';


export default function TopicsList() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starredTopics, setStarredTopics] = useState(new Set());
  const [courseName, setCourseName] = useState('');

  const router = useRouter();
  const { course: coursenameParam } = useParams();



  

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const decodedName = decodeURIComponent(coursenameParam.replace(/-/g, ' ')).toLowerCase();
        setCourseName(decodedName);
  
        const results = await db
          .select({
            topicId: Topics.id,
            topicName: Topics.name,
            topicLevel: Topics.level,
            topicDesc: Topics.desc,
            courseId: Courses.id,
            courseName: Courses.name,
          })
          .from(Topics)
          .innerJoin(Courses, eq(Topics.courseid, Courses.id))
          .where(sql`LOWER(${Courses.name}) = ${decodedName}`);
  
        if (!results.length) {
          console.warn("No topics found for this course");
          setTopics([]);
          return;
        }
  
        setTopics(results); // You now get topic info + course info in each object
      } catch (err) {
        console.error('Error fetching topics with join:', err);
      } finally {
        setLoading(false);
      }
    };
  
    if (coursenameParam) fetchTopics();
  }, [coursenameParam]);
  

  const handleNavigate = (topicId, topicName) => {
    const formattedTopicName = topicName.toLowerCase().replace(/\s+/g, "-");
    const formattedCourseName = courseName.toLowerCase().replace(/\s+/g, "-");

    router.push(`/dashboard/courses/${formattedCourseName}/${formattedTopicName}`);
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
     {topics.map((item) => (
  <Card
    key={item.topicId}
    className="cursor-pointer hover:shadow-md transition"
    onClick={() => handleNavigate(item.topicId, item.topicName)}
  >
    <CardContent className="p-4 flex justify-between items-center">
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{item.topicName}</h2>
        <p className={`text-sm mt-1 ${getLevelColor(item.topicLevel)}`}>
          Level: {item.topicLevel || 'Unspecified'}
        </p>
        {item.topicDesc && (
          <p className="text-sm text-gray-600 mt-1">{item.topicDesc}</p>
        )}
      </div>

      <div className="flex gap-2 items-center mx-4">
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${starredTopics.has(item.topicId) ? "text-yellow-400" : "text-gray-400"}`}
          onClick={(e) => toggleStar(e, item.topicId)}
        >
          <Star
            className="h-4 w-4"
            fill={starredTopics.has(item.topicId) ? "#facc15" : "none"}
          />
        </Button>

        <Button
          className="h-10 bg-[#9efa35] text-black hover:bg-[#8de42d] text-sm font-semibold rounded-full transition-all duration-200 transform hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate(item.topicId, item.topicName);
          }}
        >
          Solve Questions
        </Button>
      </div>
    </CardContent>
  </Card>
))}
    </div>
  );
}
