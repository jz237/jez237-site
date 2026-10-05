import * as THREE from 'three';
import { track, pose, blendPose, drift } from './camera.js';
import { B } from './beats.js';
import { clamp, lerp, seg, sseg } from '../core/ease.js';

// The shot list. Each shot owns a camera move, a lighting rig, and a look.
// Shots may dissolve in from the previous one; during a dissolve both are
// rendered (the world state is shared — only camera and rig differ).
//
// Rig fields: env, envIntensity, exposure, fog [color, density], bloom,
//   key (sun multiplier), ambient (hemisphere multiplier),
//   subject(t) → [centre, radius]   (shadow frustum, beam and rim aim)
//   beam { dir | dirFn(cam, centre), intensity, color, spread }
//   rim { intensity, color }, godrays

const V = (x, y, z) => new THREE.Vector3(x, y, z);

// beam from behind the subject relative to the camera, raised
const backBeam = (side = 0.5, up = 0.9) => (cam, c) => {
  const b = c.clone().sub(cam).setY(0).normalize();
  const s = V(-b.z, 0, b.x);
  return b.multiplyScalar(1).addScaledVector(s, side).add(V(0, up, 0));
};
// beam from beside the camera (a three-quarter key)
const sideBeam = (side = 1, up = 0.8) => (cam, c) => {
  const f = cam.clone().sub(c).setY(0).normalize();
  const s = V(-f.z, 0, f.x);
  return f.multiplyScalar(0.6).addScaledVector(s, side).add(V(0, up, 0));
};

