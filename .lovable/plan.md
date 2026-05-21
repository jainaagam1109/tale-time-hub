## Goal

Back buttons should follow the app's journey, not browser history:

- **Player / episode page** → Back goes to the story detail page (`/story/:id`).
- **Story detail page** → Back goes to the previous list page (Home `/` or Happy Place `/happy-place`), defaulting to Home.
- **Bedtime reader** (same role as Player for text stories) → Back goes to the story detail page.

## Changes

### 1. `src/pages/Player.tsx`
Already updated previously: Back uses `nav(id ? "/story/${id}" : "/")`. Leave as is. ✅

### 2. `src/pages/StoryDetail.tsx`
Currently `nav(-1)`. Replace with explicit destination:

- Read an `origin` hint to decide between `/` and `/happy-place`.
- Source the hint from `location.state?.from` (set when navigating into the story) and fall back to `document.referrer` path; default to `/`.
- Use `nav(origin)` (no `replace`) so the destination page is fresh.

### 3. Pass `from` when navigating to a story
Update the links/handlers that open `/story/:id` so they pass `{ state: { from: <current path> } }`:

- `src/pages/Home.tsx` — story cards / continue-listening card.
- `src/pages/HappyPlace.tsx` — `StoryRowCard` link (`Link to={...}` becomes `<Link to={to} state={{ from: "/happy-place" }}>`).
- `src/components/MiniPlayer.tsx` and `src/components/FloatingMiniPlayer.tsx` — if they link to the story page, pass `from: location.pathname`.
- Any other place that links into `/story/:id` (search via `rg "/story/"`).

If no `from` is provided (e.g. deep link), Story Detail defaults to `/`.

### 4. `src/pages/BedtimeReader.tsx`
Match Player behavior: Back goes to `/story/${id}` (or `/` if no id). I'll verify the current implementation and update only its Back button.

## Out of scope

- Episode-to-episode prev/next navigation (already uses `replace: true`).
- Other pages' back buttons (Profile, Insights, Magic Hub forms, etc.) — not mentioned by the user.

## Files touched

- `src/pages/StoryDetail.tsx` — explicit Back target using `location.state.from`.
- `src/pages/BedtimeReader.tsx` — Back → `/story/:id`.
- `src/pages/Home.tsx`, `src/pages/HappyPlace.tsx`, `src/components/MiniPlayer.tsx`, `src/components/FloatingMiniPlayer.tsx` — pass `state={{ from: location.pathname }}` when linking to a story.
