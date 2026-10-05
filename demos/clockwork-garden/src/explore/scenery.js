import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RNG, noise1, fbm1 } from '../core/rng.js';
import { clamp, lerp, sseg } from '../core/ease.js';
import { L } from '../world/layout.js';
import { archPoint } from '../world/greenhouse.js';

// Dressing that free flight exposes and the film never needed:
//  · the near end of the glasshouse: stone plinth, glazed gable with iron
//    tracery and a fanlight over double doors onto the garden;
//  · a stone plinth under the far window, finer glazing bars on the walls;
//  · the world outside the glass: lawns and gravel walks, box hedges and
//    topiary, a brick garden wall, belts of trees and rolling hills, all
//    with their own aerial perspective so they read through the haze.
// Visible only in the interactive modes.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const H = L.house;
const TAU = Math.PI * 2;
const XC = (H.x0 + H.x1) / 2;

export class Scenery {
  constructor(mat, quality, world, bounds = null, upgrade = null) {
    this.bounds = bounds;
    this.upgrade = upgrade;
    this.group = new THREE.Group();
    this.group.name = 'scenery';
    this.rng = new RNG('scenery');
    this.low = quality.tier === 'low';
    // shared aerial perspective for everything outside the glass
    this.haze = { uHaze: { value: new THREE.Color('#c9a67a') }, uHazeDensity: { value: 0.00028 } };
    this._interior(mat, world);
    this._exterior(mat);
    this._endPlanting(mat, world);
  }

