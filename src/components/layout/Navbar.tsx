import React, { useState } from 'react';
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
  Sparkles,
  Search,
  Loader2
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
    searchCityGeocode
  } = useApp();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [liveSearchResults, setLiveSearchResults] = useState<typeof INDIAN_CITIES>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const isDemo = activeScenarioId !== 'live';
  const isHi = language === 'hi';

  const handleCitySearch = async (val: string) => {
    setCitySearchQuery(val);
    if (!val.trim()) {
      setLiveSearchResults([]);
      return;
    }
    setIsSearchingCity(true);
    try {
      const results = await searchCityGeocode(val);
      setLiveSearchResults(results);
    } catch {
      setLiveSearchResults([]);
    } finally {
      setIsSearchingCity(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-200 shadow-warm-sm">
      {/* Top Demo / Freshness Provenance Banner */}
      <div className={`px-4 py-1.5 text-xs flex items-center justify-between border-b ${
        isDemo 
          ? 'bg-amber-50/80 border-amber-200 text-amber-900' 
          : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-center gap-2">
          {isDemo ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
              <span>
                <strong className="font-bold">DEMO SCENARIO ACTIVE:</strong> {airData.metadata.stationName} (Simulated ground inversion)
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span>
                <strong className="font-bold">LIVE MONITOR:</strong> {airData.metadata.stationName} • {airData.metadata.lastUpdated}
              </span>
            </>
          )}
        </div>

        {/* Quick Scenario Preset Dropdown */}
        <div className="flex items-center gap-3">
          {/* AQI Standard Toggle */}
          <div className="hidden md:flex items-center bg-white border border-warm-300 rounded-lg p-0.5 text-[11px] font-semibold text-stone-700">
            <button
              onClick={() => setAqiScale('CPCB_INDIA')}
              className={`px-2 py-0.5 rounded ${aqiScale === 'CPCB_INDIA' ? 'bg-amber-600 text-white shadow-sm' : 'hover:text-amber-800'}`}
              title="CPCB India National Air Quality Index standard"
            >
              India (CPCB)
            </button>
            <button
              onClick={() => setAqiScale('US_EPA')}
              className={`px-2 py-0.5 rounded ${aqiScale === 'US_EPA' ? 'bg-amber-600 text-white shadow-sm' : 'hover:text-amber-800'}`}
              title="United States EPA AQI Standard"
            >
              US EPA
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline text-stone-600 font-medium">Scenario:</span>
            <select
              value={activeScenarioId}
              onChange={(e) => selectScenario(e.target.value)}
              className="bg-white border border-warm-300 text-stone-800 text-xs rounded-md px-2 py-0.5 outline-none focus:border-amber-500 font-medium shadow-sm"
            >
              <option value="live">📡 Live Ground Station (Open-Meteo)</option>
              {availableScenarios.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  🧪 {sc.name} (AQI {sc.aqi})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-terracotta-600 flex items-center justify-center shadow-warm-md text-white">
            <Wind className="w-5 h-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-stone-900 font-serif">BreatheWise</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                AI
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">Urban Smog & Routine Companion</p>
          </div>
        </div>

        {/* Location Dropdown & GPS trigger */}
        <div className="relative">
          <div className="flex items-center bg-stone-50 hover:bg-white border border-warm-200 rounded-full pl-3 pr-2 py-1 text-xs text-stone-800 shadow-sm transition">
            <MapPin className="w-3.5 h-3.5 text-orange-600 mr-1.5 flex-shrink-0" />
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="font-semibold max-w-[140px] sm:max-w-[200px] truncate flex items-center gap-1 hover:text-amber-800"
            >
              <span>{selectedCity.name}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            <div className="h-4 w-px bg-warm-200 mx-1.5" />

            <button
              onClick={() => useLiveLocation()}
              title="Use GPS exact location"
              className="p-1 text-stone-500 hover:text-orange-600 transition"
            >
              <Navigation className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => refreshAirData()}
              title="Refresh air readings"
              className="p-1 text-stone-500 hover:text-amber-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAir ? 'animate-spin text-amber-600' : ''}`} />
            </button>
          </div>

          {/* City Selection Dropdown Menu */}
          {isCityDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white border border-warm-200 rounded-2xl shadow-warm-xl p-2.5 z-50">
              {/* Live Geocoding Search Input */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  placeholder="Type any city in India or worldwide..."
                  className="w-full pl-8 pr-7 py-1.5 bg-warm-50 border border-warm-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-amber-500 font-medium"
                  autoFocus
                />
                {isSearchingCity && (
                  <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
                )}
              </div>

              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-warm-100 mb-1 flex items-center justify-between">
                <span>{citySearchQuery ? 'Live Search Matches' : 'Popular Urban Stations'}</span>
                <span className="text-[10px] text-amber-600 font-semibold">
                  {citySearchQuery ? `${liveSearchResults.length} found` : '11 Presets'}
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-0.5">
                {(citySearchQuery ? liveSearchResults : INDIAN_CITIES).map((city) => (
                  <button
                    key={`${city.name}-${city.lat}`}
                    onClick={() => {
                      selectCity(city);
                      setIsCityDropdownOpen(false);
                      setCitySearchQuery('');
                      setLiveSearchResults([]);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      selectedCity.name === city.name
                        ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <span className="font-semibold">{city.name}</span>
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

        {/* Controls: Language & Context Settings */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-warm-200 text-xs font-bold text-stone-700 transition shadow-sm"
            title="Toggle English / Hindi"
          >
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Profile / Preferences Trigger */}
          <button
            onClick={() => setIsProfileDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-warm-sm transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isHi ? 'मेरी दिनचर्या' : 'My Context'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
