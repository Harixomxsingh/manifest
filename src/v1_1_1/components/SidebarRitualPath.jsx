import React from 'react';

export const RITUAL_PHASES = [
  { id: 'welcome', label: 'Welcome', stepNum: '00' },
  { id: 'identity', label: '1. Identity', stepNum: '01' },
  { id: 'reading', label: '2. Reading', stepNum: '02' },
  { id: 'climate', label: '3. Climate', stepNum: '03' },
  { id: 'launch', label: '4. Launch', stepNum: '04' }
];

export default function SidebarRitualPath({ activePhase, onSelectPhase }) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-12 w-64 z-30 flex-col justify-between py-8 px-6 bg-[#FDF9F1]/80 backdrop-blur-sm border-r border-[#ECE8E0]/70">
      <div className="flex flex-col gap-4">
        <div className="text-[11px] font-semibold text-[#8C827A] uppercase tracking-widest pl-2">
          Ritual Path
        </div>

        <nav className="flex flex-col gap-1">
          {RITUAL_PHASES.map((phase) => {
            const isActive = activePhase === phase.id;

            return (
              <button
                key={phase.id}
                onClick={() => onSelectPhase(phase.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left text-xs ${
                  isActive
                    ? 'bg-white text-[#B45309] font-medium shadow-[0_1px_6px_rgba(180,83,9,0.06)] border border-[#FDE68A]/70'
                    : 'text-[#54524F] hover:text-[#1C1C17] hover:bg-[#F7F3EB]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                    isActive ? 'bg-[#D97706]' : 'bg-[#DDC1B3]'
                  }`}
                />
                <span className="truncate">{phase.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Gentle Pacing Tag */}
      <div className="p-3 rounded-xl bg-[#FEF3C7]/70 border border-[#FDE68A]/70 text-[#B45309] flex items-center gap-2 shadow-xs">
        <span className="material-symbols-outlined text-[16px] text-[#D97706]">wb_sunny</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Gentle Pacing</span>
      </div>
    </aside>
  );
}
