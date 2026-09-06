import React from 'react';
import { Sun, Umbrella, Shirt, Navigation } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function WeatherIntelligenceCard() {
  const { weatherData, briefing, isGenerating } = useApp();

  const tactics = briefing?.weatherTactics || weatherData?.tactics || {
    summary: 'Optimal mild morning with clear daytime skies.',
    clothingAdvice: 'Breathable executive layering (light knit or tailored overshirt).',
    commuteOrOutdoorGuidance: 'Roadways clear. Ideal conditions for a morning walk between 8 AM and 10 AM.'
  };

  const high = weatherData?.highTemp ?? 72;
  const low = weatherData?.lowTemp ?? 54;
  const unit = weatherData?.unit ?? '°F';
  const rainProb = weatherData?.maxRainProb ?? 10;
  const label = weatherData?.weatherLabel ?? 'Mainly Clear';

  if (isGenerating && !weatherData) {
    return (
      <div className="rounded-3xl glass-card p-6 border border-white/[0.08] animate-pulse h-full">
        <div className="h-5 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-16 bg-slate-800/40 rounded-2xl mb-2" />
        <div className="h-14 bg-slate-800/30 rounded-xl" />
      </div>
    );
  }

  return (
    <section aria-labelledby="v111-weather-title" className="rounded-3xl glass-card relative overflow-hidden border border-white/[0.08] bg-[#0A0E17]/90 p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-slate-400">
              Pillar 03 • 12-Hour Weather Tactics
            </span>
          </div>

          <span className="text-[10px] font-mono-code text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            06:00 – 18:00
          </span>
        </div>

        {/* Temperature & Risk Overview */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/[0.06]">
            <div className="text-[10px] font-mono-code uppercase text-slate-400">Range</div>
            <div className="text-xl font-bold font-mono-code text-white mt-0.5">
              {high}{unit} <span className="text-xs text-slate-500 font-normal">/ {low}{unit}</span>
            </div>
            <div className="text-[11px] text-amber-300/90 font-medium truncate mt-0.5">{label}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono-code uppercase text-slate-400">Precipitation</div>
              <div className="text-xl font-bold font-mono-code text-cyan-400 mt-0.5">
                {rainProb}%
              </div>
              <div className="text-[11px] text-slate-400 font-mono-code">Peak Risk</div>
            </div>
            <Umbrella className="w-6 h-6 text-cyan-400/80 stroke-[1.5]" />
          </div>
        </div>

        {/* Tactical Guidance (Attire & Commute) */}
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05] flex items-start gap-2.5 text-xs">
            <Shirt className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span className="text-slate-300 leading-snug">{tactics.clothingAdvice}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05] flex items-start gap-2.5 text-xs">
            <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span className="text-slate-300 leading-snug">{tactics.commuteOrOutdoorGuidance}</span>
          </div>
        </div>

        {/* Hourly Micro Sparkline */}
        {weatherData?.daytimeEntries?.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
            {weatherData.daytimeEntries.slice(0, 6).map((item, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[42px] text-center">
                <span className="text-[9px] text-slate-500 font-mono-code">{item.hour.replace(':00', '')}</span>
                <span className="text-xs font-bold font-mono-code text-slate-200">{item.temp}°</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
