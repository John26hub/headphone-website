'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const specsData = [
  {
    category: "ACOUSTIC ENGINE",
    items: [
      { label: "Driver Size", value: "Custom 40mm" },
      { label: "Diaphragm Material", value: "Aerospace-grade Beryllium" },
      { label: "Frequency Response", value: "5Hz – 50,000Hz" },
      { label: "Total Harmonic Distortion (THD)", value: "< 0.05% at 100dB SPL" },
      { label: "Active Noise Cancellation", value: "Adaptive 6-Microphone Array (-42dB)" },
    ]
  },
  {
    category: "CONNECTIVITY",
    items: [
      { label: "Bluetooth Version", value: "5.4 with LE Audio" },
      { label: "Supported Codecs", value: "aptX Lossless, LDAC, AAC, SBC" },
      { label: "Wired Audio", value: "USB-C to USB-C (24-bit/96kHz DAC)" },
      { label: "Multipoint", value: "Simultaneous connection to 2 devices" },
    ]
  },
  {
    category: "POWER & BATTERY",
    items: [
      { label: "Playback Time", value: "40h (ANC On) / 55h (ANC Off)" },
      { label: "Charging", value: "USB-C Fast Charging" },
      { label: "Quick Charge", value: "5 minutes = 5 hours playback" },
      { label: "Full Charge Time", value: "1.5 hours" },
    ]
  },
  {
    category: "DESIGN & BUILD",
    items: [
      { label: "Weight", value: "265g (9.3 oz)" },
      { label: "Chassis Material", value: "Anodized Magnesium Alloy" },
      { label: "Ear Cushions", value: "Memory Foam with Protein Leather" },
      { label: "Clamping Force", value: "4.2N (Optimized for all-day comfort)" },
    ]
  }
];

export default function SpecsSection() {
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Fade in rows as they scroll into view
    rowsRef.current.forEach((row, i) => {
      gsap.fromTo(row,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="specs" ref={sectionRef} className="w-full relative py-24 md:py-40 border-t border-black/[0.05] bg-[#f2efe9] shadow-[inset_0_0_120px_rgba(0,0,0,0.05)]">
      
      {/* Dynamic Backgrounds & Textures */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-multiply pointer-events-none"></div>
        
        {/* Soft Background Highlight */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-white opacity-60 blur-[150px] rounded-full pointer-events-none"></div>
        
        {/* Massive watermark text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-bold text-black/[0.03] whitespace-nowrap pointer-events-none uppercase tracking-tighter mix-blend-multiply font-display select-none">
          SYSTEM
        </div>
      </div>

      <div className="container relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-16 md:gap-24">
        
        {/* Left Side: Sticky Title */}
        <div className="w-full md:w-5/12 relative">
          <div ref={leftColRef} className="md:sticky md:top-40 flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold tracking-[0.15em] text-black uppercase font-display leading-tight">
              Technical<br/>Hologram
            </h2>
            <p className="text-black/60 font-body max-w-sm mt-4 text-sm md:text-base leading-relaxed">
              Every component engineered to microscopic tolerances. The architecture of absolute acoustic purity.
            </p>
          </div>
        </div>

        {/* Right Side: Scrolling Specs */}
        <div className="w-full md:w-7/12 flex flex-col gap-12 md:gap-24 mt-8 md:mt-0">
          {specsData.map((category, idx) => (
            <div 
              key={idx} 
              ref={el => rowsRef.current[idx] = el}
              className="relative w-full bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]"
            >
              {/* Category Title */}
              <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider mb-8 font-display border-b border-white/10 pb-6">
                {category.category}
              </h3>
              
              {/* Content */}
              <div className="flex flex-col gap-6 md:gap-8 relative z-10">
                 {category.items.map((item, itemIdx) => (
                   <div key={itemIdx} className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.05] pb-4">
                     <span className="text-sm md:text-base text-white/50 font-light mb-1 md:mb-0">
                       {item.label}
                     </span>
                     <span className="text-base md:text-lg text-white font-mono tracking-wide text-left md:text-right">
                       {item.value}
                     </span>
                   </div>
                 ))}
              </div>
              
              {/* Corner Decorative Accents */}
              <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/30"></div>
              <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/30"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/30"></div>
              <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/30"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
