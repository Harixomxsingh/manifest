import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SidebarRitualPath from './components/SidebarRitualPath';
import MobileBottomDock from './components/MobileBottomDock';
import FooterKeyboardBar from './components/FooterKeyboardBar';
import PhaseWelcome from './phases/PhaseWelcome';
import PhaseIdentity from './phases/PhaseIdentity';
import PhaseReading from './phases/PhaseReading';
import PhaseVoiceClarity from './phases/PhaseVoiceClarity';
import PhaseClimate from './phases/PhaseClimate';
import PhaseLaunch from './phases/PhaseLaunch';
import LocationModal from '../v1_1_1/components/LocationModal';
import SettingsModal from '../components/SettingsModal';
import HistoryDrawer from '../components/HistoryDrawer';
import JournalVaultModal from './components/JournalVaultModal';
import MomentumHeatmapModal from './components/MomentumHeatmapModal';
import { useApp } from '../context/AppContext';

export default function DashboardV1_1_2() {
  const [activePhase, setActivePhase] = useState('welcome');
  const [isJournalVaultOpen, setIsJournalVaultOpen] = useState(false);
  const [isMomentumHeatmapOpen, setIsMomentumHeatmapOpen] = useState(false);
  const { isSettingsOpen, isHistoryOpen, isLocationModalOpen, setVoiceJournal } = useApp();

  const phaseOrder = ['welcome', 'identity', 'reading', 'voice', 'climate', 'launch'];

  const advanceToNextPhase = () => {
    const currentIndex = phaseOrder.indexOf(activePhase);
    if (currentIndex >= 0 && currentIndex < phaseOrder.length - 1) {
      const nextPhase = phaseOrder[currentIndex + 1];
      setActivePhase(nextPhase);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard Navigation: Enter or Space to advance, 0-5 to jump
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if inside an input, textarea or if any modal is open
      if (
        isJournalVaultOpen ||
        isLocationModalOpen ||
        isSettingsOpen ||
        isHistoryOpen ||
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if ((e.key === 'Enter' || e.key === ' ') && !e.shiftKey) {
        e.preventDefault();
        advanceToNextPhase();
      } else if (e.key >= '0' && e.key <= '5') {
        const index = parseInt(e.key, 10);
        if (phaseOrder[index]) {
          setActivePhase(phaseOrder[index]);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhase, isJournalVaultOpen, isSettingsOpen, isHistoryOpen, isLocationModalOpen]);

  return (
    <div className="bg-[#FDF9F1] text-[#1C1C17] min-h-screen antialiased selection:bg-amber-100 selection:text-amber-900 font-sans relative">
      {/* Fixed Top Header */}
      <Header
        onOpenVault={() => setIsJournalVaultOpen(true)}
        onOpenStreak={() => setIsMomentumHeatmapOpen(true)}
      />

      {/* Fixed Left Navigation Sidebar (Desktop viewports) */}
      <SidebarRitualPath
        activePhase={activePhase}
        onSelectPhase={(phaseId) => {
          setActivePhase(phaseId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVault={() => setIsJournalVaultOpen(true)}
        onOpenStreak={() => setIsMomentumHeatmapOpen(true)}
      />

      {/* Main Content Area with Mobile & Tablet Safe Padding */}
      <div className="pl-0 lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 pt-16 sm:pt-20 lg:pt-16 pb-24 md:pb-28 lg:pb-16 w-full">
          <div className="max-w-[42rem] md:max-w-[45rem] lg:max-w-[44rem] xl:max-w-[46rem] mx-auto px-3.5 sm:px-6 md:px-8 py-4 sm:py-8 flex flex-col justify-center min-h-[calc(100vh-8rem)]">
            {activePhase === 'welcome' && <PhaseWelcome onAdvance={advanceToNextPhase} />}
            {activePhase === 'identity' && <PhaseIdentity onAdvance={advanceToNextPhase} />}
            {activePhase === 'reading' && <PhaseReading onAdvance={advanceToNextPhase} />}
            {activePhase === 'voice' && <PhaseVoiceClarity onAdvance={advanceToNextPhase} />}
            {activePhase === 'climate' && <PhaseClimate onAdvance={advanceToNextPhase} />}
            {activePhase === 'launch' && (
              <PhaseLaunch
                onResetToWelcome={() => {
                  if (setVoiceJournal) setVoiceJournal(null);
                  setActivePhase('welcome');
                }}
                onOpenVault={() => setIsJournalVaultOpen(true)}
                onOpenStreak={() => setIsMomentumHeatmapOpen(true)}
              />
            )}

            {/* Subtle Mobile Footer */}
            <div className="mt-8 mb-2 text-center lg:hidden space-y-1">
              <p className="text-[11px] text-stone-500 font-sans">
                made with ❤️ by{' '}
                <a
                  href="https://harixomxsingh.github.io/portfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 hover:text-amber-950 font-bold hover:underline"
                >
                  hari
                </a>
              </p>
              <p className="text-[9.5px] text-stone-400 font-mono">
                © 2026 Hari • PolyForm Noncommercial License
              </p>
            </div>
          </div>
        </main>

        {/* Fixed Desktop Keyboard Shortcuts Helper */}
        <div className="hidden lg:block">
          <FooterKeyboardBar />
        </div>
      </div>

      {/* Fixed Mobile Bottom Touch Navigation Dock */}
      <MobileBottomDock
        activePhase={activePhase}
        onSelectPhase={(phaseId) => {
          setActivePhase(phaseId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals & Focus Heatmap */}
      <MomentumHeatmapModal
        isOpen={isMomentumHeatmapOpen}
        onClose={() => setIsMomentumHeatmapOpen(false)}
      />
      <JournalVaultModal
        isOpen={isJournalVaultOpen}
        onClose={() => setIsJournalVaultOpen(false)}
      />
      <LocationModal />
      <SettingsModal />
      <HistoryDrawer />
    </div>
  );
}
