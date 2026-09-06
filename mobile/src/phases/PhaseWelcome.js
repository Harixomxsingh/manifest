import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { ArrowRight, Sparkles, BookOpen, Sun, Shield } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function PhaseWelcome() {
  const { advancePhase, briefing, todayArticle, weatherData } = useApp();
  const [liveDate, setLiveDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const dayName = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const monthName = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const dayNum = now.getDate();
      setLiveDate(`${dayName}, ${monthName} ${dayNum}`);
    };
    update();
  }, []);

  return (
    <View style={styles.container}>
      {/* Date Pill Capsule */}
      <View style={styles.datePill}>
        <View style={styles.dateDot} />
        <Text style={styles.dateText}>{liveDate || 'TODAY'}</Text>
      </View>

      {/* Radiant Luminous Sun Icon */}
      <View style={styles.sunburstWrapper}>
        <View style={styles.sunburstOuter}>
          <View style={styles.sunburstInner}>
            <Sun size={40} color={colors.primary} strokeWidth={2} />
          </View>
        </View>
      </View>

      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>EXECUTIVE DAWN DISPATCH</Text>
      </View>

      {/* Section Title */}
      <Text style={styles.title}>Win the Morning, Win the Day</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Two minutes of deliberate clarity to silence the noise, ignite your momentum, and conquer what matters most.
      </Text>

      {/* 3-Pillar Preview Cards */}
      <View style={styles.previewGrid}>
        {/* 1. Identity */}
        <View style={styles.previewCard}>
          <View style={styles.previewIcon}>
            <Sparkles size={16} color={colors.primary} />
          </View>
          <View style={styles.previewTextContainer}>
            <Text style={styles.previewLabel}>1. IDENTITY</Text>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {briefing?.optimismAnchor?.title || 'The Arena, Not The Barrier'}
            </Text>
          </View>
        </View>

        {/* 2. Reading */}
        <View style={styles.previewCard}>
          <View style={styles.previewIcon}>
            <BookOpen size={16} color={colors.primary} />
          </View>
          <View style={styles.previewTextContainer}>
            <Text style={styles.previewLabel}>2. READING</Text>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {todayArticle?.title || 'James Clear Mindset'}
            </Text>
          </View>
        </View>

        {/* 3. Climate */}
        <View style={styles.previewCard}>
          <View style={styles.previewIcon}>
            <Sun size={16} color={colors.primary} />
          </View>
          <View style={styles.previewTextContainer}>
            <Text style={styles.previewLabel}>3. CLIMATE</Text>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {weatherData ? `${weatherData.highTemp}°C • ${weatherData.weatherLabel}` : 'Live Atmosphere'}
            </Text>
          </View>
        </View>
      </View>

      {/* Big Action Button */}
      <TouchableOpacity
        onPress={advancePhase}
        activeOpacity={0.85}
        style={styles.actionBtn}
      >
        <Text style={styles.actionBtnText}>Begin Morning Ritual</Text>
        <ArrowRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  dateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1
  },
  sunburstWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  sunburstOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(254, 243, 199, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(253, 230, 138, 0.6)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sunburstInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.bgHighlight,
    alignItems: 'center',
    justifyContent: 'center'
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
    fontSize: 26,
    fontWeight: '700',
    color: colors.textMain,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
    paddingHorizontal: 10
  },
  previewGrid: {
    width: '100%',
    gap: 8,
    marginBottom: 24
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard
  },
  previewIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgHighlight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewTextContainer: {
    flex: 1
  },
  previewLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 2
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMain
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
