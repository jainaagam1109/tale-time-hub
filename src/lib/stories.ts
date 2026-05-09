import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Story = Tables<"stories">;
export type Episode = Tables<"episodes">;

export const fetchEpisodes = async (storyId: string): Promise<Episode[]> => {
  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("story_id", storyId)
    .order("episode_number", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const fetchStories = async (): Promise<Story[]> => {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const fetchStory = async (id: string): Promise<Story | null> => {
  const { data, error } = await supabase.from("stories").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
};

export const fetchStoryTags = async (storyId: string): Promise<string[]> => {
  const { data, error } = await supabase.from("story_tags").select("tag").eq("story_id", storyId);
  if (error) throw error;
  return (data ?? []).map((r) => r.tag);
};

export const fetchSavedStories = async (): Promise<Story[]> => {
  const { data, error } = await supabase
    .from("user_library")
    .select("story_id, stories(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => r.stories).filter(Boolean);
};

export const isSaved = async (storyId: string): Promise<boolean> => {
  const { data } = await supabase.from("user_library").select("id").eq("story_id", storyId).maybeSingle();
  return !!data;
};

export const toggleSaved = async (storyId: string): Promise<boolean> => {
  const saved = await isSaved(storyId);
  if (saved) {
    await supabase.from("user_library").delete().eq("story_id", storyId);
    return false;
  }
  await supabase.from("user_library").insert({ story_id: storyId });
  return true;
};
