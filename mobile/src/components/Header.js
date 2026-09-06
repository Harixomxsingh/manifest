import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Sun, Volume2, VolumeX, MapPin, Sparkles, Shuffle } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function Header() {
  const {
    activeLocation,
    setIsLocationModalOpen,
    isSpeechPlaying,
    toggleSpeechSummary,
    randomizeAllDailyContent
  } = useApp();

  const [timeStr, setTimeStr] = useState('');

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
          {/* Brand Logo & Name */}
          <View style={styles.brandRow}>
            <View style={styles.sunBadge}>
              <Sun size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.brandTitle}>Morning Manifestation</Text>
              <Text style={styles.brandSubtitle}>v1.1.2 Dawn • {timeStr}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            {/* Randomize Day Button */}
            <TouchableOpacity
              onPress={randomizeAllDailyContent}
              activeOpacity={0.8}
              style={styles.iconBtn}
              accessibilityLabel="Randomize Day"
            >
              <Shuffle size={16} color={colors.primary} />
            </TouchableOpacity>

            {/* Audio Speech Readout Button */}
            <TouchableOpacity
              onPress={toggleSpeechSummary}
              activeOpacity={0.8}
              style={[
                styles.iconBtn,
                isSpeechPlaying && styles.iconBtnActive
              ]}
            >
              {isSpeechPlaying ? (
                <VolumeX size={17} color="#FFFFFF" />
              ) : (
                <Volume2 size={17} color={colors.primaryDark} />
              )}
            </TouchableOpacity>

            {/* Location Button */}
            <TouchableOpacity
              onPress={() => setIsLocationModalOpen(true)}
              activeOpacity={0.8}
              style={styles.locationBtn}
            >
              <MapPin size={13} color={colors.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {activeLocation?.name?.split(',')[0] || 'City'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: 'rgba(253, 249, 241, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
    zIndex: 40
  },
  safeArea: {
    width: '100%'
  },
  headerContent: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  sunBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDeep,
    letterSpacing: -0.3
  },
  brandSubtitle: {
    fontSize: 10,
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textTransform: 'uppercase',
    marginTop: 1
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    maxWidth: 120
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMain
  }
});
