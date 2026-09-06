import React, { useState } from 'react';
import { X, BookOpen, Clock, ExternalLink, Trash2, Award, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS } from './cards/JamesClearReadingCard';

export default function HistoryDrawer() {
  const { isHistoryOpen, setIsHistoryOpen, readHistory } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  if (!isHistoryOpen) return null;

  const categories = ['ALL', ...new Set(readHistory.map((item) => item.category))];
  const filteredHistory =
    selectedCategory === 'ALL'
      ? readHistory
      : readHistory.filter((item) => item.category === selectedCategory);

  const handleClear = () => {
    if (confirm('Clear your James Clear reading history?')) {
      localStorage.removeItem('manifest_jc_read_history');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-[#0D121C] border-l border-white/[0.1] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Reading History & Archive
              </h2>
              <p className="text-xs text-slate-400">
                Tracking 90-day anti-repetition cycle
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHistoryOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="p-4 bg-slate-900/60 border-b border-white/[0.06] grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 bg-slate-800/60 border border-white/[0.06] flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-xs text-slate-400">Articles Read</div>
              <div className="text-base font-bold text-white font-mono-code">
                {readHistory.length}
              </div>
            </div>
          </div>

          <div className="rounded-xl p-3 bg-slate-800/60 border border-white/[0.06] flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-xs text-slate-400">Streak Potential</div>
              <div className="text-base font-bold text-white font-mono-code">
                {Math.min(readHistory.length, 7)} Days
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="px-4 py-2.5 border-b border-white/[0.06] flex gap-1.5 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* List of Read Articles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, idx) => {
              const colorClass =
                CATEGORY_COLORS[item.category] || 'bg-amber-500/15 text-amber-300 border-amber-500/30';
              const readDate = new Date(item.readAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={idx}
                  className="rounded-xl p-3.5 bg-slate-900/80 border border-white/[0.08] hover:border-amber-500/30 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colorClass}`}
                    >
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono-code">{readDate}</span>
                  </div>

                  <div className="text-sm font-semibold text-white leading-snug">
                    {item.title}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-mono-code flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.readTime || '5 min'}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium hover:underline"
                    >
                      Re-read <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No read articles recorded yet. Mark articles as read to populate your history.
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {readHistory.length > 0 && (
          <div className="p-4 border-t border-white/[0.08] bg-slate-950/60 flex justify-between items-center">
            <button
              onClick={handleClear}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-500/10 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <span className="text-[11px] text-slate-500 font-mono-code">
              Anti-Repetition Active
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
