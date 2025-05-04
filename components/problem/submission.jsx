"use client";
import React, { useEffect, useState } from "react";
import { useAnswerStore } from "@/store/useAnswerStore";
import { db } from "@/utils/db";
import { Submissions } from "@/utils/schema";
import { eq, and, desc } from "drizzle-orm";
import { BadgeCheck, Clock, Code2, Edit } from "lucide-react";
import { useUser } from "@clerk/nextjs";

function SubmissionPage() {
  const { questionid, type, setCode, setLanguage } = useAnswerStore();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded } = useUser();
  
  // Get user ID from Clerk email if available
  const userId = isLoaded ? user?.primaryEmailAddress?.emailAddress : null;
  console.log("User ID in submission:", userId);

  useEffect(() => {
    console.log("Initializing SubmissionPage with:", { 
      questionid, 
      type,
      isLoaded,
      userId
    });

    const fetchSubmissions = async () => {
      if (!questionid || !type || !isLoaded) {
        console.warn("Missing required data, skipping fetch", {
          questionid,
          type,
          isLoaded
        });
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching submissions for:", { 
          questionid, 
          type,
          userId 
        });
        setLoading(true);
        
        const results = await db
          .select()
          .from(Submissions)
          .where(
            and(
              eq(Submissions.questionId, Number(questionid)),
              eq(Submissions.questionType, type),
              eq(Submissions.userId, userId)
            )
          )
          .orderBy(desc(Submissions.createdAt));

        console.log("Fetched submissions:", results);
        setSubmissions(results);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to load submissions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [questionid, type, isLoaded, userId]);

  const handleEdit = (submission) => {
    try {
      console.log("Editing submission:", submission);
      if (typeof setCode === 'function' && typeof setLanguage === 'function') {
        setCode(submission.submittedcode);
        setLanguage(submission.language);
        console.log("Code and language set successfully");
        
        document.getElementById("code-editor")?.scrollIntoView({
          behavior: "smooth"
        });
      } else {
        console.error("Store functions not available");
        throw new Error("Store functions not available");
      }
    } catch (err) {
      console.error("Error in handleEdit:", err);
      alert("Failed to load code for editing");
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const seconds = parseInt(timeStr.replace('s', '')) || 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const calculatePoints = (total, passed) => {
    if (!total || total === 0) return 0;
    return Math.round((passed / total) * 20);
  };

  // Skeleton loader component
  const SubmissionSkeleton = () => (
    <div className="bg-white shadow-md rounded-xl p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-2 rounded-md">
            <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
        ))}
      </div>
      <div className="h-40 bg-gray-100 rounded-md"></div>
    </div>
  );

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <SubmissionSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Code2 className="w-6 h-6" />
        Submission History
      </h1>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <SubmissionSkeleton key={i} />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <p className="text-gray-600">No submissions found for this question.</p>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => {
            const total = submission.totalTestCases || 0;
            const passed = submission.totalTestCasesPassed || 0;
            const points = calculatePoints(total, passed);

            return (
              <div
                key={submission.id}
                className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Language:</span>
                      <span className="font-semibold text-blue-600">
                        {submission.language?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Time: {formatTime(submission.timeTaken)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleEdit(submission)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Code
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-xs text-gray-500">Test Cases</div>
                    <div className="font-semibold">
                      {passed} / {total}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-xs text-gray-500">Status</div>
                    <div className={`font-semibold ${
                      submission.passed ? "text-green-600" : "text-red-600"
                    }`}>
                      {submission.passed ? "Passed" : "Failed"}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-xs text-gray-500">Points</div>
                    <div className="font-semibold">
                      {points} / 20
                    </div>
                  </div>
                </div>

                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600">
                    View Submitted Code
                  </summary>
                  <div className="bg-gray-50 p-3 mt-2 rounded-md overflow-x-auto">
                    <pre className="text-left font-mono text-sm whitespace-pre">
                      {submission.submittedcode}
                    </pre>
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SubmissionPage;