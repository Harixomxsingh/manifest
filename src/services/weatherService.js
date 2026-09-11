/**
 * 12-Hour Weather Intelligence Service
 * Uses Open-Meteo API (No auth required, 100% free)
 */

export const POPULAR_CITIES = [
  { name: 'San Francisco, CA, USA', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'New York, NY, USA', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
  { name: 'London, United Kingdom', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Bengaluru, India', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'Mumbai, India', lat: 19.076, lon: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Delhi, India', lat: 28.6139, lon: 77.209, timezone: 'Asia/Kolkata' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Paris, France', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Berlin, Germany', lat: 52.52, lon: 13.405, timezone: 'Europe/Berlin' },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Toronto, Canada', lat: 43.6532, lon: -79.3832, timezone: 'America/Toronto' }
];

export const STORAGE_LOCATION_KEY = 'manifest_saved_location';

/**
 * Get saved location from localStorage
 */
export function getSavedLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_LOCATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Save location to localStorage
 */
export function saveLocation(locationObj) {
  try {
    const data = {
      name: locationObj.name || 'Local Coordinates',
      lat: locationObj.lat,
      lon: locationObj.lon,
      source: locationObj.source || 'manual',
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_LOCATION_KEY, JSON.stringify(data));
    return data;
  } catch (e) {
    console.warn('Failed saving location:', e);
    return locationObj;
  }
}

/**
 * Reverse geocode lat/lon to real human city name using free Open-Meteo / BigDataCloud / OSM
 */
export async function reverseGeocode(lat, lon) {
  // 1. Try BigDataCloud
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision;
      const country = data.countryName || data.countryCode;
      if (city && country) {
        return `${city}, ${country}`;
      } else if (city) {
        return city;
      }
    }
  } catch (e) {}

  // 2. Try OpenStreetMap Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
    );
    if (res.ok) {
      const data = await res.json();
      const address = data.address || {};
      const city = address.city || address.town || address.village || address.suburb || address.state || address.county;
      const country = address.country;
      if (city && country) {
        return `${city}, ${country}`;
      } else if (city) {
        return city;
      }
    }
  } catch (e) {}

  // 3. Fallback to TimeZone approximation
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const parts = tz.split('/');
      const place = parts[parts.length - 1].replace(/_/g, ' ');
      return `${place} (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
    }
  } catch (e) {}

  return `GPS (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
}

/**
 * Search global cities by query via free Open-Meteo Geocoding API
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((r) => ({
      name: `${r.name}${r.admin1 ? `, ${r.admin1}` : ''}, ${r.country || ''}`,
      lat: r.latitude,
      lon: r.longitude,
      timezone: r.timezone
    }));
  } catch (err) {
    console.warn('City search failed:', err);
    return [];
  }
}

export const WMO_CODES = {
  0: { label: 'Clear Sky', icon: 'Sun', color: 'text-amber-400' },
  1: { label: 'Mainly Clear', icon: 'Sun', color: 'text-amber-300' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', color: 'text-amber-200' },
  3: { label: 'Overcast', icon: 'Cloud', color: 'text-slate-300' },
  45: { label: 'Foggy', icon: 'CloudFog', color: 'text-slate-400' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog', color: 'text-slate-400' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', color: 'text-cyan-300' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', color: 'text-cyan-400' },
  55: { label: 'Dense Drizzle', icon: 'CloudRain', color: 'text-cyan-500' },
  61: { label: 'Slight Rain', icon: 'CloudRain', color: 'text-blue-400' },
  63: { label: 'Moderate Rain', icon: 'CloudRain', color: 'text-blue-500' },
  65: { label: 'Heavy Rain', icon: 'CloudRainWind', color: 'text-blue-600' },
  71: { label: 'Slight Snow', icon: 'CloudSnow', color: 'text-indigo-200' },
  73: { label: 'Moderate Snow', icon: 'CloudSnow', color: 'text-indigo-300' },
  75: { label: 'Heavy Snow', icon: 'Snowflake', color: 'text-indigo-400' },
  80: { label: 'Rain Showers', icon: 'CloudRain', color: 'text-blue-400' },
  81: { label: 'Moderate Showers', icon: 'CloudRainWind', color: 'text-blue-500' },
  82: { label: 'Violent Showers', icon: 'CloudLightning', color: 'text-purple-400' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', color: 'text-amber-500' },
  96: { label: 'Thunderstorm with Hail', icon: 'CloudLightning', color: 'text-amber-500' }
};

export function getWmoInfo(code) {
  return WMO_CODES[code] || { label: 'Partly Cloudy', icon: 'CloudSun', color: 'text-amber-300' };
}

/**
 * Intelligent Geolocation Resolver:
 * 1. Checks if browser allows GPS.
 * 2. If granted, grabs coordinates and resolves real city name.
 * 3. Compares with saved location; updates storage.
 * 4. If denied/unavailable, falls back to saved location.
 * 5. If no saved location, falls back to default city and flags for manual pick.
 */
