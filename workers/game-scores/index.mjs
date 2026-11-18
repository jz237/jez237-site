// game-scores — shared leaderboard API for the games on jez237.com.
//
//   GET  /scores/:gameId   top scores for one board (JSON array, best first)
//   POST /scores/:gameId   { initials, score, wave?, level?, wallsCleared?, phase? }
//   GET  /games            ids of every board that has a score
//
// The API is public and unauthenticated by design (static browser games post
// to it), so everything stored is reduced to letters, digits and numbers, and
// abuse is bounded per visitor address rather than per board:
//   · WRITE_LIMIT      posts per address per minute, across all boards
//   · NEW_BOARD_LIMIT  boards one address may create per minute
//   · READ_LIMIT       reads per address per minute
// The original one-post-per-board-per-minute cooldown is unchanged.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const BOARD_SIZE = 50;
const MAX_BODY_BYTES = 2048;
const MAX_SCORE = 999999999;
const EXTRA_FIELDS = ['wave', 'level', 'wallsCleared', 'phase'];

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', ...extra },
  });
}

const tooFast = () => json({ error: 'too fast, wait a moment' }, 429, { 'Retry-After': '60' });

// A missing limiter (local tests, a binding removed by mistake) must never
// take the leaderboards down, so it counts as "allowed".
async function allowed(limiter, key) {
  if (!limiter) return true;
  try {
    return (await limiter.limit({ key })).success;
  } catch {
    return true;
  }
}

export function cleanGameId(raw) {
  return String(raw || '').replace(/[^a-z0-9_-]/gi, '').substring(0, 64);
}

function readBoard(raw) {
  try {
    const rows = raw ? JSON.parse(raw) : [];
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function readBody(request) {
  if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) return null;
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  return text;
}

async function postScore(request, env, gameId, ip) {
  if (!(await allowed(env.WRITE_LIMIT, ip))) return tooFast();

  const text = await readBody(request);
  if (text === null) return json({ error: 'request too large' }, 413);
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: 'invalid JSON' }, 400);
  }
  if (!body || typeof body !== 'object') return json({ error: 'invalid JSON' }, 400);

  const { initials, score } = body;
  if (!initials || typeof initials !== 'string' || initials.length < 1 || initials.length > 4) {
    return json({ error: 'initials must be 1-4 chars' }, 400);
  }
  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
    return json({ error: 'invalid score' }, 400);
  }
  const clean = initials.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4) || '???';

  const cooldownKey = `rl:${gameId}:${ip}`;
  if (await env.SCORES.get(cooldownKey)) return tooFast();

  const boardKey = `lb:${gameId}`;
  const raw = await env.SCORES.get(boardKey);
  if (raw === null && !(await allowed(env.NEW_BOARD_LIMIT, ip))) return tooFast();
  const current = readBoard(raw);

  await env.SCORES.put(cooldownKey, '1', { expirationTtl: 60 });

  const entry = { initials: clean, score: Math.floor(score), ts: Date.now() };
  for (const field of EXTRA_FIELDS) {
    if (body[field] === undefined) continue;
    const value = Math.floor(Number(body[field]));
    if (Number.isFinite(value) && Math.abs(value) <= MAX_SCORE) entry[field] = value;
  }

  // A score that cannot enter a full board changes nothing, so skip the write.
  const full = current.length >= BOARD_SIZE;
  if (full && entry.score <= Number(current[current.length - 1]?.score)) {
    return json({ ok: true, rank: -1, total: current.length });
  }

  current.push(entry);
  current.sort((a, b) => b.score - a.score);
  const updated = current.slice(0, BOARD_SIZE);
  await env.SCORES.put(boardKey, JSON.stringify(updated));
  const index = updated.indexOf(entry);
  return json({ ok: true, rank: index < 0 ? -1 : index + 1, total: updated.length });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    try {
      const parts = new URL(request.url).pathname.split('/').filter(Boolean);
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

      if (parts[0] === 'scores' && parts[1] && (request.method === 'GET' || request.method === 'POST')) {
        const gameId = cleanGameId(parts[1]);
        if (!gameId) return json({ error: 'invalid game id' }, 400);
        if (request.method === 'POST') return await postScore(request, env, gameId, ip);
        if (!(await allowed(env.READ_LIMIT, ip))) return tooFast();
        return json(readBoard(await env.SCORES.get(`lb:${gameId}`)));
      }

      if (request.method === 'GET' && parts[0] === 'games') {
        if (!(await allowed(env.READ_LIMIT, ip))) return tooFast();
        const list = await env.SCORES.list({ prefix: 'lb:' });
        return json(list.keys.map((key) => key.name.replace('lb:', '')));
      }

      return json({ error: 'not found', usage: 'GET/POST /scores/:gameId' }, 404);
    } catch {
      console.error(JSON.stringify({ event: 'game-scores-error' }));
      return json({ error: 'internal error' }, 500);
    }
  },
};
