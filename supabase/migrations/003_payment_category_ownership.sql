-- Ensure payment categories belong to the same user
create or replace function public.check_payment_category_ownership()
returns trigger
language plpgsql
as $$
begin
  if new.category_id is not null then
    if not exists (
      select 1
      from public.categories c
      where c.id = new.category_id
        and c.user_id = new.user_id
    ) then
      raise exception 'category does not belong to user';
    end if;
  end if;

  return new;
end;
$$;

create trigger payments_category_ownership
before insert or update of category_id, user_id on public.payments
for each row execute function public.check_payment_category_ownership();
