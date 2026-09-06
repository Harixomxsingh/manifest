import * as Location from 'expo-location';

export const GLOBAL_CITIES = [
  { name: 'San Francisco, USA', lat: 37.7749, lon: -122.4194 },
  { name: 'New York, USA', lat: 40.7128, lon: -74.0060 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris, France', lat: 48.8566, lon: 2.3522 },
  { name: 'Berlin, Germany', lat: 52.5200, lon: 13.4050 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Toronto, Canada', lat: 43.6532, lon: -79.3832 },
  { name: 'Bengaluru, India', lat: 12.9716, lon: 77.5946 },
  { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777 },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708 },
  { name: 'Zurich, Switzerland', lat: 47.3769, lon: 8.5417 }
];

export const getWmoInfo = (code) => {
  const map = {
    0: { label: 'Clear Sky', icon: 'sun' },
    1: { label: 'Mainly Clear', icon: 'sun' },
    2: { label: 'Partly Cloudy', icon: 'cloud-sun' },
    3: { label: 'Overcast', icon: 'cloud' },
    45: { label: 'Foggy Horizon', icon: 'cloud' },
    48: { label: 'Depositing Rime Fog', icon: 'cloud' },
    51: { label: 'Light Drizzle', icon: 'cloud-drizzle' },
    53: { label: 'Moderate Drizzle', icon: 'cloud-drizzle' },
    55: { label: 'Dense Drizzle', icon: 'cloud-drizzle' },
    61: { label: 'Slight Rain', icon: 'cloud-rain' },
    63: { label: 'Moderate Rain', icon: 'cloud-rain' },
    65: { label: 'Heavy Rain', icon: 'cloud-rain' },
    80: { label: 'Rain Showers', icon: 'cloud-rain' },
    95: { label: 'Thunderstorm', icon: 'zap' }
  };
  return map[code] || { label: 'Fair Skies', icon: 'sun' };
};

export const detectGpsCoordinates = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        lat: 37.7749,
        lon: -122.4194,
        name: 'San Francisco, USA',
        source: 'fallback',
        isPermissionDenied: true
      };
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });

    const lat = loc.coords.latitude;
    const lon = loc.coords.longitude;

    // Reverse geocode
    let cityName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    try {
      const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      if (addresses && addresses.length > 0) {
        const addr = addresses[0];
        const parts = [addr.city || addr.subregion || addr.district, addr.region, addr.country].filter(Boolean);
        if (parts.length > 0) {
          cityName = parts.join(', ');
        }
      }
    } catch (e) {
      // Ignore geocode error
    }

    return {
      lat,
      lon,
      name: cityName,
      source: 'gps',
      isPermissionDenied: false
    };
  } catch (err) {
    return {
      lat: 37.7749,
      lon: -122.4194,
      name: 'San Francisco, USA',
      source: 'fallback',
      isPermissionDenied: true
    };
  }
};

export const fetchOpenMeteoWeather = async (lat, lon, cityName = 'San Francisco, USA') => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();

    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const highTemp = Math.round(daily.temperature_2m_max?.[0] ?? current.temperature_2m ?? 24);
    const lowTemp = Math.round(daily.temperature_2m_min?.[0] ?? (highTemp - 8));
    const currentTemp = Math.round(current.temperature_2m ?? highTemp);
    const maxRainProb = daily.precipitation_probability_max?.[0] ?? 0;
    const weatherCode = current.weather_code ?? daily.weather_code?.[0] ?? 0;
    const wmo = getWmoInfo(weatherCode);

    // Extract 5 daytime hours
    const hourlyStrip = [];
    if (hourly.time && hourly.temperature_2m) {
      const times = hourly.time;
      const temps = hourly.temperature_2m;
      const codes = hourly.weather_code || [];
      for (let i = 6; i <= 18; i += 3) {
        if (times[i]) {
          const hourLabel = times[i].includes('T') ? times[i].split('T')[1].slice(0, 5) : `${i}:00`;
          hourlyStrip.push({
            hour: hourLabel,
            temp: Math.round(temps[i] ?? currentTemp),
            code: codes[i] ?? 0
          });
        }
      }
    }

    if (hourlyStrip.length === 0) {
      hourlyStrip.push(
        { hour: '07:00', temp: lowTemp, code: 0 },
        { hour: '10:00', temp: Math.round((highTemp + lowTemp) / 2), code: 1 },
        { hour: '13:00', temp: highTemp, code: 2 },
        { hour: '16:00', temp: highTemp - 2, code: 51 },
        { hour: '19:00', temp: lowTemp + 2, code: 0 }
      );
    }

    // Curated tactical advice
    let attire = 'Breathable lightweight layers. Comfortable morning temperature before midday warmth.';
    if (highTemp < 15) {
      attire = 'Thermal wool layers, structured coat, and protective scarf for cool breeze.';
    } else if (highTemp > 28) {
      attire = 'Ultralight linen and breathable natural fibers. Maximize hydration.';
    }

    let commute = 'Optimal dry commute. Perfect morning window for uninterrupted outdoor work.';
    if (maxRainProb > 30) {
      commute = `Pack a compact umbrella. Potential precipitation windows (${maxRainProb}% probability).`;
    }

    return {
      highTemp,
      lowTemp,
      currentTemp,
      unit: '°C',
      maxRainProb,
      weatherLabel: wmo.label,
      locationName: cityName,
      hourlyStrip,
      tactics: {
        clothingAdvice: attire,
        commuteOrOutdoorGuidance: commute
      }
    };
  } catch (err) {
    return {
      highTemp: 24,
      lowTemp: 16,
      currentTemp: 22,
      unit: '°C',
      maxRainProb: 0,
      weatherLabel: 'Clear Sky',
      locationName: cityName,
      hourlyStrip: [
        { hour: '07:00', temp: 16, code: 0 },
        { hour: '10:00', temp: 20, code: 1 },
        { hour: '13:00', temp: 24, code: 2 },
        { hour: '16:00', temp: 22, code: 0 },
        { hour: '19:00', temp: 18, code: 0 }
      ],
      tactics: {
        clothingAdvice: 'Breathable natural fabrics. Morning is dry and cool; midday warm.',
        commuteOrOutdoorGuidance: 'Optimal dry conditions. Complete key errands before afternoon.'
      }
    };
  }
};
