-- Page-specific text, media and appearance edits. Shared header/footer use page_path '*'.
create table public.portfolio_edits (
  id uuid primary key default gen_random_uuid(),
  page_path text not null check (length(page_path) between 1 and 180),
  element_key text not null check (length(element_key) between 1 and 600),
  edit_type text not null check (edit_type in ('text', 'image', 'link', 'style')),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  unique (page_path, element_key, edit_type)
);

create index portfolio_edits_page_path_idx on public.portfolio_edits (page_path);
alter table public.portfolio_edits enable row level security;
revoke all on public.portfolio_edits from anon, authenticated;
grant select on public.portfolio_edits to anon, authenticated;
grant insert (page_path, element_key, edit_type, value) on public.portfolio_edits to authenticated;
grant update (value) on public.portfolio_edits to authenticated;
grant delete on public.portfolio_edits to authenticated;

create policy "Page edits are public to read"
  on public.portfolio_edits for select to anon, authenticated using (true);
create policy "Approved admins add page edits"
  on public.portfolio_edits for insert to authenticated
  with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Approved admins update page edits"
  on public.portfolio_edits for update to authenticated
  using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'))
  with check (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
create policy "Approved admins remove page edits"
  on public.portfolio_edits for delete to authenticated
  using (lower((select auth.jwt()) ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));

-- Keep the timestamp tied to successful edits, without granting clients direct access to it.
create or replace function public.set_portfolio_edit_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger portfolio_edits_updated_at before update on public.portfolio_edits
  for each row execute function public.set_portfolio_edit_updated_at();
