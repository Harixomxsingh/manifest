import catalog from '../data/jamesClearCatalog.json';

const STORAGE_KEY_HISTORY = 'manifest_jc_read_history';
const STORAGE_KEY_DAILY = 'manifest_jc_daily_selection';
const DEFAULT_EXCLUSION_DAYS = 90;

export const CATEGORIES = [
  'Continuous Improvement',
  'Creativity',
  'Behavioral Psychology',
  'Habits',
  'Minimalism',
  'Business',
  'Personal Development',
  'Practical Philosophy',
  'Fundamentals'
];

/**
 * Get reading history from localStorage
 * Format: [ { id: string, title: string, category: string, readAt: string (ISO), url: string } ]
 */
export function getReadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Error reading James Clear history:', err);
    return [];
  }
}

/**
 * Save an article to read history
 */
export function markArticleAsRead(articleId) {
  const history = getReadHistory();
  const article = catalog.find((a) => a.id === articleId);
  if (!article) return history;

  // Filter out duplicate if read earlier today, then prepend newest
  const filtered = history.filter((item) => item.id !== articleId);
  const updated = [
    {
      id: article.id,
      title: article.title,
      category: article.category,
      readAt: new Date().toISOString(),
      url: article.url,
      readTime: article.readTime
    },
    ...filtered
  ];

  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed saving reading history:', err);
  }

  return updated;
}

/**
 * Check if an article was read within the exclusion window (in days)
 */
export function isArticleExcluded(articleId, exclusionDays = DEFAULT_EXCLUSION_DAYS) {
  const history = getReadHistory();
  const entry = history.find((item) => item.id === articleId);
  if (!entry) return false;

  const readDate = new Date(entry.readAt);
  const now = new Date();
  const diffDays = (now - readDate) / (1000 * 60 * 60 * 24);
  return diffDays < exclusionDays;
}

/**
 * Deterministic hash from date string (e.g. "2026-09-03")
 */
function hashDateString(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Select today's James Clear article using Weighted Round-Robin with exclusion window
 */
export function getTodayArticle(forcedDateStr = null) {
  const todayStr = forcedDateStr || new Date().toISOString().split('T')[0];

  // Check if today already has a cached selection in localStorage
  try {
    const cached = localStorage.getItem(STORAGE_KEY_DAILY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.date === todayStr && parsed.article) {
        const fullArticle = catalog.find((a) => a.id === parsed.article.id) || parsed.article;
        return fullArticle;
      }
    }
  } catch (e) {
    // Ignore and proceed
  }

  // 1. Determine target category for today via Round-Robin
  const dayIndex = hashDateString(todayStr);
  const targetCategory = CATEGORIES[dayIndex % CATEGORIES.length];

  // 2. Filter available articles in target category excluding recently read
  let candidatePool = catalog.filter(
    (art) => art.category === targetCategory && !isArticleExcluded(art.id)
  );

  // If all in target category are excluded, fallback to any unread in category
  if (candidatePool.length === 0) {
    candidatePool = catalog.filter((art) => art.category === targetCategory);
  }

  // If still empty, pull from global unread pool across all categories
  if (candidatePool.length === 0) {
    candidatePool = catalog.filter((art) => !isArticleExcluded(art.id));
  }

  // Absolute fallback
  if (candidatePool.length === 0) {
    candidatePool = catalog;
  }

  // 3. Pick deterministically from candidates
  const selectedIndex = dayIndex % candidatePool.length;
  const selectedArticle = candidatePool[selectedIndex] || catalog[0];

  // Cache selection for today
  try {
    localStorage.setItem(
      STORAGE_KEY_DAILY,
      JSON.stringify({ date: todayStr, article: selectedArticle })
    );
  } catch (e) {}

  return selectedArticle;
}

/**
 * Manually reroll/shuffle for another article
 */
export function rerollArticle(currentArticleId = null) {
  const candidates = catalog.filter((art) => art.id !== currentArticleId);
  if (candidates.length === 0) return catalog[0];

  const randomIndex = Math.floor(Math.random() * candidates.length);
  const chosen = candidates[randomIndex];

  const todayStr = new Date().toISOString().split('T')[0];
  try {
    localStorage.setItem(
      STORAGE_KEY_DAILY,
      JSON.stringify({ date: todayStr, article: chosen })
    );
  } catch (e) {}

  return chosen;
}

export function getAllArticles() {
  return catalog;
}
