import { ScenarioDefinition } from '../types/air';

export const SEEDED_SCENARIOS: Record<string, ScenarioDefinition> = {
  delhi_severe: {
    id: 'delhi_severe',
    name: 'Delhi Winter Smog (GRAP-IV)',
    tagline: 'Severe ground-level temperature inversion',
    location: 'Anand Vihar / East Delhi',
    aqi: 428,
    category: 'Severe',
    description: 'Dense winter radiation fog traps vehicular exhaust and biomass emissions close to ground level.',
    data: {
      aqi: 428,
      dominantPollutant: 'PM2.5',
      category: 'Severe',
      categoryColor: '#7f1d1d',
      pollutants: {
        pm25: 298.5,
        pm10: 462.0,
        no2: 88.4,
        so2: 24.1,
        o3: 42.0,
        co: 3.4
      },
      metadata: {
        stationName: 'Anand Vihar DPCC Ground Station',
        city: 'New Delhi',
        state: 'Delhi',
        latitude: 28.6508,
        longitude: 77.3152,
        provider: 'CPCB / DPCC Real-Time Feed (Demo Mode)',
        lastUpdated: '15 mins ago (08:30 IST)',
        freshness: 'DEMO_SCENARIO',
        isRealTime: false,
        rawStationSource: 'DPCC Continuous Ambient Air Quality Monitoring Station (CAAQMS)'
      },
      scale: 'CPCB_INDIA',
      weather: {
        temperatureC: 13.5,
        humidityPercent: 88,
        windSpeedKmH: 3.2,
        windDirectionDegrees: 310,
        windDirectionCardinal: 'NW (Calm Stagnant)',
        stagnationStatus: 'Severe Inversion Trap',
        stagnationReason: 'Ultra-low wind (<4 km/h) combined with high winter humidity creates a shallow 80m boundary layer, trapping all tailpipe and biomass smoke.'
      },
      hourlyCurve: [
        { hour: 0, timeLabel: '12 AM', aqi: 390, pm25: 260, temperatureC: 13, inversionRisk: 'High', activityVerdict: 'Keep windows sealed' },
        { hour: 2, timeLabel: '02 AM', aqi: 410, pm25: 280, temperatureC: 11, inversionRisk: 'Severe', activityVerdict: 'Deep inversion hazard' },
        { hour: 4, timeLabel: '04 AM', aqi: 435, pm25: 305, temperatureC: 9, inversionRisk: 'Severe', activityVerdict: 'Hazardous air pocket' },
        { hour: 6, timeLabel: '06 AM', aqi: 452, pm25: 320, temperatureC: 9, inversionRisk: 'Severe', activityVerdict: 'Cancel outdoor exercise' },
        { hour: 7, timeLabel: '07 AM', aqi: 465, pm25: 335, temperatureC: 10, inversionRisk: 'Severe', activityVerdict: 'Peak hazard: wear N95' },
        { hour: 8, timeLabel: '08 AM', aqi: 440, pm25: 310, temperatureC: 12, inversionRisk: 'Severe', activityVerdict: 'School bus rush hour risk' },
        { hour: 9, timeLabel: '09 AM', aqi: 415, pm25: 285, temperatureC: 15, inversionRisk: 'High', activityVerdict: 'Use AC metro transit' },
        { hour: 11, timeLabel: '11 AM', aqi: 360, pm25: 230, temperatureC: 20, inversionRisk: 'Moderate', activityVerdict: 'Sun beginning to break inversion' },
        { hour: 13, timeLabel: '01 PM', aqi: 295, pm25: 175, temperatureC: 23, inversionRisk: 'Low', isSafeVentilationWindow: true, activityVerdict: 'Micro-ventilation safe (20 min)' },
        { hour: 14, timeLabel: '02 PM', aqi: 270, pm25: 155, temperatureC: 24, inversionRisk: 'Low', isSafeVentilationWindow: true, activityVerdict: 'Optimal errand window' },
        { hour: 15, timeLabel: '03 PM', aqi: 280, pm25: 165, temperatureC: 23, inversionRisk: 'Low', isSafeVentilationWindow: true, activityVerdict: 'Lowest daily soot load' },
        { hour: 17, timeLabel: '05 PM', aqi: 340, pm25: 215, temperatureC: 20, inversionRisk: 'Moderate', activityVerdict: 'Evening inversion begins' },
        { hour: 19, timeLabel: '07 PM', aqi: 410, pm25: 280, temperatureC: 17, inversionRisk: 'High', activityVerdict: 'Seal home windows firmly' },
        { hour: 21, timeLabel: '09 PM', aqi: 445, pm25: 315, temperatureC: 14, inversionRisk: 'Severe', activityVerdict: 'Do not sleep with open balcony' },
        { hour: 23, timeLabel: '11 PM', aqi: 420, pm25: 290, temperatureC: 13, inversionRisk: 'High', activityVerdict: 'Night cold trap' }
      ],
      dailyForecastSummary: {
        cleanestWindow: '01:30 PM – 03:45 PM (AQI ~270, Sunlight dispersal)',
        highestPeakWindow: '06:30 AM – 09:00 AM (Cold inversion trap)',
        recommendedOutdoorTime: 'Avoid morning outdoor exercise; shift errands to 2:00 PM',
        ventilationSafeNow: false,
        ventilationReason: 'Heavy particulate ingress risk. Outdoor PM2.5 is 298.5 µg/m³. Keep windows sealed until 1:30 PM solar window.'
      }
    }
  },
  mumbai_coastal: {
    id: 'mumbai_coastal',
    name: 'Mumbai Coastal Smog',
    tagline: 'High humidity & vehicular stagnation',
    location: 'BKC / Bandra Kurla Complex',
    aqi: 188,
    category: 'Moderate',
    description: 'Sea-breeze stalls in late afternoon causing trapped dust and traffic corridor emissions.',
    data: {
      aqi: 188,
      dominantPollutant: 'PM2.5',
      category: 'Moderate',
      categoryColor: '#d97706',
      pollutants: {
        pm25: 96.2,
        pm10: 168.0,
        no2: 64.0,
        so2: 14.5,
        o3: 55.0,
        co: 1.8
      },
      metadata: {
        stationName: 'BKC MPCB Ground Monitor',
        city: 'Mumbai',
        state: 'Maharashtra',
        latitude: 19.0662,
        longitude: 72.8687,
        provider: 'MPCB / SAFAR Sensor Network (Demo Mode)',
        lastUpdated: '10 mins ago (08:45 IST)',
        freshness: 'DEMO_SCENARIO',
        isRealTime: false,
        rawStationSource: 'Maharashtra Pollution Control Board (MPCB)'
      },
      scale: 'CPCB_INDIA',
      weather: {
        temperatureC: 28.2,
        humidityPercent: 74,
        windSpeedKmH: 7.5,
        windDirectionDegrees: 240,
        windDirectionCardinal: 'SW (Coastal Sea Breeze)',
        stagnationStatus: 'Moderate Stagnation',
        stagnationReason: 'Afternoon sea-breeze convergence creates localized particulate haze over the western expressway corridor.'
      },
      hourlyCurve: [
        { hour: 0, timeLabel: '12 AM', aqi: 135, pm25: 65, temperatureC: 24, inversionRisk: 'Low', activityVerdict: 'Moderate air' },
        { hour: 3, timeLabel: '03 AM', aqi: 120, pm25: 58, temperatureC: 23, inversionRisk: 'Low', activityVerdict: 'Normal baseline' },
        { hour: 6, timeLabel: '06 AM', aqi: 145, pm25: 72, temperatureC: 22, inversionRisk: 'Moderate', activityVerdict: 'Light outdoor walk safe' },
        { hour: 8, timeLabel: '08 AM', aqi: 175, pm25: 88, temperatureC: 25, inversionRisk: 'Moderate', activityVerdict: 'Traffic corridor peak' },
        { hour: 9, timeLabel: '09 AM', aqi: 195, pm25: 102, temperatureC: 27, inversionRisk: 'High', activityVerdict: 'Peak rush hour smog' },
        { hour: 12, timeLabel: '12 PM', aqi: 160, pm25: 80, temperatureC: 31, inversionRisk: 'Low', isSafeVentilationWindow: true, activityVerdict: 'Cross-ventilation safe' },
        { hour: 14, timeLabel: '02 PM', aqi: 140, pm25: 68, temperatureC: 32, inversionRisk: 'Low', isSafeVentilationWindow: true, activityVerdict: 'Good outdoor window' },
        { hour: 17, timeLabel: '05 PM', aqi: 185, pm25: 94, temperatureC: 29, inversionRisk: 'Moderate', activityVerdict: 'Evening rush building' },
        { hour: 19, timeLabel: '07 PM', aqi: 210, pm25: 110, temperatureC: 27, inversionRisk: 'High', activityVerdict: 'High vehicular plume' },
        { hour: 21, timeLabel: '09 PM', aqi: 180, pm25: 90, temperatureC: 26, inversionRisk: 'Moderate', activityVerdict: 'Sea breeze clears haze' }
      ],
      dailyForecastSummary: {
        cleanestWindow: '12:00 PM – 03:00 PM (Strong afternoon coastal breeze)',
        highestPeakWindow: '06:30 PM – 08:30 PM (Evening peak traffic gridlock)',
        recommendedOutdoorTime: 'Late morning (11 AM) or afternoon is safe with moderate intensity',
        ventilationSafeNow: true,
        ventilationReason: 'Safe for cross-ventilation for 20-30 minutes away from main road corridors.'
      }
    }
  },
  bengaluru_clear: {
    id: 'bengaluru_clear',
    name: 'Bengaluru Fresh Day',
    tagline: 'Optimal post-shower air quality',
    location: 'BTM Layout / Koramangala',
    aqi: 62,
    category: 'Satisfactory',
    description: 'Active canopy cover and prevailing winds keep particulate pollution well within safe benchmarks.',
    data: {
      aqi: 62,
      dominantPollutant: 'PM10',
      category: 'Satisfactory',
      categoryColor: '#65a30d',
      pollutants: {
        pm25: 18.4,
        pm10: 52.0,
        no2: 26.0,
        so2: 8.0,
        o3: 35.0,
        co: 0.6
      },
      metadata: {
        stationName: 'BTM Layout KSPCB Station',
        city: 'Bengaluru',
        state: 'Karnataka',
        latitude: 12.9165,
        longitude: 77.6101,
        provider: 'KSPCB Environmental Station (Demo Mode)',
        lastUpdated: '5 mins ago (08:50 IST)',
        freshness: 'DEMO_SCENARIO',
        isRealTime: false,
        rawStationSource: 'Karnataka State Pollution Control Board'
      },
      scale: 'CPCB_INDIA',
      weather: {
        temperatureC: 22.0,
        humidityPercent: 58,
        windSpeedKmH: 14.8,
        windDirectionDegrees: 110,
        windDirectionCardinal: 'ESE (Breezy Dispersal)',
        stagnationStatus: 'Active Dispersion',
        stagnationReason: 'Healthy plateau wind velocity (>12 km/h) prevents particulate buildup; excellent atmospheric mixing.'
      },
      hourlyCurve: [
        { hour: 6, timeLabel: '06 AM', aqi: 55, pm25: 15, temperatureC: 18, inversionRisk: 'Low', isSafeVentilationWindow: true, activityVerdict: 'Excellent for morning jog' },
        { hour: 9, timeLabel: '09 AM', aqi: 75, pm25: 22, temperatureC: 22, inversionRisk: 'Low', activityVerdict: 'Mild traffic rise' },
        { hour: 12, timeLabel: '12 PM', aqi: 60, pm25: 17, temperatureC: 27, inversionRisk: 'Low', isSafeVentilationWindow: true, activityVerdict: 'Open windows freely' },
        { hour: 15, timeLabel: '03 PM', aqi: 52, pm25: 14, temperatureC: 28, inversionRisk: 'Low', isSafeVentilationWindow: true, activityVerdict: 'Cleanest daily window' },
        { hour: 18, timeLabel: '06 PM', aqi: 70, pm25: 20, temperatureC: 24, inversionRisk: 'Low', activityVerdict: 'Parks and outdoor play safe' },
        { hour: 21, timeLabel: '09 PM', aqi: 65, pm25: 19, temperatureC: 21, inversionRisk: 'Low', activityVerdict: 'Cool, clean evening' }
      ],
      dailyForecastSummary: {
        cleanestWindow: 'All day outdoor windows safe; optimal at 06:00 AM – 08:00 AM',
        highestPeakWindow: 'None (Minor traffic rise 9 AM - 10 AM)',
        recommendedOutdoorTime: 'All day outdoor activities suitable for all age groups',
        ventilationSafeNow: true,
        ventilationReason: 'Air quality is satisfactory. Natural cross ventilation highly recommended.'
      }
    }
  }
};
