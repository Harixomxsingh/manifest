import React, { useEffect } from 'react';
import { Sparkles, CheckCheck, Volume2, RotateCcw, Compass, Sun, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fireGrandFinale } from '../../utils/confettiHelper';

export default function PhaseLaunch({ onResetToWelcome }) {
  const { briefing, todayArticle, weatherData, toggleAudioReadout, isAudioPlaying } = useApp();

  useEffect(() => {
    // Trigger grand celebratory launch fireworks!
    fireGrandFinale();
  }, []);

  const anchor = briefing?.optimismAnchor || {
    identityReminder: 'I view every challenge today through an opportunistic and constructive lens.'
  };

  const principle = briefing?.calendarTriage?.dailyPrinciple || 'Deep Work Sprint';

  return (
    <div className="w-full max-w-[42rem] mx-auto flex flex-col items-center py-2 sm:py-8 animate-fadeIn">
      {/* Top Phase Header Tracker */}
      <div className="w-full mb-4 sm:mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[#8C827A] text-[11px] font-mono tracking-widest uppercase">
          <span>Phase 04 of 04</span>
          <span className="text-[#10B981] font-semibold">● Launchpad Activated</span>
        </div>
        <div className="w-full h-1 bg-[#ECE8E0] rounded-full overflow-hidden">
          <div className="h-full bg-[#10B981] rounded-full w-full" />
        </div>
      </div>

      <div className="w-full flex flex-col items-center text-center gap-4 sm:gap-6">
        {/* Launch Emblem */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] shadow-sm">
          <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-[#D97706] stroke-[1.8]" />
        </div>

        {/* Title */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono uppercase tracking-wider mb-2">
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ritual Complete • Zero Friction</span>
          </div>
          <h1
            className="text-2xl sm:text-4xl text-[#1C1C17] tracking-tight font-normal leading-snug sm:leading-tight px-2"
            style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
          >
            Go Forth With Unshakeable Focus
          </h1>
          <p className="text-xs sm:text-sm text-[#54524F] mt-2 max-w-lg mx-auto leading-relaxed px-2">
            You have anchored your identity, absorbed today’s mindset reading, and mapped your atmospheric climate. You are primed to win today.
          </p>
        </div>

        {/* Executive Summary Slate */}
        <div className="w-full rounded-2xl bg-white p-4 sm:p-7 border border-[#EDE5D8] shadow-xs text-left flex flex-col gap-3.5 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#FEF3C7]/80 border border-[#FDE68A] flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-mono uppercase text-[#B45309] font-bold">Today's Anchor</div>
              <div className="text-xs sm:text-sm font-semibold text-[#1C1C17] italic mt-0.5">
                "{anchor.identityReminder}"
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#F7F3EB] border border-[#ECE8E0]">
              <div className="text-[10px] font-mono uppercase text-[#8C827A]">Mindset Reading</div>
              <div className="text-xs font-bold text-[#1C1C17] mt-0.5 truncate" title={todayArticle?.title || 'James Clear Reading'}>
                {todayArticle?.title || 'James Clear Reading'}
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-[#F7F3EB] border border-[#ECE8E0]">
              <div className="text-[10px] font-mono uppercase text-[#8C827A]">Climate Horizon</div>
              <div className="text-xs font-bold text-[#1C1C17] mt-0.5">
                {weatherData?.highTemp ?? 28}°{weatherData?.unit ?? 'C'} • {weatherData?.weatherLabel ?? 'Clear'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
          <button
            onClick={toggleAudioReadout}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold border transition-all touch-manipulation ${
              isAudioPlaying
                ? 'bg-[#B45309] text-white border-[#B45309]'
                : 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A] hover:bg-[#FDE68A]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isAudioPlaying ? 'Mute Audio Dispatch' : 'Listen to Audio Summary'}</span>
          </button>

          <button
            onClick={onResetToWelcome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F7F3EB] hover:bg-[#ECE8E0] text-[#54524F] border border-[#ECE8E0] text-xs font-mono transition-all touch-manipulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Ritual Path</span>
          </button>
        </div>
      </div>
    </div>
  );
}
