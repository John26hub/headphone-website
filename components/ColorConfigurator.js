'use client';

import { useState } from 'react';
import Image from 'next/image';

const colors = [
  { id: 'midnight', name: 'Midnight Black', hex: '#111111', image: '/images/headphone-midnight.jpg' },
  { id: 'ivory', name: 'Cloud Ivory', hex: '#EBEBE6', image: '/images/headphone-ivory.jpg' },
  { id: 'graphite', name: 'Graphite Grey', hex: '#4A4A4A', image: '/images/headphone-graphite.jpg' }
];

export default function ColorConfigurator() {
  const [activeColor, setActiveColor] = useState(colors[0]);

  return (
    <section className="min-h-screen color-showcase py-24 md:py-32 w-full bg-[#050505] relative z-10 flex flex-col justify-center overflow-hidden border-t border-white/5">
      
      {/* Background Textures */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      <div className="absolute inset-0 bg-noise mix-blend-screen opacity-[0.04] pointer-events-none"></div>
      
      {/* Volumetric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Scroll-Driven Expanding Premium Separator */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/[0.03] pointer-events-none flex justify-center">
        <div className="expand-line w-full h-[1px] relative flex justify-center origin-center">
          <div className="absolute top-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px]"></div>
          <div className="absolute top-[1px] w-1/4 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[2px]"></div>
        </div>
      </div>

      <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 w-full max-w-7xl mx-auto">
        
        {/* Left: Typography, Controls & Description */}
        <div className="w-full lg:w-4/12 flex flex-col items-center lg:items-start gap-10 relative z-20 text-center lg:text-left">
          
          <div className="flex flex-col items-center lg:items-start">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
              <span className="w-8 h-[1px] bg-white/30 hidden lg:block"></span>
              <h2 className="text-xs font-mono tracking-[0.4em] text-white/50 uppercase">Configuration</h2>
            </div>
            <h3 className="text-2xl lg:text-3xl font-sans font-bold uppercase tracking-tight text-white text-center lg:text-left">
              MAKE IT YOURS
            </h3>
          </div>
          
          <div className="flex flex-col gap-8 w-full items-center lg:items-start">
            <div className="flex flex-col gap-3 items-center lg:items-start">
              <span className="text-[0.65rem] font-mono text-white/40 tracking-[0.2em] uppercase">Selected Finish</span>
              <h4 className="text-2xl md:text-3xl font-body text-white font-light tracking-wide">{activeColor.name}</h4>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-6">
              {colors.map((color) => (
                <button 
                  key={color.id}
                  onClick={() => setActiveColor(color)}
                  className={`group relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500 outline-none ${
                    activeColor.id === color.id ? 'scale-100' : 'scale-90 opacity-40 hover:opacity-100 hover:scale-100'
                  }`}
                  aria-label={`Select ${color.name} finish`}
                >
                  <div 
                    className={`absolute inset-0 rounded-full border transition-all duration-700 ease-[var(--ease-premium)] ${
                      activeColor.id === color.id ? 'border-white scale-110 opacity-100' : 'border-white/30 scale-100 opacity-0 group-hover:opacity-100'
                    }`}
                  ></div>
                  <span 
                    className="w-12 h-12 rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] border border-white/10 transition-transform duration-500" 
                    style={{ backgroundColor: color.hex }}
                  ></span>
                </button>
              ))}
            </div>

            <p className="text-white/40 text-sm font-light max-w-sm mt-4 leading-relaxed text-center lg:text-left">
              Aerospace-grade anodized aluminum combined with premium synthetic acoustics. Each finish undergoes a 40-hour treatment process.
            </p>
          </div>
        </div>

        {/* Right: Image Viewer */}
        <div className="w-full lg:w-8/12 relative aspect-square md:aspect-[16/10] flex items-center justify-center bg-white/[0.01] border border-white/10 overflow-hidden backdrop-blur-md group" style={{ borderRadius: 'var(--radius-sharp)' }}>
          
          {/* Glass/Grid UI elements inside the viewer */}
          <div className="absolute inset-0 bg-grid-white/[0.04] bg-[size:30px_30px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
          
          {/* Corner Crosshairs */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/30 -translate-x-[1px] -translate-y-[1px]"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/30 translate-x-[1px] -translate-y-[1px]"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/30 -translate-x-[1px] translate-y-[1px]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/30 translate-x-[1px] translate-y-[1px]"></div>

          <div className="absolute top-6 right-6 text-[0.65rem] font-mono text-white/30 tracking-[0.2em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            [ LIVE VIEW ]
          </div>
          
          {colors.map((color) => (
            <div 
              key={color.id}
              className={`absolute inset-0 w-full h-full p-8 md:p-16 flex items-center justify-center transition-all duration-[1200ms] ease-[var(--ease-premium)] ${
                activeColor.id === color.id ? 'opacity-100 scale-100 rotate-0 z-10' : 'opacity-0 scale-110 -rotate-2 z-0'
              }`}
            >
              <img 
                src={color.image} 
                alt={`${color.name} Sonance Zero`}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
