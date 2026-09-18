-- Fixes two issues found in a security review:
--
-- 1. user_credits.balance was directly UPDATE-able by its own owner with no
--    with_check bounding the new value, so any authenticated user could set
--    their own balance to anything ("supabase.from('user_credits').update({
--    balance: 999999 })..."). All balance mutation now happens through
--    SECURITY DEFINER functions that recompute the balance server-side,
--    and the direct table-level write policies are removed.
--
-- 2. Every admin-only policy checked a hardcoded personal email address
--    instead of the profiles.is_admin flag added in the previous migration.
--    That flag was otherwise fully inert (no policy referenced it) and the
--    email was the *only* real admin credential in the system, baked
--    permanently into RLS. Every policy below now checks is_admin instead,
--    and self-elevation of is_admin is blocked via column-level REVOKE.

-- ── 1. Stop is_admin from being self-electable ────────────────────────────
-- profiles' UPDATE policy is scoped to "own row" with no column restriction,
-- so without this, a user could set their own is_admin = true directly.
-- Note: a column-level REVOKE alone does NOT work here — Postgres column
-- privileges are additive on top of table-wide grants, so a table-wide
-- UPDATE grant still permits writing a column-level-revoked column. The
-- app never calls .update() on profiles from the client today, so the
-- correct fix is to revoke UPDATE table-wide; re-grant it scoped to
-- specific columns (via `grant update (col1, col2) on ... to authenticated`)
-- if self-service profile editing is added later.
revoke update on public.profiles from authenticated, anon;

-- ── 2. Credit-spend RPC (replaces direct client UPDATE of user_credits) ───
create or replace function public.spend_credits(p_count integer, p_template text default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_new_balance integer;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  if p_count is null or p_count <= 0 then
    raise exception 'Invalid credit count';
  end if;

  update public.user_credits
    set balance = balance - p_count, updated_at = now()
    where user_id = v_uid and balance >= p_count
    returning balance into v_new_balance;

  if v_new_balance is null then
    raise exception 'Insufficient credits';
  end if;

  insert into public.credit_transactions (user_id, type, amount, description)
    values (v_uid, 'bulk_generation', -p_count, coalesce('Bulk generation — ' || p_template, 'Bulk generation'));

  return v_new_balance;
end;
$$;

grant execute on function public.spend_credits(integer, text) to authenticated;

-- ── 3. Admin credit-grant RPC (replaces direct client writes from AdminPage) ─
-- Handles both the manual-grant flow and credit-request approval (optionally
-- marking the request approved in the same transaction, closing the
-- "approved but credits never landed" gap noted in AdminPage.jsx).
create or replace function public.admin_grant_credits(
  p_user_id uuid,
  p_amount integer,
  p_description text default null,
  p_type text default 'manual_grant',
  p_request_id bigint default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_balance integer;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin) then
    raise exception 'Not authorized';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'Invalid amount';
  end if;

  insert into public.user_credits (user_id, balance, updated_at)
    values (p_user_id, p_amount, now())
    on conflict (user_id) do update
      set balance = public.user_credits.balance + excluded.balance, updated_at = now()
    returning balance into v_new_balance;

  insert into public.credit_transactions (user_id, type, amount, description)
    values (p_user_id, p_type, p_amount, p_description);

  if p_request_id is not null then
    update public.credit_requests
      set status = 'approved', resolved_at = now(), resolved_by = auth.uid()
      where id = p_request_id;
  end if;

  return v_new_balance;
end;
$$;

grant execute on function public.admin_grant_credits(uuid, integer, text, text, bigint) to authenticated;

-- ── 4. Remove direct client write access to the credit tables ─────────────
-- All balance-affecting writes now go through the two functions above.
drop policy if exists "Update own or admin update credits" on public.user_credits;
drop policy if exists "Insert own or admin insert credits" on public.user_credits;
drop policy if exists "Admin can delete credits" on public.user_credits;

drop policy if exists "Insert own or admin insert transactions" on public.credit_transactions;
drop policy if exists "Admin can update transactions" on public.credit_transactions;
drop policy if exists "Admin can delete transactions" on public.credit_transactions;

-- ── 5. Re-create the remaining (read + admin-status-update) policies to
--       check profiles.is_admin instead of a hardcoded email ──────────────
drop policy if exists "View own or admin view all credits" on public.user_credits;
create policy "View own or admin view all credits" on public.user_credits
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

drop policy if exists "View own or admin view all transactions" on public.credit_transactions;
create policy "View own or admin view all transactions" on public.credit_transactions
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

drop policy if exists "View own or admin view all requests" on public.credit_requests;
create policy "View own or admin view all requests" on public.credit_requests
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

drop policy if exists "Admin can update credit_requests" on public.credit_requests;
create policy "Admin can update credit_requests" on public.credit_requests
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  ) with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );
