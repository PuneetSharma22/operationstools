-- Postgres grants EXECUTE to PUBLIC by default when a function is created.
-- spend_credits() and admin_grant_credits() were only ever explicitly granted
-- to `authenticated`, so that default PUBLIC grant (which anon inherits) was
-- never revoked — the Supabase linter flagged both as callable by anon.
-- Both functions already enforce their own authorization internally
-- (spend_credits requires auth.uid(), admin_grant_credits requires is_admin),
-- so this closes the grant-level gap rather than a live vulnerability.
revoke execute on function public.spend_credits(integer, text) from public;
grant execute on function public.spend_credits(integer, text) to authenticated;

revoke execute on function public.admin_grant_credits(uuid, integer, text, text, bigint) from public;
grant execute on function public.admin_grant_credits(uuid, integer, text, text, bigint) to authenticated;
