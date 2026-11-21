-- New payment references are shorter; existing references stay valid.
alter table public.portfolio_payment_orders
  drop constraint portfolio_payment_orders_reference_check;

alter table public.portfolio_payment_orders
  add constraint portfolio_payment_orders_reference_check
  check (reference ~ '^(ugo_[a-z0-9_]{20,80}|ugo-[0-9a-f]{20})$');
