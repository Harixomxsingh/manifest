import React from 'react';
import { ShieldCheck, AlertCircle, Sun, CloudRain, BookOpen, Clock, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HeroStatusBar() {
  const { briefing, weatherData, todayArticle, isGenerating } = useApp();

  const isAllClear = briefing?.inboxTriage?.status === 'ALL_CLEAR';
  const dailyPrinciple = briefing?.calendarTriage?.dailyPrinciple || 'Deep Work Sprint';

  if (isGenerating && !briefing) {
    return (
      <div className="w-full rounded-2xl bg-slate-900/40 border border-white/[0.06] p-4 animate-pulse flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-48" />
        <div className="h-4 bg-slate-800 rounded w-24" />
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl glass-card p-4 sm:p-5 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/[0.09]">
      <div className="absolute top-0 right-0 w-64 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        {/* Left: Inbox Status Highlight */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isAllClear
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {isAllClear ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                Inbox Status
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  isAllClear
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                }`}
              >
                {isAllClear ? 'ALL CLEAR' : 'ACTION NEEDED'}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-200 mt-0.5 line-clamp-1">
              {briefing?.inboxTriage?.summary || 'All clear. Zero friction.'}
            </p>
          </div>
        </div>

        {/* Right: Quick Micro Metrics */}
        <div className="flex items-center flex-wrap gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
          {/* Weather Pill */}
          {weatherData && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/60 border border-white/[0.06] text-xs text-slate-300">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-white">
                {weatherData.currentTemp}{weatherData.unit}
              </span>
              <span className="text-slate-400">• {weatherData.weatherLabel}</span>
            </div>
          )}

          {/* Principle Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/60 border border-white/[0.06] text-xs text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-200 font-medium truncate max-w-[140px] sm:max-w-none">
              {dailyPrinciple}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
