import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function main(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });
    
    // Extract the text from the first candidate
    const text = response.candidates[0].content.parts[0].text;
    return text;
  } catch (error) {
    console.error("Error in Gemini API call:", error);
    throw error;
  }
}