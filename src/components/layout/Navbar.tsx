import React, { useState, useRef, useEffect } from 'react';
import { useApp, INDIAN_CITIES } from '../../context/AppContext';
import { 
  Wind, 
  MapPin, 
  Sliders, 
  Globe, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronDown, 
  Navigation,
  Search,
  Loader2,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    airData,
    activeScenarioId,
    selectScenario,
    availableScenarios,
    language,
    toggleLanguage,
    refreshAirData,
    isLoadingAir,
    setIsProfileDrawerOpen,
    aqiScale,
    setAqiScale,
    selectedCity,
    selectCity,
    useLiveLocation,
    searchCityGeocode,
    setActiveTab
  } = useApp();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [liveSearchResults, setLiveSearchResults] = useState<typeof INDIAN_CITIES>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDemo = activeScenarioId !== 'live';
  const isHi = language === 'hi';

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleCitySearch = (val: string) => {
    setCitySearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!val.trim()) {
      setLiveSearchResults([]);
      setIsSearchingCity(false);
      return;
    }

    setIsSearchingCity(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchCityGeocode(val);
        setLiveSearchResults(results);
      } catch {
        setLiveSearchResults([]);
      } finally {
        setIsSearchingCity(false);
      }
    }, 300);
  };

  return (
    <div>
      {/* 1. Top Status & Provenance Bar (Sleek, responsive, never wraps into vertical stack) */}
      <div className={`px-3 py-1 sm:px-6 sm:py-1.5 text-xs flex items-center justify-between gap-2 border-b transition-colors ${
        isDemo 
          ? 'bg-amber-50/90 border-amber-200/90 text-amber-950' 
          : 'bg-emerald-50/90 border-emerald-200/90 text-emerald-950'
      }`}>
        {/* Left: Compact Badge + Station Label */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {isDemo ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-950 font-black text-[9px] sm:text-[10px] uppercase tracking-wider flex-shrink-0 shadow-xs">
              <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-900" />
              <span>Demo</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-200 text-emerald-950 font-black text-[9px] sm:text-[10px] uppercase tracking-wider flex-shrink-0 shadow-xs">
              <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-900" />
              <span>Live</span>
            </span>
          )}

          <span className="text-[11px] sm:text-xs text-stone-700 font-medium truncate" title={airData.metadata.stationName}>
            <span className="hidden sm:inline font-bold text-stone-800">
              {isDemo ? 'SIMULATION: ' : 'STATION: '}
            </span>
            {airData.metadata.stationName}
          </span>
        </div>

        {/* Right: Scale Standard (Desktop) + Scenario Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* AQI Scale Standard Selector on Desktop */}
          <div className="hidden lg:flex items-center bg-white border border-warm-300 rounded-lg p-0.5 text-[10px] font-semibold text-stone-700 shadow-2xs">
            <button
              onClick={() => setAqiScale('CPCB_INDIA')}
              className={`px-1.5 py-0.5 rounded ${aqiScale === 'CPCB_INDIA' ? 'bg-amber-600 text-white shadow-xs' : 'hover:text-amber-800'}`}
              title="CPCB India National Air Quality Index standard"
            >
              CPCB India
            </button>
            <button
              onClick={() => setAqiScale('US_EPA')}
              className={`px-1.5 py-0.5 rounded ${aqiScale === 'US_EPA' ? 'bg-amber-600 text-white shadow-xs' : 'hover:text-amber-800'}`}
              title="United States EPA AQI Standard"
            >
              US EPA
            </button>
          </div>

          {/* Quick Scenario Selector */}
          <select
            value={activeScenarioId}
            onChange={(e) => selectScenario(e.target.value)}
            className="bg-white border border-warm-300 text-stone-800 text-[10px] sm:text-xs rounded-lg px-2 py-0.5 outline-none font-semibold shadow-xs max-w-[130px] sm:max-w-[220px] truncate"
            title="Switch between live sensor data and winter smog scenarios"
          >
            <option value="live">📡 Live Station</option>
            {availableScenarios.map((sc) => (
              <option key={sc.id} value={sc.id}>
                🧪 {sc.name.split(' (')[0]} (AQI {sc.aqi})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Main Navbar Row (Responsive, generous spacing, zero mobile overflow) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 cursor-pointer group"
          title="BreatheWise AI Home"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-terracotta-600 flex items-center justify-center shadow-warm-xs sm:shadow-warm-md text-white group-hover:scale-105 transition-transform">
            <Wind className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-base sm:text-xl font-bold tracking-tight text-stone-900 font-serif">BreatheWise</span>
              <span className="text-[8px] sm:text-[9px] uppercase font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-950 border border-amber-300">
                AI
              </span>
            </div>
            <p className="text-[10px] text-stone-500 hidden md:block">Urban Smog & Daily Routine Companion</p>
          </div>
        </div>

        {/* Action Controls Cluster: Location Pill + Language + Routine Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Location Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1 bg-stone-50 hover:bg-stone-100/90 active:bg-stone-200 border border-warm-200 rounded-xl px-2 sm:px-3 py-1.5 text-xs text-stone-800 shadow-xs transition max-w-[110px] sm:max-w-[170px]"
              title={`Active location: ${selectedCity.name}. Click to change.`}
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
              <span className="font-semibold truncate text-[11px] sm:text-xs">
                {selectedCity.name.split(' (')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400 flex-shrink-0" />
            </button>

            {/* City Selection Modal / Dropdown Menu */}
            {isCityDropdownOpen && (
              <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 bg-white border border-warm-200 rounded-2xl shadow-warm-xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-warm-100">
                  <span className="text-xs font-bold text-stone-900 font-serif">Select City or Coordinates</span>
                  <button 
                    onClick={() => setIsCityDropdownOpen(false)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Live Geocoding Search Input */}
                <div className="relative mb-2.5">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={(e) => handleCitySearch(e.target.value)}
                    placeholder="Search any city in India or globally..."
                    className="w-full pl-8 pr-7 py-1.5 bg-warm-50 border border-warm-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-orange-500 font-medium"
                    autoFocus
                  />
                  {isSearchingCity && (
                    <Loader2 className="w-3.5 h-3.5 text-orange-600 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Quick GPS & Refresh Actions */}
                <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                  <button
                    onClick={() => {
                      useLiveLocation();
                      setIsCityDropdownOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-orange-950 text-[11px] font-bold transition"
                  >
                    <Navigation className="w-3 h-3 text-orange-700" />
                    <span>My GPS Location</span>
                  </button>

                  <button
                    onClick={() => {
                      refreshAirData();
                      setIsCityDropdownOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-warm-200 text-stone-700 text-[11px] font-bold transition"
                  >
                    <RefreshCw className={`w-3 h-3 text-stone-600 ${isLoadingAir ? 'animate-spin text-orange-600' : ''}`} />
                    <span>Refresh Readings</span>
                  </button>
                </div>

                <div className="px-1 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-warm-100 mb-1 flex items-center justify-between">
                  <span>{citySearchQuery ? 'Search Results' : 'Major Urban Presets'}</span>
                  <span className="text-orange-700 font-semibold">
                    {citySearchQuery ? `${liveSearchResults.length} found` : '11 Presets'}
                  </span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-0.5 no-scrollbar">
                  {(citySearchQuery ? liveSearchResults : INDIAN_CITIES).map((city) => (
                    <button
                      key={`${city.name}-${city.lat}`}
                      onClick={() => {
                        selectCity(city);
                        setIsCityDropdownOpen(false);
                        setCitySearchQuery('');
                        setLiveSearchResults([]);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                        selectedCity.name === city.name
                          ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <span className="font-semibold block">{city.name}</span>
                        <span className="text-[10px] text-stone-400 block">{city.state}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-warm-100 text-stone-500 font-mono">
                        {city.lat.toFixed(1)}°, {city.lon.toFixed(1)}°
                      </span>
                    </button>
                  ))}

                  {citySearchQuery && liveSearchResults.length === 0 && !isSearchingCity && (
                    <div className="text-center py-4 text-xs text-stone-400">
                      No matching cities found. Try checking the spelling.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 active:bg-stone-200 border border-warm-200 text-xs font-bold text-stone-700 transition shadow-xs flex-shrink-0"
            title="Switch Language: English / हिन्दी"
          >
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[11px] sm:text-xs font-semibold">{language === 'en' ? 'हि' : 'EN'}</span>
          </button>

          {/* Profile / Preferences Routine Drawer Trigger */}
          <button
            onClick={() => setIsProfileDrawerOpen(true)}
            className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-warm-xs transition flex-shrink-0"
            title="Configure your household profile, exercise habit, and commute mode"
          >
            <Sliders className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline font-semibold">{isHi ? 'मेरी दिनचर्या' : 'My Routine'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
