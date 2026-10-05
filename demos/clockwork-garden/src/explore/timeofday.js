import * as THREE from 'three';
import { createEnvironmentRamp } from '../world/environment.js';
import { clamp, lerp, sseg } from '../core/ease.js';
import { SUN_DIR } from '../world/atmosphere.js';

// Time of day for the interactive modes: one control (0 = the film's midnight
// teal, 0.5 = its dawn, 1 = the golden-hour finale) blends sky, sun, ambient,
// environment reflections, fog, exposure and the glow of the garden's lamps.

const C = (h) => new THREE.Color(h);
const FOG = [[0, C('#05121a'), 0.0021], [0.45, C('#2c3a36'), 0.0016], [0.75, C('#6e6448'), 0.0011], [1, C('#8a7650'), 0.0008]];

function keyedFog(k, out) {
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

export class TimeOfDay {
  constructor(renderer) {
    this.renderer = renderer;
    this.maps = null;
    this.value = 0.86;
    this._fog = { color: new THREE.Color(), density: 0 };
  }

  ensureMaps() {
    if (!this.maps) this.maps = createEnvironmentRamp(this.renderer, 9);
  }

  // world-update context for the current time of day
  context(t, pixelRatio) {
    const d = this.value;
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
    const d = this.value;
    const L = world.lighting;
    const night = 1 - sseg(d, 0.0, 0.55);
    const idx = Math.round(d * (this.maps.length - 1));
    scene.environment = this.maps[idx];
    scene.environmentIntensity = lerp(0.6, 1.12, d) + night * 0.45;
    keyedFog(d, this._fog);
    scene.fog.color.copy(this._fog.color);
    scene.fog.density = this._fog.density;
    // L.update() has already set the sun's colour/intensity and the hemisphere from dawn
    L.sun.intensity = L.sun.intensity * (1 + night * 2.6);
    L.hemi.intensity = L.baseHemi * (1.3 + night * 1.4);
    L.focusShadow(focus.center, focus.radius);
    // the film's sculpting beam is off (its shadow pass is skipped, see
    // Explore.enter); a rim behind the subject keeps silhouettes readable
    L.beam.intensity = 0;
    if (camera) L.aimRim(focus.center, Math.max(4, focus.radius * 0.3), camera.position, lerp(1.2, 0.35, d), '#7fc0c4');
    else L.rim.intensity = 0;
  }

  look() {
    const d = this.value;
    return {
      exposure: lerp(1.9, 1.02, sseg(d, 0, 1)),
      bloom: lerp(0.38, 0.3, d),
      vignette: 0.5,
      godrays: sseg(d, 0.45, 0.95),
      saturation: lerp(1.0, 1.06, d),
      shadowTint: lerp(0.35, 0.55, d),
    };
  }
}
