import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCopyProps {
  children: string;
  variant: "diffuse" | "slide" | "flicker";
  type?: "words" | "lines";
  onScroll?: boolean;
  delay?: number; // seconds
  className?: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

export function AnimatedCopy({
  children,
  variant,
  type = "words",
  onScroll = false,
  delay = 0,
  className = "",
  tag = "p",
}: AnimatedCopyProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    // Split text into words
    const text = el.textContent || "";
    const words = text.trim().split(/\s+/);

    // Rebuild DOM structure with spans
    el.innerHTML = "";
    
    const fragment = document.createDocumentFragment();
    words.forEach((word, index) => {
      const wrapNode = document.createElement("span");
      wrapNode.className = "word-wrap overflow-hidden inline-block mr-2 vertical-align-bottom";
      
      const wordNode = document.createElement("span");
      wordNode.className = "word inline-block";
      wordNode.textContent = word;
      
      // Set initial styles based on variant
      if (variant === "diffuse") {
        wordNode.style.filter = "blur(75px)";
        wordNode.style.opacity = "0";
      } else if (variant === "slide") {
        wordNode.style.transform = "translateY(112%)";
      } else if (variant === "flicker") {
        wordNode.style.opacity = "0";
      }

      wrapNode.appendChild(wordNode);
      fragment.appendChild(wrapNode);
      
      // Optional trailing space
      if (index < words.length - 1) {
        fragment.appendChild(document.createTextNode(" "));
      }
    });
    
    el.appendChild(fragment);

    // Target the newly created .word spans
    const wordSpans = el.querySelectorAll(".word");
    if (!wordSpans || wordSpans.length === 0) return;

    // Define the GSAP animation sequence
    const playAnim = () => {
      if (variant === "diffuse") {
        // Blur-melting transition using SVG filter matrix
        gsap.to(wordSpans, {
          filter: "blur(0px)",
          opacity: 1,
          duration: 1.4,
          stagger: 0.06,
          ease: "power2.out",
          delay,
        });
      } else if (variant === "slide") {
        // Translation slide upwards inside masks
        gsap.to(wordSpans, {
          y: "0%",
          duration: 0.9,
          stagger: 0.04,
          ease: "power3.out",
          delay,
        });
      } else if (variant === "flicker") {
        // CRT flickering sequence per word
        wordSpans.forEach((wordEl, wordIdx) => {
          const wDelay = delay + wordIdx * 0.06;
          const tl = gsap.timeline({ delay: wDelay });
          tl.to(wordEl, { opacity: 0.2, duration: 0.04 })
            .to(wordEl, { opacity: 0.8, duration: 0.03 })
            .to(wordEl, { opacity: 0.1, duration: 0.04 })
            .to(wordEl, { opacity: 0.9, duration: 0.03 })
            .to(wordEl, { opacity: 0.3, duration: 0.04 })
            .to(wordEl, { opacity: 1.0, duration: 0.1 });
        });
      }
    };

    let triggerInstance: any = null;

    if (onScroll) {
      // Trigger via GSAP ScrollTrigger
      triggerInstance = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => {
          playAnim();
        },
        // Only trigger once to match production aesthetics
        once: true,
      });
    } else {
      // Trigger immediately on mount (or routing transition complete)
      playAnim();
    }

    return () => {
      if (triggerInstance) {
        triggerInstance.kill();
      }
    };
  }, [children, variant, type, onScroll, delay]);

  const Tag = tag;

  return (
    <Tag
      ref={containerRef as any}
      className={`${className}`}
      data-animate-variant={variant}
      style={{ verticalAlign: "bottom" }}
    >
      {children}
    </Tag>
  );
}
