-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  cover_image_url text,
  content_html text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_published_at_idx
  on public.articles (status, published_at desc);

alter table public.articles enable row level security;

-- Public (anonymous) visitors: read-only, published posts only.
create policy "Public can read published articles"
  on public.articles
  for select
  to anon
  using (status = 'published');

-- Logged-in admins: full access to everything, drafts included.
create policy "Authenticated users have full access"
  on public.articles
  for all
  to authenticated
  using (true)
  with check (true);

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger articles_set_updated_at
  before update on public.articles
  for each row
  execute function public.set_updated_at();
