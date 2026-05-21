## Problem

The Player's Back button calls `nav(-1)`, which walks one entry back in browser history. Two things pollute that history so Back feels broken:

1. **Auto-advance between episodes** pushes a new history entry every time an episode ends (`nav(/player/:id/:epNum+1)` in `onEnd`). After listening through episodes 1→2→3, Back goes to episode 2, then 1, instead of leaving the player.
2. **Manual prev/next episode** buttons (`goPrev`/`goNext`) do the same — each tap pushes a new entry.
3. Coming from **`/generating/:storyId`**, Back can land the user back on the generating screen (which then bounces them forward again).

## Fix

In `src/pages/Player.tsx`:

- Replace `nav(-1)` on the Back button with an explicit destination: go to `/story/${id}` if we have a story id, otherwise `/`. This guarantees Back always exits the player to the story detail page, regardless of how the user got there or how many episodes auto-advanced.
- Use `{ replace: true }` for the three in-player episode navigations so the history stack doesn't grow per episode:
  - `onEnd` auto-advance
  - `goPrev`
  - `goNext`

No other behavior changes; autoplay, seek, and progress tracking stay the same.

## Files touched

- `src/pages/Player.tsx` — Back button target + `replace: true` on episode navigations.
