import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { FluidCursor } from "./FluidCursor";
import { AnimatedCopy } from "./AnimatedCopy";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HomeViewProps {
  onNavigate: (page: string) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  // Countdown timer calculation to Aug 29, 2026 10:00:00 UB (UTC+8)
  useEffect(() => {
    const targetDate = new Date("2026-08-29T10:00:00+08:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft((prev) => ({ ...prev, isOver: true }));
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: d,
          hours: h,
          minutes: m,
          seconds: s,
          isOver: false,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Staggered ScrollTrigger refreshes to align with page transition finishes
    const refreshTimers = [100, 300, 600, 1000, 1600].map((delay) =>
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, delay)
    );

    let ctx: gsap.Context;

    // Wait slightly for DOM flow and transition cover to sweep clear
    const initTimer = setTimeout(() => {
      if (!sectionRef.current) return;

      const headingElements = sectionRef.current.querySelectorAll(".gsap-heading-el");
      const steps = sectionRef.current.querySelectorAll(".gsap-stage-step");

      ctx = gsap.context(() => {
        // 1. Heading Elements Animation (staggered fade and slide up)
        gsap.fromTo(
          headingElements,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // 2. Timeline line scroll-bound scaled growth
        const timelineLine = sectionRef.current?.querySelector(".gsap-timeline-line");
        if (timelineLine) {
          gsap.fromTo(
            timelineLine,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: "top center",
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 65%",
                end: "bottom 85%",
                scrub: true,
              },
            }
          );
        }

        // 3. Stage Steps individual animations
        steps.forEach((step) => {
          const dot = step.querySelector(".gsap-dot");
          const title = step.querySelector(".gsap-step-title");
          const desc = step.querySelector(".gsap-step-desc");
          const stats = step.querySelector(".gsap-step-stats");
          const visual = step.querySelector(".gsap-step-visual");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });

          tl.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
          )
            .fromTo(
              [title, desc, stats],
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" },
              "-=0.3"
            )
            .fromTo(
              visual,
              { opacity: 0, y: 40, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
              "-=0.5"
            );
        });
      }, sectionRef);

      // Trigger recalculation immediately after initialization
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(initTimer);
      refreshTimers.forEach((t) => clearTimeout(t));
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div className="w-full bg-[#080808] text-white min-h-screen relative overflow-hidden">
      
      {/* 7k Symbol background border layer */}
      <div className="absolute inset-x-0 top-[40vh] pointer-events-none select-none overflow-hidden z-0 flex items-center justify-center opacity-[0.03]">
        <svg viewBox="0 0 1920 1080" className="w-full h-auto max-w-7xl min-w-[1000px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1380.28 -0.5C1705.6 -0.49995 1920.5 273.54 1920.5 540C1920.5 731.116 1825.29 852.54 1781.13 902.508L1779.07 904.833C1750.71 937.466 1707.2 932.667 1685.24 910.794C1673.8 899.396 1671.9 884.361 1673.79 870.417C1675.68 856.475 1681.35 843.544 1685.15 836.229C1769.75 673.289 1747.41 554.973 1687.28 476.246C1627.1 397.47 1529.01 358.241 1461.96 353.659L1461.95 353.658L1461.95 353.657L1462 353.16C1461.95 353.615 1461.95 353.654 1461.95 353.657H1461.94C1461.94 353.657 1461.94 353.657 1461.93 353.656C1461.93 353.655 1461.91 353.654 1461.89 353.652C1461.86 353.649 1461.8 353.644 1461.73 353.638C1461.58 353.624 1461.37 353.605 1461.09 353.581C1460.52 353.533 1459.69 353.465 1458.62 353.388C1456.47 353.233 1453.38 353.041 1449.58 352.89C1441.99 352.586 1431.58 352.444 1420.32 353.091C1409.05 353.737 1396.95 355.171 1385.97 358.016C1374.97 360.862 1365.15 365.109 1358.39 371.348C1345.38 383.373 1340.32 400.225 1341.06 418.074C1341.8 435.928 1348.34 454.744 1358.48 470.611C1372.25 492.176 1395.22 516.28 1421.97 542.858C1448.71 569.422 1479.21 598.442 1507.99 629.803C1565.52 692.511 1616.26 764.706 1616.26 845.64C1616.26 926.524 1582.74 985.253 1536.46 1023.75C1490.2 1062.24 1431.22 1080.5 1380.28 1080.5C1197.32 1080.5 1053.27 996.516 960 878.474C866.73 996.516 722.679 1080.5 539.725 1080.5C488.783 1080.5 429.796 1062.24 383.536 1023.75C337.262 985.253 303.736 926.524 303.736 845.64C303.736 764.706 354.481 692.511 412.015 629.803C440.787 598.442 471.291 569.422 498.029 542.858C524.783 516.28 547.753 492.176 561.523 470.611C571.656 454.744 578.199 435.928 578.94 418.074C579.681 400.225 574.625 383.373 561.605 371.348C554.851 365.109 545.025 360.862 534.033 358.016C523.049 355.171 510.947 353.737 499.684 353.091C488.422 352.444 478.011 352.586 470.416 352.89C466.619 353.041 463.526 353.233 461.384 353.388C460.312 353.465 459.478 353.533 458.913 353.581C458.631 353.605 458.415 353.624 458.27 353.638C458.198 353.644 458.143 353.649 458.106 353.652C458.088 353.654 458.074 353.655 458.065 353.656C458.061 353.657 458.058 353.657 458.056 353.657H458.054C458.053 353.654 458.048 353.615 458.004 353.16L458.053 353.657L458.046 353.658L458.038 353.659C390.995 358.241 292.901 397.47 232.725 476.246C172.587 554.973 150.251 673.289 234.852 836.229C238.649 843.544 244.322 856.475 246.209 870.417C248.096 884.361 246.204 899.396 234.761 910.794C212.8 932.667 169.289 937.466 140.932 904.833L138.868 902.508C94.7116 852.54 -0.50005 731.116 -0.500061 540C-0.500034 273.54 214.401 -0.49995 539.725 -0.5C715.652 -0.49999 863.578 82.7553 960 203.76C1056.42 82.7553 1204.35 -0.49999 1380.28 -0.5ZM539.725 0.5C215.023 0.50005 0.499966 274.02 0.499939 540C0.49995 730.759 95.5282 851.954 139.618 901.846L141.679 904.167L141.683 904.172C169.626 936.333 212.465 931.59 234.055 910.086C245.191 898.994 247.084 884.329 245.219 870.551C243.353 856.77 237.736 843.956 233.964 836.69C149.218 673.471 171.516 554.727 231.931 475.639C292.307 396.601 390.684 357.26 457.97 352.661H457.971C457.98 352.66 457.994 352.659 458.013 352.657C458.05 352.654 458.106 352.648 458.179 352.642C458.325 352.628 458.543 352.608 458.828 352.584C459.398 352.535 460.236 352.468 461.312 352.391C463.464 352.236 466.568 352.043 470.377 351.891C477.994 351.586 488.439 351.443 499.741 352.092C511.042 352.741 523.214 354.181 534.284 357.048C545.346 359.912 555.355 364.212 562.284 370.612C575.573 382.887 580.689 400.056 579.939 418.116C579.19 436.172 572.579 455.157 562.366 471.149C548.527 492.822 525.478 516.999 498.734 543.567C471.976 570.151 441.503 599.142 412.751 630.479C355.236 693.167 304.736 765.114 304.736 845.64C304.736 926.215 338.121 984.667 384.176 1022.98C430.244 1061.31 489.001 1079.5 539.725 1079.5C722.425 1079.5 866.267 995.587 959.363 877.667C923.098 831.595 894.551 780.368 874.43 726.938C847.402 760.514 813.933 793.814 772.824 826.054C728.358 860.926 661.219 895.396 595.547 911.553C529.908 927.701 465.541 925.596 426.825 887.034C407.446 867.733 400.408 844.01 402.707 817.363C405.004 790.739 416.622 761.194 434.538 730.179C470.372 668.147 531.497 600.081 594.121 537.486C667.08 464.562 701.558 435.451 741.81 373.946C761.854 343.321 761.846 308.284 746.745 280.906C731.647 253.533 701.438 233.78 660.996 233.78C606.106 233.78 555.304 244.163 501.574 254.561C447.854 264.956 391.226 275.36 324.759 275.36C291.965 275.36 270.212 262.205 260.648 244.043C251.086 225.883 253.784 202.855 269.611 183.285C277.525 173.501 293.456 160.317 315.889 146.545C338.331 132.766 367.313 118.378 401.355 106.197C469.44 81.8358 557.79 66.2946 654.581 82.127C798.959 105.743 880.239 187.148 923.057 255.94C934.167 238.195 946.287 221.029 959.361 204.561C863.118 83.6825 715.404 0.50001 539.725 0.5ZM1380.28 0.5C1204.6 0.50001 1056.88 83.6822 960.638 204.561C973.712 221.029 985.832 238.195 996.942 255.94C1039.76 187.148 1121.04 105.743 1265.42 82.127C1362.21 66.2946 1450.56 81.8358 1518.64 106.197C1552.69 118.378 1581.67 132.766 1604.11 146.545C1626.54 160.317 1642.47 173.501 1650.39 183.285C1666.22 202.855 1668.91 225.883 1659.35 244.043C1649.79 262.205 1628.03 275.36 1595.24 275.36C1528.77 275.36 1472.15 264.956 1418.43 254.561C1454.46 925.596 1390.09 927.701 1324.45 911.553C1258.78 895.396 1191.64 860.926 1147.18 826.054C1106.07 793.814 1072.6 760.514 1045.57 726.938C1025.45 780.368 996.901 831.595 960.636 877.667C1053.73 995.588 1197.57 1079.5 1380.28 1079.5C1431 1079.5 1489.76 1061.31 1535.82 1022.98C1581.88 984.667 1615.26 926.215 1615.26 845.64C1615.26 765.114 1564.76 693.167 1507.25 630.479C1478.5 599.142 1448.02 570.151 1421.27 543.567C1394.52 516.999 1371.47 492.822 1357.63 471.149C1347.42 455.157 1340.81 436.172 1340.06 418.116C1339.31 400.056 1344.43 382.887 1357.72 370.612C1364.64 364.212 1374.65 359.912 1385.72 357.048C1396.79 354.181 1408.96 352.741 1420.26 352.092C1431.56 351.443 1442.01 351.586 1449.62 351.891C1453.43 352.043 1456.54 352.236 1458.69 352.391C1459.76 352.468 1460.6 352.535 1461.17 352.584C1461.46 352.608 1461.67 352.628 1461.82 352.642C1461.89 352.648 1461.95 352.654 1461.99 352.657C1462.01 352.659 1462.02 352.66 1462.03 352.661H1462.03C1529.32 357.26 1627.69 396.601 1688.07 475.639C1748.48 554.727 1770.78 673.471 1686.04 836.69C1682.26 843.956 1676.65 856.77 1674.78 870.551C1672.92 884.329 1674.81 898.994 1685.95 910.086C1707.54 931.59 1750.37 936.333 1778.32 904.172L1778.32 904.167L1780.38 901.846C1824.47 851.954 1919.5 730.759 1919.5 540C1919.5 274.02 1704.98 0.50005 1380.28 0.5ZM654.42 83.1133C557.828 67.3136 469.651 82.8223 401.692 107.139C367.714 119.297 338.794 133.655 316.411 147.397C294.018 161.146 278.198 174.259 270.389 183.914C254.77 203.225 252.186 225.827 261.533 243.577C270.879 261.325 292.23 274.36 324.759 274.36C391.122 274.36 447.667 263.974 501.384 253.579C555.09 243.186 605.991 232.78 660.996 232.78C701.786 232.78 732.339 252.717 747.621 280.424C762.901 308.126 762.893 343.56 742.647 374.494C702.322 436.11 667.739 465.317 594.828 538.193C532.212 600.779 471.168 668.768 435.404 730.679C417.522 761.635 405.983 791.032 403.703 817.449C401.425 843.844 408.39 867.262 427.53 886.326C465.853 924.496 529.744 926.711 595.309 910.581C660.839 894.46 727.849 860.054 772.207 825.267C813.443 792.927 846.976 759.523 874.022 725.846C851.35 665.263 839.5 601.881 839.5 540C839.5 440.706 869.329 342.126 922.467 256.882C879.835 188.188 798.734 106.719 654.42 83.1133ZM1518.31 107.139C1450.35 82.8223 1362.17 67.3136 1265.58 83.1133C1121.27 106.719 1040.16 188.188 997.532 256.882C1050.67 342.126 1080.5 440.705 1080.5 540C1080.5 601.881 1068.65 665.263 1045.98 725.846C1073.02 759.523 1106.56 792.927 1147.79 825.267C1192.15 860.054 1259.16 894.46 1324.69 910.581C1390.26 926.711 1454.15 924.496 1492.47 886.326C1511.61 867.262 1518.57 843.844 1516.3 817.449C1514.02 791.032 1502.48 761.635 1484.6 730.679C1448.83 668.768 1387.79 600.779 1325.17 538.193C1252.26 465.317 1217.68 436.11 1177.35 374.494C1157.11 343.56 1157.1 308.126 1172.38 280.424C1187.66 252.717 1218.21 232.78 1259 232.78C1314.01 232.78 1364.91 243.186 1418.62 253.579C1472.33 263.974 1528.88 274.36 1595.24 274.36C1627.77 274.36 1649.12 261.325 1658.47 243.577C1667.81 225.827 1665.23 203.225 1649.61 183.914C1641.8 174.259 1625.98 161.146 1603.59 147.397C1581.21 133.655 1552.29 119.297 1518.31 107.139ZM960 565.472C944.98 617.538 918.35 672.133 875.156 726.031C895.226 779.495 923.743 830.761 960 876.861C996.257 830.762 1024.77 779.495 1044.84 726.031C1001.65 672.133 975.02 617.538 960 565.472ZM923.052 257.829C870.176 342.818 840.5 441.053 840.5 540C840.5 601.576 852.254 664.64 874.747 724.938C918.058 670.769 944.618 615.913 959.478 563.653C934.687 476.24 942.532 396.081 959.478 338.504C955.505 325.046 951.038 312.831 946.374 302.059V302.058C940.416 288.569 932.74 273.543 923.052 257.829ZM996.947 257.829C987.259 273.543 979.584 288.569 973.626 302.058V302.059C968.962 312.831 964.494 325.046 960.52 338.504C977.467 396.081 985.312 476.24 960.52 563.653C975.381 615.913 1001.94 670.769 1045.25 724.938C1067.74 664.64 1079.5 601.577 1079.5 540C1079.5 441.053 1049.82 342.818 996.947 257.829ZM960 340.282C943.506 397.234 936.01 475.95 960 561.804C983.99 475.95 976.494 397.234 960 340.282ZM960 205.364C946.902 221.877 934.763 239.089 923.643 256.885C933.071 272.132 940.61 286.741 946.527 299.943L947.29 301.658L947.292 301.661C951.8 312.074 956.126 323.827 960 336.743C963.874 323.827 968.2 312.074 972.708 301.661L972.71 301.658L973.473 299.943C979.39 286.742 986.928 272.132 996.356 256.885C985.236 239.089 973.098 221.877 960 205.364Z" fill="#F7F7F7"/>
        </svg>
      </div>

      {/* Absolute Background Hero backdrop loaded from project storage */}
      <div className="relative w-full h-[90vh] md:h-screen flex flex-col justify-center overflow-hidden">
        <video
          id="skyline"
          className="absolute inset-0 w-full h-full object-cover z-[1] opacity-40 mix-blend-lighten"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/manus-storage/hero_video_b9490206.mp4" type="video/mp4" />
        </video>

        {/* Dynamic Scanlines & Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/80 z-[3]" />
        <FluidCursor />

        {/* Hero Central Header */}
        <div className="relative z-10 flex-grow flex flex-col justify-center items-center px-4 text-center mt-12 md:mt-0 select-none">
          <div className="inline-block px-3 py-1 bg-[#FF0099] text-black font-mono text-xs uppercase tracking-widest font-black mb-6">
            7K CLUB PRESENTS
          </div>
          
          <AnimatedCopy
            variant="diffuse"
            onScroll={false}
            delay={0.1}
            tag="h1"
            className="text-white font-black leading-[0.85] font-sans text-6xl sm:text-8xl md:text-[11rem] tracking-tighter uppercase cursor-default select-none transition-all text-center w-full block mx-auto justify-center"
          >
            BEYOND
          </AnimatedCopy>

          <AnimatedCopy
            variant="diffuse"
            onScroll={false}
            delay={0.3}
            tag="h1"
            className="text-[#FF0099] font-black leading-[0.85] font-sans text-6xl sm:text-8xl md:text-[11rem] tracking-tighter uppercase cursor-default select-none transition-all text-center w-full block mx-auto justify-center"
          >
            DISTANCE
          </AnimatedCopy>

          {/* High-tech Timing HUD Countdown Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="mt-10 backdrop-blur-md bg-black/30 border border-zinc-900/60 px-8 py-4 flex flex-col items-center max-w-xs sm:max-w-sm w-full mx-auto shadow-2xl relative overflow-hidden"
          >
            {/* Structural high-tech corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-800" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-800" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-800" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-800" />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-[#FF0099]/40" />

            <p className="text-[9px] text-[#FF0099] font-mono tracking-[0.25em] uppercase font-bold mb-3.5">
              GRID INITIATION SEQUENCE
            </p>

            <div className="flex items-center justify-center gap-4 font-mono select-none">
              <div className="text-center min-w-[45px]">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none block">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[8px] text-zinc-500 block uppercase tracking-wider mt-1.5">DAYS</span>
              </div>
              <span className="text-md text-zinc-800 font-light translate-y-[-4px]">:</span>
              
              <div className="text-center min-w-[45px]">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none block">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[8px] text-zinc-500 block uppercase tracking-wider mt-1.5">HOURS</span>
              </div>
              <span className="text-md text-zinc-800 font-light translate-y-[-4px]">:</span>

              <div className="text-center min-w-[45px]">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none block">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[8px] text-zinc-500 block uppercase tracking-wider mt-1.5">MINS</span>
              </div>
              <span className="text-md text-zinc-800 font-light translate-y-[-4px]">:</span>

              <div className="text-center min-w-[45px]">
                <span className="text-2xl sm:text-3xl font-black text-[#FF0099] tracking-tight leading-none block drop-shadow-[0_0_10px_rgba(255,0,153,0.4)]">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[8px] text-[#FF0099] font-bold block uppercase tracking-wider mt-1.5">SECS</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>



      {/* Race Mechanics / Qualification Path Section */}
      <section ref={sectionRef} className="py-24 border-t border-[#111111] bg-black px-8 md:px-12 relative overflow-hidden" id="qualification-path">
        {/* Subtle grid bg matching the app */}
        <div className="absolute inset-0 bg-[#080808]/70 opacity-30 select-none pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <main className="page relative z-10 w-full">
          <div className="text-center mb-16 w-full flex flex-col items-center justify-center">
            <span className="gsap-heading-el text-xs uppercase tracking-[0.3em] text-[#FF0099] font-mono font-bold block mb-3 text-center w-full opacity-0">GRAND PRIX MECHANICS</span>
            <h2 className="gsap-heading-el text-3xl md:text-5xl font-black uppercase tracking-tight leading-none text-white max-w-2xl mx-auto text-center w-full block opacity-0">
              THE QUALIFICATION PATH &amp; STAGE SYSTEM
            </h2>
            <p className="gsap-heading-el text-zinc-500 font-mono text-xs uppercase mt-4 tracking-widest text-center w-full block opacity-0">
              From 500 initial contenders down to a high-speed motorsport duel
            </p>
          </div>

          {/* Vertical Path Timeline - Centered */}
          <div className="relative flex flex-col items-center space-y-40 w-full">
            {/* Elegant middle timeline track (static background guide) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-zinc-900 pointer-events-none z-0" />
            
            {/* Glowing animated line tracking scroll progress down the timeline */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-[#FF0099] via-fuchsia-500 to-transparent pointer-events-none z-0 gsap-timeline-line origin-top" />
            
            {/* Step 1 */}
            <section className="stage gsap-stage-step relative group w-full text-center flex flex-col items-center z-10 font-sans">
              {/* Timeline dot centered */}
              <div className="gsap-dot relative w-8 h-8 bg-black border-2 border-zinc-700 hover:border-[#FF0099] rounded-full group-hover:border-[#FF0099] transition-all flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 opacity-0 scale-0">
                <div className="w-3 h-3 bg-zinc-600 group-hover:bg-[#FF0099] rounded-full transition-all" />
              </div>

              <div className="gsap-step-title flex flex-col sm:flex-row items-center justify-center gap-2 mb-3 opacity-0">
                <span className="font-mono text-xs text-[#FF0099] font-bold tracking-wider px-2 py-0.5 bg-[#FF0099]/15 uppercase border border-[#FF0099]/30 block max-w-max">10K COURSE</span>
                <h3 className="font-sans font-black text-2xl md:text-3xl text-white uppercase tracking-tight text-center">
                  The 10K Endurance Trial
                </h3>
              </div>
              <p className="gsap-step-desc text-zinc-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl px-4 opacity-0 text-center">
                The race begins as a classic 10,000-meter trial. Every athlete wears active RFID timing microchips that measure continuous performance down to a thousandth of a second. Endurance, pacing, and strategic reserves decide this baseline stage.
              </p>
              <div className="gsap-step-stats flex justify-center gap-6 font-mono text-[11px] text-zinc-500 border-t border-zinc-900 pt-4 pb-6 w-full max-w-lg px-4 opacity-0">
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">PITLANE CAP</span>
                  <span className="text-white font-medium">500 CONTENDERS</span>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">TIMEKEEPING PRECISION</span>
                  <span className="text-white font-medium">&plusmn; 0.001 SECONDS</span>
                </div>
              </div>

              {/* Inline SVG Visual Graphics */}
              <div className="gsap-step-visual w-full max-w-lg bg-black border border-zinc-900 p-4 relative flex items-center justify-center overflow-hidden aspect-[16/9] group-hover:border-[#FF0099]/30 transition-all shadow-md mt-4 opacity-0 scale-95">
                <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-600 uppercase">TELEMETRY // MULTI-RUNNER PACE PATHS</div>
                <svg viewBox="0 0 200 100" className="w-full h-full text-zinc-800">
                  <line x1="0" y1="20" x2="200" y2="20" stroke="#111" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="50" x2="200" y2="50" stroke="#111" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="80" x2="200" y2="80" stroke="#111" strokeWidth="0.5" strokeDasharray="2,2" />
                  <path d="M 10 90 Q 50 60 100 50 T 190 10" fill="none" stroke="#FF0099" strokeWidth="1.5" className="opacity-90 animate-pulse" />
                  <path d="M 10 90 Q 60 75 110 55 T 190 35" fill="none" stroke="#222" strokeWidth="1" />
                  <path d="M 10 90 Q 40 85 90 70 T 190 60" fill="none" stroke="#222" strokeWidth="1" />
                  <path d="M 10 90 Q 55 50 105 38 T 190 20" fill="none" stroke="white" strokeWidth="1" className="opacity-40" />
                  <circle cx="190" cy="10" r="3" fill="#FF0099" />
                  <circle cx="190" cy="20" r="2" fill="white" className="opacity-60" />
                  <text x="135" y="8" fill="#FF0099" fontFamily="monospace" fontSize="6" fontWeight="bold">FASTEST LAP</text>
                </svg>
              </div>
            </section>
 
            {/* Step 2 */}
            <section className="stage gsap-stage-step relative group w-full text-center flex flex-col items-center z-10 font-sans">
              {/* Timeline dot centered */}
              <div className="gsap-dot relative w-8 h-8 bg-black border-2 border-zinc-700 hover:border-[#FF0099] rounded-full group-hover:border-[#FF0099] transition-all flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 opacity-0 scale-0">
                <div className="w-3 h-3 bg-zinc-600 group-hover:bg-[#FF0099] rounded-full transition-all" />
              </div>
 
              <div className="gsap-step-title flex flex-col sm:flex-row items-center justify-center gap-2 mb-3 opacity-0">
                <span className="font-mono text-xs text-[#FF0099] font-bold tracking-wider px-2 py-0.5 bg-[#FF0099]/15 uppercase border border-[#FF0099]/30 block max-w-max">FINAL 3K</span>
                <h3 className="font-sans font-black text-2xl md:text-3xl text-white uppercase tracking-tight text-center">
                  The 20% Elite Bottleneck
                </h3>
              </div>
              <p className="gsap-step-desc text-zinc-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl px-4 opacity-0 text-center">
                As runners hit the finish gate of the 10K route, the timing matrix immediately closes. Only the top <strong>20% of the overall field</strong> (divided into separate Men's and Women's categories) are officially cleared to enter the pits. All other competitors are categorized as Class A finishers and receive a commemorative badge.
              </p>
              <div className="gsap-step-stats flex justify-center gap-6 font-mono text-[11px] text-zinc-500 border-t border-zinc-900 pt-4 pb-6 w-full max-w-lg px-4 opacity-0">
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">QUALIFICATION RATE</span>
                  <span className="text-[#FF0099] font-bold">TOP 20% ONLY</span>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">REMAINING SEATS</span>
                  <span className="text-white font-medium">COHORT BRACKET (MAX ~100)</span>
                </div>
              </div>
 
              {/* Inline SVG Visual Graphics */}
              <div className="gsap-step-visual w-full max-w-lg bg-black border border-zinc-900 p-4 relative flex items-center justify-center overflow-hidden aspect-[16/9] group-hover:border-[#FF0099]/30 transition-all shadow-md mt-4 opacity-0 scale-95">
                <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-650 uppercase">BOTTLENECK COMPRESSION CHAMBER</div>
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <path d="M 10 10 L 90 40 L 110 40 L 190 10 M 10 90 L 90 60 L 110 60 L 190 90" fill="none" stroke="#222" strokeWidth="1.5" />
                  <line x1="95" y1="40" x2="95" y2="60" stroke="#FF0099" strokeWidth="1" strokeDasharray="1,2" />
                  <line x1="105" y1="40" x2="105" y2="60" stroke="#FF0099" strokeWidth="1.5" />
                  <circle cx="20" cy="20" r="1.5" fill="#555" />
                  <circle cx="30" cy="50" r="1.5" fill="#555" />
                  <circle cx="25" cy="75" r="1.5" fill="#555" />
                  <circle cx="50" cy="30" r="1.5" fill="#555" />
                  <circle cx="60" cy="55" r="1.5" fill="#555" />
                  <circle cx="55" cy="80" r="1.5" fill="#555" />
                  <circle cx="100" cy="50" r="2" fill="#FF0099" className="animate-ping" />
                  <circle cx="125" cy="48" r="1.8" fill="#FF0099" />
                  <circle cx="150" cy="52" r="1.8" fill="#FF0099" />
                  <circle cx="175" cy="50" r="1.8" fill="#FF0099" />
                  <circle cx="120" cy="18" r="1.5" fill="#333" />
                  <circle cx="130" cy="82" r="1.5" fill="#333" />
                  <text x="130" y="42" fill="#FF0099" fontFamily="monospace" fontSize="6" fontWeight="bold">TOP 20% PASS</text>
                  <text x="110" y="75" fill="#333" fontFamily="monospace" fontSize="6" fontWeight="medium">80% ELIMINATED</text>
                </svg>
              </div>
            </section>

            {/* Step 3 */}
            <section className="stage gsap-stage-step relative group w-full text-center flex flex-col items-center z-10 font-sans">
              {/* Timeline dot centered */}
              <div className="gsap-dot relative w-8 h-8 bg-black border-2 border-zinc-700 hover:border-[#FF0099] rounded-full group-hover:border-[#FF0099] transition-all flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 opacity-0 scale-0">
                <div className="w-3 h-3 bg-zinc-600 group-hover:bg-[#FF0099] rounded-full transition-all" />
              </div>

              <div className="gsap-step-title flex flex-col sm:flex-row items-center justify-center gap-2 mb-3 opacity-0">
                <span className="font-mono text-xs text-[#FF0099] font-bold tracking-wider px-2 py-0.5 bg-[#FF0099]/15 uppercase border border-[#FF0099]/30 block max-w-max">STAGE 03</span>
                <h3 className="font-sans font-black text-2xl md:text-3xl text-white uppercase tracking-tight text-center">
                  F1 Staggered Grid Start
                </h3>
              </div>
              <p className="gsap-step-desc text-zinc-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl px-4 opacity-0 text-center">
                Before the shootout, qualified finalists are assembled on physical race slots. Your exact 10K completion time maps to your <strong>staggered headstart bracket</strong>. The overall leader claims Pole Position and starts first. Subsequent runners release strictly in intervals matching their performance deficit, giving the fastest runners a tactical time &amp; distance headstart.
              </p>
              <div className="gsap-step-stats flex justify-center gap-6 font-mono text-[11px] text-zinc-500 border-t border-zinc-900 pt-4 pb-6 w-full max-w-lg px-4 opacity-0">
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">POLE ADVANTAGE</span>
                  <span className="text-white font-medium">UP TO 120s OFFSET</span>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">GRID SYSTEM</span>
                  <span className="text-[#FF0099] font-bold">STAGGERED CHRONO SEGMENTS</span>
                </div>
              </div>

              {/* Inline SVG Visual Graphics */}
              <div className="gsap-step-visual w-full max-w-lg bg-black border border-zinc-900 p-4 relative flex items-center justify-center overflow-hidden aspect-[16/9] group-hover:border-[#FF0099]/30 transition-all shadow-md mt-4 opacity-0 scale-95">
                <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-650 uppercase">GRID COMPOSITIONAL MATRIX</div>
                <svg viewBox="0 0 200 100" className="w-full h-full text-zinc-800">
                  <line x1="20" y1="10" x2="20" y2="90" stroke="#1c1c1c" strokeWidth="0.8" />
                  <line x1="60" y1="10" x2="60" y2="90" stroke="#1c1c1c" strokeWidth="0.8" />
                  <line x1="100" y1="10" x2="100" y2="90" stroke="#1c1c1c" strokeWidth="0.8" />
                  <line x1="140" y1="10" x2="140" y2="90" stroke="#1c1c1c" strokeWidth="0.8" />
                  <line x1="180" y1="10" x2="180" y2="90" stroke="#1c1c1c" strokeWidth="0.8" />
                  <rect x="25" y="20" width="12" height="6" fill="#111" stroke="#222" strokeWidth="0.5" />
                  <rect x="65" y="32" width="12" height="6" fill="#111" stroke="#222" strokeWidth="0.5" />
                  <rect x="105" y="44" width="12" height="6" fill="#111" stroke="#222" strokeWidth="0.5" />
                  <rect x="145" y="56" width="12" height="6" fill="#111" stroke="#222" strokeWidth="0.5" />
                  <g transform="translate(25, 23)">
                    <circle cx="6" cy="3" r="2.5" fill="#FF0099" />
                    <line x1="12" y1="3" x2="-2" y2="3" stroke="#FF0099" strokeWidth="0.8" />
                  </g>
                  <g transform="translate(65, 35)">
                    <circle cx="6" cy="3" r="2.5" fill="white" className="opacity-70" />
                    <line x1="12" y1="3" x2="-2" y2="3" stroke="white" strokeWidth="0.8" className="opacity-50" />
                  </g>
                  <g transform="translate(105, 47)">
                    <circle cx="6" cy="3" r="2" fill="#555" />
                  </g>
                  <g transform="translate(145, 59)">
                    <circle cx="6" cy="3" r="2" fill="#555" />
                  </g>
                  <text x="25" y="15" fill="#FF0099" fontFamily="monospace" fontSize="6" fontWeight="bold">GAP: 0.0s (POLE)</text>
                  <text x="65" y="27" fill="white" fontFamily="monospace" fontSize="6" className="opacity-80">GAP: +14.5s</text>
                  <text x="105" y="39" fill="#555" fontFamily="monospace" fontSize="6">GAP: +32.1s</text>
                </svg>
              </div>
            </section>

            {/* Step 4 */}
            <section className="stage gsap-stage-step relative group w-full text-center flex flex-col items-center z-10 font-sans">
              {/* Timeline dot centered */}
              <div className="gsap-dot relative w-8 h-8 bg-black border-2 border-zinc-700 hover:border-[#FF0099] rounded-full group-hover:border-[#FF0099] transition-all flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 opacity-0 scale-0">
                <div className="w-3 h-3 bg-zinc-600 group-hover:bg-[#FF0099] rounded-full transition-all" />
              </div>

              <div className="gsap-step-title flex flex-col sm:flex-row items-center justify-center gap-2 mb-3 opacity-0">
                <span className="font-mono text-xs text-[#FF0099] font-bold tracking-wider px-2 py-0.5 bg-[#FF0099]/15 uppercase border border-[#FF0099]/30 block max-w-max">STAGE 04</span>
                <h3 className="font-sans font-black text-2xl md:text-3xl text-white uppercase tracking-tight text-center">
                  The 3K Final Sprint
                </h3>
              </div>
              <p className="gsap-step-desc text-zinc-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl px-4 opacity-0 text-center">
                The race simplifies into raw combat. Over a flat 3,000-meter course, qualified athletes push themselves to the point of complete neural blackout. Because of the staggered starts, the format is beautifully direct: <strong>the first athlete across the finish line is declared the absolute winner.</strong> No time adjustments, no recalculation. A true gladiator outcome.
              </p>
              <div className="gsap-step-stats flex justify-center gap-6 font-mono text-[11px] text-zinc-500 border-t border-zinc-900 pt-4 pb-6 w-full max-w-lg px-4 opacity-0">
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">COURSE DISTANCE</span>
                  <span className="text-white font-medium">3,000 METERS</span>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div className="text-center flex-1">
                  <span className="text-zinc-650 block uppercase text-[10px] tracking-wider mb-0.5">CHAMPIONSHIP RULE</span>
                  <span className="text-[#FF0099] font-bold">PHYSICAL FIRST-CROSS WINS</span>
                </div>
              </div>

              {/* Inline SVG Visual Graphics */}
              <div className="gsap-step-visual w-full max-w-lg bg-black border border-zinc-900 p-4 relative flex items-center justify-center overflow-hidden aspect-[16/9] group-hover:border-[#FF0099]/30 transition-all shadow-md mt-4 opacity-0 scale-95">
                <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-650 uppercase">CHAMPIONSHIP FINISH LINE</div>
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <g transform="translate(170, 10)">
                    <rect x="0" y="0" width="8" height="8" fill="white" />
                    <rect x="8" y="0" width="8" height="8" fill="black" />
                    <rect x="0" y="8" width="8" height="8" fill="black" />
                    <rect x="8" y="8" width="8" height="8" fill="white" />
                    <rect x="0" y="16" width="8" height="8" fill="white" />
                    <rect x="8" y="16" width="8" height="8" fill="black" />
                    <rect x="0" y="24" width="8" height="8" fill="black" />
                    <rect x="8" y="24" width="8" height="8" fill="white" />
                    <rect x="0" y="32" width="8" height="8" fill="white" />
                    <rect x="8" y="32" width="8" height="8" fill="black" />
                    <rect x="0" y="40" width="8" height="8" fill="black" />
                    <rect x="8" y="40" width="8" height="8" fill="white" />
                    <rect x="0" y="48" width="8" height="8" fill="white" />
                    <rect x="8" y="48" width="8" height="8" fill="black" />
                    <rect x="0" y="56" width="8" height="8" fill="black" />
                    <rect x="8" y="56" width="8" height="8" fill="white" />
                    <rect x="0" y="64" width="8" height="8" fill="white" />
                    <rect x="8" y="64" width="8" height="8" fill="black" />
                    <rect x="0" y="72" width="8" height="8" fill="black" />
                    <rect x="8" y="72" width="8" height="8" fill="white" />
                  </g>
                  <g transform="translate(20, 0)">
                    <path d="M 120 50 L 140 50" stroke="#FF0099" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="140" cy="50" r="3" fill="#FF0099" />
                    <text x="110" y="42" fill="#FF0099" fontFamily="monospace" fontSize="6" fontWeight="bold">1s TILL LINE</text>
                    <path d="M 70 65 L 90 65" stroke="white" strokeWidth="1" strokeLinecap="round" className="opacity-40" />
                    <circle cx="90" cy="65" r="2.5" fill="white" className="opacity-70" />
                  </g>
                  <line x1="10" y1="10" x2="10" y2="90" stroke="#222" strokeWidth="1" strokeDasharray="3,3" />
                </svg>
              </div>
            </section>

          </div>
        </main>
      </section>

      {/* Under-menu Safe Navigation Spacer */}
      <div className="h-16 w-full bg-[#080808] border-t border-zinc-950 pointer-events-none select-none" />
    </div>
  );
}

export default HomeView;
