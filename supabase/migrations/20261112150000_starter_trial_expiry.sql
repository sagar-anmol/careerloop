-- Starter plan becomes a 7-day trial: ₹999, renamed. Orders gain expires_at,
-- set by the admin when the UTR is verified (starter only). Records persist —
-- expiry is computed at read time (see /api/payment/my-status), never deleted.
alter table public.payment_orders
  add column if not exists expires_at timestamptz;

update public.payment_plans
  set name = 'Starter 7-Day Trial Pass', amount_inr = 999
  where plan = 'starter_practice';

-- Backfill safety: completed starter orders get 7 days from verification.
update public.payment_orders
  set expires_at = verified_at + interval '7 days'
  where plan = 'starter_practice'
    and status = 'completed'
    and verified_at is not null
    and expires_at is null;
