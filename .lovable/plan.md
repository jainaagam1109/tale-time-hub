# Add Auth + User → Kid Profiles → Stories/Analytics

Goal: gate the app behind login, link existing `child_profiles` to the logged-in user, support multiple kids per user with a picker screen, and lay schema groundwork for per-kid generated stories and analytics.

## 1. Auth setup

- Enable **Email + Password** and **Google** sign-in (Lovable Cloud managed Google OAuth — no keys needed).
- Auto-confirm email signups (faster testing, per your choice).
- No `profiles` table needed yet (no display name/avatar requested) — we use `auth.users` directly. We can add one later if needed.

## 2. Database changes (single migration)

**`child_profiles`** — link to user
- Add `user_id UUID NOT NULL` (references `auth.users(id)` ON DELETE CASCADE).
- Backfill: existing rows get a placeholder user or are wiped (test data — will confirm during implementation; default plan: delete existing rows since they're orphaned test data).
- Replace open RLS with: user can `SELECT/INSERT/UPDATE/DELETE` only rows where `user_id = auth.uid()`.

**`stories`** — add ownership flag
- Add `owner_profile_id UUID NULL` (references `child_profiles(id)` ON DELETE CASCADE). NULL = global/admin story.
- Add `is_generated BOOLEAN NOT NULL DEFAULT false`.
- RLS: anyone authenticated can `SELECT` global stories (`owner_profile_id IS NULL`) OR stories they own (joined via their kid profiles). Insert/update/delete restricted to owner (admin path stays open for now via service role / admin route — to be tightened later).

**`episodes`** and **`story_tags`** — RLS follows parent story (visible if parent story is visible).

**`user_library`** — add `profile_id UUID NOT NULL` (which kid saved it). RLS: only the owning user.

**New: `story_analytics`**
- Columns: `id`, `profile_id` (FK child_profiles), `story_id` (FK stories), `episode_id` (FK episodes, nullable), `event_type` TEXT (e.g. `play_start`, `play_complete`, `progress`), `position_seconds` INT, `created_at`.
- RLS: user can insert/select rows for their own kid profiles only.

All tables get `ON DELETE CASCADE` where appropriate. Validation triggers (not CHECK) for any time-based rules.

## 3. App flow

```text
/auth  ──────────►  /select-profile  ──►  /onboarding  ──►  /  (Home)
                          │  (if 0 kids)        │
                          │                     ▼
                          └──► pick kid ───►  /  (Home, active kid stored locally)
```

- **Not logged in** → redirect to `/auth`.
- **Logged in, 0 kid profiles** → `/onboarding` (creates first kid).
- **Logged in, 1 kid profile** → auto-select, go to `/`.
- **Logged in, 2+ kid profiles** → `/select-profile` picker.
- Active kid stored in `localStorage` as `lulutales_profile_id` (already in use). Switchable from Profile page.

## 4. New / changed pages & components

**New**
- `src/pages/Auth.tsx` — tabbed Email/Password sign-in & sign-up + "Continue with Google" button. Uses `supabase.auth.signUp`, `signInWithPassword`, and `lovable.auth.signInWithOAuth("google", ...)`.
- `src/pages/SelectProfile.tsx` — grid of kid avatars/names + "Add another child" button (→ `/onboarding`).
- `src/hooks/useAuth.tsx` — `AuthProvider` + `useAuth()`. Sets up `onAuthStateChange` BEFORE `getSession()`, exposes `{ user, session, loading, signOut }`.
- `src/components/RequireAuth.tsx` — route guard that redirects unauthenticated users to `/auth` and routes users with no kid to `/onboarding` / picker.

**Changed**
- `src/App.tsx` — wrap routes in `AuthProvider`, add `/auth` and `/select-profile`, wrap protected routes in `<RequireAuth>`.
- `src/pages/Index.tsx` — new logic: if no session → `/auth`; else delegate to `RequireAuth` flow.
- `src/pages/Onboarding.tsx` — insert `child_profiles` with `user_id: session.user.id`. After save, if it's the first kid go to `/`, otherwise back to `/select-profile`.
- `src/pages/Profile.tsx` — show logged-in email, list kid profiles, "Switch profile", "Add child", "Sign out".
- `src/lib/stories.ts` — `fetchStories` filters `owner_profile_id IS NULL OR owner_profile_id = activeProfileId`. `user_library` queries scoped to active profile.

## 5. Out of scope (this step)

- The actual story-generation feature (we only add `is_generated` + `owner_profile_id` columns so it's ready).
- Analytics dashboard UI (only the table + a small `logEvent` helper that Player can call later).
- Admin role enforcement on `/admin` (remains open as today; can be hardened in a follow-up with a `user_roles` table).
- Password reset flow (can be added later with a `/reset-password` page).

## 6. Technical details (for implementation)

- Auth client: `supabase.auth.*` for email/password; `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })` for Google (will run `configure_social_auth` to scaffold the lovable module).
- Session listener pattern:
  ```ts
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);
  ```
- Active profile selection logic lives in `RequireAuth` so every protected page benefits.
- Existing `localStorage.lulutales_profile_id` key is reused; cleared on sign-out.
