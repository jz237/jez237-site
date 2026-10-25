// The betta bowl's shaders against maths a GPU need not define. On Vulkan (the phones') atan2(0, 0)
// and a smoothstep whose edges run the wrong way round may give anything, a NaN among them, which
// the HDR target and its tone mapping turn into a black speck; so every atan2 in the bowl's passes
// is given its angle at the origin, and every smoothstep's edges rise. The passes' WGSL is made
// here as GlobeView makes it (the phone's and the desktop's, the fish's pass, the ?debug views),
// and so are the guards at its end (a colour that is not a number shows the backdrop) and the
// phone's drops drawn by how much of a pixel they cover (shaders.ts globes_dropAt), which the
// desktop's passes leave out.
// Run: node --test bowl-nan.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';

const here = dirname(fileURLToPath(import.meta.url));
const src = (path) => resolve(here, 'src', path).replaceAll('\\', '/');

/** Every pass of the bowl's, as GlobeView.makeMaterial builds it: name -> WGSL. (The renderer's
 *  modules, bundled for Node: their sim shaders read as text, as Vite's ?raw does.) */
async function bowlPasses() {
  const entry = `
import { envWGSL, globeHelpersWGSL, globeShadeWGSL } from '${src('render/shaders.ts')}';
import { bowlShape } from '${src('render/bowl.ts')}';
import { setScapeShader } from '${src('render/bowlScape.ts')}';
import { scapeShaderWGSL } from '${src('render/scape/scapeShader.mjs')}';
import { STUDIO_WGSL } from '${src('render/studio.ts')}';
import { globeConfig, lightConfig } from '${src('config.ts')}';
export function passes() {
  setScapeShader(scapeShaderWGSL());
  const out = { studio: STUDIO_WGSL };
  for (const lite of [true, false]) {
    const light = { ...lightConfig, sunDirection: [0, 1, 0], ...(lite ? { causticRays: 512 } : {}) };
    const globe = { ...globeConfig, maxTilt: (40 * Math.PI) / 180 };
    for (const debug of [0, 1, 2]) {
      // (And the phone's passes as the interleave draws them, writing what each ray ended on.)
      for (const ids of debug ? [false] : [false, true]) {
        const bowl = { ...bowlShape(globe, lite, debug), ids };
        for (const fish of [false, true]) {
          out[(debug ? 'debug' + debug + '-' : '') + (ids ? 'ids-' : '') + (fish ? 'bowlKoi-' : 'bowl-') + (lite ? 'lite' : 'full')] = globeShadeWGSL(false, false, false, true) + envWGSL(light) + globeHelpersWGSL(globe, light, fish, false, false, false, 1, false, false, null, bowl);
        }
      }
    }
  }
  return out;
}`;
  const plugin = {
    name: 'entry-and-raw',
    resolveId(id, importer) {
      if (id === 'entry') return '\0entry';
      if (id.endsWith('?raw')) return '\0raw:' + resolve(dirname(importer), id.slice(0, -4));
    },
    load(id) {
      if (id === '\0entry') return entry;
      if (id.startsWith('\0raw:')) return `export default ${JSON.stringify(readFileSync(id.slice(5), 'utf8'))};`;
    },
  };
  const bundle = await rolldown({ input: 'entry', platform: 'node', plugins: [plugin], transform: { define: { 'import.meta.env.DEV': 'false' } }, logLevel: 'silent' });
  const { output } = await bundle.generate({ format: 'esm' });
  await bundle.close();
  const mod = await import('data:text/javascript;base64,' + Buffer.from(output[0].code).toString('base64'));
  return mod.passes();
}

const passes = await bowlPasses();

/** The calls of fn in code: the function each is in, and its arguments' text. */
function callsOf(code, fn) {
  const calls = [];
  let inFn = '?';
  for (const line of code.split('\n').map((l) => l.replace(/\/\/.*$/, ''))) {
    const m = line.match(/^fn (\w+)/);
    if (m) inFn = m[1];
    for (let at = line.indexOf(fn + '('); at >= 0; at = line.indexOf(fn + '(', at + 1)) {
      if (/\w/.test(line[at - 1] ?? '')) continue;
      const args = [];
      let depth = 0;
      let cur = '';
      for (let i = at + fn.length + 1; i < line.length; i++) {
        const c = line[i];
        if (c === '(') depth++;
        if (c === ')' && depth-- === 0) break;
        if (c === ',' && depth === 0) {
          args.push(cur.trim());
          cur = '';
          continue;
        }
        cur += c;
      }
      args.push(cur.trim());
      calls.push({ inFn, args, line: line.trim() });
    }
  }
  return calls;
}

