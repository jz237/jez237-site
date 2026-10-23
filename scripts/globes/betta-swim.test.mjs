import test from 'node:test';
import assert from 'node:assert/strict';
import { BEHAVIORS, BETTA_SCALE, BettaSwim, GULP_LENGTH, MAX_SLOPE, MIN_LEG, MOUTH_DEPTH, REST_HEIGHT, STARTLE_COOLDOWN, STARTLE_LENGTH, STROKE_ACCEL, bettaMouthHeight, gulpGillCover, gulpMouth } from './src/fish/bettaSwim.mjs';
import { SwimGait } from '../betta-atelier/src/swim-gait.js';

const env = { radius: 0.95, sandLevel: -0.55, level: 0.181, iso: 0.5 };
const calm = (surface = env.level) => ({ flow: [0, 0, 0], angular: [0, 0, 0], submerged: 1, airAbove: 0, surface, sand: env.sandLevel, centroid: [0, -0.17, 0] });
const upright = { ...env, gravity: [0, -24, 0] };
const wrap = x => Math.atan2(Math.sin(x), Math.cos(x));

test('free swimming explores all three dimensions, rests and bursts without escaping', () => {
  for (const seed of [237, 42, 901]) {
    const s = new BettaSwim(seed), modes = new Set();
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    let still = 0, turns = 0;
    for (let i = 0; i < 60 * 240; i++) {
      const before = [...s.position], yaw = s.heading;
      s.advance(1 / 60, [0, 0, 0], env);
      modes.add(s.mode);
      assert.ok([...s.position, ...s.velocity, s.heading, s.pitch, s.drive].every(Number.isFinite));
      assert.ok(Math.hypot(...s.position) <= env.radius - 0.34 + 1e-8);
      assert.ok(s.position[1] >= env.sandLevel + 0.22 - 1e-8 && s.position[1] <= env.level - 0.20 + 1e-8);
      assert.ok(Math.hypot(...s.position.map((v, k) => v - before[k])) < 0.004);
      assert.ok(Math.abs(wrap(s.heading - yaw)) <= 3.01 / 60);
      if (Math.hypot(...s.velocity) < 0.004) still++;
      if (Math.abs(s.angularVelocity) > 0.5) turns++;
      for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], s.position[k]); max[k] = Math.max(max[k], s.position[k]); }
    }
    assert.ok(max[0] - min[0] > 0.5 && max[2] - min[2] > 0.5 && max[1] - min[1] > 0.14);
    assert.ok(still > 300 && turns > 300);
    assert.deepEqual([...modes].sort(), ['burst', 'cruise', 'glide', 'hover']);
  }
});

test('translation follows the nose and the bend tracks actual turn rate', () => {
  const s = new BettaSwim();
  for (let i = 0; i < 3000; i++) {
    const heading = s.heading;
    s.advance(1 / 60, [0, 0, 0], env);
    if (s.speed > 0.01) {
      const dot = s.velocity[0] * -Math.cos(s.heading) + s.velocity[2] * Math.sin(s.heading);
      assert.ok(dot > 0, 'backwards/sideways swimming');
    }
    assert.ok(Math.abs((s.heading - heading) * 60 - s.angularVelocity) < 1e-9);
  }
});

test('pause preserves pose, and 30/60/120 Hz runs follow the same route', () => {
  const at = hz => {
    const s = new BettaSwim();
    for (let i = 0; i < hz * 30; i++) s.advance(1 / hz, [0, 0, 0], env);
    const snapshot = JSON.stringify(s);
    s.advance(0, [0.5, 0.5, 0.5], env);
    assert.equal(JSON.stringify(s), snapshot);
    return s;
  };
  const reference = at(60);
  for (const hz of [30, 120]) {
    const s = at(hz);
    assert.ok(Math.hypot(...s.position.map((v, k) => v - reference.position[k])) < 0.02);
    assert.ok(Math.abs(wrap(s.heading - reference.heading)) < 0.08);
  }
});

