import * as THREE from 'three';
import { Bee } from './bee.js';
import { APX9Bee } from './apx9.js';
import { Butterfly } from './butterfly.js';
import { Beetle } from './beetle.js';
import { Dragonfly } from './dragonfly.js';
import { Bird } from './bird.js';
import { B } from '../direction/beats.js';
import { clamp, lerp, seg, sseg, smoother, trapezoid, easeInOutSine } from '../core/ease.js';
import { fbm1, RNG } from '../core/rng.js';
import { L } from '../world/layout.js';

// Creature choreography. Each creature's position, orientation and pose are
// pure functions of time, derived from flight paths through the garden.

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;

// Orient a creature group so its +Z faces `forward`, with bank `roll` and
// pitch from the vertical component of travel.
export function orient(group, forward, roll = 0, pitchBias = 0) {
  const f = forward.clone();
  if (f.lengthSq() < 1e-8) f.set(0, 0, 1); // defined fallback, never a stale heading
  f.normalize();
  const yaw = Math.atan2(f.x, f.z);
  const pitch = -Math.asin(clamp(f.y, -1, 1)) + pitchBias;
  group.rotation.set(pitch, yaw, roll, 'YXZ');
}

// Orient with an explicit surface normal as "up" (for walkers on stems).
function orientOnSurface(group, forward, up) {
  const z = forward.clone().normalize();
  const y = up.clone().addScaledVector(z, -up.dot(z)).normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  const m = new THREE.Matrix4().makeBasis(x, y, z);
  group.quaternion.setFromRotationMatrix(m);
}

// A timed flight along a Catmull-Rom path with a trapezoidal speed profile.
export class Flight {
  constructor(points, t0, t1, { accel = 0.2, decel = 0.25, wobble = 0.15, seed = 1 } = {}) {
    this.curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    this.t0 = t0;
    this.t1 = t1;
    this.accel = accel;
    this.decel = decel;
    this.wobble = wobble;
    this.seed = seed;
  }
  k(t) {
    return trapezoid(seg(t, this.t0, this.t1), this.accel, this.decel);
  }
  at(t, target = V(0, 0, 0)) {
    const k = this.k(t);
    this.curve.getPointAt(k, target);
    const w = this.wobble * Math.sin(Math.PI * clamp(k));
    target.x += fbm1(t * 1.7, this.seed) * w;
    target.y += fbm1(t * 2.1, this.seed + 3) * w;
    target.z += fbm1(t * 1.9, this.seed + 7) * w;
    return target;
  }
  velocity(t, dt = 1 / 60) {
    // sample inside the flight so headings stay defined (and history-free)
    // before it starts and after it ends
    const span = this.t1 - this.t0;
    const tc = clamp(t, this.t0 + span * 0.02 + dt, this.t1 - span * 0.02 - dt);
    return this.at(tc + dt).sub(this.at(tc - dt)).multiplyScalar(0.5 / dt);
  }
  bank(t, gain = 0.03) {
    const dt = 1 / 30;
    t = clamp(t, this.t0 + dt * 2, this.t1 - dt * 2);
    const v0 = this.velocity(t - dt), v1 = this.velocity(t + dt);
    const a = v1.clone().sub(v0).multiplyScalar(0.5 / dt);
    const f = v0.clone().add(v1).setY(0);
    if (f.lengthSq() < 1e-6) return 0;
    f.normalize();
    const right = V(f.z, 0, -f.x);
    return clamp(-a.dot(right) * gain, -0.7, 0.7);
  }
}

// Hover-and-dart: holds near waypoints with a little drift, then darts to the
// next one with a short, sharp acceleration (dragonflies, hummingbirds).
class HoverDart {
  constructor(points, times, dartDur = 0.35, seed = 1) {
    this.points = points;
    this.times = times; // time each dart toward points[i+1] begins
    this.dartDur = dartDur;
    this.seed = seed;
  }
  at(t, target = V(0, 0, 0)) {
    let i = 0;
    while (i < this.times.length && t > this.times[i]) i++;
    const from = this.points[Math.max(0, i - 1)], to = this.points[Math.min(this.points.length - 1, i)];
    if (i === 0) target.copy(this.points[0]);
    else {
      const k = clamp((t - this.times[i - 1]) / this.dartDur);
      target.copy(from).lerp(to, smoother(k));
    }
    target.x += fbm1(t * 1.3, this.seed) * 0.35;
    target.y += fbm1(t * 1.7, this.seed + 2) * 0.25;
    target.z += fbm1(t * 1.1, this.seed + 4) * 0.35;
    return target;
  }
  velocity(t, dt = 1 / 60) {
    return this.at(t + dt).sub(this.at(t - dt)).multiplyScalar(0.5 / dt);
  }
}

