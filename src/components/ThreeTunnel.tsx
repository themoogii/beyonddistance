import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ThreeTunnel() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Create scene & dark perspective camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.0055); // Depth fog for organic falloff

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const container = mountRef.current;
    container.appendChild(renderer.domElement);

    // Create concentric Z-axis layers (technical vectors & frames instead of heavy textures)
    const layersGroup = new THREE.Group();
    scene.add(layersGroup);

    const layerCount = 10;
    const layerSpacing = 35; // Z distance between segments
    const meshesList: { group: THREE.Group; zPos: number }[] = [];

    for (let i = 0; i < layerCount; i++) {
      const zPos = -(i * layerSpacing) - 5;
      const singleLayerGroup = new THREE.Group();
      singleLayerGroup.position.set(0, 0, zPos);

      // 1. Draw solid wireframe ring
      const ringGeom = new THREE.RingGeometry(8 + i * 0.5, 9 + i * 0.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xFF0099,
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      singleLayerGroup.add(ringMesh);

      // 2. Draw outer grid crosshair elements
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xFF0099,
        transparent: true,
        opacity: 0.45,
      });

      // Horizontal reference axis
      const horizPoints = [new THREE.Vector3(-15, 0, 0), new THREE.Vector3(15, 0, 0)];
      const horizGeom = new THREE.BufferGeometry().setFromPoints(horizPoints);
      const horizLine = new THREE.Line(horizGeom, lineMat);
      singleLayerGroup.add(horizLine);

      // Vertical reference axis
      const vertPoints = [new THREE.Vector3(0, -15, 0), new THREE.Vector3(0, 15, 0)];
      const vertGeom = new THREE.BufferGeometry().setFromPoints(vertPoints);
      const vertLine = new THREE.Line(vertGeom, lineMat);
      singleLayerGroup.add(vertLine);

      // 3. Central HUD elements with random rotations
      const hudGeom = new THREE.CircleGeometry(2.5, 16);
      const hudMat = new THREE.MeshBasicMaterial({
        color: 0xFF0099,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const hudMesh = new THREE.Mesh(hudGeom, hudMat);
      hudMesh.rotation.z = Math.random() * Math.PI;
      singleLayerGroup.add(hudMesh);

      layersGroup.add(singleLayerGroup);
      meshesList.push({ group: singleLayerGroup, zPos });
    }

    // Interactive ambient vectors (star field particles)
    const particleCount = 280;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;     // X
      positions[i + 1] = (Math.random() - 0.5) * 80; // Y
      positions[i + 2] = -Math.random() * 350;       // Z depth
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFF0099,
      size: 0.75,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Slow idle rotations of layers for extra parallax realism
      layersGroup.children.forEach((layerGroup, index) => {
        // Alternating rotational vectors
        const dir = index % 2 === 0 ? 1 : -1;
        layerGroup.rotation.z = elapsed * 0.04 * dir;
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Scroll Trigger tying scroll position to camera.position.z (0 to -350)
    const scrollAnimation = ScrollTrigger.create({
      trigger: ".tunnel-section",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.0,
      onUpdate: (self) => {
        // Deep camera advance on Z axis based on user scrub progress
        const targetZ = -(self.progress * layerSpacing * (layerCount - 1));
        
        // Tween camera position for ultra smooth transition damping
        gsap.to(camera.position, {
          z: targetZ + 10,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });

        // Fade overlay opacity or fade layers out as camera passes them on Z axis
        meshesList.forEach((meshObj) => {
          const currentCamZ = camera.position.z;
          const distToCam = meshObj.zPos - currentCamZ;

          meshObj.group.children.forEach((meshChild) => {
            const mat = (meshChild as THREE.Mesh).material as THREE.Material;
            if (mat && "opacity" in mat) {
              // Fade out meshes once camera passes past them
              if (distToCam > -5) {
                // Dimming fade out
                (mat as any).opacity = Math.max(0, 1.0 - (distToCam + 5) * 0.15);
              } else {
                // Fully visible in fog range ahead
                (mat as any).opacity = 1.0;
              }
            }
          });
        });
      },
    });

    // Resize event
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      scrollAnimation.kill();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      id="tunnel-3d-canvas"
      className="absolute inset-0 w-full h-[100vh]"
    />
  );
}
export default ThreeTunnel;
