import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
import ts from 'typescript';

// Run the real navigation class against lightweight articulated templates. This
// exercises decisions, steering, actual displacement and fin poses without WebGL.
const sourceUrl = new URL('../ReefFish.ts', import.meta.url);
const metadata = JSON.parse(fs.readFileSync(new URL('../assets/fish/model-info.json', import.meta.url)));
let source = fs.readFileSync(sourceUrl, 'utf8')
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
function seeded(seed, run) {
  const previous = Math.random;
  Math.random = () => {seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296;};
  try {return run();} finally {Math.random = previous;}
}
function world(obstacles = []) {
  return new ReefFish(new T.Scene(), obstacles, [new T.Vector3(3, 1, .7), new T.Vector3(-3, 1, .7)], templates());
}
const angle = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
function pauseState(tank) {
  return {
    snapshot: tank.snapshot(), anatomy: tank.anatomySnapshot(),
    decisions: tank.fish.map(f => ({goal: f.goal.toArray(), until: f.until, mode: f.mode,
      velocity: f.velocity.toArray(), yaw: f.yaw, pitch: f.pitch, phase: f.clock.value,
      fins: f.pectoral.map(p => [p.position.toArray(), p.rotation.toArray(), p.userData.flutterTime])})),
  };
}

seeded(88, () => {
  const tank = world(); tank.clock = 200;
  // All initial decision deadlines are overdue: a zero step must still not
  // choose goals or mutate social/feeding state while the renderer is paused.
  const before = pauseState(tank);
  tank.update(0, false);
  assert.deepEqual(pauseState(tank), before, 'pause also freezes overdue decision timers');
});

const reports = [];
for (const seed of [419, 98237, 731]) seeded(seed, () => {
  const obstacles = [-1.5, 1.5].map(x => ({center: new T.Vector3(x, 1.1, -.35), radius: .65}));
  const tank = world(obstacles);
  assert.deepEqual([...new Set(tank.fish.map(f => f.species))].sort(), [...species].sort());
  assert.equal(tank.fish.length, 21, 'retain all existing inhabitants');
  const records = tank.fish.map(f => ({species: f.species, modes: new Set(), speeds: [], points: [], homeDistances: [], quiet: 0, coasts: 0}));
  let previous = tank.fish.map(f => f.yaw);
  for (let frame = 0; frame < 7200; frame++) {
    tank.update(1 / 60, false);
    tank.fish.forEach((f, index) => {
      assert.ok([...f.position.toArray(), ...f.velocity.toArray(), f.yaw, f.pitch, f.clock.value].every(Number.isFinite), f.species + ' remains finite');
      assert.ok(Math.abs(angle(f.yaw, previous[index])) < .13, f.species + ' turns continuously');
      assert.ok(Math.abs(f.pitch) < .5, f.species + ' remains upright');
      const speedBL = f.velocity.length() / f.group.scale.x;
      assert.ok(speedBL < 9, f.species + ' has bounded speed relative to its own size');
      previous[index] = f.yaw;
      if (frame % 30 === 0) {
        const row = records[index]; row.modes.add(f.mode); row.speeds.push(speedBL); row.points.push(f.position.toArray());
        row.homeDistances.push(f.position.distanceTo(f.species === 'gramma' ? f.shelter : f.home));
        if (speedBL < .05 && ['resting near shelter', 'holding feeding station', 'inspecting reef'].includes(f.mode)) row.quiet++;
        if (f.coasting) row.coasts++;
      }
    });
    if (frame % 60 === 0) {
      const snapshot = tank.snapshot();
      assert.equal(snapshot.obstacleOverlaps, 0, 'clearance survives species steering');
      assert.equal(snapshot.fishOverlaps, 0, 'schooling and shelter returns preserve spacing');
    }
  }
  for (const school of ['anthias', 'chromis']) {
    const members = records.filter(row => row.species === school);
    assert.ok(members.slice(1).every(row => row.speeds.some((speed, i) => Math.abs(speed - members[0].speeds[i]) > .05)), school + ' retain different speed histories');
  }
  const gramma = records.find(row => row.species === 'gramma'), butterfly = records.find(row => row.species === 'semilarvatus');
  assert.ok(gramma.modes.has('returning to shelter') && gramma.quiet > 3, 'royal gramma returns to shelter and makes actual rests');
  assert.ok(gramma.homeDistances.filter(distance => distance < 1.8).length > gramma.points.length * .7, 'gramma remains associated with its remembered shelter');
  assert.ok(butterfly.modes.has('cruising') && butterfly.quiet > 3, 'butterflyfish interrupts travel with actual reef inspections');
  const anthias = records.filter(row => row.species === 'anthias');
  assert.ok(anthias.filter(row => row.quiet > 3 && row.modes.has('cruising')).length >= 5, 'most anthias individually alternate stations and excursions');
  assert.ok(anthias.every(row => row.homeDistances.filter(distance => distance < 1.8).length > row.points.length * .6), 'anthias retain local feeding stations rather than traversing the whole tank');
  const before = pauseState(tank);
  for (let i = 0; i < 5; i++) tank.update(0, false);
  assert.deepEqual(pauseState(tank), before, 'a paused update leaves navigation, decisions and fins unchanged');
  reports.push({seed, species: species.map(name => {
    const rows = records.filter(row => row.species === name), speeds = rows.flatMap(row => row.speeds);
    return {name, modes: [...new Set(rows.flatMap(row => [...row.modes]))],
      minBL: Math.min(...speeds), maxBL: Math.max(...speeds), quiet: rows.reduce((sum, row) => sum + row.quiet, 0), coasts: rows.reduce((sum, row) => sum + row.coasts, 0)};
  })});
});

