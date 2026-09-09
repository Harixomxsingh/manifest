import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function PhaseReading() {
  const { advancePhase, todayArticle } = useApp();

  const article = todayArticle || {
    id: 'essentialism-focus',
    title: "The Power of Less",
    category: 'Minimalism',
    readTime: '3 min read',
    hook: "Every time you say 'yes' to something minor, you are implicitly saying 'no' to the singular thing that truly moves the needle.",
    url: 'https://jamesclear.com/saying-no',
    coreIdea: 'Say no to almost everything so you can say an ecstatic, focused yes to what matters most.'
  };

  const handleOpenLink = () => {
    const url = article.url || 'https://jamesclear.com/articles';
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      {/* Top Phase Header Tracker */}
      <View style={styles.progressHeader}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>PHASE 02 OF 05</Text>
          <Text style={styles.progressPhaseName}>Mindset Reading</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '40%' }]} />
        </View>
      </View>

      {/* Main Minimalist Reading Card */}
      <View style={styles.card}>
        <View style={styles.authorRow}>
          <BookOpen size={13} color={colors.primary} />
          <Text style={styles.authorText}>JAMES CLEAR • {article.category?.toUpperCase() || 'MINDSET'}</Text>
        </View>

        <Text style={styles.articleTitle}>{article.title}</Text>

        {/* The Core Idea Quote */}
        <View style={styles.quoteBox}>
          <Text style={styles.coreQuote}>
            “{article.coreIdea || article.hook}”
          </Text>
        </View>

        {/* Minimal Link */}
        <TouchableOpacity
          onPress={handleOpenLink}
          activeOpacity={0.7}
          style={styles.linkRow}
        >
          <Text style={styles.linkText}>Read full essay online</Text>
          <ExternalLink size={12} color={colors.textDim} />
        </TouchableOpacity>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity
        onPress={advancePhase}
        activeOpacity={0.85}
        style={styles.actionBtn}
      >
        <Text style={styles.actionBtnText}>Internalize & Proceed to Voice</Text>
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
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10
  },
  authorText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.8
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.3
  },
  quoteBox: {
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16
  },
  coreQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.primaryDark,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 8
  },
  linkText: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: '600'
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
