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
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#FF0055] flex-col justify-end p-16 relative overflow-hidden">
        <div
          onClick={() => navigate("/")}
          className="absolute top-16 left-16 font-archivo text-2xl text-white uppercase tracking-tighter cursor-pointer hover:text-black transition-colors z-10"
        >
          AutoResearch
        </div>

        <div className="z-10 relative">
          <p className="font-inter font-black text-white/60 uppercase tracking-widest text-sm leading-relaxed mb-12 max-w-xs">
            Multi-agent research.<br />Written by machines.<br />Powered by LangGraph.
          </p>
          <h2 className="font-bebas text-[10rem] leading-none text-white">
            WELCOME <br /> BACK
          </h2>
        </div>

        <div className="absolute bottom-0 right-0 font-archivo text-[22rem] leading-none text-white/10 select-none pointer-events-none translate-x-10 translate-y-10">
          ↗
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-24 lg:px-20 xl:px-32">
        <div
          onClick={() => navigate("/")}
          className="lg:hidden font-archivo text-xl text-white uppercase tracking-tighter cursor-pointer hover:text-[#EBFF00] transition-colors mb-10"
        >
          AutoResearch
        </div>

        <p className="font-inter font-bold text-[#FF0055] uppercase tracking-widest text-xs mb-4">
          Welcome back
        </p>
        <h1 className="font-bebas text-5xl md:text-7xl text-white leading-none mb-8">
          SIGN IN TO<br />YOUR ACCOUNT.
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
          <input
            type="email"
            placeholder="EMAIL"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bauhaus-input"
          />
          <input
            type="password"
            placeholder="PASSWORD"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bauhaus-input"
          />

          {error && (
            <div className="border-4 border-[#FF0055] bg-[#FF0055]/10 px-4 py-3">
              <p className="font-inter font-bold text-sm text-[#FF0055] uppercase tracking-wide">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="font-bebas text-xl bg-[#FF0055] text-white border-4 border-[#FF0055] py-3 mt-2 hover:bg-black hover:border-white transition-colors shadow-[8px_8px_0px_0px_rgba(255,0,85,0.4)] disabled:opacity-40"
          >
            {loading ? "SIGNING IN…" : "SIGN IN →"}
          </button>
        </form>

        <p className="font-inter font-bold text-sm text-white/30 uppercase tracking-widest mt-8">
          No account?{" "}
          <Link to="/signup" className="text-[#EBFF00] hover:text-white transition-colors">
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
