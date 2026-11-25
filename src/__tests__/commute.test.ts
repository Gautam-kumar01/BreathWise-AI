import { describe, it, expect } from 'vitest';
import { COMMUTE_MODES } from '../types/commute';

describe('commute - 5-Mode Urban Transportation Comparison', () => {
  it('contains exactly 5 feasible urban commute modes', () => {
    expect(COMMUTE_MODES).toHaveLength(5);
    const ids = COMMUTE_MODES.map(m => m.id);
    expect(ids).toContain('metro_transit');
    expect(ids).toContain('ac_car_cab');
    expect(ids).toContain('auto_rickshaw');
    expect(ids).toContain('two_wheeler');
    expect(ids).toContain('walking_biking');
  });

  it('verifies Metro Rail provides lowest inhaled dose and low emissions', () => {
    const metro = COMMUTE_MODES.find(m => m.id === 'metro_transit')!;
    expect(metro).toBeDefined();
    expect(metro.inhaledDoseScore).toBe(2);
    expect(metro.co2EmissionsKg).toBeLessThan(0.3);
    expect(metro.filterType).toContain('Multi-Stage');
    expect(metro.smogRecommendation).toContain('Top recommended choice');
  });

  it('verifies AC Car emphasizes internal recirculation to avoid exhaust ingress', () => {
    const car = COMMUTE_MODES.find(m => m.id === 'ac_car_cab')!;
    expect(car).toBeDefined();
    expect(car.inhaledDoseScore).toBe(4);
    expect(car.co2EmissionsKg).toBeGreaterThan(2.0); // Highest emissions per passenger
    expect(car.smogRecommendation).toContain('Internal Recirculation');
  });

  it('verifies Auto-Rickshaw & Two-Wheeler have high exposure risk in road smog', () => {
    const auto = COMMUTE_MODES.find(m => m.id === 'auto_rickshaw')!;
    const bike = COMMUTE_MODES.find(m => m.id === 'two_wheeler')!;
    expect(auto.inhaledDoseScore).toBeGreaterThanOrEqual(8);
    expect(bike.inhaledDoseScore).toBeGreaterThanOrEqual(9);
    expect(auto.smogRecommendation).toContain('N95');
    expect(bike.smogRecommendation).toContain('N95');
  });

  it('verifies Walking & Biking has zero emissions but extreme lung dose during Severe AQI', () => {
    const walk = COMMUTE_MODES.find(m => m.id === 'walking_biking')!;
    expect(walk.co2EmissionsKg).toBe(0.0);
    expect(walk.inhaledDoseScore).toBe(10);
    expect(walk.smogRecommendation).toContain('Unsafe for long distances when AQI > 300');
  });

  it('validates that all modes have complete pro, con, and description attributes', () => {
    COMMUTE_MODES.forEach(mode => {
      expect(mode.name).toBeTruthy();
      expect(mode.description).toBeTruthy();
      expect(mode.pros.length).toBeGreaterThan(0);
      expect(mode.cons.length).toBeGreaterThan(0);
      expect(typeof mode.travelTimeMin).toBe('number');
      expect(typeof mode.costInr).toBe('number');
    });
  });
});
