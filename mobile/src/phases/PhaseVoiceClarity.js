import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  ActivityIndicator,
  Platform,
  Modal,
  ScrollView
} from 'react-native';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Target,
  Smile,
  Zap,
  Trash2,
  Clock,
  Shuffle,
  X,
  CheckCircle2,
  Edit3,
  Compass
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import {
  startVoiceRecording,
  stopVoiceRecording,
  playVoiceAudio,
  pauseVoiceAudio,
  stopVoiceAudio,
  saveVoiceJournalRecord,
  getVoiceJournalHistory,
  deleteVoiceJournalRecord
} from '../services/voiceRecorderService';
import { synthesizeVoiceWithGemini } from '../services/voiceSynthesisService';
import { triggerHaptic } from '../services/hapticsService';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import voicePrompts from '../data/voicePrompts.json';
import PromptBrowserModal from '../components/PromptBrowserModal';
import JournalVaultModal from '../components/JournalVaultModal';

export default function PhaseVoiceClarity() {
  const { advancePhase, voiceJournal, setVoiceJournal, geminiApiKey } = useApp();

  // Prompt engine - seeded with day of year for fresh daily morning prompt
  const [currentPromptIndex, setCurrentPromptIndex] = useState(() => {
    const today = new Date();
    const daySeed = today.getFullYear() * 366 + (today.getMonth() + 1) * 31 + today.getDate();
    return daySeed % (voicePrompts?.length || 1);
  });

  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordDurationMs, setRecordDurationMs] = useState(voiceJournal?.durationMillis || 0);
  const [audioUri, setAudioUri] = useState(voiceJournal?.audioUri || null);
  const [transcript, setTranscript] = useState(voiceJournal?.transcript || '');
  const [synthesis, setSynthesis] = useState(voiceJournal?.synthesis || null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showManualNotes, setShowManualNotes] = useState(false);

  // Playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackPosMs, setPlaybackPosMs] = useState(0);
  const [playbackTotalMs, setPlaybackTotalMs] = useState(voiceJournal?.durationMillis || 3000);

  // Vault modal
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [vaultCount, setVaultCount] = useState(0);

  // Smooth Mic Pulsing Animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  const loadVaultCount = async () => {
    const list = await getVoiceJournalHistory();
    setVaultCount(list.length);
  };

  useEffect(() => {
    loadVaultCount();
  }, [isVaultOpen]);

  useEffect(() => {
    if (isRecording) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.18,
            duration: 800,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 800,
            useNativeDriver: true
          })
        ])
      );
      pulseLoop.current.start();
    } else {
      if (pulseLoop.current) {
        pulseLoop.current.stop();
      }
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // Clean up playback on unmount
  useEffect(() => {
    return () => {
      stopVoiceAudio();
    };
  }, []);

  const formatTime = (millis) => {
    const totalSec = Math.max(0, Math.floor(millis / 1000));
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextPrompt = () => {
    triggerHaptic('light');
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * (voicePrompts?.length || 1));
    } while (nextIdx === currentPromptIndex && (voicePrompts?.length || 1) > 1);
    setCurrentPromptIndex(nextIdx);
  };

  const handleStartRecord = async () => {
    triggerHaptic('medium');
    setRecordDurationMs(0);
    setIsPlayingAudio(false);
    await stopVoiceAudio();

    const result = await startVoiceRecording((status) => {
      if (status.isRecording) {
        setRecordDurationMs(status.durationMillis);
      }
    });

    if (result.success) {
      setIsRecording(true);
    }
  };

  const handleStopRecord = async () => {
    triggerHaptic('success');
    setIsRecording(false);
    const result = await stopVoiceRecording();

    if (result.success && result.uri) {
      const accurateDurationMs = result.durationMillis || 3000;
      setAudioUri(result.uri);
      setRecordDurationMs(accurateDurationMs);
      setPlaybackTotalMs(accurateDurationMs);
      setPlaybackPosMs(0);
      setIsSynthesizing(true);

      const rawText = transcript.trim() || `Reflection on: "${promptText}"`;
      setTranscript(rawText);

      // Synthesize clarity with human-friendly fields
      const synthResult = await synthesizeVoiceWithGemini(rawText, geminiApiKey);
      setSynthesis(synthResult);
      setIsSynthesizing(false);

      const now = new Date();
      const newRecord = {
        id: 'vj_' + Date.now(),
        audioUri: result.uri,
        durationMillis: accurateDurationMs,
        durationSec: result.durationSec,
        transcript: rawText,
        prompt: promptText,
        category: promptCategory,
        synthesis: synthResult,
        createdAt: now.toISOString(),
        displayDate: now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        })
      };

      setVoiceJournal(newRecord);
      const updatedHistory = await saveVoiceJournalRecord(newRecord);
      setHistoryList(updatedHistory);
    }
  };

  const handleTogglePlayback = async () => {
    triggerHaptic('light');
    if (!audioUri) return;

    if (isPlayingAudio) {
      await pauseVoiceAudio();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      await playVoiceAudio(audioUri, playbackTotalMs, (status) => {
        setPlaybackPosMs(status.positionMillis);
        setPlaybackTotalMs(status.durationMillis || playbackTotalMs);
        if (status.didJustFinish) {
          setIsPlayingAudio(false);
          setPlaybackPosMs(0);
        }
      });
    }
  };

  const handleReRecord = async () => {
    triggerHaptic('light');
    await stopVoiceAudio();
    setAudioUri(null);
    setSynthesis(null);
    setTranscript('');
    setRecordDurationMs(0);
    setPlaybackPosMs(0);
    setIsPlayingAudio(false);
  };

  // Play item from History Vault
  const handleToggleHistoryPlayback = async (item) => {
    triggerHaptic('light');
    if (playingHistoryId === item.id) {
      await pauseVoiceAudio();
      setPlayingHistoryId(null);
    } else {
      await stopVoiceAudio();
      setPlayingHistoryId(item.id);
      setHistoryPlaybackPos(0);
      setHistoryPlaybackTotal(item.durationMillis || 3000);

      await playVoiceAudio(item.audioUri, item.durationMillis || 3000, (status) => {
        setHistoryPlaybackPos(status.positionMillis);
        setHistoryPlaybackTotal(status.durationMillis || item.durationMillis);
        if (status.didJustFinish) {
          setPlayingHistoryId(null);
          setHistoryPlaybackPos(0);
        }
      });
    }
  };

  const handleDeleteHistory = async (id) => {
    triggerHaptic('medium');
    if (playingHistoryId === id) {
      await stopVoiceAudio();
      setPlayingHistoryId(null);
    }
    const updated = await deleteVoiceJournalRecord(id);
    setHistoryList(updated);
  };

  const handleUseHistoryEntry = (item) => {
    triggerHaptic('success');
    setVoiceJournal(item);
    setAudioUri(item.audioUri);
    setSynthesis(item.synthesis);
    setTranscript(item.transcript);
    setPlaybackTotalMs(item.durationMillis);
    setRecordDurationMs(item.durationMillis);
    setIsHistoryOpen(false);
  };

  const rawPrompt = voicePrompts?.[currentPromptIndex];
  const promptText = typeof rawPrompt === 'string'
    ? rawPrompt
    : (rawPrompt?.prompt || rawPrompt?.text || "What is the single highest-impact domino you will knock down today?");
  const promptCategory = (typeof rawPrompt === 'object' && rawPrompt?.category)
    ? rawPrompt.category
    : 'Focus';

  return (
    <View style={styles.container}>
      {/* Top Phase Header Tracker with subtle History Icon */}
      <View style={styles.trackerContainer}>
        <View style={styles.trackerTextRow}>
          <Text style={styles.phaseStepText}>PHASE 03 OF 05</Text>
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('light');
                setIsVaultOpen(true);
              }}
              activeOpacity={0.7}
              style={styles.historyBtn}
              accessibilityLabel="Journal Vault"
            >
              <Clock size={13} color={colors.primaryDark} />
              <Text style={styles.historyBtnText}>
                Vault ({vaultCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '60%' }]} />
        </View>
      </View>

      {/* Clear, Prescribed Section Header */}
      <View style={styles.headerBox}>
        <Text style={styles.mainHeading}>Voice Journal</Text>
        <Text style={styles.subtitle}>
          Speak for 1 minute. We will distill your focus and next step.
        </Text>
      </View>

      {/* MAIN JOURNAL CARD */}
      {!synthesis ? (
        <View style={styles.card}>
          {/* Daily Thought-Provoking Prompt (Solves the blank slate problem) */}
          <View style={styles.promptCard}>
            <View style={styles.promptHeaderRow}>
              <View style={styles.promptCategoryBadge}>
                <Text style={styles.promptCategoryText}>PROMPT • {promptCategory.toUpperCase()}</Text>
              </View>
              <Text style={styles.promptCountText}>#{currentPromptIndex + 1}/{voicePrompts.length}</Text>
            </View>

            <View style={styles.promptTextRow}>
              <Text style={styles.promptQuestion}>"{promptText}"</Text>
            </View>

            <View style={styles.promptActionsRow}>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic('light');
                  setIsPromptModalOpen(true);
                }}
                activeOpacity={0.7}
                style={styles.browsePromptsBtn}
                accessibilityLabel="Browse All Prompts"
              >
                <Compass size={12} color={colors.primaryDark} />
                <Text style={styles.browsePromptsText}>Browse {voicePrompts.length} Prompts</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextPrompt}
                activeOpacity={0.7}
                style={styles.shuffleBtn}
                accessibilityLabel="Next Question"
              >
                <Shuffle size={12} color={colors.primaryDark} />
                <Text style={styles.shuffleText}>Shuffle</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Central Smooth Pulsing Mic Button */}
          <View style={styles.micCenterContainer}>
            {isRecording && (
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.18],
                      outputRange: [0.4, 0.05]
                    })
                  }
                ]}
              />
            )}

            <TouchableOpacity
              onPress={isRecording ? handleStopRecord : handleStartRecord}
              activeOpacity={0.88}
              style={[styles.micButton, isRecording && styles.micButtonRecording]}
            >
              {isRecording ? (
                <Square size={24} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Mic size={30} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <Text style={styles.timerText}>
              {isRecording ? formatTime(recordDurationMs) : 'Tap to Start Speaking'}
            </Text>
            {isRecording && (
              <Text style={styles.recordingSubtext}>
                Listening... Tap button when finished
              </Text>
            )}
          </View>

          {/* Collapsible Type Notes Option */}
          {!isRecording && (
            <View style={styles.notesSection}>
              <TouchableOpacity
                onPress={() => setShowManualNotes(!showManualNotes)}
                activeOpacity={0.7}
                style={styles.notesToggleRow}
              >
                <Edit3 size={12} color={colors.textDim} />
                <Text style={styles.notesToggleText}>
                  {showManualNotes ? 'Hide manual typing' : 'Or type your thoughts instead'}
                </Text>
              </TouchableOpacity>

              {showManualNotes && (
                <View style={styles.manualWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type your morning thoughts here..."
                    placeholderTextColor={colors.textDim}
                    multiline
                    value={transcript}
                    onChangeText={setTranscript}
                  />

                  {transcript.length > 5 && (
                    <TouchableOpacity
                      onPress={async () => {
                        triggerHaptic('medium');
                        setIsSynthesizing(true);
                        const res = await synthesizeVoiceWithGemini(transcript, geminiApiKey);
                        setSynthesis(res);
                        setIsSynthesizing(false);
                        const now = new Date();
                        const record = {
                          id: 'vj_' + Date.now(),
                          audioUri: null,
                          durationMillis: 0,
                          durationSec: 0,
                          transcript,
                          prompt: promptText,
                          category: promptCategory,
                          synthesis: res,
                          createdAt: now.toISOString(),
                          displayDate: now.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })
                        };
                        setVoiceJournal(record);
                        const updated = await saveVoiceJournalRecord(record);
                        setHistoryList(updated);
                      }}
                      activeOpacity={0.8}
                      style={styles.synthesizeButton}
                    >
                      {isSynthesizing ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Sparkles size={14} color="#FFFFFF" />
                          <Text style={styles.synthesizeButtonText}>Distill My Focus</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      ) : (
        /* DISTILLED CLARITY SLATE (Human, Simple, Plain Language) */
        <View style={styles.slateCard}>
          {/* Audio Playback Bar (if audio recorded) */}
          {audioUri && (
            <View style={styles.audioPlayerStrip}>
              <TouchableOpacity
                onPress={handleTogglePlayback}
                activeOpacity={0.8}
                style={styles.playButton}
              >
                {isPlayingAudio ? (
                  <Pause size={14} color={colors.primary} />
                ) : (
                  <Play size={14} color={colors.primary} />
                )}
              </TouchableOpacity>

              <View style={styles.timelineWrapper}>
                <View style={styles.timelineBg}>
                  <View
                    style={[
                      styles.timelineProgress,
                      {
                        width: `${Math.min(
                          100,
                          (playbackPosMs / Math.max(1, playbackTotalMs)) * 100
                        )}%`
                      }
                    ]}
                  />
                </View>
                <View style={styles.timeLabelRow}>
                  <Text style={styles.timeLabelText}>{formatTime(playbackPosMs)}</Text>
                  <Text style={styles.timeLabelText}>{formatTime(playbackTotalMs)}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleReRecord}
                activeOpacity={0.7}
                style={styles.reRecordIconBtn}
              >
                <RotateCcw size={12} color={colors.textDim} />
              </TouchableOpacity>
            </View>
          )}

          {/* 1. Core Focus / Takeaway */}
          <View style={styles.anchorBox}>
            <Text style={styles.anchorPillLabel}>YOUR CORE FOCUS</Text>
            <Text style={styles.anchorQuote}>"{synthesis.manifestationAnchor}"</Text>
          </View>

          {/* 2. Plain Language Pillars: Next Step & Mindset Check */}
          <View style={styles.pillarsBox}>
            {/* Next Step */}
            <View style={styles.pillarItem}>
              <View style={styles.pillarIconBadge}>
                <Target size={14} color="#D97706" />
              </View>
              <View style={styles.pillarContent}>
                <Text style={styles.pillarTitle}>NEXT STEP</Text>
                <Text style={styles.pillarBody}>{synthesis.kineticAction}</Text>
              </View>
            </View>

            <View style={styles.pillarDivider} />

            {/* Mindset Check */}
            <View style={styles.pillarItem}>
              <View style={styles.pillarIconBadge}>
                <Smile size={14} color={colors.primary} />
              </View>
              <View style={styles.pillarContent}>
                <Text style={styles.pillarTitle}>MINDSET CHECK</Text>
                <Text style={styles.pillarBody}>{synthesis.emotionalPulse}</Text>
              </View>
            </View>

            {/* Positive Reframe (if present) */}
            {synthesis.opportunityReframe ? (
              <>
                <View style={styles.pillarDivider} />
                <View style={styles.pillarItem}>
                  <View style={styles.pillarIconBadge}>
                    <Sparkles size={14} color="#059669" />
                  </View>
                  <View style={styles.pillarContent}>
                    <Text style={styles.pillarTitle}>POSITIVE REFRAME</Text>
                    <Text style={styles.pillarBody}>{synthesis.opportunityReframe}</Text>
                  </View>
                </View>
              </>
            ) : null}
          </View>

          {/* Re-record Option */}
          <TouchableOpacity
            onPress={handleReRecord}
            activeOpacity={0.7}
            style={styles.reRecordRow}
          >
            <RotateCcw size={12} color={colors.textDim} />
            <Text style={styles.reRecordText}>Record Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Advance Button */}
      <View style={styles.advanceContainer}>
        <TouchableOpacity
          onPress={advancePhase}
          activeOpacity={0.85}
          style={styles.advanceButton}
        >
          <Text style={styles.advanceButtonText}>Save & Proceed to Climate</Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Journal Vault & Archive Modal */}
      <JournalVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />

      {/* 120+ Prompts Library Modal */}
      <PromptBrowserModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        currentPromptIndex={currentPromptIndex}
        onSelectPrompt={(item, idx) => {
          setCurrentPromptIndex(idx);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 24
  },
  trackerContainer: {
    marginBottom: 16
  },
  trackerTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  phaseStepText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.textDim,
    letterSpacing: 1
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgHighlight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  historyBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: fonts.monoBold
  },
  progressBarBg: {
    width: '100%',
    height: 3,
    backgroundColor: colors.borderHairline,
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 18
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: fonts.bold,
    marginBottom: 4,
    letterSpacing: -0.3
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    fontFamily: fonts.regular,
    paddingHorizontal: 12
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 16
  },
  promptCard: {
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    alignItems: 'center'
  },
  promptHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8
  },
  promptCategoryBadge: {
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)'
  },
  promptCategoryText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5
  },
  promptCountText: {
    fontSize: 10,
    color: colors.textDim,
    fontFamily: fonts.mono
  },
  promptTextRow: {
    marginBottom: 8
  },
  promptQuestion: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: fonts.medium
  },
  promptActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4
  },
  browsePromptsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  browsePromptsText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  shuffleText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark
  },
  micCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    position: 'relative'
  },
  pulseRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    zIndex: 0
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 1
  },
  micButtonRecording: {
    backgroundColor: '#DC2626'
  },
  timerText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.monoBold
  },
  recordingSubtext: {
    fontSize: 11,
    color: colors.textDim,
    fontFamily: fonts.regular,
    marginTop: 4,
    textAlign: 'center'
  },
  notesSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
    paddingTop: 10
  },
  notesToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4
  },
  notesToggleText: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: '600',
    fontFamily: fonts.medium
  },
  manualWrapper: {
    marginTop: 8
  },
  textInput: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    minHeight: 44,
    textAlignVertical: 'top'
  },
  synthesizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10
  },
  synthesizeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: fonts.bold
  },
  slateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderGold,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
    marginBottom: 16
  },
  audioPlayerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 12,
    padding: 8,
    marginBottom: 14,
    gap: 8
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGold
  },
  timelineWrapper: {
    flex: 1,
    gap: 3
  },
  timelineBg: {
    height: 4,
    backgroundColor: colors.borderHairline,
    borderRadius: 2,
    overflow: 'hidden'
  },
  timelineProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2
  },
  timeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timeLabelText: {
    fontSize: 9,
    fontFamily: fonts.mono,
    color: colors.textDim
  },
  reRecordIconBtn: {
    padding: 4
  },
  anchorBox: {
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center'
  },
  anchorPillLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.8,
    fontFamily: fonts.monoBold,
    marginBottom: 6
  },
  anchorQuote: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 21,
    fontFamily: fonts.medium
  },
  pillarsBox: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 4
  },
  pillarIconBadge: {
    marginTop: 2
  },
  pillarContent: {
    flex: 1
  },
  pillarTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textDim,
    letterSpacing: 0.6,
    fontFamily: fonts.monoBold,
    marginBottom: 2
  },
  pillarBody: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    lineHeight: 16
  },
  pillarDivider: {
    height: 1,
    backgroundColor: colors.borderHairline,
    marginVertical: 6
  },
  reRecordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4
  },
  reRecordText: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: '600',
    fontFamily: fonts.medium
  },
  advanceContainer: {
    alignItems: 'center'
  },
  advanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4
  },
  advanceButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: fonts.bold,
    letterSpacing: 0.3
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: colors.bgPrimary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
    paddingBottom: 12
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.bold
  },
  modalSub: {
    fontSize: 11,
    color: colors.textDim,
    fontFamily: fonts.regular,
    marginTop: 2
  },
  closeBtn: {
    padding: 6
  },
  historyListContent: {
    paddingBottom: 16
  },
  emptyHistoryState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8
  },
  emptyHistoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.bold
  },
  emptyHistorySub: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    textAlign: 'center'
  },
  historyItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    marginBottom: 10
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  historyDate: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: fonts.monoBold
  },
  deleteBtn: {
    padding: 4
  },
  historyPromptText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginBottom: 6
  },
  historyPlaybackStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: 10,
    padding: 6,
    marginBottom: 8,
    gap: 8
  },
  historyPlayBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  historyTimelineWrapper: {
    flex: 1,
    gap: 2
  },
  historyTimelineBg: {
    height: 3,
    backgroundColor: colors.borderHairline,
    borderRadius: 2,
    overflow: 'hidden'
  },
  historyTimelineProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2
  },
  historyTimeLabel: {
    fontSize: 8.5,
    color: colors.textDim,
    fontFamily: fonts.mono
  },
  historyAnchor: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.primaryDark,
    lineHeight: 18,
    fontFamily: fonts.medium,
    marginBottom: 6
  },
  historyStepBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    padding: 6,
    borderRadius: 8,
    marginBottom: 8
  },
  historyStepLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#B45309',
    fontFamily: fonts.monoBold
  },
  historyStepText: {
    flex: 1,
    fontSize: 11,
    fontFamily: fonts.medium,
    color: '#92400E'
  },
  useEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderGold,
    paddingVertical: 6,
    borderRadius: 8
  },
  useEntryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: fonts.bold
  }
});
