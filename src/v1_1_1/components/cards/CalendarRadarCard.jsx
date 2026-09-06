import React from 'react';
import { Calendar, Zap, Clock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function CalendarRadarCard() {
  const { briefing, isGenerating } = useApp();

  const calendarTriage = briefing?.calendarTriage || {
    dailyPrinciple: 'Deep Work Sprint (Flow Runway)',
    principleExplanation: 'Your calendar provides wide uninterrupted runway today. Dedicate your first 90 minutes solely to your #1 compounding task before opening communications.',
    nonRoutineEvents: [
      { time: '11:00 AM', summary: 'Series B Lead Partner Alignment Sync', isActionRequired: true },
      { time: '02:30 PM', summary: 'Engineering Leadership Architecture Review', isActionRequired: true }
    ]
  };

  if (isGenerating && !briefing) {
    return (
      <div className="rounded-3xl glass-card p-6 border border-white/[0.08] animate-pulse h-full">
        <div className="h-5 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-16 bg-slate-800/40 rounded-2xl mb-3" />
        <div className="h-10 bg-slate-800/30 rounded-xl" />
      </div>
    );
  }

  return (
    <section aria-labelledby="v111-calendar-title" className="rounded-3xl glass-card relative overflow-hidden border border-white/[0.08] bg-[#0A0E17]/90 p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-slate-400">
              Pillar 04 • Calendar Radar
            </span>
          </div>

          <span className="text-[10px] font-mono-code font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            {calendarTriage.nonRoutineEvents?.length || 0} Priority Events
          </span>
        </div>

        {/* Daily Strategic Mental Model Playbook */}
        <div className="rounded-2xl p-4 bg-gradient-to-r from-indigo-950/40 via-indigo-900/15 to-transparent border border-indigo-500/25 mb-4">
          <div className="flex items-center gap-1.5 mb-1 text-xs font-mono-code text-indigo-300 font-bold uppercase">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Strategic Playbook</span>
          </div>
          <h2 id="v111-calendar-title" className="text-base font-bold text-white mb-1 font-editorial">
            {calendarTriage.dailyPrinciple}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {calendarTriage.principleExplanation}
          </p>
        </div>

        {/* Non-Routine Agenda */}
        <div>
          <div className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-slate-500 mb-2">
            Non-Routine Milestones
          </div>

          {calendarTriage.nonRoutineEvents?.length > 0 ? (
            <div className="space-y-2">
              {calendarTriage.nonRoutineEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-2.5 bg-slate-900/80 border border-white/[0.06] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono-code text-[11px] font-semibold">
                      {event.time}
                    </span>
                    <span className="font-medium text-slate-200 truncate max-w-[200px]">
                      {event.summary}
                    </span>
                  </div>

                  {event.isActionRequired && (
                    <span className="text-[9px] font-mono-code font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/25">
                      KEY
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No non-routine meetings today.</p>
          )}
        </div>
      </div>
    </section>
  );
}
