import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold
} from '@expo-google-fonts/jetbrains-mono';
import { AppProvider, useApp } from './src/context/AppContext';
import Header from './src/components/Header';
import BottomRitualBar from './src/components/BottomRitualBar';
import LocationPickerModal from './src/components/LocationPickerModal';
import PartyPopper from './src/components/PartyPopper';
import AboutManifestModal from './src/components/AboutManifestModal';
import PhaseWelcome from './src/phases/PhaseWelcome';
import PhaseIdentity from './src/phases/PhaseIdentity';
import PhaseReading from './src/phases/PhaseReading';
import PhaseVoiceClarity from './src/phases/PhaseVoiceClarity';
import PhaseClimate from './src/phases/PhaseClimate';
import PhaseLaunch from './src/phases/PhaseLaunch';
import { colors } from './src/theme/colors';
import { initNotifications, scheduleDailyManifestationReminder } from './src/services/notificationService';

function MainApp() {
  const { activePhase, isAboutOpen, setIsAboutOpen, streakData, identity, goToPhase } = useApp();

  useEffect(() => {
    // Initialize notification channels & schedule daily 9:00 AM dynamic reminder
    initNotifications().then(() => {
      scheduleDailyManifestationReminder({
        streakCount: streakData?.currentStreak || 0,
        identityTitle: identity?.title || ''
      });
    });

    // Handle deep linking when user taps a notification
    const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response?.notification?.request?.content?.data;
      if (data?.action === 'start_ritual') {
        goToPhase('welcome');
      }
    });

    return () => {
      responseSub.remove();
    };
  }, []);

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
      <AboutManifestModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
      <PartyPopper />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center'
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

