import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import QueryInput from "../components/QueryInput";
import Loader from "../components/Loader";
import { api } from "../api";

export default function NewPaper({ user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (query) => {
    setError("");
    setLoading(true);
    try {
      const paper = await api.newPaper(query);
      navigate("/paper", { state: { paper } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-4 md:px-6 pt-20 pb-12">
        {!loading ? (
          <>
            <p className="font-inter font-bold text-xs text-[#FF0055] uppercase tracking-widest mb-4 pt-6">
              DEPLOY NEW PIPELINE
            </p>
            <h1 className="font-bebas text-5xl md:text-8xl text-white leading-none mb-2">
              NEW RESEARCH<br />
              <span className="text-[#EBFF00]">PAPER.</span>
            </h1>
            <p className="font-inter font-bold text-sm text-white/50 uppercase tracking-wide mb-10">
              Enter a topic and the AI pipeline will plan, research, and write a full paper.
            </p>

            <QueryInput onSubmit={handleSubmit} loading={loading} />

            {error && (
              <div className="mt-8 border-4 border-[#FF0055] bg-[#FF0055]/10 p-5">
                <p className="font-inter font-bold text-sm text-[#FF0055] uppercase tracking-wide mb-2">{error}</p>
                <p className="font-inter text-xs text-white/40 uppercase tracking-wide mb-4">
                  If this topic was previously started, submitting again will resume from the last checkpoint.
                </p>
                <button
                  onClick={() => setError("")}
                  className="font-bebas text-lg border-2 border-white text-white px-6 py-2 hover:bg-white hover:text-black transition-colors"
                >
                  TRY AGAIN
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full pt-6">
            <p className="font-inter font-bold text-xs text-[#FF0055] uppercase tracking-widest mb-4">
              PIPELINE ACTIVE
            </p>
            <h2 className="font-bebas text-5xl md:text-6xl text-white leading-none mb-2">
              GENERATING<br />
              <span className="text-[#EBFF00]">YOUR PAPER.</span>
            </h2>
            <p className="font-inter font-bold text-sm text-white/50 uppercase tracking-widest mb-12">
              This takes a minute or two. Hang tight.
            </p>
            <Loader />
          </div>
        )}
      </main>
    </div>
  );
}
