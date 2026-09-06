import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export default function PartyPopper() {
  const { confettiTrigger } = useApp();

  if (confettiTrigger === 0) return null;

  return (
    <View pointerEvents="none" style={styles.container} key={confettiTrigger}>
      {/* Left Cannon */}
      <ConfettiCannon
        count={45}
        origin={{ x: 20, y: 0 }}
        autoStart={true}
        fadeOut={true}
        fallSpeed={2800}
        explosionSpeed={350}
        colors={['#D97706', '#F59E0B', '#FDE68A', '#10B981', '#FEF3C7', '#FF6B6B']}
      />
      {/* Right Cannon */}
      <ConfettiCannon
        count={45}
        origin={{ x: width - 20, y: 0 }}
        autoStart={true}
        fadeOut={true}
        fallSpeed={2800}
        explosionSpeed={350}
        colors={['#D97706', '#F59E0B', '#FDE68A', '#10B981', '#FEF3C7', '#3B82F6']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999
  }
});
