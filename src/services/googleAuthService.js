/**
 * Google Auth & APIs Service
 * Handles Client-side OAuth 2.0 (Google Identity Services) for:
 * - Gmail (gmail.readonly)
 * - Google Calendar (calendar.events.readonly)
 * - Google Tasks (tasks.readonly)
 */

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
  'https://www.googleapis.com/auth/tasks.readonly'
].join(' ');

let tokenClient = null;
let cachedAccessToken = null;
let tokenExpiresAt = 0;

/**
 * Initialize GIS Token Client
 */
export function initGoogleAuth(clientId, onTokenReceived, onError) {
  if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
    console.warn('Google Identity Services script not yet loaded.');
    return false;
  }
  if (!clientId) return false;

  try {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          console.error('Google Auth Error:', tokenResponse);
          if (onError) onError(tokenResponse);
          return;
        }
        cachedAccessToken = tokenResponse.access_token;
        tokenExpiresAt = Date.now() + (parseInt(tokenResponse.expires_in, 10) || 3600) * 1000;
        if (onTokenReceived) onTokenReceived(tokenResponse.access_token);
      }
    });
    return true;
  } catch (err) {
    console.error('Failed to init Google Token Client:', err);
    return false;
  }
}

/**
 * Prompt user for OAuth sign in / consent
 */
export function requestGoogleToken() {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Google Auth not initialized. Please enter a valid Google Client ID in Settings.'));
      return;
    }
    tokenClient.callback = (response) => {
      if (response.error) {
        reject(response);
      } else {
        cachedAccessToken = response.access_token;
        tokenExpiresAt = Date.now() + (parseInt(response.expires_in, 10) || 3600) * 1000;
        resolve(response.access_token);
      }
    };
    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

export function isGoogleConnected() {
  return !!(cachedAccessToken && Date.now() < tokenExpiresAt);
}

export function getStoredAccessToken() {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }
  return null;
}

export function disconnectGoogle() {
  if (cachedAccessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(cachedAccessToken, () => {
      cachedAccessToken = null;
      tokenExpiresAt = 0;
    });
  } else {
    cachedAccessToken = null;
    tokenExpiresAt = 0;
  }
}

/**
 * Fetch Gmail messages from last 24-36h
 */
export async function fetchRecentEmails(token = null) {
  const activeToken = token || getStoredAccessToken();
  if (!activeToken) {
    return getMockEmails();
  }

  try {
    const listRes = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=newer_than:2d&maxResults=15',
      { headers: { Authorization: `Bearer ${activeToken}` } }
    );
    if (!listRes.ok) throw new Error(`Gmail API error: ${listRes.status}`);
    const listData = await listRes.json();
    const messages = listData.messages || [];

    if (messages.length === 0) return [];

    const emailDetails = await Promise.all(
      messages.slice(0, 10).map(async (msg) => {
        try {
          const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
            { headers: { Authorization: `Bearer ${activeToken}` } }
          );
          if (!detailRes.ok) return null;
          const detail = await detailRes.json();
          const headers = detail.payload?.headers || [];
          const from = headers.find((h) => h.name === 'From')?.value || 'Unknown Sender';
          const subject = headers.find((h) => h.name === 'Subject')?.value || '(No Subject)';
          const date = headers.find((h) => h.name === 'Date')?.value || '';

          return {
            id: msg.id,
            threadId: msg.threadId,
            from,
            subject,
            snippet: detail.snippet || '',
            date
          };
        } catch (e) {
          return null;
        }
      })
    );

    return emailDetails.filter(Boolean);
  } catch (err) {
    console.warn('Gmail API error, falling back to mock data:', err);
    return getMockEmails();
  }
}

/**
 * Fetch today's Google Calendar events
 */