/** The f32 constants a pass declares: name -> value. */
function constants(code) {
  const out = {};
  for (const m of code.matchAll(/^const (\w+)\s*(?::\s*f32)?\s*=\s*(-?[\d.]+(?:e-?\d+)?);/gm)) out[m[1]] = Number(m[2]);
  return out;
}

/** An edge's value, its constants put in and any other quantity taken as the given positive
 *  value (null where it cannot be worked out: a call other than abs, min, max). */
function edgeValue(expr, consts, other) {
  if (/\b(?!abs\b|min\b|max\b)[a-z_]\w*\s*\(/i.test(expr.replace(/\b\d+(\.\d*)?(e-?\d+)?\b/g, ''))) return null;
  const js = expr.replace(/\b[A-Za-z_]\w*(?:\.\w+)*\b/g, (id) => (id in consts ? `(${consts[id]})` : ['abs', 'min', 'max'].includes(id) ? `Math.${id}` : `(${other})`));
  try {
    return Function(`return ${js};`)();
  } catch {
    return null;
  }
}

// (Off the paths the bowl's rays take through its air, at single points - a pellet's pole, the
// ocean globes' sky, a log's end grain on its axis - and drawn as they are.)
const ATAN2_ELSEWHERE = new Set(['food_trace', 'globes_oceanMap', 'scape_mat_woodEnd']);

test('every atan2 in the bowl is given an angle at the origin', () => {
  for (const [name, code] of Object.entries(passes)) {
    for (const { inFn, args, line } of callsOf(code, 'atan2')) {
      if (ATAN2_ELSEWHERE.has(inFn)) continue;
      // (atan2(y, select(x, 1e-20, x == 0.0 && y == 0.0)).)
      const [y, x] = args;
      const m = /^select\((.+), 1e-20, (.+) == 0\.0 && (.+) == 0\.0\)$/.exec(x);
      assert.ok(m && m[1] === m[2] && m[3] === y, `${name}, ${inFn}: atan2 left undefined at (0, 0): ${line}`);
    }
  }
});

test("every smoothstep's edges rise", () => {
  for (const [name, code] of Object.entries(passes)) {
    const consts = constants(code);
    let worked = 0;
    for (const { inFn, args, line } of callsOf(code, 'smoothstep')) {
      // (Each quantity tried at a few positive values; an edge that cannot be worked out - a
      // select, a call - is let be.)
      for (const v of [0.3, 1, 7]) {
        const [a, b] = [edgeValue(args[0], consts, v), edgeValue(args[1], consts, v)];
        if (a === null || b === null) break;
        worked++;
        assert.ok(a < b, `${name}, ${inFn}: smoothstep's edges (${args[0]}, ${args[1]}) do not rise: ${line}`);
      }
    }
    assert.ok(worked > 20, `${name}: too few smoothsteps worked out (${worked})`);
  }
});

test("the bowl's colour is guarded at its end, and the splash's spheres a pixel off are not shaded", () => {
  for (const [name, code] of Object.entries(passes)) {
    if (name === 'studio') continue;
    assert.match(code, /let bad = any\(\(bitcast<vec3u>\(col\) & vec3u\(0x7fffffffu\)\) >= vec3u\(0x7f800000u\)\);/, name);
    assert.match(code, /vec4f\(min\(col, vec3f\(60000\.0\)\),/, name);
    assert.match(code, /cover < 0\.5 \|\| bad\)/, name);
    assert.match(code, /if \(cover <= 0\.0\) \{ continue; \}\s*let nrm = normalize\(x - s\.xyz\);/, name);
  }
});

test("the phone's drops are drawn by their cover, the desktop's as they were", () => {
  for (const [name, code] of Object.entries(passes)) {
    if (name === 'studio') continue;
    const lite = name.endsWith('-lite');
    assert.equal(/fn globes_dropCover\(/.test(code), lite, name);
    // (The desktop's water over the glass as ever: its depth, slope and inside alone.)
    assert.equal(/struct GlobesDropH \{\s*h: f32,\s*slope: vec3f,\s*inside: f32,\s*\};/.test(code), !lite, name);
    assert.equal(/thr \*= drop\.seen;/.test(code), lite, name);
    assert.equal(/thr \*= far\.seen;/.test(code), lite, name);
    assert.ok(code.includes(lite ? 'globes_dropAt(dropTex, rot, p, ' : 'globes_dropAt(dropTex, rot, p);'), name);
  }
});

test('the ?debug views are in their own passes only', () => {
  for (const [name, code] of Object.entries(passes)) {
    const debug = /^debug(\d)/.exec(name)?.[1];
    assert.equal(/\bglobesDbg\b|\bdbg_\w+\(/.test(code), !!debug, name);
    if (!debug) continue;
    assert.match(code, /fn globes_bowlTracePlain\(/, name);
    // (specks paints what the rays met; nan only where the light stopped being a number.)
    assert.equal(code.includes('DBG_MET_TIR) != 0u'), debug === '1', name);
  }
  // Without the flag, a pass is the same as one made without it.
  assert.equal(passes['bowl-lite'].includes('globes_bowlTracePlain'), false);
});

// globes_dropCover, as JS (the drop round, or a streak): the pixel's shares of the drop's own water
// and of its streak's.
function dropCover(d, x, pix) {
  const smooth = (a, b, v) => {
    const t = Math.min(Math.max((v - a) / (b - a), 0), 1);
    return t * t * (3 - 2 * t);
  };
  const r0 = 0.5642 * pix;
  const m = Math.max(d.w, r0);
  const h = Math.min(d.w, r0);
  const head = ((d.w * d.w) / (m * m + 0.2 * h * h)) * (1 - smooth(m - h, m + h, Math.hypot(x[0] - d.c[0], x[1] - d.c[1])));
  const seg = [d.c[0] - d.t[0], d.c[1] - d.t[1]];
  const ss = seg[0] * seg[0] + seg[1] * seg[1];
  const k = Math.min(Math.max(((x[0] - d.t[0]) * seg[0] + (x[1] - d.t[1]) * seg[1]) / Math.max(ss, 1e-12), 0), 1);
  const ws = d.w * (d.line > 0 ? d.line : 1);
  const ml = Math.max(ws, 0.5 * pix);
  const hl = Math.min(ws, 0.5 * pix);
  const streak = (ws / ml) * Math.min(Math.sqrt(ss) / pix, 1) * (1 - smooth(ml - hl, ml + hl, Math.hypot(x[0] - d.t[0] - seg[0] * k, x[1] - d.t[1] - seg[1] * k)));
  return [head, Math.min(streak, 1 - head)];
}

// globes_dropLoss, and the light a drop drawn by its cover takes from the pixel (globes_dropAt): a
// trail's water, behind a running drop and all along a trail line, its own share.
const TRAIL_COS = 0.788;
const dropLoss = (c) => 0.03 + 0.9 * Math.max(1 - 0.5625 / Math.max(1 - c * c, 1e-4), 0);
function dropTaken(d, x, pix) {
  const [head, streak] = dropCover(d, x, pix);
  return dropLoss(d.line < 0 ? TRAIL_COS : d.cosT) * head + dropLoss(d.line !== 0 ? TRAIL_COS : d.cosT) * streak;
}

/** f summed over the pixels round the middle. */
const sum = (f) => {
  let s = 0;
  for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) s += f([x, y]);
  return s;
};
const covered = (d, pix) => sum((x) => dropCover(d, x, pix)[0] + dropCover(d, x, pix)[1]);

test("a drop drawn by its cover takes, over the pixels round it, just its own area's share", () => {
  const code = passes['bowl-lite'];
  const body = code.slice(code.indexOf('fn globes_dropCover('), code.indexOf('\n}', code.indexOf('fn globes_dropCover(')));
  assert.match(body, /let r0 = 0\.5642 \* pix;/);
  assert.match(body, /d\.w \* d\.w \/ \(m \* m \+ 0\.2 \* h \* h\)/);
  const pix = 1;
  for (const w of [0.05, 0.2, 0.4, 0.6, 1.5]) {
    for (const offset of [0, 0.37]) {
      const d = { c: [offset, 0.21], t: [offset, 0.21], w, line: 0 };
      const covers = covered(d, pix);
      // (Full cover clips a drop wider than the pixel a little at its middle.)
      assert.ok(Math.abs(covers - Math.PI * w * w) < 0.06 * Math.PI * w * w + 0.004, `w ${w}: covers ${covers.toFixed(4)} pixels, its area is ${(Math.PI * w * w).toFixed(4)}`);
    }
  }
  // A long thin streak across the pixels: its width over each of them.
  const line = { c: [3.2, 0.3], t: [-3.2, 0.3], w: 0.1, line: -1 };
  let column = 0;
  for (let y = -3; y <= 3; y++) column += dropCover(line, [0, y], pix)[1];
  assert.ok(Math.abs(column - 2 * line.w) < 0.02, `a streak's column covers ${column.toFixed(3)}`);
});

test("a running drop's trail takes a trail's share of the light, its head the head's", () => {
  const code = passes['bowl-lite'];
  assert.match(code, /const GLOBES_TRAIL_COS: f32 = 0\.788;/);
  assert.match(code, /fn globes_dropLoss\(c: f32\) -> f32 \{\s*return 0\.03 \+ 0\.9 \* max\(1\.0 - 0\.5625 \/ max\(1\.0 - c \* c, 1e-4\), 0\.0\);/);
  assert.ok(code.includes('seen *= 1.0 - globes_dropLoss(select(d.cosT, GLOBES_TRAIL_COS, d.line < 0.0)) * cover.x - globes_dropLoss(select(d.cosT, GLOBES_TRAIL_COS, d.line != 0.0)) * cover.y;'));
  assert.match(code, /return vec2f\(head, min\(streak, 1\.0 - head\)\);/);
  const pix = 1;
  // (A head standing steep, at 75 degrees: its rim turns back a good part of the light.)
  const cosT = Math.cos((75 * Math.PI) / 180);
  const running = { c: [3, 0.2], t: [-3, 0.2], w: 0.4, line: 0.4, cosT };
  assert.ok(dropLoss(cosT) > 0.3 && dropLoss(TRAIL_COS) === 0.03);
  for (const x of [[-2, 0], [0, 0], [1, 0]]) {
    const [head, streak] = dropCover(running, x, pix);
    assert.ok(head === 0 && streak > 0.15, `${x}: ${head}, ${streak}`);
    assert.ok(Math.abs(dropTaken(running, x, pix) - 0.03 * streak) < 1e-12, `${x}: the trail takes ${dropTaken(running, x, pix)}`);
  }
  const [head] = dropCover(running, [3, 0], pix);
  assert.ok(head > 0.3 && dropTaken(running, [3, 0], pix) > dropLoss(cosT) * head);
  // A trail line all along; a streak of a drop's own water (not running) at its own angle.
  const laid = { ...running, line: -1 };
  assert.ok(Math.abs(sum((x) => dropTaken(laid, x, pix)) - 0.03 * covered(laid, pix)) < 1e-9);
  const streak = { ...running, line: 0 };
  assert.ok(Math.abs(sum((x) => dropTaken(streak, x, pix)) - dropLoss(cosT) * covered(streak, pix)) < 1e-9);
});

test("a drop's edge across the pixel: the share inside it, short of its other edge", () => {
  const code = passes['bowl-lite'];
  assert.ok(code.includes('seen *= 1.0 - globes_dropLoss(H.cosT) * (smoothstep(-0.5 * pix, 0.5 * pix, H.inside) - smoothstep(-0.5 * pix, 0.5 * pix, H.inside - 2.0 * H.we));'));
  // (Of a running drop, the edge and the angle of the water reaching furthest past the point.)
  assert.match(code, /var wide = out;\s*if \(blob\.inside >= out\.inside\) \{ wide = blob; \}\s*if \(blob\.h >= out\.h\) \{ out = blob; \}\s*out\.inside = inside;\s*out\.we = wide\.we;\s*out\.cosT = wide\.cosT;/);
  assert.ok(code.includes('GlobesDropH(0.0, vec3f(0.0), we - dist, we, cosT)'));
  // Across a strip of water we wide (half), the pixels' shares sum to its width, however narrow
  // (the near edge's alone made one of no width a fifth of a pixel wide).
  const s = (v) => {
    const t = Math.min(Math.max(v + 0.5, 0), 1);
    return t * t * (3 - 2 * t);
  };
  for (const we of [0, 0.05, 0.15, 0.3, 0.5, 0.8]) {
    let shares = 0;
    let near = 0;
    for (let r = -3; r <= 3; r += 0.001) {
      const inside = we - Math.abs(r);
      shares += (s(inside) - s(inside - 2 * we)) * 0.001;
      near += s(inside) * 0.001;
    }
    assert.ok(Math.abs(shares - 2 * we) < 2e-3, `we ${we}: shares sum to ${shares.toFixed(4)}`);
    if (we === 0) assert.ok(Math.abs(near - 0.1875) < 2e-3, `${near}`);
  }
});
