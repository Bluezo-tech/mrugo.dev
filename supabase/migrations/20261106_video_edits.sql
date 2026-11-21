alter table public.portfolio_edits drop constraint portfolio_edits_edit_type_check;
alter table public.portfolio_edits add constraint portfolio_edits_edit_type_check
  check (edit_type in ('text', 'image', 'video', 'link', 'style'));
