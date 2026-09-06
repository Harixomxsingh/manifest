import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Image } from 'react-native';
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../services/hapticsService';
import { colors } from '../theme/colors';

export default function PhaseIdentity() {
  const { advancePhase, briefing } = useApp();
  const [isAffirmed, setIsAffirmed] = useState(false);

  const anchor = briefing?.optimismAnchor || {
    title: 'The Arena, Not The Barrier',
    content: 'Whatever circumstance arrives today—friction in communication, unexpected delays, or chaotic demands—look immediately for the leverage point. Difficulties are not personal roadblocks; they are the exact raw material from which your resilience and character are forged.',
    identityReminder: 'I view every challenge today through an opportunistic and constructive lens.'
  };

  const handleToggleAffirm = () => {
    triggerHaptic('medium');
    setIsAffirmed(!isAffirmed);
  };

  return (
    <View style={styles.container}>
      {/* Top Phase Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>PHASE 01 OF 04</Text>
          <Text style={styles.progressPhaseName}>Identity & Agency</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '25%' }]} />
        </View>
      </View>

      {/* Emblem */}
      <View style={styles.emblemBadge}>
        <Sparkles size={24} color={colors.primary} />
      </View>

      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>IDENTITY LENS • UNSHAKEABLE AGENCY</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{anchor.title || 'The Arena, Not The Barrier'}</Text>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.cardParagraph}>
          {anchor.content}
        </Text>

        {/* Core Affirmation Callout */}
        <View style={styles.affirmationBox}>
          <View style={styles.affirmationHeader}>
            <ShieldCheck size={16} color={colors.primaryDark} />
            <Text style={styles.affirmationLabel}>CORE AFFIRMATION</Text>
          </View>
          <Text style={styles.affirmationQuote}>
            "{anchor.identityReminder}"
          </Text>
        </View>

        {/* Checkmark Habit Toggle */}
        <TouchableOpacity
          onPress={handleToggleAffirm}
          activeOpacity={0.8}
          style={styles.toggleRow}
        >
          <View style={[styles.checkbox, isAffirmed && styles.checkboxActive]}>
            {isAffirmed && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
          </View>
          <Text style={styles.toggleText}>
            Internalized into today’s presence
          </Text>
        </TouchableOpacity>
      </View>

      {/* Big Proceed Button */}
      <TouchableOpacity
        onPress={advancePhase}
        activeOpacity={0.85}
        style={styles.actionBtn}
      >
        <Text style={styles.actionBtnText}>Anchor Mindset & Proceed to Reading</Text>
        <ArrowRight size={18} color="#FFFFFF" />
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  progressPhaseName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark
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
    backgroundColor: colors.primary,
    borderRadius: 2
  },
  emblemBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    marginBottom: 10
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textMain,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.4
  },
  card: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2
  },
  cardParagraph: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20
  },
  affirmationBox: {
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    borderRadius: 14,
    padding: 14,
    gap: 6
  },
  affirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  affirmationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  affirmationQuote: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDeep,
    fontStyle: 'italic',
    lineHeight: 20
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted
  },
  actionBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryDark,
    paddingVertical: 15,
    borderRadius: 28,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
