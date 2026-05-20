# System Architecture — CycleWise

**Document type:** Technical Architecture  
**Phase:** Pre-development  
**Version:** 1.0  
**Last updated:** May 2026  
**Author:** Archana (Founder, CycleWise)  
**Status:** Finalised for Phase 1 (Web App)

---

This document describes how every part of CycleWise connects and communicates. It is the technical map of the system — where data lives, how it flows, and what happens at each step. 
---

## High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        USER DEVICES                         │
│         Phone browser / Laptop browser (any device)         │
└─────────────────────────┬───────────────────────────────────┘
                          │  HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React.js)                       │
│                  Deployed on Vercel                          │
│                                                             │
│  Pages: Home, Screening Result, Cycle Tracker,             │
│         Saathi, Community, Doctor Prep, Profile            │
│                                                             │
│  State Management: React Context + useState                 │
│  Styling: Tailwind CSS                                      │
└────────┬──────────────┬───────────────┬────────────────────┘
         │              │               │
         ▼              ▼               ▼
┌──────────────┐ ┌────────────┐ ┌──────────────────┐
│ Firebase     │ │ Firestore  │ │ Firebase         │
│ Auth         │ │ Database   │ │ Realtime DB      │
│              │ │            │ │ (Community Chat) │
│ Email/Pass   │ │ User data  │ │                  │
│ Google OAuth │ │ Cycle logs │ │ Chat messages    │
│              │ │ Symptoms   │ │ Community posts  │
│              │ │ Saathi logs│ │                  │
└──────────────┘ └────────────┘ └──────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │ Firebase       │
                 │ Storage        │
                 │                │
                 │ Doctor prep    │
                 │ PDFs           │
                 │ Profile images │
                 └────────────────┘

EXTERNAL TOOLS (no backend needed):
┌─────────────────────────────────────────────────────────────┐
│  Typeform → Google Sheets → PDF (Screening Tool)           │
│  Gemini API (Saathi Phase 2 — free tier)                   │
│  jsPDF (client-side PDF generation)                         │
│  Vercel Analytics (free usage tracking)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack — Every Choice Explained

| Layer | Technology | Why This Choice |
|---|---|---|
| Frontend framework | React.js | Most widely used, largest job market, best tutorials for learners, works perfectly with Firebase |
| Styling | Tailwind CSS | Utility-first, fast to write, consistent design without custom CSS files |
| Authentication | Firebase Auth | Handles email/password and Google login with zero backend code |
| Primary database | Firestore (Firebase) | NoSQL, real-time, scales automatically, generous free tier (50K reads/day, 20K writes/day) |
| Real-time chat | Firebase Realtime Database | Optimised specifically for real-time messaging, simpler than Firestore for chat |
| File storage | Firebase Storage | PDF reports and profile images, 5GB free |
| Deployment | Vercel | Free tier, deploys in 30 seconds from GitHub, custom domain support |
| PDF generation | jsPDF (JavaScript library) | Client-side, free, no server needed |
| Screening form | Typeform | Zero development time for Phase 1 |
| AI companion (Phase 2) | Google Gemini API | 1 million free tokens per day, no credit card required to start |
| Analytics | Vercel Analytics + Firebase Analytics | Both free, shows user behaviour clearly |

---

## Firebase Free Tier Limits (What We Get for ₹0)

Understanding these limits is important for planning. This is what Firebase gives for free every month:

| Service | Free Limit | What It Means for Us |
|---|---|---|
| Firestore reads | 50,000 per day | Enough for ~500 active users reading their own data |
| Firestore writes | 20,000 per day | Enough for ~500 users logging daily check-ins |
| Firestore storage | 1 GB total | Enough for thousands of users' text data |
| Firebase Auth | Unlimited | No cost ever for authentication |
| Realtime Database | 1 GB stored, 10 GB transfer/month | Enough for active community chat with hundreds of users |
| Firebase Storage | 5 GB stored | Enough for thousands of PDFs and profile images |
| Firebase Hosting | 10 GB storage, 360 MB/day transfer | Enough for our web app |

**Conclusion:** The free tier is sufficient for Phase 1 (up to approximately 500–1000 active users). We upgrade to the Blaze (pay-as-you-go) plan only when we exceed these limits — and by that point the app is generating revenue.

---

## Firestore Database Schema

Firestore is a NoSQL database. Data is stored in **collections** (like folders) containing **documents** (like files). Each document has **fields** (like key-value pairs).

