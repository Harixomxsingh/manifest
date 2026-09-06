import React from 'react';
import { Target, CheckCircle2, Circle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function PriorityTasksCard() {
  const { briefing, completedTaskIds, toggleTaskCompletion, isGenerating } = useApp();

  const tasks = briefing?.prioritizedTasks || [
    { rank: 1, title: 'Sign and return the Series B term sheet indemnity addendum', reason: 'High leverage milestone for capital allocation' },
    { rank: 2, title: 'Approve the Q3 vector migration manifest before 2:00 PM deploy', reason: 'Blocks production infrastructure latency upgrade' },
    { rank: 3, title: 'Review key hire offer package for Head of Growth Engineering', reason: 'Critical leadership recruiting pipeline' }
  ];

  const completedCount = tasks.filter((t) =>
    completedTaskIds.includes(`task-rank-${t.rank}-${t.title}`)
  ).length;

  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (isGenerating && !briefing) {
    return (
      <div className="rounded-3xl glass-card p-6 border border-white/[0.08] animate-pulse h-full">
        <div className="h-5 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-14 bg-slate-800/40 rounded-2xl mb-2" />
        <div className="h-14 bg-slate-800/40 rounded-2xl" />
      </div>
    );
  }

  return (
    <section aria-labelledby="v111-tasks-title" className="rounded-3xl glass-card relative overflow-hidden border border-white/[0.08] bg-[#0A0E17]/90 p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-slate-400">
              Pillar 05 • Execution Matrix
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono-code text-slate-400 font-semibold">
              {completedCount}/{tasks.length}
            </span>
            <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 id="v111-tasks-title" className="text-lg font-bold text-white mb-3 font-editorial">
          High-Leverage Focus
        </h2>

        {/* Tasks List */}
        <div className="space-y-2.5">
          {tasks.map((task) => {
            const taskId = `task-rank-${task.rank}-${task.title}`;
            const isDone = completedTaskIds.includes(taskId);

            return (
              <div
                key={taskId}
                onClick={() => toggleTaskCompletion(taskId)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/25 opacity-70'
                    : 'bg-slate-900/90 hover:bg-slate-850 border-white/[0.07] hover:border-amber-500/35'
                }`}
              >
                {/* Custom Numbered Checkbox */}
                <button
                  type="button"
                  className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'border border-slate-600 bg-slate-800 text-[10px] font-mono-code font-bold text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : task.rank}
                </button>

                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs sm:text-sm font-semibold leading-snug ${
                      isDone ? 'text-slate-400 line-through' : 'text-slate-100'
                    }`}
                  >
                    {task.title}
                  </div>
                  {task.reason && (
                    <div className="text-[11px] text-slate-400 mt-1 truncate">
                      <span className="text-amber-400/90 font-mono-code font-medium">Why: </span>
                      {task.reason}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
