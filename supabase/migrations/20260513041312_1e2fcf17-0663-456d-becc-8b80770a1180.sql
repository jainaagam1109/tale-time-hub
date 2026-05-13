ALTER TABLE public.stories 
  ADD COLUMN IF NOT EXISTS child_profile_id UUID 
  REFERENCES public.child_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.stories 
  ADD COLUMN IF NOT EXISTS story_type TEXT 
  DEFAULT 'pre_recorded' 
  CHECK (story_type IN ('pre_recorded', 'personalised_audio', 'bedtime_text'));

CREATE INDEX IF NOT EXISTS idx_stories_child_profile 
  ON public.stories(child_profile_id);

CREATE POLICY "Anyone can update stories" 
  ON public.stories FOR UPDATE USING (true);