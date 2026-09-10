import React, { useEffect } from 'react';
import { Flame, Sparkles, Trophy, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTriumphantChime } from '../../services/streakService';

export default function StreakCelebrationModal({ isOpen, onClose, streakCount = 1, onOpenHeatmap }) {
  useEffect(() => {
    if (isOpen) {
      // Trigger pleasant celebratory sound chime
      playTriumphantChime();

      // Launch rich multi-burst confetti
      try {
        // Initial immediate burst
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#D97706', '#EC4899']
        });

        // Secondary left/right fireworks burst
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: ['#F59E0B', '#10B981', '#FBBF24']
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: ['#3B82F6', '#10B981', '#EC4899']
          });
        }, 250);
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FDF9F1] border-2 border-amber-400 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden animate-scale-up">
        {/* Radiant Solar Background Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-radial from-amber-400/50 via-yellow-300/30 to-transparent blur-3xl pointer-events-none animate-pulse" />

        {/* Floating Sparkle Embers */}
        <div className="absolute top-4 right-6 text-amber-500/80 animate-bounce">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute top-8 left-6 text-amber-500/70 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Large Glowing Flame Emblem with Pulse Aura */}
        <div className="relative mb-5">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 opacity-60 blur-md animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 border-2 border-amber-200 shadow-[0_0_35px_rgba(245,158,11,0.7)] flex items-center justify-center">
            <Flame className="w-14 h-14 text-white fill-white drop-shadow-md animate-pulse" />
          </div>
        </div>

        {/* Level Up Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-200 to-yellow-200 border border-amber-300 text-xs font-mono font-black text-amber-950 uppercase tracking-widest mb-3 shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-amber-800 fill-amber-700" />
          <span>STREAK INCREASED!</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-2">
          {streakCount}-Day Streak! 🔥
        </h2>

        {/* Dopamine Affirmation */}
        <p className="text-xs sm:text-sm text-stone-600 max-w-xs leading-relaxed mb-6 font-medium">
          You showed up and completed your morning ritual today. That's how champions build unstoppable daily momentum!
        </p>

        {/* Mini Green Box Lighting Up Indicator (GitHub style) */}
        <div className="w-full bg-white border border-stone-200/90 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-[#30A14E] border border-[#258d40] shadow-[0_0_10px_rgba(48,161,78,0.8)] animate-pulse" />
            <div className="text-left">
              <span className="block text-xs font-bold text-stone-900">Today's Focus Square Lit Up!</span>
              <span className="block text-[10px] text-stone-500">Recorded to your focus heatmap</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onOpenHeatmap) onOpenHeatmap();
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
          >
            View Calendar →
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-950 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-amber-900/25 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm cursor-pointer"
        >
          <span>View Today's Action Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
