import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ArrowRight, Sun, CloudRain, Cloud, Shirt, Footprints, MapPin, RefreshCw } from 'lucide-react-native';
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
      {/* Top Phase Header Tracker */}
      <View style={styles.progressHeader}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>PHASE 04 OF 05</Text>
          <Text style={styles.progressPhaseName}>Atmospheric Climate</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '80%' }]} />
        </View>
      </View>

      {/* Main Minimalist Climate Card */}
      <View style={styles.card}>
        {/* Location & Refresh Header */}
        <View style={styles.locationHeaderRow}>
          <TouchableOpacity
            onPress={() => setIsLocationModalOpen(true)}
            activeOpacity={0.7}
            style={styles.locationPill}
          >
            <MapPin size={11} color={colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>{locationName.split(',')[0]}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRefresh}
            activeOpacity={0.7}
            style={styles.refreshBtn}
          >
            <RefreshCw size={12} color={colors.textDim} />
          </TouchableOpacity>
        </View>

        {/* Temperature & Weather Symbol */}
        <View style={styles.tempCenter}>
          <View style={styles.weatherIconCircle}>
            <Sun size={32} color={colors.primary} strokeWidth={1.8} />
          </View>
          <Text style={styles.tempValue}>{high}{unit}</Text>
          <Text style={styles.conditionText}>{label} • Low {low}{unit}</Text>
        </View>

        {/* Hourly Forecast Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hourlyList}
        >
          {hourlyStrip.map((item, idx) => (
            <View key={idx} style={styles.hourlyItem}>
              <Text style={styles.hourlyTime}>{item.hour}</Text>
              <Sun size={14} color={colors.primary} />
              <Text style={styles.hourlyTemp}>{item.temp}°</Text>
            </View>
          ))}
        </ScrollView>

        {/* Minimal Tactics Pillars */}
        <View style={styles.tacticsRow}>
          <View style={styles.tacticItem}>
            <Shirt size={14} color={colors.primaryDark} />
            <Text style={styles.tacticText} numberOfLines={2}>{tactics.clothingAdvice}</Text>
          </View>

          <View style={styles.tacticItem}>
            <Footprints size={14} color="#D97706" />
            <Text style={styles.tacticText} numberOfLines={2}>{tactics.commuteOrOutdoorGuidance}</Text>
          </View>
        </View>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity
        onPress={advancePhase}
        activeOpacity={0.85}
        style={styles.actionBtn}
      >
        <Text style={styles.actionBtnText}>Proceed to Summary</Text>
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
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2
  },
  locationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bgHighlight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  locationText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark
  },
  refreshBtn: {
    padding: 4
  },
  tempCenter: {
    alignItems: 'center',
    marginVertical: 8
  },
  weatherIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bgHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  tempValue: {
    fontSize: 36,
    fontWeight: '300',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
  },
  conditionText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  hourlyList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 14
  },
  hourlyItem: {
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
    minWidth: 54
  },
  hourlyTime: {
    fontSize: 9,
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  hourlyTemp: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary
  },
  tacticsRow: {
    gap: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
    paddingTop: 12
  },
  tacticItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10
  },
  tacticText: {
    flex: 1,
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 15
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
    letterSpacing: 0.3
  }
});
