// The phone's quality ladder and its controller (src/app/quality): the levels, the controller on
// made-up devices (a GPU whose cost is the sim, a fixed part and the bowl's traced pixels, as the
// controller models it, or not quite), and what the page keeps between visits.
// Run: node --test quality.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLadder, CPU_RUNGS, fixedCost, longestMarch, merge, PHONE, rayCost, simCost, tracedPx } from './src/app/quality/ladder.mjs';
import { BUDGET_MS, CostModel, QualityController, TARGET_MS, UP_MS } from './src/app/quality/controller.mjs';
import { deviceKey, keepCompileMs, keepLevel, keptCompileMs, priorLevel, priorSpeed, readRecord, RECORD_KEY, startLevel, UNKNOWN_SPEED, writeRecord } from './src/app/quality/record.mjs';

const REFRESH = 1000 / 60;
/** The S25 Ultra's screen, upright: the bowl's area at rest (CSS px^2, lid and all). */
const AREA = 108000;

/** A made-up phone: its sim, fixed and per-pixel costs (ms, ms per million traced pixels), its
 *  main thread's (ms), how they scale over time (heat), and the bowl's area on screen. */
function phone(o = {}) {
  return { t: 0, simMs: 5, fixedMs: 1, msPerMpx: 160, cpuMs: 2, area: AREA, restArea: AREA, timed: true, every: 2, heat: () => 1, perPx: () => 1, moving: () => false, extra: () => 0, n: 0, ...o };
}

/** A frame's GPU time on the phone at these knobs. */
function cost(dev, k, moving) {
  const heat = dev.heat(dev.t);
  const sim = dev.simMs * simCost(k) * heat * (moving ? 1.4 : 1);
  const draw = (dev.fixedMs * fixedCost(k) + dev.msPerMpx * dev.perPx(k) * tracedPx(k, dev.area)) * heat * (moving ? 1.4 : 1);
  return { sim, draw };
}

/** Runs the controller on the phone for `seconds`: frames come at whole refreshes (held to the
 *  knobs' fps; the screen's refreshes, 60 a second unless dev.refresh says), as long as the slower
 *  of the GPU and the main thread takes (or `interval`). Returns the moves. */
function run(c, dev, seconds) {
  const moves = [];
  const end = dev.t + seconds * 1000;
  while (dev.t < end) {
    const k = c.knobs;
    const moving = dev.moving(dev.t);
    const { sim, draw } = cost(dev, k, moving);
    const busy = Math.max(sim + draw, dev.cpuMs);
    const pace = 1000 / k.fps;
    const refresh = dev.refresh ?? REFRESH;
    dev.t += Math.max(pace, Math.ceil(busy / refresh - 1e-9) * refresh, dev.extra(dev.t));
    const timedNow = dev.timed && ++dev.n % dev.every === 0;
    const r = c.frame(dev.t, {
      cpu: dev.cpuMs,
      gpu: timedNow ? { sim, draw } : null,
      queue: dev.timed ? null : sim + draw,
      area: dev.area,
      restArea: dev.restArea,
      moving,
    });
    if (r) moves.push({ t: dev.t, level: c.level, cpu: c.cpuLevel, fps: r.fps, why: c.lastMove.why });
  }
  return moves;
}

const gpuAt = (dev, k) => {
  const { sim, draw } = cost(dev, k, false);
  return sim + draw;
};

/** The sharpest level that holds the budget on the phone as it is now (the truth the controller
 *  should find). */
function truth(levels, dev, ms = BUDGET_MS) {
  const l = levels.findIndex((k) => gpuAt(dev, k) <= ms);
  return l < 0 ? levels.length - 1 : l;
}

const LEVELS = buildLadder(2);

