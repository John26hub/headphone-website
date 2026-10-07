'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { SplitText } from 'gsap/dist/SplitText';
import Lenis from '@studio-freight/lenis';

import ColorConfigurator from '../components/ColorConfigurator';

import SpecsSection from '../components/SpecsSection';

export default function Home() {
  const canvasRef = useRef(null);
  const heroSectionRef = useRef(null);
  const textRef = useRef(null);
  const soundTextRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const productIntroRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  const designTitleRef = useRef(null);
  const explodedTextRef = useRef(null);
  const lifestyleBgRef = useRef(null);
  const reviewsSectionRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);
  
  const lenisRef = useRef(null); // Reference to Lenis instance for programmatic scrolling

  const [frames, setFrames] = useState([]);
  const frameCount = 180; // Reduced from 210 to remove the extra final frames

  useEffect(() => {
    // 1. Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });
    
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    // 2. Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // 3. Preload images for canvas
    const images = [];
    let loadedImages = 0;
    
    // Create an object to hold the current frame state for GSAP to animate
    const seq = { frame: 0 };

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${paddedIndex}.jpg`;
      
      img.onload = () => {
        loadedImages++;
        // If this is the first image, render it instantly so the page isn't blank
        if (i === 1 || seq.frame === i - 1) {
          render();
        }
      };
      images.push(img);
    }
    setFrames(images);

    // 4. Setup Canvas Rendering
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas resolution
    canvas.width = 1920;
    canvas.height = 1080;

    const render = () => {
      const img = images[seq.frame];
      // Prevent rendering if the image hasn't finished downloading yet
      if (!img || !img.complete || img.naturalWidth === 0) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw image covering the canvas (center crop)
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const x = (canvas.width / 2) - (img.naturalWidth / 2) * scale;
      const y = (canvas.height / 2) - (img.naturalHeight / 2) * scale;
      ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
    };

    // 5. GSAP Animation
    
    // Pin and animate sequence
    gsap.to(seq, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: heroSectionRef.current,
        start: 'top top',
        end: '+=400%',
        scrub: 1,
        pin: true,
      },
      onUpdate: render,
    });

    // Initial Load Animation (Open Transition) with SplitText
    const soundSplit = new SplitText(soundTextRef.current, { type: 'chars, words' });
    const subtitleSplit = new SplitText(subtitleRef.current, { type: 'chars, words' });

    gsap.fromTo(soundSplit.chars,
      { opacity: 0, y: 100, rotateX: -90, scale: 0.8 },
      { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1.8, ease: 'expo.out', stagger: 0.03, delay: 0.2 }
    );
    gsap.fromTo(subtitleSplit.words,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.05, delay: 0.8 }
    );
    gsap.fromTo(scrollIndicatorRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 1.5 }
    );

    // Fade and move out initial text as user starts scrolling (Close Transition)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSectionRef.current,
        start: 'top top',
        end: '+=50%',
        scrub: true,
      }
    });
    
    tl.to(soundTextRef.current, { opacity: 0, y: -150, scale: 0.9 }, 0)
      .to(subtitleRef.current, { opacity: 0, y: -100 }, 0)
      .to(scrollIndicatorRef.current, { opacity: 0, y: 50 }, 0);

    // Fade IN the exploded text stats in the black region (starts midway through scroll)
    gsap.fromTo(explodedTextRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top-=150%', // Start fading in after 150vh of scrolling (when headphones start exploding)
          end: 'top top-=250%',   // Fully visible by 250vh
          scrub: true,
        }
      }
    );

    // Horizontal Scroll for Design Section
    if (horizontalTrackRef.current) {
      const track = horizontalTrackRef.current;
      // Get the total width to scroll
      const getScrollAmount = () => track.scrollWidth - window.innerWidth;
      
      const horizontalTween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: productIntroRef.current,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
      
      // Split text for design title
      if (designTitleRef.current) {
        const titleSplit = new SplitText(designTitleRef.current, { type: 'chars, words' });
        gsap.fromTo(titleSplit.chars, 
          { opacity: 0, x: 20 },
          { 
            opacity: 1, 
            x: 0, 
            stagger: 0.05, 
            ease: "power2.out", 
            duration: 1,
            scrollTrigger: {
              trigger: productIntroRef.current,
              start: "top 60%",
            }
          }
        );
      }
    }

    // Lifestyle Parallax
    if (lifestyleBgRef.current) {
      gsap.fromTo(lifestyleBgRef.current,
        { scale: 1.1, yPercent: -15 },
        {
          scale: 1,
          yPercent: 15, // Parallax effect + Scale down
          ease: 'none',
          scrollTrigger: {
            trigger: '.lifestyle-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    }

    // Expand Line Animation for Separators
    gsap.utils.toArray('.expand-line').forEach((line) => {
      const section = line.closest('section');
      if (section) {
        gsap.fromTo(line, 
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Reviews Section Parallax Scroll
    if (reviewsSectionRef.current) {
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;
      const row3 = row3Ref.current;

      gsap.to(row1, {
        xPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: reviewsSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      gsap.to(row2, {
        xPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: reviewsSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      gsap.to(row3, {
        xPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: reviewsSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetId, {
        duration: 2.2, // Cinematic slow scroll
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -12 * t)), // Exponential ease out
        offset: 0, // Scroll exactly to the top of the section
      });
    }
  };

  return (
    <main>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-logo">SONANCE</div>
        <div className="nav-links">
          <a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="nav-link">Design</a>
          <a href="#tech" onClick={(e) => handleNavClick(e, '#tech')} className="nav-link">Technology</a>
          <a href="#specs" onClick={(e) => handleNavClick(e, '#specs')} className="nav-link">Specs</a>
        </div>
        <a href="#buy" onClick={(e) => handleNavClick(e, '#buy')} className="nav-cta">Pre-order</a>
      </nav>
      {/* Decorative UI Line */}
      <div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[100] w-full max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-full bg-white blur-[2px] opacity-60"></div>
      </div>


      {/* Hero Scroll Video Section */}
      <section ref={heroSectionRef} className="hero-section section-dark">
        <div className="hero-sticky">
          <canvas ref={canvasRef} className="hero-canvas"></canvas>
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10 w-full h-full mix-blend-difference">
            <div className="text-center w-full px-4 flex flex-col items-center">
              <h1 ref={soundTextRef} className="hero-title-massive">SONANCE ZERO</h1>
              <p ref={subtitleRef} className="hero-subtitle-massive">HEAR THE FUTURE</p>
            </div>
          </div>
          
          <div ref={scrollIndicatorRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 mix-blend-difference text-white opacity-80">
            <span className="text-[0.7rem] tracking-[0.2em] uppercase font-semibold">SCROLL TO EXPLORE</span>
            <span className="text-lg">↓</span>
          </div>
          
          <div ref={explodedTextRef} className="exploded-overlay">
            <h2 className="exploded-title">Precision Engineering</h2>
            <div className="exploded-stats">
              <div className="stat">
                <span className="stat-value">4K</span>
                <span className="stat-label">ANC Adjustments/sec</span>
              </div>
              <div className="stat">
                <span className="stat-value">0%</span>
                <span className="stat-label">Total Harmonic Distortion</span>
              </div>
              <div className="stat">
                <span className="stat-value">40h</span>
                <span className="stat-label">Battery Life</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Pillars Intro - Horizontal Editorial Layout */}
      <section 
        id="features" 
        ref={productIntroRef} 
        className="relative w-full h-screen bg-[#020202] overflow-hidden flex items-center border-t border-white/[0.05]"
      >
        {/* Background Textures */}
        <div className="absolute inset-0 bg-grid-white pointer-events-none z-0 opacity-40"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-screen pointer-events-none z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-bold text-white/[0.02] whitespace-nowrap pointer-events-none uppercase tracking-tighter font-display select-none">
          ENGINEERING
        </div>

        <div ref={horizontalTrackRef} className="flex h-[80vh] items-center px-[5vw] relative z-10 w-max gap-16 md:gap-32 hardware-accelerate">
          
          {/* Panel 1: Title */}
          <div className="w-[80vw] md:w-[40vw] flex flex-col justify-center">
             <div className="flex items-center gap-4 mb-8">
               <span className="w-12 h-[1px] bg-white/50"></span>
               <span className="text-white/50 tracking-widest text-xs uppercase font-body">Design System 01</span>
             </div>
             <h2 ref={designTitleRef} className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-white uppercase">
               ENGINEERED<br/>FOR THE<br/>OBSESSIVE
             </h2>
          </div>

          {/* Panel 2: Acoustic Purity */}
          <div className="w-[85vw] md:w-[60vw] h-full flex items-center relative group">
            {/* Corner Crosshairs */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40 pointer-events-none"></div>
            
            <div className="w-full h-[65vh] relative premium-border overflow-hidden bg-white/[0.02] p-4 flex flex-col md:flex-row backdrop-blur-none md:backdrop-blur-sm">
              <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden group-hover:bg-white/5 transition-colors">
                <img src="/images/feature_1.jpg" className="w-full h-full object-cover grayscale opacity-70 mix-blend-screen transition-transform duration-1000 group-hover:scale-105" alt="Acoustic Purity" />
                <div className="absolute bottom-4 left-4 text-[10px] md:text-xs font-mono text-white bg-black/80 px-2 py-1 backdrop-blur-none md:backdrop-blur-md uppercase border border-white/20">[ Ø 40MM BERYLLIUM ]</div>
              </div>
              <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-6 md:p-12 relative bg-black/40 border-t md:border-t-0 md:border-l border-white/10">
                <span className="text-white/40 font-mono text-xs mb-4 uppercase tracking-widest flex items-center justify-between w-full">
                  <span>01 // Architecture</span>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                </span>
                <h3 className="text-white text-3xl md:text-5xl font-bold uppercase mb-6 tracking-tight">Acoustic Purity</h3>
                <p className="text-white/60 text-sm md:text-base leading-relaxed font-light">Beryllium drivers suspended in a vacuum-sealed chamber deliver absolute zero distortion, recreating the original master recording with flawless precision.</p>
              </div>
            </div>
          </div>

          {/* Panel 3: Absolute Silence */}
          <div className="w-[85vw] md:w-[60vw] h-full flex items-center relative group">
            {/* Corner Crosshairs */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40 pointer-events-none"></div>
            
            <div className="w-full h-[65vh] relative premium-border overflow-hidden bg-white/[0.02] p-4 flex flex-col md:flex-row backdrop-blur-none md:backdrop-blur-sm">
              <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden group-hover:bg-white/5 transition-colors">
                <img src="/images/feature_2.jpg" className="w-full h-full object-cover grayscale opacity-70 mix-blend-screen transition-transform duration-1000 group-hover:scale-105" alt="Absolute Silence" />
                <div className="absolute bottom-4 left-4 text-[10px] md:text-xs font-mono text-white bg-black/80 px-2 py-1 backdrop-blur-none md:backdrop-blur-md uppercase border border-white/20">[ ANC: ACTIVE ]</div>
              </div>
              <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-6 md:p-12 relative bg-black/40 border-t md:border-t-0 md:border-l border-white/10">
                <span className="text-white/40 font-mono text-xs mb-4 uppercase tracking-widest flex items-center justify-between w-full">
                  <span>02 // Processing</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                </span>
                <h3 className="text-white text-3xl md:text-5xl font-bold uppercase mb-6 tracking-tight">Absolute Silence</h3>
                <p className="text-white/60 text-sm md:text-base leading-relaxed font-light">Neural-net powered active noise cancellation adapts 4,000 times per second to your environment, erasing the outside world in real-time.</p>
              </div>
            </div>
          </div>

          {/* Panel 4: Weightless Fit */}
          <div className="w-[85vw] md:w-[60vw] h-full flex items-center relative group pr-[5vw]">
            {/* Corner Crosshairs */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40 pointer-events-none"></div>
            
            <div className="w-full h-[65vh] relative premium-border overflow-hidden bg-white/[0.02] p-4 flex flex-col md:flex-row backdrop-blur-none md:backdrop-blur-sm">
              <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden group-hover:bg-white/5 transition-colors">
                <img src="/images/feature_3.jpg" className="w-full h-full object-cover grayscale opacity-70 mix-blend-screen transition-transform duration-1000 group-hover:scale-105" alt="Weightless Fit" />
                <div className="absolute bottom-4 left-4 text-[10px] md:text-xs font-mono text-white bg-black/80 px-2 py-1 backdrop-blur-none md:backdrop-blur-md uppercase border border-white/20">[ MAT: MAGNESIUM ]</div>
              </div>
              <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-6 md:p-12 relative bg-black/40 border-t md:border-t-0 md:border-l border-white/10">
                <span className="text-white/40 font-mono text-xs mb-4 uppercase tracking-widest flex items-center justify-between w-full">
                  <span>03 // Ergonomics</span>
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                </span>
                <h3 className="text-white text-3xl md:text-5xl font-bold uppercase mb-6 tracking-tight">Weightless Fit</h3>
                <p className="text-white/60 text-sm md:text-base leading-relaxed font-light">Sculpted aerospace-grade magnesium and memory foam wrapped in synthetic protein leather. They disappear the moment you put them on.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Craftsmanship Parallax */}
      <section className="lifestyle-section">
        <img ref={lifestyleBgRef} src="/images/lifestyle.jpg" alt="Sonance Zero Design" className="lifestyle-bg" />
        <div className="lifestyle-overlay"></div>
        <div className="lifestyle-content">
          <h2 className="lifestyle-title">Form meets function</h2>
          <p className="lifestyle-desc">Sculpted from a single block of aerospace-grade magnesium, Sonance Zero disappears when worn, leaving only the music. The weightless design and breathable acoustic mesh ensure absolute comfort during extended listening sessions, while the anodized finish resists scratches and fingerprints.</p>
        </div>
      </section>

      {/* Technology Bento Grid */}
      <section id="tech" className="tech-section relative w-full min-h-screen flex flex-col justify-center items-center bg-[#f2efe9] overflow-hidden shadow-[inset_0_0_120px_rgba(0,0,0,0.05)]">
        {/* Textures & Designs */}
        <div className="absolute inset-0 bg-grid pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-multiply pointer-events-none z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-bold text-black/[0.03] whitespace-nowrap pointer-events-none uppercase tracking-tighter mix-blend-multiply z-0 font-display select-none">
          ARCHITECTURE
        </div>
        
        {/* Soft Background Highlight */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-white opacity-80 blur-[150px] rounded-full pointer-events-none z-0"></div>
        
        <div className="container relative z-10 w-full">
        <h2 className="text-title w-full text-center mb-12 text-black">
          NO COMPROMISES
        </h2>
        <div className="bento-grid">
          <div className="bento-card bento-item-large">
            <img src="/images/macro.jpg" alt="Acoustic Mesh" />
            <div className="bento-content">
              <span className="bento-label">Acoustic Architecture</span>
              <h3 className="bento-title">Woven Titanium Mesh</h3>
              <p className="text-subtitle mt-4 max-w-md">Our custom-engineered mesh minimizes acoustic resistance by 40%, ensuring completely transparent sound delivery.</p>
            </div>
          </div>
          <div className="bento-card bento-item-small">
            <img src="/images/bento_chip.jpg" alt="H1 Neural Chip" />
            <div className="bento-content">
              <span className="bento-label">Processing</span>
              <h3 className="bento-title">H1 Neural Chip</h3>
              <p className="text-subtitle mt-4">16-core processor executing 4 billion operations per second.</p>
            </div>
          </div>
          <div className="bento-card bento-item-small">
            <img src="/images/bento_wireless.jpg" alt="Lossless Wireless" />
            <div className="bento-content">
              <span className="bento-label">Connectivity</span>
              <h3 className="bento-title">Lossless Wireless</h3>
              <p className="text-subtitle mt-4">24-bit/96kHz high-resolution audio streamed without compression.</p>
            </div>
          </div>
          <div className="bento-card bento-item-large">
            <img src="/images/feature_2.jpg" alt="40 Hours Continuous" />
            <div className="bento-content">
              <span className="bento-label">Battery</span>
              <h3 className="bento-title">40 Hours Continuous</h3>
              <p className="text-subtitle mt-4">A single charge lasts a full work week. 5 minutes of charging yields 5 hours of playback.</p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Color Configurator */}
      <ColorConfigurator />

      {/* Technical Specifications Section */}
      <SpecsSection />

      {/* Customer Feedback Marquee - 3 Rows */}
      <section ref={reviewsSectionRef} className="min-h-screen relative py-24 md:py-32 overflow-hidden bg-[var(--bg-primary)] flex flex-col justify-center gap-8 md:gap-12">
        {/* Scroll-Driven Expanding Premium Separator */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/[0.03] pointer-events-none flex justify-center">
          {/* The line that will expand using GSAP */}
          <div className="expand-line w-full h-[1px] relative flex justify-center origin-center">
            {/* Base glow */}
            <div className="absolute top-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px]"></div>
            {/* Intense center spot */}
            <div className="absolute top-[1px] w-1/4 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[2px]"></div>
            {/* Soft volumetric light bleed (Downwards) */}
            <div className="absolute top-0 w-3/4 h-[250px] bg-gradient-to-b from-white/[0.03] to-transparent blur-[50px] rounded-b-full pointer-events-none"></div>
            {/* Secondary inner light bleed */}
            <div className="absolute top-0 w-1/3 h-[150px] bg-gradient-to-b from-white/[0.05] to-transparent blur-[30px] rounded-b-full pointer-events-none"></div>
          </div>
        </div>
        <div className="container mb-8 relative z-10">
          <h2 className="text-title text-center w-full">CRITICAL ACCLAIM</h2>
        </div>
        
        {/* Row 1 (Left) */}
        <div ref={row1Ref} className="flex whitespace-nowrap gap-6 md:gap-8 px-4 w-max hardware-accelerate">
          {[
            { text: "The most transparent audio I've ever experienced. It feels like the band is in the room.", name: "Marcus Chen", handle: "@marcus_audio", img: "https://randomuser.me/api/portraits/men/32.jpg", color: "from-blue-500/10 to-transparent" },
            { text: "Flawless design meets uncompromising performance. Worth every penny.", name: "Sarah Jenkins", handle: "@sjenkins_tech", img: "https://randomuser.me/api/portraits/women/44.jpg", color: "from-purple-500/10 to-transparent" },
            { text: "It doesn't just play music, it reveals it. I'm hearing details I never knew existed.", name: "David Alaba", handle: "@davida_studio", img: "https://randomuser.me/api/portraits/men/68.jpg", color: "from-emerald-500/10 to-transparent" },
            { text: "A masterclass in acoustic engineering. Sonance has outdone themselves.", name: "Elena Rostova", handle: "@elena_listens", img: "https://randomuser.me/api/portraits/women/65.jpg", color: "from-rose-500/10 to-transparent" },
            // Duplicated
            { text: "The most transparent audio I've ever experienced. It feels like the band is in the room.", name: "Marcus Chen", handle: "@marcus_audio", img: "https://randomuser.me/api/portraits/men/32.jpg", color: "from-blue-500/10 to-transparent" },
            { text: "Flawless design meets uncompromising performance. Worth every penny.", name: "Sarah Jenkins", handle: "@sjenkins_tech", img: "https://randomuser.me/api/portraits/women/44.jpg", color: "from-purple-500/10 to-transparent" },
            { text: "It doesn't just play music, it reveals it. I'm hearing details I never knew existed.", name: "David Alaba", handle: "@davida_studio", img: "https://randomuser.me/api/portraits/men/68.jpg", color: "from-emerald-500/10 to-transparent" },
            { text: "A masterclass in acoustic engineering. Sonance has outdone themselves.", name: "Elena Rostova", handle: "@elena_listens", img: "https://randomuser.me/api/portraits/women/65.jpg", color: "from-rose-500/10 to-transparent" },
            // Triplicated to prevent empty gaps
            { text: "The most transparent audio I've ever experienced. It feels like the band is in the room.", name: "Marcus Chen", handle: "@marcus_audio", img: "https://randomuser.me/api/portraits/men/32.jpg", color: "from-blue-500/10 to-transparent" },
            { text: "Flawless design meets uncompromising performance. Worth every penny.", name: "Sarah Jenkins", handle: "@sjenkins_tech", img: "https://randomuser.me/api/portraits/women/44.jpg", color: "from-purple-500/10 to-transparent" },
            { text: "It doesn't just play music, it reveals it. I'm hearing details I never knew existed.", name: "David Alaba", handle: "@davida_studio", img: "https://randomuser.me/api/portraits/men/68.jpg", color: "from-emerald-500/10 to-transparent" },
            { text: "A masterclass in acoustic engineering. Sonance has outdone themselves.", name: "Elena Rostova", handle: "@elena_listens", img: "https://randomuser.me/api/portraits/women/65.jpg", color: "from-rose-500/10 to-transparent" },
          ].map((review, i) => (
            <div key={i} className="relative overflow-hidden w-[300px] md:w-[400px] p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] backdrop-blur-none md:backdrop-blur-md flex flex-col gap-4 flex-shrink-0 transition-colors hover:bg-white/[0.06]" style={{ borderRadius: 'var(--radius-sharp)' }}>
              <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" style={{ borderRadius: 'var(--radius-sharp)' }}></div>
              <div className="flex items-center gap-4 relative z-10">
                <img src={review.img} alt={review.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="text-[var(--text-primary)] text-sm md:text-base font-medium font-body">{review.name}</span>
                  <span className="text-[var(--text-secondary)] text-xs font-body tracking-wide uppercase">{review.handle}</span>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed font-light font-body whitespace-normal relative z-10">"{review.text}"</p>
            </div>
          ))}
        </div>

        {/* Row 2 (Right) */}
        <div ref={row2Ref} className="flex whitespace-nowrap gap-6 md:gap-8 px-4 w-max -ml-[1000px] hardware-accelerate">
          {[
            { text: "Weightless fit is not an exaggeration. I wore them for 8 hours straight with zero fatigue.", name: "James Wilson", handle: "@jwilson_prod", img: "https://randomuser.me/api/portraits/men/59.jpg", color: "from-amber-500/10 to-transparent" },
            { text: "The active noise cancellation is practically magic. Absolute silence on my flights.", name: "Michael Chang", handle: "@mchang_design", img: "https://randomuser.me/api/portraits/men/33.jpg", color: "from-indigo-500/10 to-transparent" },
            { text: "I've reviewed hundreds of headphones. These are in a class of their own.", name: "Tech Visionary", handle: "@tech_vis", img: "https://randomuser.me/api/portraits/women/12.jpg", color: "from-teal-500/10 to-transparent" },
            { text: "Beautifully crafted. The magnesium earcups feel incredibly premium and cold to touch.", name: "Sophia Lee", handle: "@sophial_art", img: "https://randomuser.me/api/portraits/women/20.jpg", color: "from-pink-500/10 to-transparent" },
            // Duplicated
            { text: "Weightless fit is not an exaggeration. I wore them for 8 hours straight with zero fatigue.", name: "James Wilson", handle: "@jwilson_prod", img: "https://randomuser.me/api/portraits/men/59.jpg", color: "from-amber-500/10 to-transparent" },
            { text: "The active noise cancellation is practically magic. Absolute silence on my flights.", name: "Michael Chang", handle: "@mchang_design", img: "https://randomuser.me/api/portraits/men/33.jpg", color: "from-indigo-500/10 to-transparent" },
            { text: "I've reviewed hundreds of headphones. These are in a class of their own.", name: "Tech Visionary", handle: "@tech_vis", img: "https://randomuser.me/api/portraits/women/12.jpg", color: "from-teal-500/10 to-transparent" },
            { text: "Beautifully crafted. The magnesium earcups feel incredibly premium and cold to touch.", name: "Sophia Lee", handle: "@sophial_art", img: "https://randomuser.me/api/portraits/women/20.jpg", color: "from-pink-500/10 to-transparent" },
            // Triplicated to prevent empty gaps
            { text: "Weightless fit is not an exaggeration. I wore them for 8 hours straight with zero fatigue.", name: "James Wilson", handle: "@jwilson_prod", img: "https://randomuser.me/api/portraits/men/59.jpg", color: "from-amber-500/10 to-transparent" },
            { text: "The active noise cancellation is practically magic. Absolute silence on my flights.", name: "Michael Chang", handle: "@mchang_design", img: "https://randomuser.me/api/portraits/men/33.jpg", color: "from-indigo-500/10 to-transparent" },
            { text: "I've reviewed hundreds of headphones. These are in a class of their own.", name: "Tech Visionary", handle: "@tech_vis", img: "https://randomuser.me/api/portraits/women/12.jpg", color: "from-teal-500/10 to-transparent" },
            { text: "Beautifully crafted. The magnesium earcups feel incredibly premium and cold to touch.", name: "Sophia Lee", handle: "@sophial_art", img: "https://randomuser.me/api/portraits/women/20.jpg", color: "from-pink-500/10 to-transparent" },
          ].map((review, i) => (
            <div key={i} className="relative overflow-hidden w-[300px] md:w-[400px] p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] backdrop-blur-none md:backdrop-blur-md flex flex-col gap-4 flex-shrink-0 transition-colors hover:bg-white/[0.06]" style={{ borderRadius: 'var(--radius-sharp)' }}>
              <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" style={{ borderRadius: 'var(--radius-sharp)' }}></div>
              <div className="flex items-center gap-4 relative z-10">
                <img src={review.img} alt={review.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="text-[var(--text-primary)] text-sm md:text-base font-medium font-body">{review.name}</span>
                  <span className="text-[var(--text-secondary)] text-xs font-body tracking-wide uppercase">{review.handle}</span>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed font-light font-body whitespace-normal relative z-10">"{review.text}"</p>
            </div>
          ))}
        </div>

        {/* Row 3 (Left) */}
        <div ref={row3Ref} className="flex whitespace-nowrap gap-6 md:gap-8 px-4 w-max ml-[100px] hardware-accelerate">
          {[
            { text: "Battery life is insane. I charge them once a week with heavy use.", name: "Alex Mercer", handle: "@amercer_dev", img: "https://randomuser.me/api/portraits/men/53.jpg", color: "from-fuchsia-500/10 to-transparent" },
            { text: "The spatial audio implementation is the best I've ever heard. Period.", name: "Lisa Wong", handle: "@lisaw_audio", img: "https://randomuser.me/api/portraits/women/33.jpg", color: "from-cyan-500/10 to-transparent" },
            { text: "Finally, a pair of headphones that looks as good as it sounds.", name: "Julian Bates", handle: "@jbates_style", img: "https://randomuser.me/api/portraits/men/41.jpg", color: "from-orange-500/10 to-transparent" },
            { text: "They completely changed how I mix my tracks on the go.", name: "DJ Kora", handle: "@kora_mixes", img: "https://randomuser.me/api/portraits/women/50.jpg", color: "from-lime-500/10 to-transparent" },
            // Duplicated
            { text: "Battery life is insane. I charge them once a week with heavy use.", name: "Alex Mercer", handle: "@amercer_dev", img: "https://randomuser.me/api/portraits/men/53.jpg", color: "from-fuchsia-500/10 to-transparent" },
            { text: "The spatial audio implementation is the best I've ever heard. Period.", name: "Lisa Wong", handle: "@lisaw_audio", img: "https://randomuser.me/api/portraits/women/33.jpg", color: "from-cyan-500/10 to-transparent" },
            { text: "Finally, a pair of headphones that looks as good as it sounds.", name: "Julian Bates", handle: "@jbates_style", img: "https://randomuser.me/api/portraits/men/41.jpg", color: "from-orange-500/10 to-transparent" },
            { text: "They completely changed how I mix my tracks on the go.", name: "DJ Kora", handle: "@kora_mixes", img: "https://randomuser.me/api/portraits/women/50.jpg", color: "from-lime-500/10 to-transparent" },
            // Triplicated to prevent empty gaps
            { text: "Battery life is insane. I charge them once a week with heavy use.", name: "Alex Mercer", handle: "@amercer_dev", img: "https://randomuser.me/api/portraits/men/53.jpg", color: "from-fuchsia-500/10 to-transparent" },
            { text: "The spatial audio implementation is the best I've ever heard. Period.", name: "Lisa Wong", handle: "@lisaw_audio", img: "https://randomuser.me/api/portraits/women/33.jpg", color: "from-cyan-500/10 to-transparent" },
            { text: "Finally, a pair of headphones that looks as good as it sounds.", name: "Julian Bates", handle: "@jbates_style", img: "https://randomuser.me/api/portraits/men/41.jpg", color: "from-orange-500/10 to-transparent" },
            { text: "They completely changed how I mix my tracks on the go.", name: "DJ Kora", handle: "@kora_mixes", img: "https://randomuser.me/api/portraits/women/50.jpg", color: "from-lime-500/10 to-transparent" },
          ].map((review, i) => (
            <div key={i} className="relative overflow-hidden w-[300px] md:w-[400px] p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] backdrop-blur-none md:backdrop-blur-md flex flex-col gap-4 flex-shrink-0 transition-colors hover:bg-white/[0.06]" style={{ borderRadius: 'var(--radius-sharp)' }}>
              <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" style={{ borderRadius: 'var(--radius-sharp)' }}></div>
              <div className="flex items-center gap-4 relative z-10">
                <img src={review.img} alt={review.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="text-[var(--text-primary)] text-sm md:text-base font-medium font-body">{review.name}</span>
                  <span className="text-[var(--text-secondary)] text-xs font-body tracking-wide uppercase">{review.handle}</span>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed font-light font-body whitespace-normal relative z-10">"{review.text}"</p>
            </div>
          ))}
        </div>
      </section>


    </main>
  );
}
