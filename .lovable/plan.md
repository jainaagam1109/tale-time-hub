## Why "Tara and the quiet house" is missing

The row exists in the `stories` table, but it has:
- `is_generated = false`
- `story_type = 'pre_recorded'`
- `owner_profile_id = null` (global catalogue story)

The Story Room section in `src/pages/HappyPlace.tsx` filters with:
```ts
s.is_generated === true && s.story_type === 'regular_audio'
```

Tara fails both checks, so it's hidden. The filter was written for newly-generated personalised audio, but the Story Room is meant to display the pre-recorded catalogue.

## Fix

Update the Story Room filter in `src/pages/HappyPlace.tsx` to match catalogue stories instead:

```ts
const storyRoom = allStories
  .filter((s) => s.story_type === 'pre_recorded' && s.owner_profile_id === null)
  .filter(matches);
```

- Drops the `is_generated` requirement (catalogue stories are authored, not generated).
- Switches `story_type` to `'pre_recorded'`, which is the default in the DB.
- Restricts to global rows (`owner_profile_id IS NULL`) so a user's own generated audio doesn't leak into the shared Story Room.

No DB migration, no other screens touched.
