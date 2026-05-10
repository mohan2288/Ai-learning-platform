import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { createCourse, getCourseById, updateCourse } from "../../services/courseService";
import { categories, levels } from "../../utils/constants";

const initialForm = {
  title: "",
  description: "",
  category: "Frontend",
  level: "Beginner",
  duration: "4h",
  thumbnail: "",
  lessons: [{ title: "Introduction", duration: "20m", videoUrl: "", content: "" }],
};

const CreateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const loadCourse = async () => {
      try {
        setLoading(true);
        const { data } = await getCourseById(id);
        const course = data.data;
        setForm({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "Frontend",
          level: course.level || "Beginner",
          duration: course.duration || "4h",
          thumbnail: course.thumbnail || "",
          lessons: course.lessons?.length ? course.lessons : initialForm.lessons,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load course");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id, isEditing, navigate]);

  const updateLesson = (index, field, value) => {
    const lessons = form.lessons.map((lesson, lessonIndex) => lessonIndex === index ? { ...lesson, [field]: value } : lesson);
    setForm({ ...form, lessons });
  };

  const addLesson = () => {
    setForm({ ...form, lessons: [...form.lessons, { title: "", duration: "15m", videoUrl: "", content: "" }] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (isEditing) {
        await updateCourse(id, form);
        toast.success("Course updated");
        navigate("/courses");
      } else {
        await createCourse(form);
        toast.success("Course created");
        setForm({ ...initialForm, category: form.category, level: form.level });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Unable to ${isEditing ? "update" : "create"} course`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Loading course...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-black">{isEditing ? "Edit Course" : "Create Course"}</h1>
      <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">
            Title
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          </label>
          <label className="text-sm font-semibold">
            Duration
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} />
          </label>
          <label className="text-sm font-semibold">
            Category
            <select className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Level
            <select className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}>
              {levels.map((level) => <option key={level}>{level}</option>)}
            </select>
          </label>
        </div>
        <label className="mt-4 block text-sm font-semibold">
          Description
          <textarea className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Thumbnail URL
          <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" value={form.thumbnail} onChange={(event) => setForm({ ...form, thumbnail: event.target.value })} />
        </label>
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-xl font-black">Lessons</h2>
          <button type="button" onClick={addLesson} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold">Add lesson</button>
        </div>
        <div className="mt-4 space-y-4">
          {form.lessons.map((lesson, index) => (
            <div key={index} className="rounded-lg border border-slate-200 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px]">
                <input className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Lesson title" value={lesson.title} onChange={(event) => updateLesson(index, "title", event.target.value)} required />
                <input className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Duration" value={lesson.duration} onChange={(event) => updateLesson(index, "duration", event.target.value)} />
              </div>
              <textarea className="mt-3 min-h-20 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Lesson content" value={lesson.content} onChange={(event) => updateLesson(index, "content", event.target.value)} />
            </div>
          ))}
        </div>
        <button disabled={saving} className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
          {saving ? "Saving..." : isEditing ? "Update course" : "Publish course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
