import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectGpsCoordinates, fetchOpenMeteoWeather, GLOBAL_CITIES } from '../services/weatherService';
import { speakDispatch, stopSpeech } from '../services/speechService';
import { triggerHaptic } from '../services/hapticsService';
import { getTodayArticle } from '../services/jamesClearService';
import { getTodayIdentityAnchor } from '../services/identityService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [activePhase, setActivePhase] = useState('welcome');
  const [activeDateStr, setActiveDateStr] = useState(getTodayStr());
  const [briefing, setBriefing] = useState(() => ({ optimismAnchor: getTodayIdentityAnchor(getTodayStr()) }));
  const [todayArticle, setTodayArticle] = useState(() => getTodayArticle(getTodayStr()));
  const [activeLocation, setActiveLocation] = useState({
    name: 'San Francisco, USA',
    lat: 37.7749,
    lon: -122.4194,
    source: 'fallback'
  });
  const [weatherData, setWeatherData] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const phaseOrder = ['welcome', 'identity', 'reading', 'climate', 'launch'];

  // Initial load: GPS detection + weather fetch + daily content sync
  useEffect(() => {
    const today = getTodayStr();
    setTodayArticle(getTodayArticle(today));
    setBriefing({ optimismAnchor: getTodayIdentityAnchor(today) });

    (async () => {
      const loc = await detectGpsCoordinates();
      setActiveLocation(loc);
      const w = await fetchOpenMeteoWeather(loc.lat, loc.lon, loc.name);
      setWeatherData(w);
    })();
  }, []);

  // Midnight Date Change Checker
  useEffect(() => {
    const checkMidnight = () => {
      const current = getTodayStr();
      if (current !== activeDateStr) {
        setActiveDateStr(current);
        setTodayArticle(getTodayArticle(current));
        setBriefing({ optimismAnchor: getTodayIdentityAnchor(current) });
        setActivePhase('welcome');
      }
    };
    const interval = setInterval(checkMidnight, 10000);
    return () => clearInterval(interval);
  }, [activeDateStr]);

  const triggerPartyCelebration = () => {
    triggerHaptic('success');
    setConfettiTrigger((prev) => prev + 1);
  };

  const advancePhase = () => {
    triggerPartyCelebration();
    const currIdx = phaseOrder.indexOf(activePhase);
    if (currIdx >= 0 && currIdx < phaseOrder.length - 1) {
      setActivePhase(phaseOrder[currIdx + 1]);
    }
  };

  const jumpToPhase = (phaseId) => {
    triggerHaptic('light');
    setActivePhase(phaseId);
  };

  const resetRitual = () => {
    triggerPartyCelebration();
    setActivePhase('welcome');
  };

  const updateLocationManually = async (city) => {
    triggerHaptic('medium');
    const newLoc = {
      name: city.name,
      lat: city.lat,
      lon: city.lon,
      source: 'manual',
      isPermissionDenied: false
    };
    setActiveLocation(newLoc);
    setIsLocationModalOpen(false);
    const w = await fetchOpenMeteoWeather(city.lat, city.lon, city.name);
    setWeatherData(w);
  };

  const refreshGpsLocation = async () => {
    triggerHaptic('medium');
    const loc = await detectGpsCoordinates();
    setActiveLocation(loc);
    setIsLocationModalOpen(false);
    const w = await fetchOpenMeteoWeather(loc.lat, loc.lon, loc.name);
    setWeatherData(w);
  };

  const toggleSpeechSummary = async () => {
    triggerHaptic('light');
    if (isSpeechPlaying) {
      await stopSpeech();
      setIsSpeechPlaying(false);
    } else {
      const summaryText = `Good morning. Here is your executive morning dispatch. Identity anchor: ${briefing.optimismAnchor.identityReminder}. Mindset reading from James Clear: ${todayArticle.coreIdea}. Today's climate: ${weatherData?.highTemp || 24} degrees Celsius, ${weatherData?.weatherLabel || 'Clear Sky'}. Go forth with unshakeable focus and conquer your day.`;
      const started = await speakDispatch(
        summaryText,
        () => setIsSpeechPlaying(true),
        () => setIsSpeechPlaying(false)
      );
      setIsSpeechPlaying(started);
    }
  };

  const randomizeAllDailyContent = () => {
    triggerPartyCelebration();
    const newArticle = getTodayArticle(String(Math.random()));
    const newAnchor = getTodayIdentityAnchor(String(Math.random()));
    setTodayArticle(newArticle);
    setBriefing({ optimismAnchor: newAnchor });
  };

  return (
    <AppContext.Provider
      value={{
        activePhase,
        setActivePhase,
        advancePhase,
        jumpToPhase,
        resetRitual,
        briefing,
        todayArticle,
        activeLocation,
        weatherData,
        isLocationModalOpen,
        setIsLocationModalOpen,
        updateLocationManually,
        refreshGpsLocation,
        isSpeechPlaying,
        toggleSpeechSummary,
        confettiTrigger,
        triggerPartyCelebration,
        randomizeAllDailyContent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
