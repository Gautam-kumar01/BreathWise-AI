import React, { createContext, useContext, useState, useEffect } from 'react';
import { AirQualitySnapshot, ScenarioDefinition, AQIScale } from '../types/air';
import { UserPreferences, Language, SavedPlace } from '../types/user';
import { SEEDED_SCENARIOS } from '../data/scenarios';
import { AirQualityService } from '../services/airQualityService';
import { getCPCBFromPM25, getUSEPAFromPM25, getAQIMeta } from '../utils/aqiUtils';

export type NavigationTab = 'dashboard' | 'plan' | 'indoor' | 'commute' | 'community' | 'assistant';

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
  refreshAirData: () => Promise<void>;
  isProfileDrawerOpen: boolean;
  setIsProfileDrawerOpen: (open: boolean) => void;
  aqiScale: AQIScale;
  setAqiScale: (scale: AQIScale) => void;
  selectedCity: CityPreset;
  selectCity: (city: CityPreset) => void;
  useLiveLocation: () => Promise<void>;
  searchCityGeocode: (query: string) => Promise<CityPreset[]>;
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
  completedActionIds: [],
  snoozedActionIds: [],
  language: 'en'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [activeScenarioId, setActiveScenarioId] = useState<string>('delhi_severe');
  const [airData, setAirData] = useState<AirQualitySnapshot>(SEEDED_SCENARIOS.delhi_severe.data);
  const [isLoadingAir, setIsLoadingAir] = useState<boolean>(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);
  const [aqiScale, setAqiScaleState] = useState<AQIScale>('CPCB_INDIA');
  const [selectedCity, setSelectedCity] = useState<CityPreset>(INDIAN_CITIES[0]);

  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('breathewise_preferences');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('breathewise_preferences', JSON.stringify(userPreferences));
    } catch {
      // ignore
    }
  }, [userPreferences]);

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

  const searchCityGeocode = async (query: string): Promise<CityPreset[]> => {
    if (!query.trim()) return [];
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const json = await res.json();
      if (!json.results) return [];
      return json.results.map((r: any) => ({
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
        searchCityGeocode
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
