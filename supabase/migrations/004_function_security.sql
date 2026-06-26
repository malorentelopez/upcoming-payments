-- Pin search_path on trigger/helper functions (Supabase linter 0011)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.normalize_user_locale(raw_locale text)
returns text
language plpgsql
immutable
set search_path = public
as $$
begin
  if raw_locale is null then
    return 'en';
  end if;

  case lower(split_part(raw_locale, '-', 1))
    when 'fr' then return 'fr';
    when 'es' then return 'es';
    when 'de' then return 'de';
    else return 'en';
  end case;
end;
$$;

create or replace function public.check_payment_category_ownership()
returns trigger
language plpgsql
set search_path = public
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

-- handle_new_user is only invoked by the auth.users trigger, not via RPC
-- (Supabase linter 0028 / 0029)
revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon, authenticated;
