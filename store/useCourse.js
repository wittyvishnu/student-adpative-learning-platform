import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export const useCourseStore = create(
  devtools(
    persist(
      (set) => ({
        courseid: null,
        coursename: "",
        topicid: null,
        topicname: "",
        manualQuestions: [],
        aiQuestions: [],
        solveQuestion: [],
       

        setCourse: (id, name) => {
          console.log("[Zustand] setCourse:", id, name);
          set({ courseid: id, coursename: name });
        },

        setTopic: (id, name) => {
          console.log("[Zustand] setTopic:", id, name);
          set({ topicid: id, topicname: name });
        },

        setManualQuestions: (questions) => {
          console.log("[Zustand] setManualQuestions:", questions);
          set({ manualQuestions: questions });
        },

        setAIQuestions: (questions) => {
          console.log("[Zustand] setAIQuestions:", questions);
          set({ aiQuestions: questions });
        },
        setSolveQuestion: (questions) => {
          console.log("[Zustand] setSolveQuestion:", questions);
          set({ solveQuestion: questions });
        }

        
      }),
      {
        name: "course-storage", // Key in localStorage
        partialize: (state) => ({
          courseid: state.courseid,
          coursename: state.coursename,
          topicid: state.topicid,
          topicname: state.topicname,
          manualQuestions: state.manualQuestions,
          aiQuestions: state.aiQuestions,
            solveQuestion: state.solveQuestion,
        }),
      }
    )
  )
);
