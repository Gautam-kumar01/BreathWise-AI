import React, { createContext, useContext, useState, useEffect } from 'react';
import { AirQualitySnapshot, ScenarioDefinition, AQIScale } from '../types/air';
import { UserPreferences, Language, SavedPlace } from '../types/user';
import { RecommendationCard } from '../types/plan';
import { IndoorSensorLog, RoomType } from '../types/indoor';
import { OverallImpactSummary } from '../types/impact';
import { SEEDED_SCENARIOS } from '../data/scenarios';
import { AirQualityService } from '../services/airQualityService';
import { getCPCBFromPM25, getUSEPAFromPM25, getAQIMeta } from '../utils/aqiUtils';

export type NavigationTab = 
  | 'dashboard' 
  | 'plan' 
  | 'indoor' 
  | 'commute' 
  | 'impact' 
  | 'community' 
  | 'assistant';

export interface CityPreset {
  name: string;
  state: string;
  lat: number;
  lon: number;
  defaultScenario?: string;
}

export const INDIAN_CITIES: CityPreset[] = [
  { name: 'New Delhi (NCR)', state: 'Delhi', lat: 28.6139, lon: 77.2090, defaultScenario: 'delhi_severe' },
  { name: 'Noida (Sector 62)', state: 'Uttar Pradesh', lat: 28.6280, lon: 77.3649, defaultScenario: 'delhi_severe' },
  { name: 'Gurugram (Cyber City)', state: 'Haryana', lat: 28.4595, lon: 77.0266, defaultScenario: 'delhi_severe' },
  { name: 'Mumbai (BKC)', state: 'Maharashtra', lat: 19.0760, lon: 72.8777, defaultScenario: 'mumbai_coastal' },
  { name: 'Bengaluru (Koramangala)', state: 'Karnataka', lat: 12.9716, lon: 77.5946, defaultScenario: 'bengaluru_clear' },
  { name: 'Lucknow (Hazratganj)', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
  { name: 'Patna (Boring Road)', state: 'Bihar', lat: 25.5941, lon: 85.1376 },
  { name: 'Kolkata (Park Street)', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { name: 'Pune (Shivajinagar)', state: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
  { name: 'Jaipur (C-Scheme)', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
  { name: 'Ahmedabad (Navrangpura)', state: 'Gujarat', lat: 23.0225, lon: 72.5714 }
];

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  airData: AirQualitySnapshot;
  isLoadingAir: boolean;
  activeScenarioId: string;
  selectScenario: (id: string) => void;
  availableScenarios: ScenarioDefinition[];
  userPreferences: UserPreferences;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  toggleActionCompletion: (actionId: string) => void;
  toggleLanguage: () => void;
  language: Language;
  refreshAirData: (lat?: number, lon?: number) => Promise<void>;
  isProfileDrawerOpen: boolean;
  setIsProfileDrawerOpen: (open: boolean) => void;
  aqiScale: AQIScale;
  setAqiScale: (scale: AQIScale) => void;
  selectedCity: CityPreset;
  selectCity: (city: CityPreset) => void;
  useLiveLocation: () => Promise<void>;
  searchCityGeocode: (query: string) => Promise<CityPreset[]>;
  
  // Schedule Management
  customTasks: RecommendationCard[];
  addCustomTask: (task: Omit<RecommendationCard, 'id' | 'status'>) => void;
  rescheduleTask: (taskId: string, newTimeSlot: string) => void;
  skipTask: (taskId: string, reason?: string) => void;
  restoreTask: (taskId: string) => void;
  rescheduledMap: Record<string, string>;
  skippedIds: string[];

  // Indoor Sensor Logging
  sensorLogs: IndoorSensorLog[];
  addSensorLog: (log: { room: RoomType; pm25: number; co2Ppm?: number; deviceModel: string; note?: string }) => void;
  removeSensorLog: (id: string) => void;

  // Impact Data
  impactSummary: OverallImpactSummary;
  incrementSustainableTrip: () => void;
  incrementSustainableTrips: () => void;
  incrementCombinedTrips: () => void;
  resetImpactTracker: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  household: 'family_with_kids',
  primaryCommute: 'metro_transit',
  usualCommuteTime: '08:45',
  exercisePreference: 'morning_outdoor',
  hasAirPurifier: false,
  hasKitchenExhaust: true,
  hasIndoorSensor: false,
  budgetConscious: true,
  savedPlaces: [
    { id: 'p1', label: 'Home (Anand Vihar)', city: 'Delhi', lat: 28.6508, lon: 77.3152, isCurrent: true },
    { id: 'p2', label: 'Office (Connaught Place)', city: 'Delhi', lat: 28.6304, lon: 77.2177 },
    { id: 'p3', label: 'Kids School (Noida Sec 62)', city: 'Noida', lat: 28.6280, lon: 77.3649 }
  ],
  completedActionIds: ['rec-2'], // 1 pre-completed for realistic initial state
  snoozedActionIds: [],
  language: 'en'
};

const DEFAULT_SENSOR_LOGS: IndoorSensorLog[] = [
  {
    id: 'slog-1',
    room: 'bedroom',
    pm25: 48,
    co2Ppm: 820,
    deviceModel: 'IKEA VINDSTYRKA Laser Monitor',
    recordedAt: 'Today, 07:45 AM',
    isUserEntered: true,
    note: 'Windows kept shut overnight with damp towel sealing.',
    interpretation: 'Satisfactory. Infiltration held below 50 µg/m³ while outdoor was >300 µg/m³.'
  },
  {
    id: 'slog-2',
    room: 'kitchen',
    pm25: 142,
    co2Ppm: 1100,
    deviceModel: 'DIY Sensirion SPS30 Sensor',
    recordedAt: 'Yesterday, 08:30 PM',
    isUserEntered: true,
    note: 'Measured during tadka oil frying without chimney.',
    interpretation: 'Elevated peak. Recommending running exhaust 2 minutes before cooking flame.'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [activeScenarioId, setActiveScenarioId] = useState<string>('delhi_severe');
  const [airData, setAirData] = useState<AirQualitySnapshot>(SEEDED_SCENARIOS.delhi_severe.data);
  const [isLoadingAir, setIsLoadingAir] = useState<boolean>(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);
  const [aqiScale, setAqiScaleState] = useState<AQIScale>('CPCB_INDIA');
  const [selectedCity, setSelectedCity] = useState<CityPreset>(INDIAN_CITIES[0]);

  // Schedule Customization State
  const [customTasks, setCustomTasks] = useState<RecommendationCard[]>(() => {
    try {
      const s = localStorage.getItem('breathewise_custom_tasks');
      if (s) return JSON.parse(s);
    } catch {}
    return [];
  });

  const [rescheduledMap, setRescheduledMap] = useState<Record<string, string>>(() => {
    try {
      const s = localStorage.getItem('breathewise_rescheduled_map');
      if (s) return JSON.parse(s);
    } catch {}
    return {};
  });

  const [skippedIds, setSkippedIds] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('breathewise_skipped_ids');
      if (s) return JSON.parse(s);
    } catch {}
    return [];
  });

  // Indoor Sensor Logs State
  const [sensorLogs, setSensorLogs] = useState<IndoorSensorLog[]>(() => {
    try {
      const s = localStorage.getItem('breathewise_sensor_logs');
      if (s) return JSON.parse(s);
    } catch {}
    return DEFAULT_SENSOR_LOGS;
  });

  // Sustainable Trips counter
  const [sustainableTripsCount, setSustainableTripsCount] = useState<number>(() => {
    try {
      const s = localStorage.getItem('breathewise_sustainable_trips');
      if (s) return Number(s);
    } catch {}
    return 4;
  });

  const [combinedTripsCount, setCombinedTripsCount] = useState<number>(() => {
    try {
      const s = localStorage.getItem('breathewise_combined_trips');
      if (s) return Number(s);
    } catch {}
    return 2;
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('breathewise_preferences');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('breathewise_preferences', JSON.stringify(userPreferences));
      localStorage.setItem('breathewise_custom_tasks', JSON.stringify(customTasks));
      localStorage.setItem('breathewise_rescheduled_map', JSON.stringify(rescheduledMap));
      localStorage.setItem('breathewise_skipped_ids', JSON.stringify(skippedIds));
      localStorage.setItem('breathewise_sensor_logs', JSON.stringify(sensorLogs));
      localStorage.setItem('breathewise_sustainable_trips', String(sustainableTripsCount));
      localStorage.setItem('breathewise_combined_trips', String(combinedTripsCount));
    } catch {}
  }, [userPreferences, customTasks, rescheduledMap, skippedIds, sensorLogs, sustainableTripsCount, combinedTripsCount]);

  const recalculateScale = (baseData: AirQualitySnapshot, scale: AQIScale): AirQualitySnapshot => {
    const pm25 = baseData.pollutants.pm25;
    const calc = scale === 'US_EPA' ? getUSEPAFromPM25(pm25) : getCPCBFromPM25(pm25);
    const meta = getAQIMeta(calc.aqi, scale);

    return {
      ...baseData,
      aqi: calc.aqi,
      category: calc.category,
      categoryColor: meta.color,
      scale: scale
    };
  };

  const refreshAirData = async (lat?: number, lon?: number) => {
    setIsLoadingAir(true);
    try {
      const currentLat = lat ?? selectedCity.lat;
      const currentLon = lon ?? selectedCity.lon;
      const data = await AirQualityService.getAirQuality(activeScenarioId, currentLat, currentLon);
      setAirData(recalculateScale(data, aqiScale));
    } catch (e) {
      console.error('Failed to load air data', e);
    } finally {
      setIsLoadingAir(false);
    }
  };

  useEffect(() => {
    refreshAirData();
  }, [activeScenarioId, selectedCity]);

  const setAqiScale = (scale: AQIScale) => {
    setAqiScaleState(scale);
    setAirData(prev => recalculateScale(prev, scale));
  };

  const selectScenario = (id: string) => {
    setActiveScenarioId(id);
  };

  const selectCity = (city: CityPreset) => {
    setSelectedCity(city);
    if (city.defaultScenario) {
      setActiveScenarioId(city.defaultScenario);
    } else {
      setActiveScenarioId('live');
    }
  };

  const useLiveLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLoadingAir(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setSelectedCity({
          name: 'My Exact Location',
          state: 'GPS Detected',
          lat: latitude,
          lon: longitude
        });
        setActiveScenarioId('live');
        await refreshAirData(latitude, longitude);
      },
      (err) => {
        console.warn('Geolocation denied or unavailable', err);
        alert('Could not access GPS location. Switched to Delhi NCR station.');
        setIsLoadingAir(false);
      }
    );
  };