This is the complete data model for CycleWise.

---

### Collection: `users`

**Path:** `users/{userId}`  
**One document per user. Created at registration.**

```
users/
  {userId}/
    displayName: "Archana"          // string — chosen by user
    email: "archana@email.com"      // string — from Firebase Auth
    age: 19                         // number
    diagnosisStatus: "diagnosed"    // string — "diagnosed" | "undiagnosed" | "unsure"
    diagnosisYear: 2021             // number — year of diagnosis (optional)
    createdAt: Timestamp            // when account was created
    lastActive: Timestamp           // last app open
    notificationsEnabled: true      // boolean
    anonymousInCommunity: false     // boolean — community posting preference
    screeningScore: 78              // number — from screening form (if came via form)
    onboardingComplete: true        // boolean
```

---

### Sub-collection: `users/{userId}/cycleLogs`

**Path:** `users/{userId}/cycleLogs/{logId}`  
**One document per logged period. Created when user starts period tracking.**

```
users/{userId}/cycleLogs/
  {logId}/
    startDate: Timestamp            // when period started
    endDate: Timestamp              // when period ended (null if ongoing)
    flowLevel: "medium"            // string — "light" | "medium" | "heavy" | "spotting"
    notes: "Had cramps on day 2"   // string — optional free text
    createdAt: Timestamp
```

---

### Sub-collection: `users/{userId}/dailyLogs`

**Path:** `users/{userId}/dailyLogs/{date}`  
**One document per day. Created when user completes daily check-in.**  
**Document ID is the date string: "2026-05-21" — this prevents duplicate entries for the same day.**

```
users/{userId}/dailyLogs/
  "2026-05-21"/
    date: "2026-05-21"             // string — ISO date format
    mood: 3                         // number — 1 (very low) to 5 (great)
    energy: 2                       // number — 1 to 5
    sleep: "okay"                   // string — "poor" | "okay" | "well"
    symptoms: ["tired", "bloated"] // array of strings
    notes: ""                       // string — optional
    checkInComplete: true           // boolean
    createdAt: Timestamp
```

---

### Sub-collection: `users/{userId}/saathiLogs`

**Path:** `users/{userId}/saathiLogs/{sessionId}`  
**One document per Saathi conversation session.**

```
users/{userId}/saathiLogs/
  {sessionId}/
    startedAt: Timestamp
    messages: [                     // array of message objects
      {
        sender: "user",             // "user" | "saathi"
        text: "I'm feeling heavy today",
        timestamp: Timestamp
      },
      {
        sender: "saathi",
        text: "I hear you. That kind of heavy is real...",
        timestamp: Timestamp
      }
    ]
    mood: "heavy"                   // string — mood tag for this session
    endedAt: Timestamp
```

---

### Sub-collection: `users/{userId}/medications`

**Path:** `users/{userId}/medications/{medId}`  
**Tracks medications and supplements the user is taking.**

```
users/{userId}/medications/
  {medId}/
    name: "Metformin"               // string
    dose: "500mg"                   // string
    frequency: "twice daily"        // string
    startDate: Timestamp
    active: true                    // boolean
    notes: ""                       // string
```

---

### Collection: `communityPosts`

**Path:** `communityPosts/{postId}`  
**One document per community post. Visible to all users.**

```
communityPosts/
  {postId}/
    authorId: "userId123"           // string — links to users collection
    authorDisplay: "Archana"        // string — display name at time of posting
    isAnonymous: false              // boolean — if true, authorDisplay shown as "Anonymous"
    weeklyTopicId: "topic_2026_21"  // string — links to the weekly topic
    text: "This is how I handle..." // string — post content
    reactions: {                    // map — reaction counts
      heart: 12,
      hug: 5
    }
    reportCount: 0                  // number — moderation
    createdAt: Timestamp
    editedAt: Timestamp             // null if never edited
```

---

### Sub-collection: `communityPosts/{postId}/replies`

**Path:** `communityPosts/{postId}/replies/{replyId}`

```
communityPosts/{postId}/replies/
  {replyId}/
    authorId: "userId456"
    authorDisplay: "Maya"
    isAnonymous: false
    text: "Thank you for sharing this..."
    createdAt: Timestamp
```

---

### Collection: `weeklyTopics`

**Path:** `weeklyTopics/{topicId}`  
**Created by admin (founder) each week.**

