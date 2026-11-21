insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
on conflict (id) do nothing;

create policy "Portfolio admins upload public images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-media'
    and lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Portfolio admins list uploaded images"
  on storage.objects for select to authenticated
  using (bucket_id = 'portfolio-media'
    and lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Portfolio admins remove uploaded images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-media'
    and lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
