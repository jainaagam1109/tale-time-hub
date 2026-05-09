import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { fetchStory } from "@/lib/stories";
import { PhoneShell } from "@/components/PhoneShell";

const fmt = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const Player = () => {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { data: story } = useQuery({ queryKey: ["story", id], queryFn: () => fetchStory(id) });
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setT(a.currentTime);
    const onMeta = () => setDur(a.duration);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [story?.audio_url]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play();
      setPlaying(true);
      if (story?.id) localStorage.setItem("lulutales_last_story", story.id);
    }
  };

  const skip = (delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min((a.duration || 0), a.currentTime + delta));
  };

  const pct = dur > 0 ? (t / dur) * 100 : 0;

  return (
    <PhoneShell>
      <div className="flex-1 px-6 pt-6 pb-10">
        <button onClick={() => nav(-1)} className="mb-6 flex items-center gap-1 text-xs text-primary-deep">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        <div className="mx-auto mb-6 flex h-64 w-64 items-center justify-center rounded-3xl bg-gradient-card text-8xl shadow-soft">
          {story?.thumbnail ?? "📖"}
        </div>

        <div className="text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary-deep">
            {story?.theme}
          </div>
          <h1 className="mt-1 text-xl font-extrabold text-foreground">{story?.title ?? "Loading…"}</h1>
          <div className="text-xs text-muted-foreground">Episode 1 · The beginning</div>
        </div>

        <div className="mt-8">
          <div className="relative h-1.5 rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>{fmt(t)}</span>
            <span>{fmt(dur)}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6">
          <button onClick={() => skip(-15)} className="text-muted-foreground" aria-label="Back 15s">
            <SkipBack className="h-7 w-7" />
          </button>
          <button
            onClick={toggle}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
            aria-label={playing ? "Pause" : "Play"}
            disabled={!story?.audio_url}
          >
            {playing ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current" />}
          </button>
          <button onClick={() => skip(15)} className="text-muted-foreground" aria-label="Forward 15s">
            <SkipForward className="h-7 w-7" />
          </button>
        </div>

        {!story?.audio_url && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            No audio uploaded for this story yet.
          </p>
        )}

        {story?.audio_url && (
          <audio ref={audioRef} src={story.audio_url} preload="metadata" className="mt-6 w-full" controls />
        )}
      </div>
    </PhoneShell>
  );
};

export default Player;
