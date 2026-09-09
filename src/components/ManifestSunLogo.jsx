import React, { useState } from 'react';

/**
 * Manifest Animated Sun Logo (Web)
 * - Layer 1: Breathing Solar Aura Ring (3.8s pulse)
 * - Layer 2: Slow Orbiting Solar Rays (12 geometric beams, 24s smooth rotation)
 * - Layer 3: Luminous Solar Core (Radial gold gradient)
 * - Layer 4: Interactive Click Bloom
 */
export default function ManifestSunLogo({
  size = 84,
  interactive = true,
  onClick,
  className = ''
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e) => {
    if (!interactive) return;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 300);
    if (onClick) onClick(e);
  };

  const haloSize = size * 1.35;
  const svgSize = size;
  const center = svgSize / 2;
  const coreRadius = size * 0.24;
  const rayInnerRadius = size * 0.32;
  const rayOuterRadius = size * 0.46;

  const numRays = 12;
  const rays = Array.from({ length: numRays }).map((_, i) => {
    const angle = (i * 360) / numRays;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 3 === 0;
    const isMinor = i % 2 !== 0;

    const currentOuter = isMajor
      ? rayOuterRadius
      : isMinor
      ? rayOuterRadius * 0.82
      : rayOuterRadius * 0.92;

    const strokeWidth = isMajor ? size * 0.045 : isMinor ? size * 0.025 : size * 0.035;

    const x1 = center + rayInnerRadius * Math.cos(rad);
    const y1 = center + rayInnerRadius * Math.sin(rad);
    const x2 = center + currentOuter * Math.cos(rad);
    const y2 = center + currentOuter * Math.sin(rad);

    return (
      <path
        key={i}
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke="url(#webRayGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div
      onClick={handleClick}
      style={{ width: haloSize, height: haloSize }}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Layer 1: Breathing Solar Aura Ring */}
      <div
        style={{
          width: haloSize,
          height: haloSize,
          borderRadius: haloSize / 2
        }}
        className="absolute bg-amber-500/15 border border-amber-600/25 animate-pulse transition-all duration-700 pointer-events-none"
      />

      {/* Layer 2: Inner Shimmer Corona */}
      <div
        style={{
          width: size * 1.12,
          height: size * 1.12,
          borderRadius: (size * 1.12) / 2
        }}
        className={`absolute bg-amber-200/30 border border-amber-500/25 transition-transform duration-300 pointer-events-none ${
          isPressed ? 'scale-90' : 'scale-100'
        }`}
      />

      {/* Layer 3: Rotating Solar Rays & Core SVG */}
      <div
        style={{ width: svgSize, height: svgSize }}
        className={`relative flex items-center justify-center transition-transform duration-300 ${
          isPressed ? 'scale-90' : 'scale-100'
        }`}
      >
        {/* Continuous 24s slow rotation */}
        <div
          style={{ width: svgSize, height: svgSize, animation: 'spin 24s linear infinite' }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <defs>
              <linearGradient id="webRayGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <g>{rays}</g>
          </svg>
        </div>

        {/* Luminous Solar Core */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <defs>
              <radialGradient id="webCoreGradient" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE68A" />
                <stop offset="75%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </radialGradient>
            </defs>
            <circle cx={center} cy={center} r={coreRadius} fill="url(#webCoreGradient)" />
            <circle
              cx={center}
              cy={center}
              r={coreRadius - 1.5}
              stroke="#FFFBEB"
              strokeWidth={size * 0.025}
              fill="transparent"
              strokeOpacity={0.65}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
