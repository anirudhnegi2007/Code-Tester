// ─── HOW IT WORKS ────────────────────────────────────────────────────────────
import  useCountUp  from "../hooks/useCountUp.js";

const STEPS = [
  { 
    num: "01", 
    title: "Create / Join Room", 
    desc: "Generate a room link instantly. Share it with your interviewer or candidate in one click." 
  },
  { 
    num: "02", 
    title: "Start Video + Code", 
    desc: "Both users see the same live editor. Talk, type, and collaborate simultaneously." 
  },
  { 
    num: "03", 
    title: "Run & Get Feedback", 
    desc: "Execute code in real-time. AI checks test cases and gives instant complexity analysis." 
  },
  { 
    num: "04", 
    title: "Evaluate Performance", 
    desc: "Review session recording, code history, and AI-generated performance report." 
  },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-20 bg-zinc-950 border-y border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 reveal">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="font-mono text-xs tracking-[0.125em] uppercase text-green-500 mb-3">
            Process
          </div>
          <h2 className="text-4xl text-white/80 md:text-5xl font-bold tracking-tighter leading-tight">
            From Zero to Offer in 4 Steps
          </h2>
        </div>

        {/* Steps Grid with Connector Line */}
        <div className="relative grid md:grid-cols-4 gap-12 md:gap-8">
          {/* Horizontal connecting line (visible on md+) */}
          <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

          {STEPS.map((step, index) => (
            <div 
              key={step.num} 
              className="relative z-10 flex flex-col items-center text-center group"
            >
              {/* Step Number Circle */}
              <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-6 text-green-500 font-mono font-bold text-lg transition-all duration-300 group-hover:border-green-500 group-hover:bg-green-500/10">
                {step.num}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 text-white/80">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-400 text-[15px] leading-relaxed font-light max-w-[260px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── STAT CARD ───────────────────────────────────────────────────────────────
const StatCard = ({ target, suffix, label }) => {
  const [ref, count] = useCountUp(target);
  
  const display = target >= 1000 
    ? count.toLocaleString() + "+" 
    : count + suffix;

  return (
    <div 
      ref={ref} 
      className="bg-zinc-900 p-10 text-center border border-zinc-800 hover:border-zinc-700 transition-colors"
    >
      <div className="text-5xl md:text-6xl font-mono font-bold text-green-500 tracking-tighter mb-3">
        {display}
      </div>
      <div className="text-zinc-400 font-mono text-sm uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
};

const Stats = () => {
  const stats = [
    { target: 10000, suffix: "+", label: "Interviews Conducted" },
    { target: 95,    suffix: "%", label: "Candidate Success Rate" },
    { target: 500,   suffix: "+", label: "Problems Solved Daily" },
    { target: 12,    suffix: "+", label: "Languages Supported" },
  ];

  return (
    <section id="stats" className="border-y border-zinc-800 bg-zinc-950">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 border-zinc-800">
        {stats.map((stat) => (
          <StatCard 
            key={stat.label} 
            target={stat.target} 
            suffix={stat.suffix} 
            label={stat.label} 
          />
        ))}
      </div>
    </section>
  );
};

export { HowItWorks, Stats };