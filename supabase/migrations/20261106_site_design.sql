create table public.portfolio_site_settings (
  id text primary key check (id = 'main'),
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.portfolio_site_settings (id, settings) values ('main',
  '{"background":"#ffffff","surface":"#ffffff","heading":"#18191c","body":"#5b5d63","accent":"#7b1720","font":"jakarta"}'::jsonb);
alter table public.portfolio_site_settings enable row level security;
revoke all on public.portfolio_site_settings from anon, authenticated;
grant select on public.portfolio_site_settings to anon, authenticated;
grant update (settings) on public.portfolio_site_settings to authenticated;
create policy "Public can read site design"
  on public.portfolio_site_settings for select to anon, authenticated using (true);
create policy "Approved admins update site design"
  on public.portfolio_site_settings for update to authenticated
  using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'))
  with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create trigger portfolio_site_settings_updated_at before update on public.portfolio_site_settings
  for each row execute function public.set_portfolio_edit_updated_at();
