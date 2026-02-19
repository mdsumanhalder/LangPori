# LangPori - Language Learning App
## Complete Architecture, Tech Stack & Improvement Analysis

---

## 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Technology Stack](#technology-stack)
3. [Package Dependencies](#package-dependencies)
4. [Architecture Overview](#architecture-overview)
5. [Feature Breakdown](#feature-breakdown)
6. [User Flows](#user-flows)
7. [Competitive Analysis](#competitive-analysis)
8. [Monetization Recommendations](#monetization-recommendations)
9. [Feature Improvements](#feature-improvements)

---

## 🎯 Application Overview

**LangPori** is a Progressive Web App (PWA) designed for learning the Estonian language. It targets learners from beginner (A1) to intermediate (B1) levels following the Common European Framework of Reference (CEFR) standards.

### Current Capabilities
- 📚 Structured vocabulary lessons (A1, A2, B1 + EE20% essential vocabulary)
- 📝 Comprehensive exam system with 5 question types
- 🎙️ Pronunciation practice with speech recognition
- 👂 Listening drills and dictation exercises
- 📖 Dictionary with Wiktionary integration
- 💬 Sentence practice with 120+ real sentences
- 📈 Progress tracking with streaks and study time
- 🌐 Multi-language UI support (Estonian/English)

---

## 🛠️ Technology Stack

### Frontend Framework
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router, SSR/SSG support |
| **React** | 19.2.3 | UI component library |
| **TypeScript** | ^5 | Type-safe development |

### State Management
| Technology | Purpose |
|-----------|---------|
| **Redux Toolkit** | Global state management for user progress |
| **LocalStorage** | Client-side persistence for offline support |

### Styling & UI
| Technology | Purpose |
|-----------|---------|
| **TailwindCSS** | Utility-first CSS framework |
| **Framer Motion** | Animations and transitions |
| **Radix UI** | Accessible component primitives |
| **Lucide React** | Icon library |
| **shadcn/ui** | Pre-built component system |

### PWA & Offline
| Technology | Purpose |
|-----------|---------|
| **next-pwa** | Service worker generation |
| **workbox-window** | PWA functionality |

### Speech & Audio
| Technology | Purpose |
|-----------|---------|
| **Web Speech API** | Browser-native TTS and speech recognition |
| **Google Translate TTS** | Fallback TTS for Estonian pronunciation |
| **@google-cloud/text-to-speech** | Server-side TTS (available but not primary) |
| **@deepgram/sdk** | Advanced speech recognition (available) |

---

## 📦 Package Dependencies

### Production Dependencies
```json
{
  "@deepgram/sdk": "^4.11.3",
  "@google-cloud/text-to-speech": "^6.4.0",
  "@radix-ui/react-icons": "^1.3.2",
  "@reduxjs/toolkit": "^2.11.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "framer-motion": "^12.33.0",
  "lucide-react": "^0.563.0",
  "next": "16.1.6",
  "next-pwa": "^5.6.0",
  "radix-ui": "^1.4.3",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "react-redux": "^9.2.0",
  "tailwind-merge": "^3.4.0",
  "workbox-window": "^7.4.0"
}
```

### Development Dependencies
```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "babel-plugin-react-compiler": "1.0.0",
  "eslint": "^9",
  "eslint-config-next": "16.1.6",
  "shadcn": "^3.8.4",
  "tailwindcss": "^4",
  "tw-animate-css": "^1.4.0",
  "typescript": "^5"
}
```

---

## 🏗️ Architecture Overview

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── tts/          # Text-to-Speech endpoint
│   │   └── wiktionary/   # Dictionary lookup endpoint
│   ├── dictionary/        # Dictionary feature
│   ├── exam/             # Exam system
│   ├── grammar/          # Quick grammar practice
│   ├── lessons/          # Vocabulary lessons
│   ├── practice/         # Practice zone hub
│   │   ├── dictation/    # Dictation exercises
│   │   ├── listening/    # Listening drills
│   │   └── pronunciation/# Speaking practice
│   ├── sentences/        # Sentence practice
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Home dashboard
│   └── globals.css       # Global styles
│
├── components/            # Reusable UI components
│   ├── LanguageSwitcher.tsx
│   ├── Navbar.tsx
│   └── providers/
│       └── ReduxProvider.tsx
│
├── data/                  # Static data files
│   ├── commonVoiceData.ts # Audio metadata
│   ├── frequencyData.ts   # Word frequency data
│   ├── lessonData.ts      # 500+ vocabulary items
│   └── sentenceData.ts    # 120+ practice sentences
│
├── hooks/                 # Custom React hooks
│   ├── useExam.ts        # Exam generation logic
│   ├── useLessons.ts     # Lesson management
│   ├── useRecording.ts   # Audio recording
│   ├── useSpeech.ts      # TTS functionality
│   └── useSpeechRecognition.ts # Speech-to-text
│
├── lib/                   # Utility functions
│   ├── translations.ts   # i18n translations
│   └── utils.ts          # Helper utilities
│
├── store/                 # Redux state management
│   ├── index.ts          # Store configuration
│   ├── progressSlice.ts  # User progress state
│   └── settingsSlice.ts  # App settings
│
└── types/                 # TypeScript definitions
    ├── index.ts          # Core type definitions
    ├── next-pwa.d.ts     # PWA types
    └── speech-recognition.d.ts # Web Speech API types
```

### Data Flow Architecture

```
┌─────────────────┐
│   User Action   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  React Component │────▶│  Custom Hooks   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │   Static Data   │
         │              │  (lessonData)   │
         │              └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Redux Store    │
│ (progressSlice) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  localStorage   │
│  (Persistence)  │
└─────────────────┘
```

---

## 🎮 Feature Breakdown

### 1. Lessons System
- **Levels**: A1 (Beginner), A2 (Elementary), B1 (Intermediate), EE20% (Essential)
- **Content Structure**:
  - Categories within lessons (e.g., "Common Greetings", "Numbers")
  - Each word includes: translation, pronunciation, grammar notes, example sentences
- **Features**:
  - TTS audio playback for each word
  - "Play All Words" sequential audio feature
  - Lesson completion tracking

### 2. Exam System
- **Question Types**:
  1. **Multiple Choice** - Translation matching
  2. **Reading** - Sentence comprehension
  3. **Listening** - Audio-based selection
  4. **Writing** - Type the translation
  5. **Speaking** - Pronunciation assessment
- **Scoring**: Uses Levenshtein distance for similarity calculation
- **Results**: Section-by-section breakdown with score percentages

### 3. Practice Zone
- **Pronunciation Practice**: Record and compare with native audio
- **Listening Drills**: Multiple choice from audio
- **Dictation**: Type what you hear

### 4. Dictionary
- Wiktionary API integration
- Word frequency rankings
- Pronunciation guides

### 5. Sentence Practice
- 120+ sentences from Tatoeba
- Bidirectional practice (Estonian ↔ English)
- TTS audio for all sentences

### 6. Progress Tracking
| Metric | Description |
|--------|-------------|
| Lessons Completed | Count of finished lessons |
| Current Streak | Consecutive days of study |
| Total Study Time | Minutes spent learning |
| Exams Passed | Number of completed exams |

---

## 👤 User Flows

### Flow 1: New User Onboarding
```
Home Page → View Progress Cards (0/X lessons)
         → Select "Lessons by Level" 
         → Choose A1 (Beginner)
         → Select Lesson (e.g., "Basic Greetings")
         → View word categories
         → Play TTS audio for each word
         → Mark lesson complete
         → Return to Home (progress updated)
```

### Flow 2: Exam Preparation
```
Home Page → Select Exam Level (A1/A2/B1)
         → Start Exam
         → Answer questions (5 types)
         → Complete all questions
         → View results (score + section breakdown)
         → Results saved to progress
```

### Flow 3: Daily Practice
```
Home Page → Practice Zone
         → Choose activity (Pronunciation/Listening/Dictation)
         → Complete exercises
         → Get instant feedback
         → Streak updated if first session of day
```

### Flow 4: Dictionary Lookup
```
Home Page → Dictionary
         → Search word or browse frequency list
         → View Wiktionary definition
         → Listen to pronunciation
         → Optionally view in sentence context
```

---

## 🏆 Competitive Analysis

### Comparison with Leading Language Apps

| Feature | LangPori | Duolingo | Babbel | Mondly |
|---------|----------|----------|--------|--------|
| **Gamification** | Basic (streaks) | Advanced (XP, leagues, lives) | Moderate | Good |
| **Spaced Repetition** | ❌ | ✅ | ✅ | ✅ |
| **AI Conversation** | ❌ | ✅ (Max tier) | ❌ | ✅ Chatbot |
| **Native Speaker Audio** | Browser TTS | Professional | Professional | Professional |
| **VR/AR Features** | ❌ | ❌ | ❌ | ✅ |
| **Offline Mode** | ✅ (PWA) | ✅ (Premium) | ✅ | ✅ |
| **Live Tutoring** | ❌ | ❌ | ❌ (ending 2025) | ❌ |
| **Grammar Focus** | Moderate | Light | Strong | Light |
| **Speech Recognition** | ✅ | ✅ | ✅ | ✅ |
| **Social Features** | ❌ | ✅ (Leaderboards) | ❌ | Limited |
| **Personalization** | ❌ | ✅ | ✅ | ✅ |

### Key Insights from Competitors

**Duolingo ($748M revenue 2024)**:
- Gamification drives engagement (streaks, leaderboards, XP)
- AI-powered "Video Call" for conversation practice
- Freemium model with ads monetizing free users

**Babbel (€352M revenue 2024)**:
- Professional, native speaker audio
- Structured grammar-focused approach
- B2B partnerships drive significant revenue

**Mondly**:
- VR/AR immersive learning
- Flexible lesson structure (non-linear)
- Lifetime access option popular

---

## 💰 Monetization Recommendations

### Tier 1: Free Version (Current)
- Basic lessons (A1 level only)
- Limited daily practice sessions
- With advertisements

### Tier 2: Premium Subscription (~$9.99/month or $59.99/year)

| Feature | Description |
|---------|-------------|
| **Ad-free experience** | Remove all advertisements |
| **All lesson levels** | A1 + A2 + B1 + EE20% |
| **Unlimited practice** | No daily limits |
| **Offline mode** | Full PWA offline support |
| **Progress sync** | Cloud backup of progress |
| **Spaced repetition** | Smart review scheduling |

### Tier 3: Pro Subscription (~$19.99/month)

| Feature | Description |
|---------|-------------|
| **Everything in Premium** | All Premium features |
| **AI Conversation Practice** | ChatGPT-powered dialogues |
| **Advanced analytics** | Learning insights dashboard |
| **Personalized learning path** | AI-recommended lessons |
| **Premium TTS voices** | Google Cloud or ElevenLabs voices |
| **Certificate upon completion** | Shareable achievement |

### Alternative Revenue Streams

1. **Lifetime Access** ($149-$199): One-time payment for permanent access
2. **Family Plan**: Multiple accounts at discounted rate
3. **Business/Education Licensing**: Estonian integration courses for companies, universities
4. **In-App Purchases**: 
   - Extra "streak freezes"
   - Cosmetic badges/themes
   - Bonus content packs (Estonian culture, business Estonian)

---

## 🚀 Feature Improvements

### Priority 1: Critical for Monetization

#### 1. Spaced Repetition System (SRS)
**Current Gap**: No review scheduling - users manually revisit content
**Solution**: Implement SM-2 or similar algorithm
```typescript
// Example SRS implementation structure
interface SRSCard {
  wordId: number;
  interval: number;      // Days until next review
  easeFactor: number;    // Difficulty multiplier
  nextReviewDate: string;
}
```
**Impact**: Proven to improve retention by 40-60%, key differentiator

#### 2. Enhanced Gamification
**Add**:
- XP points for all activities
- Daily/weekly challenges with rewards
- Leaderboards (global and friends)
- Achievement badges (100+ unlockables)
- "Hearts" or energy system (monetization opportunity)

#### 3. High-Quality Native TTS
**Current**: Browser TTS or Google Translate (robotic)
**Upgrade Options**:
- ElevenLabs API (most natural)
- Google Cloud WaveNet voices
- Pre-recorded native speaker audio for core vocabulary
**Impact**: Audio quality is #1 user complaint for TTS-based apps

#### 4. User Accounts & Cloud Sync
**Current**: LocalStorage only (device-bound)
**Need**: 
- Firebase/Supabase authentication
- Cloud progress sync
- Cross-device learning
**Impact**: Essential for subscription model

### Priority 2: Engagement & Retention

#### 5. AI Conversation Partner
**Implementation**:
- OpenAI GPT-4 or Claude API integration
- Structured conversation scenarios
- Pronunciation feedback via Whisper API
**Example Scenarios**:
- Ordering coffee
- Asking for directions
- Job interview preparation

#### 6. Personalized Learning Paths
**Features**:
- Initial placement test
- Daily recommended activities
- Adaptive difficulty based on performance
- Goal setting (exam date, travel, work)

#### 7. Social Features
- Add friends
- Share achievements
- Friendly competition
- Study groups

#### 8. Stories & Cultural Content
- Interactive Estonian stories
- Cultural lessons (holidays, traditions)
- News articles at reading level
- Music/video integration

### Priority 3: Polish & UX

#### 9. Improved Grammar Explanations
**Current**: Brief grammar notes
**Need**: 
- Interactive grammar lessons
- Conjugation tables
- Case system visualizations (Estonian has 14 cases!)

#### 10. Mistake Analysis
- Track common errors
- Personalized review of weak areas
- Visual progress by category

#### 11. Haptic & Sound Feedback
- Celebration sounds for correct answers
- Vibration on mobile for interactions
- Sound effects for XP gains

#### 12. Dark/Light Theme Toggle
**Current**: System-based only
**Need**: User-controlled theme switching

---

## 📊 Implementation Roadmap

### Phase 1: Monetization Foundation (1-2 months)
- [ ] User authentication system
- [ ] Cloud sync with Supabase/Firebase
- [ ] Payment integration (Stripe)
- [ ] Basic paywall for A2+ content

### Phase 2: Core Improvements (2-3 months)
- [ ] Spaced Repetition System
- [ ] Enhanced gamification (XP, badges)
- [ ] High-quality TTS integration
- [ ] Leaderboards

### Phase 3: Premium Features (3-4 months)
- [ ] AI conversation partner
- [ ] Personalized learning paths
- [ ] Advanced analytics dashboard
- [ ] Offline mode improvements

### Phase 4: Growth Features (4-6 months)
- [ ] Social features
- [ ] Stories & cultural content
- [ ] Business/Education licensing
- [ ] Mobile app (optional)

---

## 🎯 Conclusion

LangPori has a solid technical foundation with Next.js 16, modern React patterns, and a functional PWA setup. The core learning features are well-implemented, but the app currently lacks the critical engagement and monetization features that make competitors successful.

**Top 3 Recommendations for Monetization**:
1. **Implement SRS** - Scientifically-proven retention boost, major differentiator
2. **Add premium TTS** - Users expect natural-sounding audio
3. **Build gamification** - Streaks, XP, leaderboards drive daily engagement

**Top 3 Technical Priorities**:
1. **User authentication** - Required for any monetization
2. **Cloud sync** - Cross-device is essential
3. **Payment integration** - Stripe for subscriptions

The niche focus on Estonian is actually an **advantage** - less competition and a clear target audience (immigrants to Estonia, Estonian diaspora, language enthusiasts). With the right improvements, this app could become the go-to solution for Estonian language learning.

---

*Document generated: February 2026*
*App Version: 0.1.0*
