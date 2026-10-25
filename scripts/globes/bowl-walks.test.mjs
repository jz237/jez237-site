// The betta bowl's walks in globes_trace (src/render/shaders.ts): in the air the march comes first
// and the walks (the furnishings', the fish's) look only as far as it got; where they meet
// something short of its last sample, it is marched again, stopping there. That leaves every
// picture as it was only while the margins agree: the march's samples stop 1e-4 short of where it
// stops, the walks' hit is judged by the same margin, and they look further past its last sample
// than that; and what they met is in the march's stop before the loop can end, as past the march
// the stop judges what the ray ends on. Each walk, and the march, is inlined once (compile time
// follows the inlined size). And ?walks=0 has them come first again, all of it on that one switch.
// Run: node --test bowl-walks.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const shaders = readFileSync(new URL('./src/render/shaders.ts', import.meta.url), 'utf8');
const trace = shaders.slice(shaders.indexOf('fn globes_trace('), shaders.indexOf('fn globes_shade('));
const count = (text, pattern) => text.match(pattern)?.length ?? 0;

test("the walks after the march judge what they meet by the march's own stop margin, and look past it", () => {
  const stop = trace.match(/^\s*t = min\(t, tStop - ([\d.e-]+)\);$/m);
  assert.ok(stop, "the march's stop");
  const judged = trace.match(/if \(!inWater && t <= met - ([\d.e-]+)\) \{ break; \}/);
  assert.ok(judged, "the walks' hit judged against the march's last sample");
  assert.equal(judged[1], stop[1]);
  const reach = trace.match(/reach = min\(reach, t \+ ([\d.e-]+)\);/);
  assert.ok(reach, 'how far past the last sample the walks look');
  // (Well past it: f32's rounding of t + reach, then of the hit - margin, is a few 1e-7 here.)
  assert.ok(Number(reach[1]) >= 2 * Number(stop[1]));
  // (In the stop before the loop can end there, the march taken or not: past it, the stop judges
  // whether the fish or the furnishings come first.)
  const taken = trace.indexOf('tStop = min(tStop, met);');
  assert.ok(taken > 0 && taken < judged.index);
});

test('in the bowl each walk and the march are inlined once', () => {
  // (The bowl's own setup before the loop: no walk there.)
  const setup = trace.slice(trace.indexOf('var reach = '), trace.indexOf("` : `", trace.indexOf('var reach = ')));
  assert.ok(setup.length > 0 && setup.length < 1000);
  assert.equal(count(setup, /_trace\(/g), 0);
  const loop = trace.slice(trace.indexOf('for (var step = select(0, 1, inWater); step < 3; step++)'), trace.indexOf('// (Passing close by the bed'));
  assert.ok(loop.length > 1000);
  assert.equal(count(loop, /scape_trace\(/g), 1);
  assert.equal(count(loop, /betta_trace\(/g), 1);
  assert.equal(count(trace, /for \(var it = 0; it < 768; it\+\+\)/g), 1);
});

test('?walks=0 has the walks come first again, as on the ray tracing hardware: all of it on that one switch', () => {
  assert.match(shaders, /const WALKS_LAST = new URLSearchParams\(globalThis\.location\?\.search\)\.get\('walks'\) !== '0';/);
  // (The helper, the walks' setup, the loop's head and its close: none without the others.)
  assert.equal(count(shaders, /\$\{bowl && !rt && WALKS_LAST \? `/g), 4);
  assert.equal(count(shaders, /\$\{bowl && !rt \? `/g), 0);
  // (Without it both walks look as far as the glass, before the march; it stops at their hit.)
  const setup = trace.indexOf('var reach = ');
  const first = trace.slice(trace.indexOf('` : `', setup), trace.indexOf('// The water march:', setup));
  assert.match(first, /bh = betta_trace\(bettaTex, p, dir, tWall\);/);
  assert.match(first, /let sc = scape_trace\(kelpPrimTex, p, dir, tWall\);/);
  assert.match(first, /let tStop = min\(\$\{bowl \? 'min\(bh\.t, sc\.t\)' : 'bh\.t'\}/);
});

test('globes_nextUp is the next f32 above a positive one', () => {
  assert.match(shaders, /fn globes_nextUp\(x: f32\) -> f32 \{\s*return bitcast<f32>\(bitcast<u32>\(x\) \+ 1u\);\s*\}/);
  const f = new Float32Array(1), u = new Uint32Array(f.buffer);
  for (const x of [1e-30, 1e-5, 0.25, 0.7, 1.0, 1.9, 1e9]) {
    f[0] = x;
    const y = f[0];
    u[0]++;
    const next = f[0], mid = Math.fround((y + next) / 2);
    assert.ok(next > y && (mid === y || mid === next), `${y} -> ${next}`);
  }
});
