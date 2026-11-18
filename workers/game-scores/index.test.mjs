import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { cleanGameId } from './index.mjs';

function makeEnv({ limits = {} } = {}) {
  const store = new Map();
  const writes = [];
  const limiter = (name) => {
    const seen = new Map();
    return { async limit({ key }) {
      const count = (seen.get(key) || 0) + 1; seen.set(key, count);
      return { success: count <= (limits[name] ?? Infinity) };
    } };
  };
  return {
    store, writes,
    SCORES: {
      async get(key) { return store.has(key) ? store.get(key) : null; },
      async put(key, value) { store.set(key, value); writes.push(key); },
      async list({ prefix }) { return { keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })) }; },
    },
    WRITE_LIMIT: limiter('write'), NEW_BOARD_LIMIT: limiter('board'), READ_LIMIT: limiter('read'),
  };
}
const post = (env, game, body, ip = '203.0.113.7') => worker.fetch(new Request(`https://x/scores/${game}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
  body: typeof body === 'string' ? body : JSON.stringify(body) }), env);
const get = (env, path, ip = '203.0.113.7') => worker.fetch(new Request(`https://x${path}`, { headers: { 'CF-Connecting-IP': ip } }), env);

test('a normal score is stored and ranked, as before', async () => {
  const env = makeEnv();
  const res = await post(env, 'asteroids-hd', { initials: 'jez', score: 1234.9, level: 3 });
  assert.deepEqual(await res.json(), { ok: true, rank: 1, total: 1 });
  const board = await (await get(env, '/scores/asteroids-hd')).json();
  assert.equal(board.length, 1);
  assert.deepEqual({ ...board[0], ts: 0 }, { initials: 'JEZ', score: 1234, level: 3, ts: 0 });
  assert.deepEqual(await (await get(env, '/games')).json(), ['asteroids-hd']);
});

test('dated and per-table ids keep working without registration', async () => {
  const env = makeEnv();
  for (const id of ['pay-dirt-daily-2026-11-18', 'pinball-illusions-law-n-justice', 'invaders-daily-20261118']) {
    assert.equal((await post(env, id, { initials: 'AAA', score: 10 })).status, 200, id);
  }
});

test('stored values can never carry markup', async () => {
  const env = makeEnv();
  await post(env, 'g', { initials: '<b>', score: 5, wave: '<img onerror=x>', level: '7', phase: 1e99 });
  const [row] = await (await get(env, '/scores/g')).json();
  assert.deepEqual(Object.keys(row).sort(), ['initials', 'level', 'score', 'ts']);
  assert.equal(row.initials, 'B'); assert.equal(row.level, 7);
  assert.equal((await post(env, 'g2', { initials: 'AAA', score: '9' })).status, 400);
  assert.equal((await post(env, 'g2', { initials: 'AAAAA', score: 9 })).status, 400);
  assert.equal((await post(env, 'g2', '{nope')).status, 400);
  assert.equal((await post(env, 'g2', 'null')).status, 400);
  assert.equal((await post(env, 'g2', JSON.stringify({ initials: 'AAA', score: 1, pad: 'x'.repeat(4000) }))).status, 413);
  assert.equal(cleanGameId('../<x>'), 'x');
  assert.equal((await post(env, '~~~', { initials: 'AAA', score: 1 })).status, 400);
});

test('same board twice in a minute is refused, as before', async () => {
  const env = makeEnv();
  assert.equal((await post(env, 'g', { initials: 'AAA', score: 1 })).status, 200);
  const again = await post(env, 'g', { initials: 'AAA', score: 2 });
  assert.equal(again.status, 429);
  assert.deepEqual(await again.json(), { error: 'too fast, wait a moment' });
  assert.equal((await post(env, 'g', { initials: 'BBB', score: 2 }, '203.0.113.8')).status, 200);
});

test('changing the board id no longer dodges the limit', async () => {
  const env = makeEnv({ limits: { write: 8, board: 3 } });
  const statuses = [];
  for (let i = 0; i < 12; i++) statuses.push((await post(env, `junk-${i}`, { initials: 'AAA', score: 1 })).status);
  assert.deepEqual(statuses.slice(0, 3), [200, 200, 200]);
  assert.ok(statuses.slice(3).every((s) => s === 429), statuses.join(','));
  assert.equal([...env.store.keys()].filter((k) => k.startsWith('lb:')).length, 3);
  // another visitor is unaffected
  assert.equal((await post(env, 'real-game', { initials: 'AAA', score: 1 }, '198.51.100.9')).status, 200);
});

test('a score that cannot enter a full board costs no board write', async () => {
  const env = makeEnv();
  env.store.set('lb:g', JSON.stringify(Array.from({ length: 50 }, (_, i) => ({ initials: 'AAA', score: 1000 - i, ts: i }))));
  const res = await post(env, 'g', { initials: 'LOW', score: 5 });
  assert.deepEqual(await res.json(), { ok: true, rank: -1, total: 50 });
  assert.ok(!env.writes.includes('lb:g'));
  const top = await post(env, 'g', { initials: 'TOP', score: 5000 }, '203.0.113.9');
  assert.deepEqual(await top.json(), { ok: true, rank: 1, total: 50 });
});

test('reads are limited per address and a missing limiter fails open', async () => {
  const env = makeEnv({ limits: { read: 2 } });
  assert.equal((await get(env, '/scores/g')).status, 200);
  assert.equal((await get(env, '/scores/g')).status, 200);
  assert.equal((await get(env, '/scores/g')).status, 429);
  const bare = makeEnv(); delete bare.WRITE_LIMIT; delete bare.NEW_BOARD_LIMIT; delete bare.READ_LIMIT;
  assert.equal((await post(bare, 'g', { initials: 'AAA', score: 1 })).status, 200);
  assert.equal((await get(bare, '/scores/g')).status, 200);
});

test('errors do not leak internals; other routes answer as before', async () => {
  const env = makeEnv(); env.SCORES.get = async () => { throw new Error('secret detail'); };
  const res = await get(env, '/scores/g');
  assert.equal(res.status, 500); assert.deepEqual(await res.json(), { error: 'internal error' });
  const nf = await get(makeEnv(), '/');
  assert.equal(nf.status, 404);
  assert.deepEqual(await nf.json(), { error: 'not found', usage: 'GET/POST /scores/:gameId' });
  const pre = await worker.fetch(new Request('https://x/scores/g', { method: 'OPTIONS' }), makeEnv());
  assert.equal(pre.headers.get('Access-Control-Allow-Origin'), '*');
});
