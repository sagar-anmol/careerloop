-- Signup email-verification OTPs. One row per email (upserted on every send).
-- The code itself is never stored — only a peppered SHA-256 hash. Service-role
-- only (RLS on, zero policies) like payment_orders.
create table if not exists public.email_otp_challenges (
  email               text primary key,
  otp_hash            text not null,
  sent_count          integer not null default 0,
  last_sent_at        timestamptz not null default now(),
  expires_at          timestamptz not null,
  attempts            integer not null default 0,
  verified_at         timestamptz,
  verified_expires_at timestamptz,
  consumed_at         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.email_otp_challenges enable row level security;
