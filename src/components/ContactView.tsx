import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { playSuccessSound, playHoverSound } from "../utils/sfx";
import { ParticleButton } from "./ParticleButton";

// 1. Premium Letter Split Flip Link Component for links & Work Email
const FlipLink = ({ label, href, className = "" }: { label: string; href: string; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    try {
      playHoverSound();
    } catch (err) {
      // Audio sandbox graceful fallback
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      window.location.href = href;
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <ParticleButton
      glowColor="#FF0099"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center gap-3 py-4 text-lg md:text-3xl font-black uppercase tracking-tightest leading-none outline-none group focus:outline-none transition-all duration-300 bg-transparent border-none text-left w-full justify-start ${className}`}
      style={{
        fontFamily: "'Roboto Flex', sans-serif"
      }}
    >
      {/* Spring dot indicator - scales in on hover */}
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: isHovered ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 15 }}
        className="w-3 h-3 rounded-full bg-[#FF0099] flex-shrink-0"
      />

      <span className="relative overflow-hidden inline-flex">
        {/* Original letter block, slides up and fades on hover */}
        <span className="flex overflow-hidden relative">
          {label.split("").map((char, index) => (
            <span
              key={index}
              className="relative inline-block transition-all duration-300 transform"
              style={{
                transitionDelay: `${index * 12}ms`,
                transform: isHovered 
                  ? "translateY(-100%) rotate(-4deg)" 
                  : "translateY(0%) rotate(0deg)",
                color: isHovered ? "#FF0099" : "#ffffff",
                letterSpacing: isHovered ? "0.05em" : "0em"
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}

          {/* Absolute duplicate layer sliding up from below */}
          <span className="absolute inset-0 flex pointer-events-none">
            {label.split("").map((char, index) => (
              <span
                key={index}
                className="relative inline-block transition-all duration-300 transform"
                style={{
                  transitionDelay: `${index * 12}ms`,
                  transform: isHovered 
                    ? "translateY(0%) rotate(0deg)" 
                    : "translateY(100%) rotate(4deg)",
                  color: "#FF0099",
                  letterSpacing: isHovered ? "0.05em" : "0em"
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </span>
      </span>

      {/* Rotating Arrow indicator */}
      <motion.span
        animate={{
          rotate: isHovered ? 45 : 0,
          color: isHovered ? "#FF0099" : "rgba(255, 255, 255, 0.4)",
          x: isHovered ? 4 : 0,
          y: isHovered ? -4 : 0
        }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
        className="text-base md:text-2xl ml-1 font-mono flex items-center justify-center select-none animate-none"
      >
        ↗
      </motion.span>
    </ParticleButton>
  );
};

const SOCIALS = [
  { name: "Instagram", url: "https://www.instagram.com/the.7k.club/" },
  { name: "Facebook", url: "https://www.facebook.com/7k.running.club" },
  { name: "Strava", url: "https://www.strava.com/athletes/147066097" },
  { name: "Phone Number", url: "tel:+97680792969" },
  { name: "Email", url: "mailto:the.7k.club@gmail.com" }
];

export function ContactView({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", details: "", agreed: false });
  const [errors, setErrors] = useState({ name: "", email: "", agreed: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Reset viewport on component mount
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agreed: e.target.checked }));
    setErrors((prev) => ({ ...prev, agreed: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", agreed: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Your identity profile / name is required.";
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address port is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please specify index-valid email coordinates.";
      isValid = false;
    }

    if (!formData.agreed) {
      newErrors.agreed = "You must accept the privacy policy terms.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        playSuccessSound();
      } catch (err) {
        // Safe sandbox fallback
      }
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-[#080808] min-h-screen text-white font-sans relative overflow-x-hidden selection:bg-white selection:text-black safe-page-wrapper" id="contact-page-view">
      
      {/* Full-page Ambient Glows (Layered, with heavy blur, starting at the bottom and fading to the top) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        {/* Primary Hot Pink/Magenta Glow from the bottom center, fading upward */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140vw] h-[90vh] rounded-full bg-gradient-to-t from-[#FF0099]/22 via-[#FF0099]/04 to-transparent blur-[160px] sm:blur-[240px] mix-blend-screen opacity-80" />
        
        {/* Left corner: Deep Purple Glow fading toward center and upward */}
        <div className="absolute bottom-0 left-[-10vw] w-[90vw] h-[85vh] rounded-full bg-gradient-to-tr from-[#581c87]/24 via-[#581c87]/05 to-transparent blur-[180px] sm:blur-[260px] mix-blend-screen opacity-70" />
        
        {/* Right corner: Very Dark Green/Teal Glow fading toward center and upward */}
        <div className="absolute bottom-0 right-[-10vw] w-[90vw] h-[85vh] rounded-full bg-gradient-to-tl from-[#004d2c]/26 via-[#004d2c]/05 to-transparent blur-[180px] sm:blur-[260px] mix-blend-screen opacity-75" />
        
        {/* Soft central ambient purple-fuchsia mist that reaches further up */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[130vh] rounded-full bg-gradient-to-t from-[#FF0099]/10 via-[#581c87]/03 to-transparent blur-[220px] sm:blur-[320px] opacity-65" />
      </div>

      {/* Dynamic atmospheric subtle grid lines on background, sitting on top of the ambient glows */}
      <div className="absolute inset-0 bg-transparent opacity-35 select-none pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Decorative Thin Graphic Arcs on Left & Right sides */}
      <div className="absolute inset-y-0 left-0 w-full overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute left-[-20vw] top-[15vh] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] border border-white/5 rounded-full" />
        <div className="absolute left-[-15vw] top-[20vh] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] border border-[#FF0099]/10 rounded-full" />
        
        <div className="absolute right-[-20vw] top-[15vh] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] border border-white/5 rounded-full" />
        <div className="absolute right-[-15vw] top-[20vh] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] border border-[#FF0099]/10 rounded-full" />
      </div>

      {/* ==================================================
          SECTION 1 — HERO / CONTACT FORM SECTION
          ================================================== */}
      <section className="relative w-full flex flex-col justify-start items-center px-8 md:px-16 pt-12 md:pt-16 pb-16 z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          {/* Hero display headline */}
          <h1 
            className="font-black uppercase text-5xl sm:text-6xl md:text-8xl tracking-tightest leading-none text-white select-none"
            style={{ fontFamily: '"De Fonte Plus", "Space Grotesk", "Arial Black", sans-serif' }}
          >
            Want to connect?
          </h1>
          
          <p className="mt-4 md:mt-6 text-zinc-400 font-mono text-[11px] sm:text-sm uppercase tracking-widest leading-relaxed max-w-xl mx-auto">
            Feel free to email me or use the form below ▼ with any questions
          </p>
        </motion.div>

        {/* Central form layout */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl mx-auto"
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="border border-zinc-900 bg-zinc-950/50 p-10 md:p-14 text-center space-y-6"
            >
              <div className="w-12 h-12 bg-[#FF0099]/10 rounded-full flex items-center justify-center text-[#FF0099] mx-auto mb-6 text-xl animate-pulse">
                📨
              </div>
              <h3 
                className="font-black text-white text-md uppercase tracking-tight"
                style={{ fontFamily: '"De Fonte Plus", "Space Grotesk", "Arial Black", sans-serif' }}
              >
                TRANSMISSION SECURED
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto uppercase font-mono">
                Your credentials and message files have been catalogued safely. Expect a quick responsive feedback loop.
              </p>
              <div className="w-full h-px bg-zinc-900 my-4" />
              <ParticleButton
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", company: "", details: "", agreed: false });
                }}
                className="font-mono text-[9px] uppercase tracking-widest text-[#FF0099] border border-[#FF0099]/20 hover:bg-[#FF0099] hover:text-black hover:border-transparent transition-all duration-300 py-3 px-6 rounded-none font-bold"
                glowColor="#FF0099"
              >
                COMPILE
              </ParticleButton>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Name field */}
                <div className="input-group-container">
                  <label className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
                    Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => {
                      try { playHoverSound(); } catch (e) {}
                    }}
                    placeholder="e.g. Andrey Gorskikh"
                    className="w-full bg-zinc-950/30 border border-zinc-900 focus:border-[#FF0099]/50 rounded-lg px-5 py-4 text-white text-sm outline-none transition-all duration-300"
                  />
                  {errors.name && (
                    <span className="font-mono text-[9px] text-[#FF0099] font-bold uppercase mt-1">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email field */}
                <div className="input-group-container">
                  <label className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
                    Email*
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => {
                      try { playHoverSound(); } catch (e) {}
                    }}
                    placeholder="e.g. name@gmail.com"
                    className="w-full bg-zinc-950/30 border border-zinc-900 focus:border-[#FF0099]/50 rounded-lg px-5 py-4 text-white text-sm outline-none transition-all duration-300"
                  />
                  {errors.email && (
                    <span className="font-mono text-[9px] text-[#FF0099] font-bold uppercase mt-1">
                      {errors.email}
                    </span>
                  )}
                </div>

              </div>

              {/* Company field */}
              <div className="input-group-container">
                <label className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  onFocus={() => {
                    try { playHoverSound(); } catch (e) {}
                  }}
                  placeholder="e.g. Independent or Agency Studio"
                  className="w-full bg-zinc-950/30 border border-zinc-900 focus:border-[#FF0099]/50 rounded-lg px-5 py-4 text-white text-sm outline-none transition-all duration-300"
                />
              </div>

              {/* Project details field */}
              <div className="input-group-container">
                <label className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
                  Project details
                </label>
                <textarea
                  name="details"
                  rows={6}
                  value={formData.details}
                  onChange={handleChange}
                  onFocus={() => {
                    try { playHoverSound(); } catch (e) {}
                  }}
                  placeholder="e.g. Describe your editorial campaign, athletic timing indices, or design vision details..."
                  className="w-full bg-zinc-950/30 border border-zinc-900 focus:border-[#FF0099]/50 rounded-lg px-5 py-4 text-white text-sm outline-none resize-none transition-all duration-300"
                />
              </div>

              {/* Bottom Row Layout */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-zinc-900/60 mt-4">
                
                {/* Consent checkbox */}
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                    <div className={`w-4.5 h-4.5 border rounded transition-all duration-300 flex items-center justify-center ${
                      formData.agreed 
                        ? "border-[#FF0099] bg-[#FF0099]" 
                        : "border-zinc-800 bg-transparent group-hover:border-zinc-750"
                    }`}>
                      {formData.agreed && (
                        <svg className="w-2.5 h-2.5 text-black stroke-current stroke-[3.5px]" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-wider">
                    I accept and agree to the Privacy Policy
                  </span>
                </label>

                {/* Submit button with smooth lift & accent effect using ParticleButton */}
                <ParticleButton
                  type="submit"
                  className="w-full sm:w-auto bg-[#FF0099] hover:bg-white text-black font-semibold font-mono text-[10.5px] uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer text-center select-none rounded-none border-none hover:scale-[1.02] duration-150"
                  glowColor="#FF0099"
                >
                  SEND
                </ParticleButton>

              </div>

              {errors.agreed && (
                <p className="text-center font-mono text-[9px] text-[#FF0099] uppercase font-bold mt-2">
                  {errors.agreed}
                </p>
              )}

            </form>
          )}
        </motion.div>

      </section>

      {/* Spacing transition to Section 2 */}
      <div className="w-full h-2 sm:h-4" />

      {/* ==================================================
          SECTION 2 — SOCIAL CONTACT
          ================================================== */}
      <section className="relative w-full flex flex-col justify-center items-center px-8 md:px-16 pt-6 pb-44 md:pt-8 md:pb-60 z-10">
        
        <div className="container max-w-5xl mx-auto flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 
              className="font-black uppercase text-4xl sm:text-5xl md:text-7xl tracking-tight leading-none text-white select-none"
              style={{ fontFamily: '"De Fonte Plus", "Space Grotesk", "Arial Black", sans-serif' }}
            >
              Or contact<br />me here
            </h2>
          </motion.div>

          {/* Socials section layout with labels */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-zinc-900 pt-10"
          >
            {/* Left Label */}
            <div className="md:col-span-3">
              <span className="font-mono text-zinc-500 text-xs uppercase tracking-widest block mt-4 select-none">
                Socials:
              </span>
            </div>

            {/* Right stack list */}
            <div className="md:col-span-9 flex flex-col w-full">
              {SOCIALS.map((social, index) => (
                <div
                  key={index}
                  className="w-full flex items-center border-b border-zinc-900/40"
                >
                  <FlipLink label={social.name} href={social.url} className="w-full justify-start" />
                </div>
              ))}
            </div>

          </motion.div>

        </div>

      </section>


      {/* Full-page ambient lighting handles bottom glow seamlessly */}

    </div>
  );
}

export default ContactView;
