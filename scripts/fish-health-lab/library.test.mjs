// Reference-library visual guide (Jez, Nov 6 2026 09:30–09:38 EST).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CONDITIONS } from '../../experiments/fish-health-lab/data.mjs';
import { LIB_INFO, ZONES, fishMap, closeupsFor, fishStripFor, leadImageFor } from '../../experiments/fish-health-lab/library-visuals.mjs';
import { CROPS, IMAGE_SOURCE } from '../../experiments/fish-health-lab/library-images-data.mjs';

const receipt = JSON.parse(readFileSync(new URL('./library-images-20261106.json', import.meta.url)));

test('every fish disease page has four close-ups, a fish map, a timeline and a lead picture', () => {
  for (const c of CONDITIONS.filter(c => c.id !== 'normal')) {
    assert.equal(closeupsFor(c.id).length, 4, c.id);
    for (const im of closeupsFor(c.id)) assert.ok(im.url && im.caption && im.alt, `${c.id} ${im.id}`);
    const info = LIB_INFO[c.id];
    assert.ok(info, c.id);
    assert.equal(info.time.length, 3, c.id);
    assert.ok(info.zones.length && info.zones.every(z => ZONES[z]), c.id);
    assert.match(fishMap(info.zones), /class="map-zone on"/);
    assert.ok(leadImageFor(c.id)?.url, c.id);
  }
});

test('the fish-type strip shows each kind of fish once, in the fish-step order, right water only', () => {
  const strip = fishStripFor('cloudy-eye');
  assert.equal(strip.length, 18);
  assert.equal(new Set(strip.map(s => `${s.water}:${s.fish}`)).size, 18);
  assert.ok(strip.findIndex(s => s.water === 'marine') > strip.findLastIndex(s => s.water === 'fresh'));
  assert.ok(fishStripFor('ich-marine').every(s => s.water === 'marine'));
  assert.ok(fishStripFor('hole-in-head').every(s => s.water === 'fresh'));
});

test('library close-ups match the receipt: content-hashed, unresized, published state', () => {
  assert.equal(receipt.requestedModel, 'openai/gpt-image-2.6-sunburst');
  assert.equal(receipt.assets.length, 96); // 84 + ich, velvet and cottony growth in the same photo style
  assert.equal(Object.keys(CROPS).length, 96);
  for (const a of receipt.assets) {
    assert.equal(CROPS[a.id].key, a.r2Key);
    assert.ok(a.r2Key.endsWith(`-${a.sha256.slice(0, 12)}.jpg`));
    assert.equal(a.resized, false);
    assert.equal(a.uploaded, IMAGE_SOURCE === 'media');
  }
});

test('coral, invert and pond pages have the visual guide too (except normal entries)', async () => {
  const { REEF_CONDITIONS } = await import('../../experiments/fish-health-lab/reef-data.mjs');
  const { REEF_LIB_INFO } = await import('../../experiments/fish-health-lab/library-visuals.mjs');
  const { CROPS: REEF_CROPS, IMAGE_SOURCE: REEF_SOURCE } = await import('../../experiments/fish-health-lab/library-reef-images-data.mjs');
  const reefReceipt = JSON.parse(readFileSync(new URL('./library-reef-images-20261106.json', import.meta.url)));
  const NONE = ['coral-normal', 'normal-molt', 'winter-rest'];
  for (const c of REEF_CONDITIONS) {
    if (NONE.includes(c.id)) { assert.equal(closeupsFor(c.id).length, 0, c.id); continue; }
    assert.equal(closeupsFor(c.id).length, 4, c.id);
    const info = REEF_LIB_INFO[c.id];
    assert.ok(info && info.time.length === 3, c.id);
    if (c.group === 'pond') assert.ok(info.zones.every(z => ZONES[z]), c.id); else assert.ok(info.look.length, c.id);
  }
  assert.equal(reefReceipt.assets.length, 156);
  assert.equal(Object.keys(REEF_CROPS).length, 156);
  for (const a of reefReceipt.assets) { assert.equal(REEF_CROPS[a.id].key, a.r2Key); assert.equal(a.uploaded, REEF_SOURCE === 'media'); assert.equal(a.resized, false); }
});
