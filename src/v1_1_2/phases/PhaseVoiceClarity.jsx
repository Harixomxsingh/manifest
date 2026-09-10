import React, { useState, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Target,
  Zap,
  Trash2,
  Clock,
  Shuffle,
  X,
  CheckCircle2,
  PenTool,
  Volume2,
  BookOpen,
  PlusCircle,
  Compass,
  Sparkle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  startVoiceRecording,
  stopVoiceRecording,
  playVoiceAudio,
  pauseVoiceAudio,
  stopVoiceAudio,
  saveJournalVaultRecord,
  getJournalVaultEntries
} from '../../services/voiceRecorderService';
import { synthesizeVoiceWithGemini } from '../../services/voiceSynthesisService';
import voicePrompts from '../../data/voicePrompts.json';
import JournalVaultModal from '../components/JournalVaultModal';
import PromptBrowserModal from '../components/PromptBrowserModal';

export default function PhaseVoiceClarity({ onAdvance }) {
  const { voiceJournal, setVoiceJournal, geminiApiKey } = useApp();

  // Daily seed index so every morning has a fresh default prompt
  const [currentPromptIndex, setCurrentPromptIndex] = useState(() => {
    const today = new Date();
    const daySeed = today.getFullYear() * 366 + (today.getMonth() + 1) * 31 + today.getDate();
    return daySeed % (voicePrompts?.length || 1);
  });

  const [isShuffling, setIsShuffling] = useState(false);

  // Mode: 'voice' | 'text'
  const [activeTab, setActiveTab] = useState(voiceJournal?.text && !voiceJournal?.audioUri ? 'text' : 'voice');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordDurationMs, setRecordDurationMs] = useState(voiceJournal?.durationMillis || 0);
  const [audioUri, setAudioUri] = useState(voiceJournal?.audioUri || null);

  // Text state
  const [typedText, setTypedText] = useState(voiceJournal?.text || voiceJournal?.transcript || '');

  // Distillation & Synthesis state
  const [synthesis, setSynthesis] = useState(voiceJournal?.synthesis || null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Audio playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackPosMs, setPlaybackPosMs] = useState(0);
  const [playbackTotalMs, setPlaybackTotalMs] = useState(voiceJournal?.durationMillis || 3000);

  // Modals state
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isPromptBrowserOpen, setIsPromptBrowserOpen] = useState(false);
  const [vaultCount, setVaultCount] = useState(0);

  // Sync internal state whenever external voiceJournal changes (e.g., reset to null or loaded from Vault)
  useEffect(() => {
    if (!voiceJournal) {
      stopVoiceAudio();
      setIsPlayingAudio(false);
      setAudioUri(null);
      setTypedText('');
      setSynthesis(null);
      setRecordDurationMs(0);
      setIsRecording(false);
      setActiveTab('voice');
      const today = new Date();
      const daySeed = today.getFullYear() * 366 + (today.getMonth() + 1) * 31 + today.getDate();
      setCurrentPromptIndex(daySeed % (voicePrompts?.length || 1));
    } else {
      setAudioUri(voiceJournal.audioUri || null);
      setTypedText(voiceJournal.text || voiceJournal.transcript || '');
      setSynthesis(voiceJournal.synthesis || null);
      setRecordDurationMs(voiceJournal.durationMillis || 0);
      setPlaybackTotalMs(voiceJournal.durationMillis || 3000);
      if (voiceJournal.text && !voiceJournal.audioUri) {
        setActiveTab('text');
      }
    }
  }, [voiceJournal]);

  // Bulletproof extraction of promptText and promptCategory
  const rawPrompt = voicePrompts?.[currentPromptIndex];
  const promptText = typeof rawPrompt === 'string'
    ? rawPrompt
    : (rawPrompt?.prompt || rawPrompt?.text || "What is the single highest-impact domino you will knock down today?");
  const promptCategory = (typeof rawPrompt === 'object' && rawPrompt?.category)
    ? rawPrompt.category
    : 'Focus';

  const loadVaultCount = async () => {
    const list = await getJournalVaultEntries();
    setVaultCount(list.length);
  };

  useEffect(() => {
    loadVaultCount();
  }, [isVaultOpen]);

  // Handle Voice Recording Start
  const handleStartRecording = async () => {
    try {
      stopVoiceAudio();
      setIsPlayingAudio(false);
      setRecordDurationMs(0);
      setIsRecording(true);

      const res = await startVoiceRecording((status) => {
        setRecordDurationMs(status.durationMillis || 0);
      });

      if (!res.success) {
        setIsRecording(false);
        alert(res.error || 'Could not access microphone.');
      }
    } catch (err) {
      setIsRecording(false);
      alert('Error starting recording: ' + err.message);
    }
  };

  // Handle Voice Recording Stop & Synthesis
  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      const result = await stopVoiceRecording();

      if (result.success && result.uri) {
        setAudioUri(result.uri);
        setPlaybackTotalMs(result.durationMillis || 3000);
        await runSynthesis(result.uri, result.durationMillis, typedText);
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  // Synthesize (Voice audio, typed text, or combined)
  const runSynthesis = async (recAudioUri = audioUri, durationMs = recordDurationMs, currentText = typedText) => {
    setIsSynthesizing(true);
    try {
      const combinedInput = currentText ? currentText.trim() : `Reflection on prompt: "${promptText}"`;
      const distilled = await synthesizeVoiceWithGemini(
        combinedInput,
        geminiApiKey,
        'gemini-2.5-flash'
      );

      setSynthesis(distilled);

      const entry = {
        id: `journal_${Date.now()}`,
        timestamp: Date.now(),
        dateStr: new Date().toISOString().split('T')[0],
        displayDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: recAudioUri && currentText ? 'hybrid' : recAudioUri ? 'voice' : 'text',
        prompt: promptText,
        category: promptCategory,
        text: currentText,
        transcript: currentText,
        audioUri: recAudioUri,
        durationMillis: durationMs,
        synthesis: distilled
      };

      if (setVoiceJournal) {
        setVoiceJournal(entry);
      }

      await saveJournalVaultRecord(entry);
      await loadVaultCount();
    } catch (e) {
      console.error('Synthesis error:', e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Handle Playback Toggle
  const handleTogglePlayback = async () => {
    if (!audioUri) return;

    if (isPlayingAudio) {
      pauseVoiceAudio();
      setIsPlayingAudio(false);
    } else {
      stopVoiceAudio();
      setIsPlayingAudio(true);
      setPlaybackPosMs(0);

      await playVoiceAudio(audioUri, playbackTotalMs, (status) => {
        if (status.didJustFinish) {
          setIsPlayingAudio(false);
          setPlaybackPosMs(0);
        } else {
          setPlaybackPosMs(status.positionMillis || 0);
          setPlaybackTotalMs(status.durationMillis || playbackTotalMs);
        }
      });
    }
  };

  // Start a fresh reflection right now
  const handleStartFreshReflection = () => {
    stopVoiceAudio();
    setIsPlayingAudio(false);
    setAudioUri(null);
    setTypedText('');
    setSynthesis(null);
    setRecordDurationMs(0);
    setIsRecording(false);
    if (setVoiceJournal) setVoiceJournal(null);
    handleShufflePrompt();
  };

  const handleShufflePrompt = () => {
    setIsShuffling(true);
    setTimeout(() => setIsShuffling(false), 400);

    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * (voicePrompts?.length || 1));
    } while (nextIdx === currentPromptIndex && (voicePrompts?.length || 1) > 1);
    setCurrentPromptIndex(nextIdx);
  };

  // Handle Internalize & Advance: Commits entry safely into Vault and moves to next phase
  const handleAdvance = async () => {
    stopVoiceAudio();
    setIsPlayingAudio(false);

    const hasAnyContent = !!audioUri || typedText.trim().length > 0;

    if (hasAnyContent) {
      if (!synthesis) {
        await runSynthesis(audioUri, recordDurationMs, typedText);
      } else {
        const entry = {
          id: voiceJournal?.id || `journal_${Date.now()}`,
          timestamp: Date.now(),
          dateStr: new Date().toISOString().split('T')[0],
          displayDate: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          type: audioUri && typedText ? 'hybrid' : audioUri ? 'voice' : 'text',
          prompt: promptText,
          category: promptCategory,
          text: typedText,
          transcript: typedText,
          audioUri,
          durationMillis: recordDurationMs,
          synthesis
        };

        if (setVoiceJournal) {
          setVoiceJournal(entry);
        }

        await saveJournalVaultRecord(entry);
      }
    }

    if (onAdvance) {
      onAdvance();
    }
  };

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const hasContent = !!audioUri || typedText.trim().length > 0 || !!synthesis;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Phase Header Tracker */}
      <div className="w-full mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-400 tracking-wider">
            PHASE 03 OF 05
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVaultOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/70 text-[10px] font-mono font-bold text-amber-900 transition-colors"
            >
              <BookOpen className="w-3 h-3 text-amber-700" />
              <span>Vault ({vaultCount})</span>
            </button>
            <span className="text-xs font-bold text-amber-800">
              Voice & Text Clarity
            </span>
          </div>
        </div>
        <div className="w-full h-1 bg-stone-200/70 rounded-full overflow-hidden">
          <div className="h-full bg-amber-600 rounded-full w-3/5 transition-all duration-300" />
        </div>
      </div>

      {/* Main Journal Card */}
      <div className="w-full bg-white border border-stone-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 mb-6 shadow-sm space-y-5">
        {/* Morning Reflection Prompt Card */}
        <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 sm:p-5 relative transition-all">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold text-amber-900 uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200/60 border border-amber-300/60">
                PROMPT • {promptCategory.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                #{currentPromptIndex + 1}/{voicePrompts?.length || 120}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPromptBrowserOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:text-amber-950 bg-amber-100/70 hover:bg-amber-200/80 rounded-lg border border-amber-300/50 transition-all cursor-pointer shadow-2xs"
                title="Browse 120+ categorized prompts"
              >
                <Compass className="w-3 h-3 text-amber-700" />
                <span className="hidden sm:inline">Browse Prompts</span>
                <span className="sm:hidden">Library</span>
              </button>

              <button
                onClick={handleShufflePrompt}
                className="p-1.5 text-amber-800 hover:text-amber-950 hover:bg-amber-200/60 rounded-lg transition-colors cursor-pointer"
                title="Shuffle Prompt"
              >
                <Shuffle className={`w-3.5 h-3.5 transition-transform duration-300 ${isShuffling ? 'rotate-180 scale-110' : ''}`} />
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base text-amber-950 font-semibold leading-relaxed">
            "{promptText}"
          </p>
        </div>

        {/* Input Mode Selector Tabs */}
        <div className="flex items-center justify-center p-1 bg-stone-100/80 rounded-xl max-w-xs mx-auto">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'voice'
                ? 'bg-white text-amber-950 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-amber-700" />
            <span>Voice</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-white text-amber-950 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-amber-700" />
            <span>Written Note</span>
          </button>
        </div>

        {/* 1. Voice Mode */}
        {activeTab === 'voice' && (
          <div className="flex flex-col items-center py-2 space-y-4">
            {!audioUri ? (
              <div className="flex flex-col items-center space-y-3">
                {/* Large Pulsing Record Button */}
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105 animate-pulse'
                      : 'bg-amber-800 hover:bg-amber-900 text-white shadow-md shadow-amber-900/20 hover:scale-105'
                  }`}
                  title={isRecording ? 'Tap to Stop' : 'Tap to Speak'}
                >
                  {isRecording ? (
                    <Square className="w-8 h-8 fill-current" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>

                <div className="text-center">
                  <div className="font-mono text-sm font-bold text-stone-800">
                    {formatTime(recordDurationMs)}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {isRecording ? 'Listening to your morning thoughts...' : 'Tap mic to speak for 30–60s'}
                  </p>
                </div>
              </div>
            ) : (
              /* Recorded Audio Player */
              <div className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-stone-800">Voice Reflection Recorded</span>
                  </div>

                  <button
                    onClick={handleStartFreshReflection}
                    className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Delete & Record Fresh"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePlayback}
                    className="w-9 h-9 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0 shadow-xs hover:bg-amber-900 transition-colors cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-800 h-full rounded-full transition-all duration-150"
                        style={{
                          width: `${
                            isPlayingAudio && playbackTotalMs > 0
                              ? (playbackPosMs / playbackTotalMs) * 100
                              : 0
                          }%`
                        }}
                      />
                    </div>
                  </div>

                  <span className="text-xs font-mono text-stone-500 shrink-0">
                    {isPlayingAudio ? formatTime(playbackPosMs) : formatTime(playbackTotalMs)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Written Note Mode */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <textarea
              rows={4}
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder="Write your morning thoughts, intentions, or reflection here..."
              className="w-full p-4 rounded-2xl bg-stone-50/80 border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
              <span>{typedText.trim() ? `${typedText.trim().split(/\s+/).length} words` : '0 words'}</span>
              <button
                onClick={() => runSynthesis(audioUri, recordDurationMs, typedText)}
                disabled={isSynthesizing || !typedText.trim()}
                className="px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200/80 text-amber-900 font-bold transition-all disabled:opacity-40 cursor-pointer"
              >
                {isSynthesizing ? 'Distilling...' : 'Distill Insights ⚡'}
              </button>
            </div>
          </div>
        )}

        {/* Distillation Preview Cards */}
        {isSynthesizing && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-center gap-2 text-xs font-mono text-amber-800 animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
            <span>Distilling Core Focus & Next Action...</span>
          </div>
        )}

        {synthesis && !isSynthesizing && (
          <div className="space-y-3 pt-2 border-t border-stone-100">
            {/* Core Focus */}
            <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Target className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-[10px] font-mono font-extrabold text-amber-800 uppercase tracking-wider">
                  YOUR CORE FOCUS
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed">
                "{synthesis.manifestationAnchor}"
              </p>
            </div>

            {/* Next Step */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] font-mono font-bold text-stone-500 uppercase mb-0.5">
                  NEXT STEP
                </span>
                <p className="text-xs text-stone-800 font-medium leading-relaxed">
                  {synthesis.kineticAction}
                </p>
              </div>
            </div>

            {/* Mindset Check & Positive Reframe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-stone-50/80 border border-stone-100 rounded-xl p-3">
                <span className="block text-[9px] font-mono font-bold text-stone-400 uppercase mb-1">
                  MINDSET CHECK
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {synthesis.emotionalPulse}
                </p>
              </div>

              <div className="bg-stone-50/80 border border-stone-100 rounded-xl p-3">
                <span className="block text-[9px] font-mono font-bold text-stone-400 uppercase mb-1">
                  POSITIVE REFRAME
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {synthesis.opportunityReframe}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2.5">
        <button
          onClick={handleAdvance}
          className="w-full flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-950 text-white font-bold py-3.5 px-6 rounded-full shadow-md shadow-amber-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm cursor-pointer"
        >
          <span>{hasContent ? 'Internalize & Next' : 'Skip Voice & Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {hasContent && (
          <button
            onClick={handleStartFreshReflection}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start a Fresh Reflection</span>
          </button>
        )}
      </div>

      {/* Journal Vault Archive Modal */}
      <JournalVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />

      {/* Prompt Browser Modal (120+ Prompts) */}
      <PromptBrowserModal
        isOpen={isPromptBrowserOpen}
        onClose={() => setIsPromptBrowserOpen(false)}
        currentPromptIndex={currentPromptIndex}
        onSelectPrompt={(item, idx) => {
          setCurrentPromptIndex(idx);
        }}
      />
    </div>
  );
}
