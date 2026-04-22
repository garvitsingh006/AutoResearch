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
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar user={user} />

      <main className="max-w-2xl mx-auto px-6 py-16 flex flex-col items-center">
        {!loading ? (
          <>
            <h1
              className="text-4xl text-black mb-3 text-center"
              style={{ fontWeight: 300, letterSpacing: "-0.8px", lineHeight: 1.08 }}
            >
              New Research Paper
            </h1>
            <p
              className="text-base mb-10 text-center"
              style={{ color: "#4e4e4e", letterSpacing: "0.16px" }}
            >
              Enter a topic and the AI pipeline will plan, research, and write a full paper.
            </p>

            <QueryInput onSubmit={handleSubmit} loading={loading} />

            {error && (
              <div className="mt-6 w-full max-w-2xl">
                <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">
                  {error}
                </p>
                <p className="text-xs mt-2 text-center" style={{ color: "#777169" }}>
                  If this topic was previously started, submitting again will resume from the last checkpoint.
                </p>
                <button
                  onClick={() => setError("")}
                  className="mt-3 mx-auto block px-5 py-2 rounded-full text-sm border border-[#e5e5e5] bg-white"
                  style={{
                    boxShadow: "rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px",
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full max-w-sm">
            <h2
              className="text-2xl text-black mb-2 text-center"
              style={{ fontWeight: 300, letterSpacing: "-0.4px" }}
            >
              Generating your paper
            </h2>
            <p className="text-sm text-center mb-8" style={{ color: "#777169" }}>
              This takes a minute or two. Hang tight.
            </p>
            <Loader />
          </div>
        )}
      </main>
    </div>
  );
}
