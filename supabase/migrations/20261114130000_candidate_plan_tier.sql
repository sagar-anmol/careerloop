-- The candidate's owned Plan has no column of its own. The tier was inferred
-- from the free-text `partner_route` label that fulfillment writes
-- ("CareerLoop Pro (₹4,999)") — and `recordAssessmentResult` overwrites that
-- same column with the partner-pipeline label, so a completed assessment could
-- silently erase the tier. Upgrade logic needs an authoritative field.
--
-- `plan` is written only by the service role (PayU callback at fulfillment);
-- it carries no entitlement of its own — the entitlement is the completed
-- `payment_orders` row, this column just records the current tier for the UI.

alter table public.candidates
  add column if not exists plan text
    check (plan is null or plan in ('starter_practice', 'pro_all_access', 'mentorship_1on1'));

comment on column public.candidates.plan is
  'Plan key owned by the candidate (starter_practice | pro_all_access | mentorship_1on1). NULL = no paid plan. Server-written on payment fulfillment; clients only read it.';

-- Backfill from the legacy label, most specific first.
update public.candidates
   set plan = case
     when partner_route ilike '%1-on-1%' or partner_route like '%8,999%' then 'mentorship_1on1'
     when partner_route ilike '%pro%'     or partner_route like '%4,999%' then 'pro_all_access'
     when partner_route ilike '%starter%' or partner_route like '%999%'    then 'starter_practice'
   end
 where plan is null
   and partner_route is not null;

-- The browser holds an UPDATE policy over its own row (recordAssessmentResult
-- writes score/status/partner_route), which would otherwise let a candidate
-- grant themselves a plan. `plan` stays service-role-only; clients read it.
revoke update (plan) on public.candidates from anon, authenticated;