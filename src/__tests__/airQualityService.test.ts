import { describe, it, expect } from 'vitest';
import { AirQualityService } from '../services/airQualityService';
import { SEEDED_SCENARIOS } from '../data/scenarios';

describe('AirQualityService - Seeded Scenarios Retrieval', () => {
  it('loads Delhi GRAP-IV Severe Smog scenario correctly', async () => {
    const snapshot = await AirQualityService.getAirQuality('delhi_severe');
    expect(snapshot).toBeDefined();
    expect(snapshot.metadata.city).toBe('New Delhi');
    expect(snapshot.metadata.stationName).toBe('Anand Vihar DPCC Ground Station');
    expect(snapshot.aqi).toBe(428);
    expect(snapshot.category).toBe('Severe');
    expect(snapshot.pollutants.pm25).toBe(298.5);
    expect(snapshot.pollutants.pm10).toBe(462.0);
    expect(snapshot.metadata.freshness).toBe('DEMO_SCENARIO');
    expect(snapshot.weather.stagnationStatus).toBe('Severe Inversion Trap');
  });

  it('loads Mumbai Coastal Moderate scenario correctly', async () => {
    const snapshot = await AirQualityService.getAirQuality('mumbai_coastal');
    expect(snapshot).toBeDefined();
    expect(snapshot.metadata.city).toBe('Mumbai');
    expect(snapshot.metadata.stationName).toBe('BKC MPCB Ground Monitor');
    expect(snapshot.aqi).toBe(188);
    expect(snapshot.category).toBe('Moderate');
    expect(snapshot.pollutants.pm25).toBe(96.2);
    expect(snapshot.metadata.freshness).toBe('DEMO_SCENARIO');
  });

  it('loads Bengaluru Clear Day scenario correctly', async () => {
    const snapshot = await AirQualityService.getAirQuality('bengaluru_clear');
    expect(snapshot).toBeDefined();
    expect(snapshot.metadata.city).toBe('Bengaluru');
    expect(snapshot.metadata.stationName).toBe('BTM Layout KSPCB Station');
    expect(snapshot.aqi).toBe(62);
    expect(snapshot.category).toBe('Satisfactory');
    expect(snapshot.pollutants.pm25).toBe(18.4);
    expect(snapshot.metadata.freshness).toBe('DEMO_SCENARIO');
  });

  it('verifies all registered SEEDED_SCENARIOS load without error', async () => {
    const scenarioKeys = Object.keys(SEEDED_SCENARIOS);
    expect(scenarioKeys.length).toBeGreaterThanOrEqual(3);

    for (const key of scenarioKeys) {
      const snap = await AirQualityService.getAirQuality(key);
      expect(snap.aqi).toBeGreaterThan(0);
      expect(snap.category).toBeTruthy();
      expect(snap.hourlyCurve.length).toBeGreaterThan(0);
    }
  });
});

describe('AirQualityService - Diurnal Inversion Curve & Window Structure', () => {
  it('provides 24-hour diurnal profile with valid point structures', async () => {
    const snapshot = await AirQualityService.getAirQuality('delhi_severe');
    expect(snapshot.hourlyCurve).toBeDefined();
    expect(snapshot.hourlyCurve.length).toBeGreaterThanOrEqual(10);

    snapshot.hourlyCurve.forEach((point) => {
      expect(point).toHaveProperty('hour');
      expect(point).toHaveProperty('timeLabel');
      expect(point).toHaveProperty('aqi');
      expect(point).toHaveProperty('pm25');
      expect(point).toHaveProperty('inversionRisk');
      expect(point).toHaveProperty('activityVerdict');
      expect(typeof point.hour).toBe('number');
      expect(typeof point.aqi).toBe('number');
      expect(['Low', 'Moderate', 'High', 'Severe']).toContain(point.inversionRisk);
    });
  });

  it('correctly flags solar dispersion / micro-ventilation windows', async () => {
    const snapshot = await AirQualityService.getAirQuality('delhi_severe');
    const ventPoints = snapshot.hourlyCurve.filter(p => p.isSafeVentilationWindow);
    expect(ventPoints.length).toBeGreaterThan(0);
    ventPoints.forEach(vp => {
      expect(vp.hour).toBeGreaterThanOrEqual(12);
      expect(vp.hour).toBeLessThanOrEqual(16);
    });
  });
});
