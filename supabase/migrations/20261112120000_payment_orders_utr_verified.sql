-- Verification boolean for the manual UPI flow.
-- `utr` remains the bank reference (unique). `utr_verified` records whether the
-- admin has actually confirmed it against the bank statement. A UTR is submitted
-- (status stays 'pending') → team confirms → status='completed' AND
-- utr_verified=true. Failing an order resets utr_verified=false.

alter table public.payment_orders
  add column if not exists utr_verified boolean not null default false;

update public.payment_orders
   set utr_verified = true
 where status = 'completed'
   and utr is not null
   and not utr_verified;

-- Speeds up the per-user "awaiting verification" lookup used by the banner.
create index if not exists payment_orders_pending_verification_idx
  on public.payment_orders (user_id, created_at desc)
  where status = 'pending' and utr is not null;
