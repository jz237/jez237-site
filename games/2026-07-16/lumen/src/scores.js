// Global + local leaderboards. Uses the shared game-scores worker with
// LUMEN's own slug; local mirror in localStorage. New keys — no collisions
// with other games on the site.

// slug v2: '/scores/lumen' was polluted by test submissions pre-release
const SCORE_API = 'https://game-scores.jez237.workers.dev/scores/lumen-td';
const LOCAL_KEY = 'lumen_hs_v1';
const LIMIT = 10;

export function localScores() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []; } catch { return []; }
}

export function saveLocal(entry) {
  const list = localScores();
  list.push(entry);
  list.sort((a, b) => b.score - a.score);
  const top = list.slice(0, LIMIT);
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(top)); } catch { }
  return top;
}

export function cleanInitials(s) {
  return (s || '???').toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(3, '·').slice(0, 3);
}

let globalCache = null, cacheAt = 0;
export async function fetchGlobal() {
  if (globalCache && Date.now() - cacheAt < 60000) return globalCache;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 6000);
  try {
    const res = await fetch(`${SCORE_API}?limit=${LIMIT}`, { signal: ctl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.scores || data.results || []);
    globalCache = list; cacheAt = Date.now();
    return list;
  } catch { clearTimeout(timer); return null; }
}

export async function submitGlobal({ initials, score, wave, kills, map, mode }) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 6000);
  try {
    await fetch(SCORE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initials: cleanInitials(initials),
        score: Math.max(0, Math.floor(score)),
        mode: mode || 'campaign',
        extra: { wave, kills, map, mode },
      }),
      signal: ctl.signal,
    });
    clearTimeout(timer);
    globalCache = null;
    return true;
  } catch { clearTimeout(timer); return false; }
}
