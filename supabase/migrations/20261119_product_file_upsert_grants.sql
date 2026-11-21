-- PostgREST upsert requires table-level insert and update grants.
-- RLS still limits both operations to the CMS admin email allowlist.
grant insert, update on public.portfolio_product_files to authenticated;