test('the ladder: sharpest first, the mirror then the ratio from the screen down to the floor, then the per-ray knobs', () => {
  const l = LEVELS;
  assert.deepEqual(l[0], { mirrorEvery: 1, plantEvery: 2, march: 0.6, fps: 60, ratio: 2 });
  assert.equal(l[1].mirrorEvery, 2);
  assert.equal(l[1].ratio, 2);
  const ratios = l.map((k) => k.ratio);
  // (Down by 0.9 at a time, through 1 CSS px, to the floor.)
  assert.ok(ratios.every((r, i) => i === 0 || r <= ratios[i - 1]));
  assert.ok(ratios.some((r) => Math.abs(r - 1) < 1e-9));
  assert.equal(Math.min(...ratios), 0.6);
  const floor = ratios.indexOf(0.6);
  assert.deepEqual(l.slice(floor + 1).map((k) => [k.march, k.plantEvery]), [[0.75, 2], [0.9, 2]]);
  // (Every level's knobs are the ones main.ts applies: none builds a pipeline.)
  for (const k of l) assert.deepEqual(Object.keys(k).sort(), ['fps', 'march', 'mirrorEvery', 'plantEvery', 'ratio']);
  // (Each rung costs no more than the one above it.)
  for (let i = 1; i < l.length; i++) assert.ok(tracedPx(l[i], AREA) * 0.9 + fixedCost(l[i]) <= tracedPx(l[i - 1], AREA) * 0.9 + fixedCost(l[i - 1]) + 1e-12);
  // (A screen of 1 CSS px starts there; one of 0.5 has no ratio steps.)
  assert.equal(buildLadder(1)[0].ratio, 1);
  assert.equal(buildLadder(0.5).filter((k) => k.march === 0.6).length, 2);
  assert.equal(longestMarch(PHONE), 0.9);
});

test('the main thread ladder only ever lessens what the GPU level asks for', () => {
  assert.deepEqual(merge(LEVELS[0], CPU_RUNGS[0]), LEVELS[0]);
  assert.equal(merge(LEVELS[0], CPU_RUNGS[1]).plantEvery, 3);
  assert.equal(merge(LEVELS[0], CPU_RUNGS[2]).fps, 30);
  assert.equal(merge(LEVELS[LEVELS.length - 1], CPU_RUNGS[0]).plantEvery, 2);
  assert.ok(rayCost({ march: 0.9 }) < rayCost({ march: 0.75 }) && rayCost({ march: 0.75 }) < rayCost({ march: 0.6 }));
  assert.equal(rayCost({ march: 0.6 }), 1);
});

test('the cost model finds the fixed part and the per-pixel cost from frames of different sizes', () => {
  const m = new CostModel(0.006);
  for (const x of [0.01, 0.02, 0.04, 0.06, 0.08, 0.1]) m.add(1, x, 1.2 + 150 * x);
  assert.ok(m.fit());
  assert.ok(Math.abs(m.a - 1.2) < 0.2, `a ${m.a}`);
  assert.ok(Math.abs(m.c - 150) < 5, `c ${m.c}`);
  // (All at one size: the fixed part is its prior, so many pixels' worth.)
  const one = new CostModel(0.006);
  for (let i = 0; i < 5; i++) one.add(1, 0.05, 10);
  one.fit();
  assert.ok(Math.abs(one.a - 0.006 * one.c) < 0.05 && Math.abs(one.a + one.c * 0.05 - 10) < 0.05, `a ${one.a} c ${one.c}`);
});

test('calibration goes straight to the sharpest level that fits, from wherever it started', () => {
  for (const start of [0, 9, LEVELS.length - 1]) {
    const dev = phone();
    const c = new QualityController(LEVELS, { level: start });
    const moves = run(c, dev, 3);
    const want = truth(LEVELS, dev, TARGET_MS);
    assert.ok(Math.abs(c.level - want) <= 1, `from ${start}: level ${c.level}, want ${want} (moves ${JSON.stringify(moves)})`);
    assert.ok(moves.length <= 1 && (moves.length === 0 || moves[0].why === 'calibrated'), JSON.stringify(moves));
    // (Its first frames as slow as they come: from the sharpest, 75 ms each.)
    assert.ok(moves.length === 0 || moves[0].t < 1500, `at ${moves[0]?.t}`);
  }
});

