import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/dashboard" className="font-black text-slate-950">AI Learn</Link>
          <Link to="/" className="text-sm font-semibold text-blue-700">Sign in</Link>
        </div>
      </nav>
      <Outlet />
    </main>
  );
};

export default MainLayout;
