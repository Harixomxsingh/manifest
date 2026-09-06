/**
 * Gemini Intelligence Engine
 * Executes single unified call using gemini-2.5-flash with structured JSON response
 */

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

export const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    optimismAnchor: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING' },
        content: { type: 'STRING' },
        identityReminder: { type: 'STRING' }
      },
      required: ['title', 'content', 'identityReminder']
    },
    weatherTactics: {
      type: 'OBJECT',
      properties: {
        summary: { type: 'STRING' },
        clothingAdvice: { type: 'STRING' },
        commuteOrOutdoorGuidance: { type: 'STRING' }
      },
      required: ['summary', 'clothingAdvice', 'commuteOrOutdoorGuidance']
    },
    calendarTriage: {
      type: 'OBJECT',
      properties: {
        dailyPrinciple: { type: 'STRING' },
        principleExplanation: { type: 'STRING' },
        nonRoutineEvents: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              time: { type: 'STRING' },
              summary: { type: 'STRING' },
              isActionRequired: { type: 'BOOLEAN' }
            },
            required: ['time', 'summary', 'isActionRequired']
          }
        }
      },
      required: ['dailyPrinciple', 'principleExplanation', 'nonRoutineEvents']
    },
    prioritizedTasks: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          rank: { type: 'INTEGER' },
          reason: { type: 'STRING' }
        },
        required: ['title', 'rank', 'reason']
      }
    },
    inboxTriage: {
      type: 'OBJECT',
      properties: {
        status: { type: 'STRING', description: "'ALL_CLEAR' or 'ACTION_NEEDED'" },
        summary: { type: 'STRING' },
        urgentItems: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              sender: { type: 'STRING' },
              subject: { type: 'STRING' },
              actionRequired: { type: 'STRING' }
            },
            required: ['sender', 'subject', 'actionRequired']
          }
        }
      },
      required: ['status', 'summary', 'urgentItems']
    }
  },
  required: ['optimismAnchor', 'weatherTactics', 'calendarTriage', 'prioritizedTasks', 'inboxTriage']
};

/**
 * Generate Unified Morning Briefing via Gemini 2.5 Flash
 */
