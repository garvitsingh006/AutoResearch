import { useState } from "react";

export default function QueryInput({ onSubmit, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSubmit(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ENTER YOUR RESEARCH TOPIC…"
        rows={4}
        disabled={loading}
        className="bauhaus-input resize-none text-base leading-relaxed"
        style={{ minHeight: "120px" }}
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="font-inter font-bold text-xs text-white/30 uppercase tracking-widest">
          {query.length > 0 ? `${query.length} chars` : "Be specific for best results"}
        </p>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full sm:w-auto font-bebas text-xl bg-[#FF0055] text-white border-4 border-[#FF0055] px-8 py-3 hover:bg-black hover:border-white transition-all shadow-[6px_6px_0px_0px_rgba(255,0,85,0.4)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-40 disabled:pointer-events-none"
        >
          {loading ? "GENERATING…" : "GENERATE PAPER →"}
        </button>
      </div>
    </form>
  );
}
