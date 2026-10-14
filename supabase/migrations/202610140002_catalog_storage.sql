-- Public catalog media with admin-only writes.
-- Apply after 202610010001_catalog_admin.sql.
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog-media',
  'catalog-media',
  true,
  8388608,
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public reads catalog media" on storage.objects
  for select to public using (bucket_id = 'catalog-media');
create policy "Admins upload catalog media" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'catalog-media' and (select public.is_deezobo_admin())
  );
create policy "Admins update catalog media" on storage.objects
  for update to authenticated using (
    bucket_id = 'catalog-media' and (select public.is_deezobo_admin())
  ) with check (
    bucket_id = 'catalog-media' and (select public.is_deezobo_admin())
  );
create policy "Admins delete catalog media" on storage.objects
  for delete to authenticated using (
    bucket_id = 'catalog-media' and (select public.is_deezobo_admin())
  );

commit;
