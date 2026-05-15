ALTER TABLE public.child_profiles
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS personality TEXT,
  ADD COLUMN IF NOT EXISTS home_type TEXT,
  ADD COLUMN IF NOT EXISTS family_members TEXT,
  ADD COLUMN IF NOT EXISTS family_address_terms TEXT;