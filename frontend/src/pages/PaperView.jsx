import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { api } from "../api";
import Loader from "../components/Loader";
import ReactMarkdown from "react-markdown";

export default function PaperView({ user }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const paper = state?.paper;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(paper);

  if (!result) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar user={user} />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="font-bebas text-4xl text-white/30">NO PAPER FOUND</p>
          <button
            onClick={() => navigate("/new")}
            className="mt-6 font-bebas text-xl bg-[#FF0055] text-white border-4 border-[#FF0055] px-8 py-3 hover:bg-black hover:border-white transition-colors"
          >
            CREATE ONE →
          </button>
        </div>
      </div>
    );
  }

  const handleResume = async () => {
    setError("");
    setLoading(true);
    try {
      const updated = await api.newPaper(result.title);
      setResult(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-6 py-14">
        {loading ? (
          <div>
            <p className="font-inter font-bold text-sm text-[#FF0055] uppercase tracking-widest mb-4">
              PIPELINE ACTIVE
            </p>
            <h2 className="font-bebas text-5xl text-white mb-8">RESUMING PIPELINE…</h2>
            <Loader />
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="font-inter font-bold text-sm text-white/40 uppercase tracking-widest mb-10 flex items-center gap-2 hover:text-[#EBFF00] transition-colors"
            >
              ← BACK TO DASHBOARD
            </button>

            <div className="border-4 border-white/20 p-8 shadow-[8px_8px_0px_0px_rgba(255,0,85,0.3)]">
              <div className="border-b-4 border-[#FF0055] pb-6 mb-8">
                <p className="font-inter font-bold text-xs text-[#FF0055] uppercase tracking-widest mb-3">
                  RESEARCH OUTPUT
                </p>
                <h1 className="font-bebas text-4xl md:text-5xl text-white leading-tight">
                  {result.title}
                </h1>
              </div>

              <div className="prose-paper">
                <ReactMarkdown>{result.abstract}</ReactMarkdown>
              </div>

              {error && (
                <div className="border-4 border-[#FF0055] bg-[#FF0055]/10 px-4 py-3 mt-6">
                  <p className="font-inter font-bold text-sm text-[#FF0055] uppercase tracking-wide">{error}</p>
                </div>
              )}

              <div className="mt-10 flex gap-4 border-t-4 border-white/10 pt-8">
                <button
                  onClick={handleResume}
                  className="font-bebas text-xl border-4 border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors"
                >
                  ↺ RESUME / CONTINUE
                </button>
                <button
                  onClick={() => navigate("/new")}
                  className="font-bebas text-xl bg-[#FF0055] text-white border-4 border-[#FF0055] px-8 py-3 hover:bg-black hover:border-white transition-colors"
                >
                  NEW PAPER
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
