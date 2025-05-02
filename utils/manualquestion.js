// manualquestion.ts or .js
import { db } from './db.js';
import { ManualQuestions } from "./schema.js";

async function seedManualQuestion() {
  await db.insert(ManualQuestions).values({
    courseid: 1,
    topicid: 1,
    question: {
      title: "Find the First Non-Repeating Element",
      level: "Easy",
      description: "Given an array of integers, find the first non-repeating element. Return -1 if every element repeats.",
      constraints: [
        "1 <= arr.length <= 10^5",
        "-10^5 <= arr[i] <= 10^5"
      ],
      sampleOutputs: [
        {
          input: "[4, 5, 1, 2, 0, 4]",
          output: "5"
        },
        {
          input: "[1, 2, 2, 1]",
          output: "-1"
        }
      ],
      explanation: "The element 5 is the first that does not repeat. In the second example, every number appears twice.",
      hints: [
        "Use a hash map to track frequencies.",
        "Then iterate again to find the first unique."
      ],
      testcasesForRun: [
        {
          input: "[4, 5, 1, 2, 0, 4]",
          expectedOutput: "5"
        }
      ],
      testcasesForSubmit: [
        {
          input: "[1, 2, 2, 3, 1]",
          expectedOutput: "3"
        },
        {
          input: "[7, 7, 8, 9, 8]",
          expectedOutput: "9"
        },
        {
          input: "[1, 1, 1, 1]",
          expectedOutput: "-1"
        }
      ]
    }
  });

  console.log("✅ Manual question inserted successfully.");
  process.exit(0);
}

seedManualQuestion().catch((err) => {
  console.error("❌ Error inserting manual question:", err);
  process.exit(1);
});
