import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { leafGeometry, petalGeometry } from '../geometry/shapes.js';
import { enamelLeafTextures } from '../materials/textures.js';
import { swayMaterial, pivotParts } from '../world/wind.js';

// Close-up finish for the interactive modes. The film was dressed for fixed
// camera paths; a bee's-eye camera goes right up to the planting. While an
// interactive mode is active, the shared foliage gets:
//   · enamelled-metal leaves with gilt midribs, veins and margins (the
//     per-instance greens tint only the enamel, the gilding stays gold),
//     keeping each part's sway (world/wind.js);
//   · finer shrub roses; static instanced sets split into tiles;
//   · once the bee-scale planting has grown (nearfield.js), the film's leaves,
//     masses, shrubs, ferns, ivy, palm fronds and arch leaves are hidden;
//   · a dithered fade right in front of the lens, now only a last resort.
// Every swap is reversed on exit, so the film renders exactly as before.

// last resort only: the camera pushes the foliage aside (world/wind.js) and
// nothing comes within ~1.5 of the lens, so this rarely dithers anything now.
// uSwapK cross-dissolves the film's foliage (side -1) into the bee-scale
// planting (side +1) when it has grown: complementary dither patterns, so
// every pixel shows one or the other, never both or neither.
// uSight opens a window through the petals and leaves in front of APX-9 while
// it gathers on a bloom (explore.js): the camera picks a clear view down into
// the cup, but a petal that sways or springs open into the line is thinned
// away where it covers the bee (a cone from the lens round the bee's own
// outline, soft at the edge) instead of hiding it. uSight: the bee in view
// space, the window's radius there; uSightK: strength, and how far short of
// the bee the window stops.
export const FADE = { uCamFade: { value: new THREE.Vector2(0.55, 1.35) }, uSwapK: { value: 0 }, uSight: { value: new THREE.Vector4(0, 0, -10, 0) }, uSightK: { value: new THREE.Vector2(0, 1) } };

const DITHER = /* glsl */ `
  {
    float camD = length(vViewPosition);
    float fk = smoothstep(uCamFade.x, uCamFade.y, camD);
    if (uSightK.x > 0.001) {
      vec3 cgP = -vViewPosition;
      float cgL = length(uSight.xyz);
      float cgA = dot(cgP, uSight.xyz) / cgL;
      if (cgA > 0.0) {
        float cgR = uSight.w * cgA / cgL;
        float cgIn = 1.0 - smoothstep(cgR * 0.8, cgR * 1.05, length(cgP - uSight.xyz * (cgA / cgL)));
        float cgFront = 1.0 - smoothstep(cgL - uSightK.y - 0.6, cgL - uSightK.y, cgA);
        fk *= 1.0 - uSightK.x * cgIn * cgFront;
      }
    }
    float lo = 0.0;
    if (uSwapSide > 0.5) fk *= uSwapK;
    else if (uSwapSide < -0.5) lo = uSwapK;
    if (fk < 0.999 || lo > 0.001) {
      float ign = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
      if (ign > fk || ign < lo) discard;
    }
  }`;