test('strong/reversing water and dry probes stay within the usable water envelope', () => {
  const s = new BettaSwim();
  for (let i = 0; i < 7200; i++) {
    s.advance(1 / 30, [Math.sin(i / 31) * 0.6, Math.cos(i / 79) * 0.6, 0.6], env, i % 240 < 180);
    assert.ok(Math.hypot(...s.position) <= env.radius - 0.34 + 1e-8);
    assert.ok(s.position[1] >= env.sandLevel + 0.22 - 1e-8 && s.position[1] <= env.level - 0.20 + 1e-8);
  }
});

function runGulp(seconds, { water = () => calm(), environment = upright, seed = 237 } = {}) {
  const s = new BettaSwim(seed), log = [];
  for (let i = 0; i < seconds * 60; i++) {
    s.advance(1 / 60, [0, 0, 0], environment, true, water(i / 60));
    const mouth = bettaMouthHeight(s.position[1], s.pitch);
    log.push({ t: i / 60, mode: s.mode, mouth, gulp: s.gulp, gill: s.gulpGill, pitch: s.pitch, position: [...s.position] });
  }
  return { s, log };
}

test('the mouth and gill cycle opens, closes and pulses within the gulp', () => {
  assert.equal(gulpMouth(0), 0);
  assert.ok(gulpMouth(0.5) > 1.05 && gulpMouth(0.5) <= 1.1 + 1e-9);
  assert.ok(gulpMouth(GULP_LENGTH) < 1e-6 && gulpGillCover(GULP_LENGTH) < 1e-6);
  assert.ok(gulpGillCover(1.2) > 0.9 && gulpGillCover(0.5) === 0);
});

test('an upright calm globe sends the betta up to gulp air with its lips at the surface, then back down', () => {
  for (const seed of [237, 42, 901]) {
    const { log } = runGulp(240, { seed });
    const modes = new Set(log.map(r => r.mode));
    for (const m of ['rise', 'gulp', 'dive']) assert.ok(modes.has(m), `${seed} never reached ${m}`);
    const first = log.find(r => r.mode === 'rise');
    assert.ok(first.t > 15 && first.t < 45, `first trip at ${first.t}`);
    const trips = log.filter((r, i) => r.mode === 'rise' && log[i - 1]?.mode !== 'rise').length;
    assert.ok(trips >= 2 && trips <= 4, `trips ${trips}`);
    let open = 0, gill = 0;
    for (const r of log) {
      assert.ok(Number.isFinite(r.mouth) && r.position.every(Number.isFinite));
      assert.ok(r.mouth <= env.level + 0.006, `lips broke the surface by ${r.mouth - env.level}`);
      assert.ok(Math.hypot(...r.position) <= env.radius - 0.29 + 1e-8);
      if (r.mode === 'gulp') {
        assert.ok(Math.abs(r.mouth - (env.level - MOUTH_DEPTH)) < 0.012, `hold height ${r.mouth}`);
        assert.ok(r.pitch > 0.7);
        open = Math.max(open, r.gulp); gill = Math.max(gill, r.gill);
      }
    }
    assert.ok(open > 1 && gill > 0.9);
    // After a trip it is swimming below the surface again.
    const after = log.filter(r => r.mode === 'glide' || r.mode === 'cruise');
    assert.ok(after.every(r => r.mouth < env.level - 0.01));
  }
});

test('no measured surface, or a tilted globe, never triggers a trip; a lost surface aborts one', () => {
  for (const [name, options] of [
    ['no surface reading', { water: () => ({ ...calm(), surface: null }) }],
    ['tilted globe', { environment: { ...env, gravity: [-9, -22, 0] } }],
    ['sloshing surface', { water: () => calm(env.level + 0.06) }],
  ]) {
    const { log } = runGulp(240, options);
    assert.ok(log.every(r => !['rise', 'gulp', 'dive'].includes(r.mode)), name);
  }
  const { log } = runGulp(120, { water: t => calm(t < 40 ? env.level : null) });
  const mid = log.filter(r => r.t >= 22 && r.t < 40);
  assert.ok(log.some(r => r.mode === 'gulp'), 'precondition: a trip begins');
  assert.ok(log.filter(r => r.t > 45).every(r => !['rise', 'gulp'].includes(r.mode)));
  assert.ok(mid.length > 0 && log.every(r => Number.isFinite(r.gulp) && r.gulp < 1.11));
});

