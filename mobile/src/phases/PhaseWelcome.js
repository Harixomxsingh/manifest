import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { ArrowRight, Sun, Sparkles, Shuffle } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

import ManifestSunLogo from '../components/ManifestSunLogo';

export default function PhaseWelcome() {
  const { advancePhase, todayQuote, shuffleDailyQuote } = useApp();
  const [liveDate, setLiveDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const monthName = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dayNum = now.getDate();
    setLiveDate(`${dayName}, ${monthName} ${dayNum}`);
  }, []);

  const quote = todayQuote || {
    quote: "You have power over your mind — not outside events. Realize this, and you will find immense strength.",
    author: "Marcus Aurelius",
    role: "Roman Emperor & Stoic Philosopher"
  };

  return (
    <View style={styles.container}>
      {/* Top Date Pill */}
      <View style={styles.datePill}>
        <Sparkles size={11} color={colors.primary} />
        <Text style={styles.dateText}>{liveDate || 'TODAY'}</Text>
      </View>

      {/* Animated Solar Dawn Logo */}
      <View style={styles.logoWrapper}>
        <ManifestSunLogo size={86} interactive={true} />
      </View>

      {/* Main Bold Inspiring Title */}
      <Text style={styles.title}>Manifest Within</Text>
      <Text style={styles.subtitle}>
        A two-minute ritual to command your mind and master your day.
      </Text>

      {/* Daily Ambitious Quote Card (Automatically rotates daily + shuffle button) */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          "{quote.quote}"
        </Text>

        <View style={styles.authorRow}>
          <View style={styles.authorCol}>
            <Text style={styles.authorName}>{quote.author}</Text>
            {quote.role ? (
              <Text style={styles.authorRole}>{quote.role}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={shuffleDailyQuote}
            activeOpacity={0.7}
            style={styles.shuffleBtn}
            accessibilityLabel="Shuffle Quote"
          >
            <Shuffle size={12} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Begin Ritual Button */}
      <TouchableOpacity
        onPress={advancePhase}
        activeOpacity={0.85}
        style={styles.actionBtn}
      >
        <Text style={styles.actionBtnText}>Begin Ritual</Text>
        <ArrowRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    marginBottom: 20
  },
  dateText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1
  },
  logoWrapper: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: '400',
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 6,
    letterSpacing: -0.4
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
    marginBottom: 20
  },
  quoteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 14
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
    paddingTop: 10
  },
  authorCol: {
    flex: 1
  },
  authorName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  authorRole: {
    fontSize: 9.5,
    color: colors.textDim,
    marginTop: 1
  },
  shuffleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    alignItems: 'center',
    justifyContent: 'center'
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
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3
  }
});
