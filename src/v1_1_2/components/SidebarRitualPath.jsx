import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, BookOpen, Mic, Sun, Compass, BookMarked, Check, Flame } from 'lucide-react';
import { getStreakData } from '../../services/streakService';

export const RITUAL_PHASES = [
  { id: 'welcome', label: 'Welcome', number: '00', icon: Sparkles },
  { id: 'identity', label: 'Identity Anchor', number: '01', icon: Shield },
  { id: 'reading', label: 'Mindset Reading', number: '02', icon: BookOpen },
  { id: 'voice', label: 'Voice & Text', number: '03', icon: Mic },
  { id: 'climate', label: 'Atmosphere', number: '04', icon: Sun },
  { id: 'launch', label: 'Launchpad', number: '05', icon: Compass }
];

export default function SidebarRitualPath({ activePhase, onSelectPhase, onOpenVault, onOpenStreak }) {
  const [streak, setStreak] = useState(() => getStreakData());

  useEffect(() => {
    setStreak(getStreakData());
  }, []);

  const currentIndex = RITUAL_PHASES.findIndex((p) => p.id === activePhase);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const progressRatio = safeIndex / (RITUAL_PHASES.length - 1);

  return (
    <aside className="hidden lg:flex fixed top-16 left-0 bottom-0 w-64 border-r border-stone-200/80 bg-[#FDF9F1]/80 backdrop-blur-sm flex-col justify-between p-6 z-30 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono font-bold text-stone-400 tracking-wider uppercase block mb-1">
            RITUAL SEQUENCE
          </span>
          <h2 className="text-sm font-bold text-stone-800">
            Morning Cadence
          </h2>
        </div>

        {/* Phase List with Illuminated Path Beam */}
        <nav className="space-y-2 relative">
          {/* Background Neutral Track */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-stone-200/70 -z-0" />

          {/* Glowing Golden Beam Overlay */}
          <div
            className="absolute left-[19px] top-4 w-0.5 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)] transition-all duration-500 -z-0"
            style={{
              height: `${Math.max(0, Math.min(100, progressRatio * 100))}%`
            }}
          />

          {RITUAL_PHASES.map((phase, idx) => {
            const Icon = phase.icon;
            const isActive = activePhase === phase.id;
            const isCompleted = idx < safeIndex;

            return (
              <button
                key={phase.id}
                onClick={() => onSelectPhase(phase.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative z-10 cursor-pointer ${
                  isActive
                    ? 'bg-white border-2 border-amber-400 shadow-md shadow-amber-900/5 ring-4 ring-amber-400/10'
                    : isCompleted
                    ? 'bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/70 shadow-2xs'
                    : 'text-stone-400 hover:bg-stone-100/60 hover:text-stone-600 border border-transparent'
                }`}
              >
                {/* Icon Container (Illuminates in radiant Gold when completed!) */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 relative ${
                    isCompleted
                      ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white shadow-[0_0_12px_rgba(217,119,6,0.45)] ring-2 ring-amber-300/80 scale-102'
                      : isActive
                      ? 'bg-amber-100 text-amber-900 border border-amber-300/90 ring-2 ring-amber-200'
                      : 'bg-stone-100 text-stone-400 border border-stone-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isCompleted ? 'stroke-[2.4]' : 'stroke-[2]'}`} />
                </div>

                {/* Text Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-mono tracking-wider block leading-tight ${
                        isCompleted
                          ? 'font-bold text-amber-700'
                          : isActive
                          ? 'font-extrabold text-amber-800'
                          : 'text-stone-400'
                      }`}
                    >
                      PHASE {phase.number}
                    </span>

                    {isCompleted && (
                      <span className="inline-flex items-center text-[9px] font-mono font-extrabold text-amber-700 bg-amber-200/60 px-1 py-0.2 rounded">
                        ✓
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-xs truncate block leading-normal ${
                      isCompleted
                        ? 'font-bold text-amber-950'
                        : isActive
                        ? 'font-extrabold text-amber-950'
                        : 'text-stone-400 font-medium'
                    }`}
                  >
                    {phase.label}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Streak & Vault Links */}
        <div className="space-y-2">
          {onOpenStreak && (
            <button
              onClick={onOpenStreak}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-100/90 to-amber-50 hover:from-amber-200 hover:to-amber-100 border border-amber-300/80 text-amber-950 text-xs font-bold transition-all shadow-2xs cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>Focus Heatmap & Streak</span>
              </div>
              <span className="text-[10px] font-mono font-extrabold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded">
                Grid
              </span>
            </button>
          )}

          {onOpenVault && (
            <button
              onClick={onOpenVault}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200/80 text-stone-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <BookMarked className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Journal Vault & Archive</span>
            </button>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-stone-200/60 text-center space-y-1">
        <p className="text-[11px] text-stone-500 font-sans">
          made with ❤️ by{' '}
          <a
            href="https://harixomxsingh.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-800 hover:text-amber-950 font-bold hover:underline"
          >
            hari
          </a>
        </p>
      </div>
    </aside>
  );
}
