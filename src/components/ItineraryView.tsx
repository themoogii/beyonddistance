import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { playHoverSound, playSuccessSound } from "../utils/sfx";
import { Map, MapMarker, MarkerContent, MarkerTooltip, MapControls, MapRoute } from "./ui/Map";
import { ParticleButton } from "./ParticleButton";

interface ScheduleItem {
  time: string;
  title: string;
  category: "PRE-RACE" | "RACE STAGE" | "FESTIVAL" | "AFTER-PARTY";
  location: string;
  description: string;
  icon: string;
  highlight?: boolean;
  coordinates: [number, number]; // [lng, lat] in Ulaanbaatar
}

const ITINERARY_DATA: ScheduleItem[] = [
  {
    time: "06:00 - 08:30",
    title: "REGISTRATION & TIMING CAP",
    category: "PRE-RACE",
    location: "Sector A Pavilion",
    description: "Pass verification and RFID chip collection.",
    icon: "barcode-sharp",
    coordinates: [106.9080, 47.9150]
  },
  {
    time: "08:30 - 09:30",
    title: "PIT LANE ASSEMBLY & WARM-UP",
    category: "PRE-RACE",
    location: "Main Grid Pits",
    description: "Harriers crew check-in and dynamic tracker sync.",
    icon: "git-commit-sharp",
    coordinates: [106.9130, 47.9178]
  },
  {
    time: "10:00",
    title: "THE MASS LAUNCH (10K)",
    category: "RACE STAGE",
    location: "Grand Start Gate",
    description: "Mass start for 500 elite runners.",
    icon: "flash-sharp",
    highlight: true,
    coordinates: [106.9176, 47.9188]
  },
  {
    time: "11:30",
    title: "THE 20% ELITE CUTOFF",
    category: "RACE STAGE",
    location: "Chrono Pits Entrance",
    description: "Gate lock-in. Only the top 20% quickest qualify.",
    icon: "lock-closed-sharp",
    coordinates: [106.9240, 47.9192]
  },
  {
    time: "12:00",
    title: "STAGGERED SPEED ASSEMBLY",
    category: "RACE STAGE",
    location: "The Pole Position Grid",
    description: "Chrono-bias interval layout based on 10K results.",
    icon: "play-sharp",
    coordinates: [106.9200, 47.9182]
  },
  {
    time: "12:30",
    title: "THE 3K SHOOTOUT SPRINT",
    category: "RACE STAGE",
    location: "Inner Velocity Loop",
    description: "Flat-out sprint to crown the champion.",
    icon: "trophy-sharp",
    highlight: true,
    coordinates: [106.9230, 47.9135]
  },
  {
    time: "13:30",
    title: "PODIUM CEREMONY",
    category: "FESTIVAL",
    location: "Fan Zone Main Stage",
    description: "Trophy presentations and metallic medal distribution.",
    icon: "ribbon-sharp",
    coordinates: [106.9180, 47.9175]
  },
  {
    time: "19:00 - LATE",
    title: "VELOCITY AFTER-PARTY",
    category: "AFTER-PARTY",
    location: "Sky Club Annex UB",
    description: "Champagne, electronic audio loops, and athlete toast.",
    icon: "beer-sharp",
    highlight: true,
    coordinates: [106.9290, 47.9220]
  }
];

const COURSE_10K_PATH: [number, number][] = [
  [106.9176, 47.9188], // Sukhbaatar Start
  [106.9320, 47.9195], // East along Peace Ave
  [106.9325, 47.9120], // Turn South
  [106.9215, 47.9110], // River bend
  [106.9080, 47.9115], // West
  [106.9070, 47.9175], // Turn North
  [106.9132, 47.9178], // East
  [106.9176, 47.9188], // Loop Complete
];

const COURSE_3K_PATH: [number, number][] = [
  [106.9176, 47.9188], // Sukhbaatar Start
  [106.9240, 47.9192], // East Inner Loop
  [106.9230, 47.9135], // South Inner Loop
  [106.9125, 47.9130], // West Inner Loop
  [106.9132, 47.9178], // North Inner Loop
  [106.9176, 47.9188], // Loop Complete
];