export function createShots(world) {
  const esc = world.escapement;
  const crown = world.crown;
  const flower = world.flower;
  const roots = world.roots;
  const C = world.creatures;
  const escL = (x, y, z) => esc.group.localToWorld(V(x, y, z));
  const crownL = (x, y, z) => crown.group.localToWorld(V(x, y, z));
  const headW = flower.head.getWorldPosition(V(0, 0, 0));
  const shots = [];

  // ---------------------------------------------------------------------
  // 1. HEARTBEAT → ROOT. Extreme close-up of the ticking escapement in the
  //    dark. The camera eases back to reveal the movement as the charge
  //    builds; at launch it swings round to chase the pulse along the root.
  {
    const keysEsc = [
      { t: 0.0, pos: escL(1.75, 2.05, 0.55), target: escL(1.05, 0.55, -0.3), fov: 28, aperture: 26 },
      { t: 1.8, pos: escL(2.1, 3.1, 1.1), target: escL(0.6, 0.5, -0.1), fov: 30, aperture: 22 },
      { t: 3.3, pos: escL(2.9, 5.2, 2.6), target: escL(0.2, 0.4, 0.05), fov: 32, aperture: 16 },
    ];
    const tmpA = V(0, 0, 0), tmpB = V(0, 0, 0);
    const rootDir = world.mainRoot.curve.getPointAt(1).sub(world.mainRoot.curve.getPointAt(0)).setY(0).normalize();
    const follow = (t) => {
      const lag = 0.5;
      // the camera stops travelling just before the root rises into its
      // socket (a flattened direction there would collapse and flip)
      const tc = Math.min(t, B.pulseArrive - 0.7);
      const p = roots.pulsePoint(world.mainRoot, t, tmpA.clone());
      const pc = roots.pulsePoint(world.mainRoot, tc, V(0, 0, 0));
      const pb = roots.pulsePoint(world.mainRoot, tc - lag, tmpB.clone());
      const flat = pc.clone().sub(pb).setY(0);
      const w = clamp(flat.length() / 0.8);
      const fwd = rootDir.clone().lerp(flat.normalize(), w).normalize();
      const side = V(-fwd.z, 0, fwd.x);
      const camPos = pb.clone().addScaledVector(fwd, -2.6).addScaledVector(side, 2.3).add(V(0, 1.55, 0));
      const target = p.clone().addScaledVector(fwd, 1.6 * (1 - sseg(t, B.pulseArrive - 0.7, B.pulseArrive))).add(V(0, 0.35, 0));
      return pose(camPos, target, { fov: 34, focus: camPos.distanceTo(p), aperture: 20 });
    };
    shots.push({
      name: 'heartbeat',
      t0: 0,
      t1: 8.25,
      view(t) {
        let p = drift(track(keysEsc, t), t, 0.012, 1);
        if (t > B.pulseLaunch - 0.25) {
          // swing to the outlet as it flares, then chase the pulse
          const outlet = esc.outletWorld();
          const toOutlet = pose(escL(4.6, 2.2, -0.6), outlet.clone().add(V(0.4, 0.15, 0.35)), { fov: 32, aperture: 22 });
          p = blendPose(p, toOutlet, sseg(t, B.pulseLaunch - 0.25, B.pulseLaunch + 0.35));
          p = blendPose(p, follow(t), sseg(t, B.pulseLaunch + 0.45, B.pulseLaunch + 1.5));
        }
        return p;
      },
      rig: (t) => ({
        env: 'dawn', envIntensity: 0.3, exposure: 1.5, fog: ['#03090c', 0.003], bloom: 0.28, shadowTint: 0.2,
        key: 0.6, ambient: 0.32,
        subject: () => (t < B.pulseLaunch + 0.6 ? [escL(0.6, 0.5, 0.2), 3.6] : [roots.pulsePoint(world.mainRoot, t).add(V(0, 0.3, 0)), 5]),
        beam: { dirFn: sideBeam(-1.2, 1.4), intensity: 1.1, color: '#ffd9ac', spread: 1.2 },
        rim: { intensity: 1.5, color: '#5fb3bb' },
      }),
    });
  }

  // ---------------------------------------------------------------------
  // 2. THE ROOT CROWN → STEM CLIMB. Cut on the click releasing; the whole
  //    train spins up together; the camera cranes up the stem with the light.
  {
    const climb = () => flower.stemCurve.getPointAt(clamp(flower.veinPulse.uPulse.value));
    const keys = [
      { t: 8.25, pos: crownL(-2.2, 2.2, 6.2), target: crownL(-0.5, 1.8, 0), fov: 32, aperture: 16 },
      { t: 10.2, pos: crownL(-1.0, 2.5, 5.0), target: crownL(0.1, 2.1, 0), fov: 32, aperture: 16 },
    ];
    shots.push({
      name: 'crown',
      t0: 8.25,
      t1: 13.4,
      view(t) {
        let p = drift(track(keys, t), t, 0.012, 2);
        if (t > 9.8) {
          const k = sseg(t, 9.8, 13.4);
          const c = climb();
          const dir = V(Math.sin(-0.95), 0, Math.cos(-0.95));
          const camPos = c.clone().addScaledVector(dir, lerp(7.5, 15, k)).add(V(0, lerp(0.5, -2.5, k), 0));
          const tgt = c.clone().add(V(0, lerp(1.0, 3.2, k), 0));
          const cr = pose(camPos, tgt, { fov: lerp(32, 34, k), aperture: lerp(14, 10, k) });
          p = blendPose(p, cr, sseg(t, 9.8, 11.0));
        }
        return p;
      },
      rig: (t) => ({
        env: 'dawn', envIntensity: 0.32, exposure: 1.5, fog: ['#061820', 0.003], bloom: 0.3, shadowTint: 0.2,
        key: 0.7, ambient: 0.38,
        subject: () => [t < 10.5 ? crownL(0, 2, 0) : climb(), t < 10.5 ? 5 : 9],
        beam: { dirFn: sideBeam(1.0, 1.1), intensity: 1.5, color: '#ffd9ac', spread: 1.1 },
        rim: { intensity: 0.9, color: '#6fb8bd' },
      }),
    });
  }

  // ---------------------------------------------------------------------
  // 3. THE BLOOM. The bud catches the first warm beam; petals open ring by
  //    ring while the camera arcs to reveal the linkages, then leans in as
  //    the stamens rise around the amber core.
  {
    const around = (angle, dist, height) => headW.clone().add(V(Math.sin(angle) * dist, height, Math.cos(angle) * dist));
    const keys = [
      { t: 13.4, pos: around(-0.62, 15, -2.5), target: headW.clone().add(V(0, 2.6, 0)), fov: 34, aperture: 11 },
      { t: 16.0, pos: around(-0.5, 17, 0.5), target: headW.clone().add(V(0, 1.6, 0)), fov: 34, aperture: 10 },
      { t: 18.8, pos: around(-0.22, 21, 7.5), target: headW.clone().add(V(0, 0.5, 0)), fov: 34, aperture: 9 },
      { t: 21.8, pos: around(-0.06, 15, 11.0), target: headW.clone().add(V(0, 1.0, 0)), fov: 32, aperture: 11 },
    ];
    shots.push({
      name: 'bloom',
      t0: 13.4,
      t1: 21.8,
      view(t) {
        return drift(track(keys, t), t, 0.03, 3);
      },
      rig: (t) => ({
        env: 'dawn', envIntensity: lerp(0.6, 0.85, sseg(t, 13.4, 20)), exposure: 1.25, fog: ['#0d2226', 0.002], bloom: 0.32,
        key: 1.0, ambient: 1.25,
        subject: () => [headW, 11],
        beam: { dirFn: backBeam(0.9, 1.0), intensity: lerp(1.5, 4.5, sseg(t, 13.6, 17)), color: '#ffcf96', spread: 1.0 },
        rim: { intensity: 0.8, color: '#7fc0c4' },
      }),
    });
  }

  // ---------------------------------------------------------------------
  // 4. THE SKEP. Establish the bee's brass hive, then push in as our
  //    pollinator crawls out, unfolds its wings and lifts off.
  {
    const skep = world.skep;
    const ent = skep.entranceWorld();
    // pick the chase side that stays clear of the bloom, once, so it never flips
    let chaseSign = 1;
    if (C?.heroFlight) {
      const f = C.heroFlight;
      const a = f.at(B.beeLand - 1.0), b = f.at(B.beeLand - 0.6);
      const fw = b.clone().sub(a).setY(0).normalize();
      const sd = V(-fw.z, 0, fw.x);
      if (b.clone().addScaledVector(sd, 8).distanceTo(headW) < b.clone().addScaledVector(sd, -8).distanceTo(headW)) chaseSign = -1;
    }
    const out = V(0, 0, 1).applyQuaternion(skep.group.quaternion);
    const side = V(-out.z, 0, out.x);
    const keys = [
      { t: 21.8, pos: ent.clone().addScaledVector(out, 24).addScaledVector(side, 9).add(V(0, 6, 0)), target: ent.clone().add(V(0, 3.0, 0)), fov: 32, aperture: 7 },
      { t: 23.4, pos: ent.clone().addScaledVector(out, 10).addScaledVector(side, 4.5).add(V(0, 2.4, 0)), target: ent.clone().addScaledVector(out, 0.8).add(V(0, 0.8, 0)), fov: 32, aperture: 11 },
    ];
    shots.push({
      name: 'skep',
      t0: 21.8,
      t1: 24.5,
      view(t) {
        let p = drift(track(keys, t), t, 0.02, 4);
        if (C?.hero) p.focus = p.pos.distanceTo(C.hero.group.position);
        if (C?.hero && t > B.beeTakeoff - 0.1) {
          // chase: ride alongside the bee as it climbs toward the open bloom
          const f = C.heroFlight;
          const bp = f.at(Math.min(t, B.beeLand - 0.05));
          const behind = f.at(Math.max(B.beeTakeoff, Math.min(t, B.beeLand - 0.05) - 0.45));
          const fwd = bp.clone().sub(behind);
          if (fwd.lengthSq() < 1e-4) fwd.set(-1, 0.4, -1);
          fwd.normalize();
          // profile chase: ride beside the bee so its wings and body read
          const side = V(-fwd.z, 0, fwd.x).normalize();
          const cam = bp.clone().addScaledVector(side, 8.0 * chaseSign).addScaledVector(fwd, -1.6).add(V(0, 2.2, 0));
          const tgt = bp.clone().addScaledVector(fwd, 1.4);
          const chase = pose(cam, tgt, { fov: 34, focus: cam.distanceTo(bp), aperture: 11 });
          p = blendPose(p, chase, sseg(t, B.beeTakeoff + 0.15, B.beeTakeoff + 0.95));
        }
        return p;
      },
      rig: (t) => ({
        env: 'dawn', envIntensity: 0.8, exposure: 1.2, fog: ['#11262a', 0.002], bloom: 0.3,
        key: 1.0, ambient: 1.2,
        subject: () => [skep.group.position.clone().add(V(0, 5, 0)), 12],
        beam: { dirFn: sideBeam(-1.0, 0.9), intensity: 3.5, color: '#ffd09a' },
        rim: { intensity: 0.9, color: '#7fc0c4' },
      }),
    });
  }

  // ---------------------------------------------------------------------
  // 5. POLLINATION. Close on the bloom as the bee lands on the anther ring,
  //    gathers light into its pollen baskets, and the flower answers.
  {
    const land = C?.land ?? headW.clone().add(V(0, 2.5, 1.9));
    const keys = [
      { t: 24.5, pos: land.clone().add(V(-6.2, 6.4, 7.2)), target: land.clone().add(V(0.3, 0.6, 0.2)), fov: 30, aperture: 11 },
      { t: 25.9, pos: land.clone().add(V(-5.4, 5.6, 6.4)), target: land.clone().add(V(0, -0.3, -0.5)), fov: 30, aperture: 12 },
      { t: 28.6, pos: land.clone().add(V(-4.0, 4.4, 5.0)), target: land.clone().add(V(0.1, -0.2, -0.6)), fov: 30, aperture: 12 },
    ];
    shots.push({
      name: 'pollination',
      t0: 24.5,
      t1: 28.4,
      view(t) {
        const p = drift(track(keys, t), t, 0.012, 5);
        if (C?.hero) p.focus = p.pos.distanceTo(C.hero.group.position);
        return p;
      },
      rig: () => ({
        env: 'dawn', envIntensity: 0.8, exposure: 1.0, fog: ['#11262a', 0.002], bloom: 0.3,
        key: 1.0, ambient: 1.1,
        subject: () => [land, 6],
        beam: { dirFn: backBeam(-0.8, 0.9), intensity: 2.8, color: '#ffcf96' },
        rim: { intensity: 0.6, color: '#7fc0c4' },
      }),
    });
  }

  // ---------------------------------------------------------------------
  // 6. MONARCH on the porcelain lily – wings opening slowly on their hinges.
  {
    const perch = world.lily.perchWorld();
    const n = world.lily.perchNormalWorld();
    const tg = world.lily.perchTangentWorld();
    const side = new THREE.Vector3().crossVectors(n, tg).normalize();
    const camDir = n.clone().multiplyScalar(0.92).addScaledVector(tg, 0.32).addScaledVector(side, -0.2).normalize();
    const keys = [
      { t: 28.0, pos: perch.clone().addScaledVector(camDir, 15).add(V(-2, 1, 1)), target: perch.clone().add(V(-3, 2.2, 1.0)), fov: 30, aperture: 11 },
      { t: 29.4, pos: perch.clone().addScaledVector(camDir, 12), target: perch.clone().addScaledVector(n, 0.3), fov: 30, aperture: 12 },
      { t: 32.8, pos: perch.clone().addScaledVector(camDir, 10), target: perch.clone().addScaledVector(n, 0.4), fov: 30, aperture: 12 },
    ];
    shots.push({
      name: 'monarch',
      t0: 28.4,
      t1: 32.4,
      dissolve: 0.8,
      view(t) {
        const p = drift(track(keys, t), t, 0.02, 6);
        if (C?.monarch) p.focus = p.pos.distanceTo(C.monarch.group.position);
        return p;
      },
      rig: () => ({
        env: 'dawn', envIntensity: 0.9, exposure: 1.15, fog: ['#13282a', 0.002], bloom: 0.3,
        key: 1.0, ambient: 1.2,
        subject: () => [perch, 8],
        beam: { dirFn: sideBeam(1.0, 1.0), intensity: 3.5, color: '#ffd5a2' },
        rim: { intensity: 0.9, color: '#86c6c8' },
      }),
    });
  }

  // ---------------------------------------------------------------------
  // 7. BEETLE climbing the copper reed; a ladybird opens its shell and flies.
  {
    const reed = world.reed;
    const mid = reed.surfacePoint(0.45, 0.6);
    const outN = V(Math.cos(0.6), 0, Math.sin(0.6));
    const sideN = V(-outN.z, 0, outN.x);
    const keys = [];
    shots.push({
      name: 'beetle',
      t0: 32.4,
      t1: 35.8,
      dissolve: 0.6,
      view(t) {
        // follow the climbing beetle (positions sampled slightly late = lag)
        const bp = C.beetle.group.position.clone();
        const base = bp.clone().add(V(0, 0.4, 0));
        const cam = base.clone().addScaledVector(outN, 4.8).addScaledVector(sideN, -4.0).add(V(0, 0.5, 0));
        let p = pose(cam, base, { fov: 30, aperture: 13 });
        // tilt up to the ladybird as its shell opens, and watch it fly
        const lb = C.ladybird.group.position.clone();
        const k = sseg(t, B.ladybirdFly - 1.4, B.ladybirdFly - 0.6);
        p = { ...p, target: p.target.clone().lerp(lb, k), pos: p.pos.clone().add(V(0, k * 2.0, 0)) };
        p.focus = p.pos.distanceTo(k > 0.5 ? lb : bp);
        return drift(p, t, 0.02, 7);
      },
      rig: () => ({
        env: 'dawn', envIntensity: 0.9, exposure: 1.15, fog: ['#13282a', 0.002], bloom: 0.3,
        key: 1.0, ambient: 1.2,
        subject: () => [mid.clone().add(V(0, 2, 0)), 8],
        beam: { dirFn: sideBeam(1.2, 0.7), intensity: 3.6, color: '#ffd5a2' },
        rim: { intensity: 1.0, color: '#86c6c8' },
      }),
    });
  }

  // ---------------------------------------------------------------------
  // 8. HUMMINGBIRD at the glass blossom; it sips, then turns to the camera.
  {
    const mouth = world.blossom.mouthWorld();
    const axis = world.blossom.axisWorld();
    const sip = mouth.clone().addScaledVector(axis, 2.7).add(V(0, 0.3, 0));
    const camBase = sip.clone().add(V(-10.5, 2.2, 10.5));
    const keys = [
      { t: 35.4, pos: camBase.clone().add(V(-1.5, 0.5, 1.0)), target: sip.clone().lerp(mouth, 0.45), fov: 30, aperture: 12 },
      { t: 38.6, pos: camBase.clone(), target: sip.clone().lerp(mouth, 0.3), fov: 30, aperture: 12 },
      { t: 40.8, pos: camBase.clone().add(V(0.5, 0.3, -0.5)), target: sip.clone().add(V(-3.2, 0.9, 3.4)), fov: 30, aperture: 12 },
    ];
    shots.push({
      name: 'hummingbird',
      t0: 35.8,
      t1: 40.4,
      dissolve: 0.6,
      view(t) {
        const p = drift(track(keys, t), t, 0.02, 8);
        if (C?.hummingbird) p.focus = p.pos.distanceTo(C.hummingbird.group.position);
        return p;
      },
      rig: () => ({
        env: 'dawn', envIntensity: 1.0, exposure: 1.12, fog: ['#15292a', 0.002], bloom: 0.32,
        key: 1.0, ambient: 1.2,
        subject: () => [mouth, 9],
        beam: { dirFn: sideBeam(-1.0, 0.9), intensity: 3.6, color: '#ffd5a2' },
        rim: { intensity: 0.9, color: '#86c6c8' },
      }),
    });
  }

  // ---------------------------------------------------------------------
  // 9. THE REVEAL + TITLE. From the songbird on its copper bough the camera
  //    rises and pulls back: the garden blooms in a wave beneath the vault,
  //    creatures rise through shafts of light, and the film comes to rest on
  //    a wide composition for the title.
  {
    const perch = world.tree.perchWorld();
    const keys = [
      { t: 40.0, pos: perch.clone().add(V(9.0, 0.6, 13.0)), target: perch.clone().add(V(-0.4, 2.7, 0)), fov: 32, aperture: 10 },
      { t: 42.8, pos: perch.clone().add(V(7.6, 0.9, 11.0)), target: perch.clone().add(V(-0.4, 2.7, 0)), fov: 32, aperture: 10 },
      { t: 45.2, pos: V(6, 34, 60), target: V(-16, 46, -30), fov: 40, aperture: 4 },
      { t: 48.0, pos: V(46, 64, 104), target: V(-4, 60, -200), fov: 46, aperture: 2 },
      { t: 51.8, pos: V(36, 42, 62), target: V(-20, 80, -240), fov: 50, aperture: 1.4 },
      { t: 58.0, pos: V(33, 40, 56), target: V(-20, 82, -240), fov: 50, aperture: 1.4 },
    ];
    shots.push({
      name: 'reveal',
      t0: 40.4,
      t1: 58.0,
      dissolve: 0.8,
      view(t) {
        let p = drift(track(keys, t), t, lerp(0.02, 0.4, sseg(t, 43, 48)), 9);
        if (C?.songbird) {
          // the camera's pull-back follows the songbird as it lifts off
          const bird = C.songbird.group.position;
          const w = sseg(t, B.songbirdTakeoff - 0.6, B.songbirdTakeoff + 0.8) * (1 - sseg(t, 46.4, 48.2));
          p.target = p.target.clone().lerp(bird, w * 0.8);
          if (t < 47) p.focus = lerp(p.pos.distanceTo(bird), p.focus, sseg(t, 45.5, 47));
        }
        return p;
      },
      rig: (t) => ({
        env: t < 43 ? 'dawn' : 'gold',
        envIntensity: lerp(0.9, 1.0, sseg(t, 42, 47)),
        exposure: lerp(1.12, 0.92, sseg(t, 42, 48)),
        fog: [new THREE.Color('#152a2a').lerp(new THREE.Color('#8a7650'), sseg(t, 42, 48)), lerp(0.002, 0.0006, sseg(t, 42, 47))],
        bloom: 0.32,
        key: 1, ambient: lerp(1.2, 1.0, sseg(t, 41, 46)),
        subject: () => (t < 44 ? [perch, 12] : [V(0, 10, -120), lerp(60, 300, sseg(t, 44, 48))]),
        beam: t < 44.5 ? { dirFn: backBeam(0.8, 1.0), intensity: 2.6 * (1 - sseg(t, 42.6, 44.0)), color: '#ffd5a2' } : null,
        rim: { intensity: 0.8 * (1 - sseg(t, 42, 44)), color: '#86c6c8' },
        godrays: sseg(t, 43, 47),
        shadowTint: 0.6,
      }),
    });
  }

  return shots;
}
