// Per-fish picture sets (betta, goldfish, tetra/rasbora and the split groups), step pictures and fish-type pictures.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { CONDITIONS, SYMPTOMS, FISH_TYPES, LEGACY_FISH_IDS, fishTypeFor } from '../../experiments/fish-health-lab/data.mjs';
import { signImagesFor } from '../../experiments/fish-health-lab/choice-images.mjs';
import { leadSlot } from '../../experiments/fish-health-lab/visuals.mjs';
import { PLAN_IDS, carePlanFor } from '../../experiments/fish-health-lab/treatments.mjs';
import { CROPS, IMAGE_SOURCE, MEDIA_BASE } from '../../experiments/fish-health-lab/fish-images-data.mjs';
import { CROPS as FRESH_CROPS, IMAGE_SOURCE as FRESH_IMAGE_SOURCE } from '../../experiments/fish-health-lab/fish-images-fresh-data.mjs';
import { CROPS as SPLIT_CROPS, IMAGE_SOURCE as SPLIT_IMAGE_SOURCE } from '../../experiments/fish-health-lab/fish-images-split-data.mjs';
import { FISH_SETS, ALL_CROPS, imagesFor, imageFor, fishSetFor, FISH_TYPE_IMAGES, STEP_IMAGES, stepImageFor, splitStep, urlFor, localPathFor } from '../../experiments/fish-health-lab/fish-images.mjs';

const app = fileURLToPath(new URL('../../experiments/fish-health-lab/', import.meta.url));
const receipt = JSON.parse(readFileSync(new URL('./betta-pilot-images-20261105.json', import.meta.url)));
const freshReceipt = JSON.parse(readFileSync(new URL('./freshwater-images-20261105.json', import.meta.url)));
const splitReceipt = JSON.parse(readFileSync(new URL('./split-images-20261105.json', import.meta.url)));
const freshConditions = CONDITIONS.filter(c => c.scope !== 'marine');
// The five groups of freshwater-images-20261105.json (livebearer, cichlid and catfish were split later).
const GROUPS = ['goldfish', 'community', 'livebearer', 'cichlid', 'catfish'];
// The split groups and the old, wider set each one re-uses published cells from.
const SPLIT = { guppy: 'livebearer', molly: 'livebearer', barb: null, gourami: null, angelfish: 'cichlid', african: 'cichlid', cory: 'catfish', pleco: 'catfish' };
// Results a group deliberately has no picture for (they use the generic picture).
const NO_PICTURE = { goldfish: ['hole-in-head'], community: ['hole-in-head'], guppy: ['hole-in-head'], molly: ['hole-in-head'], barb: ['hole-in-head'], gourami: ['hole-in-head'], angelfish: [], african: [], cory: ['hole-in-head'], pleco: ['hole-in-head'] };
// Published cells of the old sets that show neither new sub-group (German blue rams).
const UNUSED_PUBLISHED = ['cichlid-balance', 'cichlid-dust', 'cichlid-red-gills', 'cichlid-sinking'];
const genericFor = id => leadSlot(id)?.image || signImagesFor('fresh')[CONDITIONS.find(c => c.id === id).thumb || CONDITIONS.find(c => c.id === id).art] || signImagesFor('fresh').unclear;

test('every freshwater fish type has its own set', () => {
  assert.deepEqual(Object.keys(FISH_SETS).sort(), FISH_TYPES.fresh.map(f => f.id).sort());
  for (const set of Object.values(FISH_SETS)) assert.equal(set.water, 'fresh');
});