// Identical geometry, current and route, but only one fixture contains nearby
// conspecifics. Their crosswise velocities should change the chromis's steering
// rather than merely adding a species name to the same generic route.
function schoolResponse(neighborSpecies) {
  return seeded(907, () => {
    const tank = world(), members = tank.fish.filter(f => f.species === 'chromis').slice(0, 3);
    tank.fish.splice(0, tank.fish.length, ...members);
    const focal = members[0]; focal.position.set(0, 3.8, 0); focal.yaw = 0; focal.velocity.set(.2, 0, 0);
    focal.goal.set(3.6, 3.8, 0); focal.until = 30; focal.progressAt = 0; focal.progressPosition.copy(focal.position);
    focal.mode = 'cruising'; focal.holdUntil = 0; focal.strokeUntil = 30; focal.coasting = false;
    for (let frame = 0; frame < 60; frame++) {
      members.slice(1).forEach((fish, index) => {
        fish.species = neighborSpecies; fish.position.set(0, 3.8, index ? .9 : -.9);
        fish.velocity.set(0, 0, -.35); fish.yaw = Math.PI / 2;
        fish.goal.copy(fish.position).add(new T.Vector3(0, 0, -1));
        fish.until = 30; fish.progressAt = tank.clock; fish.progressPosition.copy(fish.position);
        fish.mode = 'cruising'; fish.holdUntil = 0; fish.strokeUntil = 30; fish.coasting = false;
      });
      tank.update(1 / 60, false);
      assert.equal(tank.snapshot().fishOverlaps, 0, 'alignment does not erase individual spacing');
    }
    return {alongSchool: -focal.velocity.clone().normalize().z, yaw: focal.yaw};
  });
}
const conspecific = schoolResponse('chromis'), unrelated = schoolResponse('gramma');
assert.ok(conspecific.alongSchool > unrelated.alongSchool + .025, 'chromis visibly align with neighboring chromis, beyond identical unrelated-fish avoidance');
console.log('Chromis social steering:', {conspecific, unrelated});

