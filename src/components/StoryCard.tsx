import { Link } from "react-router-dom";
import type { Story } from "@/lib/stories";

const formatDuration = (seconds?: number | null) => {
  if (!seconds) return "—";
  const m = Math.round(seconds / 60);
  return `${m} min`;
};

export const StoryCard = ({ story, variant = "grid" }: { story: Story; variant?: "grid" | "row" }) => {
  if (variant === "row") {
    return (
      <Link
        to={`/story/${story.id}`}
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-colors hover:border-primary/40"
      >
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-secondary text-3xl">
          {story.thumbnail ?? "📖"}
        </div>
        <div className="min-w-0 flex-1">
          {story.theme && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-primary-deep">{story.theme}</div>
          )}
          <div className="truncate text-sm font-bold text-foreground">{story.title}</div>
          <div className="text-xs text-muted-foreground">
            {story.age_group ?? "All ages"} · {formatDuration(story.duration)}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/story/${story.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-colors hover:border-primary/40"
    >
      <div className="flex h-20 items-center justify-center bg-gradient-card text-4xl">
        {story.thumbnail ?? "📖"}
      </div>
      <div className="p-3">
        {story.theme && (
          <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary-deep">
            {story.theme}
          </div>
        )}
        <div className="line-clamp-2 text-xs font-bold leading-snug text-foreground">{story.title}</div>
        <div className="mt-1 text-[10px] text-muted-foreground">
          {story.age_group ?? "All"} · {formatDuration(story.duration)}
        </div>
      </div>
    </Link>
  );
};
