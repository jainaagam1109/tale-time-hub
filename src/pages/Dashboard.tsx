import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Play, Sparkles, BarChart3, ChevronRight } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { ProfileAvatarButton } from "@/components/ProfileAvatarButton";
import { fetchStoriesForProfile } from "@/lib/stories";

const Dashboard = () => {
  const nav = useNavigate();
  const childName = localStorage.getItem("lulutales_child_name") ?? "friend";
  const profileId = typeof window !== "undefined" ? localStorage.getItem("lulutales_profile_id") : null;
  const { data: stories = [] } = useQuery({
    queryKey: ["stories-for-profile", profileId],
    queryFn: () => (profileId ? fetchStoriesForProfile(profileId) : Promise.resolve([])),
    enabled: !!profileId,
  });

  const lastId = typeof window !== "undefined" ? localStorage.getItem("lulutales_last_story") : null;
  const ongoing = stories.find((s) => s.id === lastId) ?? stories[0];

  const streak = [true, true, true, true, true, false, false];
  const badges = [
    { emoji: "🌟", label: "First story" },
    { emoji: "🔥", label: "5-day streak" },
    { emoji: "🤝", label: "Made a friend" },
  ];

  return (
    <PhoneShell>
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <ProfileAvatarButton />
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">Good evening,</div>
          <h1 className="text-2xl font-extrabold text-foreground">{childName}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
        <section>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Ongoing story
          </h2>
          {ongoing ? (
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-card text-3xl">
                  {ongoing.thumbnail ?? "📖"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-foreground">{ongoing.title}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{ongoing.theme}</div>
                </div>
                <button
                  onClick={() => nav(`/player/${ongoing.id}`)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
                  aria-label="Play"
                >
                  <Play className="h-5 w-5 fill-current" />
                </button>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-secondary">
                <div className="h-full w-1/4 rounded-full bg-gradient-primary" />
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">25% complete</div>
            </div>
          ) : (
            <button
              onClick={() => nav("/magic-hub")}
              className="block w-full rounded-2xl border border-dashed border-border bg-card p-4 text-left text-sm text-muted-foreground shadow-soft"
            >
              No stories yet — create one in Magic Hub ✨
            </button>
          )}
        </section>

        <section className="rounded-2xl border border-tag-warm-border bg-tag-warm-bg p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-tag-warm-fg">Today's insight</div>
          <p className="mt-1 text-sm text-tag-warm-fg">
            Your child is exploring friendship stories. Ask them what they would do if a friend felt left out.
          </p>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">7-day streak</h2>
            <span className="text-[11px] font-bold text-primary-deep">5 / 7</span>
          </div>
          <div className="flex items-center justify-between">
            {streak.map((on, i) => (
              <div
                key={i}
                className={`h-7 w-7 rounded-full border ${
                  on ? "border-primary bg-gradient-primary" : "border-border bg-card"
                }`}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Badges earned
          </h2>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-hide">
            {badges.map((b) => (
              <div
                key={b.label}
                className="flex flex-shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground shadow-soft"
              >
                <span className="text-base">{b.emoji}</span>
                {b.label}
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={() => nav("/magic-hub")}
          className="block w-full rounded-2xl bg-gradient-primary p-[2px] text-left shadow-glow"
        >
          <div className="flex items-center gap-3 rounded-[14px] bg-card p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-2xl text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-extrabold text-foreground">Generate a story ✨</div>
              <div className="text-xs text-muted-foreground">Create a personalised tale</div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </button>

        <button
          onClick={() => nav("/insights")}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-soft"
        >
          <BarChart3 className="h-5 w-5 text-primary-deep" />
          <div className="flex-1 text-sm font-bold text-foreground">View Insights</div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </main>

      <BottomNav />
    </PhoneShell>
  );
};

export default Dashboard;
