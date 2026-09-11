import React from 'react';
import {
  X,
  Sparkles,
  Sun,
  Flame,
  Zap,
  BookOpen,
  Compass,
  CheckCircle2,
  Shield,
  Heart,
  ExternalLink,
  Target,
  ArrowRight
} from 'lucide-react';
import ManifestSunLogo from '../../components/ManifestSunLogo';

export default function AboutManifestModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#FDF9F1] border-2 border-amber-300/80 rounded-3xl shadow-2xl shadow-amber-950/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 bg-white/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ManifestSunLogo size={28} interactive={false} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-amber-950 tracking-tight">
                  About Manifest
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold">
                  v1.1.2
                </span>
              </div>
              <p className="text-xs text-stone-500 font-sans">
                The Purpose, Philosophy & Transformative Power
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="px-6 py-6 overflow-y-auto space-y-6 text-sm text-stone-700 font-sans leading-relaxed">
          {/* Section 1: The Origin & The Problem */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-100/40 to-yellow-50 border border-amber-300/70 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs tracking-wider uppercase font-mono">
              <Sun className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Why Manifest Exists</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-amber-950 leading-snug">
              Every morning, you wake up at a critical crossroad.
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              When we first wake up from sleep, our body, mind, and consciousness often feel lazy, scattered, and groggy. Without a conscious anchor, we immediately default into <strong>reaction mode</strong>—checking notifications, scrolling social feeds, and surrendering our morning energy to other people's demands.
            </p>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong>Manifest was created to solve this fundamental human problem.</strong> It is a frictionless, 2-minute recalibration ritual that shifts you from a passive receiver of the world's noise into an active commander of your day.
            </p>
          </div>

          {/* Section 2: The Two Core Pillars */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs tracking-wider uppercase font-mono">
              <Compass className="w-4 h-4 text-amber-700" />
              <span>The Two Core Pillars</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Pillar 1 */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs font-mono">
                  <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 font-extrabold text-[10px]">
                    1
                  </span>
                  <span>FRICTIONLESS CLARITY</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">
                  Speaking & Manifesting Out Loud
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The moment you speak your thoughts out loud and journal what is within yourself, a powerful surge of energy is created. It crystallizes fuzzy morning thoughts into pinpoint priority and drives you with passion throughout the day.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs font-mono">
                  <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 font-extrabold text-[10px]">
                    2
                  </span>
                  <span>UNSHAKABLE OPTIMISM</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">
                  Rewiring for Solutions & Agency
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The morning brain naturally carries an evolutionary negativity bias. Manifest actively conditions an opportunistic mindset—training you to look for solutions instead of obstacles and instilling deep belief in your own capability.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Key Transformative Benefits */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs tracking-wider uppercase font-mono">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>What You Gain by Using Manifest Daily</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    1. High-Voltage Morning Energy & Drive
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Speaking your purpose out loud awakens the nervous system and creates kinetic drive that fuels your entire day.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    2. 1% Better Every Day Through Wisdom Micro-Dosing
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    By reading curated daily essays (Atomic Habits, Stoicism, Essentialism), you build an effortless reading habit that compounds your mindset year-round.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    3. Visual Proof of Consistency (52-Week Focus Grid)
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Like developer GitHub commit squares, lighting up green contribution cells turns deep focus blocks into an earned badge of daily self-respect.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-50 text-cyan-700 shrink-0 mt-0.5">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    4. Zero-Friction 25-Minute Flow Launch
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Eliminates the painful gap between planning and doing with a 1-tap Pomodoro sprint that kicks off your most crucial priority.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: The 2-Minute Promise */}
          <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-300/80 text-center space-y-2">
            <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-amber-950">
              The 120-Second Daily Promise
            </h4>
            <p className="text-xs text-amber-900/90 max-w-md mx-auto leading-relaxed">
              You do not need a 60-minute complex morning routine. Just <strong>2 focused minutes</strong> of authentic manifestation will transform how you experience your workday and compound into an extraordinary year.
            </p>
          </div>

          {/* Section 5: License & Author Attribution */}
          <div className="pt-2 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>PolyForm Noncommercial License 1.0.0</span>
            </div>
            <div className="flex items-center gap-1 font-sans">
              <span>Crafted with ❤️ by</span>
              <a
                href="https://harixomxsingh.github.io/portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 hover:text-amber-950 font-bold hover:underline"
              >
                Hariom Singh (Hari)
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer Action */}
        <div className="px-6 py-3.5 border-t border-stone-200/80 bg-white flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
            © 2026 Hari • All Rights Reserved
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Begin Today's Manifestation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
