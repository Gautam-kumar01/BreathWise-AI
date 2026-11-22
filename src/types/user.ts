export type HouseholdProfile = 
  | 'individual' 
  | 'family_with_kids' 
  | 'elderly_household' 
  | 'sensitive_asthma' 
  | 'student_shared';

export type CommuteMode = 
  | 'metro_transit' 
  | 'ac_car_cab' 
  | 'two_wheeler' 
  | 'auto_rickshaw' 
  | 'walking_biking';

export type ExercisePreference = 
  | 'morning_outdoor' 
  | 'evening_outdoor' 
  | 'indoor_gym' 
  | 'none';

export type Language = 'en' | 'hi';

export interface SavedPlace {
  id: string;
  label: string;       // e.g., "Home (Anand Vihar)", "Office (Connaught Place)"
  city: string;
  lat: number;
  lon: number;
  isCurrent?: boolean;
}

export interface UserPreferences {
  household: HouseholdProfile;
  primaryCommute: CommuteMode;
  usualCommuteTime: string;      // e.g. "08:30"
  exercisePreference: ExercisePreference;
  hasAirPurifier: boolean;
  hasKitchenExhaust: boolean;
  hasIndoorSensor: boolean;
  budgetConscious: boolean;      // prioritize free / DIY hacks
  savedPlaces: SavedPlace[];
  completedActionIds: string[];
  snoozedActionIds: string[];
  language: Language;
}
