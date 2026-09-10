import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Alert, Clipboard } from 'react-native';
import { Flame, Shield, Target, Zap, BookOpen, Sun, Volume2, VolumeX, RotateCcw, Clock, Copy, Check } from 'lucide-react-native';
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
    "Focus on knocking down your single highest-impact priority today.";

  const nextStep = voiceJournal?.synthesis?.kineticAction ||
    "Take 5 minutes to clear your workspace and begin deep work.";

  const weatherLabel = weatherData ? `${weatherData.highTemp}°${weatherData.unit || 'C'} • ${weatherData.weatherLabel}` : 'Optimal Day';

  const handleCopySummary = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const formatted = `☀️ MORNING ACTION PLAN — ${today}
💡 Mindset: "${anchor.identityReminder}"
⚡ Main Focus: "${mainGoal}"
🎯 Next Step: ${nextStep}
📖 Reading: ${todayArticle?.title || 'Atomic Habits'}
🌤️ Weather: ${weatherLabel}

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
          <Text style={styles.progressPhaseName}>Ready to Go! 🚀</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>
      </View>

      {/* Streak Capsule */}
      <View style={styles.streakCapsule}>
        <Flame size={14} color="#D97706" />
        <Text style={styles.streakText}>4-DAY STREAK</Text>
        <Text style={styles.streakSubText}>• Keep the momentum going!</Text>
      </View>

      {/* Sun Emblem */}
      <View style={styles.logoWrapper}>
        <ManifestSunLogo size={64} interactive={true} />
      </View>

      {/* Title & Subtitle */}
      <Text style={styles.title}>You're All Set!</Text>
      <Text style={styles.subtitle}>
        Your morning mind is clear, focused, and ready. Let's make today count.
      </Text>

      {/* Today's Action Plan Card */}
      <View style={styles.card}>
        <View style={styles.planHeader}>
          <Text style={styles.planHeaderTitle}>TODAY'S ACTION PLAN</Text>
          <TouchableOpacity onPress={handleCopySummary} style={styles.copyBtn} activeOpacity={0.7}>
            {copied ? (
              <>
                <Check size={12} color="#059669" />
                <Text style={styles.copyBtnTextActive}>Copied!</Text>
              </>
            ) : (
              <>
                <Copy size={12} color={colors.primaryDark} />
                <Text style={styles.copyBtnText}>Copy Plan</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* 1. Mindset */}
        <View style={styles.anchorRow}>
          <Shield size={14} color={colors.primaryDark} style={{ marginTop: 2 }} />
          <View style={styles.anchorTextCol}>
            <Text style={styles.summaryLabel}>TODAY'S MINDSET</Text>
            <Text style={styles.anchorQuote}>"{anchor.identityReminder}"</Text>
          </View>
        </View>

        {/* 2. Main Focus */}
        <View style={styles.goalRow}>
          <Target size={14} color={colors.primaryDark} style={{ marginTop: 2 }} />
          <View style={styles.anchorTextCol}>
            <Text style={[styles.summaryLabel, { color: colors.textDim }]}>MAIN FOCUS & GOAL</Text>
            <Text style={styles.goalText}>"{mainGoal}"</Text>
            {nextStep && (
              <View style={styles.nextStepRow}>
                <Zap size={11} color="#D97706" />
                <Text style={styles.nextStepText} numberOfLines={2}>
                  Next: {nextStep}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 3. Reading & Atmosphere Strip */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <View style={styles.metaHeaderRow}>
              <BookOpen size={11} color={colors.primaryDark} />
              <Text style={styles.metaLabel}>TODAY'S READ</Text>
            </View>
            <Text style={styles.metaValue} numberOfLines={1}>
              {todayArticle?.title || 'Atomic Habits'}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <View style={styles.metaHeaderRow}>
              <Sun size={11} color="#D97706" />
              <Text style={styles.metaLabel}>ATMOSPHERE</Text>
            </View>
            <Text style={styles.metaValue} numberOfLines={1}>
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
            <VolumeX size={15} color="#FFFFFF" />
          ) : (
            <Volume2 size={15} color={colors.primaryDark} />
          )}
          <Text style={[styles.audioBtnText, isSpeechPlaying && styles.audioBtnTextActive]}>
            {isSpeechPlaying ? 'Stop Audio Briefing' : 'Listen to Audio Summary'}
          </Text>
        </TouchableOpacity>

        {/* Secondary Actions Row */}
        <View style={styles.secondaryActionsRow}>
          <TouchableOpacity
            onPress={() => setIsVaultOpen(true)}
            activeOpacity={0.8}
            style={styles.vaultBtn}
          >
            <BookOpen size={13} color={colors.primaryDark} />
            <Text style={styles.vaultBtnText}>Past Journal Vault</Text>
          </TouchableOpacity>

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
  streakCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 14
  },
  streakText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  streakSubText: {
    fontSize: 10,
    color: colors.textDim,
    fontWeight: '600'
  },
  logoWrapper: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.3
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
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
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline
  },
  planHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.8
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  copyBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark
  },
  copyBtnTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669'
  },
  anchorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    borderRadius: 14,
    padding: 12
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: 14,
    padding: 12
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
    lineHeight: 16
  },
  goalText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 16
  },
  nextStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline
  },
  nextStepText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600'
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
  metaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2
  },
  metaLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5
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
