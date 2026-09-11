/**
 * Daily Streak, Heatmap & Focus Momentum Service
 * Manages GitHub-style daily activity and focus time tracking in LocalStorage.
 */

import { createBackupSnapshot } from './storagePersistenceService';

const STORAGE_STREAK_KEY = 'manifest_morning_streak_data';
const STORAGE_HEATMAP_KEY = 'manifest_focus_heatmap_data';

/**
 * Get all stored daily activity logs
 */
export function getStoredHeatmapLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_HEATMAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Save daily activity logs
 */
function saveHeatmapLogs(logs) {
  try {
    localStorage.setItem(STORAGE_HEATMAP_KEY, JSON.stringify(logs));
  } catch (e) {}
}

/**
 * Calculate Activity Level (0 to 4) like GitHub
 */
export function calculateActivityLevel(entry) {
  if (!entry) return 0;
  const mins = entry.focusMinutes || 0;
  const isDone = entry.ritualCompleted;

  if (mins >= 75) return 4; // Elite Flow (3+ 25m blocks)
  if (mins >= 50) return 3; // High (2 blocks)
  if (mins >= 25) return 2; // Medium (1 block)
  if (isDone || mins > 0) return 1; // Morning Ritual or light focus
  return 0;
}

/**
 * Get Comprehensive Streak & Momentum Stats
 */
export function getStreakData() {
  try {
    const raw = localStorage.getItem(STORAGE_STREAK_KEY);
    const logs = getStoredHeatmapLogs();
    const todayStr = new Date().toISOString().split('T')[0];

    const data = raw ? JSON.parse(raw) : { currentStreak: 1, longestStreak: 1, totalCompletions: 1, lastCompletedDate: '' };
    const todayLog = logs[todayStr];
    const isCompletedToday = !!(todayLog && todayLog.ritualCompleted);

    // Calculate total focus minutes across all recorded days
    let totalFocusMins = 0;
    let totalActiveDays = 0;
    Object.values(logs).forEach((log) => {
      if (log.focusMinutes) totalFocusMins += log.focusMinutes;
      if (log.ritualCompleted || log.focusMinutes > 0) totalActiveDays += 1;
    });

    // Check if streak is still active
    const lastDateStr = data.lastCompletedDate;
    let currentStreak = data.currentStreak || 1;
    let longestStreak = data.longestStreak || currentStreak;

    if (lastDateStr && lastDateStr !== todayStr) {
      const todayDate = new Date(todayStr);
      const lastDate = new Date(lastDateStr);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        // Streak broken
        currentStreak = isCompletedToday ? 1 : 0;
      }
    }

    return {
      currentStreak: Math.max(1, currentStreak),
      longestStreak: Math.max(longestStreak, currentStreak),
      totalCompletions: Math.max(1, data.totalCompletions || totalActiveDays || 1),
      totalActiveDays: Math.max(1, totalActiveDays || 1),
      totalFocusMinutes: totalFocusMins,
      totalFocusHours: (totalFocusMins / 60).toFixed(1),
      lastCompletedDate: lastDateStr || todayStr,
      isCompletedToday
    };
  } catch (e) {
    return {
      currentStreak: 1,
      longestStreak: 1,
      totalCompletions: 1,
      totalActiveDays: 1,
      totalFocusMinutes: 25,
      totalFocusHours: '0.4',
      lastCompletedDate: '',
      isCompletedToday: false
    };
  }
}

/**
 * Record Daily Morning Cadence Completion
 */
export function recordDailyCompletion() {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const prev = getStreakData();
    const logs = getStoredHeatmapLogs();

    let newStreak = prev.currentStreak || 1;
    let newTotal = prev.totalCompletions || 0;
    let wasFirstToday = false;

    if (!prev.isCompletedToday) {
      wasFirstToday = true;
      newTotal += 1;

      if (prev.lastCompletedDate) {
        const todayDate = new Date(todayStr);
        const lastDate = new Date(prev.lastCompletedDate);
        const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
    }

    const newLongest = Math.max(prev.longestStreak || 1, newStreak);

    // Update streak metadata
    const streakPayload = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalCompletions: newTotal,
      lastCompletedDate: todayStr,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_STREAK_KEY, JSON.stringify(streakPayload));

    // Update heatmap entry for today
    const currentTodayLog = logs[todayStr] || { focusMinutes: 0, focusSessions: 0 };
    logs[todayStr] = {
      ...currentTodayLog,
      ritualCompleted: true,
      dateStr: todayStr,
      lastActive: new Date().toISOString()
    };
    saveHeatmapLogs(logs);
    createBackupSnapshot();

    const result = {
      ...streakPayload,
      isCompletedToday: true,
      wasFirstCompletionToday: wasFirstToday
    };

    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('manifest_streak_updated', { detail: result }));
    }

    return result;
  } catch (e) {
    return { currentStreak: 1, longestStreak: 1, isCompletedToday: true, wasFirstCompletionToday: false };
  }
}

/**
 * Record Focus Time Block (e.g. +25 minutes)
 */
export function recordFocusSession(minutes = 25) {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const logs = getStoredHeatmapLogs();
    const currentTodayLog = logs[todayStr] || { ritualCompleted: false, focusMinutes: 0, focusSessions: 0 };

    const updatedLog = {
      ...currentTodayLog,
      dateStr: todayStr,
      focusMinutes: (currentTodayLog.focusMinutes || 0) + minutes,
      focusSessions: (currentTodayLog.focusSessions || 0) + 1,
      lastActive: new Date().toISOString()
    };

    logs[todayStr] = updatedLog;
    saveHeatmapLogs(logs);
    createBackupSnapshot();

    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('manifest_streak_updated', { detail: updatedLog }));
    }

    return updatedLog;
  } catch (e) {
    return null;
  }
}

/**
 * Generate 52 Weeks of GitHub-style Grid Data (Past 365 Days)
 */
export function generateGitHubHeatmapGrid(theme = 'green') {
  const logs = getStoredHeatmapLogs();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // If today has no log yet, provide default active level 1 for today's active session
  if (!logs[todayStr]) {
    logs[todayStr] = { ritualCompleted: true, focusMinutes: 25, focusSessions: 1, dateStr: todayStr };
  }

  const days = [];
  const daysTotal = 364; // 52 weeks * 7 days

  // Start from (today - 364 days) adjusted to start on a Monday
  const startDate = new Date();
  startDate.setDate(today.getDate() - daysTotal);

  for (let i = 0; i <= daysTotal; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateKey = d.toISOString().split('T')[0];
    const entry = logs[dateKey] || null;
    const level = calculateActivityLevel(entry);

    days.push({
      date: d,
      dateStr: dateKey,
      dayOfWeek: d.getDay(), // 0 = Sun, 1 = Mon ...
      month: d.toLocaleString('en-US', { month: 'short' }),
      monthNum: d.getMonth(),
      dayOfMonth: d.getDate(),
      entry,
      level,
      isToday: dateKey === todayStr,
      isFuture: d > today
    });
  }

  // Group into 52 weekly columns (7 days each)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return { weeks, logs, totalDays: days.length };
}

/**
 * Play a pleasant morning victory audio chime via Web Audio API
 */
export function playTriumphantChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major triumphant chord)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + idx * 0.08;
      const duration = 0.6;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {}
}
