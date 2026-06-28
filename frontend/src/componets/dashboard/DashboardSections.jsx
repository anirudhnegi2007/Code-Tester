import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios.js";
import { auth } from "../../firebase/config.js";

import {
  LiveSessionCard,
  PastSessionCard,
  StatCard,
} from "./DashboardCards.jsx";

export default function DashboardSections({ onToast, onCreateSession }) {
  const navigate = useNavigate();

  // Fetch real active sessions from backend
  const { data: activeSessions = [] } = useQuery({
    queryKey: ["activeSessions"],
    queryFn: async () => {
      const user = auth.currentUser;
      if (!user) return [];
      const token = await user.getIdToken();
      const response = await axiosInstance.get("/api/session/active", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.sessions || [];
    },
    refetchInterval: 5000,
  });

  // Fetch real completed/past sessions from backend
  const { data: recentSessions = [] } = useQuery({
    queryKey: ["recentSessions"],
    queryFn: async () => {
      const user = auth.currentUser;
      if (!user) return [];
      const token = await user.getIdToken();
      const response = await axiosInstance.get("/api/session/recent", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.sessions || [];
    }
  });

  const handleJoin = async (idOrProblem) => {
    // If it's a 24-character MongoDB ObjectId, navigate to the session room
    const isObjectId = typeof idOrProblem === "string" && /^[0-9a-fA-F]{24}$/.test(idOrProblem);
    if (isObjectId) {
      navigate(`/session/${idOrProblem}`);
    } else {
      let problemName = "Watermelon";
      if (idOrProblem === 1 || idOrProblem === "1" || idOrProblem === "Two Sum") {
        problemName = "Two Sum";
      } else if (idOrProblem === 2 || idOrProblem === "2" || idOrProblem === "Merge Intervals") {
        problemName = "Way Too Long Words";
      } else if (typeof idOrProblem === "string") {
        problemName = idOrProblem;
      }

      onToast(`Creating and connecting to interview room for "${problemName}"...`);
      try {
        const user = auth.currentUser;
        if (!user) {
          onToast("Error: You must be logged in!");
          return;
        }
        const token = await user.getIdToken();
        const response = await axiosInstance.post(
          "/api/session",
          {
            problem: problemName,
            difficulty: "medium",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newSession = response.data.session;
        navigate(`/session/${newSession._id}`);
      } catch (err) {
        console.error("Join session creation error:", err);
        onToast("Failed to create room: " + (err.response?.data?.error || err.message));
      }
    }
  };

  // Filter active sessions: status === "active" and created within the last 2 hours (to filter out abandoned rooms)
  const activeOnly = activeSessions.filter(s => {
    if (s.status !== "active") return false;
    const createdAt = new Date(s.createdAt).getTime();
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    return createdAt > twoHoursAgo;
  });

  // Calculate dynamic stats
  const uniqueProblems = Array.from(new Set(recentSessions.map(s => s.problem))).length;
  
  const statsList = [
    { title: "Active Rooms", value: activeOnly.length, suffix: "", icon: "🔴", color: "#39d353" },
    { title: "Completed Sessions", value: recentSessions.length, suffix: "", icon: "📅", color: "#79c0ff" },
    { title: "Problems Solved", value: uniqueProblems, suffix: "", icon: "✅", color: "#39d353" },
    { title: "Success Rate", value: recentSessions.length > 0 ? 100 : 0, suffix: "%", icon: "🏆", color: "#d2a8ff" },
    { title: "Avg. Level", value: recentSessions.length > 0 ? "Medium" : "—", suffix: "", icon: "📊", color: "#ffa657" }
  ];

  return (
    <main className="bg-zinc-950">
      <StatsSection stats={statsList} />
      <LiveSessionsSection sessions={activeOnly} onJoin={handleJoin} />
      <PastSessionsSection recentSessions={recentSessions} onView={(title) => onToast(`Viewing recording details for: ${title}`)} />
    </main>
  );
}

function StatsSection({ stats }) {
  return (
    <section className="px-6 max-w-7xl mx-auto pb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
}

function LiveSessionsSection({ sessions, onJoin }) {
  console.log("Live sessions list:", sessions);
  return (
    <section className="px-6 max-w-7xl mx-auto py-8">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <div className="font-mono text-xs tracking-[0.125em] uppercase text-green-500 mb-2">Live Rooms</div>
          <h2 className="text-3xl text-white/80 font-bold tracking-tighter">Join an Active Session</h2>
        </div>
        <span className="text-green-500 text-xs font-mono">{sessions.length} active</span>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 text-center text-zinc-500 font-mono text-xs">
          No active mock interview rooms at the moment. Create one to get started! ⚡
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {sessions.map((session) => (
            <LiveSessionCard key={session._id || session.id} session={session} onJoin={onJoin} />
          ))}
        </div>
      )}
    </section>
  );
}

function PastSessionsSection({ recentSessions, onView }) {
  return (
    <section className="bg-[#080c10] border-y border-zinc-800 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <div className="font-mono text-xs tracking-[0.125em] uppercase text-green-500 mb-3">History</div>
          <h2 className="text-4xl text-white/80 font-bold tracking-tighter">Past Sessions</h2>
        </div>

        {recentSessions.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-12 text-center text-zinc-550 font-mono text-sm">
            No session history found. Completed sessions will be displayed here.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {recentSessions.map((session) => (
              <PastSessionCard key={session._id || session.id} session={session} onView={onView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