test('a calibration made wide of the mark as the bowl came into view is put right in its first second at rest', () => {
  // (The entrance: the bowl glides into view over 1.5 s; a pixel costs four times as much on the way
  // in - a GPU idling at small loads - as at rest.)
  const dev = phone({ msPerMpx: 60, moving: (t) => t < 1500, perPx: () => (dev.t < 1500 ? 4 : 1) });
  const c = new QualityController(LEVELS, { level: LEVELS.length - 1 });
  const entrance = (t) => Math.min(t / 1500, 1);
  const moves = [];
  while (dev.t < 8000) {
    dev.area = AREA * entrance(dev.t);
    moves.push(...run(c, dev, 0.05));
  }
  // (Calibrated too low - here, no higher than it started - then straight up, at rest.)
  assert.ok(moves.length <= 2 && moves.at(-1).why === 'calibrated at rest', JSON.stringify(moves));
  assert.ok(moves.at(-1).t < 5000);
  assert.ok(gpuAt(dev, c.knobs) <= BUDGET_MS);
  assert.ok(Math.abs(c.level - truth(LEVELS, dev, UP_MS)) <= 1, `level ${c.level}, truth ${truth(LEVELS, dev, UP_MS)}`);
});

test('a GPU over budget jumps down by as many rungs as the model predicts (three at most), then holds', () => {
  const dev = phone({ msPerMpx: 70 });
  const c = new QualityController(LEVELS, { level: 0 });
  run(c, dev, 20);
  const settled = c.level;
  // (Twice as costly a pixel, at once: a cliff, a hot phone.)
  dev.msPerMpx *= 2;
  const moves = run(c, dev, 30);
  // (Down in at most two moves - the first window may be part old frames - one of them a jump of
  // several rungs, none of more than three.)
  assert.ok(moves.length >= 1 && moves.length <= 2, JSON.stringify(moves));
  assert.ok(moves.every((m) => m.why === 'gpu over budget'));
  const jumps = moves.map((m, i) => m.level - (i ? moves[i - 1].level : settled));
  assert.ok(Math.max(...jumps) >= 2 && Math.max(...jumps) <= 3, `jumps ${jumps}`);
  assert.ok(gpuAt(dev, c.knobs) <= BUDGET_MS, `holds: ${gpuAt(dev, c.knobs)}`);
  assert.ok(c.level - truth(LEVELS, dev) <= 1, `level ${c.level}, truth ${truth(LEVELS, dev)}`);
  // (Then no more moves.)
  assert.deepEqual(run(c, dev, 60), []);
});

test('a phone that warms (40% slower over a minute) settles lower without going up and down', () => {
  const dev = phone({ msPerMpx: 90, heat: (t) => 1 + 0.4 * Math.min(t / 60000, 1) });
  const c = new QualityController(LEVELS, { level: 0 });
  const moves = run(c, dev, 300);
  const late = moves.filter((m) => m.t > 90000);
  assert.ok(late.length <= 1, `moves after it warmed: ${JSON.stringify(late)}`);
  assert.ok(gpuAt(dev, c.knobs) <= BUDGET_MS);
  // (Never up then down then up again: no level left and come back to more than once.)
  const levels = moves.map((m) => m.level);
  let turns = 0;
  for (let i = 2; i < levels.length; i++) if (Math.sign(levels[i] - levels[i - 1]) !== Math.sign(levels[i - 1] - levels[i - 2])) turns++;
  assert.ok(turns <= 2, `levels ${levels.join(' ')}`);
  // (Its memory: the level it held longest is where it sits.)
  assert.equal(c.heldLongest.level, c.level);
});

test('a try up that does not hold is taken back at once, and the next waits twice as long', () => {
  // (Past a ratio, a pixel costs twice as much: the model, fitted below it, cannot see it coming.)
  const cliff = 0.95;
  const dev = phone({ msPerMpx: 45, perPx: (k) => (k.ratio > cliff ? 2.4 : 1) });
  const c = new QualityController(LEVELS, { level: LEVELS.findIndex((k) => k.ratio < cliff) });
  const moves = run(c, dev, 400);
  const tries = moves.filter((m) => m.why === 'trying sharper');
  const backs = moves.filter((m) => m.why === 'try failed');
  assert.ok(tries.length >= 3 && backs.length >= 3, JSON.stringify(moves));
  const gaps = tries.slice(1).map((m, i) => m.t - tries[i].t);
  for (let i = 1; i < gaps.length; i++) assert.ok(gaps[i] >= gaps[i - 1] * 1.6 || gaps[i] >= 60000, `gaps ${gaps.join(', ')}`);
  assert.ok(Math.max(...gaps) <= 70000);
  // (Each back within a window or two of its try.)
  for (const b of backs) assert.ok(tries.some((t) => b.t - t.t > 0 && b.t - t.t < 2500));
  assert.ok(c.knobs.ratio < cliff);
});

