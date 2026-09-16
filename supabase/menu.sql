-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Menu categories and sub-items (i.e. the "solutions"/services list), managed
-- from the panel, read publicly by the corporate site's nav dropdown and
-- /services grid.

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  short_label text not null,
  description text not null default '',
  -- One of a fixed set of preset color themes the site already uses
  -- (see THEME_PRESETS in the corporate site repo) - keeps new categories
  -- visually consistent without needing a full color picker in the panel.
  theme text not null default 'blue' check (theme in ('green', 'blue', 'red', 'purple', 'teal', 'orange')),
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories (id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text not null default '',
  image_url text,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_categories_status_sort_order_idx
  on public.menu_categories (status, sort_order);

create index if not exists menu_items_category_id_sort_order_idx
  on public.menu_items (category_id, sort_order);

alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;

drop policy if exists "Public can read published menu categories" on public.menu_categories;
create policy "Public can read published menu categories"
  on public.menu_categories
  for select
  to anon
  using (status = 'published');

drop policy if exists "Authenticated users have full access to menu categories" on public.menu_categories;
create policy "Authenticated users have full access to menu categories"
  on public.menu_categories
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Public can read published menu items" on public.menu_items;
create policy "Public can read published menu items"
  on public.menu_items
  for select
  to anon
  using (status = 'published');

drop policy if exists "Authenticated users have full access to menu items" on public.menu_items;
create policy "Authenticated users have full access to menu items"
  on public.menu_items
  for all
  to authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on public.menu_categories to authenticated;
grant select on public.menu_categories to anon;
grant select, insert, update, delete on public.menu_items to authenticated;
grant select on public.menu_items to anon;

drop trigger if exists menu_categories_set_updated_at on public.menu_categories;
create trigger menu_categories_set_updated_at
  before update on public.menu_categories
  for each row execute function public.set_updated_at();

drop trigger if exists menu_items_set_updated_at on public.menu_items;
create trigger menu_items_set_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

-- New permission flag, same pattern as can_manage_articles / can_manage_faqs.
alter table public.profiles
  add column if not exists can_manage_menu boolean not null default false;

update public.profiles
set can_manage_menu = true
where can_manage_users = true;
