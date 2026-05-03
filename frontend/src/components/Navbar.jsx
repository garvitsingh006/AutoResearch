import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY.current || y < 10);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    navigate("/login");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-black px-4 py-3 flex items-center justify-between transition-transform duration-300 ease-in-out ${visible ? "translate-y-0" : "-translate-y-full"}`}>
      <span
        onClick={() => navigate("/dashboard")}
        className="cursor-pointer font-archivo text-lg text-white uppercase tracking-tighter hover:text-[#EBFF00] transition-colors"
      >
        AutoResearch
      </span>

      {user && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/new")}
            className="font-bebas text-base bg-[#FF0055] text-white border-2 border-[#FF0055] px-3 py-1 hover:bg-black hover:border-white transition-colors"
          >
            NEW
          </button>
          <button
            onClick={handleLogout}
            className="font-bebas text-base border-2 border-white text-white px-3 py-1 hover:bg-white hover:text-black transition-colors"
          >
            LOGOUT
          </button>
        </div>
      )}
    </nav>
  );
}