// Night: blooms glow softly from within (per bloom, from the instanced
// attribute aBloomGlow that night.js fills), and garden glass shimmers.
export const GLOW = { uGlassGlow: { value: new THREE.Vector4(0, 0, 0, 0) }, uGlowT: { value: 0 } };
function bloomGlow(m, color, strength, key) {
  const prev = m.onBeforeCompile;
  const K = { value: new THREE.Color(color).multiplyScalar(strength) };
  m.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    sh.uniforms.uBloomK = K;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aBloomGlow; varying float vBG; varying float vPU;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvBG = aBloomGlow; vPU = uv.x;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uBloomK; varying float vBG; varying float vPU;')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        {
          // lit from the heart of the bloom: brightest at the petal's foot and
          // along its veins (the painted porcelain's glow map; the gilding
          // blocks it), a translucent glow through the thin edge
          #ifdef USE_EMISSIVEMAP
            vec3 heart = texture2D(emissiveMap, vEmissiveMapUv).rgb;
          #else
            vec3 heart = vec3(mix(1.0, 0.3, smoothstep(0.0, 0.95, vPU)));
          #endif
          float ndv = abs(dot(normal, normalize(vViewPosition)));
          totalEmissiveRadiance += uBloomK * vBG * heart * (0.75 + 0.5 * pow(1.0 - ndv, 2.0));
        }`);
  };
  const base = m.customProgramCacheKey?.bind(m);
  m.customProgramCacheKey = () => (base ? base() : '') + '|bloom-' + key;
  return m;
}
export function glowGlass(m) {
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    Object.assign(sh.uniforms, GLOW);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGW;')
      .replace('#include <project_vertex>', `#include <project_vertex>
        #ifdef USE_INSTANCING
          vGW = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
        #else
          vGW = (modelMatrix * vec4(transformed, 1.0)).xyz;
        #endif`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec4 uGlassGlow; uniform float uGlowT; varying vec3 vGW;')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        if (uGlassGlow.w > 0.0) {
          // blown glass at night: a slow iridescent shimmer along the rims
          float ndv = abs(dot(normal, normalize(vViewPosition)));
          float rim = pow(1.0 - ndv, 2.5);
          float sh = 0.55 + 0.45 * sin(dot(vGW, vec3(0.9, 1.7, 0.6)) + uGlowT * 1.3) * sin(dot(vGW, vec3(-0.5, 0.8, 1.1)) * 1.7 - uGlowT * 0.9);
          vec3 hue = mix(uGlassGlow.rgb, vec3(0.55, 0.85, 1.0) * dot(uGlassGlow.rgb, vec3(0.33)), 0.5 + 0.5 * sin(dot(vGW, vec3(0.4, 0.3, -0.5)) + uGlowT * 0.6));
          totalEmissiveRadiance += hue * uGlassGlow.w * (rim * 1.4 * sh + 0.06);
        }`);
  };
  m.customProgramCacheKey = () => 'cg-glow-glass';
  return m;
}

// a clone without the sway patch (it is re-applied for the explore material)
function fresh(m) {
  const c = m.clone();
  c.userData = {};
  const orig = m.userData.swayOrig;
  if (orig?.prev) c.onBeforeCompile = orig.prev;
  if (orig?.key) c.customProgramCacheKey = orig.key;
  return c;
}

// side: 0 always shown, -1 the film's foliage the bee-scale planting replaces
// (dissolves out with FADE.uSwapK), +1 the bee-scale planting (dissolves in)
function withDither(m, key, side = 0) {
  const prev = m.onBeforeCompile;
  const S = { value: side };
  m.userData.swapSide = S;
  m.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    sh.uniforms.uCamFade = FADE.uCamFade;
    sh.uniforms.uSwapK = FADE.uSwapK;
    sh.uniforms.uSwapSide = S;
    sh.uniforms.uSight = FADE.uSight;
    sh.uniforms.uSightK = FADE.uSightK;
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec2 uCamFade, uSightK; uniform vec4 uSight; uniform float uSwapK, uSwapSide;')
      .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>' + DITHER);
  };
  const base = m.customProgramCacheKey?.bind(m);
  m.customProgramCacheKey = () => (base ? base() : '') + '|dither-' + key;
  return m;
}

export function enamel(tex, { color = '#ffffff', mapped = true, key, side = 0 }) {
  const m = new THREE.MeshPhysicalMaterial({
    color,
    map: mapped ? tex.map : null,
    roughnessMap: mapped ? tex.orm : null,
    metalnessMap: mapped ? tex.orm : null,
    roughness: mapped ? 1 : 0.42,
    metalness: mapped ? 1 : 0.45,
    clearcoat: 0.55,
    clearcoatRoughness: 0.22,
    side: THREE.DoubleSide,
  });
  if (mapped) {
    m.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader
        .replace('vec4 diffuseColor = vec4( diffuse, opacity );', 'vec4 diffuseColor = vec4( vec3( 1.0 ), opacity );')
        .replace('#include <color_fragment>', `
          vec3 enamelTint = diffuse;
          #if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
            enamelTint *= vColor.rgb;
          #endif
          float gildK = smoothstep(0.5, 0.9, texture2D(metalnessMap, vMetalnessMapUv).b);
          diffuseColor.rgb *= mix(enamelTint, vec3(1.0), gildK);`);
    };
    m.customProgramCacheKey = () => 'cg-enamel-leaf';
  }
  return withDither(m, key, side);
}

// glass that reads as glass without three's transmission pre-pass (which
// re-renders the whole scene): reflections, a clearcoat and a faint tint
export function lightGlass(color = '#e9f2ee', opacity = 0.3) {
  return new THREE.MeshPhysicalMaterial({ color, metalness: 0, roughness: 0.04, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.6, specularIntensity: 1 });
}

// split a static InstancedMesh into spatial tiles so frustum culling works
// for the camera and for the sun's shadow map
function tiles(mesh, material, sx = 260, sz = 350) {
  const groups = new Map();
  const m4 = new THREE.Matrix4(), p = new THREE.Vector3();
  for (let i = 0; i < mesh.count; i++) {
    mesh.getMatrixAt(i, m4);
    p.setFromMatrixPosition(m4);
    const k = Math.floor(p.x / sx) + ',' + Math.floor(p.z / sz);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(i);
  }
  const out = [];
  const c = new THREE.Color();
  for (const ids of groups.values()) {
    const t = new THREE.InstancedMesh(mesh.geometry, material, ids.length);
    ids.forEach((id, j) => {
      mesh.getMatrixAt(id, m4);
      t.setMatrixAt(j, m4);
      if (mesh.instanceColor) { mesh.getColorAt(id, c); t.setColorAt(j, c); }
    });
    t.castShadow = mesh.castShadow;
    t.receiveShadow = mesh.receiveShadow;
    t.renderOrder = mesh.renderOrder;
    t.computeBoundingSphere();
    out.push(t);
  }
  return out;
}

// one-sided creased leaf (DoubleSide material): u along the blade, a centre fold
function thinLeaf(length, width, fold, arch, segU) {
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    for (let j = 0; j <= 2; j++) {
      const v = j - 1;
      const w = width * 0.5 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.8)), 0.9) * (u < 0.04 ? 0.3 : 1);
      const x = v * w;
      const z = fold * Math.abs(v) * w * 0.5 + arch * Math.sin(u * Math.PI * 0.9) * length * 0.12 - arch * u * u * length * 0.18;
      pos.push(x, u * length, z);
      uv.push(u, j / 2);
    }
  }
  for (let i = 0; i < segU; i++) for (let j = 0; j < 2; j++) { const a = i * 3 + j, b = a + 1, c = a + 3, d = c + 1; idx.push(a, b, d, a, d, c); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  // sway: pivot at the stalk, flex and flutter toward the tip (one surface)
  const n = pos.length / 3, W = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) { const u = uv[i * 2]; W[i * 4] = Math.pow(u, 1.4); W[i * 4 + 1] = Math.min(1, u * 1.5); }
  g.setAttribute('aSwayP', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  g.setAttribute('aSwayW', new THREE.BufferAttribute(W, 4));
  return g;
}

// the explore version of a swaying mesh's material keeps its sway
function keepSway(o, m) {
  const sw = o.userData.sway;
  return sw ? swayMaterial(m, sw.profile, { swing: sw.swing, phase: sw.phase }) : m;
}

export class LookUpgrade {
  constructor(world, quality, mat) {
    this.swaps = [];
    this.group = new THREE.Group();
    this.group.name = 'upgrade-tiles';
    const tex = enamelLeafTextures(quality.tier === 'low' ? 256 : 512);
    const fo = world.foliage, fl = world.flora;
    // one enamel material per (sway profile, mapped) so each part keeps its stiffness
    const foMats = new Map();
    const foMat = (o) => {
      const mapped = !!o.geometry.attributes.uv;
      const k = (o.userData.sway?.profile || '') + (o.userData.sway?.swing ? 's' : '') + (mapped ? '|m' : '|p');
      if (!foMats.has(k)) foMats.set(k, keepSway(o, enamel(tex, { mapped, key: 'fo-' + k, side: -1 })));
      return foMats.get(k);
    };
    // a creased version of the foliage masses' dome (same layout as foliage.js)
    const foldLeaf = thinLeaf(7, 2.6, 0.6, 0.8, 4);
    const dome = (() => {
      const parts = [], pivots = [], phases = [];
      const N = 56;
      for (let i = 0; i < N; i++) {
        const g = foldLeaf.clone();
        g.scale(0.62, 0.62, 0.62);
        if (i % 3 === 0) g.scale(1.3, 1.3, 1.3);
        const u = (i + 0.5) / N;
        const el = Math.acos(1 - u) * 0.95;
        const az = i * 2.39996;
        g.rotateX(-0.4 + el * 0.6);
        g.rotateY(az);
        const r = 6 * Math.sin(el + 0.25);
        const pv = new THREE.Vector3(Math.sin(az) * r * 0.5, 6 * Math.cos(el) * 0.75 + 1, Math.cos(az) * r * 0.5);
        g.translate(pv.x, pv.y, pv.z);
        parts.push(g);
        pivots.push(pv);
        phases.push((i * 0.618) % 1);
      }
      return pivotParts(mergeGeometries(parts), parts, pivots, phases);
    })();
    this.domeGeo = dome;
    const foLeaf = new Set(fo.leafMats || [fo.leafMat]);
    for (const o of fo.group.children) {
      if (!o.isMesh) continue;
      if (foLeaf.has(o.material)) {
        if (o.geometry === fo.domeGeo) {
          this.swap(o, 'geometry', dome);
          this.swap(o, 'material', foMat({ geometry: dome, userData: o.userData }));
        } else this.swap(o, 'material', foMat(o));
      }
    }
    // the bee-scale planting's palm fronds: the same enamel, dissolving in
    {
      const o = fo.frondMesh, mapped = !!o.geometry.attributes.uv;
      const k = (o.userData.sway?.profile || '') + (o.userData.sway?.swing ? 's' : '') + (mapped ? '|m' : '|p');
      this.palmMatIn = keepSway(o, enamel(tex, { mapped, key: 'fo-' + k, side: 1 }));
    }
    // flora: stem/base leaves, shrubs, ferns, petals, the rose arch
    const floraLeaf = new Map(fl.leafMats.map((m) => [m, swayMaterial(enamel(tex, { color: m.color.clone().multiplyScalar(1.15), key: 'fl-leaf-' + m.id, side: -1 }), 'leaf')]));
    const shrub = new Map((fl.shrubMats || []).map((m) => [m, swayMaterial(enamel(tex, { color: m.color.clone().multiplyScalar(1.15), key: 'fl-shrub-' + m.id, side: -1 }), 'dome')]));
    const petals = new Set(fl.inst.flatMap((x) => [x.petals, ...x.fine]));
    // how each bloom glows from within at night: porcelain and roses most, metal cups a little
    const GLOWS = { lily: ['#ffcf9c', 0.55], rose: ['#ffa898', 0.45], tulip: ['#ffa284', 0.45], copperbloom: ['#ff9050', 0.05] };
    const typeOf = new Map(fl.inst.flatMap((x) => [x.petals, ...x.fine].map((m) => [m, x.ty.name])));
    const petalMats = new Map();
    for (const o of fl.group.children) {
      if (!o.isMesh) continue;
      if (floraLeaf.has(o.material)) this.swap(o, 'material', floraLeaf.get(o.material));
      else if (shrub.has(o.material)) this.swap(o, 'material', shrub.get(o.material));
      else if (o === fl.fernMesh) {
        // the film's ferns dissolve out; the urns keep theirs; the bee-scale ferns dissolve in
        this.swap(o, 'material', keepSway(o, withDither(fresh(o.material), 'fern', -1)));
        this.fernMat = keepSway(o, withDither(fresh(o.material), 'fern', 0));
        this.fernMatIn = keepSway(o, withDither(fresh(o.material), 'fern', 1));
      } else if (petals.has(o) || (fl.archParts || []).includes(o)) {
        if (!petalMats.has(o.material)) {
          const side = o === fl.archParts?.[1] ? -1 : 0; // the arch's leaves are re-planted
          // (a bloom type's coarse and fine petals share one program)
          let m = withDither(fresh(o.material), 'petal-' + (typeOf.get(o) || o.material.id), side);
          const gl = GLOWS[typeOf.get(o)];
          if (gl) m = bloomGlow(m, gl[0], gl[1], typeOf.get(o));
          petalMats.set(o.material, keepSway(o, m));
        }
        this.swap(o, 'material', petalMats.get(o.material));
      }
    }
    // the bee-scale planting (nearfield.js) replaces the film's leaves, masses,
    // shrubs, ferns and ivy while exploring, once it has grown (replace())
    this.replaceable = [...(fl.leafMeshes || []), fo.stemLeafMesh, fo.domeMesh, ...(fl.shrubMeshes || []), fl.fernMesh, fo.ivyMesh, fo.frondMesh, fl.archParts?.[1]].filter(Boolean);
    this.tilesOf = new Map();
    // the shrub roses (and the arch's) seen from a bee's distance: finer petals
    const fineRose = (() => {
      const parts = [];
      const pg = petalGeometry({ length: 2.4, width: 2.6, cup: 0.9, curl: 0.4, thickness: 0.08, segU: 5, segV: 4 }).geometry;
      for (let ring = 0; ring < 2; ring++) {
        const n = ring ? 5 : 7;
        for (let i = 0; i < n; i++) {
          const g = pg.clone();
          g.rotateX(ring ? 0.4 : 0.9);
          g.rotateY((i / n) * Math.PI * 2 + ring * 0.4);
          parts.push(g);
        }
      }
      return mergeGeometries(parts);
    })();
    if (fo.roseMesh) this.swap(fo.roseMesh, 'geometry', fineRose);
    if (fl.archParts?.[0]) this.swap(fl.archParts[0], 'geometry', fineRose);
    // the armillary's lamp: a glossy glowing orb rather than a flat disc
    this.armCore = new THREE.MeshPhysicalMaterial({ color: '#b8873e', emissive: '#ff9a3a', emissiveIntensity: 0.6, roughness: 0.18, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04 });
    this.swap(fl.armCore, 'material', this.armCore);
    this.tileStatic(world, mat);
  }

  // replace static instanced meshes by tiled copies (originals hidden while exploring)
  tileStatic(world, mat) {
    const fl = world.flora, fo = world.foliage;
    // swaying on the CPU each frame: never frozen into tiles
    const dynamic = new Set([...fl.inst.flatMap((x) => [x.petals, ...x.fine, x.stems, x.calyx]), fl.filaments, fl.anthers, fl.orbMesh, fl.orbStems, fo.flames, fo.lanternFrames, fo.lanternGlass, fo.lanternChains]);
    const material = (o) => this.swaps.find((s) => s.obj === o && s.prop === 'material')?.explore ?? o.material;
    const geometry = (o) => this.swaps.find((s) => s.obj === o && s.prop === 'geometry')?.explore ?? o.geometry;
    for (const root of [fl.group, fo.group]) {
      for (const o of [...root.children]) {
        // only shadow casters gain from tiling (the sun's shadow map is local)
        if (!o.isInstancedMesh || dynamic.has(o) || o.count < 24 || !o.castShadow) continue;
        this.tilesOf.set(o, []);
        const proxy = { geometry: geometry(o), count: o.count, instanceColor: o.instanceColor, getMatrixAt: (i, m) => o.getMatrixAt(i, m), getColorAt: (i, c) => o.getColorAt(i, c), castShadow: o.castShadow, receiveShadow: o.receiveShadow, renderOrder: o.renderOrder };
        for (const t of tiles(proxy, material(o))) {
          if (o.customDepthMaterial) { t.customDepthMaterial = o.customDepthMaterial; t.userData.sway = o.userData.sway; }
          this.group.add(t);
          this.tilesOf.get(o).push(t);
        }
        this.swap(o, 'visible', false);
      }
    }
    // glass: no transmission pass while exploring (and a shimmer at night)
    const glass = glowGlass(lightGlass());
    glass.userData.noLightField = true; // lamps inside glass would turn it milky: it shimmers on its own
    this.glass = glass;
    const roots = [world.pods.group, world.blossom.group, world.garden.group, world.flora.group, world.foliage.group];
    for (const r of roots) r.traverse((o) => { if (o.isMesh && o.material === mat.glass) this.swap(o, 'material', glass); });
  }

  swap(obj, prop, value) {
    this.swaps.push({ obj, prop, film: obj[prop], explore: value });
  }

  apply(on) {
    this.on = on;
    for (const s of this.swaps) s.obj[s.prop] = on ? s.explore : s.film;
  }

  // the bee-scale planting is ready: hide what it replaces (the film keeps its own)
  replace() {
    if (this.replacedDone) return;
    this.replacedDone = true;
    for (const o of this.replaceable) {
      const tl = this.tilesOf.get(o);
      if (tl) for (const t of tl) t.visible = false;
      else { this.swap(o, 'visible', false); if (this.on) o.visible = false; }
    }
  }

  setFade(near, far) { FADE.uCamFade.value.set(near, far); }
}

export { withDither };
