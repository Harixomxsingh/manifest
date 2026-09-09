import React, { useState } from 'react';
import { ArrowRight, Sun, CloudRain, Cloud, Shirt, Footprints, MapPin, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PhaseClimate({ onAdvance }) {
  const {
    weatherData,
    activeLocation,
    setIsLocationModalOpen,
    refreshLocationFromGps
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const high = weatherData?.highTemp ?? 24;
  const low = weatherData?.lowTemp ?? 16;
  const unit = weatherData?.unit ?? '°C';
  const label = weatherData?.weatherLabel ?? 'Clear Sky';
  const locationName = weatherData?.locationName || activeLocation?.name || 'San Francisco, USA';
  const hourlyStrip = weatherData?.hourlyStrip || [
    { hour: '07:00', temp: low },
    { hour: '10:00', temp: Math.round((high + low) / 2) },
    { hour: '13:00', temp: high },
    { hour: '16:00', temp: high - 2 },
    { hour: '19:00', temp: low + 2 }
  ];

  const tactics = weatherData?.tactics || {
    clothingAdvice: 'Breathable natural fabrics. Comfortable morning temperature before midday.',
    commuteOrOutdoorGuidance: 'Optimal dry conditions. Complete errands before afternoon rain windows.'
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refreshLocationFromGps) {
      await refreshLocationFromGps();
    }
    setIsRefreshing(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Phase Header Tracker */}
      <div className="w-full mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-400 tracking-wider">
            PHASE 04 OF 05
          </span>
          <span className="text-xs font-bold text-amber-800">
            Atmospheric Climate
          </span>
        </div>
        <div className="w-full h-1 bg-stone-200/70 rounded-full overflow-hidden">
          <div className="h-full bg-amber-600 rounded-full w-4/5 transition-all duration-300" />
        </div>
      </div>

      {/* Main Climate Card */}
      <div className="w-full bg-white border border-stone-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 mb-6 shadow-sm">
        {/* Location & Refresh Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsLocationModalOpen?.(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs font-bold text-amber-900 hover:bg-amber-100/80 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="truncate max-w-[180px] sm:max-w-[240px]">{locationName.split(',')[0]}</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-50"
            title="Refresh weather"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        </div>

        {/* Temperature & Weather Symbol */}
        <div className="flex flex-col items-center my-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center mb-3 text-amber-600 shadow-inner">
            <Sun className="w-8 h-8" strokeWidth={1.8} />
          </div>
          <div className="text-4xl sm:text-5xl font-serif text-stone-900 font-light">
            {high}{unit}
          </div>
          <div className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
            {label} • Low {low}{unit}
          </div>
        </div>

        {/* Hourly Forecast Strip */}
        <div className="flex gap-2.5 overflow-x-auto py-3 no-scrollbar border-y border-stone-100 my-4">
          {hourlyStrip.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center bg-stone-50/80 rounded-xl px-3 py-2 min-w-[58px] gap-1.5 border border-stone-100 shrink-0"
            >
              <span className="text-[10px] font-mono text-stone-400">{item.hour}</span>
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-bold text-stone-800">{item.temp}°</span>
            </div>
          ))}
        </div>

        {/* Minimal Tactics Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <div className="flex items-start gap-2.5 bg-stone-50/90 rounded-xl p-3 border border-stone-100">
            <Shirt className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-700 leading-relaxed">{tactics.clothingAdvice}</p>
          </div>

          <div className="flex items-start gap-2.5 bg-stone-50/90 rounded-xl p-3 border border-stone-100">
            <Footprints className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-700 leading-relaxed">{tactics.commuteOrOutdoorGuidance}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onAdvance}
        className="w-full flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-950 text-white font-bold py-3.5 px-6 rounded-full shadow-md shadow-amber-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
      >
        <span>Proceed to Summary</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
