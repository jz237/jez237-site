// The 3607 stoop's cheap motion-activated Halloween animatronic: the skeleton in its resin chair.
// assets/props/skeleton.glb (tools/props/blender/build_skeleton.py) ships FOUR nodes: SkeletonBody (rigid),
// SkeletonHead + SkeletonJaw (each pivoting on an anatomical joint baked as an empty: HeadPivot = the
// atlanto-occipital joint, JawPivot = the TMJ, JawPivot nested under HeadPivot so the jaw tracks the head), plus
// ResinChair. Red LED eyes (emissive + one dedicated point light) switch on at CUES.animatronicTrigger and stay
// on; the head jerks toward the street in stepped "servo" snaps (~trigger+0.05 .. +0.8s), twitching during both
// laughs; the jaw clacks on each syllable of "Happy Halloween! Ha ha ha ha!" (timings.animatronicClacks, shared
// with the AUDIO agent's voice/clack schedule). A small speaker grille + battery box sits on the chair seat.
import * as THREE from 'three';
import { HERO, kitPoint, kitRotY, inBauderZone } from './site.js';
import { CUES } from '../film/cues.js';
import { animatronicClacks } from './timings.js';
import { DISPLAY, frontage3607 } from './porch.js';
import { box, rbox, cyl, sphere, merge } from './geo.js';
import { noise1, smoothstep, clamp } from './util.js';

// stepped head-turn toward the street: four quick snaps summing to a solid turn, then holds (cheap servo, not a
// smooth motor); twitches are added on top during the laughs.
// The body faces the street turned toward -Z (the P2 camera); the head snaps ~57 deg toward +Z, i.e. toward the
// P3 camera (skull + (-2.05, -0.1, 1.28) in shots.js), and lifts out of its slump.
const HEAD_STEPS = [
  { t: CUES.animatronicTrigger + 0.05, d: 0.06, yaw: 0.34, pitch: -0.06 },
  { t: CUES.animatronicTrigger + 0.28, d: 0.05, yaw: 0.28, pitch: -0.05 },
  { t: CUES.animatronicTrigger + 0.52, d: 0.05, yaw: 0.22, pitch: -0.03 },
  { t: CUES.animatronicTrigger + 0.75, d: 0.06, yaw: 0.16, pitch: -0.02 },
];
function headYawPitchAt(t) {
  let yaw = 0, pitch = 0;
  for (const s of HEAD_STEPS) { const k = smoothstep(s.t, s.t + s.d, t); yaw += s.yaw * k; pitch += s.pitch * k; }
  return [yaw, pitch];
}
function inLaughWindow(t) {
  return (t > CUES.animatronicLaugh - 0.05 && t < CUES.animatronicLaugh + 2.75) ||
    (t > CUES.animatronicLaugh2 - 0.05 && t < CUES.animatronicLaugh2 + 2.75);
}
function headTwitch(t) {
  if (!inLaughWindow(t)) return [0, 0, 0];
  return [0.028 * noise1(t * 13.5, 71), 0.02 * Math.abs(noise1(t * 16.5, 72)), 0.018 * noise1(t * 11.2, 73)];
}
const CLACK_TIMES = [...animatronicClacks.laugh1, ...animatronicClacks.laugh2];
const JAW_OPEN_MAX = 0.4; // radians (~23 deg), a hard plastic jaw servo's full travel
function jawOpenAt(t) {
  let a = 0;
  for (const ct of CLACK_TIMES) {
    const x = t - ct;
    if (x < -0.01 || x > 0.4) continue;
    const attack = smoothstep(0, 0.032, x);
    const decay = Math.exp(-Math.max(0, x - 0.032) * 13);
    a = Math.max(a, attack * decay);
  }
  return a * JAW_OPEN_MAX;
}
function eyeIntensityAt(t) {
  if (t < CUES.animatronicTrigger) return 0;
  const x = t - CUES.animatronicTrigger;
  if (x < 0.14) return (Math.sin(x * 95) > 0.15 ? 1 : 0.25);  // relay chatter at power-on
  return 1;
}