export async function generateMorningBriefing({
  apiKey,
  model = 'gemini-2.5-flash',
  article,
  weather,
  emails,
  calendarEvents,
  tasks
}) {
  // If no API key provided, generate dynamic high-IQ local briefing
  if (!apiKey || apiKey.trim() === '') {
    return generateLocalFallbackBriefing({ article, weather, emails, calendarEvents, tasks });
  }

  const promptContent = `
Analyze the following raw morning inputs for an executive leader and generate a unified, structured daily dispatch.
Follow these tenets strictly:
1. Zero Decision Fatigue: Radical clarity.
2. Signal Over Noise: Filter out routine standups, automated newsletters, receipts, and minor operational tasks.
3. If no urgent human-action email exists, set inbox status strictly to "ALL_CLEAR".
4. Ground the optimism anchor in relentless opportunistic problem-solving and resilient self-mastery.

INPUTS:
- TODAY'S JAMES CLEAR ARTICLE: "${article?.title}" (${article?.category}) — Hook: "${article?.hook}"
- WEATHER DATA (06:00 to 18:00): Current: ${weather?.currentTemp}${weather?.unit}, High: ${weather?.highTemp}${weather?.unit}, Low: ${weather?.lowTemp}${weather?.unit}, Rain Risk: ${weather?.maxRainProb}%, Condition: ${weather?.weatherLabel}.
- RECENT EMAILS (last 24-36h):
${JSON.stringify(emails || [], null, 2)}
- TODAY'S SCHEDULE (Events):
${JSON.stringify(calendarEvents || [], null, 2)}
- TODAY'S DUE TASKS:
${JSON.stringify(tasks || [], null, 2)}
`;

  const requestBody = {
    system_instruction: {
      parts: [
        {
          text: 'You are an elite personal chief of staff. Your core principles are zero decision fatigue, radical signal-over-noise filtering, and unshakeable optimism. Analyze raw email, calendar, weather, task, and reading inputs to generate an executive morning briefing.'
        }
      ]
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: promptContent }]
      }
    ],
    generation_config: {
      response_mime_type: 'application/json',
      response_schema: GEMINI_RESPONSE_SCHEMA,
      temperature: 0.3
    }
  };

  try {
    const url = `${GEMINI_API_ENDPOINT}/${model}:generateContent?key=${apiKey.trim()}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Gemini API returned error status:', response.status, errorData);
      
      // Fallback to gemini-1.5-flash if 2.5-flash is not yet enabled on this key
      if (model === 'gemini-2.5-flash') {
        return generateMorningBriefing({
          apiKey,
          model: 'gemini-1.5-flash',
          article,
          weather,
          emails,
          calendarEvents,
          tasks
        });
      }
      throw new Error(errorData?.error?.message || `Gemini API returned HTTP ${response.status}`);
    }

    const json = await response.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error('No candidate content received from Gemini.');

    const parsed = JSON.parse(candidateText);
    return parsed;
  } catch (err) {
    console.warn('Gemini synthesis failed, utilizing local fallback engine:', err.message);
    return generateLocalFallbackBriefing({ article, weather, emails, calendarEvents, tasks });
  }
}

import { getTodayIdentityAnchor } from './identityService';

/**
 * Intelligent Local Fallback Engine
 * Evaluates inputs and produces a structured briefing identical to Gemini's schema
 */
export function generateLocalFallbackBriefing({ article, weather, emails, calendarEvents, tasks, dateStr = null }) {
  // 1. Triage Inbox
  const actionableEmails = (emails || []).filter((e) => {
    const subject = (e.subject || '').toLowerCase();
    const snippet = (e.snippet || '').toLowerCase();
    const from = (e.from || '').toLowerCase();
    
    // Ignore newsletter patterns
    if (from.includes('digest') || from.includes('newsletter') || from.includes('noreply') || from.includes('no-reply') || from.includes('substack')) {
      return false;
    }
    
    const isUrgent = subject.includes('urgent') || subject.includes('sign') || subject.includes('approval') || subject.includes('term sheet') || snippet.includes('sign by') || snippet.includes('need your') || snippet.includes('deadline');
    return isUrgent;
  });

  const inboxStatus = actionableEmails.length > 0 ? 'ACTION_NEEDED' : 'ALL_CLEAR';
  const inboxSummary =
    actionableEmails.length > 0
      ? `${actionableEmails.length} high-leverage email item(s) require executive sign-off or confirmation today.`
      : 'All Clear. Zero urgent human communications detected. No inbox friction today.';

  const urgentItems = actionableEmails.map((e) => {
    let action = 'Review and reply to sender';
    if (e.subject.toLowerCase().includes('term sheet')) action = 'Confirm indemnity clause before 4:00 PM EST signature.';
    if (e.subject.toLowerCase().includes('migration')) action = 'Review & sign off on rollout manifest before 2:00 PM deploy window.';
    return {
      sender: e.from,
      subject: e.subject,
      actionRequired: action
    };
  });

  // 2. Calendar Triage & Strategic Mental Model
  const nonRoutine = (calendarEvents || [])
    .filter((ev) => {
      const summary = (ev.summary || '').toLowerCase();
      return !summary.includes('standup') && !summary.includes('daily sync') && !summary.includes('lunch');
    })
    .map((ev) => ({
      time: ev.formattedTime || 'Scheduled',
      summary: ev.summary,
      isActionRequired: (ev.attendeeCount && ev.attendeeCount > 1) || !!ev.hangoutLink
    }));

  const hasHighStakesMeetings = nonRoutine.some((e) => e.summary.toLowerCase().includes('partner') || e.summary.toLowerCase().includes('board') || e.summary.toLowerCase().includes('review'));
  
  const dailyPrinciple = hasHighStakesMeetings ? 'Maker vs. Manager Schedule' : 'Deep Work Sprint (Flow Horizon)';
  const principleExplanation = hasHighStakesMeetings
    ? 'Cluster executive alignment calls into the late morning; fiercely protect early morning hours for solitary high-leverage architecture.'
    : 'Your calendar provides wide uninterrupted runway today. Dedicate your first 90 minutes solely to your #1 compounding task before opening communications.';

  // 3. Task Prioritization
  const prioritizedTasks = (tasks || []).slice(0, 4).map((t, idx) => ({
    title: t.title,
    rank: idx + 1,
    reason: idx === 0 ? 'Unblocks major stakeholder capital allocation and sets organizational momentum.' : idx === 1 ? 'High architectural leverage; clears infrastructure dependencies.' : 'High-yield operational milestone.'
  }));

  // 4. Weather Tactics
  const weatherTactics = weather?.tactics || {
    summary: `${weather?.highTemp || 72}° / ${weather?.lowTemp || 54}° • ${weather?.weatherLabel || 'Crisp & Clear'}`,
    clothingAdvice: 'Layer with a crisp light sweater or tailored jacket for the morning chill.',
    commuteOrOutdoorGuidance: 'Ideal conditions for a brisk morning walk or walk-and-talk phone sync.'
  };

  // 5. Dynamic Daily Identity-Based Optimism Anchor (Changes every day!)
  const dynamicAnchor = getTodayIdentityAnchor(dateStr);
  const optimismAnchor = {
    title: dynamicAnchor.title,
    content: dynamicAnchor.content,
    identityReminder: dynamicAnchor.identityReminder
  };

  return {
    optimismAnchor,
    weatherTactics,
    calendarTriage: {
      dailyPrinciple,
      principleExplanation,
      nonRoutineEvents: nonRoutine
    },
    prioritizedTasks,
    inboxTriage: {
      status: inboxStatus,
      summary: inboxSummary,
      urgentItems
    }
  };
}
