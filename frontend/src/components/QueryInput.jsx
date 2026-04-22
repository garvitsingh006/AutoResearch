import { useState } from "react";

export default function QueryInput({ onSubmit, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSubmit(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-2xl">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your research topic…"
        rows={3}
        disabled={loading}
        className="w-full resize-none rounded-2xl border border-[#e5e5e5] bg-white px-5 py-3 text-base text-black outline-none focus:ring-1 focus:ring-black/10 disabled:opacity-50"
        style={{ letterSpacing: "0.16px", lineHeight: 1.6 }}
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="self-end px-6 py-2.5 rounded-full bg-black text-white text-sm disabled:opacity-40"
        style={{ fontWeight: 500 }}
      >
        {loading ? "Generating…" : "Generate Paper"}
      </button>
    </form>
  );
}
