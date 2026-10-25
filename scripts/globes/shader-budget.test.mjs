// The betta bowl's shaders stay quick to build (tools/shader-budget.mjs): a GPU's compiler copies
// every function into each place it is called from, so each of the bowl's passes, on the phone's
// tier and the desktop's, is held to a budget of code with every call expanded. The functions that
// were the most of it (the noises, the studio's look, the bowl's normals) are reached from one place
// each, in a loop the compiler cannot unroll back into the copies: one that starts at globesZero, a
// 0 that the bowl's passes set from a uniform (GlobeView's uBowlDetail.z).
// Run: node --test shader-budget.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as nodeModule from 'node:module';

// (The tool loads the renderer's TypeScript through node:module's hooks, new in Node 22.15: on an
// older Node these tests are skipped, saying why, rather than the file failing to load.)
const skip = typeof nodeModule.registerHooks === 'function' ? false : `needs Node 22.15 or later, for node:module's registerHooks (this is ${process.version})`;
const { BUDGET, bowlPasses, callGraph } = skip ? {} : await import('./tools/shader-budget.mjs');
const passes = skip ? {} : await bowlPasses();
const graphs = Object.fromEntries(Object.entries(passes).map(([name, wgsl]) => [name, callGraph(wgsl)]));

test('each of the bowl\'s passes inlines to no more than its budget', { skip }, () => {
  assert.deepEqual(Object.keys(graphs).sort(), Object.keys(BUDGET).sort());
  for (const [name, g] of Object.entries(graphs)) {
    console.log(`  ${name}: ${(g.inlined / 1000).toFixed(1)} K inlined (budget ${BUDGET[name] / 1000} K)`);
    assert.ok(g.inlined <= BUDGET[name], `${name}: ${g.inlined} > ${BUDGET[name]}`);
  }
});

test('the heavy functions are reached from one place in their callers, in a loop from globesZero', { skip }, () => {
  // (Caller, callee, the calls it makes in its body, the zero its loops start at. The noises take
  // the corners a pair at a time.)
  const sites = [
    ['globes_noise3', 'globes_hash3', 2, 'globesZero'],
    ['scape_noise3', 'scape_grad', 2, 'scapeZero'],
    ['globes_exitGlass', 'globes_bg', 1, 'globesZero'],
    ['globes_sandAtGlass', 'studio_view', 1, 'globesZero'],
    ['globes_sandDetailNormal', 'globes_sandRipple', 1, 'globesZero'],
    ['bowl_normal', 'bowl_sdf', 1, 'globesZero'],
    ['studio_view', 'studio_far', 1, null],
  ];
  for (const [name, g] of Object.entries(graphs)) {
    for (const [caller, callee, calls, zero] of sites) {
      const f = g.fns.get(caller);
      assert.ok(f, `${name}: ${caller} is not reached`);
      assert.equal(f.calls.get(callee), calls, `${name}: ${caller} calls ${callee}`);
      if (zero) {
        const loops = [...f.body.matchAll(/\bfor\s*\(\s*var\s+\w+\s*=\s*([^;]+);/g)].map((m) => m[1].trim());
        assert.ok(loops.length > 0 && loops.every((from) => from === zero), `${name}: ${caller}'s loops start at ${loops.join(', ')}`);
      }
    }
  }
});

test('the zeros are set from the bowl\'s uniform at the top of globes_shade, and nowhere else', { skip }, () => {
  for (const [name, wgsl] of Object.entries(passes)) {
    const shade = graphs[name].fns.get('globes_shade').body;
    const at = shade.indexOf('globesZero = i32(bowlDetail.z);');
    assert.ok(at >= 0 && at < shade.indexOf('globes_bowlTrace('), `${name}: globesZero is not set before the trace`);
    assert.ok(shade.indexOf('scapeZero = globesZero;') > at, `${name}: scapeZero is not set from it`);
    const code = wgsl.replace(/\/\/[^\n]*/g, '');
    for (const zero of ['globesZero', 'scapeZero']) {
      assert.equal(code.match(new RegExp(`\\b${zero}\\s*=[^=]`, 'g')).length, 1, `${name}: ${zero} is set more than once`);
      assert.ok(new RegExp(`var<private> ${zero}: i32 = 0;`).test(code), `${name}: ${zero} is not a private i32 that starts at 0`);
    }
  }
  // (GlobeView keeps the uniform's z at 0.)
  const view = readFileSync(new URL('./src/render/GlobeView.ts', import.meta.url), 'utf8');
  const sets = [...view.matchAll(/uBowlDetail\.value\.set\(([^)]*)\)/g)].map((m) => m[1].split(',').map((s) => s.trim()));
  assert.ok(sets.length > 0 && sets.every((args) => args.length === 4 && args[2] === '0'), 'uBowlDetail.z is not 0');
  assert.ok(!/uBowlDetail\.value\.(z|setZ|setComponent)\b/.test(view), 'uBowlDetail.z is set on its own');
  assert.ok(view.includes('bowlDetail: this.uBowlDetail'), 'the bowl\'s passes are not given uBowlDetail');
});
