import useCountUp from "../hooks/useCountUp.js";

export function StatCard({ title, value, suffix, icon, color = "#39d353" }) {
  const [ref, count] = useCountUp(value);

  return (
    <div ref={ref} className="reveal bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-800 hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-4xl font-mono font-bold" style={{ color }}>
            {count}
            {suffix}
          </div>
          <div className="text-zinc-400 font-mono text-sm mt-1">{title}</div>
        </div>
        <div className="text-4xl opacity-75">{icon}</div>
      </div>
    </div>
  );
}

export function LiveSessionCard({ session, onJoin }) {
  return (
    <div className="reveal bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-green-500 transition-all group">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-mono px-4 py-1.5 rounded-xl">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          LIVE
        </div>
        <span className="text-zinc-500 font-mono text-sm">{session.time}</span>
      </div>

      <div className="text-2xl font-semibold text-white/80 mb-1">{session.problem}</div>
      <div className="text-zinc-400">Hosted by {session.host}</div>

      <div className="mt-8 flex justify-between items-center">
        <div className="font-mono text-sm text-zinc-500">
          {session.participants} participant{session.participants !== 1 && "s"}
        </div>
        <button
          onClick={() => onJoin(session.problem)}
          className="bg-green-500 text-black font-semibold font-mono px-6 py-3 rounded-2xl text-sm hover:bg-green-400 transition-colors"
        >
          Join Now
        </button>
      </div>
    </div>
  );
}

export function PastSessionCard({ session, onView }) {
  return (
    <div className="reveal bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all">
      <div className="font-semibold text-lg text-white/80 mb-1">{session.title}</div>
      <div className="text-zinc-500 font-mono text-sm mb-4">{session.date}</div>

      <div className="flex gap-4 mb-6">
        <div className="text-sm text-zinc-400">
          {session.participants} participants
        </div>
        <div
          className={`text-xs font-mono px-4 py-1.5 rounded-xl border ${
            session.result === "Passed"
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : "bg-red-500/10 text-red-400 border-red-500/30"
          }`}
        >
          {session.result}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="font-mono">
          <span className="text-zinc-400">Score: </span>
          <span className="text-green-500 text-xl">{session.score}</span>
        </div>
        <button
          onClick={() => onView(session.title)}
          className="text-zinc-400 hover:text-white border border-zinc-700 hover:bg-zinc-800 px-5 py-2 rounded-2xl text-sm transition-colors"
        >
          View Recording
        </button>
      </div>
    </div>
  );
}

export function QuickActionCard({ action, onAction }) {
  return (
    <div
      onClick={() => onAction(action.label)}
      className="reveal bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 hover:bg-zinc-800 cursor-pointer transition-all hover:-translate-y-1"
    >
      <div className="text-5xl mb-6" style={{ color: action.color }}>{action.icon}</div>
      <div className="font-semibold text-xl text-white/80 mb-2">{action.label}</div>
      <div className="text-zinc-400 text-sm">{action.desc}</div>
    </div>
  );
}

export function LeaderboardRow({ leader, isLast }) {
  return (
    <div className={`flex items-center px-8 py-5 bg-zinc-900 hover:bg-zinc-800 transition-colors ${isLast ? "" : "border-b border-zinc-800"}`}>
      <div
        className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-2xl mr-6 ${
          leader.rank === 1
            ? "bg-yellow-400 text-black"
            : leader.rank === 2
            ? "bg-zinc-300 text-black"
            : "bg-orange-500 text-black"
        }`}
      >
        {leader.rank}
      </div>
      <div className="flex-1">
        <div className="font-medium text-white/80">{leader.name}</div>
        <div className="text-zinc-500 font-mono text-xs">{leader.company}</div>
      </div>
      <div className="font-mono text-2xl text-green-500">{leader.score}</div>
    </div>
  );
}
