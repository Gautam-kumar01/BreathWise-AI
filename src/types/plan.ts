export type PlanTimeSlot = 
  | 'Morning Routine (6:00 AM - 7:30 AM)'
  | 'Outdoor Exercise (7:30 AM - 9:00 AM)' 
  | 'School & Office Commute (9:00 AM - 10:30 AM)' 
  | 'Midday & Solar Window (1:00 PM - 3:30 PM)' 
  | 'Evening Commute (5:00 PM - 7:30 PM)' 
  | 'Night Rest (8:00 PM - 10:30 PM)'
  | "Tomorrow's Smog Prep (10:30 PM)";

export type PlanCategory = 'exercise' | 'commute' | 'indoor' | 'lifestyle' | 'community' | 'custom';

export type ActionStatus = 'pending' | 'completed' | 'skipped' | 'rescheduled';

export interface ProvenanceDetails {
  environmentalTrigger: string;    // e.g. "PM2.5 spike to 285 µg/m³ during ground inversion"
  matchedPreference: string;       // e.g. "User identified as 7:00 AM outdoor runner"
  causalReasoning: string;         // e.g. "Running increases inhalation volume by 6-10x, magnifying toxic alveolar deposition"
  lowCostAlternative: string;      // e.g. "Move bodyweight HIIT inside living room with closed windows"
  uncertainties: string;           // e.g. "Indoor PM2.5 assumes no unvented incense or frying"
  estimatedExposureReduction: string; // Directional: "High (Avoids ~85% peak inhaled dose)"
}

export interface RecommendationCard {
  id: string;
  slot?: 'morning' | 'commute' | 'midday' | 'evening' | 'prep';
  timeSlot: string;
  category?: PlanCategory;
  title: string;
  actionText: string;
  urgency: 'critical' | 'recommended' | 'optional';
  provenance: ProvenanceDetails;
  status?: ActionStatus;
  rescheduledTime?: string;
  skipReason?: string;
  isCustomTask?: boolean;
  tags?: string[];
}

export type RecommendationItem = RecommendationCard;

export interface DailyAirPlan {
  id: string;
  generatedAt: string;
  targetDate: string;
  locationName: string;
  currentAQI: number;
  overallStrategy: string;
  cleanWindowAlert: string;
  recommendations: RecommendationCard[];
}
