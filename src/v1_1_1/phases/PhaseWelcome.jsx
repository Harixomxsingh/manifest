import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Sun, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { firePartyPopper } from '../../utils/confettiHelper';

export default function PhaseWelcome({ onAdvance }) {
  const { briefing, weatherData, todayArticle } = useApp();

  const [liveDateStr, setLiveDateStr] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      const monthName = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
      const dayNum = now.getDate();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase();
      setLiveDateStr(`${dayName}, ${monthName} ${dayNum} • ${timeStr}`);
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const isAllClear = briefing?.inboxTriage?.status === 'ALL_CLEAR';
  const unit = weatherData?.unit || '°F';
  const highTemp = weatherData?.highTemp ?? (unit.includes('C') ? 22 : 72);
  const tempDisplay = `${highTemp}${unit.startsWith('°') ? unit : `°${unit}`}`;

  return (
    <div className="w-full max-w-[42rem] mx-auto flex flex-col items-center py-2 sm:py-8 animate-fadeIn relative">
      {/* Radiant Sunlight Flare / Diffusion into the entire page */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] h-[260px] sm:h-[350px] bg-gradient-to-b from-amber-400/25 via-amber-300/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Prominent Large Date & Time Pill Capsule (First Attention Anchor) */}
      <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-7 py-2 sm:py-3 rounded-full bg-white/95 border border-[#ECE8E0] shadow-[0_4px_20px_rgba(180,83,9,0.07)] backdrop-blur-md transition-transform hover:scale-[1.01]">
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#E0A96D] shadow-[0_0_8px_rgba(224,169,109,0.8)] shrink-0" />
        <span className="text-xs sm:text-base font-mono font-bold tracking-wider sm:tracking-widest uppercase text-[#54524F] text-center">
          {liveDateStr || 'THURSDAY, SEPTEMBER 3 • 06:30 AM'}
        </span>
      </div>

      {/* Luminous Glowing Morning Sun Anchor */}
      <div className="mb-4 sm:mb-6 flex flex-col items-center justify-center relative">
        {/* Soft Ambient Radiance Behind Sun */}
        <div className="absolute w-32 sm:w-44 h-32 sm:h-44 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

        {/* 3D Sun Sphere & Concentric Orbital Beams */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          <svg className="w-28 h-28 sm:w-36 sm:h-36 overflow-visible" viewBox="0 0 120 120" fill="none">
            <defs>
              {/* 3D Radial Sphere Shader */}
              <radialGradient id="sunSphere3D" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="25%" stopColor="#FDE68A" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="88%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </radialGradient>

              {/* Ray Gradient */}
              <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Outer Concentric Dashed Ring */}
            <circle
              cx="60"
              cy="60"
              r="48"
              stroke="#FDE68A"
              strokeWidth="1.8"
              strokeDasharray="5 5"
              opacity="0.85"
            />

            {/* Middle Solid Golden Orbital Track */}
            <circle
              cx="60"
              cy="60"
              r="36"
              stroke="#D97706"
              strokeWidth="2"
              opacity="0.9"
            />

            {/* Inner Concentric Dotted Ring */}
            <circle
              cx="60"
              cy="60"
              r="25"
              stroke="#D97706"
              strokeWidth="1.5"
              strokeDasharray="2 3"
              opacity="0.6"
            />

            {/* 8 Cardinal & Diagonal Radiant Sun Rays */}
            <line x1="60" y1="24" x2="60" y2="12" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="96" x2="60" y2="108" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="60" x2="12" y2="60" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="96" y1="60" x2="108" y2="60" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />

            <line x1="35" y1="35" x2="26" y2="26" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="85" y1="85" x2="94" y2="94" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="85" y1="35" x2="94" y2="26" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="35" y1="85" x2="26" y2="94" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />

            {/* 3D Realistic Glowing Sun Core */}
            <circle
              cx="60"
              cy="60"
              r="14"
              fill="url(#sunSphere3D)"
              className="drop-shadow-[0_2px_10px_rgba(217,119,6,0.45)]"
            />
          </svg>
        </div>

        {/* Ground Ellipse Shadow */}
        <div className="w-14 sm:w-16 h-1.5 rounded-full bg-gradient-to-r from-transparent via-[#D97706]/45 to-transparent blur-[1.5px] mt-2.5 sm:mt-3" />
      </div>

      {/* Badge Tag */}
      <div className="mb-2 sm:mb-3">
        <span className="inline-flex items-center px-3 sm:px-3.5 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A]/80 text-[#B45309] text-[10px] sm:text-[11px] font-semibold font-mono uppercase tracking-wider sm:tracking-widest shadow-xs">
          Executive Dawn Dispatch
        </span>
      </div>

      {/* Section Title */}
      <h1
        className="text-2xl sm:text-4xl text-[#1C1C17] text-center tracking-tight mb-5 sm:mb-7 font-normal px-2"
        style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
      >
        Win the Morning, Win the Day
      </h1>

      {/* Tactile Card */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-8 border border-[#ECE4D6] shadow-[0_4px_24px_rgba(180,83,9,0.04)] flex flex-col gap-4 sm:gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D97706]/60 to-transparent" />

        {/* Intro copy */}
        <p className="text-sm sm:text-base text-[#54524F] leading-relaxed text-center sm:text-left font-normal">
          Two minutes of deliberate clarity to silence the noise, ignite your momentum, and conquer what matters most.
        </p>

        {/* 3-Pill Preview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
          {/* 1. Identity Anchor */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F7F3EB] border border-[#ECE8E0] flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono text-[#8C827A] uppercase tracking-wider font-medium">1. Identity</div>
              <div className="text-xs font-semibold text-[#1C1C17] truncate">
                {briefing?.optimismAnchor?.title || 'The Arena, Not The Barrier'}
              </div>
            </div>
          </div>

          {/* 2. Reading */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F7F3EB] border border-[#ECE8E0] flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono text-[#8C827A] uppercase tracking-wider font-medium">2. Reading</div>
              <div className="text-xs font-semibold text-[#1C1C17] truncate" title={todayArticle?.title || 'James Clear Reading'}>
                {todayArticle?.title || 'James Clear Reading'}
              </div>
            </div>
          </div>

          {/* 3. Climate */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F7F3EB] border border-[#ECE8E0] flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono text-[#8C827A] uppercase tracking-wider font-medium">3. Climate</div>
              <div className="text-xs font-semibold text-[#1C1C17] truncate">
                {tempDisplay} • {weatherData?.weatherLabel ?? 'Clear Sky'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 sm:mt-8 w-full flex flex-col items-center gap-2">
        <button
          onClick={(e) => {
            firePartyPopper(e, { particleCount: 50, spread: 75, pitch: 1.0 });
            setTimeout(onAdvance, 250);
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D97706] via-[#C86104] to-[#B45309] text-white font-medium text-sm flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(180,83,9,0.22)] hover:shadow-[0_6px_22px_rgba(180,83,9,0.3)] hover:brightness-105 transition-all duration-200 active:scale-[0.98] touch-manipulation group"
        >
          <span>Begin Morning Ritual</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8C827A] font-mono pt-1">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#ECE8E0] text-[#1C1C17] text-[11px] shadow-xs">
            Enter ↵
          </kbd>
          <span>to advance</span>
        </div>
      </div>
    </div>
  );
}
