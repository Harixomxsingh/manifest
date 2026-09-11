import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Linking
} from 'react-native';
import {
  X,
  Sun,
  Compass,
  Sparkles,
  Zap,
  BookOpen,
  Flame,
  Target,
  Shield,
  ArrowRight
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { triggerHaptic } from '../services/hapticsService';
import ManifestSunLogo from './ManifestSunLogo';

export default function AboutManifestModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
                <ManifestSunLogo size={28} interactive={false} />
                <View>
                  <View style={styles.titleRow}>
                    <Text style={styles.headerTitle}>About Manifest</Text>
                    <View style={styles.versionBadge}>
                      <Text style={styles.versionText}>v1.1.2</Text>
                    </View>
                  </View>
                  <Text style={styles.headerSubtitle}>
                    Purpose, Philosophy & Daily Benefits
                  </Text>
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

            {/* Content Scroll View */}
            <ScrollView
              style={styles.scrollArea}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Section 1: The Origin Card */}
              <View style={styles.originCard}>
                <View style={styles.sectionHeader}>
                  <Sun size={14} color="#D97706" />
                  <Text style={styles.sectionBadgeText}>WHY MANIFEST EXISTS</Text>
                </View>
                <Text style={styles.originHeadline}>
                  Every morning, you wake up at a critical crossroad.
                </Text>
                <Text style={styles.originBody}>
                  When we wake up, our body, mind, and consciousness often feel lazy, scattered, and groggy. Without a conscious anchor, we immediately default into reaction mode—checking notifications and surrendering our morning energy to outside noise.
                </Text>
                <Text style={styles.originBody}>
                  Manifest is a 2-minute recalibration ritual to shift you from a passive receiver of the world's noise into an active commander of your day.
                </Text>
              </View>

              {/* Section 2: The Two Core Pillars */}
              <View style={styles.sectionHeader}>
                <Compass size={14} color={colors.primaryDark} />
                <Text style={styles.sectionHeadingText}>THE TWO CORE PILLARS</Text>
              </View>

              {/* Pillar 1 */}
              <View style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={styles.numCircle}>
                    <Text style={styles.numCircleText}>1</Text>
                  </View>
                  <Text style={styles.pillarTitle}>Frictionless Clarity</Text>
                </View>
                <Text style={styles.pillarSubtitle}>
                  Speaking & Manifesting Out Loud
                </Text>
                <Text style={styles.cardBody}>
                  The moment you speak your thoughts out loud and journal what is within yourself, a powerful surge of energy is created. It crystallizes fuzzy morning thoughts into pinpoint priority and drives you with passion throughout the day.
                </Text>
              </View>

              {/* Pillar 2 */}
              <View style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={styles.numCircle}>
                    <Text style={styles.numCircleText}>2</Text>
                  </View>
                  <Text style={styles.pillarTitle}>Unshakable Optimism</Text>
                </View>
                <Text style={styles.pillarSubtitle}>
                  Rewiring for Solutions & Agency
                </Text>
                <Text style={styles.cardBody}>
                  The morning brain naturally carries a negativity bias. Manifest actively conditions an optimistic mindset—training you to look for solutions instead of obstacles and instilling deep belief in your own capability.
                </Text>
              </View>

              {/* Section 3: Daily Benefits */}
              <View style={styles.sectionHeader}>
                <Sparkles size={14} color={colors.primaryDark} />
                <Text style={styles.sectionHeadingText}>KEY TRANSFORMATIVE BENEFITS</Text>
              </View>

              {/* Benefit 1 */}
              <View style={styles.benefitTile}>
                <View style={styles.iconBoxAmber}>
                  <Zap size={14} color="#D97706" />
                </View>
                <View style={styles.benefitTextBox}>
                  <Text style={styles.benefitTitle}>High-Voltage Morning Energy & Drive</Text>
                  <Text style={styles.benefitDesc}>
                    Speaking your focus out loud awakens the nervous system and creates physical energy that powers your workday.
                  </Text>
                </View>
              </View>

              {/* Benefit 2 */}
              <View style={styles.benefitTile}>
                <View style={styles.iconBoxGreen}>
                  <BookOpen size={14} color="#059669" />
                </View>
                <View style={styles.benefitTextBox}>
                  <Text style={styles.benefitTitle}>1% Better Every Day via Wisdom</Text>
                  <Text style={styles.benefitDesc}>
                    Micro-dosing curated essays (Atomic Habits, Stoicism) builds an effortless daily reading habit that compounds your mindset.
                  </Text>
                </View>
              </View>

              {/* Benefit 3 */}
              <View style={styles.benefitTile}>
                <View style={styles.iconBoxAmber}>
                  <Flame size={14} color="#D97706" />
                </View>
                <View style={styles.benefitTextBox}>
                  <Text style={styles.benefitTitle}>Visual Proof of Consistency (52-Week Grid)</Text>
                  <Text style={styles.benefitDesc}>
                    Lighting up green contribution squares turns deep focus blocks into an earned badge of daily self-respect.
                  </Text>
                </View>
              </View>

              {/* Benefit 4 */}
              <View style={styles.benefitTile}>
                <View style={styles.iconBoxCyan}>
                  <Target size={14} color="#0284C7" />
                </View>
                <View style={styles.benefitTextBox}>
                  <Text style={styles.benefitTitle}>Frictionless 25-Minute Deep Flow</Text>
                  <Text style={styles.benefitDesc}>
                    Eliminates the painful gap between planning and doing with a 1-tap Pomodoro sprint that kicks off your #1 priority.
                  </Text>
                </View>
              </View>

              {/* Section 4: 120s Promise */}
              <View style={styles.promiseCard}>
                <Text style={styles.promiseTitle}>THE 120-SECOND PROMISE</Text>
                <Text style={styles.promiseBody}>
                  You don't need a 60-minute complex morning routine. Just 2 focused minutes of authentic manifestation will transform your workday and compound into an extraordinary year.
                </Text>
              </View>

              {/* Section 5: License & Attribution */}
              <View style={styles.footerNote}>
                <View style={styles.licenseRow}>
                  <Shield size={12} color={colors.primaryDark} />
                  <Text style={styles.licenseText}>
                    PolyForm Noncommercial License 1.0.0
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://harixomxsingh.github.io/portfolio/')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.authorLink}>
                    Crafted with ❤️ by <Text style={styles.authorUnderline}>Hariom Singh (Hari)</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.bottomActionBar}>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic('medium');
                  onClose();
                }}
                activeOpacity={0.85}
                style={styles.actionBtn}
              >
                <Text style={styles.actionBtnText}>Begin Today's Manifestation</Text>
                <ArrowRight size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'ios' ? 16 : 8
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDeep,
    fontFamily: fonts.bold
  },
  versionBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCD34D'
  },
  versionText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E',
    fontFamily: fonts.monoBold
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
    padding: 16,
    gap: 12
  },
  originCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    gap: 6
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4
  },
  sectionBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E',
    fontFamily: fonts.monoBold,
    letterSpacing: 0.8
  },
  sectionHeadingText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.8
  },
  originHeadline: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#78350F',
    fontFamily: fonts.bold,
    lineHeight: 18
  },
  originBody: {
    fontSize: 11,
    color: '#92400E',
    fontFamily: fonts.regular,
    lineHeight: 16
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    gap: 6
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  numCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  numCircleText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#92400E',
    fontFamily: fonts.monoBold
  },
  pillarTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: fonts.bold
  },
  pillarSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: fonts.bold
  },
  cardBody: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    lineHeight: 16
  },
  benefitTile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderHairline
  },
  iconBoxAmber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  iconBoxGreen: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  iconBoxCyan: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  benefitTextBox: {
    flex: 1
  },
  benefitTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.bold
  },
  benefitDesc: {
    fontSize: 10.5,
    color: colors.textDim,
    fontFamily: fonts.regular,
    lineHeight: 15,
    marginTop: 2
  },
  promiseCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
    gap: 4
  },
  promiseTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B45309',
    fontFamily: fonts.monoBold,
    letterSpacing: 0.8
  },
  promiseBody: {
    fontSize: 11,
    color: '#92400E',
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 16
  },
  footerNote: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
    marginTop: 4
  },
  licenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  licenseText: {
    fontSize: 9.5,
    color: colors.textDim,
    fontFamily: fonts.mono
  },
  authorLink: {
    fontSize: 10,
    color: colors.textDim,
    fontFamily: fonts.regular
  },
  authorUnderline: {
    color: colors.primaryDark,
    fontWeight: '700',
    textDecorationLine: 'underline'
  },
  bottomActionBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
    backgroundColor: '#FFFFFF'
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryDark,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: fonts.bold
  }
});