export class Creatures {
  constructor(world, mat, quality) {
    this.world = world;
    this.group = new THREE.Group();
    this.group.name = 'creatures';
    const add = (c) => { this.group.add(c.group); return c; };
    const skep = world.skep;
    const flower = world.flower;
    const headW = flower.head.getWorldPosition(V(0, 0, 0));
    this.headW = headW;

    // ---- the hero pollinator -------------------------------------------
    this.hero = add(new APX9Bee(mat, { detail: 'hero', quality })); // APX-9, the resident pollinator
    const out = V(0, 0, 1).applyQuaternion(skep.group.quaternion);
    // APX-9 stands ~1.25 tall on its legs; the board's top is at 3.55
    this.beeInside = skep.group.localToWorld(V(0, 4.8, 3.4));
    this.beeBoard = skep.group.localToWorld(V(0, 4.8, 6.3));
    this.landLocal = V(0.0, 3.2, 1.95); // standing on the anther ring
    const land = flower.head.localToWorld(this.landLocal.clone());
    this.land = land;
    const approach = land.clone().sub(headW).setY(0).normalize();
    this.heroFlight = new Flight([
      this.beeBoard.clone().add(V(0, 0.4, 0)),
      this.beeBoard.clone().addScaledVector(out, 3.5).add(V(0, 3.5, 0)),
      this.beeBoard.clone().lerp(land, 0.5).add(V(-2, 19, 4)),
      land.clone().addScaledVector(approach, 6).add(V(1.5, 3, 0)),
      land.clone().addScaledVector(approach, 1.6).add(V(0, 0.9, 0)),
      land.clone(),
    ], B.beeTakeoff, B.beeLand, { accel: 0.18, decel: 0.32, wobble: 0.35, seed: 4 });
    this.heroLeave = new Flight([
      land.clone(),
      land.clone().add(V(0, 2.2, 1.2)),
      land.clone().add(V(8, 9, 10)),
      land.clone().add(V(28, 24, 30)),
    ], B.beeLeave, B.beeLeave + 3.2, { accel: 0.35, decel: 0.0, wobble: 0.3, seed: 5 });
    this.heroRise = new Flight([
      headW.clone().add(V(-4, 4, 6)),
      headW.clone().add(V(4, 14, 12)),
      headW.clone().add(V(16, 34, 14)),
      headW.clone().add(V(30, 70, -20)),
    ], B.rise[0], B.rise[1] + 2, { accel: 0.3, decel: 0.0, wobble: 0.6, seed: 6 });

    // ---- monarch ----------------------------------------------------------
    this.monarch = add(new Butterfly(mat, 'monarch', { detail: 'hero' }));
    const perch = world.lily.perchWorld();
    this.monarchPerch = perch;
    this.monarchIn = new Flight([
      perch.clone().add(V(-14, 9, 6)),
      perch.clone().add(V(-7, 5, 4)),
      perch.clone().add(V(-2.5, 2.4, 1.2)),
      perch.clone().add(V(0, 0.5, 0)),
      perch.clone(),
    ], 27.4, B.monarchLand, { accel: 0.1, decel: 0.4, wobble: 0.5, seed: 11 });

    // ---- beetle and ladybird --------------------------------------------------
    this.beetle = add(new Beetle(mat, 'jewel'));
    this.beetle.group.scale.setScalar(0.85);
    this.ladybird = add(new Beetle(mat, 'ladybird'));
    this.ladybird.group.scale.setScalar(0.8);
    this.ladyLeaf = world.reed.leaf;
    { const reed = world.reed; const rest = reed.group.localToWorld(reed.curve.getPointAt(1).clone().add(V(0.6, 0.9, 0.4)));
      this.ladyRest = rest;
      this.ladyFly = new Flight([rest.clone(), rest.clone().add(V(0.5, 2.5, 1)), rest.clone().add(V(4, 7, -2)), rest.clone().add(V(14, 16, -14))], B.ladybirdFly, B.ladybirdFly + 2.6, { accel: 0.4, decel: 0, wobble: 0.4, seed: 81 }); }

    // ---- hummingbird -----------------------------------------------------------
    this.hummingbird = add(new Bird(mat, 'hummingbird'));
    const blossom = world.blossom;
    this.nectar = blossom.nectarWorld();
    this.mouth = blossom.mouthWorld();
    this.bellAxis = blossom.axisWorld();

    // ---- songbird --------------------------------------------------------------
    this.songbird = add(new Bird(mat, 'songbird'));
    this.songPerch = world.tree.perchWorld(0.72);
    const perchTan = world.tree.perchCurve.getTangentAt(0.72).applyQuaternion(world.tree.group.quaternion);
    this.songFacing = V(-perchTan.z, 0, perchTan.x).normalize(); // perpendicular to the bough
    if (this.songFacing.dot(V(1, 0, 1)) < 0) this.songFacing.negate(); // face toward the camera side
    this.songFlight = new Flight([
      this.songPerch.clone(),
      this.songPerch.clone().add(V(4, 4, 4)),
      V(20, 60, 0),
      V(-10, 140, -160),
      V(-60, 240, -400),
    ], B.songbirdTakeoff, B.songbirdTakeoff + 8, { accel: 0.25, decel: 0.0, wobble: 1.2, seed: 21 });

    // ---- supporting cast -------------------------------------------------------
    const rng = new RNG('cast');
    this.cast = [];
    const castFlight = (start, t0, dur, rise, seed) => new Flight([
      start.clone(),
      start.clone().add(V(rng.range(-8, 8), rise * 0.25, rng.range(-8, 8))),
      start.clone().add(V(rng.range(-30, 30), rise * 0.6, rng.range(-40, 10))),
      start.clone().add(V(rng.range(-60, 60), rise, rng.range(-140, -40))),
    ], t0, t0 + dur, { accel: 0.25, decel: 0.0, wobble: 0.8, seed });
    // honeybees and carpenter bees around the skep (seen in the skep shot), then rising
    for (let i = 0; i < 4; i++) {
      const b = add(new Bee(mat, i < 3 ? 'honey' : 'carpenter', { detail: 'mid' }));
      const c = skep.group.position.clone().add(V(0, 7, 0));
      const orbitR = 7 + i * 1.6;
      // flight paths are built up front so the timeline stays deterministic
      b._rise = castFlight(c.clone().add(V(Math.cos(i) * orbitR, i, Math.sin(i) * orbitR)), B.rise[0] - 0.5 + i * 0.35, 7, 140 + i * 30, 30 + i);
      this.cast.push({ kind: 'bee', c: b, update: (t) => {
        if (t < B.rise[0] - 0.5) {
          const a = t * (0.55 + i * 0.12) + i * 1.7;
          b.group.position.set(c.x + Math.cos(a) * orbitR, c.y + Math.sin(t * 1.3 + i) * 2.5 + i, c.z + Math.sin(a) * orbitR);
          orient(b.group, V(-Math.sin(a), 0.1 * Math.cos(t * 1.3 + i), Math.cos(a)), -0.3);
          b.setPose({ t: t + i * 0.37, flap: 1, freq: i === 3 ? 17.3 : 24.7, fold: 0, grip: 0 });
          b.group.visible = t > B.podsWake[1];
        } else {
          b.group.visible = true;
          b._rise.at(t, b.group.position);
          orient(b.group, b._rise.velocity(t), b._rise.bank(t));
          b.setPose({ t: t + i * 0.37, flap: 1, freq: i === 3 ? 17.3 : 24.7 });
        }
      } });
    }
    // extra bumblebees and butterflies that rise through the light in the reveal
    const riseStarts = [V(-40, 20, -30), V(25, 18, -60), V(-70, 26, -110), V(60, 22, -150), V(-20, 30, -200), V(10, 24, -90), V(-90, 30, -40)];
    riseStarts.forEach((st, i) => {
      let c;
      if (i < 2) c = add(new APX9Bee(mat, { detail: 'lod', quality }));
      else c = add(new Butterfly(mat, i % 2 ? 'swallowtail' : 'monarch', { detail: 'mid' }));
      c.group.scale.setScalar(i < 2 ? 1.4 : 1.6);
      const f = castFlight(st, B.rise[0] + i * 0.45, 7.5, 150 + i * 20, 50 + i);
      this.cast.push({ kind: 'riser', c, update: (t) => {
        c.group.visible = t > B.rise[0] - 1;
        f.at(t, c.group.position);
        const v = f.velocity(t);
        if (c instanceof APX9Bee) {
          orient(c.group, v, f.bank(t));
          c.setPose({ t: t + i, flap: 1, fold: 0 });
        } else {
          orient(c.group, v.clone().setY(v.y * 0.3), f.bank(t) * 0.5);
          c.setPose({ t: t + i * 0.3, open: 0.6, flap: 0.9, freq: 2.6 + i * 0.2, grip: 0 });
        }
      } });
    });
    // swallowtails gliding between plants behind the monarch
    for (let i = 0; i < 2; i++) {
      const s = add(new Butterfly(mat, 'swallowtail', { detail: 'mid' }));
      const base = perch.clone().add(V(-10 - i * 8, 4 + i * 3, -18 - i * 6));
      this.cast.push({ kind: 'glider', c: s, update: (t) => {
        const a = t * 0.35 + i * 2.5;
        s.group.position.set(base.x + Math.sin(a) * 9, base.y + Math.sin(a * 2.3) * 2, base.z + Math.cos(a) * 6);
        orient(s.group, V(Math.cos(a) * 9, Math.cos(a * 2.3) * 4.6, -Math.sin(a) * 6), -Math.cos(a) * 0.3);
        const glide = Math.max(0, Math.sin(t * 0.9 + i)) ;
        s.setPose({ t, open: 0.85, flap: 0.8 * (1 - glide * 0.8), freq: 2.2, grip: 0 });
        s.group.visible = t > 27 && t < 33;
      } });
    }
    // dragonflies: hover and dart near the reed and the blossom
    const dfA = add(new Dragonfly(mat, { palette: 'teal' }));
    const dfB = add(new Dragonfly(mat, { palette: 'sapphire' }));
    const reedP = world.reed.surfacePoint(0.6, 0.6);
    const pathA = new HoverDart([reedP.clone().add(V(-12, 6, -10)), reedP.clone().add(V(-6, 9, -16)), reedP.clone().add(V(-16, 12, -8)), reedP.clone().add(V(-30, 20, -30))], [33.3, 34.6, 35.6], 0.3, 61);
    const pathB = new HoverDart([this.mouth.clone().add(V(10, 6, -12)), this.mouth.clone().add(V(4, 9, -18)), this.mouth.clone().add(V(16, 5, -14)), this.mouth.clone().add(V(30, 14, -30))], [37.0, 38.3, 39.6], 0.3, 62);
    for (const [df, path, t0, t1] of [[dfA, pathA, 31.5, 36.5], [dfB, pathB, 35.0, 41]]) {
      this.cast.push({ kind: 'dragonfly', c: df, update: (t) => {
        df.group.visible = t > t0 && t < t1;
        if (!df.group.visible) return;
        path.at(t, df.group.position);
        const v = path.velocity(t);
        const speed = v.length();
        const face = speed > 2 ? v : V(Math.sin(t * 0.3), 0, Math.cos(t * 0.3));
        orient(df.group, face.clone().setY(face.y * 0.3), clamp(-v.x * 0.01, -0.4, 0.4));
        df.setPose({ t, flap: 1, glide: 0 });
      } });
    }
    // a dragonfly in the reveal, darting across the light
    const dfC = add(new Dragonfly(mat, { palette: 'teal' }));
    dfC.group.scale.setScalar(1.8);
    const pathC = new HoverDart([V(-20, 60, -40), V(10, 74, -80), V(-30, 90, -130), V(20, 120, -220)], [44.5, 46.2, 48.0], 0.4, 63);
    this.cast.push({ kind: 'dragonfly', c: dfC, update: (t) => {
      dfC.group.visible = t > 42;
      pathC.at(t, dfC.group.position);
      const v = pathC.velocity(t);
      orient(dfC.group, v.length() > 2 ? v.setY(v.y * 0.3) : V(1, 0, -1));
      dfC.setPose({ t, flap: 1 });
    } });
    // a second (sapphire) hummingbird crossing the reveal
    const hb2 = add(new Bird(mat, 'hummingbird'));
    hb2.group.scale.setScalar(1.6);
    const hb2f = new Flight([V(-60, 40, -20), V(-20, 55, -50), V(20, 70, -120), V(40, 100, -220)], 45.0, 51.0, { accel: 0.2, decel: 0.1, wobble: 1.5, seed: 70 });
    this.cast.push({ kind: 'hb2', c: hb2, update: (t) => {
      hb2.group.visible = t > 44.5;
      hb2f.at(t, hb2.group.position);
      orient(hb2.group, hb2f.velocity(t), hb2f.bank(t), -0.3);
      hb2.setPose({ t, spread: 1, flap: 1, freq: 17.3, tailSpread: 0.4, pitch: -0.2 });
    } });
  }

