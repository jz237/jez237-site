// Global scoring without the network: loads js/scores.js with a fake fetch and a fake localStorage and checks
// that NO_POST is on for every test / watch-only URL (?test ?autoplay ?fixed ?noscores ?demo ?playthrough, the dev
// shortcuts ?boss ?seed ?room=N ?sector and a WebDriver browser) and off for a normal visit, that a real submit POSTs {initials, score, extra} to
// game-scores.jez237.workers.dev/scores/<board> and keeps a local top 10, that NO_POST never calls fetch,
// that the world board is read, cleaned and sorted, and that the local table carries on when offline.
// Nothing here reaches the network: fetch is replaced before the module loads.
//   node scripts/voltmaze/scores_check.mjs
const MOD = '../../games/2026-11-06/voltmaze/js/scores.js?v=5';
let fails = 0, nImport = 0;
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fails++; };

const calls = [];
let reply = () => ({ ok: true, json: async () => [] });
globalThis.fetch = async (url, opt = {}) => { calls.push({ url: String(url), method: opt.method || 'GET', body: opt.body ? JSON.parse(opt.body) : null }); return reply(url, opt); };
const mem = new Map();
globalThis.localStorage = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) };
const setWebdriver = (v) => Object.defineProperty(globalThis.navigator, 'webdriver', { value: v, configurable: true });
async function load(search, webdriver = false) {
  globalThis.location = { search };
  setWebdriver(webdriver);
  return import(MOD + '&case=' + (++nImport));   // a fresh module instance per URL
}

// 1. NO_POST
for (const q of ['?test=1', '?autoplay', '?fixed', '?noscores', '?demo', '?playthrough', '?autoplay&ai=human', '?play&fixed',
  '?boss', '?boss&play&sector=4', '?seed=5&play', '?room=4&play', '?play&sector=2', '?sector=0']) {   // dev shortcuts never post either
  const m = await load(q);
  ok(m.NO_POST === true, `NO_POST on for ${q}`);
}
ok((await load('', true)).NO_POST === true, 'NO_POST on in a WebDriver browser (navigator.webdriver)');
for (const q of ['', '?room=VM-K7QD', '?q=low']) ok((await load(q)).NO_POST === false, `NO_POST off for a normal visit (${q || 'no params'})`);
const live = await load('?play');
ok(live.NO_POST === false, 'NO_POST off for a normal visit (?play)');

// 2. a real submit
calls.length = 0;
const B = new live.Scores('voltmaze-2026-hard');
const e = await B.submit('zq!', 12345.8, 'S3 CLEAR');
const post = calls.find((c) => c.method === 'POST');
ok(!!post && post.url === 'https://game-scores.jez237.workers.dev/scores/voltmaze-2026-hard', `POST goes to the board URL (${post && post.url})`);
ok(!!post && JSON.stringify(post.body) === JSON.stringify({ initials: 'ZQ', score: 12345, extra: 'S3 CLEAR' }), `POST body is {initials, score, extra} (${post && JSON.stringify(post.body)})`);
ok(e.initials === 'ZQ' && B.local().length === 1 && B.local()[0].score === 12345, 'the score lands in the local top 10 too');
ok(localStorage.getItem('vm.hs.voltmaze-2026-hard') !== null, 'local table stored under vm.hs.<board>');
ok(B.initials() === 'ZQ' && localStorage.getItem('vm.initials') === 'ZQ', 'initials remembered for next time under vm.initials');
localStorage.removeItem('vm.initials'); localStorage.setItem('jez237_initials', 'JRB');
ok(B.initials() === 'JRB', 'the site-wide jez237_initials key is read as a default');
localStorage.setItem('vm.initials', 'ZQ');
for (let i = 0; i < 12; i++) await B.submit('AAA', 100 * i, 'S1');
const L = B.local();
ok(L.length === 10 && L[0].score === 12345 && L.every((r, i) => i === 0 || L[i - 1].score >= r.score), 'local table keeps the best 10, sorted');
ok(B.qualifies(1) && !B.qualifies(0), 'world board not known yet (offline): any score above 0 gets the initials prompt, 0 never');
B.global = Array.from({ length: 10 }, (_, i) => ({ initials: 'W' + i, score: 20000 - i * 100 }));
ok(B.qualifies(L[9].score + 1) && !B.qualifies(L[9].score - 1), 'qualifies() checks against the 10th place on this device');
const top = new live.Scores('voltmaze-2026-nightmare');
for (let i = 0; i < 10; i++) await top.submit('LOC', 50000 + i, 'S5');
top.global = Array.from({ length: 10 }, (_, i) => ({ initials: 'W' + i, score: 20000 - i * 100 }));
ok(top.qualifies(19500) && !top.qualifies(18000), 'a score that makes the world top 10 qualifies even when this device has better ones');

// 3. reading the world board
reply = () => ({ ok: true, json: async () => ({ scores: [{ initials: 'BBB', score: 50 }, { initials: 'CCC', score: 900, extra: 'F3 R20' }, null, { initials: 'X', score: 'bad' }, ...Array.from({ length: 12 }, (_, i) => ({ initials: 'D' + i, score: i }))] }) });
calls.length = 0;
const E = new live.Scores('voltmaze-2026-endless-nightmare');
const g = await E.fresh();
ok(calls.length === 1 && calls[0].method === 'GET' && calls[0].url.endsWith('/scores/voltmaze-2026-endless-nightmare'), 'GET reads /scores/<board>');
ok(Array.isArray(g) && g.length === 10 && g[0].initials === 'CCC' && g.every((r) => typeof r.score === 'number'), 'world rows cleaned (junk dropped), sorted and cut to 10');
await E.fresh();
ok(calls.length === 1, 'the board is cached for a minute (no refetch on every title visit)');

// 4. offline
reply = () => { throw new Error('offline'); };
const O = new live.Scores('voltmaze-2026-easy');
const og = await O.fresh();
ok(og === null, 'offline: the world board reads as null (the title shows the local table)');
await O.submit('OFF', 777, 'S2');
ok(O.local().length === 1 && O.local()[0].score === 777, 'offline: the score still lands in the local table');

// 5. NO_POST never calls fetch to post
const t = await load('?noscores');
calls.length = 0;
reply = () => ({ ok: true, json: async () => [] });
const N = new t.Scores('voltmaze-2026');
await N.submit('TST', 5000, 'S1');
ok(!calls.some((c) => c.method === 'POST'), 'with NO_POST a submit never POSTs');
ok(N.local().length === 1, 'with NO_POST the local table still works');
const tt = await load('?test=1');
calls.length = 0;
await new tt.Scores('voltmaze-2026').fresh();
ok(calls.length === 0, 'the ?test page does not even read the world boards');

console.log(fails ? `${fails} scores check(s) failed` : 'scores check passed (no network used)');
process.exit(fails ? 1 : 0);
