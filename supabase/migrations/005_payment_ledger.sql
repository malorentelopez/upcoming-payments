-- Personal vs business ledger for payments
create type public.payment_ledger as enum ('personal', 'business');

alter table public.payments
  add column ledger public.payment_ledger not null default 'personal';

alter table public.profiles
  add column default_ledger public.payment_ledger not null default 'personal';

create index payments_user_id_ledger_idx on public.payments (user_id, ledger);
