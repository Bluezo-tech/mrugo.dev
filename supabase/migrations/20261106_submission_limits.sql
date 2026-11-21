create table public.portfolio_submission_attempts (
  id bigint generated always as identity primary key,
  visitor_hash text not null,
  created_at timestamptz not null default now()
);

create index portfolio_submission_attempts_lookup_idx
  on public.portfolio_submission_attempts (visitor_hash, created_at desc);

alter table public.portfolio_submission_attempts enable row level security;
revoke all on public.portfolio_submission_attempts from anon, authenticated;
