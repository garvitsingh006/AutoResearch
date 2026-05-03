import { useNavigate } from "react-router-dom";

export default function PaperCard({ paper }) {
  const navigate = useNavigate();
  const raw = paper.created_at?.endsWith("Z") ? paper.created_at : paper.created_at + "Z";
  const date = new Date(raw).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div
      onClick={() => navigate("/paper", { state: { paper } })}
      className="bg-black border-4 border-white/20 p-6 cursor-pointer transition-all hover:-translate-y-1 hover:-translate-x-1 hover:border-[#EBFF00] hover:shadow-[8px_8px_0px_0px_rgba(235,255,0,0.3)]"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-bebas text-2xl text-white leading-tight line-clamp-2">
          {paper.title}
        </h3>
        <span className="font-inter font-bold text-xs text-white/30 uppercase tracking-widest whitespace-nowrap mt-1 shrink-0">
          {date}
        </span>
      </div>
      <p className="font-inter text-sm text-white/50 line-clamp-2 leading-relaxed mb-4">
        {paper.abstract}
      </p>
      <div className="font-bebas text-sm text-[#FF0055] tracking-widest">
        OPEN PAPER →
      </div>
    </div>
  );
}
