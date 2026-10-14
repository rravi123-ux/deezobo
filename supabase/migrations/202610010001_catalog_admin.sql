-- Catalog-only migration for a new Dee Zobo Supabase project.
-- Review existing tables first. Does not modify Auth providers or create admins.
begin;

create table public.user_roles (
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin')),
  active boolean not null default true,
  primary key (auth_user_id, role)
);
alter table public.user_roles enable row level security;
revoke all on public.user_roles from anon, authenticated;
-- No browser policy to assign, view, or change roles.

create function public.is_deezobo_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where auth_user_id = (select auth.uid())
      and active = true and role in ('owner', 'admin')
  );
$$;
revoke all on function public.is_deezobo_admin() from public;
grant execute on function public.is_deezobo_admin() to anon, authenticated;

create function public.valid_deezobo_options(value jsonb)
returns boolean language plpgsql immutable set search_path = ''
as $$
declare
  item jsonb;
  ids text[] := '{}';
begin
  if jsonb_typeof(value) <> 'array' or jsonb_array_length(value) > 20 then return false; end if;
  for item in select * from jsonb_array_elements(value) loop
    if jsonb_typeof(item) <> 'object'
      or jsonb_typeof(item->'id') is distinct from 'string'
      or jsonb_typeof(item->'label') is distinct from 'string'
      or jsonb_typeof(item->'priceMinor') is distinct from 'number'
      or length(trim(item->>'id')) = 0 or length(trim(item->>'label')) = 0
      or (item->>'priceMinor')::numeric < 0
      or (item->>'priceMinor')::numeric > 100000000
      or (item->>'priceMinor')::numeric <> trunc((item->>'priceMinor')::numeric)
      or (item->>'id') = any(ids) then return false;
    end if;
    ids := array_append(ids, item->>'id');
  end loop;
  return true;
exception when others then return false;
end;
$$;

create table public.products (
  id text primary key default gen_random_uuid()::text,
  name text not null check (length(trim(name)) between 1 and 120),
  category text not null check (category in ('infusions', 'mocktails')),
  description text not null check (length(trim(description)) between 1 and 2000),
  flavor_notes text[] not null default '{}',
  image_url text not null check (image_url ~ '^(https://|/images/)'),
  image_alt text not null check (length(trim(image_alt)) between 1 and 300),
  options jsonb not null default '[]' check (public.valid_deezobo_options(options)),
  featured boolean not null default false,
  active boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert, update on public.products to authenticated;
create policy "Published drinks are public" on public.products
  for select to anon, authenticated using (active or (select public.is_deezobo_admin()));
create policy "Admins insert drinks" on public.products
  for insert to authenticated with check ((select public.is_deezobo_admin()));
create policy "Admins update drinks" on public.products
  for update to authenticated using ((select public.is_deezobo_admin()))
  with check ((select public.is_deezobo_admin()));

create table public.gallery_items (
  id text primary key default gen_random_uuid()::text,
  image_url text not null check (image_url ~ '^(https://|/images/)'),
  caption text not null check (length(trim(caption)) between 1 and 300),
  category text not null check (category in ('infusions', 'mocktails', 'moments')),
  display_order integer not null default 0 check (display_order >= 0),
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.gallery_items enable row level security;
revoke all on public.gallery_items from anon, authenticated;
grant select on public.gallery_items to anon, authenticated;
grant insert, update on public.gallery_items to authenticated;
create policy "Published gallery is public" on public.gallery_items
  for select to anon, authenticated using (published or (select public.is_deezobo_admin()));
create policy "Admins insert gallery" on public.gallery_items
  for insert to authenticated with check ((select public.is_deezobo_admin()));
create policy "Admins update gallery" on public.gallery_items
  for update to authenticated using ((select public.is_deezobo_admin()))
  with check ((select public.is_deezobo_admin()));

commit;
