export type AQIScale = 'CPCB_INDIA' | 'US_EPA';

export type AQICategory = 
  | 'Good' 
  | 'Satisfactory' 
  | 'Moderate' 
  | 'Poor' 
  | 'Very Poor' 
  | 'Severe' 
  | 'Hazardous';

export type FreshnessStatus = 'LIVE_FRESH' | 'LIVE_DELAYED' | 'STALE' | 'DEMO_SCENARIO';

export interface PollutantValues {
  pm25: number;       // µg/m³
  pm10: number;       // µg/m³
  no2: number;        // µg/m³
  so2?: number;       // µg/m³
  o3: number;         // µg/m³
  co: number;         // mg/m³ or µg/m³
}

export interface DiurnalPoint {
  hour: number;          // 0 to 23
  timeLabel: string;     // e.g. "07:00 AM"
  aqi: number;
  pm25: number;
  temperatureC: number;
  inversionRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  isSafeVentilationWindow?: boolean;
  activityVerdict?: string; // e.g., "Avoid Outdoor Cardio", "Safe for Stroll"
  isDaytime?: boolean;
}

export interface WeatherMetrics {
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmH: number;
  windDirectionDegrees: number;
  windDirectionCardinal: string; // e.g. "NW", "CALM", "SE"
  stagnationStatus: 'Severe Inversion Trap' | 'Moderate Stagnation' | 'Active Dispersion';
  stagnationReason: string;
}

export interface AirStationMetadata {
  stationName: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  provider: string;      // e.g., "Open-Meteo CAMS Global Assimilation"
  lastUpdated: string;
  freshness: FreshnessStatus;
  isRealTime: boolean;
  measurementType: 'GROUND_OBSERVATION' | 'MODEL_ASSIMILATION' | 'SIMULATED_SCENARIO';
  apiUrlUsed?: string;
  rawStationSource?: string;
}

export interface AirQualitySnapshot {
  aqi: number;
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2' | 'O3';
  category: AQICategory;
  categoryColor: string;
  trend: 'improving' | 'worsening' | 'stable';
  trendDescription: string;
  pollutants: PollutantValues;
  metadata: AirStationMetadata;
  scale: AQIScale;
  hourlyCurve: DiurnalPoint[];
  weather: WeatherMetrics;
  dailyForecastSummary: {
    cleanestWindow: string;      // e.g. "01:00 PM - 04:00 PM"
    highestPeakWindow: string;   // e.g. "07:00 AM - 09:30 AM"
    recommendedOutdoorTime: string;
    ventilationSafeNow: boolean;
    ventilationReason: string;
  };
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  tagline: string;
  location: string;
  aqi: number;
  category: AQICategory;
  description: string;
  data: AirQualitySnapshot;
}
