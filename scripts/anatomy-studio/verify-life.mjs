/**
 * Playwright checks for the living body and for loading, split from verify.mjs so that either file can be run, and
 * fail, on its own. Same environment: STUDIO_URL (default http://127.0.0.1:8791/demos/anatomy-studio/), CHROME_PATH.
 * The motion is stepped by hand (window.anatomyStudio._advance) so the checks do not depend on the frame rate.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const SLOW = Number(process.env.STUDIO_SLOW) || 1;   // multiplies every wait: CI's small runners render several times slower

const url = process.env.STUDIO_URL || 'http://127.0.0.1:8791/demos/anatomy-studio/';
const HERE = path.dirname(fileURLToPath(import.meta.url)), DEMO = path.resolve(HERE, '../../demos/anatomy-studio');
const manifest = JSON.parse(await readFile(path.join(DEMO, 'manifest.json'), 'utf8'));
const budget = JSON.parse(await readFile(path.join(HERE, 'budget.json'), 'utf8'));
const args = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-gpu-sandbox'];
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH || undefined, headless: true, args}); { const open = browser.newPage.bind(browser); browser.newPage = async options => { const p = await open(options); p.setDefaultTimeout(30000 * SLOW); return p; }; }
const errors = [];
const ready = p => p.waitForFunction(() => document.body.dataset.ready === 'true', null, {timeout: 240000 * SLOW});
const full = p => p.waitForFunction(() => window.anatomyStudio.getState().stage === 'detail' && !window.anatomyStudio.getState().loading, null, {timeout: 240000 * SLOW});
try {
 // the assembled body is alive: the heart beats, the chest breathes, bone keeps its size, the limbs stay still, and exploding stops it all exactly
 const alive = await browser.newPage({viewport: {width: 1024, height: 800}}); alive.on('pageerror', e => errors.push(e.message)); alive.setDefaultTimeout(300000 * SLOW); /* software rendering can fall a minute behind, and a click waits for a steady frame */ await alive.goto(`${url}?quality=verify&stage=core&life=1`); await ready(alive);
 const motion = await alive.evaluate(() => { const A = window.anatomyStudio, ids = {lv: 'heart/left-ventricle', lung: 'visceral/inferior-lobe-of-left-lung', liver: 'visceral/liver', rib: 'skeletal/seventh-rib-l', sternum: 'skeletal/body-of-sternum', spine: 'skeletal/vertebra-t6', femur: 'skeletal/femur-l'};
  const at = Object.fromEntries(Object.entries(ids).map(([k, id]) => [k, A.getParts().findIndex(p => p.id === id)])), r = Object.fromEntries(Object.keys(ids).map(k => [k, {scale: [9, -9], move: 0}]));
  for (let i = 0; i < 100; i++) { A._advance(.1); const ps = A.getParts(); for (const k in ids) { const p = ps[at[k]], s = (p.scale[0] + p.scale[1] + p.scale[2]) / 3; r[k].scale = [Math.min(r[k].scale[0], s), Math.max(r[k].scale[1], s)]; r[k].move = Math.max(r[k].move, Math.hypot(...p.position.map((v, j) => v - p.base[j]))); } }
  return {r, life: A.getState().life}; });
 assert.ok(motion.life.on && motion.life.weight === 1 && motion.life.animated > 150, 'the assembled body is animated');   // about 240 pieces of the core systems; over 1,000 with everything loaded
 assert.ok(motion.r.lv.scale[0] < .95 && motion.r.lv.scale[1] > .999, `the ventricle contracts and relaxes (${motion.r.lv.scale})`);
 assert.ok(motion.r.liver.move > .012 && motion.r.liver.scale[0] === 1 && motion.r.liver.scale[1] === 1, 'the liver is pushed down by the diaphragm without changing size'); assert.equal(motion.r.lung.move, 0, 'the lungs are not moved as blocks: they follow per vertex in the shader'); assert.ok(motion.r.sternum.move > .003, 'the sternum swings forward');
 for (const k of ['rib', 'sternum', 'spine', 'femur']) assert.ok(motion.r[k].scale[0] > .9999 && motion.r[k].scale[1] < 1.0001, `bone keeps its size (${k})`);
 assert.ok(motion.r.rib.move > .0008 && motion.r.femur.move === 0 && motion.r.spine.move < .0005, 'ribs swing, the spine and limbs stay still');
 // the cost of one step of the motion stays small
 const cost = await alive.evaluate(() => window.anatomyStudio._bench(200)); assert.ok(cost < budget.motionMs, `one step of the living body takes ${cost.toFixed(2)} ms, over ${budget.motionMs} ms`);
 // the elbow: the forearm bends, the upper arm does not
 const arm = await alive.evaluate(() => { const A = window.anatomyStudio, f = id => A.getParts().findIndex(p => p.id === id), radius = f('skeletal/radius-l'), humerus = f('skeletal/humerus-l'); let a = 0, b = 0; for (let i = 0; i < 200; i++) { A._advance(.05); const ps = A.getParts(); a = Math.max(a, ps[radius].turned); b = Math.max(b, ps[humerus].turned); } return {a, b}; });
 assert.ok(arm.a > .02 && arm.a < .09 && arm.b < 1e-6, `the forearm bends a few degrees at the elbow (${arm.a})`);
 // conditions: an irregular rhythm has uneven gaps, a leaking valve never shuts, shallow breathing travels less than half as far
 const ill = await alive.evaluate(() => { const A = window.anatomyStudio, pick = id => { const el = document.getElementById('condition'); el.value = id; el.dispatchEvent(new Event('change')); }, res = {};
  pick('irregular'); { const gaps = []; let last = A.getState().life.beat, t = 0, at = 0; for (let i = 0; i < 1500; i++) { A._advance(1 / 60); t += 1 / 60; const b = A.getState().life.beat; if (b < last) { gaps.push(t - at); at = t; } last = b; } res.spread = Math.max(...gaps.slice(1)) - Math.min(...gaps.slice(1)); }
  pick('leak'); { let lo = 9; for (let i = 0; i < 120; i++) { A._advance(1 / 60); lo = Math.min(lo, A.getState().life.outflow); } res.leak = lo; }
  pick('shallow'); { let hi = 0; for (let i = 0; i < 400; i++) { A._advance(1 / 60); hi = Math.max(hi, A.getState().life.breath); } res.shallow = hi; }
  pick('normal'); res.back = [A.getState().life.bpm, A.getState().life.condition, document.getElementById('vitals-text').textContent]; return res; });
 assert.ok(ill.spread > .12, `an irregular rhythm has uneven gaps (${ill.spread})`); assert.ok(ill.leak >= .29, 'a leaking valve never quite shuts'); assert.ok(ill.shallow < .5, 'shallow breathing travels less than half as far');
 assert.deepEqual(ill.back.slice(0, 2), [70, 'normal']); assert.ok(/Healthy\. Heart 70 beats a minute/.test(ill.back[2]), 'the vitals are stated in words for a screen reader');
 // the sway and the head hold still under the pointer
 const held = await alive.evaluate(() => { const A = window.anatomyStudio, c = document.querySelector('#viewport canvas'); A._advance(3); c.dispatchEvent(new PointerEvent('pointerenter', {pointerType: 'mouse'})); A._advance(5); const during = A.getState().life.sway.map(Math.abs); c.dispatchEvent(new PointerEvent('pointerleave', {pointerType: 'mouse'})); return during; });
 assert.deepEqual(held, [0, 0], 'the body holds still while the pointer is over it');
 // sound: the two heart sounds are triggered on each beat
 await alive.locator('#sound-toggle').dispatchEvent('click'); await alive.evaluate(() => window.anatomyStudio._advance(3)); const heard = await alive.evaluate(() => window.anatomyStudio.getState().vitals); assert.ok(heard.sound && heard.thumps >= 4, `heart sounds are triggered (${heard.thumps})`); await alive.locator('#sound-toggle').dispatchEvent('click');
 // the rest of the body: it sways about the ankles, the eyes move, and a swallow lifts the hyoid
 const stance = await alive.evaluate(() => { const A = window.anatomyStudio, i = A.getParts().findIndex(p => p.id === 'skeletal/hyoid-bone'), j = A.getParts().findIndex(p => p.id === 'brain/iris-l'); let sway = 0, lo = 9, hi = -9, rise = 0, eye = 0; A.swallow();
  for (let k = 0; k < 300; k++) { A._advance(.05); const s = A.getState().life, ps = A.getParts(); sway = Math.max(sway, Math.abs(s.sway[0])); lo = Math.min(lo, s.gaze[0]); hi = Math.max(hi, s.gaze[0]); rise = Math.max(rise, ps[i].position[1] - ps[i].base[1]); eye = Math.max(eye, ps[j].turned); }
  return {sway, gaze: hi - lo, rise, eye}; });
 assert.ok(stance.sway > .03 && stance.sway < .4, `the body sways a fraction of a degree (${stance.sway})`); assert.ok(stance.gaze > .01 && stance.eye > .005, 'the eyes move'); assert.ok(stance.rise > .012 && stance.rise < .03, `a swallow lifts the hyoid (${stance.rise})`);
 // one heartbeat, held at each phase: the outflow valves are open only during ejection, the inflow valves only while the ventricles fill
 const beat = await alive.evaluate(() => { const A = window.anatomyStudio, find = id => A.getParts().findIndex(p => p.id === id), out = find('heart/anterior-semilunar-leaflet-of-pulmonary-valve'), inn = find('heart/septal-leaflet-of-right-atrioventricular-valve'), res = {};
  for (const ph of [.05, .165, .3, .5, .8]) { A.life.scrub(ph); A._advance(.2); const s = A.getState().life, ps = A.getParts(); res[ph] = [s.phase, s.outflow, s.inflow, +ps[out].turned.toFixed(2), +ps[inn].turned.toFixed(2)]; }
  A.life.scrub(null); return res; });
 assert.deepEqual(beat, {0.05: ['Atrial systole', 0, 1, 0, .9], 0.165: ['Isovolumetric contraction', 0, 0, 0, 0], 0.3: ['Ejection', 1, 0, 1, 0], 0.5: ['Isovolumetric relaxation', 0, 0, 0, 0], 0.8: ['Filling', 0, 1, 0, .9]}, 'valves open and shut in the right phases');
 // pace: the exercise preset, and the rate it actually runs at
 await alive.locator('[data-preset="exercise"]').dispatchEvent('click');
 const pace = await alive.evaluate(() => { const A = window.anatomyStudio; let beats = 0, last = A.getState().life.beat; for (let i = 0; i < 1200; i++) { A._advance(1 / 60); const b = A.getState().life.beat; if (b < last) beats++; last = b; } return {bpm: A.getState().life.bpm, beats}; });
 assert.equal(pace.bpm, 132); assert.ok(pace.beats >= 41 && pace.beats <= 47, `about 132 beats a minute (${pace.beats} in 20 s)`); await alive.locator('[data-preset="rest"]').dispatchEvent('click'); assert.equal((await alive.evaluate(() => window.anatomyStudio.getState().life.bpm)), 70);
 // the head turns, the neck bends with it, the eyes blink; the monitor draws and the blood-flow overlay is running
 await alive.locator('#monitor-toggle').dispatchEvent('click'); await alive.locator('#flow-toggle').dispatchEvent('click');
 const head = await alive.evaluate(() => { const A = window.anatomyStudio, find = id => A.getParts().findIndex(p => p.id === id), skull = find('skeletal/frontal-bone'), c4 = find('skeletal/vertebra-c4'), t1 = find('skeletal/vertebra-t1'); let a = 0, b = 0, c = 0, blink = 0; A.life.blink();
  for (let n = 0; n < 300; n++) { A._advance(.05); const ps = A.getParts(); a = Math.max(a, ps[skull].turned); b = Math.max(b, ps[c4].turned); c = Math.max(c, ps[t1].turned); blink = Math.max(blink, A.getState().life.blink); }
  return {a, b, c, blink, state: A.getState()}; });
 assert.ok(head.a > .01 && head.b > .003 && head.b < head.a && head.c < 1e-6, 'the head turns and the neck bends progressively'); assert.ok(head.blink > .85, `a blink closes (${head.blink})`);
 assert.ok(head.state.vitals.monitor && head.state.vitals.samples > 20, 'the monitor is drawing'); assert.ok(head.state.flow.shown && head.state.flow.particles > 100, 'blood flow is shown in the X-ray finish');
 await alive.evaluate(() => { window.anatomyStudio.setAmount(1); window.anatomyStudio._advance(5); });
 assert.deepEqual(await alive.evaluate(() => { const A = window.anatomyStudio; return [A.getState().life.weight, A.getParts().filter(p => p.scale.some(v => v !== 1)).length, A.getParts().filter(p => p.turned > 1e-6).length, ...A.getState().life.sway.map(Math.abs)]; }), [0, 0, 0, 0, 0], 'exploding stops the motion and restores every size and angle');
 await alive.close();
 // a lesson, on a page of its own (it fetches the rest of the body first): one stage of the beat loops with the monitor and the blood flow on, and ending it puts everything back
 // (clicks on these two pages are dispatched, not aimed: software rendering falls up to a minute behind at random, and an aimed click waits for a steady frame; verify.mjs covers real clicks)
 const lesson = await browser.newPage({viewport: {width: 1024, height: 800}}); lesson.on('pageerror', e => errors.push(e.message)); lesson.setDefaultTimeout(300000 * SLOW); await lesson.goto(`${url}?quality=verify&stage=core&life=1`, {timeout: 180000 * SLOW}); await ready(lesson);
 await lesson.locator('#lesson-beat').dispatchEvent('click'); await lesson.waitForFunction(() => window.anatomyStudio.getState().tour.active && !window.anatomyStudio.getState().loading, null, {timeout: 600000 * SLOW}); await lesson.locator('#tour-next').dispatchEvent('click'); await lesson.locator('#tour-next').dispatchEvent('click'); await lesson.waitForFunction(() => /Ejection/.test(document.getElementById('tour-title').textContent));
 const taught = await lesson.evaluate(() => { const A = window.anatomyStudio, seen = new Set(); for (let i = 0; i < 200; i++) { A._advance(1 / 30); seen.add(A.getState().life.phase); } const s = A.getState(); return {phases: [...seen], looping: s.life.looping, flow: s.flow.on, monitor: s.vitals.monitor, stops: s.tour.stops}; });
 assert.deepEqual(taught, {phases: ['Ejection'], looping: true, flow: true, monitor: true, stops: 6}, 'the ejection stage loops on its own');
 await lesson.locator('#tour-end').dispatchEvent('click'); await lesson.evaluate(() => window.anatomyStudio._advance(1));
 assert.deepEqual(await lesson.evaluate(() => { const s = window.anatomyStudio.getState(); return [s.tour.active, s.lesson, s.life.looping, s.flow.on, s.vitals.monitor, s.life.speed]; }), [false, null, false, false, false, 1], 'ending a lesson restores the view');
 await lesson.close();
 // a desktop link that opens in Organs & vessels loads what that finish shows and keeps the muscles back until a view needs them
 const lean = await browser.newPage({viewport: {width: 1280, height: 860}}); lean.on('pageerror', e => errors.push(e.message)); await lean.goto(`${url}?quality=verify&mode=organs`); await ready(lean);
 await lean.waitForFunction(() => { const x = window.anatomyStudio.getState(); return !x.loading && x.files.length === 9; }, null, {timeout: 240000 * SLOW}); assert.ok(!(await lean.evaluate(() => window.anatomyStudio.getState().files)).includes('muscular'), 'muscles wait');
 await lean.locator('[data-mode="realistic"]').click(); await full(lean); assert.equal((await lean.evaluate(() => window.anatomyStudio.getState().pieces)), manifest.pieces.length, 'a finish that shows muscles fetches them'); await lean.close();
 // embed: the stage and the explode slider, nothing else
 const embed = await browser.newPage({viewport: {width: 640, height: 420}}); embed.on('pageerror', e => errors.push(e.message)); await embed.goto(`${url}?quality=verify&stage=core&embed`, {timeout: 180000 * SLOW}); await ready(embed);
 assert.deepEqual(await embed.evaluate(() => [getComputedStyle(document.querySelector('.inspector')).display, getComputedStyle(document.querySelector('.topbar')).display, getComputedStyle(document.querySelector('.embed-link')).display, document.documentElement.scrollHeight <= innerHeight + 1, !!document.getElementById('explode').offsetParent]), ['none', 'none', 'block', true, true], 'the embed view is the stage, the slider and a link out');
 await embed.close();
 assert.deepEqual(errors, []);
 console.log(`PASS (life and loading): ${url} — breathing, heartbeat and valves by phase, pace, conditions, lessons, sway and holding still, head, neck and elbows, eyes and blinking, swallowing, monitor, blood flow, sound, motion cost, exact restoration on exploding, lean loading for Organs & vessels links.`);
} finally { await browser.close(); }
