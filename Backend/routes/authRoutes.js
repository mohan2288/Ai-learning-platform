// Auth routes will be defined here.

import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireFields } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/register", requireFields("name", "email", "password"), registerUser);
router.post("/login", requireFields("email", "password"), loginUser);
router.get("/profile", protect, getProfile);

export default router;
