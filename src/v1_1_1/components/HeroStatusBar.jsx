import React from 'react';
import { ShieldCheck, AlertCircle, Sun, Zap, BookOpen, Compass, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function HeroStatusBar() {
  const { briefing, weatherData, todayArticle, isGenerating } = useApp();

  const isAllClear = briefing?.inboxTriage?.status === 'ALL_CLEAR';
  const dailyPrinciple = briefing?.calendarTriage?.dailyPrinciple || 'Deep Work Sprint';

  if (isGenerating && !briefing) {
    return (
      <div className="rounded-3xl bg-slate-900/40 border border-white/[0.06] p-4 animate-pulse flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-48" />
        <div className="h-4 bg-slate-800 rounded w-24" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl glass-card p-5 sm:p-6 border border-white/[0.09] bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-[#0A0E17]/90 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        {/* Left: Signal Summary */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
              isAllClear
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {isAllClear ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-400 animate-pulse" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-slate-400">
                Morning Signal
              </span>
              <span
                className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full ${
                  isAllClear
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                }`}
              >
                {isAllClear ? '● ALL CLEAR' : '▲ ACTION REQUIRED'}
              </span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-200 leading-snug line-clamp-1">
              {briefing?.inboxTriage?.summary || 'Zero friction detected. Proceed with high-leverage work.'}
            </p>
          </div>
        </div>

        {/* Right: Quick Micro Metrics Pill Strip */}
        <div className="flex items-center flex-wrap gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
          {weatherData && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-850/80 border border-white/[0.07] text-xs text-slate-300 font-mono-code">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-white">
                {weatherData.currentTemp}{weatherData.unit}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{weatherData.weatherLabel}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-850/80 border border-white/[0.07] text-xs text-slate-300 font-mono-code">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-200 font-semibold">{dailyPrinciple}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
