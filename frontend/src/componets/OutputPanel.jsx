import React from "react";
import { Terminal, AlertCircle, CheckCircle } from "lucide-react";

export default function OutputPanel({ output }) {
  if (!output) {
    return (
      <div className="h-full flex flex-col bg-zinc-950 border border-zinc-900 rounded-3xl p-6 select-none">
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs border-b border-zinc-900 pb-3">
          <Terminal className="w-4 h-4" />
          <span>Console Output</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-zinc-600 font-mono text-sm">
          Run your code to see the execution results here.
        </div>
      </div>
    );
  }

  const { run } = output;
  const isSuccess = run.code === 0 && !run.stderr;

  return (
    <div className="h-full flex flex-col bg-zinc-950 border border-zinc-900 rounded-3xl p-6 overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 shrink-0 select-none">
        <div className="flex items-center gap-2 font-mono text-xs">
          <Terminal className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-400 font-bold">Console Output</span>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-zinc-500">Exit Code: {run.code}</span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
              isSuccess
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Success</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Error</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Output Console Log */}
      <div className="flex-1 overflow-y-auto mt-4 font-mono text-sm leading-6 p-4 rounded-2xl bg-black/45 border border-zinc-900/50">
        {run.stderr ? (
          <pre className="text-red-400 whitespace-pre-wrap">{run.stderr}</pre>
        ) : run.stdout ? (
          <pre className="text-zinc-200 whitespace-pre-wrap">{run.stdout}</pre>
        ) : (
          <span className="text-zinc-500 italic">Program finished running with no output.</span>
        )}
      </div>
    </div>
  );
}
