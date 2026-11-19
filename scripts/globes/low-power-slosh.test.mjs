import assert from 'node:assert/strict';
import test from 'node:test';
import { BufferAttribute, BufferGeometry, Matrix3, Vector3 } from 'three';
import { Slosh, SURFACE_RADIUS, WATER_LEVEL } from './src/lowPower/slosh.mjs';
import { RIPPLE_CURVATURE, SurfaceRipples } from './src/lowPower/ripples.mjs';
import { movingPlant } from './src/lowPower/plants.mjs';
import { BettaSwim } from './src/fish/bettaSwim.mjs';
import { buildScapePieces } from './src/render/scape/scene.mjs';
import { BED_LEVEL, GLASS_INNER } from './src/render/scape/mesh.mjs';
import { MOTION_VERTEX_STRIDE } from './src/render/scape/plantMotion.mjs';

test('a shove raises one wall, the wave overshoots, then the film settles level', () => {
  for (const hz of [15, 30, 60]) {
    const water = new Slosh();
    for (let i = 0; i < hz / 2; i++) water.step(1 / hz, [7, -24, 0], [0, 0, 0]);
    assert.ok(water.heightAt(0.8, 0) - water.heightAt(-0.8, 0) > 0.25);
    let minimum = 1;
    for (let i = 0; i < 8 * hz; i++) {
      water.step(1 / hz, [0, -24, 0], [0, 0, 0]);
      minimum = Math.min(minimum, water.sx);
    }
    assert.ok(minimum < -0.05);
    assert.ok(Math.abs(water.heightAt(0.8, 0) - WATER_LEVEL) < 0.001);
  }
});

test('surface sampling meets the drawn waterline on the sphere during repeated hard tilts', () => {
  const water = new Slosh();
  let maxWave = 0;
  for (let i = 0; i < 200; i++) {
    water.step(1 / 30, [24 * Math.sin(i / 8), -24, 24 * Math.cos(i / 8)], [1, 0, -1]);
    const a = i * 0.21;
    for (const angle of [a, a + Math.PI/2, a + Math.PI]) {
      const c = Math.cos(angle), s = Math.sin(angle);
      const y = WATER_LEVEL + water.ripples.heightAt(SURFACE_RADIUS*c, SURFACE_RADIUS*s);
      const r = Math.sqrt(GLASS_INNER**2 - y*y);
      const rim = new Vector3(r*c,y,r*s).applyQuaternion(water.rotation);
      assert.ok(Math.abs(rim.length() - GLASS_INNER) < 1e-10);
      assert.ok(Math.abs(rim.y - water.heightAt(rim.x,rim.z)) < .00012);
      maxWave = Math.max(maxWave,Math.abs(y-WATER_LEVEL));
    }
    assert.ok(Math.hypot(water.sx, water.sz) <= 0.371);
  }
  assert.ok(maxWave > .025);
});

test('a local impact travels across the surface, stays inside the glass and damps at different frame rates', () => {
  const samples = [];
  for (const hz of [15, 30, 60, 120]) {
    const w = new SurfaceRipples(1);
    w.disturb(0, 0, 0.115, 1.15);
    w.step(1 / hz, 0, 0);
    assert.equal(w.heightAt(0.40, 0), 0);
    for (let i = 1; i < hz; i++) w.step(1 / hz, 0, 0);
    samples.push(w.heightAt(0.40, 0));
    assert.notEqual(samples.at(-1), 0);
    assert.ok(w.data.some((v, i) => i % 4 === 0 && Math.abs(v - 128) >= 1));
    for (let i = 0; i < 7 * hz; i++) w.step(1 / hz, 0, 0);
    assert.ok(Math.max(...w.shown) < 0.0001);
    assert.ok(Math.abs(w.heightAt(1,0)) < 0.0001);
  }
  assert.ok(Math.max(...samples) - Math.min(...samples) < 1e-6);
});

test('rocking the bowl raises visible crests in addition to the mean tilt', () => {
  const water = new Slosh();
  let peak = 0;
  for (let i = 0; i < 75; i++) {
    water.step(1/30, [4*Math.sin(i/8), -24, 0], [0, 0, .2*Math.cos(i/8)]);
    let thirdMode = 0;
    for (let j = 0; j < 32; j++) {
      const a = j*Math.PI/16;
      const height = water.ripples.heightAt(SURFACE_RADIUS*Math.cos(a), SURFACE_RADIUS*Math.sin(a));
      thirdMode += height*Math.cos(3*a)/16;
    }
    // A tilted planar ring has no third angular harmonic.
    peak = Math.max(peak, Math.abs(thirdMode));
  }
  assert.ok(peak > .012);
});

