import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Volume2, VolumeX, Settings, Download, Compass, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const {
    refreshDispatch,
    isGenerating,
    isAudioPlaying,
    toggleAudioReadout,
    setIsSettingsOpen,
    settings,
    isGoogleLinked,
    currentVersion,
    setCurrentVersion
  } = useApp();

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Live Clock & Date
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

  // PWA Install Prompt Listener
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#07090E]/80 border-b border-white/[0.08] px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Date */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Compass className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Morning Manifestation
              </h1>
              <button
                onClick={() => setCurrentVersion(currentVersion === 'v1.1.1' ? 'v1.0' : 'v1.1.1')}
                title="Switch to v1.1.1 Editorial Horizon"
                className="px-2 py-0.5 text-[10px] font-mono-code font-bold rounded-full bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-slate-700 transition-all"
              >
                v1.0 Classic ⇄ v1.1.1
              </button>
            </div>
            <p className="text-xs text-slate-400 font-mono-code flex items-center gap-1.5">
              <span>{currentDate}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400/90 font-medium">{currentTime}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Install Button */}
          {isInstallable && (
            <button
              onClick={handleInstallPWA}
              title="Install Morning Manifestation App"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Audio TTS Readout Button */}
          <button
            onClick={toggleAudioReadout}
            title={isAudioPlaying ? 'Stop Audio Readout' : 'Listen to Morning Briefing (Audio)'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isAudioPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold shadow-lg shadow-amber-500/25 animate-soft-pulse'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-white/[0.08] hover:border-white/[0.15]'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Audio Mode</span>
              </>
            )}
          </button>

          {/* Refresh / Re-synthesize Button */}
          <button
            onClick={() => refreshDispatch()}
            disabled={isGenerating}
            title="Refresh & Re-synthesize Morning Dispatch"
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/[0.15] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-300 ${isGenerating ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Configure Gemini Key & Google OAuth"
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/[0.15] transition-all relative"
          >
            <Settings className="w-4 h-4 text-slate-300" />
            {!settings.geminiApiKey && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
