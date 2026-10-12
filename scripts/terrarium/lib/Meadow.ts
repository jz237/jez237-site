import * as THREE from 'three';
import {TANK} from './Case';
import {WATER_LEVEL, fbm, poolDistance, caveKeepClear} from './Ground';
import {Surface, SurfaceKind} from './Surface';
import {addFoliage} from './Foliage';
import {mulberry32} from './Textures';

const SEG = 5;

/**
 * Fine grass and sedge blades in clumps across the open soil, the shore and
 * the front of the case. Every vertex reads the wind field where it stands,
 * so a stroke of the wind tool parts the meadow along its path and gusts run
 * through it in waves; the lizard and the hand push through it.
 */
export class Meadow {
  readonly mesh: THREE.Mesh;
  blades = 0;

  constructor(surface: Surface, tufts = 720, avoid: {x: number; z: number; r: number}[] = []) {
    const rnd = mulberry32(777);
    const pos: number[] = [], nrm: number[] = [], col: number[] = [], flex: number[] = [], phase: number[] = [], uv: number[] = [], root: number[] = [], idx: number[] = [];
    const up = new THREE.Vector3(0, 1, 0);
    const c = new THREE.Color(), tip = new THREE.Color();
    let placed = 0;
    for (let tries = 0; tries < 40000 && placed < tufts; tries++) {
      const x = (rnd() - 0.5) * (TANK.w - 0.03), z = (rnd() - 0.5) * (TANK.d - 0.03);
      if (surface.kindAt(x, z) !== SurfaceKind.Ground || caveKeepClear(x, z)) continue;
      if (avoid.some((o) => Math.hypot(x - o.x, z - o.z) < o.r)) continue;
      const y = surface.heightAt(x, z);
      const pd = poolDistance(x, z);
      if (y < WATER_LEVEL + 0.004 || pd < 0.02) continue;
      if (surface.normalAt(x, z).y < 0.78) continue;
      // patches, a fringe along the shore and a band at the front glass
      const patch = THREE.MathUtils.smoothstep(fbm(x * 7 + 11, z * 7 - 3), 0.45, 0.68);
      const shore = pd < 0.16 ? 0.7 : 0;
      // (the front-left corner is given over to big leaves, ferns and moss)
      const corner = Math.exp(-(((x + 0.42) / 0.19) ** 2) - (((z - 0.17) / 0.09) ** 2));
      const front = z > 0.13 ? 0.45 * (1 - corner) : 0;
      if (rnd() > Math.max(patch * (1 - 0.95 * corner), shore, front) * 0.9 + 0.03 * (1 - corner)) continue;
      placed++;
      const n = 6 + Math.floor(rnd() * 9);
      const tuftH = 0.016 + rnd() * 0.026;
      const dryTuft = rnd() < 0.12;
      for (let b = 0; b < n; b++) {
        const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 0.006;
        const bx = x + Math.cos(a) * r, bz = z + Math.sin(a) * r;
        const by = surface.heightAt(bx, bz) - 0.0015;
        const h = tuftH * (0.6 + rnd() * 0.6);
        const w = 0.0011 + rnd() * 0.0011;
        // blades fan out from the clump and arch over
        const leanA = a + (rnd() - 0.5) * 0.8;
        const lean = 0.12 + rnd() * 0.45, arch = 0.1 + rnd() * 0.5;
        const ld = new THREE.Vector3(Math.cos(leanA), 0, Math.sin(leanA));
        const side = new THREE.Vector3(-ld.z, 0, ld.x);
        const twist = (rnd() - 0.5) * 1.2;
        const dry = dryTuft ? rnd() < 0.7 : rnd() < 0.06;
        c.setHSL(dry ? 0.09 + rnd() * 0.03 : 0.2 + rnd() * 0.07, dry ? 0.4 : 0.6 + rnd() * 0.2, dry ? 0.12 + rnd() * 0.06 : 0.045 + rnd() * 0.04);
        tip.copy(c).offsetHSL(dry ? 0 : -0.04, 0, dry ? 0.06 : 0.06);
        const ph = rnd() * 40;
        const base = pos.length / 3;
        for (let i = 0; i <= SEG; i++) {
          const t = i / SEG;
          const off = ld.clone().multiplyScalar(h * (Math.sin(lean) * t + arch * t * t));
          const yy = by + h * t * Math.cos(lean) - arch * 0.55 * h * t * t;
          const sd = side.clone().applyAxisAngle(up, twist * t);
          const half = w * 0.5 * (1 - Math.pow(t, 1.4) * 0.92);
          const tangent = ld.clone().multiplyScalar(Math.sin(lean) + 2 * arch * t).setY(Math.cos(lean) - 1.1 * arch * t).normalize();
          const nn = new THREE.Vector3().crossVectors(sd, tangent).normalize();
          if (nn.y < 0) nn.negate();
          nn.lerp(up, 0.35).normalize();
          for (const sgn of [-1, 1]) {
            pos.push(bx + off.x + sd.x * half * sgn, yy, bz + off.z + sd.z * half * sgn);
            nrm.push(nn.x, nn.y, nn.z);
            // darker down in the clump, paler towards the tip
            const k = 0.45 + 0.55 * Math.min(1, t * 1.6);
            col.push((c.r + (tip.r - c.r) * t) * k, (c.g + (tip.g - c.g) * t) * k, (c.b + (tip.b - c.b) * t) * k);
            flex.push(t);
            phase.push(ph);
            root.push(bx, by, bz);
            uv.push(t, sgn < 0 ? 0 : 1);
          }
          if (i < SEG) {
            const q = base + i * 2;
            idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2);
          }
        }
        this.blades++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setAttribute('aFlex', new THREE.Float32BufferAttribute(flex, 1));
    g.setAttribute('aPhase', new THREE.Float32BufferAttribute(phase, 1));
    g.setAttribute('aRoot', new THREE.Float32BufferAttribute(root, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeBoundingSphere();
    const m = new THREE.MeshStandardMaterial({vertexColors: true, side: THREE.DoubleSide, roughness: 0.7});
    addFoliage(m, {flexAttr: true, phaseAttr: true, rootAttr: true, height: 0.03, translucency: 0.45, stiffness: 0.8, key: 'meadow'});
    // up close each blade is folded along its keel, with fine veins running its length
    const base = m.onBeforeCompile;
    m.onBeforeCompile = (s, r) => {
      base(s, r);
      s.vertexShader = s.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vBladeUv;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBladeUv = uv;');
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vBladeUv;')
        .replace('#include <color_fragment>', `#include <color_fragment>
{
  float across = vBladeUv.y * 2.0 - 1.0;
  float vein = folLine(vBladeUv.y * 4.0, 0.08, fwidth(vBladeUv.y) * 4.0);
  diffuseColor.rgb *= 1.0 + 0.16 * vein + 0.1 * (1.0 - abs(across));
  folRelief += 0.035 * (1.0 - abs(across)) + 0.01 * vein;
}`);
    };
    m.customProgramCacheKey = () => 'meadow-v3';
    this.mesh = new THREE.Mesh(g, m);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = false;
    this.mesh.name = 'meadow';
  }
}
