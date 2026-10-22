-- Two gaps in the credit-request flow: (1) nothing tells an admin a request
-- came in, so it just sits in the dashboard until someone happens to check;
-- (2) nothing tells the requester once it's approved. Both go through
-- net.http_post to a gated Edge Function, the same pattern already used by
-- on_user_email_confirmed() for welcome emails.

-- ── 1. Notify every admin the instant a credit request is inserted ────────
create or replace function public.on_credit_request_created()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlob2R2ZWJwcnFhcXBoZG5mb2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTUwODcsImV4cCI6MjA5NzQ3MTA4N30.5FrLZLz6QIkF5WPkgC5b-mDzXbld5w-syd9kGaXB-c0';
  webhook_secret text := '746f3d6f3a0254bb02f9dc82d5e415d9f0c6bb27445b857b20aef92281de726e';
begin
  perform net.http_post(
    url := 'https://ihodvebprqaqphdnfobn.supabase.co/functions/v1/notify-credit-request',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key,
      'x-webhook-secret', webhook_secret
    ),
    body := jsonb_build_object(
      'record', jsonb_build_object(
        'id', new.id,
        'user_id', new.user_id,
        'amount', new.amount,
        'requested_at', new.requested_at
      )
    )
  );
  return new;
exception when others then
  raise log 'on_credit_request_created error: %', sqlerrm;
  return new;
end;
$function$;

drop trigger if exists on_credit_request_created on public.credit_requests;
create trigger on_credit_request_created
  after insert on public.credit_requests
  for each row execute function public.on_credit_request_created();

-- ── 2. Confirm to the requester once admin_grant_credits approves their
--       request. Only fires on the request-approval path (p_request_id set),
--       not on plain manual grants from the admin dashboard, which have no
--       request to confirm. ─────────────────────────────────────────────
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
  v_user_email text;
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlob2R2ZWJwcnFhcXBoZG5mb2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTUwODcsImV4cCI6MjA5NzQ3MTA4N30.5FrLZLz6QIkF5WPkgC5b-mDzXbld5w-syd9kGaXB-c0';
  webhook_secret text := '746f3d6f3a0254bb02f9dc82d5e415d9f0c6bb27445b857b20aef92281de726e';
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

    select email into v_user_email from public.profiles where id = p_user_id;

    -- Isolated in its own block: a notification failure (Resend down, etc.)
    -- must not roll back credits that have already been granted.
    if v_user_email is not null then
      begin
        perform net.http_post(
          url := 'https://ihodvebprqaqphdnfobn.supabase.co/functions/v1/send-credit-approved',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || anon_key,
            'x-webhook-secret', webhook_secret
          ),
          body := jsonb_build_object(
            'record', jsonb_build_object(
              'email', v_user_email,
              'amount', p_amount,
              'new_balance', v_new_balance
            )
          )
        );
      exception when others then
        raise log 'admin_grant_credits approval-email error: %', sqlerrm;
      end;
    end if;
  end if;

  return v_new_balance;
end;
$$;

grant execute on function public.admin_grant_credits(uuid, integer, text, text, bigint) to authenticated;
