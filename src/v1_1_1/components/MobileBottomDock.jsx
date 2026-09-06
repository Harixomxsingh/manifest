import React from 'react';
import { Sparkles, BookOpen, Sun, Compass, Play } from 'lucide-react';
import { RITUAL_PHASES } from './SidebarRitualPath';

export default function MobileBottomDock({ activePhase, onSelectPhase, onAdvance }) {
  const phaseOrder = ['welcome', 'identity', 'reading', 'climate', 'launch'];
  const currentIndex = phaseOrder.indexOf(activePhase);
  const progressPercent = Math.round(((currentIndex + 1) / phaseOrder.length) * 100);

  const getPhaseIcon = (phaseId, isActive) => {
    const iconClass = `w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${isActive ? 'scale-110 text-[#D97706]' : 'text-[#8C827A]'}`;
    switch (phaseId) {
      case 'welcome':
        return <Play className={iconClass} />;
      case 'identity':
        return <Sparkles className={iconClass} />;
      case 'reading':
        return <BookOpen className={iconClass} />;
      case 'climate':
        return <Sun className={iconClass} />;
      case 'launch':
        return <Compass className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  const getShortLabel = (label) => {
    if (label.includes('Identity')) return 'Identity';
    if (label.includes('Reading')) return 'Reading';
    if (label.includes('Climate')) return 'Climate';
    if (label.includes('Launch')) return 'Launch';
    return 'Start';
  };

  return (
    <nav
      aria-label="Mobile and Tablet Ritual Navigation"
      className="lg:hidden fixed bottom-0 md:bottom-3 left-0 md:left-1/2 right-0 md:right-auto md:-translate-x-1/2 md:max-w-xl md:w-[92%] z-30 bg-[#FDF9F1]/95 md:bg-[#FDF9F1]/90 backdrop-blur-xl border-t md:border border-[#ECE8E0] md:rounded-2xl shadow-[0_-4px_24px_rgba(180,83,9,0.08)] md:shadow-[0_8px_32px_rgba(180,83,9,0.12)] px-2 sm:px-3 md:px-4 pt-1.5 md:pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] md:pb-2 transition-all"
    >
      {/* Dynamic Ambient Progress Bar */}
      <div className="w-full h-1 bg-[#ECE8E0] rounded-full overflow-hidden mb-1.5">
        <div
          className="h-full bg-gradient-to-r from-[#D97706] to-[#B45309] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Touch Phase Navigation Tabs */}
      <div className="grid grid-cols-5 gap-1 sm:gap-1.5 items-center">
        {RITUAL_PHASES.map((phase) => {
          const isActive = activePhase === phase.id;
          const isPassed = phaseOrder.indexOf(phase.id) < currentIndex;

          return (
            <button
              key={phase.id}
              onClick={() => onSelectPhase(phase.id)}
              className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-1 rounded-xl transition-all select-none touch-manipulation relative ${
                isActive
                  ? 'bg-white text-[#B45309] shadow-xs border border-[#FDE68A]'
                  : 'text-[#8C827A] hover:text-[#1C1C17] hover:bg-[#F7F3EB]'
              }`}
            >
              {/* Active Golden Highlight Dot */}
              {isActive && (
                <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#D97706] shadow-[0_0_6px_#D97706]" />
              )}

              <div className="mb-0.5">
                {getPhaseIcon(phase.id, isActive)}
              </div>

              <span
                className={`text-[10px] sm:text-[11px] font-mono tracking-tight leading-none ${
                  isActive ? 'font-bold text-[#903F00]' : isPassed ? 'text-[#54524F]' : 'text-[#8C827A]'
                }`}
              >
                {getShortLabel(phase.label)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
