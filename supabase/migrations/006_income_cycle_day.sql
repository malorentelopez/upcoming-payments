ALTER TABLE profiles
  ADD COLUMN income_cycle_day smallint NOT NULL DEFAULT 1
  CHECK (income_cycle_day >= 1 AND income_cycle_day <= 31);
