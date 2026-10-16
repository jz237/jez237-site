// Light pool: many logical light sources, a FIXED number of real THREE lights.
//
// Three.js recompiles every material when the number of lights (or shadow casters) changes, and forward shading
// cost grows with every light. So the film never adds/removes/hides lights at runtime. Instead, world/props/
// creatures REGISTER logical sources here, and each frame the pool assigns the most important ones (for the
// current camera) to a fixed set of real PointLights/SpotLights. Unused slots keep intensity 0.
//
// Rules for everyone:
//  - Never toggle light.visible or castShadow at runtime, never add/remove lights after load.
//  - For a light that must exist for a dedicated purpose (e.g. a key light for a close-up), use pool.dedicated(...)
//    at load time; it is always in the scene and you only change its intensity/position.
//  - Small decorative glows (most jack-o'-lanterns, lit windows) should be emissive only, or registered with low
//    priority so they only become real lights when the camera is close.
import * as THREE from 'three';

export class LightPool {
  constructor(scene, { points = 8, spots = 2, shadowSpots = 2, quality = 'high' } = {}) {
    this.scene = scene;
    this.sources = [];
    this.quality = quality;
    this.group = new THREE.Group();
    this.group.name = 'LightPool';
    scene.add(this.group);
    this.points = [];
    for (let i = 0; i < points; i++) {
      const l = new THREE.PointLight(0xffffff, 0, 10, 2);
      l.name = `pool_point_${i}`;
      this.group.add(l);
      this.points.push(l);
    }
    // Spot slots, the first `shadowSpots` of them cast shadows (fixed at load).
    this.spots = [];
    for (let i = 0; i < spots; i++) {
      const l = new THREE.SpotLight(0xffffff, 0, 30, Math.PI / 4, 0.5, 2);
      l.name = `pool_spot_${i}`;
      l.castShadow = i < shadowSpots;
      if (l.castShadow) {
        const size = quality === 'high' ? 2048 : quality === 'medium' ? 1024 : 512;
        l.shadow.mapSize.set(size, size);
        l.shadow.bias = -0.0004;
        l.shadow.normalBias = 0.02;
        l.shadow.radius = 3;
        l.shadow.camera.near = 0.2;
        l.shadow.camera.far = 40;
      }
      this.group.add(l);
      this.group.add(l.target);
      this.spots.push(l);
    }
    this.dedicatedLights = [];
    this._tmp = new THREE.Vector3();
  }

  // A logical source. kind: 'point' | 'spot'. For spots give `target` (Vector3) and angle/penumbra.
  // intensityAt(t) optional: returns a multiplier (flicker, cues). priority: >1 for story-critical lights.
  register(src) {
    const s = {
      id: src.id || `src_${this.sources.length}`,
      kind: src.kind || 'point',
      position: src.position.clone(),
      target: src.target ? src.target.clone() : null,
      color: new THREE.Color(src.color ?? 0xffffff),
      intensity: src.intensity ?? 1,
      distance: src.distance ?? 10,
      decay: src.decay ?? 2,
      angle: src.angle ?? Math.PI / 4,
      penumbra: src.penumbra ?? 0.5,
      priority: src.priority ?? 1,
      wantsShadow: !!src.wantsShadow,
      intensityAt: src.intensityAt || null,
      enabledAt: src.enabledAt || null, // (t) => bool, e.g. only inside a shot
      _w: 0,
    };
    this.sources.push(s);
    return s;
  }

  // A real light that always exists (created now, at load). Returns the THREE light; drive it yourself.
  dedicated(light) {
    this.group.add(light);
    if (light.target) this.group.add(light.target);
    this.dedicatedLights.push(light);
    return light;
  }

  // Deterministic selection: score = priority * intensity / (1 + 0.04 d^2) with a view-direction bonus.
  // Sources near the cut-off are faded by how far their score is above the first excluded score, so a source
  // that leaves the pool has already faded to ~0 (no popping), without any frame-to-frame state.
  update(t, camera) {
    const cp = camera.getWorldPosition(this._tmp).clone();
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    const pts = [];
    const spotsShadow = [];
    const spotsPlain = [];
    for (const s of this.sources) {
      if (s.enabledAt && !s.enabledAt(t)) continue;
      const k = s.intensityAt ? s.intensityAt(t) : 1;
      if (k <= 0) continue;
      const d = s.position.distanceTo(cp);
      if (d > s.distance * 1.6 + 6) continue;
      const toL = s.position.clone().sub(cp).normalize();
      const facing = 0.55 + 0.45 * Math.max(0, toL.dot(fwd));
      const e = { s, k, score: (s.priority * s.intensity * k * facing) / (1 + d * d * 0.04) };
      if (s.kind === 'spot') (s.wantsShadow ? spotsShadow : spotsPlain).push(e);
      else pts.push(e);
    }
    const order = (a, b) => b.score - a.score || (a.s.id < b.s.id ? -1 : 1);
    const fade = (list, n) => {
      list.sort(order);
      const cutoff = list.length > n ? list[n].score : 0;
      return list.slice(0, n).map((e) => {
        const x = Math.min(1, Math.max(0, (e.score - cutoff) / (e.score * 0.35 + 1e-9)));
        return { ...e, w: cutoff === 0 ? 1 : x * x * (3 - 2 * x) };
      });
    };
    const selPts = fade(pts, this.points.length);
    this.points.forEach((l, i) => {
      const e = selPts[i];
      if (!e) { l.intensity = 0; return; }
      l.position.copy(e.s.position);
      l.color.copy(e.s.color);
      l.intensity = e.s.intensity * e.k * e.w;
      l.distance = e.s.distance;
      l.decay = e.s.decay;
    });
    const shadowSlots = this.spots.filter((l) => l.castShadow);
    const plainSlots = this.spots.filter((l) => !l.castShadow);
    // Shadow-wanting spots that do not fit the shadow slots fall back to plain slots.
    const selShadow = fade(spotsShadow, shadowSlots.length);
    const overflow = spotsShadow.slice(shadowSlots.length);
    const selPlain = fade(spotsPlain.concat(overflow), plainSlots.length);
    const apply = (slots, sel) => slots.forEach((l, i) => {
      const e = sel[i];
      if (!e) { l.intensity = 0; return; }
      l.position.copy(e.s.position);
      l.target.position.copy(e.s.target || e.s.position.clone().add(new THREE.Vector3(0, -1, 0)));
      l.color.copy(e.s.color);
      l.intensity = e.s.intensity * e.k * e.w;
      l.distance = e.s.distance;
      l.decay = e.s.decay;
      l.angle = e.s.angle;
      l.penumbra = e.s.penumbra;
    });
    apply(shadowSlots, selShadow);
    apply(plainSlots, selPlain);
  }
}

// Singleton created by main.js and passed to loaders as opts.lightPool; modules may also import it.
export let lightPool = null;
export function setLightPool(p) { lightPool = p; }
