import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SidebarRitualPath, { RITUAL_PHASES } from './components/SidebarRitualPath';
import FooterKeyboardBar from './components/FooterKeyboardBar';
import PhaseWelcome from './phases/PhaseWelcome';
import PhaseIdentity from './phases/PhaseIdentity';
import PhaseReading from './phases/PhaseReading';
import PhaseClimate from './phases/PhaseClimate';
import PhaseSchedule from './phases/PhaseSchedule';
import PhasePriorities from './phases/PhasePriorities';
import PhaseInbox from './phases/PhaseInbox';
import PhaseLaunch from './phases/PhaseLaunch';
import OnboardingModal from './components/OnboardingModal';
import LocationModal from './components/LocationModal';
import SettingsModal from '../components/SettingsModal';
import HistoryDrawer from '../components/HistoryDrawer';
import { useApp } from '../context/AppContext';

export default function DashboardV1_1_1() {
  const [activePhase, setActivePhase] = useState('welcome');
  const { isSettingsOpen, setIsSettingsOpen, isHistoryOpen, setIsHistoryOpen, isOnboardingOpen, isLocationModalOpen } = useApp();

  const phaseOrder = ['welcome', 'identity', 'reading', 'climate', 'launch'];

  const advanceToNextPhase = () => {
    const currentIndex = phaseOrder.indexOf(activePhase);
    if (currentIndex >= 0 && currentIndex < phaseOrder.length - 1) {
      const nextPhase = phaseOrder[currentIndex + 1];
      setActivePhase(nextPhase);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard Navigation: Enter or Space to advance, 1-4 to jump
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if inside an input, textarea or if any modal is open
      if (
        isOnboardingOpen ||
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
      } else if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key, 10);
        if (phaseOrder[index]) {
          setActivePhase(phaseOrder[index]);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (e.key === '0') {
        setActivePhase('welcome');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhase, isSettingsOpen, isHistoryOpen, isOnboardingOpen, isLocationModalOpen]);

  return (
    <div className="bg-[#FDF9F1] text-[#1C1C17] min-h-screen antialiased selection:bg-[#FEF3C7] selection:text-[#B45309] font-body relative">
      {/* Fixed Top Header */}
      <Header />

      {/* Fixed Left Navigation Sidebar */}
      <SidebarRitualPath
        activePhase={activePhase}
        onSelectPhase={(phaseId) => {
          setActivePhase(phaseId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <div className="pl-0 lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 pt-16 pb-16 w-full">
          <div className="max-w-[42rem] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center min-h-[calc(100vh-8rem)]">
            {activePhase === 'welcome' && <PhaseWelcome onAdvance={advanceToNextPhase} />}
            {activePhase === 'identity' && <PhaseIdentity onAdvance={advanceToNextPhase} />}
            {activePhase === 'reading' && <PhaseReading onAdvance={advanceToNextPhase} />}
            {activePhase === 'climate' && <PhaseClimate onAdvance={advanceToNextPhase} />}
            {activePhase === 'launch' && (
              <PhaseLaunch onResetToWelcome={() => setActivePhase('welcome')} />
            )}
          </div>
        </main>

        {/* Fixed Footer Keyboard Shortcuts Helper */}
        <FooterKeyboardBar />
      </div>

      {/* Modals & Manuals */}
      <LocationModal />
      <OnboardingModal />
      <SettingsModal />
      <HistoryDrawer />
    </div>
  );
}
