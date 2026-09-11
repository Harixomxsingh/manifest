/**
 * Web & PWA Notification Service
 * Supports Web Notifications API for daily reminders and instant testing.
 */
import { getRandomDailyNotification } from '../data/notificationMessages';

const SETTINGS_KEY_ENABLED = 'manifest_web_notifications_enabled';
const SETTINGS_KEY_HOUR = 'manifest_web_notification_hour';
const SETTINGS_KEY_MINUTE = 'manifest_web_notification_minute';

/**
 * Check if browser notifications are supported
 */
export function isWebNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Request browser notification permission
 */
export async function requestWebNotificationPermission() {
  if (!isWebNotificationSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (e) {
    return false;
  }
}

/**
 * Trigger an instant test notification in browser
 */
export async function sendWebTestNotification(options = {}) {
  if (!isWebNotificationSupported()) {
    return { success: false, reason: 'unsupported' };
  }

  const hasPermission = await requestWebNotificationPermission();
  if (!hasPermission) {
    return { success: false, reason: 'permission_denied' };
  }

  const prompt = getRandomDailyNotification(options);

  try {
    const notification = new Notification(prompt.title, {
      body: prompt.body,
      icon: './assets/icon.png',
      badge: './assets/favicon.png',
      tag: 'manifest-daily-reminder',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return { success: true, prompt };
  } catch (error) {
    return { success: false, reason: error.message };
  }
}

/**
 * Get notification settings
 */
export function getWebNotificationSettings() {
  try {
    const enabledRaw = localStorage.getItem(SETTINGS_KEY_ENABLED);
    const hourRaw = localStorage.getItem(SETTINGS_KEY_HOUR);
    const minuteRaw = localStorage.getItem(SETTINGS_KEY_MINUTE);

    return {
      enabled: enabledRaw !== null ? JSON.parse(enabledRaw) : true,
      hour: hourRaw !== null ? parseInt(hourRaw, 10) : 9,
      minute: minuteRaw !== null ? parseInt(minuteRaw, 10) : 0,
    };
  } catch (e) {
    return { enabled: true, hour: 9, minute: 0 };
  }
}

/**
 * Save notification settings
 */
export function saveWebNotificationSettings(settings = {}) {
  try {
    if (settings.enabled !== undefined) {
      localStorage.setItem(SETTINGS_KEY_ENABLED, JSON.stringify(settings.enabled));
    }
    if (settings.hour !== undefined) {
      localStorage.setItem(SETTINGS_KEY_HOUR, String(settings.hour));
    }
    if (settings.minute !== undefined) {
      localStorage.setItem(SETTINGS_KEY_MINUTE, String(settings.minute));
    }
    return true;
  } catch (e) {
    return false;
  }
}
