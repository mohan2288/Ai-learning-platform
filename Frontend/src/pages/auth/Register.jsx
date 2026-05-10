import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../../layouts/AuthLayout";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await register(form);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="w-full rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl">
        <h2 className="text-2xl font-black">Create account</h2>
        <p className="mt-1 text-sm text-slate-500">Choose a student or trainer workspace.</p>
        <label className="mt-6 block text-sm font-semibold">
          Name
          <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Email
          <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Password
          <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={6} />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {["student", "trainer"].map((role) => (
            <button key={role} type="button" onClick={() => setForm({ ...form, role })} className={`rounded-lg border px-4 py-3 text-sm font-bold capitalize ${form.role === role ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600"}`}>
              {role}
            </button>
          ))}
        </div>
        <button disabled={loading} className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60">
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already registered? <Link className="font-bold text-blue-700" to="/">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
