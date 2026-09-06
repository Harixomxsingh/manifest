import React from 'react';

export default function FooterKeyboardBar() {
  return (
    <footer className="fixed bottom-0 left-0 lg:left-64 right-0 h-12 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-t border-[#ECE8E0]/70 flex items-center justify-center px-4">
      <div className="text-xs text-[#8C827A] tracking-wide text-center font-mono">
        Press{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#ECE8E0] text-[#1C1C17] text-[10px] shadow-xs font-sans">
          Space
        </kbd>{' '}
        or{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#ECE8E0] text-[#1C1C17] text-[10px] shadow-xs font-sans">
          Enter ↵
        </kbd>{' '}
        to proceed •{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#ECE8E0] text-[#1C1C17] text-[10px] shadow-xs font-sans">
          1-4
        </kbd>{' '}
        to jump phases
      </div>
    </footer>
  );
}
