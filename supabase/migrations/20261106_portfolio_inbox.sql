create table public.portfolio_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('contact', 'hire')),
  name text not null check (char_length(name) between 1 and 160),
  email text not null check (char_length(email) between 3 and 320),
  subject text not null default '' check (char_length(subject) <= 200),
  message text not null check (char_length(message) between 1 and 5000),
  project_type text check (project_type is null or char_length(project_type) <= 120),
  phone text check (phone is null or char_length(phone) <= 40),
  whatsapp text check (whatsapp is null or char_length(whatsapp) <= 40),
  preferred_contact text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'read', 'archived'))
);

create index portfolio_inquiries_created_at_idx on public.portfolio_inquiries (created_at desc);
create index portfolio_inquiries_status_idx on public.portfolio_inquiries (status, created_at desc);

alter table public.portfolio_inquiries enable row level security;

revoke all on public.portfolio_inquiries from anon, authenticated;
grant select, update on public.portfolio_inquiries to authenticated;

create policy "Portfolio admins can read inquiries"
  on public.portfolio_inquiries for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'portfolio_admin');

create policy "Portfolio admins can update inquiry status"
  on public.portfolio_inquiries for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'portfolio_admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'portfolio_admin');
