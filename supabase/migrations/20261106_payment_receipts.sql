-- Receipt summaries only. Card and bank details remain with the payment provider.
-- A future verified webhook writes these rows with a server-side credential.
create table public.portfolio_receipts (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (length(provider) between 1 and 40),
  provider_reference text not null check (length(provider_reference) between 1 and 160),
  item_title text not null default '',
  buyer_email text not null,
  amount_minor bigint not null check (amount_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null check (status in ('paid', 'refunded')),
  verified_at timestamptz not null,
  receipt_url text not null default '',
  unique (provider, provider_reference)
);
create index portfolio_receipts_verified_at_idx on public.portfolio_receipts (verified_at desc);
alter table public.portfolio_receipts enable row level security;
revoke all on public.portfolio_receipts from anon, authenticated;
grant select on public.portfolio_receipts to authenticated;
create policy "Approved admins read verified receipts"
  on public.portfolio_receipts for select to authenticated
  using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
