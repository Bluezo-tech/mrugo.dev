create table public.portfolio_payment_attempts (
  id uuid primary key default gen_random_uuid(),
  visitor_hash text not null check (visitor_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);
create index portfolio_payment_attempts_lookup_idx on public.portfolio_payment_attempts (visitor_hash, created_at desc);
alter table public.portfolio_payment_attempts enable row level security;
revoke all on public.portfolio_payment_attempts from anon, authenticated;
