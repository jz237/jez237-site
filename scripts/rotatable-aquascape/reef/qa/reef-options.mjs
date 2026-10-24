import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
import ts from 'typescript';

// Gallery options: the real navigation class with lightweight templates checks
// each species' habits, collision-free movement, and adding/removing animals.
const sourceUrl = new URL('../ReefFish.ts', import.meta.url);
const metadata = JSON.parse(fs.readFileSync(new URL('../assets/fish/model-info.json', import.meta.url)));
const source = fs.readFileSync(sourceUrl, 'utf8')
  .replace("import metadata from './assets/fish/model-info.json';", `const metadata=${JSON.stringify(metadata)};`)
  .replace(/from\s+(['"])(\.[^'"]+)\1/g, (_, quote, path) => `from ${JSON.stringify(new URL(path, sourceUrl).href)}`)
  .replace("from 'three'", `from ${JSON.stringify(import.meta.resolve('three'))}`);
const {ReefFish, defaultPopulation} = await import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {
  compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext},
}).outputText).toString('base64'));
import {sandHeight} from '../ReefOptics.ts';

const options = ['strigosus', 'vulpinus', 'bispinosa', 'loricula', 'hexataenia', 'cinctus'];
const all = ['tang', 'rostratum', 'semilarvatus', 'clown', 'anthias', 'chromis', 'gramma', 'goby', ...options];
function templates(names = all) {
  return new Map(names.map(name => {
    const group = new T.Group(), mouth = new T.Group(), eyes = new T.Group();
    mouth.name = 'mouth'; mouth.position.fromArray(metadata[name].mouth); eyes.name = 'eyes';
    group.add(mouth, eyes);
    for (const side of [-1, 1]) for (const pelvic of [false, true]) {
      const fin = new T.Group(); fin.name = 'pectoral'; fin.position.set(pelvic ? .1 : .13, pelvic ? -.2 : -.015, side * .09);
      fin.userData.restZ = fin.position.z; fin.userData.pelvic = pelvic; group.add(fin);
    }
    const membrane = new T.Mesh(new T.PlaneGeometry(.2, .2), new T.MeshStandardMaterial()); membrane.name = 'fin'; group.add(membrane);
    return [name, group];
  }));
}
function seeded(seed, run) {
  const previous = Math.random;
  Math.random = () => {seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296;};
  try {return run();} finally {Math.random = previous;}
}
const reef = () => [[-2.6, 1.2, -.3, .8], [0, .9, -.6, .7], [2.6, 1.3, -.2, .8], [-1.1, 2.6, -.9, .55]].map(([x, y, z, radius]) => ({center: new T.Vector3(x, y, z), radius}));
const angle = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
const gallery = [defaultPopulation[0], ['rostratum', 1], ...defaultPopulation.slice(1)];

