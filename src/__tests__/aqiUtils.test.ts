import { describe, it, expect } from 'vitest';
import { getCPCBFromPM25, getUSEPAFromPM25, getAQIMeta } from '../utils/aqiUtils';

describe('aqiUtils - Indian CPCB NAQI Calculation', () => {
  it('correctly maps PM2.5 to Good category (0-30 µg/m³)', () => {
    const resZero = getCPCBFromPM25(0);
    expect(resZero.category).toBe('Good');
    expect(resZero.aqi).toBe(0);

    const resMid = getCPCBFromPM25(15);
    expect(resMid.category).toBe('Good');
    expect(resMid.aqi).toBe(25);

    const resBoundary = getCPCBFromPM25(30);
    expect(resBoundary.category).toBe('Good');
    expect(resBoundary.aqi).toBe(50);
  });

  it('correctly maps PM2.5 to Satisfactory category (31-60 µg/m³)', () => {
    const res = getCPCBFromPM25(45);
    expect(res.category).toBe('Satisfactory');
    expect(res.aqi).toBeGreaterThanOrEqual(51);
    expect(res.aqi).toBeLessThanOrEqual(100);

    const resBoundary = getCPCBFromPM25(60);
    expect(resBoundary.category).toBe('Satisfactory');
    expect(resBoundary.aqi).toBe(100);
  });

  it('correctly maps PM2.5 to Moderate category (61-90 µg/m³)', () => {
    const res = getCPCBFromPM25(75);
    expect(res.category).toBe('Moderate');
    expect(res.aqi).toBeGreaterThanOrEqual(101);
    expect(res.aqi).toBeLessThanOrEqual(200);

    const resBoundary = getCPCBFromPM25(90);
    expect(resBoundary.category).toBe('Moderate');
    expect(resBoundary.aqi).toBe(200);
  });

  it('correctly maps PM2.5 to Poor category (91-120 µg/m³)', () => {
    const res = getCPCBFromPM25(105);
    expect(res.category).toBe('Poor');
    expect(res.aqi).toBeGreaterThanOrEqual(201);
    expect(res.aqi).toBeLessThanOrEqual(300);

    const resBoundary = getCPCBFromPM25(120);
    expect(resBoundary.category).toBe('Poor');
    expect(resBoundary.aqi).toBe(300);
  });

  it('correctly maps PM2.5 to Very Poor category (121-250 µg/m³)', () => {
    const res = getCPCBFromPM25(180);
    expect(res.category).toBe('Very Poor');
    expect(res.aqi).toBeGreaterThanOrEqual(301);
    expect(res.aqi).toBeLessThanOrEqual(400);

    const resBoundary = getCPCBFromPM25(250);
    expect(resBoundary.category).toBe('Very Poor');
    expect(resBoundary.aqi).toBe(400);
  });

  it('correctly maps PM2.5 to Severe category (>250 µg/m³) capped at 500', () => {
    const res = getCPCBFromPM25(320);
    expect(res.category).toBe('Severe');
    expect(res.aqi).toBeGreaterThanOrEqual(401);
    expect(res.aqi).toBeLessThanOrEqual(500);

    const resExtreme = getCPCBFromPM25(900);
    expect(resExtreme.category).toBe('Severe');
    expect(resExtreme.aqi).toBe(500);
  });
});

describe('aqiUtils - US EPA AQI Calculation', () => {
  it('correctly maps PM2.5 to Good category (0-12.0 µg/m³)', () => {
    const res = getUSEPAFromPM25(9.0);
    expect(res.category).toBe('Good');
    expect(res.aqi).toBeLessThanOrEqual(50);
  });

  it('correctly maps PM2.5 to Satisfactory category (12.1-35.4 µg/m³)', () => {
    const res = getUSEPAFromPM25(25.0);
    expect(res.category).toBe('Satisfactory');
    expect(res.aqi).toBeGreaterThanOrEqual(51);
    expect(res.aqi).toBeLessThanOrEqual(100);
  });

  it('correctly maps PM2.5 to Moderate category (35.5-55.4 µg/m³)', () => {
    const res = getUSEPAFromPM25(45.0);
    expect(res.category).toBe('Moderate');
    expect(res.aqi).toBeGreaterThanOrEqual(101);
    expect(res.aqi).toBeLessThanOrEqual(150);
  });

  it('correctly maps PM2.5 to Poor category (55.5-150.4 µg/m³)', () => {
    const res = getUSEPAFromPM25(100.0);
    expect(res.category).toBe('Poor');
    expect(res.aqi).toBeGreaterThanOrEqual(151);
    expect(res.aqi).toBeLessThanOrEqual(200);
  });

  it('correctly maps PM2.5 to Very Poor category (150.5-250.4 µg/m³)', () => {
    const res = getUSEPAFromPM25(200.0);
    expect(res.category).toBe('Very Poor');
    expect(res.aqi).toBeGreaterThanOrEqual(201);
    expect(res.aqi).toBeLessThanOrEqual(300);
  });

  it('correctly maps PM2.5 to Severe category (>250.5 µg/m³)', () => {
    const res = getUSEPAFromPM25(350.0);
    expect(res.category).toBe('Severe');
    expect(res.aqi).toBeGreaterThanOrEqual(301);
    expect(res.aqi).toBeLessThanOrEqual(500);
  });
});

describe('aqiUtils - getAQIMeta Metadata & Bilingual Support', () => {
  it('returns valid metadata for CPCB Good category', () => {
    const meta = getAQIMeta(35, 'CPCB_INDIA');
    expect(meta.category).toBe('Good');
    expect(meta.color).toBe('#15803d');
    expect(meta.badgeBg).toBe('bg-emerald-50');
    expect(meta.healthImplication).toContain('Clean ambient air');
    expect(meta.hiCategory).toContain('अच्छा');
    expect(meta.hiHealthImplication).toContain('हवा पूरी तरह साफ है');
  });

  it('returns valid metadata for CPCB Severe category', () => {
    const meta = getAQIMeta(450, 'CPCB_INDIA');
    expect(meta.category).toBe('Severe');
    expect(meta.color).toBe('#7f1d1d');
    expect(meta.badgeBg).toBe('bg-stone-900');
    expect(meta.cautionaryStatement).toContain('Winter smog inversion emergency');
    expect(meta.hiCategory).toContain('गंभीर');
  });

  it('returns valid metadata for US EPA scale', () => {
    const metaGood = getAQIMeta(40, 'US_EPA');
    expect(metaGood.category).toBe('Good');

    const metaMod = getAQIMeta(120, 'US_EPA');
    expect(metaMod.category).toBe('Moderate');

    const metaSevere = getAQIMeta(350, 'US_EPA');
    expect(metaSevere.category).toBe('Severe');
  });
});