test('a shove lifts one broad arc facing the current at any bearing', () => {
  const profiles = [];
  for (const bearing of [0, .68, 1.94]) {
    const water = new SurfaceRipples(1);
    for (let i=0; i<12; i++) water.step(1/60, .7*Math.cos(bearing), .7*Math.sin(bearing));
    const profile = [];
    for (let i=0; i<48; i++) {
      const angle = bearing + Math.PI*i/24;
      profile.push(water.heightAt(Math.cos(angle), Math.sin(angle)));
    }
    assert.ok(profile[0] > .012 && profile[24] < -.008);
    assert.ok(profile[0] > profile[4] && profile[4] > profile[8] && profile[8] > profile[12]);
    profiles.push(profile);
  }
  for (const profile of profiles.slice(1)) {
    const error = Math.max(...profile.map((v,i)=>Math.abs(v-profiles[0][i])));
    assert.ok(error < .08*profiles[0][0], 'the crest follows the gesture around the bowl');
  }
});

test('a steady stream into the wall settles without launching periodic splashes', () => {
  const water = new SurfaceRipples(1);
  let low = Infinity, high = -Infinity;
  for (let i=0; i<540; i++) {
    water.step(1/60, .6, 0);
    if (i>=480) {
      const height = water.heightAt(.88, .32);
      low = Math.min(low,height); high = Math.max(high,height);
    }
  }
  assert.ok(low > .003 && high-low < .0002);
  const mean = water.inside.reduce((sum,k) => sum + water.heights[k], 0) / water.inside.length;
  assert.ok(Math.abs(mean) < .000001, 'wall run-up conserves the water level');
});

test('a crest reaches the side, spreads along the wall and settles without changing the fill level', () => {
  const w = new SurfaceRipples(1);
  w.disturb(.93,0,.15,1);
  let near = 0, around = 0;
  for (let i = 0; i < 120; i++) {
    w.step(1/60,0,0);
    near = Math.max(near, Math.abs(w.heightAt(1,0)));
    around = Math.max(around, Math.abs(w.heightAt(Math.cos(.35),Math.sin(.35))));
    const mean = w.inside.reduce((sum,k) => sum+w.heights[k],0) / w.inside.length;
    assert.ok(Math.abs(mean)<1e-6);
  }
  assert.ok(near>.005 && around>.001);
  for (let i = 0; i < 420; i++) w.step(1/60,0,0);
  assert.ok(Math.abs(w.heightAt(1,0))<.0001);
});

test('opposite tilts send opposite ripples inward from the glass', () => {
  const left = new SurfaceRipples(1), right = new SurfaceRipples(1);
  for (let i = 0; i < 15; i++) {
    const push = i < 6 ? 0.8 : 0;
    left.step(1 / 30, -push, 0);
    right.step(1 / 30, push, 0);
  }
  assert.ok(Math.abs(right.heightAt(.65,0)) > .003);
  assert.ok(right.heightAt(.65,0)*left.heightAt(.65,0) < 0);
  assert.ok(Math.abs(right.heightAt(.65,0) - left.heightAt(-.65,0)) < 1e-6);
  assert.ok(Math.abs(right.heightAt(0,.65) - left.heightAt(0,.65)) < 1e-6);
});

test('the light texture resolves a focusing crest and a spreading trough', () => {
  const water = new SurfaceRipples(SURFACE_RADIUS);
  const centre = (water.shown.length - 1) / 2;
  const curvature = k => (water.data[4*k+3] - 128) / (127*RIPPLE_CURVATURE);
  assert.equal(curvature(centre), 0);
  water.disturb(0, 0, .22, .5);
  water.step(1/30, 0, 0);
  const h = water.shown, width = water.size;
  for (const k of [centre, centre + 5]) {
    const lap = (h[k-1] + h[k+1] + h[k-width] + h[k+width] - 4*h[k]) / water.cell**2;
    assert.ok(Math.abs(curvature(k) - lap) <= .5 / (127*RIPPLE_CURVATURE));
  }
  assert.ok(curvature(centre) < 0 && curvature(centre + 5) > 0);
  for (let i = 0; i < 300; i++) water.step(1/30, 0, 0);
  assert.equal(curvature(centre), 0);
});

