// Per-fish picture sets (betta pilot), step pictures and fish-type pictures.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { CONDITIONS, SYMPTOMS, FISH_TYPES } from '../../experiments/fish-health-lab/data.mjs';
import { signImagesFor } from '../../experiments/fish-health-lab/choice-images.mjs';
import { leadSlot } from '../../experiments/fish-health-lab/visuals.mjs';
import { PLAN_IDS, carePlanFor } from '../../experiments/fish-health-lab/treatments.mjs';
import { CROPS, IMAGE_SOURCE, MEDIA_BASE } from '../../experiments/fish-health-lab/fish-images-data.mjs';
import { FISH_SETS, imagesFor, imageFor, FISH_TYPE_IMAGES, STEP_IMAGES, stepImageFor, splitStep, urlFor, localPathFor } from '../../experiments/fish-health-lab/fish-images.mjs';

const app = fileURLToPath(new URL('../../experiments/fish-health-lab/', import.meta.url));
const receipt = JSON.parse(readFileSync(new URL('./betta-pilot-images-20261105.json', import.meta.url)));
const freshConditions = CONDITIONS.filter(c => c.scope !== 'marine');

test('betta set covers every symptom picture and every freshwater result', () => {
  const betta = FISH_SETS.betta;
  for (const sign of SYMPTOMS) {
    const got = imagesFor('betta', sign.id, 'fresh');
    assert.ok(got.fishSpecific, `betta sign ${sign.id}`);
    assert.match(got.images[0].url, /betta-/);
  }
  for (const condition of freshConditions) {
    const got = imagesFor('betta', condition.id, 'fresh');
    assert.ok(got.fishSpecific && got.images.length, `betta condition ${condition.id}`);
  }
  // Every mapped crop exists in the generated data, and nothing maps to a marine-only condition.
  for (const ids of [...Object.values(betta.signs).map(id => [id]), ...Object.values(betta.conditions)]) for (const id of ids) assert.ok(CROPS[id], id);
  for (const id of Object.keys(betta.conditions)) assert.notEqual(CONDITIONS.find(c => c.id === id)?.scope, 'marine', id);
});

test('fish types without a set, no fish, or the wrong water fall back to generic pictures', () => {
  for (const fishType of ['goldfish', 'community', '', 'not-a-fish']) {
    for (const condition of freshConditions) {
      const got = imagesFor(fishType, condition.id, 'fresh');
      assert.equal(got.fishSpecific, false);
      const generic = leadSlot(condition.id)?.image || signImagesFor('fresh')[condition.thumb || condition.art] || signImagesFor('fresh').unclear;
      assert.equal(got.images[0].url, generic.url, `${fishType} ${condition.id}`);
    }
    for (const sign of SYMPTOMS) assert.equal(imageFor(fishType, sign.id, 'fresh').url, signImagesFor('fresh')[sign.id].url);
  }
  // A betta set is freshwater only; marine lookups stay generic.
  assert.equal(imagesFor('betta', 'dots', 'marine').fishSpecific, false);
  assert.equal(imageFor('clownfish', 'brooklynella', 'marine').url.startsWith('https://media.jez237.com/'), true);
});

test('fish-type step has a picture for every fish and for Not sure', () => {
  for (const fish of [...FISH_TYPES.fresh, ...FISH_TYPES.marine]) assert.ok(FISH_TYPE_IMAGES[fish.id]?.url, fish.id);
  assert.ok(FISH_TYPE_IMAGES.other?.url);
  assert.equal(Object.keys(FISH_TYPE_IMAGES).length, 12);
});

