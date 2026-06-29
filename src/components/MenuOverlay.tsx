import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { playHoverSound, playCloseSound, playOpenSound } from "../utils/sfx";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function MenuOverlay({ isOpen, onClose, onNavigate }: MenuOverlayProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [flickeringIndex, setFlickeringIndex] = useState<number | null>(null);
  const intervalRef = useRef<any>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Play audio on opening / closing
  useEffect(() => {
    if (isOpen) {
      playOpenSound();
    } else {
      // Don't play close sound on initial mount, only on active close
      playCloseSound();
    }
  }, [isOpen]);

  // Three.js Shader Setup for premium animated red grain matrix
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Append canvas
    const canvasContainer = mountRef.current;
    canvasContainer.appendChild(renderer.domElement);

    // Plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Custom shader material
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 vUv;

      float rand(vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        
        // Red noise matrix simulation
        float grain = rand(vUv + fract(u_time * 0.08));
        
        // Create scanning vignette lines
        float scanline = sin(vUv.y * u_resolution.y * 1.5 + u_time * 5.0) * 0.15;
        
        // Base red light level pulsing
        float pulse = sin(u_time * 1.5) * 0.12 + 0.12;

        vec3 color = vec3(0.0);
        // Distribute grain noise primarily in the red channel
        color.r = (0.04 + pulse) * (0.8 + grain * 0.4) + scanline * 0.05;
        color.g = 0.002 * grain;
        color.b = 0.004 * grain;

        // Dark heavy vignette
        float distFromCenter = distance(vUv, vec2(0.5));
        color *= smoothstep(0.95, 0.2, distFromCenter);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      uniforms.u_resolution.value.set(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (canvasContainer && renderer.domElement.parentNode === canvasContainer) {
        canvasContainer.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  const menuItems = [
    { label: "ITINERARY", icon: "calendar-sharp", page: "/itinerary" },
    { label: "7K CLUB", icon: "ribbon-sharp", page: "/lab" },
    { label: "SHOP", icon: "cart-sharp", page: "https://www.the7k.club/shop" },
    { label: "REGISTER", icon: "create-sharp", page: "/project" },
    { label: "CONTACT", icon: "paper-plane-sharp", page: "/contact" },
  ];

  const handleSegmentHover = (idx: number) => {
    playHoverSound();
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setFlickeringIndex(idx);
    
    // Simulate flickerHover (rapid background color toggle, 10 steps, 300ms)
    let stepsRun = 0;
    intervalRef.current = setInterval(() => {
      stepsRun++;
      if (stepsRun >= 10) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 30);
  };

  const handleSegmentLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setFlickeringIndex(null);
  };

  const handleMenuClick = (page: string) => {
    if (page.startsWith("http")) {
      window.open(page, "_blank", "noopener,noreferrer");
    } else {
      onNavigate(page);
    }
    onClose();
  };

  return (
    <div className={`menu-overlay ${isOpen ? "open" : ""}`} id="menu-overlay">
      {/* Background canvas for 3D red grain matrix shader */}
      <div ref={mountRef} className="menu-canvas" />

      {/* Menu HTML Layout Overlay */}
      <div className="menu-content h-full flex flex-col justify-between">
        {/* Top bar */}
        <div className="menu-header-row">
          <button
            onClick={onClose}
            className="type-mono flex items-center justify-center gap-2 cursor-pointer border border-[#FF0099]/30 px-4 py-2 hover:bg-[#FF0099] hover:text-[#000] rounded-sm transition-all text-[#FF0099]"
            id="menu-close-btn"
          >
            <ion-icon name="close-sharp" style={{ fontSize: "1.2rem", verticalAlign: "middle" }}></ion-icon> CLOSE
          </button>
          
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/the7k.club"
              target="_blank"
              rel="noopener noreferrer"
              className="type-mono hover:underline"
            >
              Instagram
            </a>
            <span className="text-[#FF0099]/50">/</span>
            <a
              href="https://www.tiktok.com/@the7k.club"
              target="_blank"
              rel="noopener noreferrer"
              className="type-mono hover:underline"
            >
              TikTok
            </a>
          </div>
        </div>

        {/* Joystick segmented circle */}
        <div className="joystick-container">
          <div className="joystick" id="menu-joystick">
            {menuItems.map((item, idx) => {
              const isFlickering = flickeringIndex === idx;
              return (
                <div
                  key={idx}
                  className={`joystick-segment seg-${idx} ${
                    isFlickering ? "flicker-active" : ""
                  }`}
                  onMouseEnter={() => handleSegmentHover(idx)}
                  onMouseLeave={handleSegmentLeave}
                  onClick={() => handleMenuClick(item.page)}
                >
                  <div className="seg-inner">
                    <ion-icon name={item.icon}></ion-icon>
                    <span className="seg-title">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="menu-footer-row">
          <span className="type-mono flex items-center gap-2 text-[#FF0099]" id="lab-access-label">
            <ion-icon name="terminal-sharp"></ion-icon> LAB ACCESS: SECURE
          </span>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              handleMenuClick("/contact");
            }}
            className="type-mono text-[#FF0099] flex items-center gap-1 hover:underline"
            id="get-in-touch-label"
          >
            GET IN TOUCH <ion-icon name="arrow-forward-sharp"></ion-icon>
          </a>
        </div>
      </div>
    </div>
  );
}
