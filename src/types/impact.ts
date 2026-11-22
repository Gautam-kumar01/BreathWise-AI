export interface ExposureImpact {
  actionsCompletedCount: number;
  morningPeaksAvoided: number;          // hours shifted away from 6:30-9:00 AM inversion
  maskUsageLogged: number;               // trips with N95 certified protection
  strenuousCardioShiftedCount: number;   // workouts moved indoors
}

export interface IndoorImpact {
  sourceControlActionsCount: number;     // e.g. zero incense, exhaust hood used
  microVentilationWindowsFollowed: number;
  filterCleaningsLogged: number;
  manualSensorLogsCount: number;
}

export interface TransportImpact {
  sustainableTripsCount: number;         // transit/metro/walking trips
  combinedErrandsCount: number;          // combined errands saving separate trips
  estimatedCarTripsAvoided: number;
  estimatedCo2eSavedKg: number;          // kg CO2e based on published factors
  methodologyNote: string;
}

export interface WeeklyHabitDay {
  dayLabel: string;                      // Mon, Tue, Wed, Thu, Fri, Sat, Sun
  dateStr: string;
  actionsCount: number;
  isToday: boolean;
  isGoalMet: boolean;
}

export interface OverallImpactSummary {
  exposure: ExposureImpact;
  indoor: IndoorImpact;
  transport: TransportImpact;
  weeklyStreakDays: number;
  weeklyHabits: WeeklyHabitDay[];
}