const captures = [];
for (const name of species.filter(name => name !== 'goby')) for (const steep of [0, 1, -1]) seeded(810, () => {
  const tank = world(), fish = tank.fish.find(f => f.species === name);
  tank.fish.splice(0, tank.fish.length, fish);
  fish.position.set(...(name === 'clown' ? [3, 1.9, .7] : [0, 3.2, .7]));
  fish.home.copy(fish.position); fish.shelter.copy(fish.position); fish.group.position.copy(fish.position);
  fish.goal.copy(fish.position); fish.progressPosition.copy(fish.position); fish.yaw = 0; fish.pitch = 0;
  const food = {position: fish.position.clone().add(new T.Vector3(steep ? .12 : .75, steep ? steep * .8 : .02, 0)), alive: true, age: 0, sinkRate: .00001};
  tank.foods.push(food);
  let elapsed = 0; const trace = [];
  while (food.alive && elapsed < 25) {
    tank.update(1 / 60, false); elapsed += 1 / 60;
    if (Math.round(elapsed * 60) % 180 === 0) trace.push({elapsed, position: fish.position.toArray(), goal: fish.goal.toArray(), yaw: fish.yaw, pitch: fish.pitch, mode: fish.mode});
  }
  if (!tank.snapshot().bites) console.log('Failed capture:', JSON.stringify({name, steep, food: food.position.toArray(), trace}));
  assert.equal(tank.snapshot().bites, 1, name + ' physically captures reachable ' + (steep ? 'steep' : 'horizontal') + ' food');
  assert.equal(food.alive, false);
  assert.ok(fish.feedingUntil > tank.clock && fish.food === null, 'a real bite commits a brief inspection before selecting more prey');
  const mouth = fish.mouth.position.clone().multiplyScalar(fish.group.scale.x).applyEuler(fish.group.rotation).add(fish.position);
  assert.ok(mouth.distanceTo(food.position) < .16, 'the pellet disappears at the mouth rather than from a remote goal');
  for (let frame = 0; frame < 120; frame++) tank.update(1 / 60, false);
  assert.equal(tank.snapshot().bites, 1, 'consumed prey and remembered feeding sites cannot invent another bite');
  captures.push({name, approach: steep > 0 ? 'above' : steep < 0 ? 'below' : 'horizontal', elapsed: Math.round(elapsed * 100) / 100});
});
console.log('Actual mouth-range captures:', captures);

// The former elapsed-time-times-frequency formula appeared smooth at startup
// but jumped during acceleration after minutes of running. Test that situation
// for every species and both paired fins, not just the bottom specialist.
for (const name of species) seeded(713, () => {
  const tank = world(), fish = tank.fish.find(f => f.species === name);
  tank.fish.splice(0, tank.fish.length, fish); tank.clock = 200;
  fish.progressAt = 200; fish.until = 230; fish.recoverUntil = 0;
  fish.goal.copy(fish.position).add(new T.Vector3(.6, 0, 0)); fish.yaw = 0;
  tank.update(1 / 60, false);
  let previous = fish.pectoral.map(p => ({phase: p.userData.flutterTime, rotation: p.rotation.toArray()}));
  for (let frame = 0; frame < 90; frame++) {
    // A changed load/speed must alter frequency without resetting its phase.
    if (frame === 25) fish.velocity.set(.8, 0, 0);
    if (frame === 50) fish.velocity.multiplyScalar(.1);
    tank.update(1 / 60, false);
    fish.pectoral.forEach((fin, i) => {
      const phase = fin.userData.flutterTime, increment = phase - previous[i].phase;
      assert.ok(Number.isFinite(phase) && increment > 0 && increment < 1, name + ' integrates a bounded continuous fin phase after acceleration at t=200');
      assert.ok(Math.abs(fin.rotation.x - previous[i].rotation[0]) < .24 &&
        Math.abs(fin.rotation.y - previous[i].rotation[1]) < .24, name + ' paired fin pose has no elapsed-time phase jump');
    });
    previous = fish.pectoral.map(p => ({phase: p.userData.flutterTime, rotation: p.rotation.toArray()}));
  }
  assert.notEqual(previous[0].phase, previous[1].phase, name + ' paired fins retain different phases');
});

console.log('Species motion: three seeded two-minute communities, finite upright movement, spacing, independent speed histories, paused state and long-running fin phase continuity passed.');
console.log(JSON.stringify(reports, null, 2));
