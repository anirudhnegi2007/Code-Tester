// ─── NAVBAR ──────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({ onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "Practice", href: "#practice" },
    { label: "How It Works", href: "#how" },
    { label: "Dashboard", href: "#stats" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[60px] px-8 flex items-center justify-between border-b backdrop-blur-xl transition-all duration-300
        ${scrolled 
          ? "bg-[#080c10]/95 border-zinc-800" 
          : "bg-[#080c10]/80 border-zinc-900"
        }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 font-mono font-bold text-sm text-white">
        <span className="w-2 h-2 bg-green-500 rounded-full" />
        Code_Tester
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-zinc-400 font-mono text-sm transition-colors duration-200 hover:text-white"
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <Link to="/login">
          <button
            onClick={() => onSignup("Welcome back!")}
            className="px-4 py-1.5 rounded-md border border-zinc-700 text-zinc-400 text-sm font-mono transition-all duration-200 hover:border-zinc-500 hover:text-white"
          >
            Login
          </button>
        </Link>

        <Link to="/signup">
          <button
            onClick={() => onSignup("Account created! Welcome aboard 🎉")}
            className="px-4 py-1.5 rounded-md bg-green-500 text-black text-sm font-mono font-semibold transition-all duration-200 hover:bg-green-400 hover:-translate-y-[1px]"
          >
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;