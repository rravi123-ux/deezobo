-- Admin deletion policies for catalog records.
-- Apply after 202610010001_catalog_admin.sql.
begin;

grant delete on public.products, public.gallery_items to authenticated;
create policy "Admins delete drinks" on public.products
  for delete to authenticated using ((select public.is_deezobo_admin()));
create policy "Admins delete gallery" on public.gallery_items
  for delete to authenticated using ((select public.is_deezobo_admin()));

commit;
