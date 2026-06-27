import { Loader2Icon, LogOutIcon } from "lucide-react";

function getDifficultyBadgeClass(difficulty) {
  if (difficulty === "easy") return "bg-green-500/10 text-green-400 border border-green-500/20";
  if (difficulty === "medium") return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
  if (difficulty === "hard") return "bg-red-500/10 text-red-400 border border-red-500/20";
  return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
}

export default function ProblemPanel({ session, problemData, isHost, onEndSession, isEnding }) {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      {/* Header: Title + Difficulty Badge + End Session */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white/95">
            {session?.problem || "Loading..."}
          </h1>
          {problemData?.category && (
            <p className="text-zinc-400 font-mono text-sm mt-1">{problemData.category}</p>
          )}
          <p className="text-zinc-500 text-xs mt-3">
            Host: <span className="text-zinc-400 font-semibold">{session?.host?.name || "Loading..."}</span> •{" "}
            {session?.participants ? session.participants.length + 1 : 1}/2 participants
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase ${getDifficultyBadgeClass(session?.difficulty)}`}
          >
            {session?.difficulty
              ? session.difficulty.slice(0, 1).toUpperCase() + session.difficulty.slice(1)
              : "Easy"}
          </span>

          {isHost && session?.status === "active" && (
            <button
              onClick={onEndSession}
              disabled={isEnding}
              className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black border border-red-500/20 hover:border-transparent font-mono font-semibold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 active:scale-[0.97] disabled:opacity-50"
            >
              {isEnding ? (
                <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOutIcon className="w-3.5 h-3.5" />
              )}
              End Session
            </button>
          )}

          {session?.status === "completed" && (
            <span className="px-3 py-1 bg-zinc-900 text-zinc-500 border border-zinc-800 text-xs font-mono rounded-xl">
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {problemData?.description && (
        <div className="bg-zinc-950/40 rounded-2xl p-6 border border-zinc-850/65 leading-relaxed text-sm">
          <h2 className="text-base font-bold mb-3 text-white/90">Description</h2>
          <div className="space-y-3 text-zinc-350">
            <p>{problemData.description.text}</p>
            {problemData.description.notes?.map((note, idx) => (
              <p key={idx}>{note}</p>
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      {problemData?.examples && problemData.examples.length > 0 && (
        <div className="bg-zinc-955/40 rounded-2xl p-6 border border-zinc-855/65 text-sm">
          <h2 className="text-base font-bold mb-4 text-white/90">Examples</h2>
          <div className="space-y-4">
            {problemData.examples.map((example, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500 flex items-center justify-center rounded-lg">
                    {idx + 1}
                  </span>
                  <p className="font-semibold text-zinc-300">Example {idx + 1}</p>
                </div>
                <div className="bg-black/45 border border-zinc-900 rounded-2xl p-4 font-mono text-xs space-y-2 leading-5">
                  <div className="flex gap-2">
                    <span className="text-green-500 font-bold min-w-[70px]">Input:</span>
                    <span className="text-zinc-300">{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-orange-500 font-bold min-w-[70px]">Output:</span>
                    <span className="text-zinc-350">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-zinc-900 mt-2 text-zinc-550 font-sans text-xs">
                      <span className="font-semibold text-zinc-400">Explanation:</span>{" "}
                      {example.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {problemData?.constraints && problemData.constraints.length > 0 && (
        <div className="bg-zinc-955/40 rounded-2xl p-6 border border-zinc-855/65 text-sm">
          <h2 className="text-base font-bold mb-3 text-white/90">Constraints</h2>
          <ul className="space-y-2 text-zinc-400 list-disc list-inside">
            {problemData.constraints.map((constraint, idx) => (
              <li key={idx} className="text-zinc-400">
                <code className="text-xs font-mono bg-zinc-900 px-2 py-0.5 rounded text-green-500 border border-zinc-850">
                  {constraint}
                </code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
