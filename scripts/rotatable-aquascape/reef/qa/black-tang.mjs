import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
import ts from 'typescript';

// Exercise the real navigation class for the gallery-only black tang and for
// adding and removing animals, with lightweight articulated templates.
const sourceUrl = new URL('../ReefFish.ts', import.meta.url);
const metadata = JSON.parse(fs.readFileSync(new URL('../assets/fish/model-info.json', import.meta.url)));
const source = fs.readFileSync(sourceUrl, 'utf8')
  .replace("import metadata from './assets/fish/model-info.json';", `const metadata=${JSON.stringify(metadata)};`)
  .replace(/from\s+(['"])(\.[^'"]+)\1/g, (_, quote, path) => `from ${JSON.stringify(new URL(path, sourceUrl).href)}`)
  .replace("from 'three'", `from ${JSON.stringify(import.meta.resolve('three'))}`);
const {ReefFish, defaultPopulation} = await import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {
  compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext},
}).outputText).toString('base64'));

const species = ['tang', 'rostratum', 'semilarvatus', 'clown', 'anthias', 'chromis', 'gramma', 'goby'];
function templates(names = species) {
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
const gallery = [defaultPopulation[0], ['rostratum', 1], ...defaultPopulation.slice(1)];
const reef = () => [[-2.6, 1.2, -.3, .8], [0, .9, -.6, .7], [2.6, 1.3, -.2, .8], [-1.1, 2.6, -.9, .55]].map(([x, y, z, radius]) => ({center: new T.Vector3(x, y, z), radius}));
const angle = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

// The established population, used by Hidden Reef, is unchanged by default.
seeded(5, () => {
  const tank = new ReefFish(new T.Scene(), reef(), [new T.Vector3(3, 1, .7)], templates());
  assert.equal(tank.fish.length, 18);
  assert.equal(tank.count('rostratum'), 0, 'the black tang is gallery-only stocking');
});

const reports = [];
for (const seed of [17, 2026, 88123]) seeded(seed, () => {
  const tank = new ReefFish(new T.Scene(), reef(), [new T.Vector3(3, 1, .7)], templates(), 1, gallery);
  assert.equal(tank.fish.length, 19);
  const black = tank.fish.find(f => f.species === 'rostratum');
  const seen = new Set(); let bites = 0, lastBite = -1, grazingFrames = 0, boutFrames = 0, cruiseFold = 0, displayFrames = 0;
  let previousYaw = black.yaw, worstGrazeGap = 0;
  for (let frame = 0; frame < 21600; frame++) {
    tank.update(1 / 60, false);
    seen.add(black.mode);
    assert.ok([...black.position.toArray(), black.yaw, black.pitch, black.finFold.value].every(Number.isFinite));
    assert.ok(Math.abs(angle(black.yaw, previousYaw)) < .13, 'black tang turns continuously');previousYaw = black.yaw;
    assert.ok(Math.abs(black.pitch) < .5, 'black tang stays upright while grazing');
    if (black.mode === 'grazing algae' && black.graze) {
      grazingFrames++; boutFrames++;
      if (black.graze.biteAt !== lastBite && black.graze.biteAt >= 0) {bites++; lastBite = black.graze.biteAt;}
      // The snout works at the face it chose, from stand-off water.
      if (boutFrames > 60) worstGrazeGap = Math.max(worstGrazeGap, black.position.distanceTo(black.graze.point) - black.radius);
      if (boutFrames > 90) assert.ok(black.finFold.value < .08, 'sails stand raised while grazing');
    }
    if (black.mode !== 'grazing algae') boutFrames = 0;
    if (black.mode === 'cruising' && black.velocity.length() / black.group.scale.x > .3) cruiseFold = Math.max(cruiseFold, black.finFold.value);
    if (black.mode === 'fin display') displayFrames++;
    const pectorals = black.pectoral.filter(p => !p.userData.pelvic).map(p => p.rotation.y);
    assert.ok(pectorals[0] * pectorals[1] < 0, 'rowing pectorals stay on opposite flanks');
    if (frame % 120 === 0) {
      const s = tank.snapshot();
      assert.equal(s.obstacleOverlaps, 0, 'no fish inside the reef');
      assert.equal(s.fishOverlaps, 0, 'no fish inside another');
    }
  }
  assert.ok(seen.has('heading to graze') && seen.has('grazing algae'), 'black tang patrols to reef faces and grazes');
  assert.ok(bites >= 8, `black tang takes repeated grazing bites (${bites})`);
  assert.ok(worstGrazeGap < .12, `grazing happens beside the chosen surface (${worstGrazeGap.toFixed(3)})`);
  assert.ok(cruiseFold > .12, 'sails fold partly while patrolling');
  reports.push({seed, modes: [...seen], bites, displayFrames});
});

// Another tang nearby provokes a broadside display that sweeps the scalpel
// toward it; the display ends and a cooldown prevents constant sparring.
seeded(3, () => {
  const tank = new ReefFish(new T.Scene(), [], [new T.Vector3(3, 1, .7)], templates(), 1, [['rostratum', 1], ['tang', 1]]);
  const [black, blue] = tank.fish;
  black.position.set(0, 2.5, 0); black.yaw = 0; black.displayCooldown = 0;
  blue.position.set(.25, 2.5, .85); blue.yaw = Math.PI;
  for (const f of tank.fish) f.group.position.copy(f.position);
  let displayed = false, broadside = 0, towardRival = 0, frames = 0, peakFold = 0;
  for (let frame = 0; frame < 360; frame++) {
    tank.update(1 / 60, false);
    if (black.mode === 'fin display') {
      displayed = true; frames++;
      const rel = black.rival.position.clone().sub(black.position), heading = new T.Vector3(Math.cos(black.yaw), 0, -Math.sin(black.yaw));
      if (frames > 40) {
        broadside = Math.max(broadside, 1 - Math.abs(rel.setY(0).normalize().dot(heading)));
        const side = Math.sign(rel.x * Math.sin(black.yaw) + rel.z * Math.cos(black.yaw));
        if (side * black.turnBend.value > .3) towardRival++;
        peakFold = Math.max(peakFold, black.finFold.value);
      }
    }
  }
  assert.ok(displayed, 'a nearby tang starts a fin display');
  assert.ok(broadside > .85, 'the black tang turns broadside to its rival');
  assert.ok(towardRival > 10, 'the tail and scalpel sweep toward the rival');
  assert.ok(peakFold < .05, 'sails are fully raised during the display');
  assert.ok(black.displayCooldown > tank.clock + 5, 'displays have a cooldown');
});

// Adding releases an animal near the surface; removing releases its materials
// and every reference to it, including another fish's rival.
seeded(11, () => {
  const scene = new T.Scene();
  const tank = new ReefFish(scene, reef(), [new T.Vector3(3, 1, .7)], templates(), 1, gallery);
  const added = tank.add('rostratum');
  assert.ok(added, 'clear water near the surface is found');
  assert.equal(tank.count('rostratum'), 2);
  assert.ok(added.position.y > 4.3, 'released near the surface');
  assert.ok(added.home.y < added.position.y, 'its habitat is below the release water');
  assert.ok(tank.notes.includes(added.group) && added.group.parent === scene, 'new fish is identifiable and rendered');
  assert.equal(tank.snapshot().fishOverlaps, 0);
  const goby = tank.add('goby');
  assert.ok(goby && goby.position.y < 1.2, 'the mandarin is placed on validated bottom ground');
  const other = tank.fish.find(f => f.species === 'tang'); other.rival = added;
  const disposed = []; added.group.traverse(o => {if (o.material) o.material.addEventListener('dispose', () => disposed.push(o));});
  assert.equal(tank.remove('rostratum'), added, 'the most recently added animal leaves first');
  assert.equal(tank.count('rostratum'), 1);
  assert.ok(!tank.notes.includes(added.group) && added.group.parent === null);
  assert.ok(disposed.length > 0, 'its own materials are released');
  assert.equal(other.rival, null, 'no fish keeps a reference to a removed rival');
  for (let frame = 0; frame < 600; frame++) tank.update(1 / 60, false);
  assert.equal(tank.snapshot().obstacleOverlaps, 0);
  while (tank.remove('chromis'));
  assert.equal(tank.count('chromis'), 0);
  for (let frame = 0; frame < 120; frame++) tank.update(1 / 60, false);
  assert.equal(tank.add('lionfish'), undefined, 'only loaded species can be added');
});

console.log('Black tang grazing, sail folding, rival display and fish stocking passed:', JSON.stringify(reports));
