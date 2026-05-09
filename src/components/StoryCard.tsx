import { Link } from "react-router-dom";
import type { Story } from "@/lib/stories";
import { TagChip } from "./TagChip";

export const StoryCard = ({ story, variant = "grid" }: { story: Story; variant?: "grid" | "row" }) => {
  if (variant === "row") {
    return (
      <Link
        to={`/story/${story.id}`}
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-colors hover:border-primary/40"
      >
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-card text-3xl">
          {story.thumbnail ?? "📖"}
        </div>
        <div className="min-w-0 flex-1">
          {story.theme && <TagChip label={story.theme} />}
          <div className="mt-1 truncate text-sm font-bold text-foreground">{story.title}</div>
          <div className="text-xs text-muted-foreground">
            {story.age_group ?? "All ages"}
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
      <div className="space-y-1 p-3">
        {story.theme && <TagChip label={story.theme} />}
        <div className="line-clamp-2 text-xs font-bold leading-snug text-foreground">{story.title}</div>
        <div className="text-[10px] text-muted-foreground">
          {story.age_group ?? "All"}
        </div>
      </div>
    </Link>
  );
};
