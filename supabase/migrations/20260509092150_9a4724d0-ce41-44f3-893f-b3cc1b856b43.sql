
CREATE TABLE public.episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  episode_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  duration INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view episodes" ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert episodes" ON public.episodes FOR INSERT WITH CHECK (true);

CREATE INDEX idx_episodes_story_id ON public.episodes(story_id);

ALTER TABLE public.stories DROP COLUMN IF EXISTS audio_url;
ALTER TABLE public.stories DROP COLUMN IF EXISTS duration;

CREATE POLICY "Anyone can upload episode audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'stories-audio' AND (storage.foldername(name))[1] = 'episodes');

CREATE POLICY "Anyone can read episode audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'stories-audio');
