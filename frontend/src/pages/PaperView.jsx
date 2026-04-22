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
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar user={user} />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-sm" style={{ color: "#777169" }}>
            No paper found.{" "}
            <button onClick={() => navigate("/new")} className="text-black underline">
              Create one
            </button>
          </p>
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
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar user={user} />

      <main className="max-w-2xl mx-auto px-6 py-14">
        {loading ? (
          <Loader />
        ) : (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm mb-8 flex items-center gap-1"
              style={{ color: "#777169" }}
            >
              ← Back to Dashboard
            </button>

            <div
              className="bg-white rounded-2xl p-8"
              style={{
                boxShadow:
                  "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
              }}
            >
              <h1
                className="text-3xl text-black mb-6"
                style={{ fontWeight: 300, letterSpacing: "-0.6px", lineHeight: 1.2 }}
              >
                {result.title}
              </h1>

              <div className="prose-paper">
                <ReactMarkdown>{result.abstract}</ReactMarkdown>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3 mt-6">
                  {error}
                </p>
              )}

              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleResume}
                  className="px-5 py-2.5 rounded-full text-sm text-black"
                  style={{
                    background: "rgba(245,242,239,0.8)",
                    boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
                  }}
                >
                  ↺ Resume / Continue
                </button>
                <button
                  onClick={() => navigate("/new")}
                  className="px-5 py-2.5 rounded-full bg-black text-white text-sm"
                  style={{ fontWeight: 500 }}
                >
                  New Paper
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
