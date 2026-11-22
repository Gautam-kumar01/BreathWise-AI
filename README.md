# BreatheWise AI — Urban Air Quality Assistant
> **A location-aware, GenAI-powered companion for safer routines, cleaner indoor spaces, and lower-impact daily choices.**  
> *Developed for PromptWars 5 • Challenge 6: Urban Air Quality Assistant*

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Open-Meteo](https://img.shields.io/badge/Data-Open--Meteo%20Copernicus%20CAMS-FF6B6B)](https://open-meteo.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel%20Ready-000000?logo=vercel&logoColor=white)](https://vercel.com/)

---

## 📌 Executive Summary (250-Word Project Description)

**BreatheWise AI** is a responsive, location-aware environmental health assistant designed to help urban families, commuters, and communities navigate severe winter smog and urban air pollution. 

Standard air-quality applications suffer from the **"Panic-Paralysis Gap"**—they display frightening high-alert numbers (*"AQI 428 — Severe"*) with generic warnings (*"Stay indoors"*) that cause anxiety without offering realistic, schedule-aligned solutions. BreatheWise AI bridges this gap by translating real-time atmospheric data into **actionable schedule adjustments, evidence-backed zero-cost indoor hacks, and multimodal commute comparisons**.

Instead of telling users to cancel their lives, BreatheWise leverages **atmospheric diurnal temperature inversion science** to time-shift daily routines: identifying peak morning hazard traps (6:30 AM–9:00 AM) and directing errands and micro-ventilation toward clean afternoon solar windows (1:30 PM–3:30 PM). The platform features an interactive **Respiratory Health & Inhaled Soot Calculator** (modeling minute ventilation volume, N95 filtration efficacy, and passive cigarette equivalence proxies), a dynamic **Indoor Ventilation Decision Matrix**, a **Multimodal Commute Trade-off Engine** (weighing inhaled particulate dose risk against travel time, cost, and avoided CO2e), a **One-Click WhatsApp Community Bulletin Generator** for housing societies (RWAs) and schools, and an **Audio Voice Briefing** for busy commuters.

Powered by public satellite and ground sensor assimilation feeds (European Copernicus CAMS via Open-Meteo) with zero mandatory API keys, BreatheWise AI provides transparent data provenance through expandable **"Why This Recommendation?" (XAI)** drawers, strict non-medical safety boundaries, and instant English/Hindi bilingual accessibility.

---

## 🚀 Key Features & Architectural Innovations

### 1. 24-Hour Diurnal Inversion Wave & Interactive Scrubber
- **Meteorological Wave Curve:** Live SVG spline graph mapping the daily smog boundary layer. Shows why cold air traps vehicular and biomass smoke at head height during early morning hours and how solar radiation lifts smog by midday.
- **Dynamic Adaptive Scaling:** Graph scales intelligently (0–200 on moderate days, up to 500 on severe days) ensuring data is never squashed or blank.
- **Interactive Hourly Timeline Cards:** Click any hour to preview expected AQI, PM2.5 concentration, temperature, and localized activity verdicts (*Safe for Stroll, Solar Window, Seal Windows*).

### 2. Personal Respiratory Health & Inhaled Soot Calculator
- **Minute Ventilation Modeling:** Calculates total air volume inhaled based on exertion:
  - *Running:* 50 L/min
  - *Scooter Commute:* 25 L/min
  - *Walking:* 20 L/min
  - *AC Metro Transit:* 12 L/min
- **Mitigation Simulator:** Tests No Mask vs. Cloth Mask (20% filter) vs. Certified N95 (95% filter).
- **Cigarette Equivalence Proxy:** Translates inhaled micrograms of PM2.5 into passive cigarette smoke equivalents using the Berkeley Earth environmental model.

### 3. Dynamic Indoor Defense & Ventilation Decision Matrix
- **Ingress vs. Stagnation Engine:** Determines whether opening windows is safe right now based on real-time outdoor PM2.5.
- **Interactive Room Simulator:** Toggle cooking burners, window positions, incense/agarbatti, and DIY purifiers to watch the estimated indoor PM2.5 gauge adjust dynamically.
- **Evidence-Based Zero-Cost Hacks:** Kitchen exhaust pre-run protocols, damp microfiber mopping (preventing dust resuspension), door sill foam weather-sealing, and DIY box-fan filtration.

### 4. Multimodal Commute: Exposure vs. Emissions Comparator
- Compares 5 modes: **Metro Rail (AC)**, **AC Car (Recirculation)**, **CNG Auto-Rickshaw**, **Motorcycle / Two-Wheeler**, and **Walking / Cycling**.
- Evaluates 4 parameters: **Inhaled Dose Risk (1–10 scale)**, **Travel Time (min)**, **Direct Cost (₹)**, and **Avoided CO2e (kg)** over an adjustable trip distance slider (3–30 km).

### 5. Signature "Why This Recommendation?" XAI Trust Drawer
- Every recommendation card expands to display:
  1. **Environmental Trigger:** Exact PM2.5 or inversion reading.
  2. **Matched Preference:** User schedule, commute, or household context.
  3. **Causal Scientific Mechanism:** Medical and physical explanation.
  4. **Zero-Cost / Low-Cost Alternative:** Practical, non-commercial fallback.
  5. **Stated Uncertainties & Assumptions:** Transparent limits of the model.

### 6. WhatsApp Community Bulletin Generator
- One-click shareable advisory for **Housing Societies (RWAs)** and **School/Parent Groups** complying with CPCB/GRAP protocols (banning biomass waste burning, scheduling morning student assemblies indoors, dust misting).
- Includes one-click WhatsApp text copy and formatted `.txt` file export.

### 7. Voice AI Audio Briefing (F-16 Accessibility)
- 20-second concise daily audio briefing powered by the browser's native Web Speech API with support for English and Hindi.

### 8. Global Live Geocoding Search & GPS
- Choose between **11 pre-configured Indian metropolitan hubs** (Delhi NCR, Noida, Gurugram, Mumbai, Bengaluru, Lucknow, Patna, Kolkata, Pune, Jaipur, Ahmedabad).
- Or use the **Live Search Bar** to search any city worldwide with instant geocoding.
- Or tap the **GPS location button** for exact coordinate detection.

---

## 🎨 Design System: Warm Earthy Aesthetic

In response to research showing that bright red/blue emergency alert dashboards increase doomscrolling and anxiety, BreatheWise AI utilizes a calm, high-trust, editorial design system:
- **Canvas:** Crisp white and warm alabaster (`#faf8f5`).
- **Accent Palette:** Warm Terracotta (`#ea580c`), Golden Honey (`#facc15`), Warm Amber (`#d97706`), and Earthy Espresso typography (`#26160e`).
- **Typography:** Classical serif display headers (*Fraunces*) paired with ultra-readable geometric sans-serif (*Plus Jakarta Sans*).
- **Zero Blue Colors:** Strictly eliminates aggressive blue/cyan neon tones in favor of natural, human-centric warm tones.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Core:** React 18 (TypeScript), Vite 6
- **Styling & Design:** Tailwind CSS 3.4, Custom warm elevation shadows, Glassmorphism utilities
- **Iconography:** Lucide React
- **Data Engine:** 
  - [Open-Meteo Air Quality API](https://open-meteo.com/) (European Copernicus CAMS & ECMWF assimilation)
  - [Open-Meteo Weather Forecast API](https://open-meteo.com/) (Surface wind speed, wind vector, relative humidity)
  - [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) (Global city search)
- **Deployment:** Vercel SPA (`vercel.json` configured)

---

## 📦 How to Deploy on Vercel

BreatheWise AI is configured for zero-configuration, instant deployment on **Vercel**.

### Method 1: Deploy via GitHub (Recommended)
1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of BreatheWise AI"
   git branch -M main
   git remote add origin https://github.com/<your-username>/breathewise-ai.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Select your `breathewise-ai` repository and click **Import**.
5. Vercel will automatically detect:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
6. Click **Deploy**. Your live production URL will be ready in under 60 seconds!

### Method 2: Deploy via Vercel CLI
If you have Node.js and the Vercel CLI installed:
```bash
# 1. Install Vercel CLI globally (if not already installed)
npm install -g vercel

# 2. Run deploy command from the project root
vercel

# Follow the terminal prompts (defaults are pre-configured in vercel.json)
```

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/breathewise-ai.git
cd breathewise-ai

# 2. Install dependencies (pnpm or npm)
pnpm install
# or
npm install

# 3. Start development server
pnpm run dev
# or
npm run dev

# 4. Open in browser
# Navigate to http://localhost:3000/
```

### Production Build & Typecheck
```bash
pnpm run build
# Compiles TypeScript and builds optimized distribution bundles to dist/
```

---

## 🛡️ Responsible AI & Safety Disclaimers

1. **Non-Medical Boundary:** BreatheWise AI provides environmental and routine decision support only. It does not provide clinical diagnoses, prescribe treatments, or replace pulmonologists.
2. **Exposure vs. Emissions Separation:** The application explicitly separates individual inhaled dose reduction (e.g. wearing an N95 or shifting a workout) from collective tailpipe emissions reduction (e.g. taking the metro).
3. **Data Provenance:** Every measurement displayed is explicitly labeled with its station source, coordinates, timestamp, and standard conversion formula.

---

## 👥 Credits & Hackathon Information
- **Event:** PromptWars 5 — Challenge 6 (Urban Air Quality Assistant)
- **Project Name:** BreatheWise AI
- **License:** MIT License