test('trips do not change the route when the surface is unmeasured', () => {
  const a = runGulp(60, { water: () => ({ ...calm(), surface: null }) }).s, b = new BettaSwim();
  for (let i = 0; i < 3600; i++) b.advance(1 / 60, [0, 0, 0], upright, true, { ...calm(), surface: null });
  assert.deepEqual(a.position, b.position);
});

// A shove: the water jumps by `flow` for half a second, as the probes read it after a knock.
function runShoves(seconds, shoves, { seed = 237, base = () => calm() } = {}) {
  const s = new BettaSwim(seed), log = [];
  for (let i = 0; i < seconds * 60; i++) {
    const t = i / 60, hit = shoves.find(h => t >= h.at && t < h.at + 0.5);
    s.advance(1 / 60, [0, 0, 0], env, true, { ...base(t), flow: hit?.flow ?? base(t).flow, angular: hit?.angular ?? base(t).angular });
    log.push({ t, mode: s.mode, heading: s.heading, speed: s.speed, steer: s.steerRate, position: [...s.position], drive: s.drive });
  }
  return log;
}

test('a sudden hard shove startles the betta: a fast C-bend, a dart, then a glide', () => {
  for (const [seed, flow] of [[237, [1.8, 0.2, 0.3]], [42, [-0.4, 0, 1.9]], [901, [0, 1.5, 0.1]]]) {
    const log = runShoves(30, [{ at: 12, flow }], { seed });
    const start = log.findIndex(r => r.mode === 'startle');
    assert.ok(start >= 0 && log[start].t < 12.2, `${seed}: no startle (first at ${log[start]?.t})`);
    const run = log.slice(start).filter((r, i) => log[start + i].t - log[start].t < STARTLE_LENGTH - 0.02);
    assert.ok(run.every(r => r.mode === 'startle'), 'the response is one continuous startle');
    const turned = Math.abs(wrap(log[start + 30].heading - log[start - 1].heading));
    assert.ok(turned >= 0.7 && turned <= 3, `${seed}: turned ${turned.toFixed(2)} rad in half a second`);
    assert.ok(Math.max(...run.map(r => Math.abs(r.steer))) > 5, 'a fast head-led swing, not an ordinary turn');
    assert.ok(Math.max(...run.map(r => r.speed)) > 0.2 && run.filter(r => r.t - log[start].t < 0.6).every(r => r.drive > 0.15), 'a dart');
    assert.ok(log.slice(start + 70, start + 130).every(r => r.mode === 'glide' || r.mode === 'cruise' || r.mode === 'hover'), 'it recovers');
    for (const r of log) assert.ok(Math.hypot(...r.position) <= env.radius - 0.34 + 1e-8 && r.position.every(Number.isFinite));
  }
});

test('steady currents, steady spin and gentle drags do not startle it; a second knock waits for the cooldown', () => {
  const quiet = [
    ['strong steady current', () => ({ ...calm(), flow: [0.9, 0.2, -0.6] })],
    ['steady spin', () => ({ ...calm(), angular: [0.2, 2.5, 0.1] })],
    ['gentle swell', () => ({ ...calm(), flow: [0.35 * Math.sin(0), 0, 0] })],
  ];
  for (const [name, base] of quiet) {
    assert.ok(runShoves(60, [], { base }).every(r => r.mode !== 'startle'), name);
  }
  assert.ok(runShoves(60, [{ at: 10, flow: [0.4, 0, 0.1] }, { at: 20, flow: [0.3, 0.1, 0] }]).every(r => r.mode !== 'startle'), 'gentle drags');
  const log = runShoves(60, [{ at: 10, flow: [2, 0, 0] }, { at: 14, flow: [2, 0, 0] }, { at: 10 + STARTLE_COOLDOWN + 4, flow: [0, 0, -2] }]);
  const starts = log.filter((r, i) => r.mode === 'startle' && log[i - 1]?.mode !== 'startle').map(r => r.t);
  assert.equal(starts.length, 2, `startles at ${starts}`);
  assert.ok(starts[0] < 10.2 && starts[1] > 10 + STARTLE_COOLDOWN && starts[1] < 10 + STARTLE_COOLDOWN + 4.2);
});

