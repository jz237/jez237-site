// The phone's sim (src/sim/simTier.ts, FluidSim.runtime): ?simq picks round 2's settings (0) or the
// lighter ones (anything else, the default); main.ts takes a phone's config from it and gives the
// sim its runtime on phones alone, before its init(); the sim takes its sweeps from the runtime by
// how much the water moves, and its config's without one (the desktop's water as it was, to the
// bit: the det harnesses); the photons in two halves trace every ray of a frame pair once, and lay
// the light volume's from as many, where the resolves look for them; and the params the kernels
// share are laid out as FluidSim writes them.
// Run: node --test sim-tier.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PHONE_SIM, PHONE_SIMQ0, PHONE_SIMQ1, phoneRuntime } from './src/sim/simTier.ts';

const source = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const sim = source('./src/sim/FluidSim.ts');
const main = source('./src/main.ts');
const shader = (name) => source(`./src/sim/shaders/${name}.wgsl`);

test('?simq: round 2 at 0, the lighter settings otherwise', () => {
  assert.equal(phoneRuntime('0'), PHONE_SIMQ0);
  for (const q of [null, '', '1', '2', 'x']) assert.equal(phoneRuntime(q), PHONE_SIMQ1);
  // (Round 2's: the config's sweeps in every state, every photon, the bed every frame.)
  assert.deepEqual(PHONE_SIMQ0, { sweeps: [PHONE_SIM.pressureIterations, PHONE_SIM.pressureIterations, PHONE_SIM.pressureIterations], photonHalves: false, stillBedEvery: 1 });
  assert.deepEqual(PHONE_SIM, { gridRes: 40, maxSubsteps: 3, maxSubstepDt: 1 / 100, pressureIterations: 24, sandSubsteps: 6 });
  // (Fewer sweeps the calmer the water, never more than round 2's.)
  const [calm, moving, shake] = PHONE_SIMQ1.sweeps;
  assert.ok(calm <= moving && moving <= shake && shake <= PHONE_SIM.pressureIterations);
  assert.ok(PHONE_SIMQ1.stillBedEvery >= 1 && Number.isInteger(PHONE_SIMQ1.stillBedEvery));
});

test("main.ts: a phone's config from the tier, its runtime set on phones alone, before the sim's init", () => {
  assert.match(main, /const cfg = applyUrlOverrides\(LITE \? \{ \.\.\.base, \.\.\.PHONE_SIM \} : /);
  const set = main.indexOf("if (LITE) sim.runtime = phoneRuntime(params.get('simq'));");
  assert.ok(set > 0 && set < main.indexOf('await sim.init('));
});

test('the sim: sweeps and bed by its runtime, its config every frame without one', () => {
  assert.match(sim, /this\.lastSweeps = rt \? rt\.sweeps\[this\.agitation\] : cfg\.pressureIterations;/);
  assert.match(sim, /let sweeps = this\.lastSweeps;/);
  assert.match(sim, /const bedNow = !rt \|\| this\.stillFor < STILL_BED_AFTER \|\| \+\+this\.bedWaited >= rt\.stillBedEvery;/);
  // (The photons' second halves only where the runtime the sim was built with asks for them.)
  assert.match(sim, /this\.photonRoom = !!this\.runtime\?\.photonHalves;/);
  assert.match(sim, /return this\.photonRoom && this\.runtime\?\.photonHalves \? 1 \+ \(this\.frameIndex & 1\) : 0;/);
});

/** The struct's fields' float offsets, by WGSL's layout (scalars 4 bytes; vec3f and vec4f aligned
 *  to 16, a vec3f 12 long), and its size in floats. */
function layout(code) {
  const body = code.match(/struct SimParams \{([^}]*)\};/)[1];
  const at = {};
  let o = 0;
  for (const m of body.matchAll(/^\s*(\w+): (\w+),/gm)) {
    const [, name, type] = m;
    const size = type === 'vec3f' ? 3 : type === 'vec4f' ? 4 : 1;
    if (size > 1) o = Math.ceil(o / 4) * 4;
    at[name] = o;
    o += size;
  }
  return { at, size: Math.ceil(o / 4) * 4 };
}

test('the params: the struct as FluidSim writes it', () => {
  const { at, size } = layout(source('./src/sim/shaders/common.wgsl'));
  assert.equal(4 * size, Number(sim.match(/const PARAMS_SIZE = (\d+);/)[1]));
  assert.equal(at.photons, 116);
  assert.match(sim, /f\.set\(\[half, half === 2 \? 3 \* this\.causticN \*\* 2 : 0, half === 2 \? this\.lightN \*\* 3 : 0, this\.photonRoom && half > 0 \? 1 : 0\], 116\);/);
  assert.equal(at.sandMap + 2, 54);
  assert.equal(at.flipRatio, 18);
});

