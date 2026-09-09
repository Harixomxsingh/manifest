import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Compass, CheckCheck, Shield, Mic, Volume2, VolumeX, RotateCcw, BookOpen } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import ManifestSunLogo from '../components/ManifestSunLogo';
import JournalVaultModal from '../components/JournalVaultModal';

export default function PhaseLaunch() {
  const {
    resetRitual,
    briefing,
    todayArticle,
    weatherData,
    voiceJournal,
    isSpeechPlaying,
    toggleSpeechSummary,
    triggerPartyCelebration
  } = useApp();

  const [isVaultOpen, setIsVaultOpen] = useState(false);

  useEffect(() => {
    triggerPartyCelebration();
  }, []);

  const anchor = briefing?.optimismAnchor || {
    identityReminder: 'I view every challenge today through an opportunistic and constructive lens.'
  };

  return (
    <View style={styles.container}>
      {/* Top Phase Header Tracker */}
      <View style={styles.progressHeader}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>PHASE 05 OF 05</Text>
          <Text style={styles.progressPhaseName}>Launchpad Ready</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>
      </View>

      {/* Triumphant Glowing Emblem */}
      <View style={styles.logoWrapper}>
        <ManifestSunLogo size={64} interactive={true} />
      </View>

      {/* Title & Subtitle */}
      <Text style={styles.title}>Ritual Complete</Text>
      <Text style={styles.subtitle}>
        Anchored in identity, nourished in mindset, and crystalline in intention. Conquer your day.
      </Text>

      {/* Unified Summary Slate */}
      <View style={styles.card}>
        {/* 1. Identity Anchor */}
        <View style={styles.anchorRow}>
          <Shield size={14} color={colors.primaryDark} style={{ marginTop: 2 }} />
          <View style={styles.anchorTextCol}>
            <Text style={styles.summaryLabel}>IDENTITY ANCHOR</Text>
            <Text style={styles.anchorQuote}>"{anchor.identityReminder}"</Text>
          </View>
        </View>

        {/* 2. Voice Anchor (if spoken) */}
        {voiceJournal?.synthesis?.manifestationAnchor && (
          <View style={[styles.anchorRow, styles.voiceAnchorRow]}>
            <Mic size={14} color="#B45309" style={{ marginTop: 2 }} />
            <View style={styles.anchorTextCol}>
              <Text style={[styles.summaryLabel, { color: '#B45309' }]}>SPOKEN VOICE ANCHOR</Text>
              <Text style={[styles.anchorQuote, { color: '#92400E' }]}>
                "{voiceJournal.synthesis.manifestationAnchor}"
              </Text>
            </View>
          </View>
        )}

        {/* 3. Mindset & Atmosphere 2-Col Strip */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>MINDSET</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {todayArticle?.title || 'Atomic Habits'}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>ATMOSPHERE</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {weatherData ? `${weatherData.highTemp}°C • ${weatherData.weatherLabel}` : 'Optimal Day'}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        {/* Audio Dispatch Button */}
        <TouchableOpacity
          onPress={toggleSpeechSummary}
          activeOpacity={0.85}
          style={[styles.audioBtn, isSpeechPlaying && styles.audioBtnActive]}
        >
          {isSpeechPlaying ? (
            <VolumeX size={15} color="#FFFFFF" />
          ) : (
            <Volume2 size={15} color={colors.primaryDark} />
          )}
          <Text style={[styles.audioBtnText, isSpeechPlaying && styles.audioBtnTextActive]}>
            {isSpeechPlaying ? 'Mute Dispatch' : 'Listen to Audio Summary'}
          </Text>
        </TouchableOpacity>

        {/* Secondary Actions Row */}
        <View style={styles.secondaryActionsRow}>
          {/* Browse Vault */}
          <TouchableOpacity
            onPress={() => setIsVaultOpen(true)}
            activeOpacity={0.8}
            style={styles.vaultBtn}
          >
            <BookOpen size={13} color={colors.primaryDark} />
            <Text style={styles.vaultBtnText}>Browse Journal Vault</Text>
          </TouchableOpacity>

          {/* Restart Ritual Button */}
          <TouchableOpacity
            onPress={resetRitual}
            activeOpacity={0.8}
            style={styles.resetBtn}
          >
            <RotateCcw size={13} color={colors.textDim} />
            <Text style={styles.resetBtnText}>Restart Ritual</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Journal Vault Modal */}
      <JournalVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />
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
    marginBottom: 20
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1
  },
  progressPhaseName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark
  },
  progressBarTrack: {
    width: '100%',
    height: 3,
    backgroundColor: colors.borderHairline,
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2
  },
  logoWrapper: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 16
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: 20,
    padding: 16,
    gap: 10,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2
  },
  anchorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    borderRadius: 12,
    padding: 10
  },
  voiceAnchorRow: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A'
  },
  anchorTextCol: {
    flex: 1
  },
  summaryLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.6,
    marginBottom: 2
  },
  anchorQuote: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDeep,
    fontStyle: 'italic',
    lineHeight: 16
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8
  },
  metaItem: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    borderRadius: 10,
    padding: 10
  },
  metaLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary
  },
  actionRow: {
    width: '100%',
    gap: 8
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    paddingVertical: 13,
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
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%'
  },
  vaultBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    paddingVertical: 11,
    borderRadius: 24
  },
  vaultBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark
  },
  resetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    paddingVertical: 11,
    borderRadius: 24
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textDim
  }
});