test('a startle while gulping air abandons the trip and closes the mouth', () => {
  const water = t => calm();
  const s = new BettaSwim(), log = [];
  for (let i = 0; i < 60 * 80; i++) {
    const t = i / 60, hit = s.mode === 'gulp' && s.gulpClock > 0.4 && !log.some(r => r.hit);
    s.advance(1 / 60, [0, 0, 0], upright, true, { ...water(t), flow: hit ? [2, 0, 0.4] : [0, 0, 0] });
    log.push({ t, mode: s.mode, gulp: s.gulp, hit, mouth: bettaMouthHeight(s.position[1], s.pitch) });
  }
  const i = log.findIndex(r => r.hit);
  assert.ok(i > 0, 'precondition: it reached the gulp');
  assert.ok(log.slice(i, i + 4).some(r => r.mode === 'startle'));
  assert.ok(log.slice(i + 60, i + 120).every(r => r.gulp < 0.2 && r.mode !== 'gulp'));
  assert.ok(log.every(r => r.mouth <= env.level + 0.006));
});

// Slow episodes: facing its reflection, a lap of the globe, resting on the sand.
function runBehaviors(seconds, { seed = 237, water = () => calm(), environment = upright } = {}) {
  const s = new BettaSwim(seed), log = [];
  for (let i = 0; i < seconds * 60; i++) {
    s.advance(1 / 60, [0, 0, 0], environment, true, water(i / 60));
    log.push({ t: i / 60, mode: s.mode, flaring: s.flaring, position: [...s.position], heading: s.heading, speed: s.speed, pitch: s.pitch, drive: s.drive });
  }
  return log;
}
const episodes = (log, mode) => {
  const out = [];
  log.forEach((r, i) => { if (r.mode === mode) { if (log[i - 1]?.mode === mode) out[out.length - 1].push(r); else out.push([r]); } });
  return out;
};
const bounds = { radius: env.radius - 0.34 };

test('near the glass it stops, faces its reflection and flares its fins, then leaves', () => {
  for (const seed of [237, 42, 901]) {
    const log = runBehaviors(600, { seed }), eps = episodes(log, 'mirror');
    assert.ok(eps.length >= 2, `${seed}: ${eps.length} reflection episodes`);
    eps.forEach((ep, n) => {
      const length = ep.at(-1).t - ep[0].t;
      assert.ok(length > 3 && length < 16, `${seed}: episode of ${length}s`);
      if (n) assert.ok(ep[0].t - eps[n - 1][0].t > 60, 'a cooldown between displays');
      const hold = ep.slice(ep.length >> 1);
      for (const r of hold) {
        const horizontal = Math.hypot(r.position[0], r.position[2]);
        const facing = (r.position[0] * -Math.cos(r.heading) + r.position[2] * Math.sin(r.heading)) / horizontal;
        assert.ok(r.flaring, 'flared while it faces the glass');
        assert.ok(Math.hypot(...r.position) > bounds.radius - 0.05, 'at the glass');
        assert.ok(facing > 0.5, `facing the glass (${facing.toFixed(2)})`);
        assert.ok(r.speed < 0.02, 'holding station');
      }
    });
    for (const r of log) {
      assert.ok(r.flaring === (r.mode === 'mirror' && r.flaring), 'flare only belongs to the display');
      assert.ok(Math.hypot(...r.position) <= env.radius - 0.29 + 1e-8 && r.position.every(Number.isFinite));
    }
    assert.ok(log.some(r => r.mode === 'mirror' && !r.flaring), 'it flares on approach, not before');
  }
});

test('a lap follows the glass in one direction at an easy pace', () => {
  for (const seed of [237, 42, 901]) {
    const log = runBehaviors(900, { seed }), eps = episodes(log, 'lap');
    assert.ok(eps.length >= 2, `${seed}: ${eps.length} laps`);
    let full = 0;
    for (const ep of eps) {
      let net = 0, total = 0;
      ep.forEach((r, i) => {
        if (!i) return;
        const d = wrap(Math.atan2(r.position[2], r.position[0]) - Math.atan2(ep[i - 1].position[2], ep[i - 1].position[0]));
        net += d; total += Math.abs(d);
        assert.ok(r.speed < 0.12 && Math.hypot(...r.position) <= bounds.radius + 1e-8, 'unhurried and inside the water');
      });
      assert.ok(Math.abs(net) > 0.8 * total - 0.5, `${seed}: it kept turning one way (${net.toFixed(2)} of ${total.toFixed(2)})`);
      if (Math.abs(net) > 4.5) full++;
    }
    assert.ok(full >= 1, `${seed}: no complete lap`);
  }
});