test('sharpness comes back when there is room, a rung at a time', () => {
  const dev = phone();
  const c = new QualityController(LEVELS, { level: 0 });
  run(c, dev, 20);
  const before = c.level;
  dev.msPerMpx /= 2;
  const moves = run(c, dev, 120);
  assert.ok(c.level < before);
  assert.ok(moves.every((m) => m.why === 'trying sharper'), JSON.stringify(moves));
  assert.ok(gpuAt(dev, c.knobs) <= BUDGET_MS);
  // (Up to where the next rung is predicted past UP_MS.)
  assert.ok(c.level === 0 || gpuAt(dev, LEVELS[c.level - 1]) > UP_MS - 1, `level ${c.level}: ${gpuAt(dev, LEVELS[c.level - 1])}`);
});

test('a main thread too slow moves only its own ladder, and gives it back when it has room', () => {
  const dev = phone({ cpuMs: 22 });
  const c = new QualityController(LEVELS, { level: 0 });
  run(c, dev, 5);
  const level = c.level;
  const moves = run(c, dev, 30);
  assert.ok(moves.length >= 1 && moves.every((m) => m.why === 'main thread' && m.level === level), JSON.stringify(moves));
  assert.equal(c.cpuLevel, CPU_RUNGS.length - 1);
  assert.equal(c.knobs.fps, 30);
  dev.cpuMs = 3;
  run(c, dev, 60);
  assert.equal(c.cpuLevel, 0);
  assert.equal(c.level, level);
});

test('slow frames that neither the GPU nor the main thread explain: a rung after three windows, taken back if it bought nothing', () => {
  // (The compositor, say, shows only every other refresh, whatever is drawn.)
  const dev = phone({ msPerMpx: 20, extra: () => 2 * REFRESH });
  const c = new QualityController(LEVELS, { level: 0 });
  run(c, dev, 1);
  const level = c.level;
  const moves = run(c, dev, 120);
  assert.equal(moves[0].why, 'slow, not the gpu');
  assert.ok(moves[0].t > 3000);
  assert.equal(moves[1].why, 'bought nothing');
  assert.equal(c.level, level);
  // (And not tried again for a good while.)
  assert.ok(moves.filter((m) => m.why === 'slow, not the gpu').length <= 2);
});

test('while the bowl moves, a rung down at once if the GPU goes over, put back once it is still', () => {
  const dev = phone({ moving: (t) => t > 30000 && t < 40000 });
  const c = new QualityController(LEVELS, { level: 0 });
  run(c, dev, 25);
  const level = c.level;
  // (Held as sharp as it can: moving costs 40% more, over budget.)
  assert.ok(gpuAt(dev, c.knobs) * 1.4 > BUDGET_MS);
  const moves = run(c, dev, 30).filter((m) => m.t > 29000 && m.t < 43000);
  assert.equal(moves.length, 2, JSON.stringify(moves));
  assert.equal(moves[0].why, 'moving');
  assert.equal(moves[0].level, level + 1);
  assert.ok(moves[0].t > 30000 && moves[0].t < 30800);
  assert.equal(moves[1].why, 'still again');
  assert.equal(moves[1].level, level);
  assert.ok(moves[1].t > 41400 && moves[1].t < 42500);
});

