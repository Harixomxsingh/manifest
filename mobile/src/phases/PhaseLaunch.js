import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Clipboard
} from 'react-native';
import {
  Flame,
  Target,
  BookOpen,
  Sun,
  Volume2,
  VolumeX,
  RotateCcw,
  Clock,
  Copy,
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { triggerHaptic } from '../services/hapticsService';
import {
  getStreakData,
  recordDailyCompletion,
  generateGitHubHeatmapGrid
} from '../services/streakService';
import ManifestSunLogo from '../components/ManifestSunLogo';
import JournalVaultModal from '../components/JournalVaultModal';
import MomentumHeatmapModal from '../components/MomentumHeatmapModal';
import FocusTimerModal from '../components/FocusTimerModal';
import StreakCelebrationModal from '../components/StreakCelebrationModal';

const GREEN_LEVEL_COLORS = [
  '#ECE8E0', // Level 0
  '#9BE9A8', // Level 1
  '#40C463', // Level 2
  '#30A14E', // Level 3
  '#216E39'  // Level 4
];

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
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [streak, setStreak] = useState({ currentStreak: 1 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleCompletion = async () => {
      const updated = await recordDailyCompletion();
      setStreak(updated);

      // Always trigger full-screen celebration modal when landing on Launchpad
      setIsCelebrationOpen(true);
    };
    handleCompletion();
  }, []);

  const anchor = briefing?.optimismAnchor || {
    identityReminder: 'I bring pride and world-class craftsmanship to every line of work today.'
  };

  const mainGoal = voiceJournal?.synthesis?.manifestationAnchor ||
    voiceJournal?.text ||
    null;

  const weatherLabel = weatherData ? `${weatherData.highTemp}°${weatherData.unit || 'C'} • ${weatherData.weatherLabel}` : 'Optimal Day';

  // Last 14 days mini heatmap preview
  const recentDays = useMemo(() => {
    const { weeks } = generateGitHubHeatmapGrid();
    if (!weeks || weeks.length === 0) return [];
    const flat = weeks.flat();
    return flat.slice(-14);
  }, [streak]);

  const handleCopySummary = () => {
    triggerHaptic('light');
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const formatted = `☀️ MORNING MANIFESTATION — ${today}
🔥 Streak: ${streak.currentStreak} Days

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

      {/* Interactive Streak Capsule */}
      <TouchableOpacity
        onPress={() => {
          triggerHaptic('medium');
          setIsHeatmapOpen(true);
        }}
        activeOpacity={0.8}
        style={styles.streakCapsule}
      >
        <Flame size={13} color="#D97706" />
        <Text style={styles.streakText}>{streak.currentStreak}-DAY STREAK</Text>
        <Text style={styles.dotSep}>•</Text>
        <Text style={styles.viewCalendarLink}>View Calendar →</Text>
      </TouchableOpacity>

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

        {/* 14-Day Mini Contribution Heatmap Strip */}
        <View style={styles.miniHeatmapRow}>
          <Text style={styles.miniHeatmapLabel}>RECENT FOCUS</Text>
          <View style={styles.miniSquaresGroup}>
            {recentDays.map((day, idx) => {
              const bgCol = GREEN_LEVEL_COLORS[day.level] || GREEN_LEVEL_COLORS[0];
              return (
                <View
                  key={idx}
                  style={[
                    styles.miniSquare,
                    { backgroundColor: bgCol },
                    day.isToday && styles.miniTodayRing
                  ]}
                />
              );
            })}
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        {/* Primary 25m Focus Block Trigger */}
        <TouchableOpacity
          onPress={() => {
            triggerHaptic('medium');
            setIsFocusTimerOpen(true);
          }}
          activeOpacity={0.85}
          style={styles.primaryFocusBtn}
        >
          <Clock size={15} color="#FDE68A" />
          <Text style={styles.primaryFocusText}>Start 25m Focus Block</Text>
          <ArrowRight size={15} color="#FDE68A" />
        </TouchableOpacity>

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
          getStreakData().then(setStreak);
        }}
        initialMinutes={25}
        currentFocusText={mainGoal}
      />
      <StreakCelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        streakCount={streak.currentStreak}
        onOpenHeatmap={() => setIsHeatmapOpen(true)}
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
    marginBottom: 8,
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
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: 16,
    marginBottom: 16
  },
  streakText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  dotSep: {
    fontSize: 10,
    color: colors.borderHighlight
  },
  viewCalendarLink: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#059669'
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
    borderTopColor: colors.borderHairline,
    marginBottom: 10
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
  miniHeatmapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline
  },
  miniHeatmapLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  miniSquaresGroup: {
    flexDirection: 'row',
    gap: 3
  },
  miniSquare: {
    width: 8,
    height: 8,
    borderRadius: 1.5
  },
  miniTodayRing: {
    borderWidth: 1,
    borderColor: '#D97706'
  },
  actionRow: {
    width: '100%',
    gap: 10
  },
  primaryFocusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4
  },
  primaryFocusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF'
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
