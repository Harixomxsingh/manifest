import motivationalQuotes from '../data/motivationalQuotes.json';

/**
 * Hash a date string (e.g. '2026-09-09') into a consistent integer index
 */
const hashDateString = (dateStr) => {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Get the deterministic daily quote for a given date string (e.g. '2026-09-09')
 * Automatically updates every midnight for the new day.
 */
export const getTodayQuote = (dateStr) => {
  if (!motivationalQuotes || motivationalQuotes.length === 0) {
    return {
      quote: "You have power over your mind — not outside events. Realize this, and you will find immense strength.",
      author: "Marcus Aurelius",
      role: "Roman Emperor & Stoic Philosopher"
    };
  }

  const effectiveDate = dateStr || new Date().toISOString().split('T')[0];
  const hash = hashDateString(effectiveDate);
  const index = hash % motivationalQuotes.length;
  return motivationalQuotes[index];
};

/**
 * Draw a random quote from the library
 */
export const getRandomQuote = (currentIndex = -1) => {
  if (motivationalQuotes.length <= 1) return motivationalQuotes[0];
  let newIdx;
  do {
    newIdx = Math.floor(Math.random() * motivationalQuotes.length);
  } while (newIdx === currentIndex);
  return { quote: motivationalQuotes[newIdx], index: newIdx };
};
