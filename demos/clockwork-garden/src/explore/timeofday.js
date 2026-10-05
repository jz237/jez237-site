import * as THREE from 'three';
import { createEnvironmentRamp, RAMP_TODS } from '../world/environment.js';
import { clamp, lerp, sseg } from '../core/ease.js';
import { LF } from '../world/lightfield.js';

// Time of day for the interactive modes: one control blends sky, sun/moon,
// ambient, environment reflections, fog, exposure and the garden's lamps.
//   0     midnight: midnight teal, a cool moon key through the vault's iron,
//         every lantern kindled, blooms glowing, fireflies
//   0.27  dusk (blue hour): indigo sky with a last warm band, lanterns lit,
//         fireflies out, the moon up
//   0.5   dawn: pink-gold sky, mist, the lanterns guttering out one by one
//   0.86  golden hour (the film's finale), 1 its peak
// The hour eases toward its target (the slider follows closely, a jump from
// T glides over about a second and a half); setting `value` directly jumps.

const C = (h) => new THREE.Color(h);
// fog: [hour, colour, density]
const FOG = [[0, C('#06141c'), 0.0019], [0.27, C('#0d1a2e'), 0.0018], [0.5, C('#5c4549'), 0.0023], [0.75, C('#6e6448'), 0.0011], [1, C('#8a7650'), 0.0008]];
const MOON = C('#9dbfd8');
const HEMI_NIGHT = C('#1f4a52'), HEMI_DUSK = C('#2a3c66'), HEMI_DAWN = C('#8a6f86'), SUN_DAWN = C('#ffae8c');

function keyed(k, out) {
  for (let i = 0; i < FOG.length - 1; i++) {
    const [a, ca, da] = FOG[i], [b, cb, db] = FOG[i + 1];
    if (k <= b) {
      const u = clamp((k - a) / (b - a));
      out.color.copy(ca).lerp(cb, u);
      out.density = lerp(da, db, u);
      return out;
    }
  }
  out.color.copy(FOG[FOG.length - 1][1]);
  out.density = FOG[FOG.length - 1][2];
  return out;
}

export const STOPS = [
  { v: 0.0, name: 'Midnight' },
  { v: 0.27, name: 'Dusk: the lanterns kindle' },
  { v: 0.5, name: 'Dawn' },
  { v: 0.86, name: 'Golden hour' },
];

export class TimeOfDay {
  constructor(renderer) {
    this.renderer = renderer;
    this.maps = null;
    this._v = 0.86;
    this.target = 0.86;
    this._fog = { color: new THREE.Color(), density: 0 };
    this._c = new THREE.Color();
    this._ray = new THREE.Color();
  }

  // the hour being rendered; setting it jumps there (tools, URL, review)
  get value() { return this._v; }
  set value(v) { this._v = this.target = clamp(v, 0, 1); }

  // ease toward the target
  step(dt) {
    const d = this.target - this._v;
    if (Math.abs(d) < 1e-4) { this._v = this.target; return; }
    const k = 1 - Math.exp(-dt * 2.6);
    this._v += d * k + Math.sign(d) * Math.min(Math.abs(d * (1 - k)), dt * 0.02);
  }

  ensureMaps() {
    if (!this.maps) this.maps = createEnvironmentRamp(this.renderer);
  }

  // how dark the garden is, and the moments of the evening (0..1 each)
  phases(d = this._v) {
    return {
      night: 1 - sseg(d, 0.0, 0.55), // the old lift curve
      moon: 1 - sseg(d, 0.36, 0.56), // moonlight key, moon in the sky
      lamps: 1 - sseg(d, 0.45, 0.64), // lanterns (each has its own hour within this)
      blooms: 1 - sseg(d, 0.3, 0.58), // blooms glow from within
      flies: 1 - sseg(d, 0.33, 0.47), // fireflies out after dusk
      dusk: sseg(d, 0.1, 0.27) * (1 - sseg(d, 0.3, 0.48)), // blue hour
      dawn: sseg(d, 0.36, 0.5) * (1 - sseg(d, 0.52, 0.72)), // dawn's pink mist
    };
  }

