import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PaperCard from "../components/PaperCard";
import { api } from "../api";

export default function Dashboard({ user }) {
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .me()
      .then((data) => setPapers(data.papers || []))
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1
            className="text-4xl text-black mb-2"
            style={{ fontWeight: 300, letterSpacing: "-0.8px", lineHeight: 1.08 }}
          >
            Hello, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-base" style={{ color: "#4e4e4e", letterSpacing: "0.16px" }}>
            What do you want to research today?
          </p>
        </div>

        <button
          onClick={() => navigate("/new")}
          className="mb-12 px-6 py-3 rounded-full text-white bg-black text-sm"
          style={{ fontWeight: 500 }}
        >
          + Create New Paper
        </button>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {papers.length > 0 && (
          <>
            <h2
              className="text-xl text-black mb-4"
              style={{ fontWeight: 300, letterSpacing: "-0.3px" }}
            >
              Past Papers
            </h2>
            <div className="flex flex-col gap-4">
              {papers.map((p) => (
                <PaperCard key={p.id} paper={p} />
              ))}
            </div>
          </>
        )}

        {fetching && (
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
            <p className="text-sm" style={{ color: "#777169" }}>Fetching your papers…</p>
          </div>
        )}

        {!fetching && papers.length === 0 && !error && (
          <p className="text-sm" style={{ color: "#777169" }}>
            No papers yet. Create your first one above.
          </p>
        )}
      </main>
    </div>
  );
}
