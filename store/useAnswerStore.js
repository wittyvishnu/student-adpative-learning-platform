import { create } from "zustand";

export const useAnswerStore = create((set) => ({
  courseid: null,
  topicid: null,
  coursename:null,
  topicname:null,
  question:[],
  userid: null,
  questionid: null,
  submissionid: null,
  answerCode: "",
  type: "",
  attempts: null,
  language: "c", // Add language state
  code: "", // Add code state
  fullName:"",
  setCourseName: (name) => {
    console.log("[Zustand] setCourseName:", name);
    set({ coursename: name });
  },
  
  setTopicName: (name) => {
    console.log("[Zustand] setTopicName:", name);
    set({ topicname: name });
  },
  
  setQuestion: (questionData) => {
    console.log("[Zustand] setQuestion:", questionData);
    set({ question: questionData });
  },
  
  setCourseId: (id) => {
    console.log("[Zustand] setCourseId:", id);
    set({ courseid: id });
  },

  setTopicId: (id) => {
    console.log("[Zustand] setTopicId:", id);
    set({ topicid: id });
  },

  setUserId: (id) => {
    console.log("[Zustand] setUserId:", id);
    set({ userid: id });
  },

  setQuestionId: (id) => {
    console.log("[Zustand] setQuestionId:", id);
    set({ questionid: id });
  },

  setSubmissionId: (id) => {
    console.log("[Zustand] setSubmissionId:", id);
    set({ submissionid: id });
  },

  setAnswerCode: (code) => {
    console.log("[Zustand] setAnswerCode:", code);
    set({ answerCode: code });
  },

  setType: (type) => {
    console.log("[Zustand] setType:", type);
    set({ type: type });
  },

  setAttempts: (count) => {
    console.log("[Zustand] setAttempts:", count);
    set({ attempts: count });
  },

  // Add these new actions
  setCode: (code) => {
    console.log("[Zustand] setCode:", code);
    set({ code: code });
  },

  setLanguage: (language) => {
    console.log("[Zustand] setLanguage:", language);
    set({ language: language });
  },
  setFullName:(name)=>{
    console.log("[Zustand] setfullname:", name);
      set({fullName:name});
  }
}));