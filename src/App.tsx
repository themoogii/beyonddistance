import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// Shared and view-specific child components
import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { MenuOverlay } from "./components/MenuOverlay";
// View components mapping to the five pages
import { HomeView } from "./components/HomeView";
import { WorkView } from "./components/WorkView";
import { LabView } from "./components/LabView";
import { ProjectView } from "./components/ProjectView";
import { ContactView } from "./components/ContactView";
import { ItineraryView } from "./components/ItineraryView";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState("/"); // "/" | "/itinerary" | "/work" | "/lab" | "/project" | "/contact"
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1. Initial preloader seen validator
  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem("preloaderSeen");
    if (hasSeenPreloader === "true") {
      setIsLoading(false);
    }
  }, []);

  // 2. Initialize Lenis Smooth Inertia Scroll globally
  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard easeOutExpo
      smoothWheel: true,
    });

    // Notify ScrollTrigger on every smooth-scroll tick
    lenis.on("scroll", ScrollTrigger.update);

    const rafLoop = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(rafLoop);
    };

    requestAnimationFrame(rafLoop);

    return () => {
      lenis.destroy();
    };
  }, [isLoading]);

  // 3. Keep GSAP ScrollTrigger synchronized on SPA view transitions
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150); // Allow DOM layout/flow to stabilize
      return () => clearTimeout(timer);
    }
  }, [activePage, isLoading]);

  // 4. Custom high-performance scroll listener to fade text and pictures as they approach the header zone to eliminate overlapping clutter
  useEffect(() => {
    if (isLoading) return;

    let isTransitioning = true;

    // Direct, absolute reset function for all targeted elements in main container
    const forceResetAll = () => {
      const mainEl = document.querySelector("main");
      if (mainEl) {
        const elements = mainEl.querySelectorAll(
          "h1, h2, h3, h4, h5, p, img, button, a, li, figcaption"
        );
        elements.forEach((el: any) => {
          el.style.opacity = "";
          el.style.pointerEvents = "";
        });
      }
    };

    // Force style reset immediately when this view effect mounts
    forceResetAll();

    // Run additional staggered resets to survive any GSAP transitional grid wipes,
    // layout reflows, or Lenis inertia settling ticks
    const resetTimer1 = setTimeout(forceResetAll, 50);
    const resetTimer2 = setTimeout(forceResetAll, 150);
    const resetTimer3 = setTimeout(forceResetAll, 300);
    const resetTimer4 = setTimeout(forceResetAll, 500);
    const resetTimer5 = setTimeout(forceResetAll, 800);

    // End transition cooldown flag after 500ms
    const transitionTimer = setTimeout(() => {
      isTransitioning = false;
      handleScrollFade(); // Sync once transition cools down
    }, 500);

    const handleScrollFade = () => {
      // If we are actively transitioning views, do NOT apply fade-outs to avoid stale frame captures
      if (isTransitioning) {
        forceResetAll();
        return;
      }

      const scrollY = window.scrollY || window.pageYOffset;
      const mainEl = document.querySelector("main");
      if (!mainEl) return;

      const elements = mainEl.querySelectorAll(
        "h1, h2, h3, h4, h5, p, img, button, a, li, figcaption"
      );

      elements.forEach((el: any) => {
        // Skip elements contained inside navbar, menu, or footer
        if (
          el.closest("#shared-navbar") ||
          el.closest("#menu-trigger-pill") ||
          el.closest(".menu-overlay") ||
          el.closest("footer")
        ) {
          return;
        }

        // Skip GSAP animated elements on homepage to prevent style/opacity conflicts
        if (
          el.classList.contains("gsap-stage-step") || 
          el.closest(".gsap-stage-step") ||
          el.classList.contains("gsap-heading-el") ||
          el.closest(".gsap-heading-el") ||
          el.classList.contains("gsap-timeline-line") ||
          el.closest(".gsap-timeline-line")
        ) {
          return;
        }

        const style = window.getComputedStyle(el);
        // Do not fade fixed or absolute decorative/layout components (like FluidCursor canvas or background gradient nodes)
        if (style.position === "fixed" || style.position === "absolute" || style.position === "sticky") {
          return;
        }

        // If at the very top of the page, guarantee full visibility of all content
        if (scrollY <= 10) {
          el.style.opacity = "";
          el.style.pointerEvents = "";
          return;
        }

        const rect = el.getBoundingClientRect();
        const fadeStart = 160; // Begins losing opacity when entering this top pixel zone
        const fadeEnd = 90;    // Becomes fully transparent/reduced opacity near the very top

        if (rect.top < fadeStart) {
          const ratio = (rect.top - fadeEnd) / (fadeStart - fadeEnd);
          const opacity = Math.max(0, Math.min(1, ratio));
          el.style.opacity = opacity.toString();
          
          if (opacity === 0) {
            el.style.pointerEvents = "none";
          } else {
            el.style.pointerEvents = "";
          }
        } else {
          // Reset inline styles when scrolled below threshold
          el.style.opacity = "";
          el.style.pointerEvents = "";
        }
      });
    };

    window.addEventListener("scroll", handleScrollFade, { passive: true });
    window.addEventListener("resize", handleScrollFade);

    // Initial run to calculate page start state
    handleScrollFade();

    // Re-check periodically when dynamic layout blocks might shift
    const interval = setInterval(handleScrollFade, 300);

    return () => {
      window.removeEventListener("scroll", handleScrollFade);
      window.removeEventListener("resize", handleScrollFade);
      clearInterval(interval);
      
      clearTimeout(resetTimer1);
      clearTimeout(resetTimer2);
      clearTimeout(resetTimer3);
      clearTimeout(resetTimer4);
      clearTimeout(resetTimer5);
      clearTimeout(transitionTimer);

      // CRITICAL: Clean up and completely reset any modified elements' styles
      forceResetAll();
    };
  }, [isLoading, activePage]);

  // 3. Coordinate GSAP 12-block shuffled slide transitions
  const handlePageNavigation = (targetPage: string) => {
    if (targetPage === activePage) return;

    const blocks = gsap.utils.toArray(".transition-block") as HTMLElement[];
    if (blocks.length === 0) {
      // Fallback transition if grid elements are not loaded
      setActivePage(targetPage);
      window.scrollTo(0, 0);
      return;
    }

    // Shuffle blocks procedurally for unpredictable grid wiping
    const shuffledBlocks = gsap.utils.shuffle([...blocks]);

    const tl = gsap.timeline();

    // Dynamically show the transition grid at the start of wipe
    tl.set(".transition-grid", { display: "grid", visibility: "visible" });

    // Stagger blocks reveal - opacity 0 -> 1
    tl.to(shuffledBlocks, {
      opacity: 1,
      duration: 0.35,
      stagger: {
        amount: 0.4,
        grid: [3, 4],
        from: "center",
      },
      ease: "power2.inOut",
    });

    // Swap the active View state
    tl.add(() => {
      setActivePage(targetPage);
      window.scrollTo(0, 0);
    });

    // Stagger blocks hide - opacity 1 -> 0
    tl.to(shuffledBlocks, {
      opacity: 0,
      duration: 0.35,
      stagger: {
        amount: 0.4,
        grid: [3, 4],
        from: "random",
      },
      ease: "power2.inOut",
      delay: 0.1,
    });

    // Completely hide and disable transition grid once finished to guarantee responsiveness
    tl.set(".transition-grid", { display: "none", visibility: "hidden" });
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handlePageNavigation("/");
  };

  // Render the current view state
  const renderActiveView = () => {
    switch (activePage) {
      case "/":
        return <HomeView onNavigate={handlePageNavigation} />;
      case "/itinerary":
        return <ItineraryView onNavigate={handlePageNavigation} />;
      case "/work":
        return <WorkView onNavigate={handlePageNavigation} />;
      case "/lab":
        return <LabView onNavigate={handlePageNavigation} />;
      case "/project":
        return <ProjectView onNavigate={handlePageNavigation} />;
      case "/contact":
        return <ContactView onNavigate={handlePageNavigation} />;
      default:
        return <HomeView onNavigate={handlePageNavigation} />;
    }
  };

  // Hide header details if preloader is active to avoid structural clipping
  if (isLoading) {
    return <Preloader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden flex flex-col justify-between" id="applet-viewport-frame">
      
      {/* 0. Artistic Flair scanlines & vignette overlays */}
      <div className="scanlines animate-pulse opacity-85" />
      <div className="vignette" />

      {/* 1. Global Page Shifting Transition grid (12 blocks) */}
      <div className="transition-grid pointer-events-none" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="transition-block bg-black border border-[#FF0099]/5" />
        ))}
      </div>

      {/* 2. Unified Navigation Bar */}
      <Navbar onLogoClick={handleLogoClick} activePage={activePage} />

      {/* 3. Immersive Menu Overlay */}
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handlePageNavigation}
      />

      {/* 4. Active Portfolio Screen */}
      <main className="flex-grow w-full relative z-10">
        {renderActiveView()}
      </main>

      {/* 6. Centered Pill Menu Toggle Button */}
      <div
        className={`menu-toggle ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
        role="button"
        tabIndex={0}
        aria-label="Toggle Navigation Menu"
        id="menu-trigger-pill"
      >
        <div className="hamburger">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
