import React from 'react';

export default function FooterKeyboardBar() {
  return (
    <footer className="w-full py-3.5 px-8 border-t border-stone-200/60 bg-[#FDF9F1] flex items-center justify-between text-[11px] font-mono text-stone-400">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600 font-bold shadow-2xs">
            Space
          </kbd>
          <span>/</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600 font-bold shadow-2xs">
            Enter
          </kbd>
          <span>to advance</span>
        </div>

        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600 font-bold shadow-2xs">
            0-5
          </kbd>
          <span>to jump phases</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-stone-500 font-sans text-xs">
        <span className="text-[10.5px] text-stone-400 font-mono">
          © 2026 Hari • PolyForm Noncommercial License
        </span>
        <span className="text-stone-300">•</span>
        <span>made with ❤️ by</span>
        <a
          href="https://harixomxsingh.github.io/portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-800 hover:text-amber-950 font-bold hover:underline"
        >
          hari
        </a>
      </div>
    </footer>
  );
}
