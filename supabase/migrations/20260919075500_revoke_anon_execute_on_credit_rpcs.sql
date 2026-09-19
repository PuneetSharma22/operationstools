-- The previous migration revoked EXECUTE from PUBLIC, but anon still had
-- rights — it must have been granted directly to anon (not just inherited
-- via PUBLIC) in an earlier migration. Revoke it explicitly.
revoke execute on function public.spend_credits(integer, text) from anon;
revoke execute on function public.admin_grant_credits(uuid, integer, text, text, bigint) from anon;
