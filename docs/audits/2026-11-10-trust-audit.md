# Trust audit — signup, login, candidate data, "mains" scoring

Date: 2026-11-10
Scope: `/` lander, signup + login, `/profile` dashboard, Supabase schema/RLS,
`candidate-assets` bucket. Read-only: nothing in this audit was changed.

Question being answered: *does the current flow hold up, and can a mains test
whose scores are considered by placement companies be bolted on as-is?*

Short answer: the flow is logically coherent and the marketing copy already
disclaims job guarantees, but the trust layer is not real yet. Three claims on
the site are currently unsupported by the system: verified identity, protected
candidate data, and certified scores routed to partners.

## 1. What holds up

- **Signup path is coherent.** `MuiOnboardingModal` has 4 steps (info → live
  photo → program/consent → ready), validates a 6-character minimum password,
  then calls `registerCandidateDossier`. If the API call fails it falls back to
  `supabase.auth.signUp`, so signup does not dead-end.
- **Login path is ordinary.** `MuiAuthModal` → `signInCandidate` →
  `supabase.auth.signInWithPassword`; failures surface in a MUI `Alert`.
- **The FAQ refuses to claim guaranteed placement** (`MuiFaq.tsx`): "No platform
  can legally guarantee a job offer… Final hiring decisions… are made entirely by
  the corporate recruiters." That is the right tone and it is the single reason
  the copy does not read as an outright scam. Keep it.
- **Dashboard sections exist and are gated by session state.** Seven tab ids,
  sign-out clears `cl_candidate`, and the Mains view already refuses to start
  before a demo walkthrough.

## 2. What does not hold up

### P0 — Account takeover through the register endpoint

`src/app/api/auth/register/route.ts` runs with the service-role key, finds a user
by email, and if found **sets that user's password and confirms the email**
(`updateUserById(existingUser.id, { password, email_confirm: true })`).

`src/lib/candidateService.ts:46` posts to that endpoint before signing in.

Consequence: anyone who types `victim@example.com` and any 6-character password
becomes that account. No email ownership proof, no current-password check, no
rate limit, no caller authentication. Because the account is auto-confirmed, the
normal Supabase verification email never gates anything.

### P0 — Candidate rows and files are world-readable and world-writable

Live RLS on the production project (`candidates`):

- `SELECT` qual: `auth_user_id = auth.uid() OR auth.uid() IS NULL OR candidate_id IS NOT NULL`
- `UPDATE` qual and check: `auth_user_id = auth.uid() OR candidate_id IS NOT NULL`

`candidate_id` is `NOT NULL` on every row and `auth.uid()` is `NULL` for anon, so
both conditions are true for everyone. With the public anon key (shipped in the
client bundle), any visitor can read every candidate's name, email, phone,
resume URL, photo URL, and can update any row.

Files are no better: bucket `candidate-assets` is `public=true` with
`SELECT`/`INSERT` allowed for `anon`, so resumes and live photos are permanently
public and writable by anyone holding the anon key.

### P0 — Scores are self-reported and self-certified

`recordAssessmentResult` (`candidateService.ts:209`) inserts whatever the browser
computed, with `total_score: 100` hardcoded, and updates the candidate row from
the browser. The `candidate_assessments` policies are `SELECT true` and
`INSERT true`. The two-attempt limit and the demo prerequisite live in
`localStorage` (`cl_demo_completed_<candidateId>`, `mainsAttemptsUsed` derived
from history), so both are removable from devtools.

The dashboard already says "Your highest verified score … is certified and
routed to hiring partners." No routing code, recruiter surface, email, or admin
review exists in the repository. That sentence is currently false.

### P1 — Identity proof is optional

Live photo capture runs `detectFaces` in the browser and the result is not
stored with the attempt. Nothing ties an attempt to a person: no liveness, no
ID-to-photo match (no match at all), no session fingerprint, no server-issued
attempt token. If a recruiter is asked to trust a score, this is the weakest link
after the RLS holes.

### P2 — Copy risks (not scams, but unsubstantiated claims)

- "450+ fast-hiring HR agencies" appears in hero, features, pricing, FAQ and the
  Mains lock screen. Unverifiable by a candidate and repeated as fact.
- `README.md` still advertises "**Guaranteed** 450+ Partner HR Agency Placement
  Platform" while the site FAQ correctly refuses that claim. Two different
  promises in one repo.
- "Complimentary direct referrals", "Priority Fast-Track Dispatch to Enterprise
  HR Recruiters", and "certified and routed" read as commitments. There is no
  partner list, referral log, or refund/cancellation policy in the app.
- No company identity, address, or grievance contact anywhere in the app; the
  only contact is a WhatsApp button. Indian consumer/ASCI practice expects
  substantiation and a reachable seller identity for paid claims.

## 3. Does the "mains test for placement companies" exist?

In name, yes: `activeTab === "mains_exam"` renders a locked/unlocked Mains view,
with demo prerequisite, 2-attempt limit, integrity flags, and history table.
`assessment_score` and `assessment_status` columns already exist on `candidates`,
and `candidate_assessments` already has `test_title`, `score`, `total_score`,
`status`, `integrity_flags`, `duration_seconds`, `completed_at`.

In substance, no:

| Claimed | Reality |
| --- | --- |
| Score is verified | Computed in the browser, inserted with the public key. |
| Two attempts only | Enforced in `localStorage` and React state. |
| Demo prerequisite | A `localStorage` flag. |
| Routed to 450+ partners | No code path, no partner system, no export. |
| Integrity flags | Client-supplied integers on a world-writable table. |

Adding a *new* section will not fix this. A second surface over the same tables
inherits every hole above, and recruiters cannot build a decision on data any
visitor can forge.

## 4. Minimum work before a score means anything

Ordered, because each step unblocks the next:

1. **Close the register endpoint.** Require an authenticated caller or a signed
   one-time token; never set a password for an existing email; verify email
   ownership before the account can hold a scored attempt.
2. **Replace the RLS policies.** `candidates`: own-row only, no anon path.
   `candidate_assessments`: own-row read, no client write. Revoke anon on
   `candidate-assets`; use signed URLs for resumes/photos.
3. **Move scoring server-side.** Server owns the question bank and computes the
   score from a submitted answer set; the client never sends `score`. Add a
   DB-enforced attempt counter and a server-issued attempt record.
4. **Bind an attempt to an identity.** Store the proctoring evidence (face
   count, flags, duration, device/session id) with the attempt row; make the
   "verified" badge depend on it.
5. **Decide the recruiter surface before writing UI.** Options differ in cost and
   risk (see §5).
6. **Fix the copy claims** and add seller identity, refund/cancellation terms,
   and a substantiation note for the partner count.

## 5. The real design fork for "considered by placement companies"

- **A. Shareable scorecard.** Candidate holds a signed, expiring link/PDF with
  verified score + integrity summary; the platform never exposes a database to
  recruiters. Cheapest, lowest privacy risk, weakest signal (candidate chooses
  whom to send it to).
- **B. Internal referral pipeline.** Admin-only dashboard where staff filter
  candidates by domain and verified score, then send a curated dossier to partner
  HR by email. Matches how the copy already describes operations ("our internal
  team reviews… and refers"). No partner login, so no new attack surface.
- **C. Partner portal.** Recruiter accounts, searchable candidate pool, per-tenant
  data isolation, audit trail, consent and deletion rules. Strongest product,
  most expensive, and the only option where RLS, retention, and consent must be
  designed up front.

Do not start with C. It is the option that turns every P0 above into a reportable
data breach instead of a bug.
