-- Adds a server-side admin flag so the app never has to ship a real email
-- address in the client bundle to gate the admin dashboard.
alter table public.profiles
  add column if not exists is_admin boolean not null default false;
