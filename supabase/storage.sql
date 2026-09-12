-- Run this in the Supabase SQL Editor after schema.sql.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images',
  'article-images',
  true,
  5242880, -- 5MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Public bucket downloads bypass RLS by design, but these policies still
-- govern who can write/delete objects in it.

create policy "Anyone can view article images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'article-images');

create policy "Authenticated users can upload article images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'article-images');

create policy "Authenticated users can update article images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'article-images');

create policy "Authenticated users can delete article images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'article-images');