  update(t, ctx) {
    this.updateHero(t, ctx);
    this.updateMonarch(t, ctx);
    this.updateBeetles(t, ctx);
    this.updateHummingbird(t, ctx);
    this.updateSongbird(t, ctx);
    for (const c of this.cast) c.update(t, ctx);
  }

  // where APX-9 is at time t in the film and how hard its wings work (for the
  // wing-wash on the foliage): a pure function of t, like updateHero
  heroAt(t, out) {
    if (t < B.beeEmerge) { out.copy(this.beeInside); return 0; }
    if (t < B.beeTakeoff) {
      out.lerpVectors(this.beeInside, this.beeBoard, sseg(t, B.beeEmerge, B.beeEmerge + 0.9));
      return 0.6 * sseg(t, B.beeEmerge + 1.0, B.beeTakeoff);
    }
    if (t < B.beeLand) { this.heroFlight.at(t, out); return 1; }
    if (t < B.beeLeave) { out.copy(this.land); const s = t - B.beeLand; return s < 0.4 ? 1 - s / 0.4 : 0; }
    if (t < B.rise[0]) { this.heroLeave.at(t, out); return t < B.beeLeave + 3.4 ? 1 : 0; }
    this.heroRise.at(t, out);
    return 1;
  }

  updateHero(t, ctx) {
    const bee = this.hero;
    const g = bee.group;
    const flower = this.world.flower;
    g.visible = true;
    if (t < B.beeEmerge) {
      g.visible = t > B.beeEmerge - 0.5;
      g.position.copy(this.beeInside);
      orient(g, this.beeBoard.clone().sub(this.beeInside));
      bee.setPose({ t, fold: 1, walk: null, grip: 1, flap: 0 });
      return;
    }
    if (t < B.beeTakeoff) {
      const k = sseg(t, B.beeEmerge, B.beeEmerge + 0.9);
      g.position.lerpVectors(this.beeInside, this.beeBoard, k);
      g.position.y += 0.05 * Math.abs(Math.sin(t * 12));
      orient(g, this.beeBoard.clone().sub(this.beeInside));
      const unfold = sseg(t, B.beeEmerge + 0.7, B.beeEmerge + 1.1);
      const warm = sseg(t, B.beeEmerge + 1.0, B.beeTakeoff);
      bee.setPose({ t, fold: 1 - unfold, walk: k < 1 ? t * 3 : null, grip: 1, flap: warm * 0.9, look: Math.sin(t * 3) * 0.2 * (1 - warm) });
      return;
    }
    if (t < B.beeLand) {
      const f = this.heroFlight;
      f.at(t, g.position);
      const v = f.velocity(t);
      const landK = sseg(t, B.beeLand - 0.7, B.beeLand);
      const fwd = v.lengthSq() > 0.5 ? v : this.land.clone().sub(this.headW).negate();
      orient(g, fwd.clone().setY(fwd.y * (1 - landK)), f.bank(t), -0.25 * landK);
      bee.setPose({ t, flap: 1, grip: sseg(t, B.beeLand - 0.9, B.beeLand - 0.1), fold: 0, look: 0 });
      return;
    }
    if (t < B.beeLeave) {
      const s = t - B.beeLand;
      const settle = Math.exp(-s * 6) * Math.sin(s * 20) * 0.08;
      const pos = flower.head.localToWorld(this.landLocal.clone().add(V(Math.sin(s * 1.3) * 0.15, settle + Math.abs(Math.sin(s * 5)) * 0.04, Math.sin(s * 0.9) * 0.1)));
      g.position.copy(pos);
      const toCore = flower.coreWorld().sub(pos);
      orient(g, toCore.setY(toCore.y * 0.4), Math.sin(s * 2.1) * 0.05, -0.15);
      const pollen = sseg(t, B.pollen[0], B.pollen[1]);
      const nibble = Math.sin(s * 9) * 0.5 + 0.5;
      bee.setPose({ t, flap: s < 0.4 ? 1 - s / 0.4 : 0, grip: 1, fold: sseg(s, 0.3, 1.0) * 0.7, pollen, walk: s > 0.8 && s < 2.4 ? s * 1.6 : null, pitch: -0.1 + nibble * 0.06 });
      ctx.pollenTouch = pollen * (0.5 + 0.5 * nibble);
      return;
    }
    if (t < B.rise[0]) {
      const f = this.heroLeave;
      f.at(t, g.position);
      orient(g, f.velocity(t), f.bank(t));
      bee.setPose({ t, flap: 1, grip: 1 - sseg(t, B.beeLeave, B.beeLeave + 0.5), fold: 0, pollen: 1 });
      g.visible = t < B.beeLeave + 3.4;
      return;
    }
    const f = this.heroRise;
    f.at(t, g.position);
    orient(g, f.velocity(t), f.bank(t));
    bee.setPose({ t, flap: 1, grip: 0, fold: 0, pollen: 1 });
  }

