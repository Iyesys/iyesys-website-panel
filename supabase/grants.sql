-- Run this in the Supabase SQL Editor.
-- Needed because "Automatically expose new tables" was disabled at project
-- creation: RLS policies control which rows a role can see, but the role
-- still needs a baseline GRANT to query the table at all.

grant select, insert, update, delete on public.articles to authenticated;
grant select on public.articles to anon;
