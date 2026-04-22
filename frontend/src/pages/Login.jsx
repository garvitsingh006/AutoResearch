import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.login(form);
      const user = await api.me();
      onAuth(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-8"
        style={{
          boxShadow:
            "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
        }}
      >
        <h1
          className="text-3xl text-black mb-1"
          style={{ fontWeight: 300, letterSpacing: "-0.6px" }}
        >
          Welcome back
        </h1>
        <p className="text-sm mb-8" style={{ color: "#777169", letterSpacing: "0.14px" }}>
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-[#e5e5e5] px-4 py-2.5 text-sm text-black outline-none focus:ring-1 focus:ring-black/10"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-[#e5e5e5] px-4 py-2.5 text-sm text-black outline-none focus:ring-1 focus:ring-black/10"
          />

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-black text-white text-sm disabled:opacity-40"
            style={{ fontWeight: 500 }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: "#777169" }}>
          Don't have an account?{" "}
          <Link to="/signup" className="text-black underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
