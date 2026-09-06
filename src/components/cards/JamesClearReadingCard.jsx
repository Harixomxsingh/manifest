import React from 'react';
import { BookOpen, ExternalLink, Shuffle, CheckCircle, Clock, History, Bookmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CATEGORY_COLORS = {
  'Continuous Improvement': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'Creativity': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  'Behavioral Psychology': 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  'Habits': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'Minimalism': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  'Business': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  'Personal Development': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'Practical Philosophy': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  'Fundamentals': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
};

export default function JamesClearReadingCard() {
  const { todayArticle, rerollArticle, markArticleAsRead, readHistory, setIsHistoryOpen, isGenerating } = useApp();

  const article = todayArticle || {
    id: '1-percent-rule',
    title: 'Continuous Improvement: How 1% Gains Lead to Massive Results',
    category: 'Continuous Improvement',
    readTime: '5 min read',
    hook: 'Small 1% improvements compound exponentially, turning tiny daily habits into massive long-term trajectories.',
    url: 'https://jamesclear.com/continuous-improvement',
    coreIdea: 'If you get 1% better each day for one year, you will end up 37 times better by the time you are done.'
  };

  const isReadToday = readHistory.some((item) => item.id === article.id);
  const colorClass = CATEGORY_COLORS[article.category] || 'bg-amber-500/15 text-amber-300 border-amber-500/30';

  if (isGenerating && !todayArticle) {
    return (
      <div className="rounded-2xl glass-card p-6 border border-white/[0.08] animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-16 bg-slate-800/40 rounded-xl mb-3" />
        <div className="h-10 bg-slate-800/30 rounded-lg" />
      </div>
    );
  }

  return (
    <section aria-labelledby="james-clear-reading-title" className="rounded-3xl glass-card relative overflow-hidden border border-white/[0.08] bg-[#0B0F17]/90">
      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono-code">
              Pillar 1 • James Clear Dynamic Reading
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsHistoryOpen(true)}
              title="View Reading History & Stats"
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/[0.08] transition-all flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">History</span>
              <span className="text-[11px] font-mono-code text-amber-400 font-semibold">({readHistory.length})</span>
            </button>

            <button
              onClick={rerollArticle}
              title="Shuffle another article"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/[0.08] transition-all"
            >
              <Shuffle className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Category & Read Time Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${colorClass}`}>
            {article.category}
          </span>
          <span className="text-xs text-slate-400 font-mono-code flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {article.readTime}
          </span>
        </div>

        {/* Article Title */}
        <h2
          id="james-clear-reading-title"
          className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2 leading-snug hover:text-amber-200 transition-colors"
        >
          {article.title}
        </h2>

        {/* 1-Sentence Hook */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {article.hook}
        </p>

        {/* Core Takeaway Box */}
        {article.coreIdea && (
          <div className="rounded-xl p-3.5 bg-slate-900/90 border border-white/[0.06] mb-5 text-xs text-slate-300 font-editorial italic">
            "{article.coreIdea}"
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Direct 1-Tap Link */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => markArticleAsRead(article.id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all transform active:scale-95"
          >
            <span>Read on JamesClear.com</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>

          {/* Mark as read button */}
          <button
            onClick={() => markArticleAsRead(article.id)}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              isReadToday
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-white/[0.08] hover:border-white/[0.15]'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${isReadToday ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{isReadToday ? 'Completed Today' : 'Mark as Read'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
