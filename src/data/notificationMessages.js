/**
 * Dynamic Human-Tone Notification Engine (Web Counterpart)
 * Generates over 1,000+ unique, warm, playful, and deeply motivating daily notifications.
 */

export const CURATED_NOTIFICATIONS = [
  {
    title: "Good morning, legend ☀️",
    body: "The world is quiet right now. Take 2 minutes to set your compass before the rush begins."
  },
  {
    title: "Coffee poured? Brain loading? ☕",
    body: "Take 60 seconds right now to decide the vibe of your day. Your future self will thank you."
  },
  {
    title: "Psst... quick check-in 👀",
    body: "You don't need to conquer the whole mountain today. Just take the first intentional step."
  },
  {
    title: "One deep breath. Drop shoulders 🌿",
    body: "Today is a fresh canvas. Let's make sure yesterday's worries don't color today's art."
  },
  {
    title: "Look who woke up ready to shine 👑",
    body: "A 1% shift today changes where you land next year. Ready to lock in your morning ritual?"
  },
  {
    title: "Friendly nudge from future you 🚀",
    body: "Show up for yourself today like you show up for everyone else. 2 minutes starts now."
  },
  {
    title: "Morning clarity is calling 🌤️",
    body: "Clarity isn't something you find—it's something you create. Let's set your intention."
  },
  {
    title: "Today has big potential ✨",
    body: "No rush, no stress. Just a calm, focused moment to prime your mind for greatness."
  },
  {
    title: "Hey! You've got this today 💛",
    body: "Small daily rituals build unstoppable lives. Let's do your morning reflection."
  },
  {
    title: "Rise and align 🌅",
    body: "Before you check the world's agenda, check in on yours. Tap to begin your ritual."
  },
  {
    title: "Identity check-in 🎯",
    body: "Every action you take is a vote for the person you wish to become. Let's cast your vote."
  },
  {
    title: "Your morning momentum 🔥",
    body: "Energy flows where attention goes. Take 2 minutes to direct your focus today."
  },
  {
    title: "Fresh sunrise, fresh slate 🍃",
    body: "Forget what didn't get done yesterday. Today is full of brand new opportunities."
  },
  {
    title: "Pause for 60 seconds 🧘",
    body: "Disconnect from the noise and connect with your purpose. Your morning ritual awaits."
  },
  {
    title: "What's the #1 win today? 🏆",
    body: "Define your main quest before side quests take over. Tap to write down your focus."
  }
];

const GREETINGS = [
  "Good morning! ☀️",
  "Hey there, champion 👋",
  "Rise & shine 🌅",
  "Quick morning spark ⚡",
  "Morning check-in ✨",
  "Hey friend 💛",
  "A little morning light 🌤️",
  "Psst... you awake? ☕",
  "Fresh day, fresh vibe 🌱",
  "Your 9 AM reminder 🎯",
  "Ready to conquer today? 👑",
  "Hello from today 🍃"
];

const CORE_INSIGHTS = [
  "2 minutes of quiet intention now will save you 2 hours of scattered stress later.",
  "You don't have to have everything figured out—just the very next right move.",
  "Coffee gives you energy, but intentional manifestation gives you direction.",
  "Small daily habits compound into miracles over time. Keep showing up.",
  "Today is an unwritten page. Make sure you're holding the pen.",
  "Your potential today is massive. Don't let micro-distractions steal your focus.",
  "Drop your shoulders, take a long inhale, and remember who you're becoming.",
  "Winning the morning isn't about hustle; it's about inner peace and focus.",
  "Every morning is a gentle reboot button for your mind and spirit.",
  "Be stubborn about your goals, but gentle and kind with your heart today.",
  "The secret to momentum is simply not breaking the chain of self-love.",
  "Action cures anxiety. Clarity creates calm. Let's tune into both.",
  "What would your most confident, grounded self do first today?",
  "A calm morning is the ultimate superpower in a noisy world."
];

const ACTIONS = [
  "Tap to start your 2-minute ritual ✨",
  "Let's lock in today's intention 🚀",
  "Claim your calm for today 🌿",
  "Ready when you are 💫",
  "Tap to set your frequency 📻",
  "Let's make today count 💛",
  "2 minutes to prime your mind 🧠",
  "Let's manifest something great ☀️"
];

const DAY_OF_WEEK_TOUCHES = {
  0: { title: "Sunday reset & peace 🌿", body: "A quiet, gentle morning. Take this sacred time just for you." },
  1: { title: "Monday fresh energy 🚀", body: "Brand new week, clean slate. Let's set the foundation strong." },
  2: { title: "Tuesday momentum ⚡", body: "You're in the rhythm now. Let's channel this energy into your top goal." },
  3: { title: "Midweek clarity 🌤️", body: "Wednesday check-in: pause, breathe, and realign with what truly matters." },
  4: { title: "Thursday power 🎯", body: "Keep the momentum going. Finish the week on your own terms." },
  5: { title: "Friday reflection & celebration 🎉", body: "Look at how far you've come this week! Let's seal the week with gratitude." },
  6: { title: "Saturday morning bliss ☕", body: "No rush today. Enjoy a relaxed, soulful manifestation ritual." }
};

export function getRandomDailyNotification(options = {}) {
  const day = options.dayOfWeek !== undefined ? options.dayOfWeek : new Date().getDay();
  const roll = Math.random();

  if (options.streakCount && options.streakCount >= 3 && roll < 0.25) {
    return {
      title: `🔥 Day ${options.streakCount} Streak Power!`,
      body: `You've shown up ${options.streakCount} days in a row! Let's keep this unstoppable momentum alive today.`
    };
  }

  if (options.identityTitle && roll >= 0.25 && roll < 0.45) {
    const titles = [
      `Embody your identity: ${options.identityTitle} ✨`,
      `The ${options.identityTitle} mindset 🎯`,
      `Showing up as a ${options.identityTitle} ☀️`
    ];
    const bodies = [
      `Every morning ritual confirms your identity as a ${options.identityTitle}. Let's do your 2 minutes.`,
      `How does a world-class ${options.identityTitle} begin their morning? With calm intention.`,
      `Cast your vote for being an exceptional ${options.identityTitle} today.`
    ];
    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      body: bodies[Math.floor(Math.random() * bodies.length)]
    };
  }

  if (roll >= 0.45 && roll < 0.65 && DAY_OF_WEEK_TOUCHES[day]) {
    return DAY_OF_WEEK_TOUCHES[day];
  }

  if (roll >= 0.65 && roll < 0.80) {
    return CURATED_NOTIFICATIONS[Math.floor(Math.random() * CURATED_NOTIFICATIONS.length)];
  }

  const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  const insight = CORE_INSIGHTS[Math.floor(Math.random() * CORE_INSIGHTS.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];

  return {
    title: greeting,
    body: `${insight} ${action}`
  };
}
