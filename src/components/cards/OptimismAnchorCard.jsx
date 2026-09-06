import React, { useState } from 'react';
import { Sparkles, Quote, Copy, Check, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OptimismAnchorCard() {
  const { briefing, isGenerating } = useApp();
  const [copied, setCopied] = useState(false);

  const anchor = briefing?.optimismAnchor || {
    title: 'Architect of Leverage & Unshakeable Momentum',
    content: 'Today is an asymmetric opportunity. The friction you encounter is not a barrier; it is the raw material from which your competitive moat is built. Focus on compounding inputs.',
    identityReminder: 'I am a relentless, practical optimist who converts ambiguity into decisive execution.'
  };

  const handleCopy = () => {
    const textToCopy = `"${anchor.title}"\n${anchor.content}\n\nIdentity Anchor: ${anchor.identityReminder}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isGenerating && !briefing) {
    return (
      <div className="rounded-2xl glass-card p-6 border border-white/[0.08] animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-4 bg-slate-800 rounded w-full mb-2" />
        <div className="h-4 bg-slate-800 rounded w-4/5 mb-4" />
        <div className="h-10 bg-slate-800/60 rounded-xl" />
      </div>
    );
  }

  return (
    <section aria-labelledby="optimism-anchor-title" className="rounded-3xl glass-card relative overflow-hidden border border-amber-500/20 bg-gradient-to-b from-[#131926]/90 via-[#0C101A]/95 to-[#080B11]">
      {/* Golden Sunrise Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="p-6 sm:p-7 relative z-10">
        {/* Header Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90 font-mono-code">
              Pillar 6 • Identity & Resilience Anchor
            </span>
          </div>

          <button
            onClick={handleCopy}
            title="Copy mindset anchor"
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-white/[0.06] transition-all flex items-center gap-1 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Title */}
        <h2
          id="optimism-anchor-title"
          className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3 font-editorial leading-snug"
        >
          {anchor.title}
        </h2>

        {/* Main Content Quote */}
        <div className="relative mb-5 pl-4 border-l-2 border-amber-500/40 py-1">
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {anchor.content}
          </p>
        </div>

        {/* Bold Identity Grounding Bar */}
        <div className="rounded-xl p-4 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/25 flex items-start sm:items-center gap-3 shadow-inner">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5 sm:mt-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400/80 mb-0.5">
              Core Identity Declaration
            </div>
            <div className="text-sm font-semibold text-amber-100 italic">
              "{anchor.identityReminder}"
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
