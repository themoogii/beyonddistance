import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedCopy } from "./AnimatedCopy";
import { playHoverSound, playSuccessSound } from "../utils/sfx";
import { ParticleButton } from "./ParticleButton";
import { 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Award, 
  User, 
  Mail, 
  FileText, 
  Check, 
  AlertTriangle,
  Flame,
  MousePointerClick
} from "lucide-react";
import { RegistrationCard, RegistrationData } from "./RegistrationCard";

interface Registrant {
  id: string;
  name: string;
  email: string;
  bracket: string;
  gender: "women" | "men";
  estMins: number;
  assignedNo: string;
  registeredAt: string;
  notes?: string;
  relativeTime?: string;
}

export function ProjectView({ onNavigate }: { onNavigate: (page: string) => void }) {
  // Dynamic Registered Competitors List with initial premium mock records
  const [registrants, setRegistrants] = useState<Registrant[]>([
    { id: "1", name: "Battulga Erdene", email: "battulga@7k.mn", bracket: "Solo Pro", gender: "men", estMins: 38, assignedNo: "BL-7019", registeredAt: "June 26, 2026", notes: "Qualifying for first grid row", relativeTime: "Joined 2 minutes ago" },
    { id: "2", name: "Anuujin Ochir", email: "anuujin@harriers.mn", bracket: "Solo Pro", gender: "women", estMins: 43, assignedNo: "BL-7043", registeredAt: "June 25, 2026", notes: "Ready for the 3K Grand Prix start", relativeTime: "Joined 5 minutes ago" },
    { id: "3", name: "Altangerel Bat", email: "altaa@gp.mn", bracket: "Solo Amateur", gender: "men", estMins: 52, assignedNo: "BL-7112", registeredAt: "June 25, 2026", notes: "First-time runner", relativeTime: "Joined 12 minutes ago" },
    { id: "4", name: "Solongo Baatar", email: "solongo@7k.mn", bracket: "7K Member", gender: "women", estMins: 46, assignedNo: "BL-7204", registeredAt: "June 24, 2026", notes: "Ready to push limits", relativeTime: "Joined 20 minutes ago" },
  ]);

  // Registration success pass display state
  const [showInvoice, setShowInvoice] = useState<Registrant | null>(() => {
    const saved = localStorage.getItem("bd_athlete_info");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [hasRegistered, setHasRegistered] = useState(() => {
    return localStorage.getItem("bd_athlete_info") !== null;
  });

  // F1 Reaction Game State
  const [gameState, setGameState] = useState<"idle" | "ready" | "pending" | "go" | "result" | "fault">("idle");
  const [litCount, setLitCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const gameIntervalRef = useRef<any>(null);
  const gameTimeoutRef = useRef<any>(null);

  // Scroll to top and game cleanup
  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (gameTimeoutRef.current) clearTimeout(gameTimeoutRef.current);
    };
  }, []);

  // Live registration simulation loop to create social proof
  useEffect(() => {
    const firstNames = ["Sukhbat", "Khulan", "Temuulen", "Nomin", "Anand", "Gerel", "Bilguun", "Tsolmon", "Altangerel", "Erdene"];
    const lastNames = ["Bat-Erdene", "Ochir", "Nyam", "Lkhagva", "Bayaraa", "Gantulga", "Munkh", "Sukh", "Davaa", "Chuluun"];
    const brackets = ["Solo Pro", "Solo Amateur", "7K Member"];
    const times = [38, 42, 45, 52, 58, 65];

    const interval = setInterval(() => {
      const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomGender = Math.random() > 0.5 ? "men" : "women";
      const randomBracket = brackets[Math.floor(Math.random() * brackets.length)];
      const randomTime = times[Math.floor(Math.random() * times.length)];
      
      const simulatedReg: Registrant = {
        id: String(Date.now()),
        name: `${randomFirst} ${randomLast}`,
        email: `${randomFirst.toLowerCase()}@7k.mn`,
        bracket: randomBracket,
        gender: randomGender as "women" | "men",
        estMins: randomTime,
        assignedNo: `BL-7${Math.floor(100 + Math.random() * 900)}`,
        registeredAt: "Just now",
        relativeTime: "Joined Just now",
      };
      
      setRegistrants((prev) => {
        // Update older "Just now" to relative minutes
        const updated = prev.map(r => {
          if (r.relativeTime === "Joined Just now") {
            return { ...r, relativeTime: "Joined 1 minute ago" };
          }
          return r;
        });
        return [simulatedReg, ...updated.slice(0, 8)];
      });
    }, 28000);

    return () => clearInterval(interval);
  }, []);

  // Submit Handler using decoupled RegistrationCard
  const handleRegistrationSuccess = (data: RegistrationData) => {
    try {
      playSuccessSound();
    } catch {}

    const newReg: Registrant = {
      id: String(Date.now()),
      name: data.fullName,
      email: data.email,
      bracket: data.bracket,
      gender: data.gender,
      estMins: data.estMins,
      assignedNo: `BL-7${Math.floor(100 + Math.random() * 900)}`,
      registeredAt: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      notes: data.notes,
      relativeTime: "Joined Just now",
    };

    localStorage.setItem("bd_athlete_info", JSON.stringify(newReg));

    setRegistrants((prev) => [newReg, ...prev]);
    setShowInvoice(newReg);
    setHasRegistered(true);
  };

  // F1 Reaction Game logic
  const startF1Countdown = () => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (gameTimeoutRef.current) clearTimeout(gameTimeoutRef.current);

    setGameState("ready");
    setLitCount(0);
    setReactionTime(null);
    let currentLit = 0;

    gameIntervalRef.current = setInterval(() => {
      currentLit++;
      setLitCount(currentLit);

      if (currentLit === 5) {
        clearInterval(gameIntervalRef.current);
        setGameState("pending");

        const randomDelay = 800 + Math.random() * 1700;
        gameTimeoutRef.current = setTimeout(() => {
          setGameState("go");
          setStartTime(Date.now());
        }, randomDelay);
      }
    }, 700);
  };

  const handleLaunchClick = () => {
    if (gameState === "pending") {
      if (gameTimeoutRef.current) clearTimeout(gameTimeoutRef.current);
      setGameState("fault");
    } else if (gameState === "go") {
      const diff = Date.now() - startTime;
      setReactionTime(diff);
      setGameState("result");
    }
  };

  // Helper for qualifying threshold check
  const isQualifiedPro = (g: "men" | "women", est: number) => {
    return g === "men" ? est <= 42 : est <= 48;
  };

  return (
    <div className="bg-[#080808] min-h-screen text-white safe-page-wrapper pb-0 font-sans relative overflow-x-hidden selection:bg-[#FF0099] selection:text-black flex flex-col">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[#080808]/80 opacity-20 select-none pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="container mx-auto px-8 md:px-12 max-w-7xl relative z-10 flex-grow flex flex-col justify-start items-center pt-12 md:pt-16 pb-0">
        
        {/* ================= HERO SECTION ================= */}
        <div className="text-center max-w-3xl mx-auto select-none mb-16 w-full flex flex-col items-center justify-center">
          <AnimatedCopy
            variant="diffuse"
            onScroll={false}
            delay={0.1}
            tag="h1"
            className="text-4xl sm:text-5xl md:text-7xl font-sans font-black uppercase text-white leading-none tracking-tighter mb-6"
          >
            REGISTER
          </AnimatedCopy>
          <p className="text-zinc-300 text-sm md:text-base max-w-xl mx-auto mb-2 font-sans">
            Reserve your starting position for Beyond Distance.
          </p>
          <p className="text-zinc-500 text-xs md:text-sm max-w-xl mx-auto mb-8 font-mono">
            Complete registration in under one minute.
          </p>
          
          <ParticleButton
            onClick={() => {
              try { playHoverSound(); } catch {}
              const element = document.getElementById("registration-form-card");
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
            className="px-8 py-4 bg-[#FF0099] text-black font-semibold uppercase tracking-widest font-mono text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(255,0,153,0.3)] hover:shadow-[0_0_35px_rgba(255,0,153,0.6)] hover:scale-105 duration-300 rounded-none flex items-center gap-2 mx-auto cursor-pointer border-none register-heartbeat-btn"
            glowColor="#FF0099"
          >
            <ChevronDown className="w-4 h-4 animate-bounce" />
            REGISTER
          </ParticleButton>
        </div>

        {/* ================= PRIMARY CARD OVERALL CONTAINER ================= */}
        <div className="max-w-3xl mx-auto w-full" id="registration-form-card">
          
          <AnimatePresence mode="wait">
            {showInvoice ? (
              /* ================= SUCCESS PASSPORT PLATE ================= */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FF0099] text-black p-8 md:p-12 rounded-none border border-black relative overflow-hidden select-none shadow-[0_0_50px_rgba(255,0,153,0.25)]"
              >
                {/* Decorative Tech Grid Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                <div className="absolute top-0 right-0 p-4 font-mono text-[9px] font-bold uppercase tracking-wider text-black/60 bg-black/10">
                  OFFICIAL GRID ENTRY PASS
                </div>

                <div className="flex justify-between items-start gap-4 border-b border-black/20 pb-6 relative z-10">
                  <div>
                    <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight font-sans">REGISTRATION SECURED</h3>
                    <p className="text-xs font-mono text-black/80 mt-1 uppercase">Beyond Distance 2026 &bull; Organized by 7K Club</p>
                  </div>
                  <div className="bg-black p-2.5">
                    <Check className="w-8 h-8 text-[#FF0099]" strokeWidth={3} />
                  </div>
                </div>

                {/* Passport Grid Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 font-mono text-xs py-8 relative z-10">
                  <div className="border-b border-black/10 pb-2">
                    <span className="opacity-60 block uppercase text-[10px] tracking-wide">ATHLETE SYSTEM ID</span>
                    <span className="font-bold text-sm">{showInvoice.assignedNo}</span>
                  </div>
                  <div className="border-b border-black/10 pb-2">
                    <span className="opacity-60 block uppercase text-[10px] tracking-wide">COMPETITOR NAME</span>
                    <span className="font-bold text-sm uppercase">{showInvoice.name}</span>
                  </div>
                  <div className="border-b border-black/10 pb-2">
                    <span className="opacity-60 block uppercase text-[10px] tracking-wide">BRACKET / MODE</span>
                    <span className="font-bold text-sm uppercase">{showInvoice.bracket}</span>
                  </div>
                  <div className="border-b border-black/10 pb-2">
                    <span className="opacity-60 block uppercase text-[10px] tracking-wide">TARGET PACE LIMIT</span>
                    <span className="font-bold text-sm uppercase">{showInvoice.estMins} MINS</span>
                  </div>
                  <div className="border-b border-black/10 pb-2">
                    <span className="opacity-60 block uppercase text-[10px] tracking-wide">GRID CLASSIFICATION</span>
                    <span className="font-bold text-sm uppercase bg-black text-white px-2 py-0.5 rounded-sm inline-block">
                      {isQualifiedPro(showInvoice.gender, showInvoice.estMins) ? "F1 GRAND PRIX ROW" : "10K GENERAL ROW"}
                    </span>
                  </div>
                  <div className="border-b border-black/10 pb-2">
                    <span className="opacity-60 block uppercase text-[10px] tracking-wide">PASSPORT SIGN-TIME</span>
                    <span className="font-bold text-sm">{showInvoice.registeredAt}</span>
                  </div>
                </div>

                {showInvoice.notes && (
                  <div className="p-4 bg-black/10 border border-black/10 font-mono text-xs mb-6 relative z-10 rounded-sm">
                    <span className="opacity-60 block uppercase text-[9px] tracking-wider mb-1">ATHLETE NOTES</span>
                    <p className="italic font-medium">"{showInvoice.notes}"</p>
                  </div>
                )}

                <div className="border-t border-black/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                  <p className="text-[10px] font-mono leading-tight opacity-75 max-w-md">
                    *Present this pass on August 29th at the national park stadium, Ulaanbaatar, MN. Your 7K racing pack includes active timing chip wristband, starting bib, and official track jersey.
                  </p>
                  <ParticleButton
                    onClick={() => {
                      try { playHoverSound(); } catch {}
                      setShowInvoice(null);
                    }}
                    className="px-6 py-3 bg-black text-white hover:bg-zinc-900 transition-all font-mono text-xs uppercase tracking-widest rounded-none whitespace-nowrap cursor-pointer shadow-lg border-none"
                    glowColor="#FF0099"
                  >
                    AGAIN
                  </ParticleButton>
                </div>
              </motion.div>
            ) : (
              <RegistrationCard onSubmitSuccess={handleRegistrationSuccess} />
            )}
          </AnimatePresence>
        </div>

        {/* ======================================================== */}
        {/* ==================== PARTICIPANTS ====================== */}
        {/* ======================================================== */}
        {hasRegistered && (
          <div className="max-w-3xl mx-auto w-full mt-20 bg-zinc-950/30 border border-zinc-900/60 p-8 space-y-6 select-none relative">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
              <div>
                <h4 className="text-md font-bold uppercase text-white font-sans tracking-tight">PARTICIPANTS</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">CONNECTED</span>
              </div>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
              <AnimatePresence initial={false}>
                {registrants.map((reg, index) => {
                  const isQual = isQualifiedPro(reg.gender, reg.estMins);
                  return (
                    <motion.div 
                      key={reg.id} 
                      initial={index === 0 ? { opacity: 0, y: -20, height: 0 } : false}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex justify-between items-center p-4 bg-zinc-950 border border-zinc-900/60 hover:border-zinc-800 font-mono text-xs select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-[#FF0099] uppercase text-[10px]">
                          {reg.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="font-bold text-white uppercase">{reg.name}</div>
                          <div className="text-[9px] text-zinc-500 uppercase mt-0.5">{reg.bracket} &bull; {reg.assignedNo}</div>
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className={`px-2 py-0.5 text-[8px] rounded-sm font-bold uppercase tracking-wider ${
                          isQual ? "bg-green-950/80 text-green-400 border border-green-900/40" : "bg-zinc-900 text-zinc-400 border border-zinc-850"
                        }`}>
                          {isQual ? "PRO 3K COMPETE" : "10K ENTRY"}
                        </span>
                        <div className="text-[9px] text-zinc-500 uppercase">
                          {reg.relativeTime || "Joined recently"}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* ==================== DRAMATIC DEAD SPACE ================ */}
      {/* ======================================================== */}
      {hasRegistered && (
        <>
          <div className="w-full flex flex-col items-center justify-center py-80 sm:py-96 select-none pointer-events-none bg-gradient-to-b from-[#080808] via-[#4d002e] to-[#FF0099]" id="neural-drill-teaser">
            <motion.div 
              initial={{ opacity: 0.2 }}
              whileInView={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-center space-y-4"
            >
              <span className="text-xs font-mono tracking-[0.4em] text-zinc-400 block uppercase">SCROLL FOR THE NEURAL DRILL</span>
              <ChevronDown className="w-8 h-8 text-zinc-400 mx-auto animate-bounce" />
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* =========== FULL SCREEN PINK REACTION GAME SECTION ===== */}
          {/* ======================================================== */}
          <section className="w-full bg-[#FF0099] text-black py-32 md:py-48 relative z-10 flex flex-col items-center justify-center min-h-screen">
            <div className="container mx-auto px-8 md:px-12 max-w-4xl flex flex-col justify-center space-y-16">
              
              <div className="text-center space-y-6">
                <span className="text-xs font-mono tracking-[0.35em] text-black/75 font-bold block uppercase">GRID NEURAL SYSTEM</span>
                <h2 
                  className="font-black uppercase text-5xl sm:text-7xl md:text-8xl tracking-tighter leading-none text-black select-none"
                  style={{ fontFamily: '"De Fonte Plus", "Space Grotesk", "Arial Black", sans-serif' }}
                >
                  REACTION DRILL
                </h2>
                <p className="text-sm sm:text-base text-black/90 font-mono max-w-2xl mx-auto leading-relaxed uppercase tracking-tight font-medium">
                  A Grand Prix grid start relies purely on neural reaction speeds. Prepare your focus. Keep your cursor ready over the button, and tap instantly when all lights extinguish!
                </p>
              </div>

              {/* Interactive Console Console */}
              <div className="w-full bg-black border-[6px] border-black p-8 sm:p-14 space-y-12 shadow-[0_35px_80px_rgba(0,0,0,0.6)] text-white select-none">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
                  <span className="text-xs font-mono tracking-widest text-[#FF0099] font-bold uppercase">GRID LIGHT CONSOLE v1.12</span>
                  <span className="px-3.5 py-1 bg-zinc-900 border border-zinc-850 text-xs text-zinc-400 font-mono uppercase rounded-none font-bold">
                    STANDBY
                  </span>
                </div>

                {/* Graphic LED lights row */}
                <div className="flex flex-col items-center justify-center space-y-12 py-12 sm:py-16 bg-[#080808] border border-zinc-900 rounded-sm">
                  <div className="flex gap-6 sm:gap-10">
                    {[0, 1, 2, 3, 4].map((i) => {
                      const isLit = litCount > i && (gameState === "ready" || gameState === "pending");
                      return (
                        <div key={i} className="flex flex-col items-center gap-3 p-2.5 sm:p-3 bg-zinc-950 border border-zinc-900 rounded-sm">
                          <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-full border border-black/80 transition-all duration-75 ${
                            isLit ? "bg-[#FF0099] shadow-[0_0_35px_rgba(255,0,153,0.95)]" : "bg-zinc-900"
                          }`} />
                          <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-full border border-black/80 transition-all duration-75 ${
                            isLit ? "bg-[#FF0099] shadow-[0_0_35px_rgba(255,0,153,0.95)]" : "bg-zinc-900"
                          }`} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Console Dashboard Message */}
                  <div className="text-center font-mono w-full px-6 min-h-[70px] flex items-center justify-center">
                    {gameState === "idle" && (
                      <p className="text-xs sm:text-base text-zinc-500 uppercase tracking-widest font-bold">AWAITING SEQUENCE INITIATION...</p>
                    )}
                    {gameState === "ready" && (
                      <p className="text-xs sm:text-base text-[#FF0099] animate-pulse uppercase tracking-widest font-bold">GRID TRANSMISSION CONNECTING...</p>
                    )}
                    {gameState === "pending" && (
                      <p className="text-xs sm:text-base text-zinc-300 font-bold uppercase tracking-widest animate-pulse">STAY FOCUSED. WAIT FOR BLACKOUT.</p>
                    )}
                    {gameState === "go" && (
                      <p className="text-sm sm:text-lg text-green-400 font-bold block tracking-widest animate-pulse uppercase">LAUNCH NOW! LAUNCH!</p>
                    )}
                    {gameState === "fault" && (
                      <p className="text-sm sm:text-lg text-red-500 font-bold uppercase tracking-wider leading-tight">
                        ⚠️ FALSE START DETECTED! YOU JUMPED THE GRID.
                      </p>
                    )}
                    {gameState === "result" && reactionTime !== null && (
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider">REACTION DELAY</p>
                        <p className="text-5xl sm:text-6xl font-black text-[#FF0099]">{reactionTime} ms</p>
                        <p className="text-xs sm:text-sm text-green-400 font-bold uppercase tracking-widest">
                          {reactionTime < 180 ? "⚡ EXTREME ALPHA CHAMPION SPEED!" :
                           reactionTime < 250 ? "🏃 PRO COMPETITOR REFLEX" :
                           "COFFEE INJECTION STRONGLY REQUIRED"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interaction Buttons */}
                <div className="space-y-6">
                  {gameState === "pending" || gameState === "go" ? (
                    <button
                      onClick={handleLaunchClick}
                      className="w-full py-6 sm:py-8 bg-green-500 hover:bg-green-400 text-black font-black text-base sm:text-lg font-mono uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_35px_rgba(34,197,94,0.5)] border-none"
                    >
                      <MousePointerClick className="w-6 h-6 animate-bounce" />
                      TAP NOW
                    </button>
                  ) : (
                    <button
                      onClick={startF1Countdown}
                      className="w-full py-6 sm:py-8 bg-black text-[#FF0099] border-2 border-[#FF0099] hover:bg-[#FF0099] hover:text-black font-black text-base sm:text-lg font-mono uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Zap className="w-6 h-6" />
                      START TESTING
                    </button>
                  )}

                  <p className="text-xs font-mono text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
                    Standard racer reaction is 220ms. Can you break the 7K record of 148ms?
                  </p>
                </div>
              </div>

            </div>
          </section>
        </>
      )}

    </div>
  );
}

export default ProjectView;
