import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// SHARED IMPORTS (already created in your project)
// Adjust paths if needed

import Toast from "../componets/ui/Toast.jsx";
import { launchConfetti } from "../componets/ui/Confetti.jsx";

// ─────────────────────────────────────────────────────────────

// useReveal Hook – now pure Tailwind (no global CSS needed)
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-6");
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => {
      // Add Tailwind reveal animation classes once
      el.classList.add("opacity-0", "translate-y-6", "transition-all", "duration-700", "ease-out");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

// useCountUp Hook – unchanged (keeps the nice counting animation)
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = Math.ceil(duration / 16);
        const increment = target / steps;
        let current = 0;

        const interval = setInterval(() => {
          current = Math.min(current + increment, target);
          setCount(Math.round(current));
          if (current >= target) clearInterval(interval);
        }, 16);
      }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [ref, count];
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD NAVBAR
// ─────────────────────────────────────────────────────────────
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
      className={`fixed top-0 left-0 right-0 z-50 h-16 px-8 flex items-center justify-between transition-all duration-300 ${
        scrolled ? "bg-[#080c10]/95 backdrop-blur-xl" : "bg-[#080c10]/90 backdrop-blur-md"
      } border-b border-[#30363d]`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 font-mono text-xl font-bold">
        <span className="w-2.5 h-2.5 bg-[#39d353] rounded-full animate-pulse" />
        Code_Tester
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8 font-mono text-sm">
        <a href="#" className="text-[#39d353] relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:bg-[#39d353]">
          Dashboard
        </a>
        <a href="#" className="text-[#8b949e] hover:text-white transition-colors">
          Problems
        </a>
        <a href="#" className="text-[#8b949e] hover:text-white transition-colors">
          Sessions
        </a>
        <a href="#" className="text-[#8b949e] hover:text-white transition-colors">
          Practice
        </a>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* New Session Button */}
        <button
          onClick={() => {
            launchConfetti();
            onCreateSession("New interview room created ✨");
          }}
          className="flex items-center gap-2 bg-[#39d353] hover:bg-[#5bdf6b] text-[#080c10] font-mono font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95"
        >
          ▶ New Session
        </button>

        {/* Theme Toggle (visual only – dark by default) */}
        <button
          className="w-10 h-10 bg-[#161b22] border border-[#30363d] rounded-2xl flex items-center justify-center text-[#8b949e] hover:text-white transition-colors"
          title="Dark theme"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm0 16a7 7 0 0 1 0-14 7 7 0 0 1 0 14z" />
          </svg>
        </button>

        {/* Avatar + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 bg-gradient-to-br from-[#39d353] to-[#79c0ff] rounded-2xl flex items-center justify-center text-[#080c10] font-mono font-bold text-lg border-2 border-[#39d353] hover:scale-105 transition-transform"
          >
            AD
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-[#161b22] border border-[#30363d] rounded-3xl shadow-2xl py-2 text-sm font-mono z-50">
              <a href="#" className="flex items-center gap-3 px-5 py-3 text-[#8b949e] hover:bg-[#21262d] hover:text-white">👤 View Profile</a>
              <a href="#" className="flex items-center gap-3 px-5 py-3 text-[#8b949e] hover:bg-[#21262d] hover:text-white">⚙️ Settings</a>
              <a href="#" className="flex items-center gap-3 px-5 py-3 text-[#8b949e] hover:bg-[#21262d] hover:text-white">💳 Billing</a>
              <div className="h-px bg-[#30363d] my-1 mx-4" />
              <a href="#" className="flex items-center gap-3 px-5 py-3 text-[#ff7b72] hover:bg-[#21262d]">🚪 Logout</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// WELCOME HERO
// ─────────────────────────────────────────────────────────────
function WelcomeSection({ username, onCreateSession }) {
  return (
    <section className="pt-24 pb-8 px-8 max-w-7xl mx-auto">
      <div className="reveal flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-[#39d353] font-mono uppercase tracking-widest text-xs mb-1">GOOD MORNING,</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Welcome back, {username}!
          </h1>
          <p className="text-[#8b949e] text-xl mt-3 max-w-md">
            Ready to level up your coding skills today?
          </p>
        </div>

        <button
          onClick={() => {
            launchConfetti();
            onCreateSession("Interview room opened — share the link!");
          }}
          className="flex items-center gap-3 bg-[#39d353] hover:bg-[#5bdf6b] text-[#080c10] font-mono font-bold text-lg px-8 py-5 rounded-3xl transition-all active:scale-95 shadow-xl shadow-[#39d353]/20"
        >
          <span className="text-2xl">⚡</span>
          Create New Session
        </button>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// STATS SECTION
// ─────────────────────────────────────────────────────────────
function StatCard({ title, value, suffix, icon, color = "#39d353" }) {
  const [ref, count] = useCountUp(value);

  return (
    <div ref={ref} className="reveal bg-[#0d1117] border border-[#30363d] rounded-3xl p-6 hover:border-[#39d353]/30 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-4xl font-mono font-bold" style={{ color }}>
            {count}
            {suffix}
          </div>
          <div className="text-[#8b949e] font-mono text-sm mt-1">{title}</div>
        </div>
        <div className="text-4xl opacity-75">{icon}</div>
      </div>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { title: "Active Sessions", value: 3, suffix: "", icon: "🔴", color: "#39d353" },
    { title: "Total Sessions", value: 142, suffix: "", icon: "📅", color: "#79c0ff" },
    { title: "Problems Solved", value: 87, suffix: "", icon: "✅", color: "#39d353" },
    { title: "Win Rate", value: 94, suffix: "%", icon: "🏆", color: "#d2a8ff" },
    { title: "Avg. Score", value: 8.7, suffix: "/10", icon: "📊", color: "#ffa657" },
  ];

  return (
    <section className="px-8 max-w-7xl mx-auto pb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// LIVE SESSIONS
// ─────────────────────────────────────────────────────────────
function LiveSessionsSection({ onJoin }) {
  const liveSessions = [
    { id: 1, problem: "Two Sum", host: "Sarah Chen", time: "12 min ago", participants: 2 },
    { id: 2, problem: "Merge Intervals", host: "You (Host)", time: "just now", participants: 1 },
  ];

  return (
    <section className="px-8 max-w-7xl mx-auto py-8">
      <div className="reveal flex justify-between items-center mb-6">
        <h2 className="font-mono uppercase text-xs tracking-widest text-[#39d353]">LIVE SESSIONS</h2>
        <span className="text-[#39d353] text-sm font-mono">2 active • Join any</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {liveSessions.map((session) => (
          <div
            key={session.id}
            className="reveal bg-[#0d1117] border border-[#30363d] rounded-3xl p-6 hover:border-[#39d353] transition-all group"
          >
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2 bg-[#39d353]/10 text-[#39d353] text-xs font-mono px-4 py-1 rounded-3xl">
                <span className="w-2 h-2 bg-[#39d353] rounded-full animate-pulse" />
                LIVE
              </div>
              <span className="text-[#6e7681] font-mono text-sm">{session.time}</span>
            </div>

            <div className="text-2xl font-semibold mb-1">{session.problem}</div>
            <div className="text-[#8b949e]">Hosted by {session.host}</div>

            <div className="mt-8 flex justify-between items-center">
              <div className="font-mono text-sm text-[#6e7681]">
                {session.participants} participant{session.participants !== 1 && "s"}
              </div>
              <button
                onClick={() => onJoin(session.problem)}
                className="bg-[#39d353] text-[#080c10] font-bold font-mono px-6 py-3 rounded-2xl text-sm hover:bg-[#5bdf6b] transition-colors"
              >
                Join Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// PAST SESSIONS
// ─────────────────────────────────────────────────────────────
function PastSessionsSection({ onView }) {
  const pastSessions = [
    { id: 1, title: "Longest Palindromic Substring", date: "Apr 15, 2026", participants: 2, result: "Passed", score: "9.4" },
    { id: 2, title: "Binary Tree Zigzag Level Order", date: "Apr 14, 2026", participants: 3, result: "Passed", score: "8.1" },
    { id: 3, title: "Median of Two Sorted Arrays", date: "Apr 12, 2026", participants: 2, result: "Failed", score: "6.7" },
  ];

  return (
    <section className="bg-[#0d1117] border-t border-b border-[#30363d] py-8 px-8 max-w-7xl mx-auto">
      <div className="reveal">
        <h2 className="font-mono uppercase text-xs tracking-widest text-[#39d353] mb-6">PAST SESSIONS</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {pastSessions.map((session) => (
            <div
              key={session.id}
              className="reveal bg-[#161b22] border border-[#30363d] rounded-3xl p-6 hover:border-[#484f58] transition-all"
            >
              <div className="font-semibold text-lg mb-1">{session.title}</div>
              <div className="text-[#6e7681] font-mono text-sm mb-4">{session.date}</div>

              <div className="flex gap-4 mb-6">
                <div className="text-sm text-[#8b949e]">
                  {session.participants} participants
                </div>
                <div
                  className={`text-xs font-mono px-4 py-1 rounded-3xl ${
                    session.result === "Passed"
                      ? "bg-[#39d353]/10 text-[#39d353]"
                      : "bg-[#ff7b72]/10 text-[#ff7b72]"
                  }`}
                >
                  {session.result}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="font-mono">
                  <span className="text-[#8b949e]">Score: </span>
                  <span className="text-[#39d353] text-xl">{session.score}</span>
                </div>
                <button
                  onClick={() => onView(session.title)}
                  className="text-[#8b949e] hover:text-white border border-[#30363d] px-5 py-2 rounded-2xl text-sm transition-colors"
                >
                  View Recording
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// QUICK ACTIONS
// ─────────────────────────────────────────────────────────────
function QuickActionsSection({ onAction }) {
  const actions = [
    { icon: "📚", label: "Practice Problems", desc: "500+ DSA challenges", color: "#79c0ff" },
    { icon: "🎤", label: "Mock Interview", desc: "AI-powered 45 min session", color: "#d2a8ff" },
    { icon: "🔗", label: "Join by Link", desc: "Paste room code", color: "#ffa657" },
    { icon: "⏳", label: "Resume Last", desc: "Continue where you left", color: "#39d353" },
  ];

  return (
    <section className="px-8 max-w-7xl mx-auto py-12">
      <div className="reveal">
        <h2 className="font-mono uppercase text-xs tracking-widest text-[#39d353] mb-6">QUICK ACTIONS</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, i) => (
            <div
              key={i}
              onClick={() => onAction(action.label)}
              className="reveal bg-[#0d1117] border border-[#30363d] rounded-3xl p-8 hover:border-[#484f58] cursor-pointer transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-6" style={{ color: action.color }}>{action.icon}</div>
              <div className="font-semibold text-xl mb-2">{action.label}</div>
              <div className="text-[#8b949e] text-sm">{action.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// ACTIVITY CHART (CSS bars – clean & fast)
// ─────────────────────────────────────────────────────────────
function ActivityChart() {
  const data = [
    { day: "Mon", sessions: 7 },
    { day: "Tue", sessions: 12 },
    { day: "Wed", sessions: 4 },
    { day: "Thu", sessions: 15 },
    { day: "Fri", sessions: 9 },
    { day: "Sat", sessions: 3 },
    { day: "Sun", sessions: 11 },
  ];
  const maxSessions = Math.max(...data.map((d) => d.sessions));

  return (
    <div className="reveal mx-8 max-w-7xl bg-[#0d1117] border border-[#30363d] rounded-3xl p-8">
      <div className="flex justify-between items-baseline mb-8">
        <div>
          <span className="font-mono uppercase text-xs tracking-widest text-[#39d353]">THIS WEEK</span>
          <h2 className="text-2xl font-semibold">Coding Activity</h2>
        </div>
        <div className="text-right font-mono text-sm text-[#8b949e]">
          42 sessions • 18h 40m
        </div>
      </div>

      <div className="flex items-end gap-4 h-60">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <span className="font-mono text-xs text-[#39d353]">{item.sessions}</span>
            <div
              className="w-full max-w-8 bg-gradient-to-t from-[#39d353] to-[#5bdf6b] rounded-2xl transition-all"
              style={{ height: `${(item.sessions / maxSessions) * 180}px` }}
            />
            <span className="font-mono text-xs text-[#6e7681]">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LEADERBOARD PREVIEW
// ─────────────────────────────────────────────────────────────
function LeaderboardPreview() {
  const leaders = [
    { rank: 1, name: "Priya Sharma", score: 1840, company: "Google" },
    { rank: 2, name: "Rahul Verma", score: 1710, company: "Meta" },
    { rank: 3, name: "Anika Patel", score: 1650, company: "Stripe" },
  ];

  return (
    <section className="px-8 max-w-7xl mx-auto py-12">
      <div className="reveal">
        <h2 className="font-mono uppercase text-xs tracking-widest text-[#39d353] mb-6">COMMUNITY LEADERBOARD</h2>

        <div className="bg-[#161b22] border border-[#30363d] rounded-3xl overflow-hidden">
          {leaders.map((leader, i) => (
            <div
              key={i}
              className={`flex items-center px-8 py-5 ${i !== leaders.length - 1 ? "border-b border-[#30363d]" : ""}`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-2xl mr-6 ${
                  leader.rank === 1
                    ? "bg-[#ffd700] text-[#080c10]"
                    : leader.rank === 2
                    ? "bg-[#c0c0c0] text-[#080c10]"
                    : "bg-[#cd7f32] text-[#080c10]"
                }`}
              >
                {leader.rank}
              </div>
              <div className="flex-1">
                <div className="font-medium">{leader.name}</div>
                <div className="text-[#6e7681] font-mono text-xs">{leader.company}</div>
              </div>
              <div className="font-mono text-2xl text-[#39d353]">{leader.score}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef(null);

  useReveal();

  const triggerToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(msg);
    setShowToast(true);

    toastTimer.current = setTimeout(() => {
      setShowToast(false);
    }, 3200);
  };

  return (
    <>
      {/* Toast is rendered from your shared component */}
      {showToast && <Toast message={toastMessage} visible={showToast} />}

      <DashboardNavbar onCreateSession={triggerToast} />

      <WelcomeSection username="Anirudh" onCreateSession={triggerToast} />

      <StatsSection />

      <LiveSessionsSection onJoin={(problem) => triggerToast(`Joined ${problem} room!`)} />

      <PastSessionsSection onView={(title) => triggerToast(`Opening recording: ${title}`)} />

      <QuickActionsSection onAction={(label) => triggerToast(`${label} started...`)} />

      <ActivityChart />

      <LeaderboardPreview />

      {/* Simple footer matching homepage style */}
      <footer className="text-center py-10 text-[#6e7681] font-mono text-sm border-t border-[#30363d]">
        © 2026 Code_Tester • Built for engineers who ship
      </footer>
    </>
  );
}