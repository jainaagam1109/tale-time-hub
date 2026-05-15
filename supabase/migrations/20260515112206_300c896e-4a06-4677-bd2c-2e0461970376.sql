ALTER TABLE public.stories
  ADD COLUMN IF NOT EXISTS generation_params JSONB;