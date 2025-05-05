import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { Analytics } from "./schema";
import { useAnswerStore } from "../store/useAnswerStore";
import { main } from "./gemini";

export async function fetchAnalyticsByContext() {
  const {
    topicid,
    courseid,
    questionid,
    type: questiontype,
    userid,
  } = useAnswerStore.getState();

  if (!topicid || !courseid || !questionid || !questiontype || !userid) {
    throw new Error("Missing required Zustand values.");
  }

  const result = await db
    .select()
    .from(Analytics)
    .where(
      and(
        eq(Analytics.topicId, topicid),
        eq(Analytics.courseId, courseid),
        eq(Analytics.questionId, questionid),
        eq(Analytics.questionType, questiontype),
        eq(Analytics.userId, userid)
      )
    );

  console.log("Analytics data fetched:", result);
  return result;
}

export async function updateUserAnalytics(submittedCode, passed) {
  try {
    console.log("[updateUserAnalytics] Starting analytics update process...");
    
    // Get current state from store
    const {
      topicid,
      courseid,
      questionid,
      type: questiontype,
      userid,
      coursename,
      topicname,
      question,
    } = useAnswerStore.getState();

    if (!topicid || !courseid || !questionid || !questiontype || !userid) {
      throw new Error("Missing required Zustand values for analytics.");
    }

    console.log("[updateUserAnalytics] Fetching existing analytics data...");
    const existingAnalytics = await fetchAnalyticsByContext();
    const hasPreviousData = existingAnalytics.length > 0;

    // Prepare prompt based on whether we have previous data
    let prompt;
    if (hasPreviousData) {
      const previousWeakness = existingAnalytics[0].weakness || "None";
      const previousWeakTopics = existingAnalytics[0].weakTopics || [];
      const previousStrongTopics = existingAnalytics[0].strongTopics || [];
      
      prompt = `
      Course: ${coursename}
      Topic: ${topicname}
      Question: ${JSON.stringify(question)}
      
      User's submitted code:
      ${submittedCode}
      
      Previous weaknesses:
      ${previousWeakness}
      
      Previous weak topics:
      ${JSON.stringify(previousWeakTopics)}
      
      Previous strong topics:
      ${JSON.stringify(previousStrongTopics)}
      
      Did the user pass all test cases? ${passed ? "Yes" : "No"}
      
      Analyze the user's current submission in relation to their previous weaknesses and performance.
      Provide:
      1. Updated weakness analysis (text)
      2. Updated weak topics (array)
      3. Updated strong topics (array)
      4. Suggestions for improvement (array)
      5. Current knowledge level (1-100)
      
      Return ONLY a valid JSON object with these keys:
      {
        "weakness": "...",
        "weakTopics": [...],
        "strongTopics": [...],
        "suggestions": [...],
        "currentKnowledge": ...
      }
      `;
    } else {
      prompt = `
      Course: ${coursename}
      Topic: ${topicname}
      Question: ${JSON.stringify(question)}
      
      User's submitted code:
      ${submittedCode}
      
      Did the user pass all test cases? ${passed ? "Yes" : "No"}
      
      Analyze the user's submission and provide:
      1. Initial weakness analysis (text)
      2. Weak topics (array)
      3. Strong topics (array)
      4. Suggestions for improvement (array)
      5. Starting knowledge level (1-100)
      6. Current knowledge level (1-100)
      
      Return ONLY a valid JSON object with these keys:
      {
        "weakness": "...",
        "weakTopics": [...],
        "strongTopics": [...],
        "suggestions": [...],
        "startingKnowledge": ...,
        "currentKnowledge": ...
      }
      `;
    }

    console.log("[updateUserAnalytics] Sending prompt to Gemini");
    const responseText = await main(prompt);
    
    // Extract JSON from the response
    // This handles cases where the model might wrap the JSON in markdown code blocks
    // or add explanatory text before/after the JSON
    let jsonText = responseText;
    
    // Check if response contains a code block with JSON
    const jsonBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      jsonText = jsonBlockMatch[1].trim();
      console.log("[updateUserAnalytics] Extracted JSON from code block");
    }
    
    // Try to find JSON object in the text (anything between { and })
    if (!jsonText.trim().startsWith('{')) {
      const jsonObjectMatch = responseText.match(/{[\s\S]*?}/);
      if (jsonObjectMatch) {
        jsonText = jsonObjectMatch[0];
        console.log("[updateUserAnalytics] Extracted JSON object from text");
      }
    }
    
    console.log("[updateUserAnalytics] Attempting to parse JSON:", jsonText);
    
    // Parse the response text
    let analysisData;
    try {
      analysisData = JSON.parse(jsonText);
    } catch (e) {
      console.error("[updateUserAnalytics] Failed to parse response text:", e);
      console.error("[updateUserAnalytics] Response text that failed to parse:", responseText);
      
      // Fallback: Try to manually clean and parse the JSON
      try {
        // Remove any non-JSON content and fix common issues
        const cleanedJson = jsonText
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
          .replace(/,\s*}/g, "}") // Remove trailing commas
          .replace(/,\s*]/g, "]"); // Remove trailing commas in arrays
          
        analysisData = JSON.parse(cleanedJson);
        console.log("[updateUserAnalytics] Successfully parsed cleaned JSON");
      } catch (cleanError) {
        console.error("[updateUserAnalytics] Failed to parse cleaned JSON:", cleanError);
        throw new Error("Failed to parse AI response");
      }
    }

    // Prepare data for database
    const analyticsData = {
      userId: userid,
      courseId: courseid,
      topicId: topicid,
      questionId: questionid,
      questionType: questiontype,
      weakness: analysisData.weakness,
      weakTopics: analysisData.weakTopics,
      strongTopics: analysisData.strongTopics,
      suggestions: analysisData.suggestions,
      currentKnowledge: analysisData.currentKnowledge,
    };

    // Add startingKnowledge only for new records
    if (!hasPreviousData && analysisData.startingKnowledge) {
      analyticsData.startingKnowledge = analysisData.startingKnowledge;
    }

    // Update or insert based on existing data
    if (hasPreviousData) {
      console.log("[updateUserAnalytics] Updating existing analytics record...");
      await db
        .update(Analytics)
        .set(analyticsData)
        .where(
          and(
            eq(Analytics.topicId, topicid),
            eq(Analytics.courseId, courseid),
            eq(Analytics.questionId, questionid),
            eq(Analytics.questionType, questiontype),
            eq(Analytics.userId, userid)
          )
        );
    } else {
      console.log("[updateUserAnalytics] Creating new analytics record...");
      await db.insert(Analytics).values(analyticsData);
    }

    console.log("[updateUserAnalytics] Analytics update completed successfully");
    return true;
  } catch (error) {
    console.error("[updateUserAnalytics] Error in analytics update:", error);
    throw error;
  }
}

