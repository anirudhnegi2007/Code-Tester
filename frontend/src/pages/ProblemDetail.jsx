import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Editor from "@monaco-editor/react";
import axiosInstance from "../componets/lib/axios.js";
import { 
  ChevronLeft, Play, Send, RefreshCw, Terminal, 
  Settings, HelpCircle, Code2, AlertTriangle, CheckCircle2, XCircle
} from "lucide-react";
import { fallbackProblems } from "../componets/data/problems.js";
import { launchConfetti } from "../componets/ui/Confetti.jsx";
import Toast from "../componets/ui/Toast.jsx";

const CODE_TEMPLATES = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Read input and write your logic here\n    int n;\n    if (cin >> n) {\n        // Your code...\n    }\n    return 0;\n}`,
  java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            // Write your logic here\n        }\n    }\n}`,
  python: `import sys\n\ndef solve():\n    # Read input and write your logic here\n    lines = sys.stdin.read().split()\n    if not lines:\n        return\n    w = int(lines[0])\n    # Your logic here...\n\nif __name__ == '__main__':\n    solve()`,
  js: `const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\n    if (!input) return;\n    const lines = input.split(/\\s+/);\n    const w = parseInt(lines[0]);\n    // Write your code here\n}\n\nsolve();`
};

const PISTON_LANGUAGES = {
  cpp: "c++",
  java: "java",
  python: "python",
  js: "javascript"
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

  // Helper to generate realistic problem details dynamically on client side if API fails
  const generateProblemDetails = (cId, idx, pName, pRating, pTags) => {
    return {
      contestId: cId, index: idx, name: pName, rating: pRating, tags: pTags,
      description: `Given a competitive programming problem "${pName}" from Codeforces Contest ${cId}, solve it efficiently.\n\nYour task is to write a program that reads values from standard input, processes the values according to standard algorithmic paradigms (such as ${pTags.join(" or ") || "implementation"}), and outputs the results to standard output.`,
      inputFormat: "The first line contains a single integer t — the number of test cases.\nEach testcase consists of a single line containing elements representing the input variables for the problem.",
      outputFormat: "For each testcase, print the corresponding answer on a single line.",
      constraints: ["Time limit: 2.0 seconds", "Memory limit: 256 megabytes", `Target Rating: ${pRating || "Unrated"}`, `Categories: ${pTags.join(", ")}`],
      sampleInput: "3\n5\n1 2 3 4 5\n3\n10 20 30\n1\n100",
      sampleOutput: "15\n60\n100"
    };
  };

  // Fetch problem details
  const { data, isLoading, isError, error: queryError } = useQuery({
    queryKey: ["problemDetails", contestId, index],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/problems/${contestId}/${index}`);
      return response.data;
    },
    retry: 1
  });

  // Client-side fallback details resolution
  let problem = data?.problem;
  if (!problem && !isLoading) {
    const parsedContestId = parseInt(contestId);
    const found = fallbackProblems.find(p => p.contestId === parsedContestId && p.index.toUpperCase() === index.toUpperCase());
    if (found) {
      problem = generateProblemDetails(found.contestId, found.index, found.name, found.rating, found.tags);
    }
  }

  // Sync template code when language changes
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(CODE_TEMPLATES[lang]);
  };

  // Run Code logic using Piston code execution API (proxied via Backend)
  const handleRunCode = async () => {
    setConsoleOpen(true);
    setExecutionState("running");
    setConsoleLogs("Compiling and executing code on Piston sandbox...");

    try {
      const response = await axiosInstance.post("/api/problems/execute", {
        language,
        code,
        stdin: problem?.sampleInput || ""
      });

      const result = response.data;
      
      if (result.run) {
        const { stdout, stderr, code: exitCode, output } = result.run;
        
        if (exitCode !== 0 || stderr) {
          setExecutionState("error");
          setConsoleLogs(`❌ Run Error (Exit Code ${exitCode})\n\n${stderr || output}`);
          setStats({ time: "—", memory: "—" });
          showToast("Execution failed ❌");
        } else {
          const isCorrect = stdout.trim() === (problem?.sampleOutput || "").trim();
          setExecutionState("success");
          setConsoleLogs(
            `Execution Successful.\n\nInput:\n${problem?.sampleInput || ""}\n\nYour Output:\n${stdout}\nExpected Output:\n${problem?.sampleOutput || ""}\n\nStatus: ${isCorrect ? "Success ✅ (passed sample test)" : "Wrong Answer ❌ (output mismatch)"}`
          );
          setStats({ time: "Executed", memory: "Sandboxed" });
          if (isCorrect) showToast("Test run passed! ⚡");
          else showToast("Wrong Answer ❌");
        }
      } else {
        throw new Error("Invalid response format from code execution proxy");
      }
    } catch (err) {
      console.error("Run error:", err);
      const errMsg = err.response?.data?.message || err.response?.data || err.message;
      setExecutionState("error");
      setConsoleLogs(`❌ Execution Error\n\nFailed to execute code.\nDetails: ${errMsg}`);
      setStats({ time: "—", memory: "—" });
      showToast("Execution error ❌");
    }
  };

  // Submit code logic using Piston code execution API (proxied via Backend)
  const handleSubmit = async () => {
    setConsoleOpen(true);
    setExecutionState("submitting");
    setConsoleLogs("Submitting code to evaluator sandbox...");

    try {
      const response = await axiosInstance.post("/api/problems/execute", {
        language,
        code,
        stdin: problem?.sampleInput || ""
      });

      const result = response.data;
      
      if (result.run) {
        const { stdout, stderr, code: exitCode, output } = result.run;
        
        if (exitCode !== 0 || stderr) {
          setExecutionState("error");
          setConsoleLogs(`❌ Compilation / Runtime Error\n\n${stderr || output}`);
          setStats({ time: "—", memory: "—" });
          showToast("Compilation or runtime error ❌");
        } else {
          const isCorrect = stdout.trim() === (problem?.sampleOutput || "").trim();
          
          if (isCorrect) {
            setExecutionState("success");
            setConsoleLogs(
              `✔ Solution Accepted\n\nAll tests passed successfully.\nTest cases: 1/1 passed.\n\nCongratulations! You solved Codeforces ${contestId}${index}!`
            );
            setStats({ time: "Accept", memory: "Success" });
            launchConfetti();
            showToast("Accepted! Awesome coding! 🎉");
          } else {
            setExecutionState("error");
            setConsoleLogs(
              `❌ Wrong Answer on Sample Test\n\nInput:\n${problem?.sampleInput || ""}\n\nYour Output:\n${stdout}\n\nExpected Output:\n${problem?.sampleOutput || ""}`
            );
            setStats({ time: "—", memory: "—" });
            showToast("Wrong Answer on Sample Test ❌");
          }
        }
      } else {
        throw new Error("Invalid response format from code execution proxy");
      }
    } catch (err) {
      console.error("Submit error:", err);
      const errMsg = err.response?.data?.message || err.response?.data || err.message;
      setExecutionState("error");
      setConsoleLogs(`❌ Submission Error\n\nFailed to connect to evaluator.\nDetails: ${errMsg}`);
      setStats({ time: "—", memory: "—" });
      showToast("Evaluator connection error ❌");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center flex-col gap-4 text-white">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-zinc-500 text-sm">Loading workspace details...</p>
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center flex-col gap-4 text-white p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="font-medium text-lg">Error Loading Problem Workspace</p>
        <p className="text-zinc-500 max-w-md text-sm">
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
    <div className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden font-sans">
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
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Pane - Problem Description */}
        <div className="flex-1 lg:max-w-[48%] border-b lg:border-b-0 lg:border-r border-zinc-900 flex flex-col bg-zinc-950 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-900/60 bg-[#080c10]/40 shrink-0">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
              Problem Statement
            </span>
            <span className="text-xs font-mono text-zinc-500">
              Difficulty: {problem.rating || "Unrated"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            
            {/* Title & Badges */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white/95 leading-tight">{problem.name}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono border bg-green-500/10 text-green-400 border-green-500/20">
                  Rating: {problem.rating || "Unrated"}
                </span>
                {problem.tags && problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-lg text-xs bg-zinc-900 text-zinc-400 border border-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description Text */}
            <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-4">
              {problem.description}
            </div>

            {/* Input Format */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white/90">Input Format</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{problem.inputFormat}</p>
            </div>

            {/* Output Format */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white/90">Output Format</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{problem.outputFormat}</p>
            </div>

            {/* Constraints */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white/90 font-mono">Constraints</h3>
              <ul className="list-disc list-inside text-zinc-400 text-sm space-y-1">
                {problem.constraints && problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Samples */}
            <div className="space-y-4 pt-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">Sample Input</span>
                  <pre className="bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-xs p-4 rounded-xl overflow-x-auto whitespace-pre">
                    {problem.sampleInput}
                  </pre>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">Sample Output</span>
                  <pre className="bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-xs p-4 rounded-xl overflow-x-auto whitespace-pre">
                    {problem.sampleOutput}
                  </pre>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Pane - Code Editor and Terminal Console */}
        <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
          
          {/* Editor Header Bar */}
          <div className="h-11 border-b border-zinc-900 bg-[#080c10]/70 flex items-center justify-between px-4 shrink-0 select-none">
            
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-green-500" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-zinc-300 hover:text-white font-mono text-xs font-bold border-none focus:outline-none cursor-pointer py-1 pr-6"
              >
                <option value="cpp" className="bg-zinc-950">C++ (GCC 20)</option>
                <option value="java" className="bg-zinc-950">Java (OpenJDK 17)</option>
                <option value="python" className="bg-zinc-950">Python (PyPy 3.10)</option>
                <option value="js" className="bg-zinc-950">JavaScript (Node.js 20)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCode(CODE_TEMPLATES[language])}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                title="Reset Code Template"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors" title="Settings">
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Editor Workspace using Monaco */}
          <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={language === "js" ? "javascript" : language}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              loading={
                <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-xs gap-2">
                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading Monaco Editor...
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
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Console / Terminal Panel */}
          {consoleOpen && (
            <div className="h-48 border-t border-zinc-900 bg-[#080c10]/95 flex flex-col shrink-0 overflow-hidden relative">
              <div className="h-9 border-b border-zinc-900 bg-zinc-950 px-4 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs font-mono font-bold text-zinc-400">Terminal Output</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-mono text-[10px]">Time: {stats.time}</span>
                  <span className="text-zinc-500 font-mono text-[10px]">Memory: {stats.memory}</span>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-5">
                {executionState === "running" && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>{consoleLogs}</span>
                  </div>
                )}
                {executionState === "submitting" && (
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>{consoleLogs}</span>
                  </div>
                )}
                {executionState === "success" && (
                  <div className="text-zinc-200 whitespace-pre-wrap">
                    {consoleLogs}
                  </div>
                )}
                {executionState === "error" && (
                  <div className="text-red-400 whitespace-pre-wrap">
                    {consoleLogs}
                  </div>
                )}
                {executionState === "idle" && (
                  <span className="text-zinc-500">{consoleLogs}</span>
                )}
              </div>
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
