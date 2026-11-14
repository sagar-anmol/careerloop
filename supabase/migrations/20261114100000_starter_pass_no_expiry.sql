-- The ₹999 Starter pass is no longer time-boxed: it behaves like the other
-- one-time packs (no expiry). Entitlement is any completed order, permanently.
--
-- The expires_at column stays in place (harmless, unused) so payment records
-- remain intact; this migration only retires the 7-day window.
update public.payment_plans
  set name = 'Starter Practice Pass'
  where plan = 'starter_practice';

-- Clear computed expiry on every existing order. Rows are payment records and
-- are kept; only the expiry is dropped so nothing reports a lapse.
update public.payment_orders
  set expires_at = null
  where expires_at is not null;
