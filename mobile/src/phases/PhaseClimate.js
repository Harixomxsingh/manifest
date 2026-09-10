import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import {
  ArrowRight,
  Sun,
  CloudRain,
  CloudDrizzle,
  Cloud,
  CloudSun,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Shirt,
  Footprints,
  MapPin,
  RefreshCw,
  Umbrella
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

function categorizeWeather(code, label = '') {
  const lbl = (label || '').toLowerCase();
  if (code === 95 || code === 96 || lbl.includes('thunder') || lbl.includes('storm')) return 'thunderstorm';
  if (code === 65 || code === 82 || lbl.includes('heavy rain') || lbl.includes('violent')) return 'heavy_rain';
  if (code === 61 || code === 63 || code === 80 || code === 81 || lbl.includes('rain') || lbl.includes('shower')) return 'rain';
  if (code === 51 || code === 53 || code === 55 || lbl.includes('drizzle')) return 'drizzle';
  if (code === 71 || code === 73 || code === 75 || lbl.includes('snow')) return 'snow';
  if (code === 45 || code === 48 || lbl.includes('fog') || lbl.includes('mist')) return 'fog';
  if (code === 3 || lbl.includes('overcast')) return 'overcast';
  if (code === 2 || lbl.includes('partly')) return 'partly_cloudy';
  return 'clear';
}

function parseHourStringTo24(hourStr) {
  if (typeof hourStr === 'number') return hourStr;
  if (!hourStr) return 12;
  const str = String(hourStr).trim();
  if (str.includes(':')) {
    return parseInt(str.split(':')[0], 10) || 12;
  }
  const upper = str.toUpperCase();
  const num = parseInt(upper.replace(/[^0-9]/g, ''), 10) || 12;
  if (upper.includes('PM') && num < 12) return num + 12;
  if (upper.includes('AM') && num === 12) return 0;
  return num;
}

function getConditionIcon(cat, size = 32, color = colors.primary) {
  switch (cat) {
    case 'thunderstorm':
      return <CloudLightning size={size} color="#F59E0B" />;
    case 'heavy_rain':
    case 'rain':
      return <CloudRain size={size} color="#0284C7" />;
    case 'drizzle':
      return <CloudDrizzle size={size} color="#0EA5E9" />;
    case 'snow':
      return <CloudSnow size={size} color="#6366F1" />;
    case 'fog':
      return <CloudFog size={size} color="#64748B" />;
    case 'overcast':
      return <Cloud size={size} color="#64748B" />;
    case 'partly_cloudy':
      return <CloudSun size={size} color={color} />;
    case 'clear':
    default:
      return <Sun size={size} color={color} strokeWidth={1.8} />;
  }
}

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
  const maxRainProb = weatherData?.maxRainProb ?? 0;

  const dominantCategory = useMemo(() => {
    return categorizeWeather(weatherData?.weatherCode, label);
  }, [weatherData?.weatherCode, label]);

  const hourlyStrip = useMemo(() => {
    if (weatherData?.daytimeEntries && weatherData.daytimeEntries.length > 0) {
      const entries = weatherData.daytimeEntries;
      if (entries.length <= 5) return entries;
      const step = (entries.length - 1) / 4;
      return [0, 1, 2, 3, 4].map((i) => entries[Math.round(i * step)]);
    }
    return [
      { hour: '6 AM', hour24: 6, temp: low, code: dominantCategory === 'rain' ? 61 : dominantCategory === 'drizzle' ? 51 : 0, rainProb: dominantCategory === 'rain' ? 80 : 5 },
      { hour: '9 AM', hour24: 9, temp: Math.round((high + low) / 2), code: dominantCategory === 'rain' ? 61 : dominantCategory === 'drizzle' ? 51 : 1, rainProb: dominantCategory === 'rain' ? 90 : 10 },
      { hour: '12 PM', hour24: 12, temp: high, code: dominantCategory === 'rain' ? 65 : dominantCategory === 'drizzle' ? 53 : 0, rainProb: dominantCategory === 'rain' ? 98 : 15 },
      { hour: '3 PM', hour24: 15, temp: high - 2, code: dominantCategory === 'rain' ? 61 : dominantCategory === 'drizzle' ? 51 : 2, rainProb: dominantCategory === 'rain' ? 75 : 10 },
      { hour: '6 PM', hour24: 18, temp: low + 2, code: dominantCategory === 'rain' ? 51 : 0, rainProb: dominantCategory === 'rain' ? 40 : 5 }
    ];
  }, [weatherData, high, low, dominantCategory]);

  const currentHourIndex = useMemo(() => {
    if (!hourlyStrip || hourlyStrip.length === 0) return 0;
    const nowH = new Date().getHours();
    let bestIdx = 0;
    let minDiff = 999;
    hourlyStrip.forEach((item, idx) => {
      const itemH = item.hour24 ?? parseHourStringTo24(item.hour);
      const diff = Math.abs(itemH - nowH);
      if (diff < minDiff) {
        minDiff = diff;
        bestIdx = idx;
      }
    });
    return bestIdx;
  }, [hourlyStrip]);

  const [selectedHourIndex, setSelectedHourIndex] = useState(currentHourIndex);

  useEffect(() => {
    setSelectedHourIndex(currentHourIndex);
  }, [currentHourIndex]);

  const activeHourlyItem = hourlyStrip[selectedHourIndex] || hourlyStrip[0] || {};
  const isCurrentHour = selectedHourIndex === currentHourIndex;

  const displayTemp = activeHourlyItem.temp ?? high;
  const displayCode = activeHourlyItem.code ?? weatherData?.weatherCode ?? 0;
  const displayLabel = activeHourlyItem.label || label;
  const activeCategory = categorizeWeather(displayCode, displayLabel);
  const displayRainProb = activeHourlyItem.rainProb ?? maxRainProb;

  const minimalTactics = useMemo(() => {
    const isHot = displayTemp >= 28;
    const isCold = displayTemp <= 14;
    const hasRain = activeCategory === 'rain' || activeCategory === 'drizzle' || activeCategory === 'heavy_rain' || activeCategory === 'thunderstorm' || displayRainProb > 40;

    let apparelTitle = 'Breathable Cotton';
    let apparelSub = 'Optimal mild layers';
    if (isHot) {
      apparelTitle = 'Lightweight Linen';
      apparelSub = `Hot & Humid (${displayTemp}${unit})`;
    } else if (isCold) {
      apparelTitle = 'Thermal Layer';
      apparelSub = `Chilly ${low}${unit} morning`;
    } else if (hasRain) {
      apparelTitle = 'Waterproof Layer';
      apparelSub = 'Wet roadway conditions';
    }

    let tacticTitle = 'Optimal Morning Walk';
    let tacticSub = 'Dry window before 11 AM';

    if (activeCategory === 'thunderstorm') {
      tacticTitle = 'Transition Indoors';
      tacticSub = 'Active thunderstorm risk';
    } else if (hasRain) {
      tacticTitle = 'Carry Umbrella';
      tacticSub = displayRainProb > 0 ? `${displayRainProb}% Rain Risk Peak` : 'Precipitation expected';
    } else if (isHot) {
      tacticTitle = 'Early Walk Window';
      tacticSub = 'Walk before 10 AM (UV Peak)';
    }

    return { apparelTitle, apparelSub, tacticTitle, tacticSub };
  }, [displayTemp, low, unit, activeCategory, displayRainProb]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refreshGpsLocation) {
      await refreshGpsLocation();
    }
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

        {/* Dynamic Condition Icon & Temperature */}
        <View style={styles.tempCenter}>
          <View style={styles.weatherIconCircle}>
            {getConditionIcon(activeCategory, 36, colors.primary)}
          </View>
          <Text style={styles.tempValue}>{displayTemp}{unit}</Text>
          <View style={styles.conditionRow}>
            <Text style={styles.conditionText}>{displayLabel}</Text>
            {isCurrentHour ? (
              <View style={styles.nowBadge}>
                <Text style={styles.nowBadgeText}>NOW</Text>
              </View>
            ) : (
              <Text style={styles.hourBadgeText}>• {activeHourlyItem.hour}</Text>
            )}
            <Text style={styles.conditionText}>• Low {low}{unit}</Text>
          </View>
        </View>

        {/* Hourly Forecast Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hourlyList}
        >
          {hourlyStrip.map((item, idx) => {
            const hourCat = categorizeWeather(item.code);
            const isSlotActive = idx === selectedHourIndex;
            const isSlotCurrent = idx === currentHourIndex;

            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedHourIndex(idx)}
                activeOpacity={0.7}
                style={[
                  styles.hourlyItem,
                  isSlotActive && styles.hourlyItemActive,
                  isSlotCurrent && !isSlotActive && styles.hourlyItemCurrent
                ]}
              >
                {isSlotCurrent && (
                  <View style={styles.miniNowBadge}>
                    <Text style={styles.miniNowBadgeText}>NOW</Text>
                  </View>
                )}
                <Text style={[styles.hourlyTime, isSlotActive && styles.hourlyTimeActive]}>{item.hour}</Text>
                {getConditionIcon(hourCat, 15, isSlotActive ? colors.primaryDark : colors.primary)}
                <Text style={[styles.hourlyTemp, isSlotActive && styles.hourlyTempActive]}>{item.temp}°</Text>
                {item.rainProb > 25 && (
                  <Text style={styles.rainProbText}>{item.rainProb}%</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Minimal Actionable Glance Tags */}
        <View style={styles.tacticsRow}>
          <View style={styles.tacticItem}>
            <View style={styles.tacticIconBox}>
              <Shirt size={14} color={colors.primaryDark} />
            </View>
            <View style={styles.tacticTextBox}>
              <Text style={styles.tacticLabel}>APPAREL</Text>
              <Text style={styles.tacticTitle} numberOfLines={1}>{minimalTactics.apparelTitle}</Text>
              <Text style={styles.tacticSub} numberOfLines={1}>{minimalTactics.apparelSub}</Text>
            </View>
          </View>

          <View style={styles.tacticItem}>
            <View style={styles.tacticIconBox}>
              {activeCategory === 'rain' || activeCategory === 'drizzle' || activeCategory === 'heavy_rain' ? (
                <Umbrella size={14} color={colors.primaryDark} />
              ) : (
                <Footprints size={14} color={colors.primaryDark} />
              )}
            </View>
            <View style={styles.tacticTextBox}>
              <Text style={styles.tacticLabel}>TACTIC</Text>
              <Text style={styles.tacticTitle} numberOfLines={1}>{minimalTactics.tacticTitle}</Text>
              <Text style={styles.tacticSub} numberOfLines={1}>{minimalTactics.tacticSub}</Text>
            </View>
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
    marginBottom: 8
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
    marginVertical: 6
  },
  weatherIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.bgHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  tempValue: {
    fontSize: 38,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted
  },
  nowBadge: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10
  },
  nowBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  hourBadgeText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.textDim
  },
  hourlyList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12
  },
  hourlyItem: {
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
    minWidth: 54,
    position: 'relative'
  },
  hourlyItemActive: {
    backgroundColor: colors.bgHighlight,
    borderWidth: 1.5,
    borderColor: colors.primary
  },
  hourlyItemCurrent: {
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  miniNowBadge: {
    position: 'absolute',
    top: -6,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6
  },
  miniNowBadgeText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  hourlyTime: {
    fontSize: 9,
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  hourlyTimeActive: {
    color: colors.primaryDark,
    fontWeight: '700'
  },
  hourlyTemp: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary
  },
  hourlyTempActive: {
    color: colors.primaryDark,
    fontWeight: '800'
  },
  rainProbText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#0284C7',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  tacticsRow: {
    gap: 8,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
    paddingTop: 10
  },
  tacticItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12
  },
  tacticIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.bgHighlight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tacticTextBox: {
    flex: 1
  },
  tacticLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  tacticTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary
  },
  tacticSub: {
    fontSize: 10,
    color: colors.textDim
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
