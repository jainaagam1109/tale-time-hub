export const StoryCardSkeleton = ({ variant = "grid" }: { variant?: "grid" | "row" }) => {
  if (variant === "row") {
    return (
      <div className="flex animate-pulse items-center gap-3 rounded-2xl border border-border bg-card p-3">
        <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-secondary" />
        <div className="flex-1 space-y-2">
          <div className="h-2 w-16 rounded bg-secondary" />
          <div className="h-3 w-32 rounded bg-secondary" />
          <div className="h-2 w-20 rounded bg-secondary" />
        </div>
      </div>
    );
  }
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
      <div className="h-20 bg-secondary" />
      <div className="space-y-2 p-3">
        <div className="h-2 w-12 rounded bg-secondary" />
        <div className="h-3 w-3/4 rounded bg-secondary" />
        <div className="h-2 w-1/2 rounded bg-secondary" />
      </div>
    </div>
  );
};
