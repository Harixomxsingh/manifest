import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import Header from './src/components/Header';
import BottomRitualBar from './src/components/BottomRitualBar';
import LocationPickerModal from './src/components/LocationPickerModal';
import PartyPopper from './src/components/PartyPopper';
import PhaseWelcome from './src/phases/PhaseWelcome';
import PhaseIdentity from './src/phases/PhaseIdentity';
import PhaseReading from './src/phases/PhaseReading';
import PhaseVoiceClarity from './src/phases/PhaseVoiceClarity';
import PhaseClimate from './src/phases/PhaseClimate';
import PhaseLaunch from './src/phases/PhaseLaunch';
import { colors } from './src/theme/colors';

function MainApp() {
  const { activePhase } = useApp();

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" backgroundColor={colors.bgPrimary} />
      
      {/* Top Header */}
      <Header />

      {/* Main Scrollable Ritual Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activePhase === 'welcome' && <PhaseWelcome />}
        {activePhase === 'identity' && <PhaseIdentity />}
        {activePhase === 'reading' && <PhaseReading />}
        {activePhase === 'voice' && <PhaseVoiceClarity />}
        {activePhase === 'climate' && <PhaseClimate />}
        {activePhase === 'launch' && <PhaseLaunch />}
      </ScrollView>

      {/* Bottom Ritual Bar */}
      <BottomRitualBar />

      {/* Modals & Confetti Overlays */}
      <LocationPickerModal />
      <PartyPopper />
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28
  }
});
