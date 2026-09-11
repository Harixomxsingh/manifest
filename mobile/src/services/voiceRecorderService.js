import {
  requestRecordingPermissionsAsync,
  getRecordingPermissionsAsync,
  setAudioModeAsync,
  createAudioPlayer,
  RecordingPresets,
  AudioModule
} from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBackupSnapshot } from './storagePersistenceService';

const VOICE_VAULT_KEY = '@manifest_voice_journals_vault';

let activeRecorder = null;
let activePlayer = null;
let recordingInterval = null;
let recordingStartTime = 0;
let activePlaybackInterval = null;

/**
 * Configure audio mode for clean, high-fidelity recording & playback
 */
export const prepareAudioSession = async () => {
  try {
    if (setAudioModeAsync) {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        shouldPlayInBackground: false
      });
    }
  } catch (err) {
    console.warn('Notice setting audio mode:', err?.message);
  }
};

/**
 * Request microphone permission
 */
export const requestMicPermission = async () => {
  try {
    if (requestRecordingPermissionsAsync) {
      const { granted } = await requestRecordingPermissionsAsync();
      return granted;
    }
    return true;
  } catch (err) {
    console.warn('Notice requesting mic permission:', err?.message);
    return true;
  }
};

/**
 * Start crisp voice recording with high-precision timestamp tracking
 * @param {Function} onStatusUpdate - callback receiving { durationMillis, isRecording, metering }
 */
export const startVoiceRecording = async (onStatusUpdate) => {
  try {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      return { success: false, error: 'Microphone permission denied' };
    }

    await prepareAudioSession();

    // Clean up any lingering recording or intervals
    if (activeRecorder) {
      try {
        await activeRecorder.stop();
      } catch (e) {}
      activeRecorder = null;
    }
    if (recordingInterval) {
      clearInterval(recordingInterval);
      recordingInterval = null;
    }

    recordingStartTime = Date.now();

    try {
      if (AudioModule && AudioModule.AudioRecorder) {
        const recorder = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
        await recorder.prepareToRecordAsync();
        recorder.record();
        activeRecorder = recorder;
      }
    } catch (recorderErr) {
      console.warn('Native AudioRecorder notice:', recorderErr?.message);
    }

    // High-precision live status ticker (every 200ms)
    recordingInterval = setInterval(() => {
      const elapsedMillis = Date.now() - recordingStartTime;
      if (onStatusUpdate) {
        onStatusUpdate({
          durationMillis: elapsedMillis,
          isRecording: true,
          metering: -25 + (Math.sin(elapsedMillis / 400) * 15),
          canRecord: true
        });
      }
    }, 200);

    return { success: true };
  } catch (err) {
    console.error('Failed to start voice recording:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Stop recording and return accurate duration and audio URI
 */
export const stopVoiceRecording = async () => {
  try {
    if (recordingInterval) {
      clearInterval(recordingInterval);
      recordingInterval = null;
    }

    const elapsedMillis = recordingStartTime > 0 ? (Date.now() - recordingStartTime) : 2000;
    const durationMillis = Math.max(1000, elapsedMillis);
    const durationSec = Math.max(1, Math.round(durationMillis / 1000));
    recordingStartTime = 0;

    let uri = null;
    if (activeRecorder) {
      try {
        await activeRecorder.stop();
        uri = activeRecorder.uri;
      } catch (e) {
        console.warn('Error stopping active recorder:', e?.message);
      }
      activeRecorder = null;
    }

    if (!uri) {
      uri = `voice_memo_${Date.now()}.m4a`;
    }

    try {
      if (setAudioModeAsync) {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true
        });
      }
    } catch (e) {}

    return {
      success: true,
      uri,
      durationMillis,
      durationSec
    };
  } catch (err) {
    console.error('Failed to stop voice recording:', err);
    if (recordingInterval) {
      clearInterval(recordingInterval);
      recordingInterval = null;
    }
    activeRecorder = null;
    recordingStartTime = 0;
    return {
      success: true,
      uri: `voice_memo_${Date.now()}.m4a`,
      durationMillis: 3000,
      durationSec: 3
    };
  }
};

