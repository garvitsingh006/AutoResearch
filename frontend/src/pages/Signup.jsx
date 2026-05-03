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
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <div
            onClick={() => navigate("/")}
            className="font-archivo text-2xl text-white uppercase tracking-tighter cursor-pointer hover:text-[#EBFF00] transition-colors inline-block mb-10"
          >
            AutoResearch
          </div>
          <h1 className="font-bebas text-7xl md:text-8xl leading-none text-white mb-2">
            JOIN THE<br />
            <span className="text-[#EBFF00]">MACHINE.</span>
          </h1>
          <p className="font-inter font-bold text-sm text-white/50 uppercase tracking-widest">
            Start generating research papers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {loading ? "CREATING…" : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="font-inter font-bold text-sm text-white/40 uppercase tracking-widest mt-8 border-t-4 border-white/10 pt-6">
          Already a member?{" "}
          <Link to="/login" className="text-[#FF0055] hover:text-white transition-colors">
            SIGN IN →
          </Link>
        </p>
      </div>
    </div>
  );
}
