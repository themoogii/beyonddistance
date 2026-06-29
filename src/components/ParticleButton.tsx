import * as React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MousePointerClick } from "lucide-react";

interface ParticleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  onSuccess?: () => void;
  successDuration?: number;
  className?: string;
  glowColor?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function SuccessParticles({
  buttonRef,
  glowColor = "#FF0099"
}: {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  glowColor?: string;
}) {
  const rect = buttonRef.current?.getBoundingClientRect();
  if (!rect) return null;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return (
    <AnimatePresence>
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-50"
          style={{ 
            left: centerX, 
            top: centerY, 
            backgroundColor: glowColor,
            boxShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}` 
          }}
          initial={{
            scale: 0,
            x: 0,
            y: 0,
            opacity: 1
          }}
          animate={{
            scale: [0, 1.8, 0],
            x: [0, (i % 2 ? 1 : -1) * (Math.random() * 80 + 30)],
            y: [0, -Math.random() * 80 - 30],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.05,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  );
}

export function ParticleButton({
  children,
  onClick,
  onSuccess,
  successDuration = 1000,
  className = "",
  glowColor = "#FF0099",
  type = "button",
  ...props
}: ParticleButtonProps) {
  const [showParticles, setShowParticles] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowParticles(true);

    if (onClick) {
      onClick(e);
    }
    if (onSuccess) {
      onSuccess();
    }

    setTimeout(() => {
      setShowParticles(false);
    }, successDuration);
  };

  return (
    <>
      {showParticles && <SuccessParticles buttonRef={buttonRef} glowColor={glowColor} />}
      <button
        ref={buttonRef}
        type={type}
        onClick={handleClick}
        className={`
          relative select-none outline-none active:scale-95 transition-all duration-150 cursor-pointer
          ${showParticles ? "scale-95" : ""} 
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    </>
  );
}
