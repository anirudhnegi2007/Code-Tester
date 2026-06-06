// frontend/src/data/mockDashboardData.js

export const statsData = [
  { title: "Active Sessions", value: 3, suffix: "", icon: "🔴", color: "#39d353" },
  { title: "Total Sessions", value: 142, suffix: "", icon: "📅", color: "#79c0ff" },
  { title: "Problems Solved", value: 87, suffix: "", icon: "✅", color: "#39d353" },
  { title: "Win Rate", value: 94, suffix: "%", icon: "🏆", color: "#d2a8ff" },
  { title: "Avg. Score", value: 8.7, suffix: "/10", icon: "📊", color: "#ffa657" },
];

export const liveSessionsData = [
  { id: 1, problem: "Two Sum", host: "Sarah Chen", time: "12 min ago", participants: 2 },
  { id: 2, problem: "Merge Intervals", host: "You (Host)", time: "just now", participants: 1 },
];

export const pastSessionsData = [
  { id: 1, title: "Longest Palindromic Substring", date: "Apr 15, 2026", participants: 2, result: "Passed", score: "9.4" },
  { id: 2, title: "Binary Tree Zigzag Level Order", date: "Apr 14, 2026", participants: 3, result: "Passed", score: "8.1" },
  { id: 3, title: "Median of Two Sorted Arrays", date: "Apr 12, 2026", participants: 2, result: "Failed", score: "6.7" },
];

export const quickActionsData = [
  { icon: "📚", label: "Practice Problems", desc: "500+ DSA challenges", color: "#79c0ff" },
  { icon: "🎤", label: "Mock Interview", desc: "AI-powered 45 min session", color: "#d2a8ff" },
  { icon: "🔗", label: "Join by Link", desc: "Paste room code", color: "#ffa657" },
  { icon: "⏳", label: "Resume Last", desc: "Continue where you left", color: "#39d353" },
];

export const leaderboardData = [
  { rank: 1, name: "Priya Sharma", score: 1840, company: "Google" },
  { rank: 2, name: "Rahul Verma", score: 1710, company: "Meta" },
  { rank: 3, name: "Anika Patel", score: 1650, company: "Stripe" },
];

export const activityChartData = [
  { day: "Mon", sessions: 7 },
  { day: "Tue", sessions: 12 },
  { day: "Wed", sessions: 4 },
  { day: "Thu", sessions: 15 },
  { day: "Fri", sessions: 9 },
  { day: "Sat", sessions: 3 },
  { day: "Sun", sessions: 11 },
];