test('it sinks onto the sand, settles there without drifting, then lifts off', () => {
  for (const seed of [237, 42, 901]) {
    const log = runBehaviors(900, { seed }), eps = episodes(log, 'rest');
    assert.ok(eps.length >= 1, `${seed}: never rested`);
    for (const ep of eps) {
      const floor = env.sandLevel + 0.07, end = ep.at(-1), settled = ep.slice(-120);
      assert.ok(end.t - ep[0].t > 9, 'long enough to count as a rest');
      assert.ok(ep.every(r => r.position[1] >= floor - 1e-9));
      assert.ok(settled.every(r => Math.abs(r.position[1] - (env.sandLevel + REST_HEIGHT)) < 0.01 && r.speed < 0.01 && Math.abs(r.pitch) < 0.1), `${seed}: not settled on the bed`);
      const moved = Math.hypot(settled[0].position[0] - end.position[0], settled[0].position[2] - end.position[2]);
      assert.ok(moved < 0.03, `${seed}: crept ${moved} while resting`);
      assert.ok(settled.every(r => r.drive < 0.1), 'fins easy once it is down');
    }
    const lifted = log.find((r, i) => log[i - 1]?.mode === 'rest' && r.mode !== 'rest');
    assert.equal(lifted.mode, 'glide');
  }
});

test('without a measured, upright, wet globe none of these episodes happen', () => {
  for (const [name, options] of [
    ['tilted globe', { environment: { ...env, gravity: [-9, -22, 0] } }],
    ['no sand reading', { water: () => ({ ...calm(), sand: null }) }],
    ['partly dry', { water: () => ({ ...calm(), submerged: 0.8 }) }],
    ['air above', { water: () => ({ ...calm(), airAbove: 0.3 }) }],
  ]) {
    const log = runBehaviors(300, options);
    assert.ok(log.every(r => !BEHAVIORS.has(r.mode) && !r.flaring), name);
  }
  const s = new BettaSwim();
  for (let i = 0; i < 60 * 300; i++) { s.advance(1 / 60, [0, 0, 0], env); assert.ok(!BEHAVIORS.has(s.mode) && !s.flaring); }
});

// The locomotion driven by the real swim gait, as the page does: the gait's stroke goes back into advance().
const POSES = { hover: { scull: 1 }, gulp: { scull: 1 }, rise: { scull: 0.7 }, dive: { scull: 0.5 }, glide: { scull: 0.3 }, startle: { tuck: 1 }, mirror: { scull: 1 }, lap: { scull: 0.15 }, rest: { scull: 0.25 } };
const damp = (x, y, l, dt) => x + (y - x) * (1 - Math.exp(-l * dt));
function runStroked(seconds, { seed = 237, trips = false, water = () => calm() } = {}) {
  const s = new BettaSwim(seed), gait = new SwimGait(), dt = 1 / 60, log = [];
  let drive = 0.12, turn = 0;
  if (trips) s.nextGulp = 5;
  for (let i = 0; i < seconds * 60; i++) {
    if (trips && s.mode === 'dive') s.nextGulp = s.time + 8;
    const stroke = gait.stroke, before = s.speed, y0 = s.position[1];
    s.advance(dt, [0, 0, 0], upright, true, water(i / 60), stroke);
    drive = damp(drive, s.drive, 3, dt); turn = damp(turn, s.steerRate, 4, dt);
    gait.advance(dt, drive, Math.hypot(...s.velocity) / BETTA_SCALE, turn, POSES[s.mode] ?? {});
    const nose = [-Math.cos(s.heading) * Math.cos(s.pitch), Math.sin(s.pitch), Math.sin(s.heading) * Math.cos(s.pitch)];
    const axial = s.velocity.reduce((sum, v, k) => sum + v * nose[k], 0);
    const slip = Math.hypot(...s.velocity.map((v, k) => v - axial * nose[k]));
    log.push({ t: i / 60, mode: s.mode, stroke, gain: s.speed - before, own: s.speed, speed: Math.hypot(...s.velocity), slip, rise: s.position[1] - y0, y: s.position[1], pitch: s.pitch, settled: s.restSettled, restY: s.restY });
  }
  return log;
}

