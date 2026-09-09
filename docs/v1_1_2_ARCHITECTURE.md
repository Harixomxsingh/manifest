# Manifest Architecture & Version Documentation (v1.1.2)

**Manifest: The Sovereign Morning Ritual Engine**  
*Platform Parity: Web Progressive Web App (PWA) & Android / Expo Mobile Native*

---

## 1. Executive Summary & Design Philosophy
`Manifest` is an intentional, zero-clutter morning operating system engineered to transform early-morning inertia and mental fog into disciplined focus, poise, and constructive momentum.

### Core Architectural Pillars
1. **Calm, Distraction-Free Aesthetics**: Curated warm cream palettes (`#FDFBF7`), rich amber/gold energy accents (`#B45309`, `#D97706`), clean serif typography for reflection prompts, and crisp monospace micro-labels.
2. **Illuminated Path Progression**: A clear 5-phase sequential ritual where completed steps illuminate in radiant amber with glowing checkmarks (`✓`), while upcoming phases stay calm and subtle.
3. **Hybrid Voice & Text Journaling**: Real-time audio recording or written notes with instant plain-language distillation (*Your Core Focus*, *Next Step*, *Mindset Check*, *Positive Reframe*).
4. **120+ Categorized Morning Prompt Library**: Categorized across 12 distinct human focus vectors (Focus, Release, Momentum, Stoic, Courage, Gratitude, Vision, Identity, Energy, Impact, Reframe, Creativity) with real-time keyword search and surprise shuffler.
5. **Journal Vault & Filterable Archive**: Permanent storage of reflections with time-range filters (`All Time`, `This Week`, `This Month`, `This Year`), keyword search, sort order toggles, and 1-click loading into the day's active focus.

---

## 2. Ritual Sequence Architecture (Phase 00 – Phase 05)

```
[Phase 00: Welcome & Intent] 
       │ (Illuminated Golden Beam)
       ▼
[Phase 01: Identity Anchor]
       │ (Illuminated Golden Beam)
       ▼
[Phase 02: Mindset Reading]
       │ (Illuminated Golden Beam)
       ▼
[Phase 03: Voice & Text Clarity] ◄── [120+ Prompt Library Modal] ◄── [Journal Vault]
       │ (Illuminated Golden Beam)
       ▼
[Phase 04: Atmosphere & Climate]
       │ (Illuminated Golden Beam)
       ▼
[Phase 05: Launchpad & Dispatch] ◄── [Party Celebration + Audio Readout + Vault Access]
```

### Phase Details:
- **Phase 00: Welcome (`PhaseWelcome`)**: Date/time anchor, morning energy greeting, and launch button.
- **Phase 01: Identity Anchor (`PhaseIdentity`)**: Affirmative daily anchor statement with daily seed rotation and manual shuffle.
- **Phase 02: Mindset Reading (`PhaseReading`)**: High-leverage philosophical and mental model readings (Stoic, Atomic Habits, Essentialism).
- **Phase 03: Voice & Text Clarity (`PhaseVoiceClarity`)**:
  - **120+ Prompts**: Daily seed + shuffle + Prompt Library Browser.
  - **Recording**: 30–60s high-fidelity mic capture with live timer & pulsing indicator.
  - **Distillation**: Gemini AI / heuristic fallback distilling *Core Focus*, *Next Step*, *Mindset Check*, *Positive Reframe*.
- **Phase 04: Atmosphere & Climate (`PhaseClimate`)**: Live local weather, temperature, clothing recommendations, and air quality.
- **Phase 05: Launchpad Ready (`PhaseLaunch`)**: Celebration particles, unified summary card, Web Speech / Native TTS audio summary dispatch, Journal Vault browser, and session restart.

---

## 3. Directory & File Structure

```
├── docs/
│   └── v1_1_2_ARCHITECTURE.md           # Architecture documentation
├── src/
│   ├── App.jsx                         # Main Web App entry rendering v1_1_2
│   ├── context/
│   │   └── AppContext.jsx              # Web global ritual state & session lifecycle
│   ├── data/
│   │   ├── voicePrompts.json           # 120+ rich categorized morning prompts
│   │   └── motivationalQuotes.json     # Curated daily mindset quotes
│   ├── services/
│   │   ├── quoteService.js             # Daily deterministic & random quote provider
│   │   ├── voiceRecorderService.js     # Web Audio recording & Journal Vault storage
│   │   └── voiceSynthesisService.js    # Gemini AI distillation engine
│   └── v1_1_2/
│       ├── DashboardV1_1_2.jsx         # Main Web Dashboard layout
│       ├── components/
│       │   ├── Header.jsx              # Top bar with Logo, Vault, Shuffle, Speech & Location
│       │   ├── SidebarRitualPath.jsx   # Desktop Illuminated Path progression
│       │   ├── MobileBottomDock.jsx    # Responsive mobile bottom navigation bar
│       │   ├── PromptBrowserModal.jsx  # 120+ Prompt Library Modal with search & filters
│       │   └── JournalVaultModal.jsx   # Filterable Journal Vault modal
│       └── phases/
│           ├── PhaseWelcome.jsx
│           ├── PhaseIdentity.jsx
│           ├── PhaseReading.jsx
│           ├── PhaseVoiceClarity.jsx
│           ├── PhaseClimate.jsx
│           └── PhaseLaunch.jsx
└── mobile/
    ├── App.js                          # Expo Mobile Native entry
    └── src/
        ├── context/
        │   └── AppContext.js           # Mobile global state provider
        ├── data/
        │   └── voicePrompts.json       # Synced 120+ prompts dataset
        ├── services/
        │   ├── voiceRecorderService.js # Expo-Audio recording & AsyncStorage Vault
        │   └── voiceSynthesisService.js
        ├── components/
        │   ├── Header.js               # Mobile Header with Logo, Vault, Mic, Shuffle, TTS
        │   ├── BottomRitualBar.js      # Illuminated Path mobile bottom tab bar
        │   ├── PromptBrowserModal.js   # Mobile 120+ Prompt Library modal
        │   └── JournalVaultModal.js    # Mobile Journal Vault modal
        └── phases/
            ├── PhaseWelcome.js
            ├── PhaseIdentity.js
            ├── PhaseReading.js
            ├── PhaseVoiceClarity.js
            ├── PhaseClimate.js
            └── PhaseLaunch.js
```

---

## 4. Git Branching & Version Isolation

- **Current Active Working Branch**: `development`
- **Production Branch**: `main` (Untouched & completely isolated)
- **Remote**: `origin` (`https://github.com/Harixomxsingh/manifest.git`)
- All new features, components, and dataset upgrades are contained on `development` and backed up to GitHub for 100% data recovery.
