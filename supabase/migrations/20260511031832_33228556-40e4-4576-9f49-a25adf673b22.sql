
-- 1. Wipe orphaned test data
DELETE FROM public.user_library;
DELETE FROM public.child_profiles;

-- 2. child_profiles: tie to auth user
ALTER TABLE public.child_profiles
  ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX idx_child_profiles_user_id ON public.child_profiles(user_id);

DROP POLICY IF EXISTS "Anyone can insert child_profiles" ON public.child_profiles;
DROP POLICY IF EXISTS "Anyone can view child_profiles" ON public.child_profiles;

CREATE POLICY "Users view own child profiles" ON public.child_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own child profiles" ON public.child_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own child profiles" ON public.child_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own child profiles" ON public.child_profiles
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. stories: ownership flags
ALTER TABLE public.stories
  ADD COLUMN owner_profile_id UUID NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  ADD COLUMN is_generated BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX idx_stories_owner_profile_id ON public.stories(owner_profile_id);

-- Helper: does the current user own this profile?
CREATE OR REPLACE FUNCTION public.owns_profile(_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.child_profiles
    WHERE id = _profile_id AND user_id = auth.uid()
  );
$$;

DROP POLICY IF EXISTS "Anyone can insert stories" ON public.stories;
DROP POLICY IF EXISTS "Anyone can view stories" ON public.stories;

-- Authenticated users see global stories + their own kids' stories
CREATE POLICY "View global or owned stories" ON public.stories
  FOR SELECT TO authenticated
  USING (owner_profile_id IS NULL OR public.owns_profile(owner_profile_id));

-- Insert: either a global story (admin) or for a profile the user owns
CREATE POLICY "Insert stories" ON public.stories
  FOR INSERT TO authenticated
  WITH CHECK (owner_profile_id IS NULL OR public.owns_profile(owner_profile_id));

CREATE POLICY "Update own stories" ON public.stories
  FOR UPDATE TO authenticated
  USING (owner_profile_id IS NOT NULL AND public.owns_profile(owner_profile_id));

CREATE POLICY "Delete own stories" ON public.stories
  FOR DELETE TO authenticated
  USING (owner_profile_id IS NOT NULL AND public.owns_profile(owner_profile_id));

-- 4. episodes & story_tags: visibility follows parent story
DROP POLICY IF EXISTS "Anyone can insert episodes" ON public.episodes;
DROP POLICY IF EXISTS "Anyone can view episodes" ON public.episodes;

CREATE OR REPLACE FUNCTION public.can_access_story(_story_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.stories s
    WHERE s.id = _story_id
      AND (s.owner_profile_id IS NULL OR public.owns_profile(s.owner_profile_id))
  );
$$;

CREATE POLICY "View episodes of accessible stories" ON public.episodes
  FOR SELECT TO authenticated USING (public.can_access_story(story_id));
CREATE POLICY "Insert episodes for accessible stories" ON public.episodes
  FOR INSERT TO authenticated WITH CHECK (public.can_access_story(story_id));
CREATE POLICY "Update episodes of accessible stories" ON public.episodes
  FOR UPDATE TO authenticated USING (public.can_access_story(story_id));
CREATE POLICY "Delete episodes of accessible stories" ON public.episodes
  FOR DELETE TO authenticated USING (public.can_access_story(story_id));

DROP POLICY IF EXISTS "Anyone can insert story_tags" ON public.story_tags;
DROP POLICY IF EXISTS "Anyone can view story_tags" ON public.story_tags;

CREATE POLICY "View tags of accessible stories" ON public.story_tags
  FOR SELECT TO authenticated USING (public.can_access_story(story_id));
CREATE POLICY "Insert tags for accessible stories" ON public.story_tags
  FOR INSERT TO authenticated WITH CHECK (public.can_access_story(story_id));
CREATE POLICY "Delete tags of accessible stories" ON public.story_tags
  FOR DELETE TO authenticated USING (public.can_access_story(story_id));

-- 5. user_library: scope to a profile
ALTER TABLE public.user_library
  ADD COLUMN profile_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE;
CREATE INDEX idx_user_library_profile_id ON public.user_library(profile_id);
CREATE UNIQUE INDEX idx_user_library_profile_story ON public.user_library(profile_id, story_id);

DROP POLICY IF EXISTS "Anyone can delete user_library" ON public.user_library;
DROP POLICY IF EXISTS "Anyone can insert user_library" ON public.user_library;
DROP POLICY IF EXISTS "Anyone can view user_library" ON public.user_library;

CREATE POLICY "View own library" ON public.user_library
  FOR SELECT TO authenticated USING (public.owns_profile(profile_id));
CREATE POLICY "Insert own library" ON public.user_library
  FOR INSERT TO authenticated WITH CHECK (public.owns_profile(profile_id));
CREATE POLICY "Delete own library" ON public.user_library
  FOR DELETE TO authenticated USING (public.owns_profile(profile_id));

-- 6. story_analytics
CREATE TABLE public.story_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  episode_id UUID NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  position_seconds INT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX idx_story_analytics_profile_id ON public.story_analytics(profile_id);
CREATE INDEX idx_story_analytics_story_id ON public.story_analytics(story_id);

ALTER TABLE public.story_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own analytics" ON public.story_analytics
  FOR SELECT TO authenticated USING (public.owns_profile(profile_id));
CREATE POLICY "Insert own analytics" ON public.story_analytics
  FOR INSERT TO authenticated WITH CHECK (public.owns_profile(profile_id));
