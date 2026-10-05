import * as THREE from 'three';
import { applyPose } from './camera.js';
import { B, DURATION, dawnAt } from './beats.js';
import { clamp, sseg, smooth } from '../core/ease.js';
import { SUN_DIR } from '../world/atmosphere.js';

// The director evaluates the world at time t, picks the active shot (or two,
// during a dissolve), applies each shot's lighting rig, and renders.

export class Director {
  constructor({ scene, world, shots, pipeline, envs, quality, reducedMotion = false }) {
    this.scene = scene;
    this.world = world;
    this.shots = shots;
    this.pipeline = pipeline;
    this.envs = envs;
    this.quality = quality;
    this.reducedMotion = reducedMotion;
    this.camA = new THREE.PerspectiveCamera(35, 16 / 9, 0.05, 9000);
    this.camB = new THREE.PerspectiveCamera(35, 16 / 9, 0.05, 9000);
    this.aspect = 16 / 9;
    this.fogColor = new THREE.Color();
    scene.fog = new THREE.FogExp2('#04121a', 0.01);
  }

  shotAt(t) {
    let idx = 0;
    for (let i = 0; i < this.shots.length; i++) if (t >= this.shots[i].t0) idx = i;
    return idx;
  }

  context(t) {
    const dawn = dawnAt(t);
    return {
      t,
      dawn,
      sunStrength: sseg(dawn, 0.3, 1.0),
      shaftGain: 1,
      lightScale: 1,
      keyScale: 1,
      ambientScale: 1,
      pixelRatio: this.pixelRatio || 1,
      visible: { escapement: t < 9 },
    };
  }

  rigFor(shot, t) {
    return typeof shot.rig === 'function' ? shot.rig(t) : shot.rig;
  }

  applyRig(shot, t, camera) {
    const rig = this.rigFor(shot, t);
    const L = this.world.lighting;
    this.scene.environment = this.envs[rig.env];
    this.scene.environmentIntensity = rig.envIntensity;
    const [fc, fd] = rig.fog;
    this.scene.fog.color.set(fc);
    this.scene.fog.density = fd;
    L.sun.intensity = L.baseSun * (rig.key ?? 1);
    L.hemi.intensity = L.baseHemi * (rig.ambient ?? 1);
    const [sc, sr] = (rig.subject || rig.shadow)(t);
    L.focusShadow(sc, sr);
    const beam = rig.beam;
    if (beam) L.aimBeam(sc, sr, (beam.dirFn ? beam.dirFn(camera.position, sc) : beam.dir.clone()).normalize(), beam.intensity, beam.color, beam.spread ?? 1);
    else L.beam.intensity = 0;
    const rim = typeof rig.rim === 'number' ? { intensity: rig.rim } : rig.rim;
    if (rim && rim.intensity > 0) L.aimRim(sc, sr, camera.position, rim.intensity, rim.color ?? '#7fc3c4');
    else L.rim.intensity = 0;
    this.look = { exposure: rig.exposure, bloom: rig.bloom ?? 0.32, vignette: rig.vignette ?? 0.55, godrays: rig.godrays ?? 0, saturation: rig.saturation ?? 1.05, shadowTint: rig.shadowTint ?? 0.5 };
  }

  // Gentle-motion mode: average the camera over a window inside the shot so
  // fast moves become slow glides; framing and story stay the same.
  smoothedView(s, t) {
    if (!this.reducedMotion) return s.view(t);
    const half = 1.2;
    const n = 9;
    const a = Math.max(s.t0, t - half), b = Math.min(s.t1, t + half);
    const acc = { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 0, focus: 0, aperture: 0, roll: 0 };
    for (let i = 0; i < n; i++) {
      const p = s.view(a + ((b - a) * i) / (n - 1));
      acc.pos.add(p.pos);
      acc.target.add(p.target);
      acc.fov += p.fov;
      acc.focus += p.focus;
      acc.aperture += p.aperture;
    }
    acc.pos.multiplyScalar(1 / n);
    acc.target.multiplyScalar(1 / n);
    acc.fov /= n;
    acc.focus /= n;
    acc.aperture /= n;
    return acc;
  }

  render(t) {
    t = clamp(t, 0, DURATION);
    const ctx = this.context(t);
    this.world.update(t, ctx);
    this.world.lighting.baseSun = this.world.lighting.sun.intensity;
    const i = this.shotAt(t);
    const shot = this.shots[i];
    let shotA = shot, shotB = null, mix = 0;
    if (shot.dissolve && i > 0 && t < shot.t0 + shot.dissolve) {
      shotA = this.shots[i - 1];
      shotB = shot;
      mix = smooth((t - shot.t0) / shot.dissolve);
    }
    const make = (s, cam) => {
      const p = this.lookdev ? this.lookdev(t) : this.smoothedView(s, t);
      applyPose(cam, p, this.aspect);
      return {
        camera: cam,
        focus: p.focus,
        aperture: this.quality.dof ? p.aperture : 0,
        before: () => this.applyRig(s, t, cam),
      };
    };
    const viewA = make(shotA, this.camA);
    const viewB = shotB ? make(shotB, this.camB) : null;
    // look from the dominant shot
    this.applyRig(mix > 0.5 && shotB ? shotB : shotA, t, mix > 0.5 && shotB ? this.camB : this.camA);
    const look = { ...this.look, time: t, sunDir: SUN_DIR };
    // fade from black at the start and to black at the very end
    look.fade = 1 - sseg(t, 0.0, 1.2);
    look.fade = Math.max(look.fade, sseg(t, B.fadeOut[0], B.fadeOut[1]));
    this.pipeline.render(viewA, viewB, mix, look);
    this.current = { shot: (shotB || shotA).name, t };
  }
}
