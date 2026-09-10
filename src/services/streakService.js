/**
 * Daily Streak & Momentum Service
 * Automatically tracks consecutive morning manifestation completions.
 */

const STORAGE_STREAK_KEY = 'manifest_morning_streak_data';

export function getStreakData() {
  try {
    const raw = localStorage.getItem(STORAGE_STREAK_KEY);
    if (!raw) {
      return {
        currentStreak: 1,
        totalCompletions: 1,
        lastCompletedDate: new Date().toISOString().split('T')[0],
        isCompletedToday: false
      };
    }

    const data = JSON.parse(raw);
    const todayStr = new Date().toISOString().split('T')[0];
    const lastDateStr = data.lastCompletedDate;

    if (!lastDateStr) {
      return { currentStreak: 1, totalCompletions: 1, lastCompletedDate: todayStr, isCompletedToday: false };
    }

    if (lastDateStr === todayStr) {
      return {
        currentStreak: data.currentStreak || 1,
        totalCompletions: data.totalCompletions || 1,
        lastCompletedDate: todayStr,
        isCompletedToday: true
      };
    }

    const todayDate = new Date(todayStr);
    const lastDate = new Date(lastDateStr);
    const diffTime = Math.abs(todayDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Completed yesterday, streak active!
      return {
        currentStreak: data.currentStreak || 1,
        totalCompletions: data.totalCompletions || 1,
        lastCompletedDate: lastDateStr,
        isCompletedToday: false
      };
    } else if (diffDays > 1) {
      // Streak broken, resets to 1 on next complete
      return {
        currentStreak: 1,
        totalCompletions: data.totalCompletions || 1,
        lastCompletedDate: lastDateStr,
        isCompletedToday: false
      };
    }

    return { ...data, isCompletedToday: false };
  } catch (e) {
    return { currentStreak: 1, totalCompletions: 1, lastCompletedDate: '', isCompletedToday: false };
  }
}

export function recordDailyCompletion() {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const prev = getStreakData();

    let newStreak = prev.currentStreak || 1;
    let newTotal = (prev.totalCompletions || 0);

    if (!prev.isCompletedToday) {
      newTotal += 1;
      const todayDate = new Date(todayStr);
      const lastDate = prev.lastCompletedDate ? new Date(prev.lastCompletedDate) : null;

      if (lastDate) {
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
    }

    const payload = {
      currentStreak: newStreak,
      totalCompletions: newTotal,
      lastCompletedDate: todayStr,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_STREAK_KEY, JSON.stringify(payload));
    return { ...payload, isCompletedToday: true };
  } catch (e) {
    return { currentStreak: 1, totalCompletions: 1, isCompletedToday: true };
  }
}
