# Exam engine — Mains tests (server-verified, JEE-style)

Status: **built and verified** (2026-11-11). Owner asked for the full flow in one
go; the two goldfish review passes on the draft were folded in before
implementation. This document describes the system as it exists now.

Related: `docs/audits/2026-11-10-trust-audit.md` (the P0s this build must not
widen), `docs/FILE_TREE.md` (code map).

## 1. Problem

The dashboard's `mains_exam` tab was a facade: scores computed in the browser,
answer keys shipping to the client, attempt limits in `localStorage`, and rows
world-writable through the public anon key. A placement partner could not rely
on that number.

Outcome: a candidate opens a timed set, answers aptitude / reasoning / English
(and science / awareness per pattern) MCQs in a JEE-Mains-style fullscreen
interface, marks questions for review, and submits. The server scores it, stores
the attempt and every response, and the UI shows a verified score.

## 2. Review findings that changed the design

- **Auth path was self-contradictory** ("no anon policies" + "routes check
  `auth_user_id = auth.uid()`" cannot both hold). Resolved: RLS is enabled with
  **zero policies** (deny-all for anon *and* authenticated), and every
  `/api/exam/*` route uses the **service-role client** with identity from
  `supabase.auth.getUser(Authorization: Bearer …)` — the JWT is verified server
  side and never taken from the body. Ownership checks are explicit
  application code in `src/lib/exams/attempts.ts`.
- **Attempt token**: `/api/exam/start` returns a random 32-hex
  `attempt_token`; only its SHA-256 hash is stored. Autosave/submit require it,
  and every resume rotates it — a stale tab is locked out instead of racing the
  live one.
- **One open attempt per set**: a unique partial index on
  `(auth_user_id, set_id) where status = 'in_progress'` plus resume-on-start
  semantics closes the double-tab race.
- **Expiry**: the server clock owns the deadline. Submits within a 30 s grace
  are on time; later payloads are ignored and the attempt is scored from the
  last autosave. Autosave past expiry finalises as `expired`.
- **Idempotent submit**: once `submitted`/`expired`, repeated submits return
  the stored result.
- **Answer-key leak**: `toPublicSections()` strips `correctIndex`,
  `explanation` and `difficulty`; an e2e assertion greps the serialized start
  payload for all three.
- **Register-endpoint P0** stays open (out of scope) — this build only refuses
  to depend on or widen it: the engine never trusts client-supplied identity.

## 3. Content policy

The banks in `content/exams/*.json` are **original questions written in-house for
CareerLoop**, with an explanation each. The sets carry CareerLoop branding
throughout — ids, titles and `patternNotes` no longer name an external exam
board, so nothing implies affiliation with or authorship by a public commission.
The `patternNote` is shown on the instruction screen and describes the paper's
own section mix and marking.

**English coverage**: the owner required every set to contain an English
section. Every set does, in proportion to its focus (5–14 questions).

## 4. Published sets (4 × 30 questions, 120 total)

| Set id | Title | Sections | Time | Marking |
| --- | --- | --- | --- | --- |
| `careerloop-mains-01` | CareerLoop Mains Exam — Set 01 | Reasoning 8, Quant 8, English 7, GA 7 | 40 min | +2 / −0.5 (max 60) |
| `careerloop-core-01` | CareerLoop Core Mock — Set 01 | Maths 8, Reasoning 8, Science 6, English 5, GA 3 | 30 min | +1 / −0.33 (max 30) |
| `careerloop-aptitude-01` | CareerLoop Aptitude & Reasoning — Set 01 | Quant 10, Reasoning 10, English 5, GA 5 | 40 min | +1 / −0.25 (max 30) |
| `careerloop-english-01` | CareerLoop English & Comprehension — Set 01 | English 14, Reasoning 6, Quant 5, GA 5 | 30 min | +1 / −0.25 (max 30) |

Attempt cap: 2 per set (server-enforced). Review policy: `after_submit` (answer
review with explanations on the result screen). Pass mark: 40%.

Loader validation (fails loudly at import): unique ids, exactly 4 non-empty
options, `correctIndex` 0–3, non-empty explanation, known difficulty, unique
section ids. `difficulty` is authoring metadata only — it is validated but
never sent to the browser.

## 5. Data model

`supabase/migrations/20261111090000_exam_engine.sql` (applied to the live
project via Supabase MCP; no local CLI in repo):

- `exam_attempts` — identity (`auth_user_id`, `candidate_id`), set refs,
  `attempt_token_hash`, `status ∈ {in_progress, submitted, expired}`, server
  `started_at`/`expires_at`, score fields, `section_scores` jsonb,
  `integrity_flags` jsonb, `client_meta` jsonb. Unique partial index for one
  open attempt per (user, set). `updated_at` trigger.
- `exam_responses` — one row per (attempt, question): `selected_index`,
  `marked_for_review`, `visited`, `time_spent_ms`. Cascade delete.
- RLS enabled, **no policies**, `revoke all … from anon, authenticated`.
- `candidates` / `candidate_assessments` untouched.

## 6. API (all JSON; identity = verified bearer token)

| Route | Method | Notes |
| --- | --- | --- |
| `/api/exam/sets` | GET | Catalogue + per-user attempts used/remaining, best score, open-attempt id. |
| `/api/exam/start` | POST | Start or resume; cap + one-open-attempt enforcement; issues/rotates token; sanitised questions; server `expires_at` and saved responses on resume. |
| `/api/exam/autosave` | PATCH | Batch upsert of responses + integrity flags; returns `remaining_seconds` (client resyncs its deadline from this); finalises as `expired` when time is out. |
| `/api/exam/submit` | POST | Scores and closes; idempotent; 30 s grace; review payload included per policy. |
| `/api/exam/result/[attemptId]` | GET | Stored result + answer review (owner only). |
| `/api/exam/history` | GET | 50 most recent attempts for the dashboard table. |

Error contract: `{ error: string, code: string }` with real HTTP statuses —
`401 UNAUTHENTICATED/INVALID_SESSION`, `403 ATTEMPT_LIMIT/BAD_ATTEMPT_TOKEN`,
`404 UNKNOWN_SET/ATTEMPT_NOT_FOUND`, `500 INTERNAL`.

## 7. Client

`/exam/[setId]` (client page) → `ExamShell` phase machine:
`gate → instructions → running → result`. Start requests fullscreen inside the
click gesture; `fullscreenchange` exits add an integrity flag and a non-blocking
banner. Timer derives from the server payload and resyncs on every autosave;
auto-submit at `00:00`. Autosave every 15 s and on `visibilitychange`/`pagehide`
(`keepalive`). NTA states and palette colours; keyboard `1–4`, `←/→`, `M`, `S`;
`beforeunload` guard while running. Result screen: score, pass badge, section
table, integrity note, answer review with explanations; retake only if attempts
remain.

Dashboard: the `mains_exam`/`assessments` tab renders `MainsExamPanel` (set
cards + verified history with "View result" deep links). The header CTA and
mock-test cards route to the real runner. The legacy proctored modal is no
longer reachable from the dashboard.

## 8. Verification (all passing, 2026-11-11)

- `npx tsc --noEmit` clean; `npm run build` green (6 exam routes + `/exam/[setId]`).
- ESLint clean on all new files (React hooks purity rules included).
- E2E against the live Supabase project with a throwaway auth user, 34 checks:
  catalogue counts; 401 without token; start/resume/token-rotation; stale-token
  403; autosave round-trip; unknown-question ids dropped; **no
  `correctIndex`/`explanation` in the start payload**; hand-computed score
  (2×2 − 0.5 = 3.5) with correct/wrong/unattempted counts; percentage + pass
  logic; section scores; idempotent resubmit; history; cap: third start after
  two finished attempts is `403 ATTEMPT_LIMIT`; anon key cannot read or insert
  `exam_attempts`. Test user deleted (cascade removes its attempts).
- SSR smoke: `/exam/careerloop-mains-01`, `/exam/unknown-set`, `/dashboard` → 200.

## 9. Known limitations / next steps

1. The register P0 is **fixed** (2026-11-11): `/api/auth/register` returns
   `409 EMAIL_TAKEN` instead of resetting an existing user's password, and
   `candidates` now has unique `lower(email)` / `auth_user_id` indexes with
   owner-scoped RLS, so one account cannot produce a second profile and no one
   can read another account's profile. Still open from the audit:
   `candidate_assessments` RLS and the public `candidate-assets` bucket.
2. Full-length banks (100 Q) are a content task; the loader takes new JSON
   files with no code change.
3. Question randomisation, per-section timing, and recruiter-facing exports are
   deliberately not built.
4. `supabase/` has no CLI tooling; apply future migrations via MCP/SQL editor
   and mirror the SQL here.
