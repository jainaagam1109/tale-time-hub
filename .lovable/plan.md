## Problem

After a story finishes generating, `Generating.tsx` calls `nav(dest)` which **pushes** a new history entry. The Generating page remains in the back stack, so pressing Back returns the user to the "Creating magic…" screen for a story that's already done. From there, the polling effect sees `is_generated = true` and re-redirects forward — trapping the user in a loop or showing a confusing stale loader.

## Fix

Single-file change in **`src/pages/Generating.tsx`**: use `navigate(dest, { replace: true })` instead of a plain push when the story is ready.

```ts
setTimeout(() => nav(dest, { replace: true }), 1500);
```

This removes `/generating/:storyId` from the history stack at the moment of redirect. Back from the story page will then go to whatever the user was on before generation started (typically `/magic-hub/...` form or `/` Happy Place), which is the expected behavior.

### Why replace (not a forced `/happy-place` redirect)

- Preserves natural back navigation to the screen the user actually came from.
- Matches the pattern already used for the bedtime redirect in `StoryDetail.tsx`.
- No router config or new routes needed.

### Optional safety net (only if needed)

If we ever want a hard guarantee that nobody lands on `/generating/:storyId` for a finished story (e.g. via a bookmarked link), add an early check in `Generating.tsx`'s first fetch: if `data.is_generated` is already true on initial load, skip the 1.5s delay and `replace` immediately. This is a tiny tweak to the same block and avoids the 1.5s "Creating magic" flash.

## Out of scope

- No changes to `StoryDetail`, `BedtimeReader`, `HappyPlace`, or routing config.
- No DB or business-logic changes.
