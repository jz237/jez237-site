// APX-9 head: neck ruff. A short, soft golden fur collar rooted on the rear of the skull around the neck socket; its strands comb
// back and in over the neck joint so the bearing stack is only partly visible, as in the reference photo.
// Two populations make one kit-fur mesh (layer 2): (A) the occipital surface just outside the socket edge, thinning outwards and
// kept clear of the eye rims; (B) a cuff of roots in the narrow gap right at the socket lip, combed straight back over the joint.
// The pick proxy is a thin ring hull that starts outside r = 2.03, so the neck joint (r <= 2.0) stays pickable.
import * as THREE from 'three';
import { revolve } from '../geo.js';
import { K } from '../skeleton.js';
import { HC, HR, contour3 } from './head-util.js';

const TAU = Math.PI * 2;
const NA = K.neck.c.toArray();                    // neck axis: along +X through (y, z) = (0.2, 0)
const R_IN = 2.24, R_OUT = 3.02;                  // population A: radial range on the skull about the neck axis (mm)
const EYE_LO = 0.95, EYE_HI = 1.5;                // distance to the eye contour: no roots below LO (rim), full density above HI
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/** rear surface point (bee space) and outward normal of the skull ellipsoid at radius rr / azimuth phi about the neck axis */
function skull(rr, phi) {
  const y = NA[1] + rr * Math.sin(phi), z = rr * Math.cos(phi);
  const q = 1 - ((y - HC[1]) / HR[1]) ** 2 - ((z - HC[2]) / HR[2]) ** 2;
  if (q <= 0.02) return null;
  const x = HC[0] - HR[0] * Math.sqrt(q);
  const n = new THREE.Vector3((x - HC[0]) / (HR[0] * HR[0]), (y - HC[1]) / (HR[1] * HR[1]), (z - HC[2]) / (HR[2] * HR[2])).normalize();
  return { p: new THREE.Vector3(x, y, z), n };
}
/** x of the skull surface at radius rr (about the neck axis), averaged over azimuth: used for the pick hull */
const skullX = (rr) => HC[0] - HR[0] * Math.sqrt(Math.max(0, 1 - (rr / ((HR[1] + HR[2]) / 2)) ** 2));

export function buildRuff(ctx, shell) {
  const { Q, ex } = ctx;
  const part = shell.part('neck-ruff', {
    name: 'Neck Ruff', tag: 'shell', explode: ex([-4.5, 0.3, 0], 'mid'),
    info: 'Short soft golden fur collar on the rear of the skull; the strands comb back over the neck joint and blend the head into the thorax fur.',
    specs: { Material: 'Fine synthetic gold filament, 0.7 to 1.1 mm' },
  });

  /* ------------------------------------------------------------------ strands */
  const eyes = [contour3(1, 96), contour3(-1, 96)];
  const eyeDist = (p) => {
    let m = 1e9;
    for (const c of eyes) for (const q of c) { const d = (p.x - q[0]) ** 2 + (p.y - q[1]) ** 2 + (p.z - q[2]) ** 2; if (d < m) m = d; }
    return Math.sqrt(m);
  };
  const dark = new THREE.Color('#b8730a');
  const radial = new THREE.Vector3(), tang = new THREE.Vector3(), flow = new THREE.Vector3(), nrm = new THREE.Vector3(), pos = new THREE.Vector3();
  const BACK = new THREE.Vector3(-1, 0, 0);
  const sample = (r) => {
    const phi = r() * TAU;
    radial.set(0, Math.sin(phi), Math.cos(phi));
    tang.set(0, Math.cos(phi), -Math.sin(phi));          // direction of increasing azimuth (swirl)
    const k = r();
    let out;
    if (k < 0.33) {
      // B: cuff in the socket gap. B1 = short dense fuzz, B2 = a few longer wisps; both lie back over the bearing and curl in
      const wisp = k < 0.04;
      const rr = (wisp ? 2.0 : 1.99) + (wisp ? 0.25 : 0.2) * r();
      pos.set((wisp ? 7.7 : 7.8) + 0.4 * r(), NA[1] + rr * radial.y, rr * radial.z);
      nrm.copy(radial).multiplyScalar(0.7).addScaledVector(BACK, 0.72).normalize();
      flow.copy(BACK).addScaledVector(radial, -0.3).addScaledVector(tang, (r() - 0.5) * 0.7).normalize();
      out = { p: pos.clone(), n: nrm.clone(), t: flow.clone(), l: wisp ? 1.3 : 0.9 + 0.25 * r(), w: wisp ? 0.8 : 1.0 };
    } else {
      // A: skull surface outside the socket edge, denser at the edge, absent near the eye rims; combed back and in with a slight swirl
      const rr = R_IN + (R_OUT - R_IN) * Math.pow(r(), 1.6);
      const s = skull(rr, phi);
      if (!s) return null;
      if (r() > sstep(EYE_LO, EYE_HI, eyeDist(s.p))) return null;
      flow.set(-0.8, -0.6 * radial.y, -0.6 * radial.z).addScaledVector(tang, (r() - 0.5) * 0.5);
      flow.addScaledVector(s.n, -flow.dot(s.n)).normalize();
      out = { p: s.p, n: s.n, t: flow.clone(), l: 1.0 - 0.35 * sstep(R_IN, R_OUT, rr) };
    }
    if (r() < 0.1) out.c = [dark.r, dark.g, dark.b];
    return out;
  };

  const fk = Q.fur > 0 ? 1 / Math.sqrt(Math.max(0.2, Q.fur)) : 1;     // thinner tiers get slightly fatter hairs
  const count = Math.round(8000 * Q.fur);
  if (count > 0) {
    const mesh = ctx.makeFur({
      seed: 8131, count, sample, length: 0.42, lengthJitter: 0.3, width: 0.042 * fk, bend: 0.6, lean: 0.6, segments: 3,
      colors: { a: '#ffd23a', b: '#e8a010' }, rootDark: 0.3,
    });
    mesh.material = furMaterial();
    part.addMesh(mesh, { layers: [2], cast: false, receive: false, pick: false });
  }

  /* ------------------------------------------------------------------ pick proxy: ring hull over the strand cloud, outside the neck sleeve */
  const prof = [[2.03, 7.02], [2.52, 7.02]];
  for (let rr = 2.52; rr <= 3.06; rr += 0.18) prof.push([rr, Math.max(7.6 + (rr - 2.52) * 1.5, skullX(rr) - 0.55)]);
  prof.push([3.06, skullX(3.06)]);
  for (let rr = 2.88; rr >= 2.26; rr -= 0.18) prof.push([rr, skullX(rr)]);
  prof.push([2.03, skullX(2.26)], [2.03, 7.02]);
  part.idProxy(revolve(prof, { axis: 'x', segments: 40, steps: 1, creaseDeg: 80 }), [0, NA[1], 0]);
  return part;
}

/** warm golden fur material (M.fur's cream sheen washes gold out), same single-shading-normal patch as the kit fur */
let mat = null;
function furMaterial() {
  if (mat) return mat;
  mat = new THREE.MeshPhysicalMaterial({
    name: 'neck ruff gold', color: 0xffffff, vertexColors: true, metalness: 0, roughness: 0.8, side: THREE.DoubleSide,
    sheen: 0.5, sheenColor: new THREE.Color('#ffc43a'), sheenRoughness: 0.55,
  });
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_begin>', THREE.ShaderChunk.normal_fragment_begin.replace('normal *= faceDirection;', ''));
  };
  mat.customProgramCacheKey = () => 'apx-head-ruff-v1';
  return mat;
}
