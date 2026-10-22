-- The admin dashboard reads `profiles` and `save_requests` directly from the
-- client, but neither table's SELECT policy had an is_admin bypass (unlike
-- user_credits/credit_transactions/credit_requests, which got one in
-- 20260918100000_secure_credits_and_admin_rls.sql). So every admin-only read
-- was silently filtered down to just the admin's own row: Total Users showed
-- 1 instead of 13, Total PDF Saves showed 184 instead of 437, etc.
--
-- The inner `is_admin` lookup below only ever touches the caller's own row
-- (id = auth.uid()), which the existing "Users can read own profile" policy
-- already permits — so this doesn't recurse or depend on itself to resolve,
-- same as the admin policies already added for the credit tables.
create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "Admins can view all saves" on public.save_requests
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );
