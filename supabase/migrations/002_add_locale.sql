alter table public.profiles
add column if not exists locale text not null default 'en';

create or replace function public.normalize_user_locale(raw_locale text)
returns text
language plpgsql
immutable
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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_locale text := public.normalize_user_locale(new.raw_user_meta_data ->> 'locale');
begin
  insert into public.profiles (id, display_name, locale)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    user_locale
  );

  if user_locale = 'fr' then
    insert into public.categories (user_id, name, color, icon) values
      (new.id, 'Loyer', '#0d9488', 'home'),
      (new.id, 'Abonnements', '#6366f1', 'repeat'),
      (new.id, 'Prêts', '#f59e0b', 'landmark'),
      (new.id, 'Factures', '#14b8a6', 'zap'),
      (new.id, 'Autre', '#64748b', 'circle');
  elsif user_locale = 'es' then
    insert into public.categories (user_id, name, color, icon) values
      (new.id, 'Alquiler', '#0d9488', 'home'),
      (new.id, 'Suscripciones', '#6366f1', 'repeat'),
      (new.id, 'Préstamos', '#f59e0b', 'landmark'),
      (new.id, 'Servicios', '#14b8a6', 'zap'),
      (new.id, 'Otro', '#64748b', 'circle');
  elsif user_locale = 'de' then
    insert into public.categories (user_id, name, color, icon) values
      (new.id, 'Miete', '#0d9488', 'home'),
      (new.id, 'Abonnements', '#6366f1', 'repeat'),
      (new.id, 'Kredite', '#f59e0b', 'landmark'),
      (new.id, 'Nebenkosten', '#14b8a6', 'zap'),
      (new.id, 'Sonstiges', '#64748b', 'circle');
  else
    insert into public.categories (user_id, name, color, icon) values
      (new.id, 'Rent', '#0d9488', 'home'),
      (new.id, 'Subscriptions', '#6366f1', 'repeat'),
      (new.id, 'Loans', '#f59e0b', 'landmark'),
      (new.id, 'Utilities', '#14b8a6', 'zap'),
      (new.id, 'Other', '#64748b', 'circle');
  end if;

  return new;
end;
$$;
