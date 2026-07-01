import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Mail, 
  FileText, 
  Check, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  ShieldCheck, 
  Award, 
  Activity,
  Cpu
} from "lucide-react";
import { playHoverSound } from "../utils/sfx";
import { ParticleButton } from "./ParticleButton";

export interface RegistrationData {
  fullName: string;
  email: string;
  gender: "women" | "men";
  bracket: string;
  estMins: number;
  notes: string;
}

interface RegistrationCardProps {
  onSubmitSuccess: (data: RegistrationData) => void;
}

export function RegistrationCard({ onSubmitSuccess }: RegistrationCardProps) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"women" | "men">("men");
  const [bracket, setBracket] = useState("Solo Pro");
  const [targetMins, setTargetMins] = useState<number>(45);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [status, setStatus] = useState<"form" | "scanning" | "confirmed">("form");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLog, setScanLog] = useState("INITIALIZING SECURE PROTOCOL...");

  // Helper to determine starting grid row based on gender & estimated time
  const isQualifiedPro = (g: "men" | "women", est: number) => {
    return g === "men" ? est <= 42 : est <= 48;
  };

  const handleNextStep = () => {
    try { playHoverSound(); } catch {}
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!fullName.trim() || fullName.trim().length < 3) {
        newErrors.fullName = "Please enter your full legal name (at least 3 characters).";
      }
      if (!email.trim() || !email.includes("@") || !email.includes(".")) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    try { playHoverSound(); } catch {}
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step !== 3) {
      handleNextStep();
      return;
    }

    if (!agreedToTerms) {
      setErrors({ agreed: "You must accept the race regulations and liability waiver to register." });
      return;
    }

    setStatus("scanning");
    setScanProgress(0);
    setScanLog("ESTABLISHING SECURE GRID ENVELOPE...");

    let progress = 0;
    const logs = [
      "ESTABLISHING SECURE GRID ENVELOPE...",
      "VERIFYING ATHLETE COMPLIANCE INDEX...",
      "PACKAGING BIOMETRIC PARITY...",
      "INJECTING ACTIVE GPS MARSHAL DATA...",
      "ALLOCATING START GRID COORDINATES...",
      "CONFIRMING WAIVER SIGNATURE INDEX...",
      "LOCKING DOWN SYSTEM TRANSACTION..."
    ];

    const timer = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        setTimeout(() => {
          setStatus("confirmed");
        }, 300);
      }
      setScanProgress(progress);
      const logIdx = Math.min(Math.floor((progress / 100) * logs.length), logs.length - 1);
      setScanLog(logs[logIdx]);
    }, 100);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 p-8 sm:p-12 md:p-16 relative shadow-2xl rounded-none overflow-hidden">
      {/* Visual Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF0099]" />

      <AnimatePresence mode="wait">
        {status === "form" && (
          <motion.div
            key="form-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Modern Multi-step Progress Header */}
            <div className="flex flex-col items-center justify-center text-center gap-4 mb-8 border-b border-zinc-900 pb-6 select-none">
              <div className="text-center">
                <h3 className="text-lg font-black uppercase tracking-tight text-white font-sans">
                  GRID POSITION RESERVATION
                </h3>
                <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">
                  STEP {step} OF 3 &bull; {step === 1 ? "Personal Details" : step === 2 ? "Race Configuration" : "Final Authorization"}
                </p>
              </div>

              {/* Customized Progress Indicator: Step 1 ●──●──● */}
              <div className="flex items-center gap-3 font-mono text-xs justify-center">
                <span className="text-zinc-500 uppercase text-[9px] tracking-widest mr-1">PROGRESS</span>
                <div className="flex items-center gap-1.5 justify-center">
                  <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-[#FF0099] shadow-[0_0_8px_#FF0099]' : 'bg-zinc-800'}`} />
                  <span className={`w-6 h-[1px] transition-all duration-300 ${step >= 2 ? 'bg-[#FF0099]' : 'bg-zinc-800'}`} />
                  <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-[#FF0099] shadow-[0_0_8px_#FF0099]' : 'bg-zinc-800'}`} />
                  <span className={`w-6 h-[1px] transition-all duration-300 ${step >= 3 ? 'bg-[#FF0099]' : 'bg-zinc-800'}`} />
                  <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-[#FF0099] shadow-[0_0_8px_#FF0099]' : 'bg-zinc-800'}`} />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* ================= STEP 1: PERSONAL INFORMATION ================= */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="border-l-2 border-[#FF0099] pl-3 mb-2">
                      <span className="text-[9px] font-mono text-[#FF0099] tracking-wider uppercase block font-black">REGISTRATION FIELD 01</span>
                      <h4 className="text-sm font-bold uppercase text-white font-sans tracking-wider">PERSONAL DETAILS</h4>
                    </div>

                    {/* Full Name */}
                    <div className="input-group-container">
                      <label className="block text-xs font-mono text-zinc-300 uppercase tracking-widest font-bold">Full Legal Name</label>
                      <div className="input-with-icon">
                        <input
                          type="text"
                          className="w-full bg-[#080808] border border-zinc-850 focus:border-[#FF0099] text-white py-4 pr-4 text-sm rounded-none outline-none font-mono tracking-wide transition-all focus:ring-1 focus:ring-[#FF0099]/30 shadow-inner"
                          placeholder="ENTER YOUR FULL NAME"
                          required
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.fullName) setErrors(prev => ({ ...prev, fullName: "" }));
                          }}
                        />
                        <User className="w-4 h-4" />
                      </div>
                      {errors.fullName && (
                        <p className="text-xs text-red-500 font-mono flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {errors.fullName}
                        </p>
                      )}
                      <p className="text-[10px] text-zinc-600 font-mono">Exactly as it appears on official passport or national ID cards.</p>
                    </div>

                    {/* Email */}
                    <div className="input-group-container">
                      <label className="block text-xs font-mono text-zinc-300 uppercase tracking-widest font-bold">Email Address</label>
                      <div className="input-with-icon">
                        <input
                          type="email"
                          className="w-full bg-[#080808] border border-zinc-850 focus:border-[#FF0099] text-white py-4 pr-4 text-sm rounded-none outline-none font-mono tracking-wide transition-all focus:ring-1 focus:ring-[#FF0099]/30 shadow-inner"
                          placeholder="name@gmail.com"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                          }}
                        />
                        <Mail className="w-4 h-4" />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-500 font-mono flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {errors.email}
                        </p>
                      )}
                      <p className="text-[10px] text-zinc-600 font-mono">Important: Race timing and confirmation passes will be delivered here.</p>
                    </div>

                    {/* Gender */}
                    <div className="space-y-3">
                      <label className="block text-xs font-mono text-zinc-300 uppercase tracking-widest font-bold">Gender Division</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            try { playHoverSound(); } catch {}
                            setGender("men");
                          }}
                          className={`text-center py-4 px-4 font-mono text-xs uppercase tracking-wider border cursor-pointer transition-all rounded-none ${
                            gender === "men" 
                              ? "border-[#FF0099] text-[#FF0099] bg-[#FF0099]/5 font-black shadow-[0_0_15px_rgba(255,0,153,0.15)]" 
                              : "border-zinc-900 text-zinc-500 hover:text-zinc-400 hover:border-zinc-850"
                          }`}
                        >
                          Men's Division
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            try { playHoverSound(); } catch {}
                            setGender("women");
                          }}
                          className={`text-center py-4 px-4 font-mono text-xs uppercase tracking-wider border cursor-pointer transition-all rounded-none ${
                            gender === "women" 
                              ? "border-[#FF0099] text-[#FF0099] bg-[#FF0099]/5 font-black shadow-[0_0_15px_rgba(255,0,153,0.15)]" 
                              : "border-zinc-900 text-zinc-500 hover:text-zinc-400 hover:border-zinc-850"
                          }`}
                        >
                          Women's Division
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ================= STEP 2: RACE CONFIGURATION ================= */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="border-l-2 border-[#FF0099] pl-3 mb-2">
                      <span className="text-[9px] font-mono text-[#FF0099] tracking-wider uppercase block font-black">REGISTRATION FIELD 02</span>
                      <h4 className="text-sm font-bold uppercase text-white font-sans tracking-wider">RACE CONFIGURATION</h4>
                    </div>

                    {/* Race Category / Bracket */}
                    <div className="space-y-3">
                      <label className="block text-xs font-mono text-zinc-300 uppercase tracking-widest font-bold">Race Category</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { val: "Solo Pro", label: "Solo Pro Entry", desc: "For experienced grid racers" },
                          { val: "Solo Amateur", label: "Solo Amateur Entry", desc: "For ambitious athletes" },
                          { val: "7K Member", label: "7K Club Member", desc: "For verified 7K harriers" }
                        ].map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => {
                              try { playHoverSound(); } catch {}
                              setBracket(item.val);
                            }}
                            className={`text-left p-4 border transition-all cursor-pointer rounded-none ${
                              bracket === item.val 
                                ? "border-[#FF0099] bg-[#FF0099]/5 text-white" 
                                : "border-zinc-900 text-zinc-500 hover:border-zinc-850 hover:text-zinc-400"
                            }`}
                          >
                            <div className="font-mono text-xs uppercase font-black tracking-wider text-white">{item.label}</div>
                            <div className="text-[10px] text-zinc-500 mt-1 font-sans">{item.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Estimated Finish Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2 relative">
                        <label className="block text-xs font-mono text-zinc-300 uppercase tracking-widest font-bold">Estimated Finish Time</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              try { playHoverSound(); } catch {}
                              setDropdownOpen(!dropdownOpen);
                            }}
                            className="w-full bg-[#080808] border border-zinc-850 focus:border-[#FF0099] text-white p-3.5 text-sm rounded-none outline-none font-mono uppercase cursor-pointer flex justify-between items-center text-left"
                          >
                            <span>
                              {targetMins === 35 && "Under 35m (Elite Class)"}
                              {targetMins === 40 && "35m - 40m (Advanced Athlete)"}
                              {targetMins === 45 && "40m - 45m (Paced Harrier)"}
                              {targetMins === 50 && "45m - 50m (Determined Runner)"}
                              {targetMins === 60 && "50m - 60m (Steady Challenger)"}
                              {targetMins === 75 && "Above 60m (Determined Finisher)"}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-[#FF0099] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                          </button>

                          <AnimatePresence>
                            {dropdownOpen && (
                              <>
                                {/* Overlay to close on clicking outside */}
                                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute left-0 right-0 mt-1 bg-zinc-950 border border-zinc-850 z-50 rounded-none max-h-60 overflow-y-auto shadow-2xl divide-y divide-zinc-900/40"
                                >
                                  {[
                                    { value: 35, label: "Under 35m (Elite Class)" },
                                    { value: 40, label: "35m - 40m (Advanced Athlete)" },
                                    { value: 45, label: "40m - 45m (Paced Harrier)" },
                                    { value: 50, label: "45m - 50m (Determined Runner)" },
                                    { value: 60, label: "50m - 60m (Steady Challenger)" },
                                    { value: 75, label: "Above 60m (Determined Finisher)" }
                                  ].map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        try { playHoverSound(); } catch {}
                                        setTargetMins(opt.value);
                                        setDropdownOpen(false);
                                      }}
                                      className={`w-full text-left p-3.5 font-mono text-xs uppercase hover:bg-[#FF0099]/10 hover:text-white transition-all cursor-pointer ${
                                        targetMins === opt.value ? "text-[#FF0099] bg-[#FF0099]/5 font-black" : "text-zinc-400"
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Instant validation details */}
                      <div className="flex flex-col justify-center">
                        <div className="p-4 bg-zinc-900/20 border border-zinc-900/40 rounded-none h-full flex flex-col justify-center select-none">
                          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Grid Validation</div>
                          {isQualifiedPro(gender, targetMins) ? (
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-green-400 font-mono flex items-center gap-1 uppercase">
                                <Award className="w-4 h-4 animate-bounce" /> PRO STARTING ROW QUALIFIED
                              </span>
                              <p className="text-[10px] text-zinc-400 font-mono leading-tight">
                                Division cut-off is {gender === "men" ? "42:00" : "48:00"}. You are classified for the elite Championship Grid.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-[#FF0099] font-mono flex items-center gap-1 uppercase">
                                <Activity className="w-4 h-4" /> 10K FIELD LAUNCH
                              </span>
                              <p className="text-[10px] text-zinc-500 font-mono leading-tight">
                                Exceptional stamina. You will start inside the primary general cluster to challenge the track.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Optional Athlete Notes */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-zinc-300 uppercase tracking-widest font-bold">Optional Notes (Special requests)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-4 text-zinc-600">
                          <FileText className="w-4 h-4" />
                        </span>
                        <textarea
                          className="w-full bg-[#080808] border border-zinc-850 focus:border-[#FF0099] text-white py-3.5 pl-12 pr-4 text-sm rounded-none outline-none font-mono tracking-wide transition-all focus:ring-1 focus:ring-[#FF0099]/30 shadow-inner h-24 resize-none"
                          style={{ paddingLeft: "3rem" }}
                          placeholder="E.G. BRACKET CLUB AFFILIATIONS, TIMING PACK DETAILS, PHYSICAL ISSUES..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ================= STEP 3: CONFIRMATION ================= */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="border-l-2 border-[#FF0099] pl-3 mb-2">
                      <span className="text-[9px] font-mono text-[#FF0099] tracking-wider uppercase block font-black">REGISTRATION FIELD 03</span>
                      <h4 className="text-sm font-bold uppercase text-white font-sans tracking-wider">CONFIRM REGISTRATION DETAILS</h4>
                    </div>

                    {/* Detailed Summary */}
                    <div className="bg-[#0c0c0c] border border-zinc-900 p-6 space-y-4 font-mono text-xs select-none">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-zinc-500 uppercase text-[9px] tracking-wider">Athlete Name</span>
                          <div className="text-white font-bold text-sm uppercase mt-0.5">{fullName}</div>
                        </div>
                        <div>
                          <span className="text-zinc-500 uppercase text-[9px] tracking-wider">Email Contact</span>
                          <div className="text-white font-bold text-sm mt-0.5">{email}</div>
                        </div>
                        <div>
                          <span className="text-zinc-500 uppercase text-[9px] tracking-wider">Gender Bracket</span>
                          <div className="text-white font-bold text-sm uppercase mt-0.5">{gender === "men" ? "Men's Division" : "Women's Division"}</div>
                        </div>
                        <div>
                          <span className="text-zinc-500 uppercase text-[9px] tracking-wider">Race Category</span>
                          <div className="text-white font-bold text-sm uppercase mt-0.5">{bracket}</div>
                        </div>
                        <div>
                          <span className="text-zinc-500 uppercase text-[9px] tracking-wider">10K Target Speed</span>
                          <div className="text-white font-bold text-sm uppercase mt-0.5">{targetMins} Minutes</div>
                        </div>
                        <div>
                          <span className="text-zinc-500 uppercase text-[9px] tracking-wider">Estimated Allocation</span>
                          <div className={`font-bold text-sm uppercase mt-0.5 ${isQualifiedPro(gender, targetMins) ? "text-green-400" : "text-[#FF0099]"}`}>
                            {isQualifiedPro(gender, targetMins) ? "GP START ROW" : "GENERAL 10K GROUP"}
                          </div>
                        </div>
                      </div>

                      {notes && (
                        <div className="border-t border-zinc-900 pt-3">
                          <span className="text-zinc-500 uppercase text-[9px] tracking-wider">Athlete Statements</span>
                          <div className="text-zinc-400 italic mt-0.5">"{notes}"</div>
                        </div>
                      )}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="space-y-2">
                      <label className="flex items-start gap-3.5 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={agreedToTerms}
                          onChange={(e) => {
                            try { playHoverSound(); } catch {}
                            setAgreedToTerms(e.target.checked);
                            if (errors.agreed) setErrors(prev => ({ ...prev, agreed: "" }));
                          }}
                        />
                        <div className={`w-5 h-5 border flex items-center justify-center transition-all rounded-none shrink-0 mt-0.5 ${
                          agreedToTerms 
                            ? "bg-[#FF0099] border-[#FF0099]" 
                            : "border-zinc-800 bg-zinc-900 group-hover:border-[#FF0099]/60"
                        }`}>
                          {agreedToTerms && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                        </div>
                        <div className="text-xs text-zinc-400 leading-relaxed font-mono">
                          I agree to the official <span className="text-white hover:underline">Championship Regulations</span>, and allow the race marshal to allocate my chip. I confirm all details are authentic.
                        </div>
                      </label>
                      {errors.agreed && (
                        <p className="text-xs text-red-500 font-mono flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {errors.agreed}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ================= CONTROLLER FOOTER ================= */}
              <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-md md:bg-transparent border-t border-zinc-900 md:border-t-0 p-4 -mx-8 -mb-8 sm:-mx-12 sm:-mb-12 md:p-0 md:mx-0 md:mb-0 flex gap-4 mt-8 z-30 items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-4 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer border border-zinc-800 rounded-none shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    BACK
                  </button>
                ) : (
                  <div className="hidden md:block w-10 h-10" />
                )}

                {step < 3 ? (
                  <ParticleButton
                    type="button"
                    onClick={handleNextStep}
                    className="w-full md:w-auto py-4 px-8 bg-[#FF0099] text-black font-black uppercase tracking-widest font-mono text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(255,0,153,0.3)] hover:scale-[1.02] duration-200 flex items-center justify-center gap-2 cursor-pointer ml-auto rounded-none border border-transparent"
                  >
                    CONTINUE
                    <ChevronRight className="w-4 h-4 text-black" strokeWidth={3} />
                  </ParticleButton>
                ) : (
                  <ParticleButton
                    type="submit"
                    className="w-full md:w-auto py-4 px-8 bg-[#FF0099] text-black font-black uppercase tracking-widest font-mono text-xs hover:bg-white transition-all shadow-[0_0_25px_rgba(255,0,153,0.4)] hover:shadow-[0_0_35px_rgba(255,0,153,0.7)] hover:scale-[1.03] duration-200 flex items-center justify-center gap-2 cursor-pointer ml-auto rounded-none border border-transparent register-heartbeat-btn"
                  >
                    <ShieldCheck className="w-4 h-4 text-black" strokeWidth={3} />
                    CONFIRM
                  </ParticleButton>
                )}
              </div>
            </form>
          </motion.div>
        )}

        {status === "scanning" && (
          <motion.div
            key="scanning-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 text-center select-none space-y-8"
          >
            {/* Spinning Radar Circle */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-[#FF0099]/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-2 border border-dotted border-white/20 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-16 h-16 bg-[#FF0099]/10 rounded-full flex items-center justify-center border border-[#FF0099]/40 shadow-[0_0_20px_rgba(255,0,153,0.2)]"
              >
                <Cpu className="w-8 h-8 text-[#FF0099] animate-pulse" />
              </motion.div>

              {/* Sweeping radar hand */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute w-1/2 h-0.5 bg-gradient-to-r from-transparent to-[#FF0099] origin-left left-1/2 top-1/2 -translate-y-1/2"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase tracking-widest text-white font-sans">
                GRID ENCRYPTING
              </h3>
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest animate-pulse h-4 text-center">
                {scanLog}
              </p>
            </div>

            {/* Custom Progress Bar */}
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-1.5 rounded-none">
              <div className="bg-zinc-950 h-5 relative flex items-center">
                <motion.div
                  className="h-full bg-[#FF0099]"
                  style={{ width: `${scanProgress}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-white z-10 select-none">
                  {scanProgress}% SECURED
                </span>
              </div>
            </div>

            <div className="font-mono text-[9px] text-zinc-600 max-w-xs leading-relaxed uppercase">
              TRANSMITTING BIOMETRIC SECURE SEAL TO UB SOUTH MARSHALS...
            </div>
          </motion.div>
        )}

        {status === "confirmed" && (
          <motion.div
            key="confirmed-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center space-y-8 select-none py-10 relative overflow-hidden"
          >
            {/* Cyber Grid background elements */}
            <div className="absolute inset-0 bg-zinc-950 pointer-events-none -z-10 opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* Success Shield Indicator with interactive radar lock */}
            <div className="relative">
              {/* Expanding cyber target rings */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1, 1.4, 1.6], opacity: [0.5, 0.2, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                className="absolute -inset-6 border-2 border-green-500 rounded-full"
              />
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1, 1.25, 1.4], opacity: [0.6, 0.3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="absolute -inset-4 border border-[#FF0099] rounded-full"
              />
              
              <div className="w-24 h-24 bg-green-500/10 rounded-full border border-green-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)] relative z-10">
                <Check className="w-12 h-12 text-green-400" strokeWidth={3} />
              </div>
            </div>

            {/* Title / Header */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-black tracking-[0.4em] text-green-400 uppercase">
                SYSTEM REGISTER SECURED
              </span>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white font-sans leading-none">
                REGISTRATION CONFIRMED
              </h3>
              <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider mt-1">
                GRID PASSPORT ACTIVATED SUCCESSFULLY
              </p>
            </div>

            {/* Virtual Starting Grid Slot Visualizer */}
            <div className="bg-zinc-900/60 border border-zinc-800 p-6 w-full max-w-md space-y-4 rounded-none font-mono text-left relative">
              <div className="absolute top-2 right-3 text-[8px] font-bold text-zinc-600 uppercase tracking-widest">GRID-LOCATOR-v1.0</div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-850">
                  <span className="text-zinc-500 uppercase text-[9px]">COMPETITOR</span>
                  <span className="text-white font-bold uppercase">{fullName}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-850">
                  <span className="text-zinc-500 uppercase text-[9px]">DIVISION</span>
                  <span className="text-white font-bold uppercase">{gender === "men" ? "Men's Division" : "Women's Division"}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-850">
                  <span className="text-zinc-500 uppercase text-[9px]">GRID ROW</span>
                  <span className={`font-bold uppercase ${isQualifiedPro(gender, targetMins) ? "text-green-400" : "text-[#FF0099]"}`}>
                    {isQualifiedPro(gender, targetMins) ? "F1 CHAMPION ROW" : "GENERAL MAIN ROW"}
                  </span>
                </div>
              </div>

              {/* Visual mini-map grid dots of launching slot */}
              <div className="pt-2">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-2 text-center">QUALIFICATION SLOT SECURED IN SYSTEM</div>
                <div className="grid grid-cols-6 gap-2.5 max-w-[240px] mx-auto bg-[#050505] p-3 border border-zinc-850 rounded-sm">
                  {[...Array(12)].map((_, i) => {
                    const isAllocated = i === (isQualifiedPro(gender, targetMins) ? 1 : 7);
                    return (
                      <div key={i} className="flex flex-col items-center justify-center gap-1">
                        <motion.div
                          animate={isAllocated ? {
                            scale: [1, 1.25, 1],
                            backgroundColor: isQualifiedPro(gender, targetMins) ? ["#22c55e", "#4ade80", "#22c55e"] : ["#ff0099", "#ff66cc", "#ff0099"],
                            boxShadow: isQualifiedPro(gender, targetMins)
                              ? ["0 0 4px #22c55e", "0 0 12px #22c55e", "0 0 4px #22c55e"]
                              : ["0 0 4px #ff0099", "0 0 12px #ff0099", "0 0 4px #ff0099"]
                          } : {}}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            isAllocated
                              ? "bg-green-500 shadow-[0_0_10px_#22c55e]"
                              : "bg-zinc-800"
                          }`}
                        />
                        <span className="text-[7px] text-zinc-700 font-bold">{i+1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Receiver Button */}
            <div className="w-full max-w-xs pt-4">
              <ParticleButton
                onClick={() => {
                  onSubmitSuccess({
                    fullName,
                    email,
                    gender,
                    bracket,
                    estMins: targetMins,
                    notes
                  });
                }}
                className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest text-xs font-mono rounded-none border-none cursor-pointer shadow-[0_0_25px_rgba(34,197,94,0.3)] duration-200"
                glowColor="#22C55E"
              >
                PASS
              </ParticleButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
