// ─── PRACTICE SECTION ─────────────────────────────────────────────────────────
const PROBLEMS = [
  { diff: "Easy",   name: "Two Sum",                solved: true  },
  { diff: "Medium", name: "Longest Substring",      solved: true  },
  { diff: "Hard",   name: "Median of Two Arrays",   solved: false },
  { diff: "Medium", name: "Binary Tree Level Order",solved: false },
  { diff: "Easy",   name: "Valid Parentheses",      solved: true  },
];

const Practice = ({ onCTA }) => {
  return (
    <section id="practice" className="py-20 bg-[#080c10]">
      <div className="max-w-6xl mx-auto px-6 reveal">
        {/* Header */}
        <div className="mb-12">
          <div className="font-mono text-xs tracking-[0.125em] uppercase text-green-500 mb-3">
            Solo Practice
          </div>
          <h2 className="text-4xl text-white/80 md:text-5xl font-bold tracking-tighter leading-tight">
            Sharpen Your Skills<br />Between Interviews
          </h2>
        </div>

        {/* Main Content */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left - Description */}
          <div className="space-y-8">
            <p className="text-zinc-400 text-[15px] leading-relaxed">
              500+ problems from array manipulation to dynamic programming. Timed sessions, hidden test cases, and AI hints when you're stuck. Track your progress with detailed analytics.
            </p>

            {/* Primary Button - Pure Tailwind */}
            <button
              onClick={() => onCTA("Loading practice arena...")}
              className="bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-mono font-semibold text-base px-8 py-4 rounded-2xl flex items-center gap-2 transition-all duration-200 hover:shadow-xl hover:shadow-green-500/30 active:scale-[0.98]"
            >
              ⚡ Start Practicing
            </button>
          </div>

          {/* Right - Problem List */}
          <div className="space-y-3">
            {PROBLEMS.map((problem) => (
              <div
                key={problem.name}
                className="group flex items-center gap-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl px-6 py-5 transition-all duration-200 cursor-pointer"
              >
                {/* Difficulty Badge */}
                <span
                  className={`px-4 py-1.5 text-xs font-mono font-bold rounded-xl whitespace-nowrap border
                    ${problem.diff === 'Easy' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                      : ''}
                    ${problem.diff === 'Medium' 
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' 
                      : ''}
                    ${problem.diff === 'Hard' 
                      ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                      : ''}
                  `}
                >
                  {problem.diff}
                </span>

                {/* Problem Name */}
                <span className="flex-1 text-white font-medium text-[15px]">
                  {problem.name}
                </span>

                {/* Status */}
                {problem.solved ? (
                  <span className="text-green-500 font-mono text-sm flex items-center gap-1">
                    ✓ Solved
                  </span>
                ) : (
                  <span className="text-zinc-500 font-mono text-sm">
                    Attempt →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Practice;