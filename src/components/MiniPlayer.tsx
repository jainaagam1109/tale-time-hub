import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Play } from "lucide-react";
import { fetchStory, type Story } from "@/lib/stories";

export const MiniPlayer = () => {
  const [story, setStory] = useState<Story | null>(null);
  const location = useLocation();

  useEffect(() => {
    const id = localStorage.getItem("lulutales_last_story");
    if (!id) {
      setStory(null);
      return;
    }
    fetchStory(id).then(setStory).catch(() => setStory(null));
  }, [location.pathname]);

  if (!story) return null;
  if (location.pathname.startsWith("/player/")) return null;

  return (
    <Link
      to={`/player/${story.id}`}
      className="mx-3 mb-1 flex items-center gap-3 rounded-2xl border border-border bg-surface/95 p-2 pr-3 shadow-soft backdrop-blur-md"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-card text-xl">
        {story.thumbnail ?? "📖"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[9px] font-bold uppercase tracking-wider text-primary-deep">Continue listening</div>
        <div className="truncate text-xs font-bold text-foreground">{story.title}</div>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
        <Play className="h-4 w-4 fill-current" />
      </div>
    </Link>
  );
};
