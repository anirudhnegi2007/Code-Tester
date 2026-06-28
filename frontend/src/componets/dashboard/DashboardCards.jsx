import useCountUp from "../hooks/useCountUp.js";

export function StatCard({ title, value, suffix, icon, color = "#39d353" }) {
  const isNumeric = typeof value === "number";
  const [ref, count] = useCountUp(isNumeric ? value : 0);

  return (
    <div ref={ref} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-800 hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-4xl font-mono font-bold" style={{ color }}>
            {isNumeric ? count : value}
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
  const hostName = session.host?.name || session.host || "Anonymous";
  const participantCount = Array.isArray(session.participants) 
    ? session.participants.length 
    : (session.participants || 0);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-green-500 transition-all group">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-mono px-4 py-1.5 rounded-xl">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          LIVE
        </div>
        <span className="text-zinc-500 font-mono text-sm">{session.time || "Just now"}</span>
      </div>

      <div className="text-2xl font-semibold text-white/80 mb-1">{session.problem}</div>
      <div className="text-zinc-400">Hosted by {hostName}</div>

      <div className="mt-8 flex justify-between items-center">
        <div className="font-mono text-sm text-zinc-500">
          {participantCount} participant{participantCount !== 1 && "s"}
        </div>
        <button
          onClick={() => onJoin(session._id || session.id || session.problem)}
          className="bg-green-500 text-black font-semibold font-mono px-6 py-3 rounded-2xl text-sm hover:bg-green-400 transition-colors"
        >
          Join Now
        </button>
      </div>
    </div>
  );
}

export function PastSessionCard({ session, onView }) {
  const problemName = session.problem || session.title || "Unknown Problem";
  const dateStr = session.createdAt 
    ? new Date(session.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : (session.date || "Unknown Date");
  const participantsCount = Array.isArray(session.participants)
    ? session.participants.length + 1
    : (session.participants || 1);
  const difficulty = session.difficulty
    ? session.difficulty.slice(0, 1).toUpperCase() + session.difficulty.slice(1)
    : "Easy";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all">
      <div className="font-semibold text-lg text-white/80 mb-1">{problemName}</div>
      <div className="text-zinc-500 font-mono text-sm mb-4">{dateStr}</div>

      <div className="flex gap-4 mb-6">
        <div className="text-sm text-zinc-400">
          {participantsCount} participant{participantsCount !== 1 && "s"}
        </div>
        <div className="text-xs font-mono px-4 py-1.5 rounded-xl border bg-green-500/10 text-green-400 border-green-500/30">
          Completed
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="font-mono">
          <span className="text-zinc-400">Difficulty: </span>
          <span className="text-green-400 text-base font-semibold">{difficulty}</span>
        </div>
        <button
          onClick={() => onView(problemName)}
          className="text-zinc-400 hover:text-white border border-zinc-700 hover:bg-zinc-800 px-5 py-2 rounded-2xl text-sm transition-colors"
        >
          View Session
        </button>
      </div>
    </div>
  );
}


