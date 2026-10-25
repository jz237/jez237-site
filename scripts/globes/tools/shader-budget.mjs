// The betta bowl's shader budget. A GPU's shader compiler inlines every call (Adreno's and Mali's
// drivers do, and DXC), so the time a pipeline takes to build follows the size of its code with
// every call expanded where it is made, not the size of its text: a function called from forty
// places is compiled forty times. This builds the bowl's passes' WGSL here in Node, as
// GlobeView.makeMaterial does on the page (the phone's tier and the desktop's), and measures that
// inlined size: each function's own code (comments cut, white space squeezed, and the blocks behind
// a `const ...: bool` the pass sets false left out) times the call sites that reach it from
// globes_shade. A loop counts once: the compiler cannot unroll the ones that matter (globesZero,
// shaders.ts). shader-budget.test.mjs holds each pass to its BUDGET.
//
//   node tools/shader-budget.mjs [rows]
//
// prints each pass's sizes and the functions that make up most of it (own size times call sites).
// (Node 22.15 or later: it loads the renderer's TypeScript through node:module's hooks.)

import { registerHooks, stripTypeScriptTypes } from 'node:module';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** The most each pass may inline to (characters). */
export const BUDGET = { 'bowl-lite': 400_000, 'bowlKoi-lite': 400_000, 'bowl-full': 420_000, 'bowlKoi-full': 420_000 };

// (The renderer's modules import as Vite takes them: without extensions, a shader's text with
// ?raw, and TypeScript that only stripping its types would not run.)
registerHooks({
  resolve(spec, ctx, next) {
    if (spec.endsWith('?raw')) return { url: new URL(spec, ctx.parentURL).href, format: 'module', shortCircuit: true };
    if (spec.startsWith('.') && !/\.\w+$/.test(spec)) {
      for (const ext of ['.ts', '.mjs', '.js']) {
        const url = new URL(spec + ext, ctx.parentURL);
        if (existsSync(url)) return next(url.href, ctx);
      }
    }
    return next(spec, ctx);
  },
  load(url, ctx, next) {
    if (url.endsWith('?raw')) return { format: 'module', source: `export default ${JSON.stringify(readFileSync(new URL(url.slice(0, -4)), 'utf8'))};`, shortCircuit: true };
    if (url.endsWith('.ts')) return { format: 'module', source: stripTypeScriptTypes(readFileSync(new URL(url), 'utf8'), { mode: 'transform', sourceUrl: url }), shortCircuit: true };
    return next(url, ctx);
  },
});

/** The betta bowl's passes' WGSL (bowl and bowlKoi, the phone's tier and the desktop's), as the
 *  page builds them: its light and globe (main.ts), one ray a pixel, tracing in software. */
export async function bowlPasses() {
  const src = (path) => new URL(`../src/${path}`, import.meta.url).href;
  const { envWGSL, globeHelpersWGSL, globeShadeWGSL } = await import(src('render/shaders.ts'));
  const { bowlShape } = await import(src('render/bowl.ts'));
  const { setScapeShader } = await import(src('render/bowlScape.ts'));
  const { scapeShaderWGSL } = await import(src('render/scape/scapeShader.mjs'));
  const { globeConfig, lightConfig } = await import(src('config.ts'));
  setScapeShader(scapeShaderWGSL());
  const globe = { ...globeConfig, maxTilt: (40 * Math.PI) / 180 };
  const passes = {};
  for (const lite of [true, false]) {
    const light = { ...lightConfig, sunDirection: [0, 1, 0], ...(lite ? { causticRays: 512 } : {}) };
    const bowl = bowlShape(globe, lite);
    for (const withKoi of [false, true]) {
      passes[`bowl${withKoi ? 'Koi' : ''}-${lite ? 'lite' : 'full'}`] = [globeShadeWGSL(false, false, false, true), envWGSL(light), globeHelpersWGSL(globe, light, withKoi, false, false, false, 1, false, false, null, bowl)].join('\n');
    }
  }
  return passes;
}

/** Where the block whose opening brace is at code[open] ends (just past its closing brace). */
function blockEnd(code, open) {
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}' && --depth === 0) return i + 1;
  }
  throw new Error('shader-budget: unbalanced braces');
}

/** Where an if's condition, its parenthesis at code[open], ends (just past its closing one). */
function parenEnd(code, open) {
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    if (code[i] === '(') depth++;
    else if (code[i] === ')' && --depth === 0) return i + 1;
  }
  throw new Error('shader-budget: unbalanced parentheses');
}

