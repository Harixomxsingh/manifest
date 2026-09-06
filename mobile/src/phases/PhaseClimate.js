import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ArrowRight, Sun, CloudRain, Shirt, Umbrella, MapPin, RefreshCw } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function PhaseClimate() {
  const {
    advancePhase,
    weatherData,
    activeLocation,
    setIsLocationModalOpen,
    refreshGpsLocation
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const high = weatherData?.highTemp ?? 24;
  const low = weatherData?.lowTemp ?? 16;
  const unit = weatherData?.unit ?? '°C';
  const label = weatherData?.weatherLabel ?? 'Clear Sky';
  const rainProb = weatherData?.maxRainProb ?? 0;
  const locationName = weatherData?.locationName || activeLocation?.name || 'San Francisco, USA';
  const hourlyStrip = weatherData?.hourlyStrip || [
    { hour: '07:00', temp: low },
    { hour: '10:00', temp: Math.round((high + low) / 2) },
    { hour: '13:00', temp: high },
    { hour: '16:00', temp: high - 2 },
    { hour: '19:00', temp: low + 2 }
  ];

  const tactics = weatherData?.tactics || {
    clothingAdvice: 'Breathable natural fabrics. Comfortable morning temperature before midday.',
    commuteOrOutdoorGuidance: 'Optimal dry conditions. Complete errands before afternoon rain windows.'
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshGpsLocation();
    setIsRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Phase Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>PHASE 03 OF 04</Text>
          <Text style={styles.progressPhaseName}>The Outside World</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '75%' }]} />
        </View>
      </View>

      {/* Header & Location Pill */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.subtitle}>ATMOSPHERIC CLIMATE</Text>
          <Text style={styles.title}>Today's Atmosphere</Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsLocationModalOpen(true)}
          activeOpacity={0.8}
          style={styles.locationPill}
        >
          <MapPin size={12} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {locationName.split(',')[0]}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Master Climate Card */}
      <View style={styles.card}>
        {/* Temperature Lockup */}
        <View style={styles.tempRow}>
          <View style={styles.sunIconWrapper}>
            <Sun size={28} color={colors.primary} />
          </View>
          <View style={styles.tempTextCol}>
            <View style={styles.tempNumbersRow}>
              <Text style={styles.tempMain}>{high}{unit}</Text>
              <Text style={styles.tempLow}>/ {low}{unit} low</Text>
            </View>
            <Text style={styles.weatherStatus}>{label}</Text>
          </View>

          {/* Rain badge */}
          {rainProb > 15 ? (
            <View style={styles.rainBadge}>
              <CloudRain size={13} color={colors.primaryDeep} />
              <Text style={styles.rainBadgeText}>{rainProb}% Rain</Text>
            </View>
          ) : (
            <View style={styles.dryBadge}>
              <Sun size={12} color={colors.textDim} />
              <Text style={styles.dryBadgeText}>Dry Skies</Text>
            </View>
          )}
        </View>

        {/* 12-Hour Daylight Window Strip */}
        <View style={styles.hourlyContainer}>
          <Text style={styles.hourlyLabel}>12-HOUR DAYLIGHT HORIZON</Text>
          <View style={styles.hourlyGrid}>
            {hourlyStrip.map((item, idx) => (
              <View key={idx} style={styles.hourlyBox}>
                <Text style={styles.hourlyTime}>{item.hour}</Text>
                <Text style={styles.hourlyTemp}>{item.temp}°</Text>
                <View style={styles.hourlyDot} />
              </View>
            ))}
          </View>
        </View>

        {/* Tactical Guidance Box */}
        <View style={styles.tacticsGrid}>
          {/* Attire */}
          <View style={styles.tacticCard}>
            <View style={styles.tacticIcon}>
              <Shirt size={14} color={colors.primary} />
            </View>
            <View style={styles.tacticTextCol}>
              <Text style={styles.tacticTitle}>ATTIRE STRATEGY</Text>
              <Text style={styles.tacticDesc}>{tactics.clothingAdvice}</Text>
            </View>
          </View>

          {/* Commute */}
          <View style={styles.tacticCard}>
            <View style={styles.tacticIcon}>
              <Umbrella size={14} color={colors.primary} />
            </View>
            <View style={styles.tacticTextCol}>
              <Text style={styles.tacticTitle}>TRANSIT & COMMUTE</Text>
              <Text style={styles.tacticDesc}>{tactics.commuteOrOutdoorGuidance}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Big Action Button */}
      <TouchableOpacity
        onPress={advancePhase}
        activeOpacity={0.85}
        style={styles.actionBtn}
      >
        <Text style={styles.actionBtnText}>Acknowledge & Proceed</Text>
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
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  subtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1,
    marginBottom: 2
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textMain,
    letterSpacing: -0.4
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    maxWidth: 130
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMain
  },
  card: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: 20,
    padding: 16,
    gap: 16,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline
  },
  sunIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tempTextCol: {
    flex: 1,
    marginLeft: 12
  },
  tempNumbersRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6
  },
  tempMain: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textMain
  },
  tempLow: {
    fontSize: 12,
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  weatherStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    marginTop: 2
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  rainBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDeep
  },
  dryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.bgCardAlt,
    borderWidth: 1,
    borderColor: colors.borderCard
  },
  dryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textDim
  },
  hourlyContainer: {
    gap: 8
  },
  hourlyLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1
  },
  hourlyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6
  },
  hourlyBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.bgCardAlt,
    borderWidth: 1,
    borderColor: colors.borderCard,
    gap: 3
  },
  hourlyTime: {
    fontSize: 9,
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  hourlyTemp: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMain
  },
  hourlyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2
  },
  tacticsGrid: {
    gap: 8
  },
  tacticCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.bgCardAlt,
    borderWidth: 1,
    borderColor: colors.borderCard
  },
  tacticIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1
  },
  tacticTextCol: {
    flex: 1
  },
  tacticTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 2
  },
  tacticDesc: {
    fontSize: 11,
    color: colors.textMain,
    lineHeight: 16
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
