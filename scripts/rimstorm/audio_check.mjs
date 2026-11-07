// Audio check (Playwright + headless Edge): unlocks the game's Web Audio, waits for every effect and voice
// line to load and decode, decodes every music track, plays a few sounds through the spatial panners and
// the voice gate, and reports anything missing. No sound is heard (headless); this only proves the files
// are there, decode, and are wired to names the game uses.
//   node scripts/rimstorm/audio_check.mjs [baseUrl=http://127.0.0.1:8772/games/2026-11-06/rimstorm/]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8772/games/2026-11-06/rimstorm/';
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
const errors = [], bad = [];
page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('response', (r) => { if (/\.(mp3)(\?|$)/.test(r.url()) && r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
await page.route('**/game-scores.jez237.workers.dev/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
await page.goto(base + '?fixed&noscores');
await page.waitForFunction(() => window.__rs && window.__rs.G.state === 'title', null, { timeout: 120000 });
const r = await page.evaluate(async () => {
  const { FILE, VOICE } = await import('./js/audio.js?v=8');
  const A = window.__rs.A;
  A.unlock();
  await A.loading;
  const sfx = Object.keys(FILE).filter((k) => !k.includes(':'));
  const missing = sfx.filter((n) => !A.buf.has(n)).concat(VOICE.filter((n) => !A.buf.has('v_' + n)).map((n) => 'v_' + n));
  const music = {};
  for (const k of Object.keys(FILE).filter((k) => k.startsWith('music:'))) { const b = await A.load('music_' + k.slice(6), A.base + FILE[k] + '?v=8'); music[k.slice(6)] = b ? +b.duration.toFixed(1) : 0; }
  // exercise the spatial path, a loop and the narration gate
  const h = A.play('boomM', { x: 3, y: 1, z: -20 });
  A.loop('crackle', 'crackle', 0.4); A.setLoop('crackle', 0, 0, -10, 0.5, 1);
  const said = A.say('v_begin', { priority: true });
  const dur = (n) => (A.buf.get(n) ? +A.buf.get(n).duration.toFixed(2) : 0);
  return { state: A.ctx.state, sfx: sfx.length, voices: VOICE.length, loaded: A.buf.size, missing, music, spatial: !!(h && h.pan), said, crackle: dur('crackle'), fire: dur('fire'), longest: Math.max(...sfx.map(dur)) };
});
await browser.close();
console.log(`audio context: ${r.state}; ${r.sfx} effects + ${r.voices} voice lines wired, ${r.loaded} buffers decoded`);
console.log(`music: ${Object.entries(r.music).map(([k, v]) => `${k} ${v}s`).join(', ')}`);
console.log(`spatial panner: ${r.spatial}, voice gate spoke: ${r.said}, crackle loop ${r.crackle}s, fire ${r.fire}s, longest effect ${r.longest}s`);
const silentMusic = Object.entries(r.music).filter(([, v]) => !v).map(([k]) => k);
if (r.missing.length) console.log('MISSING: ' + r.missing.join(', '));
if (silentMusic.length) console.log('MUSIC NOT DECODED: ' + silentMusic.join(', '));
if (bad.length) console.log('HTTP errors:\n  ' + bad.join('\n  '));
console.log(errors.length ? `console errors: ${errors.length}\n  ` + errors.slice(0, 6).join('\n  ') : 'console errors: 0');
const ok = !r.missing.length && !silentMusic.length && !bad.length && !errors.length && r.spatial && r.said;
console.log(ok ? 'AUDIO OK' : 'AUDIO PROBLEMS');
process.exit(ok ? 0 : 1);
