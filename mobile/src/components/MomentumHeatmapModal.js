import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform
} from 'react-native';
import {
  X,
  Flame,
  Clock,
  Calendar,
  Trophy,
  Zap,
  Play,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { triggerHaptic } from '../services/hapticsService';
import {
  getStreakData,
  getStoredHeatmapLogs,
  generateGitHubHeatmapGrid,
  recordFocusSession
} from '../services/streakService';

const GREEN_LEVEL_COLORS = [
  '#ECE8E0', // Level 0
  '#9BE9A8', // Level 1
  '#40C463', // Level 2
  '#30A14E', // Level 3
  '#216E39'  // Level 4
];

const GOLD_LEVEL_COLORS = [
  '#ECE8E0', // Level 0
  '#FDE68A', // Level 1
  '#F59E0B', // Level 2
  '#D97706', // Level 3
  '#78350F'  // Level 4
];

export default function MomentumHeatmapModal({
  isOpen,
  onClose,
  onStartFocusTimer
}) {
  const [theme, setTheme] = useState('green'); // 'green' | 'gold'
  const [stats, setStats] = useState({
    currentStreak: 1,
    longestStreak: 1,
    totalCompletions: 1,
    totalFocusHours: '0.4'
  });
  const [logs, setLogs] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

  const loadData = async () => {
    const s = await getStreakData();
    const l = await getStoredHeatmapLogs();
    setStats(s);
    setLogs(l);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const { weeks } = useMemo(() => {
    return generateGitHubHeatmapGrid(logs);
  }, [logs]);

  const colorPalette = theme === 'green' ? GREEN_LEVEL_COLORS : GOLD_LEVEL_COLORS;

  const handleQuickLog25m = async () => {
    triggerHaptic('success');
    await recordFocusSession(25);
    await loadData();
  };

  const handleDaySelect = (day) => {
    triggerHaptic('selection');
    setSelectedDay(day);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerTitleGroup}>
                <View style={styles.flameIconBox}>
                  <Flame size={18} color="#D97706" />
                </View>
                <View>
                  <View style={styles.titleBadgeRow}>
                    <Text style={styles.modalTitle}>Focus & Streak Grid</Text>
                    <View style={styles.streakBadge}>
                      <Text style={styles.streakBadgeText}>
                        {stats.currentStreak}D STREAK
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.modalSubtitle}>
                    Daily morning rituals & 25m focus blocks
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                style={styles.closeBtn}
              >
                <X size={18} color={colors.textDim} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollArea}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* 4 Executive Metric Tiles */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <View style={styles.metricLabelRow}>
                    <Flame size={12} color="#D97706" />
                    <Text style={styles.metricLabel}>CURRENT</Text>
                  </View>
                  <Text style={styles.metricValue}>
                    {stats.currentStreak} <Text style={styles.metricUnit}>Days</Text>
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricLabelRow}>
                    <Trophy size={12} color="#D97706" />
                    <Text style={styles.metricLabel}>LONGEST</Text>
                  </View>
                  <Text style={styles.metricValue}>
                    {stats.longestStreak} <Text style={styles.metricUnit}>Days</Text>
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricLabelRow}>
                    <Clock size={12} color="#D97706" />
                    <Text style={styles.metricLabel}>DEEP FOCUS</Text>
                  </View>
                  <Text style={styles.metricValue}>
                    {stats.totalFocusHours} <Text style={styles.metricUnit}>Hours</Text>
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricLabelRow}>
                    <Calendar size={12} color="#D97706" />
                    <Text style={styles.metricLabel}>TOTAL DAYS</Text>
                  </View>
                  <Text style={styles.metricValue}>
                    {stats.totalCompletions} <Text style={styles.metricUnit}>Days</Text>
                  </Text>
                </View>
              </View>

              {/* GitHub-Style 52-Week Heatmap Grid */}
              <View style={styles.heatmapCard}>
                <View style={styles.heatmapHeader}>
                  <Text style={styles.heatmapTitle}>
                    52-Week Activity Grid ({weeks.length * 7} Days)
                  </Text>

                  {/* Theme Switcher */}
                  <View style={styles.themeToggleRow}>
                    <TouchableOpacity
                      onPress={() => {
                        triggerHaptic('selection');
                        setTheme('green');
                      }}
                      style={[
                        styles.themeTab,
                        theme === 'green' && styles.themeTabActive
                      ]}
                    >
                      <Text
                        style={[
                          styles.themeTabText,
                          theme === 'green' && styles.themeTabTextActive
                        ]}
                      >
                        Green
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        triggerHaptic('selection');
                        setTheme('gold');
                      }}
                      style={[
                        styles.themeTab,
                        theme === 'gold' && styles.themeTabActive
                      ]}
                    >
                      <Text
                        style={[
                          styles.themeTabText,
                          theme === 'gold' && styles.themeTabTextActive
                        ]}
                      >
                        Gold
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Horizontal Scrollable Heatmap */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.gridScrollContainer}
                >
                  <View style={styles.gridColumnsWrapper}>
                    {weeks.map((week, wIdx) => (
                      <View key={wIdx} style={styles.weekColumn}>
                        {week.map((day, dIdx) => {
                          const bgCol = colorPalette[day.level] || colorPalette[0];
                          const isSelected = selectedDay?.dateStr === day.dateStr;

                          return (
                            <TouchableOpacity
                              key={dIdx}
                              onPress={() => handleDaySelect(day)}
                              activeOpacity={0.7}
                              style={[
                                styles.daySquare,
                                { backgroundColor: bgCol },
                                day.isToday && styles.todayRing,
                                isSelected && styles.selectedSquare
                              ]}
                            />
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </ScrollView>

                {/* Day Inspector Tooltip Bar */}
                <View style={styles.dayInspectorBar}>
                  {selectedDay ? (
                    <View style={styles.inspectorTextRow}>
                      <Text style={styles.inspectorDate}>
                        {selectedDay.date.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}:
                      </Text>
                      <Text style={styles.inspectorDetail}>
                        {selectedDay.entry?.ritualCompleted
                          ? '✨ Morning Cadence Done'
                          : 'Rest Day'}
                        {selectedDay.entry?.focusMinutes
                          ? ` • ${selectedDay.entry.focusMinutes}m focus`
                          : ''}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.inspectorPlaceholderRow}>
                      <Info size={12} color={colors.textDim} />
                      <Text style={styles.inspectorPlaceholder}>
                        Tap any square to inspect activity
                      </Text>
                    </View>
                  )}

                  {/* Legend */}
                  <View style={styles.legendRow}>
                    <Text style={styles.legendLabel}>Less</Text>
                    {colorPalette.map((col, idx) => (
                      <View
                        key={idx}
                        style={[styles.legendSquare, { backgroundColor: col }]}
                      />
                    ))}
                    <Text style={styles.legendLabel}>More</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsStack}>
                {onStartFocusTimer && (
                  <TouchableOpacity
                    onPress={() => {
                      triggerHaptic('medium');
                      onClose();
                      onStartFocusTimer();
                    }}
                    activeOpacity={0.85}
                    style={styles.primaryFocusBtn}
                  >
                    <View style={styles.btnLeftGroup}>
                      <View style={styles.playIconCircle}>
                        <Play size={14} color="#FDE68A" />
                      </View>
                      <View>
                        <Text style={styles.primaryBtnTitle}>
                          Start 25m Focus Block
                        </Text>
                        <Text style={styles.primaryBtnSub}>
                          Timer logs focus directly to today's square
                        </Text>
                      </View>
                    </View>
                    <ArrowRight size={16} color="#FDE68A" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleQuickLog25m}
                  activeOpacity={0.85}
                  style={styles.quickLogBtn}
                >
                  <View style={styles.btnLeftGroup}>
                    <View style={styles.zapIconCircle}>
                      <Zap size={14} color="#059669" />
                    </View>
                    <View>
                      <Text style={styles.quickLogTitle}>Quick Log +25m Focus</Text>
                      <Text style={styles.quickLogSub}>
                        Increases today's green contribution square
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.quickLogBadge}>+25m</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end'
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: '#FDF9F1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  flameIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary
  },
  streakBadge: {
    backgroundColor: colors.bgHighlight,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  streakBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E',
    fontFamily: fonts.monoBold
  },
  modalSubtitle: {
    fontSize: 10.5,
    color: colors.textDim,
    fontFamily: fonts.regular,
    marginTop: 1
  },
  closeBtn: {
    padding: 6
  },
  scrollArea: {
    flexGrow: 0
  },
  scrollContent: {
    padding: 16,
    gap: 14
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderHairline
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4
  },
  metricLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    color: colors.textDim,
    fontFamily: fonts.monoBold
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: fonts.monoBold
  },
  metricUnit: {
    fontSize: 9,
    fontWeight: '500',
    color: colors.textDim,
    fontFamily: fonts.regular
  },
  heatmapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderHairline
  },
  heatmapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  heatmapTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.bold
  },
  themeToggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderRadius: 8,
    padding: 2
  },
  themeTab: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  themeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1
  },
  themeTabText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textDim,
    fontFamily: fonts.medium
  },
  themeTabTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontFamily: fonts.bold
  },
  gridScrollContainer: {
    paddingVertical: 4
  },
  gridColumnsWrapper: {
    flexDirection: 'row',
    gap: 3.5
  },
  weekColumn: {
    flexDirection: 'column',
    gap: 3.5
  },
  daySquare: {
    width: 10,
    height: 10,
    borderRadius: 2
  },
  todayRing: {
    borderWidth: 1.5,
    borderColor: colors.primary
  },
  selectedSquare: {
    transform: [{ scale: 1.3 }],
    borderWidth: 1.5,
    borderColor: colors.primaryDark
  },
  dayInspectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline
  },
  inspectorTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1
  },
  inspectorDate: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: fonts.monoBold
  },
  inspectorDetail: {
    fontSize: 10,
    color: colors.textMain,
    fontWeight: '600',
    fontFamily: fonts.medium
  },
  inspectorPlaceholderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  inspectorPlaceholder: {
    fontSize: 10,
    color: colors.textDim,
    fontFamily: fonts.regular
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  legendLabel: {
    fontSize: 8,
    color: colors.textDim,
    fontFamily: fonts.mono
  },
  legendSquare: {
    width: 7,
    height: 7,
    borderRadius: 1.5
  },
  actionsStack: {
    gap: 10
  },
  primaryFocusBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btnLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  playIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryBtnTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: fonts.bold
  },
  primaryBtnSub: {
    fontSize: 9.5,
    color: 'rgba(253, 230, 138, 0.85)',
    fontFamily: fonts.regular,
    marginTop: 1
  },
  quickLogBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  zapIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickLogTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.bold
  },
  quickLogSub: {
    fontSize: 9.5,
    color: colors.textDim,
    fontFamily: fonts.regular,
    marginTop: 1
  },
  quickLogBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    fontFamily: fonts.monoBold
  }
});
