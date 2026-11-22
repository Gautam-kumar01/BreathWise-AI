export type PlanTimeSlot = 
  | 'Morning (6 AM - 9 AM)' 
  | 'Morning Commute (9 AM - 10 AM)' 
  | 'Midday & Indoors (11 AM - 4 PM)' 
  | 'Evening Commute (5 PM - 8 PM)' 
  | 'Night Rest (8 PM - 6 AM)';

export type PlanCategory = 'exercise' | 'commute' | 'indoor' | 'lifestyle' | 'community';

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
  timeSlot: PlanTimeSlot;
  category: PlanCategory;
  title: string;
  actionText: string;
  urgency: 'critical' | 'recommended' | 'optional';
  provenance: ProvenanceDetails;
  isCompleted: boolean;
  isSnoozed: boolean;
  tags: string[];
}

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