// For testing the JSON extraction logic
function extractJsonFromText(text) {
  // Check if response contains a code block with JSON
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    return jsonBlockMatch[1].trim();
  }
  
  // Try to find JSON object in the text (anything between { and })
  if (!text.trim().startsWith('{')) {
    const jsonObjectMatch = text.match(/{[\s\S]*?}/);
    if (jsonObjectMatch) {
      return jsonObjectMatch[0];
    }
  }
  
  return text;
}

// Test with the example from the error message
const testResponse = `\`\`\`json
{
  "weakness": "The code uses a fixed-size array \`freq[MAX]\` to store frequencies, which relies on adding an offset to handle negative numbers. While it works within the constraints provided, this approach might not be robust for significantly different input ranges or if the offset is not chosen carefully. The string parsing logic in \`main\` is also a bit complex and could be simplified for better readability and maintainability. Also, the \`main\` function deals with string parsing, which increases the complexity of the program.",
  "weakTopics": [
    "Array size limitations",
    "String parsing",
    "Using a fixed offset instead of a more flexible data structure"
  ],
  "strongTopics": [
    "Array traversal",
    "Frequency counting",
    "Applying constraints to array problems"
  ],
  "suggestions": [
    "Consider using a \`HashMap\` (or similar data structure) in languages like C++ or Python to store frequencies. This removes the fixed-size array limitation and handles negative numbers automatically.",
    "Simplify the string parsing in \`main\`. Consider using standard library functions or regular expressions for more robust and readable parsing.",
    "Instead of using \`strtok\`, which can be problematic, explore alternative string parsing techniques. In C++, you could use \`std::stringstream\` to read values more safely and easily.",
    "Write the solution using C++ and the standard library to improve readability and efficiency."
  ],
  "startingKnowledge": 65,
  "currentKnowledge": 75
}
\`\`\``;

console.log("Testing JSON extraction:");
const extractedJson = extractJsonFromText(testResponse);
console.log("Extracted JSON:", extractedJson);
try {
  const parsedJson = JSON.parse(extractedJson);
  console.log("Successfully parsed JSON:", parsedJson.weakness.substring(0, 30) + "...");
} catch (e) {
  console.error("Failed to parse extracted JSON:", e);
}