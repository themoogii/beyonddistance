import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedCopy } from "./AnimatedCopy";
import { ParticleCanvas } from "./ParticleCanvas";
import { VariableFontAndCursor } from "./ui/variable-font-and-cursor";
import { useMousePosition } from "./hooks/use-mouse-position";

gsap.registerPlugin(ScrollTrigger);

const CREW_DATABASE = [
  { group: "Ulaanbaatar Harriers Crew", division: "High-Altitude Aerobic Pacing" },
  { group: "Mongolian Athletics Federation", division: "Official Track & Field Advisory" },
  { group: "Shanz Trail Sprints", division: "Altitude Endurance Conditioning" },
  { group: "Tuul River Sprints", division: "Flat-Pace Anaerobic Sprints" },
  { group: "Khoroo 11 Athletic Pods", division: "Youth Speed Development Clinics" },
  { group: "Bogd Khan Skyrun Group", division: "Vertical Climb & Cardiac Thresholds" },
  { group: "Ulaanbaatar GP Timing", division: "RFID Transponder & Start Light Integration" },
  { group: "Nomad Trail Athletics", division: "Long Range Ultra-distance Nutrition" },
];

export function LabView({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [pieProgress, setPieProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const demoContainerRef = useRef<HTMLDivElement>(null);
  const demoMouse = useMousePosition(demoContainerRef);

  useEffect(() => {
    // Scroll reset
    window.scrollTo(0, 0);

    // Initial load animations of stats blocks
    const statCards = gsap.utils.toArray(".stat-item") as HTMLElement[];
    const statTriggers: any[] = [];

    statCards.forEach((card) => {
      const anim = gsap.fromTo(
        card,
        {
          opacity: 0,
          x: 250,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 60%",
            scrub: 1,
          },
        }
      );
      statTriggers.push(anim);
    });

    // Client rows gap-pinching and opacity transitions on scroll
    const clientRows = gsap.utils.toArray(".client-row") as HTMLElement[];
    const clientTriggers: any[] = [];

    clientRows.forEach((row) => {
      const anim = gsap.fromTo(
        row,
        {
          opacity: 0,
          paddingTop: "2.5rem",
          paddingBottom: "2.5rem",
        },
        {
          opacity: 1,
          paddingTop: "1.1rem",
          paddingBottom: "1.1rem",
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 92%",
            end: "top 78%",
            scrub: 0.5,
          },
        }
      );
      clientTriggers.push(anim);
    });

    // Arc Scroll scrubbing trigger mapping
    const pieTrigger = ScrollTrigger.create({
      trigger: ".pie-transition-sec",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        setPieProgress(self.progress);
      },
    });

    return () => {
      statTriggers.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });
      clientTriggers.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });
      pieTrigger.kill();
      ScrollTrigger.refresh();
    };
  }, []);

  // Precise vector path drawing utility for custom circle sectors
  const drawArcPath = (progress: number) => {
    if (progress <= 0) return "";
    if (progress >= 0.999) {
      return "M 50 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0";
    }

    const startAngle = -90; // 12 o'clock position
    const endAngle = startAngle + progress * 360;

    const rad = Math.PI / 180;
    const r = 45; // Radius
    const cx = 50; // Center X
    const cy = 50; // Center Y

    const x1 = cx + r * Math.cos(startAngle * rad);
    const y1 = cy + r * Math.sin(startAngle * rad);

    const x2 = cx + r * Math.cos(endAngle * rad);
    const y2 = cy + r * Math.sin(endAngle * rad);

    const largeArcFlag = progress > 0.5 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div ref={containerRef} className="bg-[#FF0099] min-h-screen text-[#000]" id="lab-page-view">
      
      {/* 1. Club Hero with particles */}
      <section className="lab-hero bg-[#000] relative w-full h-[100vh] flex flex-col justify-center items-center text-center select-none overflow-hidden pb-12">
        <ParticleCanvas />

        <div className="lab-hero-content relative z-20 flex flex-col items-center max-w-4xl px-4">
          <AnimatedCopy
            variant="diffuse"
            onScroll={false}
            delay={0.1}
            tag="h1"
            className="text-7xl md:text-[11rem] font-bold font-sans uppercase tracking-tightest leading-none text-[#FF0099]"
          >
            7K CLUB
          </AnimatedCopy>
          <AnimatedCopy
            variant="slide"
            onScroll={false}
            delay={0.7}
            tag="p"
            className="text-[#FF0099] opacity-90 text-sm md:text-lg tracking-widest font-mono uppercase mt-4"
          >
            Pioneering Running Culture &bull; Est. 2018
          </AnimatedCopy>
        </div>
      </section>

      {/* 2. Club Info Concept (Black background, red text) */}
      <section className="lab-about bg-[#000] text-[#FF0099] select-none py-32 md:py-44 flex flex-col items-center justify-center">
        <div className="container max-w-[1200px] flex flex-col gap-12 md:gap-16 px-8 md:px-12">
          <AnimatedCopy
            variant="slide"
            onScroll={true}
            tag="h2"
            className="type-var-2 text-2xl md:text-5xl font-sans font-black leading-tight text-[#FF0099] uppercase"
          >
            Running is not a recreational hobby.
          </AnimatedCopy>
          <AnimatedCopy
            variant="slide"
            onScroll={true}
            tag="h2"
            className="type-var-2 text-2xl md:text-5xl font-sans font-black leading-tight text-white uppercase"
          >
            It is a relentless optimization of cardiac potential, lactic thresholds, and muscular leverage.
          </AnimatedCopy>
        </div>
      </section>

      {/* 3. SVG Pie Transition (Full Viewport, dark sector growth scroll-scrubbed) */}
      <section className="pie-transition-sec h-screen bg-[#000] text-[#FF0099] relative overflow-hidden flex justify-center items-center">
        {/* Dynamic growing SVG Sector */}
        <div className="pie-svg-container absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          <svg className="pie-svg w-full h-full max-w-[90vh] max-h-[90vh] fill-current text-[#FF0099] opacity-20" viewBox="0 0 100 100">
            <path d={drawArcPath(pieProgress)} />
          </svg>
        </div>

        {/* Floating centered statement */}
        <div className="pie-center-text relative z-10 text-center max-w-[1000px] px-8 md:px-12 select-none">
          <AnimatedCopy
            variant="diffuse"
            onScroll={true}
            tag="h3"
            className="font-sans font-black text-4xl md:text-6xl text-[#FF0099] leading-[1.05] drop-shadow-md uppercase"
          >
            Beyond Distance is our ultimate testing arena.
          </AnimatedCopy>
        </div>
      </section>

      {/* 4. Stats Section */}
      <section ref={statsSectionRef} className="stats-section bg-[#FF0099] text-[#000] w-full flex flex-col md:flex-row py-24 select-none relative">
        <div className="stats-left flex-1 md:flex-[0_0_40%] p-6 md:p-12 md:sticky md:top-24 h-fit mb-12 md:mb-0">
          <h2 className="font-sans font-black text-4xl md:text-6xl tracking-tight leading-none uppercase">
            CLUB OVERVIEW
          </h2>
          <p className="type-var-2 text-md md:text-xl mt-4 max-w-sm font-semibold opacity-80 uppercase font-mono">
            Empirical stats compiled during our legendary training sessions in Mongolia.
          </p>
        </div>

        <div className="stats-right flex-grow p-6 md:p-12 flex flex-col gap-28 md:gap-52">
          {/* Stat 1 */}
          <div className="stat-item flex flex-col">
            <span className="stat-num font-sans font-black text-8xl md:text-[10rem] tracking-tightest leading-none">8</span>
            <span className="stat-label font-sans font-black text-xl md:text-3xl mt-2 leading-none uppercase text-black">
              Years in Active Service
            </span>
          </div>

          {/* Stat 2 */}
          <div className="stat-item flex flex-col">
            <span className="stat-num font-sans font-black text-8xl md:text-[10rem] tracking-tightest leading-none">150+</span>
            <span className="stat-label font-sans font-black text-xl md:text-3xl mt-2 leading-none uppercase text-black">
              Official Crew Harriers
            </span>
          </div>

          {/* Stat 3 */}
          <div className="stat-item flex flex-col">
            <span className="stat-num font-sans font-black text-8xl md:text-[10rem] tracking-tightest leading-none">30+</span>
            <span className="stat-label font-sans font-black text-xl md:text-3xl mt-2 leading-none uppercase text-black">
              National Gold Podiums
            </span>
          </div>

          {/* Stat 4 */}
          <div className="stat-item flex flex-col">
            <span className="stat-num font-sans font-black text-8xl md:text-[10rem] tracking-tightest leading-none">12</span>
            <span className="stat-label font-sans font-black text-xl md:text-3xl mt-2 leading-none uppercase text-black">
              Professional Coaches &amp; Directors
            </span>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE FONT EXPERIMENT */}
      <section className="bg-black text-[#FF0099] py-24 select-none border-t border-white/10 flex flex-col items-center">
        <div className="container px-8 md:px-12 flex flex-col gap-6 w-full">
          <div>
            <h2 className="font-sans font-black text-4xl md:text-6xl tracking-tight uppercase text-[#FF0099]">
              LAB 02: REACTION TEST
            </h2>
            <p className="text-white/60 text-xs md:text-sm font-mono mt-2 uppercase tracking-wider">
              Move your cursor inside the chamber below to dynamically warp font variation axes.
            </p>
          </div>

          <div
            ref={demoContainerRef}
            className="w-full h-[500px] rounded-2xl items-center justify-center p-6 md:p-24 bg-[#111] border border-white/5 relative cursor-crosshair overflow-hidden flex flex-col"
          >
            <div className="w-full h-full items-center justify-center flex relative z-10 transition-colors duration-300">
              <VariableFontAndCursor
                label="FANCY!"
                className="font-display font-black text-6xl sm:text-8xl md:text-[10rem] tracking-tight text-[#FF0099] uppercase leading-none select-none transition-all duration-150"
                fontVariationMapping={{
                  y: { name: "wght", min: 100, max: 1000 },
                  x: { name: "wdth", min: 25, max: 151 },
                }}
                containerRef={demoContainerRef}
              />
            </div>

            {/* Coordinates Telemetry HUD */}
            <div className="absolute bottom-6 left-6 flex flex-col font-mono text-[10px] md:text-xs text-white/50 bg-black/40 backdrop-blur-sm p-3 rounded border border-white/5 z-20">
              <span className="tabular-nums">X-COORD: {Math.round(demoMouse.x)}px</span>
              <span className="tabular-nums">Y-COORD: {Math.round(demoMouse.y)}px</span>
              <span className="tabular-nums mt-1 text-[#FF0099]">AXIS.WGHT: {Math.round(100 + (900 * Math.min(Math.max(demoMouse.y / (demoContainerRef.current?.clientHeight || 500), 0), 1)))}</span>
              <span className="tabular-nums text-[#FF0099]">AXIS.WDTH: {Math.round(25 + (126 * Math.min(Math.max(demoMouse.x / (demoContainerRef.current?.clientWidth || 1000), 0), 1)))}</span>
            </div>

            {/* Crosshair Horizontal Line */}
            <div
              className="absolute w-screen h-px bg-[#FF0099]/15 left-0 pointer-events-none"
              style={{
                top: `${demoMouse.y}px`,
              }}
            />
            {/* Crosshair Vertical Line */}
            <div
              className="absolute w-px h-screen bg-[#FF0099]/15 top-0 pointer-events-none"
              style={{
                left: `${demoMouse.x}px`,
              }}
            />
            {/* Pinpoint Dot */}
            <div
              className="absolute w-1.5 h-1.5 bg-[#FF0099] rounded-full pointer-events-none"
              style={{
                top: `${demoMouse.y}px`,
                left: `${demoMouse.x}px`,
              }}
            />
          </div>
        </div>
      </section>

      {/* 6. Crews list sections */}
      <section className="clients-section bg-[#FF0099] text-[#000] py-24 border-t border-black/15 select-none">
        <div className="container px-8 md:px-12">
          <h2 className="font-sans font-black text-4xl md:text-6xl tracking-tight uppercase">
            REGULATORY COUNCIL &amp; CREW
          </h2>
          <p className="type-var-2 text-md md:text-lg text-[#000]/80 mt-2 font-mono uppercase tracking-wider">
            Approved training divisions and strategic athletic partners in Ulaanbaatar.
          </p>

          <div className="clients-grid flex flex-col mt-16">
            {CREW_DATABASE.map((item, idx) => (
              <div
                key={idx}
                className="client-row flex justify-between items-center py-6 border-b border-black/10 transition-all duration-300"
              >
                <p className="font-sans font-black text-lg md:text-2xl uppercase tracking-tight m-0 text-left">
                  {item.group}
                </p>
                <p className="type-mono text-right text-xs md:text-sm font-semibold text-black/70 uppercase tracking-widest">
                  {item.division}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LabView;