test('speed is only gained as fast as the stroke works, and a still tail does not move the fish', () => {
  for (const [stroke, gains] of [[0, false], [1, true]]) {
    const s = new BettaSwim(237);
    s.mode = 'cruise'; s.timer = 30; s.speed = 0; s.target = [0.3, s.position[1], 0.3]; s.nextGulp = 1e9;
    let top = 0;
    for (let i = 0; i < 60 * 3; i++) { const before = s.speed; s.advance(1 / 60, [0, 0, 0], upright, true, calm(), stroke); top = Math.max(top, s.speed); assert.ok(s.speed - before <= STROKE_ACCEL * stroke / 60 + 1e-9, 'gain per frame'); }
    assert.equal(top > 0.03, gains, `stroke ${stroke} reached ${top}`);
  }
  // With the gait feeding the stroke back, nothing but that gain moves it: the fish travels at its own speed.
  for (const seed of [237, 42]) {
    for (const r of runStroked(600, { seed, trips: true })) {
      assert.ok(r.gain <= STROKE_ACCEL * r.stroke / 60 + 1e-9, `${seed}: ${r.mode} at ${r.t.toFixed(1)} s gained ${r.gain.toFixed(4)} on a stroke of ${r.stroke.toFixed(2)}`);
      assert.ok(r.speed <= r.own + 0.002, `${seed}: ${r.mode} at ${r.t.toFixed(1)} s travelled ${r.speed.toFixed(3)} faster than it swims (${r.own.toFixed(3)})`);
    }
  }
});

test('every move is along the body axis through trips to the air and settling on the sand', () => {
  for (const seed of [237, 42, 901]) {
    const log = runStroked(600, { seed, trips: true });
    assert.ok(['rise', 'gulp', 'dive', 'rest'].every(m => log.some(r => r.mode === m)), `${seed}: precondition`);
    for (const r of log) assert.ok(r.slip < 0.008, `${seed}: ${r.mode} at ${r.t.toFixed(1)} s slid sideways at ${r.slip.toFixed(3)}`);
    // Once the way it carried into the hold has run out, holding at the film is not a slide.
    const held = episodes(log, 'gulp').flatMap(ep => ep.slice(36));
    assert.ok(held.length > 100 && held.every(r => Math.abs(r.rise) < 0.0004 && r.speed < 0.03), `${seed}: slid while holding at the film (${Math.max(...held.map(r => Math.abs(r.rise))).toFixed(5)})`);
    // Going down to rest, the nose leads.
    for (const ep of episodes(log, 'rest')) for (const r of ep.slice(60)) if (!r.settled && r.y - r.restY > 0.03) assert.ok(r.pitch < -0.05, `${seed}: sinking with the nose at ${r.pitch.toFixed(2)}`);
  }
});

test('leaving the film it turns over before it travels: no climb and no lunge while the head is still tipped up', () => {
  for (const seed of [237, 42, 901]) {
    const log = runStroked(120, { seed, trips: true }), start = log.findIndex((r, i) => r.mode === 'dive' && log[i - 1].mode !== 'dive');
    assert.ok(start > 0, `${seed}: no dive`);
    const first = log.slice(start, start + 18);
    assert.ok(first.every(r => r.rise < 0.0005), `${seed}: climbed on the way out`);
    assert.ok(first.every(r => r.speed < 0.06), `${seed}: lunged at ${Math.max(...first.map(r => r.speed)).toFixed(3)}`);
    assert.ok(log.slice(start + 60, start + 90).every(r => r.rise < 0), 'then it swims down');
  }
});

test('a tail that briefly clears the film does not drop the fish; a fish truly out of the water falls', () => {
  const fall = submerged => {
    const s = new BettaSwim(); s.mode = 'cruise'; s.timer = 30; s.nextGulp = 1e9;
    let fastest = 0;
    for (let i = 0; i < 60; i++) { s.advance(1 / 60, [0, 0, 0], upright, true, { ...calm(), submerged }); fastest = Math.min(fastest, s.drift[1]); }
    return fastest;
  };
  for (const submerged of [1, 0.9, 0.85, 0.7]) assert.ok(Math.abs(fall(submerged)) < 0.01, `submerged ${submerged} fell at ${fall(submerged)}`);
  assert.ok(fall(0.2) < -0.2 && fall(0) < -0.2, 'out of the water it falls');
});

