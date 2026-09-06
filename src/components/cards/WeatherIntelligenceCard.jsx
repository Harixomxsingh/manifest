import React from 'react';
import { Sun, CloudRain, Wind, Umbrella, Shirt, Navigation, CloudSun, CloudFog, CloudLightning } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WeatherIntelligenceCard() {
  const { weatherData, briefing, isGenerating } = useApp();

  const tactics = briefing?.weatherTactics || weatherData?.tactics || {
    summary: 'Optimal mild morning with clear daytime skies.',
    clothingAdvice: 'Breathable executive layering (light knit or tailored overshirt).',
    commuteOrOutdoorGuidance: 'Roadways clear. Ideal conditions for a morning outdoor walk between 8 AM and 10 AM.'
  };

  const high = weatherData?.highTemp ?? 72;
  const low = weatherData?.lowTemp ?? 54;
  const unit = weatherData?.unit ?? '°F';
  const rainProb = weatherData?.maxRainProb ?? 10;
  const label = weatherData?.weatherLabel ?? 'Mainly Clear';

  if (isGenerating && !weatherData) {
    return (
      <div className="rounded-2xl glass-card p-6 border border-white/[0.08] animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-20 bg-slate-800/40 rounded-xl mb-3" />
        <div className="h-12 bg-slate-800/30 rounded-lg" />
      </div>
    );
  }

  return (
    <section aria-labelledby="weather-intel-title" className="rounded-3xl glass-card relative overflow-hidden border border-white/[0.08] bg-[#0B0F17]/90">
      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono-code">
              Pillar 3 • 12-Hour Weather Intelligence
            </span>
          </div>

          <span className="text-[11px] font-medium text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-mono-code">
            06:00 – 18:00 Window
          </span>
        </div>

        {/* Temperature & Rain Overview Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {/* Temp Range Card */}
          <div className="rounded-2xl p-4 bg-slate-900/90 border border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase font-mono-code">
                Day Range
              </div>
              <div className="text-2xl font-bold text-white font-mono-code mt-0.5">
                {high}{unit} <span className="text-slate-500 font-normal text-lg">/ {low}{unit}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-amber-300 block">{label}</span>
              <span className="text-[11px] text-slate-400 font-mono-code">Peak {high}{unit}</span>
            </div>
          </div>

          {/* Rain Probability Card */}
          <div className="rounded-2xl p-4 bg-slate-900/90 border border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase font-mono-code">
                Rain Risk
              </div>
              <div className="text-2xl font-bold text-white font-mono-code mt-0.5 flex items-center gap-1.5">
                <span>{rainProb}%</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Umbrella className="w-5 h-5" />
            </div>
          </div>

          {/* Tactical Condition Summary */}
          <div className="rounded-2xl p-4 bg-slate-900/90 border border-white/[0.08] flex flex-col justify-center">
            <div className="text-[11px] font-semibold text-slate-400 uppercase font-mono-code mb-1">
              Condition Overview
            </div>
            <p className="text-xs font-medium text-slate-200 line-clamp-2">
              {tactics.summary}
            </p>
          </div>
        </div>

        {/* Tactical Guidance (Clothing + Commute) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Clothing Advice */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/[0.08] flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                Attire Strategy
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tactics.clothingAdvice}
              </p>
            </div>
          </div>

          {/* Commute / Outdoor Guidance */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/[0.08] flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
                Commute & Outdoor Window
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tactics.commuteOrOutdoorGuidance}
              </p>
            </div>
          </div>
        </div>

        {/* Hourly Micro Sparkline / Timeline */}
        {weatherData?.daytimeEntries?.length > 0 && (
          <div className="pt-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
              {weatherData.daytimeEntries.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center min-w-[52px] p-2 rounded-xl bg-slate-900/50 border border-white/[0.04] text-center"
                >
                  <span className="text-[10px] text-slate-400 font-mono-code mb-1">{item.hour}</span>
                  <span className="text-xs font-bold text-white font-mono-code">{item.temp}°</span>
                  {item.rainProb > 20 ? (
                    <span className="text-[9px] text-cyan-400 font-medium mt-1">{item.rainProb}% rain</span>
                  ) : (
                    <span className="text-[9px] text-slate-600 mt-1">dry</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
