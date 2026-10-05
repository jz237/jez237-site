import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { leafGeometry } from '../geometry/shapes.js';
import { enamelLeafTextures } from '../materials/textures.js';

// Close-up finish for the interactive modes. The film was dressed for fixed
// camera paths; a bee's-eye camera goes right up to the planting. While a
// interactive mode is active, the shared foliage gets:
//   · enamelled-metal leaves with gilt midribs, veins and margins (the
//     per-instance greens tint only the enamel, the gilding stays gold);
//   · folded (creased) leaves in the foliage masses instead of flat ones;
//   · a dithered fade for leaves and petals right in front of the lens, so
//     the camera never sits behind a wall of leaf.
// Every swap is reversed on exit, so the film renders exactly as before.

const FADE = { uCamFade: { value: new THREE.Vector2(2.2, 6.5) } };

const DITHER = /* glsl */ `
  {
    float camD = length(vViewPosition);
    float fk = smoothstep(uCamFade.x, uCamFade.y, camD);
    if (fk < 0.999) {
      float ign = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
      if (ign > fk) discard;
    }
  }`;

function withDither(m, key) {
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    sh.uniforms.uCamFade = FADE.uCamFade;
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec2 uCamFade;')
      .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>' + DITHER);
  };
  const base = m.customProgramCacheKey?.bind(m);
  m.customProgramCacheKey = () => (base ? base() : '') + '|dither-' + key;
  return m;
}

function enamel(tex, { color = '#ffffff', mapped = true, key }) {
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
  return withDither(m, key);
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
  return g;
}

export class LookUpgrade {
  constructor(world, quality, mat) {
    this.swaps = [];
    this.group = new THREE.Group();
    this.group.name = 'upgrade-tiles';
    const tex = enamelLeafTextures(quality.tier === 'low' ? 256 : 512);
    const fo = world.foliage, fl = world.flora;
    const leafInst = enamel(tex, { key: 'fo-leaf' });
    const leafPlain = enamel(tex, { mapped: false, key: 'fo-plain' });
    // a creased version of the foliage masses' dome (same layout as foliage.js)
    const foldLeaf = thinLeaf(7, 2.6, 0.6, 0.8, 4);
    const dome = (() => {
      const parts = [];
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
        g.translate(Math.sin(az) * r * 0.5, 6 * Math.cos(el) * 0.75 + 1, Math.cos(az) * r * 0.5);
        parts.push(g);
      }
      return mergeGeometries(parts);
    })();
    for (const o of fo.group.children) {
      if (!o.isMesh) continue;
      if (o.material === fo.leafMat) {
        this.swap(o, 'material', o.geometry.attributes.uv ? leafInst : leafPlain);
        if (o.geometry === fo.domeGeo) this.swap(o, 'geometry', dome);
      }
    }
    // flora: stem/base leaves, shrubs, ferns, petals, the rose arch
    const floraLeaf = new Map(fl.leafMats.map((m) => [m, enamel(tex, { color: m.color.clone().multiplyScalar(1.15), key: 'fl-leaf-' + m.id })]));
    const shrub = new Map((fl.shrubMats || []).map((m) => [m, enamel(tex, { color: m.color.clone().multiplyScalar(1.15), key: 'fl-shrub-' + m.id })]));
    const petals = new Set(fl.inst.map((x) => x.petals));
    const petalMats = new Map();
    for (const o of fl.group.children) {
      if (!o.isMesh) continue;
      if (floraLeaf.has(o.material)) this.swap(o, 'material', floraLeaf.get(o.material));
      else if (shrub.has(o.material)) this.swap(o, 'material', shrub.get(o.material));
      else if (o === fl.fernMesh) this.swap(o, 'material', withDither(o.material.clone(), 'fern'));
      else if (petals.has(o) || (fl.archParts || []).includes(o)) {
        if (!petalMats.has(o.material)) petalMats.set(o.material, withDither(o.material.clone(), 'petal-' + o.material.id));
        this.swap(o, 'material', petalMats.get(o.material));
      }
    }
    // the armillary's lamp: a glossy glowing orb rather than a flat disc
    this.armCore = new THREE.MeshPhysicalMaterial({ color: '#b8873e', emissive: '#ff9a3a', emissiveIntensity: 0.6, roughness: 0.18, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04 });
    this.swap(fl.armCore, 'material', this.armCore);
    this.tileStatic(world, mat);
  }

  // replace static instanced meshes by tiled copies (originals hidden while exploring)
  tileStatic(world, mat) {
    const fl = world.flora, fo = world.foliage;
    const dynamic = new Set([...fl.inst.map((x) => x.petals), fl.orbMesh, fo.flames]);
    const material = (o) => this.swaps.find((s) => s.obj === o && s.prop === 'material')?.explore ?? o.material;
    const geometry = (o) => this.swaps.find((s) => s.obj === o && s.prop === 'geometry')?.explore ?? o.geometry;
    for (const root of [fl.group, fo.group]) {
      for (const o of [...root.children]) {
        // only shadow casters gain from tiling (the sun's shadow map is local)
        if (!o.isInstancedMesh || dynamic.has(o) || o.count < 24 || !o.castShadow) continue;
        const proxy = { geometry: geometry(o), count: o.count, instanceColor: o.instanceColor, getMatrixAt: (i, m) => o.getMatrixAt(i, m), getColorAt: (i, c) => o.getColorAt(i, c), castShadow: o.castShadow, receiveShadow: o.receiveShadow, renderOrder: o.renderOrder };
        for (const t of tiles(proxy, material(o))) this.group.add(t);
        this.swap(o, 'visible', false);
      }
    }
    // glass: no transmission pass while exploring
    const glass = lightGlass();
    const roots = [world.pods.group, world.blossom.group, world.garden.group, world.flora.group, world.foliage.group];
    for (const r of roots) r.traverse((o) => { if (o.isMesh && o.material === mat.glass) this.swap(o, 'material', glass); });
  }

  swap(obj, prop, value) {
    this.swaps.push({ obj, prop, film: obj[prop], explore: value });
  }

  apply(on) {
    for (const s of this.swaps) s.obj[s.prop] = on ? s.explore : s.film;
  }

  setFade(near, far) { FADE.uCamFade.value.set(near, far); }
}

export { withDither };
