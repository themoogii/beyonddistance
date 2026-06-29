import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function FluidCursor() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const velocityRef = useRef(0);
  const prevMouseRef = useRef({ x: 0.5, y: 0.5 });
  const lastMouseMoveRef = useRef(Date.now());
  const targetHoverRef = useRef(0.0);
  const hoverRef = useRef(0.0);
  const activityRef = useRef(0.0);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const container = mountRef.current;
    container.appendChild(renderer.domElement);

    // Dynamic Full Screen Plane Setup
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      u_time: { value: 0.0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_velocity: { value: 0.0 },
      u_hover: { value: 0.0 },
      u_activity: { value: 0.0 },
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
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;
      uniform float u_velocity;
      uniform float u_hover;
      uniform float u_activity;
      varying vec2 vUv;

      // Noise generator for organic fluid flow
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      void main() {
        // Correct aspect ratio
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
        vec2 uv = vUv * aspect;
        vec2 m = u_mouse * aspect;

        float dist = distance(uv, m);

        // Fluid distortion waves based on speed and time
        float ripple = sin(dist * 28.0 - u_time * 8.0) * exp(-dist * (6.0 - u_velocity * 4.0));
        
        // Turbulence noise overlay
        float turb = noise(vUv * 8.0 + u_time * 0.5) * 0.15;
        
        // Ripple intensity scales with cursor speed
        float speedIntensity = u_velocity * 0.45;
        float effect = ripple * (0.12 + speedIntensity) + turb * (0.05 + speedIntensity);

        // Map effect and turbulence strictly to shades of pink (#FF0099 fuchsia/pink)
        float pinkIntensity = abs(sin(effect * 4.0 + u_time * 0.5)) * 0.8 + 0.2;
        
        // On button hover, shift to a slightly brighter/more electric magenta-pink
        vec3 baseColor = vec3(1.0, 0.0, 0.6); // #FF0099 fuchsia-pink
        vec3 hoverColor = vec3(1.0, 0.2, 0.75); // Hot electric pink with a white-ish sheen
        vec3 col = mix(baseColor, hoverColor, u_hover) * pinkIntensity;

        // Apply drop-off away from pointer with a smaller base radius
        float radius = 0.16 + speedIntensity * 0.22;
        
        // Base gradient soft fill
        float baseGlow = smoothstep(radius, 0.0, dist);
        
        // Specialized button hover style transformation:
        // Core pinpoint dot and sharp orbital target tracking ring
        float coreDot = smoothstep(0.012, 0.0, dist) * u_hover * 1.6;
        float hoverRing = smoothstep(0.016, 0.0, abs(dist - radius * 1.15)) * u_hover * 2.2;
        
        // Smoothly blend the standard soft fill to the ring/core dot during hover
        float finalGlow = baseGlow * (1.0 - u_hover * 0.85) + hoverRing + coreDot;
        
        // Scale completely by mouse movement activity to fade out when stationary
        col *= finalGlow * u_activity;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Lerp mouse coordinates for butter-smooth lagging effect
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.1;

      // Measure velocity
      const dx = mouseRef.current.x - prevMouseRef.current.x;
      const dy = mouseRef.current.y - prevMouseRef.current.y;
      const vel = Math.sqrt(dx * dx + dy * dy);
      
      // Decay velocity slowly
      velocityRef.current += (vel - velocityRef.current) * 0.08;
      
      prevMouseRef.current = { ...mouseRef.current };

      const now = Date.now();
      const timeSinceMove = now - lastMouseMoveRef.current;
      
      let targetActivity = 0.0;
      if (targetHoverRef.current > 0.5) {
        // Keep it fully active/visible when hovering over elements
        targetActivity = 1.0;
      } else if (timeSinceMove < 1500) {
        targetActivity = 1.0;
      } else if (timeSinceMove < 3000) {
        // Soft cinematic decay
        targetActivity = 1.0 - ((timeSinceMove - 1500) / 1500.0) * 0.6;
      } else {
        // Beautiful ambient baseline visibility glow
        targetActivity = 0.4;
      }

      // Smoothly lerp activity and hover factors
      activityRef.current += (targetActivity - activityRef.current) * 0.15;
      hoverRef.current += (targetHoverRef.current - hoverRef.current) * 0.15;

      // Update uniforms
      uniforms.u_time.value = time;
      uniforms.u_mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      uniforms.u_velocity.value = Math.min(velocityRef.current * 100.0, 1.0);
      uniforms.u_hover.value = hoverRef.current;
      uniforms.u_activity.value = activityRef.current;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse events tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      
      // Calculate coordinates precisely relative to canvas bounding box
      const x = (e.clientX - rect.left) / (rect.width || 1);
      const y = 1.0 - ((e.clientY - rect.top) / (rect.height || 1)); // Flip Y to match WebGL coordinates
      
      targetMouseRef.current = { x, y };
      lastMouseMoveRef.current = Date.now();

      // Check if hovering interactive element (button, a, etc.)
      const target = e.target as HTMLElement;
      const isInteractive = !!(target && target.closest("button, a, [role='button'], input, textarea, select, [data-interactive], .hover-interactive"));
      targetHoverRef.current = isInteractive ? 1.0 : 0.0;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      uniforms.u_resolution.value.set(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      id="fluid-hero"
      className="absolute inset-0 w-full h-full mix-blend-exclusion pointer-events-none z-10"
    />
  );
}
export default FluidCursor;
