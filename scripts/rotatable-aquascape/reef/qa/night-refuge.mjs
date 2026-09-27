import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
import ts from 'typescript';

// Exercise real navigation and articulated poses without a renderer. The two
// reef obstacles leave ample safe refuge water below the daytime feeding groups.
const sourceUrl = new URL('../ReefFish.ts', import.meta.url);
const metadata = JSON.parse(fs.readFileSync(new URL('../assets/fish/model-info.json', import.meta.url)));
const source = fs.readFileSync(sourceUrl, 'utf8')
  .replace("import metadata from './assets/fish/model-info.json';", `const metadata=${JSON.stringify(metadata)};`)
  .replace(/from\s+(['"])(\.[^'"]+)\1/g, (_, quote, path) => `from ${JSON.stringify(new URL(path, sourceUrl).href)}`)
  .replace("from 'three'", `from ${JSON.stringify(import.meta.resolve('three'))}`);
const {ReefFish} = await import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {
  compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext},
}).outputText).toString('base64'));
const species = ['tang', 'semilarvatus', 'clown', 'anthias', 'chromis', 'gramma', 'goby'];

function templates() {
  return new Map(species.map(name => {
    const group = new T.Group(), mouth = new T.Group(), eyes = new T.Group();
    mouth.name = 'mouth'; mouth.position.fromArray(metadata[name].mouth); eyes.name = 'eyes';
    group.add(mouth, eyes);
    for (const side of [-1, 1]) {
      const fin = new T.Group(); fin.name = 'pectoral'; fin.position.set(.13, -.015, side * .09);
      fin.userData.restZ = fin.position.z; group.add(fin);
    }
    return [name, group];
  }));
}

function pausedState(tank) {
  return {
    snapshot: tank.snapshot(), anatomy: tank.anatomySnapshot(),
    decisions: tank.fish.map(f => ({goal: f.goal.toArray(), shelter: f.shelter.toArray(),
      velocity: f.velocity.toArray(), until: f.until, holdUntil: f.holdUntil,
      recoverUntil: f.recoverUntil, yaw: f.yaw, pitch: f.pitch, phase: f.clock.value})),
  };
}

const reports = [];
const originalRandom = Math.random;
try {
  for (const initialSeed of [419, 98237, 731]) {
    let seed = initialSeed;
    Math.random = () => {seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296;};
    const obstacles = [-1.5, 1.5].map(x => ({center: new T.Vector3(x, 1.1, -.35), radius: .65}));
    const tank = new ReefFish(new T.Scene(), obstacles,
      [new T.Vector3(3, 1, .7), new T.Vector3(-3, 1, .7)], templates());
    for (let frame = 0; frame < 7200; frame++) tank.update(1 / 60, false);
    const observations = tank.fish.map(f => ({species: f.species, samples: 0, quietRest: 0, low: 0, recovery: 0}));
    for (let frame = 0; frame < 10800; frame++) {
      tank.update(1 / 60, true);
      tank.fish.forEach(f => {
        assert.ok([...f.position.toArray(), ...f.velocity.toArray(), f.yaw, f.pitch].every(Number.isFinite), f.species + ' remains finite at night');
        assert.ok(Math.abs(f.pitch) < .5, f.species + ' descends upright rather than pitching steeply');
      });
      if (frame % 60 !== 0) continue;
      const snapshot = tank.snapshot();
      assert.equal(snapshot.obstacleOverlaps, 0, 'night refuge approach preserves rock clearance');
      assert.equal(snapshot.fishOverlaps, 0, 'crowded night refuges preserve fish spacing');
      tank.fish.forEach((fish, index) => {
        const row = observations[index]; row.samples++;
        if (fish.mode === 'resting near shelter' && fish.velocity.length() / fish.group.scale.x < .05) row.quietRest++;
        if (fish.position.y < 3.4) row.low++;
        if (tank.clock < fish.recoverUntil) row.recovery++;
      });
    }
    // Test observable settlement, not the presence of a "seeking shelter" label:
    // most upper-water fish must reach lower water and genuinely stop moving.
    for (const name of ['anthias', 'chromis']) {
      const rows = observations.filter(row => row.species === name);
      const total = rows.reduce((n, row) => n + row.samples, 0);
      assert.ok(rows.reduce((n, row) => n + row.quietRest, 0) > total * .5, name + ' spend most of the night observation resting after their descent');
      assert.ok(rows.reduce((n, row) => n + row.low, 0) > total * .75, name + ' actually reach lower reef-refuge water');
      assert.ok(rows.filter(row => row.quietRest > 10).length >= Math.ceil(rows.length * .7), name + ' settlement is distributed across the group');
    }
    const before = pausedState(tank);
    tank.update(0, true); tank.update(0, false);
    assert.deepEqual(pausedState(tank), before, 'paused night state and a zero-step day toggle cannot move fish or reassign refuges');
    reports.push({seed: initialSeed, species: species.map(name => {
      const rows = observations.filter(row => row.species === name), sum = key => rows.reduce((n, row) => n + row[key], 0);
      return {name, samples: sum('samples'), quietRest: sum('quietRest'), lowerReef: sum('low'), recovery: sum('recovery')};
    })});
  }
} finally {Math.random = originalRandom;}
console.log('Night refuges: three seeded communities descend, settle, preserve clearance and spacing, and freeze fully on pause.');
console.log(JSON.stringify(reports, null, 2));
