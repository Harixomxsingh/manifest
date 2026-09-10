import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Calendar,
  Clock,
  Play,
  Pause,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  Mic,
  PenTool,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  Volume2
} from 'lucide-react';
import {
  getJournalVaultEntries,
  deleteJournalVaultRecord,
  playVoiceAudio,
  pauseVoiceAudio,
  stopVoiceAudio
} from '../../services/voiceRecorderService';
import { useApp } from '../../context/AppContext';

export default function JournalVaultModal({ isOpen, onClose }) {
  const { setVoiceJournal } = useApp();

  const [timeRange, setTimeRange] = useState('all'); // 'all' | 'week' | 'month' | 'year'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [entries, setEntries] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Audio playback state
  const [playingId, setPlayingId] = useState(null);
  const [playbackPos, setPlaybackPos] = useState(0);
  const [playbackTotal, setPlaybackTotal] = useState(1);

  const loadEntries = async () => {
    const list = await getJournalVaultEntries({
      timeRange,
      searchQuery,
      sortOrder
    });
    setEntries(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadEntries();
    } else {
      stopVoiceAudio();
      setPlayingId(null);
    }
  }, [isOpen, timeRange, searchQuery, sortOrder]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleAudio = async (item) => {
    if (playingId === item.id) {
      pauseVoiceAudio();
      setPlayingId(null);
    } else {
      stopVoiceAudio();
      setPlayingId(item.id);
      setPlaybackTotal(item.durationMillis || 3000);
      setPlaybackPos(0);

      await playVoiceAudio(item.audioUri, item.durationMillis, (status) => {
        if (status.didJustFinish) {
          setPlayingId(null);
          setPlaybackPos(0);
        } else {
          setPlaybackPos(status.positionMillis || 0);
          setPlaybackTotal(status.durationMillis || item.durationMillis || 3000);
        }
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this journal reflection?')) {
      if (playingId === id) {
        stopVoiceAudio();
        setPlayingId(null);
      }
      await deleteJournalVaultRecord(id);
      await loadEntries();
    }
  };

  const handleCopy = (item) => {
    const content = `Manifest Journal (${item.displayDate})\nPrompt: ${item.prompt}\n\nReflection:\n${item.text || item.transcript}\n\nCore Focus: "${item.synthesis?.manifestationAnchor || ''}"\nNext Step: ${item.synthesis?.kineticAction || ''}`;
    navigator.clipboard.writeText(content);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLoadIntoSession = (item) => {
    if (setVoiceJournal) {
      setVoiceJournal(item);
    }
    onClose();
  };

  const formatMillis = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const voiceCount = entries.filter((e) => e.type === 'voice' || e.audioUri).length;
  const textCount = entries.filter((e) => e.type === 'text' || (!e.audioUri && e.text)).length;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-fade-in"
    >
      <div className="bg-[#FDF9F1] border border-stone-200/80 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-white/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-tight">
                Journal Vault & Archive
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {entries.length} reflections stored locally • {voiceCount} voice • {textCount} written
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            title="Close Vault"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter, Search & Sort Bar */}
        <div className="p-3 sm:p-4 bg-stone-50/90 border-b border-stone-200/70 space-y-3">
          {/* Time Range Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'year', label: 'This Year' }
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setTimeRange(pill.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  timeRange === pill.id
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Search Input & Sort Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search reflections, next steps, prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              title="Toggle sort order"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>

        {/* Entries Scroll Area */}
        <div className="p-3 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {entries.length === 0 ? (
            <div className="text-center py-12 px-4 text-stone-400 space-y-2">
              <Clock className="w-10 h-10 mx-auto text-amber-800/40 animate-pulse" />
              <p className="text-sm font-bold text-stone-700">No Journal Reflections Found</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                {searchQuery
                  ? `No entries match "${searchQuery}". Try a different search term or time filter.`
                  : 'Speak or type your morning reflection in Phase 03 to preserve your sovereign archive.'}
              </p>
            </div>
          ) : (
            entries.map((item) => {
              const isItemPlaying = playingId === item.id;
              const hasAudio = !!item.audioUri;
              const hasText = !!item.text;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs hover:border-amber-300/80 transition-all"
                >
                  {/* Top Bar: Date, Type & Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-amber-950">
                        {item.displayDate || 'Reflection'}
                      </span>

                      {/* Type Badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[10px] font-mono font-semibold text-stone-600">
                        {hasAudio && hasText ? (
                          <>
                            <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                            <span>Hybrid</span>
                          </>
                        ) : hasAudio ? (
                          <>
                            <Mic className="w-2.5 h-2.5 text-amber-700" />
                            <span>Voice</span>
                          </>
                        ) : (
                          <>
                            <PenTool className="w-2.5 h-2.5 text-amber-700" />
                            <span>Written</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(item)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Prompt */}
                  {item.prompt && (
                    <p className="text-xs italic text-stone-500 font-medium">
                      Q: "{item.prompt}"
                    </p>
                  )}

                  {/* Audio Player Bar (if recorded) */}
                  {hasAudio && (
                    <div className="flex items-center gap-2.5 bg-amber-50/80 border border-amber-200/70 rounded-xl p-2.5">
                      <button
                        onClick={() => handleToggleAudio(item)}
                        className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0 shadow-2xs hover:bg-amber-900 transition-colors"
                      >
                        {isItemPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="w-full bg-amber-200/70 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-800 h-full rounded-full transition-all duration-150"
                            style={{
                              width: `${
                                isItemPlaying && playbackTotal > 0
                                  ? (playbackPos / playbackTotal) * 100
                                  : 0
                              }%`
                            }}
                          />
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-stone-500 shrink-0">
                        {isItemPlaying
                          ? `${formatMillis(playbackPos)} / ${formatMillis(playbackTotal)}`
                          : formatMillis(item.durationMillis || 0)}
                      </span>
                    </div>
                  )}

                  {/* Written Note or Transcript Content */}
                  {(item.text || item.transcript) && (
                    <p className="text-xs text-stone-700 leading-relaxed bg-stone-50/70 border border-stone-100 rounded-xl p-3">
                      {item.text || item.transcript}
                    </p>
                  )}

                  {/* Distillation Pillars */}
                  {item.synthesis && (
                    <div className="space-y-2 pt-1">
                      {item.synthesis.manifestationAnchor && (
                        <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5">
                          <span className="block text-[9px] font-mono font-extrabold text-amber-800 uppercase tracking-wider mb-0.5">
                            YOUR CORE FOCUS
                          </span>
                          <p className="text-xs font-semibold text-amber-950">
                            "{item.synthesis.manifestationAnchor}"
                          </p>
                        </div>
                      )}

                      {item.synthesis.kineticAction && (
                        <div className="bg-stone-50 border border-stone-100 rounded-xl p-2 text-xs text-stone-800 flex items-start gap-2">
                          <span className="font-mono font-bold text-[9px] text-amber-800 uppercase shrink-0 mt-0.5">
                            NEXT STEP:
                          </span>
                          <span className="font-medium">{item.synthesis.kineticAction}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Load into Session Button */}
                  <button
                    onClick={() => handleLoadIntoSession(item)}
                    className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Load into Today's Focus</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200/80 bg-white/80 flex items-center justify-between text-xs text-stone-500 font-mono">
          <span>Internal Client Storage • 100% Private</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
