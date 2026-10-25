// The phone bowl's march band (src/render/marchBand.ts): where its water march can meet nothing,
// worked out once a frame from the density and the sand, so that the march steps over its samples
// there at once. That leaves out only reads that would have found nothing while the march reads
// and steps as the band takes it to, which is what these hold the renderer's own code to: the
// meniscus' lift between 0 and two capillary lengths, and none at all more than six from the glass
// (meniscus.ts: the kernels for the ray tracing hardware take that too, rt_regions.wgsl); the
// density read from its red channel, through that lift; and a whole step from two steps over the
// sand on. A change to any of them must go to marchBand.ts as well.
// Run: node --test march-band.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MENISCUS_WGSL } from './src/render/meniscus.ts';
import { globeConfig } from './src/config.ts';

const source = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const shaders = source('./src/render/shaders.ts');
const band = source('./src/render/marchBand.ts');
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);

/** A WGSL function's code, from its signature to its closing brace. */
function wgslFn(code, name) {
  const at = code.indexOf(`fn ${name}(`);
  assert.ok(at >= 0, `fn ${name} is missing`);
  return code.slice(at, code.indexOf('\n}', at) + 2);
}

// globes_meniscus, its WGSL run as JS (scalars all through, but for p.xz and the vec2f it
// returns), for a glass of this radius, capillary length and contact angle.
function meniscus(innerRadius, capillaryLength, contactAngle) {
  const js = MENISCUS_WGSL.replace('fn globes_meniscus(p: vec3f) -> vec2f', 'function globes_meniscus(p)').replace(/\blet\b/g, 'const');
  assert.ok(js.includes('function globes_meniscus(p)'), "globes_meniscus's signature has changed");
  const f = new Function('GLOBES_R_IN', 'GLOBES_CAP_LEN', 'GLOBES_CONTACT', 'vec2f', 'length', 'clamp', 'select', 'sqrt', 'max', 'sin', 'cos', 'exp', `${js}\nreturn globes_meniscus;`)(
    innerRadius, capillaryLength, contactAngle, (x, y = x) => [x, y], (v) => Math.hypot(...v), clamp, (a, b, c) => (c ? b : a), Math.sqrt, Math.max, Math.sin, Math.cos, Math.exp,
  );
  return (x, y, z) => f({ x, y, z, xz: [x, z] })[0];
}

test('the meniscus lifts the water by 0 to two capillary lengths, and not at all more than six from the glass', () => {
  const R = globeConfig.innerRadius;
  const lc = globeConfig.capillaryLength;
  // (The glass's own contact angle, and any other: the bounds come from the profile's shape.)
  for (const contact of [globeConfig.contactAngle, 0, Math.PI / 4, Math.PI / 2, 2, Math.PI]) {
    const lift = meniscus(R, lc, contact);
    let highest = 0;
    let lifted = 0;
    for (let i = 0; i <= 400; i++) {
      const y = R * (-1 + i / 200);
      const w = Math.sqrt(Math.max(R * R - y * y, 0));
      // (Out from the middle to the glass, closely near it, where the profile lives.)
      for (let j = 0; j <= 300; j++) {
        const r = j < 100 ? (w * j) / 100 : w - 8 * lc * (1 - (j - 100) / 200);
        if (r < 0) continue;
        const h = lift(r, y, 0);
        assert.ok(h >= 0 && h <= 2 * lc * (1 + 1e-12), `lift ${h} at y ${y}, r ${r}, contact ${contact}`);
        highest = Math.max(highest, h);
        if (h > 0) lifted++;
        // (marchBand.ts's open water is a ball in from the glass by six capillary lengths or more.)
        if (Math.hypot(r, y) < R - 6 * lc) assert.equal(h, 0, `lift ${h} at y ${y}, r ${r}, contact ${contact}`);
      }
    }
    // (There is a meniscus to check at all: the sweep reaches it.)
    if (contact === globeConfig.contactAngle) assert.ok(lifted > 0 && highest > 0.2 * lc, `highest lift ${highest}`);
  }
});

test("the march reads the water's density from its red channel, through the meniscus' lift, as the band does", () => {
  assert.match(wgslFn(shaders, 'globes_densRaw'), /return textureSampleLevel\(tex, smp, \(p - vol\.xyz\) \* vol\.w, 0\.0\)\.r;/);
  assert.match(wgslFn(shaders, 'globes_dens'), /return globes_densRaw\(tex, smp, p - vec3f\(0\.0, globes_meniscus\(p\)\.x, 0\.0\), vol\);/);
  assert.match(wgslFn(band, 'dens'), /return textureLoad\(densTex, vec3i\(x, y, z\), 0\)\.r;/);
  // (The march's samples are read through globes_dens, and are water where it is over iso.)
  const march = shaders.slice(shaders.indexOf('fn globes_trace('), shaders.indexOf('fn globes_shade('));
  assert.match(march, /dv = globes_dens\(densTex, densSamp, q, vol\);/);
  assert.match(march, /if \(\(dv > iso\) != inWater/);
});

test('the march takes whole steps from two steps over the sand on, and never longer ones', () => {
  // (The step at the end of the water march, which the band's jump takes whole steps in place of.)
  const march = shaders.slice(shaders.indexOf('fn globes_trace('), shaders.indexOf('fn globes_shade('));
  const steps = [...march.matchAll(/^\s*t \+= (.+);$/gm)].map((m) => m[1]).filter((e) => e.includes('above'));
  assert.equal(steps.length, 1, `the march's step: ${steps.join(' | ')}`);
  const step = new Function('above', 'stepLen', 'clamp', `return ${steps[0]};`);
  for (const stepLen of [0.6 * (2 / 128), 0.01, 0.05]) {
    for (let i = 0; i <= 1000; i++) {
      const above = stepLen * (2 + i / 10);
      assert.equal(step(above, stepLen, clamp), stepLen, `step ${step(above, stepLen, clamp)} at ${above} over the sand (step ${stepLen})`);
    }
    for (let i = 0; i <= 200; i++) {
      const above = stepLen * (-1 + i / 100);
      assert.ok(step(above, stepLen, clamp) <= stepLen, `step ${step(above, stepLen, clamp)} at ${above} over the sand (step ${stepLen})`);
    }
  }
});
