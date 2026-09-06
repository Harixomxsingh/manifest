import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings, Download, Layers, User, BookOpen, Shuffle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Header({ onOpenSettings }) {
  const {
    isAudioPlaying,
    toggleAudioReadout,
    setIsSettingsOpen,
    setIsOnboardingOpen,
    currentVersion,
    setCurrentVersion,
    randomizeAllDailyContent
  } = useApp();

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
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
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[#FDF9F1]/95 backdrop-blur-md border-b border-[#ECE8E0]/80 shadow-[0_1px_8px_rgba(180,83,9,0.03)]">
      <div className="h-16 w-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Left: Brand & Rotating Sunburst */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FEF3C7] border border-[#FDE68A]/80 flex items-center justify-center text-[#B45309] shadow-xs shrink-0">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#D97706] animate-[spin_40s_linear_infinite]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" fill="#d97706" r="4.2" stroke="none" />
              <circle cx="12" cy="12" fill="none" r="7" stroke="#b45309" strokeDasharray="2 2" strokeWidth="1" />
              <path
                d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <span
            className="text-base sm:text-xl lg:text-2xl tracking-tight text-[#903F00] font-normal truncate"
            style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
          >
            <span className="inline sm:hidden">Manifest</span>
            <span className="hidden sm:inline">Morning Manifestation</span>
          </span>

          <span className="hidden lg:inline-block w-1.5 h-1.5 rounded-full bg-[#DDC1B3]" />

          <span className="hidden lg:inline-block text-xs text-[#8C827A] font-mono tracking-widest uppercase truncate max-w-[260px] xl:max-w-none">
            {currentDate} • {currentTime}
          </span>
        </div>

        {/* Right: Touch-Optimized Actions for Mobile, Tablet, and Desktop */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
          {/* Protocol / Manual Trigger */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            title="Read Executive Morning Protocol Manual"
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1 rounded-full bg-[#F7F3EB] border border-[#ECE8E0] text-[11px] font-mono text-[#54524F] hover:text-[#1C1C17] hover:border-[#FDE68A] transition-all touch-manipulation"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Protocol</span>
          </button>

          {/* Randomize Day / Shuffle Daily Content Button */}
          <button
            onClick={(e) => randomizeAllDailyContent(e)}
            title="Randomize & Shuffle Day (Instantly loads a fresh James Clear Article + fresh Identity Manifesto)"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] hover:from-[#FDE68A] hover:to-[#F59E0B] border border-[#D97706]/40 text-[#903F00] text-xs font-semibold shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all group touch-manipulation"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#D97706] transition-transform group-hover:rotate-45" />
            <span className="font-bold text-[11px] sm:text-xs">
              <span className="inline sm:hidden">Shuffle</span>
              <span className="hidden sm:inline">Randomize</span>
            </span>
          </button>

          {/* Version Switcher Pill (Tablet & Desktop) */}
          <button
            onClick={() => setCurrentVersion(currentVersion === 'v1.1.1' ? 'v1.0' : 'v1.1.1')}
            title="Toggle between Dawn Manifest and Classic Obsidian"
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F3EB] border border-[#ECE8E0] text-[11px] font-mono text-[#54524F] hover:text-[#1C1C17] hover:border-[#FDE68A] transition-all"
          >
            <Layers className="w-3 h-3 text-[#D97706]" />
            <span>Dawn ⇄ v1.0</span>
          </button>

          {/* PWA Install Button */}
          {isInstallable && (
            <button
              onClick={handleInstallPWA}
              title="Install App to Home Screen"
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#B45309] text-white text-xs font-medium hover:bg-[#903F00] shadow-sm transition-all touch-manipulation"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}

          {/* Ambient Chime / Audio Readout Pill */}
          <button
            onClick={toggleAudioReadout}
            title={isAudioPlaying ? 'Pause Audio Readout' : 'Play Ambient Chime / Audio Dispatch'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border transition-all touch-manipulation ${
              isAudioPlaying
                ? 'bg-[#B45309] text-white border-[#B45309] shadow-sm font-medium'
                : 'bg-[#F7F3EB] border-[#ECE8E0] text-[#54524F] hover:text-[#1C1C17] hover:border-[#FDE68A]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#D97706]">
              {isAudioPlaying ? 'volume_off' : 'graphic_eq'}
            </span>
            <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-wider text-[#54524F]">
              {isAudioPlaying ? 'Mute' : 'Chime'}
            </span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Settings & Integrations"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#D97706] to-[#B45309] flex items-center justify-center text-white shadow-sm hover:brightness-110 active:scale-95 transition-all touch-manipulation"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
