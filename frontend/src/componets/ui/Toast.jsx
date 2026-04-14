// ─── Toast Component ─────────────────────────────────────────────────────────
const Toast = ({ message, visible }) => (
  <div style={{
    position: "fixed", bottom: "2rem", right: "2rem",
    background: "var(--bg3)", border: "1px solid var(--green)",
    borderRadius: 10, padding: "1rem 1.4rem",
    display: "flex", alignItems: "center", gap: ".75rem",
    fontFamily: "var(--font-mono)", fontSize: ".83rem", zIndex: 200,
    animation: visible ? "slideIn .35s cubic-bezier(.34,1.56,.64,1) forwards"
                       : "slideOut .3s ease forwards",
  }}>
    <span style={{
      width: 8, height: 8, background: "var(--green)",
      borderRadius: "50%", flexShrink: 0, animation: "pulse 2s infinite",
    }} className="logo-dot" />
    {message}
  </div>
);

export default Toast;