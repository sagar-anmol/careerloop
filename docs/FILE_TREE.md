# CareerLoop — File Tree & Codebase Map

Living index of this repository. Read this before searching the tree.

- **Verified against:** working-tree snapshot on 2026-11-11 (uncommitted exam-engine build included)
- **Rule:** update this file in the same change that adds, moves, or removes
  routes, component groups, scripts, env vars, or deploy targets.
- **Scope:** `src/`, root config, deploy paths. Generated folders are listed but
  not indexed.

## 0. Glossary

Code and UI use product words and infra words without defining them. Terms used
below:

| Term | Meaning here |
| --- | --- |
| Candidate / dossier | A signed-up user and the verified profile record for them. The "dossier" tab shows profile + resume audit status. |
| Candidate ID | Human-readable id (`JH-######`) generated during signup and stored in `user_metadata.candidate_id`. |
| Mains exam | Product name for the graded assessment track. Since 2026-11-11 it is a real, server-verified test: `MainsExamPanel` lists the sets in `content/exams/`, and the runner lives at `/exam/<set-id>`. The legacy proctored modal no longer feeds mains scores. |
| Attempt token | Random 32-hex secret issued by `/api/exam/start`, held only in the runner's memory; stored hashed (`attempt_token_hash`) and required by autosave/submit, so a bare attempt id is useless. Rotated on every resume, which locks out stale tabs. |
| Integrity flags | Server-recorded events during an attempt (e.g. `fullscreen_exit`, `tab_hidden` with timestamps), shown on the result. |
| Mock tests | Weekly practice papers listed in the `mock_tests` tab (currently hardcoded titles, not database rows). |
| Proctored assessment | Graded test with webcam monitoring, tab/backspace/back-navigation guards. Demo assessment is the ungraded variant. PIP = picture-in-picture webcam preview. |
| `cl_candidate` | `localStorage` key holding the cached `CandidateProfileData` so the dashboard paints before Supabase answers. |
| Anon key | Public Supabase key shipped to the browser; access is bounded by Row Level Security (RLS). |
| Service-role key | Secret Supabase key that bypasses RLS. Server-only. |
| OpenNext | Build tool that converts the Next.js app into a Cloudflare Worker bundle in `.open-next/`. |
| Wrangler | Cloudflare CLI used to deploy Pages or Workers. `XDG_CONFIG_HOME=.wrangler-config` keeps its auth out of the global home config. |
| Pages vs Worker | Two Cloudflare products: Pages uploads a static folder (`out/`); Worker runs the OpenNext server bundle. |
| `nodejs_compat` | Worker compatibility flag enabling Node built-ins. `ASSETS` is the Worker binding that serves static files. |
| RSC | React Server Components (App Router default). Most files here opt out with `"use client"`. |
| Turbopack | Next.js bundler; `next.config.ts` routes CSS through it. |
| MUI | Material UI (v9): the theme-provider component library used by the lander and modals (`src/theme`, `components/mui`). |
| shadcn | Copy-in component library under `src/components/ui/`, styled with Tailwind. The `base-nova` style in `components.json` is its preset name. |
| GTM | Google Tag Manager; container `GTM-W7L22656` is loaded in `layout.tsx`. |
| EGM | Elephant & Goldfish Model: design-and-review workflow described in `docs/designs/README.md`. |

## 1. Top level

