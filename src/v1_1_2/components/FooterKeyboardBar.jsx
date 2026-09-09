import React from 'react';

export default function FooterKeyboardBar() {
  return (
    <footer className="w-full py-4 text-center border-t border-stone-200/60 bg-[#FDF9F1]">
      <div className="flex items-center justify-center gap-6 text-[11px] font-mono text-stone-400">
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
    </footer>
  );
}
