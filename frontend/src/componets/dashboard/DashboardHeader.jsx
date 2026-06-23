import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { launchConfetti } from "../ui/Confetti.jsx";

export default function DashboardHeader({ onCreateSession }) {
  return (
    <>
      <DashboardNavbar onCreateSession={onCreateSession} />
      <WelcomeSection username="Anirudh" onCreateSession={onCreateSession} />
    </>
  );
}

function DashboardNavbar({ onCreateSession }) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[60px] px-8 flex items-center justify-between border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "bg-[#080c10]/95 border-zinc-800" : "bg-[#080c10]/80 border-zinc-900"
      }`}
    >
      <div className="flex items-center gap-2 font-mono font-bold text-sm text-white/90">
        <span className="w-2 h-2 bg-green-500 rounded-full" />
        Code_Tester
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link to="/dashboard" className="text-green-500 font-mono text-sm">
          Dashboard
        </Link>
        <Link to="/problems" className="text-zinc-400 font-mono text-sm transition-colors duration-200 hover:text-white">
          Problems
        </Link>
        <a href="#" className="text-zinc-400 font-mono text-sm transition-colors duration-200 hover:text-white">
          Sessions
        </a>
        <a href="#" className="text-zinc-400 font-mono text-sm transition-colors duration-200 hover:text-white">
          Practice
        </a>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            launchConfetti();
            onCreateSession("New interview room created ✨");
          }}
          className="hidden sm:flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-mono font-semibold text-sm px-4 py-1.5 rounded-md transition-all duration-200 active:scale-[0.97]"
        >
          ▶ New Session
        </button>

        <button
          className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-md flex items-center justify-center text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
          title="Dark theme"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm0 16a7 7 0 0 1 0-14 7 7 0 0 1 0 14z" />
          </svg>
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 bg-green-500 rounded-md flex items-center justify-center text-black font-mono font-bold text-sm hover:bg-green-400 transition-colors"
          >
            AD
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-2 text-sm font-mono z-50">
              <a href="#" className="flex items-center gap-3 px-5 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white">👤 View Profile</a>
              <a href="#" className="flex items-center gap-3 px-5 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white">⚙️ Settings</a>
              <a href="#" className="flex items-center gap-3 px-5 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white">💳 Billing</a>
              <div className="h-px bg-zinc-800 my-1 mx-4" />
              <a href="#" className="flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-zinc-900">🚪 Logout</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function WelcomeSection({ username, onCreateSession }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-12 bg-zinc-950">
      <div className="absolute inset-0 bg-[linear-gradient(#27272a_1px,transparent_1px),linear-gradient(90deg,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-10 pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="reveal max-w-7xl mx-auto px-6 relative z-10 flex flex-wrap items-end justify-between gap-8">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-500 text-sm font-mono px-5 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Interview dashboard
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] tracking-tighter text-white/90">
            Welcome back, <span className="text-green-500">{username}</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
            Ready to level up your coding skills today?
          </p>
        </div>

        <button
          onClick={() => {
            launchConfetti();
            onCreateSession("Interview room opened — share the link!");
          }}
          className="bg-green-500 hover:bg-green-400 text-black font-mono font-semibold text-base px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-200 active:scale-[0.97] shadow-lg shadow-green-500/30"
        >
          <span>⚡</span>
          Create New Session
        </button>
      </div>
    </section>
  );
}
