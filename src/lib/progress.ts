// Per-profile streak & badge tracking (localStorage based)

const todayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const visitsKey = (pid: string) => `lulutales_visits_${pid}`;
const completedKey = (pid: string) => `lulutales_completed_${pid}`;

export type CompletedStory = { storyId: string; theme: string | null; at: string };

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const recordVisit = (profileId: string) => {
  const key = visitsKey(profileId);
  const visits = readJson<string[]>(key, []);
  const today = todayKey();
  if (!visits.includes(today)) {
    visits.push(today);
    localStorage.setItem(key, JSON.stringify(visits));
  }
};

export const getVisits = (profileId: string): string[] => readJson<string[]>(visitsKey(profileId), []);

export const recordCompletion = (profileId: string, storyId: string, theme: string | null) => {
  const key = completedKey(profileId);
  const list = readJson<CompletedStory[]>(key, []);
  if (!list.some((c) => c.storyId === storyId)) {
    list.push({ storyId, theme, at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list));
  }
};

export const getCompletions = (profileId: string): CompletedStory[] =>
  readJson<CompletedStory[]>(completedKey(profileId), []);

// Current consecutive-day streak ending today (or yesterday if not visited yet today)
export const computeStreak = (visits: string[]): number => {
  if (visits.length === 0) return 0;
  const set = new Set(visits);
  const d = new Date();
  // If today not visited, start from yesterday so streak doesn't drop mid-day
  if (!set.has(todayKey(d))) d.setDate(d.getDate() - 1);
  let count = 0;
  while (set.has(todayKey(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
};

// Last 7 calendar days (oldest -> today) with on/off
export const last7Days = (visits: string[]): { date: string; on: boolean }[] => {
  const set = new Set(visits);
  const out: { date: string; on: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = todayKey(d);
    out.push({ date: k, on: set.has(k) });
  }
  return out;
};

export type Badge = { id: string; emoji: string; label: string };

const STREAK_TIERS = [
  { days: 7, emoji: "🔥", label: "7-day streak" },
  { days: 15, emoji: "⚡", label: "15-day streak" },
  { days: 30, emoji: "🌙", label: "30-day streak" },
  { days: 50, emoji: "🏅", label: "50-day streak" },
  { days: 75, emoji: "💫", label: "75-day streak" },
  { days: 100, emoji: "👑", label: "100-day streak" },
];

const THEME_EMOJI: Record<string, string> = {
  friendship: "🤝",
  adventure: "🗺️",
  bedtime: "🌙",
  kindness: "💗",
  courage: "🦁",
  curiosity: "🔭",
  family: "🏡",
  nature: "🌿",
  magic: "✨",
};

export const computeBadges = (visits: string[], completions: CompletedStory[]): Badge[] => {
  const badges: Badge[] = [];

  if (completions.length >= 1) {
    badges.push({ id: "first-story", emoji: "🌟", label: "First story" });
  }

  const seenThemes = new Set<string>();
  completions.forEach((c) => {
    if (!c.theme) return;
    const key = c.theme.toLowerCase();
    if (seenThemes.has(key)) return;
    seenThemes.add(key);
    badges.push({
      id: `theme-${key}`,
      emoji: THEME_EMOJI[key] ?? "🎨",
      label: `${c.theme} explorer`,
    });
  });

  // Best streak achieved across history
  const set = new Set(visits);
  let best = 0;
  visits.forEach((v) => {
    if (set.has(v)) {
      // count run ending at v
      let run = 1;
      const d = new Date(v);
      d.setDate(d.getDate() - 1);
      while (set.has(todayKey(d))) {
        run++;
        d.setDate(d.getDate() - 1);
      }
      if (run > best) best = run;
    }
  });
  STREAK_TIERS.forEach((t) => {
    if (best >= t.days) badges.push({ id: `streak-${t.days}`, emoji: t.emoji, label: t.label });
  });

  return badges;
};
