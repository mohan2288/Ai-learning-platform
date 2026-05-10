// AI routes will be defined here.

import express from "express";
import { chatWithAI, generateMCQ } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-mcq", protect, generateMCQ);
router.post("/chat", protect, chatWithAI);

export default router;
