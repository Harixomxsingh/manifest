import React from 'react';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PhaseReading({ onAdvance }) {
  const { todayArticle } = useApp();

  const article = todayArticle || {
    id: 'essentialism-focus',
    title: "The Power of Less",
    category: 'Minimalism',
    readTime: '3 min read',
    hook: "Every time you say 'yes' to something minor, you are implicitly saying 'no' to the singular thing that truly moves the needle.",
    url: 'https://jamesclear.com/saying-no',
    coreIdea: 'Say no to almost everything so you can say an ecstatic, focused yes to what matters most.'
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 max-w-lg mx-auto animate-fade-in w-full">
      {/* Top Tracker */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#A8A29E] tracking-wider mb-2">
          <span>PHASE 02 OF 05</span>
          <span className="text-[#78350F]">Mindset Reading</span>
        </div>
        <div className="w-full h-1 bg-[#E7E5E4] rounded-full overflow-hidden">
          <div className="w-2/5 h-full bg-[#78350F] rounded-full" />
        </div>
      </div>

      {/* Main Reading Card */}
      <div className="w-full bg-white border border-[#E7E5E4] rounded-2xl p-6 sm:p-7 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[10px] font-mono font-extrabold text-[#78350F] tracking-wider uppercase">
            JAMES CLEAR • {article.category?.toUpperCase() || 'MINDSET'}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C17] tracking-tight mb-4">
          {article.title}
        </h2>

        {/* Foundational Axiom Box */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 sm:p-5 mb-5">
          <p className="font-serif italic text-base sm:text-lg text-[#78350F] leading-relaxed">
            “{article.coreIdea || article.hook}”
          </p>
        </div>

        {/* External Link */}
        <a
          href={article.url || 'https://jamesclear.com/articles'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78716C] hover:text-[#78350F] transition-colors"
        >
          <span>Read full essay on JamesClear.com</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Proceed Button */}
      <button
        onClick={onAdvance}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#78350F] hover:bg-[#92400E] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-98"
      >
        <span>Internalize & Next</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
