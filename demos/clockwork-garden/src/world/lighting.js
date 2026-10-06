import * as THREE from 'three';
import { SUN_DIR } from './atmosphere.js';
import { lerp } from '../core/ease.js';

// Lighting rig. The key light travels from cold moonlight to golden sun as the
// garden wakes. Each shot adds a sculpting "beam" (a shaft of light through
// the glass, warm by day, cool by night) and a rim light behind the subject.
// The light count never changes, so shaders never recompile mid-film.

export class Lighting {
  constructor(scene, quality) {
    this.sun = new THREE.DirectionalLight('#ffffff', 1);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(quality.shadowSize, quality.shadowSize);
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.02;
    scene.add(this.sun, this.sun.target);

    this.hemi = new THREE.HemisphereLight('#2a5258', '#1a120a', 0.4);
    scene.add(this.hemi);

    // sculpting beam: a soft-edged shaft aimed at the subject of each shot
    this.beam = new THREE.SpotLight('#ffd7a0', 0, 0, 0.5, 0.65, 1.2);
    this.beam.castShadow = quality.tier !== 'low';
    this.beam.shadow.mapSize.set(2048, 2048);
    this.beam.shadow.bias = -0.0002;
    this.beam.shadow.normalBias = 0.01;
    scene.add(this.beam, this.beam.target);

    // rim: behind the subject relative to camera, for silhouettes
    this.rim = new THREE.SpotLight('#7fc3c4', 0, 0, 0.6, 0.9, 1.5);
    scene.add(this.rim, this.rim.target);

    // practicals
    this.pulse = new THREE.PointLight('#ffa640', 0, 18, 2);
    scene.add(this.pulse);
    this.skep = new THREE.PointLight('#ffb35a', 0, 22, 2);
    scene.add(this.skep);
    this.spark = new THREE.PointLight('#ff9a3a', 0, 6, 2); // escapement pallet sparks
    scene.add(this.spark);
    // kept for compatibility with older rigs (unused fill)
    this.fill = new THREE.PointLight('#bfe0dc', 0, 1, 2);
    scene.add(this.fill);

    this.moonColor = new THREE.Color('#6f9fb0');
    this.sunColor = new THREE.Color('#ffc887');
    this.baseSun = 1;
  }

  focusShadow(center, radius) {
    const s = this.sun;
    // the shadow frame follows the subject in whole texels of the map, across
    // the light: slid by fractions of a texel every frame, every shadow edge
    // (and the thin petals' own) swims and shimmers as the camera moves
    const texel = (2 * radius) / s.shadow.mapSize.x;
    const z = this._sz || (this._sz = SUN_DIR.clone().negate().normalize());
    const x = this._sx || (this._sx = new THREE.Vector3(0, 1, 0).cross(z).normalize());
    const y = this._sy || (this._sy = z.clone().cross(x));
    const snap = this._sc || (this._sc = new THREE.Vector3());
    const cx = Math.round(center.dot(x) / texel) * texel, cy = Math.round(center.dot(y) / texel) * texel;
    snap.copy(x).multiplyScalar(cx).addScaledVector(y, cy).addScaledVector(z, center.dot(z));
    center = snap;
    s.target.position.copy(center);
    s.position.copy(center).addScaledVector(SUN_DIR, -radius * 3);
    const c = s.shadow.camera;
    c.left = -radius;
    c.right = radius;
    c.top = radius;
    c.bottom = -radius;
    c.near = radius * 0.5;
    c.far = radius * 6;
    c.updateProjectionMatrix();
    s.shadow.bias = -0.0002 - 0.0000025 * radius;
    // (the normal offset in step with the texel: coarse maps need more, or
    // thin parts shade themselves in stripes)
    s.shadow.normalBias = Math.max(0.02, texel * 0.45);
  }

  // Aim the sculpting beam from a direction (unit vector toward the light).
  aimBeam(center, radius, fromDir, intensity, color, spread = 1.0) {
    const b = this.beam;
    const dist = radius * 6;
    b.position.copy(center).addScaledVector(fromDir, dist);
    b.target.position.copy(center);
    b.angle = Math.atan((radius * 1.3 * spread) / dist);
    b.penumbra = 0.75;
    b.distance = dist * 2.5;
    b.decay = 0;
    b.intensity = intensity;
    if (color) b.color.set(color);
    b.shadow.camera.near = dist * 0.4;
    b.shadow.camera.far = dist * 1.8;
    b.shadow.focus = 1;
  }

  aimRim(center, radius, camPos, intensity, color) {
    const r = this.rim;
    const back = center.clone().sub(camPos).setY(0).normalize();
    const dist = radius * 5;
    r.position.copy(center).addScaledVector(back, dist).add(new THREE.Vector3(0, radius * 2.2, 0));
    r.target.position.copy(center);
    r.angle = Math.atan((radius * 1.6) / dist);
    r.distance = dist * 3;
    r.decay = 0;
    r.intensity = intensity;
    if (color) r.color.set(color);
  }

  update(t, ctx) {
    const d = ctx.dawn;
    this.sun.color.copy(this.moonColor).lerp(this.sunColor, Math.min(1, d * 1.6));
    this.sun.intensity = lerp(0.3, 3.4, Math.pow(d, 1.2));
    this.baseSun = this.sun.intensity;
    this.hemi.color.set('#2a5258').lerp(new THREE.Color('#a9c2b4'), d);
    this.hemi.groundColor.set('#120d08').lerp(new THREE.Color('#5a4024'), d);
    this.baseHemi = lerp(0.35, 1.0, d);
    this.hemi.intensity = this.baseHemi;
  }
}