export async function fetchCalendarEvents(token = null) {
  const activeToken = token || getStoredAccessToken();
  if (!activeToken) {
    return getMockCalendar();
  }

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
        startOfDay
      )}&timeMax=${encodeURIComponent(endOfDay)}&singleEvents=true&orderBy=startTime`,
      { headers: { Authorization: `Bearer ${activeToken}` } }
    );
    if (!res.ok) throw new Error(`Calendar API error: ${res.status}`);
    const data = await res.json();
    const items = data.items || [];

    return items.map((item) => {
      const start = item.start?.dateTime || item.start?.date || '';
      const end = item.end?.dateTime || item.end?.date || '';
      const isAllDay = !item.start?.dateTime;
      
      let formattedTime = 'All Day';
      if (!isAllDay) {
        const d = new Date(start);
        formattedTime = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      }

      return {
        id: item.id,
        summary: item.summary || '(Untitled Event)',
        description: item.description || '',
        formattedTime,
        start,
        end,
        isAllDay,
        hangoutLink: item.hangoutLink || null,
        attendeeCount: item.attendees?.length || 0
      };
    });
  } catch (err) {
    console.warn('Google Calendar API error, falling back to mock:', err);
    return getMockCalendar();
  }
}

/**
 * Fetch today's Google Tasks
 */
export async function fetchGoogleTasks(token = null) {
  const activeToken = token || getStoredAccessToken();
  if (!activeToken) {
    return getMockTasks();
  }

  try {
    const listsRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
      headers: { Authorization: `Bearer ${activeToken}` }
    });
    if (!listsRes.ok) throw new Error(`Tasks API error: ${listsRes.status}`);
    const listsData = await listsRes.json();
    const primaryList = listsData.items?.[0]?.id || '@default';

    const tasksRes = await fetch(
      `https://tasks.googleapis.com/tasks/v1/lists/${primaryList}/tasks?showCompleted=false&maxResults=20`,
      { headers: { Authorization: `Bearer ${activeToken}` } }
    );
    if (!tasksRes.ok) throw new Error(`Tasks list error: ${tasksRes.status}`);
    const tasksData = await tasksRes.json();
    const items = tasksData.items || [];

    return items.map((t) => ({
      id: t.id,
      title: t.title,
      notes: t.notes || '',
      due: t.due || null,
      status: t.status
    }));
  } catch (err) {
    console.warn('Google Tasks API error, falling back to mock:', err);
    return getMockTasks();
  }
}

/**
 * High-signal Mock Data for Executive Demo Mode
 */
export function getMockEmails() {
  return [
    {
      id: 'mock-1',
      from: 'Marcus Vance <m.vance@vanguardcap.com>',
      subject: 'Re: Series B Term Sheet Finalization & Board Seat Clause',
      snippet: 'Reviewed the modified liquidation preference and governance terms. We are aligned to sign by 4:00 PM EST if you confirm the indemnity clause.',
      date: new Date().toISOString()
    },
    {
      id: 'mock-2',
      from: 'Elena Rostova <elena@product-eng.internal>',
      subject: 'Q3 Architectural Migration Sign-Off Required',
      snippet: 'Latency stress-tests for the distributed vector indexing service passed with 12ms p99. Need your one-click approval on the rollout manifest before the 2 PM deploy window.',
      date: new Date().toISOString()
    },
    {
      id: 'mock-3',
      from: 'Substack Weekly Digest <digest@substack.com>',
      subject: 'The State of Generative UI Models in 2026',
      snippet: 'Here is your weekly roundup of top AI architecture papers and open-source models...',
      date: new Date().toISOString()
    }
  ];
}

export function getMockCalendar() {
  return [
    {
      id: 'cal-1',
      summary: 'Morning Deep Work & Strategic Synthesis',
      formattedTime: '08:00 AM',
      isAllDay: false,
      attendeeCount: 1
    },
    {
      id: 'cal-2',
      summary: 'Series B Lead Partner Alignment Sync (Google Meet)',
      formattedTime: '11:00 AM',
      isAllDay: false,
      attendeeCount: 4,
      hangoutLink: 'https://meet.google.com/demo-exec-sync'
    },
    {
      id: 'cal-3',
      summary: 'Engineering Leadership Architecture Review',
      formattedTime: '02:30 PM',
      isAllDay: false,
      attendeeCount: 6
    },
    {
      id: 'cal-4',
      summary: 'Daily Async Standup',
      formattedTime: '09:30 AM',
      isAllDay: false,
      attendeeCount: 12
    }
  ];
}

export function getMockTasks() {
  return [
    {
      id: 'task-1',
      title: 'Sign and return the Series B term sheet indemnity addendum',
      notes: 'High leverage milestone for capital allocation'
    },
    {
      id: 'task-2',
      title: 'Approve the Q3 vector migration manifest before 2:00 PM deploy',
      notes: 'Blocks production infrastructure latency upgrade'
    },
    {
      id: 'task-3',
      title: 'Review key hire offer package for Head of Growth Engineering',
      notes: 'Critical leadership recruiting pipeline'
    },
    {
      id: 'task-4',
      title: 'Clear low-priority Slack channels and archive completed projects',
      notes: 'Operational hygiene'
    }
  ];
}
