## Problem

In `src/pages/Player.tsx`, the progress bar is purely presentational:

```tsx
<div className="relative h-1.5 rounded-full bg-secondary">
  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${pct}%` }} />
</div>
```

No click/drag handler, no `<input type="range">`, no ref — so taps do nothing. The image's red "scrubber dot" is also illusory; there is no thumb element rendered. Only the ±10s buttons can change `currentTime`.

## Fix (single file: `src/pages/Player.tsx`)

Replace the static bar with a native `<input type="range">` styled as the progress track. This gives us click-to-seek, drag-to-scrub, and keyboard accessibility for free, and works reliably on mobile (touch) without custom gesture code.

Approach:

1. Add a seek handler:
   ```ts
   const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
     const a = audioRef.current;
     if (!a || !isFinite(a.duration)) return;
     const next = Number(e.target.value);
     a.currentTime = next;
     setT(next);
   };
   ```
2. Render:
   ```tsx
   <input
     type="range"
     min={0}
     max={dur || 0}
     step={0.1}
     value={t}
     onChange={onSeek}
     disabled={!audioUrl || !dur}
     className="w-full ..."  // styled track + thumb using design tokens
     style={{ background: `linear-gradient(to right, hsl(var(--primary)) ${pct}%, hsl(var(--secondary)) ${pct}%)` }}
   />
   ```
   Keep the `0:06 / 1:48` time row underneath unchanged.

3. Style the range with Tailwind + a small `@layer` rule in `src/index.css` for `::-webkit-slider-thumb` / `::-moz-range-thumb` (a circular thumb using `--primary`) so it visually matches the mockup. Track height stays `h-1.5`.

### Why a native range instead of custom mouse handlers

- Touch support on mobile (the player is in a 390px phone shell) without writing pointer/touch logic.
- Free keyboard a11y (arrow keys).
- Less code, no `getBoundingClientRect` math, no edge cases when `duration` is `NaN`.

### Guards

- Disable the input until metadata loads (`!dur`) so users can't seek a 0-length track.
- Clamp via `min`/`max`; the existing `onTime` listener will continue to update `t` during playback.

## Out of scope

- No changes to skip buttons, episode autoplay, or persistence logic.
- No changes to BedtimeReader or MiniPlayer.
