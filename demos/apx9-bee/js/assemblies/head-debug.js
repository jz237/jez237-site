// head-debug.js - scratch stand-ins for the neighbours of the head (eye domes + orbital rims, antenna stubs, thorax collar).
// Loaded only through ?demo=head-debug while iterating; it is not part of the deliverable and is never imported by head.js.
import * as THREE from 'three';
import { K, eyeContour } from '../skeleton.js';
import { revolve } from '../geo.js';

const flip = (g) => { const i = g.index; if (i) for (let k = 0; k < i.count; k += 3) { const t = i.array[k + 1]; i.array[k + 1] = i.array[k + 2]; i.array[k + 2] = t; } return g; };

export async function build(ctx) {
  const { bee, M } = ctx;
  const P = new URLSearchParams(location.search);
  const dbg = bee.part('debug-proxies', { name: 'Debug proxies', group: 'head-shell', info: 'Scratch stand-ins for the eye domes, rims, antennae and thorax collar while the head is built alone.' });
  const h = K.head, e = K.head.eyeR;
  const yellow = new THREE.MeshStandardMaterial({ color: 0xf0a800, roughness: 0.35, metalness: 0.1, side: THREE.DoubleSide });
  const eyeGeo = () => {
    const g = new THREE.SphereGeometry(1, 64, 48);
    g.scale(e.r.x, e.r.y, e.r.z);
    g.translate(e.c.x, e.c.y, e.c.z);
    return g;
  };
  const mir = (g) => { const c = g.clone(); c.scale(1, 1, -1); return flip(c); };
  const eyeR = dbg.part('eye-r', { name: 'Eye R', info: 'Scratch stand-in for the right compound eye dome of the optics assembly.' });
  eyeR.add(eyeGeo(), M.eye);
  const eyeL = dbg.part('eye-l', { name: 'Eye L', info: 'Scratch stand-in for the left compound eye dome of the optics assembly.' });
  eyeL.add(mir(eyeGeo()), M.eye);
  // orbital rim: lofted chamfered profile following the contour (same section as optics-rim.js, simplified)
  const SEC = [[0.84, -0.14], [0.84, 0.10], [0.74, 0.29], [0.60, 0.40], [0.30, 0.40], [0.12, 0.335], [0.12, -0.14]];
  const rim = () => {
    const pts = eyeContour(160);
    const n = pts.length, m = SEC.length;
    const pos = [], idx = [];
    const ec = new THREE.Vector3(e.c.x, e.c.y, e.c.z);
    for (let i = 0; i < n; i++) {
      const p = pts[i];
      const q = p.clone().sub(new THREE.Vector3(h.c.x, h.c.y, h.c.z));
      const nn = new THREE.Vector3(q.x / (h.r.x * h.r.x), q.y / (h.r.y * h.r.y), q.z / (h.r.z * h.r.z)).normalize();
      const o = p.clone().sub(ec); o.addScaledVector(nn, -o.dot(nn)); o.normalize();
      for (const [a, b] of SEC) pos.push(p.x + o.x * a + nn.x * b, p.y + o.y * a + nn.y * b, p.z + o.z * a + nn.z * b);
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
      const a = i * m + j, b = ((i + 1) % n) * m + j, c = ((i + 1) % n) * m + (j + 1) % m, d = i * m + (j + 1) % m;
      idx.push(a, b, c, a, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  };
  const rimR = dbg.part('rim-r', { name: 'Rim R', info: 'Scratch stand-in for the right orbital rim of the optics assembly.' });
  rimR.add(rim(), yellow);
  const rimL = dbg.part('rim-l', { name: 'Rim L', info: 'Scratch stand-in for the left orbital rim of the optics assembly.' });
  rimL.add(mir(rim()), yellow);
  // antenna stubs
  const ant = (side) => {
    const b = K.head.antennaR.base, d = K.head.antennaR.dir;
    const g = new THREE.CylinderGeometry(0.4, 0.4, 6, 20, 1);
    g.translate(0, 3, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(d.x, d.y, side * d.z));
    g.applyQuaternion(q);
    g.translate(b.x, b.y, side * b.z);
    return g;
  };
  const aR = dbg.part('antenna-r', { name: 'Antenna R', info: 'Scratch stand-in for the right antenna of the optics assembly.' });
  aR.add(ant(1), M.black);
  const aL = dbg.part('antenna-l', { name: 'Antenna L', info: 'Scratch stand-in for the left antenna of the optics assembly.' });
  aL.add(ant(-1), M.black);
  // thorax collar (optional): x 5.6..7.2, inner 2.1, outer 3.0
  if (P.get('collar')) {
    const collar = revolve([[2.1, 5.6, 0.05], [3.0, 5.6, 0.1], [3.0, 7.2, 0.1], [2.1, 7.2, 0.05]], { axis: 'x', segments: 64 });
    const c = dbg.part('collar', { name: 'Collar', info: 'Scratch stand-in for the thorax neck collar of the thorax assembly.' });
    c.add(collar, M.yellowDeep);
  }
}
