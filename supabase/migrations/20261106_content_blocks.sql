create table public.portfolio_blocks (
  id uuid primary key default gen_random_uuid(),
  page_path text not null check (length(page_path) between 1 and 180),
  slot text not null default 'after' check (slot in ('before', 'after')),
  sort_order integer not null default 0,
  block_type text not null check (block_type in ('text', 'split', 'image', 'cta')),
  title text not null default '' check (length(title) <= 180),
  body text not null default '' check (length(body) <= 5000),
  media_url text not null default '' check (length(media_url) <= 1000),
  link_label text not null default '' check (length(link_label) <= 100),
  link_url text not null default '' check (length(link_url) <= 1000),
  appearance jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index portfolio_blocks_public_idx on public.portfolio_blocks (page_path, slot, sort_order) where published;
alter table public.portfolio_blocks enable row level security;
revoke all on public.portfolio_blocks from anon, authenticated;
grant select on public.portfolio_blocks to anon, authenticated;
grant insert (page_path, slot, sort_order, block_type, title, body, media_url, link_label, link_url, appearance, published) on public.portfolio_blocks to authenticated;
grant update (slot, sort_order, block_type, title, body, media_url, link_label, link_url, appearance, published) on public.portfolio_blocks to authenticated;
grant delete on public.portfolio_blocks to authenticated;

create policy "Published blocks are visible to visitors"
  on public.portfolio_blocks for select to anon using (published);
create policy "Admins can see all blocks"
  on public.portfolio_blocks for select to authenticated
  using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com') or published);
create policy "Admins can add blocks"
  on public.portfolio_blocks for insert to authenticated
  with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Admins can edit blocks"
  on public.portfolio_blocks for update to authenticated
  using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'))
  with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Admins can remove blocks"
  on public.portfolio_blocks for delete to authenticated
  using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));

create trigger portfolio_blocks_updated_at before update on public.portfolio_blocks
  for each row execute function public.set_portfolio_edit_updated_at();
