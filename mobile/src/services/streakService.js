import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_STREAK_KEY = '@manifest_morning_streak_data';
const STORAGE_HEATMAP_KEY = '@manifest_focus_heatmap_data';

// In-memory cache for synchronous render paths
let cachedStreakData = {
  currentStreak: 1,
  longestStreak: 1,
  totalCompletions: 1,
  totalActiveDays: 1,
  totalFocusMinutes: 25,
  totalFocusHours: '0.4',
  lastCompletedDate: new Date().toISOString().split('T')[0],
  isCompletedToday: false
};

let cachedHeatmapLogs = {};

/**
 * Initialize cache from AsyncStorage
 */
export async function initStreakService() {
  try {
    const rawStreak = await AsyncStorage.getItem(STORAGE_STREAK_KEY);
    if (rawStreak) {
      cachedStreakData = { ...cachedStreakData, ...JSON.parse(rawStreak) };
    }
    const rawHeatmap = await AsyncStorage.getItem(STORAGE_HEATMAP_KEY);
    if (rawHeatmap) {
      cachedHeatmapLogs = JSON.parse(rawHeatmap);
    }
  } catch (e) {}
}

/**
 * Get all stored daily activity logs
 */
export async function getStoredHeatmapLogs() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_HEATMAP_KEY);
    if (raw) {
      cachedHeatmapLogs = JSON.parse(raw);
    }
    return cachedHeatmapLogs;
  } catch (e) {
    return cachedHeatmapLogs;
  }
}

/**
 * Synchronous getter for cached logs
 */
export function getCachedHeatmapLogs() {
  return cachedHeatmapLogs;
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
export async function getStreakData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_STREAK_KEY);
    const logs = await getStoredHeatmapLogs();
    const todayStr = new Date().toISOString().split('T')[0];

    const data = raw ? JSON.parse(raw) : cachedStreakData;
    const todayLog = logs[todayStr];
    const isCompletedToday = !!(todayLog && todayLog.ritualCompleted);

    let totalFocusMins = 0;
    let totalActiveDays = 0;
    Object.values(logs).forEach((log) => {
      if (log.focusMinutes) totalFocusMins += log.focusMinutes;
      if (log.ritualCompleted || log.focusMinutes > 0) totalActiveDays += 1;
    });

    const lastDateStr = data.lastCompletedDate;
    let currentStreak = data.currentStreak || 1;
    let longestStreak = data.longestStreak || currentStreak;

    if (lastDateStr && lastDateStr !== todayStr) {
      const todayDate = new Date(todayStr);
      const lastDate = new Date(lastDateStr);
      const diffDays = Math.round(Math.abs(todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        currentStreak = isCompletedToday ? 1 : 0;
      }
    }

    const payload = {
      currentStreak: Math.max(1, currentStreak),
      longestStreak: Math.max(longestStreak, currentStreak),
      totalCompletions: Math.max(1, data.totalCompletions || totalActiveDays || 1),
      totalActiveDays: Math.max(1, totalActiveDays || 1),
      totalFocusMinutes: totalFocusMins,
      totalFocusHours: (totalFocusMins / 60).toFixed(1),
      lastCompletedDate: lastDateStr || todayStr,
      isCompletedToday
    };

    cachedStreakData = payload;
    return payload;
  } catch (e) {
    return cachedStreakData;
  }
}

/**
 * Synchronous getter for cached streak data
 */
export function getCachedStreakData() {
  return cachedStreakData;
}

/**
 * Record Daily Morning Cadence Completion
 */
export async function recordDailyCompletion() {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const prev = await getStreakData();
    const logs = await getStoredHeatmapLogs();

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

    const streakPayload = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalCompletions: newTotal,
      lastCompletedDate: todayStr,
      updatedAt: new Date().toISOString()
    };
    await AsyncStorage.setItem(STORAGE_STREAK_KEY, JSON.stringify(streakPayload));

    const currentTodayLog = logs[todayStr] || { focusMinutes: 0, focusSessions: 0 };
    logs[todayStr] = {
      ...currentTodayLog,
      ritualCompleted: true,
      dateStr: todayStr,
      lastActive: new Date().toISOString()
    };
    await AsyncStorage.setItem(STORAGE_HEATMAP_KEY, JSON.stringify(logs));

    cachedStreakData = {
      ...prev,
      ...streakPayload,
      isCompletedToday: true
    };
    cachedHeatmapLogs = logs;

    return {
      ...cachedStreakData,
      wasFirstCompletionToday: wasFirstToday
    };
  } catch (e) {
    return { ...cachedStreakData, wasFirstCompletionToday: false };
  }
}

/**
 * Record Focus Time Block (e.g. +25 minutes)
 */
export async function recordFocusSession(minutes = 25) {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const logs = await getStoredHeatmapLogs();
    const currentTodayLog = logs[todayStr] || { ritualCompleted: false, focusMinutes: 0, focusSessions: 0 };

    const updatedLog = {
      ...currentTodayLog,
      dateStr: todayStr,
      focusMinutes: (currentTodayLog.focusMinutes || 0) + minutes,
      focusSessions: (currentTodayLog.focusSessions || 0) + 1,
      lastActive: new Date().toISOString()
    };

    logs[todayStr] = updatedLog;
    cachedHeatmapLogs = logs;
    await AsyncStorage.setItem(STORAGE_HEATMAP_KEY, JSON.stringify(logs));
    return updatedLog;
  } catch (e) {
    return null;
  }
}

/**
 * Generate 52 Weeks of GitHub-style Grid Data (Past 364 Days)
 */
export function generateGitHubHeatmapGrid(logs = cachedHeatmapLogs) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const days = [];
  const daysTotal = 364; // 52 weeks * 7 days

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
      dayOfWeek: d.getDay(),
      month: d.toLocaleString('en-US', { month: 'short' }),
      monthNum: d.getMonth(),
      dayOfMonth: d.getDate(),
      entry,
      level,
      isToday: dateKey === todayStr,
      isFuture: d > today
    });
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return { weeks, logs, totalDays: days.length };
}
