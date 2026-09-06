import React from 'react';
import { Calendar, Zap, Clock, Video, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
      <div className="rounded-2xl glass-card p-6 border border-white/[0.08] animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-16 bg-slate-800/40 rounded-xl mb-3" />
        <div className="h-12 bg-slate-800/30 rounded-lg" />
      </div>
    );
  }

  return (
    <section aria-labelledby="calendar-radar-title" className="rounded-3xl glass-card relative overflow-hidden border border-white/[0.08] bg-[#0B0F17]/90">
      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono-code">
              Pillar 4 • Schedule Radar & Mental Model
            </span>
          </div>

          <span className="text-[11px] font-medium text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
            {calendarTriage.nonRoutineEvents?.length || 0} Priority Events
          </span>
        </div>

        {/* Daily Strategic Mental Model Playbook */}
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-indigo-950/40 via-indigo-900/20 to-transparent border border-indigo-500/30 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Daily Strategic Playbook
            </span>
          </div>
          <h2 id="calendar-radar-title" className="text-base sm:text-lg font-bold text-white mb-1.5">
            {calendarTriage.dailyPrinciple}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {calendarTriage.principleExplanation}
          </p>
        </div>

        {/* Non-Routine / High-Stakes Events Timeline */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono-code flex items-center justify-between">
            <span>High-Stakes & Non-Routine Agenda</span>
            <span className="text-[11px] text-slate-500 font-normal lowercase">routine standups filtered</span>
          </div>

          {calendarTriage.nonRoutineEvents?.length > 0 ? (
            <div className="space-y-2.5">
              {calendarTriage.nonRoutineEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-3.5 bg-slate-900/80 border border-white/[0.08] flex items-center justify-between gap-3 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono-code font-semibold shrink-0">
                      {event.time}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white line-clamp-1">
                        {event.summary}
                      </div>
                    </div>
                  </div>

                  {event.isActionRequired && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/25 shrink-0">
                      High Stakes
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl p-4 bg-slate-900/40 border border-white/[0.05] text-center text-xs text-slate-400">
              Zero non-routine meetings scheduled today. Enjoy unbroken creative flow.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
