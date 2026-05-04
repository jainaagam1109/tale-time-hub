import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Play, Bookmark, BookmarkCheck } from "lucide-react";
import { fetchStory, isSaved, toggleSaved } from "@/lib/stories";
import { PhoneShell } from "@/components/PhoneShell";
import { toast } from "sonner";

const StoryDetail = () => {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { data: story, isLoading } = useQuery({ queryKey: ["story", id], queryFn: () => fetchStory(id) });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) isSaved(id).then(setSaved);
  }, [id]);

  const onToggleSave = async () => {
    const next = await toggleSaved(id);
    setSaved(next);
    toast.success(next ? "Saved to library" : "Removed from library");
  };

  if (isLoading) return <PhoneShell><p className="p-6 text-sm text-muted-foreground">Loading…</p></PhoneShell>;
  if (!story) return <PhoneShell><p className="p-6 text-sm">Not found. <Link to="/" className="text-primary-deep">Go home</Link></p></PhoneShell>;

  const episodes = [{ name: "Episode 1 · The beginning" }, { name: "Episode 2 · The journey" }, { name: "Episode 3 · The lesson" }];

  return (
    <PhoneShell>
      <div className="px-5 pt-6 pb-3">
        <button onClick={() => nav(-1)} className="mb-3 flex items-center gap-1 text-xs text-primary-deep">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex h-40 items-center justify-center rounded-3xl bg-gradient-card text-7xl shadow-soft">
          {story.thumbnail ?? "📖"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {story.theme && (
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary-deep">
            {story.theme}
          </div>
        )}
        <h1 className="text-2xl font-extrabold text-foreground">{story.title}</h1>
        <div className="mt-1 text-xs text-muted-foreground">
          {story.age_group ?? "All ages"} · {story.duration ? `${Math.round(story.duration / 60)} min` : "—"}
        </div>

        {story.description && (
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">{story.description}</p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => nav(`/player/${story.id}`)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow"
          >
            <Play className="h-4 w-4 fill-current" /> Play story
          </button>
          <button
            onClick={onToggleSave}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-primary-deep"
            aria-label="Save"
          >
            {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>

        <h2 className="mt-7 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Episodes
        </h2>
        <div className="rounded-2xl border border-border bg-card">
          {episodes.map((ep, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs text-muted-foreground">
                {i + 1}
              </div>
              <div className="flex-1 text-sm font-semibold text-foreground">{ep.name}</div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
};

export default StoryDetail;
