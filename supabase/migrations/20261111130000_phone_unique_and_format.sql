-- Mobile numbers: exactly 10 digits and never shared by two accounts.
--
-- Email uniqueness already exists (candidates_email_lower_key). This adds the
-- same guarantee for phone, at the database level so the browser cannot skip
-- it. NULL stays allowed (profile rows created before a phone is known), and
-- an empty string is rejected by the digit check.

create unique index if not exists candidates_phone_key
  on public.candidates (phone)
  where phone is not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'candidates_phone_10_digits'
  ) then
    alter table public.candidates
      add constraint candidates_phone_10_digits
      check (phone is null or phone ~ '^[0-9]{10}$');
  end if;
end $$;
