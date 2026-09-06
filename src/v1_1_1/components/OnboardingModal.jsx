import React from 'react';
import { X, Sparkles, Shield, Compass, BookOpen, Sun, Calendar, Target, Mail, CheckCircle2, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { firePartyPopper } from '../../utils/confettiHelper';

export default function OnboardingModal() {
  const { isOnboardingOpen, setIsOnboardingOpen, hideOnboarding, setHideOnboarding } = useApp();

  if (!isOnboardingOpen) return null;

  const handleClose = (e) => {
    if (e && e.type === 'click') {
      firePartyPopper(e, { particleCount: 45, spread: 70 });
    }
    setIsOnboardingOpen(false);
  };

  const handleCheckboxChange = (e) => {
    setHideOnboarding(e.target.checked);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-[#FDF9F1] border border-[#EDE5D8] shadow-2xl shadow-amber-950/20 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#ECE8E0] bg-[#FDF9F1] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] shrink-0 shadow-xs">
              <svg className="w-6 h-6 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4.5" fill="#D97706" stroke="none" />
                <circle cx="12" cy="12" r="7.5" stroke="#B45309" strokeDasharray="2 2" strokeWidth="1.2" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B45309]">
                Executive Onboarding & Orientation
              </div>
              <h2
                className="text-xl sm:text-2xl text-[#1C1C17] font-normal tracking-tight"
                style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
              >
                The Morning Protocol
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full bg-[#F7F3EB] hover:bg-[#ECE8E0] text-[#54524F] hover:text-[#1C1C17] transition-all"
            title="Close orientation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="px-6 py-6 overflow-y-auto space-y-7 text-[#1C1C17]">
          {/* 1. The Core Intent */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#8C827A]">
                The Core Intent
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs flex flex-col gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center text-xs font-bold font-mono">
                  01
                </div>
                <div className="text-xs font-bold text-[#1C1C17]">Zero Decision Fatigue</div>
                <p className="text-[11px] text-[#54524F] leading-relaxed">
                  Never start your morning sifting through empty tabs or spam. Direct, pre-synthesized clarity.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs flex flex-col gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center text-xs font-bold font-mono">
                  02
                </div>
                <div className="text-xs font-bold text-[#1C1C17]">Signal Over Noise</div>
                <p className="text-[11px] text-[#54524F] leading-relaxed">
                  Strict automated triage. If nothing is urgent, receive an explicit "All Clear" seal.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs flex flex-col gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center text-xs font-bold font-mono">
                  03
                </div>
                <div className="text-xs font-bold text-[#1C1C17]">Identity Anchoring</div>
                <p className="text-[11px] text-[#54524F] leading-relaxed">
                  Ground yourself every morning as a relentless, pragmatic optimist with unshakeable agency.
                </p>
              </div>
            </div>
          </div>

          {/* 2. The 4-Phase Operating Protocol */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#8C827A]">
                The 4-Phase Operating Protocol
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-[#B45309] text-[11px] min-w-[20px]">01</span>
                <div>
                  <strong className="text-[#1C1C17]">Identity & Agency: </strong>
                  <span className="text-[#54524F]">Mindset manifesto & core daily affirmation to ground yourself.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-[#B45309] text-[11px] min-w-[20px]">02</span>
                <div>
                  <strong className="text-[#1C1C17]">Mindset Reading: </strong>
                  <span className="text-[#54524F]">Curated James Clear insight with 90-day anti-repetition and direct full article access.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-[#B45309] text-[11px] min-w-[20px]">03</span>
                <div>
                  <strong className="text-[#1C1C17]">Atmospheric Climate: </strong>
                  <span className="text-[#54524F]">12-hour temperature window, rain risk, attire strategy, and auto GPS weather.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-[#B45309] text-[11px] min-w-[20px]">04</span>
                <div>
                  <strong className="text-[#1C1C17]">Day Launchpad: </strong>
                  <span className="text-[#54524F]">Executive summary seal, audio dispatch narration, and kickoff to conquer the day.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Sovereign & Zero-Cost Architecture */}
          <div className="p-4 rounded-2xl bg-[#F7F3EB] border border-[#ECE8E0] flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-[#1C1C17] font-mono uppercase text-[11px]">
                Sovereign Privacy & Free-Tier Architecture
              </div>
              <p className="text-[11px] text-[#54524F] leading-relaxed">
                100% Client-Side execution. No centralized database stores your personal emails or tasks. Runs completely on your free Google AI Studio key and keyless weather APIs at $0 operating cost.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#ECE8E0] bg-[#FDF9F1] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Don't show again checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-[#54524F] hover:text-[#1C1C17]">
            <input
              type="checkbox"
              checked={hideOnboarding}
              onChange={handleCheckboxChange}
              className="w-4 h-4 rounded border-[#DDC1B3] text-[#B45309] focus:ring-[#D97706] bg-white cursor-pointer"
            />
            <span>Don't show this manual on startup</span>
          </label>

          {/* Proceed Button */}
          <button
            onClick={handleClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#B45309] hover:bg-[#903F00] text-white font-medium text-xs shadow-sm hover:brightness-105 transition-all active:scale-[0.98]"
          >
            <span>Enter Morning Protocol</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