/** A body with the branches its constants rule out cut: `if (C) {a} else {b}` (or `if (!C)`) left
 *  as a or b, whichever the pass takes. */
function prune(body, flags) {
  const re = /\bif\s*\(\s*(!?)\s*(\w+)\s*\)\s*\{/g;
  for (let m; (m = re.exec(body)); ) {
    if (!(m[2] in flags)) continue;
    const taken = flags[m[2]] !== (m[1] === '!');
    const thenOpen = m.index + m[0].length - 1;
    let end = blockEnd(body, thenOpen);
    let otherwise = '';
    const rest = /^\s*else\s*/.exec(body.slice(end));
    if (rest) {
      // (An else, or an else if and all that follows it.)
      let at = end + rest[0].length;
      const start = at;
      for (;;) {
        if (body[at] === '{') {
          at = blockEnd(body, at);
          break;
        }
        const cond = /^if\s*/.exec(body.slice(at));
        at = blockEnd(body, body.indexOf('{', parenEnd(body, at + cond[0].length)));
        const more = /^\s*else\s*/.exec(body.slice(at));
        if (!more) break;
        at += more[0].length;
      }
      otherwise = body.slice(start, at);
      end = at;
    }
    const kept = taken ? body.slice(thenOpen, blockEnd(body, thenOpen)) : otherwise;
    body = body.slice(0, m.index) + kept + body.slice(end);
    re.lastIndex = m.index;
  }
  return body;
}

/** A shader's call graph from entry: per function its own size (squeezed characters), the calls it
 *  makes and the call sites that reach it; and the whole as text, reachable from entry and fully
 *  inlined (characters). */
export function callGraph(wgsl, entry = 'globes_shade') {
  const code = wgsl.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  const flags = {};
  for (const m of code.matchAll(/\bconst\s+(\w+)\s*:\s*bool\s*=\s*(true|false)\s*;/g)) flags[m[1]] = m[2] === 'true';
  const fns = new Map();
  for (const m of code.matchAll(/\bfn\s+(\w+)\s*\(/g)) {
    const open = code.indexOf('{', m.index);
    fns.set(m[1], { body: prune(code.slice(open, blockEnd(code, open)), flags) });
  }
  const call = new RegExp(`\\b(${[...fns.keys()].join('|')})\\s*\\(`, 'g');
  for (const f of fns.values()) {
    f.own = f.body.replace(/\s+/g, ' ').length;
    f.calls = new Map();
    for (const m of f.body.matchAll(call)) f.calls.set(m[1], (f.calls.get(m[1]) ?? 0) + 1);
  }
  if (!fns.has(entry)) throw new Error(`shader-budget: no fn ${entry}`);
  // (WGSL has no recursion: callers come before their callees in this order.)
  const order = [];
  const seen = new Set();
  const visit = (name) => {
    if (seen.has(name)) return;
    seen.add(name);
    for (const g of fns.get(name).calls.keys()) visit(g);
    order.unshift(name);
  };
  visit(entry);
  for (const name of order) fns.get(name).sites = 0;
  fns.get(entry).sites = 1;
  for (const name of order) for (const [g, k] of fns.get(name).calls) fns.get(g).sites += fns.get(name).sites * k;
  const reachable = order.reduce((a, name) => a + fns.get(name).own, 0);
  const inlined = order.reduce((a, name) => a + fns.get(name).own * fns.get(name).sites, 0);
  return { text: code.replace(/\s+/g, ' ').length, reachable, inlined, fns: new Map(order.map((name) => [name, fns.get(name)])) };
}

// (Run itself, not imported by the test.)
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const rows = Number(process.argv[2] ?? 12);
  for (const [name, wgsl] of Object.entries(await bowlPasses())) {
    const g = callGraph(wgsl);
    console.log(`${name}: ${(g.inlined / 1000).toFixed(1)} K inlined (budget ${BUDGET[name] / 1000} K), from ${(g.reachable / 1000).toFixed(1)} K reachable of ${(g.text / 1000).toFixed(1)} K text`);
    const top = [...g.fns].map(([fn, f]) => [fn, f.own, f.sites]).sort((a, b) => b[1] * b[2] - a[1] * a[2]).slice(0, rows);
    for (const [fn, own, sites] of top) console.log(`  ${fn.padEnd(28)} ${String(own).padStart(6)} x ${String(sites).padStart(3)} = ${((own * sites) / 1000).toFixed(1).padStart(6)} K`);
  }
}
