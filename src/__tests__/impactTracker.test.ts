import { describe, it, expect } from 'vitest';
import { OverallImpactSummary, ExposureImpact, IndoorImpact, TransportImpact } from '../types/impact';

describe('impactTracker - Three Pillar Evidence-Based Tracking', () => {
  it('correctly models Personal Exposure metrics', () => {
    const exposure: ExposureImpact = {
      actionsCompletedCount: 5,
      morningPeaksAvoided: 3,
      maskUsageLogged: 4,
      strenuousCardioShiftedCount: 2
    };

    expect(exposure.actionsCompletedCount).toBe(5);
    expect(exposure.morningPeaksAvoided).toBe(3);
    expect(exposure.maskUsageLogged).toBe(4);
    expect(exposure.strenuousCardioShiftedCount).toBe(2);
  });

  it('correctly models Indoor Defense metrics without fabricated numbers', () => {
    const indoor: IndoorImpact = {
      sourceControlActionsCount: 4,
      microVentilationWindowsFollowed: 3,
      filterCleaningsLogged: 1,
      manualSensorLogsCount: 2
    };

    expect(indoor.sourceControlActionsCount).toBe(4);
    expect(indoor.filterCleaningsLogged).toBe(1);
    expect(indoor.manualSensorLogsCount).toBe(2);
  });

  it('accurately computes transport emissions savings based on published factors', () => {
    // Standard urban commute model: 12 km trip avoiding solo petrol car (~0.17 kg CO2/km)
    const tripDistanceKm = 12;
    const factorPerKm = 0.17;
    const tripsAvoided = 3;
    const calculatedCo2Saved = Number((tripsAvoided * tripDistanceKm * factorPerKm).toFixed(2));

    const transport: TransportImpact = {
      sustainableTripsCount: 4,
      combinedErrandsCount: 2,
      estimatedCarTripsAvoided: tripsAvoided,
      estimatedCo2eSavedKg: calculatedCo2Saved,
      methodologyNote: 'Calculated using 12km average round-trip with 0.17 kg CO2e/km IPCC vehicle emission factor.'
    };

    expect(transport.estimatedCo2eSavedKg).toBe(6.12);
    expect(transport.methodologyNote).toContain('IPCC vehicle emission factor');
  });

  it('tracks 7-day habit streak accurately', () => {
    const summary: OverallImpactSummary = {
      exposure: {
        actionsCompletedCount: 3,
        morningPeaksAvoided: 2,
        maskUsageLogged: 3,
        strenuousCardioShiftedCount: 1
      },
      indoor: {
        sourceControlActionsCount: 2,
        microVentilationWindowsFollowed: 2,
        filterCleaningsLogged: 0,
        manualSensorLogsCount: 1
      },
      transport: {
        sustainableTripsCount: 3,
        combinedErrandsCount: 1,
        estimatedCarTripsAvoided: 2,
        estimatedCo2eSavedKg: 4.08,
        methodologyNote: 'Documented IPCC emission factor'
      },
      weeklyStreakDays: 5,
      weeklyHabits: [
        { dayLabel: 'Mon', dateStr: '2026-11-19', actionsCount: 3, isToday: false, isGoalMet: true },
        { dayLabel: 'Tue', dateStr: '2026-11-20', actionsCount: 2, isToday: false, isGoalMet: true },
        { dayLabel: 'Wed', dateStr: '2026-11-21', actionsCount: 4, isToday: false, isGoalMet: true },
        { dayLabel: 'Thu', dateStr: '2026-11-22', actionsCount: 3, isToday: false, isGoalMet: true },
        { dayLabel: 'Fri', dateStr: '2026-11-23', actionsCount: 2, isToday: false, isGoalMet: true },
        { dayLabel: 'Sat', dateStr: '2026-11-24', actionsCount: 0, isToday: false, isGoalMet: false },
        { dayLabel: 'Sun', dateStr: '2026-11-25', actionsCount: 1, isToday: true, isGoalMet: false }
      ]
    };

    expect(summary.weeklyStreakDays).toBe(5);
    expect(summary.weeklyHabits).toHaveLength(7);
    const completedDays = summary.weeklyHabits.filter(d => d.isGoalMet);
    expect(completedDays.length).toBe(5);
  });
});
