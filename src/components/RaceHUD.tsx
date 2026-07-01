import React from "react";
import { Footprints } from "lucide-react";

interface RaceHUDProps {
  distance: number;
  enterCount: number;
  onReset: () => void;
}

export function RaceHUD({ distance }: RaceHUDProps) {
  return (
    <div 
      className="fixed bottom-28 right-4 sm:bottom-6 sm:right-6 z-[45] font-mono select-none"
      id="race-telemetry-hud"
    >
      <div className="bg-black/95 backdrop-blur-md border border-zinc-900 text-white py-2 px-3.5 shadow-[0_5px_25px_rgba(0,0,0,0.85)] border-r-2 border-r-[#FF0099] flex items-center gap-3">
        <div className="p-1.5 bg-zinc-950 text-[#FF0099] border border-zinc-900/40">
          <Footprints className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none font-black">Distance Covered</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-black text-white leading-none">
              {distance.toFixed(1)}
            </span>
            <span className="text-[9px] font-bold text-[#FF0099] uppercase">m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
