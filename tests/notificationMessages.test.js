import { describe, it, expect } from 'vitest';
import { getRandomDailyNotification, CURATED_NOTIFICATIONS } from '../src/data/notificationMessages';

describe('Notification Message Engine (1,000+ Combinations)', () => {
  it('should have a rich set of curated notifications', () => {
    expect(CURATED_NOTIFICATIONS.length).toBeGreaterThanOrEqual(10);
    CURATED_NOTIFICATIONS.forEach((item) => {
      expect(item.title).toBeTruthy();
      expect(item.body).toBeTruthy();
    });
  });

  it('should generate valid notifications with non-empty title and body', () => {
    for (let i = 0; i < 50; i++) {
      const notif = getRandomDailyNotification();
      expect(notif).toHaveProperty('title');
      expect(notif).toHaveProperty('body');
      expect(typeof notif.title).toBe('string');
      expect(typeof notif.body).toBe('string');
      expect(notif.title.length).toBeGreaterThan(3);
      expect(notif.body.length).toBeGreaterThan(10);
    }
  });

  it('should produce high diversity across multiple runs', () => {
    const uniqueTitles = new Set();
    const uniqueBodies = new Set();

    for (let i = 0; i < 200; i++) {
      const notif = getRandomDailyNotification();
      uniqueTitles.add(notif.title);
      uniqueBodies.add(notif.body);
    }

    // Should have generated many distinct titles and bodies
    expect(uniqueTitles.size).toBeGreaterThanOrEqual(10);
    expect(uniqueBodies.size).toBeGreaterThanOrEqual(25);
  });

  it('should generate streak-aware reminders when streak >= 3', () => {
    let streakFound = false;
    for (let i = 0; i < 50; i++) {
      const notif = getRandomDailyNotification({ streakCount: 7 });
      if (notif.title.includes('Streak') || notif.body.includes('7 days')) {
        streakFound = true;
        break;
      }
    }
    expect(streakFound).toBe(true);
  });

  it('should generate identity-aware reminders when identityTitle is provided', () => {
    let identityFound = false;
    for (let i = 0; i < 50; i++) {
      const notif = getRandomDailyNotification({ identityTitle: 'Mindful Creator' });
      if (notif.title.includes('Mindful Creator') || notif.body.includes('Mindful Creator')) {
        identityFound = true;
        break;
      }
    }
    expect(identityFound).toBe(true);
  });

  it('should handle all days of the week gracefully', () => {
    for (let day = 0; day <= 6; day++) {
      const notif = getRandomDailyNotification({ dayOfWeek: day });
      expect(notif.title).toBeTruthy();
      expect(notif.body).toBeTruthy();
    }
  });
});
