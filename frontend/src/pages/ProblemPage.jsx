import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "../componets/lib/axios.js";
import { Search, ExternalLink, ChevronLeft, ChevronRight, RotateCcw, Filter, BookOpen, AlertCircle } from "lucide-react";
import useReveal from "../componets/hooks/useReveal.js";
import Footer from "../componets/layout/Footer.jsx";
import Toast from "../componets/ui/Toast.jsx";

export default function ProblemPage() {
  // Filter States
  const [searchVal, setSearchVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Pagination States
  const [page, setPage] = useState(1);
  const limit = 50;

  // Toast notifications
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimer = useRef(null);

  const location = useLocation();

  useReveal();

  function showToast(message) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message });
    toastTimer.current = setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 3200);
  }

  // Fetch problems via TanStack Query and Axios
  const { data, isLoading: loading, isError, error: queryError, refetch } = useQuery({
    queryKey: ["problems", page, searchQuery, selectedTag, selectedDifficulty],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/problems", {
        params: {
          page,
          limit,
          search: searchQuery,
          tag: selectedTag,
          difficulty: selectedDifficulty,
        },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  let problems = [];
  let tags = [];
  let totalProblems = 0;
  let totalPages = 1;
  let error = null;

  if (isError) {
    error = queryError?.message || "Failed to load problems from server.";
  } else {
    problems = data?.problems || [];
    tags = data?.tags || [];
    totalProblems = data?.total || 0;
    totalPages = Math.ceil(totalProblems / limit) || 1;
  }

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    setPage(1);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchVal("");
    setSearchQuery("");
    setSelectedTag("");
    setSelectedDifficulty("");
    setPage(1);
    showToast("Filters reset successfully ✨");
  };

  // Helper to determine difficulty coloring
  const getDifficultyBadge = (rating) => {
    if (!rating) return { label: "Unrated", style: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
    if (rating <= 1200) {
      return { label: `Easy (${rating})`, style: "bg-green-500/10 text-green-400 border-green-500/20" };
    }
    if (rating <= 1900) {
      return { label: `Medium (${rating})`, style: "bg-orange-500/10 text-orange-400 border-orange-500/20" };
    }
    return { label: `Hard (${rating})`, style: "bg-red-500/10 text-red-400 border-red-500/20" };
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {toast.visible && <Toast message={toast.message} visible={toast.visible} />}

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] px-8 flex items-center justify-between border-b backdrop-blur-xl bg-[#080c10]/80 border-zinc-900">
        <Link to="/dashboard" className="flex items-center gap-2 font-mono font-bold text-sm text-white/90 hover:opacity-80 transition-opacity">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Code_Tester
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/dashboard"
            className={`font-mono text-sm transition-colors duration-200 ${location.pathname === "/dashboard" ? "text-green-500 font-semibold" : "text-zinc-400 hover:text-white"
              }`}
          >
            Dashboard
          </Link>
          <Link
            to="/problems"
            className={`font-mono text-sm transition-colors duration-200 ${location.pathname.startsWith("/problems") ? "text-green-500 font-semibold" : "text-zinc-400 hover:text-white"
              }`}
          >
            Problems
          </Link>
          <Link
            to="/dashboard"
            className="text-zinc-400 font-mono text-sm transition-colors duration-200 hover:text-white"
          >
            Sessions
          </Link>
          <Link
            to="/problems"
            className="text-zinc-400 font-mono text-sm transition-colors duration-200 hover:text-white"
          >
            Practice
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-sm px-4 py-1.5 rounded-md hover:border-zinc-700 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-10 bg-zinc-950">
        <div className="absolute inset-0 bg-[linear-gradient(#27272a_1px,transparent_1px),linear-gradient(90deg,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-10 pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="reveal max-w-7xl mx-auto px-6 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-mono px-4 py-1.5 rounded-full">
              <BookOpen className="w-3.5 h-3.5" />
              Codeforces Problem Set
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-none tracking-tighter text-white/90">
              Problem <span className="text-green-500">Explorer</span>
            </h1>
            <p className="text-zinc-400 text-md leading-relaxed">
              Browse, filter, and solve challenges fetched directly from the official Codeforces library. Sharpen your algorithmic speed and prepare for interviews.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* Filter Section */}
        <div className="reveal bg-zinc-900/50 border border-zinc-900 rounded-3xl p-6 mb-8 backdrop-blur-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4">

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by name, ID (e.g. 158A)..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {/* Tag Selection */}
            <div className="w-full lg:w-60">
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-4 py-3 rounded-2xl focus:outline-none focus:border-green-500 cursor-pointer transition-colors"
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selection */}
            <div className="w-full lg:w-56">
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-4 py-3 rounded-2xl focus:outline-none focus:border-green-500 cursor-pointer transition-colors"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy (≤ 1200)</option>
                <option value="medium">Medium (1300 - 1900)</option>
                <option value="hard">Hard (≥ 2000)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 lg:flex-none bg-green-500 hover:bg-green-400 text-black font-mono font-semibold px-6 py-3 rounded-2xl transition-all duration-200 active:scale-[0.98]"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center justify-center bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-3 rounded-2xl transition-colors hover:border-zinc-700"
                title="Reset Filters"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Problems Table / List */}
        <div className="reveal bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          {loading ? (
            <div className="py-24 text-center space-y-4">
              <div className="inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-zinc-500 font-mono text-sm">Retrieving Codeforces problemset...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center space-y-4 px-6">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <p className="text-red-400 font-medium">{error}</p>
              <button
                onClick={() => refetch()}
                className="bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-mono text-sm px-6 py-2.5 rounded-xl border border-zinc-700 transition-colors"
              >
                Retry Request
              </button>
            </div>
          ) : problems.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <Filter className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-zinc-400 font-medium">No problems match your current criteria.</p>
              <p className="text-zinc-600 text-sm">Try broadening your search term or tag filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-zinc-800 bg-[#080c10]/50 text-zinc-400 font-mono text-xs uppercase tracking-wider">
                    <th className="px-6 py-4.5 font-semibold">ID</th>
                    <th className="px-6 py-4.5 font-semibold">Problem Name</th>
                    <th className="px-6 py-4.5 font-semibold">Difficulty</th>
                    <th className="px-6 py-4.5 font-semibold">Tags</th>
                    <th className="px-6 py-4.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-sans text-[14px]">
                  {problems.map((prob) => {
                    const diffBadge = getDifficultyBadge(prob.rating);
                    return (
                      <tr
                        key={`${prob.contestId}-${prob.index}`}
                        className="group hover:bg-zinc-850/30 transition-colors duration-150"
                      >
                        {/* ID Column */}
                        <td className="px-6 py-4 font-mono font-medium text-zinc-400 text-sm">
                          {prob.contestId}{prob.index}
                        </td>

                        {/* Name Column */}
                        <td className="px-6 py-4 font-semibold text-white/95 text-[15px]">
                          {prob.name}
                        </td>

                        {/* Difficulty rating Column */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-mono font-bold rounded-lg border ${diffBadge.style}`}
                          >
                            {diffBadge.label}
                          </span>
                        </td>

                        {/* Tags Column */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5 max-w-sm">
                            {prob.tags && prob.tags.length > 0 ? (
                              prob.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs bg-zinc-950 text-zinc-500 rounded-md border border-zinc-800"
                                >
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-zinc-600 font-mono text-xs">—</span>
                            )}
                            {prob.tags && prob.tags.length > 3 && (
                              <span className="px-1.5 py-0.5 text-xs text-zinc-600 font-mono">
                                +{prob.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Solve Actions Column */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/problems/${prob.contestId}/${prob.index}`}
                              className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black border border-green-500/20 hover:border-transparent font-mono font-semibold text-xs px-3.5 py-2 rounded-xl transition-all duration-150 active:scale-[0.97]"
                            >
                              Solve
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && !error && problems.length > 0 && (
            <div className="border-t border-zinc-800 bg-[#080c10]/30 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-zinc-500 text-xs font-mono">
                Showing {Math.min(totalProblems, (page - 1) * limit + 1)}-
                {Math.min(totalProblems, page * limit)} of {totalProblems} problems
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-zinc-300 font-mono text-sm px-2">
                  Page {page} of {totalPages}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
