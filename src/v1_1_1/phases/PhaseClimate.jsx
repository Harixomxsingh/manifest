import React, { useState } from 'react';
import { ArrowRight, Shirt, Umbrella, Wind, Check, Sun, CloudRain, MapPin, Navigation, RefreshCw, AlertCircle, CloudSun, Cloud, Droplets } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getWmoInfo } from '../../services/weatherService';
import { firePartyPopper } from '../../utils/confettiHelper';

export default function PhaseClimate({ onAdvance }) {
  const { weatherData, briefing, activeLocation, locationStatus, setIsLocationModalOpen, refreshLocationFromGps } = useApp();
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isRefreshingGps, setIsRefreshingGps] = useState(false);

  const tactics = briefing?.weatherTactics || weatherData?.tactics || {
    summary: 'Optimal mild morning with clear skies before humidity spikes.',
    clothingAdvice: 'Breathable natural fabrics. Morning is dry and cool; humidity spikes sharply after midday.',
    commuteOrOutdoorGuidance: 'Carry an umbrella. Complete outdoor errands before 1:30 PM to beat afternoon rain windows.'
  };

  const high = weatherData?.highTemp ?? 28;
  const low = weatherData?.lowTemp ?? 19;
  const unit = weatherData?.unit ?? '°C';
  const rainProb = weatherData?.maxRainProb ?? 0;
  const weatherLabel = weatherData?.weatherLabel ?? 'Clear Sky';
  const locationName = weatherData?.locationName || activeLocation?.name || 'San Francisco, CA, USA';

  // Extract a clean 5-point daytime hourly strip (6 AM to 6 PM)
  const hourlyStrip = weatherData?.daytimeEntries && weatherData.daytimeEntries.length > 0
    ? weatherData.daytimeEntries.filter((_, idx) => idx % Math.max(1, Math.floor(weatherData.daytimeEntries.length / 5))).slice(0, 5)
    : [
        { hour: '07:00', temp: low, code: 0 },
        { hour: '10:00', temp: Math.round((high + low) / 2), code: 1 },
        { hour: '13:00', temp: high, code: 2 },
        { hour: '16:00', temp: high - 2, code: 51 },
        { hour: '19:00', temp: low + 3, code: 0 }
      ];

  const handleAcknowledge = (e) => {
    setIsAcknowledged(true);
    // Trigger celebratory atmospheric party popper!
    firePartyPopper(e, {
      particleCount: 70,
      spread: 85,
      pitch: 1.15
    });
    setTimeout(() => {
      onAdvance();
    }, 280);
  };

  const handleGpsRefresh = async () => {
    setIsRefreshingGps(true);
    await refreshLocationFromGps();
    setIsRefreshingGps(false);
  };

  return (
    <div className="w-full max-w-[42rem] mx-auto flex flex-col items-center py-4 sm:py-8 animate-fadeIn">
      {/* Top Phase Header Tracker */}
      <div className="w-full mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[#8C827A] text-[11px] font-mono tracking-widest uppercase">
          <span>Phase 03 of 04</span>
          <span className="text-[#B45309] font-semibold">The Outside World</span>
        </div>
        <div className="w-full h-1 bg-[#ECE8E0] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#D97706] to-[#B45309] rounded-full w-[75%]" />
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">
        {/* Header Lockup: Title & Location Pill */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              <span className="text-[11px] font-mono text-[#8C827A] uppercase tracking-widest font-semibold">
                Climate & Atmospheric Tactics
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl text-[#1C1C17] tracking-tight font-normal"
              style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
            >
              Today's Atmosphere
            </h2>
          </div>

          {/* Minimal Location Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#EDE5D8] shadow-xs text-xs font-mono self-start sm:self-auto">
            <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span className="text-[#1C1C17] font-semibold max-w-[180px] sm:max-w-[200px] truncate" title={locationName}>
              {locationName}
            </span>
            {activeLocation?.source === 'gps' && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                GPS
              </span>
            )}
            <div className="h-3 w-px bg-[#ECE8E0]" />
            <button
              onClick={handleGpsRefresh}
              disabled={isRefreshingGps}
              title="Refresh GPS location"
              className="text-[#8C827A] hover:text-[#D97706] transition-colors p-0.5"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingGps ? 'animate-spin text-[#D97706]' : ''}`} />
            </button>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-[#B45309] hover:underline text-[11px] font-semibold"
            >
              Change
            </button>
          </div>
        </div>

        {/* Permission Alert (Subtle) */}
        {activeLocation?.isPermissionDenied && (
          <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 text-[#78350F] text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
              <span className="truncate text-[11px]">
                Browser location blocked. Using saved city: <strong>{locationName}</strong>
              </span>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-[#B45309] underline text-[11px] font-semibold shrink-0"
            >
              Choose City
            </button>
          </div>
        )}

        {/* Master Minimal Climate Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#ECE8E0] shadow-[0_4px_24px_rgba(180,83,9,0.04)] flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D97706]/40 to-transparent" />

          {/* Hero Temperature Lockup */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#ECE8E0]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] flex items-center justify-center shadow-xs shrink-0">
                <Sun className="w-7 h-7 text-[#D97706]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2.5">
                  <span
                    className="text-4xl sm:text-5xl text-[#1C1C17] tracking-tighter font-normal leading-none"
                    style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
                  >
                    {high}{unit}
                  </span>
                  <span className="text-sm font-mono text-[#8C827A]">/ {low}{unit} low</span>
                </div>
                <div className="text-xs font-mono text-[#B45309] font-bold uppercase tracking-wider mt-1">
                  {weatherLabel}
                </div>
              </div>
            </div>

            {/* Precipitation Window Pill */}
            {rainProb > 15 ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FEF3C7]/80 border border-[#FDE68A] text-[#903F00] text-xs font-mono font-semibold self-start sm:self-auto">
                <CloudRain className="w-4 h-4 text-[#D97706]" />
                <span>{rainProb}% Rain Probability Expected</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F7F3EB] border border-[#ECE8E0] text-[#54524F] text-xs font-mono self-start sm:self-auto">
                <Sun className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Optimal Dry Conditions</span>
              </div>
            )}
          </div>

          {/* 12-Hour Minimalist Horizon Strip */}
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold">
              12-Hour Daylight Window (06:00 – 18:00)
            </div>
            <div className="grid grid-cols-5 gap-2 pt-1">
              {hourlyStrip.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F7F3EB]/70 border border-[#ECE8E0] flex flex-col items-center justify-center gap-1.5 text-center"
                >
                  <span className="text-[10px] font-mono text-[#8C827A]">{item.hour}</span>
                  <span className="text-sm font-bold text-[#1C1C17]">{item.temp}°</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]/70" />
                </div>
              ))}
            </div>
          </div>

          {/* Concise Tactical Guidance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Attire */}
            <div className="p-4 rounded-2xl bg-[#F7F3EB] border border-[#ECE8E0] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#EDE5D8] flex items-center justify-center text-[#B45309] shrink-0 mt-0.5 shadow-xs">
                <Shirt className="w-4 h-4 text-[#D97706]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C827A]">
                  Attire Strategy
                </span>
                <p className="text-xs text-[#1C1C17] leading-relaxed">
                  {tactics.clothingAdvice}
                </p>
              </div>
            </div>

            {/* Commute / Transit */}
            <div className="p-4 rounded-2xl bg-[#F7F3EB] border border-[#ECE8E0] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#EDE5D8] flex items-center justify-center text-[#B45309] shrink-0 mt-0.5 shadow-xs">
                <Umbrella className="w-4 h-4 text-[#D97706]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C827A]">
                  Transit & Errands
                </span>
                <p className="text-xs text-[#1C1C17] leading-relaxed">
                  {tactics.commuteOrOutdoorGuidance}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#ECE8E0]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C827A]">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span>Open-Meteo • Zero-Latency Keyless Feed</span>
          </div>

          <button
            onClick={handleAcknowledge}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-medium text-xs shadow-md hover:brightness-105 transition-all active:scale-[0.98]"
          >
            <span>{isAcknowledged ? 'Acknowledged' : "Acknowledge & Proceed"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