interface GeocodingApiResponse {
  results?: Array<{
    name: string;
    admin1?: string;
    country?: string;
    latitude: number;
    longitude: number;
  }>;
}

  const searchCityGeocode = async (query: string): Promise<CityPreset[]> => {
    if (!query.trim()) return [];
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const json: GeocodingApiResponse = await res.json();
      if (!json.results) return [];
      return json.results.map((r) => ({
        name: r.name,
        state: [r.admin1, r.country].filter(Boolean).join(', '),
        lat: Number(r.latitude),
        lon: Number(r.longitude)
      }));
    } catch {
      return [];
    }
  };

  const updatePreferences = (partial: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...partial }));
  };

  const toggleActionCompletion = (actionId: string) => {
    setUserPreferences(prev => {
      const completed = prev.completedActionIds.includes(actionId)
        ? prev.completedActionIds.filter(id => id !== actionId)
        : [...prev.completedActionIds, actionId];
      return { ...prev, completedActionIds: completed };
    });
  };

  const toggleLanguage = () => {
    setUserPreferences(prev => ({
      ...prev,
      language: prev.language === 'en' ? 'hi' : 'en'
    }));
  };

  // Schedule Customization Actions
  const addCustomTask = (task: Omit<RecommendationCard, 'id' | 'status'>) => {
    const id = `custom-${Date.now()}`;
    const newTask: RecommendationCard = {
      ...task,
      id,
      status: 'pending',
      isCustomTask: true
    };
    setCustomTasks(prev => [newTask, ...prev]);
  };

  const rescheduleTask = (taskId: string, newTimeSlot: string) => {
    setRescheduledMap(prev => ({ ...prev, [taskId]: newTimeSlot }));
    // If it was skipped, unskip
    setSkippedIds(prev => prev.filter(id => id !== taskId));
  };

  const skipTask = (taskId: string) => {
    setSkippedIds(prev => [...new Set([...prev, taskId])]);
    // Remove from completed if it was
    setUserPreferences(prev => ({
      ...prev,
      completedActionIds: prev.completedActionIds.filter(id => id !== taskId)
    }));
  };

  const restoreTask = (taskId: string) => {
    setSkippedIds(prev => prev.filter(id => id !== taskId));
    setRescheduledMap(prev => {
      const copy = { ...prev };
      delete copy[taskId];
      return copy;
    });
  };

  // Sensor Log Actions
  const addSensorLog = (log: { room: RoomType; pm25: number; co2Ppm?: number; deviceModel: string; note?: string }) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let interp = 'Safe indoor reading.';
    if (log.pm25 > 100) interp = 'High indoor particulate ingress. Verify window seals and run exhaust.';
    else if (log.pm25 > 50) interp = 'Moderate reading. Maintain damp mopping and avoid indoor combustion.';

    const newLog: IndoorSensorLog = {
      id: `slog-${Date.now()}`,
      room: log.room,
      pm25: log.pm25,
      co2Ppm: log.co2Ppm,
      deviceModel: log.deviceModel || 'User Air Monitor',
      recordedAt: `Today, ${nowStr}`,
      isUserEntered: true,
      note: log.note,
      interpretation: interp
    };
    setSensorLogs(prev => [newLog, ...prev]);
  };

  const removeSensorLog = (id: string) => {
    setSensorLogs(prev => prev.filter(l => l.id !== id));
  };

  const incrementSustainableTrip = () => {
    setSustainableTripsCount(prev => prev + 1);
  };

  const incrementCombinedTrips = () => {
    setCombinedTripsCount(prev => prev + 1);
  };

  const resetImpactTracker = () => {
    setSustainableTripsCount(0);
    setCombinedTripsCount(0);
  };

  // Compute Overall Impact Summary
  const completedCount = userPreferences.completedActionIds.length;
  const morningPeaksAvoided = completedCount >= 1 ? 2 : 0;
  const estimatedCarTripsAvoided = Math.max(0, sustainableTripsCount - 1);
  // 12km commute avoiding solo car (0.18 kg CO2e/km) vs metro (0.03 kg/km) = ~1.8 kg CO2e per trip
  const estimatedCo2eSavedKg = Number((estimatedCarTripsAvoided * 1.8).toFixed(1));

  const impactSummary: OverallImpactSummary = {
    exposure: {
      actionsCompletedCount: completedCount,
      morningPeaksAvoided,
      maskUsageLogged: 3,
      strenuousCardioShiftedCount: 2
    },
    indoor: {
      sourceControlActionsCount: 4,
      microVentilationWindowsFollowed: 3,
      filterCleaningsLogged: 1,
      manualSensorLogsCount: sensorLogs.length
    },
    transport: {
      sustainableTripsCount,
      combinedErrandsCount: combinedTripsCount,
      estimatedCarTripsAvoided,
      estimatedCo2eSavedKg,
      methodologyNote: 'Calculated using IPCC/CPCB urban transit emission factors: Solo petrol car ~0.18 kg CO2e/km vs Metro AC ~0.03 kg CO2e/km over typical 12km trip.'
    },
    weeklyStreakDays: Math.min(7, 3 + (sustainableTripsCount > 0 ? 1 : 0) + (completedCount > 0 ? 1 : 0)),
    weeklyHabits: [
      { dayLabel: 'Mon', dateStr: '18 Nov', actionsCount: 3, isToday: false, isGoalMet: true },
      { dayLabel: 'Tue', dateStr: '19 Nov', actionsCount: 4, isToday: false, isGoalMet: true },
      { dayLabel: 'Wed', dateStr: '20 Nov', actionsCount: 2, isToday: false, isGoalMet: false },
      { dayLabel: 'Thu', dateStr: '21 Nov', actionsCount: 5, isToday: false, isGoalMet: true },
      { dayLabel: 'Fri', dateStr: '22 Nov', actionsCount: completedCount, isToday: true, isGoalMet: completedCount >= 1 },
      { dayLabel: 'Sat', dateStr: '23 Nov', actionsCount: 0, isToday: false, isGoalMet: false },
      { dayLabel: 'Sun', dateStr: '24 Nov', actionsCount: 0, isToday: false, isGoalMet: false }
    ]
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        airData,
        isLoadingAir,
        activeScenarioId,
        selectScenario,
        availableScenarios: Object.values(SEEDED_SCENARIOS),
        userPreferences,
        updatePreferences,
        toggleActionCompletion,
        toggleLanguage,
        language: userPreferences.language,
        refreshAirData,
        isProfileDrawerOpen,
        setIsProfileDrawerOpen,
        aqiScale,
        setAqiScale,
        selectedCity,
        selectCity,
        useLiveLocation,
        searchCityGeocode,

        // Schedule Actions
        customTasks,
        addCustomTask,
        rescheduleTask,
        skipTask,
        restoreTask,
        rescheduledMap,
        skippedIds,

        // Sensor Logs
        sensorLogs,
        addSensorLog,
        removeSensorLog,

        // Impact
        impactSummary,
        incrementSustainableTrip,
        incrementSustainableTrips: incrementSustainableTrip,
        incrementCombinedTrips,
        resetImpactTracker
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
