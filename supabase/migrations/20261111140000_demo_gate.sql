-- Track demo-set completion per account, server-side.
--
-- Why: the old gate was client-only. It lived in localStorage plus a
-- "any history row means demo done" heuristic, so /exam/<set> could be opened
-- directly and the dashboard buttons routed straight to the mains test anyway.
-- A real gate needs a fact the browser cannot forge, so completion is stored
-- here and only the service role can read or write it.

create table if not exists public.demo_completions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  completed_at timestamptz not null default now()
);

alter table public.demo_completions enable row level security;

-- RLS on with zero policies: anon and authenticated see nothing and can write
-- nothing. `revoke` is belt-and-braces in case a future grant is added.
revoke all on public.demo_completions from anon, authenticated;
