// The sim's dispatches against the kernels they launch (src/sim/FluidSim.ts, Splash.ts): kernels
// that take two jobs in one dispatch (grid update and the cells' classification, the caustic map's
// resolve and the light volume's) find where the second's workgroups start as the dispatch lays
// them out, every kernel is launched in workgroups of its own size, and the density blur's run is
// chosen as its note says. A dispatch that missed a cell would leave it as it was, silently.
// Run: node --test sim-dispatch.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const sim = source('./src/sim/FluidSim.ts');
const splash = source('./src/sim/Splash.ts');
const shader = (name) => source(`./src/sim/shaders/${name}.wgsl`);
/** The workgroup size of a kernel's entry point. */
const size = (code, entry) => {
  const m = code.match(new RegExp(`@compute @workgroup_size\\(([^)]*)\\)\\s*\\nfn ${entry}\\(`));
  assert.ok(m, `no entry point ${entry}`);
  return m[1].split(',').map((v) => v.trim());
};

test("grid update's dispatch takes the faces, then the cells, where its shader looks for them", () => {
  assert.deepEqual(size(shader('grid_update'), 'gridUpdate'), ['8', '8', '4']);
  assert.match(shader('grid_update'), /let faces = 4u \* \(\(3u \* s \+ 3u\) \/ 4u\);\s+if \(gid\.z >= faces\) \{\s+cellClassify\(vec3u\(gid\.xy, gid\.z - faces\)\);/);
  assert.match(sim, /this\.run\(pass, 'gridUpdate', \[fg\[0\], fg\[1\], fg\[2\] \+ cg\[2\]\]\);/);
  assert.match(sim, /return \[Math\.ceil\(s \/ 8\), Math\.ceil\(s \/ 8\), Math\.ceil\(\(3 \* s\) \/ 4\)\];/);
  assert.match(sim, /return \[Math\.ceil\(n \/ 8\), Math\.ceil\(n \/ 8\), Math\.ceil\(n \/ 4\)\];/);
  for (let n = 16; n <= 160; n += 2) {
    const s = n + 1;
    const fg = [Math.ceil(s / 8), Math.ceil(s / 8), Math.ceil((3 * s) / 4)];
    const cg = [Math.ceil(n / 8), Math.ceil(n / 8), Math.ceil(n / 4)];
    // (The shader's faces' extent along z, in u32 arithmetic, is the dispatch's.)
    assert.equal(4 * Math.floor((3 * s + 3) / 4), 4 * fg[2]);
    // (The cells' workgroups reach every cell.)
    assert.ok(8 * fg[0] >= n && 8 * fg[1] >= n && 4 * cg[2] >= n);
  }
});

test("the caustic map's resolve takes the map's texels, then the light volume's voxels, where its shader looks for them", () => {
  assert.deepEqual(size(shader('caustic_resolve'), 'causticResolve'), ['256']);
  assert.match(shader('caustic_resolve'), /let texels = \(u32\(n \* n\) \+ 255u\) \/ 256u \* 256u;\s+if \(gid\.x >= texels\) \{\s+lightResolve\(gid\.x - texels\);/);
  assert.match(shader('light_resolve'), /if \(i >= n \* n \* n\) \{ return; \}/);
  assert.match(sim, /this\.run\(pass, 'causticResolve', \[Math\.ceil\(this\.causticN \*\* 2 \/ 256\) \+ Math\.ceil\(this\.lightN \*\* 3 \/ 256\), 1, 1\]\);/);
  for (const [map, volume] of [[256, 80], [192, 64], [512, 128], [100, 30]]) {
    assert.equal(Math.floor((map * map + 255) / 256) * 256, 256 * Math.ceil(map ** 2 / 256));
    assert.ok(256 * (Math.ceil(map ** 2 / 256) + Math.ceil(volume ** 3 / 256)) - 256 * Math.ceil(map ** 2 / 256) >= volume ** 3);
    // (One dimension of workgroups holds them all.)
    assert.ok(Math.ceil(map ** 2 / 256) + Math.ceil(volume ** 3 / 256) <= 65535);
  }
});

test("the density blur's run is as long as still gives its dispatch 512 workgroups, from 64 down to 16", () => {
  const code = sim.slice(sim.indexOf('function blurRun('), sim.indexOf('\n}', sim.indexOf('function blurRun(')) + 2);
  const blurRun = new Function(`${code.replace(/: number/g, '')}\nreturn blurRun;`)();
  // (A phone's map, 80 a side: 125 workgroups 22 slices long, not 50 of 70; the betta's desktop's.)
  assert.equal(blurRun(80), 16);
  assert.equal(blurRun(128), 16);
  assert.equal(blurRun(256), 64);
  const groups = (m, run) => Math.ceil(m / 16) ** 2 * Math.ceil(m / run);
  for (let m = 32; m <= 512; m += 8) {
    const run = blurRun(m);
    assert.ok([16, 32, 64].includes(run), `run ${run} for ${m}`);
    assert.ok(run === 16 || groups(m, run) >= 512, `${groups(m, run)} workgroups for ${m}`);
    assert.ok(run === 64 || groups(m, 2 * run) < 512, `a longer run than ${run} would do for ${m}`);
  }
  // (The shaders and their dispatch take the same run.)
  assert.match(sim, /\['blur', blurWGSL\(null, blurRun\(this\.renderN\)\), 'blur',/);
  assert.match(sim, /\['blurTex', blurWGSL\(this\.densityTexture\.format, blurRun\(this\.renderN\)\), 'blur',/);
  assert.match(sim, /\[Math\.ceil\(m \/ 16\), Math\.ceil\(m \/ 16\), Math\.ceil\(m \/ blurRun\(m\)\)\]/);
});

test("the sand's extension shares each column's surface across its workgroup's 16 x 16 and one round them", () => {
  const code = shader('sand_extend');
  assert.deepEqual(size(code, 'sandExtend'), ['16', '16']);
  assert.match(code, /var<workgroup> surface: array<f32, 324>;/);
  assert.match(code, /let o = vec2i\(wid\.xy\) \* 16 - vec2i\(1\);\s+for \(var k = li; k < 324u; k \+= 256u\) \{\s+let c = o \+ vec2i\(i32\(k % 18u\), i32\(k \/ 18u\)\);/);
  // (The column di, dj off a thread's is the one the tile holds there.)
  assert.match(code, /let k = u32\(i32\(lid\.x\) \+ 1 \+ di \+ 18 \* \(i32\(lid\.y\) \+ 1 \+ dj\)\);/);
  // (Every thread reaches the barrier: the map's edge is left only after it.)
  assert.ok(code.indexOf('workgroupBarrier();') < code.indexOf('if (i32(gid.x) >= n || i32(gid.y) >= n) { return; }'));
});

test('every splash kernel is launched in workgroups of its own size', () => {
  const code = shader('splash');
  for (const entry of ['spSpawn', 'spBubbles', 'spSpray', 'spDrops', 'spDropMap', 'spDropMerge', 'spBin']) {
    assert.deepEqual(size(code, entry), ['256'], entry);
    assert.match(splash, new RegExp(`this\\.run\\(pass, '${entry}', g\\([A-Z_ +]+\\)\\);`), entry);
  }
  assert.match(splash, /const g = \(n: number, w = 256\)/);
  assert.deepEqual(size(code, 'spWet'), ['16', '16']);
  assert.match(splash, /const wg = Math\.ceil\(WET_N \/ 16\);/);
  assert.deepEqual(size(code, 'spMapResolve'), ['16', '16']);
  assert.match(splash, /mapGroups: \[number, number, number\] = \[Math\.ceil\(DROP_MAP_N \/ 16\), Math\.ceil\(DROP_MAP_N \/ 16\), 1\];/);
  assert.deepEqual(size(code, 'spBinCount'), ['8', '8', '4']);
  assert.match(splash, /binGroups: \[number, number, number\] = \[Math\.ceil\(SPLASH_GRID \/ 8\), Math\.ceil\(SPLASH_GRID \/ 8\), Math\.ceil\(SPLASH_GRID \/ 4\)\];/);
});
