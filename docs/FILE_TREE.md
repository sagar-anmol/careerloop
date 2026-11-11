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
| `public/` | Static files served at `/`: `careerloop-logo.png` (master brand mark, 1024 px, transparent background — used by the header, footer and favicon generation), `hero-banner.jpg`, `hero-banner-mobile.jpg`, default Next SVGs. |
| `content/` | `exams/<set-slug>.json` — question banks for the mains engine. Four CareerLoop-branded sets: `careerloop-mains-01` (the official mains set), `careerloop-core-01`, `careerloop-aptitude-01`, `careerloop-english-01`. **Server-only**: imported by `src/lib/exams/loader.ts`, never by client components (answer keys would leak into the browser bundle). `difficulty` is authoring metadata and is not exposed by the API. |
| `docs/` | `FILE_TREE.md`, `audits/` (trust audit 2026-11-10), and EGM design artifacts (`designs/`). |
| `supabase/` | `migrations/` — SQL record of schema changes applied to the Supabase project: `20261111090000_exam_engine.sql` (`exam_attempts`, `exam_responses`), `20261111120000_profile_uniqueness.sql` (unique `lower(email)` / `auth_user_id` indexes + owner-scoped `candidates` RLS), `20261111130000_phone_unique_and_format.sql` (unique `phone` partial index + 10-digit CHECK), and `20261111140000_demo_gate.sql` (`demo_completions`, the server-side demo unlock). No local Supabase CLI; migrations are applied via the Supabase MCP/SQL editor and mirrored into this folder. |
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
| `page.tsx` | `/` landing. `"use client"`. Composes MUI section components + modals, syncs Supabase session via `supabase.auth.getSession` / `onAuthStateChange`. |
| `profile/page.tsx` | `/profile` candidate dashboard, ~1.1k lines, client component. Tab ids: `overview`, `mains_exam`, `mock_tests`, `assessments`, `dossier`, `partners`, `settings` (`mains_exam` and `assessments` render the same block, which is now `MainsExamPanel`). Reads cached profile from `localStorage`, then Supabase. Uses shadcn primitives + MUI modals. |
| `dashboard/page.tsx` | `/dashboard`. Re-exports `profile/page.tsx` with dashboard metadata. Two URLs, one implementation. |
| `exam/[setId]/page.tsx` | `/exam/<set-id>` mains test runner. Client page (`use(params)`); delegates to `ExamShell`. Accepts `?attempt=<id>` to deep-link a stored result. |
| `exam/[setId]/layout.tsx` | Metadata for the exam route (client pages cannot export `metadata`). |
| `api/auth/register/route.ts` | `POST` only. Service-role Supabase client: atomically `createUser`s the account, sets `email_confirm: true` and `user_metadata` (`full_name`, `phone`, `domain`, `candidate_id`). An existing email returns `409 EMAIL_TAKEN`; it never resets a password. **Still no caller auth/rate limit — see §10.** |
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
| `MuiPricingSection.tsx` | `page.tsx` | Pricing tiers (incl. 1-on-1 mentorship ring/badge). |
| `MuiFaq.tsx` | `page.tsx` | FAQ accordion. |
| `MuiFooter.tsx` | `page.tsx` | Footer. Uses the same brand mark in the brand column. |
| `MuiWhatsAppButton.tsx` | `page.tsx` | Floating WhatsApp CTA. |
| `MuiAuthModal.tsx` | `page.tsx` | Sign-in / sign-up modal. |
| `MuiOnboardingModal.tsx` | `page.tsx` | Multi-step signup: profile, webcam photo, resume upload, candidate ID. Owns `CandidateOnboardingData`. |
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
| `candidateService.ts` | `registerCandidateDossier`, `recordAssessmentResult`, `fetchCandidateAssessmentHistory`, `signInCandidate`, `signOutCandidate`, `fetchCandidateProfile`, types `CandidateRegistrationInput`, `AssessmentResultInput`, `TestAttempt` | Supabase tables `candidates`, `candidate_assessments`, storage bucket `candidate-assets`; caches profile in `localStorage["cl_candidate"]`. Legacy scoring path — mains scores no longer flow through it. |
| `supabaseAdmin.ts` | `getSupabaseAdmin` | **Server-only** service-role client (bypasses RLS). Lazily built from env; used by all `/api/exam/*` routes (ownership enforced in `src/lib/exams/attempts.ts`) and by `api/auth/register`. Never import from a client component. |
| `exams/schema.ts` | `validateExamSet`, types, `toPublicSections` | Question-bank types + strict validation (unique ids, exactly 4 options, `correctIndex` in range, non-empty explanation) + the sanitised question shape sent to the browser: `id`, `subject`, `stem`, `options`, `topic`. `correctIndex`, `explanation` and `difficulty` are stripped. |
| `exams/loader.ts` | `listExamSets`, `getExamSet` | Statically imports `content/exams/*.json` and validates at load. **Server-only by contract** — answer keys must never reach the client bundle. |
| `exams/scoring.ts` | `scoreExamSet` | Pure scoring: `correct × marks − wrong × negative`, per-section breakdown, per-question outcomes. Unit-testable, no I/O. |
| `exams/attempts.ts` | `authenticateRequest`, `createAttemptToken`, `findOpenAttempt`, `createAttemptRow`, `saveResponses`, `finalizeAttempt`, `buildStartPayload`, `buildResultPayload`, … | All exam DB access + bearer-token auth (`supabase.auth.getUser`) + SHA-256 attempt-token hashing + the 30 s expiry grace + `PASS_PERCENT = 40`. |
| `exams/http.ts` | `jsonError`, `readJsonObject`, … | Shared API-route helpers (error contract: `{ error, code }` + HTTP status). |
| `exams/demo.ts` | `hasCompletedDemo`, `markDemoCompleted` | Server-only demo-gate access to `demo_completions` (RLS on, zero policies). |
| `exams/client.ts` | `fetchSets`, `startExam`, `autosaveAttempt`, `submitAttempt`, `fetchResult`, `fetchHistory`, formatters | Typed browser client: attaches `Authorization: Bearer <access_token>` from the Supabase session; throws `ExamApiError` with the server's `code`. |
| `faceDetectionService.ts` | `detectFaces`, `DetectedFaceBox`, `FaceDetectionResult` | Native `window.FaceDetector` first, canvas YCbCr skin/luminance fallback. Status: `verified` / `misaligned` / `no_face` / `multiple_faces` / `camera_blocked`. |
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
(`.open-next/`), and Vercel (`careerloop`). Nothing in the repo records which one
serves production — confirm with the owner before deploying.

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

