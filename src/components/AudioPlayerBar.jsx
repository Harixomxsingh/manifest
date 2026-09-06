import React from 'react';
import { Volume2, VolumeX, Sparkles, StopCircle, Radio } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AudioPlayerBar() {
  const { isAudioPlaying, toggleAudioReadout } = useApp();

  if (!isAudioPlaying) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md animate-slideUp">
      <div className="rounded-2xl p-4 glass-card bg-slate-900/95 border border-amber-500/40 shadow-2xl shadow-amber-500/20 flex items-center justify-between gap-3">
        {/* Left: Wave Animation & Label */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Radio className="w-4 h-4 animate-pulse text-amber-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>

          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Morning Dispatch Readout</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono-code font-semibold">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
              Synthesizing 6 pillars aloud...
            </p>
          </div>
        </div>

        {/* Right: Stop Button */}
        <button
          onClick={toggleAudioReadout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 transition-all active:scale-95"
        >
          <StopCircle className="w-3.5 h-3.5" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
}
