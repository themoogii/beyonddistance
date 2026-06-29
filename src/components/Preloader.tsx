import React, { useEffect, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment the progress bar Procedurally
    const duration = 2400; // 2.4s loading speed
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(currentProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        
        // Trigger GSAP stagger flicker animation out on successful progress Completion
        const tl = gsap.timeline({
          onComplete: () => {
            sessionStorage.setItem("preloaderSeen", "true");
            onComplete();
          }
        });

        // Stagger blocks fade-out with a slight visual "flicker" ease
        tl.to(".preloader-block", {
          opacity: 0,
          duration: 0.5,
          stagger: {
            amount: 0.6,
            from: "random",
          },
          ease: "power2.inOut",
        });

        // Lift/fade out the loader headers and overlays
        tl.to(".preloader-inner-content", {
          opacity: 0,
          y: -40,
          duration: 0.4,
          ease: "power2.in",
        }, "<");
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, [onComplete]);

  return (
    <div className="preloader fixed inset-0 z-[110000] bg-black p-8 md:p-14 flex flex-col justify-between" id="preloader-overlay">
      {/* 4x3 block background overlay */}
      <div className="preloader-grid absolute inset-0 grid grid-cols-4 grid-rows-3 z-[-1] pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="preloader-block bg-[#000]"
            style={{ border: "0.5px solid rgba(255, 0, 153, 0.05)" }}
          />
        ))}
      </div>

      {/* Main progress content */}
      <div className="preloader-inner-content flex flex-col justify-between h-full w-full select-none">
        {/* Header Title */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[#FF0099] tracking-tighter text-4xl font-black">BEYOND DISTANCE</h2>
            <p className="type-mono text-[#FF0099]/60 text-xs mt-1">[ ARCHIVE LOAD INIT ]</p>
          </div>
          <p className="type-mono text-[#FF0099] text-sm">ENGAGEMENT: NATASHA_2026</p>
        </div>

        {/* Center Loading Figure / Tech Stats */}
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="text-[12rem] md:text-[18rem] text-[#FF0099] font-black leading-none font-display tracking-tightest flex relative">
            <span>{String(progress).padStart(3, "0")}</span>
            <span className="text-4xl absolute -right-8 top-12">%</span>
          </div>
          <p className="type-mono text-[#FF0099] text-xs uppercase tracking-widest mt-4">
            Compiling immersive design matrices...
          </p>
        </div>

        {/* Progress Bar & Footer */}
        <div className="preloader-progress-container w-full flex flex-col gap-4">
          <div className="preloader-progress-bar w-full h-[2px] bg-[#FF0099]/25 relative overflow-hidden">
            <div
              className="preloader-progress-fill absolute left-0 top-0 h-full bg-[#FF0099] transition-all duration-[30ms] ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="preloader-footer w-full flex justify-between type-mono text-[#FF0099] text-xs">
            <span>SYS: ONLINE</span>
            <span>PROG CODE: BL-GRID-ALPHA</span>
            <span>SECURE LINK CORES: 12/12</span>
          </div>
        </div>
      </div>
    </div>
  );
}
