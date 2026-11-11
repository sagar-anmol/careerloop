-- Exam engine: server-owned attempts and responses for the Mains test.
--
-- Trust model:
--   * The browser never talks to these tables. It only calls /api/exam/*.
--   * All API routes use the service-role key and derive identity from a
--     verified Supabase access token (`auth.getUser(token)`).
--   * RLS is enabled with zero policies, and anon/authenticated grants are
--     revoked, so the public anon key cannot read or write anything here even
--     if a request is forged.
--
-- Question banks are NOT stored in Postgres. They are version-controlled JSON
-- under content/exams/ and loaded only by server code, so answer keys never
-- reach the browser bundle.

create table if not exists public.exam_attempts (
  id                  uuid primary key default gen_random_uuid(),
  auth_user_id        uuid not null references auth.users (id) on delete cascade,
  candidate_id        text,
  set_id              text not null,
  exam_type           text not null,
  attempt_token_hash  text not null,
  status              text not null default 'in_progress'
                        check (status in ('in_progress', 'submitted', 'expired')),
  started_at          timestamptz not null default now(),
  expires_at          timestamptz not null,
  submitted_at        timestamptz,
  duration_seconds    integer not null check (duration_seconds > 0),
  question_count      integer not null check (question_count > 0),
  max_marks           numeric(8, 2) not null check (max_marks > 0),
  score               numeric(8, 2),
  correct_count       integer,
  wrong_count         integer,
  unattempted_count   integer,
  section_scores      jsonb,
  integrity_flags     jsonb not null default '[]'::jsonb,
  client_meta         jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- One live attempt per candidate per set. A second `start` resumes this row
-- instead of opening a parallel attempt (also closes the double-tab race).
create unique index if not exists exam_attempts_one_open_per_set
  on public.exam_attempts (auth_user_id, set_id)
  where status = 'in_progress';

create index if not exists exam_attempts_user_recent_idx
  on public.exam_attempts (auth_user_id, started_at desc);

create table if not exists public.exam_responses (
  attempt_id         uuid not null references public.exam_attempts (id) on delete cascade,
  question_id        text not null,
  selected_index     integer check (selected_index is null or selected_index between 0 and 3),
  marked_for_review  boolean not null default false,
  visited            boolean not null default false,
  time_spent_ms      integer not null default 0 check (time_spent_ms >= 0),
  updated_at         timestamptz not null default now(),
  primary key (attempt_id, question_id)
);

alter table public.exam_attempts enable row level security;
alter table public.exam_responses enable row level security;

-- No policies exist on purpose: default-deny for every non-service role.
revoke all on public.exam_attempts from anon, authenticated;
revoke all on public.exam_responses from anon, authenticated;

create or replace function public.exam_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists exam_attempts_touch_updated_at on public.exam_attempts;
create trigger exam_attempts_touch_updated_at
  before update on public.exam_attempts
  for each row
  execute function public.exam_touch_updated_at();

drop trigger if exists exam_responses_touch_updated_at on public.exam_responses;
create trigger exam_responses_touch_updated_at
  before update on public.exam_responses
  for each row
  execute function public.exam_touch_updated_at();
