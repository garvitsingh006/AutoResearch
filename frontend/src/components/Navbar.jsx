import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    navigate("/login");
  };

  return (
    <nav
      style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
      className="sticky top-0 z-50 bg-white px-6 py-3 flex items-center justify-between"
    >
      <span
        onClick={() => navigate("/dashboard")}
        className="cursor-pointer text-black text-lg"
        style={{ fontWeight: 300, letterSpacing: "-0.3px" }}
      >
        AutoResearch
      </span>

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: "#777169" }}>
            {user.name}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-1.5 rounded-full bg-black text-white"
            style={{ fontWeight: 500 }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