  // the floor strips at both ends of the house, in front of the end walls,
  // get urns of ferns and mounded foliage (they were never in the film's shots)
  _endPlanting(mat, world) {
    const g = this.group;
    const r = new RNG('ends');
    const fo = world.foliage;
    const doorX0 = L.pathX[0] - 8, doorX1 = L.pathX[1] + 8;
    const domes = [], urns = [];
    const rows = [
      { z: H.z0 - 14, gaps: [[doorX0 - 16, doorX1 + 16]] },
      { z: H.z1 + 24, gaps: [[L.pathX[0] - 10, L.pathX[1] + 10]] },
    ];
    for (const row of rows) {
      for (let x = H.x0 + 26; x < H.x1 - 26; x += r.range(26, 38)) {
        if (row.gaps.some(([a, b]) => x > a && x < b)) continue;
        const z = row.z + r.range(-4, 4);
        if (r.chance(0.3)) urns.push([x, z, r.range(0.9, 1.2)]);
        else domes.push([x, z, r.range(2.2, 3.6)]);
      }
    }
    const col = new THREE.Color();
    const GREENS = ['#7d8c40', '#5b7d4c', '#3f6a50', '#8e9c4a', '#6b7a36', '#46705a'];
    const leafMat = this.upgrade?.swaps.find((s) => s.obj === fo.domeMesh && s.prop === 'material')?.explore || fo.domeMat;
    const domeGeo = this.upgrade?.domeGeo || fo.domeGeo;
    const dm = new THREE.InstancedMesh(domeGeo, leafMat, domes.length);
    domes.forEach(([x, z, s], i) => {
      dm.setMatrixAt(i, new THREE.Matrix4().compose(V(x, -1.5, z), new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), r.range(0, TAU)), V(s * r.range(0.9, 1.2), s * r.range(0.8, 1.2), s * r.range(0.9, 1.2))));
      dm.setColorAt(i, col.set(GREENS[i % GREENS.length]).offsetHSL(r.range(-0.015, 0.015), r.range(-0.08, 0.08), r.range(-0.06, 0.06)));
      this.bounds?.ell(V(x, -1.5 + 6 * s * 0.42, z), 3 * s * 0.95, 6 * s * 0.5, 'bush');
    });
    // the interactive modes plant these masses leaf by leaf (nearfield.js)
    this.endMasses = domes.map(([x, z, s]) => ({ x, z, y0: -1.5, r: 3 * s * 0.95 / 0.92, h: 6 * s }));
    this.endDomes = dm;
    dm.castShadow = true; dm.receiveShadow = true; dm.computeBoundingSphere();
    dm.customDepthMaterial = fo.domeMesh.customDepthMaterial;
    g.add(dm);
    // stone urns with a fountain of fern fronds
    const urnGeo = new THREE.LatheGeometry([[0, 0], [5, 0], [5.5, 1], [4, 3], [4.2, 4], [7.5, 9], [8.6, 14], [9.2, 15], [8.2, 15.5]].map(([a, b]) => new THREE.Vector2(a, b)), 20);
    const um = new THREE.InstancedMesh(urnGeo, world.greenhouse.stone, urns.length);
    const frondGeo = world.flora.fernMesh.geometry;
    const fm = new THREE.InstancedMesh(frondGeo, this.upgrade?.swaps.find((s) => s.obj === world.flora.fernMesh && s.prop === 'material')?.explore || world.flora.fernMesh.material, urns.length * 9);
    let fi = 0;
    urns.forEach(([x, z, s], i) => {
      um.setMatrixAt(i, new THREE.Matrix4().compose(V(x, -2.5, z), new THREE.Quaternion(), V(s, s, s)));
      for (let k = 0; k < 9; k++) {
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(r.range(-0.3, 0.1), (k / 9) * TAU + r.range(-0.2, 0.2), 0, 'YXZ'));
        fm.setMatrixAt(fi++, new THREE.Matrix4().compose(V(x, 12 * s, z), q, V(1, 1, 1).multiplyScalar(r.range(1.1, 1.5) * s)));
      }
      this.bounds?.cyl(x, z, 9.4 * s, -2, 15.5 * s, 'urn');
      this.bounds?.ell(V(x, 20 * s, z), 16 * s, 8 * s, 'fern');
    });
    fm.count = fi;
    fm.customDepthMaterial = world.flora.fernMesh.customDepthMaterial;
    for (const m of [um, fm]) { m.castShadow = true; m.receiveShadow = true; m.computeBoundingSphere(); g.add(m); }
  }

  // Lambert with a gentler, sky-coloured haze in place of the interior fog.
  // kind 'foliage': world-space leaf clumps (albedo and normal) on canopies;
  // kind 'lawn': mown stripes and broad patches near the house.
  ext(params, kind = '') {
    const m = new THREE.MeshLambertMaterial(params);
    const u = this.haze;
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uHaze = u.uHaze;
      sh.uniforms.uHazeDensity = u.uHazeDensity;
      if (kind) {
        sh.vertexShader = sh.vertexShader
          .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
          .replace('#include <project_vertex>', `#include <project_vertex>
            #ifdef USE_INSTANCING
              vWPos = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
            #else
              vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
            #endif`);
      }
      let frag = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          uniform vec3 uHaze; uniform float uHazeDensity;
          ${kind ? 'varying vec3 vWPos;' : ''}
          float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
          float n3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
                       mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }`)
        .replace('#include <fog_fragment>', `#ifdef USE_FOG
          float hz = 1.0 - exp(-uHazeDensity * uHazeDensity * vFogDepth * vFogDepth);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, uHaze, hz);
        #endif`);
      if (kind === 'foliage') {
        frag = frag
          .replace('#include <color_fragment>', `#include <color_fragment>
            float cl = n3(vWPos * 0.012) * 0.6 + n3(vWPos * 0.037 + 3.1) * 0.4;
            diffuseColor.rgb *= mix(0.55, 1.3, smoothstep(0.2, 0.8, cl));`)
          .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
            vec3 q = vWPos * 0.03;
            vec3 bump = vec3(n3(q) - 0.5, n3(q + 11.3) - 0.5, n3(q + 23.7) - 0.5);
            normal = normalize(normal + (viewMatrix * vec4(bump, 0.0)).xyz * 1.6);`);
      } else if (kind === 'lawn') {
        frag = frag.replace('#include <color_fragment>', `#include <color_fragment>
            float near = 1.0 - smoothstep(900.0, 2200.0, length(vWPos.xz - vec2(25.0, -300.0)));
            float stripe = smoothstep(0.42, 0.58, abs(fract(vWPos.x / 140.0) - 0.5) * 2.0);
            float patchN = n3(vWPos * 0.0021) * 0.6 + n3(vWPos * 0.009) * 0.4;
            diffuseColor.rgb *= mix(1.0, mix(0.9, 1.08, stripe), near) * mix(0.82, 1.15, patchN);`);
      }
      sh.fragmentShader = frag;
    };
    m.customProgramCacheKey = () => 'cg-ext-v2-' + kind;
    return m;
  }

  // ---------------------------------------------------------------------------
  _interior(mat, world) {
    const g = this.group;
    const iron = mat.iron;
    const stone = world.greenhouse.stone;
    const zN = H.z0;
    // plinths across both ends (the near one with a doorway onto the path)
    const doorX0 = L.pathX[0] - 8, doorX1 = L.pathX[1] + 8;
    const plinth = (x0, x1, z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 71.5, 14), stone);
      m.position.set((x0 + x1) / 2, 33.75, z);
      m.receiveShadow = true;
      g.add(m);
    };
    plinth(H.x0 + 9, doorX0, zN);
    plinth(doorX1, H.x1 - 9, zN);
    plinth(H.x0 + 9, doorX0, H.z1 + 6);
    plinth(doorX1, H.x1 - 9, H.z1 + 6);
    // the near gable: glass above the plinth up to the vault
    const shape = new THREE.Shape();
    shape.moveTo(H.x0, 68);
    shape.lineTo(H.x0, H.wall);
    for (let i = 1; i <= 48; i++) { const x = H.x0 + (i / 48) * (H.x1 - H.x0); shape.lineTo(x, archPoint(x, H)); }
    shape.lineTo(H.x1, 68);
    shape.lineTo(doorX1, 68);
    shape.lineTo(doorX1, 0);
    shape.lineTo(doorX0, 0);
    shape.lineTo(doorX0, 68);
    shape.lineTo(H.x0, 68);
    const gable = new THREE.Mesh(new THREE.ShapeGeometry(shape, 4), mat.paneGlass);
    gable.position.z = zN;
    gable.renderOrder = 2;
    g.add(gable);
    // tracery on the gable: mullions, transoms, a fanlight and the door frames
    const bars = [];
    const tube = (a, b, r = 1.5) => bars.push(new THREE.TubeGeometry(new THREE.LineCurve3(a, b), 1, r, 6, false));
    for (let x = H.x0 + 32; x < H.x1 - 4; x += 32) {
      if (x > doorX0 - 2 && x < doorX1 + 2) continue;
      tube(V(x, 68, zN + 1), V(x, archPoint(x, H), zN + 1), 1.3);
    }
    for (const y of [160, H.wall]) tube(V(H.x0, y, zN + 1), V(H.x1, y, zN + 1), 1.4);
    // fan over the doors
    const fanC = V((doorX0 + doorX1) / 2, 150, zN + 1.5);
    const fanR = (doorX1 - doorX0) / 2 + 6;
    for (let r = 1; r <= 3; r++) {
      const pts = [];
      for (let k = 0; k <= 30; k++) { const a = (k / 30) * Math.PI; pts.push(V(fanC.x + Math.cos(a) * fanR * (r / 3), fanC.y + Math.sin(a) * fanR * (r / 3), fanC.z)); }
      bars.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, r === 3 ? 2 : 1.3, 6, false));
    }
    for (let s = 0; s <= 10; s++) { const a = (s / 10) * Math.PI; tube(fanC.clone().add(V(Math.cos(a) * fanR * 0.33, Math.sin(a) * fanR * 0.33, 0)), fanC.clone().add(V(Math.cos(a) * fanR, Math.sin(a) * fanR, 0)), 1.1); }
    // door frame and a pair of half-open glazed doors
    tube(V(doorX0, 0, zN + 1.5), V(doorX0, 150, zN + 1.5), 2.4);
    tube(V(doorX1, 0, zN + 1.5), V(doorX1, 150, zN + 1.5), 2.4);
    tube(V(doorX0, 150, zN + 1.5), V(doorX1, 150, zN + 1.5), 2.4);
    const doorW = (doorX1 - doorX0) / 2;
    const doorGlass = [];
    for (const side of [-1, 1]) {
      const hinge = V(side < 0 ? doorX0 : doorX1, 0, zN + 2);
      const open = 1.15; // swung outward into the garden
      const dir = V(-side * Math.cos(open), 0, Math.sin(open));
      const corner = (u, y) => hinge.clone().addScaledVector(dir, u * doorW).setY(y);
      tube(corner(0, 2), corner(0, 146), 1.6);
      tube(corner(1, 2), corner(1, 146), 1.6);
      for (const y of [2, 56, 146]) tube(corner(0, y), corner(1, y), 1.4);
      tube(corner(0.5, 56), corner(0.5, 146), 0.9);
      const gp = new THREE.PlaneGeometry(doorW, 144);
      const gm = new THREE.Mesh(gp, mat.paneGlass);
      gm.position.copy(corner(0.5, 74));
      gm.rotation.y = Math.atan2(dir.x, dir.z) - Math.PI / 2;
      gm.renderOrder = 2;
      doorGlass.push(gm);
    }
    for (const m of doorGlass) g.add(m);
    // the far gable: a matching pair of doors, closed, under a fanlight
    {
      const zF = H.z1 + 2;
      tube(V(doorX0, 0, zF), V(doorX0, 150, zF), 2.4);
      tube(V(doorX1, 0, zF), V(doorX1, 150, zF), 2.4);
      tube(V(doorX0, 150, zF), V(doorX1, 150, zF), 2.4);
      const xm = (doorX0 + doorX1) / 2;
      tube(V(xm, 0, zF), V(xm, 150, zF), 1.8);
      for (const [a, b] of [[doorX0, xm], [xm, doorX1]]) {
        for (const y of [3, 56, 146]) tube(V(a, y, zF + 0.6), V(b, y, zF + 0.6), 1.3);
        tube(V((a + b) / 2, 56, zF + 0.6), V((a + b) / 2, 146, zF + 0.6), 0.9);
      }
      const fc = V(xm, 150, zF + 0.6);
      const fr = (doorX1 - doorX0) / 2 + 6;
      for (let r = 1; r <= 2; r++) {
        const pts = [];
        for (let k = 0; k <= 30; k++) { const a = (k / 30) * Math.PI; pts.push(V(fc.x + Math.cos(a) * fr * (r / 2), fc.y + Math.sin(a) * fr * (r / 2), fc.z)); }
        bars.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, r === 2 ? 2 : 1.2, 6, false));
      }
      for (let s = 1; s < 8; s++) { const a = (s / 8) * Math.PI; tube(fc.clone().add(V(Math.cos(a) * fr * 0.5, Math.sin(a) * fr * 0.5, 0)), fc.clone().add(V(Math.cos(a) * fr, Math.sin(a) * fr, 0)), 1); }
      // a brass door pull on each leaf
      for (const x of [xm - 5, xm + 5]) {
        const knob = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 8), mat.gold);
        knob.position.set(x, 90, zF + 2.5);
        g.add(knob);
      }
    }
    const tr = new THREE.Mesh(mergeGeometries(bars.map((x) => x.toNonIndexed())), iron);
    tr.castShadow = true;
    tr.receiveShadow = true;
    g.add(tr);
    // finer glazing bars on the side walls (between the existing mullions)
    const len = H.z0 - H.z1;
    const vb = new THREE.BoxGeometry(0.8, H.wall - 68, 0.8);
    const hb = new THREE.BoxGeometry(0.9, 0.9, len);
    const nM = Math.floor(len / 32);
    const fine = new THREE.InstancedMesh(vb, iron, nM * 2);
    const rails = new THREE.InstancedMesh(hb, iron, 12);
    const m4 = new THREE.Matrix4();
    let fi = 0, ri = 0;
    for (const x of [H.x0 + 0.6, H.x1 - 0.6]) {
      for (let i = 0; i < nM; i++) { m4.makeTranslation(x, (H.wall + 68) / 2, H.z0 - 16 - i * 32); fine.setMatrixAt(fi++, m4); }
      for (const y of [114, 205]) { m4.makeTranslation(x, y, (H.z0 + H.z1) / 2); rails.setMatrixAt(ri++, m4); }
    }
    fine.count = fi; rails.count = ri;
    g.add(fine, rails);
    // the columns carried on up to the purlins of the vault (in the film they
    // stopped under the eaves line, out of shot): a slimmer upper shaft, a
    // gilded collar at the join, a flared capital and four scroll brackets
    {
      const parts = [], gold = [];
      for (const x of [-118, 168]) {
        const top = archPoint(x, H) - 2;
        for (let i = 0; i < 8; i++) {
          const z = 150 - i * 150;
          if (z < H.z1 + 5) continue;
          const shaft = new THREE.CylinderGeometry(2.3, 2.9, top - (H.wall + 44), 10);
          shaft.translate(x, (top + H.wall + 44) / 2, z);
          parts.push(shaft.toNonIndexed());
          const flare = new THREE.CylinderGeometry(6.5, 2.3, 10, 12);
          flare.translate(x, top - 5, z);
          parts.push(flare.toNonIndexed());
          const collar = new THREE.TorusGeometry(3.1, 0.9, 6, 16);
          collar.rotateX(Math.PI / 2);
          collar.translate(x, H.wall + 50, z);
          gold.push(collar.toNonIndexed());
          for (let k = 0; k < 4; k++) {
            const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
            const pts = [];
            for (let j = 0; j <= 14; j++) {
              const u = j / 14;
              const r = 2.5 + Math.sin(u * Math.PI * 0.5) * 16;
              const y = top - 40 + u * 36 + Math.sin(u * Math.PI * 3) * 1.5;
              pts.push(V(x + Math.cos(a) * r, y, z + Math.sin(a) * r));
            }
            parts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.8, 5, false).toNonIndexed());
          }
        }
      }
      const cm = new THREE.Mesh(mergeGeometries(parts), mat.iron);
      cm.castShadow = true;
      cm.receiveShadow = true;
      const gm = new THREE.Mesh(mergeGeometries(gold), mat.gold);
      g.add(cm, gm);
    }
    // gravel threshold under the doors, joining path and garden
    const sill = new THREE.Mesh(new THREE.BoxGeometry(doorX1 - doorX0, 1.5, 24), new THREE.MeshStandardMaterial({ color: '#8f8574', map: stone.map, roughness: 0.85 }));
    sill.position.set((doorX0 + doorX1) / 2, -1.6, zN + 4);
    sill.receiveShadow = true;
    g.add(sill);
  }

  // ---------------------------------------------------------------------------
  _exterior(mat) {
    const g = this.group;
    const r = this.rng;
    const c = new THREE.Color();
    // lawn: a wide disc, mown in stripes near the house, rising to meadow far out
    const ground = new THREE.CircleGeometry(9000, 128, 0, TAU);
    ground.rotateX(-Math.PI / 2);
    const gp = ground.attributes.position;
    const cols = new Float32Array(gp.count * 3);
    for (let i = 0; i < gp.count; i++) {
      const x = gp.getX(i), z = gp.getZ(i);
      const d = Math.hypot(x - XC, z - (H.z0 + H.z1) / 2);
      gp.setY(i, -3 - Math.max(0, d - 2500) * 0.02 + fbm1(x * 0.0012 + z * 0.0007, 3) * Math.min(1, d / 3000) * 120);
      const n = fbm1(x * 0.004 + 13, 2) * 0.5 + fbm1(z * 0.0035 + 3, 5) * 0.5;
      c.setHSL(0.21 + n * 0.035, 0.42 + n * 0.08, 0.32 + n * 0.05);
      cols.set([c.r, c.g, c.b], i * 3);
    }
    ground.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    ground.computeVertexNormals();
    const lawn = new THREE.Mesh(ground, this.ext({ vertexColors: true, map: this._lawnTexture() }, 'lawn'));
    g.add(lawn);
    // gravel walks from both ends, a cross walk and an apron round the house
    const gravel = this.ext({ color: '#c9b894' });
    const walk = (x0, x1, z0, z1) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 1, Math.abs(z1 - z0)), gravel);
      m.position.set((x0 + x1) / 2, -2.6, (z0 + z1) / 2);
      g.add(m);
    };
    // an apron round the house (a ring: the floor inside is the house's own)
    walk(H.x0 - 40, H.x0 - 6, H.z0 + 40, H.z1 - 40);
    walk(H.x1 + 6, H.x1 + 40, H.z0 + 40, H.z1 - 40);
    walk(H.x0 - 40, H.x1 + 40, H.z0 + 40, H.z0 + 6);
    walk(H.x0 - 40, H.x1 + 40, H.z1 - 6, H.z1 - 40);
    walk(L.pathX[0] - 6, L.pathX[1] + 6, H.z0 + 40, 1780);
    walk(L.pathX[0] - 6, L.pathX[1] + 6, H.z1 - 40, -2260);
    walk(-1200, 1300, 700, 760);
    // box hedges lining the walks, yew cones at the corners
    const hedgeGeo = this._roundedBox(1, 1, 1, 0.25);
    const hedges = [];
    const hedge = (x, z, w, d, h) => hedges.push([V(x, h / 2 - 3, z), V(w, h, d)]);
    for (const side of [-1, 1]) {
      const x = side < 0 ? L.pathX[0] - 22 : L.pathX[1] + 22;
      for (let z = H.z0 + 90; z < 1400; z += 120) if (Math.abs(z + 50 - 730) > 70) hedge(x, z + 50, 14, 100, 40);
      for (let z = H.z1 - 90; z > -2200; z -= 120) hedge(x, z - 50, 14, 100, 40);
    }
    for (let x = -1180; x < 1280; x += 140) if (x + 120 < L.pathX[0] - 30 || x > L.pathX[1] + 30) { hedge(x + 60, 680, 110, 14, 36); hedge(x + 60, 780, 110, 14, 36); }
    const hm = new THREE.InstancedMesh(hedgeGeo, this.ext({ color: '#ffffff' }, 'foliage'), hedges.length);
    hedges.forEach(([p, s], i) => { hm.setMatrixAt(i, new THREE.Matrix4().compose(p, new THREE.Quaternion(), s)); hm.setColorAt(i, c.setHSL(0.26 + r.range(-0.02, 0.02), 0.45, r.range(0.2, 0.26))); });
    g.add(hm);
    const cone = (() => { const cg = new THREE.ConeGeometry(1, 1, 14, 6); cg.translate(0, 0.5, 0); const p = cg.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); const k = 1 + noise1(p.getX(i) * 9 + p.getZ(i) * 7 + y * 5, 1) * 0.08; p.setXYZ(i, p.getX(i) * k, y, p.getZ(i) * k); } cg.computeVertexNormals(); return cg; })();
    const topi = [];
    for (const z of [H.z0 + 60, H.z0 + 540, H.z1 - 60]) for (const x of [L.pathX[0] - 34, L.pathX[1] + 34]) topi.push(V(x, -3, z));
    for (const x of [H.x0 - 70, H.x1 + 70]) for (const z of [H.z0 + 10, H.z1 - 10]) topi.push(V(x, -3, z));
    const tm = new THREE.InstancedMesh(cone, this.ext({ color: '#3a5c2c' }, 'foliage'), topi.length);
    topi.forEach((p, i) => { const s = r.range(0.9, 1.2); tm.setMatrixAt(i, new THREE.Matrix4().compose(p, new THREE.Quaternion(), V(24 * s, 120 * s, 24 * s))); });
    g.add(tm);
    // a brick garden wall well out, with piers and stone copings
    const brick = this.ext({ map: this._brickTexture(), color: '#ffffff' });
    const coping = this.ext({ color: '#b9ae98' });
    const wallLen = (x0, z0, x1, z1) => {
      const len = Math.hypot(x1 - x0, z1 - z0);
      const ang = -Math.atan2(z1 - z0, x1 - x0);
      const geo = new THREE.BoxGeometry(len, 210, 24);
      const uv = geo.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * len / 200, uv.getY(i) * 210 / 200);
      const m = new THREE.Mesh(geo, brick);
      m.position.set((x0 + x1) / 2, 102, (z0 + z1) / 2);
      m.rotation.y = ang;
      g.add(m);
      const cp = new THREE.Mesh(new THREE.BoxGeometry(len, 10, 34), coping);
      cp.position.set((x0 + x1) / 2, 210, (z0 + z1) / 2);
      cp.rotation.y = ang;
      g.add(cp);
      const n = Math.floor(len / 260);
      const pm = new THREE.InstancedMesh(new THREE.BoxGeometry(40, 240, 40), brick, n + 1);
      const pc = new THREE.InstancedMesh(new THREE.BoxGeometry(52, 14, 52), coping, n + 1);
      for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n), z = lerp(z0, z1, i / n); pm.setMatrixAt(i, new THREE.Matrix4().makeTranslation(x, 117, z)); pc.setMatrixAt(i, new THREE.Matrix4().makeTranslation(x, 243, z)); }
      g.add(pm, pc);
    };
    const WX0 = -1650, WX1 = 1750, WZ0 = 1800, WZ1 = -2700;
    wallLen(WX0, WZ0, L.pathX[0] - 40, WZ0); wallLen(L.pathX[1] + 40, WZ0, WX1, WZ0);
    wallLen(WX0, WZ1, WX1, WZ1);
    wallLen(WX0, WZ0, WX0, WZ1); wallLen(WX1, WZ0, WX1, WZ1);
    this._trees(r);
    // hills on the horizon, two ranges
    for (const [R0, R1, hMin, hMax, hue, light, seed] of [[3600, 4600, 140, 560, 0.2, 0.3, 1], [5200, 6800, 320, 1150, 0.28, 0.34, 7]]) {
      const seg = 180;
      const pos = [], col = [], idx = [];
      for (let i = 0; i <= seg; i++) {
        const a = (i / seg) * TAU;
        const h = hMin + (hMax - hMin) * (0.5 + 0.5 * (fbm1(a * 3.1 + seed, seed, 4) * 1.4));
        for (let k = 0; k < 4; k++) {
          const rr = lerp(R0, R1, k / 3);
          const y = k === 0 ? -20 : k === 3 ? h * 0.35 : h * (k === 1 ? 0.75 : 1);
          pos.push(XC + Math.sin(a) * rr, y, -300 + Math.cos(a) * rr);
          c.setHSL(hue + fbm1(a * 7, seed + 2) * 0.04, 0.35, light * (k === 0 ? 0.8 : 1));
          col.push(c.r, c.g, c.b);
        }
      }
      for (let i = 0; i < seg; i++) for (let k = 0; k < 3; k++) { const a = i * 4 + k, b = a + 4; idx.push(a, a + 1, b, b, a + 1, b + 1); }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      const hill = new THREE.Mesh(geo, this.ext({ vertexColors: true, side: THREE.DoubleSide }, 'foliage'));
      hill.frustumCulled = false;
      g.add(hill);
    }
  }

  _lawnTexture() {
    const s = 256;
    const cv = document.createElement('canvas');
    cv.width = cv.height = s;
    const x = cv.getContext('2d');
    x.fillStyle = '#c8c8c8';
    x.fillRect(0, 0, s, s);
    const r = new RNG('lawn');
    for (let i = 0; i < 3200; i++) {
      const v = r.range(140, 255) | 0;
      x.fillStyle = `rgba(${v},${v},${v},0.4)`;
      x.fillRect(r.range(0, s), r.range(0, s), 1, r.range(2, 6));
    }
    const t = new THREE.CanvasTexture(cv);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(260, 260);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }

  _brickTexture() {
    const W = 256, Hh = 256;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = Hh;
    const x = cv.getContext('2d');
    x.fillStyle = '#b9ad98';
    x.fillRect(0, 0, W, Hh);
    const r = new RNG('brick');
    const bh = Hh / 12, bw = W / 4;
    for (let row = 0; row < 12; row++) {
      for (let col = -1; col < 5; col++) {
        const ox = (row % 2) * bw * 0.5;
        const hue = r.range(8, 20), sat = r.range(35, 55), lig = r.range(30, 44);
        x.fillStyle = `hsl(${hue}, ${sat}%, ${lig}%)`;
        x.fillRect(col * bw + ox + 1.5, row * bh + 1.5, bw - 3, bh - 3);
      }
    }
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(0,0,0,${r.range(0.02, 0.08)})`; x.fillRect(r.range(0, W), r.range(0, Hh), r.range(1, 4), r.range(1, 3)); }
    const t = new THREE.CanvasTexture(cv);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }

  _roundedBox(w, h, d, rad) {
    const geo = new THREE.BoxGeometry(w, h, d, 4, 4, 4);
    const p = geo.attributes.position;
    const v = V();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const n = 1 + noise1(v.x * 9 + v.z * 7, 3) * 0.06 + noise1(v.y * 8 + v.x * 3, 4) * 0.05;
      const k = (a, b) => Math.sign(a) * Math.min(Math.abs(a), b);
      v.set(k(v.x, w / 2 - rad * 0.3) * n, k(v.y, h / 2) * n, k(v.z, d / 2 - rad * 0.3) * n);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  _trees(r) {
    const g = this.group;
    const c = new THREE.Color();
    // deciduous canopy: a dozen lumpy clumps, darker underneath (vertex AO)
    const blob = (detail, seed) => {
      const rr = new RNG('tree' + seed);
      const parts = [];
      const lumps = [[0, 0.58, 0, 0.3]];
      for (let i = 0; i < 11; i++) {
        const a = rr.range(0, TAU), el = rr.range(-0.55, 1.0), d = rr.range(0.16, 0.27);
        lumps.push([Math.cos(a) * Math.cos(el) * d, 0.55 + Math.sin(el) * d * 0.9, Math.sin(a) * Math.cos(el) * d, rr.range(0.13, 0.21)]);
      }
      for (const [x, y, z, s] of lumps) {
        const sp = new THREE.IcosahedronGeometry(s, detail);
        const p = sp.attributes.position;
        for (let i = 0; i < p.count; i++) { const k = 1 + noise1(p.getX(i) * 31 + p.getY(i) * 17 + x * 50 + seed, 2) * 0.14; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k); }
        sp.translate(x, y, z);
        parts.push(sp.index ? sp.toNonIndexed() : sp);
      }
      const m = mergeGeometries(parts);
      m.computeVertexNormals();
      const p = m.attributes.position;
      const ao = new Float32Array(p.count * 3);
      for (let i = 0; i < p.count; i++) { const k = 0.45 + 0.55 * clamp((p.getY(i) - 0.35) / 0.55); ao.set([k, k, k], i * 3); }
      m.setAttribute('color', new THREE.BufferAttribute(ao, 3));
      return m;
    };
    const poplar = (() => { const s = new THREE.IcosahedronGeometry(0.12, 2); s.scale(1, 3.4, 1); s.translate(0, 0.62, 0); const p = s.attributes.position; for (let i = 0; i < p.count; i++) { const k = 1 + noise1(p.getY(i) * 40 + p.getX(i) * 20, 5) * 0.1; p.setXYZ(i, p.getX(i) * k, p.getY(i), p.getZ(i) * k); } s.computeVertexNormals(); const ao = new Float32Array(p.count * 3).fill(1); for (let i = 0; i < p.count; i++) { const k = 0.6 + 0.4 * clamp((p.getY(i) - 0.25) / 0.7); ao.set([k, k, k], i * 3); } s.setAttribute('color', new THREE.BufferAttribute(ao, 3)); return s; })();
    const trunk = new THREE.CylinderGeometry(0.009, 0.02, 0.5, 7);
    trunk.translate(0, 0.25, 0);
    const kinds = [
      { geo: blob(this.low ? 0 : 1, 1), list: [], hue: 0.22 },
      { geo: blob(this.low ? 0 : 1, 2), list: [], hue: 0.25 },
      { geo: poplar, list: [], hue: 0.2 },
    ];
    const trunks = [];
    const place = (x, z, s, kind) => {
      kinds[kind].list.push([V(x, -6, z), s]);
      if (kind !== 2) trunks.push([V(x, -6, z), s]);
    };
    // specimen trees on the lawns either side of the house
    for (let i = 0; i < (this.low ? 20 : 34); i++) {
      const side = i % 2 ? 1 : -1;
      const x = side < 0 ? r.range(-1150, H.x0 - 520) : r.range(H.x1 + 520, 1250);
      const z = r.range(-2200, 1400);
      place(x, z, r.range(650, 1100), r.chance(0.75) ? (r.chance(0.5) ? 0 : 1) : 2);
    }
    // poplars along the walks beyond the ends, an avenue of limes beyond the far end
    for (let z = H.z0 + 380; z < 1400; z += 200) for (const x of [L.pathX[0] - 90, L.pathX[1] + 90]) place(x + r.range(-10, 10), z, r.range(1100, 1300), 2);
    for (let z = H.z1 - 900; z > -2200; z -= 220) for (const x of [L.pathX[0] - 130, L.pathX[1] + 130]) place(x + r.range(-15, 15), z, r.range(700, 1000), 0);
    // woods beyond the wall
    for (let i = 0; i < (this.low ? 100 : 230); i++) {
      const a = r.range(0, TAU);
      const rr = r.range(2100, 3400);
      const x = XC + Math.sin(a) * rr * 1.1, z = -300 + Math.cos(a) * rr * 1.35;
      place(x, z, r.range(1100, 2300), r.chance(0.5) ? 0 : 1);
    }
    for (const k of kinds) {
      const im = new THREE.InstancedMesh(k.geo, this.ext({ color: '#ffffff', vertexColors: true }, 'foliage'), k.list.length);
      k.list.forEach(([p, s], i) => {
        im.setMatrixAt(i, new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), r.range(0, TAU)), V(s * r.range(0.85, 1.15), s * r.range(0.9, 1.1), s * r.range(0.85, 1.15))));
        im.setColorAt(i, c.setHSL(k.hue + r.range(-0.03, 0.03), r.range(0.38, 0.5), r.range(0.2, 0.28)));
      });
      im.computeBoundingSphere();
      g.add(im);
    }
    const tm = new THREE.InstancedMesh(trunk, this.ext({ color: '#5a4836' }), trunks.length);
    trunks.forEach(([p, s], i) => tm.setMatrixAt(i, new THREE.Matrix4().compose(p, new THREE.Quaternion(), V(s, s, s))));
    tm.computeBoundingSphere();
    g.add(tm);
  }

  update(t, ctx) {
    // haze tracks the sky's horizon colour; denser at night
    const d = ctx.dawn;
    const night = new THREE.Color(0.018, 0.06, 0.07), day = new THREE.Color(0.92, 0.6, 0.3);
    this.haze.uHaze.value.copy(night).lerp(day, d).multiplyScalar(lerp(1.0, 0.85, d));
    this.haze.uHazeDensity.value = lerp(0.00042, 0.00026, sseg(d, 0, 1));
  }
}
