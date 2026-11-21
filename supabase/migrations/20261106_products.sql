create table public.portfolio_products (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('source', 'ebook')),
  title text not null check (length(title) between 1 and 180),
  description text not null default '' check (length(description) <= 2500),
  price_minor bigint not null default 0 check (price_minor >= 0),
  currency text not null default 'NGN' check (currency ~ '^[A-Z]{3}$'),
  cover_url text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index portfolio_products_catalog_idx on public.portfolio_products (kind, created_at desc) where published;
alter table public.portfolio_products enable row level security;
revoke all on public.portfolio_products from anon, authenticated;
grant select on public.portfolio_products to anon, authenticated;
grant insert (kind,title,description,price_minor,currency,cover_url,published) on public.portfolio_products to authenticated;
grant update (kind,title,description,price_minor,currency,cover_url,published) on public.portfolio_products to authenticated;
create policy "Visitors see published products" on public.portfolio_products
  for select to anon using (published);
create policy "Admins see all products" on public.portfolio_products
  for select to authenticated using (published or lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Admins add products" on public.portfolio_products
  for insert to authenticated with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Admins update products" on public.portfolio_products
  for update to authenticated using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'))
  with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create trigger portfolio_products_updated_at before update on public.portfolio_products
  for each row execute function public.set_portfolio_edit_updated_at();

create table public.portfolio_product_files (
  product_id uuid primary key references public.portfolio_products(id) on delete cascade,
  object_path text not null unique,
  original_name text not null,
  file_size bigint not null check (file_size >= 0),
  mime_type text not null,
  uploaded_at timestamptz not null default now()
);
alter table public.portfolio_product_files enable row level security;
revoke all on public.portfolio_product_files from anon, authenticated;
grant select on public.portfolio_product_files to authenticated;
grant insert (product_id,object_path,original_name,file_size,mime_type) on public.portfolio_product_files to authenticated;
grant update (object_path,original_name,file_size,mime_type) on public.portfolio_product_files to authenticated;
create policy "Admins see private product file records" on public.portfolio_product_files
  for select to authenticated using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Admins add private product file records" on public.portfolio_product_files
  for insert to authenticated with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Admins update private product file records" on public.portfolio_product_files
  for update to authenticated using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'))
  with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-products', 'portfolio-products', false, 52428800,
  array['application/pdf','application/epub+zip','application/zip','application/x-zip-compressed'])
on conflict (id) do nothing;
create policy "Admins upload private product files" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-products' and lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Admins read private product files" on storage.objects for select to authenticated
  using (bucket_id = 'portfolio-products' and lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Admins remove private product files" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-products' and lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