const reports = {};
for (const seed of [23, 5150, 77001]) seeded(seed, () => {
  const scene = new T.Scene(), tank = new ReefFish(scene, reef(), [new T.Vector3(3, 1, .7)], templates(), 1, gallery);
  for (const s of options) assert.ok(tank.add(s), `${s} can be added`);
  const subjects = Object.fromEntries(options.map(s => [s, tank.fish.find(f => f.species === s)]));
  const seen = Object.fromEntries(options.map(s => [s, new Set()]));
  const stats = Object.fromEntries(options.map(s => [s, {bites: 0, last: -1, homeMax: 0, hidden: 0, mottle: 0, foldMax: 0, displays: 0}]));
  const previous = new Map(tank.fish.map(f => [f, f.yaw]));
  let threatHidden = false;
  for (let frame = 0; frame < 21600; frame++) {
    const night = frame > 18000;
    // Midway, send a fast large fish straight past each watchman's burrow.
    // Only into clear water, so the test itself never places fish inside each other.
    if (frame === 9000) for (const w of tank.fish.filter(f => f.species === 'cinctus')) {
      const tang = tank.fish.find(f => f.species === 'tang');
      for (const [dx, dy] of [[.55, .35], [-.55, .35], [.6, .45], [-.6, .45], [.5, .5], [-.5, .5]]) {
        const p = new T.Vector3(w.home.x + dx, w.home.y + dy, w.home.z);
        if (tank.free(p, tang.radius) && tank.fish.every(o => o === tang || p.distanceTo(o.position) > tang.radius + o.radius + .05)) {tang.position.copy(p); tang.group.position.copy(p); tang.velocity.set(-Math.sign(dx) * 2.2, 0, 0); tang.recoverUntil = tank.clock + 2; break;}
      }
    }
    tank.update(1 / 60, night);
    if (frame > 9000 && frame < 9300 && tank.fish.some(f => f.species === 'cinctus' && (f.hidden || f.mode === 'retreating into burrow'))) threatHidden = true;
    for (const f of tank.fish) {
      assert.ok([...f.position.toArray(), f.yaw, f.pitch].every(Number.isFinite), f.species + ' remains finite');
      assert.ok(Math.abs(angle(f.yaw, previous.get(f))) < .13, f.species + ' turns continuously'); previous.set(f, f.yaw);
      if (f.species !== 'cinctus' || !f.hidden) assert.ok(Math.abs(f.pitch) < .75, f.species + ' remains upright');
    }
    for (const s of options) {
      const f = subjects[s], st = stats[s]; seen[s].add(f.mode);
      if (f.graze && f.graze.biteAt !== st.last && f.graze.biteAt >= 0) {st.bites++; st.last = f.graze.biteAt;}
      if (!night && frame > 2400 && !f.mode.startsWith('entering')) st.homeMax = Math.max(st.homeMax, f.position.distanceTo(f.home));
      if (f.hidden) st.hidden++;
      st.mottle = Math.max(st.mottle, f.mottle.value); st.foldMax = Math.max(st.foldMax, f.finFold.value);
      if (f.mode === 'fin display' || f.mode === 'raising venomous spines' || f.mode === 'chasing rival') st.displays++;
    }
    if (frame % 120 === 0) {
      const snap = tank.snapshot();
      assert.equal(snap.obstacleOverlaps, 0, `no visible fish inside the reef (frame ${frame})`);
      assert.equal(snap.fishOverlaps, 0, `no visible fish inside another (frame ${frame})`);
    }
  }
  // Grazers work reef faces; the dwarf angels and wrasse stay near home.
  for (const s of ['strigosus', 'vulpinus', 'bispinosa', 'loricula']) {
    assert.ok(seen[s].has('grazing algae'), `${s} grazes the reef`);
    assert.ok(stats[s].bites >= (s === 'strigosus' ? 25 : 6), `${s} takes repeated grazing bites (${stats[s].bites})`);
  }
  assert.ok(stats.strigosus.bites > stats.vulpinus.bites, 'the bristletooth scrapes more often than the rabbitfish');
  assert.ok(seen.hexataenia.has('grazing algae') || stats.hexataenia.bites > 0, 'the wrasse picks prey from the rock');
  for (const s of ['bispinosa', 'loricula', 'hexataenia']) assert.ok(stats[s].homeMax < 2.6, `${s} keeps to its home range (${stats[s].homeMax.toFixed(2)})`);
  assert.ok(stats.strigosus.foldMax > .12 && stats.vulpinus.foldMax > .12, 'sail-finned grazers fold fins with speed');
  assert.ok(stats.vulpinus.mottle > .8, 'the foxface darkens at night');
  // The watchman perches, makes short trips and sleeps in its burrow.
  assert.ok(seen.cinctus.has('watching from burrow'), 'the watchman watches from its burrow');
  assert.ok(seen.cinctus.has('hopping') || seen.cinctus.has('sifting sand'), 'the watchman forages near the burrow');
  assert.ok(seen.cinctus.has('sleeping in burrow'), 'the watchman sleeps inside its burrow at night');
  assert.ok(stats.cinctus.homeMax < 1.8, `the watchman stays near its burrow (${stats.cinctus.homeMax.toFixed(2)})`);
  assert.ok(threatHidden, 'a fast large fish sends the watchman into its burrow');
  const w = subjects.cinctus;
  assert.ok(w.burrow && w.burrow.parent === scene && tank.notes.includes(w.burrow), 'the burrow is rendered and identifiable');
  assert.ok(Math.abs(w.home.y - sandHeight(w.home.x, w.home.z)) < .01, 'the burrow opens in the sand');
  reports[seed] = Object.fromEntries(options.map(s => [s, {modes: [...seen[s]].length, bites: stats[s].bites, displays: stats[s].displays}]));
});

