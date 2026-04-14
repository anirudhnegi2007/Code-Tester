// ─── PRACTICE ────────────────────────────────────────────────────────────────
const PROBLEMS = [
  { diff: "Easy",   name: "Two Sum",                solved: true  },
  { diff: "Medium", name: "Longest Substring",      solved: true  },
  { diff: "Hard",   name: "Median of Two Arrays",   solved: false },
  { diff: "Medium", name: "Binary Tree Level Order",solved: false },
  { diff: "Easy",   name: "Valid Parentheses",      solved: true  },
];

const diffColors = {
  Easy:   { bg: "rgba(57,211,83,.12)",    color: "var(--green)"  },
  Medium: { bg: "rgba(255,166,87,.12)",   color: "var(--orange)" },
  Hard:   { bg: "rgba(255,123,114,.12)",  color: "var(--red)"    },
};

function Practice({ onCTA }) {
  return (
    <section id="practice" style={{ padding: "5rem 2rem" }}>
      <div className="section-inner reveal" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".75rem", color: "var(--green)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".75rem" }}>
          Solo Practice
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, letterSpacing: "-.025em", marginBottom: "3rem" }}>
          Sharpen Your Skills<br />Between Interviews
        </h2>

        <div style={{
          background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: "3rem",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center",
        }}>
          <div>
            <p style={{ color: "var(--text2)", fontSize: ".95rem", lineHeight: 1.75, fontFamily: "var(--font-mono)", marginBottom: "1.75rem" }}>
              500+ problems from array manipulation to dynamic programming. Timed sessions, hidden test cases, and AI hints when you're stuck. Track your progress with detailed analytics.
            </p>
            <button onClick={() => onCTA("Loading practice arena...")}
              style={{
                background: "var(--green)", color: "#080c10", border: "none",
                padding: ".75rem 1.75rem", borderRadius: 8,
                fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: ".9rem",
                cursor: "pointer", transition: "all .25s",
                display: "flex", alignItems: "center", gap: ".5rem",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#5bdf6b"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--green)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              ⚡ Start Practicing
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
            {PROBLEMS.map((p) => (
              <div key={p.name} className="problem-row"
                style={{
                  display: "flex", alignItems: "center", gap: ".75rem",
                  background: "var(--bg)", border: "1px solid var(--border)",
                  padding: ".65rem 1rem", borderRadius: 8,
                  fontFamily: "var(--font-mono)", fontSize: ".8rem",
                  transition: "border-color .2s", cursor: "pointer",
                }}>
                <span style={{
                  padding: ".2rem .55rem", borderRadius: 4, fontSize: ".7rem", fontWeight: 700,
                  background: diffColors[p.diff].bg, color: diffColors[p.diff].color,
                }}>
                  {p.diff}
                </span>
                <span style={{ flex: 1 }}>{p.name}</span>
                {p.solved
                  ? <span style={{ color: "var(--green)", fontSize: ".75rem" }}>✓ Solved</span>
                  : <span style={{ color: "var(--text3)", fontSize: ".75rem" }}>Attempt →</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Practice;