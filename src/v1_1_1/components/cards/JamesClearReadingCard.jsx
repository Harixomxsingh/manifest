import React from 'react';
import { BookOpen, ExternalLink, Shuffle, CheckCircle, Clock, History } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { CATEGORY_COLORS } from '../../../components/cards/JamesClearReadingCard';

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
      <div className="rounded-3xl glass-card p-7 border border-white/[0.08] animate-pulse">
        <div className="h-5 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-16 bg-slate-800/40 rounded-2xl mb-3" />
        <div className="h-10 bg-slate-800/30 rounded-xl" />
      </div>
    );
  }

  return (
    <section aria-labelledby="v111-reading-title" className="rounded-3xl glass-card relative overflow-hidden border border-white/[0.08] bg-[#0A0E17]/90 p-6 sm:p-8">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-80 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-slate-400">
              Pillar 01 • James Clear Dynamic Reading
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHistoryOpen(true)}
              title="Reading History & Stats"
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono-code rounded-xl bg-slate-900 border border-white/[0.08] text-slate-300 hover:text-white transition-all"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Archive ({readHistory.length})</span>
            </button>

            <button
              onClick={rerollArticle}
              title="Shuffle article"
              className="p-1.5 rounded-xl bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-white transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category & Read Time Tags */}
        <div className="flex items-center gap-2.5">
          <span className={`text-[10px] font-mono-code font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${colorClass}`}>
            {article.category}
          </span>
          <span className="text-xs text-slate-400 font-mono-code flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {article.readTime}
          </span>
        </div>

        {/* Article Title */}
        <h2
          id="v111-reading-title"
          className="text-xl sm:text-2xl font-bold tracking-tight text-white font-editorial leading-snug"
        >
          {article.title}
        </h2>

        {/* Hook */}
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {article.hook}
        </p>

        {/* Core Takeaway Quote Box */}
        {article.coreIdea && (
          <div className="rounded-2xl p-4 bg-slate-900/90 border border-white/[0.06] text-xs sm:text-sm text-slate-300 font-editorial italic">
            "{article.coreIdea}"
          </div>
        )}

        {/* Actions Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => markArticleAsRead(article.id)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <span>Read on JamesClear.com</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>

          <button
            onClick={() => markArticleAsRead(article.id)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              isReadToday
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-mono-code'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-white/[0.08]'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${isReadToday ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{isReadToday ? 'Finished Today' : 'Mark as Read'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
