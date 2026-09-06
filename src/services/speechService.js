/**
 * Web Speech API Service for Morning Audio Readout
 */

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.onStateChange = null;
  }

  speakBriefing(briefing, article, weather, onStatusChange) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    this.stop();
    this.onStateChange = onStatusChange;

    const sections = [];
    
    // 1. Greeting & Identity Anchor
    sections.push('Good morning. Here is your executive morning dispatch.');
    if (briefing?.optimismAnchor) {
      sections.push(`Identity anchor: ${briefing.optimismAnchor.title}. ${briefing.optimismAnchor.identityReminder}. ${briefing.optimismAnchor.content}`);
    }

    // 2. Weather
    if (briefing?.weatherTactics) {
      sections.push(`Weather intelligence: ${briefing.weatherTactics.summary}. ${briefing.weatherTactics.clothingAdvice} ${briefing.weatherTactics.commuteOrOutdoorGuidance}`);
    }

    // 3. Calendar & Principle
    if (briefing?.calendarTriage) {
      sections.push(`Today's strategic principle: ${briefing.calendarTriage.dailyPrinciple}. ${briefing.calendarTriage.principleExplanation}`);
    }

    // 4. Inbox
    if (briefing?.inboxTriage) {
      if (briefing.inboxTriage.status === 'ALL_CLEAR') {
        sections.push('Inbox triage: All clear. Zero urgent communications requiring your attention.');
      } else {
        sections.push(`Inbox triage: Action needed. ${briefing.inboxTriage.summary}`);
        briefing.inboxTriage.urgentItems?.forEach((item, idx) => {
          sections.push(`Item ${idx + 1}: From ${item.sender}. Subject: ${item.subject}. Action: ${item.actionRequired}.`);
        });
      }
    }

    // 5. Tasks
    if (briefing?.prioritizedTasks?.length) {
      sections.push(`Your top priority tasks today are:`);
      briefing.prioritizedTasks.forEach((t) => {
        sections.push(`Rank ${t.rank}: ${t.title}.`);
      });
    }

    // 6. James Clear
    if (article) {
      sections.push(`Today's James Clear reading is "${article.title}" in ${article.category}. ${article.hook}`);
    }

    sections.push('Have a relentless, high-impact day.');

    const fullText = sections.join(' ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 1.02;
    utterance.pitch = 0.98;

    // Select preferred high-quality English voice if available
    const voices = this.synth.getVoices();
    const premiumVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Enhanced') || v.name.includes('Premium') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Google US English'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
    }
  }

  toggle(briefing, article, weather, onStatusChange) {
    if (this.isSpeaking) {
      this.stop();
    } else {
      this.speakBriefing(briefing, article, weather, onStatusChange);
    }
  }
}

export const speechService = new SpeechService();
