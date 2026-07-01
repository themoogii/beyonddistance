import React from "react";
import { RotateCcw } from "lucide-react";

interface RaceFinishFooterProps {
  distance: number;
  enterCount: number;
  startTime: number;
  activePage: string;
  onNavigate: (page: string) => void;
  onReset: () => void;
}

export function RaceFinishFooter({
  onNavigate,
  onReset,
}: RaceFinishFooterProps) {
  return (
    <footer className="relative w-full bg-black border-t border-zinc-900 pt-12 pb-20 px-8 md:px-16 text-white font-mono overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,0,153,0.03),transparent_60%)] pointer-events-none" />
      
      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-zinc-500 gap-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
            <span className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider" onClick={() => onNavigate("/")}>STAGE 01 — 10K COURSE</span>
            <span className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider" onClick={() => onNavigate("/itinerary")}>STAGE 02 — FINAL 3K</span>
          </div>
        </div>

        <div className="border-t border-zinc-950 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-600 gap-4">
          <div>
            BEYOND DISTANCE 2026 &bull; OFFICIAL SITE OF THE 7K CLUB UB.
          </div>
          <div>
            ALL RIGHTS AND RECORDINGS SECURED &copy; 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
