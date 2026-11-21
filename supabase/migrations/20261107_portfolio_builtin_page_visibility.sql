create table public.portfolio_page_visibility (
  path text primary key check (path ~ '^/[a-z0-9/-]+$' and path <> '/admin'),
  hidden boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.portfolio_page_visibility enable row level security;
revoke all on public.portfolio_page_visibility from anon, authenticated;
grant select on public.portfolio_page_visibility to anon, authenticated;
grant insert (path, hidden) on public.portfolio_page_visibility to authenticated;
grant update (hidden) on public.portfolio_page_visibility to authenticated;
create policy "Anyone can read page visibility" on public.portfolio_page_visibility for select to anon, authenticated using (true);
create policy "Approved admins add page visibility" on public.portfolio_page_visibility for insert to authenticated
  with check ((auth.jwt() ->> 'email') in ('ugodesktop@gmail.com','bluezotech@gmail.com'));
create policy "Approved admins update page visibility" on public.portfolio_page_visibility for update to authenticated
  using ((auth.jwt() ->> 'email') in ('ugodesktop@gmail.com','bluezotech@gmail.com'))
  with check ((auth.jwt() ->> 'email') in ('ugodesktop@gmail.com','bluezotech@gmail.com'));
