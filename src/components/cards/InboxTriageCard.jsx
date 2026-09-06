import React from 'react';
import { Mail, ShieldCheck, AlertCircle, ExternalLink, Sparkles, CheckCircle2, LogIn } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
      <div className="rounded-2xl glass-card p-6 border border-white/[0.08] animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/4 mb-4" />
        <div className="h-16 bg-slate-800/50 rounded-xl mb-3" />
        <div className="h-10 bg-slate-800/40 rounded-lg" />
      </div>
    );
  }

  return (
    <section aria-labelledby="inbox-triage-title" className="rounded-3xl glass-card relative overflow-hidden border border-white/[0.08] bg-[#0B0F17]/90">
      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono-code block">
                Pillar 2 • Gmail Inbox Triage
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isGoogleLinked && settings.isDemoMode ? (
              <button
                onClick={connectGoogleAccount}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/[0.08] transition-all"
              >
                <LogIn className="w-3 h-3 text-amber-400" />
                <span>Link Gmail</span>
              </button>
            ) : (
              <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                Live Sync
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 id="inbox-triage-title" className="text-lg font-bold text-white mb-3">
          Signal-Over-Noise Filter
        </h2>

        {/* Status Callout Banner */}
        {isAllClear ? (
          <div className="rounded-2xl p-5 bg-gradient-to-r from-emerald-950/30 via-emerald-900/15 to-transparent border border-emerald-500/30 flex items-start gap-4 shadow-lg shadow-emerald-950/20">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold tracking-wide text-emerald-300 uppercase">
                  ✨ All Clear — No Action Needed
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {triage.summary || 'Zero high-stakes human emails in the last 24 hours. Newsletters and noise have been filtered. You may safely close your inbox.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-950/30 via-amber-900/15 to-transparent border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 border border-amber-500/30">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">
                  Actionable Executive Communications ({triage.urgentItems?.length || 1})
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  {triage.summary}
                </p>
              </div>
            </div>

            {/* List of Urgent Items */}
            <div className="space-y-2.5 mt-3">
              {triage.urgentItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-3.5 bg-slate-900/80 border border-white/[0.08] hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-300 truncate max-w-[240px]">
                      {item.sender}
                    </span>
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium group-hover:underline shrink-0"
                    >
                      Open in Gmail <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-sm font-medium text-white mb-2 line-clamp-1">
                    {item.subject}
                  </div>
                  <div className="text-xs bg-amber-500/10 text-amber-200 px-2.5 py-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                    <span className="font-semibold text-amber-400 uppercase text-[10px]">Action:</span>
                    <span>{item.actionRequired}</span>
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
