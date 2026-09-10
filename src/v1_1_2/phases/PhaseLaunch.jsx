import React, { useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Flame,
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  RotateCcw,
  Target,
  Shield,
  BookOpen,
  Sun,
  CloudRain,
  Zap,
  ArrowRight,
  Share2,
  Clock
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

  // Record daily streak & trigger celebration confetti on arrival
  useEffect(() => {
    const updated = recordDailyCompletion();
    setStreak(updated);

    try {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#D97706', '#EC4899']
      });
    } catch (e) {}
  }, []);

  const anchor = briefing?.optimismAnchor || {
    identityReminder: 'I bring pride and world-class craftsmanship to every line of work today.'
  };

  const mainGoal = voiceJournal?.synthesis?.manifestationAnchor ||
    voiceJournal?.text ||
    "Focus on knocking down your single highest-impact priority today.";

  const nextStep = voiceJournal?.synthesis?.kineticAction ||
    "Take the first 5 minutes to clear your workspace and begin deep work.";

  const weatherLabel = weatherData ? `${weatherData.highTemp}°${weatherData.unit || 'C'} • ${weatherData.weatherLabel}` : 'Optimal Day';
  const weatherTip = weatherData?.tactics?.clothingAdvice || weatherData?.tactics?.commuteOrOutdoorGuidance || 'Clear morning ahead.';

  // 1-Click Copy formatted summary for Notes/Slack/Notion
  const handleCopySummary = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const formatted = `☀️ MORNING ACTION PLAN — ${today}
🔥 Streak: ${streak.currentStreak} Days

💡 Mindset: "${anchor.identityReminder}"
⚡ Main Focus: "${mainGoal}"
🎯 Next Step: ${nextStep}
📖 Reading: ${todayArticle?.title || 'Atomic Habits Axiom'} ("${todayArticle?.coreIdea || 'Small habits lead to massive results'}")
🌤️ Weather: ${weatherLabel} (${weatherTip})

Ready to conquer today! 🚀`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Friendly Audio Summary Readout
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
      const voiceText = voiceJournal?.synthesis?.manifestationAnchor
        ? `Your top focus: ${voiceJournal.synthesis.manifestationAnchor}. `
        : '';
      const summaryText = `Good morning! You're on a ${streak.currentStreak}-day streak. Today's mindset: ${anchor.identityReminder}. ${voiceText}Quick reading takeaway from ${todayArticle?.title || 'Atomic Habits'}: ${todayArticle?.coreIdea || 'Take consistent small steps'}. Weather is ${weatherLabel}. Have a productive and joyful day!`;

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
    <div className="w-full flex flex-col items-center text-center animate-fade-in">
      {/* Top Phase Header Tracker */}
      <div className="w-full mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-400 tracking-wider">
            PHASE 05 OF 05
          </span>
          <span className="text-xs font-bold text-amber-800">
            Ready to Go! 🚀
          </span>
        </div>
        <div className="w-full h-1 bg-stone-200/70 rounded-full overflow-hidden">
          <div className="h-full bg-amber-600 rounded-full w-full transition-all duration-300" />
        </div>
      </div>

      {/* Streak & Momentum Capsule */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-mono font-bold text-amber-900 shadow-2xs mb-4 animate-bounce-subtle">
        <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
        <span>{streak.currentStreak}-DAY STREAK</span>
        <span className="text-amber-400">•</span>
        <span className="text-stone-600 font-sans font-medium text-[11px]">Keep the momentum going!</span>
      </div>

      {/* Main Solar Logo */}
      <div className="mb-3 flex items-center justify-center">
        <ManifestSunLogo size={68} interactive={true} />
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1.5 tracking-tight">
        You're All Set!
      </h2>
      <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed mb-6 px-4">
        Your morning mind is clear, focused, and ready. Let's make today count.
      </p>

      {/* Today's Action Plan Card */}
      <div className="w-full bg-white border border-stone-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 mb-6 shadow-sm text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-mono font-extrabold text-amber-900 uppercase tracking-wider">
              TODAY'S ACTION PLAN
            </span>
          </div>
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100/90 border border-amber-200 text-xs font-bold text-amber-900 transition-all cursor-pointer shadow-2xs"
            title="Copy action plan to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-700" />
                <span>Copy Plan</span>
              </>
            )}
          </button>
        </div>

        {/* 1. Today's Mindset Anchor */}
        <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[10px] font-mono font-extrabold text-amber-800 uppercase tracking-wider">
              TODAY'S MINDSET
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed">
            "{anchor.identityReminder}"
          </p>
        </div>

        {/* 2. Top Priority / Goal */}
        <div className="bg-stone-50/90 border border-stone-200/80 rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[10px] font-mono font-extrabold text-stone-600 uppercase tracking-wider">
              MAIN FOCUS & GOAL
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-stone-900 leading-relaxed">
            "{mainGoal}"
          </p>
          {nextStep && (
            <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-stone-200/60 text-xs text-stone-600">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Next Step:</strong> {nextStep}</span>
            </div>
          )}
        </div>

        {/* 3. Quick Reading & Weather Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Reading Card */}
          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-100">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3 h-3 text-amber-700" />
              <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                TODAY'S READ
              </span>
            </div>
            <p className="text-xs font-bold text-stone-800 truncate">
              {todayArticle?.title || 'Atomic Habits Axiom'}
            </p>
            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
              {todayArticle?.coreIdea || 'Small habits build compounding momentum.'}
            </p>
          </div>

          {/* Weather Card */}
          <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Sun className="w-3 h-3 text-amber-600" />
              <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                ATMOSPHERE
              </span>
            </div>
            <p className="text-xs font-bold text-stone-800 truncate">
              {weatherLabel}
            </p>
            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
              {weatherTip}
            </p>
          </div>
        </div>
      </div>

      {/* High-Impact Action Buttons */}
      <div className="w-full space-y-3">
        {/* Primary High-Energy Focus Button */}
        <button
          onClick={() => setIsFocusTimerOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-950 text-white font-bold py-4 px-6 rounded-full shadow-lg shadow-amber-900/15 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm sm:text-base cursor-pointer"
        >
          <Clock className="w-5 h-5 text-amber-300" />
          <span>Start 25m Focus Block</span>
          <ArrowRight className="w-4 h-4 ml-1 text-amber-300" />
        </button>

        {/* Audio Briefing Button */}
        <button
          onClick={toggleAudioReadout}
          className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-full border transition-all text-xs sm:text-sm cursor-pointer ${
            isSpeechPlaying
              ? 'bg-amber-800 text-white border-amber-800 shadow-md'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200'
          }`}
        >
          {isSpeechPlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Stop Audio Briefing</span>
              {/* Animated sound wave bars */}
              <div className="flex items-center gap-0.5 ml-1">
                <span className="w-0.5 h-3 bg-white rounded-full animate-pulse" />
                <span className="w-0.5 h-4 bg-white rounded-full animate-bounce" />
                <span className="w-0.5 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Listen to Audio Summary</span>
            </>
          )}
        </button>

        {/* Secondary Action Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {onOpenVault && (
            <button
              onClick={onOpenVault}
              className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-semibold py-2.5 px-4 rounded-full border border-stone-200/70 transition-colors text-xs cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-amber-700" />
              <span>Past Journal Vault</span>
            </button>
          )}

          <button
            onClick={onResetToWelcome}
            className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200/80 text-stone-600 font-semibold py-2.5 px-4 rounded-full border border-stone-200/60 transition-colors text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>Restart Morning Ritual</span>
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
