import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const PHASES = [
  { id: 'welcome', label: 'Start' },
  { id: 'identity', label: '1. Identity' },
  { id: 'reading', label: '2. Reading' },
  { id: 'climate', label: '3. Climate' },
  { id: 'launch', label: '4. Launch' }
];

export default function BottomRitualBar() {
  const { activePhase, jumpToPhase } = useApp();

  const activeIndex = PHASES.findIndex((p) => p.id === activePhase);
  const progressPercent = Math.min(100, Math.max(0, (activeIndex / (PHASES.length - 1)) * 100));

  return (
    <View style={styles.container}>
      {/* Micro Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.row}>
        {PHASES.map((phase, idx) => {
          const isActive = activePhase === phase.id;
          const isDone = activeIndex > idx;

          return (
            <TouchableOpacity
              key={phase.id}
              onPress={() => jumpToPhase(phase.id)}
              activeOpacity={0.7}
              style={[
                styles.tabItem,
                isActive && styles.tabItemActive
              ]}
            >
              <View
                style={[
                  styles.tabDot,
                  isActive && styles.tabDotActive,
                  isDone && styles.tabDotDone
                ]}
              />
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                  isDone && styles.tabTextDone
                ]}
                numberOfLines={1}
              >
                {phase.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(253, 249, 241, 0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    paddingHorizontal: 12
  },
  progressBarBackground: {
    width: '100%',
    height: 3,
    backgroundColor: colors.borderHairline,
    borderRadius: 2,
    marginBottom: 8,
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
    justifyContent: 'space-between'
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 2
  },
  tabItemActive: {
    backgroundColor: colors.bgHighlight
  },
  tabDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.borderHairline,
    marginBottom: 4
  },
  tabDotActive: {
    backgroundColor: colors.primary,
    width: 6,
    height: 6
  },
  tabDotDone: {
    backgroundColor: colors.emerald
  },
  tabText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  tabTextActive: {
    color: colors.primaryDark,
    fontWeight: '700'
  },
  tabTextDone: {
    color: colors.textMuted
  }
});