  // world-update context for the current time of day
  context(t, pixelRatio) {
    const d = this._v;
    return {
      t,
      dawn: d,
      sunStrength: sseg(d, 0.3, 1.0),
      shaftGain: 1,
      lightScale: 1,
      keyScale: 1,
      ambientScale: 1,
      pixelRatio,
      visible: { escapement: false },
      explore: true,
    };
  }

  // night needs more lift than the film's close-ups did: the whole house is
  // in view, so moon, ambient and environment are raised as the day falls
  apply(scene, world, focus, camera) {
    this.ensureMaps();
    const d = this._v;
    const P = this.phases(d);
    const L = world.lighting;
    // environment: the two ramp maps either side of the hour, blended
    let i = 0;
    while (i < RAMP_TODS.length - 2 && d > RAMP_TODS[i + 1]) i++;
    const u = clamp((d - RAMP_TODS[i]) / (RAMP_TODS[i + 1] - RAMP_TODS[i]));
    scene.environment = this.maps[i];
    LF.u.cgEnvB.value = this.maps[i + 1];
    LF.u.cgEnvMix.value = u < 0.002 ? 0 : u > 0.998 ? 0 : u;
    if (u > 0.998) scene.environment = this.maps[i + 1];
    scene.environmentIntensity = lerp(0.6, 1.12, d) + P.night * 0.03;
    keyed(d, this._fog);
    scene.fog.color.copy(this._fog.color);
    scene.fog.density = this._fog.density;
    // L.update() has already set the sun's colour/intensity and the hemisphere from dawn;
    // by night the key is the moon: cool, a little stronger, so the iron's shadows read
    const sunI = L.sun.intensity * (1 + P.night * 2.6);
    L.sun.color.lerp(MOON, P.moon);
    L.sun.intensity = lerp(sunI, lerp(3.4, 1.5, sseg(d, 0.0, 0.3)), P.moon);
    // a gentle teal ambient so shadows are never black (bluer and brighter at dusk)
    L.hemi.intensity = L.baseHemi * (1.3 + P.night * 0.35);
    L.hemi.color.lerp(this._c.copy(HEMI_NIGHT).lerp(HEMI_DUSK, P.dusk), P.night);
    // dawn: a lilac sky light and a rose-gold low sun through the mist
    L.hemi.color.lerp(HEMI_DAWN, P.dawn * 0.45);
    L.sun.color.lerp(SUN_DAWN, P.dawn * 0.5);
    L.sun.intensity *= 1 + P.dawn * 0.45;
    L.focusShadow(focus.center, focus.radius);
    // the vault's iron between the beds and the moon (or sun): rib shadows everywhere
    LF.u.cgGoboK.value.x = lerp(0.6, 0.88, P.moon);
    // the lamps' cast light is tuned for the dark; by day it is a gentle warmth
    LF.u.cgLFK.value = 0.35 + 0.65 * Math.max(P.lamps, P.night);
    // the film's sculpting beam is off (its shadow pass is skipped, see
    // Explore.enter); a rim behind the subject keeps silhouettes readable
    L.beam.intensity = 0;
    if (camera) L.aimRim(focus.center, Math.max(4, focus.radius * 0.3), camera.position, lerp(1.2, 0.35, d) - P.night * 0.2, '#7fc0c4');
    else L.rim.intensity = 0;
  }

  look() {
    const d = this._v;
    const P = this.phases(d);
    return {
      exposure: lerp(1.9, 1.02, sseg(d, 0, 1)),
      bloom: lerp(0.38, 0.3, d) + P.night * 0.06,
      vignette: 0.5,
      // god rays: the sun by day; by night faint moon rays through the iron
      godrays: sseg(d, 0.45, 0.95) + P.moon * 0.42,
      rayTint: this._ray.set('#ffd6a0').lerp(MOON, P.moon),
      rayNear: sseg(d, 0.45, 0.95) > 0.01 ? 0 : 1.5, // the moon's rays only when it is near the frame
      saturation: lerp(1.0, 1.06, d) + P.night * 0.04,
      shadowTint: lerp(0.35, 0.55, d),
      grainLum: 1.0,
    };
  }
}
