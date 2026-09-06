import React from 'react';
import { Mail, ShieldCheck, AlertCircle, ExternalLink, Sparkles, CheckCircle2, LogIn } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function InboxTriageCard() {
  const { briefing, isGenerating, isGoogleLinked, connectGoogleAccount, settings } = useApp();

  const triage = briefing?.inboxTriage || {
    status: 'ALL_CLEAR',
    summary: 'All Clear. Zero urgent human communications detected.',
    urgentItems: []
  };

  const isAllClear = triage.status === 'ALL_CLEAR';

  if (isGenerating && !briefing) {
    return (
      <div className="rounded-3xl glass-card p-6 border border-white/[0.08] animate-pulse h-full">
        <div className="h-5 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-16 bg-slate-800/40 rounded-2xl mb-3" />
        <div className="h-10 bg-slate-800/30 rounded-xl" />
      </div>
    );
  }

  return (
    <section aria-labelledby="v111-inbox-title" className="rounded-3xl glass-card relative overflow-hidden border border-white/[0.08] bg-[#0A0E17]/90 p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-slate-400">
              Pillar 02 • Inbox Triage
            </span>
          </div>

          {!isGoogleLinked && settings.isDemoMode ? (
            <button
              onClick={connectGoogleAccount}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono-code rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/[0.08] transition-all"
            >
              <LogIn className="w-3 h-3 text-amber-400" />
              <span>Link Gmail</span>
            </button>
          ) : (
            <span className="text-[10px] font-mono-code font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              ● SYNC ACTIVE
            </span>
          )}
        </div>

        {/* Title */}
        <h2 id="v111-inbox-title" className="text-lg font-bold text-white mb-3 font-editorial">
          Signal vs. Noise Analysis
        </h2>

        {/* Status Display */}
        {isAllClear ? (
          <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-950/40 via-emerald-900/15 to-transparent border border-emerald-500/25 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ALL CLEAR — NO ACTION REQUIRED</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {triage.summary || 'Zero high-priority human emails in the last 24–36 hours. Newsletters and noise filtered.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-2xl p-3.5 bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300">
                {triage.summary}
              </p>
            </div>

            <div className="space-y-2">
              {triage.urgentItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-3 bg-slate-900 border border-white/[0.07] hover:border-amber-500/30 transition-all text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-300 truncate max-w-[180px] font-mono-code text-[11px]">
                      {item.sender}
                    </span>
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 font-mono-code text-[10px]"
                    >
                      Gmail <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="font-medium text-white mb-1.5 truncate">
                    {item.subject}
                  </div>
                  <div className="bg-amber-500/10 text-amber-200 px-2 py-1 rounded-md text-[11px]">
                    <strong className="text-amber-400 font-mono-code uppercase text-[10px]">Action: </strong>
                    {item.actionRequired}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
