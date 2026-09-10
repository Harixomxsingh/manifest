import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowRight,
  Sun,
  CloudRain,
  CloudDrizzle,
  Cloud,
  CloudSun,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Shirt,
  Footprints,
  MapPin,
  RefreshCw,
  Umbrella,
  Droplets,
  Wind,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getWmoInfo } from '../../services/weatherService';

/**
 * Determine weather category from code or label
 */
function categorizeWeather(code, label = '') {
  const lbl = (label || '').toLowerCase();

  // Thunderstorm
  if (code === 95 || code === 96 || lbl.includes('thunder') || lbl.includes('storm') || lbl.includes('lightning')) {
    return 'thunderstorm';
  }
  // Heavy Rain / Showers
  if (code === 65 || code === 82 || lbl.includes('heavy rain') || lbl.includes('violent')) {
    return 'heavy_rain';
  }
  // Moderate / Slight Rain
  if (code === 61 || code === 63 || code === 80 || code === 81 || lbl.includes('rain') || lbl.includes('shower')) {
    return 'rain';
  }
  // Drizzle
  if (code === 51 || code === 53 || code === 55 || lbl.includes('drizzle')) {
    return 'drizzle';
  }
  // Snow
  if (code === 71 || code === 73 || code === 75 || lbl.includes('snow') || lbl.includes('sleet') || lbl.includes('blizzard')) {
    return 'snow';
  }
  // Fog / Mist
  if (code === 45 || code === 48 || lbl.includes('fog') || lbl.includes('mist') || lbl.includes('haze')) {
    return 'fog';
  }
  // Overcast
  if (code === 3 || lbl.includes('overcast')) {
    return 'overcast';
  }
  // Partly Cloudy
  if (code === 2 || lbl.includes('partly')) {
    return 'partly_cloudy';
  }
  // Clear / Sunny
  return 'clear';
}

/**
 * Convert hour string like "6 AM", "12 PM", "1 PM", "13:00" to 24-hour integer
 */
function parseHourStringTo24(hourStr) {
  if (typeof hourStr === 'number') return hourStr;
  if (!hourStr) return 12;
  const str = String(hourStr).trim();

  // Handle "13:00" or "07:00"
  if (str.includes(':')) {
    const parts = str.split(':');
    return parseInt(parts[0], 10) || 12;
  }

  // Handle "1 PM" or "6 AM"
  const upper = str.toUpperCase();
  const num = parseInt(upper.replace(/[^0-9]/g, ''), 10) || 12;
  if (upper.includes('PM') && num < 12) return num + 12;
  if (upper.includes('AM') && num === 12) return 0;
  return num;
}

/**
 * Get matching icon component for an hourly item
 */
function getHourlyIcon(code, rainProb = 0) {
  const cat = categorizeWeather(code);
  switch (cat) {
    case 'thunderstorm':
      return CloudLightning;
    case 'heavy_rain':
    case 'rain':
      return CloudRain;
    case 'drizzle':
      return CloudDrizzle;
    case 'snow':
      return CloudSnow;
    case 'fog':
      return CloudFog;
    case 'overcast':
      return Cloud;
    case 'partly_cloudy':
      return rainProb > 30 ? CloudDrizzle : CloudSun;
    case 'clear':
    default:
      return rainProb > 40 ? CloudDrizzle : Sun;
  }
}

/**
 * Apple/Samsung Weather Style Hero Animated Centerpiece
 */
