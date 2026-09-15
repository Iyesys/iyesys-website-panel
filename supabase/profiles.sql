-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Per-user permission flags for the admin panel. Checked by Server Actions
-- before every sensitive operation (article publish/delete, user management);
-- RLS below is a second layer, not the only layer.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  can_manage_articles boolean not null default true,
  can_publish_articles boolean not null default true,
  can_delete_articles boolean not null default false,
  can_manage_users boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Any logged-in user can see who else has access and what they can do
-- (needed to render the Users page). Only the service role (used from
-- Server Actions, never exposed to the browser) can write to this table,
-- so there are no insert/update/delete policies for `authenticated`.
drop policy if exists "Authenticated users can read all profiles" on public.profiles;
create policy "Authenticated users can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

grant select on public.profiles to authenticated;

-- "Automatically expose new tables" is disabled on this project, so even
-- the service role (used by the admin client for invites/permission
-- changes) needs an explicit grant - it does NOT get one for free.
grant select, insert, update, delete on public.profiles to service_role;

-- Auto-create a profile row for every new auth user (e.g. right after an
-- admin invite). Defaults to the least-privileged set; the invite flow
-- immediately overwrites these with whatever the inviting admin chose.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: give every user that already exists (pre-dating this feature)
-- full permissions, since they were already trusted with unrestricted
-- access before permissions existed.
insert into public.profiles (id, can_manage_articles, can_publish_articles, can_delete_articles, can_manage_users)
select id, true, true, true, true
from auth.users
on conflict (id) do nothing;
