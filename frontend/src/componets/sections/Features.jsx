
// src/sections/Features.jsx
import { Code2, Video, Shield, Bot, Monitor, MessageSquare, Puzzle, Lock } from "lucide-react";
const FEATURES = [
  { Icon: Code2, title: "VSCode-like Editor", desc: "Syntax highlighting, autocomplete, and multi-language support. Feels exactly like home." },
  { Icon: Video, title: "Video Interview Rooms", desc: "HD video with real-time WebRTC. See your candidate's face, not just their code." },
  { Icon: Shield, title: "Secure Code Execution", desc: "Sandboxed runtime for 10+ languages. Safe, fast, and isolated from production." },
  { Icon: Bot, title: "AI Auto Feedback", desc: "Instant test case evaluation with complexity analysis and improvement hints." },
  { Icon: Monitor, title: "Screen Sharing", desc: "Full screen recording and sharing. Every session is automatically saved." },
  { Icon: MessageSquare, title: "Real-time Chat", desc: "Markdown-enabled chat panel. Share links, code snippets, and notes inline." },
  { Icon: Puzzle, title: "Practice Mode", desc: "500+ curated problems across 8 categories with timed and solo sessions." },
  { Icon: Lock, title: "Room Locking", desc: "Private 2-person rooms. No uninvited observers or interruptions mid-interview." },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="uppercase tracking-[2px] text-green-500 font-mono text-sm mb-3">
            WHAT'S INCLUDED
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight text-white">
            Everything You Need to<br />Run a Perfect Interview
          </h2>
          <p className="mt-6 text-zinc-400 text-lg leading-relaxed">
            Built for interviewers and candidates who take the process seriously.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 rounded-3xl overflow-hidden">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group bg-zinc-900 p-8 hover:bg-zinc-800 transition-all duration-300 flex flex-col"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-2xl mb-6 group-hover:border-green-500 transition-colors">
                <feature.Icon 
                    size={28} 
                    strokeWidth={1.8}
                     className="text-green-400/80 group-hover:text-green-400 transition-colors duration-300"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-400 text-[15px] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;