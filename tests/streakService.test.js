import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStreakData,
  recordDailyCompletion,
  recordFocusSession,
  calculateActivityLevel,
  generateGitHubHeatmapGrid
} from '../src/services/streakService';
import { STORAGE_KEYS } from '../src/services/storagePersistenceService';

describe('🔥 Streak, Heatmap & Focus Momentum Service', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('calculates activity levels (0-4) accurately based on focus minutes & ritual status', () => {
    expect(calculateActivityLevel(null)).toBe(0);
    expect(calculateActivityLevel({ focusMinutes: 0, ritualCompleted: false })).toBe(0);
    expect(calculateActivityLevel({ focusMinutes: 0, ritualCompleted: true })).toBe(1);
    expect(calculateActivityLevel({ focusMinutes: 25, ritualCompleted: false })).toBe(2);
    expect(calculateActivityLevel({ focusMinutes: 50, ritualCompleted: true })).toBe(3);
    expect(calculateActivityLevel({ focusMinutes: 75, ritualCompleted: true })).toBe(4);
    expect(calculateActivityLevel({ focusMinutes: 120, ritualCompleted: true })).toBe(4);
  });

  it('initializes default streak data when storage is empty', () => {
    const data = getStreakData();
    expect(data.currentStreak).toBe(1);
    expect(data.longestStreak).toBe(1);
    expect(data.isCompletedToday).toBe(false);
  });

  it('increments streak on consecutive day completion and saves backup snapshot', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Seed initial state with yesterday's completion
    localStorage.setItem(
      STORAGE_KEYS.STREAK,
      JSON.stringify({
        currentStreak: 3,
        longestStreak: 5,
        totalCompletions: 3,
        lastCompletedDate: yesterday
      })
    );

    const result = recordDailyCompletion();
    expect(result.currentStreak).toBe(4);
    expect(result.longestStreak).toBe(5);
    expect(result.isCompletedToday).toBe(true);
    expect(result.wasFirstCompletionToday).toBe(true);

    // Verify snapshot was created
    const snapshotRaw = localStorage.getItem(STORAGE_KEYS.BACKUP_SNAPSHOT);
    expect(snapshotRaw).not.toBeNull();
    const snapshot = JSON.parse(snapshotRaw);
    expect(snapshot.data.streak.currentStreak).toBe(4);
  });

  it('resets streak to 1 when a day is missed', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    localStorage.setItem(
      STORAGE_KEYS.STREAK,
      JSON.stringify({
        currentStreak: 10,
        longestStreak: 10,
        totalCompletions: 10,
        lastCompletedDate: threeDaysAgo
      })
    );

    const result = recordDailyCompletion();
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(10);
    expect(result.totalCompletions).toBe(11);
  });

  it('records focus sessions and increments today minutes', () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updated = recordFocusSession(25);

    expect(updated.dateStr).toBe(todayStr);
    expect(updated.focusMinutes).toBe(25);
    expect(updated.focusSessions).toBe(1);

    const secondSession = recordFocusSession(25);
    expect(secondSession.focusMinutes).toBe(50);
    expect(secondSession.focusSessions).toBe(2);
  });

  it('generates a full 52-week (364-day) heatmap grid matrix', () => {
    const grid = generateGitHubHeatmapGrid('gold');
    expect(grid.weeks.length).toBeGreaterThanOrEqual(52);
    expect(grid.totalDays).toBeGreaterThan(300);
    expect(grid.logs).toBeDefined();
  });
});
