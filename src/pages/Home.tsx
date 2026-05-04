import { useQuery } from "@tanstack/react-query";
import { fetchStories } from "@/lib/stories";
import { PhoneShell } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { StoryCard } from "@/components/StoryCard";

const Home = () => {
  const childName = localStorage.getItem("lulutales_child_name") ?? "friend";
  const { data: stories = [], isLoading } = useQuery({ queryKey: ["stories"], queryFn: fetchStories });

  const featured = stories.filter((s) => s.is_featured);
  const ongoing = stories[0];

  return (
    <PhoneShell>
      <header className="px-5 pt-8 pb-4">
        <div className="text-xs text-muted-foreground">Hi {childName} 👋</div>
        <h1 className="text-2xl font-extrabold text-foreground">Story time</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-6">
        {isLoading && <p className="px-5 text-sm text-muted-foreground">Loading stories…</p>}

        {ongoing && (
          <section className="px-5 pb-5">
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Continue listening
            </h2>
            <StoryCard story={ongoing} variant="row" />
          </section>
        )}

        {featured.length > 0 && (
          <section className="pb-5">
            <h2 className="mb-2 px-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Recommended for you
            </h2>
            <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
              {featured.map((s) => (
                <div key={s.id} className="w-40 flex-shrink-0">
                  <StoryCard story={s} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="px-5">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            All stories
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </PhoneShell>
  );
};

export default Home;