export function ItineraryView({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<"10k" | "3k">("10k");
  const mapRef = useRef<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleItemHover = (idx: number) => {
    if (selectedIdx !== idx) {
      setSelectedIdx(idx);
      try { playHoverSound(); } catch {}
      
      const coord = ITINERARY_DATA[idx]?.coordinates;
      if (coord && mapRef.current) {
        mapRef.current.flyTo({
          center: coord,
          zoom: 14.5,
          duration: 1200,
          essential: true
        });
      }
    }
  };

  const handleCourseSelect = (course: "10k" | "3k") => {
    setSelectedCourse(course);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [106.9176, 47.9188],
        zoom: 12.3,
        duration: 1500,
        essential: true
      });
    }
  };

  const triggerCelebrateSfx = () => {
    try { playSuccessSound(); } catch {}
  };

  return (
    <div className="bg-[#080808] min-h-screen text-white safe-page-wrapper pb-16 font-sans relative overflow-hidden" id="itinerary-page-view">
      
      {/* Absolute grid background */}
      <div 
        className="absolute inset-0 bg-[#080808]/70 opacity-30 select-none pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="container mx-auto px-6 max-w-6xl pt-12 md:pt-16 select-none relative z-10">
        
        {/* Title Header Section */}
        <div className="border-b border-zinc-900 pb-8 mb-10">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#FF0099] font-bold block mb-2 uppercase">CHRONOLOGICAL PROTOCOL</span>
          <h1 className="text-3xl md:text-6xl font-sans font-black uppercase text-white leading-none tracking-tight">
            STAGE ITINERARY
          </h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase mt-2 tracking-widest leading-relaxed max-w-xl">
            August 29, 2026 — Schedule matrix from starting line check-in to high-velocity After Party.
          </p>
        </div>

        {/* Live Status Board Card */}
        <div className="bg-zinc-950 border border-zinc-900 p-5 md:p-6 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF0099]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-none font-mono text-[9px] bg-[#FF0099]/10 text-[#FF0099] border border-[#FF0099]/20 font-bold uppercase animate-pulse">
              ● STATS ACTIVE
            </span>
            <h2 className="text-md font-sans font-black uppercase text-white tracking-tight">AUGUST 29 PROTOCOL IS ONLINE</h2>
            <p className="text-[11px] text-zinc-500 max-w-lg font-mono">
              After-Party access is complementary for all athletes. Present passes at entry.
            </p>
          </div>
          <ParticleButton
            onClick={triggerCelebrateSfx}
            className="px-4 py-2.5 bg-[#FF0099] hover:bg-white text-black font-semibold font-mono text-[10px] uppercase tracking-widest transition-all whitespace-nowrap rounded-none border-none cursor-pointer"
            glowColor="#FF0099"
          >
            VERIFY
          </ParticleButton>
        </div>

        {/* Split Section: Timeline & Side Panel Context Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Timeline Column */}
          <div className="lg:col-span-8 relative border-l border-zinc-805 space-y-8 pl-4 sm:pl-8 md:pl-12">
            {ITINERARY_DATA.map((item, idx) => {
              const isActive = selectedIdx === idx;
              return (
                <div 
                  key={idx}
                  onMouseEnter={() => handleItemHover(idx)}
                  className={`relative p-6 border transition-all duration-300 group cursor-pointer ${
                    item.highlight 
                      ? "bg-zinc-950/80 border-zinc-800 hover:border-[#FF0099]/80"
                      : "bg-[#0b0b0b]/60 border-zinc-950 hover:border-zinc-800"
                  } ${isActive ? "border-[#FF0099] bg-zinc-950 shadow-[x-shadow]" : ""}`}
                >
                  
                  {/* Vertical line dot connector */}
                  <div className={`absolute -left-[21px] sm:-left-[37px] md:-left-[53px] top-8 w-3 h-3 rounded-full border transition-all duration-300 ${
                    item.highlight 
                      ? "bg-[#FF0099] border-[#FF0099]" 
                      : "bg-black border-zinc-700 group-hover:border-[#FF0099]"
                  } ${isActive ? "scale-125 border-[#FF0099] bg-[#FF0099]" : ""}`} />

                  {/* Top Category Badge & Time */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#FF0099]">
                      {item.time}
                    </span>
                    <span className={`font-mono text-[9px] uppercase px-2 py-0.5 font-bold border ${
                      item.category === "AFTER-PARTY"
                        ? "bg-[#FF0099]/15 text-[#FF0099] border-[#FF0099]/30"
                        : item.category === "RACE STAGE"
                        ? "bg-white/10 text-white border-white/20"
                        : "bg-zinc-900 text-zinc-500 border-zinc-800"
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-sans font-black text-lg md:text-xl uppercase tracking-tight text-white mb-2 group-hover:text-[#FF0099] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Bottom Location Element */}
                  <div className="flex items-center gap-2 border-t border-zinc-900 pt-3 text-[10px] font-mono text-zinc-500 uppercase">
                    <ion-icon name="location-sharp" style={{ color: "#FF0099" }}></ion-icon>
                    <span>{item.location}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Side Cards */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Realtime Countdown Preview widget */}
            <div className="bg-zinc-950 border border-zinc-900 p-5 relative overflow-hidden">
              <span className="text-[10px] font-mono text-[#FF0099] font-bold block mb-1 uppercase">GRID LAUNCH</span>
              <p className="text-[11px] text-zinc-400 font-mono">
                Synchronization offsets resolve August 29, 2026, at 10:00 AM UB.
              </p>
              <div className="w-full h-[1px] bg-zinc-900 my-3" />
              <div className="flex gap-4 font-mono">
                <div>
                  <span className="text-white font-black text-lg">29 AUG</span>
                </div>
                <div className="text-zinc-800">/</div>
                <div>
                  <span className="text-white font-black text-lg">10:00 AM</span>
                </div>
              </div>
            </div>

            {/* After-Party Spotlights */}
            <div className="bg-zinc-950 border border-zinc-900 p-5 relative overflow-hidden">
              <span className="text-[9px] uppercase tracking-wider text-[#FF0099] font-mono font-bold block mb-2">★ ACCREDITATIONS</span>
              <ul className="text-[10px] space-y-2 font-mono text-zinc-400 list-disc list-inside">
                <li>Performance track telemetry wristbands issued</li>
                <li>Exclusive DJ sets & visuals at Sky Club Annex</li>
                <li>Finisher apparel ready for pick-up</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Full-width Race Route Map Section directly on top of Footer */}
        <div className="mt-16 border-t border-zinc-900 pt-16" id="interactive-route-map-section">
          {/* Section Header */}
          <div className="mb-8">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#007A48] font-bold block mb-2 uppercase">GEOSPATIAL COORDINATES</span>
            <h2 className="text-2xl md:text-5xl font-sans font-black uppercase text-white tracking-tight">
              INTERACTIVE RACE ROUTE MAP
            </h2>
            <p className="text-zinc-500 font-mono text-[10px] uppercase mt-2 tracking-widest leading-relaxed max-w-xl">
              Centralized telemetry system tracking elevation deltas, sector loops, and physical participant coordinates in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Map Container - taking up 8 columns */}
            <div className="lg:col-span-8 group relative overflow-hidden border border-zinc-900 bg-zinc-950 flex flex-col justify-end">
              <div className="relative w-full h-[400px] md:h-[550px] bg-zinc-900 overflow-hidden">
                <Map
                  ref={mapRef}
                  theme="dark"
                  initialViewport={{
                    center: [106.9176, 47.9188],
                    zoom: 12.3,
                    bearing: 0,
                    pitch: 0,
                  }}
                  className="w-full h-full min-h-[300px]"
                >
                  <MapControls showZoom={true} showFullscreen={true} position="top-right" />
                  
                  {/* Dynamic Route Rendering */}
                  <MapRoute
                    id="race-track"
                    coordinates={selectedCourse === "10k" ? COURSE_10K_PATH : COURSE_3K_PATH}
                    color={selectedCourse === "10k" ? "#FF0099" : "#00FF66"}
                    width={4}
                    opacity={0.9}
                  />

                  {/* Dynamic interactive markers */}
                  {ITINERARY_DATA.map((item, idx) => {
                    const isSelected = selectedIdx === idx;
                    return (
                      <MapMarker
                        key={idx}
                        longitude={item.coordinates[0]}
                        latitude={item.coordinates[1]}
                      >
                        <MarkerContent>
                          <div
                            className={`flex items-center justify-center rounded-full border transition-all duration-350 cursor-pointer ${
                              isSelected
                                ? "w-6 h-6 bg-[#FF0099] border-white scale-125 z-50 shadow-lg shadow-[#FF0099]/60"
                                : item.highlight
                                ? "w-4.5 h-4.5 bg-[#FF0099] border-black scale-100 opacity-90 hover:scale-120 hover:opacity-100 z-40"
                                : "w-3.5 h-3.5 bg-zinc-800 border-zinc-600 scale-100 opacity-60 hover:scale-120 hover:opacity-100 z-30"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                            )}
                          </div>
                        </MarkerContent>
                        <MarkerTooltip>
                          <div className="font-mono text-[9px] uppercase tracking-wider space-y-0.5 select-none text-left">
                            <p className="font-bold text-[#FF0099]">{item.title}</p>
                            <p className="text-white/60 text-[8px]">{item.location}</p>
                            <p className="text-white/40 text-[7px] lowercase italic">{item.time}</p>
                          </div>
                        </MarkerTooltip>
                      </MapMarker>
                    );
                  })}
                </Map>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none p-3 flex justify-between items-center select-none z-10">
                  <span className="text-[9px] font-mono text-white/90 bg-black/60 px-2 py-1 border border-zinc-900 rounded-[2px]" style={{ backdropFilter: "blur(2px)" }}>
                    SATELLITE GPS ACTIVE
                  </span>
                  <span className="text-[9px] font-mono text-[#FF0099] font-bold bg-[#FF0099]/15 px-2 py-1 border border-[#FF0099]/30 rounded-[2px] animate-pulse" style={{ backdropFilter: "blur(2px)" }}>
                    LIVE TRACK FEED
                  </span>
                </div>
              </div>
            </div>

            {/* Controls and telemetry data - taking up 4 columns */}
            <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-6">
                <div>
                  <h4 className="font-sans font-black text-white text-md uppercase tracking-tight mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#007A48] animate-ping" />
                    PATH SELECTION
                  </h4>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Select the target race course loop to map telemetry and physical elevation indices.
                  </p>
                </div>

                {/* Course Switchers */}
                <div className="grid grid-cols-2 gap-3">
                  <ParticleButton
                    type="button"
                    onClick={() => handleCourseSelect("10k")}
                    className={`py-2 px-3 text-[10px] font-mono font-bold uppercase transition-all duration-300 border rounded-none cursor-pointer ${
                      selectedCourse === "10k"
                        ? "bg-[#FF0099] text-black border-[#FF0099] shadow-md font-extrabold"
                        : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:border-zinc-800 hover:text-white"
                    }`}
                    glowColor="#FF0099"
                  >
                    10K
                  </ParticleButton>
                  <ParticleButton
                    type="button"
                    onClick={() => handleCourseSelect("3k")}
                    className={`py-2 px-3 text-[10px] font-mono font-bold uppercase transition-all duration-300 border rounded-none cursor-pointer ${
                      selectedCourse === "3k"
                        ? "bg-[#007A48] text-white border-[#007A48] shadow-md font-extrabold"
                        : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:border-zinc-800 hover:text-white"
                    }`}
                    glowColor="#007A48"
                  >
                    3K
                  </ParticleButton>
                </div>

                <div className="border-t border-zinc-900 pt-6">
                  <h4 className="font-sans font-black text-white text-xs uppercase tracking-tight mb-3">
                    COURSE METRICS & TELEMETRY
                  </h4>
                  
                  <div className="bg-black border border-[#111] p-4 rounded-sm">
                    {selectedCourse === "10k" ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500 uppercase">COURSE RANGE:</span>
                          <span className="text-[#FF0099] font-bold">10.00 KM</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500 uppercase">ELEVATION DELTA:</span>
                          <span className="text-white font-bold">+45 METERS</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500 uppercase">DIFFICULTY LEVEL:</span>
                          <span className="text-red-500 font-bold uppercase">ADVANCED CHRONO</span>
                        </div>
                        <div className="w-full h-[1px] bg-zinc-900 my-1" />
                        <p className="text-[11px] text-zinc-400 font-mono leading-relaxed lowercase">
                          Starts at Grand Start Gate. Sweeps east along historic Peace Avenue, then loops south bordering the Tuul river basin dirt tracks for dynamic grip tests.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500 uppercase">COURSE RANGE:</span>
                          <span className="text-[#00FF66] font-bold">3.00 KM</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500 uppercase">ELEVATION DELTA:</span>
                          <span className="text-white font-bold">+12 METERS</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500 uppercase">DIFFICULTY LEVEL:</span>
                          <span className="text-[#00FF66] font-bold uppercase">HIGH VELOCITY</span>
                        </div>
                        <div className="w-full h-[1px] bg-zinc-900 my-1" />
                        <p className="text-[11px] text-zinc-400 font-mono leading-relaxed lowercase">
                          Fully locked inner ring speed test for the top 20% elite athletes only. Extremely flat, hard asphalt sprint loops designed for top gear racing.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Waypoint details when selected */}
              <div className="border-t border-zinc-900 pt-6 mt-6">
                <div className="text-[10px] font-mono text-zinc-600 uppercase mb-2">
                  ACTIVE SCHEDULE PIN
                </div>
                {selectedIdx !== null ? (
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{ITINERARY_DATA[selectedIdx].icon === 'trophy-sharp' ? '🏆' : ITINERARY_DATA[selectedIdx].icon === 'flash-sharp' ? '⚡' : '📍'}</span>
                    <div>
                      <h5 className="font-sans font-black text-white text-xs uppercase tracking-tight">
                        {ITINERARY_DATA[selectedIdx].title}
                      </h5>
                      <p className="text-[10px] text-zinc-500 font-mono lowercase">
                        {ITINERARY_DATA[selectedIdx].location} • {ITINERARY_DATA[selectedIdx].time}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-500 font-mono italic">
                    Hover over timeline check-ins to lock center focal coordinates.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ItineraryView;
