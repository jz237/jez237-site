// Global + local leaderboards. Uses the shared game-scores worker with
// LUMEN's own slug; local mirror in localStorage. New keys — no collisions
// with other games on the site.

// slug v2: '/scores/lumen' was polluted by test submissions pre-release
const SCORE_BASE = 'https://game-scores.jez237.workers.dev/scores/';
const DEFAULT_BOARD = 'lumen-td';
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

let globalCache = null, cacheAt = 0, cacheBoard = null;
export async function fetchGlobal(board = DEFAULT_BOARD) {
  if (globalCache && cacheBoard === board && Date.now() - cacheAt < 60000) return globalCache;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 6000);
  try {
    const res = await fetch(`${SCORE_BASE}${board}?limit=${LIMIT}`, { signal: ctl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.scores || data.results || []);
    globalCache = list; cacheAt = Date.now(); cacheBoard = board;
    return list;
  } catch { clearTimeout(timer); return null; }
}

export async function submitGlobal({ initials, score, wave, kills, map, mode, board = DEFAULT_BOARD }) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 6000);
  try {
    await fetch(SCORE_BASE + board, {
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

// the daily grove: one seed for everyone, its own board
export function dailyInfo() {
  const d = new Date();
  const key = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  return { seed: parseInt(key, 10), mapIndex: parseInt(key, 10) % 3, board: 'lumen-td-daily-' + key, label: d.toISOString().slice(0, 10) };
}
