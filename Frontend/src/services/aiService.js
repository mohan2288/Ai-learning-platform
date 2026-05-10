import api from "./api";

export const generateMCQ = (data) => api.post("/ai/generate-mcq", data);

export const chatWithAI = (data) => api.post("/ai/chat", data);