  updateMonarch(t) {
    const m = this.monarch;
    const g = m.group;
    g.visible = t > 27.3 && t < 41;
    if (!g.visible) return;
    if (t < B.monarchLand) {
      const f = this.monarchIn;
      f.at(t, g.position);
      const v = f.velocity(t);
      const landK = sseg(t, B.monarchLand - 0.5, B.monarchLand);
      orient(g, v.clone().setY(v.y * 0.3 * (1 - landK)), f.bank(t) * 0.4);
      m.setPose({ t, open: lerp(0.55, 0, landK), flap: lerp(1, 0.25, landK), freq: 3.1, grip: landK });
      return;
    }
    // perched on the lily rim, which dips under its weight
    const perch = this.world.lily.perchWorld();
    g.position.copy(perch);
    const s = t - B.monarchLand;
    // wings settle closed, then open slowly on their hinges, breathe, close
    const open = sseg(t, B.monarchOpen[0], B.monarchOpen[1]) * (1 - sseg(t, 32.6, 33.6) * 0.6);
    const breathe = Math.sin(s * 1.6) * 0.04 * open;
    // stand on the petal: up = petal's inner normal, facing out toward the rim
    const lily = this.world.lily;
    orientOnSurface(g, lily.perchTangentWorld(), lily.perchNormalWorld());
    m.setPose({ t, open: open + breathe, flap: 0, grip: 1, pitch: Math.sin(s * 0.8) * 0.02 });
  }

