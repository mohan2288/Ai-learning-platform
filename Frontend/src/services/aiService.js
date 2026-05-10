import api from "./api";

export const generateMCQ = (data) => api.post("api/ai/generate-mcq", data);

export const chatWithAI = (data) => api.post("api/ai/chat", data);
