
// src/sections/Hero.jsx
import CodeMock from "../ui/CodeMock";
import { launchConfetti } from "../ui/Confetti";   // Keep if you still want confetti

const Hero = ({ onCTA }) => {
  return (
    <section className="min-h-screen flex items-center pt-16 relative overflow-hidden bg-zinc-950">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(#27272a_1px,transparent_1px),linear-gradient(90deg,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-10 pointer-events-none" />
      
      {/* Subtle Glow Effect */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-500 text-sm font-mono px-5 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              v2.0 — Now with AI Feedback
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] tracking-tighter text-white/90">
              Ace Your Coding Interviews{" "}
              <span className="text-green-500">in Real-Time</span>
            </h1>

            {/* Description */}
            <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
              Code together, talk together, evaluate together. A real-time platform 
              for technical interviews with live code execution, video rooms, and instant AI feedback.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  launchConfetti?.();
                  onCTA("Starting interview room...");
                }}
                className="bg-green-500 hover:bg-green-400 text-black font-mono font-semibold text-base px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-200 active:scale-[0.97] shadow-lg shadow-green-500/30"
              >
                ▶ Start Interview
              </button>

              <button
                onClick={() => onCTA("Loading practice problems...")}
                className="border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900 text-white/80 font-mono text-base px-8 py-4 rounded-2xl transition-all duration-200 active:scale-[0.97]"
              >
                Practice Problems
              </button>
            </div>
          </div>

          {/* Right Side - CodeMock */}
          <div className="hidden md:block">
            <CodeMock />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;