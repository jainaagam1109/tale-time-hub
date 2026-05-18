## Problem

Story `c2f515ab-3a82-4641-ac2e-0c79ea62de01` ("BT test2…") has `story_type = 'bedtime_text'` and a populated `story_text`, but tapping it opens `/story/:id` (the audio Story Detail screen) instead of the Bedtime Reader.

Root cause: `src/components/StoryCard.tsx` hardcodes `to={`/story/${story.id}`}` for both `grid` and `row` variants. Any list that uses `StoryCard` (Library, Dashboard, search) sends bedtime stories to the wrong screen. Only `HappyPlace`'s bedtime row works because it builds its own link with `linkFor={(s) => `/bedtime/${s.id}`}`.

## Fix

1. **`src/components/StoryCard.tsx`** — compute the target route from `story.story_type`:
   ```ts
   const to = story.story_type === "bedtime_text"
     ? `/bedtime/${story.id}`
     : `/story/${story.id}`;
   ```
   Use it in both `row` and `grid` variants.

2. **`src/pages/StoryDetail.tsx`** — defensive guard: if a user lands on `/story/:id` for a `bedtime_text` story (old links, mini-player, deep links), redirect to `/bedtime/:id` via `navigate(..., { replace: true })` once the story loads.

3. **`src/components/MiniPlayer.tsx`** (optional, small) — skip rendering when the last story is `bedtime_text`, since the audio player isn't applicable. Cheap safety net.

No DB changes, no other screens touched.
