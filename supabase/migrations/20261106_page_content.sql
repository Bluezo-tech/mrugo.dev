create table public.portfolio_sections (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  section_key text not null,
  content jsonb not null default '{}'::jsonb,
  appearance jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (page, section_key)
);

insert into public.portfolio_sections (page, section_key, content, appearance)
values ('home', 'hero',
  '{"headline":"I build useful software","highlight":"for real problems.","description":"I’m a software developer building practical web apps and digital tools that solve real problems.","bubble":"Hello, I’m Ugo."}'::jsonb,
  '{"headline_size":"default"}'::jsonb);

alter table public.portfolio_sections enable row level security;
revoke all on public.portfolio_sections from anon, authenticated;
grant select on public.portfolio_sections to anon, authenticated;
grant update (content, appearance) on public.portfolio_sections to authenticated;

create policy "Anyone can read published page content"
  on public.portfolio_sections for select to anon, authenticated
  using (true);

create policy "Approved admin emails can edit page content"
  on public.portfolio_sections for update to authenticated
  using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'))
  with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