function placeholderSkeleton() {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ name: 'SkeletonPlaceholder', color: 0xd8d2c0, roughness: 0.5 });
  g.add(new THREE.Mesh(merge([
    box(0.5, 0.04, 0.46, 0, 0.43, 0), box(0.5, 0.5, 0.04, 0, 0.7, -0.22),
    box(0.05, 0.25, 0.46, -0.25, 0.6, 0), box(0.05, 0.25, 0.46, 0.25, 0.6, 0),
  ]), new THREE.MeshStandardMaterial({ name: 'ResinChairProc', color: 0xd8d6cc, roughness: 0.55 })));
  const body = new THREE.Mesh(merge([rbox(0.4, 0.55, 0.25, 0.08, 0, 0.75, -0.05)]), m);
  body.castShadow = true; g.add(body);
  return { group: g, headPivotLocal: new THREE.Vector3(0, 1.18, 0.02), jawPivotLocal: new THREE.Vector3(0, 1.15, 0.05) };
}

export async function buildAnimatronic(ctx) {
  const st = HERO.steps3607;
  const group = new THREE.Group(); group.name = 'Animatronic3607';
  const facadeYaw = kitRotY(st);
  // on the sidewalk in front of the 3607 second window, right beside the scarecrow pair's bale (porch.js DISPLAY;
  // the 3607 landing itself is too small for the chair + the hero pumpkin + the P1 camera, see docs/props-notes.md)
  const pos = frontage3607(DISPLAY.chair.z, DISPLAY.chair.outFromFacade, ctx.groundY);
  group.position.copy(pos);
  group.rotation.y = facadeYaw + DISPLAY.chair.turn;
  if (inBauderZone(pos.x, pos.z)) { // never on/against Bauder Graphics
    return { group: new THREE.Group(), anchors: {}, sources: [], api: { setLightScale() {} }, update() {} };
  }

  const headPivot = new THREE.Group(); headPivot.name = 'HeadPivot';
  const jawPivot = new THREE.Group(); jawPivot.name = 'JawPivot';
  let headPivotLocal = new THREE.Vector3(), jawPivotLocal = new THREE.Vector3();
  let articulated = false;
  try {
    const g = await ctx.loadGLTF('skeleton.glb');
    const find = (n) => g.scene.getObjectByName(n);
    const bodyMesh = find('SkeletonBody'), chairMesh = find('ResinChair');
    const headMesh = find('SkeletonHead'), jawMesh = find('SkeletonJaw');
    const headPivotNode = find('HeadPivot'), jawPivotNode = find('JawPivot');
    for (const m of [bodyMesh, chairMesh]) if (m) { m.castShadow = true; m.receiveShadow = true; group.add(m); }
    if (headMesh && jawMesh && headPivotNode && jawPivotNode) {
      headPivotLocal.copy(headPivotNode.position);
      jawPivotLocal.copy(jawPivotNode.position);
      headPivot.position.copy(headPivotLocal);
      headMesh.position.copy(headPivotLocal).multiplyScalar(-1);
      headMesh.castShadow = true; headMesh.receiveShadow = true;
      headPivot.add(headMesh);
      jawPivot.position.copy(jawPivotLocal).sub(headPivotLocal);
      jawMesh.position.copy(jawPivotLocal).multiplyScalar(-1);
      jawMesh.castShadow = true;
      jawPivot.add(jawMesh);
      headPivot.add(jawPivot);
      group.add(headPivot);
      articulated = true;
    } else {
      // older unsplit export: show it rigid rather than fail
      const whole = find('Skeleton');
      if (whole) { whole.castShadow = true; whole.receiveShadow = true; group.add(whole); }
      else throw new Error('skeleton.glb missing expected nodes');
    }
  } catch (e) {
    console.warn('[props] animatronic: skeleton.glb fallback', e);
    const ph = placeholderSkeleton();
    group.add(ph.group);
    headPivotLocal.copy(ph.headPivotLocal);
    jawPivotLocal.copy(ph.jawPivotLocal);
    headPivot.position.copy(headPivotLocal);
    jawPivot.position.copy(jawPivotLocal).sub(headPivotLocal);
    headPivot.add(jawPivot);
    group.add(headPivot);
    articulated = true;
  }

  // ---- red LED eyes: emissive + one dedicated point light, roughly glabella height, forward of the occiput ----
  // headPivot-local (the GLB's head bounds: x -0.18..-0.02, y 1.03..1.24, z -0.31..-0.12 vs the pivot at
  // (-0.054, 1.102, -0.244)): the orbits sit ~5 cm above the pivot, ~10 cm forward, centred ~3.6 cm to the -x side
  const eyeLocal = new THREE.Vector3(-0.036, 0.046, 0.098);
  const eyeGeo = merge([sphere(0.0085, eyeLocal.x - 0.031, eyeLocal.y, eyeLocal.z), sphere(0.0085, eyeLocal.x + 0.031, eyeLocal.y, eyeLocal.z)]);
  const eyeMat = new THREE.MeshStandardMaterial({ name: 'LEDEye', color: 0x200000, emissive: 0xff0a0a, emissiveIntensity: 0, roughness: 0.3 });
  const eyes = new THREE.Mesh(eyeGeo, eyeMat);
  headPivot.add(eyes);
  group.updateMatrixWorld(true);
  const eyeWorld = eyes.getWorldPosition(new THREE.Vector3());
  // dedicated (not pool.register()'d): returned as `eyeLight` for index.js to pass to pool.dedicated(), same
  // pattern as house3607's tvLight / room3609's roomLamp. Position tracks the head every frame (see update()).
  const eyeLight = new THREE.PointLight(0xff1a1a, 0, 0.55, 2);
  eyeLight.name = 'AnimatronicEyeLight';
  eyeLight.position.copy(eyeWorld);
  const EYE_CD = 0.05;   // a pinpoint LED: tints the brow / cheekbones, not the facade

  // ---- speaker grille + battery box on the chair seat, beside the hip ----
  const boxMat = new THREE.MeshStandardMaterial({ name: 'SpeakerBoxPlastic', color: 0x141414, roughness: 0.6 });
  const grilleMat = new THREE.MeshStandardMaterial({ name: 'SpeakerGrille', color: 0x0a0a0a, roughness: 0.75, metalness: 0.2 });
  const speaker = new THREE.Group(); speaker.name = 'SpeakerBattery3607';
  const sBox = new THREE.Mesh(rbox(0.1, 0.055, 0.07, 0.008, 0.19, 0.47, -0.14), boxMat);
  sBox.castShadow = true; speaker.add(sBox);
  const grille = new THREE.Mesh(box(0.07, 0.002, 0.05, 0.19, 0.4985, -0.14), grilleMat);
  speaker.add(grille);
  for (let i = -2; i <= 2; i++) speaker.add(new THREE.Mesh(box(0.055, 0.0015, 0.004, 0.19, 0.4986, -0.14 + i * 0.009), boxMat));
  const wire = new THREE.Mesh(cyl(0.0015, 0.0015, 0.26, 0.19, 0.46, -0.1, 1.2, 0, 0.3, 5), new THREE.MeshStandardMaterial({ name: 'SpeakerWire', color: 0x1a1a1a, roughness: 0.6 }));
  speaker.add(wire);
  group.add(speaker);

  const anchors = {
    skeletonHead: { position: eyeWorld.clone(), quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, group.rotation.y, 0)), note: 'the animatronic skull (approx. glabella, between the LED eyes); moves with the head jerk/twitch' },
    skeletonEyes: { position: eyeWorld.clone(), quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, group.rotation.y, 0)), note: 'red LED eye pair centre; on (eyeIntensityAt) from CUES.animatronicTrigger' },
  };

  let lightScale = 1;
  function update(t) {
    if (!articulated) return;
    const [yaw, pitch] = headYawPitchAt(t);
    const [tyaw, tpitch, troll] = headTwitch(t);
    headPivot.rotation.set(pitch + tpitch, yaw + tyaw, troll);
    jawPivot.rotation.x = -jawOpenAt(t);
    group.updateMatrixWorld(true);
    eyes.getWorldPosition(eyeLight.position);
    const k = eyeIntensityAt(t) * lightScale;
    eyeMat.emissiveIntensity = 6.0 * k;
    eyeLight.intensity = EYE_CD * k;
  }
  update(0);

  return {
    group,
    anchors,
    sources: [],
    eyeLight,   // index.js: pool.dedicated(parts.animatronic.eyeLight) (same pattern as tvLight / roomLamp)
    api: {
      headPivot, jawPivot, eyes, eyeLight,
      headYawPitchAt, jawOpenAt, eyeIntensityAt,
      clackTimes: CLACK_TIMES,
      setLightScale(s) { lightScale = s; },
    },
    update,
  };
}
