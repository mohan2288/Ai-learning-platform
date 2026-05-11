import { GoogleGenerativeAI } from "@google/generative-ai";

export class AIServiceError extends Error {
  constructor(message, statusCode = 500, details = {}) {
    super(message);
    this.name = "AIServiceError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

const getRetryAfterSeconds = (message) => {
  const retryMatch = message.match(/retryDelay":"(\d+)s"/) || message.match(/retry in ([\d.]+)s/i);
  return retryMatch ? Math.ceil(Number(retryMatch[1])) : undefined;
};

const normalizeGeminiError = (error) => {
  const message = error?.message || "Unable to generate AI response";
  const status = error?.status || error?.statusCode;
  const isQuotaError =
    status === 429 ||
    message.includes("429 Too Many Requests") ||
    message.toLowerCase().includes("quota exceeded");

  if (isQuotaError) {
    const retryAfterSeconds = getRetryAfterSeconds(message);

    return new AIServiceError(
      "AI quota exceeded. Please wait a moment and try again, or configure billing/use another Gemini API key.",
      429,
      { retryAfterSeconds }
    );
  }

  return new AIServiceError("Unable to generate AI response right now.", 502);
};

export const generateAIResponse = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new AIServiceError("GEMINI_API_KEY is not configured", 500);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash-lite",
    });

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    throw normalizeGeminiError(error);
  }
};