test("the photons in halves: every ray of a frame pair once, the light volume's from as many", () => {
  const code = shader('caustics');
  assert.match(code, /let half = u32\(P\.photons\.x\);\s+let row = select\(gid\.y, 2u \* gid\.y \+ half - 1u, half > 0u\);\s+if \(gid\.x >= N \|\| row >= N\) \{ return; \}/);
  assert.match(code, /let volPhoton = \(gid\.x & 1u\) == 0u && \(gid\.y & 3u\) == 0u;/);
  assert.match(code, /let idx = u32\(P\.photons\.y\) \+ 3u \* u32\(t\.x \+ n \* t\.y\);/);
  assert.match(code, /atomicAdd\(&lightAcc\[u32\(P\.photons\.z\) \+ u32\(v\.x \+ n \* \(v\.y \+ n \* v\.z\)\)\]/);
  assert.match(sim, /this\.run\(pass, 'caustics', \[rays, half > 0 \? Math\.ceil\(this\.light\.causticRays \/ 32\) : rays, 1\]\);/);
  for (const N of [512, 384, 256, 511, 100]) {
    const rays = Math.ceil(N / 16);
    // All of them in a frame: the volume's from the even columns of every fourth row.
    const full = new Map();
    let fullVol = 0;
    for (let y = 0; y < 16 * rays; y++) for (let x = 0; x < N; x++) {
      if (y >= N) continue;
      full.set(`${x},${y}`, 1);
      if ((x & 1) === 0 && (y & 3) === 0) fullVol++;
    }
    // In halves: each frame its own rows; together, each once.
    const seen = new Map();
    let halfVol = 0;
    for (const half of [1, 2]) {
      for (let gy = 0; gy < 16 * Math.ceil(N / 32); gy++) for (let x = 0; x < N; x++) {
        const row = 2 * gy + half - 1;
        if (row >= N) continue;
        const k = `${x},${row}`;
        seen.set(k, (seen.get(k) ?? 0) + 1);
        if ((x & 1) === 0 && (gy & 3) === 0) halfVol++;
      }
    }
    assert.equal(seen.size, full.size, `N ${N}`);
    assert.ok([...seen.values()].every((c) => c === 1), `N ${N}: a ray twice`);
    // (As many for the volume, to one row's: they carry 8x each either way.)
    assert.ok(Math.abs(halfVol - fullVol) <= N / 2, `N ${N}: ${halfVol} against ${fullVol}`);
    if (N % 8 === 0) assert.equal(halfVol, fullVol);
  }
});

test('the resolves add the second halves only while the photons go in halves, from where they lie', () => {
  const caustic = shader('caustic_resolve');
  const light = shader('light_resolve');
  assert.match(caustic, /if \(P\.photons\.w > 0\.0\) \{\s+let o = c \+ 3u \* u32\(n \* n\);/);
  assert.match(light, /if \(P\.photons\.w > 0\.0\) \{ acc \+= lightAcc\[i \+ n \* n \* n\]; \}/);
  // (Their blends: the full trace's as they were; more of the new in halves, half of it a frame old.)
  assert.match(caustic, /const CAUSTIC_BLEND: f32 = 0\.6;/);
  assert.match(light, /const LIGHT_BLEND: f32 = 0\.35;/);
  for (const [code, name] of [[caustic, 'CAUSTIC'], [light, 'LIGHT']]) {
    assert.ok(Number(code.match(new RegExp(`const ${name}_BLEND_HALVES: f32 = ([\\d.]+);`))[1]) > Number(code.match(new RegExp(`const ${name}_BLEND: f32 = ([\\d.]+);`))[1]));
  }
  // (The maps have room for both halves where the runtime asks for them; each frame's half emptied
  // before it is traced, the other too as the halves begin or end.)
  assert.match(sim, /causticAcc: make\('caustic photons', halves \* this\.causticN \* this\.causticN \* 12\),/);
  assert.match(sim, /lightAcc: make\('light photons', halves \* this\.lightN \*\* 3 \* 4\),/);
  assert.match(sim, /enc\.clearBuffer\(b\.causticAcc, at \* map, map\);\s+enc\.clearBuffer\(b\.lightAcc, at \* volume, volume\);\s+if \(this\.photonRoom && \(half > 0\) !== this\.photonHalvesWere\) \{/);
});