test('a tilt produces reversing currents that are stronger near the surface and fade after release', () => {
  const water = new Slosh(), upper = [], lower = [], edge = [];
  for (let i = 0; i < 5; i++) water.step(1 / 30, [9, -24, 0], [0, 0, 0]);
  water.currentAt(0, 0.18, 0, BED_LEVEL, upper);
  water.currentAt(0, -0.55, 0, BED_LEVEL, lower);
  water.currentAt(0.7, 0.18, 0, BED_LEVEL, edge);
  assert.ok(upper[0] > 2 * lower[0] && lower[0] > 0.05);
  assert.ok(edge[0] < upper[0] && edge[1] > 0.1);
  let min = 0;
  for (let i = 0; i < 240; i++) {
    water.step(1 / 30, [0, -24, 0], [0, 0, 0]);
    water.currentAt(0, 0.18, 0, BED_LEVEL, upper);
    min = Math.min(min, upper[0]);
  }
  assert.ok(min < -0.1 && Math.hypot(...upper) < 0.012);
});

test('both rooted plants bend with a reversing flow and carry their collision capsules with them', () => {
  const [{ meshes, obstacles }] = buildScapePieces({ only: ['plants'], detail: 0.28 });
  for (const mesh of meshes) {
    const bend = velocity => {
      const geo = new BufferGeometry();
      geo.setAttribute('position', new BufferAttribute(mesh.positions, 3));
      geo.setAttribute('normal', new BufferAttribute(mesh.normals.slice(), 3));
      geo.setIndex(new BufferAttribute(mesh.indices, 1));
      const plant = movingPlant(mesh, geo, obstacles);
      const water = new Slosh();
      water.currentX = velocity;
      const upright = new Matrix3();
      for (let i = 0; i < 20; i++) plant.update(i / 30, 1 / 30, water, upright, [0, 0, 0], () => BED_LEVEL);
      return { positions: geo.getAttribute('position').array, plant };
    };
    const left = bend(-0.65), right = bend(0.65);
    let fixed = 0, tip = 0;
    for (let i = 0; i < mesh.positions.length / 3; i++) {
      const leaf = mesh.motion.vertex[i * MOTION_VERTEX_STRIDE];
      if (leaf < 0) {
        fixed++;
        for (let k = 0; k < 3; k++) assert.equal(right.positions[i * 3 + k], mesh.positions[i * 3 + k]);
      } else if (mesh.motion.vertex[i * MOTION_VERTEX_STRIDE + 1] > 0.9) {
        tip = Math.max(tip, right.positions[i * 3] - left.positions[i * 3]);
      }
    }
    assert.ok(fixed > 0 && tip > 0.02, mesh.name);
    const offsets = obstacles.filter(o => o.follow?.mesh === mesh.name).map(o =>
      right.plant.moveEnd(new Vector3(), o.b, o.follow.b).distanceTo(left.plant.moveEnd(new Vector3(), o.b, o.follow.b)));
    assert.ok(Math.max(...offsets) > 0.012, mesh.name);
  }
});

test('the swimming fish drifts downstream and aims into a cross-current on its route', () => {
  const swimFor = speed => {
    const fish = new BettaSwim();
    fish.compensateDrift = true;
    fish.heading = 0;
    fish.target = [-0.45, fish.position[1], fish.position[2]];
    const env = { radius: GLASS_INNER, level: WATER_LEVEL, sandLevel: BED_LEVEL, gravity: [0, -24, 0] };
    const water = { flow: [0, 0, speed], angular: [0, 0, 0], sand: BED_LEVEL, surface: WATER_LEVEL, submerged: 1, airAbove: 0 };
    for (let i = 0; i < 36; i++) fish.advance(1 / 30, water.flow, env, true, water);
    return fish;
  };
  const left = swimFor(-0.28), right = swimFor(0.28);
  assert.ok(left.drift[2] < -0.045 && right.drift[2] > 0.045);
  assert.ok(left.heading > 0.15 && right.heading < -0.15);
});
