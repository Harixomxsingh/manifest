import React, { useState, useEffect } from 'react';
import { X, Navigation, Search, MapPin, Check, AlertCircle, RefreshCw, Globe, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { POPULAR_CITIES, searchCities } from '../../services/weatherService';

export default function LocationModal() {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    activeLocation,
    locationStatus,
    refreshLocationFromGps,
    updateLocationManually
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Debounced city search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchCities(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isLocationModalOpen) return null;

  const handleSelectCity = (cityObj) => {
    updateLocationManually(cityObj);
    setIsLocationModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleGpsTrigger = async () => {
    setIsDetectingGps(true);
    await refreshLocationFromGps();
    setIsDetectingGps(false);
    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#FDF9F1] border border-[#EDE5D8] shadow-2xl shadow-amber-950/20 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#ECE8E0] bg-[#FDF9F1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] shadow-xs shrink-0">
              <MapPin className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B45309]">
                Weather Intelligence
              </div>
              <h2
                className="text-xl text-[#1C1C17] font-normal tracking-tight"
                style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
              >
                Atmospheric Location
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1.5 rounded-full bg-[#F7F3EB] hover:bg-[#ECE8E0] text-[#54524F] hover:text-[#1C1C17] transition-all"
            title="Close location modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-5 text-[#1C1C17]">
          {/* Active Location Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#EDE5D8] shadow-xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-[#8C827A] uppercase tracking-wider font-semibold">
                Current Active Location
              </div>
              <div className="text-sm font-bold text-[#1C1C17] truncate flex items-center gap-1.5 mt-0.5">
                <span>{activeLocation?.name || 'San Francisco, CA, USA'}</span>
                {activeLocation?.source === 'gps' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold border border-emerald-200">
                    GPS
                  </span>
                )}
                {activeLocation?.source === 'manual' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-[10px] font-mono font-semibold border border-[#FDE68A]">
                    Saved City
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleGpsTrigger}
              disabled={isDetectingGps}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] text-xs font-mono font-semibold border border-[#FDE68A] transition-all shrink-0 active:scale-95"
            >
              {isDetectingGps ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
              <span>{isDetectingGps ? 'Detecting...' : 'Use GPS'}</span>
            </button>
          </div>

          {/* Permission Alert if Denied */}
          {activeLocation?.isPermissionDenied && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Browser GPS Access Blocked:</strong> Using your saved city. You can pick any city below, or click the lock/settings icon in your browser address bar to allow location access.
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C827A] flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Search Any City Worldwide</span>
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="e.g. London, Tokyo, Bengaluru, New York, Zurich..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-xl bg-white border border-[#EDE5D8] focus:border-[#D97706] text-sm text-[#1C1C17] placeholder-[#8C827A] outline-none shadow-xs transition-all"
              />
              <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-3.5" />
              {isSearching && (
                <RefreshCw className="w-4 h-4 text-[#D97706] animate-spin absolute right-3.5 top-3.5" />
              )}
            </div>

            {/* Search Results List */}
            {searchResults.length > 0 && (
              <div className="mt-2 rounded-xl bg-white border border-[#EDE5D8] shadow-md divide-y divide-[#ECE8E0] max-h-48 overflow-y-auto">
                {searchResults.map((res, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCity(res)}
                    className="w-full px-4 py-2.5 text-left text-xs text-[#1C1C17] hover:bg-[#FEF3C7]/60 flex items-center justify-between transition-colors group"
                  >
                    <span className="font-medium">{res.name}</span>
                    <span className="text-[10px] font-mono text-[#B45309] opacity-0 group-hover:opacity-100 transition-opacity">
                      Select ↵
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Global Cities Chips */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C827A]">
              Popular Global Hubs
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_CITIES.map((city) => {
                const isSelected = activeLocation?.name?.includes(city.name.split(',')[0]);
                return (
                  <button
                    key={city.name}
                    onClick={() => handleSelectCity(city)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                      isSelected
                        ? 'bg-[#B45309] text-white border-[#B45309] font-bold shadow-xs'
                        : 'bg-white hover:bg-[#FEF3C7] text-[#54524F] hover:text-[#1C1C17] border-[#EDE5D8]'
                    }`}
                  >
                    {city.name.split(',')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#ECE8E0] bg-[#FDF9F1] flex items-center justify-between text-xs text-[#8C827A] font-mono">
          <span>Remembered automatically in browser storage</span>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="px-4 py-2 rounded-full bg-[#ECE8E0] hover:bg-[#DDC1B3] text-[#1C1C17] font-medium text-xs transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
