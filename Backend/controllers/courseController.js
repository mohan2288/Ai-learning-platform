import Course from "../models/Course.js";
import Progress from "../models/Progress.js";

export const getCourses = async (req, res) => {
  try {
    const { search = "", category = "", level = "" } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    const courses = await Course.find(query)
      .populate("trainer", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("trainer", "name email");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      trainer: req.user._id,
    });

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only the trainer can edit this course" });
    }

    Object.assign(course, req.body);
    const updatedCourse = await course.save();

    res.json({ success: true, data: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only the trainer can delete this course" });
    }

    await Progress.deleteMany({ courseId: course._id });
    await course.deleteOne();

    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (!course.enrolledStudents.some((studentId) => studentId.toString() === req.user._id.toString())) {
      course.enrolledStudents.push(req.user._id);
      await course.save();
    }

    await Progress.findOneAndUpdate(
      { userId: req.user._id, courseId: course._id },
      { $setOnInsert: { completedLessons: [], percentage: 0 } },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
