
// ─── CTA BANNER ──────────────────────────────────────────────────────────────
function CTABanner({ onCTA }) {
  return (
    <section style={{
      background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
      textAlign: "center", padding: "5rem 2rem", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 500, height: 200,
        background: "radial-gradient(ellipse, rgba(57,211,83,.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div className="reveal" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".75rem", color: "var(--green)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".75rem" }}>
          Ready?
        </div>
        <h2 style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: "1rem" }}>
          Start Your First Interview<br />in{" "}
          <span style={{ color: "var(--green)" }}>Under 60 Seconds</span>
        </h2>
        <p style={{ color: "var(--text2)", fontFamily: "var(--font-mono)", fontSize: ".95rem", marginBottom: "2rem" }}>
          No credit card. No setup. Just paste a link and start coding.
        </p>
        <button onClick={() => { launchConfetti(); onCTA("Account created! Welcome aboard 🎉"); }}
          style={{
            background: "var(--green)", color: "#080c10", border: "none",
            padding: ".9rem 2.5rem", borderRadius: 8,
            fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1rem",
            cursor: "pointer", transition: "all .25s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#5bdf6b"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 32px rgba(57,211,83,.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--green)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
          Get Started Now — It's Free
        </button>
      </div>
    </section>
  );
}


export default CTABanner;