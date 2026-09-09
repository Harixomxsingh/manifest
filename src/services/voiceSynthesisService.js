/**
 * Voice Synthesis & Clarity Distillation Engine (Web)
 * Converts raw spoken thoughts into emotional awareness, manifestation anchors, and next steps.
 */

export const synthesizeVoiceClarityLocally = (transcript, durationSec = 15) => {
  const text = (transcript || '').trim();
  const lower = text.toLowerCase();

  // 1. Mindset Check
  let emotionalPulse = 'Calm, grounded clarity ready for deliberate execution.';
  if (lower.includes('stress') || lower.includes('worry') || lower.includes('anxious') || lower.includes('scared')) {
    emotionalPulse = 'Recognized slight background tension; transforming anxious energy into grounded precision.';
  } else if (lower.includes('excited') || lower.includes('energy') || lower.includes('ready') || lower.includes('fire')) {
    emotionalPulse = 'High enthusiasm and strong creative momentum across morning intentions.';
  } else if (lower.includes('tired') || lower.includes('sleep') || lower.includes('slow') || lower.includes('exhausted')) {
    emotionalPulse = 'Gentle morning pacing required; protecting energy for your highest leverage task.';
  } else if (text.length > 20) {
    emotionalPulse = 'Reflective and clear-sighted; internal thoughts aligned with constructive action.';
  }

  // 2. Core Focus / Manifestation Anchor
  let manifestationAnchor = 'I move through today with steady cadence; speed comes from clarity, not rushing.';
  if (lower.includes('focus') || lower.includes('priority') || lower.includes('important')) {
    manifestationAnchor = 'I guard my attention ruthlessly. Saying no to trivial noise protects my masterpiece.';
  } else if (lower.includes('finish') || lower.includes('done') || lower.includes('complete') || lower.includes('deliver')) {
    manifestationAnchor = 'Execution over contemplation. I start immediately and let momentum dissolve resistance.';
  } else if (lower.includes('confidence') || lower.includes('lead') || lower.includes('speak') || lower.includes('client')) {
    manifestationAnchor = 'I enter the arena with quiet confidence and unshakeable self-command.';
  } else if (lower.includes('peace') || lower.includes('calm') || lower.includes('breath')) {
    manifestationAnchor = 'I am the calm eye at the center of the storm. Nothing outside disturbs my focus.';
  }

  // 3. Next Step
  let kineticAction = 'Execute the single highest-impact 2-minute action immediately after this ritual.';
  if (lower.includes('write') || lower.includes('draft') || lower.includes('document')) {
    kineticAction = 'Open your primary document and write the opening 3 bullet points before opening your inbox.';
  } else if (lower.includes('call') || lower.includes('email') || lower.includes('message') || lower.includes('reach out')) {
    kineticAction = 'Send the single critical message with concise clarity, then return to deep focus.';
  } else if (lower.includes('code') || lower.includes('build') || lower.includes('ship') || lower.includes('develop')) {
    kineticAction = 'Launch your development workspace and resolve the first task on your checklist.';
  } else if (lower.includes('meeting') || lower.includes('present') || lower.includes('talk')) {
    kineticAction = 'Review your 3 core talking points for 2 minutes to anchor effortless poise.';
  }

  // 4. Positive Reframe
  let opportunityReframe = 'Any unexpected friction today is not a barrier—it is an arena to demonstrate mastery.';
  if (lower.includes('problem') || lower.includes('issue') || lower.includes('hard') || lower.includes('difficult')) {
    opportunityReframe = 'The obstacle in front of you clarifies what matters and forces higher efficiency.';
  } else if (lower.includes('time') || lower.includes('late') || lower.includes('busy')) {
    opportunityReframe = 'Tight constraints eliminate fluff and unlock your most creative problem-solving.';
  }

  return {
    emotionalPulse,
    manifestationAnchor,
    kineticAction,
    opportunityReframe,
    timestamp: new Date().toISOString(),
    transcript: text || 'Spoken morning clarity stream.'
  };
};

export const synthesizeVoiceWithGemini = async (transcript, apiKey, model = 'gemini-2.5-flash') => {
  if (!apiKey || !transcript || transcript.trim().length < 5) {
    return synthesizeVoiceClarityLocally(transcript);
  }

  try {
    const prompt = `You are an elite executive performance advisor and mindfulness master. A user just finished their 30-60 second morning voice reflection.
Transcribed Spoken Thoughts:
"${transcript}"

Analyze their spoken words and return a STRICT JSON object with these exact 4 keys:
{
  "emotionalPulse": "1 concise sentence summarizing their current subconscious mental/emotional state with constructive warmth.",
  "manifestationAnchor": "1 powerful, memorable personal daily affirmation tailored to what they spoke (written in first-person 'I...').",
  "kineticAction": "1 specific, immediate micro-action they should execute right away to build momentum.",
  "opportunityReframe": "1 inspiring sentence reframing any worry or challenge they mentioned into an unfair advantage."
}
Do not include markdown or backticks in response, only the raw JSON.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      return synthesizeVoiceClarityLocally(transcript);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return synthesizeVoiceClarityLocally(transcript);

    const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
    return {
      emotionalPulse: parsed.emotionalPulse || 'Clear focus with deliberate intention.',
      manifestationAnchor: parsed.manifestationAnchor || 'I command my focus and conquer what matters most.',
      kineticAction: parsed.kineticAction || 'Execute your top priority task immediately.',
      opportunityReframe: parsed.opportunityReframe || 'Every challenge today is fuel for your growth.',
      timestamp: new Date().toISOString(),
      transcript
    };
  } catch (err) {
    console.warn('Gemini synthesis failed, using local fallback:', err.message);
    return synthesizeVoiceClarityLocally(transcript);
  }
};
