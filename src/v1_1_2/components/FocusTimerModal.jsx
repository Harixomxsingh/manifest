import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Flame, Sparkles, Volume2, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FocusTimerModal({ isOpen, onClose, initialMinutes = 25, currentFocusText = '' }) {
  const [durationMinutes, setDurationMinutes] = useState(initialMinutes);
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSeconds = durationMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100));

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(durationMinutes * 60);
      setIsRunning(true);
      setIsCompleted(false);
    } else {
      setIsRunning(false);
    }
  }, [isOpen, durationMinutes]);

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            setIsCompleted(true);
            try {
              confetti({
                particleCount: 70,
                spread: 70,
                origin: { y: 0.6 }
              });
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectPreset = (mins) => {
    setDurationMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handleReset = () => {
    setSecondsLeft(durationMinutes * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="bg-[#FDF9F1] border border-amber-200/80 rounded-3xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden animate-scale-up">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          title="Close timer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200 text-xs font-mono font-bold mb-4">
          <Flame className="w-3.5 h-3.5 text-amber-700" />
          <span>DEEP WORK FOCUS SESSION</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-stone-900 mb-1">
          {isCompleted ? 'Focus Session Completed! 🎉' : 'Lock in & Get it Done'}
        </h3>
        <p className="text-xs text-stone-500 max-w-xs mb-6">
          {currentFocusText
            ? `Goal: "${currentFocusText}"`
            : 'Turn off notifications, eliminate distractions, and enter flow.'}
        </p>

        {/* Circular Progress & Time Display */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-amber-100"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Active Progress */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-amber-800 transition-all duration-300"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Clock */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[11px] font-mono text-amber-800 font-bold mt-1 uppercase tracking-wider">
              {isRunning ? 'Flowing...' : isCompleted ? 'Completed' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Duration Preset Selector Pills */}
        <div className="flex items-center gap-2 mb-6">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSelectPreset(mins)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                durationMinutes === mins
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-50 text-stone-600 border border-stone-200'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center gap-3 w-full justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 max-w-[160px] flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>{secondsLeft === totalSeconds ? 'Start' : 'Resume'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-full bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 transition-colors cursor-pointer shadow-2xs"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
