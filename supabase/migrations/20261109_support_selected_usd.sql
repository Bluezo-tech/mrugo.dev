alter table public.portfolio_payment_orders
  add column selected_usd_amount integer
  check (selected_usd_amount is null or
    (kind = 'support' and currency = 'NGN' and selected_usd_amount between 2 and 3500));
