import confetti from 'canvas-confetti';

/**
 * Positive harmonic celebratory chime using Web Audio API (zero asset dependency)
 */
export const playMotivationalChime = (pitch = 1) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Warm, uplifting ascending harp/chime arpeggio
    const baseNotes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const freqs = baseNotes.map((f) => f * pitch);

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + idx * 0.05 + 0.4);
    });
  } catch (err) {
    // Gracefully ignore audio errors if blocked by browser policy
  }
};

/**
 * Universal Motivational Party Popper for ritual progression buttons
 * @param {MouseEvent|React.MouseEvent|Object} e - Click event for dynamic origin calculation
 * @param {Object} customOptions - Optional overrides
 */
export function firePartyPopper(e, customOptions = {}) {
  // 1. Play uplifting chime
  playMotivationalChime(customOptions.pitch || 1);

  // 2. Compute screen origin from click coordinates or fallback to bottom-center
  let origin = { x: 0.5, y: 0.7 };
  if (e && e.clientX && e.clientY) {
    origin = {
      x: Math.max(0.15, Math.min(0.85, e.clientX / window.innerWidth)),
      y: Math.max(0.2, Math.min(0.85, e.clientY / window.innerHeight))
    };
  }

  const vibrantDawnPalette = [
    '#D97706', // Warm Amber
    '#F59E0B', // Golden Dawn
    '#FDE68A', // Sunlight Cream
    '#10B981', // Emerald Victory
    '#FEF3C7', // Ivory Gold
    '#EA580C', // Deep Orange
    '#8B5CF6'  // Royal Purple
  ];

  // 3. Main explosive button burst
  confetti({
    particleCount: customOptions.particleCount || 55,
    spread: customOptions.spread || 75,
    startVelocity: 38,
    origin,
    ticks: 220,
    gravity: 1.1,
    scalar: 1.1,
    drift: (Math.random() - 0.5) * 0.4,
    colors: customOptions.colors || vibrantDawnPalette,
    disableForReducedMotion: true
  });

  // 4. Twin celebratory side-cannons for rich party popper sensation
  setTimeout(() => {
    // Left party popper cannon
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 60,
      origin: { x: 0.02, y: 0.75 },
      colors: ['#F59E0B', '#D97706', '#10B981', '#FDE68A'],
      disableForReducedMotion: true
    });

    // Right party popper cannon
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 60,
      origin: { x: 0.98, y: 0.75 },
      colors: ['#F59E0B', '#D97706', '#10B981', '#FDE68A'],
      disableForReducedMotion: true
    });
  }, 120);
}

/**
 * Grand finale celebratory fireworks for the Launchpad
 */
export function fireGrandFinale() {
  playMotivationalChime(1.2);

  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      colors: ['#D97706', '#F59E0B', '#10B981', '#FDE68A', '#FEF3C7', '#3B82F6']
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}
