import React from 'react';
import { Target, CheckCircle2, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PhasePriorities({ onAdvance }) {
  const { briefing, completedTaskIds, toggleTaskCompletion } = useApp();

  const tasks = briefing?.prioritizedTasks || [
    { rank: 1, title: 'Sign and return the Series B term sheet indemnity addendum', reason: 'High leverage milestone for capital allocation' },
    { rank: 2, title: 'Approve the Q3 vector migration manifest before 2:00 PM deploy', reason: 'Blocks production infrastructure latency upgrade' },
    { rank: 3, title: 'Review key hire offer package for Head of Growth Engineering', reason: 'Critical leadership recruiting pipeline' }
  ];

  const completedCount = tasks.filter((t) =>
    completedTaskIds.includes(`task-rank-${t.rank}-${t.title}`)
  ).length;

  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="w-full max-w-[42rem] mx-auto flex flex-col items-center py-4 sm:py-8 animate-fadeIn">
      {/* Top Phase Header Tracker */}
      <div className="w-full mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[#8C827A] text-[11px] font-mono tracking-widest uppercase">
          <span>Phase 05 of 07</span>
          <span className="text-[#B45309] font-semibold">Kinetic Leverage</span>
        </div>
        <div className="w-full h-1 bg-[#ECE8E0] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#D97706] to-[#B45309] rounded-full w-[71.4%]" />
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">
        {/* Title Lockup */}
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span className="text-[11px] font-mono text-[#8C827A] uppercase tracking-widest font-semibold">
              Prioritized Daily Execution
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl text-[#903F00] tracking-tight font-normal"
            style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
          >
            Top High-Impact Priorities
          </h2>
          <p className="text-xs sm:text-sm text-[#54524F]">
            Ruthlessly filtered down to the highest leverage actions that move the needle today.
          </p>
        </div>

        {/* Priority Execution Matrix Card */}
        <div className="rounded-2xl bg-white p-6 border border-[#EDE5D8] shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#ECE8E0]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8C827A] font-semibold">
                Execution Velocity
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#1C1C17]">
                {completedCount} of {tasks.length} Completed
              </span>
              <div className="w-20 h-2 bg-[#F7F3EB] rounded-full overflow-hidden border border-[#ECE8E0]">
                <div
                  className="h-full bg-gradient-to-r from-[#D97706] to-[#10B981] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {tasks.map((task) => {
              const taskId = `task-rank-${task.rank}-${task.title}`;
              const isDone = completedTaskIds.includes(taskId);

              return (
                <div
                  key={taskId}
                  onClick={() => toggleTaskCompletion(taskId)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                    isDone
                      ? 'bg-[#F7F3EB]/60 border-[#ECE8E0] opacity-70'
                      : 'bg-white hover:bg-[#FDF9F1] border-[#EDE5D8] hover:border-[#D97706]/40 shadow-xs'
                  }`}
                >
                  {/* Numbered / Checkmark Button */}
                  <button
                    type="button"
                    className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all ${
                      isDone
                        ? 'bg-[#B45309] text-white shadow-xs'
                        : 'border border-[#FDE68A] bg-[#FEF3C7] text-[#B45309] text-xs font-mono font-bold'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 text-white stroke-[3]" /> : task.rank}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm sm:text-base font-medium leading-snug ${
                        isDone ? 'text-[#8C827A] line-through' : 'text-[#1C1C17]'
                      }`}
                    >
                      {task.title}
                    </div>
                    {task.reason && (
                      <div className="text-xs text-[#8C827A] mt-1.5 flex items-center gap-1">
                        <span className="text-[#B45309] font-mono font-medium uppercase text-[10px]">Why:</span>
                        <span className="text-[#54524F]">{task.reason}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#ECE8E0]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C827A]">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span>Priorities Anchored</span>
          </div>

          <button
            onClick={onAdvance}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B45309] to-[#903F00] text-white font-medium text-xs shadow-sm hover:brightness-105 transition-all active:scale-[0.98]"
          >
            <span>Lock Priorities & Check Inbox</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
