import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Sparkles, Shield, BookOpen, Mic, Sun, Compass, Check } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const PHASES = [
  { id: 'welcome', Icon: Sparkles, label: 'Start' },
  { id: 'identity', Icon: Shield, label: 'Identity' },
  { id: 'reading', Icon: BookOpen, label: 'Reading' },
  { id: 'voice', Icon: Mic, label: 'Voice' },
  { id: 'climate', Icon: Sun, label: 'Atmosphere' },
  { id: 'launch', Icon: Compass, label: 'Launchpad' }
];

export default function BottomRitualBar() {
  const { activePhase, jumpToPhase } = useApp();

  const activeIndex = PHASES.findIndex((p) => p.id === activePhase);
  const progressPercent = Math.min(100, Math.max(0, (activeIndex / (PHASES.length - 1)) * 100));

  return (
    <View style={styles.container}>
      {/* Illuminated Progress Beam */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.row}>
        {PHASES.map((phase, idx) => {
          const isActive = activePhase === phase.id;
          const isDone = activeIndex > idx;
          const IconComponent = phase.Icon;

          return (
            <TouchableOpacity
              key={phase.id}
              onPress={() => jumpToPhase(phase.id)}
              activeOpacity={0.7}
              style={[
                styles.tabItem,
                isActive && styles.tabItemActive,
                isDone && styles.tabItemDone
              ]}
              accessibilityLabel={phase.label}
            >
              <IconComponent
                size={isActive ? 19 : 17}
                color={
                  isActive
                    ? colors.primaryDark
                    : isDone
                    ? '#B45309'
                    : '#A8A29E'
                }
                strokeWidth={isActive ? 2.5 : isDone ? 2.2 : 1.7}
              />

              {/* Completed Illuminated Checkmark Badge */}
              {isDone && (
                <View style={styles.doneCheckBadge}>
                  <Check size={8} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}

              {/* Active Indicator Dot */}
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(253, 249, 241, 0.98)',
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 6,
    paddingHorizontal: 16
  },
  progressBarBackground: {
    width: '100%',
    height: 3,
    backgroundColor: '#E7E5E4',
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 40,
    borderRadius: 12,
    position: 'relative'
  },
  tabItemActive: {
    backgroundColor: 'rgba(217, 119, 6, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.4)'
  },
  tabItemDone: {
    backgroundColor: 'rgba(254, 243, 199, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)'
  },
  doneCheckBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeDot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primaryDark
  }
});
