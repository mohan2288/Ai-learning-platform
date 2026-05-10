import { generateAIResponse } from "../services/geminiService.js";

const parseJsonResponse = (text) => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

export const generateMCQ = async (req, res) => {
  try {
    const { topic, difficulty = "Beginner", count = 5 } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: "Topic is required" });
    }

    const prompt = `
Generate ${count} multiple choice questions for students.
Topic: ${topic}
Difficulty: ${difficulty}
Return only valid JSON in this shape:
[
  {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "string",
    "difficulty": "Beginner | Intermediate | Advanced",
    "explanation": "string"
  }
]
`;

    const response = await generateAIResponse(prompt);
    let questions = response;

    try {
      questions = parseJsonResponse(response);
    } catch (error) {
      questions = [{ question: response, options: [], correctAnswer: "", difficulty, explanation: "" }];
    }

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const { message, context = "" } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const prompt = `
You are a clear, supportive AI learning assistant.
Give practical explanations, small examples, and next steps.
Context: ${context || "General learning question"}
Student question: ${message}
`;

    const response = await generateAIResponse(prompt);

    res.json({
      success: true,
      data: {
        role: "assistant",
        text: response,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
