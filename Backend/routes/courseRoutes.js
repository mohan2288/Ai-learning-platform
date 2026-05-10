import express from "express";
import {
  createCourse,
  deleteCourse,
  enrollCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "../controllers/courseController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { requireFields } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", protect, authorize("trainer"), requireFields("title", "description", "category"), createCourse);
router.post("/:id/enroll", protect, authorize("student"), enrollCourse);
router.put("/:id", protect, authorize("trainer"), updateCourse);
router.delete("/:id", protect, authorize("trainer"), deleteCourse);

export default router;
