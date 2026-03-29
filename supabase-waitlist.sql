-- Run in Supabase → SQL Editor (safe to re-run)
--
-- RLS: PostgREST uses roles like `anon` / `authenticated`. Newer "publishable" keys must still
-- satisfy a policy. Using TO public for INSERT/SELECT keeps behavior predictable for any key type.

create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text,
  message text,
  source text default 'landing',
  created_at timestamptz default now()
);

alter table waitlist enable row level security;

drop policy if exists "Allow public inserts" on waitlist;
drop policy if exists "Allow anon and authenticated insert" on waitlist;
drop policy if exists "Allow insert for all api roles" on waitlist;
drop policy if exists "No public reads" on waitlist;
drop policy if exists "Deny select for anon" on waitlist;
drop policy if exists "Deny select for authenticated" on waitlist;
drop policy if exists "Deny select via api" on waitlist;
drop policy if exists "Allow update for public api roles" on waitlist;

-- INSERT: new signups
create policy "Allow insert for all api roles"
  on waitlist
  for insert
  to public
  with check (true);

-- UPDATE: required for PostgREST `.upsert(..., { onConflict: 'email' })` when the email exists
create policy "Allow update for public api roles"
  on waitlist
  for update
  to public
  using (true)
  with check (true);

-- SELECT: block reads from API roles (service_role in dashboard still bypasses RLS)
create policy "Deny select via api"
  on waitlist
  for select
  to public
  using (false);

grant usage on schema public to anon, authenticated;
grant insert, update on table waitlist to anon, authenticated;
