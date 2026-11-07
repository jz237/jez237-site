// Look check (Playwright + headless Edge): screenshots of every sector look mid-fight, every boss room, a model
// gallery close up, phone portrait/landscape, and a long fast autoplay run (all five sectors, endless floors,
// every effect) that checks the shader program count never grows after the warm-up.
//   node scripts/voltmaze/look_check.mjs [what=all|looks|bosses|gallery|phone|progs|fx] [prefix=look] [baseUrl] [shotDir]
// Needs the static server (D:/Projects/.tmp/arcade-trio-work/voltmaze/serve.py 8773). Takes the shared Edge lock.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const what = (process.argv[2] || 'all').split(',');
const prefix = process.argv[3] || 'look';
const base = process.argv[4] || 'http://127.0.0.1:8773/games/2026-11-06/voltmaze/';
const shots = process.argv[5] || 'D:/Projects/.tmp/arcade-trio-work/voltmaze/shots';
const want = (k) => what.includes('all') || what.includes(k);
fs.mkdirSync(shots, { recursive: true });

const LOCK = 'D:/Projects/.tmp/arcade-trio-edge.lock';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; ; i++) {
  try { fs.mkdirSync(LOCK); break; } catch {
    try { const st = fs.statSync(LOCK); if (Date.now() - st.mtimeMs > 10 * 60 * 1000) { fs.rmdirSync(LOCK); continue; } } catch { /* gone */ }
    if (i > 40) { console.error('could not get the Edge lock'); process.exit(3); }
    console.log('waiting for the Edge lock…'); await sleep(20000 + Math.random() * 20000);
  }
}
const release = () => { try { fs.rmdirSync(LOCK); } catch { /* already */ } };
process.on('exit', release);
process.on('SIGINT', () => { release(); process.exit(1); });
const t0 = Date.now();
let browser, fails = 0;
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await ctx.route('**/game-scores.jez237.workers.dev/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await ctx.route('**/fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await ctx.route('**/fonts.gstatic.com/**', (r) => r.abort());
  await page.goto(base + '?fixed&noscores' + (process.env.VM_Q ? '&q=' + process.env.VM_Q : ''));   // VM_Q=low|medium|high: quality tier
  await page.waitForFunction(() => window.__vm && window.__vm.tick && !document.getElementById('loading'), null, { timeout: 120000 });
  const progs0 = await page.evaluate(() => window.__vm.R.r.info.programs.length);
  console.log(`shader programs after warm-up: ${progs0}`);
  const tick = (n) => page.evaluate((n) => window.__vm.tick(n), n);
  // tuning: VM_OVR='{"0":{"keyI":0.6}}' overrides LOOKS entries before the shots
  if (process.env.VM_OVR) await page.evaluate((o) => { const vm = window.__vm; for (const k in o) Object.assign(vm.LOOKS[k], o[k]); vm.R.lookI = -1; }, JSON.parse(process.env.VM_OVR));
  const setup = (o) => page.evaluate(async (o) => {
    const vm = window.__vm, { makeWorld } = await import('./js/sim.js?v=5'), { Autopilot } = await import('./js/ai.js?v=5'), { TYPICAL_UP } = await import('./js/config.js?v=5');
    const W = makeWorld({ sector: o.s, seed: o.seed, room: o.room, boss: o.boss, lives: 9, up: TYPICAL_UP[o.s], noTut: true });
    vm.G.W = W; vm.G.state = 'play'; vm.G.mode = 'campaign'; vm.G.ai = new Autopilot(o.s, 'demo'); vm.G.screen = null;
    vm.G.run = { score: 0, lives: 9, up: TYPICAL_UP[o.s], salvage: 0, start: o.s, newMedals: [], diff: 'normal' };
    for (const id of ['title', 'tut', 'banner', 'caption']) { const el = document.getElementById(id); if (el) el.classList.add('hidden'); }
    vm.R.setLook(o.s); vm.R.roomKey = null;
  }, o);

  const SECT = process.env.VM_S ? process.env.VM_S.split(',').map(Number) : [0, 1, 2, 3, 4];
  if (want('looks')) {
    for (const s of SECT) {
      await setup({ s, seed: 40 + s, room: 2 });
      await tick(150);
      await page.screenshot({ path: `${shots}/${prefix}_s${s + 1}.png` });
      if (process.env.VM_DBG) console.log(await page.evaluate(() => { const R = window.__vm.R; const f = R.floorMat; return JSON.stringify({ key: R.key.intensity, hemi: R.hemi.intensity, fill: R.fill.intensity, env: f.envMapIntensity, col: f.color.getHexString(), rough: f.roughness, metal: f.metalness, pool: R.pool.map((l) => +l.intensity.toFixed(2)), spots: R.spots.map((l) => l.intensity), fx: R.fx.lights.map((q) => +q.l.intensity.toFixed(1)), exp: R.look.exposure, lights: (() => { let n = 0; R.scene.traverse((o) => { if (o.isLight) n++; }); return n; })() }); }));
    }
  }
  if (want('bosses')) {
    for (let s = 0; s < 5; s++) {
      await setup({ s, seed: 90 + s, boss: true });
      await tick(300);
      await page.screenshot({ path: `${shots}/${prefix}_boss_s${s + 1}.png` });
    }
  }
  if (want('gallery')) {
    // every model lined up in a lit room, camera close
    for (const [name, list, look] of [['robots', 'robots', 0], ['robots_dark', 'robots', 3], ['hero', 'hero', 2], ['bosses', 'bosses', 4]]) {
      await setup({ s: look, seed: 3, room: 0 });
      await tick(2);
      await page.evaluate(async ({ list }) => {
        const vm = window.__vm, R = vm.R, MD = await import('./js/models.js?v=5'), { BOSSES } = await import('./js/config.js?v=5');
        vm.G.state = 'gallery';
        window.__hid = ['wallI', 'stripI', 'baseI', 'fieldI', 'sealI', 'liftDoorI', 'postI', 'capI', 'doorPostI', 'doorLampI', 'corrI', 'chevI', 'railI', 'railPostI', 'spill', 'ringI'].filter((k) => R[k]);
        for (const k of window.__hid) R[k].visible = false;
        for (const v of R.views.p.values()) v.g.visible = false;
        for (const el of document.querySelectorAll('body > *:not(canvas)')) el.style.visibility = 'hidden';
        const W = vm.G.W; W.robots = []; W.seeker = null; W.bolts = [];
        const g = [];
        if (list === 'robots') { for (const k of ['sentry', 'patroller', 'marksman', 'aegis', 'mortar', 'ripper', 'twin', 'drone']) g.push(MD.ROBOT_MODELS[k]().g); g.push(MD.seeker().g); }
        if (list === 'hero') { g.push(MD.infiltrator().g, MD.infiltrator(0x6a3d3d, 0xffb347).g); for (const c of [0xffc040, 0x40c0ff, 0xff6040, 0x60ff90, 0xc080ff]) g.push(MD.pickup(c).g); }
        if (list === 'bosses') for (const k of Object.keys(BOSSES)) g.push(MD.boss(k).g);
        const wide = list === 'bosses' ? 5.2 : list === 'hero' ? 1.4 : 1.6;
        g.forEach((o, i) => { o.position.set((i - (g.length - 1) / 2) * wide, list === 'robots' && i === 7 ? 1.2 : 0, 0); o.rotation.y = 0.5; R.scene.add(o); });
        if (list === 'hero') { g[0].position.set(-1.2, 0, 0.6); g[1].position.set(1.2, 0, 0.6); g[0].scale.setScalar(1); }
        window.__gal = g;
        const span = (g.length - 1) * wide + 2;
        const cam = R.camera;
        cam.position.set(0, list === 'bosses' ? 9 : 2.6, list === 'bosses' ? 17 : span * 0.62 + 1.5); cam.lookAt(0, list === 'bosses' ? 1.6 : 0.8, 0); cam.fov = 40; cam.updateProjectionMatrix();
        for (let i = 0; i < 30; i++) R.render(1 / 60);
      }, { list });
      await page.screenshot({ path: `${shots}/${prefix}_gallery_${name}.png` });
      await page.evaluate(() => { const R = window.__vm.R; for (const o of window.__gal) R.scene.remove(o); for (const k of window.__hid) R[k].visible = true; for (const el of document.querySelectorAll('body > *:not(canvas)')) el.style.visibility = ''; window.__vm.G.state = 'play'; });
    }
  }
  if (want('fx')) {
    // telegraphs and effects mid-air: a boss attack, an EMP, a Seeker arriving
    for (const s of [2, 4]) {
      await setup({ s, seed: 90 + s, boss: true });
      await tick(420);
      await page.screenshot({ path: `${shots}/${prefix}_fx_boss_s${s + 1}.png` });
    }
    await setup({ s: 1, seed: 12, room: 1 });
    await tick(60);
    await page.evaluate(() => { const W = window.__vm.G.W; W.room.t = 999; });
    await tick(200);
    await page.screenshot({ path: `${shots}/${prefix}_fx_seeker.png` });
  }
  if (want('phone')) {
    await setup({ s: 3, seed: 43, room: 2 });
    await page.setViewportSize({ width: 412, height: 915 });
    await page.evaluate(() => { window.dispatchEvent(new Event('resize')); });
    await tick(150);
    await page.screenshot({ path: `${shots}/${prefix}_phone_portrait.png` });
    await page.setViewportSize({ width: 915, height: 412 });
    await page.evaluate(() => { window.dispatchEvent(new Event('resize')); });
    await tick(60);
    await page.screenshot({ path: `${shots}/${prefix}_phone_landscape.png` });
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.evaluate(() => { window.dispatchEvent(new Event('resize')); });
  }
  if (want('progs')) {
    // the AI PLAYTHROUGH at 6x sim speed: every sector, room, boss and effect, then endless floors
    const before = await page.evaluate(() => window.__vm.R.r.info.programs.length);
    const T = Date.now();
    await page.evaluate(() => { const vm = window.__vm; vm.toTitle(); vm.startPlaythrough(); });
    let last = '';
    for (let i = 0; i < 2000 && Date.now() - T < 330000; i++) {
      const st = await page.evaluate(() => {
        const vm = window.__vm, G = vm.G;
        for (let k = 0; k < 30; k++) { if (G.state === 'play') G.timeScale = 6; vm.tick(1); }
        const W = G.W;
        return { sector: W ? W.sector : -1, room: W ? W.roomN : -1, boss: !!(W && W.boss), progs: vm.R.r.info.programs.length, state: G.state, screen: G.screen, mode: G.mode };
      });
      const key = `S${st.sector + 1}${st.boss ? ' boss' : ''}`;
      if (key !== last) { console.log(`  ${key} room ${st.room}: programs ${st.progs} (${st.state}/${st.screen})`); last = key; }
      if (st.mode !== 'playthrough' || st.screen === 'results') break;
      if (st.state !== 'play') await sleep(250);   // let the between-sector timers run
    }
    await page.evaluate(async () => { const vm = window.__vm; vm.toTitle(); vm.startEndless(); const { Autopilot } = await import('./js/ai.js?v=5'); vm.G.ai = new Autopilot(0, 'demo'); vm.G.W.lives = 30; });
    for (let i = 0; i < 80; i++) await page.evaluate(() => { const vm = window.__vm; for (let k = 0; k < 30; k++) { vm.G.timeScale = 6; vm.tick(1); } });
    const after = await page.evaluate(() => ({ p: window.__vm.R.r.info.programs.length, floor: window.__vm.G.W.floor }));
    console.log(`fast autoplay ${((Date.now() - T) / 1000).toFixed(0)} s (endless floor ${after.floor + 1}): shader programs ${before} -> ${after.p}`);
    if (after.p !== before) { console.log('FAIL shader programs compiled after the warm-up'); fails++; }
  }
  const progs1 = await page.evaluate(() => window.__vm.R.r.info.programs.length);
  console.log(`shader programs at the end: ${progs1} (warm-up ${progs0})`);
  const pageErrs = await page.evaluate(() => window.__vmErrors || []);
  for (const e of [...errors, ...pageErrs]) console.log('ERROR', e);
  if (errors.length || pageErrs.length) fails++;
  console.log(fails ? 'LOOK CHECK FAILED' : 'look check passed');
} catch (e) { console.error(e); fails++; }
finally { if (browser) await browser.close(); release(); console.log(`edge lock held ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
process.exit(fails ? 1 : 0);
