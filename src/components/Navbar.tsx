import React, { useState, useEffect } from "react";

interface NavbarProps {
  onLogoClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  activePage?: string;
}

export function Navbar({ onLogoClick, activePage }: NavbarProps) {
  const [timeStr, setTimeStr] = useState("");
  const [colonVisible, setColonVisible] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Ulaanbaatar Time
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Ulaanbaatar",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      };
      try {
        const ulnTime = new Intl.DateTimeFormat("en-US", options).format(now);
        setTimeStr(ulnTime);
      } catch (e) {
        // Fallback
        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        setTimeStr(`${h}:${m}`);
      }
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    const colonInterval = setInterval(() => {
      setColonVisible((v) => !v);
    }, 500);

    return () => {
      clearInterval(timeInterval);
      clearInterval(colonInterval);
    };
  }, []);

  const [hours, minutes] = timeStr.split(":") || ["18", "25"];

  const isHome = activePage === "/";

  return (
    <nav 
      id="shared-navbar"
      className="bg-transparent"
      style={{
        transition: "background-color 0.3s ease",
      }}
    >
      <div className="container py-4 md:py-5">
        {/* Left Column: Clock / Race Date */}
        <div className="nav-clock animate-fade-in">
          <p className="type-mono font-bold tracking-wider text-white text-xs sm:text-sm flex items-center flex-wrap gap-x-2">
            <span className="text-[#FF0099]">AUG 29, 2026</span>
            <span className="text-zinc-600 font-normal">|</span>
            <span className="font-semibold text-white">
              {hours?.padStart(2, "0") || "18"}
              <span
                style={{
                  opacity: colonVisible ? 1 : 0,
                  transition: "opacity 0.08s ease",
                  display: "inline-block",
                  padding: "0 1.5px"
                }}
              >
                :
              </span>
              {minutes?.padStart(2, "0") || "25"}{" "}
              <span className="text-zinc-400 font-normal text-[10px]">UB</span>
            </span>
          </p>
        </div>

        {/* Center Column: Interactive Logo */}
        <div className="nav-logo">
          <a href="/" onClick={onLogoClick} id="nav-logo-link" aria-label="Beyond Distance Home" className="transition-transform hover:scale-105 active:scale-95 duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 1000 1000"
              className="w-11 h-11"
              id="header-logo-svg"
              style={{ filter: "drop-shadow(0 0 6px rgba(0, 119, 68, 0.25))" }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M520.319 436C539.157 406.5 544.679 366 520.319 343.5C494.98 320.095 424.078 327 424.078 327C299.699 335.5 60.242 472.5 217.044 774.5C224.053 788 237.952 822.176 217.044 843C196.881 863.082 156.903 867.5 130.838 837.5C90.892 792.667 0 679.6 0 500C0 253.5 198.807 0 499.745 0C791.483 0 1000 247.5 1000 500C1000 738 810.543 1000 499.745 1000C405.611 1000 281.7 932.5 281.7 783C281.7 633.5 469.189 516.07 520.319 436ZM606.019 76.4999C426.96 47.211 279.117 134 250 170C220.884 206 240.218 254.5 300.703 254.5C423.695 254.5 510.279 216 612.034 216C687.249 216 724.554 289.5 687.249 346.5C649.944 403.5 617.972 430.5 550.44 498C434.476 613.908 324.202 749.953 395.535 821C466.868 892.047 633.048 829 715.292 764.5C942.261 586.5 917.466 373.667 876.697 279.5C846.956 212.167 771.084 103.5 606.019 76.4999Z"
                fill="#007744"
              />
            </svg>
          </a>
        </div>

        {/* Right Column: Location marker */}
        <div className="nav-location text-white">
          <p className="type-mono">
            <ion-icon name="triangle-sharp" style={{ verticalAlign: "middle", marginRight: "3px" }}></ion-icon> ULAANBAATAR, MN
          </p>
        </div>
      </div>
    </nav>
  );
}
