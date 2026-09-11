/**
 * 🛡️ Storage Persistence & Cloud-Ready Migration Service (Mobile / React Native)
 *
 * Provides zero-data-loss protection for Manifest Mobile:
 * - Versioned schema (`schemaVersion: 1`)
 * - Redundant auto-backup snapshots (`@manifest_backup_snapshot`)
 * - Fail-safe self-healing if primary keys are corrupted
 * - 1-Click Backup Export & Restore (JSON)
 * - Cloud Database Migration Bridge (Normalized JSON payload for PostgreSQL / Supabase / Firebase)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const SCHEMA_VERSION = 1;

export const STORAGE_KEYS = {
  STREAK: '@manifest_streak_data',
  HEATMAP: '@manifest_focus_heatmap_data',
  JOURNAL_VAULT: '@manifest_voice_journals_vault',
  SETTINGS: '@manifest_user_settings',
  BACKUP_SNAPSHOT: '@manifest_backup_snapshot'
};

/**
 * Read item safely from AsyncStorage with JSON parsing
 */
async function safeGetItem(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`[StorageService] Error reading key "${key}":`, err.message);
    return fallback;
  }
}

/**
 * Write item safely to AsyncStorage with JSON stringifying
 */
async function safeSetItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[StorageService] Error writing key "${key}":`, err.message);
    return false;
  }
}

/**
 * Capture an immediate redundant backup snapshot of all local data
 */
export async function createBackupSnapshot() {
  try {
    const streak = await safeGetItem(STORAGE_KEYS.STREAK, {});
    const heatmap = await safeGetItem(STORAGE_KEYS.HEATMAP, {});
    const journalVault = await safeGetItem(STORAGE_KEYS.JOURNAL_VAULT, []);
    const settings = await safeGetItem(STORAGE_KEYS.SETTINGS, {});

    const snapshot = {
      schemaVersion: SCHEMA_VERSION,
      appVersion: '1.1.2',
      platform: 'android_expo',
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
      data: {
        streak,
        heatmap,
        journalVault: Array.isArray(journalVault) ? journalVault : [],
        settings
      }
    };

    await safeSetItem(STORAGE_KEYS.BACKUP_SNAPSHOT, snapshot);
    return snapshot;
  } catch (err) {
    console.error('[StorageService] Failed to create mobile backup snapshot:', err);
    return null;
  }
}

/**
 * Get the latest backup snapshot
 */
export async function getBackupSnapshot() {
  return await safeGetItem(STORAGE_KEYS.BACKUP_SNAPSHOT, null);
}

/**
 * Self-healing: Verify storage integrity, restoring from backup snapshot if needed
 */
export async function verifyAndHealStorage() {
  try {
    const streak = await safeGetItem(STORAGE_KEYS.STREAK);
    const heatmap = await safeGetItem(STORAGE_KEYS.HEATMAP);
    const journalVault = await safeGetItem(STORAGE_KEYS.JOURNAL_VAULT);
    const snapshot = await getBackupSnapshot();

    // If primary storage is completely missing but a snapshot exists, auto-heal
    if (!streak && !heatmap && (!journalVault || journalVault.length === 0) && snapshot && snapshot.data) {
      console.info('[StorageService] Mobile storage empty; auto-healing from redundant backup snapshot...');
      if (snapshot.data.streak) await safeSetItem(STORAGE_KEYS.STREAK, snapshot.data.streak);
      if (snapshot.data.heatmap) await safeSetItem(STORAGE_KEYS.HEATMAP, snapshot.data.heatmap);
      if (snapshot.data.journalVault) await safeSetItem(STORAGE_KEYS.JOURNAL_VAULT, snapshot.data.journalVault);
      if (snapshot.data.settings) await safeSetItem(STORAGE_KEYS.SETTINGS, snapshot.data.settings);
      return { healed: true, source: 'snapshot' };
    }

    // Otherwise refresh the snapshot with current data
    await createBackupSnapshot();
    return { healed: false, status: 'healthy' };
  } catch (err) {
    console.warn('[StorageService] Mobile storage check notice:', err.message);
    return { healed: false, error: err.message };
  }
}

/**
 * Export full local dataset as a clean, formatted JSON string
 */
export async function exportAllDataAsJSON() {
  const snapshot = (await createBackupSnapshot()) || {
    schemaVersion: SCHEMA_VERSION,
    appVersion: '1.1.2',
    platform: 'android_expo',
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
    data: {
      streak: await safeGetItem(STORAGE_KEYS.STREAK, {}),
      heatmap: await safeGetItem(STORAGE_KEYS.HEATMAP, {}),
      journalVault: await safeGetItem(STORAGE_KEYS.JOURNAL_VAULT, []),
      settings: await safeGetItem(STORAGE_KEYS.SETTINGS, {})
    }
  };

  return JSON.stringify(snapshot, null, 2);
}

/**
 * Import and restore all data from a JSON string
 */
export async function importBackupFromJSON(jsonString) {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      throw new Error('Invalid backup content: string expected.');
    }

    const parsed = JSON.parse(jsonString);
    const data = parsed.data || parsed;

    if (!data || typeof data !== 'object') {
      throw new Error('Unrecognized backup structure: missing data payload.');
    }

    // 1. Restore Streaks
    if (data.streak && typeof data.streak === 'object') {
      await safeSetItem(STORAGE_KEYS.STREAK, data.streak);
    }

    // 2. Restore Focus Heatmap
    if (data.heatmap && typeof data.heatmap === 'object') {
      await safeSetItem(STORAGE_KEYS.HEATMAP, data.heatmap);
    }

    // 3. Restore Journal Vault
    if (Array.isArray(data.journalVault)) {
      await safeSetItem(STORAGE_KEYS.JOURNAL_VAULT, data.journalVault);
    }

    // 4. Restore Settings
    if (data.settings && typeof data.settings === 'object') {
      await safeSetItem(STORAGE_KEYS.SETTINGS, data.settings);
    }

    // Create a new snapshot of restored state
    await createBackupSnapshot();

    return {
      success: true,
      restoredItems: {
        journalEntriesCount: Array.isArray(data.journalVault) ? data.journalVault.length : 0,
        hasStreak: !!data.streak,
        hasHeatmap: !!data.heatmap
      }
    };
  } catch (err) {
    console.error('[StorageService] Failed to import mobile backup:', err);
    return { success: false, error: err.message };
  }
}

/**
 * ☁️ Cloud Migration Adapter:
 * Formats all local data into relational / document-ready schema
 * ready for batch-syncing to a backend database (Postgres, Supabase, Firebase, etc.)
 */
export async function exportDataForCloudMigration() {
  const streak = await safeGetItem(STORAGE_KEYS.STREAK, {});
  const heatmap = await safeGetItem(STORAGE_KEYS.HEATMAP, {});
  const journalVault = await safeGetItem(STORAGE_KEYS.JOURNAL_VAULT, []);
  const settings = await safeGetItem(STORAGE_KEYS.SETTINGS, {});

  return {
    schemaVersion: SCHEMA_VERSION,
    migrationExportedAt: new Date().toISOString(),
    payload: {
      user_profile: {
        last_active: new Date().toISOString(),
        preferred_temperature_unit: settings.isFahrenheit ? 'fahrenheit' : 'celsius',
        speech_rate: settings.speechRate || 1.0,
        app_version: '1.1.2'
      },
      streak_summary: {
        current_streak: streak.currentStreak || 1,
        longest_streak: streak.longestStreak || 1,
        total_completions: streak.totalCompletions || 1,
        last_completed_date: streak.lastCompletedDate || new Date().toISOString().split('T')[0]
      },
      daily_focus_logs: Object.entries(heatmap).map(([dateStr, log]) => ({
        log_date: dateStr,
        ritual_completed: !!log.ritualCompleted,
        focus_minutes: log.focusMinutes || 0,
        activity_level: log.activityLevel || 0,
        completed_at: log.completedAt || dateStr
      })),
      journal_vault_records: (Array.isArray(journalVault) ? journalVault : []).map((entry) => ({
        client_entry_id: entry.id,
        created_at: entry.timestamp ? new Date(entry.timestamp).toISOString() : new Date().toISOString(),
        entry_date: entry.dateStr || new Date().toISOString().split('T')[0],
        entry_type: entry.type || 'hybrid',
        prompt_text: entry.prompt || '',
        user_text: entry.text || entry.transcript || '',
        audio_duration_ms: entry.durationMillis || 0,
        ai_synthesis: entry.synthesis || null
      }))
    }
  };
}
