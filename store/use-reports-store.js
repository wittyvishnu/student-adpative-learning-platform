import { create } from "zustand"

// use-reports-store.js
export const useReportsStore = create((set) => ({
  data: {
    currentLevel: 1,
    currentXP: 0,
    nextLevelXP: 100,
    questionsAnswered: 0,
    correctAnswers: 0,
    correctPercentage: 0,
    avgSessionLength: "0m 0s",
    totalSessions: 0,
    activityData: [],
    startingKnowledge: 0,
    currentKnowledge: 0,
    knowledgeGain: 0,
    weakTopics: [],
    strongTopics: [],
    totalPoints: 0,
  },
  // Initialize with null instead of "all"
  courseId: null,
  topicId: null,
  courses: [],
  topics: [],
  setData: (data) => set({ data }),
  setCourseId: (courseId) => set({ courseId }),
  setTopicId: (topicId) => set({ topicId }),
  setCourses: (courses) => set({ courses }),
  setTopics: (topics) => set({ topics }),
}))