import express from "express";
import { getMyProgress, getProgress, updateProgress } from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyProgress);
router.get("/:courseId", protect, getProgress);
router.post("/update", protect, updateProgress);

export default router;
