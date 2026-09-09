import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Sun, Volume2, VolumeX, MapPin, Shuffle, Mic, BookOpen } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import ManifestSunLogo from './ManifestSunLogo';
import JournalVaultModal from './JournalVaultModal';

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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

          {/* Minimal Action Icons */}
          <View style={styles.actionRow}>
            {/* Quick Vault Button */}
            <TouchableOpacity
              onPress={() => setIsVaultOpen(true)}
              activeOpacity={0.8}
              style={styles.iconBtn}
              accessibilityLabel="Journal Vault"
            >
              <BookOpen size={15} color={colors.primaryDark} />
            </TouchableOpacity>

            {/* Quick Voice Journal Button */}
            <TouchableOpacity
              onPress={() => jumpToPhase('voice')}
              activeOpacity={0.8}
              style={[
                styles.iconBtn,
                activePhase === 'voice' && styles.iconBtnActive
              ]}
              accessibilityLabel="Voice Clarity"
            >
              <Mic size={15} color={activePhase === 'voice' ? '#FFFFFF' : colors.primary} />
            </TouchableOpacity>

            {/* Randomize Day Button */}
            <TouchableOpacity
              onPress={randomizeAllDailyContent}
              activeOpacity={0.8}
              style={styles.iconBtn}
              accessibilityLabel="Randomize Content"
            >
              <Shuffle size={15} color={colors.primary} />
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
                <VolumeX size={15} color="#FFFFFF" />
              ) : (
                <Volume2 size={15} color={colors.primaryDark} />
              )}
            </TouchableOpacity>

            {/* Location Pill */}
            <TouchableOpacity
              onPress={() => setIsLocationModalOpen(true)}
              activeOpacity={0.8}
              style={styles.locationBtn}
            >
              <MapPin size={12} color={colors.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {activeLocation?.name?.split(',')[0] || 'City'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Header Journal Vault Modal */}
      <JournalVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
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
    paddingHorizontal: 16
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  sunBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDeep,
    letterSpacing: -0.3
  },
  brandSubtitle: {
    fontSize: 9,
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    gap: 4,
    paddingHorizontal: 8,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    maxWidth: 105
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMain
  }
});
