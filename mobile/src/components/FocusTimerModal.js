import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform
} from 'react-native';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Target,
  CheckCircle2
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { triggerHaptic } from '../services/hapticsService';
import { recordFocusSession } from '../services/streakService';

export default function FocusTimerModal({
  isOpen,
  onClose,
  initialMinutes = 25,
  currentFocusText = ''
}) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(initialMinutes * 60);
      setIsActive(false);
      setCompleted(false);
    }
  }, [isOpen, initialMinutes]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setCompleted(true);
      triggerHaptic('success');
      recordFocusSession(initialMinutes);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, initialMinutes]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressRatio = 1 - timeLeft / (initialMinutes * 60);

  const toggleTimer = () => {
    triggerHaptic('medium');
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    triggerHaptic('light');
    setIsActive(false);
    setTimeLeft(initialMinutes * 60);
    setCompleted(false);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.cardContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBox}>
                <Clock size={16} color={colors.primaryDark} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Deep Focus Block</Text>
                <Text style={styles.headerSubtitle}>{initialMinutes}-minute flow sprint</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
              <X size={18} color={colors.textDim} />
            </TouchableOpacity>
          </View>

          {/* Focus Goal Pill */}
          {currentFocusText ? (
            <View style={styles.goalBox}>
              <Target size={13} color={colors.primaryDark} />
              <Text style={styles.goalText} numberOfLines={2}>
                "{currentFocusText}"
              </Text>
            </View>
          ) : null}

          {/* Big Timer Display */}
          <View style={styles.timerDisplayContainer}>
            <Text style={styles.timerDigits}>{formattedTime}</Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.round(progressRatio * 100)}%` }
                ]}
              />
            </View>
            <Text style={styles.timerStatus}>
              {completed
                ? '🎉 Session Completed! +25m Logged'
                : isActive
                ? '⚡ Flow State Active'
                : 'Paused'}
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              onPress={toggleTimer}
              activeOpacity={0.85}
              style={[
                styles.mainControlBtn,
                isActive && styles.mainControlBtnActive
              ]}
            >
              {isActive ? (
                <>
                  <Pause size={16} color="#FFFFFF" />
                  <Text style={styles.mainControlText}>Pause</Text>
                </>
              ) : (
                <>
                  <Play size={16} color="#FFFFFF" />
                  <Text style={styles.mainControlText}>Start Sprint</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={resetTimer}
              activeOpacity={0.7}
              style={styles.resetBtn}
            >
              <RotateCcw size={16} color={colors.textDim} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  cardContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FDF9F1',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.textDim
  },
  closeBtn: {
    padding: 4
  },
  goalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    marginBottom: 16
  },
  goalText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1
  },
  timerDisplayContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderHairline,
    marginBottom: 16
  },
  timerDigits: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: -1
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.borderHairline,
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 8,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primaryDark,
    borderRadius: 2
  },
  timerStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  mainControlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primaryDark,
    paddingVertical: 13,
    borderRadius: 20
  },
  mainControlBtnActive: {
    backgroundColor: '#B45309'
  },
  mainControlText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderHairline,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
