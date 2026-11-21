create table public.portfolio_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and length(slug) <= 80),
  title text not null check (length(title) between 1 and 180),
  published boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger portfolio_pages_updated_at before update on public.portfolio_pages
  for each row execute function public.set_portfolio_edit_updated_at();
alter table public.portfolio_pages enable row level security;
revoke all on public.portfolio_pages from anon, authenticated;
grant select on public.portfolio_pages to anon, authenticated;
grant insert (slug,title,published) on public.portfolio_pages to authenticated;
grant update (title,published,deleted_at) on public.portfolio_pages to authenticated;
create policy "Visitors see published pages" on public.portfolio_pages for select to anon
  using (published and deleted_at is null);
create policy "Approved admins see pages" on public.portfolio_pages for select to authenticated
  using (published and deleted_at is null or lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com','bluezotech@gmail.com'));
create policy "Approved admins add pages" on public.portfolio_pages for insert to authenticated
  with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com','bluezotech@gmail.com'));
create policy "Approved admins update pages" on public.portfolio_pages for update to authenticated
  using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com','bluezotech@gmail.com'))
  with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com','bluezotech@gmail.com'));
alter table public.portfolio_blocks drop constraint portfolio_blocks_slot_check;
alter table public.portfolio_blocks add constraint portfolio_blocks_slot_check check (slot in ('before','after','socials'));
alter table public.portfolio_blocks drop constraint portfolio_blocks_block_type_check;
alter table public.portfolio_blocks add constraint portfolio_blocks_block_type_check check (block_type in ('text','split','image','cta','social'));
