"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { Submissions } from "@/utils/schema";
import { desc, eq, and } from "drizzle-orm";
import { Trophy, Clock, CheckCircle, XCircle, Crown, Medal, Award } from "lucide-react";
import { useAnswerStore } from "@/store/useAnswerStore";
import { useUser } from "@clerk/nextjs";

export default function LeaderboardPage() {
  const { questionid ,type} = useAnswerStore();
  const { user, isLoaded } = useUser();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  if(type=='ai') return <div>NO Leaderboard for Ai generated Questions</div>

  useEffect(() => {
    if (isLoaded && user) {
      setCurrentUserId(user.primaryEmailAddress?.emailAddress);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!questionid || !isLoaded) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get all successful manual submissions for this question
        const allSubmissions = await db
          .select()
          .from(Submissions)
          .where(
            and(
              eq(Submissions.questionId, Number(questionid)),
              eq(Submissions.questionType, type),
              
            )
          );

        
        const submissionsByUser = allSubmissions.reduce((acc, submission) => {
          if (!acc[submission.userId]) {
            acc[submission.userId] = [];
          }
          acc[submission.userId].push(submission);
          return acc;
        }, {});

        
        const bestSubmissions = Object.entries(submissionsByUser).map(([userId, submissions]) => {
          return submissions.reduce((best, current) => {
           
            if (current.totalTestCasesPassed > best.totalTestCasesPassed) return current;
            if (current.totalTestCasesPassed < best.totalTestCasesPassed) return best;
            
            
            return parseInt(current.timeTaken) < parseInt(best.timeTaken) ? current : best;
          });
        });

       
        const rankedSubmissions = bestSubmissions
          .sort((a, b) => {
           
            if (b.totalTestCasesPassed !== a.totalTestCasesPassed) {
              return b.totalTestCasesPassed - a.totalTestCasesPassed;
            }
            // Then by time taken (ascending)
            return parseInt(a.timeTaken) - parseInt(b.timeTaken);
          })
          .map((sub, index) => ({
            ...sub,
            rank: index + 1,
            score: Math.round((sub.totalTestCasesPassed / sub.totalTestCases) * 100),
            isCurrentUser: sub.userId === currentUserId
          }));

        setLeaderboard(rankedSubmissions);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [questionid, isLoaded, currentUserId]);

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const seconds = parseInt(timeStr.replace('s', '')) || 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const LeaderboardSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="h-6 bg-gray-200 rounded w-12"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400 fill-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600 fill-amber-600" />;
      default: return <span className="text-gray-600">{rank}</span>;
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">Problem Leaderboard</h2>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {leaderboard.length} {leaderboard.length === 1 ? 'participant' : 'participants'}
        </div>
      </div>

      {loading ? (
        <LeaderboardSkeleton />
      ) : leaderboard.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No submissions yet for this problem</p>
        </div>
      ) : (
        <>
          {/* Current User Highlight (if on leaderboard) */}
          {leaderboard.some(entry => entry.isCurrentUser) && (
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div className="flex items-center text-blue-700">
                <span className="font-medium">Your position:</span>
                <span className="ml-2 font-semibold">
                  #{leaderboard.find(entry => entry.isCurrentUser)?.rank}
                </span>
              </div>
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            {/* Header */}
            <div className="grid grid-cols-12 bg-gray-100 p-3 font-medium text-gray-700">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">User</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-2 text-center">Test Cases</div>
              <div className="col-span-2 text-right">Time</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-200">
              {leaderboard.map((entry) => {
                const [username, email] = entry.createdBy?.split(' <') || ['Anonymous', 'no-email'];
                const displayName = username || email?.replace('>', '') || 'Anonymous';
                
                return (
                  <div 
                    key={entry.userId}
                    className={`grid grid-cols-12 gap-4 items-center p-3 transition-colors ${
                      entry.isCurrentUser 
                        ? 'bg-blue-50 border-l-4 border-blue-500' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="col-span-1 flex justify-center">
                      <div className="flex items-center justify-center w-6">
                        {renderRankIcon(entry.rank)}
                      </div>
                    </div>
                    
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{displayName}</div>
                        <div className="text-xs text-gray-500 truncate">
                          
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <div className="inline-flex items-center justify-center gap-1">
                        <span className="font-medium">{entry.score}%</span>
                        {entry.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <div className="inline-flex bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                        {entry.totalTestCasesPassed}/{entry.totalTestCases}
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {formatTime(entry.timeTaken)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}