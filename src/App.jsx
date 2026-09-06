import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import DashboardV1_1_1 from './v1_1_1/DashboardV1_1_1';
import Header from './components/Header';
import HeroStatusBar from './components/HeroStatusBar';
import OptimismAnchorCard from './components/cards/OptimismAnchorCard';
import InboxTriageCard from './components/cards/InboxTriageCard';
import CalendarRadarCard from './components/cards/CalendarRadarCard';
import WeatherIntelligenceCard from './components/cards/WeatherIntelligenceCard';
import PriorityTasksCard from './components/cards/PriorityTasksCard';
import JamesClearReadingCard from './components/cards/JamesClearReadingCard';
import SettingsModal from './components/SettingsModal';
import HistoryDrawer from './components/HistoryDrawer';
import LocationModal from './v1_1_1/components/LocationModal';
import AudioPlayerBar from './components/AudioPlayerBar';
import { CheckCheck, RefreshCw, AlertTriangle } from 'lucide-react';

function DashboardV1_0() {
  const { isGenerating, errorMsg, refreshDispatch } = useApp();

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Ambient Lighting Backdrops */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 left-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[160px] pointer-events-none -z-10" />

      {/* Top Header */}
      <Header />

      {/* Main Content Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-6 sm:space-y-7">
        {/* Error Alert if any */}
        {errorMsg && (
          <div className="rounded-2xl p-4 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => refreshDispatch()}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* 1-Glance Hero Status Bar */}
        <HeroStatusBar />

        {/* Generating Indicator Banner */}
        {isGenerating && (
          <div className="rounded-2xl p-3 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center gap-2 text-xs font-mono-code text-amber-300 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Chief of Staff synthesizing 6-pillar morning briefing...</span>
          </div>
        )}

        {/* System Pillar 6: Identity-Based Optimism & Resilience Anchor */}
        <OptimismAnchorCard />

        {/* System Pillar 2: Gmail Intelligent Inbox Triage */}
        <InboxTriageCard />

        {/* System Pillar 4: Google Calendar Radar & Daily Strategic Mental Model */}
        <CalendarRadarCard />

        {/* System Pillar 5: Priority To-Do Orchestrator */}
        <PriorityTasksCard />

        {/* System Pillar 3: 12-Hour Weather Intelligence & Actionable Guidance */}
        <WeatherIntelligenceCard />

        {/* System Pillar 1: James Clear Dynamic Reading Selector */}
        <JamesClearReadingCard />

        {/* Executive Completion Seal */}
        <footer className="pt-8 pb-4 text-center space-y-3 border-t border-white/[0.06]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-white/[0.08] text-xs text-slate-400 font-mono-code">
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Morning Dispatch Complete • Zero Friction</span>
          </div>

          <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
            Morning Manifestation PWA • Serverless Client-Side Architecture • $0 Operating Cost • Bring-Your-Own-Key Free Tier
          </p>
        </footer>
      </main>

      {/* Floating Audio Controller */}
      <AudioPlayerBar />

      {/* Modals & Drawers */}
      <LocationModal />
      <SettingsModal />
      <HistoryDrawer />
    </div>
  );
}

function VersionRouter() {
  const { currentVersion } = useApp();
  return currentVersion === 'v1.1.1' ? <DashboardV1_1_1 /> : <DashboardV1_0 />;
}

export default function App() {
  return (
    <AppProvider>
      <VersionRouter />
    </AppProvider>
  );
}
