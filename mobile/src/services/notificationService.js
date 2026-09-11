import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomDailyNotification } from '../data/notificationMessages';

const SETTINGS_KEY_ENABLED = 'manifest_notifications_enabled';
const SETTINGS_KEY_HOUR = 'manifest_notification_hour';
const SETTINGS_KEY_MINUTE = 'manifest_notification_minute';
const CHANNEL_ID = 'manifest-daily-reminder';

// Default notification handler configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Initialize Notification channels and basic configuration
 */
export async function initNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Daily Morning Manifestation',
        description: 'Warm, human-tone daily 9:00 AM manifestation prompts and inspiration',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#F59E0B',
        sound: 'default',
        enableLights: true,
        enableVibrate: true,
        showBadge: true,
      });
    }
  } catch (error) {
    console.warn('[NotificationService] Channel setup notice:', error.message);
  }
}

/**
 * Request notification permissions gracefully
 */
export async function requestNotificationPermissions() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('[NotificationService] Permission request notice:', error.message);
    return false;
  }
}

/**
 * Schedule the daily 9:00 AM (or custom time) repeating notification
 */
export async function scheduleDailyManifestationReminder(options = {}) {
  try {
    const settings = await getNotificationSettings();
    if (!settings.enabled) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return false;
    }

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;

    // Clear previous scheduled reminders
    await Notifications.cancelAllScheduledNotificationsAsync();

    const hour = options.hour !== undefined ? options.hour : settings.hour;
    const minute = options.minute !== undefined ? options.minute : settings.minute;

    // Generate dynamic message
    const prompt = getRandomDailyNotification({
      streakCount: options.streakCount,
      identityTitle: options.identityTitle,
    });

    // Schedule repeating daily trigger
    await Notifications.scheduleNotificationAsync({
      content: {
        title: prompt.title,
        body: prompt.body,
        data: { targetPhase: 'welcome', action: 'start_ritual' },
        sound: 'default',
        channelId: CHANNEL_ID,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    return true;
  } catch (error) {
    console.warn('[NotificationService] Schedule reminder notice:', error.message);
    return false;
  }
}

/**
 * Send an immediate test notification so the user can test sound and message right away
 */
export async function sendTestNotificationNow(options = {}) {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return { success: false, reason: 'permission_denied' };

    await initNotifications();

    const prompt = getRandomDailyNotification({
      streakCount: options.streakCount,
      identityTitle: options.identityTitle,
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: prompt.title,
        body: prompt.body,
        data: { targetPhase: 'welcome', action: 'start_ritual', isTest: true },
        sound: 'default',
        channelId: CHANNEL_ID,
      },
      trigger: {
        seconds: 1,
      },
    });

    return { success: true, prompt };
  } catch (error) {
    console.warn('[NotificationService] Test notification notice:', error.message);
    return { success: false, reason: error.message };
  }
}

/**
 * Retrieve saved notification preferences
 */
export async function getNotificationSettings() {
  try {
    const enabledRaw = await AsyncStorage.getItem(SETTINGS_KEY_ENABLED);
    const hourRaw = await AsyncStorage.getItem(SETTINGS_KEY_HOUR);
    const minuteRaw = await AsyncStorage.getItem(SETTINGS_KEY_MINUTE);

    return {
      enabled: enabledRaw !== null ? JSON.parse(enabledRaw) : true, // Default: ON
      hour: hourRaw !== null ? parseInt(hourRaw, 10) : 9,          // Default: 9 AM
      minute: minuteRaw !== null ? parseInt(minuteRaw, 10) : 0,     // Default: :00
    };
  } catch (error) {
    return { enabled: true, hour: 9, minute: 0 };
  }
}

/**
 * Save notification preferences and reschedule
 */
export async function saveNotificationSettings(settings = {}) {
  try {
    if (settings.enabled !== undefined) {
      await AsyncStorage.setItem(SETTINGS_KEY_ENABLED, JSON.stringify(settings.enabled));
    }
    if (settings.hour !== undefined) {
      await AsyncStorage.setItem(SETTINGS_KEY_HOUR, String(settings.hour));
    }
    if (settings.minute !== undefined) {
      await AsyncStorage.setItem(SETTINGS_KEY_MINUTE, String(settings.minute));
    }

    if (settings.enabled === false) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } else {
      await scheduleDailyManifestationReminder(settings);
    }
    return true;
  } catch (error) {
    console.warn('[NotificationService] Save settings notice:', error.message);
    return false;
  }
}
