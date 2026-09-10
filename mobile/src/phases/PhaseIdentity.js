import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { ArrowRight, Check } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../services/hapticsService';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function PhaseIdentity() {
  const { advancePhase, briefing } = useApp();
  const [isAffirmed, setIsAffirmed] = useState(false);

  const anchor = briefing?.optimismAnchor || {
    title: 'The Arena, Not The Barrier',
    content: 'Difficulties are not personal roadblocks; they are the exact raw material from which your resilience and sovereign character are forged.',
    identityReminder: 'I view every challenge today through an opportunistic and constructive lens.'
  };

  const handleToggleAffirm = () => {
    triggerHaptic('medium');
    setIsAffirmed(!isAffirmed);
  };

  return (
    <View style={styles.container}>
      {/* Top Phase Header Tracker */}
      <View style={styles.progressHeader}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>PHASE 01 OF 05</Text>
          <Text style={styles.progressPhaseName}>Identity Anchor</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '20%' }]} />
        </View>
      </View>

      {/* Main Minimalist Quote Card */}
      <View style={styles.card}>
        <Text style={styles.quotePillLabel}>MINDSET ANCHOR</Text>
        
        {/* The Core Quote */}
        <Text style={styles.quoteText}>
          "{anchor.identityReminder}"
        </Text>

        {/* Precise Supporting Essence */}
        <Text style={styles.supportText}>
          {anchor.content}
        </Text>

        {/* Minimal Checkbox Affirmation */}
        <TouchableOpacity
          onPress={handleToggleAffirm}
          activeOpacity={0.8}
          style={styles.toggleRow}
        >
          <View style={[styles.checkbox, isAffirmed && styles.checkboxActive]}>
            {isAffirmed && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
          </View>
          <Text style={styles.toggleText}>
            I choose to embody this today
          </Text>
        </TouchableOpacity>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity
        onPress={advancePhase}
        activeOpacity={0.85}
        style={styles.actionBtn}
      >
        <Text style={styles.actionBtnText}>Anchor Focus & Next</Text>
        <ArrowRight size={16} color="#FFFFFF" />
      </TouchableOpacity>
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
    fontFamily: fonts.monoBold,
    letterSpacing: 1
  },
  progressPhaseName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: fonts.bold
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
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2
  },
  quotePillLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 1,
    fontFamily: fonts.monoBold,
    marginBottom: 14
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: fonts.bold,
    marginBottom: 16
  },
  supportText: {
    fontSize: 12.5,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    fontFamily: fonts.regular,
    paddingHorizontal: 8,
    marginBottom: 18
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
    width: '100%',
    justifyContent: 'center'
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderHighlight,
    backgroundColor: colors.bgCardAlt,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textDim,
    fontFamily: fonts.medium
  },
  actionBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    letterSpacing: 0.3
  }
});

