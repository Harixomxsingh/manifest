import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import {
  X,
  Search,
  Calendar,
  Clock,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  Mic,
  PenTool,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  Volume2,
  Target,
  Zap,
  Smile
} from 'lucide-react-native';
import {
  getJournalVaultEntries,
  deleteJournalVaultRecord,
  playVoiceAudio,
  pauseVoiceAudio,
  stopVoiceAudio
} from '../services/voiceRecorderService';
import { triggerHaptic } from '../services/hapticsService';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useApp } from '../context/AppContext';

const TIME_FILTERS = [
  { id: 'all', label: 'All Time' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' }
];

export default function JournalVaultModal({ isOpen, onClose }) {
  const { setVoiceJournal } = useApp();

  const [timeRange, setTimeRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [entries, setEntries] = useState([]);

  // Playback state
  const [playingId, setPlayingId] = useState(null);
  const [playbackPos, setPlaybackPos] = useState(0);
  const [playbackTotal, setPlaybackTotal] = useState(1);

  const loadEntries = async () => {
    const list = await getJournalVaultEntries({
      timeRange,
      searchQuery,
      sortOrder
    });
    setEntries(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadEntries();
    } else {
      stopVoiceAudio();
      setPlayingId(null);
    }
  }, [isOpen, timeRange, searchQuery, sortOrder]);

  const handleTogglePlayback = async (item) => {
    triggerHaptic('light');
    if (!item.audioUri) return;

    if (playingId === item.id) {
      await pauseVoiceAudio();
      setPlayingId(null);
    } else {
      await stopVoiceAudio();
      setPlayingId(item.id);
      setPlaybackPos(0);
      setPlaybackTotal(item.durationMillis || 3000);

      await playVoiceAudio(item.audioUri, item.durationMillis || 3000, (status) => {
        if (status.didJustFinish) {
          setPlayingId(null);
          setPlaybackPos(0);
        } else {
          setPlaybackPos(status.positionMillis || 0);
          setPlaybackTotal(status.durationMillis || (item.durationMillis || 3000));
        }
      });
    }
  };

  const handleDelete = (id) => {
    triggerHaptic('medium');
    Alert.alert(
      'Delete Reflection',
      'Are you sure you want to delete this reflection from your vault?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (playingId === id) {
              await stopVoiceAudio();
              setPlayingId(null);
            }
            await deleteJournalVaultRecord(id);
            await loadEntries();
          }
        }
      ]
    );
  };

  const handleUseEntry = (item) => {
    triggerHaptic('success');
    if (setVoiceJournal) {
      setVoiceJournal(item);
    }
    onClose();
  };

  const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBadge}>
                <BookOpen size={18} color={colors.primaryDark} />
              </View>
              <View>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>Journal Vault & Archive</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{entries.length}</Text>
                  </View>
                </View>
                <Text style={styles.subtitle}>Your morning reflections, insights, and kinetic actions</Text>
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
              <X size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Search Bar & Sort Toggle */}
          <View style={styles.toolbar}>
            <View style={styles.searchContainer}>
              <Search size={14} color={colors.textDim} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search reflections or anchors..."
                placeholderTextColor={colors.textDim}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                  <X size={12} color={colors.textDim} />
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() => {
                triggerHaptic('light');
                setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'));
              }}
              activeOpacity={0.7}
              style={styles.sortBtn}
            >
              <ArrowUpDown size={12} color={colors.primaryDark} />
              <Text style={styles.sortText}>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</Text>
            </TouchableOpacity>
          </View>

          {/* Time Filter Pills */}
          <View style={styles.timeFilterRow}>
            {TIME_FILTERS.map((f) => {
              const isSelected = timeRange === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => {
                    triggerHaptic('light');
                    setTimeRange(f.id);
                  }}
                  activeOpacity={0.8}
                  style={[styles.timePill, isSelected && styles.timePillSelected]}
                >
                  <Text style={[styles.timePillText, isSelected && styles.timePillTextSelected]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Entries Scroll List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {entries.length === 0 ? (
              <View style={styles.emptyState}>
                <BookOpen size={36} color={colors.borderGold} />
                <Text style={styles.emptyTitle}>No Reflections Found</Text>
                <Text style={styles.emptySub}>
                  {searchQuery || timeRange !== 'all'
                    ? 'Try adjusting your search or time range filter'
                    : 'Complete Phase 03 to save your first reflection'}
                </Text>
              </View>
            ) : (
              entries.map((item) => {
                const isPlaying = playingId === item.id;
                const modeLabel =
                  item.type === 'hybrid'
                    ? 'Voice + Note'
                    : item.type === 'text'
                    ? 'Written Note'
                    : 'Voice Note';

                return (
                  <View key={item.id} style={styles.entryCard}>
                    {/* Top Row: Date, Mode Badge, Delete */}
                    <View style={styles.entryHeader}>
                      <View style={styles.dateGroup}>
                        <Clock size={11} color={colors.textDim} />
                        <Text style={styles.dateText}>{item.displayDate || 'Reflection'}</Text>
                        <View style={styles.modeBadge}>
                          {item.type === 'text' ? (
                            <PenTool size={9} color={colors.primaryDark} />
                          ) : (
                            <Mic size={9} color={colors.primaryDark} />
                          )}
                          <Text style={styles.modeText}>{modeLabel}</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleDelete(item.id)}
                        activeOpacity={0.7}
                        style={styles.deleteBtn}
                      >
                        <Trash2 size={13} color={colors.textDim} />
                      </TouchableOpacity>
                    </View>

                    {/* Prompt Box */}
                    {item.prompt ? (
                      <View style={styles.promptBox}>
                        <Text style={styles.promptText}>"{item.prompt}"</Text>
                      </View>
                    ) : null}

                    {/* Audio Player Strip */}
                    {item.audioUri ? (
                      <View style={styles.audioStrip}>
                        <TouchableOpacity
                          onPress={() => handleTogglePlayback(item)}
                          activeOpacity={0.8}
                          style={styles.playBtn}
                        >
                          {isPlaying ? (
                            <Pause size={12} color="#FFFFFF" />
                          ) : (
                            <Play size={12} color="#FFFFFF" />
                          )}
                        </TouchableOpacity>

                        <View style={styles.audioBarWrapper}>
                          <View style={styles.audioBarBg}>
                            <View
                              style={[
                                styles.audioBarFill,
                                {
                                  width: `${
                                    isPlaying && playbackTotal > 0
                                      ? (playbackPos / playbackTotal) * 100
                                      : 0
                                  }%`
                                }
                              ]}
                            />
                          </View>
                        </View>

                        <Text style={styles.audioTimeText}>
                          {isPlaying
                            ? formatDuration(playbackPos)
                            : formatDuration(item.durationMillis || 3000)}
                        </Text>
                      </View>
                    ) : null}

                    {/* Written Note Content */}
                    {item.text ? (
                      <View style={styles.textBox}>
                        <Text style={styles.textContent}>{item.text}</Text>
                      </View>
                    ) : null}

                    {/* Distilled Insights */}
                    {item.synthesis ? (
                      <View style={styles.synthesisBox}>
                        {item.synthesis.manifestationAnchor ? (
                          <View style={styles.anchorRow}>
                            <Target size={12} color={colors.primaryDark} style={styles.anchorIcon} />
                            <View style={styles.anchorContent}>
                              <Text style={styles.anchorLabel}>CORE FOCUS</Text>
                              <Text style={styles.anchorText}>
                                "{item.synthesis.manifestationAnchor}"
                              </Text>
                            </View>
                          </View>
                        ) : null}

                        {item.synthesis.kineticAction ? (
                          <View style={styles.actionRow}>
                            <Zap size={12} color={colors.primary} style={styles.actionIcon} />
                            <View style={styles.actionContent}>
                              <Text style={styles.actionLabel}>NEXT STEP</Text>
                              <Text style={styles.actionText}>
                                {item.synthesis.kineticAction}
                              </Text>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    ) : null}

                    {/* Footer: Load into Today's Focus */}
                    <TouchableOpacity
                      onPress={() => handleUseEntry(item)}
                      activeOpacity={0.8}
                      style={styles.loadBtn}
                    >
                      <CheckCircle2 size={12} color={colors.primaryDark} />
                      <Text style={styles.loadBtnText}>Load into Today's Focus</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.65)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FAFAF9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderWidth: 1,
    borderColor: colors.borderGold
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: fonts.bold
  },
  countBadge: {
    backgroundColor: colors.bgHighlight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: fonts.monoBold
  },
  subtitle: {
    fontSize: 11,
    color: colors.textDim,
    fontFamily: fonts.regular,
    marginTop: 1
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F5F5F4'
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: 12,
    paddingHorizontal: 10
  },
  searchIcon: {
    marginRight: 6
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    paddingVertical: 7
  },
  clearBtn: {
    padding: 4
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  sortText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: fonts.bold
  },
  timeFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline
  },
  timePill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderHairline
  },
  timePillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark
  },
  timePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: fonts.medium
  },
  timePillTextSelected: {
    color: '#FFFFFF',
    fontFamily: fonts.bold
  },
  listContent: {
    padding: 16,
    gap: 12
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    gap: 10
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.monoBold
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.bgHighlight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  modeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: fonts.bold
  },
  deleteBtn: {
    padding: 4
  },
  promptBox: {
    backgroundColor: colors.bgHighlight,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  promptText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.primaryDark,
    fontFamily: fonts.medium,
    lineHeight: 16
  },
  audioStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F5F4',
    padding: 8,
    borderRadius: 10
  },
  playBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  audioBarWrapper: {
    flex: 1
  },
  audioBarBg: {
    height: 4,
    backgroundColor: '#E7E5E4',
    borderRadius: 2,
    overflow: 'hidden'
  },
  audioBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2
  },
  audioTimeText: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.textDim
  },
  textBox: {
    backgroundColor: '#F5F5F4',
    padding: 10,
    borderRadius: 10
  },
  textContent: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 17
  },
  synthesisBox: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    paddingTop: 8
  },
  anchorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colors.bgHighlight,
    padding: 8,
    borderRadius: 8
  },
  anchorIcon: {
    marginTop: 2
  },
  anchorContent: {
    flex: 1
  },
  anchorLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5
  },
  anchorText: {
    fontSize: 11,
    fontStyle: 'italic',
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.primaryDark,
    lineHeight: 15
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F5F5F4',
    padding: 8,
    borderRadius: 8
  },
  actionIcon: {
    marginTop: 2
  },
  actionContent: {
    flex: 1
  },
  actionLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textDim,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: fonts.medium,
    lineHeight: 15
  },
  loadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: colors.bgHighlight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  loadBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: fonts.bold
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 8
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
    fontFamily: fonts.bold
  },
  emptySub: {
    fontSize: 12,
    color: colors.textDim,
    fontFamily: fonts.regular,
    textAlign: 'center',
    paddingHorizontal: 20
  }
});
