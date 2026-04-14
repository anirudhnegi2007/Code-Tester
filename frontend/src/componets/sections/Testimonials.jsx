// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "The real-time code execution was a game changer. My candidate could see results instantly, which made the conversation way more productive than whiteboard sessions.",
    name: "Arjun Kapoor", role: "Senior Engineer @ Google", initials: "AK",
    avatarBg: "rgba(57,211,83,.15)", avatarColor: "var(--green)",
  },
  {
    quote: "I used Code_Tester to prep for my FAANG loop. The practice mode with AI feedback helped me improve my time complexity by catching patterns I was missing.",
    name: "Sarah Reeves", role: "Software Dev @ Meta", initials: "SR",
    avatarBg: "rgba(121,192,255,.15)", avatarColor: "var(--blue)",
  },
  {
    quote: "Room locking and session recordings made our remote hiring process feel structured and fair. The auto feedback report saves us 30 minutes per debrief.",
    name: "Maya Patel", role: "Engineering Manager @ Stripe", initials: "MP",
    avatarBg: "rgba(210,168,255,.15)", avatarColor: "var(--purple)",
  },
];

function Testimonials() {
  return (
    <section style={{ padding: "5rem 2rem", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
      <div className="section-inner reveal" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".75rem", color: "var(--green)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".75rem" }}>
          Testimonials
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, letterSpacing: "-.025em", marginBottom: "3rem" }}>
          Trusted by Engineers<br />at Top Companies
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testi-card"
              style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem", transition: "border-color .25s" }}>
              <div style={{ color: "var(--orange)", fontSize: ".8rem", marginBottom: ".9rem" }}>★★★★★</div>
              <p style={{ color: "var(--text)", fontSize: ".9rem", lineHeight: 1.7, marginBottom: "1.25rem", fontStyle: "italic" }}>
                <span style={{ color: "var(--green)", fontSize: "2rem", lineHeight: 0, verticalAlign: "-.5rem", marginRight: ".25rem" }}>"</span>
                {t.quote}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: t.avatarBg, color: t.avatarColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: ".85rem", fontFamily: "var(--font-mono)", flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: ".88rem", fontWeight: 600 }}>{t.name}</div>
                  <div style={{ color: "var(--text2)", fontSize: ".78rem", fontFamily: "var(--font-mono)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Testimonials;