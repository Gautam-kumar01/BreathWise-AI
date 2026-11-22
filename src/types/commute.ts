export interface CommuteModeProfile {
  id: string;
  name: string;
  icon: string;
  travelTimeMin: number;
  costInr: number;
  inhaledDoseScore: number;     // Scale 1 to 10 (1 = lowest particulate inhalation, 10 = maximum direct exposure)
  co2EmissionsKg: number;       // kg CO2e for typical 12km urban commute
  filterType: string;
  description: string;
  pros: string[];
  cons: string[];
  smogRecommendation: string;
}

export const COMMUTE_MODES: CommuteModeProfile[] = [
  {
    id: 'metro_transit',
    name: 'Metro Rail (AC)',
    icon: 'Train',
    travelTimeMin: 32,
    costInr: 40,
    inhaledDoseScore: 2,         // Sealed, positive-pressure HVAC with secondary filtration
    co2EmissionsKg: 0.18,        // Low per-passenger emissions
    filterType: 'HVAC Multi-Stage Filtration',
    description: 'Underground/elevated transit with filtered indoor platforms and climate-controlled coaches.',
    pros: ['Lowest inhaled particulate dose', 'Zero traffic delay', 'Minimal carbon footprint'],
    cons: ['First/last mile walking exposure', 'Crowded during peak rush'],
    smogRecommendation: 'Top recommended choice on Severe/Very Poor smog days. Wear N95 during last-mile walking.'
  },
  {
    id: 'ac_car_cab',
    name: 'AC Cab / Car (Recirculation)',
    icon: 'Car',
    travelTimeMin: 45,
    costInr: 280,
    inhaledDoseScore: 4,         // Low exposure IF cabin air filter is maintained and recirculation ON
    co2EmissionsKg: 2.25,        // High carbon footprint per solo passenger
    filterType: 'Cabin Air Filter (PM2.5)',
    description: 'Personal car or rideshare with windows rolled up and AC set to internal recirculation mode.',
    pros: ['Door-to-door convenience', 'Shielded from road dust'],
    cons: ['Highest direct emissions', 'High cost', 'Traffic jam delays'],
    smogRecommendation: 'Crucial: ALWAYS set AC to "Internal Recirculation" to prevent pulling exhaust into the cabin.'
  },
  {
    id: 'auto_rickshaw',
    name: 'CNG Auto-Rickshaw',
    icon: 'Navigation',
    travelTimeMin: 40,
    costInr: 120,
    inhaledDoseScore: 8,         // Open cabin sits directly at diesel bus/truck exhaust pipe height
    co2EmissionsKg: 0.72,
    filterType: 'None (Ambient Air)',
    description: 'Open three-wheeler operating directly in the traffic exhaust mixing layer.',
    pros: ['Affordable', 'Faster in dense city alleys'],
    cons: ['Direct inhalation of road dust and diesel particulates', 'Cold draft'],
    smogRecommendation: 'High exposure risk. A snug N95 mask is strictly necessary during peak smog hours.'
  },
  {
    id: 'two_wheeler',
    name: 'Motorcycle / Scooter',
    icon: 'Bike',
    travelTimeMin: 35,
    costInr: 50,
    inhaledDoseScore: 9,         // Maximum physical exertion + direct exhaust plume
    co2EmissionsKg: 0.54,
    filterType: 'None (Helmet does not filter PM2.5)',
    description: 'Direct atmospheric exposure during acceleration behind heavy commercial vehicles.',
    pros: ['Fastest point-to-point', 'Low fuel cost'],
    cons: ['Maximum particulate alveolar penetration', 'Helmet visor only blocks insects/grit, not PM2.5'],
    smogRecommendation: 'Avoid during 7 AM–10 AM smog peaks if possible. If required, wear an airtight N95/FFP2 mask.'
  },
  {
    id: 'walking_biking',
    name: 'Bicycle / Walking',
    icon: 'Footprints',
    travelTimeMin: 55,
    costInr: 0,
    inhaledDoseScore: 10,        // Heavy aerobic respiration increases tidal volume 4-8x
    co2EmissionsKg: 0.0,         // Zero emissions
    filterType: 'None',
    description: 'Active transport resulting in deep lung ventilation.',
    pros: ['Zero emissions', 'Zero financial cost'],
    cons: ['Massive lung dose in Severe AQI due to heavy breathing rate'],
    smogRecommendation: 'Unsafe for long distances when AQI > 300. Save active commuting for Satisfactory/Moderate days.'
  }
];
