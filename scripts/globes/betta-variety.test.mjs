// The betta's varieties (src/fish/varieties.mjs, bettaPaint.mjs, bettaWGSL.ts): each is listed once,
// with a swatch and a Learn card; the choice is kept on the device, a storage that throws or a name it
// does not know meaning Classic; Classic's numbers leave the fish to the photographs, and the shader
// reads a variety's only behind its gate; a variety's maps, painted on photographs of even brightness,
// give back its colours, counter-shaded, its broad light and shade divided out where the photographs
// have it, a marble's patches covering about what they should.
// Run: node --test betta-variety.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { keepVariety, keptVariety, linearOf, parseVariety, STORAGE_KEY, VARIETIES, varietyLook, varietyOf } from './src/fish/varieties.mjs';
import { CAUDAL, caudalCells, MACRO, measure, painting, PROFILE, profileCells } from './src/fish/bettaPaint.mjs';
import { bettaBowlWGSL, bettaLiteWGSL, bettaWGSL } from './src/fish/bettaWGSL.ts';
import { FISH } from './src/app/learn/content.ts';

/** A variety's maps, painted to the end (a row at a time, as the page paints them over frames). */
function paint(variety, field) {
  const rows = painting(variety, field);
  let r = rows.next();
  while (!r.done) r = rows.next();
  return r.value;
}

/** A storage that keeps what it is given, or one that throws at every touch. */
const memory = () => {
  const kept = new Map();
  return { getItem: (k) => kept.get(k) ?? null, setItem: (k, v) => kept.set(k, String(v)), kept };
};
const blocked = () => {
  throw new Error('storage blocked');
};

test('every variety is listed once, Classic first, with a two-colour swatch and a short Learn card', () => {
  assert.equal(VARIETIES[0].id, 'classic');
  assert.equal(new Set(VARIETIES.map((v) => v.id)).size, VARIETIES.length);
  assert.equal(new Set(VARIETIES.map((v) => v.name)).size, VARIETIES.length);
  const hex = /^#[0-9a-f]{6}$/;
  for (const v of VARIETIES) {
    assert.equal(v.swatch.length, 2, v.id);
    for (const c of v.swatch) assert.match(c, hex, v.id);
    const card = FISH[v.id];
    assert.ok(card, `${v.id}: no card`);
    // (As learn.test.mjs holds every card: a title of a line, a few sentences.)
    assert.ok(card.title.length <= 48, `${v.id}: title of ${card.title.length}`);
    assert.ok(card.body.length <= 245, `${v.id}: body of ${card.body.length}`);
    assert.ok(card.body.split(/(?<=[.!?])\s+/).length <= 4, `${v.id}: more than four sentences`);
    assert.ok(card.title.includes('Betta splendens'), v.id);
    if (v.id === 'classic') continue;
    // Its card names it; its colours are all colours.
    assert.ok(card.title.includes(v.name.split(' ')[0]), `${v.id}: its card does not name it`);
    for (const c of [...Object.values(v.body), ...Object.values(v.fins)]) assert.match(c, hex, v.id);
    for (const c of [v.sheen?.tint, v.band?.colour, v.coat?.colour, ...(v.patches?.colours.map(([c]) => c) ?? [])].filter(Boolean)) assert.match(c, hex, v.id);
  }
  assert.deepEqual(Object.keys(FISH).sort(), VARIETIES.map((v) => v.id).sort());
});

test('the choice is kept on the device; blocked storage, or a name it does not know, is Koi Marble', () => {
  const s = memory();
  assert.equal(keptVariety(() => s), 'koi', 'a first visit');
  keepVariety(() => s, 'classic');
  assert.equal(s.kept.get(STORAGE_KEY), 'classic');
  assert.equal(keptVariety(() => s), 'classic');
  s.setItem(STORAGE_KEY, 'neon-tetra');
  assert.equal(keptVariety(() => s), 'koi');
  keepVariety(() => s, 'neon-tetra');
  assert.equal(s.kept.get(STORAGE_KEY), 'koi', 'only a variety is kept');
  // (Storage blocked: nothing throws, nothing is kept.)
  assert.doesNotThrow(() => keepVariety(blocked, 'copper'));
  assert.equal(keptVariety(blocked), 'koi');
  const throwsOnRead = { getItem: blocked, setItem: () => {} };
  assert.equal(keptVariety(() => throwsOnRead), 'koi');
  for (const v of VARIETIES) assert.equal(parseVariety(v.id), v.id);
  assert.equal(parseVariety(null), 'koi');
  assert.equal(varietyOf('nonsense').id, 'koi');
});