function WeatherHeroScene({ category, label, temp, low, unit, hourLabel, isCurrentHour }) {
  return (
    <div className="flex flex-col items-center justify-center my-3 relative select-none">
      {/* Dynamic Animated Weather Centerpiece */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-2">
        {/* 1. RAIN & DRIZZLE HERO */}
        {(category === 'rain' || category === 'drizzle' || category === 'heavy_rain') && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Ambient Water Aura */}
            <div className="absolute inset-2 rounded-full bg-cyan-400/10 blur-xl animate-pulse" />

            {/* Stylized Cloud */}
            <div className="relative z-10 animate-weather-cloud-drift">
              <svg className="w-20 h-20 text-slate-700 drop-shadow-md" viewBox="0 0 64 64" fill="currentColor">
                <path d="M46 44H18a12 12 0 0 1-2.6-23.7A16 16 0 0 1 47.4 22 13 13 0 0 1 46 44z" />
              </svg>
            </div>

            {/* Falling Animated Raindrops */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex justify-center gap-2.5 pt-14">
              <span
                className="w-1 h-3.5 bg-gradient-to-b from-cyan-300 to-blue-500 rounded-full"
                style={{ animation: 'weather-raindrop 1.1s linear infinite', animationDelay: '0s' }}
              />
              <span
                className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"
                style={{ animation: 'weather-raindrop 0.9s linear infinite', animationDelay: '0.35s' }}
              />
              <span
                className="w-1 h-3.5 bg-gradient-to-b from-cyan-300 to-blue-500 rounded-full"
                style={{ animation: 'weather-raindrop 1.2s linear infinite', animationDelay: '0.7s' }}
              />
              <span
                className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"
                style={{ animation: 'weather-raindrop 1.0s linear infinite', animationDelay: '0.2s' }}
              />
            </div>
          </div>
        )}

        {/* 2. THUNDERSTORM HERO */}
        {category === 'thunderstorm' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Ambient Storm Aura */}
            <div className="absolute inset-0 rounded-full bg-amber-500/15 blur-xl animate-weather-lightning" />

            {/* Dark Storm Cloud */}
            <div className="relative z-10 animate-weather-cloud-drift">
              <svg className="w-20 h-20 text-slate-800 drop-shadow-lg" viewBox="0 0 64 64" fill="currentColor">
                <path d="M46 42H18a12 12 0 0 1-2.6-23.7A16 16 0 0 1 47.4 20 13 13 0 0 1 46 42z" />
              </svg>
            </div>

            {/* Pulsing Lightning Bolt */}
            <div className="absolute z-30 top-11 animate-weather-lightning">
              <CloudLightning className="w-10 h-10 text-amber-400 fill-amber-400/40 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
            </div>

            {/* Fast Raindrops */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex justify-center gap-3 pt-14">
              <span
                className="w-1 h-4 bg-gradient-to-b from-amber-200 to-blue-400 rounded-full"
                style={{ animation: 'weather-raindrop 0.7s linear infinite', animationDelay: '0.1s' }}
              />
              <span
                className="w-1 h-4 bg-gradient-to-b from-amber-300 to-blue-500 rounded-full"
                style={{ animation: 'weather-raindrop 0.65s linear infinite', animationDelay: '0.4s' }}
              />
            </div>
          </div>
        )}

        {/* 3. SUNNY / CLEAR HERO */}
        {category === 'clear' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Radiant Solar Corona Halo */}
            <div className="absolute inset-1 rounded-full bg-amber-400/25 blur-xl animate-weather-sun-pulse" />

            {/* Rotating Solar Rays */}
            <div className="absolute inset-0 flex items-center justify-center animate-weather-sun-spin">
              <svg className="w-24 h-24 text-amber-400/60" viewBox="0 0 100 100" fill="currentColor">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <rect
                    key={deg}
                    x="48"
                    y="6"
                    width="4"
                    height="12"
                    rx="2"
                    transform={`rotate(${deg} 50 50)`}
                  />
                ))}
              </svg>
            </div>

            {/* Golden Core Sun Orb */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 shadow-[0_0_24px_rgba(245,158,11,0.6)] border-2 border-amber-200/80 z-10 flex items-center justify-center animate-weather-sun-pulse">
              <Sun className="w-7 h-7 text-amber-950 stroke-[2.2]" />
            </div>
          </div>
        )}

        {/* 4. PARTLY CLOUDY HERO */}
        {category === 'partly_cloudy' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Sun Peeking Behind */}
            <div className="absolute top-2 right-4 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-[0_0_18px_rgba(245,158,11,0.5)] animate-weather-sun-pulse flex items-center justify-center">
              <Sun className="w-6 h-6 text-amber-950 stroke-[2]" />
            </div>

            {/* Floating Soft Cloud */}
            <div className="relative z-10 top-3 animate-weather-cloud-drift">
              <svg className="w-20 h-20 text-slate-600/90 drop-shadow-md" viewBox="0 0 64 64" fill="currentColor">
                <path d="M46 44H18a12 12 0 0 1-2.6-23.7A16 16 0 0 1 47.4 22 13 13 0 0 1 46 44z" />
              </svg>
            </div>
          </div>
        )}

        {/* 5. OVERCAST / CLOUDY HERO */}
        {category === 'overcast' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Back Cloud */}
            <div className="absolute top-2 left-3 opacity-60 animate-weather-cloud-drift-reverse">
              <svg className="w-16 h-16 text-slate-400 drop-shadow-sm" viewBox="0 0 64 64" fill="currentColor">
                <path d="M46 44H18a12 12 0 0 1-2.6-23.7A16 16 0 0 1 47.4 22 13 13 0 0 1 46 44z" />
              </svg>
            </div>
            {/* Front Cloud */}
            <div className="relative z-10 top-2 animate-weather-cloud-drift">
              <svg className="w-20 h-20 text-slate-600 drop-shadow-md" viewBox="0 0 64 64" fill="currentColor">
                <path d="M46 44H18a12 12 0 0 1-2.6-23.7A16 16 0 0 1 47.4 22 13 13 0 0 1 46 44z" />
              </svg>
            </div>
          </div>
        )}

        {/* 6. SNOW HERO */}
        {category === 'snow' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-2 rounded-full bg-indigo-300/20 blur-xl animate-pulse" />
            <div className="relative z-10 animate-weather-cloud-drift">
              <svg className="w-20 h-20 text-slate-600 drop-shadow-md" viewBox="0 0 64 64" fill="currentColor">
                <path d="M46 44H18a12 12 0 0 1-2.6-23.7A16 16 0 0 1 47.4 22 13 13 0 0 1 46 44z" />
              </svg>
            </div>
            {/* Drifting Snowflakes */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex justify-center gap-3 pt-13">
              <span style={{ animation: 'weather-snow-float 2.2s linear infinite', animationDelay: '0s' }}>❄️</span>
              <span style={{ animation: 'weather-snow-float 2.6s linear infinite', animationDelay: '0.8s' }}>❄️</span>
              <span style={{ animation: 'weather-snow-float 2.0s linear infinite', animationDelay: '0.4s' }}>❄️</span>
            </div>
          </div>
        )}

        {/* 7. FOG / MIST HERO */}
        {category === 'fog' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-20 h-16 flex flex-col justify-center gap-2 animate-weather-fog">
              <div className="w-20 h-2 rounded-full bg-slate-400/80 shadow-xs" />
              <div className="w-16 h-2 rounded-full bg-slate-300/80 shadow-xs ml-2" />
              <div className="w-18 h-2 rounded-full bg-slate-400/80 shadow-xs" />
            </div>
          </div>
        )}
      </div>

      {/* Hero Temperature Readout */}
      <div className="text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-none mb-1">
        {temp}{unit}
      </div>

      {/* Condition Label & Selected Hour Indicator */}
      <div className="text-xs sm:text-sm font-semibold text-stone-600 flex items-center gap-1.5 mt-0.5">
        <span>{label}</span>
        <span className="text-stone-300">•</span>
        {isCurrentHour ? (
          <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
            Now
          </span>
        ) : (
          <span className="font-mono text-stone-500 text-xs">{hourLabel}</span>
        )}
        {low != null && (
          <>
            <span className="text-stone-300">•</span>
            <span className="font-mono text-stone-500 text-xs">Low {low}{unit}</span>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Ambient Atmospheric Particle Background (Apple / Samsung Weather Style)
 */
function AmbientCardAtmosphere({ category }) {
  if (category === 'rain' || category === 'drizzle' || category === 'heavy_rain') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 -z-0">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute w-0.5 h-6 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full"
            style={{
              left: `${(i * 8.5) + 3}%`,
              animation: `weather-rain-streak ${0.8 + (i % 4) * 0.25}s linear infinite`,
              animationDelay: `${(i * 0.18) % 1.2}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (category === 'thunderstorm') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute inset-0 bg-indigo-900/10 animate-weather-lightning" />
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute w-0.5 h-8 bg-gradient-to-b from-amber-300 to-blue-500 rounded-full opacity-40"
            style={{
              left: `${(i * 7.5) + 2}%`,
              animation: `weather-rain-streak ${0.6 + (i % 3) * 0.2}s linear infinite`,
              animationDelay: `${(i * 0.12) % 0.8}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (category === 'clear') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0 opacity-40">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-radial from-amber-300/30 via-amber-200/10 to-transparent blur-2xl animate-weather-sun-pulse" />
      </div>
    );
  }

  return null;
}

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
  const maxRainProb = weatherData?.maxRainProb ?? 0;

  // Global default category
  const dominantCategory = useMemo(() => {
    return categorizeWeather(weatherData?.weatherCode, label);
  }, [weatherData?.weatherCode, label]);

  // Hourly Strip Builder (12-Hour daytime entries or fallback)
  const hourlyStrip = useMemo(() => {
    if (weatherData?.daytimeEntries && weatherData.daytimeEntries.length > 0) {
      const entries = weatherData.daytimeEntries;
      if (entries.length <= 5) return entries;
      const step = (entries.length - 1) / 4;
      return [0, 1, 2, 3, 4].map((i) => entries[Math.round(i * step)]);
    }

    // Default 5-slot strip
    const isCold = high < 18;
    return [
      { hour: '6 AM', hour24: 6, temp: low, code: dominantCategory === 'rain' ? 61 : dominantCategory === 'drizzle' ? 51 : 0, rainProb: dominantCategory === 'rain' ? 80 : 5 },
      { hour: '9 AM', hour24: 9, temp: Math.round((high + low) / 2), code: dominantCategory === 'rain' ? 61 : dominantCategory === 'drizzle' ? 51 : 1, rainProb: dominantCategory === 'rain' ? 90 : 10 },
      { hour: '12 PM', hour24: 12, temp: high, code: dominantCategory === 'rain' ? 65 : dominantCategory === 'drizzle' ? 53 : (isCold ? 2 : 0), rainProb: dominantCategory === 'rain' ? 98 : 15 },
      { hour: '3 PM', hour24: 15, temp: high - 2, code: dominantCategory === 'rain' ? 61 : dominantCategory === 'drizzle' ? 51 : 2, rainProb: dominantCategory === 'rain' ? 75 : 10 },
      { hour: '6 PM', hour24: 18, temp: low + 2, code: dominantCategory === 'rain' ? 51 : 0, rainProb: dominantCategory === 'rain' ? 40 : 5 }
    ];
  }, [weatherData, high, low, dominantCategory]);

  // Automatically find the index closest to current local hour!
  const currentHourIndex = useMemo(() => {
    if (!hourlyStrip || hourlyStrip.length === 0) return 0;
    const nowH = new Date().getHours();
    let bestIdx = 0;
    let minDiff = 999;

    hourlyStrip.forEach((item, idx) => {
      const itemH = item.hour24 ?? parseHourStringTo24(item.hour);
      const diff = Math.abs(itemH - nowH);
      if (diff < minDiff) {
        minDiff = diff;
        bestIdx = idx;
      }
    });

    return bestIdx;
  }, [hourlyStrip]);

  // User-selected hourly slot (defaults automatically to the current local hour!)
  const [selectedHourIndex, setSelectedHourIndex] = useState(currentHourIndex);

  // Sync selected index whenever currentHourIndex changes (e.g., on mount or refresh)
  useEffect(() => {
    setSelectedHourIndex(currentHourIndex);
  }, [currentHourIndex]);

  // Selected item forecast details
  const activeHourlyItem = hourlyStrip[selectedHourIndex] || hourlyStrip[0] || {};
  const isCurrentHour = selectedHourIndex === currentHourIndex;

  const displayTemp = activeHourlyItem.temp ?? high;
  const displayCode = activeHourlyItem.code ?? weatherData?.weatherCode ?? 0;
  const displayLabel = activeHourlyItem.label || getWmoInfo(displayCode).label || label;
  const activeCategory = categorizeWeather(displayCode, displayLabel);
  const displayRainProb = activeHourlyItem.rainProb ?? maxRainProb;

  // Minimal, Punchy, Super Actionable Tactics (Executive 1-liners)
  const minimalTactics = useMemo(() => {
    const isHot = displayTemp >= 28;
    const isCold = displayTemp <= 14;
    const hasRain = activeCategory === 'rain' || activeCategory === 'drizzle' || activeCategory === 'heavy_rain' || activeCategory === 'thunderstorm' || displayRainProb > 40;

    // 1. Apparel Tag
    let apparelTitle = 'Breathable Cotton';
    let apparelSub = 'Optimal mild layers';
    if (isHot) {
      apparelTitle = 'Lightweight Linen';
      apparelSub = `Hot & Humid (${displayTemp}${unit})`;
    } else if (isCold) {
      apparelTitle = 'Thermal Layer';
      apparelSub = `Chilly ${low}${unit} morning`;
    } else if (hasRain) {
      apparelTitle = 'Waterproof Layer';
      apparelSub = 'Wet roadway conditions';
    }

    // 2. Tactical Mobility Tag
    let tacticTitle = 'Optimal Morning Walk';
    let tacticSub = 'Dry window before 11 AM';
    let TacticIcon = Footprints;

    if (activeCategory === 'thunderstorm') {
      tacticTitle = 'Transition Indoors';
      tacticSub = 'Active thunderstorm risk';
      TacticIcon = CloudLightning;
    } else if (hasRain) {
      tacticTitle = 'Carry Umbrella';
      tacticSub = displayRainProb > 0 ? `${displayRainProb}% Rain Risk Peak` : 'Precipitation expected';
      TacticIcon = Umbrella;
    } else if (isHot) {
      tacticTitle = 'Early Walk Window';
      tacticSub = 'Walk before 10 AM (UV Peak)';
      TacticIcon = Sun;
    }

    return {
      apparelTitle,
      apparelSub,
      tacticTitle,
      tacticSub,
      TacticIcon
    };
  }, [displayTemp, low, unit, activeCategory, displayRainProb]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refreshLocationFromGps) {
      await refreshLocationFromGps();
    }
    setIsRefreshing(false);
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
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

      {/* Main Dynamic Climate Card (Living Weather Aura) */}
      <div className="w-full bg-white border border-stone-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 mb-6 shadow-sm relative overflow-hidden">
        {/* Apple/Samsung Weather Style Ambient Backdrop */}
        <AmbientCardAtmosphere category={activeCategory} />

        {/* Location & Refresh Header */}
        <div className="flex justify-between items-center mb-2 relative z-10">
          <button
            onClick={() => setIsLocationModalOpen?.(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/90 border border-amber-200/70 text-xs font-bold text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="truncate max-w-[180px] sm:max-w-[240px]">
              {locationName.split(',')[0]}
            </span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh weather"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        </div>

        {/* Dynamic Hero Animated Weather Scene & Temp */}
        <div className="relative z-10">
          <WeatherHeroScene
            category={activeCategory}
            label={displayLabel}
            temp={displayTemp}
            low={low}
            unit={unit}
            hourLabel={activeHourlyItem.hour}
            isCurrentHour={isCurrentHour}
          />
        </div>

        {/* Dynamic Interactive Hourly Forecast Strip */}
        <div className="relative z-10 flex gap-2 overflow-x-auto py-3 no-scrollbar border-y border-stone-100 my-4 justify-between">
          {hourlyStrip.map((item, idx) => {
            const HourIcon = getHourlyIcon(item.code, item.rainProb);
            const hourCat = categorizeWeather(item.code);
            const isRainy = hourCat === 'rain' || hourCat === 'drizzle' || hourCat === 'heavy_rain' || hourCat === 'thunderstorm';
            const isSlotActive = idx === selectedHourIndex;
            const isSlotCurrent = idx === currentHourIndex;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedHourIndex(idx)}
                className={`flex flex-col items-center justify-center rounded-2xl px-2.5 py-2 min-w-[56px] flex-1 gap-1.5 border transition-all cursor-pointer relative ${
                  isSlotActive
                    ? 'bg-amber-50 border-2 border-amber-400 shadow-md ring-2 ring-amber-400/20 scale-102'
                    : 'bg-stone-50/80 hover:bg-stone-100/70 border-stone-200/80'
                }`}
                title={`View ${item.hour} forecast`}
              >
                {/* Now Badge if Current Hour */}
                {isSlotCurrent && (
                  <span className="absolute -top-2 px-1.5 py-0.2 bg-amber-800 text-white rounded-full text-[8px] font-mono font-extrabold uppercase tracking-tight shadow-xs">
                    Now
                  </span>
                )}

                <span
                  className={`text-[10px] font-mono ${
                    isSlotActive ? 'font-bold text-amber-950' : 'text-stone-400'
                  }`}
                >
                  {item.hour}
                </span>

                {/* Condition-specific icon */}
                <div className={`p-1 rounded-lg ${isRainy ? 'text-cyan-700 bg-cyan-50' : 'text-amber-600 bg-amber-50'}`}>
                  <HourIcon className="w-4 h-4" />
                </div>

                <div className="flex flex-col items-center">
                  <span
                    className={`text-xs ${
                      isSlotActive ? 'font-extrabold text-stone-900' : 'font-bold text-stone-800'
                    }`}
                  >
                    {item.temp}°
                  </span>
                  {item.rainProb > 25 && (
                    <span className="text-[9px] font-mono font-bold text-cyan-700 mt-0.5">
                      {item.rainProb}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Minimal, Super Actionable Glance Tags (No Clutter!) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* 1. Apparel Action Tag */}
          <div className="flex items-center gap-3 bg-stone-50/90 rounded-2xl p-3 border border-stone-100 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 border border-amber-200/70 flex items-center justify-center shrink-0">
              <Shirt className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-[9px] font-mono font-extrabold text-amber-800 uppercase tracking-wider">
                APPAREL
              </span>
              <p className="text-xs font-bold text-stone-900 truncate">
                {minimalTactics.apparelTitle}
              </p>
              <p className="text-[10px] text-stone-500 truncate">
                {minimalTactics.apparelSub}
              </p>
            </div>
          </div>

          {/* 2. Tactical Mobility Tag */}
          <div className="flex items-center gap-3 bg-stone-50/90 rounded-2xl p-3 border border-stone-100 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 border border-amber-200/70 flex items-center justify-center shrink-0">
              <minimalTactics.TacticIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-[9px] font-mono font-extrabold text-amber-800 uppercase tracking-wider">
                TACTIC
              </span>
              <p className="text-xs font-bold text-stone-900 truncate">
                {minimalTactics.tacticTitle}
              </p>
              <p className="text-[10px] text-stone-500 truncate">
                {minimalTactics.tacticSub}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onAdvance}
        className="w-full flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-950 text-white font-bold py-3.5 px-6 rounded-full shadow-md shadow-amber-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm cursor-pointer"
      >
        <span>Proceed to Summary</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
