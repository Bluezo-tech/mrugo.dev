alter table public.portfolio_payment_orders
  add column test_mode boolean not null default true;

alter table public.portfolio_receipts
  add column buyer_name text not null default '' check (length(buyer_name) <= 160),
  add column test_mode boolean not null default true;

update public.portfolio_receipts as receipt
set buyer_name = payment.buyer_name
from public.portfolio_payment_orders as payment
where receipt.provider = 'paystack'
  and receipt.provider_reference = payment.reference;
