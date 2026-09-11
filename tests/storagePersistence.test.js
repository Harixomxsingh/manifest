import { describe, it, expect, beforeEach } from 'vitest';
import {
  createBackupSnapshot,
  getBackupSnapshot,
  verifyAndHealStorage,
  exportAllDataAsJSON,
  importBackupFromJSON,
  exportDataForCloudMigration,
  STORAGE_KEYS,
  SCHEMA_VERSION
} from '../src/services/storagePersistenceService';

describe('🛡️ Zero-Data-Loss & Storage Persistence Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates and retrieves a valid redundant backup snapshot', () => {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({ currentStreak: 7, longestStreak: 14 }));
    localStorage.setItem(STORAGE_KEYS.JOURNAL_VAULT, JSON.stringify([
      { id: 'j_1', text: 'Morning gratitude and deep focus.', timestamp: Date.now() }
    ]));

    const snapshot = createBackupSnapshot();
    expect(snapshot).not.toBeNull();
    expect(snapshot.schemaVersion).toBe(SCHEMA_VERSION);
    expect(snapshot.data.streak.currentStreak).toBe(7);
    expect(snapshot.data.journalVault).toHaveLength(1);

    const retrieved = getBackupSnapshot();
    expect(retrieved.data.streak.currentStreak).toBe(7);
  });

  it('self-heals primary storage from backup snapshot if primary data was ever emptied', () => {
    // 1. Snapshot exists
    const initialSnapshot = {
      schemaVersion: SCHEMA_VERSION,
      appVersion: '1.1.2',
      platform: 'web',
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
      data: {
        streak: { currentStreak: 5, longestStreak: 10 },
        heatmap: { '2026-09-11': { ritualCompleted: true, focusMinutes: 50 } },
        journalVault: [{ id: 'j_saved', text: 'Saved wisdom' }],
        settings: { isFahrenheit: false }
      }
    };
    localStorage.setItem(STORAGE_KEYS.BACKUP_SNAPSHOT, JSON.stringify(initialSnapshot));

    // Primary storage is currently empty
    expect(localStorage.getItem(STORAGE_KEYS.STREAK)).toBeNull();

    // Run self-healing
    const result = verifyAndHealStorage();
    expect(result.healed).toBe(true);

    // Verify primary storage was restored
    const restoredStreak = JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAK));
    expect(restoredStreak.currentStreak).toBe(5);

    const restoredJournals = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL_VAULT));
    expect(restoredJournals).toHaveLength(1);
    expect(restoredJournals[0].text).toBe('Saved wisdom');
  });

  it('exports and imports backup JSON with full integrity', () => {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({ currentStreak: 12, longestStreak: 12 }));
    localStorage.setItem(STORAGE_KEYS.JOURNAL_VAULT, JSON.stringify([
      { id: 'j_test', prompt: 'Identity Anchor', text: 'I am relentless.', dateStr: '2026-09-11' }
    ]));

    const jsonExport = exportAllDataAsJSON();
    expect(typeof jsonExport).toBe('string');

    // Wipe storage
    localStorage.clear();
    expect(localStorage.getItem(STORAGE_KEYS.STREAK)).toBeNull();

    // Import from JSON
    const importRes = importBackupFromJSON(jsonExport);
    expect(importRes.success).toBe(true);
    expect(importRes.restoredItems.journalEntriesCount).toBe(1);

    const restoredStreak = JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAK));
    expect(restoredStreak.currentStreak).toBe(12);

    const restoredJournals = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL_VAULT));
    expect(restoredJournals[0].text).toBe('I am relentless.');
  });

  it('formats offline data cleanly for Cloud Migration (PostgreSQL / Supabase schema)', () => {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({
      currentStreak: 3,
      longestStreak: 8,
      totalCompletions: 15,
      lastCompletedDate: '2026-09-11'
    }));
    localStorage.setItem(STORAGE_KEYS.JOURNAL_VAULT, JSON.stringify([
      {
        id: 'vault_1',
        timestamp: Date.now(),
        dateStr: '2026-09-11',
        type: 'voice',
        prompt: 'Morning Clarity',
        text: 'Recorded audio manifest',
        durationMillis: 45000,
        synthesis: { manifestationAnchor: 'Unstoppable Momentum', kineticAction: 'Ship release' }
      }
    ]));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ isFahrenheit: false, speechRate: 1.0 }));

    const cloudPayload = exportDataForCloudMigration();
    expect(cloudPayload.schemaVersion).toBe(SCHEMA_VERSION);
    expect(cloudPayload.payload.user_profile.preferred_temperature_unit).toBe('celsius');
    expect(cloudPayload.payload.streak_summary.current_streak).toBe(3);
    expect(cloudPayload.payload.journal_vault_records).toHaveLength(1);
    expect(cloudPayload.payload.journal_vault_records[0].ai_synthesis.kineticAction).toBe('Ship release');
  });
});