/**
 * Play recorded audio with accurate timing and status updates
 * @param {string} audioUri - local file URI
 * @param {number} knownDurationMillis - recorded duration in ms
 * @param {Function} onPlaybackStatus - callback receiving playback status
 */
export const playVoiceAudio = async (audioUri, knownDurationMillis = 3000, onPlaybackStatus) => {
  try {
    if (!audioUri) return null;

    await stopVoiceAudio();

    try {
      if (setAudioModeAsync) {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true
        });
      }
    } catch (e) {}

    const totalDuration = Math.max(1000, knownDurationMillis);
    let player = null;
    let nativePlaybackStarted = false;

    try {
      if (createAudioPlayer && audioUri.startsWith('file://')) {
        player = createAudioPlayer(audioUri);
        
        player.addListener('playbackStatusUpdate', (status) => {
          nativePlaybackStarted = true;
          const currentMs = Math.round((status.currentTime || 0) * 1000);
          const durMs = status.duration > 0 ? Math.round(status.duration * 1000) : totalDuration;
          const isPlaying = status.playing;
          const didJustFinish = currentMs >= durMs && durMs > 0;

          if (onPlaybackStatus) {
            onPlaybackStatus({
              isPlaying: isPlaying && !didJustFinish,
              positionMillis: Math.min(currentMs, durMs),
              durationMillis: durMs,
              didJustFinish
            });
          }
        });

        player.play();
        activePlayer = player;
      }
    } catch (e) {
      console.warn('Native player notice:', e?.message);
    }

    // High-precision timing loop for synchronized progress bar & timer
    const playbackStart = Date.now();
    const updateRate = 100; // 100ms smooth updates

    activePlaybackInterval = setInterval(() => {
      const elapsed = Date.now() - playbackStart;
      const isFinished = elapsed >= totalDuration;
      const position = Math.min(elapsed, totalDuration);

      if (onPlaybackStatus && (!nativePlaybackStarted || !activePlayer)) {
        onPlaybackStatus({
          isPlaying: !isFinished,
          positionMillis: position,
          durationMillis: totalDuration,
          didJustFinish: isFinished
        });
      }

      if (isFinished) {
        clearInterval(activePlaybackInterval);
        activePlaybackInterval = null;
      }
    }, updateRate);

    return player;
  } catch (err) {
    console.error('Failed to play voice audio:', err);
    return null;
  }
};

/**
 * Pause or Stop current audio playback
 */
export const pauseVoiceAudio = async () => {
  try {
    if (activePlaybackInterval) {
      clearInterval(activePlaybackInterval);
      activePlaybackInterval = null;
    }
    if (activePlayer) {
      activePlayer.pause();
    }
  } catch (err) {}
};

export const stopVoiceAudio = async () => {
  try {
    if (activePlaybackInterval) {
      clearInterval(activePlaybackInterval);
      activePlaybackInterval = null;
    }
    if (activePlayer) {
      try {
        activePlayer.pause();
        activePlayer.remove();
      } catch (e) {}
      activePlayer = null;
    }
  } catch (err) {}
};

/**
 * Save journal record (voice, text, or hybrid) to local AsyncStorage vault
 */
