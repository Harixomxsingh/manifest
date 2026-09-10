import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PhaseIdentity({ onAdvance }) {
  const { briefing } = useApp();
  const [isAffirmed, setIsAffirmed] = useState(false);

  const anchor = briefing?.optimismAnchor || {
    title: 'The Arena, Not The Barrier',
    content: 'Difficulties are not personal roadblocks; they are the exact raw material from which your resilience and sovereign character are forged.',
    identityReminder: 'I view every challenge today through an opportunistic and constructive lens.'
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 max-w-lg mx-auto animate-fade-in w-full">
      {/* Top Tracker */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#A8A29E] tracking-wider mb-2">
          <span>PHASE 01 OF 05</span>
          <span className="text-[#78350F]">Identity Anchor</span>
        </div>
        <div className="w-full h-1 bg-[#E7E5E4] rounded-full overflow-hidden">
          <div className="w-1/5 h-full bg-[#78350F] rounded-full" />
        </div>
      </div>

      {/* Main Quote Card */}
      <div className="w-full bg-white border border-amber-500/25 rounded-2xl p-6 sm:p-7 mb-6 shadow-sm text-center">
        <span className="inline-block text-[10px] font-mono font-extrabold text-[#78350F] tracking-widest uppercase mb-4">
          MINDSET ANCHOR
        </span>

        <h2 className="text-xl sm:text-2xl font-bold text-amber-950 leading-snug mb-4 tracking-tight">
          "{anchor.identityReminder}"
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 px-2 font-medium">
          {anchor.content}
        </p>

        {/* Minimal Checkbox Affirmation */}
        <button
          type="button"
          onClick={() => setIsAffirmed(!isAffirmed)}
          className="w-full flex items-center justify-center gap-2.5 pt-4 border-t border-[#F5EEDC] text-xs font-medium text-[#78716C] hover:text-[#1C1C17] transition-colors cursor-pointer"
        >
          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
              isAffirmed ? 'bg-[#78350F] border-[#78350F] text-white' : 'border-[#D6D3D1] bg-[#FDF9F1]'
            }`}
          >
            {isAffirmed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <span>I choose to embody this today</span>
        </button>
      </div>

      {/* Proceed Button */}
      <button
        onClick={onAdvance}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#78350F] hover:bg-[#92400E] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-98"
      >
        <span>Anchor Focus & Next</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