  updateBeetles(t) {
    const reed = this.world.reed;
    // jewel beetle climbs from low on the reed and slips under the leaf
    const bt = this.beetle;
    bt.group.visible = t > 31.0 && t < 37;
    if (bt.group.visible) {
      const k = lerp(0.18, 0.79, smoother(seg(t, 31.6, 35.6)));
      const ang = 0.6 + Math.sin(t * 0.7) * 0.15;
      const p = reed.surfacePoint(k, ang);
      const pAhead = reed.surfacePoint(Math.min(1, k + 0.02), ang);
      const axisP = reed.group.localToWorld(reed.curve.getPointAt(k));
      const up = p.clone().sub(axisP).normalize();
      bt.group.position.copy(p).addScaledVector(up, 0.32);
      orientOnSurface(bt.group, pAhead.sub(p), up);
      const dist = k * 22; // stride phase from distance travelled
      bt.setPose({ t, walk: (dist / 1.1) % 1, open: 0, wings: 0, look: Math.sin(t * 1.3) * 0.15 });
      // disappears beneath the leaf near the top
      bt.group.visible = k < 0.785 || t < 35.4;
    }
    // ladybird rests on the seed head, opens its shell, unfurls wings, flies
    const lb = this.ladybird;
    lb.group.visible = t > 31.0 && t < 38;
    if (lb.group.visible) {
      const rest = this.ladyRest;
      const open = sseg(t, B.ladybirdFly - 1.1, B.ladybirdFly - 0.5);
      const wings = sseg(t, B.ladybirdFly - 0.7, B.ladybirdFly - 0.2);
      if (t < B.ladybirdFly) {
        lb.group.position.copy(rest);
        orient(lb.group, V(0.5, 0, 1));
        lb.setPose({ t, open, wings, flap: wings * 0.4 });
      } else {
        this.ladyFly.at(t, lb.group.position);
        orient(lb.group, this.ladyFly.velocity(t), 0, -0.6);
        lb.setPose({ t, open: 1, wings: 1, flap: 1 });
      }
    }
  }