test('zoomed in, or the phone turned, the bowl keeps about the same traced pixels', () => {
  const dev = phone({ msPerMpx: 100 });
  const c = new QualityController(LEVELS, { level: 0 });
  run(c, dev, 20);
  const px = tracedPx(c.knobs, dev.area);
  dev.area *= 2;
  dev.restArea *= 2;
  run(c, dev, 20);
  const zoomed = tracedPx(c.knobs, dev.area);
  assert.ok(Math.abs(zoomed / px - 1) < 0.3, `traced ${px} -> ${zoomed}`);
  assert.ok(gpuAt(dev, c.knobs) <= BUDGET_MS);
  // (Turned: the page restarts it, and the model puts it where the new view fits.)
  dev.area = dev.restArea = AREA * 0.7;
  c.restart(dev.t, null, dev);
  const turned = tracedPx(c.knobs, dev.area);
  assert.ok(Math.abs(turned / px - 1) < 0.3, `traced ${px} -> ${turned} turned`);
  assert.deepEqual(run(c, dev, 30).filter((m) => m.why !== 'trying sharper'), []);
});

test('a GPU too slow for the lowest level at 60 is held to 30, climbs there, and goes back to 60 when it can', () => {
  const dev = phone({ simMs: 9, msPerMpx: 300 });
  const c = new QualityController(LEVELS, { level: 0 });
  const moves = run(c, dev, 40);
  assert.ok(moves.some((m) => m.why === 'lowest level too slow'), JSON.stringify(moves));
  assert.equal(c.knobs.fps, 30);
  assert.ok(c.fps30);
  // (With twice the time, sharper than the lowest.)
  assert.ok(c.level < LEVELS.length - 1);
  assert.ok(gpuAt(dev, c.knobs) <= 2 * BUDGET_MS);
  assert.ok(c.describe(dev.t).some((l) => l.includes('30 fps')));
  // A cooler, quicker GPU: back to 60.
  dev.simMs = 3;
  dev.msPerMpx = 120;
  const back = run(c, dev, 60);
  assert.ok(back.some((m) => m.why === 'back to 60 fps'), JSON.stringify(back));
  assert.equal(c.knobs.fps, 60);
  assert.ok(gpuAt(dev, c.knobs) <= BUDGET_MS);
});

test('over the budget at the lowest level but quick enough for 60, it stays at 60', () => {
  // (The lowest level at about 15 ms: over 14.5, under a refresh.)
  const low = LEVELS[LEVELS.length - 1];
  const dev = phone({ simMs: 6 });
  dev.msPerMpx = (15 - 6 - fixedCost(low)) / tracedPx(low, AREA);
  const c = new QualityController(LEVELS, { level: 0 });
  run(c, dev, 60);
  assert.equal(c.level, LEVELS.length - 1);
  assert.equal(c.knobs.fps, 60);
  assert.ok(!c.fps30);
});

test('a warm phone on a fast screen whose lowest level misses 60 by a little keeps its frames as they come, not 30', () => {
  // (The lowest level at about 18 ms, as the S25 Ultra's was warm at 0.6: on its 120 Hz screen frames
  // land at 25 ms, 40 a second, which is better than 30 held.)
  const low = LEVELS[LEVELS.length - 1];
  const dev = phone({ simMs: 7.6, refresh: 1000 / 120 });
  dev.msPerMpx = (18 - 7.6 - fixedCost(low)) / tracedPx(low, AREA);
  const c = new QualityController(LEVELS, { level: 0 });
  run(c, dev, 60);
  assert.equal(c.level, LEVELS.length - 1);
  assert.equal(c.knobs.fps, 60);
  assert.ok(!c.fps30);
});

test('without timestamps it steers by the queue\'s pace', () => {
  const dev = phone({ timed: false });
  const c = new QualityController(LEVELS, { level: 0 });
  run(c, dev, 30);
  assert.ok(!c.timed);
  assert.ok(gpuAt(dev, c.knobs) <= BUDGET_MS);
  assert.ok(c.level - truth(LEVELS, dev) <= 2, `level ${c.level}, truth ${truth(LEVELS, dev)}`);
});