test('every What-to-do step gets a step picture (or the urgent marker) and a short lead line', () => {
  assert.equal(Object.values(STEP_IMAGES).filter(Boolean).length, 12);
  for (const id of PLAN_IDS) for (const water of ['fresh', 'marine']) {
    for (const step of carePlanFor(id, water).steps) {
      const picked = stepImageFor(step);
      assert.ok(picked.id === 'urgent' ? picked.image === null : picked.image?.url, `${id}: ${step}`);
      const { lead, more } = splitStep(step);
      assert.equal(`${lead}${more ? ` ${more}` : ''}`, step);
    }
  }
  assert.equal(stepImageFor('Move the fish to a hospital (quarantine) tank with a heater and air stone.').id, 'hospital');
  assert.equal(stepImageFor('Test ammonia and nitrite, then do a 25–30% water change.').id, 'test');
  assert.equal(stepImageFor('Skip feeding for 1–2 days.').id, 'pea');
  assert.equal(stepImageFor('Keep the water clean and stable—there’s no medicine for this virus.').id, 'watch');
  assert.equal(stepImageFor('Look for bullies or fin-nippers and check decorations for sharp edges.').id, 'divider');
});

test('every crop matches the receipt: content-hashed R2 key, size, unresized', () => {
  assert.equal(Object.keys(CROPS).length, 48);
  assert.equal(receipt.assets.length, 48);
  assert.equal(receipt.requestedModel, 'openai/gpt-image-2.6-sunburst');
  for (const asset of receipt.assets) {
    const entry = CROPS[asset.id];
    assert.ok(entry, asset.id);
    assert.equal(entry.key, asset.r2Key, asset.id);
    assert.equal(MEDIA_BASE + entry.key, asset.plannedUrl, asset.id);
    assert.ok(entry.key.endsWith(`-${asset.sha256.slice(0, 12)}.jpg`), asset.id);
    assert.equal(asset.uploaded, true, `${asset.id} uploaded`);
    assert.equal(asset.resized, false);
    assert.equal(entry.width, asset.width); assert.equal(entry.height, asset.height);
    // The preview path is derived from the key, so both sources name the same file.
    assert.equal(localPathFor(entry), asset.path, asset.id);
    assert.equal(urlFor(entry), IMAGE_SOURCE === 'media' ? MEDIA_BASE + entry.key : asset.path);
  }
});

test('media mode: every picture the app can show comes from media.jez237.com, never local-images/', { skip: IMAGE_SOURCE !== 'media' && 'IMAGE_SOURCE is local (private preview)' }, () => {
  const urls = [
    ...Object.values(FISH_TYPE_IMAGES), ...Object.values(STEP_IMAGES),
    ...['betta', 'goldfish', ''].flatMap(fish => [...SYMPTOMS, ...freshConditions].flatMap(item => imagesFor(fish, item.id, 'fresh').images)),
  ].map(image => image.url);
  assert.ok(urls.length > 100);
  for (const url of urls) {
    assert.ok(url.startsWith(MEDIA_BASE), url);
    assert.doesNotMatch(url, /local-images/);
  }
  for (const entry of Object.values(CROPS)) assert.equal(entry.local, undefined, 'published data carries no local paths');
});

// Optional network proof: FHL_VERIFY_MEDIA=1 fetches every public URL and checks its sha256 against the receipt.
test('public media URLs serve the receipt bytes', { skip: !process.env.FHL_VERIFY_MEDIA && 'set FHL_VERIFY_MEDIA=1 to fetch' }, async () => {
  for (const asset of receipt.assets) {
    const response = await fetch(asset.plannedUrl);
    assert.equal(response.status, 200, asset.plannedUrl);
    assert.equal(response.headers.get('content-type'), 'image/jpeg');
    const sha = createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
    assert.equal(sha, asset.sha256, asset.plannedUrl);
  }
});

// Private preview checkouts keep the untracked copies; check they still match the receipt.
test('untracked preview copies match the receipt hashes', { skip: !existsSync(`${app}local-images`) && 'local-images/ is not present in this checkout' }, () => {
  for (const asset of receipt.assets) {
    const sha = createHash('sha256').update(readFileSync(`${app}${asset.path}`)).digest('hex');
    assert.equal(sha, asset.sha256, asset.id);
  }
});
