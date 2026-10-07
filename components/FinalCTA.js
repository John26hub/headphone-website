'use client';

export default function FinalCTA() {
  return (
    <section className="min-h-screen relative py-32 overflow-hidden bg-[var(--bg-primary)] flex flex-col items-center justify-center">
      {/* Scroll-Driven Expanding Premium Separator */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/[0.03] pointer-events-none flex justify-center">
        <div className="expand-line w-full h-[1px] relative flex justify-center origin-center">
          <div className="absolute top-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px]"></div>
          <div className="absolute top-[1px] w-1/4 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[2px]"></div>
          <div className="absolute top-0 w-3/4 h-[250px] bg-gradient-to-b from-white/[0.03] to-transparent blur-[50px] rounded-b-full pointer-events-none"></div>
          <div className="absolute top-0 w-1/3 h-[150px] bg-gradient-to-b from-white/[0.05] to-transparent blur-[30px] rounded-b-full pointer-events-none"></div>
        </div>
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center gap-12 text-center">
        {/* Massive Typography */}
        <div className="max-w-5xl mx-auto space-y-6 flex flex-col items-center w-full">
          <h2 className="text-[clamp(1.5rem,5vw,5.5rem)] leading-none text-[var(--text-primary)] reveal-text font-bold tracking-tight whitespace-nowrap">
            EXPERIENCE THE UNHEARD
          </h2>
          <p className="text-subtitle text-center text-[var(--text-secondary)] max-w-2xl mx-auto mt-6 reveal-text">
            Step into a new dimension of acoustic perfection.<br/>Pre-order the Sonance Zero today and change how you listen forever.
          </p>
        </div>

        {/* Floating Product Image */}
        <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] mt-16 group reveal-text overflow-hidden" style={{ borderRadius: 'var(--radius-sharp)' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent z-10 pointer-events-none"></div>
          <img 
            src="/images/macro.jpg" 
            alt="Sonance Zero Close Up"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-[var(--duration-slow)] ease-[var(--ease-premium)]"
          />
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(3,3,3,1)] z-10 pointer-events-none"></div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mt-16 relative z-20 reveal-text">
          <button className="px-12 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-display tracking-widest uppercase text-sm md:text-base font-bold transition-transform duration-[var(--duration-fast)] ease-[var(--ease-premium)] flex items-center justify-center gap-3 group hover:scale-[1.02]" style={{ borderRadius: 'var(--radius-pill)' }}>
            Pre-Order Now
            <span className="group-hover:translate-x-2 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-premium)]">→</span>
          </button>
          <button className="px-12 py-5 bg-transparent border text-[var(--text-primary)] font-display tracking-widest uppercase text-sm md:text-base transition-colors duration-[var(--duration-fast)] ease-[var(--ease-premium)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-pill)' }}>
            Find a Store
          </button>
        </div>
      </div>
    </section>
  );
}
