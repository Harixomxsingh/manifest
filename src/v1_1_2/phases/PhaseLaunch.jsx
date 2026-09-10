import React, { useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Mic,
  RotateCcw,
  Clock,
  ArrowRight,
  BookOpen,
  Sun,
  Shield,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ManifestSunLogo from '../../components/ManifestSunLogo';
import { getStreakData, recordDailyCompletion } from '../../services/streakService';
import FocusTimerModal from '../components/FocusTimerModal';

export default function PhaseLaunch({ onResetToWelcome, onOpenVault }) {
  const {
    briefing,
    todayArticle,
    weatherData,
    voiceJournal
  } = useApp();

  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [streak, setStreak] = useState(() => getStreakData());

  useEffect(() => {
    const updated = recordDailyCompletion();
    setStreak(updated);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#D97706']
      });
    } catch (e) {}
  }, []);

  const anchor = briefing?.optimismAnchor || {
    identityReminder: 'I bring pride and world-class craftsmanship to every line of work today.'
  };

  const mainGoal = voiceJournal?.synthesis?.manifestationAnchor ||
    voiceJournal?.text ||
    null;

  const weatherLabel = weatherData ? `${weatherData.highTemp}°${weatherData.unit || 'C'} • ${weatherData.weatherLabel}` : 'Optimal Day';
  const weatherTip = weatherData?.tactics?.clothingAdvice?.split('.')[0] || weatherData?.tactics?.commuteOrOutdoorGuidance?.split('.')[0] || 'Clear day ahead';

  const handleCopySummary = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const formatted = `☀️ MORNING MANIFESTATION — ${today}
🔥 Streak: ${streak.currentStreak} Days

• Mindset: "${anchor.identityReminder}"
${mainGoal ? `• Focus Goal: "${mainGoal}"\n` : ''}• Reading: ${todayArticle?.title || 'Atomic Habits'}
• Atmosphere: ${weatherLabel} (${weatherTip})

Ready to conquer today! 🚀`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAudioReadout = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeechPlaying) {
      window.speechSynthesis.cancel();
      setIsSpeechPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const voiceText = mainGoal ? `Your focus goal: ${mainGoal}. ` : '';
      const summaryText = `Good morning. You are on a ${streak.currentStreak}-day streak. Mindset anchor: ${anchor.identityReminder}. ${voiceText}Reading: ${todayArticle?.title || 'Atomic Habits'}. Weather is ${weatherLabel}. Have a productive and fulfilling day.`;

      const utterance = new SpeechSynthesisUtterance(summaryText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeechPlaying(false);
      utterance.onerror = () => setIsSpeechPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeechPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center text-center animate-fade-in max-w-lg mx-auto">
      {/* Top Phase Header Tracker */}
      <div className="w-full mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-400 tracking-wider">
            PHASE 05 OF 05
          </span>
          <span className="text-xs font-bold text-amber-800">
            Final Summary
          </span>
        </div>
        <div className="w-full h-1 bg-stone-200/70 rounded-full overflow-hidden">
          <div className="h-full bg-amber-600 rounded-full w-full transition-all duration-300" />
        </div>
      </div>

      {/* Clean Emblem & Title */}
      <div className="mb-3 flex items-center justify-center">
        <ManifestSunLogo size={58} interactive={true} />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1 tracking-tight">
        You're All Set
      </h2>

      {/* Minimal Streak Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-mono font-bold text-amber-900 mb-6 shadow-2xs">
        <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
        <span>{streak.currentStreak}-DAY STREAK</span>
        <span className="text-stone-300">•</span>
        <span className="text-stone-500 font-sans font-medium text-[11px]">Ready to conquer today</span>
      </div>

      {/* Pure, Minimal Monolithic Card (Zero Clutter) */}
      <div className="w-full bg-white border border-stone-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-5 shadow-sm text-left relative">
        {/* Top Minimal Action Row */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
          <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
            TODAY'S BLUEPRINT
          </span>
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-amber-900 transition-colors cursor-pointer"
            title="Copy summary"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Primary Mindset Anchor */}
        <div className="mb-4">
          <p className="text-base sm:text-lg font-bold text-amber-950 leading-snug tracking-tight">
            "{anchor.identityReminder}"
          </p>
        </div>

        {/* Spoken Focus Goal (if recorded) */}
        {mainGoal && (
          <div className="flex items-start gap-2 pt-3 border-t border-stone-100 text-xs text-stone-700 leading-relaxed">
            <Target className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong className="text-stone-900 font-semibold">Today's Focus:</strong> "{mainGoal}"
            </p>
          </div>
        )}

        {/* 2-Column Minimal Key Strip */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 mt-3 text-xs">
          <div>
            <span className="block text-[9px] font-mono font-bold text-stone-400 uppercase mb-0.5">
              READING
            </span>
            <span className="font-bold text-stone-800 truncate block">
              {todayArticle?.title || 'Atomic Habits'}
            </span>
          </div>

          <div>
            <span className="block text-[9px] font-mono font-bold text-stone-400 uppercase mb-0.5">
              WEATHER
            </span>
            <span className="font-bold text-stone-800 truncate block">
              {weatherLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Super Minimal & Balanced) */}
      <div className="w-full space-y-2.5">
        {/* Primary Focus Button */}
        <button
          onClick={() => setIsFocusTimerOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-950 text-white font-bold py-3.5 px-6 rounded-full shadow-md shadow-amber-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm cursor-pointer"
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>Start 25m Focus Block</span>
          <ArrowRight className="w-4 h-4 text-amber-300 ml-0.5" />
        </button>

        {/* Audio Briefing Button */}
        <button
          onClick={toggleAudioReadout}
          className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 px-5 rounded-full border transition-all text-xs cursor-pointer ${
            isSpeechPlaying
              ? 'bg-amber-100/80 text-amber-950 border-amber-300 shadow-2xs'
              : 'bg-stone-50 hover:bg-stone-100/80 text-stone-700 border-stone-200/80'
          }`}
        >
          {isSpeechPlaying ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-amber-800" />
              <span className="font-bold">Stop Audio Briefing</span>
              <div className="flex items-center gap-0.5 ml-1">
                <span className="w-0.5 h-2.5 bg-amber-700 rounded-full animate-pulse" />
                <span className="w-0.5 h-3.5 bg-amber-700 rounded-full animate-bounce" />
                <span className="w-0.5 h-2 bg-amber-700 rounded-full animate-pulse" />
              </div>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Listen to Audio Summary</span>
            </>
          )}
        </button>

        {/* Subtle Bottom Link Row */}
        <div className="flex items-center justify-center gap-4 pt-2 text-xs font-medium text-stone-500">
          {onOpenVault && (
            <button
              onClick={onOpenVault}
              className="hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Mic className="w-3 h-3 text-amber-700" />
              <span>Journal Vault</span>
            </button>
          )}

          <span className="text-stone-300">•</span>

          <button
            onClick={onResetToWelcome}
            className="hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3 text-stone-400" />
            <span>Restart Ritual</span>
          </button>
        </div>
      </div>

      {/* 25-Minute Focus Session Modal */}
      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        initialMinutes={25}
        currentFocusText={mainGoal}
      />
    </div>
  );
}
