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
  Flame
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { triggerHaptic } from '../services/hapticsService';
import { getStreakData } from '../services/streakService';
import ManifestSunLogo from './ManifestSunLogo';
import JournalVaultModal from './JournalVaultModal';
import MomentumHeatmapModal from './MomentumHeatmapModal';
import FocusTimerModal from './FocusTimerModal';

export default function Header() {
  const {
    activeLocation,
    setIsLocationModalOpen,
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
          {/* Brand Logo & Name: Manifest */}
          <TouchableOpacity
            onPress={() => jumpToPhase('welcome')}
            activeOpacity={0.8}
            style={styles.brandRow}
          >
            <ManifestSunLogo size={28} interactive={false} />
            <View>
              <Text style={styles.brandTitle}>Manifest</Text>
              <Text style={styles.brandSubtitle}>{timeStr}</Text>
            </View>
          </TouchableOpacity>

          {/* First Priority Hero Streak Badge */}
          <TouchableOpacity
            onPress={handleOpenHeatmap}
            activeOpacity={0.8}
            style={styles.streakBadgeBtn}
            accessibilityLabel="Streak & Focus Heatmap"
          >
            <View style={styles.flameIconWrap}>
              <Flame size={13} color="#D97706" />
            </View>
            <Text style={styles.streakBadgeText}>
              {streakData.currentStreak}D STREAK
            </Text>
            <View style={styles.activeDot} />
          </TouchableOpacity>

          {/* Action Icons */}
          <View style={styles.actionRow}>
            {/* Quick Vault Button */}
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('light');
                setIsVaultOpen(true);
              }}
              activeOpacity={0.8}
              style={styles.iconBtn}
              accessibilityLabel="Journal Vault"
            >
              <BookOpen size={14} color={colors.primaryDark} />
            </TouchableOpacity>

            {/* Randomize Day Button */}
            <TouchableOpacity
              onPress={randomizeAllDailyContent}
              activeOpacity={0.8}
              style={styles.iconBtn}
              accessibilityLabel="Randomize Content"
            >
              <Shuffle size={14} color={colors.primary} />
            </TouchableOpacity>

            {/* Audio Speech Readout Button */}
            <TouchableOpacity
              onPress={toggleSpeechSummary}
              activeOpacity={0.8}
              style={[
                styles.iconBtn,
                isSpeechPlaying && styles.iconBtnActive
              ]}
              accessibilityLabel="Speech Summary"
            >
              {isSpeechPlaying ? (
                <VolumeX size={14} color="#FFFFFF" />
              ) : (
                <Volume2 size={14} color={colors.primaryDark} />
              )}
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
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDeep,
    letterSpacing: -0.3
  },
  brandSubtitle: {
    fontSize: 8.5,
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  streakBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  flameIconWrap: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  streakBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#92400E',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.2
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981'
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
  iconBtnActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark
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
    color: colors.textMain
  }
});
