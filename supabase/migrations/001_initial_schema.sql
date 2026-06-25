-- Profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  default_currency text not null default 'USD',
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  icon text,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

-- Payments
create type public.payment_type as enum ('recurring', 'installment', 'one_off');
create type public.payment_frequency as enum ('weekly', 'monthly', 'yearly');

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'USD',
  type public.payment_type not null,
  frequency public.payment_frequency,
  day_of_month smallint check (day_of_month between 1 and 31),
  use_last_day_of_month boolean not null default false,
  start_date date,
  end_date date,
  due_date date,
  next_due_date date,
  total_installments integer check (total_installments > 0),
  paid_installments integer not null default 0 check (paid_installments >= 0),
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_user_id_idx on public.payments (user_id);
create index payments_category_id_idx on public.payments (category_id);
create index categories_user_id_idx on public.categories (user_id);

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

-- Seed profile + default categories on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );

  insert into public.categories (user_id, name, color, icon) values
    (new.id, 'Rent', '#0d9488', 'home'),
    (new.id, 'Subscriptions', '#6366f1', 'repeat'),
    (new.id, 'Loans', '#f59e0b', 'landmark'),
    (new.id, 'Utilities', '#14b8a6', 'zap'),
    (new.id, 'Other', '#64748b', 'circle');

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.payments enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view own categories"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "Users can insert own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own categories"
  on public.categories for update
  using (auth.uid() = user_id);

create policy "Users can delete own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

create policy "Users can view own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Users can insert own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own payments"
  on public.payments for update
  using (auth.uid() = user_id);

create policy "Users can delete own payments"
  on public.payments for delete
  using (auth.uid() = user_id);
