import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform
} from 'react-native';
import {
  X,
  Search,
  Shuffle,
  Compass,
  Check,
  Target,
  Wind,
  Zap,
  Shield,
  Sparkles,
  Heart,
  Eye,
  UserCheck,
  BatteryCharging,
  Users,
  Lightbulb,
  Palette
} from 'lucide-react-native';
import { triggerHaptic } from '../services/hapticsService';
import { colors } from '../theme/colors';
import voicePrompts from '../data/voicePrompts.json';

const CATEGORY_ICONS = {
  All: Compass,
  Focus: Target,
  Release: Wind,
  Momentum: Zap,
  Stoic: Shield,
  Courage: Sparkles,
  Gratitude: Heart,
  Vision: Eye,
  Identity: UserCheck,
  Energy: BatteryCharging,
  Impact: Users,
  Reframe: Lightbulb,
  Creativity: Palette
};

export default function PromptBrowserModal({
  isOpen,
  onClose,
  onSelectPrompt,
  currentPromptIndex
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = useMemo(() => {
    const list = ['All'];
    voicePrompts.forEach((p) => {
      const cat = p.category || 'General';
      if (!list.includes(cat)) {
        list.push(cat);
      }
    });
    return list;
  }, []);

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    return voicePrompts.filter((item) => {
      const cat = item.category || 'General';
      const promptText = typeof item === 'string' ? item : item.prompt || '';
      const matchesCat =
        selectedCategory === 'All' || cat.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Surprise me random prompt
  const handleRandomPrompt = () => {
    triggerHaptic('medium');
    if (filteredPrompts.length === 0) return;
    const randomItem = filteredPrompts[Math.floor(Math.random() * filteredPrompts.length)];
    const originalIndex = voicePrompts.findIndex((p) => p.prompt === randomItem.prompt);
    onSelectPrompt(randomItem, originalIndex >= 0 ? originalIndex : 0);
    onClose();
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
                <Compass size={18} color={colors.primaryDark} />
              </View>
              <View>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>Prompt Library</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{voicePrompts.length}</Text>
                  </View>
                </View>
                <Text style={styles.subtitle}>Cure morning fog with deep reflection</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={handleRandomPrompt}
                activeOpacity={0.7}
                style={styles.surpriseBtn}
              >
                <Shuffle size={12} color={colors.primaryDark} />
                <Text style={styles.surpriseText}>Surprise</Text>
              </TouchableOpacity>

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
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={14} color={colors.textDim} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search prompts (e.g. fear, focus, energy)..."
              placeholderTextColor={colors.textDim}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchBtn}
              >
                <X size={12} color={colors.textDim} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Category Horizontal Pills */}
          <View style={styles.categoryScrollWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === 'All'
                    ? voicePrompts.length
                    : voicePrompts.filter((p) => p.category === cat).length;
                const Icon = CATEGORY_ICONS[cat] || Compass;

                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      triggerHaptic('light');
                      setSelectedCategory(cat);
                    }}
                    activeOpacity={0.8}
                    style={[
                      styles.categoryPill,
                      isSelected && styles.categoryPillSelected
                    ]}
                  >
                    <Icon
                      size={12}
                      color={isSelected ? '#FFFFFF' : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.categoryPillText,
                        isSelected && styles.categoryPillTextSelected
                      ]}
                    >
                      {cat}
                    </Text>
                    <View
                      style={[
                        styles.categoryCountBadge,
                        isSelected && styles.categoryCountBadgeSelected
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryCountText,
                          isSelected && styles.categoryCountTextSelected
                        ]}
                      >
                        {count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Prompts List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.promptsList}
          >
            {filteredPrompts.length === 0 ? (
              <View style={styles.emptyState}>
                <Compass size={32} color={colors.borderGold} />
                <Text style={styles.emptyTitle}>No prompts found</Text>
                <Text style={styles.emptySub}>Try searching for a different keyword</Text>
              </View>
            ) : (
              filteredPrompts.map((item, index) => {
                const promptText = typeof item === 'string' ? item : item.prompt;
                const cat =
                  typeof item === 'object' && item.category ? item.category : 'Reflection';
                const originalIndex = voicePrompts.findIndex((p) => p.prompt === promptText);
                const isActive = originalIndex === currentPromptIndex;

                return (
                  <TouchableOpacity
                    key={item.id || index}
                    onPress={() => {
                      triggerHaptic('success');
                      onSelectPrompt(item, originalIndex >= 0 ? originalIndex : 0);
                      onClose();
                    }}
                    activeOpacity={0.7}
                    style={[styles.promptItemCard, isActive && styles.promptItemCardActive]}
                  >
                    <View style={styles.promptItemHeader}>
                      <View style={styles.itemCategoryBadge}>
                        <Text style={styles.itemCategoryText}>{cat.toUpperCase()}</Text>
                      </View>
                      {isActive && (
                        <View style={styles.activeTag}>
                          <Check size={10} color={colors.primary} />
                          <Text style={styles.activeTagText}>Active</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.itemPromptText}>"{promptText}"</Text>

                    <View style={styles.itemFooter}>
                      <Text style={styles.usePromptAction}>Tap to use this prompt →</Text>
                    </View>
                  </TouchableOpacity>
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
    maxHeight: '90%',
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
    gap: 10
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
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  subtitle: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 1
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  surpriseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  surpriseText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F5F5F4'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
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
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 8
  },
  clearSearchBtn: {
    padding: 4
  },
  categoryScrollWrapper: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 6
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderHairline
  },
  categoryPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary
  },
  categoryPillTextSelected: {
    color: '#FFFFFF'
  },
  categoryCountBadge: {
    backgroundColor: '#F5F5F4',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8
  },
  categoryCountBadgeSelected: {
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  categoryCountText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  categoryCountTextSelected: {
    color: '#FFFFFF'
  },
  promptsList: {
    padding: 16,
    gap: 10
  },
  promptItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    gap: 6
  },
  promptItemCardActive: {
    backgroundColor: colors.bgHighlight,
    borderColor: colors.primary
  },
  promptItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemCategoryBadge: {
    backgroundColor: colors.bgHighlight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderHighlight
  },
  itemCategoryText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary
  },
  itemPromptText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontStyle: 'italic',
    lineHeight: 19
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 2
  },
  usePromptAction: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary
  },
  emptySub: {
    fontSize: 11,
    color: colors.textDim
  }
});
