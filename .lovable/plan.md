## Lulutales – Phase 1 Build Plan

A mobile-first audio storytelling app for kids (4–7), inspired by the Storyloom prototype. Phase 1 covers screens, database, and the admin upload flow only — no story/audio generation, no payments, no auth complexity.

### Design system (from reference)

- Soft gradient background: pale blue → cream (`#EAF6FF → #F9FBFF → #FFF7EE`)
- Primary gradient: `#7C9CFF → #7AD8D0` (buttons, play controls, progress)
- Card style: white, rounded (12–16px), soft `#E5EEFF` border, subtle shadow
- Typography: Inter / Nunito, deep navy text (`#28406B`), muted `#7A90AE`
- Playful tags (peach, mint, blue), emoji thumbnails as placeholders
- Pill selectors for age/gender/family
- Bottom nav: Home · Library · Profile
- Mobile-first: max width ~430px container, comfortable touch targets, sticky bottom nav, scrollable content area

All colors will be tokenized in `index.css` + `tailwind.config.ts` (HSL semantic tokens: `--primary`, `--accent`, `--surface`, `--gradient-warm`, etc.) — no hard-coded colors in components.

### Screens & routes

```
/onboarding     → About-your-child form (child name, age pills 4–7, gender, family type)
/               → Home (Ongoing, Recommended, All Stories grid) + bottom nav
/story/:id      → Story detail (title, theme, description, episodes list, Play CTA)
/player/:id     → Player (title, episode, play/pause, progress bar, HTML5 audio)
/library        → Saved stories grid (same card UI as Home)
/profile        → Placeholder (child profile summary)
/admin          → Hidden upload form (title, theme, age group, description, audio file, tags)
```

First-visit logic: if no `child_profiles` row exists locally → redirect to `/onboarding`, else `/`.

### Components

- `BottomNav` (Home / Library / Profile)
- `StoryCard` (grid variant + horizontal variant) — emoji thumb, title, theme tag, age, duration
- `OngoingStoryBanner` (continue-listening card)
- `SectionHeader` (title + optional "See all")
- `PillSelector` (reused on onboarding & admin)
- `PlayerControls` (play/pause, progress bar bound to `<audio>`)
- `AdminUploadForm`

### Database (Lovable Cloud / Supabase)

Tables:

- **child_profiles** — `id uuid pk`, `name text`, `age int`, `gender text`, `family_type text`, `created_at timestamptz`
- **stories** — `id uuid pk`, `title text`, `theme text`, `description text`, `type text default 'pre_recorded'`, `age_group text`, `audio_url text`, `duration int`, `is_featured bool default false`, `created_at timestamptz`
- **story_tags** — `id uuid pk`, `story_id uuid fk → stories`, `tag text`
- **user_library** — `id uuid pk`, `story_id uuid fk → stories`, `created_at timestamptz`

RLS: Phase-1 simplification — public read on `stories` and `story_tags`; permissive insert on `child_profiles` and `user_library` (no auth required yet). Admin upload also unauthenticated for now (the `/admin` route is unlinked/hidden; we'll lock it down in a later phase).

Storage bucket: **`stories-audio`** (public). Admin upload writes the file, retrieves the public URL, and stores it in `stories.audio_url`.

Seed: a few sample stories (with emoji thumbnails) so Home/Library aren't empty before the first admin upload.

### Admin upload flow (`/admin`)

Form → on submit:
1. Upload file to `stories-audio` bucket (filename = `${uuid}.${ext}`)
2. Get public URL
3. Insert into `stories` with all fields
4. Split tags by comma, insert rows into `story_tags`
5. Toast success + reset form

### What's intentionally NOT built (per scope)

- Story or audio generation
- Auth (Google/phone/email screens from reference)
- Narrator selection, premium/paywall, streaks, badges
- Payments
- Animations beyond defaults

### Technical notes

- React + Vite + Tailwind + shadcn/ui (existing stack)
- React Router for the routes above
- TanStack Query for fetching stories
- HTML5 `<audio>` element with custom-styled controls for the player
- File upload via Supabase JS storage client; signed/public URL stored on the row
- All design tokens added to `index.css`; components reference semantic classes (`bg-primary`, `text-foreground`, `bg-gradient-warm`) — no inline hex colors
