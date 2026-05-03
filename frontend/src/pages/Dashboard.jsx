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
    <div className="min-h-screen bg-black">
      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12 border-b-4 border-[#FF0055] pb-10">
          <p className="font-inter font-bold text-sm text-[#FF0055] uppercase tracking-widest mb-3">
            OPERATOR DASHBOARD
          </p>
          <h1 className="font-bebas text-6xl md:text-8xl text-white leading-none">
            HELLO,{" "}
            <span className="text-[#EBFF00]">
              {user?.name?.split(" ")[0]?.toUpperCase()}.
            </span>
          </h1>
          <p className="font-inter font-bold text-white/50 uppercase tracking-wide mt-3">
            What do you want to research today?
          </p>
        </div>

        <button
          onClick={() => navigate("/new")}
          className="mb-16 font-bebas text-2xl bg-[#FF0055] text-white border-4 border-[#FF0055] px-10 py-4 hover:bg-black hover:border-white transition-all shadow-[8px_8px_0px_0px_rgba(255,0,85,0.4)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          + NEW RESEARCH PAPER
        </button>

        {error && (
          <div className="border-4 border-[#FF0055] bg-[#FF0055]/10 px-4 py-3 mb-8">
            <p className="font-inter font-bold text-sm text-[#FF0055] uppercase tracking-wide">{error}</p>
          </div>
        )}

        {papers.length > 0 && (
          <>
            <h2 className="font-bebas text-4xl text-white mb-6 flex items-center gap-4">
              <span className="text-[#FF0055]">▶</span> PAST PAPERS
            </h2>
            <div className="flex flex-col gap-4">
              {papers.map((p) => (
                <PaperCard key={p.id} paper={p} />
              ))}
            </div>
          </>
        )}

        {fetching && (
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 border-4 border-[#EBFF00] border-t-transparent animate-spin" />
            <p className="font-inter font-bold text-sm text-white/50 uppercase tracking-widest">
              Fetching your papers…
            </p>
          </div>
        )}

        {!fetching && papers.length === 0 && !error && (
          <div className="border-4 border-white/10 p-10 text-center">
            <p className="font-bebas text-3xl text-white/30">NO PAPERS YET</p>
            <p className="font-inter font-bold text-sm text-white/30 uppercase tracking-widest mt-2">
              Create your first one above.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
