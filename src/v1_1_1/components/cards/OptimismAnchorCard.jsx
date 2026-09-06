import React, { useState } from 'react';
import { Sparkles, Copy, Check, Shield, Compass, Quote } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

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
      <div className="rounded-3xl glass-card p-7 border border-white/[0.08] animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-4 bg-slate-800 rounded w-full mb-2" />
        <div className="h-4 bg-slate-800 rounded w-3/4 mb-4" />
        <div className="h-12 bg-slate-800/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <section aria-labelledby="v111-optimism-title" className="rounded-3xl glass-card relative overflow-hidden border border-amber-500/25 bg-gradient-to-br from-[#141A28]/95 via-[#0C111C]/95 to-[#070A10] p-6 sm:p-8">
      {/* Decorative Editorial Watermark */}
      <div className="absolute top-4 right-8 text-amber-500/[0.04] select-none pointer-events-none font-editorial text-9xl font-bold leading-none">
        “
      </div>

      {/* Radiant Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Masthead Tag */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-amber-400">
              Pillar 06 • Morning Mindset Manifesto
            </span>
          </div>

          <button
            onClick={handleCopy}
            title="Copy anchor text"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono-code text-slate-400 hover:text-slate-200 bg-slate-850/80 hover:bg-slate-800 rounded-lg border border-white/[0.06] transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 text-[10px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[10px]">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Headline */}
        <h2
          id="v111-optimism-title"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-editorial leading-tight"
        >
          {anchor.title}
        </h2>

        {/* Editorial Body */}
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          {anchor.content}
        </p>

        {/* Identity Anchor Seal */}
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 flex items-start sm:items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 border border-amber-500/30">
            <Shield className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-amber-400/90 mb-0.5">
              Core Identity Grounding
            </div>
            <div className="text-sm sm:text-base font-semibold text-amber-100 font-editorial italic">
              "{anchor.identityReminder}"
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
