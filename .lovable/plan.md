## Goal
Stop the home screen from looking like a story is still “in progress” after generation is complete.

## What I found
The item in your screenshot is the **Ongoing story** card, not the small pending-generation banner.

Right now the dashboard:
- fetches **all** stories for the active child profile
- picks `lastId` or `stories[0]` for the Ongoing story card
- renders a hardcoded `25% complete`

So even if the pending banner logic is correct, the Ongoing story card can still make the home screen look like generation is still happening.

## Plan
1. Update the dashboard’s ongoing-story selection logic so it only uses stories that are actually ready to consume (`is_generated = true`).
2. Keep the pending-generation banner separate and only driven by unfinished stories.
3. Make the Ongoing story card fall back cleanly when there is no generated story yet, instead of showing a misleading item.
4. Verify the home screen behavior against current story data so completed stories show as playable and unfinished ones only appear in the generating flow/banner.

## Technical details
- File to update: `src/pages/Dashboard.tsx`
- Likely change:
  - derive `generatedStories = stories.filter((s) => s.is_generated)`
  - compute `ongoing` from `generatedStories` instead of all `stories`
  - preserve the existing top pending banner query for `is_generated = false`
- No backend or schema changes needed for this fix.

## Expected result
- If a story is still being created: user sees only the pending banner.
- If a story is generated: user sees it as the ongoing/playable story.
- The dashboard no longer mixes “pending creation” and “ongoing playback” states.