## 9. Runtime flow

1. `/` mounts the MUI lander and subscribes to Supabase auth.
2. Signup → `MuiOnboardingModal` collects profile, webcam snapshot (`detectFaces`), resume → `registerCandidateDossier` writes storage `candidate-assets` and table `candidates`, caches profile in `localStorage`.
3. Account creation can call `POST /api/auth/register` (service role) to create/confirm the auth user with a password.
4. Mains exam: dashboard `mains_exam` tab → `MainsExamPanel` (reads `/api/exam/sets` + `/api/exam/history`) → demo gate (`demo_completions`, enforced again by `/api/exam/start`) → `/exam/<set-id>` runner → fullscreen, autosave, mark-for-review → `/api/exam/submit` scores server-side → result + stored in `exam_attempts`/`exam_responses` (RLS deny-all; service-role writes with `auth.getUser(token)` identity checks only).
5. `/profile` and `/dashboard` render the same dashboard: profile + verified mains history + legacy `candidate_assessments` history on the overview tab, tabs filter views, `signOutCandidate` clears the session.

## 10. Known gaps (record before designing changes)

See `docs/audits/2026-11-10-trust-audit.md` for evidence and remediation order.
Security-critical:

- `POST /api/auth/register` still has no caller rate limit, but no longer resets the password of an existing email — it returns `409 EMAIL_TAKEN` and `createUser` is atomic, which closed the account-takeover path (verified 2026-11-11).
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
