import * as Speech from 'expo-speech';

let isSpeaking = false;

export const speakDispatch = async (text, onStart, onDone) => {
  try {
    const isAlreadySpeaking = await Speech.isSpeakingAsync();
    if (isAlreadySpeaking) {
      await Speech.stop();
      isSpeaking = false;
      if (onDone) onDone();
      return false;
    }

    if (!text) return false;

    isSpeaking = true;
    if (onStart) onStart();

    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.95,
      onDone: () => {
        isSpeaking = false;
        if (onDone) onDone();
      },
      onError: () => {
        isSpeaking = false;
        if (onDone) onDone();
      }
    });

    return true;
  } catch (err) {
    isSpeaking = false;
    if (onDone) onDone();
    return false;
  }
};

export const stopSpeech = async () => {
  try {
    await Speech.stop();
    isSpeaking = false;
  } catch (err) {
    // Ignore
  }
};