export async function detectCoordinates(preferGps = true) {
  const saved = getSavedLocation();
  const defaultFallback = {
    name: 'San Francisco, CA, USA',
    lat: 37.7749,
    lon: -122.4194,
    source: 'default',
    isPermissionDenied: false
  };

  if (!preferGps && saved) {
    return { ...saved, isPermissionDenied: false };
  }

  if (!navigator.geolocation) {
    return saved ? { ...saved, isPermissionDenied: true } : { ...defaultFallback, isPermissionDenied: true };
  }

  return new Promise((resolve) => {
    let resolved = false;

    // Timeout safety (10s)
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        const res = saved ? { ...saved, isPermissionDenied: false } : defaultFallback;
        resolve(res);
      }
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const cityName = await reverseGeocode(lat, lon);

        const detected = {
          name: cityName,
          lat,
          lon,
          source: 'gps',
          isPermissionDenied: false
        };

        saveLocation(detected);
        resolve(detected);
      },
      (error) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);

        const isDenied = error.code === error.PERMISSION_DENIED;
        const res = saved
          ? { ...saved, isPermissionDenied: isDenied }
          : { ...defaultFallback, isPermissionDenied: isDenied, needsManualPick: isDenied };
        resolve(res);
      },
      { timeout: 9000, enableHighAccuracy: true, maximumAge: 0 }
    );
  });
}

/**
 * Fetch 12-hour hourly forecast from Open-Meteo
 */
export async function fetchWeatherForecast(lat = 37.7749, lon = -122.4194, isFahrenheit = false) {
  try {
    const tempUnit = isFahrenheit ? 'fahrenheit' : 'celsius';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=${tempUnit}&wind_speed_unit=kmh&precipitation_unit=mm&timezone=auto&forecast_days=1`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo HTTP error: ${res.status}`);
    const data = await res.json();

    const hourly = data.hourly || {};
    const times = hourly.time || [];
    const temps = hourly.temperature_2m || [];
    const feelsLike = hourly.apparent_temperature || [];
    const rainProbs = hourly.precipitation_probability || [];
    const codes = hourly.weather_code || [];
    const uvIndices = hourly.uv_index || [];

    // Filter for 06:00 to 22:00 (active morning, afternoon & evening window)
    const daytimeEntries = [];
    for (let i = 0; i < times.length; i++) {
      const date = new Date(times[i]);
      const hour = date.getHours();
      if (hour >= 6 && hour <= 22) {
        const code = codes[i] ?? 0;
        daytimeEntries.push({
          time: times[i],
          hour: `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`,
          hour24: hour,
          temp: Math.round(temps[i]),
          feelsLike: Math.round(feelsLike[i]),
          rainProb: rainProbs[i] ?? 0,
          code,
          label: getWmoInfo(code).label,
          uv: uvIndices[i] ?? 0
        });
      }
    }

    if (daytimeEntries.length === 0) {
      return getMockWeather(isFahrenheit);
    }

    const dayTemps = daytimeEntries.map((d) => d.temp);
    const dayRain = daytimeEntries.map((d) => d.rainProb);
    const highTemp = Math.max(...dayTemps);
    const lowTemp = Math.min(...dayTemps);
    const maxRainProb = Math.max(...dayRain);

    // Identify dominant weather code
    const midEntry = daytimeEntries[Math.floor(daytimeEntries.length / 2)] || daytimeEntries[0];
    const dominantCode = midEntry.code;
    const wmo = getWmoInfo(dominantCode);

    // Generate local fallback tactical advice in case AI is offline
    const localTactics = generateHeuristicTactics(highTemp, lowTemp, maxRainProb, dominantCode, isFahrenheit);

    return {
      currentTemp: daytimeEntries[0]?.temp || highTemp,
      highTemp,
      lowTemp,
      unit: isFahrenheit ? '°F' : '°C',
      maxRainProb,
      weatherCode: dominantCode,
      weatherLabel: wmo.label,
      weatherIcon: wmo.icon,
      daytimeEntries,
      tactics: localTactics
    };
  } catch (err) {
    console.warn('Open-Meteo fetch failed, using fallback data:', err);
    return getMockWeather(isFahrenheit);
  }
}

