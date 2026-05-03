import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function Signup({ onAuth }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.signup(form);
      await api.login({ email: form.email, password: form.password });
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
    <div className="min-h-screen bg-black flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#EBFF00] flex-col justify-end p-16 relative overflow-hidden">
        <div
          onClick={() => navigate("/")}
          className="absolute top-16 left-16 font-archivo text-2xl text-black uppercase tracking-tighter cursor-pointer hover:text-[#FF0055] transition-colors z-10"
        >
          AutoResearch
        </div>

        <div className="z-10 relative">
          <h2 className="font-bebas text-[9rem] leading-none text-black">
            CREATE<br />ACCOUNT.
          </h2>
        </div>

        <div className="absolute bottom-0 right-0 font-archivo text-[22rem] leading-none text-black/10 select-none pointer-events-none translate-x-10 translate-y-10">
          ✦
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-12 md:px-24 lg:px-20 xl:px-32">
        <div
          onClick={() => navigate("/")}
          className="lg:hidden font-archivo text-xl text-white uppercase tracking-tighter cursor-pointer hover:text-[#EBFF00] transition-colors mb-16"
        >
          AutoResearch
        </div>

        <p className="font-inter font-bold text-[#EBFF00] uppercase tracking-widest text-xs mb-6">
          Start generating papers
        </p>
        <h1 className="font-bebas text-6xl md:text-7xl text-white leading-none mb-12">
          JOIN THE<br />MACHINE.
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-sm">
          <input
            type="text"
            placeholder="FULL NAME"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bauhaus-input"
          />
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
            className="font-bebas text-2xl bg-[#EBFF00] text-black border-4 border-[#EBFF00] py-4 mt-2 hover:bg-black hover:text-white hover:border-white transition-colors shadow-[8px_8px_0px_0px_rgba(235,255,0,0.3)] disabled:opacity-40"
          >
            {loading ? "CREATING…" : "CREATE ACCOUNT →"}
          </button>
        </form>

        <p className="font-inter font-bold text-sm text-white/30 uppercase tracking-widest mt-10">
          Already a member?{" "}
          <Link to="/login" className="text-[#FF0055] hover:text-white transition-colors">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
