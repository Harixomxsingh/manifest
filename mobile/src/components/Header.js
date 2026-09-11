import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import {
  Sun,
  Volume2,
  VolumeX,
  MapPin,
  Shuffle,
  Mic,
  BookOpen,
  Flame,
  Settings,
  Sparkles
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { triggerHaptic } from '../services/hapticsService';
import { getStreakData } from '../services/streakService';
import ManifestSunLogo from './ManifestSunLogo';
import JournalVaultModal from './JournalVaultModal';
import MomentumHeatmapModal from './MomentumHeatmapModal';
import FocusTimerModal from './FocusTimerModal';
import SettingsModal from './SettingsModal';

export default function Header() {
  const {
    activeLocation,
    setIsLocationModalOpen,
    setIsAboutOpen,
    isSpeechPlaying,
    toggleSpeechSummary,
    randomizeAllDailyContent,
    jumpToPhase,
    activePhase
  } = useApp();

  const [timeStr, setTimeStr] = useState('');
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [streakData, setStreakData] = useState({ currentStreak: 1 });

  useEffect(() => {
    const loadStreak = async () => {
      const s = await getStreakData();
      setStreakData(s);
    };
    loadStreak();
  }, [isHeatmapOpen]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenHeatmap = () => {
    triggerHaptic('medium');
    setIsHeatmapOpen(true);
  };

  return (
    <View style={styles.headerWrapper}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContent}>
          {/* Left Brand Cluster: Logo + Name + Streak Badge */}
          <View style={styles.leftBrandCluster}>
            <TouchableOpacity
              onPress={() => jumpToPhase('welcome')}
              activeOpacity={0.8}
              style={styles.brandRow}
            >
              <ManifestSunLogo size={26} interactive={false} />
              <Text style={styles.brandTitle}>Manifest</Text>
            </TouchableOpacity>

            {/* Streak Badge right after the App Name */}
            <TouchableOpacity
              onPress={handleOpenHeatmap}
              activeOpacity={0.8}
              style={styles.streakBadgeBtn}
              accessibilityLabel="Streak & Focus Heatmap"
            >
              <View style={styles.flameIconWrap}>
                <Flame size={12} color="#D97706" />
              </View>
              <Text style={styles.streakBadgeText}>
                {streakData.currentStreak}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Icons (Clean & Spacious for Mobile) */}
          <View style={styles.actionRow}>
            {/* Randomize Day Button */}
            <TouchableOpacity
              onPress={randomizeAllDailyContent}
              activeOpacity={0.8}
              style={styles.iconBtn}
              accessibilityLabel="Randomize Content"
            >
              <Shuffle size={13} color={colors.primary} />
            </TouchableOpacity>

            {/* About Manifest Purpose & Benefits */}
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('light');
                setIsAboutOpen(true);
              }}
              activeOpacity={0.8}
              style={styles.aboutIconBtn}
              accessibilityLabel="About Manifest"
            >
              <Sparkles size={13} color="#D97706" />
            </TouchableOpacity>

            {/* Settings Option Button */}
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('light');
                setIsSettingsOpen(true);
              }}
              activeOpacity={0.8}
              style={styles.iconBtn}
              accessibilityLabel="Settings"
            >
              <Settings size={13} color={colors.primary} />
            </TouchableOpacity>

            {/* Location Pill */}
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('light');
                setIsLocationModalOpen(true);
              }}
              activeOpacity={0.8}
              style={styles.locationBtn}
            >
              <MapPin size={11} color={colors.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {activeLocation?.name?.split(',')[0] || 'City'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Modals */}
      <JournalVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />
      <MomentumHeatmapModal
        isOpen={isHeatmapOpen}
        onClose={() => setIsHeatmapOpen(false)}
        onStartFocusTimer={() => setIsFocusTimerOpen(true)}
      />
      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => {
          setIsFocusTimerOpen(false);
          getStreakData().then(setStreakData);
        }}
        initialMinutes={25}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: 'rgba(253, 249, 241, 0.98)',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
    zIndex: 40
  },
  safeArea: {
    width: '100%'
  },
  headerContent: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12
  },
  leftBrandCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDeep,
    letterSpacing: -0.3,
    fontFamily: fonts.bold
  },
  streakBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.2,
    borderColor: '#FCD34D',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2
  },
  flameIconWrap: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  streakBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#92400E',
    fontFamily: fonts.monoBold,
    letterSpacing: 0.2
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgCardAlt,
    borderWidth: 1,
    borderColor: colors.borderCard,
    alignItems: 'center',
    justifyContent: 'center'
  },
  aboutIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    maxWidth: 90
  },
  locationText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMain,
    fontFamily: fonts.medium
  }
});

