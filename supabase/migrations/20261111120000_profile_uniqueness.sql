-- Enforce one candidate profile per auth account and per email, and scope
-- profile access to its owner.
--
-- Why: the previous policies were effectively `true` for everyone —
--   * SELECT `... OR candidate_id IS NOT NULL` (candidate_id is NOT NULL, so
--     always true) → any visitor could read every profile;
--   * INSERT `with check (true)` → unlimited rows, including duplicate emails;
--   * UPDATE `... OR candidate_id IS NOT NULL` → any visitor could edit any row.
-- Combined with `fetchCandidateProfile` falling back to "newest row in the
-- table", the dashboard could show another account's profile and email.

-- 1. Hard uniqueness. Profiles have no natural unique key other than these.
create unique index if not exists candidates_email_lower_key
  on public.candidates (lower(email));

create unique index if not exists candidates_auth_user_id_key
  on public.candidates (auth_user_id);

-- 2. Owner-scoped policies (anon gets no policy at all).
drop policy if exists "Allow public candidate creation" on public.candidates;
drop policy if exists "Allow read own candidate profile" on public.candidates;
drop policy if exists "Allow update own candidate profile" on public.candidates;

create policy "Candidates insert own profile"
  on public.candidates
  for insert
  to authenticated
  with check (auth.uid() is not null and auth_user_id = (select auth.uid()));

create policy "Candidates read own profile"
  on public.candidates
  for select
  to authenticated
  using (auth.uid() is not null and auth_user_id = (select auth.uid()));

create policy "Candidates update own profile"
  on public.candidates
  for update
  to authenticated
  using (auth.uid() is not null and auth_user_id = (select auth.uid()))
  with check (auth.uid() is not null and auth_user_id = (select auth.uid()));

-- 3. Deliberately no DELETE policy: only the service role removes profiles.
