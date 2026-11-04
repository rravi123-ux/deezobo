-- Stripe-backed orders. All writes are server-side; customers and admins only read through RLS.
begin;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  customer_email text not null check (
    length(customer_email) between 3 and 320
    and position('@' in customer_email) > 1
  ),
  fulfillment_method text not null check (
    fulfillment_method in ('pickup', 'delivery', 'event')
  ),
  status text not null default 'pending_checkout' check (
    status in (
      'pending_checkout',
      'pending_payment',
      'paid',
      'payment_failed',
      'expired',
      'refunded'
    )
  ),
  currency text not null default 'usd' check (currency = 'usd'),
  item_subtotal_minor bigint not null check (item_subtotal_minor >= 0),
  amount_total_minor bigint check (amount_total_minor is null or amount_total_minor >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id) on delete restrict,
  option_id text not null,
  product_name text not null check (length(trim(product_name)) between 1 and 120),
  option_label text not null check (length(trim(option_label)) between 1 and 200),
  unit_price_minor integer not null check (unit_price_minor >= 0),
  quantity integer not null check (quantity between 1 and 999),
  line_total_minor bigint not null check (
    line_total_minor = unit_price_minor::bigint * quantity
  ),
  unique (order_id, product_id, option_id)
);

create index orders_auth_user_created_idx
  on public.orders (auth_user_id, created_at desc);
create index orders_status_created_idx
  on public.orders (status, created_at desc);
create index order_items_order_idx on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
revoke all on public.orders, public.order_items from anon, authenticated;
grant select on public.orders, public.order_items to authenticated;

create policy "Customers read their orders" on public.orders
  for select to authenticated using (
    auth_user_id = (select auth.uid()) or (select public.is_deezobo_admin())
  );
create policy "Customers read their order items" on public.order_items
  for select to authenticated using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and (
          orders.auth_user_id = (select auth.uid())
          or (select public.is_deezobo_admin())
        )
    )
  );

commit;
