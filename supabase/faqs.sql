-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- FAQ entries, managed from the panel, read publicly by the corporate site.

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null default '',
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists faqs_status_sort_order_idx
  on public.faqs (status, sort_order);

alter table public.faqs enable row level security;

drop policy if exists "Public can read published faqs" on public.faqs;
create policy "Public can read published faqs"
  on public.faqs
  for select
  to anon
  using (status = 'published');

drop policy if exists "Authenticated users have full access to faqs" on public.faqs;
create policy "Authenticated users have full access to faqs"
  on public.faqs
  for all
  to authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on public.faqs to authenticated;
grant select on public.faqs to anon;

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

-- New permission flag, same pattern as the existing can_manage_articles etc.
-- (see supabase/profiles.sql). Existing users keep whatever they already
-- have; this just adds the column with a safe default.
alter table public.profiles
  add column if not exists can_manage_faqs boolean not null default false;

-- Match the profiles.sql backfill: users who predate this feature (i.e.
-- already have full article/user permissions) get this one too.
update public.profiles
set can_manage_faqs = true
where can_manage_users = true;
