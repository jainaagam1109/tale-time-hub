import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Sun, Moon } from "lucide-react";
import { fetchStory } from "@/lib/stories";
import { TagChip } from "@/components/TagChip";

const SIZES = [16, 18, 20];

const BedtimeReader = () => {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const backTo = from === "/happy-place" ? "/happy-place" : "/";
  const { data: story } = useQuery({ queryKey: ["story", id], queryFn: () => fetchStory(id) });

  const [sizeIdx, setSizeIdx] = useState(1);
  const [dark, setDark] = useState(false);

  const fontSize = SIZES[sizeIdx];

  const bg = dark ? "#0F1923" : "#FFFFFF";
  const fg = dark ? "#F5F0E8" : "#1A1612";
  const subtle = dark ? "rgba(245,240,232,0.7)" : "rgba(26,22,18,0.6)";
  const border = dark ? "rgba(245,240,232,0.12)" : "rgba(26,22,18,0.08)";

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: bg, color: fg }}>
      <header
        className="flex items-center gap-2 px-5 pt-5 pb-3"
        style={{ borderBottom: `1px solid ${border}` }}
      >
        <button
          onClick={() => nav(backTo)}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ color: fg }}
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 text-center">
          <div className="text-base font-extrabold" style={{ color: fg }}>
            {story?.title ?? "Bedtime story"}
          </div>
          {story?.theme && (
            <div className="mt-1 inline-block">
              <TagChip label={story.theme} />
            </div>
          )}
        </div>
        <div className="h-9 w-9" />
      </header>

      <main
        className="flex-1 overflow-y-auto"
        style={{ padding: "24px", paddingBottom: "120px" }}
      >
        {story?.story_text ? (
          <article
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.8,
              color: fg,
              whiteSpace: "pre-wrap",
              maxWidth: "640px",
              margin: "0 auto",
            }}
          >
            {story.story_text}
          </article>
        ) : (
          <p className="mx-auto max-w-md pt-10 text-center text-sm" style={{ color: subtle }}>
            {story ? "This bedtime story has no text yet." : "Loading…"}
          </p>
        )}
      </main>

      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-3"
        style={{ background: bg, borderTop: `1px solid ${border}` }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSizeIdx((i) => Math.max(0, i - 1))}
            disabled={sizeIdx === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold disabled:opacity-40"
            style={{ border: `1px solid ${border}`, color: fg }}
            aria-label="Decrease font size"
          >
            A−
          </button>
          <button
            onClick={() => setSizeIdx((i) => Math.min(SIZES.length - 1, i + 1))}
            disabled={sizeIdx === SIZES.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold disabled:opacity-40"
            style={{ border: `1px solid ${border}`, color: fg }}
            aria-label="Increase font size"
          >
            A+
          </button>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ border: `1px solid ${border}`, color: fg }}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default BedtimeReader;
