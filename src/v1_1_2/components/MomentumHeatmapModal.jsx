import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Flame,
  Clock,
  Calendar,
  Trophy,
  Sparkles,
  Zap,
  CheckCircle2,
  Play,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  getStreakData,
  generateGitHubHeatmapGrid,
  recordFocusSession
} from '../../services/streakService';

const GREEN_LEVEL_COLORS = [
  'bg-stone-200/70 border-stone-200',        // Level 0: Empty
  'bg-[#9BE9A8] border-[#86d994]',          // Level 1: Light Mint Green
  'bg-[#40C463] border-[#34b055]',          // Level 2: Medium Green
  'bg-[#30A14E] border-[#258d40]',          // Level 3: Vibrant Emerald
  'bg-[#216E39] border-[#18562c]'           // Level 4: Deep Champion Green
];

const GOLD_LEVEL_COLORS = [
  'bg-stone-200/70 border-stone-200',        // Level 0
  'bg-[#FDE68A] border-[#FCD34D]',          // Level 1
  'bg-[#F59E0B] border-[#D97706]',          // Level 2
  'bg-[#D97706] border-[#B45309]',          // Level 3
  'bg-[#78350F] border-[#451A03]'           // Level 4
];

export default function MomentumHeatmapModal({ isOpen, onClose, onStartFocusTimer }) {
  const [theme, setTheme] = useState('green'); // 'green' | 'gold'
  const [stats, setStats] = useState(() => getStreakData());
  const [hoveredDay, setHoveredDay] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'recent'

  const { weeks } = useMemo(() => {
    return generateGitHubHeatmapGrid(theme);
  }, [theme, stats]);

  useEffect(() => {
    if (isOpen) {
      setStats(getStreakData());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const colorPalette = theme === 'green' ? GREEN_LEVEL_COLORS : GOLD_LEVEL_COLORS;

  const handleQuickLog25m = () => {
    recordFocusSession(25);
    setStats(getStreakData());
  };

  // Month labels positioning across 52 weeks
  const monthLabels = [
    { label: 'Sep', col: 0 },
    { label: 'Oct', col: 4 },
    { label: 'Nov', col: 9 },
    { label: 'Dec', col: 13 },
    { label: 'Jan', col: 17 },
    { label: 'Feb', col: 22 },
    { label: 'Mar', col: 26 },
    { label: 'Apr', col: 30 },
    { label: 'May', col: 35 },
    { label: 'Jun', col: 39 },
    { label: 'Jul', col: 43 },
    { label: 'Aug', col: 48 },
    { label: 'Sep', col: 51 }
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div className="bg-[#FDF9F1] border border-stone-200/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-white/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center border border-amber-200 text-amber-800 shrink-0">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                  Momentum & Focus Calendar
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-mono font-bold">
                  {stats.currentStreak} Days
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                GitHub-style visualization of your daily morning rituals and 25m focus blocks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Color Palette Switcher */}
            <div className="hidden sm:flex items-center p-0.5 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold">
              <button
                onClick={() => setTheme('green')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  theme === 'green' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-stone-500'
                }`}
              >
                GitHub Green
              </button>
              <button
                onClick={() => setTheme('gold')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  theme === 'gold' ? 'bg-white text-amber-900 shadow-2xs font-bold' : 'text-stone-500'
                }`}
              >
                Solar Gold
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top 4 Core Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 sm:p-6 bg-stone-50/80 border-b border-stone-200">
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-stone-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">CURRENT STREAK</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono">
              {stats.currentStreak} <span className="text-xs font-normal text-stone-500">Days</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-stone-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">LONGEST STREAK</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono">
              {stats.longestStreak} <span className="text-xs font-normal text-stone-500">Days</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-stone-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">DEEP FOCUS TIME</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono">
              {stats.totalFocusHours} <span className="text-xs font-normal text-stone-500">Hours</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-stone-400 mb-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">TOTAL SESSIONS</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono">
              {stats.totalCompletions} <span className="text-xs font-normal text-stone-500">Days</span>
            </div>
          </div>
        </div>

        {/* Main GitHub Contribution Heatmap Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-800">
                52-Week Activity Grid ({weeks.length * 7} Days)
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                Updated in real-time
              </span>
            </div>

            {/* Scrollable Heatmap Container */}
            <div className="overflow-x-auto pb-3 pt-1 no-scrollbar">
              <div className="min-w-[700px]">
                {/* Month Labels Strip */}
                <div className="flex text-[10px] font-mono text-stone-400 mb-1.5 pl-6 gap-[11px]">
                  {monthLabels.map((m, idx) => (
                    <span key={idx} className="w-10 text-left">
                      {m.label}
                    </span>
                  ))}
                </div>

                {/* Grid (7 Days x 52 Weeks) */}
                <div className="flex gap-1">
                  {/* Day of Week Labels (Mon, Wed, Fri) */}
                  <div className="flex flex-col justify-between text-[9px] font-mono text-stone-400 pr-2 py-0.5 select-none">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                    <span>Sun</span>
                  </div>

                  {/* 52 Weekly Columns */}
                  <div className="flex gap-[3.5px] flex-1">
                    {weeks.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-[3.5px]">
                        {week.map((day, dIdx) => {
                          const lvlColor = colorPalette[day.level] || colorPalette[0];
                          const isHovered = hoveredDay?.dateStr === day.dateStr;

                          return (
                            <div
                              key={dIdx}
                              onMouseEnter={() => setHoveredDay(day)}
                              onClick={() => setHoveredDay(day)}
                              className={`w-[11px] h-[11px] rounded-[2.5px] border transition-transform cursor-pointer ${lvlColor} ${
                                day.isToday ? 'ring-2 ring-amber-500 scale-110 z-10' : ''
                              } ${isHovered ? 'scale-125 z-20 shadow-xs' : 'hover:scale-115'}`}
                              title={`${day.dateStr}: Level ${day.level}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Heatmap Legend & Tooltip Detail Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 mt-2 text-xs">
              {/* Dynamic Day Inspection Tooltip */}
              <div className="text-xs text-stone-700 min-h-[20px] flex items-center gap-1.5">
                {hoveredDay ? (
                  <>
                    <span className="font-mono font-bold text-amber-950">
                      {hoveredDay.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}:
                    </span>
                    <span className="text-stone-600">
                      {hoveredDay.entry?.ritualCompleted ? '✨ Morning Cadence Completed' : 'Rest day'}
                      {hoveredDay.entry?.focusMinutes ? ` • ${hoveredDay.entry.focusMinutes} mins Focus` : ''}
                    </span>
                  </>
                ) : (
                  <span className="text-stone-400 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-stone-300" />
                    <span>Hover or tap any square to inspect activity</span>
                  </span>
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 self-end sm:self-auto select-none">
                <span>Less</span>
                {colorPalette.map((col, idx) => (
                  <div key={idx} className={`w-2.5 h-2.5 rounded-[2px] border ${col}`} />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Quick Focus Tools Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                if (onStartFocusTimer) onStartFocusTimer();
              }}
              className="flex items-center justify-between p-4 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white transition-all shadow-md cursor-pointer hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-800 flex items-center justify-center text-amber-300">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold">Start 25m Focus Block</span>
                  <span className="block text-[10px] text-amber-200/80">Turn off distractions & enter flow</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>

            <button
              onClick={handleQuickLog25m}
              className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 transition-all text-stone-800 cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-stone-900">Quick Log +25m Focus</span>
                  <span className="block text-[10px] text-stone-500">Add 1 completed block to today's green square</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700">+25m</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-white/90 flex items-center justify-between text-xs text-stone-500 font-mono">
          <span>100% Offline & Private Local Storage</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
