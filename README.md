# JobHai — Skill Bootcamps & Guaranteed 450+ Partner HR Agency Placement Platform

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **[shadcn/ui](https://ui.shadcn.com/docs/installation)**.

## 🚀 Key User Flow

1. **Simple, Input-Free Landing Page**:
   - Clean, high-impact hero with zero inline input fields.
   - Highlights the 4-step placement flywheel, top in-demand course tracks, 450+ partner HR agencies, and flat ₹5,000 INR pricing.

2. **Full Onboarding & Account Creation Flow**:
   - **Step 1: Comprehensive Profile**: Collects legal name, email, WhatsApp phone, qualification, city, and target domain.
   - **Step 2: Live Webcam Photo Verification**: Captures candidate's live webcam snapshot using HTML5 `navigator.mediaDevices.getUserMedia` for identity verification.
   - **Step 3: Resume Upload**: Drag-and-drop resume upload (PDF/DOCX) with file verification.
   - **Step 4: Account Creation Completed**: Generates unique Candidate Placement ID (e.g. `JH-482019`).

3. **Strict Proctored Assessment Room**:
   - **Webcam Feed ON**: Live proctoring Picture-in-Picture (PIP) webcam feed with continuous face tracking.
   - **No Backspace**: Backspace key is strictly intercepted and blocked outside input fields.
   - **No Browser Back**: History popstate locks prevent back-navigation during the test.
   - **Tab & Window Focus Detection**: Detects visibility changes / window blurs and issues proctoring violation warnings.
   - **Incognito & Anti-Extension Advisory**: Advises incognito mode to disable unapproved extensions.
   - **Timed Exam**: 10-minute timer with domain-specific architecture questions.
   - **Verified Scorecard**: Issues an integrity audit certificate and unlocks the ₹5,000 INR course track with guaranteed HR interview calls.

## 🏃 Running Locally

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

The application runs at `http://localhost:3000`.
