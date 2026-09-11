import React, { useState } from 'react';
import { X, Key, Shield, Globe, Cpu, RefreshCw, LogIn, LogOut, ExternalLink, Check, Trash2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { POPULAR_CITIES } from '../services/weatherService';

export default function SettingsModal() {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    isAboutOpen,
    setIsAboutOpen,
    settings,
    setSettings,
    isGoogleLinked,
    connectGoogleAccount,
    disconnectGoogleAccount,
    refreshDispatch,
    hideOnboarding,
    setHideOnboarding,
    setIsOnboardingOpen,
    simulatedOffsetDays,
    simulateDateOffset,
    activeDateKey
  } = useApp();

  const [formData, setFormData] = useState({
    geminiApiKey: settings.geminiApiKey || '',
    geminiModel: settings.geminiModel || 'gemini-2.5-flash',
    googleClientId: settings.googleClientId || '',
    isDemoMode: settings.isDemoMode,
    isFahrenheit: settings.isFahrenheit,
    cityMode: settings.cityMode || 'auto',
    selectedCityName: settings.customLocation?.name || 'San Francisco, CA'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    let customLocation = settings.customLocation;
    if (formData.cityMode !== 'auto') {
      const matched = POPULAR_CITIES.find((c) => c.name === formData.selectedCityName);
      if (matched) {
        customLocation = { name: matched.name, lat: matched.lat, lon: matched.lon };
      }
    }

    setSettings((prev) => ({
      ...prev,
      geminiApiKey: formData.geminiApiKey.trim(),
      geminiModel: formData.geminiModel,
      googleClientId: formData.googleClientId.trim(),
      isDemoMode: formData.isDemoMode,
      isFahrenheit: formData.isFahrenheit,
      userSelectedFahrenheit: formData.isFahrenheit,
      cityMode: formData.cityMode,
      customLocation
    }));

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
      refreshDispatch();
    }, 600);
  };

  const handleClearCache = () => {
    if (confirm('Clear today’s cached briefing and reset state?')) {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.removeItem(`manifest_cached_dispatch_${todayStr}`);
      localStorage.removeItem('manifest_jc_daily_selection');
      refreshDispatch();
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl bg-[#0F1420] border border-white/[0.12] shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Dispatch System Settings
              </h2>
              <p className="text-xs text-slate-400">
                Configure Bring-Your-Own-Key (BYOK) and integrations
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-6 text-sm">
          {/* 1. Gemini API Key Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono-code">
                <Cpu className="w-3.5 h-3.5" />
                <span>Google Gemini API Key (BYOK)</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-medium"
              >
                Get Free API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="password"
              placeholder="AIzaSy..."
              value={formData.geminiApiKey}
              onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.1] focus:border-amber-400 text-white placeholder-slate-500 font-mono-code text-xs outline-none transition-all"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your key is stored only locally in your browser (<code className="text-slate-300 font-mono-code">localStorage</code>). 100% client-side execution at $0 cost on the free tier. If left empty, the app runs on the built-in intelligent fallback engine.
            </p>

            {/* Model Selector */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-slate-400 font-mono-code">Model:</span>
              {['gemini-2.5-flash', 'gemini-1.5-flash'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFormData({ ...formData, geminiModel: m })}
                  className={`px-3 py-1 text-xs rounded-lg border font-mono-code transition-all ${
                    formData.geminiModel === m
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-white/[0.06] hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/[0.06]" />

          {/* 2. Google Identity OAuth Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 font-mono-code">
                <Shield className="w-3.5 h-3.5" />
                <span>Google OAuth Client ID (Optional)</span>
              </label>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-300 hover:underline flex items-center gap-1 font-medium"
              >
                Google Cloud Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="text"
              placeholder="e.g. 123456789-xxxx.apps.googleusercontent.com"
              value={formData.googleClientId}
              onChange={(e) => setFormData({ ...formData, googleClientId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.1] focus:border-indigo-400 text-white placeholder-slate-500 font-mono-code text-xs outline-none transition-all"
            />
            
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">OAuth Status:</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                    isGoogleLinked
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isGoogleLinked ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              {isGoogleLinked ? (
                <button
                  type="button"
                  onClick={disconnectGoogleAccount}
                  className="px-3 py-1 text-xs rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" /> Disconnect
                </button>
              ) : (
                <button
                  type="button"
                  onClick={connectGoogleAccount}
                  className="px-3 py-1 text-xs rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" /> Connect Google Account
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-white/[0.06]" />

          {/* 3. Demo Mode Toggle & Weather Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Demo Mode Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Demo Mode</div>
                <div className="text-[11px] text-slate-400">Use realistic mock data</div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isDemoMode: !formData.isDemoMode })}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                  formData.isDemoMode ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    formData.isDemoMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Temperature Units */}
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Temperature Unit</div>
                <div className="text-[11px] text-slate-400">Display unit for weather</div>
              </div>
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isFahrenheit: true })}
                  className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                    formData.isFahrenheit ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  °F
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isFahrenheit: false })}
                  className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                    !formData.isFahrenheit ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  °C
                </button>
              </div>
            </div>
          </div>

          {/* Location Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono-code">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Weather Location Source</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, cityMode: 'auto' })}
                className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                  formData.cityMode === 'auto'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                    : 'bg-slate-900 text-slate-400 border-white/[0.06]'
                }`}
              >
                📍 Auto Geolocation (GPS)
              </button>

              <select
                value={formData.selectedCityName}
                onChange={(e) =>
                  setFormData({ ...formData, cityMode: 'custom', selectedCityName: e.target.value })
                }
                className={`px-3 py-1.5 text-xs rounded-xl bg-slate-900 border text-slate-300 outline-none ${
                  formData.cityMode === 'custom'
                    ? 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10'
                    : 'border-white/[0.06]'
                }`}
              >
                {POPULAR_CITIES.map((c) => (
                  <option key={c.name} value={c.name} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Daily Rotation & Date Simulation Engine */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span>📅 Automatic Daily Rotation</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Active Date: <strong className="text-white font-mono">{activeDateKey}</strong> ({simulatedOffsetDays === 0 ? 'Today (Live)' : `Simulated +${simulatedOffsetDays}d`})
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                ● Auto-Midnight Active
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              Each day automatically pulls a fresh James Clear article (from 9 categories), a new identity manifesto, and updated atmospheric weather with 90-day anti-repetition memory.
            </div>

            <div className="pt-1 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => simulateDateOffset(0)}
                className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                  simulatedOffsetDays === 0
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-white/[0.08] hover:bg-slate-800'
                }`}
              >
                Today (Live)
              </button>

              <button
                type="button"
                onClick={() => simulateDateOffset(1)}
                className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                  simulatedOffsetDays === 1
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-white/[0.08] hover:bg-slate-800'
                }`}
              >
                Tomorrow (+1 Day)
              </button>

              <button
                type="button"
                onClick={() => simulateDateOffset(2)}
                className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                  simulatedOffsetDays === 2
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-white/[0.08] hover:bg-slate-800'
                }`}
              >
                Day After (+2 Days)
              </button>

              <button
                type="button"
                onClick={() => simulateDateOffset(7)}
                className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                  simulatedOffsetDays === 7
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-white/[0.08] hover:bg-slate-800'
                }`}
              >
                Next Week (+7 Days)
              </button>
            </div>
          </div>

          {/* 5. Onboarding Protocol Settings */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/[0.08] flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-white">Orientation Manual</div>
              <div className="text-[11px] text-slate-400">Show Protocol guide automatically on startup</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsOnboardingOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700 text-xs font-mono border border-amber-500/30"
              >
                View Now
              </button>
              <button
                type="button"
                onClick={() => setHideOnboarding(!hideOnboarding)}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                  !hideOnboarding ? 'bg-amber-500' : 'bg-slate-700'
                }`}
                title="Toggle orientation guide on startup"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    !hideOnboarding ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 6. About Manifest Philosophy & Benefits */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>About Manifest & Purpose</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                Learn why Manifest exists, the two core pillars & daily human benefits.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSettingsOpen(false);
                setIsAboutOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold font-sans shadow-sm transition-all shrink-0 cursor-pointer"
            >
              Read About
            </button>
          </div>

          {/* 7. License & Copyright Protection Section */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>License & Copyright Protection</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                PolyForm Noncommercial 1.0.0
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong>© 2026 Hariom Singh (Hari). All rights reserved.</strong> Open for personal, educational use and community contributions. Commercial exploitation, distribution, or unauthorized monetization is strictly prohibited under any circumstances.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-slate-950/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClearCache}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Cache</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
