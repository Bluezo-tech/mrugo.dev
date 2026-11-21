# Paystack payment setup

The portfolio uses the deployed Supabase Edge Function `payments`. The browser never receives a Paystack secret key. Card or bank details are entered on Paystack's hosted checkout.

1. In the Supabase project dashboard, open **Edge Functions → Secrets** and set `PAYSTACK_SECRET_KEY` to your **test** secret key from your own Paystack account. Do not put this key in `.env.local`, any `VITE_` variable, or chat.
2. In Paystack's **test** dashboard, set the webhook URL to `https://dahzqrnoypdadspgarjb.supabase.co/functions/v1/payments/webhook`. If Paystack provides a `whsec_` signing secret, also set `PAYSTACK_WEBHOOK_SECRET` in Supabase. The handler validates the new `Paystack-Signature` format or Paystack's legacy `x-paystack-signature` format.
3. Deploy the site to Vercel first. Add the assigned `https://...vercel.app` origin to `PORTFOLIO_ORIGINS` in Supabase as a comma-separated exact origin. Localhost and same-network ports 5173–5179 are allowed for preview. Add each future custom domain as a separate exact origin before using checkout there.
4. Test a small payment with Paystack's test mode. Confirm the return page says **Payment confirmed** and a row appears in **Receipts**. Test a failed/cancelled payment and confirm no receipt appears.
5. Only after the test flow works, replace `PAYSTACK_SECRET_KEY` with the live key and configure the corresponding live webhook signing secret. Support selections shown in USD use a current USD/NGN quote, but Paystack charges NGN and settles to the configured NGN account. The customer sees the NGN charge before checkout. An actual USD charge still requires separate Paystack approval and a supported USD payout account.

Apple Pay and Google Pay are enabled in the Paystack dashboard and are offered by Paystack Checkout only when the customer's device, card, location, and merchant account qualify. The site does not collect wallet or card data. Apple Pay on a future public domain may require Paystack domain verification; localhost is not a public domain. Dollar quotes use the ExchangeRate-API open endpoint with attribution in the Support form. If a fresh quote cannot be obtained, USD checkout fails closed; NGN support remains available.

For source code and e-books, publish a product only after uploading its private file. The server resolves the price from the product database and refuses checkout when no file is attached. A confirmed purchaser gets a short-lived signed download link. Keep the return-page reference and browser tab until the download finishes.

Receipts contain only reference, item, buyer email, amount, currency, and verification time. Paystack retains the payment instrument details. No live payment should be attempted until your account keys and webhook are configured and tested.
