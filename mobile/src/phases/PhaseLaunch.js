import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Clipboard } from 'react-native';
import { Flame, Target, BookOpen, Sun, Volume2, VolumeX, RotateCcw, Clock, Copy, Check, ArrowRight } from 'lucide-react-native';
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    triggerPartyCelebration();
  }, []);

  const anchor = briefing?.optimismAnchor || {
    identityReminder: 'I bring pride and world-class craftsmanship to every line of work today.'
  };

  const mainGoal = voiceJournal?.synthesis?.manifestationAnchor ||
    voiceJournal?.text ||
    null;

  const weatherLabel = weatherData ? `${weatherData.highTemp}°${weatherData.unit || 'C'} • ${weatherData.weatherLabel}` : 'Optimal Day';

  const handleCopySummary = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const formatted = `☀️ MORNING MANIFESTATION — ${today}
• Mindset: "${anchor.identityReminder}"
${mainGoal ? `• Focus Goal: "${mainGoal}"\n` : ''}• Reading: ${todayArticle?.title || 'Atomic Habits'}
• Atmosphere: ${weatherLabel}

Ready to make today count! 🚀`;

    if (Clipboard && Clipboard.setString) {
      Clipboard.setString(formatted);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      {/* Top Phase Header Tracker */}
      <View style={styles.progressHeader}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>PHASE 05 OF 05</Text>
          <Text style={styles.progressPhaseName}>Final Summary</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>
      </View>

      {/* Sun Emblem */}
      <View style={styles.logoWrapper}>
        <ManifestSunLogo size={56} interactive={true} />
      </View>

      {/* Title */}
      <Text style={styles.title}>You're All Set</Text>

      {/* Minimal Streak Badge */}
      <View style={styles.streakCapsule}>
        <Flame size={12} color="#D97706" />
        <Text style={styles.streakText}>4-DAY STREAK</Text>
        <Text style={styles.streakSubText}>• Ready to conquer today</Text>
      </View>

      {/* Single Pure Minimal Card */}
      <View style={styles.card}>
        {/* Top Blueprint Row */}
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeaderLabel}>TODAY'S BLUEPRINT</Text>
          <TouchableOpacity onPress={handleCopySummary} activeOpacity={0.7} style={styles.copyButton}>
            {copied ? (
              <>
                <Check size={11} color="#059669" />
                <Text style={styles.copyButtonTextActive}>Copied</Text>
              </>
            ) : (
              <>
                <Copy size={11} color={colors.textDim} />
                <Text style={styles.copyButtonText}>Copy</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Mindset Quote */}
        <Text style={styles.anchorQuote}>"{anchor.identityReminder}"</Text>

        {/* Goal (if recorded) */}
        {mainGoal && (
          <View style={styles.goalStrip}>
            <Target size={12} color={colors.primaryDark} />
            <Text style={styles.goalText} numberOfLines={2}>
              <Text style={styles.goalBold}>Focus: </Text>"{mainGoal}"
            </Text>
          </View>
        )}

        {/* 2-Column Status Row */}
        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaColLabel}>READING</Text>
            <Text style={styles.metaColValue} numberOfLines={1}>
              {todayArticle?.title || 'Atomic Habits'}
            </Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaColLabel}>WEATHER</Text>
            <Text style={styles.metaColValue} numberOfLines={1}>
              {weatherLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        {/* Audio Briefing Button */}
        <TouchableOpacity
          onPress={toggleSpeechSummary}
          activeOpacity={0.85}
          style={[styles.audioBtn, isSpeechPlaying && styles.audioBtnActive]}
        >
          {isSpeechPlaying ? (
            <VolumeX size={14} color={colors.primaryDark} />
          ) : (
            <Volume2 size={14} color={colors.primaryDark} />
          )}
          <Text style={styles.audioBtnText}>
            {isSpeechPlaying ? 'Stop Audio Briefing' : 'Listen to Audio Summary'}
          </Text>
        </TouchableOpacity>

        {/* Subtle Link Row */}
        <View style={styles.bottomLinkRow}>
          <TouchableOpacity onPress={() => setIsVaultOpen(true)} activeOpacity={0.7}>
            <Text style={styles.bottomLinkText}>Journal Vault</Text>
          </TouchableOpacity>
          <Text style={styles.dotSeparator}>•</Text>
          <TouchableOpacity onPress={resetRitual} activeOpacity={0.7}>
            <Text style={styles.bottomLinkText}>Restart Ritual</Text>
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
    marginBottom: 10,
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
  streakCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 16,
    marginBottom: 16
  },
  streakText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#92400E',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  streakSubText: {
    fontSize: 9.5,
    color: colors.textDim,
    fontWeight: '500'
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
    marginBottom: 12
  },
  cardHeaderLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.8
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  copyButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textDim
  },
  copyButtonTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669'
  },
  anchorQuote: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDeep,
    lineHeight: 20,
    marginBottom: 8
  },
  goalStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
    marginBottom: 8
  },
  goalText: {
    fontSize: 11,
    color: colors.textPrimary,
    flex: 1
  },
  goalBold: {
    fontWeight: '700',
    color: colors.textPrimary
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline
  },
  metaCol: {
    flex: 1
  },
  metaColLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 2
  },
  metaColValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary
  },
  actionRow: {
    width: '100%',
    gap: 10
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    paddingVertical: 12,
    borderRadius: 24
  },
  audioBtnActive: {
    backgroundColor: colors.bgHighlight,
    borderColor: colors.borderHighlight
  },
  audioBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary
  },
  bottomLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 4
  },
  bottomLinkText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textDim
  },
  dotSeparator: {
    color: colors.borderHairline,
    fontSize: 12
  }
});
