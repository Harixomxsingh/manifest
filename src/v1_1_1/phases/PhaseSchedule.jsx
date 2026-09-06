import React, { useState } from 'react';
import { Calendar, Zap, ArrowRight, Video, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PhaseSchedule({ onAdvance }) {
  const { briefing } = useApp();
  const [isDone, setIsDone] = useState(false);

  const calendarTriage = briefing?.calendarTriage || {
    dailyPrinciple: 'Deep Work Sprint (Flow Runway)',
    principleExplanation: 'Your calendar provides wide uninterrupted runway today. Dedicate your first 90 minutes solely to your #1 compounding task before opening communications.',
    nonRoutineEvents: [
      { time: '11:00 AM', summary: 'Series B Lead Partner Alignment Sync', isActionRequired: true },
      { time: '02:30 PM', summary: 'Engineering Leadership Architecture Review', isActionRequired: true }
    ]
  };

  const handleProceed = () => {
    setIsDone(true);
    setTimeout(() => {
      onAdvance();
    }, 200);
  };

  return (
    <div className="w-full max-w-[42rem] mx-auto flex flex-col items-center py-4 sm:py-8 animate-fadeIn">
      {/* Top Phase Header Tracker */}
      <div className="w-full mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[#8C827A] text-[11px] font-mono tracking-widest uppercase">
          <span>Phase 04 of 07</span>
          <span className="text-[#B45309] font-semibold">Temporal Architecture</span>
        </div>
        <div className="w-full h-1 bg-[#ECE8E0] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#D97706] to-[#B45309] rounded-full w-[57.1%]" />
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">
        {/* Title Lockup */}
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span className="text-[11px] font-mono text-[#8C827A] uppercase tracking-widest font-semibold">
              Calendar Radar & Strategic Playbook
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl text-[#903F00] tracking-tight font-normal"
            style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
          >
            Today's Operating Cadence
          </h2>
          <p className="text-xs sm:text-sm text-[#54524F]">
            Routine standups filtered out so you preserve peak cognitive bandwidth for high-leverage milestones.
          </p>
        </div>

        {/* Daily Strategic Mental Model Playbook Card */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-[#FEF3C7]/90 via-[#FFFBEB] to-[#FDF9F1] border border-[#FDE68A] shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#D97706]">
            <Zap className="w-4 h-4 text-[#D97706]" />
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#B45309]">
              Strategic Playbook Principle
            </span>
          </div>

          <h3
            className="text-xl text-[#1C1C17] font-normal"
            style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
          >
            {calendarTriage.dailyPrinciple}
          </h3>

          <p className="text-xs sm:text-sm text-[#54524F] leading-relaxed">
            {calendarTriage.principleExplanation}
          </p>
        </div>

        {/* Non-Routine / High-Stakes Events Timeline */}
        <div className="rounded-2xl bg-white p-6 border border-[#EDE5D8] shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#ECE8E0]">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8C827A] font-semibold">
              High-Stakes Non-Routine Agenda
            </span>
            <span className="text-xs font-mono text-[#B45309] font-medium">
              {calendarTriage.nonRoutineEvents?.length || 0} Key Milestones
            </span>
          </div>

          {calendarTriage.nonRoutineEvents?.length > 0 ? (
            <div className="space-y-3">
              {calendarTriage.nonRoutineEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#F7F3EB] border border-[#ECE8E0] hover:border-[#D97706]/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] text-xs font-mono font-semibold shrink-0">
                      {event.time}
                    </span>
                    <span className="text-sm font-medium text-[#1C1C17]">{event.summary}</span>
                  </div>

                  {event.isActionRequired && (
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded-md bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] shrink-0">
                      High Stakes
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8C827A] italic py-4 text-center">
              Zero non-routine meetings scheduled today. Enjoy unbroken creative flow.
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#ECE8E0]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C827A]">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span>Schedule Triaged & Locked</span>
          </div>

          <button
            onClick={handleProceed}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B45309] to-[#903F00] text-white font-medium text-xs shadow-sm hover:brightness-105 transition-all active:scale-[0.98]"
          >
            <span>{isDone ? 'Proceeding...' : 'Acknowledge & View Priorities'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
