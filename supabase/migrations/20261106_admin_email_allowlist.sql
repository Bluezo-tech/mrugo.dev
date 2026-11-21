drop policy "Portfolio admins can read inquiries" on public.portfolio_inquiries;
drop policy "Portfolio admins can update inquiry status" on public.portfolio_inquiries;

create policy "Approved admin emails can read inquiries"
  on public.portfolio_inquiries for select to authenticated
  using (lower(auth.jwt() ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));

create policy "Approved admin emails can update inquiry status"
  on public.portfolio_inquiries for update to authenticated
  using (lower(auth.jwt() ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'))
  with check (lower(auth.jwt() ->> 'email') in ('ugodesktop@gmail.com', 'bluezotech@gmail.com'));
