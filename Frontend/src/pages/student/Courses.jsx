import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";
import useCourses from "../../hooks/useCourses";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { categories, levels } from "../../utils/constants";
import { getCourseImage } from "../../utils/helpers";
import { deleteCourse } from "../../services/courseService";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";

const Courses = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const debouncedSearch = useDebounce(search);
  const filters = useMemo(() => ({ search: debouncedSearch, category, level }), [debouncedSearch, category, level]);
  const { user } = useAuth();
  const { courses, loading, error, setCourses } = useCourses(filters);

  const isTrainerCourse = (course) => {
    const trainerId = typeof course.trainer === "object" ? course.trainer?._id : course.trainer;
    return user?.role === "trainer" && trainerId === user?._id;
  };

  const handleDelete = async (course) => {
    const confirmed = window.confirm(`Delete "${course.title}"? This will also remove student progress for this course.`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteCourse(course._id);
      setCourses((currentCourses) => currentCourses.filter((item) => item._id !== course._id));
      toast.success("Course deleted");
    } catch (deleteError) {
      toast.error(deleteError.response?.data?.message || "Unable to delete course");
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Course Library</h1>
          <p className="mt-1 text-slate-500">Search by topic, category, and difficulty.</p>
        </div>
      </div>

      <section className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_180px]">
        <label className="relative">
          <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
          <input className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500" placeholder="Search courses" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <select className="rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={level} onChange={(event) => setLevel(event.target.value)}>
          <option value="">All levels</option>
          {levels.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </section>

      {error && <p className="mt-5 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {loading && <div className="mt-5"><Loader text="Loading courses..." /></div>}
      {!loading && courses.length === 0 && (
        <div className="mt-5">
          <EmptyState title="No courses found" message="Try a different search term, category, or level." />
        </div>
      )}

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <article key={course._id} className="overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
            <Link to={`/courses/${course._id}`}>
              <img className="h-44 w-full object-cover" src={getCourseImage(course)} alt="" />
            </Link>
            <div className="p-5">
              <Link to={`/courses/${course._id}`}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-700">
                  <span>{course.category}</span>
                  <span className="text-slate-300">/</span>
                  <span>{course.level}</span>
                </div>
                <h2 className="mt-3 text-xl font-black">{course.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{course.description}</p>
              </Link>
              <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-500">
                <span>{course.lessons?.length || 0} lessons</span>
                <span>{course.duration}</span>
              </div>
              {isTrainerCourse(course) && (
                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                  <Link to={`/trainer/courses/${course._id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                    <FiEdit2 /> Edit
                  </Link>
                  <button onClick={() => handleDelete(course)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50">
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Courses;
