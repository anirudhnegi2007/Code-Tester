//─── Confetti ────────────────────────────────────────────────────────────────
function launchConfetti() {
  const colors = ["#39d353","#79c0ff","#d2a8ff","#ffa657","#ff7b72","#fff"];
  for (let i = 0; i < 90; i++) {
    const el = document.createElement("div");
    el.className = "conf";
    const size = 6 + Math.random() * 9;
    el.style.cssText = `
      left:${Math.random()*100}vw; top:${Math.random()*10-5}vh;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>.5?"50%":"2px"};
      width:${size}px; height:${size}px;
      animation-delay:${Math.random()*.8}s;
      animation-duration:${2+Math.random()*1.5}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}
export { launchConfetti };