import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-black border-b-4 border-[#FF0055] px-6 py-4 flex items-center justify-between">
      <span
        onClick={() => navigate("/dashboard")}
        className="cursor-pointer font-archivo text-xl text-white uppercase tracking-tighter hover:text-[#EBFF00] transition-colors"
      >
        AutoResearch
      </span>

      {user && (
        <div className="flex items-center gap-4">
          <span className="font-inter font-bold text-sm text-white/50 uppercase tracking-wider">
            {user.name}
          </span>
          <button
            onClick={() => navigate("/new")}
            className="font-bebas text-lg bg-[#FF0055] text-white border-2 border-[#FF0055] px-5 py-1.5 hover:bg-black hover:border-white transition-colors"
          >
            NEW PAPER
          </button>
          <button
            onClick={handleLogout}
            className="font-bebas text-lg border-2 border-white text-white px-5 py-1.5 hover:bg-white hover:text-black transition-colors"
          >
            LOGOUT
          </button>
        </div>
      )}
    </nav>
  );
}