for (const group of ['goldfish', 'community']) {
  test(`${group} set: all 12 symptom pictures and every freshwater result show a ${group}`, () => {
    const set = FISH_SETS[group];
    assert.equal(Object.keys(set.signs).length, 12);
    for (const sign of SYMPTOMS) {
      const got = imagesFor(group, sign.id, 'fresh');
      assert.ok(got.fishSpecific, `${group} sign ${sign.id}`);
      assert.equal(got.images.length, 1);
      assert.equal(got.images[0].key, `experiments/fish-health-lab/${group}/${set.signs[sign.id]}-${got.images[0].key.slice(-16, -4)}.jpg`);
    }
    for (const condition of freshConditions) {
      const got = imagesFor(group, condition.id, 'fresh');
      if (NO_PICTURE[group].includes(condition.id)) {
        assert.equal(got.fishSpecific, false, `${group} ${condition.id} should fall back`);
        assert.equal(got.images[0].url, genericFor(condition.id).url);
        continue;
      }
      assert.ok(got.fishSpecific && got.images.length, `${group} condition ${condition.id}`);
      assert.equal(got.images.length, set.conditions[condition.id].length, `${group} ${condition.id}: every mapped crop exists`);
      for (const image of got.images) assert.ok(image.key.startsWith(`experiments/fish-health-lab/${group}/${group}-`), image.key);
    }
    // Every crop of the group is used somewhere; nothing maps to a marine-only condition.
    const used = new Set([...Object.values(set.signs), ...Object.values(set.conditions).flat()]);
    assert.deepEqual([...used].sort(), Object.keys(FRESH_CROPS).filter(id => id.startsWith(`${group}-`)).sort());
    assert.equal(used.size, 24);
    for (const id of Object.keys(set.conditions)) assert.notEqual(CONDITIONS.find(c => c.id === id)?.scope, 'marine', id);
    // Freshwater only: marine lookups stay generic.
    assert.equal(imagesFor(group, 'dots', 'marine').fishSpecific, false);
  });
}

for (const [group, parent] of Object.entries(SPLIT)) {
  test(`${group} set (split): every symptom picture and result shows the right fish, new or re-used`, () => {
    const set = FISH_SETS[group];
    assert.equal(set.water, 'fresh');
    assert.equal(Object.keys(set.signs).length, 12);
    for (const sign of SYMPTOMS) {
      const got = imagesFor(group, sign.id, 'fresh');
      assert.ok(got.fishSpecific, `${group} sign ${sign.id}`);
      assert.equal(got.images.length, 1);
    }
    for (const condition of freshConditions) {
      const got = imagesFor(group, condition.id, 'fresh');
      if (NO_PICTURE[group].includes(condition.id)) {
        assert.equal(got.fishSpecific, false, `${group} ${condition.id} should fall back`);
        assert.equal(got.images[0].url, genericFor(condition.id).url);
        continue;
      }
      assert.ok(got.fishSpecific && got.images.length, `${group} condition ${condition.id}`);
      assert.equal(got.images.length, set.conditions[condition.id].length, `${group} ${condition.id}: every mapped crop exists`);
    }
    const used = new Set([...Object.values(set.signs), ...Object.values(set.conditions).flat()]);
    for (const id of used) {
      // Either a new crop of this group, or a published crop of the old wider set.
      if (SPLIT_CROPS[id]) assert.ok(id.startsWith(`${group}-`) && SPLIT_CROPS[id].key.startsWith(`experiments/fish-health-lab/${group}/${group}-`), id);
      else assert.ok(parent && id.startsWith(`${parent}-`) && FRESH_CROPS[id], `${group}: ${id}`);
    }
    // Every new crop of the group is used, and the re-used cells match the receipt.
    assert.deepEqual([...used].filter(id => SPLIT_CROPS[id]).sort(), Object.keys(SPLIT_CROPS).filter(id => id.startsWith(`${group}-`)).sort());
    assert.deepEqual([...used].filter(id => FRESH_CROPS[id]).sort(), (splitReceipt.reusedPublished.byGroup[group] || []).map(r => r.crop).sort());
    for (const id of Object.keys(set.conditions)) assert.notEqual(CONDITIONS.find(c => c.id === id)?.scope, 'marine', id);
    assert.equal(imagesFor(group, 'dots', 'marine').fishSpecific, false);
  });
}

test('the split re-uses every published livebearer/cichlid/catfish cell that shows the right fish', () => {
  const used = new Set(Object.keys(SPLIT).flatMap(g => [...Object.values(FISH_SETS[g].signs), ...Object.values(FISH_SETS[g].conditions).flat()]));
  const old = Object.keys(FRESH_CROPS).filter(id => /^(livebearer|cichlid|catfish)-/.test(id));
  assert.deepEqual(old.filter(id => !used.has(id)).sort(), UNUSED_PUBLISHED);
  assert.deepEqual(Object.keys(splitReceipt.reusedPublished.unusedPublished).sort(), UNUSED_PUBLISHED);
  // Mixed old sets: each re-used cell went to the sub-group whose fish it shows.
  for (const g of ['angelfish', 'african', 'cory', 'pleco', 'guppy', 'molly']) {
    const pattern = { angelfish: /angelfish|discus/i, african: /african|oscar/i, cory: /cory/i, pleco: /pleco/i, guppy: /guppy/i, molly: /molly|platy|swordtail/i }[g];
    for (const id of splitReceipt.reusedPublished.byGroup[g].map(r => r.crop)) assert.match(FRESH_CROPS[id].alt, pattern, `${g}: ${id}`);
  }
});

