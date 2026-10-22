-- Supabase's security linter flagged several SECURITY DEFINER functions as
-- directly callable via PostgREST (/rest/v1/rpc/<name>). Two groups here:
--
-- 1. on_credit_request_created (this task) and rls_auto_enable (pre-existing
--    project infrastructure, unrelated to this task but caught by the same
--    scan): both are trigger/event-trigger functions invoked only by
--    Postgres's trigger machinery, which doesn't check EXECUTE privilege —
--    so they never needed to be callable directly and can have EXECUTE
--    fully revoked with no behavior change. (Contrast with
--    on_user_email_confirmed, the pre-existing equivalent for welcome
--    emails, which already has no anon/authenticated grant — this just
--    brings the new function in line with that existing convention, which
--    I missed when first adding it.)
--
-- 2. is_admin_user needs EXECUTE for `authenticated` so RLS policies can
--    actually evaluate it when a logged-in user queries a protected table —
--    but being in the public schema, any logged-in user could also call it
--    directly as /rest/v1/rpc/is_admin_user with an arbitrary user id and
--    learn whether that user is an admin. Moving it to a schema PostgREST
--    doesn't expose (this project only exposes `public`) keeps it fully
--    usable inside RLS — schema exposure only controls whether PostgREST
--    generates a REST route, not whether Postgres itself can call the
--    function — while making it unreachable as a direct endpoint.

revoke execute on function public.on_credit_request_created() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create function private.is_admin_user(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = uid), false)
$$;

revoke execute on function private.is_admin_user(uuid) from public, anon;
grant execute on function private.is_admin_user(uuid) to authenticated;

-- Repoint every policy added in this task from public.is_admin_user to
-- private.is_admin_user before dropping the old one.
drop policy "Users can view own profile or admins view all" on public.profiles;
create policy "Users can view own profile or admins view all" on public.profiles
  for select using (
    (select auth.uid()) = id or private.is_admin_user((select auth.uid()))
  );

drop policy "Users can view own saves or admins view all" on public.save_requests;
create policy "Users can view own saves or admins view all" on public.save_requests
  for select using (
    (select auth.uid()) = user_id or private.is_admin_user((select auth.uid()))
  );

drop policy "View own or admin view all credits" on public.user_credits;
create policy "View own or admin view all credits" on public.user_credits
  for select using (
    (select auth.uid()) = user_id or private.is_admin_user((select auth.uid()))
  );

drop policy "View own or admin view all transactions" on public.credit_transactions;
create policy "View own or admin view all transactions" on public.credit_transactions
  for select using (
    (select auth.uid()) = user_id or private.is_admin_user((select auth.uid()))
  );

drop policy "View own or admin view all requests" on public.credit_requests;
create policy "View own or admin view all requests" on public.credit_requests
  for select using (
    (select auth.uid()) = user_id or private.is_admin_user((select auth.uid()))
  );

drop policy "Admin can update credit_requests" on public.credit_requests;
create policy "Admin can update credit_requests" on public.credit_requests
  for update using (
    private.is_admin_user((select auth.uid()))
  ) with check (
    private.is_admin_user((select auth.uid()))
  );

drop function public.is_admin_user(uuid);

-- admin_grant_credits and spend_credits are also flagged as "executable by
-- authenticated", but intentionally so — both are meant to be called
-- directly by logged-in users and already self-authorize internally
-- (admin_grant_credits checks is_admin and raises if not; spend_credits
-- scopes every write to auth.uid(), so a caller can only ever spend their
-- own balance). Left unchanged.
