import { useNavigate } from "react-router-dom";
import {
  activityChartData,
  leaderboardData,
  liveSessionsData,
  pastSessionsData,
  quickActionsData,
  statsData,
} from "../data/mockDashboard.js";

import {
  LeaderboardRow,
  LiveSessionCard,
  PastSessionCard,
  QuickActionCard,
  StatCard,
} from "./DashboardCards.jsx";

export default function DashboardSections({ onToast }) {
  const navigate = useNavigate();

  return (
    <main className="bg-zinc-950">
      <StatsSection />
      <LiveSessionsSection onJoin={(problem) => onToast(`Joined ${problem} room!`)} />
      <PastSessionsSection onView={(title) => onToast(`Opening recording: ${title}`)} />
      <QuickActionsSection onAction={(label) => {
        if (label === "Practice Problems") {
          navigate("/problems");
        } else {
          onToast(`${label} started...`);
        }
      }} />
      <ActivityChart />
      <LeaderboardPreview />
    </main>
  );
}

function StatsSection() {
  return (
    <section className="px-6 max-w-7xl mx-auto pb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statsData.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
}

function LiveSessionsSection({ onJoin }) {
  return (
    <section className="px-6 max-w-7xl mx-auto py-16">
      <div className="reveal flex flex-wrap justify-between items-end gap-4 mb-10">
        <div>
          <div className="font-mono text-xs tracking-[0.125em] uppercase text-green-500 mb-3">Live Rooms</div>
          <h2 className="text-4xl text-white/80 font-bold tracking-tighter">Join an Active Session</h2>
        </div>
        <span className="text-green-500 text-sm font-mono">2 active • Join any</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {liveSessionsData.map((session) => (
          <LiveSessionCard key={session.id} session={session} onJoin={onJoin} />
        ))}
      </div>
    </section>
  );
}

function PastSessionsSection({ onView }) {
  return (
    <section className="bg-[#080c10] border-y border-zinc-800 py-16">
      <div className="reveal max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <div className="font-mono text-xs tracking-[0.125em] uppercase text-green-500 mb-3">History</div>
          <h2 className="text-4xl text-white/80 font-bold tracking-tighter">Past Sessions</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pastSessionsData.map((session) => (
            <PastSessionCard key={session.id} session={session} onView={onView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickActionsSection({ onAction }) {
  return (
    <section className="px-6 max-w-7xl mx-auto py-16">
      <div className="reveal">
        <div className="mb-10">
          <div className="font-mono text-xs tracking-[0.125em] uppercase text-green-500 mb-3">Shortcuts</div>
          <h2 className="text-4xl text-white/80 font-bold tracking-tighter">Quick Actions</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActionsData.map((action) => (
            <QuickActionCard key={action.label} action={action} onAction={onAction} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ActivityChart() {
  const maxSessions = Math.max(...activityChartData.map((item) => item.sessions));

  return (
    <section className="px-6 max-w-7xl mx-auto py-16">
    <div className="reveal bg-zinc-950 border border-zinc-800 rounded-3xl p-8 md:p-12">
      <div className="flex justify-between items-baseline mb-8">
        <div>
          <span className="font-mono uppercase text-xs tracking-[0.125em] text-green-500">This Week</span>
          <h2 className="text-4xl text-white/80 font-bold tracking-tighter mt-3">Coding Activity</h2>
        </div>
        <div className="text-right font-mono text-sm text-zinc-400">
          42 sessions • 18h 40m
        </div>
      </div>

      <div className="flex items-end gap-4 h-60">
        {activityChartData.map((item) => (
          <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
            <span className="font-mono text-xs text-green-500">{item.sessions}</span>
            <div
              className="w-full max-w-8 bg-green-500 rounded-t-2xl transition-all"
              style={{ height: `${(item.sessions / maxSessions) * 180}px` }}
            />
            <span className="font-mono text-xs text-zinc-500">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
}

function LeaderboardPreview() {
  return (
    <section className="px-6 max-w-7xl mx-auto py-16">
      <div className="reveal">
        <div className="mb-10">
          <div className="font-mono text-xs tracking-[0.125em] uppercase text-green-500 mb-3">Community</div>
          <h2 className="text-4xl text-white/80 font-bold tracking-tighter">Leaderboard</h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          {leaderboardData.map((leader, index) => (
            <LeaderboardRow
              key={leader.rank}
              leader={leader}
              isLast={index === leaderboardData.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
