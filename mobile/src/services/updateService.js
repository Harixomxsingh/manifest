import * as Updates from 'expo-updates';

/**
 * Check and download app updates silently in the background
 * Runs on app startup with 0 impact on launch performance.
 *
 * @returns {Promise<{ success: boolean, isAvailable: boolean, message: string }>}
 */
export const checkForAppUpdatesSilently = async () => {
  try {
    // In development mode (Expo Go / local metro), Updates is disabled
    if (__DEV__ || !Updates.isEnabled) {
      console.log('[UpdateService] Running in development mode; silent OTA updater active for production builds.');
      return { success: true, isAvailable: false, message: 'Development mode' };
    }

    const checkResult = await Updates.checkForUpdateAsync();

    if (checkResult.isAvailable) {
      console.log('[UpdateService] New update available. Downloading silently in background...');
      const fetchResult = await Updates.fetchUpdateAsync();

      if (fetchResult.isNew) {
        console.log('[UpdateService] Update downloaded successfully! It will activate automatically on next launch.');
        return {
          success: true,
          isAvailable: true,
          isNew: true,
          message: 'Update downloaded in background'
        };
      }
    }

    return { success: true, isAvailable: false, message: 'App is up to date' };
  } catch (err) {
    console.warn('[UpdateService] Notice checking updates:', err?.message);
    return { success: false, isAvailable: false, error: err?.message };
  }
};

/**
 * Apply the downloaded update immediately (reloads JS bundle)
 */
export const applyDownloadedUpdateNow = async () => {
  try {
    if (Updates.isEnabled && !__DEV__) {
      await Updates.reloadAsync();
    }
  } catch (err) {
    console.warn('[UpdateService] Failed to reload update:', err?.message);
  }
};
