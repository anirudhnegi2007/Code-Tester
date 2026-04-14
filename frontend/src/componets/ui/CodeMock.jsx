
// src/components/ui/CodeMock.jsx

const CodeMock = () => {
  const lines = [
    { ln: 1, text: "# Two Sum — O(n) solution", color: "text-zinc-500" },
    { 
      ln: 2, 
      parts: [
        { color: "text-purple-400", text: "def " },
        { color: "text-blue-400", text: "two_sum" },
        { color: "text-zinc-100", text: "(nums, target):" }
      ]
    },
    { ln: 3, text: "  seen = {}", color: "text-zinc-100" },
    { 
      ln: 4, 
      parts: [
        { color: "text-purple-400", text: "  for " },
        { color: "text-zinc-100", text: "i, n " },
        { color: "text-purple-400", text: "in " },
        { color: "text-blue-400", text: "enumerate" },
        { color: "text-zinc-100", text: "(nums):" }
      ]
    },
    { ln: 5, text: "    diff = target - n", color: "text-zinc-100" },
    { 
      ln: 6, 
      parts: [
        { color: "text-purple-400", text: "    if " },
        { color: "text-zinc-100", text: "diff " },
        { color: "text-purple-400", text: "in " },
        { color: "text-zinc-100", text: "seen:" }
      ],
      cursor: true 
    },
    { 
      ln: 7, 
      parts: [
        { color: "text-purple-400", text: "      return " },
        { color: "text-zinc-100", text: "[seen[diff], i]" }
      ]
    },
    { ln: 8, text: "    seen[n] = i", color: "text-zinc-100" },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden font-mono text-sm shadow-2xl">
      
      {/* Terminal Title Bar */}
      <div className="bg-zinc-800 px-4 py-3 flex items-center gap-2 border-b border-zinc-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-4 text-zinc-400 text-xs">
          solution.py — Interview Room #4821
        </span>
      </div>
      {/* Code Content */}
      <div className="p-6 space-y-1.5 text-[13px] leading-relaxed bg-zinc-950">
        {lines.map((line) => (
          <div
            key={line.ln}
            className={`flex ${line.cursor ? 'bg-green-500/5 border-l-2 border-green-500 pl-3 -ml-3' : ''}`}
          >
            {/* Line Number */}
            <span className="text-zinc-500 w-6 shrink-0 select-none">
              {line.ln}
            </span>
            {/* Code Text */}
            <div className="flex-1">
              {line.parts ? (
                line.parts.map((part, i) => (
                  <span key={i} className={part.color}>
                    {part.text}
                  </span>
                ))
              ) : (
                <span className={line.color}>{line.text}</span>
              )}
              
              {line.cursor && (
                <span className="inline-block w-1 h-4 bg-green-500 ml-1 align-middle animate-pulse" />
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Status Bar */}
      <div className="bg-green-500/10 border-t border-zinc-700 px-5 py-3 flex items-center gap-3 text-green-400 text-xs font-mono">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        All 3 test cases passed · Runtime: 48ms · Memory: 14.2 MB
      </div>
    </div>
  );
};

export default CodeMock;