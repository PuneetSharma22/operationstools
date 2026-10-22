-- Supabase's linter flagged two things across these policies:
--
-- 1. auth_rls_initplan: `auth.uid()` called directly (not `(select auth.uid())`)
--    gets re-evaluated by Postgres on every row instead of once per query.
--    Affects user_credits, credit_transactions, credit_requests (both its
--    policies), and the two admin policies added in this task
--    (profiles, save_requests).
-- 2. multiple_permissive_policies: profiles and save_requests each ended up
--    with two separate permissive SELECT policies (own-row + admin) after
--    20260923000000, which Postgres must evaluate both of per query instead
--    of one combined check.
--
-- Fixes both by consolidating each own-row/admin pair into a single policy,
-- built on is_admin_user() (already SELECT-wrapped internally) so none of
-- this re-introduces the self-referencing recursion from 20260923000100.

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Users can view own profile or admins view all" on public.profiles
  for select using (
    (select auth.uid()) = id or public.is_admin_user((select auth.uid()))
  );

drop policy if exists "Users can view own saves" on public.save_requests;
drop policy if exists "Admins can view all saves" on public.save_requests;
create policy "Users can view own saves or admins view all" on public.save_requests
  for select using (
    (select auth.uid()) = user_id or public.is_admin_user((select auth.uid()))
  );

drop policy if exists "View own or admin view all credits" on public.user_credits;
create policy "View own or admin view all credits" on public.user_credits
  for select using (
    (select auth.uid()) = user_id or public.is_admin_user((select auth.uid()))
  );

drop policy if exists "View own or admin view all transactions" on public.credit_transactions;
create policy "View own or admin view all transactions" on public.credit_transactions
  for select using (
    (select auth.uid()) = user_id or public.is_admin_user((select auth.uid()))
  );

drop policy if exists "View own or admin view all requests" on public.credit_requests;
create policy "View own or admin view all requests" on public.credit_requests
  for select using (
    (select auth.uid()) = user_id or public.is_admin_user((select auth.uid()))
  );

drop policy if exists "Admin can update credit_requests" on public.credit_requests;
create policy "Admin can update credit_requests" on public.credit_requests
  for update using (
    public.is_admin_user((select auth.uid()))
  ) with check (
    public.is_admin_user((select auth.uid()))
  );
