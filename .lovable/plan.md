## Player page: per-episode playback

Make the Player page play any episode of a story, navigable via URL, with inline Prev/Next controls and auto-advance.

### 1. Routing (`src/App.tsx`)
- Keep `/player/:id` (defaults to episode 1).
- Add `/player/:id/:episodeNumber`.

```tsx
<Route path="/player/:id" element={<Player />} />
<Route path="/player/:id/:episodeNumber" element={<Player />} />
```

### 2. Param handling (`src/pages/Player.tsx`)
- `const { id = "", episodeNumber = "1" } = useParams();`
- `const epNum = parseInt(episodeNumber, 10);`

### 3. Episode selection
- Fetch episodes as today via `useQuery` + `fetchEpisodes(id)`.
- `const current = episodes?.find(e => e.episode_number === epNum);`
- `const audioUrl = current?.audio_url ?? null;`
- Compute `maxEp = Math.max(...episodes.map(e => e.episode_number))` (guard empty).

### 4. UI updates
- Replace the hardcoded `"Episode 1 · The beginning"` line with:
  `Episode {current.episode_number} · {current.title}`
- If episodes loaded but `current` is undefined → show an "Episode not found" state with a Back button (no transport controls).

### 5. Inline Prev / Next controls
Place inside the existing transport row, flanking the -15 / Play / +15 cluster:

```
[Prev] [-15s] [Play/Pause] [+15s] [Next]
```

- Prev → `nav(\`/player/${id}/${epNum - 1}\`)`, disabled when `epNum <= 1`.
- Next → `nav(\`/player/${id}/${epNum + 1}\`)`, disabled when `epNum >= maxEp`.
- Use `ChevronLeft` / `ChevronRight` from lucide-react (already in use).
- Disabled state: `opacity-40 pointer-events-none`.

### 6. Reset playback on episode change
A `useEffect` keyed on `audioUrl` (which changes when episode changes):
```ts
useEffect(() => {
  const a = audioRef.current;
  if (!a) return;
  a.pause();
  a.currentTime = 0;
  setT(0);
  setPlaying(false);
}, [audioUrl]);
```
The existing `<audio src={audioUrl}>` already swaps source when `audioUrl` changes.

### 7. Auto-advance on end
Update the existing `onEnd` handler:
- If a next episode exists (`epNum < maxEp`) → `nav(\`/player/${id}/${epNum + 1}\`)`. The reset effect will run, then we trigger `play()` so the next episode begins automatically.
- Otherwise → `setPlaying(false)` (current behavior).

To auto-play after navigation, use a small effect that, when `audioUrl` changes AND a "shouldAutoplay" ref is set, calls `audio.play()` once metadata is loaded. Set the ref to true right before navigating from `onEnd`.

### 8. Persist last story
Keep the existing `localStorage.setItem("lulutales_last_story", story.id)` on play. No change needed.

### Out of scope
- StoryDetail's per-episode Play buttons already navigate to `/player/${id}/${ep.episode_number}` — they'll just work after the route change.
- No DB changes. No styling refactor beyond adding the two new buttons.
- No "mark episode complete" tracking yet.
