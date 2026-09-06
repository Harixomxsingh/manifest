import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { getTodayArticle, rerollArticle, markArticleAsRead as saveReadArticle, getReadHistory } from '../services/jamesClearService';
import { getTodayIdentityAnchor, getRandomIdentityAnchor } from '../services/identityService';
import { firePartyPopper } from '../utils/confettiHelper';
import { fetchWeatherForecast, detectCoordinates } from '../services/weatherService';
import {
  initGoogleAuth,
  requestGoogleToken,
  isGoogleConnected,
  disconnectGoogle as authDisconnect,
  fetchRecentEmails,
  fetchCalendarEvents,
  fetchGoogleTasks,
  getMockEmails,
  getMockCalendar,
  getMockTasks
} from '../services/googleAuthService';
import { generateMorningBriefing } from '../services/geminiService';
import { speechService } from '../services/speechService';

const AppContext = createContext(null);

const STORAGE_SETTINGS_KEY = 'manifest_settings_v1';
const STORAGE_COMPLETED_TASKS_KEY = 'manifest_completed_tasks';

export function AppProvider({ children }) {
  // 1. Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      geminiApiKey: '',
      geminiModel: 'gemini-2.5-flash',
      googleClientId: '',
      isDemoMode: true,
      isFahrenheit: true,
      cityMode: 'auto', // 'auto' or custom city
      customLocation: { name: 'San Francisco, CA', lat: 37.7749, lon: -122.4194 }
    };
  });

  // Save settings changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // 2. Version State ('v1.1.1' or 'v1.0')
  const [currentVersion, setCurrentVersion] = useState(() => {
    try {
      const saved = localStorage.getItem('manifest_active_version');
      if (saved) return saved;
    } catch (e) {}
    return 'v1.1.1';
  });

  useEffect(() => {
    try {
      localStorage.setItem('manifest_active_version', currentVersion);
    } catch (e) {}
  }, [currentVersion]);

  // 3. Date Tracking & Simulation State
  const [simulatedOffsetDays, setSimulatedOffsetDays] = useState(0);

  const getTodayKey = useCallback((offset = simulatedOffsetDays) => {
    const d = new Date();
    if (offset !== 0) {
      d.setDate(d.getDate() + offset);
    }
    return d.toISOString().split('T')[0];
  }, [simulatedOffsetDays]);

  // 4. Core State
  const [todayArticle, setTodayArticle] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Audio state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Google OAuth State
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);

  // Completed Tasks State
  const [completedTaskIds, setCompletedTaskIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_TASKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Reading History State
  const [readHistory, setReadHistory] = useState(() => getReadHistory());

  // Location State
  const [activeLocation, setActiveLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('manifest_saved_location');
      return saved ? JSON.parse(saved) : { name: 'San Francisco, CA, USA', lat: 37.7749, lon: -122.4194, source: 'default' };
    } catch (e) {
      return { name: 'San Francisco, CA, USA', lat: 37.7749, lon: -122.4194, source: 'default' };
    }
  });
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'detecting' | 'gps' | 'saved' | 'denied'
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Modals & Onboarding state
  const [hideOnboarding, setHideOnboarding] = useState(() => {
    try {
      return localStorage.getItem('manifest_hide_onboarding') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    try {
      return localStorage.getItem('manifest_hide_onboarding') !== 'true';
    } catch (e) {
      return true;
    }
  });

  const updateHideOnboarding = (val) => {
    setHideOnboarding(val);
    try {
      localStorage.setItem('manifest_hide_onboarding', val ? 'true' : 'false');
    } catch (e) {}
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  /**
   * Initialize Google Auth client if clientId is present
   */
  useEffect(() => {
    if (settings.googleClientId) {
      initGoogleAuth(
        settings.googleClientId,
        () => setIsGoogleLinked(true),
        (err) => console.warn('GIS Token client callback err:', err)
      );
    }
  }, [settings.googleClientId]);

  /**
   * Main Dispatch Orchestrator: Fetches inputs & synthesizes briefing
   */
  const loadMorningDispatch = useCallback(async (forceRefresh = false, rerollJc = false, overrideLoc = null, customDateStr = null) => {
    setIsGenerating(true);
    setErrorMsg(null);
    const todayStr = customDateStr || getTodayKey();
    const cacheKey = `manifest_cached_dispatch_${todayStr}`;

    try {
      // 1. Article Selection - Tied directly to target calendar date with 90-day anti-repetition!
      let article = (todayArticle && !rerollJc && !customDateStr) ? todayArticle : null;
      if (!article || rerollJc || customDateStr) {
        article = rerollJc ? rerollArticle(todayArticle?.id) : getTodayArticle(todayStr);
        setTodayArticle(article);
      }

      // Check cache if not forcing refresh and no location override
      if (!forceRefresh && !rerollJc && !overrideLoc && !customDateStr) {
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.briefing && parsed.weather) {
              setBriefing(parsed.briefing);
              setWeatherData(parsed.weather);
              setTodayArticle(parsed.article || article);
              setIsGenerating(false);
              return;
            }
          }
        } catch (e) {}
      }

      // 2. Location & Weather Fetching with daily verification
      let loc = overrideLoc || activeLocation;
      if (!overrideLoc) {
        if (settings.cityMode === 'auto') {
          setLocationStatus('detecting');
          const coords = await detectCoordinates(true);
          loc = coords;
          setActiveLocation(coords);
          setLocationStatus(coords.source === 'gps' ? 'gps' : coords.isPermissionDenied ? 'denied' : 'saved');
        } else if (settings.customLocation) {
          loc = settings.customLocation;
          setActiveLocation(settings.customLocation);
          setLocationStatus('saved');
        }
      }

      const weather = await fetchWeatherForecast(loc.lat, loc.lon, settings.isFahrenheit);
      // Attach resolved location name to weatherData
      weather.locationName = loc.name || 'Current Location';
      weather.locationSource = loc.source || 'manual';
      weather.isPermissionDenied = loc.isPermissionDenied || false;
      setWeatherData(weather);

      // 3. Google Context / Demo Context
      let emails = [];
      let events = [];
      let tasks = [];

      if (!settings.isDemoMode && isGoogleConnected()) {
        const [em, ev, tk] = await Promise.all([
          fetchRecentEmails(),
          fetchCalendarEvents(),
          fetchGoogleTasks()
        ]);
        emails = em;
        events = ev;
        tasks = tk;
      } else {
        emails = getMockEmails();
        events = getMockCalendar();
        tasks = getMockTasks();
      }

      // 4. Gemini / Local Fallback Synthesis (includes dynamic identity anchor for todayStr)
      const generatedBriefing = await generateMorningBriefing({
        apiKey: settings.geminiApiKey,
        model: settings.geminiModel,
        article,
        weather,
        emails,
        calendarEvents: events,
        tasks,
        dateStr: todayStr
      });

      // Ensure dynamic identity anchor is attached if not populated
      if (!generatedBriefing.optimismAnchor || !generatedBriefing.optimismAnchor.title) {
        generatedBriefing.optimismAnchor = getTodayIdentityAnchor(todayStr);
      }

      setBriefing(generatedBriefing);

      // Cache today's result
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            date: todayStr,
            briefing: generatedBriefing,
            weather,
            article
          })
        );
      } catch (e) {}
    } catch (err) {
      console.error('Dispatch synthesis failed:', err);
      setErrorMsg(err.message || 'Failed to generate morning dispatch.');
    } finally {
      setIsGenerating(false);
    }
  }, [settings, todayArticle, getTodayKey, activeLocation]);

  // Initial Load on mount
  useEffect(() => {
    loadMorningDispatch();

    // If cityMode is 'auto', attempt a live GPS update in background
    if (settings.cityMode === 'auto' && typeof navigator !== 'undefined' && navigator.geolocation) {
      detectCoordinates(true)
        .then(async (coords) => {
          if (coords && coords.source === 'gps') {
            setActiveLocation(coords);
            setLocationStatus('gps');
            const w = await fetchWeatherForecast(coords.lat, coords.lon, settings.isFahrenheit);
            if (w) {
              w.locationName = coords.name;
              w.locationSource = 'gps';
              setWeatherData(w);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  // Midnight Rollover & Auto Day Change Monitor
  useEffect(() => {
    const checkMidnightRollover = () => {
      if (simulatedOffsetDays !== 0) return;
      const currentActualDate = new Date().toISOString().split('T')[0];
      const lastTrackedDate = localStorage.getItem('manifest_last_active_date');
      if (lastTrackedDate && lastTrackedDate !== currentActualDate) {
        console.log('🌅 New calendar day arrived! Automatically updating Morning Manifestation to:', currentActualDate);
        localStorage.setItem('manifest_last_active_date', currentActualDate);
        loadMorningDispatch(true, false, null, currentActualDate);
      } else if (!lastTrackedDate) {
        localStorage.setItem('manifest_last_active_date', currentActualDate);
      }
    };
    const interval = setInterval(checkMidnightRollover, 10000);
    return () => clearInterval(interval);
  }, [simulatedOffsetDays, loadMorningDispatch]);

  const simulateDateOffset = (offsetDays) => {
    setSimulatedOffsetDays(offsetDays);
    const targetDate = getTodayKey(offsetDays);
    loadMorningDispatch(true, false, null, targetDate);
  };

  // Initial Load on mount
  useEffect(() => {
    loadMorningDispatch();

    // If cityMode is 'auto', attempt a live GPS update in background
    if (settings.cityMode === 'auto' && typeof navigator !== 'undefined' && navigator.geolocation) {
      detectCoordinates(true)
        .then(async (coords) => {
          if (coords && coords.source === 'gps') {
            setActiveLocation(coords);
            setLocationStatus('gps');
            const w = await fetchWeatherForecast(coords.lat, coords.lon, settings.isFahrenheit);
            if (w) {
              w.locationName = coords.name;
              w.locationSource = 'gps';
              setWeatherData(w);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  /**
   * Toggle task completion with celebratory confetti
   */
  const toggleTaskCompletion = (taskIdentifier) => {
    setCompletedTaskIds((prev) => {
      const isDone = prev.includes(taskIdentifier);
      const next = isDone ? prev.filter((id) => id !== taskIdentifier) : [...prev, taskIdentifier];
      try {
        localStorage.setItem(STORAGE_COMPLETED_TASKS_KEY, JSON.stringify(next));
      } catch (e) {}

      if (!isDone) {
        // Trigger subtle haptic celebration via Confetti
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#F59E0B', '#10B981', '#6366F1', '#FDE68A'],
          disableForReducedMotion: true
        });
      }
      return next;
    });
  };

  /**
   * Handle James Clear mark as read
   */
  const handleMarkArticleRead = (articleId) => {
    const updated = saveReadArticle(articleId);
    setReadHistory(updated);
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.75 },
      colors: ['#6366F1', '#A855F7', '#F59E0B']
    });
  };

  /**
   * Handle James Clear Reroll
   */
  const handleRerollArticle = () => {
    loadMorningDispatch(true, true);
  };

  /**
   * Randomize ALL Daily Content: Fresh Article + Fresh Identity Manifesto + Confetti burst
   */
  const randomizeAllDailyContent = (e) => {
    if (e) {
      firePartyPopper(e, { particleCount: 60, spread: 80, pitch: 1.15 });
    }
    
    // 1. Pick a brand new random article
    const newArticle = rerollArticle(todayArticle?.id);
    setTodayArticle(newArticle);

    // 2. Pick a brand new random identity anchor
    const newIdentityAnchor = getRandomIdentityAnchor(briefing?.optimismAnchor?.id);

    // 3. Update briefing
    setBriefing((prev) => {
      const updated = prev ? { ...prev } : {};
      updated.optimismAnchor = newIdentityAnchor;
      return updated;
    });

    // 4. Update session cache
    const todayStr = getTodayKey();
    const cacheKey = `manifest_cached_dispatch_${todayStr}`;
    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          date: todayStr,
          briefing: { ...(briefing || {}), optimismAnchor: newIdentityAnchor },
          weather: weatherData,
          article: newArticle
        })
      );
    } catch (err) {}
  };

  /**
   * Google Sign in trigger
   */
  const connectGoogleAccount = async () => {
    try {
      await requestGoogleToken();
      setIsGoogleLinked(true);
      setSettings((prev) => ({ ...prev, isDemoMode: false }));
      loadMorningDispatch(true, false);
    } catch (err) {
      console.error('Google connect error:', err);
      alert(err.message || 'Failed to connect Google account.');
    }
  };

  const disconnectGoogleAccount = () => {
    authDisconnect();
    setIsGoogleLinked(false);
  };

  /**
   * Toggle Morning Audio Readout (TTS)
   */
  const toggleAudioReadout = () => {
    speechService.toggle(briefing, todayArticle, weatherData, (playing) => {
      setIsAudioPlaying(playing);
    });
  };

  /**
   * Refresh Location via GPS
   */
  const refreshLocationFromGps = async () => {
    setLocationStatus('detecting');
    const detected = await detectCoordinates(true);
    setActiveLocation(detected);
    setLocationStatus(detected.source === 'gps' ? 'gps' : detected.isPermissionDenied ? 'denied' : 'saved');
    
    // Fetch and update weather immediately
    const weather = await fetchWeatherForecast(detected.lat, detected.lon, settings.isFahrenheit);
    weather.locationName = detected.name;
    weather.locationSource = detected.source;
    weather.isPermissionDenied = detected.isPermissionDenied || false;
    setWeatherData(weather);

    // Sync with briefing cache
    const todayStr = getTodayKey();
    const cacheKey = `manifest_cached_dispatch_${todayStr}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.weather = weather;
        localStorage.setItem(cacheKey, JSON.stringify(parsed));
      }
    } catch (e) {}
  };

  /**
   * Manually update Location
   */
  const updateLocationManually = async (loc) => {
    const manualLoc = {
      name: loc.name,
      lat: loc.lat,
      lon: loc.lon,
      source: 'manual',
      isPermissionDenied: false
    };
    try {
      localStorage.setItem('manifest_saved_location', JSON.stringify(manualLoc));
    } catch (e) {}
    setActiveLocation(manualLoc);
    setLocationStatus('saved');
    
    // Fetch and update weather immediately
    const weather = await fetchWeatherForecast(manualLoc.lat, manualLoc.lon, settings.isFahrenheit);
    weather.locationName = manualLoc.name;
    weather.locationSource = 'manual';
    weather.isPermissionDenied = false;
    setWeatherData(weather);

    // Sync with briefing cache
    const todayStr = getTodayKey();
    const cacheKey = `manifest_cached_dispatch_${todayStr}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.weather = weather;
        localStorage.setItem(cacheKey, JSON.stringify(parsed));
      }
    } catch (e) {}
  };

  return (
    <AppContext.Provider
      value={{
        currentVersion,
        setCurrentVersion,
        settings,
        setSettings,
        todayArticle,
        weatherData,
        briefing,
        isGenerating,
        errorMsg,
        isAudioPlaying,
        isGoogleLinked,
        completedTaskIds,
        readHistory,
        activeLocation,
        locationStatus,
        isLocationModalOpen,
        setIsLocationModalOpen,
        refreshLocationFromGps,
        updateLocationManually,
        isSettingsOpen,
        setIsSettingsOpen,
        isHistoryOpen,
        setIsHistoryOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        hideOnboarding,
        setHideOnboarding: updateHideOnboarding,
        refreshDispatch: () => loadMorningDispatch(true, false),
        rerollArticle: handleRerollArticle,
        markArticleAsRead: handleMarkArticleRead,
        toggleTaskCompletion,
        connectGoogleAccount,
        disconnectGoogleAccount,
        toggleAudioReadout,
        simulatedOffsetDays,
        simulateDateOffset,
        activeDateKey: getTodayKey(),
        randomizeAllDailyContent
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
