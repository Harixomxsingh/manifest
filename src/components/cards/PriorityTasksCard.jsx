import React from 'react';
import { CheckSquare, CheckCircle2, Circle, ArrowRight, Target, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
      <div className="rounded-2xl glass-card p-6 border border-white/[0.08] animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-12 bg-slate-800/40 rounded-xl mb-3" />
        <div className="h-12 bg-slate-800/40 rounded-xl" />
      </div>
    );
  }

  return (
    <section aria-labelledby="priority-tasks-title" className="rounded-3xl glass-card relative overflow-hidden border border-white/[0.08] bg-[#0B0F17]/90">
      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono-code">
              Pillar 5 • High-Leverage Tasks (Top {tasks.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code font-semibold text-slate-300">
              {completedCount} / {tasks.length} Done
            </span>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 id="priority-tasks-title" className="text-base sm:text-lg font-bold text-white mb-4">
          Ruthless Execution Focus
        </h2>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map((task) => {
            const taskId = `task-rank-${task.rank}-${task.title}`;
            const isCompleted = completedTaskIds.includes(taskId);

            return (
              <div
                key={taskId}
                onClick={() => toggleTaskCompletion(taskId)}
                className={`group rounded-2xl p-4 border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75'
                    : 'bg-slate-900/80 hover:bg-slate-850 border-white/[0.08] hover:border-amber-500/40 shadow-sm'
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  aria-label={`Mark task ${task.rank} complete`}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'border-2 border-slate-600 group-hover:border-amber-400 bg-slate-800/60'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />
                  ) : (
                    <span className="text-[11px] font-mono-code font-bold text-slate-400 group-hover:text-amber-300">
                      {task.rank}
                    </span>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div
                    className={`text-sm sm:text-base font-semibold tracking-tight transition-all ${
                      isCompleted ? 'text-slate-400 line-through' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </div>
                  {task.reason && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="text-amber-400/80 font-medium">Why:</span>
                      <span className="text-slate-300">{task.reason}</span>
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
