import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
  Dimensions
} from 'react-native';
import {
  Flame,
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { colors } from '../theme/colors';
import { triggerHaptic } from '../services/hapticsService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function StreakCelebrationModal({
  isOpen,
  onClose,
  streakCount = 1,
  onOpenHeatmap
}) {
  const confettiRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      triggerHaptic('success');
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Confetti Explosion Cannon */}
        <ConfettiCannon
          ref={confettiRef}
          count={75}
          origin={{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 3 }}
          fadeOut={true}
          autoStart={true}
          fallSpeed={3000}
          colors={['#F59E0B', '#10B981', '#3B82F6', '#D97706', '#EC4899']}
        />

        <View style={styles.cardContainer}>
          {/* Flame Halo Circle */}
          <View style={styles.flameCircle}>
            <Flame size={44} color="#FFFFFF" />
          </View>

          {/* Level Up Pill Badge */}
          <View style={styles.levelUpBadge}>
            <Zap size={11} color="#92400E" />
            <Text style={styles.levelUpText}>STREAK INCREASED!</Text>
          </View>

          {/* Main Title */}
          <Text style={styles.titleText}>
            {streakCount}-Day Streak! 🔥
          </Text>

          {/* Affirmation Subtext */}
          <Text style={styles.subtitleText}>
            You showed up and completed your morning ritual today. That's how champions build unstoppable daily momentum!
          </Text>

          {/* Green Contribution Box Lit Up Feedback Tile */}
          <View style={styles.greenFeedbackTile}>
            <View style={styles.feedbackLeft}>
              <View style={styles.greenDot} />
              <View>
                <Text style={styles.feedbackTitle}>Today's Focus Square Lit Up!</Text>
                <Text style={styles.feedbackSub}>Logged to your focus heatmap</Text>
              </View>
            </View>

            {onOpenHeatmap && (
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic('selection');
                  onClose();
                  onOpenHeatmap();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.viewCalendarText}>View Grid →</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            onPress={() => {
              triggerHaptic('medium');
              onClose();
            }}
            activeOpacity={0.85}
            style={styles.actionBtn}
          >
            <Text style={styles.actionBtnText}>View Today's Action Plan</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FDF9F1',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.borderHighlight,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 10
  },
  flameCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D97706',
    borderWidth: 3,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6
  },
  levelUpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 10
  },
  levelUpText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#92400E',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.8
  },
  titleText: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5
  },
  subtitleText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  greenFeedbackTile: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    marginBottom: 18
  },
  feedbackLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  greenDot: {
    width: 14,
    height: 14,
    borderRadius: 3.5,
    backgroundColor: '#30A14E',
    borderWidth: 1,
    borderColor: '#258d40'
  },
  feedbackTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary
  },
  feedbackSub: {
    fontSize: 9.5,
    color: colors.textDim
  },
  viewCalendarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669'
  },
  actionBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
