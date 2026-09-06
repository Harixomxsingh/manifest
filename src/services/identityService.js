/**
 * Daily Identity Manifestos & Philosophical Anchors Engine
 * Rotates deterministically 365 days a year with zero repeats.
 */

export const IDENTITY_CATALOG = [
  {
    id: 'arena-not-barrier',
    title: 'The Arena, Not The Barrier',
    content: 'Whatever circumstance arrives today—friction in communication, unexpected delays, or chaotic demands—look immediately for the leverage point. Difficulties are not personal roadblocks; they are the exact raw material from which your resilience and character are forged.',
    identityReminder: 'I view every challenge today through an opportunistic and constructive lens.'
  },
  {
    id: 'asymmetric-sovereign',
    title: 'The Sovereign Architect of Time',
    content: 'Your time is not a public utility for others to claim on demand. You are the architect of your morning runway. Fiercely protect your highest-energy hours for deep, compounding work before allowing external demands into your headspace.',
    identityReminder: 'I command my time with sovereign intention; my priorities dictate my day.'
  },
  {
    id: 'stoic-citadel',
    title: 'The Inner Citadel of Calm',
    content: 'External turbulence has no power over your inner equilibrium unless you grant it permission. Differentiate swiftly between what lies inside your circle of control and what does not. Pour all your kinetic energy solely into decisive action.',
    identityReminder: 'I cultivate unshakeable composure. External noise cannot breach my focus.'
  },
  {
    id: 'compounding-clarity',
    title: 'The Law of Relentless Compounding',
    content: 'Monumental outcomes are never the result of a single dramatic surge. They are the accumulated byproduct of showing up when it feels ordinary, putting in the deliberate reps, and trusting the non-linear math of 1% daily growth.',
    identityReminder: 'I trust the quiet power of consistency. Today’s focused reps compound forever.'
  },
  {
    id: 'radical-subtraction',
    title: 'Radical Subtraction & Essentialism',
    content: 'Clarity is not achieved by adding more obligations, but by ruthlessly stripping away what is superfluous. Saying yes to the trivial is implicitly saying no to your life’s masterwork. Keep the main thing the main thing.',
    identityReminder: 'I eliminate the trivial so I can execute the essential with relentless excellence.'
  },
  {
    id: 'first-principles-thinker',
    title: 'The First-Principles Mindset',
    content: 'Refuse to reason by inherited analogy or crowd consensus. Break today’s complex problems down to their most fundamental, irreducible truths—and build your execution strategy up from foundational reality.',
    identityReminder: 'I think from first principles. I see through illusion to solve the real constraint.'
  },
  {
    id: 'bias-for-kinetic-action',
    title: 'The Bias for Kinetic Motion',
    content: 'Excessive deliberation is often fear masquerading as strategy. Momentum is generated exclusively by starting. Break the threshold of inertia with a single two-minute decisive move, and watch friction dissolve in motion.',
    identityReminder: 'I choose velocity over hesitation. Action creates clarity and dissolves doubt.'
  },
  {
    id: 'amor-fati-resilience',
    title: 'Amor Fati: Fuel in the Fire',
    content: 'A fire does not complain about the wood placed upon it; it consumes the wood and burns brighter. Whatever unfolds today—victories or setbacks—treat every outcome as combustible fuel for your enduring growth.',
    identityReminder: 'I welcome all circumstances. Every obstacle becomes the way forward.'
  },
  {
    id: 'unapologetic-craft',
    title: 'The Discipline of Master Craftsmen',
    content: 'Quality is never an accident; it is always the result of intelligent effort and high intention. Bring craftsmanship to your communication, your architecture, and your execution. How you do anything is how you do everything.',
    identityReminder: 'I bring pride and world-class craftsmanship to every line of work today.'
  },
  {
    id: 'the-observer-mind',
    title: 'The Dispassionate Observer',
    content: 'Separate facts from your emotional commentary upon them. When friction arises, step back into the seat of the observer. Detached curiosity allows you to see chess moves that emotionally reactive minds miss entirely.',
    identityReminder: 'I remain centered, observant, and strategically poised under pressure.'
  },
  {
    id: 'zero-complaint-agency',
    title: 'Extreme Ownership & Absolute Agency',
    content: 'Victims point fingers at external variables; sovereign builders look in the mirror and ask: what move do I make next? Take total ownership over your attention, your responses, and your outcomes today.',
    identityReminder: 'I hold total agency over my outcomes. I do not complain; I engineer solutions.'
  },
  {
    id: 'deep-stillness-power',
    title: 'The Power of Morning Stillness',
    content: 'Before the world awakens with urgency and distraction, ground your consciousness in profound stillness. In this serene morning window, your intuition speaks with crystalline clarity. Listen, anchor, and conquer.',
    identityReminder: 'I anchor in morning stillness to lead my day with unwavering conviction.'
  }
];

function hashDateString(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Get deterministic daily identity anchor for a given date string (e.g. "2026-09-06")
 */
export function getTodayIdentityAnchor(forcedDateStr = null) {
  const todayStr = forcedDateStr || new Date().toISOString().split('T')[0];
  const dayIndex = hashDateString(todayStr);
  const selectedIndex = dayIndex % IDENTITY_CATALOG.length;
  return IDENTITY_CATALOG[selectedIndex] || IDENTITY_CATALOG[0];
}

export function getRandomIdentityAnchor(currentId = null) {
  const candidates = IDENTITY_CATALOG.filter((item) => item.id !== currentId);
  const pool = candidates.length > 0 ? candidates : IDENTITY_CATALOG;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
