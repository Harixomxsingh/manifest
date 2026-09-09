const VOICE_VAULT_KEY = '@manifest_voice_journals_vault';

let mediaRecorder = null;
let audioChunks = [];
let recordingStartTime = 0;
let recordingInterval = null;
let activeAudio = null;
let activePlaybackInterval = null;

/**
 * Request microphone permission and initialize MediaRecorder
 */
export const requestMicPermission = async () => {
  try {
    if (!navigator?.mediaDevices?.getUserMedia) {
      return false;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop tracks immediately after verifying permission
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (err) {
    console.warn('Microphone permission notice:', err.message);
    return false;
  }
};

/**
 * Start crisp voice recording on web
 */
export const startVoiceRecording = async (onStatusUpdate) => {
  try {
    if (!navigator?.mediaDevices?.getUserMedia) {
      throw new Error('Web Audio Recording not supported in this browser.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];

    const options = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? { mimeType: 'audio/webm;codecs=opus' }
      : {};

    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.start(200);
    recordingStartTime = Date.now();

    if (recordingInterval) clearInterval(recordingInterval);
    recordingInterval = setInterval(() => {
      const elapsed = Date.now() - recordingStartTime;
      if (onStatusUpdate) {
        onStatusUpdate({
          durationMillis: elapsed,
          isRecording: true
        });
      }
    }, 200);

    return { success: true };
  } catch (err) {
    console.error('Failed to start web voice recording:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Stop recording and return audio object URL & duration
 */
export const stopVoiceRecording = async () => {
  return new Promise((resolve) => {
    try {
      if (recordingInterval) {
        clearInterval(recordingInterval);
        recordingInterval = null;
      }

      const elapsed = recordingStartTime > 0 ? Date.now() - recordingStartTime : 2000;
      const durationMillis = Math.max(1000, elapsed);
      const durationSec = Math.max(1, Math.round(durationMillis / 1000));
      recordingStartTime = 0;

      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        resolve({
          success: true,
          uri: null,
          durationMillis,
          durationSec
        });
        return;
      }

      mediaRecorder.onstop = () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);

          // Stop all audio stream tracks
          if (mediaRecorder.stream) {
            mediaRecorder.stream.getTracks().forEach((t) => t.stop());
          }

          resolve({
            success: true,
            uri: audioUrl,
            durationMillis,
            durationSec
          });
        } catch (e) {
          resolve({
            success: true,
            uri: null,
            durationMillis,
            durationSec
          });
        }
      };

      mediaRecorder.stop();
    } catch (err) {
      console.error('Error stopping web recording:', err);
      resolve({
        success: true,
        uri: null,
        durationMillis: 3000,
        durationSec: 3
      });
    }
  });
};

/**
 * Play recorded audio on Web
 */
export const playVoiceAudio = async (audioUri, knownDurationMillis = 3000, onPlaybackStatus) => {
  try {
    if (!audioUri) return null;

    stopVoiceAudio();

    const audio = new Audio(audioUri);
    activeAudio = audio;

    const totalDuration = Math.max(1000, knownDurationMillis);

    audio.ontimeupdate = () => {
      const currentMs = Math.round(audio.currentTime * 1000);
      const durMs = audio.duration && !isNaN(audio.duration) ? Math.round(audio.duration * 1000) : totalDuration;
      const didJustFinish = currentMs >= durMs || audio.ended;

      if (onPlaybackStatus) {
        onPlaybackStatus({
          isPlaying: !audio.paused && !didJustFinish,
          positionMillis: Math.min(currentMs, durMs),
          durationMillis: durMs,
          didJustFinish
        });
      }
    };

    audio.onended = () => {
      if (onPlaybackStatus) {
        onPlaybackStatus({
          isPlaying: false,
          positionMillis: 0,
          durationMillis: totalDuration,
          didJustFinish: true
        });
      }
    };

    await audio.play();
    return audio;
  } catch (err) {
    console.error('Failed to play web audio:', err);
    return null;
  }
};

export const pauseVoiceAudio = () => {
  try {
    if (activeAudio) {
      activeAudio.pause();
    }
  } catch (e) {}
};

export const stopVoiceAudio = () => {
  try {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }
  } catch (e) {}
};

/**
 * Save journal record (voice, text, or hybrid) to internal storage vault
 */
export const saveVoiceJournalRecord = async (record) => {
  try {
    const existingRaw = localStorage.getItem(VOICE_VAULT_KEY);
    const existingList = existingRaw ? JSON.parse(existingRaw) : [];
    
    // Enrich with standard timestamps if missing
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
      text: record.text || '',
      transcript: record.transcript || '',
      audioUri: record.audioUri || null,
      durationMillis: record.durationMillis || 0,
      synthesis: record.synthesis || null
    };

    const filtered = existingList.filter((r) => r.id !== enriched.id);
    const updatedList = [enriched, ...filtered].slice(0, 100);
    localStorage.setItem(VOICE_VAULT_KEY, JSON.stringify(updatedList));
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
    const raw = localStorage.getItem(VOICE_VAULT_KEY);
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
    const raw = localStorage.getItem(VOICE_VAULT_KEY);
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
        const pulse = (item.synthesis?.mentalPulse || '').toLowerCase();
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
    const existingRaw = localStorage.getItem(VOICE_VAULT_KEY);
    if (!existingRaw) return [];
    const list = JSON.parse(existingRaw);
    const updatedList = list.filter((r) => r.id !== id);
    localStorage.setItem(VOICE_VAULT_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (err) {
    console.warn('Failed to delete journal record:', err.message);
    return [];
  }
};

export const deleteJournalVaultRecord = deleteVoiceJournalRecord;
