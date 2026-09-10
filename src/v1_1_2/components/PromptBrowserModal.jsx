import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Shuffle,
  Sparkles,
  Check,
  Compass,
  Target,
  Wind,
  Zap,
  Shield,
  Heart,
  Eye,
  UserCheck,
  BatteryCharging,
  Users,
  Lightbulb,
  Palette
} from 'lucide-react';
import voicePrompts from '../../data/voicePrompts.json';

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

  // Filter prompts by category and search query
  const filteredPrompts = useMemo(() => {
    return voicePrompts.filter((item, idx) => {
      const cat = item.category || 'General';
      const promptText = typeof item === 'string' ? item : item.prompt || '';
      const matchesCat = selectedCategory === 'All' || cat.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Quick Random Shuffle within current filtered view
  const handleRandomFromList = () => {
    if (filteredPrompts.length === 0) return;
    const randomItem = filteredPrompts[Math.floor(Math.random() * filteredPrompts.length)];
    const originalIndex = voicePrompts.findIndex((p) => p.prompt === randomItem.prompt);
    onSelectPrompt(randomItem, originalIndex >= 0 ? originalIndex : 0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-stone-50 rounded-3xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center border border-amber-200 text-amber-800">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  Morning Prompt Library
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-mono font-bold">
                  {voicePrompts.length} Prompts
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Cure morning mental fog with deep, intentional reflection prompts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomFromList}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-xs font-bold text-amber-900 transition-colors shadow-2xs"
              title="Pick a random prompt from active filter"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-700" />
              <span>Surprise Me</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar & Search */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-white/60 backdrop-blur-xs space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search prompts by keyword (e.g. fear, focus, energy, momentum, meeting)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-100/80 border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-700 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Pills Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Compass;
              const isSelected = selectedCategory === cat;
              const count =
                cat === 'All'
                  ? voicePrompts.length
                  : voicePrompts.filter((p) => p.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isSelected ? 'text-amber-200' : 'text-stone-400'}`} />
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-amber-900/60 text-amber-200' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12">
              <Compass className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-600">No matching prompts found</p>
              <p className="text-xs text-stone-400 mt-1">Try another keyword or category filter</p>
            </div>
          ) : (
            filteredPrompts.map((item, index) => {
              const promptText = typeof item === 'string' ? item : item.prompt;
              const cat = typeof item === 'object' && item.category ? item.category : 'Reflection';
              const originalIndex = voicePrompts.findIndex((p) => p.prompt === promptText);
              const isActive = originalIndex === currentPromptIndex;

              return (
                <div
                  key={item.id || index}
                  onClick={() => {
                    onSelectPrompt(item, originalIndex >= 0 ? originalIndex : 0);
                    onClose();
                  }}
                  className={`group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-amber-50/90 border-amber-300 shadow-xs ring-1 ring-amber-400/50'
                      : 'bg-white hover:bg-amber-50/30 border-stone-200 hover:border-amber-200 shadow-2xs'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-extrabold text-amber-800 uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100/70 border border-amber-200/50">
                        {cat}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1">
                          <Check className="w-3 h-3 text-amber-600" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-stone-900 text-sm sm:text-base font-medium leading-relaxed">
                      "{promptText}"
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPrompt(item, originalIndex >= 0 ? originalIndex : 0);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-center ${
                      isActive
                        ? 'bg-amber-800 text-white'
                        : 'bg-stone-100 group-hover:bg-amber-800 group-hover:text-white text-stone-700'
                    }`}
                  >
                    {isActive ? 'Selected' : 'Use This Prompt'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-stone-100/80 flex items-center justify-between text-xs text-stone-500">
          <span>Showing {filteredPrompts.length} of {voicePrompts.length} reflection prompts</span>
          <button
            onClick={handleRandomFromList}
            className="sm:hidden flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950"
          >
            <Shuffle className="w-3 h-3" /> Surprise Me
          </button>
        </div>
      </div>
    </div>
  );
}
