import { AQICategory, AQIScale } from '../types/air';

export interface AQIBreakdown {
  category: AQICategory;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  healthImplication: string;
  cautionaryStatement: string;
  hiCategory: string;
  hiHealthImplication: string;
}

/**
 * Calculates Indian CPCB National AQI (NAQI) Category from PM2.5 (24-hr standard proxy)
 * Reference: Central Pollution Control Board (CPCB) India Guidelines
 * 0-30: Good (AQI 0-50)
 * 31-60: Satisfactory (AQI 51-100)
 * 61-90: Moderate (AQI 101-200)
 * 91-120: Poor (AQI 201-300)
 * 121-250: Very Poor (AQI 301-400)
 * 250+: Severe (AQI 401-500+)
 */
export function getCPCBFromPM25(pm25: number): { aqi: number; category: AQICategory } {
  if (pm25 <= 30) {
    const aqi = Math.round((pm25 / 30) * 50);
    return { aqi, category: 'Good' };
  } else if (pm25 <= 60) {
    const aqi = Math.round(51 + ((pm25 - 31) / 29) * 49);
    return { aqi, category: 'Satisfactory' };
  } else if (pm25 <= 90) {
    const aqi = Math.round(101 + ((pm25 - 61) / 29) * 99);
    return { aqi, category: 'Moderate' };
  } else if (pm25 <= 120) {
    const aqi = Math.round(201 + ((pm25 - 91) / 29) * 99);
    return { aqi, category: 'Poor' };
  } else if (pm25 <= 250) {
    const aqi = Math.round(301 + ((pm25 - 121) / 129) * 99);
    return { aqi, category: 'Very Poor' };
  } else {
    // Severe
    const aqi = Math.min(500, Math.round(401 + ((pm25 - 250) / 150) * 99));
    return { aqi, category: 'Severe' };
  }
}

/**
 * Calculates US EPA AQI from PM2.5 (µg/m³)
 */
export function getUSEPAFromPM25(pm25: number): { aqi: number; category: AQICategory } {
  if (pm25 <= 12.0) {
    const aqi = Math.round((pm25 / 12.0) * 50);
    return { aqi, category: 'Good' };
  } else if (pm25 <= 35.4) {
    const aqi = Math.round(51 + ((pm25 - 12.1) / 23.3) * 49);
    return { aqi, category: 'Satisfactory' };
  } else if (pm25 <= 55.4) {
    const aqi = Math.round(101 + ((pm25 - 35.5) / 19.9) * 49);
    return { aqi, category: 'Moderate' };
  } else if (pm25 <= 150.4) {
    const aqi = Math.round(151 + ((pm25 - 55.5) / 94.9) * 49);
    return { aqi, category: 'Poor' };
  } else if (pm25 <= 250.4) {
    const aqi = Math.round(201 + ((pm25 - 150.5) / 99.9) * 99);
    return { aqi, category: 'Very Poor' };
  } else {
    const aqi = Math.min(500, Math.round(301 + ((pm25 - 250.5) / 249.9) * 199));
    return { aqi, category: 'Severe' };
  }
}

/**
 * Resolves comprehensive metadata, color codes, English and Hindi health advisories
 * for a given numerical AQI value based on the chosen standard (CPCB India or US EPA).
 * 
 * @param aqi - Numerical Air Quality Index value (0 - 500+)
 * @param scale - AQI calculation scale standard ('CPCB_INDIA' or 'US_EPA')
 * @returns AQIBreakdown containing visual tokens, bilingual labels, and health cautions
 */
