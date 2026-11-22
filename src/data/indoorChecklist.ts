export interface IndoorHack {
  id: string;
  room: 'kitchen' | 'bedroom' | 'living' | 'classroom';
  title: string;
  action: string;
  costTier: 'Free' | 'Low-cost (₹50-₹300)' | 'Equipment (Purifier)';
  evidenceWhy: string;
  safetyCaution: string;
  impactScore: 'High' | 'Medium' | 'Essential';
}

export const INDOOR_HACKS: IndoorHack[] = [
  {
    id: 'h1',
    room: 'kitchen',
    title: 'Exhaust Hood Timing Rule',
    action: 'Turn kitchen exhaust fan ON 2 minutes BEFORE lighting the gas stove, and leave it running for 5 minutes after cooking.',
    costTier: 'Free',
    evidenceWhy: 'Combustion of LPG produces nitrogen dioxide (NO2) and ultrafine carbon particles. Establishing positive directional flow prevents gas from diffusing into bedrooms.',
    safetyCaution: 'Do not block fresh air vents or make the kitchen completely airtight if using unvented flame.',
    impactScore: 'Essential'
  },
  {
    id: 'h2',
    room: 'kitchen',
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
    title: 'DIY Box-Fan Filter (Corsi-Rosenthal Variant)',
    action: 'Tape a basic MERV-13 / HEPA replacement sheet to the intake of a standard tabletop box fan.',
    costTier: 'Low-cost (₹50-₹300)',
    evidenceWhy: 'Provides clean air delivery rate (CADR) of ~120 CFM for under ₹800, removing up to 70% of indoor PM2.5 in a 150 sq ft room.',
    safetyCaution: 'Ensure fan motor does not overheat; do not cover exhaust vents.',
    impactScore: 'Medium'
  }
];