test('Classic leaves the fish to its photographs: its numbers are off, and the shader reads a variety only behind its gate', () => {
  const look = varietyLook(varietyOf('classic'), { gain: 30, body: 0.08, fins: 0.06 });
  assert.equal(look[0], 0, 'how much of the variety shows');
  assert.equal(look[7], 0, 'the sheen\'s share');
  assert.ok(look[11] > 1, 'a band past every fringe');
  assert.ok(look[15] < -5, 'a coat no scale reaches');
  // The bowl's fish reads bettaLook in two places only outside `if (look)`: the gate itself, and the
  // shadow's tint (the photographs' tiles unless the gate is open).
  for (const wgsl of [bettaBowlWGSL, bettaLiteWGSL]) {
    const code = wgsl.replace(/\/\/[^\n]*/g, '');
    const gated = [];
    for (let at = code.indexOf('if (look) {'); at >= 0; at = code.indexOf('if (look) {', at + 1)) {
      let depth = 0, i = code.indexOf('{', at);
      for (; i < code.length; i++) {
        if (code[i] === '{') depth++;
        else if (code[i] === '}' && --depth === 0) break;
      }
      gated.push([at, i]);
    }
    assert.ok(gated.length >= 3, 'the recolour, the band, the sheen and coat are each gated');
    const ungated = [...code.matchAll(/bettaLook\[/g)].filter((m) => !gated.some(([a, b]) => m.index > a && m.index < b)).map((m) => code.slice(code.lastIndexOf('\n', m.index) + 1, code.indexOf('\n', m.index)).trim());
    for (const line of ungated) assert.ok(/^let look = bettaLook\[0\]\.x > 0\.0;$/.test(line) || /select\(select\(0u, 1u, mat == 1u\), select\(5u, 4u, mat == 1u\), bettaLook\[0\]\.x > 0\.0\)/.test(line), `ungated: ${line}`);
    // (And where the gate is open, the photographs' colours are mixed out by its share alone.)
    assert.match(code, /albedo = mix\(albedo, betta_sample\(atlas, smp, select\(5u, 4u, mat == 1u\), uv\) \* pow\(max\(lum, 1e-6\), bettaLook\[0\]\.z\) \* bettaLook\[0\]\.y, bettaLook\[0\]\.x\);/);
  }
  // The other globes' fish knows nothing of varieties.
  assert.ok(!bettaWGSL.includes('bettaLook') && !bettaWGSL.includes('if (look)'));
});

test('a variety\'s numbers: its share, the maps\' gain to its detail, its band over the fins\' brightness, its coat\'s reach', () => {
  const refs = { gain: 30, body: 0.08, fins: 0.05 };
  for (const v of VARIETIES.slice(1)) {
    const look = varietyLook(v, refs);
    const detail = v.detail ?? 1;
    assert.equal(look[0], Math.fround(v.amount ?? 1), v.id);
    assert.ok(Math.abs(look[1] - refs.gain ** detail) < 1e-4 * refs.gain, v.id);
    assert.equal(look[2], Math.fround(detail), v.id);
    assert.ok(Math.abs(look[3] - 1 / refs.body) < 1e-4, v.id);
    if (v.band) {
      const c = linearOf(v.band.colour);
      for (let n = 0; n < 3; n++) assert.ok(Math.abs(look[8 + n] - c[n] / refs.fins) < 1e-4, v.id);
      assert.ok(look[11] > 0.2 && look[11] < 0.9, `${v.id}: a band that starts on the fin`);
    } else assert.ok(look[11] > 1, v.id);
    if (v.coat) assert.ok(look[15] > -1 && look[15] < 2, v.id);
    else assert.ok(look[15] < -5, v.id);
  }
});

/** Photographs of even brightness L (linear), or as given per profile cell. */
function photographs(L, profile = null) {
  const flat = (n) => new Float32Array(n).fill(L);
  return { profile: profile ?? flat(PROFILE.w * PROFILE.h), caudal: flat(CAUDAL.w * CAUDAL.h), head: flat(MACRO * MACRO), scales: flat(MACRO * MACRO) };
}
const decode = (b) => {
  const s = b / 255;
  return s > 0.04045 ? ((s + 0.055) / 1.055) ** 2.4 : s / 12.92;
};

test('on photographs of even brightness, the colour the shader makes of a map is the colour painted, counter-shaded', () => {
  const cells = profileCells();
  const L = 0.1;
  const m = measure(photographs(L), cells);
  assert.ok(Math.abs(m.body - L) < 1e-6 && Math.abs(m.fins - L) < 1e-6);
  const field = { ...m, cells, caudalOut: caudalCells() };
  for (const v of VARIETIES.filter((v) => v.body && !v.patches)) {
    const { profile, caudal } = paint(v, field);
    const look = varietyLook(v, field);
    // (bettaWGSL.ts: map x luminance^detail x gain.)
    const shown = (bytes, k) => [0, 1, 2].map((n) => decode(bytes[4 * k + n]) * L ** look[2] * look[1]);
    const near = (a, b, what) => a.forEach((x, n) => assert.ok(Math.abs(x - b[n]) <= 0.03 * b[n] + 0.002, `${v.id} ${what}: ${a} for ${b}`));
    // The back, high on the flank, mid-body; the belly; the fins' edges, the caudal's root.
    const x = Math.floor((700 / PROFILE.width) * PROFILE.w);
    const column = [...Array(PROFILE.h).keys()].map((j) => j * PROFILE.w + x).filter((k) => cells.kind[k] === 0);
    near(shown(profile, column[0]), linearOf(v.body.back), 'back');
    near(shown(profile, column.at(-1)), linearOf(v.body.belly), 'belly');
    const luma = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    assert.ok(luma(shown(profile, column[0])) < luma(shown(profile, column.at(-1))), `${v.id}: a darker back than belly`);
    const caudalRoot = Math.floor((512 / CAUDAL.height) * CAUDAL.h) * CAUDAL.w + Math.floor((505 / CAUDAL.width) * CAUDAL.w);
    near(shown(caudal, caudalRoot), linearOf(v.fins.root), 'caudal root');
    for (let k = 0; k < profile.length / 4; k++) assert.equal(profile[4 * k + 3], 255);
  }
});

test('where the photographs are brighter, the map is darker: their broad light and shade are divided out, their fine kept', () => {
  const cells = profileCells();
  // The body brighter along its back than its belly, as the scale macro is (its rows, top to bottom).
  const lum = photographs(0.1);
  for (let k = 0; k < lum.scales.length; k++) lum.scales[k] = 0.04 + 0.16 * (1 - Math.floor(k / MACRO) / MACRO);
  const m = measure(lum, cells);
  const x = Math.floor((700 / PROFILE.width) * PROFILE.w);
  const column = [...Array(PROFILE.h).keys()].map((j) => j * PROFILE.w + x).filter((k) => cells.kind[k] === 0);
  assert.ok(column.length > 4);
  assert.ok(m.profile[column[1]] < m.profile[column.at(-2)], 'the bright back divided more than the dark belly');
  for (const c of [m.profile, m.caudal]) for (const d of c) assert.ok(d > 0 && d <= 1);
  assert.ok(Math.abs(Math.max(...m.profile, ...m.caudal) - 1) < 1e-6, 'the gain is the largest division');
});

test('a marble\'s patches cover about what they should of the fish, the same each time it is painted', () => {
  const cells = profileCells();
  const m = measure(photographs(0.1), cells);
  const field = { ...m, cells, caudalOut: caudalCells() };
  const koi = varietyOf('koi');
  const a = paint(koi, field), b = paint(koi, field);
  assert.deepEqual(a.profile, b.profile);
  const colours = koi.patches.colours.map(([c]) => linearOf(c));
  const counts = colours.map(() => 0);
  let fish = 0;
  for (let k = 0; k < cells.kind.length; k++) {
    if (!m.fish.profile[k]) continue;
    fish++;
    const c = [0, 1, 2].map((n) => decode(a.profile[4 * k + n]));
    const lum = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    // (Black where darkest; orange-red where red outweighs green and blue well.)
    if (lum < 0.02) counts[1]++;
    else if (c[0] > 3 * c[1] && c[0] > 3 * c[2]) counts[0]++;
  }
  // (The black patches lie over the red: what shows of each is its cover, less what the later covers.)
  const [red, black] = koi.patches.colours.map(([, cover]) => cover);
  assert.ok(Math.abs(counts[1] / fish - black) < 0.1, `black: ${counts[1] / fish}`);
  assert.ok(Math.abs(counts[0] / fish - red * (1 - black)) < 0.12, `red: ${counts[0] / fish}`);
});
