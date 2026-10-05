import * as THREE from 'three';
import { Escapement } from './escapement.js';
import { RootCrown } from './rootCrown.js';
import { RootNetwork } from './roots.js';
import { HeroFlower } from './heroFlower.js';
import { Greenhouse } from './greenhouse.js';
import { Garden } from './garden.js';
import { Flora } from './flora.js';
import { Foliage } from './foliage.js';
import { Atmosphere } from './atmosphere.js';
import { Lighting } from './lighting.js';
import { Sky } from './sky.js';
import { Skep, Seedpods, PorcelainLily, GlassBlossom, BeetleReed, CopperTree } from './props.js';
import { L, CROWN_FACE } from './layout.js';
import { B } from '../direction/beats.js';
import { RNG } from '../core/rng.js';
import { clamp, sseg } from '../core/ease.js';

// Assembles the garden and wires the energy network between its parts.

export function buildWorld(scene, mat, tex, quality) {
  const w = {};
  w.lighting = new Lighting(scene, quality);
  w.sky = new Sky();
  scene.add(w.sky.mesh);

  w.greenhouse = new Greenhouse(mat, quality, tex.stone);
  scene.add(w.greenhouse.group);
  w.garden = new Garden(mat, quality, tex);
  scene.add(w.garden.group);
  w.flora = new Flora(mat, quality);
  scene.add(w.flora.group);
  w.foliage = new Foliage(mat, quality, w.flora);
  scene.add(w.foliage.group);
  w.atmosphere = new Atmosphere(quality);
  scene.add(w.atmosphere.group);

  // heartbeat
  w.escapement = new Escapement(mat);
  // outlet must point toward the crown: outlet local angle −0.444 rad
  const toCrown = new THREE.Vector2(L.crown.x - L.escapement.x, -(L.crown.z - L.escapement.z));
  w.escapement.place(L.escapement, Math.atan2(toCrown.y, toCrown.x) + 0.444, 0.1);
  scene.add(w.escapement.group);

  w.crown = new RootCrown(mat);
  w.crown.place(L.crown, CROWN_FACE);
  scene.add(w.crown.group);

  w.flower = new HeroFlower(mat);
  scene.add(w.flower.group);

  // props
  w.skep = new Skep(mat, w.greenhouse.stone);
  scene.add(w.skep.group);
  w.lily = new PorcelainLily(mat);
  scene.add(w.lily.group);
  w.blossom = new GlassBlossom(mat);
  scene.add(w.blossom.group);
  w.reed = new BeetleReed(mat);
  scene.add(w.reed.group);
  w.tree = new CopperTree(mat);
  scene.add(w.tree.group);
  w.pods = new Seedpods(mat, [
    { pos: new THREE.Vector3(-7.5, 0, 5.5), count: 5, spread: 2.6, h: [3, 8], wakeAt: 10.6 },
    { pos: new THREE.Vector3(6, 0, -9), count: 6, spread: 3.2, h: [4, 10], wakeAt: 11.4 },
    { pos: new THREE.Vector3(-12, 0, 20), count: 4, spread: 2.2, h: [2, 6], wakeAt: 12.2 },
    { pos: new THREE.Vector3(13, 0, 7), count: 5, spread: 2.5, h: [3, 9], wakeAt: 12.6 },
  ]);
  scene.add(w.pods.group);

  // update world matrices so we can sample attachment points
  scene.updateMatrixWorld(true);

  // ---- energy network -------------------------------------------------
  w.roots = new RootNetwork(mat);
  scene.add(w.roots.group);
  const out = w.escapement.outletWorld();
  const inlet = w.crown.inletWorld();
  const crownZ = new THREE.Vector3(0, 0, 1).applyQuaternion(w.crown.group.quaternion);
  const rng = new RNG('mainroot');
  const mainPts = [];
  const a = out.clone();
  const b = inlet.clone().addScaledVector(crownZ, 3.2).setY(0.35);
  const side = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3(0, 1, 0)).normalize();
  const outDir = out.clone().sub(L.escapement).setY(0).normalize();
  mainPts.push(a.clone());
  mainPts.push(a.clone().addScaledVector(outDir, 1.4).setY(0.3));
  const wig = [1.6, -1.8, 1.2, -0.6];
  for (let i = 1; i <= 4; i++) {
    const k = i / 5;
    const p = a.clone().lerp(b, k).addScaledVector(side, wig[i - 1]);
    p.y = 0.2 + rng.range(-0.05, 0.15);
    mainPts.push(p);
  }
  mainPts.push(b);
  mainPts.push(inlet.clone().addScaledVector(crownZ, 1.2).setY(inlet.y - 0.2));
  mainPts.push(inlet.clone());
  w.mainRoot = w.roots.addRoot(mainPts, { r0: 0.34, r1: 0.3, t0: B.pulseLaunch, t1: B.pulseArrive, rootlets: 14, name: 'main' });

  // secondary roots: crown → seedpods, skep, lily, blossom, reed, far garden
  const crownBase = L.crown.clone().setY(0.2);
  const sec = [
    { to: new THREE.Vector3(-7.5, 0.1, 5.5), t0: 9.4, t1: 10.8 },
    { to: new THREE.Vector3(6, 0.1, -9), t0: 9.6, t1: 11.5 },
    { to: new THREE.Vector3(-12, 0.1, 20), t0: 9.8, t1: 12.3 },
    { to: new THREE.Vector3(13, 0.1, 7), t0: 9.9, t1: 12.7 },
    { to: L.skep.clone().add(new THREE.Vector3(-3, 0.3, 3)), t0: 10.0, t1: 13.0 },
    { to: L.lily.clone().setY(0.2), t0: 10.2, t1: 12.8 },
    { to: L.glassBlossom.clone().setY(0.2), t0: 10.3, t1: 13.4 },
    { to: L.beetleStem.clone().setY(0.2), t0: 10.1, t1: 12.4 },
    { to: new THREE.Vector3(-40, 0.1, -36), t0: 10.4, t1: 14.6 },
    { to: new THREE.Vector3(30, 0.1, -40), t0: 10.6, t1: 15.0 },
  ];
  const rs = new RNG('secroots');
  for (const s of sec) {
    const pts = [crownBase.clone()];
    const d = s.to.clone().sub(crownBase);
    const perp = new THREE.Vector3(-d.z, 0, d.x).normalize();
    const n = 3;
    for (let i = 1; i <= n; i++) {
      const k = i / (n + 1);
      pts.push(crownBase.clone().addScaledVector(d, k).addScaledVector(perp, rs.range(-1.5, 1.5)).setY(0.12 + rs.range(-0.05, 0.08)));
    }
    pts.push(s.to.clone());
    w.roots.addRoot(pts, { r0: 0.18, r1: 0.1, t0: s.t0, t1: s.t1, collars: d.length() > 12, rootlets: 3, gain: 0.8 });
  }

  // ---- shadow LOD ---------------------------------------------------------
  // Once the reveal has pulled far back, small casters (creatures, the hero
  // flower's fine parts, moss, leaf clusters) stop casting into the sun's
  // wide shadow map: their shadows are sub-pixel there but cost most of the
  // shadow pass. A pure function of t, so seeking stays deterministic.
  const smallCasters = [];
  const collect = (root) => root.traverse((o) => { if (o.isMesh && o.castShadow) smallCasters.push(o); });
  collect(w.flower.group);
  for (const o of [...w.garden.smallCasters, ...w.flora.smallCasters]) if (o.castShadow) smallCasters.push(o);
  let farShadows = null;
  w.setFarShadows = (far) => {
    if (far === farShadows) return;
    farShadows = far;
    for (const o of smallCasters) o.castShadow = !far;
    if (w.creatures) w.creatures.group.traverse((o) => { if (o.isMesh) { o.userData.cast0 ??= o.castShadow; o.castShadow = far ? false : o.userData.cast0; } });
  };

  // ---- per-frame update -------------------------------------------------
  const pulseTmp = new THREE.Vector3();
  // ctx.explore (interactive modes): the explore controller owns creatures,
  // shadow LOD and the practical lights; the world just runs its clockwork
  w.update = (t, ctx) => {
    if (ctx.explore) return updateExplore(t, ctx);
    w.setFarShadows(t > B.reveal[0] + 4.8);
    w.sky.update(t, ctx);
    w.lighting.update(t, ctx);
    w.atmosphere.update(t, ctx);
    w.escapement.update(t, ctx);
    w.crown.update(t, ctx);
    w.roots.update(t, ctx);
    w.flower.update(t, ctx);
    w.garden.update(t, ctx);
    w.flora.update(t, ctx);
    w.foliage.update(t, ctx);
    w.skep.update(t, ctx);
    w.pods.update(t, ctx);
    w.lily.update(t, ctx);
    w.blossom.update(t, ctx);
    if (w.creatures) w.creatures.update(t, ctx);

    // the travelling pulse carries a real light with it
    const P = w.lighting.pulse;
    if (t >= B.pulseLaunch - 0.2 && t < B.pulseArrive + 0.6) {
      w.roots.pulsePoint(w.mainRoot, t, pulseTmp);
      P.position.copy(pulseTmp).add(new THREE.Vector3(0, 0.6, 0));
      P.intensity = 7 * sseg(t, B.pulseLaunch - 0.1, B.pulseLaunch + 0.2) * (1 - sseg(t, B.pulseArrive, B.pulseArrive + 0.6) * 0.6);
    } else if (t >= B.stemClimb[0] && t < B.stemClimb[1] + 0.5) {
      const k = clamp(w.flower.veinPulse.uPulse.value);
      w.flower.stemCurve.getPointAt(k, pulseTmp);
      P.position.copy(pulseTmp).add(new THREE.Vector3(-0.6, 0, 0.6));
      P.intensity = 4 * (1 - sseg(t, B.stemClimb[1] - 0.3, B.stemClimb[1] + 0.5));
    } else if (t >= B.pulseArrive + 0.6 && t < B.stemClimb[0]) {
      w.crown.group.localToWorld(pulseTmp.set(-1.5, 1.25, 1.6));
      P.position.copy(pulseTmp);
      P.intensity = 2.5;
    } else {
      P.intensity = 0;
    }
    // pallet sparks light the movement from within at every tick
    const S = w.lighting.spark;
    w.escapement.fork.getWorldPosition(S.position);
    S.position.y += 0.4;
    if (t < B.pulseArrive) {
      S.intensity = 0.4 + w.escapement.tickSpark * (0.22 + w.escapement.charge * 0.6);
    } else {
      // then warms the root crown's gears while the barrel releases
      w.crown.group.localToWorld(S.position.set(-1.5, 1.6, 2.2));
      S.distance = 9;
      S.intensity = 3.5 * sseg(t, B.pulseArrive - 0.2, B.pulseArrive + 0.3) * (1 - sseg(t, 10.5, 12.5));
    }
    if (t < B.pulseArrive) S.distance = 6;
    const skepWake = sseg(t, B.podsWake[0] + 2, B.beeEmerge);
    w.skep.entranceWorld(pulseTmp);
    w.lighting.skep.position.copy(pulseTmp).add(new THREE.Vector3(0, 0.5, 0));
    w.lighting.skep.intensity = skepWake * 6 * ctx.lightScale;
  };
  // the garden fully awake on a free-running clock (t is well past the film)
  const updateExplore = (t, ctx) => {
    w.sky.update(t, ctx);
    w.lighting.update(t, ctx);
    w.atmosphere.update(t, ctx);
    // winding the garden runs the movement and the train on faster clocks
    w.escapement.update(ctx.escT ?? t, ctx);
    w.crown.update(ctx.crownT ?? t, ctx);
    w.roots.update(t, ctx);
    w.flower.update(t, ctx);
    w.garden.update(t, ctx);
    w.flora.update(t, ctx);
    w.foliage.update(t, ctx);
    w.skep.update(t, ctx);
    w.pods.update(t, ctx);
    w.lily.update(t, ctx);
    w.blossom.update(t, ctx);
  };
  return w;
}
