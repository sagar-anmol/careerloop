-- payment_plans was the only public table with RLS disabled, and the anon key
-- (shipped in the browser bundle) could both read AND PATCH it:
--
--   PATCH /rest/v1/payment_plans?plan=eq.starter_practice  -> 200
--
-- That let anyone rewrite the price of a plan, because `resolvePlan()` treats
-- the DB row as authoritative and only falls back to PLAN_CATALOG when the row
-- is missing. A single unauthenticated request could set amount_inr to 1.
--
-- The app only ever reads this table through the service-role client
-- (src/lib/payments/orders.ts -> getSupabaseAdmin), which bypasses RLS, so
-- enabling RLS with zero policies keeps the server working and makes the table
-- deny-all for anon/authenticated. This is intentional, not an oversight:
-- plan prices are server-owned data with no legitimate client-side consumer.

alter table public.payment_plans enable row level security;

comment on table public.payment_plans is
  'Server-owned price list. RLS is enabled with no policies on purpose: read it only through the service-role client (resolvePlan/listActivePlans).';
