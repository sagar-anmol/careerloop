-- PayU India payment gateway replaces the manual UPI + UTR flow entirely.
--
--  * `utr`, `utr_verified`, `upi_id` and their indexes go. Manual approvals are gone.
--  * `gateway`, `txnid`, `mihpayid`, `gateway_status`, `signup_payload`,
--    `account_created_at` describe the hosted-checkout lifecycle.
--  * `user_id` becomes nullable: a signup order exists BEFORE the account does
--    (payment is collected pre-registration; the account is created only after
--    PayU's callback verifies the hash).
--  * `expires_at` remains the source of trial expiry (starter = verified_at +
--    7 days). Records are never deleted.
--  * `signup_payload` holds the Step-0 dossier until the callback creates the
--    account; it is nulled out as soon as the account exists.

alter table public.payment_orders
  add column if not exists gateway text not null default 'payu',
  add column if not exists txnid text,
  add column if not exists mihpayid text,
  add column if not exists gateway_status text,
  add column if not exists gateway_error text,
  add column if not exists signup_payload jsonb,
  add column if not exists account_created_at timestamptz;

-- Legacy manual-UPI orders keep their rows but are flagged as such.
update public.payment_orders
   set gateway = 'legacy_upi'
 where utr is not null
    or upi_id is not null;

alter table public.payment_orders
  alter column user_id drop not null;

drop index if exists payment_orders_pending_verification_idx;
drop constraint if exists payment_orders_utr_key;

alter table public.payment_orders drop column if exists utr;
alter table public.payment_orders drop column if exists utr_verified;
alter table public.payment_orders drop column if exists upi_id;

create unique index if not exists payment_orders_txnid_key on public.payment_orders (txnid);
create index if not exists payment_orders_pending_payu_idx
  on public.payment_orders (status, created_at desc)
  where status = 'pending';
