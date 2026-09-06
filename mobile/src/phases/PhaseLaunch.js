import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Compass, CheckCheck, Shield, Volume2, VolumeX, RotateCcw } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function PhaseLaunch() {
  const {
    resetRitual,
    briefing,
    todayArticle,
    weatherData,
    isSpeechPlaying,
    toggleSpeechSummary,
    triggerPartyCelebration
  } = useApp();

  useEffect(() => {
    // Fire celebratory confetti on launch landing
    triggerPartyCelebration();
  }, []);

  const anchor = briefing?.optimismAnchor || {
    identityReminder: 'I view every challenge today through an opportunistic and constructive lens.'
  };

  return (
    <View style={styles.container}>
      {/* Top Phase Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>PHASE 04 OF 04</Text>
          <Text style={styles.progressPhaseName}>Launchpad Activated</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>
      </View>

      {/* Emblem */}
      <View style={styles.emblemBadge}>
        <Compass size={32} color={colors.primary} />
      </View>

      {/* Success Badge */}
      <View style={styles.badge}>
        <CheckCheck size={14} color={colors.emeraldDark} />
        <Text style={styles.badgeText}>RITUAL COMPLETE • ZERO FRICTION</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Go Forth With Unshakeable Focus</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        You have anchored your identity, absorbed today’s mindset reading, and mapped your atmospheric climate. You are primed to conquer today.
      </Text>

      {/* Summary Slate */}
      <View style={styles.card}>
        {/* Anchor row */}
        <View style={styles.anchorBox}>
          <Shield size={16} color={colors.primaryDark} style={{ marginTop: 2 }} />
          <View style={styles.anchorTextCol}>
            <Text style={styles.summaryLabel}>TODAY'S IDENTITY ANCHOR</Text>
            <Text style={styles.anchorQuote}>"{anchor.identityReminder}"</Text>
          </View>
        </View>

        {/* 2-Col Grid for Reading & Climate */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>MINDSET READING</Text>
            <Text style={styles.summaryValue} numberOfLines={2}>
              {todayArticle?.title || 'James Clear Atomic Habits'}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>CLIMATE HORIZON</Text>
            <Text style={styles.summaryValue} numberOfLines={2}>
              {weatherData ? `${weatherData.highTemp}°C • ${weatherData.weatherLabel}` : 'Optimal Day'}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        {/* Audio Summary Dispatch */}
        <TouchableOpacity
          onPress={toggleSpeechSummary}
          activeOpacity={0.85}
          style={[
            styles.audioBtn,
            isSpeechPlaying && styles.audioBtnActive
          ]}
        >
          {isSpeechPlaying ? (
            <VolumeX size={16} color="#FFFFFF" />
          ) : (
            <Volume2 size={16} color={colors.primaryDark} />
          )}
          <Text style={[styles.audioBtnText, isSpeechPlaying && styles.audioBtnTextActive]}>
            {isSpeechPlaying ? 'Mute Dispatch' : 'Listen to Audio Summary'}
          </Text>
        </TouchableOpacity>

        {/* Reset Ritual */}
        <TouchableOpacity
          onPress={resetRitual}
          activeOpacity={0.8}
          style={styles.resetBtn}
        >
          <RotateCcw size={15} color={colors.textMuted} />
          <Text style={styles.resetBtnText}>Restart Ritual</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12
  },
  progressHeader: {
    width: '100%',
    marginBottom: 16
  },
  progressTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  progressPhaseName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.emeraldDark
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.borderHairline,
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.emerald,
    borderRadius: 2
  },
  emblemBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: colors.emeraldLight,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 10
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.emeraldDark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textMain,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 10
  },
  card: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2
  },
  anchorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    borderRadius: 14,
    padding: 12
  },
  anchorTextCol: {
    flex: 1
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
    marginBottom: 3
  },
  anchorQuote: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDeep,
    fontStyle: 'italic',
    lineHeight: 18
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 8
  },
  summaryItem: {
    flex: 1,
    backgroundColor: colors.bgCardAlt,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: 14,
    padding: 12
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 16
  },
  actionRow: {
    width: '100%',
    gap: 10
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    paddingVertical: 14,
    borderRadius: 24
  },
  audioBtnActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark
  },
  audioBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark
  },
  audioBtnTextActive: {
    color: '#FFFFFF'
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.bgCardAlt,
    borderWidth: 1,
    borderColor: colors.borderCard,
    paddingVertical: 13,
    borderRadius: 24
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted
  }
});
