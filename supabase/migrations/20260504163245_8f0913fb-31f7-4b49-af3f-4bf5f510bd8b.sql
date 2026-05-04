
-- Tables
CREATE TABLE public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT,
  family_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  theme TEXT,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'pre_recorded',
  age_group TEXT,
  audio_url TEXT,
  duration INT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  thumbnail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.story_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

CREATE TABLE public.user_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;

-- Phase 1 permissive policies (no auth yet)
CREATE POLICY "Anyone can view stories" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert stories" ON public.stories FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view story_tags" ON public.story_tags FOR SELECT USING (true);
CREATE POLICY "Anyone can insert story_tags" ON public.story_tags FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view child_profiles" ON public.child_profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert child_profiles" ON public.child_profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view user_library" ON public.user_library FOR SELECT USING (true);
CREATE POLICY "Anyone can insert user_library" ON public.user_library FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete user_library" ON public.user_library FOR DELETE USING (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('stories-audio', 'stories-audio', true);

CREATE POLICY "Public read stories-audio" ON storage.objects FOR SELECT USING (bucket_id = 'stories-audio');
CREATE POLICY "Public upload stories-audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'stories-audio');

-- Seed sample stories
INSERT INTO public.stories (title, theme, description, age_group, duration, is_featured, thumbnail) VALUES
('The Brave Little Lion', 'Courage', 'A tiny lion learns that being brave means trying even when you''re scared.', '4-7', 420, true, '🦁'),
('Mira and the Moon', 'Wonder', 'Mira discovers what the moon does when everyone is asleep.', '4-7', 360, true, '🌙'),
('The Singing Tree', 'Friendship', 'A lonely tree finds friends who love its songs.', '4-7', 300, false, '🌳'),
('Captain Squish', 'Adventure', 'An octopus captain sails the seven seas in search of a missing pearl.', '5-7', 480, false, '🐙'),
('Bunny''s First Snow', 'Curiosity', 'A little bunny experiences snow for the very first time.', '4-6', 240, false, '🐰'),
('The Star Painter', 'Imagination', 'A child paints new stars into the night sky.', '5-7', 390, false, '⭐');