```
weeklyTopics/
  {topicId}/
    title: "How do you explain PMOS to someone who doesn't understand?"
    description: "Share your experiences, tips, or even the words you use."
    weekNumber: 21                  // number — ISO week number
    year: 2026                      // number
    active: true                    // boolean — only one topic active at a time
    createdAt: Timestamp
    postCount: 0                    // number — updated when posts are added
```

---

### Collection: `screeningResults`

**Path:** `screeningResults/{resultId}`  
**Created when a user completes the Typeform screening form. Linked to user if they register.**

```
screeningResults/
  {resultId}/
    userId: "userId123"             // string — null if user hasn't registered yet
    email: "user@email.com"         // string — collected in form
    firstName: "Priya"             // string — optional
    age: 15                         // number
    score: 78                       // number — calculated risk score
    band: "very-high"               // string — "low" | "moderate" | "high" | "very-high"
    answers: {                      // map — all form answers stored
      q1_cycle_regularity: "never",
      q2_periods_per_year: "less_than_6",
      q3_facial_hair: "yes_noticeable",
      // ... all questions
    }
    pdfGenerated: true              // boolean
    appDownloadClicked: false       // boolean — tracking conversion
    createdAt: Timestamp
    schoolId: "school_delhi_01"     // string — which school the form came from
```

---

### Collection: `schools`

**Path:** `schools/{schoolId}`  
**Created when a school is onboarded.**

```
schools/
  {schoolId}/
    name: "Delhi Public School, Rohini"
    city: "Delhi"
    state: "Delhi"
    contactName: "Mrs. Sharma"
    contactEmail: "sharma@dps.edu.in"
    qrCodeUrl: "https://..."        // string — unique form URL for this school
    totalScreenings: 0              // number — updated automatically
    activeYear: 2026
    createdAt: Timestamp
```

---

## Firebase Realtime Database Schema (Community Chat)

The community feed uses **Firestore** (above). But the real-time reply notifications use **Firebase Realtime Database** for instant delivery.

```json
{
  "notifications": {
    "userId123": {
      "notif_001": {
        "type": "reply",
        "postId": "post_abc",
        "fromDisplay": "Maya",
        "preview": "Thank you for sharing this...",
        "read": false,
        "timestamp": 1716288000000
      }
    }
  },
  "onlineStatus": {
    "userId123": {
      "online": true,
      "lastSeen": 1716288000000
    }
  }
}
```

---

## Authentication Flow

```
User opens CycleWise
        │
        ▼
Has account?
  ├── YES → Email + Password login → Firebase Auth → returns userId
  │                                                        │
  └── NO  → Register with email + password                │
             → Firebase Auth creates account               │
             → Firestore creates users/{userId} document   │
             → Onboarding flow begins                      │
                                                           │
                                                           ▼
                                              App loads user data
                                              from users/{userId}
```

---

## Data Flow — Daily Check-In

```
User opens app (morning)
        │
        ▼
Has today's log? (check dailyLogs/"2026-05-21")
  ├── YES → Show today's summary, no check-in prompt
  │
  └── NO  → Show 3-question check-in
              │
              ▼
           User answers → Write to users/{userId}/dailyLogs/"2026-05-21"
              │
              ▼
           Insights engine reads last 14 days of dailyLogs
              │
              ▼
           If pattern detected → Show insight card on home screen
```

---

## Data Flow — Saathi Conversation

```
User opens Saathi tab
        │
        ▼
New session created in users/{userId}/saathiLogs/{newSessionId}
        │
        ▼
User types message
        │
Phase 1 (rule-based):
        ▼
Keyword + sentiment detection on user's message
        │
        ▼
Match to response category (guilt / fatigue / emotional flooding / etc.)
        │
        ▼
Select response from pre-written response bank
        │
        ▼
Append both messages to session document

Phase 2 (Gemini API added on top):
        ▼
User message + conversation history sent to Gemini API (free tier)
        │
        ▼
Gemini response returned
        │
        ▼
Append both messages to session document
If API limit hit → fall back to rule-based response
```

---

## Data Flow — Screening Form to App

```
School visit → Teacher shows QR code
        │
        ▼
Girl scans QR → Opens Typeform in phone browser
        │
        ▼
Completes 15–18 questions
        │
        ▼
Typeform webhook → Cloud Function (or direct Typeform → Google Sheets)
        │
        ▼
Score calculated (see scoring-algorithm.md)
        │
        ▼
Result page shown in browser:
  - Risk band displayed
  - Explanation in plain language
  - PDF download button
  - "Download CycleWise" button (links to web app)
        │
        ▼
If she registers on CycleWise:
  - screeningScore field in users/{userId} pre-filled
  - Onboarding skips questions she already answered
  - Home screen shows personalised message based on her score
```

