-- Manual UPI payment flow: the candidate scans a UPI QR, pays from their own
-- UPI app, then submits the bank UTR. An admin later marks the order completed.
--
-- RLS is ON with zero policies (same posture as demo_completions), so only the
-- service role (server routes) can read or write orders. A browser can never
-- forge a paid order.
--
-- Amounts are NEVER taken from the client. The server derives `amount` from
-- the server-side plan table below before any order row is written.

create table if not exists public.payment_plans (
  plan          text primary key,
  name          text not null,
  amount_inr    integer not null check (amount_inr > 0),
  is_active     boolean not null default true
);

insert into public.payment_plans (plan, name, amount_inr, is_active) values
  ('starter_practice', 'Starter Practice Pass',             1999, true),
  ('pro_all_access',   'CareerLoop Pro All-Access Pass',    4999, true),
  ('mentorship_1on1',  '1-on-1 Intensive Mentorship Track', 8999, true)
on conflict (plan) do update
  set name        = excluded.name,
      amount_inr  = excluded.amount_inr,
      is_active   = excluded.is_active;

create table if not exists public.payment_orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  plan            text not null references public.payment_plans (plan),
  amount_inr      integer not null check (amount_inr > 0),
  upi_id          text not null,
  utr             text unique check (utr ~ '^[0-9]{12}$'),
  status          text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at      timestamptz not null default now(),
  verified_at     timestamptz
);

create index if not exists payment_orders_user_idx      on public.payment_orders (user_id);
create index if not exists payment_orders_status_idx    on public.payment_orders (status);
create index if not exists payment_orders_created_at_idx on public.payment_orders (created_at desc);

alter table public.payment_orders enable row level security;

-- Intentionally no policies: service-role access only.