// The threadfin butterflyfish (added later than the six above, in its own runs
// so their established scenarios are unchanged): it picks at the reef by day,
// stays upright and collision-free, and shelters beside the reef at night.
for (const seed of [23, 5150, 77001]) seeded(seed, () => {
  const tank = new ReefFish(new T.Scene(), reef(), [new T.Vector3(3, 1, .7)], templates([...all, 'auriga']), 1, gallery);
  const f = tank.add('auriga'); assert.ok(f, 'the threadfin butterflyfish can be added');
  const seen = new Set(); let bites = 0, last = -1;
  for (let frame = 0; frame < 9000; frame++) {
    const night = frame > 7200; tank.update(1 / 60, night); seen.add(f.mode);
    assert.ok([...f.position.toArray(), f.yaw, f.pitch].every(Number.isFinite) && Math.abs(f.pitch) < .75, 'the threadfin stays finite and upright');
    if (f.graze && f.graze.biteAt >= 0 && f.graze.biteAt !== last) {bites++; last = f.graze.biteAt;}
    if (frame % 120 === 0) {const snap = tank.snapshot(); assert.equal(snap.obstacleOverlaps, 0); assert.equal(snap.fishOverlaps, 0);}
  }
  assert.ok(seen.has('picking at the reef') && bites >= 4, `the threadfin picks at the reef (${bites} bites)`);
  assert.ok(seen.has('seeking shelter') || seen.has('resting near shelter'), 'the threadfin shelters at night');
  reports['auriga-' + seed] = {modes: [...seen], bites};
});

// Rival encounters, set up directly: dwarf angels chase each other, the foxface
// raises its spines toward a crowding tang and darkens, the kole tang turns
// broadside. Each ends and starts a cooldown.
for (const [s, other, mode] of [['loricula', 'bispinosa', 'chasing rival'], ['vulpinus', 'tang', 'raising venomous spines'], ['strigosus', 'tang', 'fin display']]) seeded(12, () => {
  const tank = new ReefFish(new T.Scene(), [], [new T.Vector3(3, 1, .7)], templates(), 1, [[s, 1], [other, 1]]);
  const [f, o] = tank.fish;
  f.position.set(0, 2.6, 0); f.yaw = 0; f.displayCooldown = 0; f.home.copy(f.position); f.shelter.copy(f.position);
  o.position.set(.2, 2.6, f.radius + o.radius + .3); o.yaw = Math.PI;
  for (const x of tank.fish) x.group.position.copy(x.position);
  let seen = false, mottle = 0;
  for (let frame = 0; frame < 480; frame++) {tank.update(1 / 60, false); if (f.mode === mode) seen = true; mottle = Math.max(mottle, f.mottle.value);}
  assert.ok(seen, `${s} reacts to a nearby ${other} with ${mode}`);
  if (s === 'vulpinus') assert.ok(mottle > .5, 'the threatened foxface darkens');
  assert.ok(f.displayCooldown > tank.clock + 3, `${s} displays have a cooldown`);
  assert.equal(tank.snapshot().fishOverlaps, 0);
});

// Removing a watchman takes its burrow with it; removing species leaves no
// stale references; the tank keeps moving collision-free afterwards.
seeded(9, () => {
  const scene = new T.Scene(), tank = new ReefFish(scene, reef(), [new T.Vector3(3, 1, .7)], templates(), 1, gallery);
  const w = tank.add('cinctus'), burrow = w.burrow;
  assert.equal(tank.remove('cinctus'), w);
  assert.ok(burrow.parent === null && !tank.notes.includes(burrow), 'the burrow leaves with its goby');
  const angel = tank.add('loricula'), rival = tank.add('bispinosa'); rival.rival = angel;
  tank.remove('loricula');
  assert.equal(rival.rival, null, 'no fish keeps a reference to a removed rival');
  for (let i = 0; i < 1200; i++) tank.update(1 / 60, false);
  const snap = tank.snapshot(); assert.equal(snap.obstacleOverlaps, 0); assert.equal(snap.fishOverlaps, 0);
});

// Options can be registered after construction, as the page does on first use.
seeded(4, () => {
  const tank = new ReefFish(new T.Scene(), reef(), [new T.Vector3(3, 1, .7)], templates(all.slice(0, 8)), 1, gallery);
  assert.equal(tank.add('vulpinus'), undefined, 'an unloaded option cannot be added yet');
  tank.addTemplates(templates(['vulpinus']));
  assert.ok(tank.add('vulpinus'), 'after loading, the option can be added');
});

console.log('Reef options passed: grazing, territories, displays, camouflage, cocoon, watchman burrow and stocking:', JSON.stringify(reports));
