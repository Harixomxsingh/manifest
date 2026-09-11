import { describe, it, expect } from 'vitest';
import {
  getMockWeather,
  POPULAR_CITIES
} from '../src/services/weatherService';

describe('🌡️ Weather Service & Unit Defaults', () => {
  it('defaults to Celsius (°C) when isFahrenheit is false', () => {
    const mock = getMockWeather(false);
    expect(mock.unit).toBe('°C');
    expect(mock.currentTemp).toBe(22);
    expect(mock.highTemp).toBe(24);
    expect(mock.lowTemp).toBe(16);
    expect(mock.currentTemp).toBeLessThan(45); // Standard Celsius range
  });

  it('provides Fahrenheit (°F) when isFahrenheit is explicitly set to true', () => {
    const mock = getMockWeather(true);
    expect(mock.unit).toBe('°F');
    expect(mock.currentTemp).toBe(62);
    expect(mock.highTemp).toBe(72);
    expect(mock.lowTemp).toBe(54);
  });

  it('includes valid popular cities with latitude and longitude', () => {
    expect(POPULAR_CITIES.length).toBeGreaterThan(5);
    const newDelhi = POPULAR_CITIES.find((c) => c.name.includes('Delhi'));
    expect(newDelhi).toBeDefined();
    expect(newDelhi.lat).toBeDefined();
    expect(newDelhi.lon).toBeDefined();
  });
});
