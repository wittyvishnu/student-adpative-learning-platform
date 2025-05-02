import { pgTable, serial, varchar, text, integer, json, boolean, timestamp } from 'drizzle-orm/pg-core';

export const Courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  desc: text('desc'),
});

export const Topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  courseid: integer('courseid').references(() => Courses.id),
  name: varchar('name').notNull(),
  level: varchar('level'),
  desc: text('desc'),
});



// AI Questions Table
export const AIQuestions = pgTable('ai_questions', {
  id: serial('id').primaryKey(),
  userId: varchar('userId').notNull(),
  createdBy: varchar('createdBy').notNull(),
  courseid: integer('courseid').references(() => Courses.id),
  topicid: integer('topicid').references(() => Topics.id),
  question: json('question').notNull(),
  questionType: varchar('questionType').default('ai').notNull(), // ✅ NEW
  createdAt: timestamp('createdAt').defaultNow(),
});

// Manual Questions Table
export const ManualQuestions = pgTable('manual_questions', {
  id: serial('id').primaryKey(),
  courseid: integer('courseid').references(() => Courses.id),
  topicid: integer('topicid').references(() => Topics.id),
  question: json('question').notNull(),
  questionType: varchar('questionType').default('manual').notNull(), // ✅ NEW
  createdAt: timestamp('createdAt').defaultNow(),
});


export const Submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  questionId: integer('questionId').notNull(), // Refers to either AI or Manual
  questionType: varchar('questionType').notNull(), // 'ai' or 'manual'
  submittedcode: text('submittedcode').notNull(),
  userId: varchar('userId').notNull(), // Clerk user ID who submitted
  createdBy: varchar('createdBy').notNull(), // Who created the submission (usually same as userId)
  language: varchar('language'),
  output: text('output'),
  passed: boolean('passed'),
  timeTaken: varchar('timeTaken'),
  attempts: integer('attempts'),
  createdAt: timestamp('createdAt').defaultNow(),
  
});

export const Feedback = pgTable('feedback', {
 
  id: serial('id').primaryKey(),
  questionId: integer('questionId').notNull(),
  submissionid: integer('submissionid').references(() => Submissions.id),
  weakness: text('weakness'),
  suggestion: text('suggestion'),
});

export const Analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  userId: varchar('userId').notNull(), 
  courseid: integer('courseid').references(() => Courses.id),// Clerk user ID
  topicid: integer('topicid').references(() => Topics.id),
  totalQatt: integer('totalQatt'),
  correct: integer('correct'),
  weakness: text('weakness'),
});
