-- Payment attempts are private. Only the server can create or settle them.
create table public.portfolio_payment_orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique check (reference ~ '^ugo_[a-z0-9_]{20,80}$'),
  access_hash text not null check (access_hash ~ '^[0-9a-f]{64}$'),
  kind text not null check (kind in ('support', 'source', 'ebook')),
  product_id uuid references public.portfolio_products(id) on delete restrict,
  item_title text not null check (length(item_title) between 1 and 180),
  buyer_email text not null check (length(buyer_email) between 3 and 320),
  buyer_name text not null default '' check (length(buyer_name) <= 160),
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency in ('NGN', 'USD')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  check ((kind = 'support' and product_id is null) or (kind in ('source', 'ebook') and product_id is not null))
);
create index portfolio_payment_orders_created_at_idx on public.portfolio_payment_orders (created_at desc);
alter table public.portfolio_payment_orders enable row level security;
revoke all on public.portfolio_payment_orders from anon, authenticated;
grant select on public.portfolio_payment_orders to authenticated;
create policy "Approved admins read payment orders" on public.portfolio_payment_orders
  for select to authenticated
  using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