---

## Security Rules (Firestore)

Security rules ensure users can only access their own data. This is critical for a health app.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;

      // Same rule applies to all sub-collections
      match /{subCollection}/{docId} {
        allow read, write: if request.auth != null 
                           && request.auth.uid == userId;
      }
    }

    // Community posts: anyone logged in can read
    // Only the author can edit or delete their own post
    match /communityPosts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
                             && request.auth.uid == resource.data.authorId;

      match /replies/{replyId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update, delete: if request.auth != null 
                               && request.auth.uid == resource.data.authorId;
      }
    }

    // Weekly topics: anyone can read, only admin can write
    match /weeklyTopics/{topicId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.auth.token.admin == true;
    }

    // Screening results: only the user linked to it can read
    match /screeningResults/{resultId} {
      allow create: if true; // Anyone can submit a screening form
      allow read: if request.auth != null 
                  && request.auth.uid == resource.data.userId;
    }
  }
}
```

**Why these rules matter:** Without them, any user could read any other user's health data by guessing a userId. These rules make that impossible.

---

## Folder Structure — React Project

```
cyclewise/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── MoodSlider.jsx
│   │   ├── SymptomChip.jsx
│   │   └── Navigation.jsx
│   ├── pages/                # One file per screen
│   │   ├── Home.jsx
│   │   ├── CycleTracker.jsx
│   │   ├── DailyCheckIn.jsx
│   │   ├── Saathi.jsx
│   │   ├── Community.jsx
│   │   ├── DoctorPrep.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   └── Onboarding.jsx
│   ├── firebase/             # Firebase configuration
│   │   ├── config.js         # Firebase init (uses .env variables)
│   │   ├── auth.js           # Auth helper functions
│   │   ├── firestore.js      # Firestore read/write functions
│   │   └── storage.js        # Storage helper functions
│   ├── saathi/               # Saathi logic
│   │   ├── responseBank.js   # All pre-written responses
│   │   ├── detector.js       # Keyword/sentiment detection
│   │   └── gemini.js         # Gemini API integration (Phase 2)
│   ├── scoring/              # Screening algorithm
│   │   └── pmosScoringAlgorithm.js
│   ├── insights/             # Insights engine
│   │   └── patternDetector.js
│   ├── context/              # React Context for global state
│   │   └── AuthContext.jsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useCycleLogs.js
│   ├── utils/                # Helper functions
│   │   ├── dateHelpers.js
│   │   └── pdfGenerator.js
│   └── App.jsx               # Root component + routing
├── .env                      # Firebase config keys (never commit to GitHub)
├── .env.example              # Template showing which keys are needed
├── .gitignore                # Must include .env
├── package.json
└── README.md
```

---

## Environment Variables

Never store Firebase credentials directly in code. Use environment variables.

`.env` file (never push to GitHub — add to .gitignore):
```
REACT_APP_FIREBASE_API_KEY=your_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GEMINI_API_KEY=your_gemini_key
```

`.env.example` file (safe to commit — shows what keys are needed without values):
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_GEMINI_API_KEY=
```

---

## Deployment Architecture

```
Developer pushes code to GitHub main branch
        │
        ▼
Vercel detects new commit automatically
        │
        ▼
Vercel builds React app (npm run build)
        │
        ▼
Built files deployed to Vercel CDN globally
        │
        ▼
cyclewise.in (custom domain) now serving new version
        │
        ▼
Users open app in browser — loads from nearest CDN node
```

**Why Vercel:** Free tier, automatic deployment from GitHub, zero configuration, globally distributed CDN, custom domain with HTTPS included.

---

## Phase 2 Changes (Flutter Mobile App)

When we convert to Flutter for Play Store:

- Firebase configuration remains identical — same collections, same security rules
- React frontend replaced by Flutter widgets
- Firebase Flutter SDK replaces Firebase Web SDK
- Offline support enhanced using Firestore's built-in local cache
- Push notifications added via Firebase Cloud Messaging (FCM)
- All business logic (scoring algorithm, insights engine, Saathi detection) moved to Dart equivalents

---

*Last reviewed: May 2026 | Next review: When Phase 2 begins*