test('the HUD lines fit a phone held upright', () => {
  const dev = phone();
  const c = new QualityController(LEVELS, { level: 0 });
  run(c, dev, 20);
  for (const l of c.describe(dev.t)) assert.ok(l.length <= 52, `${l.length}: ${l}`);
  // (And at their longest: a slow GPU at 30, the main thread's ladder down too, a long while on.)
  Object.assign(c, { fps30: true, cpuLevel: 2, level: 13, last: { gpu: 112.7, sim: 15.6, draw: 97.1, cpu: 12.5, interval: 116.7, timed: true }, lastMove: { why: 'lowest level too slow', at: 0 } });
  c.held.set('13:30', 750000);
  for (const l of c.describe(dev.t + 999000)) assert.ok(l.length <= 52, `${l.length}: ${l}`);
  c.calibrating = true;
  for (const l of c.describe(dev.t)) assert.ok(l.length <= 52, `${l.length}: ${l}`);
});

test('storage that throws, or holds rubbish, starts afresh and is never fatal', () => {
  const throwing = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('full'); } };
  assert.equal(readRecord(throwing), null);
  assert.doesNotThrow(() => writeRecord(throwing, { devices: {} }));
  const junk = { getItem: () => '{not json', setItem() {} };
  assert.equal(readRecord(junk), null);
  assert.equal(readRecord({ getItem: () => '42' }), null);
  assert.equal(startLevel(null, 'k', 'tall', 'b', LEVELS, 7), 7);
  assert.equal(keptCompileMs(null, 'k'), null);
});

test('a kept level: where a view starts, a rung lower in another build, per device and way up', () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const info = { vendor: 'qualcomm', architecture: 'adreno-8xx', description: '' };
  const key = deviceKey(info, { width: 384, height: 693, devicePixelRatio: 2.8125 });
  assert.equal(key, deviceKey(info, { width: 693, height: 384, devicePixelRatio: 2.8125 }));
  writeRecord(storage, keepCompileMs(keepLevel(readRecord(storage), key, 'tall', 'build-1', 9), key, 8123.4));
  assert.ok(store.has(RECORD_KEY));
  const r = readRecord(storage);
  assert.equal(startLevel(r, key, 'tall', 'build-1', LEVELS, 3), 9);
  assert.equal(startLevel(r, key, 'tall', 'build-2', LEVELS, 3), 10);
  assert.equal(startLevel(r, key, 'wide', 'build-1', LEVELS, 3), 3);
  assert.equal(startLevel(r, 'another', 'tall', 'build-1', LEVELS, 3), 3);
  assert.equal(keptCompileMs(r, key), 8123);
  // (The lowest level kept, in a new build: no lower than the lowest.)
  assert.equal(startLevel(keepLevel(r, key, 'tall', 'build-1', LEVELS.length - 1), key, 'tall', 'build-2', LEVELS, 3), LEVELS.length - 1);
});

test('with nothing kept, a level from the GPU\'s name: quicker GPUs start sharper', () => {
  const name = (vendor, architecture, description = '') => ({ vendor, architecture, description });
  assert.equal(priorSpeed(name('qualcomm', 'adreno-8xx')), 1);
  assert.equal(priorSpeed(name('qualcomm', 'adreno-7xx')), 0.5);
  assert.equal(priorSpeed(name('arm', 'valhall', 'Mali-G78')), 0.3);
  assert.equal(priorSpeed(name('arm', 'valhall', 'Mali-G710')), 0.5);
  assert.equal(priorSpeed(name('arm', 'valhall', 'Immortalis-G720')), 0.5);
  assert.equal(priorSpeed(name('apple', 'metal-3')), 0.8);
  assert.equal(priorSpeed(name('', '')), UNKNOWN_SPEED);
  assert.equal(priorSpeed(null), UNKNOWN_SPEED);
  const speeds = [0.15, 0.25, 0.4, 0.5, 1, 2, 4];
  const levels = speeds.map((s) => priorLevel(LEVELS, s, AREA));
  for (let i = 1; i < levels.length; i++) assert.ok(levels[i] <= levels[i - 1], `levels ${levels.join(' ')}`);
  // (The S25 Ultra itself: a level its own costs predict to fit; the slowest, the lowest.)
  const s25 = LEVELS[priorLevel(LEVELS, 1, AREA)];
  assert.ok(5 + 1 * fixedCost(s25) + 160 * tracedPx(s25, AREA) <= TARGET_MS + 2);
  assert.equal(priorLevel(LEVELS, 0.05, AREA), LEVELS.length - 1);
});
