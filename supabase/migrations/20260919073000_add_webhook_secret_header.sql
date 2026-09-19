-- The on_user_email_confirmed() trigger calls send-welcome-email directly via
-- net.http_post rather than through a dashboard-configured Database Webhook.
-- It never sent the x-webhook-secret header the function has required since
-- the security review, so every real welcome email has been silently 401'd.
-- This adds the header, matching the fresh WEBHOOK_SECRET set on the function.
create or replace function public.on_user_email_confirmed()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlob2R2ZWJwcnFhcXBoZG5mb2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTUwODcsImV4cCI6MjA5NzQ3MTA4N30.5FrLZLz6QIkF5WPkgC5b-mDzXbld5w-syd9kGaXB-c0';
  webhook_secret text := '746f3d6f3a0254bb02f9dc82d5e415d9f0c6bb27445b857b20aef92281de726e';
begin
  if new.email_confirmed_at is not null and old.email_confirmed_at is null then

    update public.profiles
    set email_verified = 'verified'::public.email_verification_status
    where id = new.id;

    perform net.http_post(
      url := 'https://ihodvebprqaqphdnfobn.supabase.co/functions/v1/send-welcome-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key,
        'x-webhook-secret', webhook_secret
      ),
      body := jsonb_build_object(
        'record', jsonb_build_object(
          'email', new.email,
          'email_confirmed_at', new.email_confirmed_at
        ),
        'old_record', jsonb_build_object(
          'email_confirmed_at', old.email_confirmed_at
        )
      )
    );

  end if;
  return new;
exception when others then
  raise log 'on_user_email_confirmed error: %', sqlerrm;
  return new;
end;
$function$;
