import React from 'react';
import { Sparkles, Shield, BookOpen, Mic, Sun, Compass } from 'lucide-react';

const DOCK_PHASES = [
  { id: 'welcome', label: 'Welcome', icon: Sparkles },
  { id: 'identity', label: 'Identity', icon: Shield },
  { id: 'reading', label: 'Reading', icon: BookOpen },
  { id: 'voice', label: 'Voice & Text', icon: Mic },
  { id: 'climate', label: 'Atmosphere', icon: Sun },
  { id: 'launch', label: 'Launch', icon: Compass }
];

export default function MobileBottomDock({ activePhase, onSelectPhase }) {
  const currentIndex = DOCK_PHASES.findIndex((p) => p.id === activePhase);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDF9F1]/95 backdrop-blur-md border-t border-stone-200/80 px-2 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {DOCK_PHASES.map((phase, idx) => {
          const Icon = phase.icon;
          const isActive = activePhase === phase.id;
          const isCompleted = idx < safeIndex;

          return (
            <button
              key={phase.id}
              onClick={() => onSelectPhase(phase.id)}
              className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer min-w-[48px] min-h-[48px] ${
                isActive
                  ? 'bg-white border-2 border-amber-400 shadow-sm scale-105 ring-2 ring-amber-400/20'
                  : isCompleted
                  ? 'text-amber-950 font-bold'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
              title={phase.label}
            >
              {/* Icon Container with Radiant Glow on Completed */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 relative ${
                  isCompleted
                    ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white shadow-[0_0_8px_rgba(217,119,6,0.45)] ring-1.5 ring-amber-300'
                    : isActive
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isCompleted ? 'stroke-[2.4]' : 'stroke-[2]'}`} />
                {isCompleted && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border border-white rounded-full flex items-center justify-center text-[7px] text-amber-950 font-black">
                    ✓
                  </span>
                )}
              </div>

              <span
                className={`text-[9px] mt-1 tracking-tight truncate max-w-[50px] ${
                  isCompleted
                    ? 'font-bold text-amber-900'
                    : isActive
                    ? 'font-extrabold text-amber-950'
                    : 'text-stone-400'
                }`}
              >
                {phase.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
