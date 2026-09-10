import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Shuffle } from 'lucide-react';
import ManifestSunLogo from '../../components/ManifestSunLogo';
import { useApp } from '../../context/AppContext';
import { getTodayQuote, getRandomQuote } from '../../services/quoteService';

export default function PhaseWelcome({ onAdvance }) {
  const { todayQuote, setTodayQuote } = useApp();
  const [liveDate, setLiveDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const monthName = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dayNum = now.getDate();
    setLiveDate(`${dayName}, ${monthName} ${dayNum}`);
  }, []);

  const quote = todayQuote || getTodayQuote();

  const handleShuffleQuote = () => {
    const { quote: newQ } = getRandomQuote();
    if (setTodayQuote) {
      setTodayQuote(newQ);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10 max-w-lg mx-auto animate-fade-in">
      {/* Top Date Capsule */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-600/20 text-[11px] font-mono font-bold text-amber-800 tracking-wider mb-6">
        <Sparkles className="w-3 h-3 text-amber-600" />
        <span>{liveDate || 'TODAY'}</span>
      </div>

      {/* Animated Solar Dawn Logo */}
      <div className="mb-6 flex items-center justify-center">
        <ManifestSunLogo size={88} interactive={true} />
      </div>

      {/* Main Bold Inspiring Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-2">
        Manifest Within
      </h1>
      <p className="text-xs sm:text-sm text-stone-500 max-w-xs sm:max-w-sm mb-6 leading-relaxed font-medium">
        A two-minute ritual to command your mind and master your day.
      </p>

      {/* Daily Ambitious Quote Card */}
      <div className="w-full bg-white border border-amber-500/25 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm text-center relative">
        <p className="text-base sm:text-lg font-medium text-amber-950 leading-relaxed mb-4">
          "{quote.quote}"
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[#F5EEDC]">
          <div className="text-left">
            <p className="font-mono text-xs font-bold text-[#1C1C17]">{quote.author}</p>
            {quote.role && <p className="text-[10px] text-[#A8A29E] mt-0.5">{quote.role}</p>}
          </div>

          <button
            onClick={handleShuffleQuote}
            className="w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 transition-colors"
            title="Shuffle Quote"
            aria-label="Shuffle Quote"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Begin Ritual Button */}
      <button
        onClick={onAdvance}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#78350F] hover:bg-[#92400E] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-98"
      >
        <span>Begin Ritual</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
