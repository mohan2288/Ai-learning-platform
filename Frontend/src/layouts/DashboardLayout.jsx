import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiBookOpen, FiCpu, FiGrid, FiLogOut, FiPlusCircle } from "react-icons/fi";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/courses", label: "Courses", icon: FiBookOpen },
    { to: "/assistant", label: "AI Assistant", icon: FiCpu },
  ];

  if (user?.role === "trainer") {
    links.push({ to: "/trainer/create", label: "Create", icon: FiPlusCircle });
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <div className="mb-8">
          <p className="text-xl font-black">AI Learn</p>
          <p className="text-sm text-slate-500">{user?.name} · {user?.role}</p>
        </div>
        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="absolute bottom-5 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
          <FiLogOut /> Logout
        </button>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <p className="font-black">AI Learn</p>
            <button onClick={handleLogout} className="text-sm font-semibold text-red-600">Logout</button>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
