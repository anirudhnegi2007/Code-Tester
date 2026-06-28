import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import axiosInstance from "../componets/lib/axios";

import DashboardHeader from "../componets/dashboard/DashboardHeader.jsx";
import DashboardSections from "../componets/dashboard/DashboardSections.jsx";
import useReveal from "../componets/hooks/useReveal.js";
import Footer from "../componets/layout/Footer.jsx";
import Toast from "../componets/ui/Toast.jsx";

export default function Dashboard() {
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimer = useRef(null);
  const navigate = useNavigate();

  // Create Session states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const [isCreating, setIsCreating] = useState(false);

  // Suggestions states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useReveal();

  // Protect Dashboard: redirect to login if not authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return unsubscribe;
  }, [navigate]);

  // Fetch problem suggestions dynamically as user types
  useEffect(() => {
    if (!selectedProblem || selectedProblem.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // 1. Get local matching interview problems (removed mock PROBLEMS lookup)
        const localMatches = [];

        // 2. Fetch Codeforces problems matching search query from API
        const user = auth.currentUser;
        const headers = {};
        if (user) {
          const token = await user.getIdToken();
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await axiosInstance.get(
          `/api/problems?search=${encodeURIComponent(selectedProblem)}&limit=6`,
          { headers }
        );
        const apiProblems = response.data.problems || [];
        const apiMatches = apiProblems.map((p) => ({
          name: p.name,
          contestId: p.contestId,
          index: p.index,
          isLocal: false,
        }));

        // Merge matches (avoid duplicate names)
        const combined = [...localMatches];
        apiMatches.forEach((ap) => {
          if (!combined.some((cp) => cp.name.toLowerCase() === ap.name.toLowerCase())) {
            combined.push(ap);
          }
        });

        setSuggestions(combined);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [selectedProblem]);

  function showToast(message) {
    if (toastTimer.current) clearTimeout(toastTimer.current);

    setToast({ visible: true, message });

    toastTimer.current = setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 3200);
  }

  const handleCreateSession = async () => {
    setIsCreating(true);
    if (!selectedProblem.trim()) {
      showToast("Error: Please specify a problem name!");
      setIsCreating(false);
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) {
        showToast("Error: You must be logged in!");
        setIsCreating(false);
        return;
      }
      const token = await user.getIdToken();
      const response = await axiosInstance.post(
        "/api/session",
        {
          problem: selectedProblem.trim(),
          difficulty: selectedDifficulty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newSession = response.data.session;
      showToast("Interview room created successfully! Redirecting...");

      // Navigate to the newly created session room
      navigate(`/session/${newSession._id}`);
    } catch (err) {
      console.error("Create session error:", err);
      showToast("Failed to create session: " + (err.response?.data?.error || err.message));
    } finally {
      setIsCreating(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative">
      {toast.visible && <Toast message={toast.message} visible={toast.visible} />}

      <DashboardHeader onCreateSession={() => {
        setSelectedProblem("");
        setIsModalOpen(true);
      }} />
      <DashboardSections onToast={showToast} onCreateSession={() => {
        setSelectedProblem("");
        setIsModalOpen(true);
      }} />
      <Footer />

      {/* CREATE SESSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-mono text-white">Create New Session</h2>
              <p className="text-zinc-400 text-sm mt-1">Configure your mock interview session</p>
            </div>

            {/* Problem Input */}
            <div className="space-y-2 relative">
              <label className="block text-zinc-400 text-xs font-mono font-bold">PROBLEM NAME / ID</label>
              <input
                type="text"
                placeholder="e.g. Watermelon, Two Sum, Codeforces problem..."
                value={selectedProblem}
                onChange={(e) => {
                  setSelectedProblem(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full bg-zinc-950 border border-zinc-850 text-zinc-200 px-4 py-3 rounded-2xl focus:outline-none focus:border-green-500 placeholder-zinc-600 font-sans"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-zinc-900">
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSelectedProblem(item.isLocal ? item.name : `${item.contestId}${item.index} - ${item.name}`);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-3 hover:bg-zinc-900 cursor-pointer transition-colors text-sm flex justify-between items-center"
                    >
                      <span className="text-zinc-200 font-medium font-sans">
                        {item.isLocal ? item.name : `${item.contestId}${item.index} - ${item.name}`}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        {item.isLocal ? "Interview" : "Codeforces"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="block text-zinc-400 text-xs font-mono font-bold">SELECT DIFFICULTY</label>
              <div className="grid grid-cols-3 gap-3">
                {["easy", "medium", "hard"].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-semibold capitalize transition-all ${selectedDifficulty === diff
                        ? "bg-green-500 text-black border-transparent animate-pulse"
                        : "bg-zinc-950 text-zinc-400 border-zinc-850 hover:border-zinc-700"
                      }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isCreating}
                className="flex-1 bg-zinc-950 hover:bg-zinc-905 border border-zinc-850 text-zinc-400 font-mono font-semibold py-3 rounded-2xl text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSession}
                disabled={isCreating}
                className="flex-1 bg-green-500 hover:bg-green-400 text-black font-mono font-bold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {isCreating ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Create Room</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
