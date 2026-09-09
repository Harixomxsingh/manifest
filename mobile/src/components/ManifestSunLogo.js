import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Platform
} from 'react-native';
import Svg, {
  Circle,
  Path,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop
} from 'react-native-svg';
import { triggerHaptic } from '../services/hapticsService';
import { colors } from '../theme/colors';

const AnimatedView = Animated.View;

/**
 * Manifest Animated Sun Logo
 * - Layer 1: Breathing Golden Aura Halo (Soft 3.8s expansion)
 * - Layer 2: Slow Orbiting Solar Rays (12 geometric tapered beams, 24s smooth cycle)
 * - Layer 3: Luminous Solar Core (Radiant golden gradients)
 * - Layer 4: Interactive Touch Bloom & Haptic feedback
 *
 * @param {Object} props
 * @param {number} props.size - pixel dimension (default: 84)
 * @param {boolean} props.interactive - whether tapping triggers solar pulse (default: true)
 * @param {Function} props.onPress - optional callback on press
 */
export default function ManifestSunLogo({
  size = 84,
  interactive = true,
  onPress,
  style
}) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(1)).current;
  const tapScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Slow, majestic continuous orbital rotation for solar rays (24s / rotation)
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 24000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    );
    spinLoop.start();

    // 2. Gentle dawn breathing pulse for the radiant aura (3.8s cycle)
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.14,
          duration: 1900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(breathAnim, {
          toValue: 1.0,
          duration: 1900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );
    breathLoop.start();

    return () => {
      spinLoop.stop();
      breathLoop.stop();
    };
  }, []);

  const handlePress = () => {
    if (!interactive) return;
    triggerHaptic('light');

    Animated.sequence([
      Animated.timing(tapScale, {
        toValue: 0.9,
        duration: 90,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.spring(tapScale, {
        toValue: 1,
        friction: 3.5,
        tension: 45,
        useNativeDriver: true
      })
    ]).start();

    if (onPress) onPress();
  };

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const auraOpacity = breathAnim.interpolate({
    inputRange: [1, 1.14],
    outputRange: [0.35, 0.65]
  });

  const auraScale = breathAnim;

  // Proportional sizing
  const haloSize = size * 1.35;
  const svgSize = size;
  const center = svgSize / 2;
  const coreRadius = size * 0.24;
  const rayInnerRadius = size * 0.32;
  const rayOuterRadius = size * 0.46;

  // Generate 12 geometric solar rays
  const numRays = 12;
  const rays = Array.from({ length: numRays }).map((_, i) => {
    const angle = (i * 360) / numRays;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 3 === 0;
    const isMinor = i % 2 !== 0;

    const currentOuter = isMajor
      ? rayOuterRadius
      : isMinor
      ? rayOuterRadius * 0.82
      : rayOuterRadius * 0.92;

    const strokeWidth = isMajor ? size * 0.045 : isMinor ? size * 0.025 : size * 0.035;

    const x1 = center + rayInnerRadius * Math.cos(rad);
    const y1 = center + rayInnerRadius * Math.sin(rad);
    const x2 = center + currentOuter * Math.cos(rad);
    const y2 = center + currentOuter * Math.sin(rad);

    return (
      <Path
        key={i}
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke="url(#rayGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );
  });

  return (
    <TouchableOpacity
      activeOpacity={interactive ? 0.9 : 1}
      onPress={handlePress}
      disabled={!interactive && !onPress}
      style={[styles.container, { width: haloSize, height: haloSize }, style]}
    >
      {/* Layer 1: Breathing Solar Aura Ring */}
      <AnimatedView
        style={[
          styles.auraRing,
          {
            width: haloSize,
            height: haloSize,
            borderRadius: haloSize / 2,
            opacity: auraOpacity,
            transform: [{ scale: auraScale }]
          }
        ]}
      />

      {/* Layer 2: Secondary Soft Shimmer Corona */}
      <AnimatedView
        style={[
          styles.innerCorona,
          {
            width: size * 1.12,
            height: size * 1.12,
            borderRadius: (size * 1.12) / 2,
            transform: [{ scale: tapScale }]
          }
        ]}
      />

      {/* Layer 3: Rotating Solar Rays & Core SVG */}
      <AnimatedView
        style={[
          styles.svgWrapper,
          {
            width: svgSize,
            height: svgSize,
            transform: [{ scale: tapScale }]
          }
        ]}
      >
        <AnimatedView
          style={[
            styles.raysWrapper,
            {
              width: svgSize,
              height: svgSize,
              transform: [{ rotate: spinInterpolate }]
            }
          ]}
        >
          <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <Defs>
              <LinearGradient id="rayGradient" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#D97706" stopOpacity="0.95" />
                <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
              </LinearGradient>
            </Defs>
            <G>{rays}</G>
          </Svg>
        </AnimatedView>

        {/* Luminous Solar Core */}
        <View style={[styles.coreWrapper, { width: svgSize, height: svgSize }]}>
          <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <Defs>
              <RadialGradient
                id="coreGradient"
                cx="35%"
                cy="35%"
                r="65%"
                fx="35%"
                fy="35%"
              >
                <Stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
                <Stop offset="30%" stopColor="#FDE68A" stopOpacity="1" />
                <Stop offset="75%" stopColor="#F59E0B" stopOpacity="1" />
                <Stop offset="100%" stopColor="#D97706" stopOpacity="1" />
              </RadialGradient>
            </Defs>

            {/* Core Sun Circle */}
            <Circle
              cx={center}
              cy={center}
              r={coreRadius}
              fill="url(#coreGradient)"
            />

            {/* Inner Golden Rim Highlight */}
            <Circle
              cx={center}
              cy={center}
              r={coreRadius - 1.5}
              stroke="#FFFBEB"
              strokeWidth={size * 0.025}
              fill="transparent"
              strokeOpacity={0.65}
            />
          </Svg>
        </View>
      </AnimatedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  auraRing: {
    position: 'absolute',
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.28)'
  },
  innerCorona: {
    position: 'absolute',
    backgroundColor: 'rgba(253, 230, 138, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)'
  },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  raysWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  coreWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