export function getAQIMeta(aqi: number, scale: AQIScale = 'CPCB_INDIA'): AQIBreakdown {
  if (scale === 'US_EPA') {
    if (aqi <= 50) {
      return {
        category: 'Good',
        color: '#15803d',
        badgeBg: 'bg-emerald-50',
        badgeBorder: 'border-emerald-200',
        badgeText: 'text-emerald-800',
        healthImplication: 'Air quality is satisfactory and poses little or no risk.',
        cautionaryStatement: 'Ideal for outdoor recreation and open windows.',
        hiCategory: 'उत्कृष्ट (Good)',
        hiHealthImplication: 'हवा पूरी तरह स्वच्छ है, कोई स्वास्थ्य जोखिम नहीं।'
      };
    } else if (aqi <= 100) {
      return {
        category: 'Satisfactory',
        color: '#65a30d',
        badgeBg: 'bg-lime-50',
        badgeBorder: 'border-lime-200',
        badgeText: 'text-lime-800',
        healthImplication: 'Acceptable air quality; minor concern for sensitive individuals.',
        cautionaryStatement: 'Unusually sensitive people should consider reducing prolonged outdoor exertion.',
        hiCategory: 'स्वीकार्य (Moderate)',
        hiHealthImplication: 'हल्का प्रदूषण, संवेदनशील लोगों को ध्यान देना चाहिए।'
      };
    } else if (aqi <= 150) {
      return {
        category: 'Moderate',
        color: '#d97706',
        badgeBg: 'bg-amber-50',
        badgeBorder: 'border-amber-200',
        badgeText: 'text-amber-800',
        healthImplication: 'Members of sensitive groups may experience health effects.',
        cautionaryStatement: 'People with respiratory or heart conditions should limit outdoor exertion.',
        hiCategory: 'संवेदनशील (Unhealthy for Sensitive)',
        hiHealthImplication: 'बुजुर्गों और बच्चों के लिए हानिकारक।'
      };
    } else if (aqi <= 200) {
      return {
        category: 'Poor',
        color: '#ea580c',
        badgeBg: 'bg-orange-50',
        badgeBorder: 'border-orange-200',
        badgeText: 'text-orange-800',
        healthImplication: 'Everyone may begin to experience health effects; sensitive groups more severely.',
        cautionaryStatement: 'Avoid prolonged outdoor exertion. Move exercise indoors.',
        hiCategory: 'हानिकारक (Unhealthy)',
        hiHealthImplication: 'आम नागरिकों पर भी स्वास्थ्य प्रभाव शुरू।'
      };
    } else if (aqi <= 300) {
      return {
        category: 'Very Poor',
        color: '#dc2626',
        badgeBg: 'bg-red-50',
        badgeBorder: 'border-red-200',
        badgeText: 'text-red-800',
        healthImplication: 'Health alert: The risk of health effects is increased for everyone.',
        cautionaryStatement: 'Avoid all outdoor physical exertion. Keep windows sealed.',
        hiCategory: 'अत्यंत हानिकारक (Very Unhealthy)',
        hiHealthImplication: 'स्वास्थ्य आपातकाल, सभी के लिए बाहर निकलना जोखिम भरा।'
      };
    } else {
      return {
        category: 'Severe',
        color: '#7f1d1d',
        badgeBg: 'bg-stone-900',
        badgeBorder: 'border-stone-800',
        badgeText: 'text-amber-200',
        healthImplication: 'Health warning of emergency conditions: everyone is more likely to be affected.',
        cautionaryStatement: 'Remain indoors with filtered air; avoid all non-essential exposure.',
        hiCategory: 'गंभीर आपातकाल (Hazardous)',
        hiHealthImplication: 'गंभीर संकट, बाहरी हवा में विषाक्तता का स्तर चरम पर।'
      };
    }
  }

  // CPCB Standard (India)
  if (aqi <= 50) {
    return {
      category: 'Good',
      color: '#15803d',
      badgeBg: 'bg-emerald-50',
      badgeBorder: 'border-emerald-200',
      badgeText: 'text-emerald-800',
      healthImplication: 'Minimal impact. Clean ambient air suitable for all outdoor activity.',
      cautionaryStatement: 'Enjoy outdoor ventilation and activities freely.',
      hiCategory: 'अच्छा (Good)',
      hiHealthImplication: 'हवा पूरी तरह साफ है। बाहर की गतिविधियों और खिड़कियाँ खोलने के लिए एकदम सही।'
    };
  } else if (aqi <= 100) {
    return {
      category: 'Satisfactory',
      color: '#65a30d',
      badgeBg: 'bg-lime-50',
      badgeBorder: 'border-lime-200',
      badgeText: 'text-lime-800',
      healthImplication: 'Minor breathing discomfort to sensitive people and young children.',
      cautionaryStatement: 'Normal outdoor routines are generally fine for healthy adults.',
      hiCategory: 'संतोषजनक (Satisfactory)',
      hiHealthImplication: 'हल्की संवेदनशीलता संभव है, सामान्य तौर पर सुरक्षित।'
    };
  } else if (aqi <= 200) {
    return {
      category: 'Moderate',
      color: '#d97706',
      badgeBg: 'bg-amber-50',
      badgeBorder: 'border-amber-200',
      badgeText: 'text-amber-800',
      healthImplication: 'Breathing discomfort to people with lung disease, asthma, and heart conditions.',
      cautionaryStatement: 'Shift intense morning workouts to midday when solar radiation lifts ground smog.',
      hiCategory: 'मध्यम (Moderate)',
      hiHealthImplication: 'फेफड़ों या दिल के मरीजों के लिए सांस लेने में तकलीफ हो सकती है।'
    };
  } else if (aqi <= 300) {
    return {
      category: 'Poor',
      color: '#ea580c',
      badgeBg: 'bg-orange-50',
      badgeBorder: 'border-orange-200',
      badgeText: 'text-orange-800',
      healthImplication: 'Breathing discomfort to most people on prolonged exposure; throat irritation.',
      cautionaryStatement: 'Avoid prolonged outdoor exertion. Keep home windows shut during morning & night.',
      hiCategory: 'खराब (Poor)',
      hiHealthImplication: 'अधिकतर लोगों को सांस लेने में परेशानी हो सकती है।'
    };
  } else if (aqi <= 400) {
    return {
      category: 'Very Poor',
      color: '#dc2626',
      badgeBg: 'bg-red-50',
      badgeBorder: 'border-red-200',
      badgeText: 'text-red-800',
      healthImplication: 'Respiratory illness on prolonged exposure; severe aggravation of asthma and bronchitis.',
      cautionaryStatement: 'Move physical activity indoors. Wear a fitted N95 mask for essential commutes.',
      hiCategory: 'बहुत खराब (Very Poor)',
      hiHealthImplication: 'लंबे समय तक बाहर रहने से श्वसन संबंधी बीमारियाँ हो सकती हैं।'
    };
  } else {
    return {
      category: 'Severe',
      color: '#7f1d1d',
      badgeBg: 'bg-stone-900',
      badgeBorder: 'border-stone-800',
      badgeText: 'text-amber-200',
      healthImplication: 'Affects healthy people and seriously impacts those with existing conditions even during light activity.',
      cautionaryStatement: 'Winter smog inversion emergency. Avoid all outdoor cardio. Keep rooms sealed and use source-control hacks.',
      hiCategory: 'गंभीर / आपातकाल (Severe)',
      hiHealthImplication: 'स्वस्थ लोगों पर भी गंभीर असर। बाहर व्यायाम बिल्कुल न करें।'
    };
  }
}
