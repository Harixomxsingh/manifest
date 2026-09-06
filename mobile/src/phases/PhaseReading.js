import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { ArrowRight, BookOpen, Clock, ExternalLink, Lightbulb, Zap, Check } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function PhaseReading() {
  const { advancePhase, todayArticle } = useApp();
  const [isFinished, setIsFinished] = useState(false);

  const article = todayArticle || {
    id: 'essentialism-focus',
    title: "The Power of Less: How Saying No Protects Your Life's Work",
    category: 'Minimalism',
    readTime: '5 min read',
    hook: "Every time you say 'yes' to something minor, you are implicitly saying 'no' to the singular thing that truly moves the needle.",
    url: 'https://jamesclear.com/saying-no',
    coreIdea: 'Say no to almost everything so you can say an ecstatic, focused yes to what matters most.'
  };

  const handleOpenLink = () => {
    const url = article.url || 'https://jamesclear.com/articles';
    Linking.openURL(url).catch(() => {});
  };

  const handleProceed = () => {
    setIsFinished(true);
    advancePhase();
  };

  return (
    <View style={styles.container}>
      {/* Top Phase Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>PHASE 02 OF 04</Text>
          <Text style={styles.progressPhaseName}>Mindset Nutrition</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '50%' }]} />
        </View>
      </View>

      {/* Meta Bar */}
      <View style={styles.metaRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
        </View>
        <View style={styles.timePill}>
          <Clock size={12} color={colors.primary} />
          <Text style={styles.timeText}>{article.readTime}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.author}>By James Clear • Daily Leverage</Text>

      {/* Main Content Card */}
      <View style={styles.card}>
        {/* Hook */}
        <Text style={styles.hookText}>
          {article.hook}
        </Text>

        {/* Big Direct-to-Article Action Card */}
        <TouchableOpacity
          onPress={handleOpenLink}
          activeOpacity={0.85}
          style={styles.articleLinkCard}
        >
          <View style={styles.articleLinkLeft}>
            <View style={styles.articleLinkIcon}>
              <BookOpen size={18} color={colors.primary} />
            </View>
            <View style={styles.articleLinkTextWrapper}>
              <Text style={styles.articleLinkMeta}>FULL DEEP-DIVE • JAMESCLEAR.COM</Text>
              <Text style={styles.articleLinkTitle} numberOfLines={1}>
                Read Full Article Online
              </Text>
            </View>
          </View>
          <ExternalLink size={16} color={colors.primaryDark} />
        </TouchableOpacity>

        {/* Foundational Axiom Box */}
        <View style={styles.axiomBox}>
          <View style={styles.axiomHeader}>
            <Lightbulb size={16} color={colors.primary} />
            <Text style={styles.axiomLabel}>FOUNDATIONAL AXIOM</Text>
          </View>
          <Text style={styles.axiomQuote}>
            “{article.coreIdea}”
          </Text>
          <Text style={styles.axiomAuthor}>— Atomic Habits Principles</Text>
        </View>
      </View>

      {/* Big Action Button */}
      <TouchableOpacity
        onPress={handleProceed}
        activeOpacity={0.85}
        style={styles.actionBtn}
      >
        <Text style={styles.actionBtnText}>
          {isFinished ? 'Completed' : 'Finished Reading & Advance'}
        </Text>
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
  metaRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.bgCardAlt,
    borderWidth: 1,
    borderColor: colors.borderCard
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.textMain,
    textAlign: 'left',
    width: '100%',
    marginBottom: 4,
    letterSpacing: -0.3
  },
  author: {
    fontSize: 11,
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    width: '100%',
    marginBottom: 16
  },
  card: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2
  },
  hookText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 22
  },
  articleLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgHighlight,
    borderWidth: 1.5,
    borderColor: colors.borderHighlight,
    borderRadius: 14,
    padding: 12
  },
  articleLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  articleLinkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center'
  },
  articleLinkTextWrapper: {
    flex: 1
  },
  articleLinkMeta: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  articleLinkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain
  },
  axiomBox: {
    backgroundColor: colors.bgCardAlt,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: 14,
    padding: 14,
    gap: 6
  },
  axiomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  axiomLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  axiomQuote: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMain,
    fontStyle: 'italic',
    lineHeight: 19
  },
  axiomAuthor: {
    fontSize: 10,
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2
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
