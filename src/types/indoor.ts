export type RoomType = 'bedroom' | 'living' | 'kitchen' | 'study' | 'classroom';

export type IndoorCategory = 
  | 'cooking' 
  | 'dust' 
  | 'ventilation' 
  | 'purifier' 
  | 'source_control';

export interface IndoorHack {
  id: string;
  room: RoomType;
  category: IndoorCategory;
  title: string;
  action: string;
  costTier: 'Free' | 'Low-cost (₹50-₹300)' | 'Equipment (Purifier)';
  evidenceWhy: string;
  safetyCaution: string;
  impactScore: 'High' | 'Medium' | 'Essential';
}

export interface IndoorSensorLog {
  id: string;
  room: RoomType;
  pm25: number;             // µg/m³
  co2Ppm?: number;          // ppm
  deviceModel: string;      // e.g. "DIY Laser Sensor", "IKEA VINDSTYRKA", "AirVisual", "Manual Estimate"
  recordedAt: string;
  isUserEntered: true;      // Explicitly flagged as user-entered, never inferred from outdoor
  note?: string;
  interpretation: string;
}
