import React, { useState, useEffect } from 'react';
import { Settings, Download, Shuffle, Volume2, VolumeX, BookOpen, Flame, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ManifestSunLogo from '../../components/ManifestSunLogo';
import { getStreakData } from '../../services/streakService';

export default function Header({ onOpenVault, onOpenStreak, onOpenAbout }) {
  const {
    isAudioPlaying,
    toggleAudioReadout,
    setIsSettingsOpen,
    setIsAboutOpen,
    randomizeAllDailyContent,
    shuffleDailyQuote
  } = useApp();

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [streakData, setStreakData] = useState(() => getStreakData());

  useEffect(() => {
    setStreakData(getStreakData());
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[#FDF9F1]/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_1px_8px_rgba(180,83,9,0.03)]">
      <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left: Brand & Animated Sun Logo + Prominent Streak Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <ManifestSunLogo size={32} interactive={true} />

          <div className="flex items-baseline gap-2">
            <span
              className="text-lg sm:text-xl tracking-tight text-amber-950 font-bold"
            >
              Manifest
            </span>
          </div>

          {/* First Priority: Ultra-Prominent Eye-Catching Streak Badge */}
          {onOpenStreak && (
            <button
              onClick={onOpenStreak}
              className="group flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/25 to-yellow-400/15 hover:from-amber-500/25 hover:to-yellow-400/25 border-2 border-amber-400/80 hover:border-amber-500 text-amber-950 text-xs sm:text-sm font-mono font-extrabold transition-all duration-300 shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:shadow-[0_0_18px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 cursor-pointer ml-1"
              title="Daily Streak & Focus Heatmap — Click to view calendar"
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute -inset-1 rounded-full bg-amber-400/50 animate-ping opacity-75" />
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 fill-amber-500 relative z-10 transition-transform group-hover:scale-110" />
              </div>
              <span className="font-mono font-black text-amber-950 tracking-tight">
                {streakData.currentStreak}
                <span className="hidden sm:inline">D</span>
              </span>
              <span className="hidden md:inline font-sans font-bold text-amber-900 text-xs">
                STREAK
              </span>
              <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-200/80 text-[10px] font-sans font-bold text-amber-900 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE
              </span>
            </button>
          )}

          <span className="hidden lg:inline-block w-1 h-1 rounded-full bg-stone-300 ml-1" />

          <span className="hidden lg:inline-block text-xs text-stone-500 font-mono">
            {currentDate} • {currentTime}
          </span>
        </div>

        {/* Right: Actions (Clean & Decluttered for Mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Daily Shuffle Button (Always available, compact on mobile) */}
          <button
            onClick={() => {
              if (shuffleDailyQuote) shuffleDailyQuote();
              else if (randomizeAllDailyContent) randomizeAllDailyContent();
            }}
            title="Shuffle quote and reflection"
            className="flex items-center justify-center p-2 sm:px-3 sm:py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/70 text-amber-900 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline ml-1.5">Shuffle</span>
          </button>

          {/* Journal Vault Trigger (Visible on tablet & desktop, accessible via drawer/cards on mobile) */}
          {onOpenVault && (
            <button
              onClick={onOpenVault}
              title="Journal Vault & Archive"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 border border-stone-200/80 text-stone-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              <span>Vault</span>
            </button>
          )}

          {/* PWA Install Button (Desktop/Tablet) */}
          {isInstallable && (
            <button
              onClick={handleInstallPWA}
              title="Install Manifest as App"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-800 text-white text-xs font-bold hover:bg-amber-900 shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {/* Audio toggle button if available (Visible on tablet/desktop) */}
          {toggleAudioReadout && (
            <button
              onClick={toggleAudioReadout}
              title={isAudioPlaying ? 'Mute' : 'Audio Dispatch'}
              className={`hidden sm:flex p-2 rounded-full border transition-all ${
                isAudioPlaying
                  ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900 hover:border-amber-300'
              }`}
            >
              {isAudioPlaying ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-700" />
              )}
            </button>
          )}

          {/* About Manifest Trigger (Purpose & Benefits) */}
          <button
            onClick={() => {
              if (onOpenAbout) onOpenAbout();
              else if (setIsAboutOpen) setIsAboutOpen(true);
            }}
            title="About Manifest • Purpose, Philosophy & Transformative Benefits"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-amber-300/80 text-amber-950 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">About</span>
          </button>

          {/* Settings Trigger (Always clean and accessible) */}
          <button
            onClick={() => setIsSettingsOpen?.(true)}
            title="Settings"
            className="p-2 rounded-full bg-amber-800 hover:bg-amber-900 text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
