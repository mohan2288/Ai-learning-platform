import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import { calculatePercentage } from "../services/progressService.js";

export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    });

    res.json({
      success: true,
      data: progress || {
        courseId: req.params.courseId,
        completedLessons: [],
        percentage: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id })
      .populate("courseId", "title category level lessons duration thumbnail")
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId, completed = true } = req.body;

    if (!courseId || !lessonId) {
      return res.status(400).json({ success: false, message: "Course and lesson are required" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, courseId },
      { $setOnInsert: { completedLessons: [], percentage: 0 } },
      { upsert: true, new: true }
    );

    const lessonKey = lessonId.toString();
    const completedSet = new Set(progress.completedLessons.map((id) => id.toString()));

    if (completed) {
      completedSet.add(lessonKey);
    } else {
      completedSet.delete(lessonKey);
    }

    progress.completedLessons = Array.from(completedSet);
    progress.percentage = calculatePercentage(progress.completedLessons.length, course.lessons.length);
    await progress.save();

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