| Path | What it is |
| --- | --- |
| `src/` | All application code (see §2–§6). Alias `@/*` → `src/*`. |
| `public/` | Static files served at `/`: `careerloop-logo.png` (master brand mark, 1024 px, transparent background — used by the header, footer and favicon generation), `careerloop-logo.svg` (1.4 KB vector trace of the same mark: navy `#094886` disc + white glyph, `baseProfile="tiny-ps"`, no raster/`<image>`/`<text>` — this is the BIMI asset, *not* for use in email HTML, because Gmail does not render SVG in `<img>`), `hero-banner.jpg`, `hero-banner-mobile.jpg`, default Next SVGs. |
| `content/` | `exams/<set-slug>.json` — question banks for the mains engine. Four CareerLoop-branded sets: `careerloop-mains-01` (the official mains set), `careerloop-core-01`, `careerloop-aptitude-01`, `careerloop-english-01`. **Server-only**: imported by `src/lib/exams/loader.ts`, never by client components (answer keys would leak into the browser bundle). `difficulty` is authoring metadata and is not exposed by the API. |
| `docs/` | `FILE_TREE.md`, `audits/` (trust audit 2026-11-10), EGM design artifacts (`designs/`), and `legal/website-facts.json` (factual briefing — data inventory, processors, plan/refund behaviour, compliance gaps — for drafting Terms, Refund and Privacy pages; not legal advice). |
| `supabase/` | `migrations/` — SQL record of schema changes applied to the Supabase project: `20261111090000_exam_engine.sql` (`exam_attempts`, `exam_responses`), `20261111120000_profile_uniqueness.sql` (unique `lower(email)` / `auth_user_id` indexes + owner-scoped `candidates` RLS), `20261111130000_phone_unique_and_format.sql` (unique `phone` partial index + 10-digit CHECK), and `20261111140000_demo_gate.sql` (`demo_completions`, the server-side demo unlock), plus `20261112090000_payment_orders.sql` (`payment_plans` catalogue, `payment_orders` with unique `UTR`, RLS on/zero-policy service-role-only), `20261112120000_payment_orders_utr_verified.sql` (`utr_verified boolean not null default false` + backfill from `status='completed'` + partial index `payment_orders_pending_verification_idx`), and `20261112150000_starter_trial_expiry.sql` (`payment_orders.expires_at`, superseded by `20261114100000_starter_pass_no_expiry.sql`), `20261114100000_starter_pass_no_expiry.sql` (starter renamed "Starter Practice Pass"; every `expires_at` cleared — no plan has an expiry window now; the column stays, unused), plus `20261113090000_payu_gateway.sql` (**PayU India gateway, 2026-11-13**: adds `gateway`, `txnid` (unique), `mihpayid`, `gateway_status`, `gateway_error`, `signup_payload`, `account_created_at`; drops the legacy `utr` / `utr_verified` / `upi_id` columns and their indexes; `user_id` NULL for guest signups — the account is created only by PayU's verified callback; legacy rows flagged `gateway='legacy_upi'`), plus `20261112170000_email_otp_challenges.sql` (`email_otp_challenges`: per-email hashed signup OTP, RLS on/zero-policy service-role-only), and `20261112180000_payment_plans_rls.sql` (`payment_plans` RLS enabled with zero policies — before this the anon key could `PATCH` plan prices, since `resolvePlan()` trusts the DB row) — all applied live via Supabase MCP on 2026-11-12). No local Supabase CLI; migrations are applied via the Supabase MCP/SQL editor and mirrored into this folder. |
| `README.md` | Original product description from the first scaffold. Not maintained; this file supersedes it as the code map. |
| `AGENTS.md` | Agent instructions. The `nextjs-agent-rules` block is rewritten by `next dev`; leave it intact. |
| `content-export.json` | Copy snapshot (v4.0.0, 2026-11-10): `website_metadata` plus 8 `sections[]` keyed by `tag` — `navigation_bar`, `hero_banner`, `program_features`, `candidate_roadmap`, `pricing_and_subscription`, `frequently_asked_questions`, `candidate_profile_dashboard`, `footer`. Sections carry different fields (`headline_primary`, `pricing_card`, `sidebar_tabs`, …). No code imports it. |
| `package.json` | Package name `jobhai`, app brand "CareerLoop Pro". Scripts in §7. |
| `package-lock.json` | npm lockfile (npm v10+). |
| `.npmrc` | `allow-scripts=` — disables install scripts for dependencies. |
| `.gitignore` | Ignores `.next/`, `out/`, `.open-next/`, `.wrangler/`, `.wrangler-config/`, `.env*`, `.vercel`, `next-env.d.ts`. |
| `next.config.ts` | Turbopack rule only: routes `*.css` through `@tailwindcss/turbopack`. No `output: "export"`, no images config. |
| `open-next.config.ts` | `defineCloudflareConfig()` with no options — OpenNext worker build. |
| `wrangler.jsonc` | Worker `careerloop`, entry `.open-next/worker.js`, `nodejs_compat`, `ASSETS` binding, inlines `NEXT_PUBLIC_SUPABASE_URL`. |
| `components.json` | shadcn config: style `base-nova`, RSC, CSS vars, lucide icons. Aliases: `components` → `@/components`, `ui` → `@/components/ui`, `utils` → `@/lib/utils`, `lib` → `@/lib`. |
| `tsconfig.json` | Strict, `moduleResolution: bundler`, `@/*` path alias. |
| `next-env.d.ts` | Next.js generated type reference. Do not edit. |
| `eslint.config.mjs` | `eslint-config-next` flat config. |
| `.env.local` | Local secrets (see §8). Never commit, never print values. |
| `.env.cloudflare` | Cloudflare API token (`DNS:Edit` + `Zone:Read` on `careerloop.co.in`) with `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_ZONE_ID`. Deliberately folder-scoped — never copied to a global config or shell rc. Matched by `.env*`, so git-ignored. Used only for DNS/BIMI maintenance; the app never reads it. |
| `.vercel/project.json` | Vercel link: project `careerloop`, id `prj_BZAs10aKy20RHC280nLI03MjKTFZ`. Hidden and git-ignored, so it is absent from a fresh clone. |
| `.wrangler-config/`, `.wrangler/` | Isolated Wrangler auth/cache dirs used by the deploy scripts. Hidden and git-ignored. |
| `bin/` | Empty. |
| Generated / ignored | `node_modules/`, `.next/`, `out/` (static export, see §7), `.open-next/` (worker build). |

Naming is inconsistent on purpose of history: npm package `jobhai`, Worker
`careerloop`, Pages project `careerloop-pages`, UI brand "CareerLoop Pro".
`/dashboard` and `/profile` are the same page.

## 2. Routes (`src/app/`)

| File | Role |
| --- | --- |
| `layout.tsx` | Root layout. Google Fonts (Roboto), GTM `GTM-W7L22656`, wraps children in `ThemeRegistry` (MUI). Exports site `metadata`. |
| `page.tsx` | `/` landing. `"use client"`. Composes MUI section components + modals, syncs Supabase session via `supabase.auth.getSession` / `onAuthStateChange`. Loads the Ethora AI assistant (app `6af56e0f880b7097ec1e7ba0`) via `next/script` `afterInteractive`, docked bottom-right (its default). Stacked into one cluster with the WhatsApp FAB: assistant launcher at `bottom: 24` (56px, vendor `right: 24`), WhatsApp FAB above it at `bottom: 96`. Lander only — not the dashboard or the exam runner. |
| `profile/page.tsx` | `/profile` candidate dashboard, ~1.1k lines, client component. Tab ids: `overview`, `mains_exam`, `mock_tests`, `assessments`, `dossier`, `partners`, `settings` (`mains_exam` and `assessments` render the same block, which is now `MainsExamPanel`). Reads cached profile from `localStorage`, then Supabase. Uses shadcn primitives + MUI modals. |
| `dashboard/page.tsx` | `/dashboard`. Re-exports `profile/page.tsx` with dashboard metadata. Two URLs, one implementation. |
| `exam/[setId]/page.tsx` | `/exam/<set-id>` mains test runner. Client page (`use(params)`); delegates to `ExamShell`. Accepts `?attempt=<id>` to deep-link a stored result. |
| `exam/[setId]/layout.tsx` | Metadata for the exam route (client pages cannot export `metadata`). |
| `payment/success/page.tsx` | `/payment/success`. Landing page after a verified PayU payment (`?txnid=`): the account is ready — points the candidate to sign in, shows the transaction reference. |
| `payment/failed/page.tsx` | `/payment/failed`. Landing page after a failed/unfulfilled PayU attempt (`?reason=`, `?txnid=`): per-reason copy (bank declined / amount mismatch / verification failure / account already exists); always states any deduction auto-reverses in 5–7 days and points to mail@m.careerloop.co.in. |
| `api/payment/initiate/route.ts` | `POST`. Starts a PayU hosted checkout. **Guest signup (pay-first)**: `body = { plan, signup: {…} }` — validates the dossier, duplicates (email/phone → `409`) and the Step-0 OTP (`403 EMAIL_NOT_VERIFIED`) BEFORE any money moves; stashes the dossier (password + photo/resume base64) on the pending `payment_orders` row keyed by a unique `txnid` (`user_id` NULL). **Signed-in upgrade**: `body = { plan }` + Bearer — creates an account-bound order. Returns `{ action, fields }`; the browser auto-POSTs the signed form to PayU's hosted page. Price comes from `resolvePlan` (DB row wins). |
| `api/payment/callback/route.ts` | `POST`. PayU's return URL (surl/furl both point here). Verifies the reverse SHA-512 `hash` (needs the merchant salt), matches `amount` to the order, calls `verify_payment` server-to-server (unreachable API → hash trusted). On success: order → `completed` (no expiry — every plan is permanent), and for guest signups creates the auth user + `candidates` row via `lib/payments/fulfill.ts`, burns the OTP, scrubs `signup_payload`, then 303-redirects to `/payment/success`. On failure: order → `failed` (money moved but account creation broke → stays `completed` with a reconciliation note) and 303-redirects to `/payment/failed?reason=…`. Idempotent — PayU callback retries are safe. |
| `api/auth/check-availability/route.ts` | `POST { email, phone }`. Unauthenticated **pre-check** for the signup wizard's Step 0 (before the photo/payment steps): returns `{ emailTaken, phoneTaken }` booleans only. Convenience only — `/api/payment/initiate` re-verifies both authoritatively before checkout starts (the payment callback re-checks at fulfillment). The route fails open if the DB is unreachable. |
| `api/auth/send-otp/route.ts` | `POST { email }`. Unauthenticated. Mails a 6-digit signup verification code via Resend (`lib/email/resend.ts`). Stores only a peppered SHA-256 hash in `email_otp_challenges` (never the code). Guards: 60 s resend cooldown (`429 COOLDOWN` + `retryAfterSeconds`), hourly send cap per email (`429 TOO_MANY_SENT`), and the challenge row is deleted if the send fails so a retry isn't blocked by a code that never arrived (`502 SEND_FAILED`). |
| `api/auth/verify-otp/route.ts` | `POST { email, otp }`. Unauthenticated. Compares the code timing-safely against the stored hash; tracks `attempts` (5 max → `429 TOO_MANY_ATTEMPTS`), rejects expired codes (`10 min`), and on success stamps `verified_at` + `verified_expires_at` (`60 min`) — the mark `/api/payment/initiate` requires; the payment callback consumes it at fulfillment. |
| `api/exam/sets/route.ts` | `GET`. Catalogue of playable sets with per-user attempts used/remaining and best score, plus `demoCompleted` (the server-side demo unlock flag). |
| `api/exam/demo/route.ts` | `GET` returns `{ completed }`; `POST` records demo completion in `demo_completions`. The demo itself is unscored. |
| `api/exam/start/route.ts` | `POST`. Starts or resumes an attempt; refuses with `403 DEMO_REQUIRED` until the demo is on record; enforces attempt cap and one-open-attempt; issues and rotates the `attempt_token`; returns sanitised questions (no answers) and the server `expires_at`. |
| `api/exam/autosave/route.ts` | `PATCH`. Upserts saved responses + integrity flags; auto-finalises as `expired` when the server clock runs out. |
| `api/exam/submit/route.ts` | `POST`. Scores the attempt server-side (idempotent); late submits beyond a 30 s grace are scored from the last autosave. |
| `api/exam/result/[attemptId]/route.ts` | `GET`. Stored result + answer review with explanations (owner only). |
| `api/exam/history/route.ts` | `GET`. The user's 50 most recent attempts across sets. |
| `globals.css` | Tailwind v4 import + `@theme inline` tokens (brand cobalt `#405FE2`, canvas `#f4f7fe`, slate text `#0f172a`). |
| `favicon.ico` | App icon, generated from `public/careerloop-logo.png` (16–256 px multi-resolution). Auto-served by Next at `/favicon.ico`. |
| `apple-icon.png` | 180 px iOS home-screen icon, generated from the same master logo on an opaque white square. |

No middleware, no `not-found`, no `error`, no `loading` files.

## 3. Components (`src/components/`)

### 3a. Live — MUI (`components/mui/`)

| File | Used by | Role |
| --- | --- | --- |
| `MuiHeader.tsx` | `page.tsx` | Top nav, sign-in/sign-up triggers. Brand mark renders `public/careerloop-logo.png` + the CareerLoop wordmark. |
| `MuiHero.tsx` | `page.tsx` | Hero banner + primary CTA. |
| `MuiProgramFeatures.tsx` | `page.tsx` | Program feature grid. |
| `MuiPricingSection.tsx` | `page.tsx` | Pricing tiers (incl. 1-on-1 mentorship ring/badge). Paid plans (₹999 Starter Practice Pass / ₹4,999 Pro / ₹8,999 1-on-1 — all one-time, no expiry) route signed-in users straight to the PayU-hosted checkout (`/api/payment/initiate`) and signed-out visitors into onboarding (payment step inside, preselecting the plan). The ₹999 card carries the referral offer (“Complimentary Direct Referrals to 450+ Fast-Hiring HR Agencies — free”, plus “Or submit your profile by email to support@careerloop.co.in”); every higher tier leads with “All foundation features included — everything in the <tier below>”. The ₹5,000 "placement" copy is a separate legacy story. |
| `MuiFaq.tsx` | `page.tsx` | FAQ accordion. |
| `MuiFooter.tsx` | `page.tsx` | Footer. Uses the same brand mark in the brand column; bottom bar credits "Built by Sagar Kumar". |
| `MuiWhatsAppButton.tsx` | `page.tsx` | Floating WhatsApp CTA, fixed at `bottom: 96; right: 24` (stacked above the Ethora launcher), z-index 1000. Opens the WhatsApp channel `https://whatsapp.com/channel/0029VbDuIK30wajjaHo1IO3X`. |
| `MuiAuthModal.tsx` | `page.tsx` | Sign-in / sign-up modal. |
| `MuiOnboardingModal.tsx` | `page.tsx` | Multi-step paid enrollment: Candidate Info → Live Photo ID → Program & Consent → **Payment** (PayU-hosted checkout via `startPayuCheckout`; the account is created only when PayU's verified callback reaches `/api/payment/callback`, never before). Accepts `initialPlan`. Owns `CandidateOnboardingData`. |
| `MuiProfileModal.tsx` | `page.tsx`, `profile/page.tsx` | Candidate profile editor. Owns `CandidateProfileData` (imported by the dashboard). |
| `MuiProctoredAssessmentModal.tsx` | `page.tsx` | Timed proctored test (legacy client-side scoring): webcam PIP, face checks, scorecard. **No longer reachable from the dashboard** — the mains tab now uses the server-verified runner; keep for the lander until it is migrated or deleted. |
| `MuiDemoAssessmentModal.tsx` | `profile/page.tsx` | Ungraded demo variant of the assessment (demo-gate for the mock-tests tab). Added in the working tree after `62ca613`. |

### 3b. Exam engine components (`components/exam/`)

Live, wired to `/exam/[setId]` and the dashboard mains tab. Styled with
Tailwind/shadcn to match the dashboard (not MUI).

| File | Used by | Role |
| --- | --- | --- |
| `ExamShell.tsx` | `exam/[setId]/page.tsx` | Phase machine: gate (not signed in) → instructions → running → result. Requests fullscreen inside the start click, loads/resumes attempts, deep-links stored results via `?attempt=`. |
| `ExamInstructions.tsx` | `ExamShell` | JEE-style pre-test screen: pattern note, section table, marking scheme, palette legend, declaration checkbox, resume notice. |
| `ExamRunner.tsx` | `ExamShell` | The test itself: header (title, save chip, server timer, fullscreen toggle, submit), section tabs, question panel, footer actions (Save & Next / Clear / Mark for Review & Next / Previous), autosave every 15 s + on tab hide, keyboard shortcuts (1–4, ←/→, M, S), auto-submit at 00:00, integrity flags for fullscreen exit / tab hide. |
| `QuestionPalette.tsx` | `ExamRunner` | Numbered palette grouped by section, NTA colours (grey/red/green/purple), current question ring, legend. |
| `ExamTimer.tsx` | `ExamRunner` | mm:ss / h:mm:ss from server expiry; red under 5 minutes. |
| `SubmitDialog.tsx` | `ExamRunner` | Submit summary: answered/marked/not answered/not visited counts + unanswered question numbers. |
| `ExamResult.tsx` | `ExamShell` | Verified score card, pass/fail badge, section-wise table, integrity note, answer review with explanations. |
| `MainsExamPanel.tsx` | `profile/page.tsx` (`mains_exam` → `scope="mains"`, `mock_tests` → `scope="practice"`) | Set catalogue with attempts used/best score, plus the verified attempt history table ("View result" deep-links to `?attempt=`). Renders a hard lock (no sets, no history) until `/api/exam/sets` reports `demoCompleted`; the lock CTA opens the MUI demo modal. |
| `types.ts` | palette + runner | `QuestionStatus` model and NTA colour styles. |

### 3c. shadcn primitives (`components/ui/`)

Imported by live code: `button`, `card`, `badge`, `progress`, `tabs`, `avatar`,
`separator`, `sheet`, `table`.

Imported only by legacy components, therefore dead in practice: `accordion`
(via `FaqClean`, `FaqSection`), `dialog` (via four legacy modals), `input` and
`label` (via three legacy forms).

Never imported: `dropdown-menu`, `select`, `textarea`, `tooltip`.

These primitives import the class-merge helper from the npm package `cn`, not
from `src/lib/utils.ts`.

### 3d. Legacy / unimported (`components/*.tsx`, plus unused `components/mui/*`)

None of these are rendered by any route. They form a closed subgraph that imports
`components/ui/*` and `data/*`. Do not add features here; either revive a
component into a route or delete it deliberately.

Unimported top-level files: `AgencyJobBoard`, `AgencyPartnerSection`,
`AgencyTrustGrid`, `AssessmentPortal`, `CandidateModal`, `CourseCatalog`,
`CourseSyllabusModal`, `FaqClean`, `FaqSection`, `Footer`, `Header`, `Hero`,
`HowBackendPlacementWorks`, `HowItWorks`, `HowItWorksSimple`, `OnboardingModal`,
`OnboardingProcess`, `PlacementGuaranteeSection`, `PricingClean`,
`PricingGuaranteeSection`, `ProctoredAssessmentModal`, `SalaryCalculator`,
`StatsBanner`, `SuccessStories`, `TestimonialsSection`, `WhatsAppFloatingButton`.

Unimported MUI files: `MuiHowItWorks`, `MuiPerksSection`,
`MuiPlacementGuarantee`, `MuiServicesOverview`, `MuiTestimonials`.
(`MuiOnboardingModal` is **live** — see §3a.)

## 4. Services (`src/lib/`)

| File | Exports | Notes |
| --- | --- | --- |
| `supabaseClient.ts` | `supabase` | Browser client from `NEXT_PUBLIC_SUPABASE_*`, with a hardcoded anon-key/URL fallback in source. |
| `candidateService.ts` | `startPayuCheckout`, `startPayuUpgradeCheckout`, `recordAssessmentResult`, `fetchCandidateAssessmentHistory`, `signInCandidate`, `signOutCandidate`, `fetchCandidateProfile`, types `CandidateRegistrationInput`, `StartPayuCheckoutInput`, `AssessmentResultInput`, `TestAttempt` | Supabase tables `candidates`, `candidate_assessments`, storage bucket `candidate-assets`; caches profile in `localStorage["cl_candidate"]`. `startPayuCheckout` carries the dossier (incl. photo/resume base64, ≤ ~2.2 MB resume) to `POST /api/payment/initiate` and hands the browser to PayU's hosted checkout; photo/resume upload happens server-side at fulfillment (`lib/payments/fulfill.ts`). Legacy scoring path — mains scores no longer flow through it. |
| `supabaseAdmin.ts` | `getSupabaseAdmin` | **Server-only** service-role client (bypasses RLS). Lazily built from env; used by all `/api/exam/*` routes (ownership enforced in `src/lib/exams/attempts.ts`) and by the PayU payment routes + fulfillment. Never import from a client component. |
| `exams/schema.ts` | `validateExamSet`, types, `toPublicSections` | Question-bank types + strict validation (unique ids, exactly 4 options, `correctIndex` in range, non-empty explanation) + the sanitised question shape sent to the browser: `id`, `subject`, `stem`, `options`, `topic`. `correctIndex`, `explanation` and `difficulty` are stripped. |
| `exams/loader.ts` | `listExamSets`, `getExamSet` | Statically imports `content/exams/*.json` and validates at load. **Server-only by contract** — answer keys must never reach the client bundle. |
| `exams/scoring.ts` | `scoreExamSet` | Pure scoring: `correct × marks − wrong × negative`, per-section breakdown, per-question outcomes. Unit-testable, no I/O. |
| `exams/attempts.ts` | `authenticateRequest`, `createAttemptToken`, `findOpenAttempt`, `createAttemptRow`, `saveResponses`, `finalizeAttempt`, `buildStartPayload`, `buildResultPayload`, … | All exam DB access + bearer-token auth (`supabase.auth.getUser`) + SHA-256 attempt-token hashing + the 30 s expiry grace + `PASS_PERCENT = 40`. |
| `exams/http.ts` | `jsonError`, `readJsonObject`, … | Shared API-route helpers (error contract: `{ error, code }` + HTTP status). |
| `email/otp.ts` | `normalizeEmail`, `generateOtp`, `hashOtp`, `otpMatches`, `OTP_TTL_MINUTES`, `OTP_VERIFIED_TTL_MINUTES`, `OTP_MAX_ATTEMPTS`, `OTP_RESEND_COOLDOWN_SECONDS`, `OTP_HOURLY_SEND_CAP` | Server-only OTP primitives for signup email verification: `crypto.randomInt` 6-digit codes, peppered SHA-256 hashing (the DB never stores a code), timing-safe compare. |
| `email/template.ts` | `BRAND`, `brandLogo`, `renderBrandedEmail`, `otpCodeBlock` | Server-only email design system: one table-based, inline-styled template shared by every transactional mail. Dark slate canvas (`#0b1120`) + card (`#0f172a`) with Cobalt Blue accents from `src/theme/theme.ts` (`#405FE2` rule, `#708bf5` code digits, `#8b97b3` muted). Header is the site's real logo only — `https://www.careerloop.co.in/careerloop-logo.png` at 56 px with `border-radius:50%` (avatar style), no wordmark. Font stack must use single quotes inside the HTML attributes (`'Segoe UI'`): double quotes end the `style` attribute and silently drop every later declaration. |
| `email/resend.ts` | `sendOtpEmail`, `sendBrandedEmail` | Server-only Resend transport. Reads `RESEND_API_KEY` / `RESEND_FROM` / `OTP_MAIL_REPLY_TO`; renders through `email/template.ts`, sends text + HTML with a per-attempt idempotency key and one retry on network failure. `replyTo` defaults to `mail@m.careerloop.co.in` (`BRAND.replyEmail`) — no personal address is ever used. `sendBrandedEmail` is the generic path for any future transactional mail. |
| `exams/demo.ts` | `hasCompletedDemo`, `markDemoCompleted` | Server-only demo-gate access to `demo_completions` (RLS on, zero policies). |
| `exams/client.ts` | `fetchSets`, `startExam`, `autosaveAttempt`, `submitAttempt`, `fetchResult`, `fetchHistory`, formatters | Typed browser client: attaches `Authorization: Bearer <access_token>` from the Supabase session; throws `ExamApiError` with the server's `code`. |
| `faceDetectionService.ts` | `detectFaces`, `DetectedFaceBox`, `FaceDetectionResult` | Native `window.FaceDetector` first, canvas YCbCr skin/luminance fallback. Status: `verified` / `misaligned` / `no_face` / `multiple_faces` / `camera_blocked`. |
| `payments/plans.ts` | `PLAN_CATALOG`, `isPlanKey`, `DEFAULT_PLAN`, `PlanKey` | Code-side plan catalogue (Starter Practice Pass ₹999 / Pro ₹4,999 / 1-on-1 ₹8,999 — all one-time, no expiry). The DB `payment_plans` row is authoritative when present; this is the backstop. |
| `payments/payu.ts` | `getPayUConfig`, `buildCheckoutFields`, `verifyResponseHash`, `verifyPayment`, `generateTxnId`, `formatAmount`, `sha512`, `payUFormAction` | PayU India hosted checkout: SHA-512 request/response hashes, two-decimal amounts, timing-safe hex compare, `verify_payment` server-to-server second factor (8 s timeout; hash still trusted if unreachable). Amounts never client-supplied. |
| `payments/orders.ts` | `resolvePlan`, `listActivePlans`, `createCheckoutOrder`, `findOrderByTxnId`, `markOrderCompleted`, `markOrderFailed`, `supersedePendingCheckouts`, `attachAccountToOrder`, `recordFulfillmentFailure`, `authenticateRequest`, types `PaymentOrder`, `SignupPayload`, `PlanView` | All payment-order DB access. Price resolution prefers the `payment_plans` table (a row present with `is_active=false` disables the plan — no silent fallback), falls back to the code catalogue only when no row exists. `markOrderCompleted` stamps no expiry — entitlement is a completed order, permanently. |
| `payments/fulfill.ts` | `createAccountFromPayload` | Account creation shared with the payment callback (money already captured): defensive email/phone re-check, `auth.admin.createUser` (auto-confirmed, no password resets), `candidates` insert (plan-derived `partner_route`), server-side photo/resume upload to `candidate-assets` (upload failure is non-fatal; photo falls back to its raw base64), OTP burn, rollback of the auth user if the insert fails. |
| `utils.ts` | `cn` | shadcn helper exported but unimported; UI primitives use the `cn` npm package instead. |

## 5. Static data (`src/data/`)

`agencies.ts`, `courses.ts`, `jobs.ts`, `testimonials.ts` — typed arrays consumed
only by legacy components (§3d). Not used by live routes.

## 6. Theme (`src/theme/`)

| File | Role |
| --- | --- |
| `theme.ts` | MUI `createTheme`: cobalt primary `#405FE2`, teal secondary `#003c5e`, light mode, status palette. |
| `ThemeRegistry.tsx` | `"use client"` App Router provider (emotion cache + `ThemeProvider` + `CssBaseline`). Mounted in `layout.tsx`. |

Two styling systems coexist: MUI (`theme.ts` tokens) for the lander/modals, and
Tailwind v4 CSS variables (`globals.css`) for shadcn components. The two token
sets duplicate the same brand colours; changing one does not change the other.

## 7. Scripts and deploy targets

| Script | Command | Target |
| --- | --- | --- |
| `dev` | `next dev` | local `:3000` |
| `build` | `next build` | `.next/` |
| `start` | `next start` | Node server |
| `build:worker` | `opennextjs-cloudflare build` | `.open-next/` |
| `deploy:worker` | `build:worker` + `XDG_CONFIG_HOME=.wrangler-config wrangler deploy` | Cloudflare Worker `careerloop` |
| `deploy:pages` | `npm run build` + `XDG_CONFIG_HOME=.wrangler-config wrangler pages deploy out --project-name=careerloop-pages` | Cloudflare Pages (expects `out/`) |
| `login` / `whoami` | `XDG_CONFIG_HOME=.wrangler-config wrangler …` | Wrangler auth |
| `lint` | `eslint` | — |

Three deploy surfaces are configured at once: Pages (`out/`), Worker
(`.open-next/`), and Vercel (`careerloop`). **Production is Vercel**: the
`careerloop` project (deployment context `careerloop-main`) is what the
`www.careerloop.co.in` CNAME resolves to, and it builds from `main` on push.
The Worker and Pages scripts are unused; a second Vercel context
(`careerloop-o2fs`) reports failure on every commit and serves nothing.

`out/` exists in the working tree but is older than `next.config.ts`: the export
was produced 2026-11-10 00:00, the config was last edited 00:37 and contains no
`output: "export"`. A fresh `npm run build` therefore does not recreate `out/`,
so `deploy:pages` would upload a stale folder until the export config is
restored. `.open-next/` is from 2026-11-09 23:13.

## 8. Environment variables

Names only; values live in `.env.local` (never read them into chat or commits).

| Variable | Used by | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `supabaseClient.ts`, `api/auth/register` | browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `supabaseClient.ts` | browser |
| `SUPABASE_SERVICE_ROLE_KEY` | `api/auth/register` | server only — bypasses RLS |
| `VERCEL_OIDC_TOKEN` | Vercel tooling | local only |
| `PAYU_KEY` | `payments/payu.ts` | server only — PayU app key (hosted checkout form field; not secret by itself) |
| `PAYU_SALT` | same | server only — SHA-512 salt for hashes; rotate after onboarding completes |
| `PAYU_MODE` | same | server only — `live` (default) or `test` (switches to test.payu.in endpoints) |
| `PAYU_BASE_URL` | same | server only — site origin used to build `surl`/`furl` (default `https://www.careerloop.co.in`) |
| `RESEND_API_KEY` | `lib/email/resend.ts` (via `/api/auth/send-otp`) | server only — transactional email |
| `RESEND_FROM` | same | server only — `From` address. The key is scoped to the verified Resend domain `m.careerloop.co.in`; any other domain is rejected with `403 not authorized to send emails from <domain>` |
| `OTP_MAIL_REPLY_TO` | same | server only — `Reply-To` shown to candidates (`mail@m.careerloop.co.in`); falls back to `BRAND.replyEmail` |
| `OTP_PEPPER` | `lib/email/otp.ts` | server only — extra secret mixed into the OTP hash |
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ZONE_ID` | operator scripts only (`docs/FILE_TREE.md`, BIMI/DMARC maintenance) | local only — DNS:Edit on `careerloop.co.in`, kept in `.env.cloudflare`; never read by the app, never deployed |

## 9. Runtime flow

1. `/` mounts the MUI lander and subscribes to Supabase auth.
2. Signup → `MuiOnboardingModal` collects profile (email + phone are unique), webcam snapshot (`detectFaces`), resume, then — **payment is mandatory** — shows the plan + PayU hand-off on the payment step. No account exists at this point; nothing is created until PayU verifies the money.
2a. **Human check (email OTP):** completing the email field in Step 0 first runs `POST /api/auth/check-availability` (duplicate email/phone reported there, before the photo page) and then immediately mails a 6-digit code via `POST /api/auth/send-otp`. The wizard box auto-verifies on the 6th digit (`POST /api/auth/verify-otp`) and Step 0 refuses to advance until that email is verified. Registration consumes the verification server-side, so a verified code can create exactly one account.
3. On the payment step the browser calls `POST /api/payment/initiate` (guest: dossier; signed-in upgrade: Bearer). The server validates the plan + dossier + OTP (+ duplicates → `409`), creates a pending `payment_orders` row keyed by a unique `txnid`, and returns PayU's form URL + signed fields; the browser auto-POSTs to PayU's hosted checkout. PayU POSTs back to `/api/payment/callback`; on a verified success (SHA-512 response hash, amount match, `verify_payment` second factor) the order flips to `completed` and — for guest signups — the account is created server-side (`lib/payments/fulfill.ts`; same guarantees as before: no account without verified email + verified payment; OTP burned; payload scrubbed; auto-rollback of the auth user on candidates-insert failure). PayU's 303 then lands the candidate on `/payment/success`. Photo/resume upload happens server-side at fulfillment. For signed-in upgrades (e.g. Starter → Pro) there is no dossier — the verified callback stamps the order.
3a. **No expiry (2026-11-14):** the ₹999 Starter Practice Pass is a one-time purchase like Pro and 1-on-1. The callback no longer stamps `expires_at`; the column is retained but unused, and all existing rows were cleared. There is no trial hold, gate, banner, or `my-status` route any more.
4. Mains exam: dashboard `mains_exam` tab → `MainsExamPanel` (reads `/api/exam/sets` + `/api/exam/history`) → demo gate (`demo_completions`, enforced again by `/api/exam/start`) → `/exam/<set-id>` runner → fullscreen, autosave, mark-for-review → `/api/exam/submit` scores server-side → result + stored in `exam_attempts`/`exam_responses` (RLS deny-all; service-role writes with `auth.getUser(token)` identity checks only).
5. `/profile` and `/dashboard` render the same dashboard: profile + verified mains history + legacy `candidate_assessments` history on the overview tab, tabs filter views, `signOutCandidate` clears the session.

## 10. Known gaps (record before designing changes)

See `docs/audits/2026-11-10-trust-audit.md` for evidence and remediation order.
Security-critical:

- `POST /api/payment/initiate` still has no caller rate limit (same position as before); it no longer resets passwords — `createUser` at fulfillment is atomic and is only reached for verified payments, which keeps the account-takeover path closed.
- **Email OTP is live** (2026-11-12): Resend sends from `hello@m.careerloop.co.in` (verified domain `m.careerloop.co.in`; the API key is domain-scoped). Note `onboarding@resend.dev` test mode is no longer used — it only delivered to the Resend account owner. `/api/auth/send-otp` is protected only by a 60 s cooldown + 10/hour cap per email — no captcha, so a scripted abuse path is still open (costs mail quota, not accounts).
- `candidates` (fixed 2026-11-11): unique indexes on `lower(email)` and `auth_user_id`, plus a partial unique index on `phone` and a `phone ~ '^[0-9]{10}$'` CHECK; RLS replaced with owner-scoped `authenticated` policies (`auth_user_id = auth.uid()`), no anon access and no client DELETE. `candidate_assessments` (SELECT/INSERT) is still effectively `true` for anon, and bucket `candidate-assets` is public and anon-writable — both still open.
- The legacy proctored modal still computes scores client-side and inserts them with the anon key (`recordAssessmentResult`); it is no longer reachable from the dashboard mains flow, and the demo-completion path still writes a row. Delete or migrate when the lander is next touched. Mains scores are server-verified.

Exam engine (new, verified 2026-11-11):

- `exam_attempts` / `exam_responses`: RLS on with zero policies, anon/authenticated grants revoked; only `/api/exam/*` via service role touches them.
- Demo gate (2026-11-11): `demo_completions` is RLS-on/zero-policy and server-only. `/api/exam/start` returns `403 DEMO_REQUIRED` until a completion row exists, so deep-linking `/exam/<set>` cannot skip the orientation. The old localStorage + "any history row means demo done" heuristic is gone.
- Attempt caps (2 per set), one-open-attempt per set, server clock with 30 s grace, idempotent submit, token rotation on resume.
- End-to-end suite (`/tmp/opencode/exam-e2e.mjs`, throwaway auth user) covers 42 checks: demo gate (401 anon, incomplete → start 403 `DEMO_REQUIRED`, POST completes), answer-key leak, stale-token 403, forged anon reads/writes, cap enforcement, idempotent resubmit, score math.
- Profile identity suite (`/tmp/opencode/profile-rls-e2e.mjs`, 17 checks, 2026-11-11): duplicate signup 409, one profile per account, one profile per email (case-insensitive), duplicate mobile 409, sub-10-digit mobile 400, cross-account reads return nothing, cross-account updates affect 0 rows, anon has no access, exam start gated then allowed after demo.

Product/quality:

- "Verified score routed to hiring partners" copy in the dashboard has no implementation.
- Legacy component tree (§3d) plus unused `data/*`, `utils.ts`, and eight of the shadcn primitives (four imported only by legacy code, four never imported).
- Anon key/URL hardcoded as fallback in `supabaseClient.ts`.
- `profile/page.tsx` is a monolith mixing data loading, proctoring, and seven tab UIs.
- `/dashboard` and `/profile` duplicate one page.
- No test suite, no CI config in the repo; `lint` is not wired to any hook.
- Mixed styling systems (MUI + Tailwind/shadcn) with duplicated brand tokens.
- Unknown live deploy target, and the `out/` export cannot be rebuilt from the current config (§7).

## 11. Regenerating the import map

```sh
cd "/home/sagaranmol/code room/careerloop"
for f in $(find src -type f \( -name "*.tsx" -o -name "*.ts" \) | sort); do
  a="@/${f#src/}"; a="${a%.*}"
  c=$(grep -rlF "\"$a\"" src --include=*.tsx --include=*.ts | grep -v "^${f}$" | sed "s|^src/||" | tr "\n" " ")
  printf "%-52s <- %s\n" "${f#src/}" "${c:-UNUSED}"
done
```

When checking for hidden paths (`.vercel/`, `.wrangler/`), use `ls -a` or pass
`hidden: true`; default glob calls skip dotfiles and will report false negatives.
