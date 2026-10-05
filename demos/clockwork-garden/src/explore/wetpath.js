import * as THREE from 'three';
import { lightFieldMaterial } from '../world/lightfield.js';

// The wet path (interactive modes): at night dew lies on the polished
// flagstones in sheets and shallow puddles, and every lamp, lantern, globe
// and halo is mirrored in it, stretched into the long streaks of light a wet
// floor makes.
//
// The reflection is a planar mirror of the glows alone: the lights that line
// the path (the globes, the lamps, the bracket lanterns' flames) are drawn once
// more, from the camera mirrored in the path's plane, into a small target (a
// quarter of the screen); everything else reflects as the dark it is. The flagstones then read it back where they are
// wet, through a short vertical blur (the streaks), weighted by Fresnel, so
// the reflections are strongest at the grazing angles a bee flies at. A few
// small draws at a sixteenth of the pixels, and a handful of taps on the path.

const Y = 0.3; // the flagstones' top

const WET = {
  tWet: { value: null },
  uWetMat: { value: new THREE.Matrix4() },
  uWetK: { value: 0 }, // dew: 0 dry … 1 soaked
  uWetRefl: { value: 0 }, // how strongly the mirror shows (off in the film's absence)
};

function wetMaterial(m, key) {
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    Object.assign(sh.uniforms, WET);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform mat4 uWetMat; varying vec4 vWetUV; varying vec3 vWetW;')
      .replace('#include <project_vertex>', `#include <project_vertex>
        {
          #ifdef USE_INSTANCING
            vec4 wwp = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
          #else
            vec4 wwp = modelMatrix * vec4(transformed, 1.0);
          #endif
          vWetW = wwp.xyz;
          vWetUV = uWetMat * wwp;
        }`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform sampler2D tWet; uniform float uWetK, uWetRefl;
        varying vec4 vWetUV; varying vec3 vWetW;
        float wetHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float wetNoise(vec2 p) {
          vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(wetHash(i), wetHash(i + vec2(1, 0)), f.x), mix(wetHash(i + vec2(0, 1)), wetHash(i + vec2(1, 1)), f.x), f.y);
        }
        float cgWet;`)
      // where the dew lies: sheets and puddles, wetter in the hollows of each flag
      .replace('#include <color_fragment>', `#include <color_fragment>
        {
          vec2 q = vWetW.xz;
          float n = wetNoise(q * 0.045) * 0.65 + wetNoise(q * 0.17 + 7.3) * 0.35;
          float top = smoothstep(-0.2, 0.25, vWetW.y); // only the walking faces hold water
          cgWet = uWetK * top * smoothstep(0.28, 0.62, n + uWetK * 0.25);
          // dark, damp stone everywhere at night, darker still where it pools
          diffuseColor.rgb *= (1.0 - 0.45 * uWetK * top) * (1.0 - 0.5 * cgWet);
        }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        // (not glassy: a mirror-sharp moon glint at the camera's feet blooms
        // into a huge disc in the depth of field; the lamps' sharp images are
        // the mirror's own, below)
        roughnessFactor = mix(roughnessFactor, 0.24, cgWet);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        if (uWetRefl > 0.0 && vWetUV.w > 0.0) {
          vec2 ruv = vWetUV.xy / vWetUV.w;
          // a faint ripple, and the streak: a short blur down the mirror's vertical
          float rip = wetNoise(vWetW.xz * 0.9 + 3.1) - 0.5;
          ruv.x += rip * 0.0035;
          float spread = mix(0.05, 0.016, cgWet);
          vec3 refl = vec3(0.0);
          float wsum = 0.0;
          for (int i = -3; i <= 3; i++) {
            float k = float(i) / 3.0;
            float w = 1.0 - abs(k) * 0.7;
            refl += texture2D(tWet, ruv + vec2((mod(float(i), 2.0) - 0.5) * 0.004, k * spread)).rgb * w;
            wsum += w;
          }
          refl = min(refl / wsum, vec3(1.4));
          float ndv = saturate(dot(normal, normalize(vViewPosition)));
          float F = 0.03 + 0.97 * pow(1.0 - ndv, 5.0);
          totalEmissiveRadiance += refl * uWetRefl * (0.12 + 0.88 * F) * (0.2 + 0.8 * cgWet);
        }`);
  };
  const base = m.customProgramCacheKey?.bind(m);
  m.customProgramCacheKey = () => (base ? base() : '') + '|wet-' + key;
  return m;
}

export class WetPath {
  constructor({ renderer, world, upgrade, night, quality }) {
    this.renderer = renderer;
    this.world = world;
    this.u = WET; // (review hooks)
    this.scale = quality.tier === 'low' ? 0.2 : 0.25;
    this.rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: true });
    this.rt.texture.generateMipmaps = false;
    WET.tWet.value = this.rt.texture;
    this.cam = new THREE.PerspectiveCamera();
    const ga = world.garden;
    // the flagstones and curbs, wet while exploring (the film keeps its own)
    // (no clearcoat: the mirror is the gloss; a coat's lamp highlights at the
    // camera's feet would bloom into huge bokeh discs in the depth of field)
    // (and a weak specular of its own: the lamps' highlights are in the mirror)
    const bare = (m) => { const c = m.clone(); c.clearcoat = 0; c.specularIntensity = 0.3; return c; };
    const flag = lightFieldMaterial(wetMaterial(bare(ga.flagMat), 'flag'));
    const curb = lightFieldMaterial(wetMaterial(bare(ga.curbMat), 'curb'));
    upgrade.swap(ga.flagMesh, 'material', flag);
    for (const c of ga.curbs) upgrade.swap(c, 'material', curb);
    this.materials = [flag, curb];
    // what shines in it: the lights that line the path. The vault's lanterns
    // and the arches' apex lanterns hang so high their images would land at
    // the camera's feet as a scatter of hard specks; haloes and fireflies
    // would smear into a haze at this resolution.
    // They are drawn from a little scene of their own (stand-ins sharing
    // their geometry, materials and instance buffers), so the mirror pass
    // never walks the garden's scene graph.
    this.mirror = new THREE.Scene();
    this.mirror.background = new THREE.Color(0, 0, 0);
    this.mirror.matrixWorldAutoUpdate = false;
    const pr = world.promenade;
    this.globes = pr?.globeMesh;
    if (this.globes) {
      const g = new THREE.InstancedMesh(this.globes.geometry, this.globes.material, this.globes.count);
      g.instanceMatrix = this.globes.instanceMatrix;
      g.instanceColor = this.globes.instanceColor;
      g.frustumCulled = false;
      this.globeProxy = g;
      this.mirror.add(g);
    }
    this.lampProxies = ga.lamps.map((core) => {
      core.updateWorldMatrix(true, false);
      const m = new THREE.Mesh(core.geometry, core.material);
      m.matrixAutoUpdate = false;
      m.matrix.copy(core.matrixWorld);
      m.matrixWorld.copy(core.matrixWorld);
      this.mirror.add(m);
      return { core, m };
    });
    const fo = world.foliage;
    this.flames = fo.flames;
    this.lowIdx = fo.lanterns.map((l, i) => (l.arch === 'bracket' ? i : -1)).filter((i) => i >= 0);
    this.lowFlames = new THREE.InstancedMesh(fo.flames.geometry, fo.flames.material, Math.max(1, this.lowIdx.length));
    this.lowFlames.count = this.lowIdx.length;
    this.lowFlames.frustumCulled = false;
    this.lowFlames.setColorAt(0, new THREE.Color());
    this.mirror.add(this.lowFlames);
    for (const o of this.mirror.children) o.updateMatrixWorld(true);
    this._v = new THREE.Vector3();
    this._t = new THREE.Vector3();
    this._r = new THREE.Matrix4();
    this._la = new THREE.Vector3();
    this.size = new THREE.Vector2();
  }

  // wetness and mirror strength follow the night (P: TimeOfDay phases)
  set(P) {
    WET.uWetK.value = 0.2 + 0.8 * P.night;
    // (by day there is nothing bright enough to see in it: the pass is skipped)
    WET.uWetRefl.value = Math.max(0, Math.max(P.night, P.lamps * 0.8) - 0.02) * 1.0;
  }

  render(scene, camera, w, h) {
    if (WET.uWetRefl.value <= 0) return;
    const r = this.renderer;
    const rw = Math.max(16, Math.round(w * this.scale)), rh = Math.max(16, Math.round(h * this.scale));
    if (this.rt.width !== rw || this.rt.height !== rh) this.rt.setSize(rw, rh);
    // the camera mirrored in the path's plane (as three's Reflector does it)
    const cam = this.cam, N = new THREE.Vector3(0, 1, 0);
    const cp = this._v.setFromMatrixPosition(camera.matrixWorld);
    if (cp.y <= Y + 0.01) { WET.uWetMat.value.makeScale(0, 0, 0); return; }
    const rot = this._r.extractRotation(camera.matrixWorld);
    const look = this._la.set(0, 0, -1).applyMatrix4(rot).add(cp);
    cam.position.set(cp.x, 2 * Y - cp.y, cp.z);
    const tgt = this._t.set(look.x, 2 * Y - look.y, look.z);
    cam.up.set(0, 1, 0).applyMatrix4(rot).reflect(N);
    cam.lookAt(tgt);
    cam.near = camera.near; cam.far = camera.far;
    cam.projectionMatrix.copy(camera.projectionMatrix);
    cam.projectionMatrixInverse.copy(camera.projectionMatrixInverse);
    cam.updateMatrixWorld();
    WET.uWetMat.value.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(cam.projectionMatrix).multiply(cam.matrixWorldInverse);
    // the stand-ins take the lights' current looks (the explore materials are swapped in on enter)
    if (this.globeProxy) { this.globeProxy.material = this.globes.material; this.globeProxy.count = this.globes.count; }
    for (const { core, m } of this.lampProxies) m.material = core.material;
    this.lowFlames.material = this.flames.material;
    // the bracket lanterns' flames, as they hang this frame
    const F = this.flames, P = this.lowFlames, m4 = this._m4 || (this._m4 = new THREE.Matrix4()), c = this._c || (this._c = new THREE.Color());
    this.lowIdx.forEach((i, k) => {
      F.getMatrixAt(i, m4); P.setMatrixAt(k, m4);
      if (F.instanceColor) { F.getColorAt(i, c); P.setColorAt(k, c); }
    });
    P.instanceMatrix.needsUpdate = true;
    if (P.instanceColor) P.instanceColor.needsUpdate = true;
    // draw the glows (no shadow maps: they are current)
    const sm = r.shadowMap, au = sm.autoUpdate, nu = sm.needsUpdate;
    sm.autoUpdate = false; sm.needsUpdate = false;
    const prevRT = r.getRenderTarget();
    r.setRenderTarget(this.rt);
    r.render(this.mirror, cam);
    r.setRenderTarget(prevRT);
    sm.autoUpdate = au; sm.needsUpdate = nu;
  }
}
