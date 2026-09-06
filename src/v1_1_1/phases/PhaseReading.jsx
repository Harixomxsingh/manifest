import React, { useState } from 'react';
import { ArrowRight, Bookmark, Type, Clock, ExternalLink, Lightbulb, Zap, Check, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { firePartyPopper } from '../../utils/confettiHelper';

const DEFAULT_ARTICLE = {
  id: 'essentialism-focus',
  title: "The Power of Less: How Saying No Protects Your Life's Work",
  category: 'Minimalism',
  readTime: '5 min read',
  hook: "Every time you say 'yes' to something minor, you are implicitly saying 'no' to the singular thing that truly moves the needle.",
  url: 'https://jamesclear.com/saying-no',
  coreIdea: 'Say no to almost everything so you can say an ecstatic, focused yes to what matters most.'
};

export default function PhaseReading({ onAdvance }) {
  const { todayArticle, markArticleAsRead } = useApp();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLeadFont, setIsLeadFont] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const rawArticle = todayArticle || DEFAULT_ARTICLE;
  const article = {
    id: rawArticle.id || DEFAULT_ARTICLE.id,
    title: rawArticle.title || DEFAULT_ARTICLE.title,
    category: rawArticle.category || DEFAULT_ARTICLE.category,
    readTime: rawArticle.readTime || DEFAULT_ARTICLE.readTime,
    hook: rawArticle.hook || DEFAULT_ARTICLE.hook,
    url: rawArticle.url || DEFAULT_ARTICLE.url,
    coreIdea: rawArticle.coreIdea || DEFAULT_ARTICLE.coreIdea
  };

  const handleFinish = (e) => {
    setIsFinished(true);
    markArticleAsRead(article.id);
    // Trigger motivational party popper celebration!
    firePartyPopper(e, {
      particleCount: 65,
      spread: 85,
      pitch: 1.1
    });
    setTimeout(() => {
      onAdvance();
    }, 280);
  };

  const hookText = article.hook || DEFAULT_ARTICLE.hook;
  const firstLetter = hookText ? hookText.charAt(0) : 'E';
  const restOfHook = hookText ? hookText.slice(1) : '';

  return (
    <div className="w-full max-w-[42rem] mx-auto flex flex-col items-center py-4 sm:py-8 animate-fadeIn">
      {/* Interactive reading tracker bar */}
      <div className="w-full mb-6 flex flex-col gap-2">
        <div className="w-full bg-[#ECE8E0] h-[3px] rounded-full overflow-hidden">
          <div className="h-full bg-[#D97706] rounded-full transition-all duration-300 ease-out w-[50%]" />
        </div>
        <div className="flex items-center justify-between text-xs text-[#8C827A] font-mono">
          <span>Ritual Reading • Step 2 of 4</span>
          <span className="text-[#B45309] font-medium">Phase 02 • Mindset Nutrition</span>
        </div>
      </div>

      <article className="w-full flex flex-col">
        {/* Meta Header */}
        <header className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-[11px] font-mono font-bold tracking-widest uppercase border border-[#D97706]/20 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              {article.category}
            </span>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F3EB] text-[#54524F] text-xs font-mono shadow-xs border border-[#ECE8E0]">
              <Clock className="w-3.5 h-3.5 text-[#D97706]" />
              <span className="uppercase tracking-wider text-[10px] font-semibold">{article.readTime}</span>
            </div>
          </div>

          <h1
            className="text-2xl sm:text-3xl text-[#1C1C17] tracking-tight font-normal leading-tight"
            style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
          >
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pb-2 border-b border-[#ECE8E0]">
            <div className="flex items-center gap-2 text-xs text-[#8C827A] font-mono">
              <span className="font-semibold text-[#1C1C17]">By James Clear</span>
              <span>•</span>
              <span>Curated for Daily Leverage</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLeadFont(!isLeadFont)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono transition-colors border ${
                  isLeadFont
                    ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                    : 'bg-[#F7F3EB] hover:bg-[#ECE8E0] text-[#54524F] border-[#ECE8E0]'
                }`}
                title="Adjust font scale"
              >
                <Type className="w-3.5 h-3.5" />
                <span className="uppercase text-[10px]">Format</span>
              </button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono transition-colors border ${
                  isBookmarked
                    ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                    : 'bg-[#F7F3EB] hover:bg-[#ECE8E0] text-[#54524F] border-[#ECE8E0]'
                }`}
                title="Save insight to reading archive"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="uppercase text-[10px]">{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Reading Body Content */}
        <div className={`flex flex-col gap-6 text-[#1C1C17] leading-relaxed ${isLeadFont ? 'text-lg' : 'text-base'}`}>
          {/* Paragraph 1 with Dropped Serif Initial */}
          <p className="relative text-justify md:text-left text-[#54524F]">
            <span
              className="float-left text-5xl leading-[0.85] pr-3 pt-1 font-normal text-[#B45309] select-none"
              style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
            >
              {firstLetter}
            </span>
            {restOfHook} Once momentum is initiated, the cognitive friction shifts. Starting is the singular constraint.
          </p>

          {/* Big Prominent Direct-to-Article Action Card & Button */}
          <a
            href={article.url || 'https://jamesclear.com/articles'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FEF3C7] via-[#FFFBEB] to-[#FEF3C7] border-2 border-[#FDE68A] hover:border-[#D97706] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-4 group cursor-pointer select-none"
          >
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-[#FDE68A] flex items-center justify-center text-[#B45309] shrink-0 group-hover:scale-105 group-hover:border-[#D97706]/40 transition-all">
                <BookOpen className="w-6 h-6 text-[#D97706]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B45309]">
                    Full Deep-Dive
                  </span>
                  <span className="text-[10px] font-mono text-[#8C827A]">• jamesclear.com</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-[#1C1C17] group-hover:text-[#903F00] transition-colors truncate">
                  Read Full Article on James Clear's Website
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#B45309] group-hover:bg-[#903F00] text-white font-semibold text-xs sm:text-sm shadow-md group-hover:shadow-lg transition-all shrink-0">
              <span>Read Full Article</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>

          {/* Key Insight Blockquote Box */}
          <aside className="relative my-1 p-6 rounded-2xl bg-[#F7F3EB] border border-[#D97706]/20 shadow-xs overflow-hidden group">
            <div className="absolute -right-3 -bottom-6 select-none pointer-events-none opacity-10 text-[#D97706] font-serif text-8xl font-bold">
              ”
            </div>

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#B45309]">
                <Lightbulb className="w-4 h-4 text-[#D97706]" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                  Foundational Axiom
                </span>
              </div>

              <blockquote
                className="text-lg sm:text-xl text-[#1C1C17] italic leading-relaxed font-normal"
                style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
              >
                “{article.coreIdea}”
              </blockquote>

              <div className="flex items-center justify-between pt-1 text-[#8C827A] text-xs font-mono">
                <span>— Atomic Habits Principles</span>
                <span className="opacity-75">Law of Compounding</span>
              </div>
            </div>
          </aside>

          {/* Vector Metric Formula Box */}
          <div className="p-5 rounded-2xl bg-white border border-[#ECE8E0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#B45309] shrink-0">
                <Zap className="w-5 h-5 text-[#D97706]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1C1C17] font-mono">Newtonian Force Vector</div>
                <div className="text-[11px] text-[#8C827A]">Focus (Mass) × Velocity (Acceleration) = Real Output</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-center">
              <div className="flex flex-col">
                <span
                  className="text-lg font-bold text-[#B45309]"
                  style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
                >
                  F = ma
                </span>
                <span className="text-[9px] font-mono uppercase text-[#8C827A]">Momentum</span>
              </div>
              <div className="w-px h-6 bg-[#ECE8E0]" />
              <div className="flex flex-col">
                <span
                  className="text-lg font-bold text-[#1C1C17]"
                  style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
                >
                  120s
                </span>
                <span className="text-[9px] font-mono uppercase text-[#8C827A]">Threshold</span>
              </div>
            </div>
          </div>

          <p className="text-[#54524F]">
            Protect your first working block today. When you start with clean intention, momentum carries your intellectual stamina into the remainder of the afternoon with effortless poise.
          </p>

          {/* Reflection Prompt Pill */}
          <div className="p-4 rounded-xl bg-[#ECE8E0]/60 border border-[#DDC1B3]/40 flex items-start gap-3">
            <span className="material-symbols-outlined text-[#D97706] text-[20px] mt-0.5">psychology_alt</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1C1C17] font-mono uppercase">Morning Application</span>
              <span className="text-xs text-[#54524F] mt-0.5">
                What is the single 2-minute action you can execute right after completing this ritual to anchor today’s kinetic flow?
              </span>
            </div>
          </div>
        </div>

        {/* Editorial Accent Divider */}
        <div className="flex items-center justify-center py-8 gap-3 text-[#DDC1B3]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DDC1B3]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#DDC1B3]" />
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#ECE8E0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={article.url || 'https://jamesclear.com/articles'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#54524F] hover:text-[#B45309] font-mono transition-colors"
          >
            <span>View original on jamesclear.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleFinish}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#B45309] text-white hover:bg-[#903F00] transition-all shadow-sm text-xs font-semibold active:scale-[0.98]"
          >
            {isFinished ? (
              <>
                <Check className="w-4 h-4" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <span>Finished Reading & Advance</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </article>
    </div>
  );
}
