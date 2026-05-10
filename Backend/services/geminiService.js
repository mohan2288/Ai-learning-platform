import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateAIResponse = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash-lite",
  });

  const result = await model.generateContent(prompt);

  return result.response.text();
};
