import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../componets/hooks/useAuth";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../componets/layout/Navbar";
import { Loader2Icon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../componets/CodeEditorPanel";
import OutputPanel from "../componets/OutputPanel";
import ProblemPanel from "../componets/ProblemPanel";
import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../componets/VideoCallUI";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../componets/lib/axios.js";

const FALLBACK_TEMPLATES = {
  javascript: `// Write your JavaScript solution here\nconsole.log("Hello, World!");`,
  python: `# Write your Python solution here\nprint("Hello, World!")`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n        System.out.println("Hello, World!");\n    }\n}`
};

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading: loadingAuth } = useAuth();

  // Code execution state
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");



  // Session data
  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.firebaseUID === user?.uid;
  const isParticipant = session?.participants?.some(p => p.firebaseUID === user?.uid);

  // Parse Codeforces problem if it matches pattern e.g. "4A - Watermelon"
  const cfMatch = session?.problem?.match(/^(\d+)([a-zA-Z\d]+)\s*-\s*(.+)$/);
  const contestId = cfMatch ? cfMatch[1] : null;
  const problemIndex = cfMatch ? cfMatch[2] : null;

  // Fetch Codeforces problem details if it is a Codeforces session
  const { data: cfProblemData } = useQuery({
    queryKey: ["cfProblemDetails", contestId, problemIndex],
    queryFn: async () => {
      if (!contestId || !problemIndex) return null;
      const response = await axiosInstance.get(`/api/problems/${contestId}/${problemIndex}`);
      return response.data?.problem;
    },
    enabled: !!contestId && !!problemIndex,
  });

  // Stream video/chat
  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session, loadingSession, isHost, isParticipant
  );

  // Find the problem from our local data
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const getStarterCode = (lang) => {
    if (problemData?.starterCode?.[lang]) {
      return problemData.starterCode[lang];
    }
    const normalized = lang === "js" ? "javascript" : lang;
    return FALLBACK_TEMPLATES[normalized] || "";
  };

  const [code, setCode] = useState(getStarterCode(selectedLanguage));

  // Auto-join if not already in the session
  useEffect(() => {
    if (!session || !user || loadingSession || loadingAuth) return;
    if (isHost || isParticipant) return;
    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, loadingAuth, isHost, isParticipant, id]);

  // Redirect when session is completed
  useEffect(() => {
    if (session?.status === "completed") navigate("/dashboard");
  }, [session?.status, navigate]);

  // Update code when problem or language changes
  useEffect(() => {
    setCode(getStarterCode(selectedLanguage));
  }, [problemData, selectedLanguage]);

  // --- Handlers ---

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(getStarterCode(newLang));
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const sampleInput = problemData?.examples?.[0]?.input || cfProblemData?.sampleInput || "";
    const result = await executeCode(selectedLanguage, code, sampleInput);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session?")) {
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  // --- Loading state ---
  if (loadingAuth || loadingSession) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-sans gap-3">
        <Loader2Icon className="w-10 h-10 animate-spin text-green-500" />
        <p className="font-mono text-zinc-555 text-sm">Fetching workspace details...</p>
      </div>
    );
  }

  // --- Access restricted state ---
  if (session && !isHost && !isParticipant && !joinSessionMutation.isPending) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-sans p-6 text-center gap-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
          <PhoneOffIcon className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold font-mono">Access Restricted</h2>
        <p className="text-zinc-555 max-w-sm text-sm">
          Please wait while we register you into this coding interview room.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-sm px-6 py-2.5 rounded-xl transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // --- Main session layout ---
  return (
    <div className="h-screen bg-zinc-955 flex flex-col overflow-hidden text-white font-sans">
      <div className="shrink-0 h-[60px]">
        <Navbar />
      </div>

      <div className="flex-1 min-h-0 p-4 flex gap-4 overflow-hidden bg-zinc-950">

        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">

          {/* Problem description (scrollable) */}
          <div 
            className="bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col overflow-auto resize-y shrink-0"
            style={{ height: "35%", minHeight: "15%", maxHeight: "75%" }}
          >
            <ProblemPanel
              session={session}
              problemData={problemData}
              problem={cfProblemData}
              isHost={isHost}
              onEndSession={handleEndSession}
              isEnding={endSessionMutation.isPending}
            />
          </div>

          {/* Code editor + Output */}
          <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
            <div className="flex-1 min-h-0">
              <CodeEditorPanel
                selectedLanguage={selectedLanguage}
                code={code}
                isRunning={isRunning}
                onLanguageChange={handleLanguageChange}
                onCodeChange={(value) => setCode(value)}
                onRunCode={handleRunCode}
              />
            </div>

            <div 
              className="shrink-0 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-auto resize-y"
              style={{ height: "180px", minHeight: "100px", maxHeight: "400px" }}
            >
              <OutputPanel output={output} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Video & Chat */}
        <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden min-h-0">
          <div className="h-full bg-zinc-950/20 p-6 overflow-auto">
            {isInitializingCall ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-green-500" />
                  <p className="text-zinc-550 font-mono text-sm">Connecting call channels...</p>
                </div>
              </div>
            ) : !streamClient || !call ? (
              <div className="h-full flex items-center justify-center">
                <div className="bg-zinc-955 border border-zinc-900 rounded-3xl p-8 max-w-md text-center shadow-2xl">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PhoneOffIcon className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-xl font-bold font-mono">Stream Connection Failed</h2>
                  <p className="text-zinc-555 text-sm mt-2 leading-relaxed">
                    Unable to connect video call. Please refresh the page.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full">
                <StreamVideo client={streamClient}>
                  <StreamCall call={call}>
                    <VideoCallUI chatClient={chatClient} channel={channel} />
                  </StreamCall>
                </StreamVideo>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SessionPage;