  updateHummingbird(t) {
    const hb = this.hummingbird;
    const g = hb.group;
    const [t0, t1] = B.hummingbird;
    g.visible = t > t0 - 0.8 && t < t1 + 0.6;
    if (!g.visible) return;
    const axis = this.bellAxis; // points out of the bell's mouth
    const inside = this.mouth.clone().addScaledVector(axis, -1.0); // the nectar zone
    const hoverOut = this.mouth.clone().addScaledVector(axis, 1.7);
    const arrive = sseg(t, t0 - 0.8, t0 + 0.9);
    const dip = sseg(t, t0 + 0.9, t0 + 1.4) * (1 - sseg(t, t0 + 2.6, t0 + 3.0));
    const turn = sseg(t, t0 + 3.0, t0 + 3.7);
    const leave = sseg(t, t1 - 0.6, t1 + 0.4);
    // facing: beak along the bell axis, then round to the camera, then away
    const face = axis.clone().negate().lerp(V(-1, 0, 1).normalize(), turn).lerp(V(1, 0.3, -1).normalize(), leave);
    orient(g, face, 0, 0);
    // hovering posture: body tilted upright, head held level so the beak stays on line
    const sip = dip;
    hb.setPose({ t, spread: 1, flap: 1, freq: 17.3, tailSpread: 0.35 + turn * 0.5 + Math.sin(t * 2) * 0.1, pitch: -0.5, headPitch: 0.5, headTilt: sip * 0.05 + turn * Math.sin(t * 3) * 0.08, headYaw: turn * Math.sin(t * 1.7) * 0.25 });
    g.updateMatrixWorld(true);
    // phase A: place the beak tip (approach → into the bell → back out)
    const tip = hoverOut.clone().add(V(14, 6, -10)).lerp(hoverOut, arrive).lerp(inside, dip);
    tip.y += Math.sin(t * 5.3) * 0.05 * (1 - dip);
    const posA = g.position.clone().add(tip.sub(hb.beakTipWorld()));
    // phase B: hover beside the lens, then dart away
    const camSide = hoverOut.clone().add(V(-4.6, 0.9, 4.8));
    const posB = posA.clone().lerp(camSide, turn);
    posB.y += Math.sin(t * 5.3) * 0.08;
    posB.lerp(camSide.clone().add(V(16, 12, -14)), leave * leave);
    g.position.copy(posA.lerp(posB, turn));
  }

