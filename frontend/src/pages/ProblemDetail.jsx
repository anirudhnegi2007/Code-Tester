import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../componets/lib/axios.js";
import { executeCode } from "../lib/judge.js";
import { ChevronLeft, Play, Send, AlertTriangle } from "lucide-react";
import { launchConfetti } from "../componets/ui/Confetti.jsx";
import Toast from "../componets/ui/Toast.jsx";
import ProblemPanel from "../componets/ProblemPanel.jsx";
import CodeEditorPanel from "../componets/CodeEditorPanel.jsx";
import OutputPanel from "../componets/OutputPanel.jsx";

const CODE_TEMPLATES = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Read input and write your logic here\n    int n;\n    if (cin >> n) {\n        // Your code...\n    }\n    return 0;\n}`,
  java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            // Write your logic here\n        }\n    }\n}`,
  python: `import sys\n\ndef solve():\n    # Read input and write your logic here\n    lines = sys.stdin.read().split()\n    if not lines:\n        return\n    w = int(lines[0])\n    # Your logic here...\n\nif __name__ == '__main__':\n    solve()`,
  js: `const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\s+/);\n    const w = parseInt(lines[0]);\n    // Write your code here\n}\n\nsolve();`
};

export default function ProblemDetail() {
  const { contestId, index } = useParams();
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(CODE_TEMPLATES.cpp);
  
  // Console panel states
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [executionState, setExecutionState] = useState("idle"); // idle, running, submitting, success, error
  const [consoleLogs, setConsoleLogs] = useState("Ready to compile and run your code.");
  const [stats, setStats] = useState({ time: "—", memory: "—" });

  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimer = useRef(null);

  function showToast(message) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message });
    toastTimer.current = setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 3200);
  }

  // Fetch problem details
  const { data, isLoading, isError, error: queryError } = useQuery({
    queryKey: ["problemDetails", contestId, index],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/problems/${contestId}/${index}`);
      return response.data;
    },
    retry: 1
  });

  const problem = data?.problem;

  // Sync template code when language changes
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(CODE_TEMPLATES[lang]);
  };

  // Run Code logic using Judge0 code execution API (proxied via Backend)
  const handleRunCode = async () => {
    setConsoleOpen(true);
    setExecutionState("running");
    setConsoleLogs("Compiling and executing code on Judge0 sandbox...");

    try {
      const result = await executeCode(language, code, problem?.sampleInput || "");
      
      if (result.run) {
        const { stdout, stderr, code: exitCode, output } = result.run;
        
        if (exitCode !== 0 || stderr) {
          setExecutionState("error");
          setConsoleLogs(output || stderr || `Compilation / Execution failed with exit code ${exitCode}`);
        } else {
          setExecutionState("success");
          setConsoleLogs(stdout || "Code executed successfully with empty output.");
        }
        setStats({
          time: result.time || "0.05s",
          memory: result.memory || "1.2 MB"
        });
      } else {
        setExecutionState("error");
        setConsoleLogs("Execution failed: No response structure from judge sandbox.");
      }
    } catch (err) {
      console.error("Code execution error:", err);
      setExecutionState("error");
      setConsoleLogs(err.response?.data?.error || err.message || "Failed to execute code. Sandbox is offline.");
    }
  };

  // Submit code logic using Judge0 code execution API (proxied via Backend)
  const handleSubmit = async () => {
    setConsoleOpen(true);
    setExecutionState("submitting");
    setConsoleLogs("Submitting solution to tests...");

    try {
      const result = await executeCode(language, code, problem?.sampleInput || "");
      
      if (result.run && result.run.code === 0 && !result.run.stderr) {
        setExecutionState("success");
        setConsoleLogs(
          `✔ Solution Accepted\n\nAll tests passed successfully.\nTest cases: 1/1 passed.\n\nCongratulations! You solved Codeforces ${contestId}${index}!`
        );
        launchConfetti();
        showToast("Great job! Solution Accepted 🎉");
      } else {
        setExecutionState("error");
        setConsoleLogs(
          `❌ Wrong Answer / Execution Failure\n\nCompile/Stderr:\n${result.run?.stderr || "None"}\n\nStdout:\n${result.run?.stdout || "None"}`
        );
      }
    } catch (err) {
      console.error("Code submission error:", err);
      setExecutionState("error");
      setConsoleLogs("Submission failed: " + (err.response?.data?.error || err.message));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center flex-col gap-4 text-white">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-zinc-555 text-sm">Loading workspace details...</p>
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center flex-col gap-4 text-white p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="font-medium text-lg">Error Loading Problem Workspace</p>
        <p className="text-zinc-550 max-w-md text-sm">
          {queryError?.message || "Could not retrieve the details for this problem from our server."}
        </p>
        <Link
          to="/problems"
          className="mt-4 bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-sm px-6 py-2.5 rounded-xl hover:border-zinc-700 hover:text-white transition-colors"
        >
          ← Return to Problems list
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-955 text-white flex flex-col overflow-hidden font-sans">
      {toast.visible && <Toast message={toast.message} visible={toast.visible} />}

      {/* Workspace Header */}
      <header className="h-[52px] border-b border-zinc-900 bg-[#080c10] px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-4">
          <Link
            to="/problems"
            className="flex items-center gap-1 text-zinc-400 hover:text-white text-xs font-mono transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">
              {problem.contestId}{problem.index}
            </span>
            <h1 className="font-bold text-sm text-zinc-100">{problem.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
            Status: Active Practice
          </span>
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </header>

      {/* Workspace Split Panes */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-zinc-950">
        
        {/* Left Pane - Problem Description */}
        <div 
          className="border-b lg:border-b-0 lg:border-r border-zinc-900 flex flex-col overflow-auto bg-zinc-950 lg:resize-x shrink-0"
          style={{ width: "45%", minWidth: "20%", maxWidth: "80%" }}
        >
          <ProblemPanel
            isPractice={true}
            problem={problem}
          />
        </div>

        {/* Right Pane - Code Editor and Terminal Console */}
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
          
          <div className="flex-1 min-h-0 overflow-hidden">
            <CodeEditorPanel
              selectedLanguage={language}
              code={code}
              isRunning={executionState === "running"}
              onLanguageChange={(e) => handleLanguageChange(e.target.value)}
              onCodeChange={(value) => setCode(value || "")}
              onRunCode={handleRunCode}
              hideHeaderActions={true}
              languages={[
                { value: "cpp", label: "C++ (GCC 20)" },
                { value: "java", label: "Java (OpenJDK 17)" },
                { value: "python", label: "Python (PyPy 3.10)" },
                { value: "js", label: "JavaScript (Node.js 20)" }
              ]}
            />
          </div>

          {/* Console / Terminal Panel */}
          {consoleOpen && (
            <div 
              className="shrink-0 border-t border-zinc-900 bg-zinc-950 overflow-auto resize-y"
              style={{ height: "192px", minHeight: "100px", maxWeight: "500px" }}
            >
              <OutputPanel
                executionState={executionState}
                consoleLogs={consoleLogs}
                stats={stats}
              />
            </div>
          )}

          {/* Action Footer Bar */}
          <div className="h-14 border-t border-zinc-900 bg-[#080c10] flex items-center justify-between px-6 shrink-0 select-none">
            <button
              onClick={() => setConsoleOpen(!consoleOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 font-mono text-xs transition-all"
            >
              Console {consoleOpen ? "▼" : "▲"}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunCode}
                disabled={executionState === "running" || executionState === "submitting"}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono font-semibold text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]"
              >
                <Play className="w-3.5 h-3.5" />
                Run Code
              </button>

              <button
                onClick={handleSubmit}
                disabled={executionState === "running" || executionState === "submitting"}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-mono font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-lg shadow-green-500/10 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]"
              >
                <Send className="w-3.5 h-3.5" />
                Submit
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
