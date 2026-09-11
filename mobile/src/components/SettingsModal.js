import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import {
  X,
  Settings,
  Thermometer,
  Volume2,
  Trash2,
  Check,
  Shield,
  Sparkles,
  Info
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { triggerHaptic } from '../services/hapticsService';
import { useApp } from '../context/AppContext';

export default function SettingsModal({ isOpen, onClose }) {
  const { weatherData, resetRitual, setIsAboutOpen } = useApp();
  const [unit, setUnit] = useState('C'); // 'C' | 'F'
  const [speechSpeed, setSpeechSpeed] = useState(1.0);

  if (!isOpen) return null;

  const handleClearCache = () => {
    triggerHaptic('medium');
    Alert.alert(
      'Reset Daily Cache',
      'This will reset your cached today state and restart the morning cadence. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              triggerHaptic('success');
              resetRitual();
              onClose();
            } catch (e) {}
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <View style={styles.iconBox}>
                  <Settings size={18} color={colors.primaryDark} />
                </View>
                <View>
                  <Text style={styles.headerTitle}>App Settings</Text>
                  <Text style={styles.headerSubtitle}>Customize your morning manifestation</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  triggerHaptic('light');
                  onClose();
                }}
                activeOpacity={0.7}
                style={styles.closeBtn}
              >
                <X size={18} color={colors.textDim} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollArea}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Temperature Unit Setting */}
              <View style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <Thermometer size={16} color={colors.primaryDark} />
                  <Text style={styles.settingTitle}>Temperature Unit</Text>
                </View>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    onPress={() => {
                      triggerHaptic('selection');
                      setUnit('C');
                    }}
                    style={[
                      styles.toggleOption,
                      unit === 'C' && styles.toggleOptionActive
                    ]}
                  >
                    <Text style={[styles.toggleText, unit === 'C' && styles.toggleTextActive]}>
                      Celsius (°C)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      triggerHaptic('selection');
                      setUnit('F');
                    }}
                    style={[
                      styles.toggleOption,
                      unit === 'F' && styles.toggleOptionActive
                    ]}
                  >
                    <Text style={[styles.toggleText, unit === 'F' && styles.toggleTextActive]}>
                      Fahrenheit (°F)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Speech Narration Speed */}
              <View style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <Volume2 size={16} color={colors.primaryDark} />
                  <Text style={styles.settingTitle}>Audio Narration Speed</Text>
                </View>
                <View style={styles.toggleRow}>
                  {[0.8, 1.0, 1.2].map((speed) => (
                    <TouchableOpacity
                      key={speed}
                      onPress={() => {
                        triggerHaptic('selection');
                        setSpeechSpeed(speed);
                      }}
                      style={[
                        styles.toggleOption,
                        speechSpeed === speed && styles.toggleOptionActive
                      ]}
                    >
                      <Text style={[styles.toggleText, speechSpeed === speed && styles.toggleTextActive]}>
                        {speed}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Data & Privacy */}
              <View style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <Shield size={16} color={colors.primaryDark} />
                  <Text style={styles.settingTitle}>Privacy & Storage</Text>
                </View>
                <Text style={styles.privacyNote}>
                  All voice notes, reflections, and streak data remain 100% private and stored locally on your device.
                </Text>

                <TouchableOpacity
                  onPress={handleClearCache}
                  activeOpacity={0.7}
                  style={styles.dangerBtn}
                >
                  <Trash2 size={14} color="#EF4444" />
                  <Text style={styles.dangerBtnText}>Reset Today's Session Cache</Text>
                </TouchableOpacity>
              </View>

              {/* About Manifest Philosophy & Benefits */}
              <View style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <Sparkles size={16} color="#D97706" />
                  <Text style={styles.settingTitle}>About Manifest & Purpose</Text>
                </View>
                <Text style={styles.privacyNote}>
                  Learn why Manifest exists, the two core pillars (Frictionless Clarity & Unshakable Optimism), and daily transformative benefits.
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic('medium');
                    onClose();
                    if (setIsAboutOpen) setIsAboutOpen(true);
                  }}
                  activeOpacity={0.8}
                  style={styles.aboutBtn}
                >
                  <Sparkles size={14} color="#FFFFFF" />
                  <Text style={styles.aboutBtnText}>Read Purpose & 4 Core Benefits</Text>
                </TouchableOpacity>
              </View>

              {/* License & Copyright Card */}
              <View style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <Shield size={16} color={colors.primaryDark} />
                  <Text style={styles.settingTitle}>License & Copyright</Text>
                </View>
                <Text style={styles.privacyNote}>
                  © 2026 Hariom Singh (Hari). All rights reserved.{'\n'}
                  Licensed under the PolyForm Noncommercial License 1.0.0. Open for personal and educational use; commercial exploitation or monetization is strictly prohibited.
                </Text>
              </View>

              {/* App Version Info */}
              <View style={styles.aboutCard}>
                <Sparkles size={14} color={colors.primary} />
                <Text style={styles.aboutText}>
                  Morning Manifestation • v1.1.2 Native Android App
                </Text>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end'
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: '#FDF9F1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.bold
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: colors.textDim,
    fontFamily: fonts.regular,
    marginTop: 1
  },
  closeBtn: {
    padding: 6
  },
  scrollArea: {
    flexGrow: 0
  },
  scrollContent: {
    padding: 18,
    gap: 12
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    gap: 10
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  settingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.bold
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary || '#F5F5F4',
    borderRadius: 10,
    padding: 2,
    gap: 4
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  toggleOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textDim,
    fontFamily: fonts.medium
  },
  toggleTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontFamily: fonts.bold
  },
  privacyNote: {
    fontSize: 10.5,
    color: colors.textMuted,
    lineHeight: 16,
    fontFamily: fonts.regular
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4
  },
  dangerBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
    fontFamily: fonts.bold
  },
  aboutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D97706',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },
  aboutBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: fonts.bold
  },
  aboutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10
  },
  aboutText: {
    fontSize: 10,
    color: colors.textDim,
    fontFamily: fonts.mono
  }
});