function generateHeuristicTactics(high, low, rainProb, code, isFahrenheit) {
  const isCold = isFahrenheit ? high < 55 : high < 13;
  const isHot = isFahrenheit ? high > 82 : high > 28;

  let clothing = 'Breathable executive layering (light knit or tailored overshirt).';
  if (isCold) clothing = 'Substantial thermal layer or structured wool coat recommended.';
  if (isHot) clothing = 'Ultra-lightweight linen or breathable technical cotton.';

  let commute = 'Clear roadways expected throughout the morning commute.';
  if (rainProb > 40 || code >= 51) {
    commute = `Rain probability peaks at ${rainProb}%. Carry an umbrella; consider transitioning outdoor meetings indoors after 2 PM.`;
  } else if (isHot) {
    commute = 'High midday UV. Schedule outdoor walks before 10:00 AM or after 5:00 PM.';
  }

  return {
    summary: `${high}° / ${low}° • ${rainProb > 30 ? `${rainProb}% Rain Risk` : 'Optimal Conditions'}`,
    clothingAdvice: clothing,
    commuteOrOutdoorGuidance: commute
  };
}

export function getMockWeather(isFahrenheit = false) {
  const high = isFahrenheit ? 72 : 24;
  const low = isFahrenheit ? 54 : 16;
  return {
    currentTemp: isFahrenheit ? 62 : 22,
    highTemp: high,
    lowTemp: low,
    unit: isFahrenheit ? '°F' : '°C',
    maxRainProb: 15,
    weatherCode: 1,
    weatherLabel: 'Mainly Clear & Crisp',
    weatherIcon: 'Sun',
    daytimeEntries: [
      { hour: '6 AM', temp: isFahrenheit ? 55 : 13, rainProb: 5, code: 0 },
      { hour: '9 AM', temp: isFahrenheit ? 62 : 17, rainProb: 10, code: 1 },
      { hour: '12 PM', temp: isFahrenheit ? 70 : 21, rainProb: 15, code: 2 },
      { hour: '3 PM', temp: isFahrenheit ? 72 : 22, rainProb: 15, code: 1 },
      { hour: '6 PM', temp: isFahrenheit ? 66 : 19, rainProb: 5, code: 0 }
    ],
    tactics: {
      summary: `Crisp morning warming to ${high}°${isFahrenheit ? 'F' : 'C'} with mild golden sunlight.`,
      clothingAdvice: 'Medium weight executive layer for morning; comfortable in short sleeves by midday.',
      commuteOrOutdoorGuidance: 'Ideal conditions for a morning outdoor walk or walk-and-talk call between 8:00 AM and 10:00 AM.'
    }
  };
}
