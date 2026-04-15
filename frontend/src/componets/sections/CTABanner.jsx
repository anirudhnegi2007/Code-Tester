
// // ─── CTA BANNER ──────────────────────────────────────────────────────────────
const CTABanner = ({ onCTA }) => {
  return (
    <section className="relative py-20 bg-zinc-950 border-y border-zinc-800 overflow-hidden">
      {/* Subtle Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 reveal">
        {/* Label */}
        <div className="font-mono text-xs tracking-[0.125em] uppercase text-green-500 mb-4">
          Ready?
        </div>

        {/* Headline */}
        <h2 className="text-4xl text-white/80 md:text-5xl font-bold tracking-tighter leading-tight mb-6">
          Start Your First Interview<br />in{' '}
          <span className="text-green-500">Under 60 Seconds</span>
        </h2>

        {/* Subtext */}
        <p className="text-zinc-400 text-[15px] font-light max-w-md mx-auto mb-10">
          No credit card. No setup. Just paste a link and start coding.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => {
            // launchConfetti();   // Uncomment if you want to keep confetti
            onCTA("Account created! Welcome aboard 🎉");
          }}
          className="bg-green-500 hover:bg-green-400 active:bg-green-600  
                     text-black font-mono font-semibold text-base 
                     px-10 py-4 rounded-2xl 
                     transition-all duration-200 
                     hover:shadow-2xl hover:shadow-green-500/40 
                     active:scale-[0.97]"
        >
          Get Started Now — It's Free
        </button>
      </div>
    </section>
  );
};

export default CTABanner;