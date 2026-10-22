-- 20260923000000's "Admins can view all profiles" policy checks is_admin via
-- an EXISTS subquery on profiles itself. Postgres has to apply every SELECT
-- policy (including this one) to that inner scan too, which re-enters the
-- same EXISTS subquery forever — "infinite recursion detected in policy for
-- relation profiles". That broke every query against profiles for every
-- user, not just admins (login, /account, /admin — anything reading
-- profiles). A SECURITY DEFINER function breaks the cycle: it runs with the
-- function owner's privileges, so its internal lookup bypasses profiles'
-- RLS entirely instead of re-triggering it.
create or replace function public.is_admin_user(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = uid), false)
$$;

grant execute on function public.is_admin_user(uuid) to authenticated;

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin_user(auth.uid()));
