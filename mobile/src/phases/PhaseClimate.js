import React, { useState, useMemo } from 'react';
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

  const category = useMemo(() => {
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
      { hour: '07:00', temp: low, code: category === 'rain' ? 61 : category === 'drizzle' ? 51 : 0, rainProb: category === 'rain' ? 80 : 5 },
      { hour: '10:00', temp: Math.round((high + low) / 2), code: category === 'rain' ? 61 : category === 'drizzle' ? 51 : 1, rainProb: category === 'rain' ? 90 : 10 },
      { hour: '13:00', temp: high, code: category === 'rain' ? 65 : category === 'drizzle' ? 53 : 0, rainProb: category === 'rain' ? 98 : 15 },
      { hour: '16:00', temp: high - 2, code: category === 'rain' ? 61 : category === 'drizzle' ? 51 : 2, rainProb: category === 'rain' ? 75 : 10 },
      { hour: '19:00', temp: low + 2, code: category === 'rain' ? 51 : 0, rainProb: category === 'rain' ? 40 : 5 }
    ];
  }, [weatherData, high, low, category]);

  const minimalTactics = useMemo(() => {
    const isHot = high >= 28;
    const isCold = high <= 14;
    const hasRain = category === 'rain' || category === 'drizzle' || category === 'heavy_rain' || category === 'thunderstorm' || maxRainProb > 40;

    let apparelTitle = 'Breathable Cotton';
    let apparelSub = 'Optimal mild layers';
    if (isHot) {
      apparelTitle = 'Lightweight Linen';
      apparelSub = `Hot & Humid (${high}${unit})`;
    } else if (isCold) {
      apparelTitle = 'Thermal Layer';
      apparelSub = `Chilly ${low}${unit} morning`;
    } else if (hasRain) {
      apparelTitle = 'Waterproof Layer';
      apparelSub = 'Wet roadway conditions';
    }

    let tacticTitle = 'Optimal Morning Walk';
    let tacticSub = 'Dry window before 11 AM';

    if (category === 'thunderstorm') {
      tacticTitle = 'Transition Indoors';
      tacticSub = 'Active thunderstorm risk';
    } else if (hasRain) {
      tacticTitle = 'Carry Umbrella';
      tacticSub = maxRainProb > 0 ? `${maxRainProb}% Rain Risk Peak` : 'Precipitation expected';
    } else if (isHot) {
      tacticTitle = 'Early Walk Window';
      tacticSub = 'Walk before 10 AM (UV Peak)';
    }

    return { apparelTitle, apparelSub, tacticTitle, tacticSub };
  }, [high, low, unit, category, maxRainProb]);

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
            {getConditionIcon(category, 36, colors.primary)}
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
          {hourlyStrip.map((item, idx) => {
            const hourCat = categorizeWeather(item.code);
            return (
              <View key={idx} style={[styles.hourlyItem, idx === 0 && styles.hourlyItemActive]}>
                <Text style={styles.hourlyTime}>{item.hour}</Text>
                {getConditionIcon(hourCat, 15, colors.primary)}
                <Text style={styles.hourlyTemp}>{item.temp}°</Text>
                {item.rainProb > 25 && (
                  <Text style={styles.rainProbText}>{item.rainProb}%</Text>
                )}
              </View>
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
              {category === 'rain' || category === 'drizzle' || category === 'heavy_rain' ? (
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
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2
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
    minWidth: 54
  },
  hourlyItemActive: {
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight
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
