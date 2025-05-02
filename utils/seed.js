import { db } from './db.js'; // your configured drizzle instance
import { Courses, Topics } from './schema.js'; // your schema definitions
import { eq } from 'drizzle-orm'; // if needed

async function seed() {
  const courseData = [
    {
      name: 'Data Structures',
      desc: 'Learn basic to advanced data structures',
      topics: [
        { name: 'Arrays', level: 'Beginner', desc: 'Basics of arrays' },
        { name: 'Linked List', level: 'Beginner', desc: 'Understanding linked lists' },
        { name: 'Stacks', level: 'Intermediate', desc: 'Learn stack operations' },
        { name: 'Queues', level: 'Intermediate', desc: 'Queue and its types' },
        { name: 'Trees', level: 'Intermediate', desc: 'Basics of trees' },
        { name: 'Binary Tree', level: 'Intermediate', desc: 'Binary Tree implementation' },
        { name: 'Binary Search Tree', level: 'Intermediate', desc: 'BST operations' },
        { name: 'Heaps', level: 'Advanced', desc: 'Understanding heaps and priority queues' },
        { name: 'Graphs', level: 'Advanced', desc: 'Intro to graphs' },
        { name: 'BFS & DFS', level: 'Advanced', desc: 'Graph traversal algorithms' }
      ]
    },
    {
      name: 'Algorithms',
      desc: 'Master algorithmic thinking and problem solving',
      topics: [
        { name: 'Sorting Basics', level: 'Beginner', desc: 'Bubble, Selection, Insertion sort' },
        { name: 'Binary Search', level: 'Beginner', desc: 'Efficient searching in arrays' },
        { name: 'Recursion', level: 'Intermediate', desc: 'Recursive problem solving' },
        { name: 'Greedy Algorithms', level: 'Intermediate', desc: 'Making optimal choices' },
        { name: 'Divide and Conquer', level: 'Intermediate', desc: 'Breaking problems down' },
        { name: 'Dynamic Programming', level: 'Advanced', desc: 'Overlapping subproblems' },
        { name: 'Backtracking', level: 'Advanced', desc: 'Exploring all solutions' },
        { name: 'Graph Algorithms', level: 'Advanced', desc: 'Dijkstra, Floyd-Warshall etc.' }
      ]
    }
  ];

  for (const course of courseData) {
    const insertedCourses = await db.insert(Courses).values({ name: course.name, desc: course.desc }).returning();
    const insertedCourse = insertedCourses[0];

    for (const topic of course.topics) {
      await db.insert(Topics).values({
        courseid: insertedCourse.id,
        name: topic.name,
        level: topic.level,
        desc: topic.desc
      });
    }
  }

  console.log('✅ Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Error during seed:', err);
});
