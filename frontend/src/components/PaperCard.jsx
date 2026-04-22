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
      className="bg-white rounded-2xl p-6 cursor-pointer transition-transform hover:-translate-y-0.5"
      style={{
        boxShadow:
          "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
      }}
    >
      <h3
        className="text-lg text-black mb-2 line-clamp-2"
        style={{ fontWeight: 300, letterSpacing: "-0.2px" }}
      >
        {paper.title}
      </h3>
      <p
        className="text-sm line-clamp-3 mb-4"
        style={{ color: "#777169", letterSpacing: "0.14px", lineHeight: 1.6 }}
      >
        {paper.abstract}
      </p>
      <p className="text-xs" style={{ color: "#777169" }}>{date}</p>
    </div>
  );
}
