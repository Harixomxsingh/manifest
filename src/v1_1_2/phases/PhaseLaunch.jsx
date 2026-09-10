import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Compass, CheckCheck, Shield, Mic, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ManifestSunLogo from '../../components/ManifestSunLogo';

export default function PhaseLaunch({ onResetToWelcome, onOpenVault }) {
  const {
    briefing,
    todayArticle,
    weatherData,
    voiceJournal
  } = useApp();

  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#D97706']
      });
    } catch (e) {}
  }, []);

  const anchor = briefing?.optimismAnchor || {
    identityReminder: 'I view every challenge today through an opportunistic and constructive lens.'
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
      const voiceAnchorText = voiceJournal?.synthesis?.manifestationAnchor
        ? `Your personal voice manifestation: ${voiceJournal.synthesis.manifestationAnchor}. `
        : '';
      const summaryText = `Good morning. Here is your morning dispatch. Identity anchor: ${anchor.identityReminder}. Mindset reading: ${todayArticle?.coreIdea || 'Focus on consistent systems'}. ${voiceAnchorText}Today's weather: ${weatherData?.highTemp || 24} degrees, ${weatherData?.weatherLabel || 'Clear Sky'}. Go forth with unshakeable focus and conquer your day.`;

      const utterance = new SpeechSynthesisUtterance(summaryText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeechPlaying(false);
      utterance.onerror = () => setIsSpeechPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeechPlaying(true);
    }
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Top Phase Header Tracker */}
      <div className="w-full mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-400 tracking-wider">
            PHASE 05 OF 05
          </span>
          <span className="text-xs font-bold text-amber-800">
            Launchpad Ready
          </span>
        </div>
        <div className="w-full h-1 bg-stone-200/70 rounded-full overflow-hidden">
          <div className="h-full bg-amber-600 rounded-full w-full transition-all duration-300" />
        </div>
      </div>

      {/* Triumphant Glowing Emblem */}
      <div className="mb-4 flex items-center justify-center">
        <ManifestSunLogo size={64} interactive={true} />
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2 tracking-tight">
        Ritual Complete
      </h2>
      <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed mb-6 px-4">
        Anchored in identity, nourished in mindset, and crystalline in intention. Conquer your day.
      </p>

      {/* Unified Summary Slate */}
      <div className="w-full bg-white border border-stone-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-6 shadow-sm text-left space-y-3">
        {/* 1. Identity Anchor */}
        <div className="flex items-start gap-3 bg-amber-50/70 border border-amber-200/60 rounded-xl p-3.5">
          <Shield className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="block text-[10px] font-mono font-extrabold text-amber-800 tracking-wider mb-1">
              IDENTITY ANCHOR
            </span>
            <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed">
              "{anchor.identityReminder}"
            </p>
          </div>
        </div>

        {/* 2. Voice Anchor (if spoken) */}
        {voiceJournal?.synthesis?.manifestationAnchor && (
          <div className="flex items-start gap-3 bg-amber-50/90 border border-amber-300/80 rounded-xl p-3.5">
            <Mic className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="block text-[10px] font-mono font-extrabold text-amber-700 tracking-wider mb-1">
                SPOKEN VOICE ANCHOR
              </span>
              <p className="text-xs sm:text-sm font-semibold text-amber-900 leading-relaxed">
                "{voiceJournal.synthesis.manifestationAnchor}"
              </p>
            </div>
          </div>
        )}

        {/* 3. Mindset & Atmosphere 2-Col Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-stone-50/90 rounded-xl p-3 border border-stone-100">
            <span className="block text-[10px] font-mono font-bold text-stone-400 tracking-wider mb-1">
              MINDSET
            </span>
            <p className="text-xs font-bold text-stone-800 truncate">
              {todayArticle?.title || 'Atomic Habits Axiom'}
            </p>
          </div>

          <div className="bg-stone-50/90 rounded-xl p-3 border border-stone-100">
            <span className="block text-[10px] font-mono font-bold text-stone-400 tracking-wider mb-1">
              ATMOSPHERE
            </span>
            <p className="text-xs font-bold text-stone-800 truncate">
              {weatherData ? `${weatherData.highTemp}°C • ${weatherData.weatherLabel}` : 'Optimal Day'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2.5">
        {/* Audio Dispatch Button */}
        <button
          onClick={toggleAudioReadout}
          className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-full border transition-all text-xs sm:text-sm ${
            isSpeechPlaying
              ? 'bg-amber-900 text-white border-amber-900 shadow-md'
              : 'bg-amber-50 hover:bg-amber-100/80 text-amber-900 border-amber-200/80'
          }`}
        >
          {isSpeechPlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Mute Dispatch</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Listen to Audio Summary</span>
            </>
          )}
        </button>

        {/* Vault & Restart Ritual Action Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {onOpenVault && (
            <button
              onClick={onOpenVault}
              className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-semibold py-2.5 px-4 rounded-full border border-stone-200/70 transition-colors text-xs"
            >
              <Mic className="w-3.5 h-3.5 text-amber-700" />
              <span>Browse Journal Vault</span>
            </button>
          )}

          <button
            onClick={onResetToWelcome}
            className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200/80 text-stone-600 font-semibold py-2.5 px-4 rounded-full border border-stone-200/60 transition-colors text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>Restart Ritual</span>
          </button>
        </div>
      </div>
    </div>
  );
}
