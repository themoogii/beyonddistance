import React from "react";

interface WorkPosterProps {
  index: number;
  isHovered?: boolean;
}

export function WorkPoster({ index, isHovered = false }: WorkPosterProps) {
  // Let's create gorgeous high-end procedural vector graphics
  switch (index) {
    case 0: // AF-01 AFTERIMAGE
      return (
        <svg
          viewBox="0 0 400 500"
          className="w-full h-full object-cover select-none transition-transform duration-700 ease-out"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1.0)" }}
        >
          {/* Poster Background */}
          <rect width="400" height="500" fill="#000" />
          
          {/* Tech Grid */}
          <g opacity="0.15">
            <line x1="50" y1="0" x2="50" y2="500" stroke="#FF0099" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="150" y1="0" x2="150" y2="500" stroke="#FF0099" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="250" y1="0" x2="250" y2="500" stroke="#FF0099" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="350" y1="0" x2="350" y2="500" stroke="#FF0099" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="#FF0099" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="0" y1="250" x2="400" y2="250" stroke="#FF0099" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="0" y1="400" x2="400" y2="400" stroke="#FF0099" strokeWidth="1" strokeDasharray="3,3" />
          </g>

          {/* Concentric strobe rings */}
          <g transform="translate(200, 230)">
            <circle
              cx="0"
              cy="0"
              r="140"
              fill="none"
              stroke="#FF0099"
              strokeWidth="1.5"
              strokeDasharray="1,5"
              opacity="0.3"
              className="origin-center transition-transform duration-[15s] linear infinite"
              style={{
                transform: `rotate(${isHovered ? 180 : 0}deg)`,
                transition: "transform 8s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            />
            <circle
              cx="0"
              cy="0"
              r="110"
              fill="none"
              stroke="#FF0099"
              strokeWidth="2"
              strokeDasharray="10,8"
              opacity="0.6"
              style={{
                transform: `rotate(${isHovered ? -90 : 0}deg)`,
                transition: "transform 4s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            />
            <circle
              cx="0"
              cy="0"
              r="80"
              fill="none"
              stroke="#FF0099"
              strokeWidth="1"
              strokeDasharray="4,20"
              opacity="0.8"
              style={{
                transform: `rotate(${isHovered ? 45 : 0}deg)`,
                transition: "transform 3s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            />
            <circle
              cx="0"
              cy="0"
              r="40"
              fill="#FF0099"
              opacity={isHovered ? 0.95 : 0.8}
              style={{
                transform: `scale(${isHovered ? 1.2 : 1.0})`,
                transition: "transform 0.5s ease",
              }}
            />
            <circle cx="0" cy="0" r="10" fill="#000" />
          </g>

          {/* Graphic text overlays */}
          <text x="35" y="60" fill="#FF0099" fontFamily='var(--type-3)' fontSize="10" opacity="0.6">PROJECT CODE: AF-26</text>
          <text x="35" y="450" fill="#FF0099" fontFamily='var(--type-3)' fontSize="12" fontWeight="bold">AFTERIMAGE</text>
          <text x="300" y="450" fill="#FF0099" fontFamily='var(--type-3)' fontSize="12" opacity="0.6">RM_00</text>
          <line x1="35" y1="465" x2="365" y2="465" stroke="#FF0099" strokeWidth="1" opacity="0.4" />
        </svg>
      );

    case 1: // SO-02 SILENT OFFSET
      return (
        <svg
          viewBox="0 0 400 500"
          className="w-full h-full object-cover select-none transition-transform duration-700 ease-out"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1.0)" }}
        >
          {/* Poster Background - Bright Pink */}
          <rect width="400" height="500" fill="#FF0099" />

          {/* Grid lines in black */}
          <g opacity="0.2">
            <line x1="0" y1="125" x2="400" y2="125" stroke="#000" strokeWidth="1" />
            <line x1="0" y1="250" x2="400" y2="250" stroke="#000" strokeWidth="1" />
            <line x1="0" y1="375" x2="400" y2="375" stroke="#000" strokeWidth="1" />
            <line x1="100" y1="0" x2="100" y2="500" stroke="#000" strokeWidth="1" />
            <line x1="200" y1="0" x2="200" y2="500" stroke="#000" strokeWidth="1" />
            <line x1="300" y1="0" x2="300" y2="500" stroke="#000" strokeWidth="1" />
          </g>

          {/* Intersecting blocks displaying the 'Offset' */}
          <g transform="translate(200, 250)">
            <rect
              x="-90"
              y="-120"
              width="60"
              height="240"
              fill="#000"
              style={{
                transform: `translateY(${isHovered ? -35 : 0}px)`,
                transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            />
            <rect
              x="30"
              y="-120"
              width="60"
              height="240"
              fill="#000"
              style={{
                transform: `translateY(${isHovered ? 35 : 0}px)`,
                transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            />
            {/* Center crosshair */}
            <circle cx="0" cy="0" r="4" fill="#000" />
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#000" strokeWidth="1" />
            <line x1="0" y1="-30" x2="0" y2="30" stroke="#000" strokeWidth="1" />
          </g>

          {/* Typographic details */}
          <text x="35" y="60" fill="#000" fontFamily='var(--type-3)' fontSize="10" fontWeight="bold">STUDIO ARCHIVE _ 02</text>
          <text x="35" y="450" fill="#000" fontFamily='var(--type-3)' fontSize="12" fontWeight="bold">SILENT OFFSET</text>
          <text x="310" y="450" fill="#000" fontFamily='var(--type-3)' fontSize="12" fontWeight="bold">S_O_26</text>
          <line x1="35" y1="465" x2="365" y2="465" stroke="#000" strokeWidth="1.5" />
        </svg>
      );

    case 2: // RM-03 RESIDUAL MOTION
      return (
        <svg
          viewBox="0 0 400 500"
          className="w-full h-full object-cover select-none transition-transform duration-700 ease-out"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1.0)" }}
        >
          {/* Poster Background */}
          <rect width="400" height="500" fill="#000" />

          {/* Sweeping kinetic curves simulating residual delay */}
          <g opacity="0.8">
            <path
              d="M 50 400 C 150 400, 100 100, 350 100"
              fill="none"
              stroke="#FF0099"
              strokeWidth="2"
              opacity="0.3"
              style={{
                d: isHovered ? "M 50 400 C 120 350, 130 150, 350 100" : "M 50 400 C 150 400, 100 100, 350 100",
                transition: "d 0.8s cubic-bezier(1, 0, 0, 1)",
              }}
            />
            <path
              d="M 50 400 C 170 380, 130 130, 350 100"
              fill="none"
              stroke="#FF0099"
              strokeWidth="4"
              opacity="0.5"
            />
            <path
              d="M 50 400 C 190 360, 160 160, 350 100"
              fill="none"
              stroke="#FF0099"
              strokeWidth="6"
              opacity="0.7"
            />
            <path
              d="M 50 400 C 210 340, 190 190, 350 100"
              fill="none"
              stroke="#FF0099"
              strokeWidth="8"
              opacity="1.0"
              style={{
                transform: isHovered ? "translateX(10px)" : "translateX(0px)",
                transition: "transform 0.5s ease",
              }}
            />
          </g>

          {/* Tiny vector direction markers */}
          <g transform="translate(180, 270)" fill="#FF0099">
            <polygon points="-5,-5 5,0 -5,5" transform="rotate(35)" opacity="0.7" />
            <polygon points="-5,-5 5,0 -5,5" transform="translate(30, -30) rotate(35)" opacity="0.9" />
            <polygon points="-5,-5 5,0 -5,5" transform="translate(-30, 30) rotate(35)" opacity="0.5" />
          </g>

          {/* Typographic elements */}
          <text x="35" y="60" fill="#FF0099" fontFamily='var(--type-3)' fontSize="10" opacity="0.6">KINETIC DELAY STUDIES</text>
          <text x="35" y="450" fill="#FF0099" fontFamily='var(--type-3)' fontSize="12" fontWeight="bold">RESIDUAL MOTION</text>
          <text x="315" y="450" fill="#FF0099" fontFamily='var(--type-3)' fontSize="12" opacity="0.6">RM_03</text>
          <line x1="35" y1="465" x2="365" y2="465" stroke="#FF0099" strokeWidth="1" opacity="0.4" />
        </svg>
      );

    case 3: // NS-04 NEGATIVE SPACE
      return (
        <svg
          viewBox="0 0 400 500"
          className="w-full h-full object-cover select-none transition-transform duration-700 ease-out"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1.0)" }}
        >
          {/* Poster Background */}
          <rect width="400" height="500" fill="#FF0099" />

          {/* Solid deep void block representing negative space */}
          <rect
            x="40"
            y="40"
            width="320"
            height="420"
            fill="#000"
            style={{
              clipPath: isHovered
                ? "polygon(0 0, 100% 0, 100% 60%, 75% 75%, 25% 45%, 0 60%)"
                : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              transition: "clip-path 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          />

          {/* Inner geometry appearing during negative space cutout */}
          <g opacity={isHovered ? 1 : 0} style={{ transition: "opacity 0.6s ease 0.1s" }} transform="translate(200, 380)">
            <circle cx="0" cy="0" r="30" fill="none" stroke="#FF0099" strokeWidth="1.5" />
            <line x1="-50" y1="0" x2="50" y2="0" stroke="#FF0099" strokeWidth="1" />
            <text x="-30" y="45" fill="#FF0099" fontFamily='var(--type-3)' fontSize="8">GAP SECURED</text>
          </g>

          {/* Minimalist framing text */}
          <text x="55" y="75" fill="#FF0099" fontFamily='var(--type-3)' fontSize="10">SUBTRACTIVE SYSTEMS</text>
          <text x="55" y="420" fill="#FF0099" fontFamily='var(--type-3)' fontSize="12" fontWeight="bold">NEGATIVE SPACE</text>
          <text x="300" y="420" fill="#FF0099" fontFamily='var(--type-3)' fontSize="12">V_04</text>
        </svg>
      );

    case 4: // SL-05 SIGNAL LOSS
      return (
        <svg
          viewBox="0 0 400 500"
          className="w-full h-full object-cover select-none transition-transform duration-700 ease-out"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1.0)" }}
        >
          {/* Poster Background */}
          <rect width="400" height="500" fill="#000" />

          {/* Distorted Horizontal sound bars / scanning rows */}
          <g transform="translate(50, 130)" stroke="#FF0099" strokeWidth="2" opacity="0.9">
            <line
              x1="0"
              y1="20"
              x2={isHovered ? "240" : "300"}
              y2="20"
              style={{ transition: "all 0.4s ease" }}
            />
            <line
              x1={isHovered ? "50" : "0"}
              y1="40"
              x2="300"
              y2="40"
              style={{ transition: "all 0.5s ease" }}
              strokeDasharray="20,10,5,5"
            />
            <line
              x1="0"
              y1="60"
              x2={isHovered ? "280" : "220"}
              y2="60"
              style={{ transition: "all 0.3s ease" }}
              strokeDasharray="50,5"
            />
            <line
              x1={isHovered ? "100" : "40"}
              y1="80"
              x2="260"
              y2="80"
              style={{ transition: "all 0.6s ease" }}
            />
            <line
              x1="0"
              y1="100"
              x2="300"
              y2="100"
              strokeDasharray="1,2"
              strokeWidth="4"
            />
            <line
              x1="0"
              y1="120"
              x2={isHovered ? "210" : "300"}
              y2="120"
              style={{ transition: "all 0.4s ease" }}
            />
            <line
              x1="20"
              y1="140"
              x2="280"
              y2="140"
              strokeDasharray="15,15"
            />
            <line
              x1="0"
              y1="160"
              x2="300"
              y2="160"
              strokeWidth="1"
              opacity="0.3"
            />
            <line
              x1={isHovered ? "10" : "60"}
              y1="180"
              x2="300"
              y2="180"
              strokeDasharray="40,20"
            />
          </g>

          {/* Random horizontal digital slice glitch blocks */}
          {isHovered && (
            <g fill="#FF0099" opacity="0.8">
              <rect x="70" y="160" width="130" height="15" />
              <rect x="230" y="270" width="70" height="8" />
              <rect x="40" y="290" width="90" height="6" />
            </g>
          )}

          {/* Typographic elements */}
          <text x="35" y="60" fill="#FF0099" fontFamily='var(--type-3)' fontSize="10" opacity="0.6">ANODE READ FEED</text>
          <text x="35" y="450" fill="#FF0099" fontFamily='var(--type-3)' fontSize="12" fontWeight="bold">SIGNAL LOSS</text>
          <text x="315" y="450" fill="#FF0099" fontFamily='var(--type-3)' fontSize="12" opacity="0.6">S_L_05</text>
          <line x1="35" y1="465" x2="365" y2="465" stroke="#FF0099" strokeWidth="1" opacity="0.4" />
        </svg>
      );

    default:
      return null;
  }
}

export default WorkPoster;
