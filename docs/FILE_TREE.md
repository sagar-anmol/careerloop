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
| `docs/` | `FILE_TREE.md`, `audits/` (trust audit 2026-11-10), and EGM design artifacts (`designs/`). |
| `supabase/` | `migrations/` — SQL record of schema changes applied to the Supabase project: `20261111090000_exam_engine.sql` (`exam_attempts`, `exam_responses`), `20261111120000_profile_uniqueness.sql` (unique `lower(email)` / `auth_user_id` indexes + owner-scoped `candidates` RLS), `20261111130000_phone_unique_and_format.sql` (unique `phone` partial index + 10-digit CHECK), and `20261111140000_demo_gate.sql` (`demo_completions`, the server-side demo unlock), plus `20261112090000_payment_orders.sql` (`payment_plans` catalogue, `payment_orders` with unique `UTR`, RLS on/zero-policy service-role-only), `20261112120000_payment_orders_utr_verified.sql` (`utr_verified boolean not null default false` + backfill from `status='completed'` + partial index `payment_orders_pending_verification_idx`), and `20261112150000_starter_trial_expiry.sql` (`payment_orders.expires_at`, starter plan renamed to "Starter 7-Day Trial Pass" at ₹999), plus `20261112170000_email_otp_challenges.sql` (`email_otp_challenges`: per-email hashed signup OTP, RLS on/zero-policy service-role-only), and `20261112180000_payment_plans_rls.sql` (`payment_plans` RLS enabled with zero policies — before this the anon key could `PATCH` plan prices, since `resolvePlan()` trusts the DB row) — all applied live via Supabase MCP on 2026-11-12). No local Supabase CLI; migrations are applied via the Supabase MCP/SQL editor and mirrored into this folder. |
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
| `page.tsx` | `/` landing. `"use client"`. Composes MUI section components + modals, syncs Supabase session via `supabase.auth.getSession` / `onAuthStateChange`. Loads the Ethora AI assistant (app `6af56e0f880b7097ec1e7ba0`) via `next/script` `afterInteractive` with `data-position="left"`, so its launcher is bottom-LEFT and the WhatsApp CTA keeps bottom-right. Lander only — not the dashboard or the exam runner. |
| `profile/page.tsx` | `/profile` candidate dashboard, ~1.1k lines, client component. Tab ids: `overview`, `mains_exam`, `mock_tests`, `assessments`, `dossier`, `partners`, `settings` (`mains_exam` and `assessments` render the same block, which is now `MainsExamPanel`). Reads cached profile from `localStorage`, then Supabase. Uses shadcn primitives + MUI modals. |
| `dashboard/page.tsx` | `/dashboard`. Re-exports `profile/page.tsx` with dashboard metadata. Two URLs, one implementation. |
| `exam/[setId]/page.tsx` | `/exam/<set-id>` mains test runner. Client page (`use(params)`); delegates to `ExamShell`. Accepts `?attempt=<id>` to deep-link a stored result. |
| `exam/[setId]/layout.tsx` | Metadata for the exam route (client pages cannot export `metadata`). |
| `api/auth/register/route.ts` | `POST` only. **Paid enrollment gate**: requires `plan` + a 12-digit `utr` (rejected otherwise — no account is created), and a **verified signup OTP** for that email (`email_otp_challenges.verified_expires_at > now()`, `consumed_at is null`) → else `403 EMAIL_NOT_VERIFIED`. Pre-checks duplicates BEFORE creating anything (`candidates.email` → `409 EMAIL_TAKEN`, `candidates.phone` → `409 PHONE_TAKEN`, `payment_orders.utr` → `409 UTR_TAKEN`). Service-role: atomically `createUser`s the auth user, inserts the `candidates` row (server-side, `partner_route` from plan) and the `payment_orders` row (server-derived amount, `utr_verified=false`), then burns the OTP (`consumed_at`) — one verification = one account; a rolled-back signup leaves the verification intact. On any failure after `createUser`, rolls back (deletes the candidates row + auth user). Unique indexes remain the backstop under races. |
| `api/auth/check-availability/route.ts` | `POST { email, phone }`. Unauthenticated **pre-check** for the signup wizard's Step 0 (before the photo/payment steps): returns `{ emailTaken, phoneTaken }` booleans only. Convenience only — `/api/auth/register` re-verifies authoritatively; the route fails open if the DB is unreachable. |
| `api/auth/send-otp/route.ts` | `POST { email }`. Unauthenticated. Mails a 6-digit signup verification code via Resend (`lib/email/resend.ts`). Stores only a peppered SHA-256 hash in `email_otp_challenges` (never the code). Guards: 60 s resend cooldown (`429 COOLDOWN` + `retryAfterSeconds`), hourly send cap per email (`429 TOO_MANY_SENT`), and the challenge row is deleted if the send fails so a retry isn't blocked by a code that never arrived (`502 SEND_FAILED`). |
| `api/auth/verify-otp/route.ts` | `POST { email, otp }`. Unauthenticated. Compares the code timing-safely against the stored hash; tracks `attempts` (5 max → `429 TOO_MANY_ATTEMPTS`), rejects expired codes (`10 min`), and on success stamps `verified_at` + `verified_expires_at` (`60 min`) — the mark `/api/auth/register` requires and consumes. |
| `api/exam/sets/route.ts` | `GET`. Catalogue of playable sets with per-user attempts used/remaining and best score, plus `demoCompleted` (the server-side demo unlock flag). |
| `api/exam/demo/route.ts` | `GET` returns `{ completed }`; `POST` records demo completion in `demo_completions`. The demo itself is unscored. |
| `api/exam/start/route.ts` | `POST`. Starts or resumes an attempt; refuses with `403 DEMO_REQUIRED` until the demo is on record; enforces attempt cap and one-open-attempt; issues and rotates the `attempt_token`; returns sanitised questions (no answers) and the server `expires_at`. |
| `api/exam/autosave/route.ts` | `PATCH`. Upserts saved responses + integrity flags; auto-finalises as `expired` when the server clock runs out. |
| `api/exam/submit/route.ts` | `POST`. Scores the attempt server-side (idempotent); late submits beyond a 30 s grace are scored from the last autosave. |
| `api/exam/result/[attemptId]/route.ts` | `GET`. Stored result + answer review with explanations (owner only). |
| `api/exam/history/route.ts` | `GET`. The user's 50 most recent attempts across sets. |
| `api/payment/create/route.ts` | `POST`. Bearer auth; resolves the plan server-side (`payment_plans` table with code-catalogue fallback — the client never sends a price), reuses or creates a pending `payment_orders` row, returns `{ order, payeeName, upiUri, qrUrl, plans }`. The UPI id is **not** sent to the browser — the QR (built server-side from the upi URI) and the mobile deep link are the only payment paths. `qrUrl` renders the QR via an external image service; the app ships no QR dependency. |
| `api/payment/quote/route.ts` | `POST { plan }`. **Unauthenticated** (no session exists yet); creates **no** order. Returns the "invoice" the onboarding payment step renders: plan name, server-derived amount, payee, `upiUri`, `qrUrl` — no UPI id in the response. Used before account creation. |
| `api/payment/submit-utr/route.ts` | `POST`. Bearer auth; validates the 12-digit UTR, attaches it to the user's pending order. Unique index blocks reused UTRs (`409 UTR_TAKEN`). Does **not** mark paid. |
| `api/admin/payments/route.ts` | `GET`/`POST`. Admin-only (`CAREERLOOP_ADMIN_KEY` via `x-api-key` or `Bearer`). `GET` lists/summarises orders (incl. `awaitingVerification` — UTR submitted, `utr_verified=false`, and `expires_at` on records); `POST { orderId, action: "complete" \| "fail" }` marks verification. The only path that flips `status` to `completed` and `utr_verified` to true — and, for the starter trial plan, stamps `expires_at = verified_at + 7 days`. |
| `api/payment/my-status/route.ts` | `GET`. Bearer auth. Drives the whole-site banner with three states, in priority order: `pendingVerification` (UTR submitted, unverified → red banner), `trialExpired` (held the 7-day Starter Trial, now lapsed, no other active entitlement → amber upgrade banner; the order row is kept forever — expiry is computed from `expires_at`, never deleted), or neither (no purchases / active entitlement). |
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
| `MuiPricingSection.tsx` | `page.tsx` | Pricing tiers (incl. 1-on-1 mentorship ring/badge). Paid plans (₹999 Starter 7-Day Trial / ₹4,999 Pro / ₹8,999 1-on-1) start UPI checkout via `onSelectPlan`; the ₹5,000 "placement" copy is a separate legacy story. |
| `MuiUpiPaymentModal.tsx` | `page.tsx` | UPI scan-&-pay dialog: amount/payee/QR from `POST /api/payment/create`, mobile `upi://` deep link, 12-digit UTR field → `POST /api/payment/submit-utr`. The UPI id is never displayed (QR/deep-link only). Verification stays an admin step; on success dispatches the `careerloop:payment-utr-submitted` event so the banner refreshes. |
| `MuiTrialExpiredGate.tsx` | `page.tsx`, `profile/page.tsx` | Full-screen hold rendered at sign-in when the 7-day Starter Trial has lapsed (`trialExpired` from my-status) and no fresh UTR is pending. Account is flagged by computed entitlement (nothing stored twice, nothing deleted). Shows upgrade plans (Pro ₹4,999 / 1-on-1 ₹8,999 → UPI checkout), what stays included, and sign-out. Self-releases on `careerloop:payment-utr-submitted` (hold lifts once a new UTR is recorded; red banner takes over until verification). |
| `MuiPaymentPendingBanner.tsx` | `page.tsx`, `profile/page.tsx` | Whole-site status strip at the very top (in-flow, above both sticky headers); not dismissible. RED: submitted-but-unverified UTR (`pendingVerification`). AMBER: expired 7-day Starter Trial (`trialExpired`) with an "Upgrade now" CTA to `/#pricing`. Polls `GET /api/payment/my-status`; refreshes on auth change and the `careerloop:payment-utr-submitted` event. |
| `MuiFaq.tsx` | `page.tsx` | FAQ accordion. |
| `MuiFooter.tsx` | `page.tsx` | Footer. Uses the same brand mark in the brand column; bottom bar credits "Built by Sagar Kumar". |
| `MuiWhatsAppButton.tsx` | `page.tsx` | Floating WhatsApp CTA, bottom-right (`position: fixed; bottom/right: 24`, z-index 1000). Opens the community group invite `https://chat.whatsapp.com/Kg2SW9a4rYRIvJ8R5gFhGC` (replaced the old placeholder `wa.me/919876543210` deep link). |
| `MuiAuthModal.tsx` | `page.tsx` | Sign-in / sign-up modal. |
| `MuiOnboardingModal.tsx` | `page.tsx` | Multi-step paid enrollment: Candidate Info → Live Photo ID → Program & Consent → **Payment & UTR** (QR from `POST /api/payment/quote`; 12-char UTR gate; account created only on submit) → Account Ready. Accepts `initialPlan`. Owns `CandidateOnboardingData`. |
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
| `candidateService.ts` | `registerCandidateDossier`, `recordAssessmentResult`, `fetchCandidateAssessmentHistory`, `signInCandidate`, `signOutCandidate`, `fetchCandidateProfile`, types `CandidateRegistrationInput`, `AssessmentResultInput`, `TestAttempt`, `CandidateRegistrationResult` | Supabase tables `candidates`, `candidate_assessments`, storage bucket `candidate-assets`; caches profile in `localStorage["cl_candidate"]`. Registration calls `POST /api/auth/register` with `plan` + `utr`. Step-4 profile sync failure is downgraded to a returned `warning` (account + payment already exist at that point). Legacy scoring path — mains scores no longer flow through it. |
| `supabaseAdmin.ts` | `getSupabaseAdmin` | **Server-only** service-role client (bypasses RLS). Lazily built from env; used by all `/api/exam/*` routes (ownership enforced in `src/lib/exams/attempts.ts`) and by `api/auth/register`. Never import from a client component. |
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
| `payments/upi.ts` | `getUpiConfig`, `buildUpiUri`, `buildQrImageUrl`, `normalizeUtr`, `PLAN_CATALOG`, `isPlanKey`, `TRIAL_PLAN`, `TRIAL_DURATION_DAYS` | Server-side UPI config + verification helpers. UPI id / payee come from env (`PAYMENT_UPI_ID`, server-only) and are never sent to the browser as a field. Amounts are never client-supplied. The starter plan is the 7-day trial (`TRIAL_PLAN=starter_practice`, ₹999). |
| `payments/orders.ts` | `resolvePlan`, `listActivePlans`, `findPendingOrder`, `createOrder`, `getOrderForUser`, `listCompletedOrders`, `attachUtr` | All payment-order DB access + bearer-token auth reuse. Price resolution prefers the `payment_plans` table, falls back to the code catalogue if the migration is missing. `listCompletedOrders` powers the trial-expiry entitlement check (rows persist; expiry computed). |
| `payments/entitlement.ts` | `fetchEntitlement` | Client helper behind the trial hold: calls `GET /api/payment/my-status` and returns `held = trialExpired && !pendingVerification`. Fails open (never holds on network/server errors — an outage must not lock people out). |
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
| `PAYMENT_UPI_ID` | `payments/upi.ts` (via `/api/payment/*`) | server only |
| `PAYMENT_PAYEE_NAME` | same | server only |
| `PAYMENT_NOTE` | same | server only |
| `CAREERLOOP_ADMIN_KEY` | `api/admin/payments` | server only — admin verification key |
| `RESEND_API_KEY` | `lib/email/resend.ts` (via `/api/auth/send-otp`) | server only — transactional email |
| `RESEND_FROM` | same | server only — `From` address. The key is scoped to the verified Resend domain `m.careerloop.co.in`; any other domain is rejected with `403 not authorized to send emails from <domain>` |
| `OTP_MAIL_REPLY_TO` | same | server only — `Reply-To` shown to candidates (`mail@m.careerloop.co.in`); falls back to `BRAND.replyEmail` |
| `OTP_PEPPER` | `lib/email/otp.ts` | server only — extra secret mixed into the OTP hash |
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ZONE_ID` | operator scripts only (`docs/FILE_TREE.md`, BIMI/DMARC maintenance) | local only — DNS:Edit on `careerloop.co.in`, kept in `.env.cloudflare`; never read by the app, never deployed |

## 9. Runtime flow

1. `/` mounts the MUI lander and subscribes to Supabase auth.
2. Signup → `MuiOnboardingModal` collects profile (email + phone are unique), webcam snapshot (`detectFaces`), resume, then — **payment is mandatory** — shows the UPI QR via unauthenticated `POST /api/payment/quote` and requires the 12-digit UTR before account creation.
2a. **Human check (email OTP):** completing the email field in Step 0 first runs `POST /api/auth/check-availability` (duplicate email/phone reported there, before the photo page) and then immediately mails a 6-digit code via `POST /api/auth/send-otp`. The wizard box auto-verifies on the 6th digit (`POST /api/auth/verify-otp`) and Step 0 refuses to advance until that email is verified. Registration consumes the verification server-side, so a verified code can create exactly one account.
3. `registerCandidateDossier` calls `POST /api/auth/register` (service role): requires a verified OTP, verifies plan + UTR, rejects duplicates (email/phone/UTR → `409`), atomically creates the auth user (`email_confirm: true`, password never reset on an existing email), inserts the `candidates` row and the `payment_orders` row (server-derived amount, `utr_verified=false`), burns the OTP; rolls everything back if any step fails — no account exists without verified email + payment + UTR. The client then uploads the photo/resume to storage `candidate-assets`, upserts the `candidates` row (non-fatal), and caches the profile in `localStorage`.
3a. **Trial hold:** the starter plan is a 7-day trial. Admin verification stamps `payment_orders.expires_at = verified_at + 7 days`; after that, `my-status` reports `trialExpired` and both `page.tsx` and `profile/page.tsx` hold the account behind `MuiTrialExpiredGate` (sign-in held; upgrade via UPI releases the hold while verification stays with the team). Order rows are never deleted — the record that someone held a pack persists.
4. Mains exam: dashboard `mains_exam` tab → `MainsExamPanel` (reads `/api/exam/sets` + `/api/exam/history`) → demo gate (`demo_completions`, enforced again by `/api/exam/start`) → `/exam/<set-id>` runner → fullscreen, autosave, mark-for-review → `/api/exam/submit` scores server-side → result + stored in `exam_attempts`/`exam_responses` (RLS deny-all; service-role writes with `auth.getUser(token)` identity checks only).
5. `/profile` and `/dashboard` render the same dashboard: profile + verified mains history + legacy `candidate_assessments` history on the overview tab, tabs filter views, `signOutCandidate` clears the session.

## 10. Known gaps (record before designing changes)

See `docs/audits/2026-11-10-trust-audit.md` for evidence and remediation order.
Security-critical:

- `POST /api/auth/register` still has no caller rate limit, but no longer resets the password of an existing email — it returns `409 EMAIL_TAKEN` and `createUser` is atomic, which closed the account-takeover path (verified 2026-11-11).
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
