import { IndoorHack } from '../types/indoor';

export const INDOOR_HACKS: IndoorHack[] = [
  {
    id: 'h1',
    room: 'kitchen',
    category: 'cooking',
    title: 'Exhaust Hood Pre-Run Timing Rule',
    action: 'Turn kitchen exhaust fan ON 2 minutes BEFORE lighting the gas stove, and leave it running for 5 minutes after cooking.',
    costTier: 'Free',
    evidenceWhy: 'Combustion of LPG produces nitrogen dioxide (NO2) and ultrafine carbon particles. Establishing positive directional flow prevents gas from diffusing into bedrooms.',
    safetyCaution: 'Do not block fresh air vents or make the kitchen completely airtight if using unvented flame.',
    impactScore: 'Essential'
  },
  {
    id: 'h2',
    room: 'kitchen',
    category: 'cooking',
    title: 'Lid-Covered Low-Splatter Cooking',
    action: 'Cover pans during tempering (tadka/spices) and avoid deep frying during high smog hours.',
    costTier: 'Free',
    evidenceWhy: 'Oil vapor aerosolization produces indoor PM2.5 concentrations exceeding 400 µg/m³ within 10 minutes inside enclosed kitchens.',
    safetyCaution: 'Avoid open-pan frying without active outdoor exhaust.',
    impactScore: 'High'
  },
  {
    id: 'h3',
    room: 'bedroom',
    category: 'ventilation',
    title: 'Micro-Ventilation Inversion Rule',
    action: 'Keep bedroom windows firmly closed between 9 PM and 11 AM. Ventilate ONLY between 1:30 PM and 3:30 PM when solar heat lifts ground smog.',
    costTier: 'Free',
    evidenceWhy: 'Ground-level temperature inversion traps pollutants at head level during cold night hours. Midday sun breaks the boundary layer.',
    safetyCaution: 'If someone in the room has an acute asthma flare, postpone ventilation until outdoor AQI improves.',
    impactScore: 'Essential'
  },
  {
    id: 'h4',
    room: 'bedroom',
    category: 'dust',
    title: 'Damp Microfiber Mopping (Zero Dry Sweeping)',
    action: 'Never dry sweep or dust bedrooms. Use a damp microfiber cloth for horizontal surfaces and wet mop with clean water.',
    costTier: 'Free',
    evidenceWhy: 'Dry brooms resuspend settled toxic fine dust back into the breathing zone for 2–3 hours. Damp mopping binds particles for easy disposal.',
    safetyCaution: 'Do not mix chemical disinfectants or bleach with ammonia; use clean water or mild detergent.',
    impactScore: 'High'
  },
  {
    id: 'h5',
    room: 'living',
    category: 'dust',
    title: 'Door & Window Gap Weather-Sealing Hack',
    action: 'Place rolled damp towels or self-adhesive foam strips along bottom door sills and window frame gaps.',
    costTier: 'Low-cost (₹50-₹300)',
    evidenceWhy: 'Up to 60% of outdoor smog infiltrates through under-door drafts and sliding window seams in urban apartments.',
    safetyCaution: 'Ensure adequate fresh air exchange if CO2 levels exceed 1200 ppm or if using unvented room heaters.',
    impactScore: 'High'
  },
  {
    id: 'h6',
    room: 'living',
    category: 'source_control',
    title: 'Zero Indoor Incense & Agarbatti Protocol',
    action: 'Substitute burning dhoop, agarbatti, or mosquito coils with electric evaporators or essential oil diffusers.',
    costTier: 'Free',
    evidenceWhy: 'A single burning incense stick releases particulate emissions equivalent to 4–6 cigarettes in an enclosed space.',
    safetyCaution: 'Respect cultural traditions gently: light ceremonial incense outdoors or in a dedicated well-ventilated balcony.',
    impactScore: 'Essential'
  },
  {
    id: 'h7',
    room: 'bedroom',
    category: 'purifier',
    title: 'HEPA Filter Vacuuming & Pre-Filter Wash',
    action: 'Vacuum the mesh pre-filter every 2 weeks to remove coarse cat/dog hair and dust. Never wash the paper HEPA core with water.',
    costTier: 'Free',
    evidenceWhy: 'A clogged pre-filter cuts Clean Air Delivery Rate (CADR) by up to 40% and burns fan motor coils prematurely.',
    safetyCaution: 'Perform filter dusting outdoors while wearing an N95 mask to avoid breathing concentrated soot cake.',
    impactScore: 'High'
  },
  {
    id: 'h8',
    room: 'study',
    category: 'ventilation',
    title: 'Study Room CO2 Flush Rule (Cognitive Fatigue)',
    action: 'When studying in a closed room for over 90 minutes, crack the interior corridor door for 5 minutes to flush accumulated carbon dioxide.',
    costTier: 'Free',
    evidenceWhy: 'Indoor CO2 concentrations above 1200 ppm in sealed study spaces reduce cognitive focus, memory retention, and cause drowsiness.',
    safetyCaution: 'Do not open exterior road-facing windows if outdoor PM2.5 is high; ventilate from interior hallway instead.',
    impactScore: 'High'
  },
  {
    id: 'h9',
    room: 'study',
    category: 'purifier',
    title: 'DIY Desktop Corsi-Rosenthal Fan Box',
    action: 'Tape a basic MERV-13 filter panel to a 12V desk fan or small box fan pointed away from your face.',
    costTier: 'Low-cost (₹50-₹300)',
    evidenceWhy: 'Removes up to 70% of fine soot in a small 80 sq ft study room within 30 minutes for less than ₹400 in materials.',
    safetyCaution: 'Ensure no wires are frayed and avoid blocking fan air discharge.',
    impactScore: 'Medium'
  },
  {
    id: 'h10',
    room: 'classroom',
    category: 'source_control',
    title: 'Morning Arrival Window Seal Protocol',
    action: 'Keep classroom windows and main doors shut from 7:30 AM to 9:30 AM while school buses and vans idle in the school yard.',
    costTier: 'Free',
    evidenceWhy: 'Diesel exhaust plumes from arriving buses create localized PM2.5 spikes exceeding 500 µg/m³ directly at ground-floor classroom windows.',
    safetyCaution: 'Open windows for cross-ventilation during lunch break (12:30 PM–1:30 PM) when buses are turned off.',
    impactScore: 'Essential'
  },
  {
    id: 'h11',
    room: 'classroom',
    category: 'dust',
    title: 'Chalk Dust & Chalkboard Wet-Wiping',
    action: 'Use damp sponges rather than dry dusters to clean blackboards; prefer dustless chalk or whiteboard markers.',
    costTier: 'Free',
    evidenceWhy: 'Dry erasing releases calcium carbonate aerosols that irritate asthma-prone children and compound outdoor smog irritation.',
    safetyCaution: 'Ensure marker fumes are ventilated if using solvent-based whiteboard pens.',
    impactScore: 'High'
  }
];