test('old fish-type ids (livebearer, cichlid, catfish) keep working as their first sub-group', () => {
  assert.deepEqual(LEGACY_FISH_IDS.fresh, { livebearer: 'guppy', cichlid: 'angelfish', catfish: 'cory' });
  for (const [old, now] of Object.entries(LEGACY_FISH_IDS.fresh)) {
    assert.equal(FISH_SETS[old], undefined);
    assert.equal(fishTypeFor('fresh', old).id, now);
    assert.equal(fishSetFor(old, 'fresh'), FISH_SETS[now]);
    for (const item of [...SYMPTOMS, ...freshConditions]) assert.deepEqual(imagesFor(old, item.id, 'fresh'), imagesFor(now, item.id, 'fresh'), `${old} ${item.id}`);
  }
  assert.equal(fishTypeFor('marine', 'cichlid'), null);
});

test('per-group swaps: goldfish swim bladder, HITH on angelfish/discus and oscars, catfish barbels and bloated belly, gourami disease', () => {
  assert.deepEqual(FISH_SETS.goldfish.conditions['swim-bladder'], ['goldfish-balance', 'goldfish-headstand', 'goldfish-sinking']);
  assert.match(imageFor('goldfish', 'balance').alt, /upside down/);
  assert.match(imageFor('african', 'hole-in-head').alt, /oscar with pale pits/);
  assert.match(imageFor('angelfish', 'hole-in-head').alt, /discus with pale pits/);
  assert.deepEqual(FISH_SETS.cory.conditions['fin-rot'], ['cory-fins', 'catfish-barbels']);
  assert.deepEqual(FISH_SETS.cory.conditions.ulcer, ['catfish-sores', 'cory-red-belly']);
  assert.match(imageFor('cory', 'dropsy').caption, /no scales/);
  assert.match(imageFor('pleco', 'dropsy').caption, /no scales/);
  assert.deepEqual(FISH_SETS.pleco.conditions.bloat, ['pleco-swollen', 'pleco-sunken-belly']);
  assert.deepEqual(FISH_SETS.guppy.conditions.bloat, ['guppy-swollen', 'livebearer-pregnant']);
  assert.deepEqual(FISH_SETS.molly.conditions.bloat, ['livebearer-swollen', 'molly-pregnant']);
  assert.deepEqual(FISH_SETS.molly.conditions.water, ['livebearer-breathing', 'livebearer-red-gills', 'molly-unclear']);
  assert.deepEqual(FISH_SETS.african.conditions.bloat, ['cichlid-swollen', 'african-malawi-bloat']);
  assert.deepEqual(FISH_SETS.gourami.conditions.ulcer, ['gourami-sores', 'gourami-dgd']);
  assert.deepEqual(FISH_SETS.community.conditions['ich-fresh'], ['community-dots', 'community-school-dots']);
  assert.deepEqual(FISH_SETS.barb.conditions['ich-fresh'], ['barb-dots', 'barb-school-dots']);
});

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
  for (const fishType of ['', 'not-a-fish', 'clownfish']) {
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
  assert.equal(FISH_TYPES.fresh.length, 11);
  assert.equal(FISH_TYPES.marine.length, 7);
  for (const fish of [...FISH_TYPES.fresh, ...FISH_TYPES.marine]) assert.ok(FISH_TYPE_IMAGES[fish.id]?.url, fish.id);
  assert.ok(FISH_TYPE_IMAGES.other?.url);
  assert.equal(Object.keys(FISH_TYPE_IMAGES).length, 19);
  assert.equal(new Set(Object.values(FISH_TYPE_IMAGES).map(i => i.url)).size, 19);
  // Guppy and angelfish/discus keep the published tiles; the new tiles come from the split sheet.
  assert.equal(FISH_TYPE_IMAGES.guppy.key, CROPS['fish-livebearer'].key);
  assert.equal(FISH_TYPE_IMAGES.angelfish.key, CROPS['fish-cichlid'].key);
  for (const id of ['molly', 'barb', 'gourami', 'african', 'cory', 'pleco', 'goby', 'dottyback']) assert.equal(FISH_TYPE_IMAGES[id].key, SPLIT_CROPS[`fish-${id}`].key, id);
  // Saltwater gets selector tiles only: no saltwater fish has a disease picture set yet.
  for (const fish of FISH_TYPES.marine) {
    assert.equal(fishSetFor(fish.id, 'marine'), null, fish.id);
    assert.equal(imagesFor(fish.id, 'dots', 'marine').fishSpecific, false, fish.id);
  }
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

test('freshwater crops match their receipt: 120 content-hashed R2 keys, unresized, upload state matches IMAGE_SOURCE', () => {
  assert.equal(freshReceipt.assets.length, 120);
  assert.equal(Object.keys(FRESH_CROPS).length, 120);
  assert.equal(freshReceipt.requestedModel, 'openai/gpt-image-2.6-sunburst');
  assert.equal(freshReceipt.requestedQuality, 'medium');
  assert.equal(Object.keys(freshReceipt.sources).length, 12); // ten group sheets + two repair sheets
  for (const source of Object.values(freshReceipt.sources)) assert.equal(source.reportedProviderModel, 'openai/gpt-image-2.6-sunburst');
  assert.equal(new Set(freshReceipt.assets.map(a => a.sha256)).size, 120);
  for (const asset of freshReceipt.assets) {
    const entry = FRESH_CROPS[asset.id];
    assert.ok(entry, asset.id);
    assert.ok(GROUPS.includes(asset.group) && asset.id.startsWith(`${asset.group}-`), asset.id);
    assert.equal(entry.key, asset.r2Key, asset.id);
    assert.equal(entry.key, `experiments/fish-health-lab/${asset.group}/${asset.id}-${asset.sha256.slice(0, 12)}.jpg`);
    assert.equal(MEDIA_BASE + entry.key, asset.plannedUrl, asset.id);
    // Publishing = upload every asset, mark it uploaded, flip IMAGE_SOURCE to 'media'.
    assert.equal(asset.uploaded, FRESH_IMAGE_SOURCE === 'media', `${asset.id} uploaded flag vs IMAGE_SOURCE`);
    assert.equal(asset.resized, false);
    assert.equal(entry.width, asset.width); assert.equal(entry.height, asset.height);
    assert.equal(entry.alt, asset.alt); assert.match(entry.alt, /^AI illustration: /);
    assert.equal(localPathFor(entry), asset.path, asset.id);
    assert.equal(urlFor(ALL_CROPS[asset.id]), FRESH_IMAGE_SOURCE === 'media' ? asset.plannedUrl : asset.path);
  }
  // The shared picture ids never collide between the two data files.
  for (const id of Object.keys(FRESH_CROPS)) assert.equal(CROPS[id], undefined, id);
});

test('split crops match their receipt: content-hashed R2 keys, unresized, upload state matches IMAGE_SOURCE', () => {
  const n = splitReceipt.assets.length;
  assert.equal(Object.keys(SPLIT_CROPS).length, n);
  assert.equal(n, 134); // 126 new set cells + 8 new fish-type tiles
  assert.equal(splitReceipt.requestedModel, 'openai/gpt-image-2.6-sunburst');
  assert.equal(splitReceipt.requestedQuality, 'medium');
  for (const source of Object.values(splitReceipt.sources)) assert.equal(source.reportedProviderModel, 'openai/gpt-image-2.6-sunburst');
  assert.equal(new Set(splitReceipt.assets.map(a => a.sha256)).size, n);
  for (const asset of splitReceipt.assets) {
    const entry = SPLIT_CROPS[asset.id];
    assert.ok(entry, asset.id);
    assert.ok(asset.id.startsWith(asset.group === 'fish-types' ? 'fish-' : `${asset.group}-`), asset.id);
    assert.equal(entry.key, `experiments/fish-health-lab/${asset.group}/${asset.id}-${asset.sha256.slice(0, 12)}.jpg`);
    assert.equal(entry.key, asset.r2Key);
    assert.equal(MEDIA_BASE + entry.key, asset.plannedUrl);
    assert.equal(asset.uploaded, SPLIT_IMAGE_SOURCE === 'media', `${asset.id} uploaded flag vs IMAGE_SOURCE`);
    assert.equal(asset.resized, false);
    assert.equal(entry.width, asset.width); assert.equal(entry.height, asset.height);
    assert.equal(entry.alt, asset.alt); assert.match(entry.alt, /^AI illustration: /);
    assert.equal(entry.caption, asset.caption);
    assert.equal(localPathFor(entry), asset.path, asset.id);
    assert.equal(urlFor(ALL_CROPS[asset.id]), SPLIT_IMAGE_SOURCE === 'media' ? asset.plannedUrl : asset.path);
    assert.equal(CROPS[asset.id] ?? FRESH_CROPS[asset.id], undefined, `${asset.id} collides with a published id`);
  }
  // Saltwater: only the two new selector tiles, no disease pictures.
  assert.deepEqual(splitReceipt.assets.filter(a => a.group === 'fish-types').map(a => a.id).sort(),
    ['fish-african', 'fish-barb', 'fish-cory', 'fish-dottyback', 'fish-goby', 'fish-gourami', 'fish-molly', 'fish-pleco']);
});

test('each data file uses its own IMAGE_SOURCE: betta stays on media while freshwater can preview locally', () => {
  for (const [id, entry] of Object.entries(CROPS)) assert.equal(urlFor(ALL_CROPS[id]), IMAGE_SOURCE === 'media' ? MEDIA_BASE + entry.key : localPathFor(entry));
  const goldfish = imageFor('goldfish', 'dots', 'fresh').url;
  assert.equal(goldfish.startsWith(MEDIA_BASE), FRESH_IMAGE_SOURCE === 'media');
  assert.equal(goldfish.startsWith('local-images/goldfish/'), FRESH_IMAGE_SOURCE === 'local');
  assert.ok(imageFor('betta', 'dots', 'fresh').url.startsWith(IMAGE_SOURCE === 'media' ? MEDIA_BASE : 'local-images/'));
});

test('media mode: every picture the app can show comes from media.jez237.com, never local-images/', { skip: IMAGE_SOURCE !== 'media' && 'IMAGE_SOURCE is local (private preview)' }, () => {
  const published = ['betta', '', ...(FRESH_IMAGE_SOURCE === 'media' ? ['goldfish', 'community'] : []), ...(SPLIT_IMAGE_SOURCE === 'media' && FRESH_IMAGE_SOURCE === 'media' ? Object.keys(SPLIT) : [])];
  const urls = [
    // New fish-type tiles stay local until the split batch is published.
    ...Object.entries(FISH_TYPE_IMAGES).filter(([id]) => SPLIT_IMAGE_SOURCE === 'media' || !SPLIT_CROPS[`fish-${id}`]).map(([, image]) => image),
    ...Object.values(STEP_IMAGES),
    ...published.flatMap(fish => [...SYMPTOMS, ...freshConditions].flatMap(item => imagesFor(fish, item.id, 'fresh').images)),
  ].map(image => image.url);
  assert.ok(urls.length > 80, String(urls.length));
  for (const url of urls) {
    assert.ok(url.startsWith(MEDIA_BASE), url);
    assert.doesNotMatch(url, /local-images/);
  }
  for (const entry of [...Object.values(CROPS), ...Object.values(FRESH_CROPS), ...Object.values(SPLIT_CROPS)]) assert.equal(entry.local, undefined, 'data carries no local paths');
});

// Optional network proof: FHL_VERIFY_MEDIA=1 fetches every public URL and checks its sha256 against the receipt
// (freshwater assets only once they are marked uploaded).
test('public media URLs serve the receipt bytes', { skip: !process.env.FHL_VERIFY_MEDIA && 'set FHL_VERIFY_MEDIA=1 to fetch' }, async () => {
  for (const asset of [...receipt.assets, ...freshReceipt.assets.filter(a => a.uploaded), ...splitReceipt.assets.filter(a => a.uploaded)]) {
    const response = await fetch(asset.plannedUrl);
    assert.equal(response.status, 200, asset.plannedUrl);
    assert.equal(response.headers.get('content-type'), 'image/jpeg');
    const sha = createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
    assert.equal(sha, asset.sha256, asset.plannedUrl);
  }
});

// Private preview checkouts keep the untracked copies; check they still match the receipt.
test('untracked preview copies match the receipt hashes', { skip: !existsSync(`${app}local-images`) && 'local-images/ is not present in this checkout' }, () => {
  for (const asset of [...receipt.assets, ...freshReceipt.assets, ...splitReceipt.assets]) {
    const sha = createHash('sha256').update(readFileSync(`${app}${asset.path}`)).digest('hex');
    assert.equal(sha, asset.sha256, asset.id);
  }
});
