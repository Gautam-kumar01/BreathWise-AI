import { describe, it, expect } from 'vitest';
import { INDOOR_HACKS } from '../data/indoorChecklist';
import { RoomType, IndoorSensorLog } from '../types/indoor';

describe('indoorDefense - Room-Based Hacks & Source Control', () => {
  const REQUIRED_ROOMS: RoomType[] = ['bedroom', 'living', 'kitchen', 'study', 'classroom'];

  it('covers all five required architectural room profiles', () => {
    const presentRooms = new Set(INDOOR_HACKS.map(h => h.room));
    REQUIRED_ROOMS.forEach(room => {
      expect(presentRooms.has(room)).toBe(true);
    });
  });

  it('prioritizes zero-cost and low-cost practical interventions', () => {
    const freeHacks = INDOOR_HACKS.filter(h => h.costTier === 'Free');
    expect(freeHacks.length).toBeGreaterThanOrEqual(5);
  });

  it('flags combustion and source control rules as Essential impact', () => {
    const exhaustRule = INDOOR_HACKS.find(h => h.id === 'h1');
    expect(exhaustRule).toBeDefined();
    expect(exhaustRule?.room).toBe('kitchen');
    expect(exhaustRule?.impactScore).toBe('Essential');
    expect(exhaustRule?.evidenceWhy).toContain('Combustion of LPG produces nitrogen dioxide');

    const incenseRule = INDOOR_HACKS.find(h => h.id === 'h6');
    expect(incenseRule).toBeDefined();
    expect(incenseRule?.room).toBe('living');
    expect(incenseRule?.impactScore).toBe('Essential');
    expect(incenseRule?.evidenceWhy).toContain('incense');
  });

  it('verifies all hacks provide explicit evidenceWhy and safety cautions', () => {
    INDOOR_HACKS.forEach(hack => {
      expect(hack.title).toBeTruthy();
      expect(hack.action).toBeTruthy();
      expect(hack.evidenceWhy).toBeTruthy();
      expect(hack.safetyCaution).toBeTruthy();
      expect(['High', 'Medium', 'Essential']).toContain(hack.impactScore);
      expect(['Free', 'Low-cost (₹50-₹300)', 'Equipment (Purifier)']).toContain(hack.costTier);
    });
  });
});

describe('indoorDefense - Sensor Log Integrity', () => {
  it('guarantees indoor sensor logs require explicit user-reported flag', () => {
    const sampleLog: IndoorSensorLog = {
      id: 'log-1',
      room: 'bedroom',
      pm25: 42,
      co2Ppm: 850,
      deviceModel: 'IKEA VINDSTYRKA',
      recordedAt: new Date().toISOString(),
      isUserEntered: true,
      interpretation: 'Normal healthy bedroom indoor baseline'
    };

    expect(sampleLog.isUserEntered).toBe(true);
    expect(sampleLog.pm25).toBe(42);
    expect(sampleLog.co2Ppm).toBe(850);
  });
});