test('it never circles its own tail: no long run of turning one way, in calm or turbulent water', () => {
  for (const [name, water] of [
    ['calm', () => calm()],
    ['turbulent', t => ({ ...calm(), flow: [0.5 * Math.sin(t / 3.1), 0.3 * Math.sin(t / 4.3), 0.5 * Math.cos(t / 5.2)], angular: [0.2 * Math.sin(t / 2.7), 0.4 * Math.sin(t / 3.3), 0.15 * Math.cos(t / 2.1)] })],
  ]) {
    for (const seed of [237, 42, 901, 31337]) {
      const s = new BettaSwim(seed), window = [];
      let net = 0, worst = 0;
      for (let i = 0; i < 60 * 600; i++) {
        const heading = s.heading;
        const t = i / 60, w = water(t);
        s.advance(1 / 60, w.flow, env, true, w);
        const turn = wrap(s.heading - heading);
        window.push(turn); net += turn;
        if (window.length > 480) net -= window.shift();
        worst = Math.max(worst, Math.abs(net));
      }
      assert.ok(worst < 2 * Math.PI, `${name} ${seed}: turned ${(worst / 2 / Math.PI).toFixed(2)} revolutions in 8 s`);
    }
  }
});

test('a goal it has to swim to is never straight overhead or underfoot', () => {
  for (const seed of [237, 42, 901]) {
    const s = new BettaSwim(seed), b = s.bounds(env);
    let ahead = 0;
    for (let n = 0; n < 400; n++) {
      s.position = [(s.random() - 0.5) * 1.1, b.low + (b.high - b.low) * s.random(), (s.random() - 0.5) * 1.1];
      if (Math.hypot(...s.position) > b.radius) continue;
      s.heading = s.random() * 6.28;
      s.chooseTarget(env);
      const d = s.target.map((v, k) => v - s.position[k]), leg = Math.hypot(d[0], d[2]);
      assert.ok(Math.abs(d[1]) <= MAX_SLOPE * leg + 0.05 + 1e-9, `${seed}: ${d.map(v => v.toFixed(2))} is too steep`);
      if (leg < MIN_LEG - 1e-9) ahead++;
    }
    assert.ok(ahead < 40, `${seed}: ${ahead} goals under ${MIN_LEG} away in plan`);
  }
});

test('too near the film to tip up to the lips, it swims on instead of rising', () => {
  const s = new BettaSwim();
  for (let i = 0; i < 120; i++) s.advance(1 / 60, [0, 0, 0], upright, true, calm());
  s.position[1] = env.level - 0.05; s.nextGulp = 0; s.mode = 'cruise'; s.timer = 10;
  s.advance(1 / 60, [0, 0, 0], upright, true, calm());
  assert.notEqual(s.mode, 'rise');
});

test('a knock or a dry film ends an episode on the spot', () => {
  for (const [mode, cut] of [['mirror', { flow: [2, 0, 0.4] }], ['rest', { flow: [0, 1.6, 0.3] }], ['lap', { flow: [1.8, 0.2, 0] }], ['mirror', { airAbove: 0.4 }]]) {
    const s = new BettaSwim();
    let t = 0;
    while (s.mode !== mode || (mode === 'mirror' && !s.flaring) || (mode === 'rest' && !s.restSettled)) { s.advance(1 / 60, [0, 0, 0], upright, true, calm()); assert.ok(++t < 60 * 400, `never reached ${mode}`); }
    s.advance(1 / 60, [0, 0, 0], upright, true, { ...calm(), ...cut });
    for (let i = 0; i < 6; i++) s.advance(1 / 60, [0, 0, 0], upright, true, { ...calm(), ...cut });
    assert.ok(!BEHAVIORS.has(s.mode) && !s.flaring, `${mode} went on after ${JSON.stringify(cut)}`);
    assert.ok(cut.flow ? s.mode === 'startle' : true);
  }
});
