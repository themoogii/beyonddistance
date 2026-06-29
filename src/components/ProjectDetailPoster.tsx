import React from "react";

interface ProjectDetailPosterProps {
  index: number;
}

export function ProjectDetailPoster({ index }: ProjectDetailPosterProps) {
  // Let's draw high-concept blueprint engineering drawings
  switch (index) {
    case 0: // MATRIX OFFSET
      return (
        <svg viewBox="0 0 840 520" className="w-full h-full object-cover bg-black p-10 select-none">
          {/* Tech Grid base */}
          <g opacity="0.12" stroke="#FF0099" strokeWidth="0.5">
            <line x1="100" y1="0" x2="100" y2="520" />
            <line x1="220" y1="0" x2="220" y2="520" />
            <line x1="340" y1="0" x2="340" y2="520" />
            <line x1="460" y1="0" x2="460" y2="520" />
            <line x1="580" y1="0" x2="580" y2="520" />
            <line x1="700" y1="0" x2="700" y2="520" />
            
            <line x1="0" y1="100" x2="840" y2="100" />
            <line x1="0" y1="220" x2="840" y2="220" />
            <line x1="0" y1="340" x2="840" y2="340" />
            <line x1="0" y1="460" x2="840" y2="460" />
          </g>

          {/* Construction vectors */}
          <g opacity="0.75" stroke="#FF0099" strokeWidth="1">
            <line x1="420" y1="0" x2="420" y2="520" strokeDasharray="5,5" />
            <line x1="0" y1="260" x2="840" y2="260" strokeDasharray="5,5" />
            <circle cx="420" cy="260" r="160" fill="none" strokeWidth="1.5" />
            <circle cx="420" cy="260" r="90" fill="none" strokeWidth="1" strokeDasharray="2,4" />
          </g>

          {/* Offset geometry */}
          <g transform="translate(420, 260)" fill="none" stroke="#FF0099" strokeWidth="3">
            <rect x="-110" y="-80" width="100" height="160" strokeWidth="2.5" />
            {/* The offset shift upwards */}
            <rect x="20" y="-120" width="100" height="160" strokeWidth="2.5" />
            
            {/* Dimension brackets and arrows */}
            <path d="M -110,-100 L 20,-100" strokeWidth="0.8" strokeDasharray="2,2" />
            <polygon points="-110,-100 -100,-103 -100,-97" fill="#FF0099" stroke="none" />
            <polygon points="20,-100 10,-103 10,-97" fill="#FF0099" stroke="none" />
            
            {/* Center pointer */}
            <line x1="-120" y1="0" x2="130" y2="0" strokeWidth="1" opacity="0.5" />
            <line x1="0" y1="-140" x2="0" y2="140" strokeWidth="1" opacity="0.5" />
          </g>

          {/* HUD Tech metadata label */}
          <text x="50" y="55" fill="#FF0099" fontFamily="var(--type-3)" fontSize="10" opacity="0.5">FIG. 01 // LOAD DISTRIBUTION COMPREHENDING RECTIFIED DISPLACEMENT</text>
          <text x="730" y="55" fill="#FF0099" fontFamily="var(--type-3)" fontSize="10" fontWeight="bold">REF: MER-A1.0</text>
        </svg>
      );

    case 1: // GRID OFFSET CORES
      return (
        <svg viewBox="0 0 840 520" className="w-full h-full object-cover bg-black p-10 select-none">
          {/* Waveforms / sound profile representation */}
          <g transform="translate(100, 110)" stroke="#FF0099" strokeWidth="0.8" fill="none">
            {Array.from({ length: 48 }).map((_, idx) => {
              const h = Math.abs(Math.sin(idx * 0.25) * 140) + 15;
              const isOffset = idx > 23;
              const yOffset = isOffset ? -40 : 10;
              return (
                <rect
                  key={idx}
                  x={idx * 13}
                  y={yOffset + (140 - h) / 2}
                  width="5"
                  height={h}
                  opacity={isOffset ? 0.95 : 0.6}
                  fill={isOffset ? "#FF0099" : "none"}
                />
              );
            })}
          </g>

          {/* Callout dimension */}
          <line x1="100" y1="360" x2="724" y2="360" stroke="#FF0099" strokeWidth="1.2" />
          <line x1="100" y1="350" x2="100" y2="370" stroke="#FF0099" strokeWidth="1.2" />
          <line x1="412" y1="350" x2="412" y2="370" stroke="#FF0099" strokeWidth="1.2" />
          <line x1="724" y1="350" x2="724" y2="370" stroke="#FF0099" strokeWidth="1.2" />

          {/* Typo nodes */}
          <text x="100" y="390" fill="#FF0099" fontFamily="var(--type-3)" fontSize="11" fontWeight="bold">PH MECHANICAL AXIS (A)</text>
          <text x="412" y="390" fill="#FF0099" fontFamily="var(--type-3)" fontSize="11" fontWeight="bold">SHIFT OFFSET VECTOR (0.34 RAD)</text>
          <text x="610" y="390" fill="#FF0099" fontFamily="var(--type-3)" fontSize="11" opacity="0.6">MODULATED PHASE (B)</text>
        </svg>
      );

    case 2: // ISOMETRIC VOLUME SHIFT
      return (
        <svg viewBox="0 0 840 520" className="w-full h-full object-cover bg-black p-10 select-none">
          {/* Tech data panel */}
          <g opacity="0.15">
            <rect x="0" y="0" width="840" height="520" stroke="#FF0099" strokeWidth="1" />
            <line x1="0" y1="260" x2="840" y2="260" stroke="#FF0099" strokeWidth="1" />
          </g>

          {/* Isometric volumetric drawings */}
          {/* Base drawing */}
          <g transform="translate(260, 240)" fill="none" stroke="#FF0099" strokeWidth="1.5">
            {/* Cube 1 (Lower block) */}
            <path d="M 0 0 L 80 -40 L 160 0 L 80 40 Z" />
            <path d="M 0 0 L 0 90 L 80 130 L 80 40" />
            <path d="M 160 0 L 160 90 L 80 130" />
            <text x="35" y="-15" fill="#FF0099" fontFamily="var(--type-3)" fontSize="9" opacity="0.6">BASE BLOCK</text>
          </g>

          {/* Displaced drawing */}
          <g transform="translate(520, 180)" fill="none" stroke="#FF0099" strokeWidth="1.8">
            {/* Cube 2 (Displaced upwards + forward) */}
            <path d="M 0 0 L 80 -40 L 160 0 L 80 40 Z" fill="#FF0099" fillOpacity="0.15" />
            <path d="M 0 0 L 0 90 L 80 130 L 80 40" />
            <path d="M 160 0 L 160 90 L 80 130" />
            
            {/* Movement tracking vector dashed lines */}
            <path d="M 0 90 L -60 150" strokeDasharray="3,3" opacity="0.6" />
            <path d="M 80 130 L 20 190" strokeDasharray="3,3" opacity="0.6" />
            
            <text x="35" y="-15" fill="#FF0099" fontFamily="var(--type-3)" fontSize="9" fontWeight="bold">PHASE DISPLACED</text>
          </g>

          {/* Labels & scales */}
          <text x="50" y="470" fill="#FF0099" fontFamily="var(--type-3)" fontSize="10" opacity="0.5">ISOMETRIC DISPLACEMENT METHOD // DISRUPTING PARALLEL PROFILE ALIGNMENT</text>
        </svg>
      );

    default:
      return null;
  }
}
