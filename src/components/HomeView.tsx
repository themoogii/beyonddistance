import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { FluidCursor } from "./FluidCursor";
import { AnimatedCopy } from "./AnimatedCopy";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HomeViewProps {
  onNavigate: (page: string) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  // Countdown timer calculation to Aug 29, 2026 10:00:00 UB (UTC+8)
  useEffect(() => {
    const targetDate = new Date("2026-08-29T10:00:00+08:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft((prev) => ({ ...prev, isOver: true }));
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: d,
          hours: h,
          minutes: m,
          seconds: s,
          isOver: false,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Staggered ScrollTrigger refreshes to align with page transition finishes
    const refreshTimers = [100, 300, 600, 1000, 1600].map((delay) =>
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, delay)
    );

    let ctx: gsap.Context;

    // Wait slightly for DOM flow and transition cover to sweep clear
    const initTimer = setTimeout(() => {
      if (!sectionRef.current) return;

      const headingElements = sectionRef.current.querySelectorAll(".gsap-heading-el");
      const steps = sectionRef.current.querySelectorAll(".gsap-stage-step");

      ctx = gsap.context(() => {
        // 1. Heading Elements Animation (staggered fade and slide up)
        gsap.fromTo(
          headingElements,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // 2. Timeline line scroll-bound scaled growth
        const timelineLine = sectionRef.current?.querySelector(".gsap-timeline-line");
        if (timelineLine) {
          gsap.fromTo(
            timelineLine,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: "top center",
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 65%",
                end: "bottom 85%",
                scrub: true,
              },
            }
          );
        }

        // 3. Stage Steps individual animations
        steps.forEach((step) => {
          const dot = step.querySelector(".gsap-dot");
          const title = step.querySelector(".gsap-step-title");
          const desc = step.querySelector(".gsap-step-desc");
          const stats = step.querySelector(".gsap-step-stats");
          const visual = step.querySelector(".gsap-step-visual");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });

          tl.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
          )
            .fromTo(
              [title, desc, stats],
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" },
              "-=0.3"
            )
            .fromTo(
              visual,
              { opacity: 0, y: 40, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
              "-=0.5"
            );
        });
      }, sectionRef);

      // Trigger recalculation immediately after initialization
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(initTimer);
      refreshTimers.forEach((t) => clearTimeout(t));
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div className="w-full bg-[#080808] text-white min-h-screen">
      
      {/* Absolute Background Hero backdrop loaded from project storage */}
      <div className="relative w-full h-[90vh] md:h-screen flex flex-col justify-center overflow-hidden">
        <video
          id="skyline"
          className="absolute inset-0 w-full h-full object-cover z-[1] opacity-40 mix-blend-lighten"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/manus-storage/hero_video_b9490206.mp4" type="video/mp4" />
        </video>

        {/* Dynamic Scanlines & Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/80 z-[3]" />
        <FluidCursor />

        {/* Hero Central Header */}
        <div className="relative z-10 flex-grow flex flex-col justify-center items-center px-4 text-center mt-12 md:mt-0 select-none">
          <div className="inline-block px-3 py-1 bg-[#FF0099] text-black font-mono text-xs uppercase tracking-widest font-black mb-6">
            7K CLUB PRESENTS
          </div>
          
          <AnimatedCopy
            variant="diffuse"
            onScroll={false}
            delay={0.1}
            tag="h1"
            className="text-white font-black leading-[0.85] font-sans text-6xl sm:text-8xl md:text-[11rem] tracking-tighter uppercase cursor-default select-none transition-all text-center w-full block mx-auto justify-center"
          >
            BEYOND
          </AnimatedCopy>

          <AnimatedCopy
            variant="diffuse"
            onScroll={false}
            delay={0.3}
            tag="h1"
            className="text-[#FF0099] font-black leading-[0.85] font-sans text-6xl sm:text-8xl md:text-[11rem] tracking-tighter uppercase cursor-default select-none transition-all text-center w-full block mx-auto justify-center"
          >
            DISTANCE
          </AnimatedCopy>

          {/* High-tech Timing HUD Countdown Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="mt-10 backdrop-blur-md bg-black/30 border border-zinc-900/60 px-8 py-4 flex flex-col items-center max-w-xs sm:max-w-sm w-full mx-auto shadow-2xl relative overflow-hidden"
          >
            {/* Structural high-tech corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-800" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-800" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-800" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-800" />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-[#FF0099]/40" />

            <p className="text-[9px] text-[#FF0099] font-mono tracking-[0.25em] uppercase font-bold mb-3.5">
              GRID INITIATION SEQUENCE
            </p>

            <div className="flex items-center justify-center gap-4 font-mono select-none">
              <div className="text-center min-w-[45px]">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none block">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[8px] text-zinc-500 block uppercase tracking-wider mt-1.5">DAYS</span>
              </div>
              <span className="text-md text-zinc-800 font-light translate-y-[-4px]">:</span>
              
              <div className="text-center min-w-[45px]">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none block">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[8px] text-zinc-500 block uppercase tracking-wider mt-1.5">HOURS</span>
              </div>
              <span className="text-md text-zinc-800 font-light translate-y-[-4px]">:</span>

              <div className="text-center min-w-[45px]">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none block">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[8px] text-zinc-500 block uppercase tracking-wider mt-1.5">MINS</span>
              </div>
              <span className="text-md text-zinc-800 font-light translate-y-[-4px]">:</span>

              <div className="text-center min-w-[45px]">
                <span className="text-2xl sm:text-3xl font-black text-[#FF0099] tracking-tight leading-none block drop-shadow-[0_0_10px_rgba(255,0,153,0.4)]">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[8px] text-[#FF0099] font-bold block uppercase tracking-wider mt-1.5">SECS</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>



      {/* Race Mechanics / Qualification Path Section */}
      <section ref={sectionRef} className="py-24 border-t border-[#111111] bg-black px-6 relative overflow-hidden" id="qualification-path">
        {/* Subtle grid bg matching the app */}
        <div className="absolute inset-0 bg-[#080808]/70 opacity-30 select-none pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <main className="page relative z-10 w-full">
          <div className="text-center mb-16 w-full flex flex-col items-center justify-center">
            <span className="gsap-heading-el text-xs uppercase tracking-[0.3em] text-[#FF0099] font-mono font-bold block mb-3 text-center w-full opacity-0">GRAND PRIX MECHANICS</span>
            <h2 className="gsap-heading-el text-3xl md:text-5xl font-black uppercase tracking-tight leading-none text-white max-w-2xl mx-auto text-center w-full block opacity-0">
              THE QUALIFICATION PATH &amp; STAGE SYSTEM
            </h2>
            <p className="gsap-heading-el text-zinc-500 font-mono text-xs uppercase mt-4 tracking-widest text-center w-full block opacity-0">
              From 500 initial contenders down to a high-speed motorsport duel
            </p>
          </div>

          {/* Vertical Path Timeline - Centered */}
          <div className="relative flex flex-col items-center space-y-40 w-full">
            {/* Elegant middle timeline track (static background guide) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-zinc-900 pointer-events-none z-0" />
            
            {/* Glowing animated line tracking scroll progress down the timeline */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-[#FF0099] via-fuchsia-500 to-transparent pointer-events-none z-0 gsap-timeline-line origin-top" />
            
            {/* Step 1 */}
            <section className="stage gsap-stage-step relative group w-full text-center flex flex-col items-center z-10 font-sans">
              {/* Timeline dot centered */}
              <div className="gsap-dot relative w-8 h-8 bg-black border-2 border-zinc-700 hover:border-[#FF0099] rounded-full group-hover:border-[#FF0099] transition-all flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 opacity-0 scale-0">
                <div className="w-3 h-3 bg-zinc-600 group-hover:bg-[#FF0099] rounded-full transition-all" />
              </div>

              <div className="gsap-step-title flex flex-col sm:flex-row items-center justify-center gap-2 mb-3 opacity-0">
                <span className="font-mono text-xs text-[#FF0099] font-bold tracking-wider px-2 py-0.5 bg-[#FF0099]/15 uppercase border border-[#FF0099]/30 block max-w-max">STAGE 01</span>
                <h3 className="font-sans font-black text-2xl md:text-3xl text-white uppercase tracking-tight text-center">
                  The 10K Endurance Trial
                </h3>
              </div>
              <p className="gsap-step-desc text-zinc-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl px-4 opacity-0 text-center">
                The race begins as a classic 10,000-meter trial. Every athlete wears active RFID timing microchips that measure continuous performance down to a thousandth of a second. Endurance, pacing, and strategic reserves decide this baseline stage.
              </p>
              <div className="gsap-step-stats flex justify-center gap-6 font-mono text-[11px] text-zinc-500 border-t border-zinc-900 pt-4 pb-6 w-full max-w-lg px-4 opacity-0">
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">PITLANE CAP</span>
                  <span className="text-white font-medium">500 CONTENDERS</span>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">TIMEKEEPING PRECISION</span>
                  <span className="text-white font-medium">&plusmn; 0.001 SECONDS</span>
                </div>
              </div>

              {/* Inline SVG Visual Graphics */}
              <div className="gsap-step-visual w-full max-w-lg bg-black border border-zinc-900 p-4 relative flex items-center justify-center overflow-hidden aspect-[16/9] group-hover:border-[#FF0099]/30 transition-all shadow-md mt-4 opacity-0 scale-95">
                <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-600 uppercase">TELEMETRY // MULTI-RUNNER PACE PATHS</div>
                <svg viewBox="0 0 200 100" className="w-full h-full text-zinc-800">
                  <line x1="0" y1="20" x2="200" y2="20" stroke="#111" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="50" x2="200" y2="50" stroke="#111" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="80" x2="200" y2="80" stroke="#111" strokeWidth="0.5" strokeDasharray="2,2" />
                  <path d="M 10 90 Q 50 60 100 50 T 190 10" fill="none" stroke="#FF0099" strokeWidth="1.5" className="opacity-90 animate-pulse" />
                  <path d="M 10 90 Q 60 75 110 55 T 190 35" fill="none" stroke="#222" strokeWidth="1" />
                  <path d="M 10 90 Q 40 85 90 70 T 190 60" fill="none" stroke="#222" strokeWidth="1" />
                  <path d="M 10 90 Q 55 50 105 38 T 190 20" fill="none" stroke="white" strokeWidth="1" className="opacity-40" />
                  <circle cx="190" cy="10" r="3" fill="#FF0099" />
                  <circle cx="190" cy="20" r="2" fill="white" className="opacity-60" />
                  <text x="135" y="8" fill="#FF0099" fontFamily="monospace" fontSize="6" fontWeight="bold">FASTEST LAP</text>
                </svg>
              </div>
            </section>
 
            {/* Step 2 */}
            <section className="stage gsap-stage-step relative group w-full text-center flex flex-col items-center z-10 font-sans">
              {/* Timeline dot centered */}
              <div className="gsap-dot relative w-8 h-8 bg-black border-2 border-zinc-700 hover:border-[#FF0099] rounded-full group-hover:border-[#FF0099] transition-all flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 opacity-0 scale-0">
                <div className="w-3 h-3 bg-zinc-600 group-hover:bg-[#FF0099] rounded-full transition-all" />
              </div>
 
              <div className="gsap-step-title flex flex-col sm:flex-row items-center justify-center gap-2 mb-3 opacity-0">
                <span className="font-mono text-xs text-[#FF0099] font-bold tracking-wider px-2 py-0.5 bg-[#FF0099]/15 uppercase border border-[#FF0099]/30 block max-w-max">STAGE 02</span>
                <h3 className="font-sans font-black text-2xl md:text-3xl text-white uppercase tracking-tight text-center">
                  The 20% Elite Bottleneck
                </h3>
              </div>
              <p className="gsap-step-desc text-zinc-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl px-4 opacity-0 text-center">
                As runners hit the finish gate of the 10K route, the timing matrix immediately closes. Only the top <strong>20% of the overall field</strong> (divided into separate Men's and Women's categories) are officially cleared to enter the pits. All other competitors are categorized as Class A finishers and receive a commemorative badge.
              </p>
              <div className="gsap-step-stats flex justify-center gap-6 font-mono text-[11px] text-zinc-500 border-t border-zinc-900 pt-4 pb-6 w-full max-w-lg px-4 opacity-0">
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">QUALIFICATION RATE</span>
                  <span className="text-[#FF0099] font-bold">TOP 20% ONLY</span>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">REMAINING SEATS</span>
                  <span className="text-white font-medium">COHORT BRACKET (MAX ~100)</span>
                </div>
              </div>
 
              {/* Inline SVG Visual Graphics */}
              <div className="gsap-step-visual w-full max-w-lg bg-black border border-zinc-900 p-4 relative flex items-center justify-center overflow-hidden aspect-[16/9] group-hover:border-[#FF0099]/30 transition-all shadow-md mt-4 opacity-0 scale-95">
                <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-650 uppercase">BOTTLENECK COMPRESSION CHAMBER</div>
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <path d="M 10 10 L 90 40 L 110 40 L 190 10 M 10 90 L 90 60 L 110 60 L 190 90" fill="none" stroke="#222" strokeWidth="1.5" />
                  <line x1="95" y1="40" x2="95" y2="60" stroke="#FF0099" strokeWidth="1" strokeDasharray="1,2" />
                  <line x1="105" y1="40" x2="105" y2="60" stroke="#FF0099" strokeWidth="1.5" />
                  <circle cx="20" cy="20" r="1.5" fill="#555" />
                  <circle cx="30" cy="50" r="1.5" fill="#555" />
                  <circle cx="25" cy="75" r="1.5" fill="#555" />
                  <circle cx="50" cy="30" r="1.5" fill="#555" />
                  <circle cx="60" cy="55" r="1.5" fill="#555" />
                  <circle cx="55" cy="80" r="1.5" fill="#555" />
                  <circle cx="100" cy="50" r="2" fill="#FF0099" className="animate-ping" />
                  <circle cx="125" cy="48" r="1.8" fill="#FF0099" />
                  <circle cx="150" cy="52" r="1.8" fill="#FF0099" />
                  <circle cx="175" cy="50" r="1.8" fill="#FF0099" />
                  <circle cx="120" cy="18" r="1.5" fill="#333" />
                  <circle cx="130" cy="82" r="1.5" fill="#333" />
                  <text x="130" y="42" fill="#FF0099" fontFamily="monospace" fontSize="6" fontWeight="bold">TOP 20% PASS</text>
                  <text x="110" y="75" fill="#333" fontFamily="monospace" fontSize="6" fontWeight="medium">80% ELIMINATED</text>
                </svg>
              </div>
            </section>

            {/* Step 3 */}
            <section className="stage gsap-stage-step relative group w-full text-center flex flex-col items-center z-10 font-sans">
              {/* Timeline dot centered */}
              <div className="gsap-dot relative w-8 h-8 bg-black border-2 border-zinc-700 hover:border-[#FF0099] rounded-full group-hover:border-[#FF0099] transition-all flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 opacity-0 scale-0">
                <div className="w-3 h-3 bg-zinc-600 group-hover:bg-[#FF0099] rounded-full transition-all" />
              </div>

              <div className="gsap-step-title flex flex-col sm:flex-row items-center justify-center gap-2 mb-3 opacity-0">
                <span className="font-mono text-xs text-[#FF0099] font-bold tracking-wider px-2 py-0.5 bg-[#FF0099]/15 uppercase border border-[#FF0099]/30 block max-w-max">STAGE 03</span>
                <h3 className="font-sans font-black text-2xl md:text-3xl text-white uppercase tracking-tight text-center">
                  F1 Staggered Grid Start
                </h3>
              </div>
              <p className="gsap-step-desc text-zinc-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl px-4 opacity-0 text-center">
                Before the shootout, qualified finalists are assembled on physical race slots. Your exact 10K completion time maps to your <strong>staggered headstart bracket</strong>. The overall leader claims Pole Position and starts first. Subsequent runners release strictly in intervals matching their performance deficit, giving the fastest runners a tactical time &amp; distance headstart.
              </p>
              <div className="gsap-step-stats flex justify-center gap-6 font-mono text-[11px] text-zinc-500 border-t border-zinc-900 pt-4 pb-6 w-full max-w-lg px-4 opacity-0">
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">POLE ADVANTAGE</span>
                  <span className="text-white font-medium">UP TO 120s OFFSET</span>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">GRID SYSTEM</span>
                  <span className="text-[#FF0099] font-bold">STAGGERED CHRONO SEGMENTS</span>
                </div>
              </div>

              {/* Inline SVG Visual Graphics */}
              <div className="gsap-step-visual w-full max-w-lg bg-black border border-zinc-900 p-4 relative flex items-center justify-center overflow-hidden aspect-[16/9] group-hover:border-[#FF0099]/30 transition-all shadow-md mt-4 opacity-0 scale-95">
                <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-650 uppercase">GRID COMPOSITIONAL MATRIX</div>
                <svg viewBox="0 0 200 100" className="w-full h-full text-zinc-800">
                  <line x1="20" y1="10" x2="20" y2="90" stroke="#1c1c1c" strokeWidth="0.8" />
                  <line x1="60" y1="10" x2="60" y2="90" stroke="#1c1c1c" strokeWidth="0.8" />
                  <line x1="100" y1="10" x2="100" y2="90" stroke="#1c1c1c" strokeWidth="0.8" />
                  <line x1="140" y1="10" x2="140" y2="90" stroke="#1c1c1c" strokeWidth="0.8" />
                  <line x1="180" y1="10" x2="180" y2="90" stroke="#1c1c1c" strokeWidth="0.8" />
                  <rect x="25" y="20" width="12" height="6" fill="#111" stroke="#222" strokeWidth="0.5" />
                  <rect x="65" y="32" width="12" height="6" fill="#111" stroke="#222" strokeWidth="0.5" />
                  <rect x="105" y="44" width="12" height="6" fill="#111" stroke="#222" strokeWidth="0.5" />
                  <rect x="145" y="56" width="12" height="6" fill="#111" stroke="#222" strokeWidth="0.5" />
                  <g transform="translate(25, 23)">
                    <circle cx="6" cy="3" r="2.5" fill="#FF0099" />
                    <line x1="12" y1="3" x2="-2" y2="3" stroke="#FF0099" strokeWidth="0.8" />
                  </g>
                  <g transform="translate(65, 35)">
                    <circle cx="6" cy="3" r="2.5" fill="white" className="opacity-70" />
                    <line x1="12" y1="3" x2="-2" y2="3" stroke="white" strokeWidth="0.8" className="opacity-50" />
                  </g>
                  <g transform="translate(105, 47)">
                    <circle cx="6" cy="3" r="2" fill="#555" />
                  </g>
                  <g transform="translate(145, 59)">
                    <circle cx="6" cy="3" r="2" fill="#555" />
                  </g>
                  <text x="25" y="15" fill="#FF0099" fontFamily="monospace" fontSize="6" fontWeight="bold">GAP: 0.0s (POLE)</text>
                  <text x="65" y="27" fill="white" fontFamily="monospace" fontSize="6" className="opacity-80">GAP: +14.5s</text>
                  <text x="105" y="39" fill="#555" fontFamily="monospace" fontSize="6">GAP: +32.1s</text>
                </svg>
              </div>
            </section>

            {/* Step 4 */}
            <section className="stage gsap-stage-step relative group w-full text-center flex flex-col items-center z-10 font-sans">
              {/* Timeline dot centered */}
              <div className="gsap-dot relative w-8 h-8 bg-black border-2 border-zinc-700 hover:border-[#FF0099] rounded-full group-hover:border-[#FF0099] transition-all flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 opacity-0 scale-0">
                <div className="w-3 h-3 bg-zinc-600 group-hover:bg-[#FF0099] rounded-full transition-all" />
              </div>

              <div className="gsap-step-title flex flex-col sm:flex-row items-center justify-center gap-2 mb-3 opacity-0">
                <span className="font-mono text-xs text-[#FF0099] font-bold tracking-wider px-2 py-0.5 bg-[#FF0099]/15 uppercase border border-[#FF0099]/30 block max-w-max">STAGE 04</span>
                <h3 className="font-sans font-black text-2xl md:text-3xl text-white uppercase tracking-tight text-center">
                  The 3K Final Sprint
                </h3>
              </div>
              <p className="gsap-step-desc text-zinc-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl px-4 opacity-0 text-center">
                The race simplifies into raw combat. Over a flat 3,000-meter course, qualified athletes push themselves to the point of complete neural blackout. Because of the staggered starts, the format is beautifully direct: <strong>the first athlete across the finish line is declared the absolute winner.</strong> No time adjustments, no recalculation. A true gladiator outcome.
              </p>
              <div className="gsap-step-stats flex justify-center gap-6 font-mono text-[11px] text-zinc-500 border-t border-zinc-900 pt-4 pb-6 w-full max-w-lg px-4 opacity-0">
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">COURSE DISTANCE</span>
                  <span className="text-white font-medium">3,000 METERS</span>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">CHAMPIONSHIP RULE</span>
                  <span className="text-[#FF0099] font-bold">PHYSICAL FIRST-CROSS WINS</span>
                </div>
              </div>

              {/* Inline SVG Visual Graphics */}
              <div className="gsap-step-visual w-full max-w-lg bg-black border border-zinc-900 p-4 relative flex items-center justify-center overflow-hidden aspect-[16/9] group-hover:border-[#FF0099]/30 transition-all shadow-md mt-4 opacity-0 scale-95">
                <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-650 uppercase">CHAMPIONSHIP FINISH LINE</div>
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <g transform="translate(170, 10)">
                    <rect x="0" y="0" width="8" height="8" fill="white" />
                    <rect x="8" y="0" width="8" height="8" fill="black" />
                    <rect x="0" y="8" width="8" height="8" fill="black" />
                    <rect x="8" y="8" width="8" height="8" fill="white" />
                    <rect x="0" y="16" width="8" height="8" fill="white" />
                    <rect x="8" y="16" width="8" height="8" fill="black" />
                    <rect x="0" y="24" width="8" height="8" fill="black" />
                    <rect x="8" y="24" width="8" height="8" fill="white" />
                    <rect x="0" y="32" width="8" height="8" fill="white" />
                    <rect x="8" y="32" width="8" height="8" fill="black" />
                    <rect x="0" y="40" width="8" height="8" fill="black" />
                    <rect x="8" y="40" width="8" height="8" fill="white" />
                    <rect x="0" y="48" width="8" height="8" fill="white" />
                    <rect x="8" y="48" width="8" height="8" fill="black" />
                    <rect x="0" y="56" width="8" height="8" fill="black" />
                    <rect x="8" y="56" width="8" height="8" fill="white" />
                    <rect x="0" y="64" width="8" height="8" fill="white" />
                    <rect x="8" y="64" width="8" height="8" fill="black" />
                    <rect x="0" y="72" width="8" height="8" fill="black" />
                    <rect x="8" y="72" width="8" height="8" fill="white" />
                  </g>
                  <g transform="translate(20, 0)">
                    <path d="M 120 50 L 140 50" stroke="#FF0099" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="140" cy="50" r="3" fill="#FF0099" />
                    <text x="110" y="42" fill="#FF0099" fontFamily="monospace" fontSize="6" fontWeight="bold">1s TILL LINE</text>
                    <path d="M 70 65 L 90 65" stroke="white" strokeWidth="1" strokeLinecap="round" className="opacity-40" />
                    <circle cx="90" cy="65" r="2.5" fill="white" className="opacity-70" />
                  </g>
                  <line x1="10" y1="10" x2="10" y2="90" stroke="#222" strokeWidth="1" strokeDasharray="3,3" />
                </svg>
              </div>
            </section>

          </div>
        </main>
      </section>

      {/* Under-menu Safe Navigation Spacer */}
      <div className="h-16 w-full bg-[#080808] border-t border-zinc-950 pointer-events-none select-none" />
    </div>
  );
}

export default HomeView;
