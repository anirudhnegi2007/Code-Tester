// ─── HOW IT WORKS ────────────────────────────────────────────────────────────
import  useCountUp  from "../hooks/useCountUp.js";
import useReveal from "../hooks/useReveal.js";


const STEPS = [
  { num: "01", title: "Create / Join Room", desc: "Generate a room link instantly. Share it with your interviewer or candidate in one click." },
  { num: "02", title: "Start Video + Code", desc: "Both users see the same live editor. Talk, type, and collaborate simultaneously." },
  { num: "03", title: "Run & Get Feedback", desc: "Execute code in real-time. AI checks test cases and gives instant complexity analysis." },
  { num: "04", title: "Evaluate Performance", desc: "Review session recording, code history, and AI-generated performance report." },
];

function HowItWorks() {
  return (
    <section id="how" style={{ padding: "5rem 2rem", background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="section-inner reveal" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".75rem", color: "var(--green)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".75rem" }}>
          Process
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, letterSpacing: "-.025em", marginBottom: "3.5rem" }}>
          From Zero to Offer in 4 Steps
        </h2>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 0, position: "relative",
        }}>
          {/* connector line */}
          <div style={{
            position: "absolute", top: 27, left: "10%", right: "10%",
            height: 1, background: "linear-gradient(90deg, transparent, var(--border), var(--border), transparent)",
            zIndex: 0,
          }} />
          {STEPS.map((s) => (
            <div key={s.num} className="step"
              style={{ textAlign: "center", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
              <div className="step-num"
                style={{
                  width: 56, height: 56, background: "var(--bg2)", border: "1px solid var(--border)",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem", fontFamily: "var(--font-mono)", fontWeight: 700,
                  color: "var(--green)", fontSize: "1rem", transition: "all .3s",
                }}>
                {s.num}
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: ".5rem" }}>{s.title}</div>
              <div style={{ color: "var(--text2)", fontSize: ".83rem", fontFamily: "var(--font-mono)", lineHeight: 1.65 }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ target, suffix, label }) {
  const [ref, count] = useCountUp(target);
  const display = target >= 1000 ? count.toLocaleString() + "+" : count + suffix;

  return (
    <div ref={ref} style={{ background: "var(--bg2)", padding: "2.5rem 2rem", textAlign: "center" }}>
      <div style={{ fontSize: "2.8rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--green)", lineHeight: 1 }}>
        {display}
      </div>
      <div style={{ color: "var(--text2)", fontSize: ".83rem", fontFamily: "var(--font-mono)", marginTop: ".5rem" }}>{label}</div>
    </div>
  );
}

function Stats() {
  const stats = [
    { target: 10000, suffix: "+", label: "Interviews Conducted" },
    { target: 95,    suffix: "%", label: "Candidate Success Rate" },
    { target: 500,   suffix: "+", label: "Problems Solved Daily" },
    { target: 12,    suffix: "+", label: "Languages Supported" },
  ];

  return (
    <section id="stats" style={{ padding: 0, background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 1, background: "var(--border)",
      }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
    </section>
  );
}

export { HowItWorks, Stats };