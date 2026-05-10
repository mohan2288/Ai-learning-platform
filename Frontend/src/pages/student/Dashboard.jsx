import { Link } from "react-router-dom";
import { FiBookOpen, FiCpu, FiTrendingUp, FiUsers } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useCourses from "../../hooks/useCourses";

const Dashboard = () => {
  const { user } = useAuth();
  const { courses, loading } = useCourses({});
  const enrolledCount = courses.filter((course) => course.enrolledStudents?.includes(user?._id)).length;

  const stats = [
    { label: "Courses", value: courses.length, icon: FiBookOpen, color: "text-blue-700" },
    { label: user?.role === "trainer" ? "Learners" : "Enrolled", value: user?.role === "trainer" ? courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0) : enrolledCount, icon: FiUsers, color: "text-emerald-700" },
    { label: "AI Tools", value: 2, icon: FiCpu, color: "text-indigo-700" },
    { label: "Focus", value: "92%", icon: FiTrendingUp, color: "text-rose-700" },
  ];

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="rounded-lg bg-slate-950 p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">{user?.role} workspace</p>
        <h1 className="mt-3 text-3xl font-black sm:text-5xl">Welcome, {user?.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-300">Manage courses, generate quizzes, and keep learning momentum visible from one focused dashboard.</p>
      </div>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-5">
            <Icon className={`text-2xl ${color}`} />
            <p className="mt-4 text-3xl font-black">{loading ? "-" : value}</p>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black">Continue Learning</h2>
          <div className="mt-4 space-y-3">
            {(courses.slice(0, 3)).map((course) => (
              <Link key={course._id} to={`/courses/${course._id}`} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:border-blue-200">
                <span>
                  <span className="block font-bold">{course.title}</span>
                  <span className="text-sm text-slate-500">{course.category} · {course.level}</span>
                </span>
                <span className="text-sm font-bold text-blue-700">Open</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black">AI Learning Lab</h2>
          <p className="mt-2 text-sm text-slate-500">Ask questions, simplify topics, and generate MCQs from any lesson topic.</p>
          <Link to="/assistant" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white">Open assistant</Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
