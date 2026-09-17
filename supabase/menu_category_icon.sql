-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Adds an icon to each category, chosen from the panel via a searchable
-- picker over lucide-react's full icon set (stored as its kebab-case name,
-- e.g. "shield-check"). The site renders it with lucide-react's DynamicIcon,
-- so no code change is needed when a new icon name is picked.

alter table public.menu_categories
  add column if not exists icon text not null default 'shapes';
