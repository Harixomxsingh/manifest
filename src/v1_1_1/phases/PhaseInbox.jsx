import React from 'react';
import { Mail, ShieldCheck, AlertCircle, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PhaseInbox({ onAdvance }) {
  const { briefing } = useApp();

  const triage = briefing?.inboxTriage || {
    status: 'ALL_CLEAR',
    summary: 'All Clear. Zero urgent human communications detected.',
    urgentItems: []
  };

  const isAllClear = triage.status === 'ALL_CLEAR';

  return (
    <div className="w-full max-w-[42rem] mx-auto flex flex-col items-center py-4 sm:py-8 animate-fadeIn">
      {/* Top Phase Header Tracker */}
      <div className="w-full mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[#8C827A] text-[11px] font-mono tracking-widest uppercase">
          <span>Phase 06 of 07</span>
          <span className="text-[#B45309] font-semibold">Signal Over Noise</span>
        </div>
        <div className="w-full h-1 bg-[#ECE8E0] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#D97706] to-[#B45309] rounded-full w-[85.7%]" />
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">
        {/* Title Lockup */}
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span className="text-[11px] font-mono text-[#8C827A] uppercase tracking-widest font-semibold">
              Inbox Intelligence & Triage
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl text-[#903F00] tracking-tight font-normal"
            style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
          >
            Signal-Over-Noise Filter
          </h2>
          <p className="text-xs sm:text-sm text-[#54524F]">
            Automated newsletters and marketing noise filtered out. Only high-stakes human emails surfaced.
          </p>
        </div>

        {/* Status Callout Card */}
        {isAllClear ? (
          <div className="rounded-2xl p-6 sm:p-7 bg-white border border-[#EDE5D8] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#D97706]" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#B45309]">
                  ✨ ALL CLEAR — NO ACTION NEEDED
                </span>
                <div className="text-sm font-semibold text-[#1C1C17] mt-0.5">
                  Zero urgent communications requiring your attention.
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#54524F] leading-relaxed pl-13">
              {triage.summary || 'All emails from the last 24–36 hours have been filtered. You may safely keep your inbox closed and dedicate this morning to high-leverage execution.'}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 border border-[#EDE5D8] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#ECE8E0]">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-[#D97706]" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold uppercase text-[#B45309]">
                  Actionable Communications ({triage.urgentItems?.length || 1})
                </div>
                <div className="text-xs text-[#54524F] mt-0.5">{triage.summary}</div>
              </div>
            </div>

            <div className="space-y-3">
              {triage.urgentItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#F7F3EB] border border-[#ECE8E0] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold text-[#54524F] truncate max-w-[240px]">
                      {item.sender}
                    </span>
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#B45309] hover:underline flex items-center gap-1 font-mono font-medium"
                    >
                      Open in Gmail <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-sm font-semibold text-[#1C1C17]">{item.subject}</div>
                  <div className="p-2.5 rounded-lg bg-[#FEF3C7] text-[#903F00] text-xs flex items-center gap-2">
                    <strong className="font-mono uppercase text-[10px]">Action:</strong>
                    <span>{item.actionRequired}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#ECE8E0]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C827A]">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span>Inbox Triaged</span>
          </div>

          <button
            onClick={onAdvance}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B45309] to-[#903F00] text-white font-medium text-xs shadow-sm hover:brightness-105 transition-all active:scale-[0.98]"
          >
            <span>Complete Triage & Launch Day</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
