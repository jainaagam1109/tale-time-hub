import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { fetchStories, fetchStoriesForProfile, fetchSavedStories } from "@/lib/stories";
import { PhoneShell } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { StoryCard } from "@/components/StoryCard";
import { StoryCardSkeleton } from "@/components/StoryCardSkeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { ProfileAvatarButton } from "@/components/ProfileAvatarButton";

const HappyPlace = () => {
  const profileId = typeof window !== "undefined" ? localStorage.getItem("lulutales_profile_id") : null;
  const childName = localStorage.getItem("lulutales_child_name") ?? "friend";

  const { data: allStories = [], isLoading } = useQuery({ queryKey: ["stories"], queryFn: fetchStories });
  const { data: personalised = [] } = useQuery({
    queryKey: ["stories-for-profile", profileId],
    queryFn: () => (profileId ? fetchStoriesForProfile(profileId) : Promise.resolve([])),
    enabled: !!profileId,
  });
  const { data: saved = [] } = useQuery({ queryKey: ["library"], queryFn: fetchSavedStories });

  const [query, setQuery] = useState("");
  const personalisedIds = useMemo(() => new Set(personalised.map((s) => s.id)), [personalised]);

  const matches = (s: { title: string }) =>
    !query || s.title.toLowerCase().includes(query.toLowerCase());

  const personalisedFiltered = personalised.filter(matches);
  const globalStories = allStories.filter((s) => !personalisedIds.has(s.id)).filter(matches);
  const savedFiltered = saved.filter(matches);

  return (
    <PhoneShell>
      <header className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <ProfileAvatarButton />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-primary-deep">For {childName}</div>
            <h1 className="text-2xl font-extrabold text-foreground">My Happy Place</h1>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-6">
        {isLoading && (
          <div className="grid grid-cols-2 gap-3 px-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <StoryCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && personalisedFiltered.length > 0 && (
          <section className="pb-5">
            <SectionHeader title="Personalised for you" />
            <div className="grid grid-cols-2 gap-3 px-5">
              {personalisedFiltered.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </section>
        )}

        {!isLoading && (
          <section className="pb-5">
            <SectionHeader title="All stories" />
            {globalStories.length === 0 ? (
              <p className="px-5 text-xs text-muted-foreground">No stories yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-5">
                {globalStories.map((s) => (
                  <StoryCard key={s.id} story={s} />
                ))}
              </div>
            )}
          </section>
        )}

        {!isLoading && savedFiltered.length > 0 && (
          <section className="pb-5">
            <SectionHeader title="Saved" />
            <div className="grid grid-cols-2 gap-3 px-5">
              {savedFiltered.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </PhoneShell>
  );
};

export default HappyPlace;
