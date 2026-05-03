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
            WELCOME<br />
            <span className="text-[#FF0055]">BACK.</span>
          </h1>
          <p className="font-inter font-bold text-sm text-white/50 uppercase tracking-widest">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            className="font-bebas text-2xl bg-[#FF0055] text-white border-4 border-[#FF0055] py-4 mt-2 hover:bg-black hover:border-white transition-colors shadow-[8px_8px_0px_0px_rgba(255,0,85,0.4)] disabled:opacity-40"
          >
            {loading ? "SIGNING IN…" : "SIGN IN"}
          </button>
        </form>

        <p className="font-inter font-bold text-sm text-white/40 uppercase tracking-widest mt-8 border-t-4 border-white/10 pt-6">
          No account?{" "}
          <Link to="/signup" className="text-[#EBFF00] hover:text-white transition-colors">
            CREATE ONE →
          </Link>
        </p>
      </div>
    </div>
  );
}
