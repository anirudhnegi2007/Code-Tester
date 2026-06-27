import React from "react";
import Editor from "@monaco-editor/react";
import { Code2, Play, Settings, RefreshCw } from "lucide-react";

export default function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  // Map our app languages to Monaco editor languages
  const getMonacoLanguage = (lang) => {
    if (lang === "js") return "javascript";
    if (lang === "javascript") return "javascript";
    return lang;
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
      {/* Editor Header Bar */}
      <div className="h-[52px] border-b border-zinc-900 bg-zinc-900/40 px-6 flex items-center justify-between shrink-0 select-none">
        
        {/* Language Selector */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
            <Code2 className="w-4 h-4" />
          </div>
          <select
            value={selectedLanguage}
            onChange={onLanguageChange}
            className="bg-transparent text-zinc-300 hover:text-white font-mono text-sm font-bold border-none focus:outline-none cursor-pointer py-1 pr-6"
          >
            <option value="cpp" className="bg-zinc-950 text-white">C++ (GCC 20)</option>
            <option value="java" className="bg-zinc-950 text-white">Java (OpenJDK 17)</option>
            <option value="python" className="bg-zinc-950 text-white">Python (3.10)</option>
            <option value="javascript" className="bg-zinc-950 text-white">JavaScript (Node.js 20)</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-mono font-bold text-xs px-4 py-2 rounded-xl transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-green-500/10"
          >
            {isRunning ? (
              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            Run Code
          </button>
          
          <div className="h-4 w-px bg-zinc-800" />
          
          <button className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors" title="Editor Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Workspace */}
      <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={getMonacoLanguage(selectedLanguage)}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          loading={
            <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-xs gap-3">
              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              Loading editor environment...
            </div>
          }
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            automaticLayout: true,
            fontFamily: "var(--font-mono), monospace",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            tabSize: 4,
            cursorBlinking: "smooth",
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
}