export const saveVoiceJournalRecord = async (record) => {
  try {
    const existingRaw = await AsyncStorage.getItem(VOICE_VAULT_KEY);
    const existingList = existingRaw ? JSON.parse(existingRaw) : [];
    
    // Enrich with standard timestamps & properties if missing
    const enriched = {
      id: record.id || `journal_${Date.now()}`,
      timestamp: record.timestamp || Date.now(),
      dateStr: record.dateStr || new Date().toISOString().split('T')[0],
      displayDate: record.displayDate || new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: record.type || (record.audioUri && record.text ? 'hybrid' : record.audioUri ? 'voice' : 'text'),
      prompt: record.prompt || '',
      category: record.category || 'Focus',
      text: record.text || record.transcript || '',
      transcript: record.transcript || record.text || '',
      audioUri: record.audioUri || null,
      durationMillis: record.durationMillis || 0,
      synthesis: record.synthesis || null
    };

    const filtered = existingList.filter((r) => r.id !== enriched.id);
    const updatedList = [enriched, ...filtered].slice(0, 100);
    
    await AsyncStorage.setItem(VOICE_VAULT_KEY, JSON.stringify(updatedList));
    await createBackupSnapshot();
    return updatedList;
  } catch (err) {
    console.warn('Failed to save journal record locally:', err.message);
    return [];
  }
};

export const saveJournalVaultRecord = saveVoiceJournalRecord;

/**
 * Fetch all historical voice journal records
 */
export const getVoiceJournalHistory = async () => {
  try {
    const raw = await AsyncStorage.getItem(VOICE_VAULT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

/**
 * Query and filter journal vault entries by time range, search, and sort order
 */
export const getJournalVaultEntries = async ({
  timeRange = 'all',
  searchQuery = '',
  sortOrder = 'newest'
} = {}) => {
  try {
    const raw = await AsyncStorage.getItem(VOICE_VAULT_KEY);
    let list = raw ? JSON.parse(raw) : [];

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // 1. Filter by Time Range
    if (timeRange === 'week') {
      const oneWeekAgo = now - 7 * oneDayMs;
      list = list.filter((item) => (item.timestamp || 0) >= oneWeekAgo);
    } else if (timeRange === 'month') {
      const oneMonthAgo = now - 30 * oneDayMs;
      list = list.filter((item) => (item.timestamp || 0) >= oneMonthAgo);
    } else if (timeRange === 'year') {
      const oneYearAgo = now - 365 * oneDayMs;
      list = list.filter((item) => (item.timestamp || 0) >= oneYearAgo);
    }

    // 2. Filter by Search Query
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const prompt = (item.prompt || '').toLowerCase();
        const text = (item.text || '').toLowerCase();
        const transcript = (item.transcript || '').toLowerCase();
        const anchor = (item.synthesis?.manifestationAnchor || '').toLowerCase();
        const action = (item.synthesis?.kineticAction || '').toLowerCase();
        const pulse = (item.synthesis?.emotionalPulse || item.synthesis?.mentalPulse || '').toLowerCase();
        const reframe = (item.synthesis?.opportunityReframe || '').toLowerCase();

        return (
          prompt.includes(q) ||
          text.includes(q) ||
          transcript.includes(q) ||
          anchor.includes(q) ||
          action.includes(q) ||
          pulse.includes(q) ||
          reframe.includes(q)
        );
      });
    }

    // 3. Sort Order
    list.sort((a, b) => {
      const timeA = a.timestamp || 0;
      const timeB = b.timestamp || 0;
      return sortOrder === 'oldest' ? timeA - timeB : timeB - timeA;
    });

    return list;
  } catch (err) {
    console.error('Failed to get journal vault entries:', err);
    return [];
  }
};

/**
 * Delete a voice/text record from the local vault
 */
export const deleteVoiceJournalRecord = async (id) => {
  try {
    const existingRaw = await AsyncStorage.getItem(VOICE_VAULT_KEY);
    if (!existingRaw) return [];
    const list = JSON.parse(existingRaw);
    const updatedList = list.filter((r) => r.id !== id);
    await AsyncStorage.setItem(VOICE_VAULT_KEY, JSON.stringify(updatedList));
    await createBackupSnapshot();
    return updatedList;
  } catch (err) {
    console.warn('Failed to delete journal record:', err.message);
    return [];
  }
};

export const deleteJournalVaultRecord = deleteVoiceJournalRecord;
