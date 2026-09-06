import React, { useState } from 'react';
import { ArrowRight, Check, Verified } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { firePartyPopper, playMotivationalChime } from '../../utils/confettiHelper';
import { getTodayIdentityAnchor } from '../../services/identityService';

export default function PhaseIdentity({ onAdvance }) {
  const { briefing } = useApp();
  const [isAffirmed, setIsAffirmed] = useState(false);

  const anchor = briefing?.optimismAnchor || getTodayIdentityAnchor();

  const handleToggleAffirm = (e) => {
    const nextState = !isAffirmed;
    setIsAffirmed(nextState);
    if (nextState) {
      playMotivationalChime(1.1);
    }
  };

  const handleProceed = (e) => {
    setIsAffirmed(true);
    // Trigger motivational party popper celebration!
    firePartyPopper(e, {
      particleCount: 65,
      spread: 80,
      pitch: 1.0
    });
    setTimeout(() => {
      onAdvance();
    }, 280);
  };

  return (
    <div className="w-full max-w-[42rem] mx-auto flex flex-col items-center py-6 sm:py-10 animate-fadeIn">
      {/* Top Progress Indicator */}
      <div className="w-full mb-8 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[#8C827A] text-[11px] font-mono tracking-widest uppercase">
          <span>Phase 01 of 04</span>
          <span className="text-[#B45309] font-semibold">Identity & Agency</span>
        </div>
        <div className="w-full h-1 bg-[#ECE8E0] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D97706] to-[#B45309] rounded-full transition-all duration-700 ease-out"
            style={{ width: '25%' }}
          />
        </div>
      </div>

      {/* Centered Visual Anchor Emblem (Radiating Amber Sunburst) */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-18 h-18 flex items-center justify-center p-3 rounded-full bg-[#FEF3C7]/40 border border-[#FDE68A]/60 shadow-[0_0_24px_rgba(217,119,6,0.12)]">
          <svg className="w-14 h-14 text-[#D97706] animate-[spin_60s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 100 100">
            <circle className="text-[#FDE68A] opacity-70" cx="50" cy="50" r="44" strokeDasharray="4 4" strokeWidth="1.75" />
            <circle className="text-[#D97706]" cx="50" cy="50" r="28" strokeOpacity="0.85" strokeWidth="2.2" />
            <line strokeLinecap="round" strokeWidth="2.2" x1="50" x2="50" y1="12" y2="22" />
            <line strokeLinecap="round" strokeWidth="2.2" x1="50" x2="50" y1="78" y2="88" />
            <line strokeLinecap="round" strokeWidth="2.2" x1="12" x2="22" y1="50" y2="50" />
            <line strokeLinecap="round" strokeWidth="2.2" x1="78" x2="88" y1="50" y2="50" />
            <line strokeLinecap="round" strokeWidth="2.2" x1="23" x2="30" y1="23" y2="30" />
            <line strokeLinecap="round" strokeWidth="2.2" x1="70" x2="77" y1="70" y2="77" />
            <line strokeLinecap="round" strokeWidth="2.2" x1="77" x2="70" y1="23" y2="30" />
            <line strokeLinecap="round" strokeWidth="2.2" x1="30" x2="23" y1="70" y2="77" />
            <circle cx="50" cy="50" fill="#d97706" r="10" stroke="none" />
          </svg>
        </div>
      </div>

      {/* Badge Tag */}
      <div className="mb-3">
        <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A]/70 text-[#B45309] text-[11px] font-semibold font-mono uppercase tracking-widest shadow-xs">
          Identity Lens • Unshakeable Agency
        </span>
      </div>

      {/* Section Header */}
      <h1
        className="text-3xl sm:text-4xl text-[#1C1C17] text-center tracking-tight mb-8 font-normal"
        style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
      >
        {anchor.title || 'The Arena, Not The Barrier'}
      </h1>

      {/* Tactile Body Card: Warm ivory card with hairline border */}
      <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-[#ECE4D6] shadow-[0_4px_24px_rgba(180,83,9,0.04)] flex flex-col gap-6 relative overflow-hidden">
        {/* Subtle top golden dawn tint accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D97706]/60 to-transparent" />

        {/* Reflection Paragraph */}
        <p className="text-base text-[#54524F] leading-relaxed text-justify md:text-left">
          {anchor.content}
        </p>

        {/* Contextual Illustration Anchor Strip */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#F7F3EB] flex items-center justify-center border border-[#ECE8E0]">
          <img
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            alt="A tranquil, minimalist architectural courtyard in warm early morning sunlight."
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span className="text-[10px] font-mono text-white/90 uppercase tracking-widest font-semibold">
              Morning Stillness • St. Agnes Garden
            </span>
          </div>
        </div>

        {/* Core Identity Anchor Callout Box */}
        <div className="relative p-5 rounded-xl bg-gradient-to-br from-[#FEF3C7]/80 to-[#FDF1DB] border border-[#FDE68A]/80 text-[#B45309] flex flex-col gap-2 shadow-[0_2px_12px_rgba(217,119,6,0.06)]">
          <div className="flex items-center gap-2 text-[#D97706]">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#B45309]">
              Core Affirmation
            </span>
          </div>
          <blockquote
            className="text-lg sm:text-xl text-[#903F00] italic leading-snug font-normal"
            style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
          >
            “{anchor.identityReminder}”
          </blockquote>
        </div>

        {/* Micro Habit Acknowledgment Selector */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#ECE8E0]/70">
          <div
            onClick={handleToggleAffirm}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 ${
                isAffirmed
                  ? 'bg-[#D97706] border-[#D97706] text-white shadow-xs'
                  : 'bg-[#F7F3EB] border-[#FDE68A] group-hover:border-[#D97706]'
              }`}
            >
              {isAffirmed && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
            </div>
            <span className="text-xs text-[#54524F] group-hover:text-[#1C1C17] transition-colors">
              Internalized into today’s presence
            </span>
          </div>

          <span className="text-xs font-mono text-[#8C827A]">
            Paced reflection (1 min)
          </span>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="mt-8 w-full flex flex-col items-center gap-2">
        <button
          onClick={handleProceed}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D97706] via-[#C86104] to-[#B45309] text-white font-medium text-sm flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(180,83,9,0.22)] hover:shadow-[0_6px_22px_rgba(180,83,9,0.3)] hover:brightness-105 transition-all duration-200 active:scale-[0.99] group"
        >
          <span>Anchor Mindset & Proceed to Reading</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[#8C827A] font-mono pt-1">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#ECE8E0] text-[#1C1C17] text-[11px] shadow-xs">
            Enter ↵
          </kbd>
          <span>to affirm and advance</span>
        </div>
      </div>
    </div>
  );
}
