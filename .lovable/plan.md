## Goal

Restructure the app's navigation and profile entry point so they match the attached screenshots, make the active tab obvious, and keep the audio player visible on every screen until the story finishes.

---

## 1. Bottom Nav rework (`src/components/BottomNav.tsx`)

New three-tab structure (left → right):

1. **Home** (`/`) — `LayoutDashboard` icon. Shows the current Dashboard content (greeting, ongoing story, streak, badges, insight card, generate-story shortcut).
2. **My Happy Place** (`/happy-place`) — `Heart` icon. Collection of all stories the child has access to: pre-recorded + personalised audio + bedtime stories tied to the active child profile, plus saved/favourited stories.
3. **Magic Hub** (`/magic-hub`) — `Star` icon with a small `PREMIUM` pill badge next to the label, matching the screenshot.

**Active state**: the active tab gets a soft elevated card look — `bg-card`, `shadow-soft`, `rounded-2xl`, `text-primary-deep`, and the icon switches to the gradient-primary fill treatment. Inactive tabs stay flat with `text-muted-foreground`. This makes the current screen unmistakable.

---

## 2. Profile entry point — top-left avatar

Profile is removed from the bottom nav and replaced by a circular avatar button in the **top-left** of every main screen (Home, My Happy Place, Magic Hub, Insights). Tapping it routes to `/profile`.

A new small component `ProfileAvatarButton` renders the active child's initial inside the existing gradient-primary circle, sized `h-10 w-10`. Each page header is updated to place this button on the left and keep the greeting/title to its right.

---

## 3. Routing changes (`src/App.tsx`)

- `/` → renders the new **Home** page (current Dashboard content).
- `/happy-place` → new **My Happy Place** page.
- `/magic-hub` → unchanged.
- `/profile` → unchanged route, redesigned content (see §5).
- `/dashboard` → redirect to `/` for back-compat.
- `/library` stays as a redirect to `/happy-place` so old links don't break.
- The current `Index.tsx` (search/browse view) is repurposed to live inside My Happy Place, OR kept under a sub-route — see §4.

---

## 4. My Happy Place page (`src/pages/HappyPlace.tsx`, new)

Single screen that lists every story available to the active child profile:

- **Section: Personalised** — stories where `story_type` is `personalised_audio` or `bedtime_text` and `child_profile_id` matches the active profile.
- **Section: All stories** — global pre-recorded stories (current `fetchStories` minus personalised ones).
- **Section: Saved** — output of `fetchSavedStories`.

Reuses `StoryCard` and the existing search/theme filter UI from the current `Home.tsx` so no functionality is lost.

---

## 5. Profile screen redesign (`src/pages/Profile.tsx`)

Match the second attached screenshot:

- Back chevron + page title.
- Header card: avatar circle, parent name, "Parent account · N child profiles".
- **Session settings** card: "Session time limit — App auto-pauses after this many minutes" with a numeric input (default 30, stored in `localStorage` as `lulutales_session_minutes`).
- Stacked list rows, each with an icon tile + label + chevron:
  - **View Insights** → `/insights`
  - **Open / Add kids' profiles** → expands inline to show the existing kid switcher + "Add child" button (current logic preserved).
  - **Permissions** → toast "Coming soon" for now.
  - **Share app** → uses `navigator.share` if available, else copies link to clipboard.
  - **Contact us** → `mailto:hello@storyloom.app`.
  - **Log out** → red text, current `signOut` flow.

No bottom nav on this screen (it's a sub-page of the avatar button), keeping the back chevron as the only return path.

---

## 6. Persistent MiniPlayer above bottom nav

The existing `MiniPlayer` already renders inside `BottomNav`. Updates:

- Show whenever `localStorage.lulutales_last_story` is set AND playback hasn't completed (track completion via a new `lulutales_last_story_completed` flag set by `Player.tsx` when audio `ended` fires; cleared when a new story starts).
- Visible on every screen that has `BottomNav` (Home, Happy Place, Magic Hub, Insights). Also mount it above the back button on screens without `BottomNav` (Profile, Magic Hub sub-forms) via a lightweight `<FloatingMiniPlayer />` that reuses the same component but without the nav bar.
- Copy + layout match the attached screenshot: headphone tile, story title, sub-line "Continue listening · {progress}% complete · tap to resume", and a circular gradient play button on the right. Progress percentage is read from `localStorage.lulutales_last_story_progress` which `Player.tsx` writes on `timeupdate`.

---

## Technical details

- New file: `src/pages/HappyPlace.tsx` (combines personalised + all + saved).
- New file: `src/components/ProfileAvatarButton.tsx`.
- New file: `src/components/FloatingMiniPlayer.tsx` (wrapper around `MiniPlayer` for non-nav screens).
- Edit: `src/components/BottomNav.tsx` — three tabs, active-state styling.
- Edit: `src/components/MiniPlayer.tsx` — read progress + completion flags, update layout/copy.
- Edit: `src/pages/Player.tsx` — write `lulutales_last_story_progress` on `timeupdate`, set `lulutales_last_story_completed` on `ended`, clear on new playback.
- Edit: `src/pages/Index.tsx` — render new Home (Dashboard) content; or rename current `Dashboard.tsx` → `Home.tsx` and point `/` at it. Old `Home.tsx` browse view is deleted (its functionality moves into `HappyPlace.tsx`).
- Edit: `src/pages/Profile.tsx` — full redesign per §5.
- Edit: `src/App.tsx` — add `/happy-place`, redirect `/dashboard` → `/` and `/library` → `/happy-place`.
- Edit each main page header (Home, Happy Place, Magic Hub, Insights) to mount `ProfileAvatarButton` in the top-left.

No database or backend changes required.