  updateSongbird(t) {
    const sb = this.songbird;
    const g = sb.group;
    g.visible = t > 39.4;
    if (!g.visible) return;
    if (t < B.songbirdTakeoff) {
      g.position.copy(this.songPerch).add(V(0, 0.95 * sb.S, 0));
      // quick, discrete head turns as birds do, with a curious tilt
      const beats = [39.5, 40.7, 41.6, 42.9, 44.0, 45.3, 46.1];
      const yaws = [0.3, -0.5, 0.15, 0.6, -0.2, 0.45, 0.0];
      let yaw = 0;
      for (let i = 0; i < beats.length; i++) yaw = lerp(yaw, yaws[i], smoother(clamp((t - beats[i]) / 0.12)));
      const tilt = Math.sin(t * 0.9) * 0.18 + (t > 42.7 && t < 43.6 ? 0.35 : 0);
      orient(g, this.songFacing, 0, 0);
      const unfold = sseg(t, B.songbirdTakeoff - 0.8, B.songbirdTakeoff - 0.1);
      const ruffle = sseg(t, 41.2, 41.6) * (1 - sseg(t, 42.2, 42.6));
      sb.setPose({ t, spread: unfold, flap: unfold * 0.12, freq: 3, raise: unfold, tailSpread: 0.2 + unfold * 0.7, headTilt: tilt * (1 - unfold), headYaw: yaw * (1 - unfold), perch: 1 - unfold * 0.5, ruffle });
      return;
    }
    const f = this.songFlight;
    f.at(t, g.position);
    g.position.y += 0.95 * sb.S * (1 - sseg(t, B.songbirdTakeoff, B.songbirdTakeoff + 0.4));
    orient(g, f.velocity(t), f.bank(t, 0.02), -0.1);
    sb.setPose({ t, spread: 1, flap: 1, freq: 3.4, tailSpread: 0.6, perch: 0 });
  }
}
