import * as THREE from 'three';

// 2D shape helpers and parametric surfaces (petals, leaves, wings).

// Convex hull of a set of circles → THREE.Shape. Used for watch bridges.
export function hullShape(circles, samples = 40) {
  const pts = [];
  for (const [x, y, r] of circles) {
    for (let i = 0; i < samples; i++) {
      const a = (i / samples) * Math.PI * 2;
      pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
    }
  }
  pts.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
  const shape = new THREE.Shape();
  hull.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
  shape.closePath();
  return shape;
}

export function circleHole(x, y, r, steps = 24) {
  const p = new THREE.Path();
  for (let i = 0; i <= steps; i++) {
    const a = -(i / steps) * Math.PI * 2;
    const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
    i === 0 ? p.moveTo(px, py) : p.lineTo(px, py);
  }
  return p;
}

// Extrude a 2D shape (in XY) into a plate lying in XZ with its top face at y=0
// and thickness going downward. Shape +Y maps to world -Z (so 2D layouts read
// naturally when viewed from above).
export function plateGeometry(shape, thickness, bevel = 0.02) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 10,
  });
  g.rotateX(-Math.PI / 2); // extrusion (+Z) → +Y, shape Y → -Z
  g.translate(0, -thickness, 0);
  return g;
}

// Sway attributes (see world/wind.js) for a two-sided surface grown from a
// pivot at the origin: bend flex and flutter rise toward the tip; the back
// face's flutter weight is negated (its normals are), so both faces move as one.
export function swayAttrs(geo, front, uAt, flex = 1.4) {
  const n = geo.attributes.position.count;
  const P = new Float32Array(n * 3), W = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const u = Math.max(0, Math.min(1, uAt(i)));
    W[i * 4] = Math.pow(u, flex);
    W[i * 4 + 1] = Math.min(1, u * 1.5) * (i >= front ? -1 : 1);
  }
  geo.setAttribute('aSwayP', new THREE.BufferAttribute(P, 3));
  geo.setAttribute('aSwayW', new THREE.BufferAttribute(W, 4));
  return geo;
}

// Parametric petal surface with thickness.
// Local frame: hinge along X at the origin, petal grows along +Y,
// +Z is the outer (convex) side. Returns { geometry, edge: Vector3[] }.
export function petalGeometry({
  length = 5,
  width = 2.6,
  cup = 0.5, // edges curl toward -Z (inner side)
  curl = 0.4, // tip curls toward -Z along the length
  ridge = 0.06, // central keel
  thickness = 0.06,
  tip = 0.35, // tip pointedness 0 round … 1 sharp
  segU = 28,
  segV = 16,
  baseWidth = 0.35,
  u0 = 0, // generate only the part of the petal between u0 and u1; the
  u1 = 1, // geometry is re-centred so its pivot (u0, centre) is at the origin
}) {
  const pos = [];
  const nrm = [];
  const uvs = [];
  const idx = [];
  const P0 = (u, v) => {
    // spoon profile: narrow claw at the hinge, broad blade widest near 65%,
    // softly pointed tip (superellipse with a sharper exponent past the middle)
    const us = Math.pow(u, 1.6);
    const p = us < 0.5 ? 2.4 : 2.4 - tip * 1.1;
    const blade = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * us - 1), p)), 1 / p);
    const w = width * 0.5 * Math.max(blade, baseWidth * (1 - u * 2.2), 0.0);
    const x = v * w;
    const y = u * length;
    const z = -cup * (v * v) * (0.4 + 0.6 * Math.sin(Math.PI * Math.min(1, u * 1.1))) - curl * u * u * length * 0.25 + ridge * (1 - Math.abs(v)) * Math.sin(Math.PI * u);
    return new THREE.Vector3(x, y, z);
  };
  const pivot = P0(u0, 0);
  const P = (u, v) => P0(u, v).sub(pivot);
  const front = [];
  for (let i = 0; i <= segU; i++) {
    const u = u0 + (u1 - u0) * (i / segU);
    for (let j = 0; j <= segV; j++) {
      const v = (j / segV) * 2 - 1;
      front.push(P(u, v));
      uvs.push(u, j / segV);
    }
  }
  // normals by finite differences
  const cols = segV + 1;
  const normals = [];
  for (let i = 0; i <= segU; i++) {
    for (let j = 0; j <= segV; j++) {
      const a = front[Math.min(segU, i + 1) * cols + j].clone().sub(front[Math.max(0, i - 1) * cols + j]);
      const b = front[i * cols + Math.min(segV, j + 1)].clone().sub(front[i * cols + Math.max(0, j - 1)]);
      const n = new THREE.Vector3().crossVectors(b, a).normalize();
      if (n.lengthSq() < 0.5) n.set(0, 0, 1);
      normals.push(n);
    }
  }
  // outer surface (+Z side)
  for (let k = 0; k < front.length; k++) {
    const p = front[k], n = normals[k];
    pos.push(p.x + n.x * thickness * 0.5, p.y + n.y * thickness * 0.5, p.z + n.z * thickness * 0.5);
    nrm.push(n.x, n.y, n.z);
  }
  // inner surface (-Z side)
  const off = front.length;
  for (let k = 0; k < front.length; k++) {
    const p = front[k], n = normals[k];
    pos.push(p.x - n.x * thickness * 0.5, p.y - n.y * thickness * 0.5, p.z - n.z * thickness * 0.5);
    nrm.push(-n.x, -n.y, -n.z);
  }
  for (let k = 0; k < off; k++) uvs.push(uvs[k * 2], uvs[k * 2 + 1]);
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * cols + j, b = a + 1, c = a + cols, d = c + 1;
      idx.push(a, b, d, a, d, c); // outer
      idx.push(off + a, off + d, off + b, off + a, off + c, off + d); // inner (flipped)
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  swayAttrs(geo, off, (k) => (uvs[k * 2] - u0) / Math.max(1e-6, u1 - u0));
  // edge loop for the gilded rim: up the left side, over the tip, down the right
  const edge = [];
  for (let i = 0; i <= segU; i++) edge.push(front[i * cols + 0]);
  for (let i = segU; i >= 0; i--) edge.push(front[i * cols + segV]);
  // keel line along the centre (outer side)
  const keel = [];
  for (let i = 0; i <= segU; i++) {
    const p = front[i * cols + (segV >> 1)];
    const n = normals[i * cols + (segV >> 1)];
    keel.push(p.clone().addScaledVector(n, thickness * 0.6));
  }
  return { geometry: geo, edge, keel, sample: P };
}

// Leaf surface: like a petal but longer, with a centre fold and wavy margin.
export function leafGeometry({ length = 8, width = 3, fold = 0.5, arch = 0.6, wave = 0.12, segU = 30, segV = 12, thickness = 0.03 }) {
  const pos = [], nrm = [], uvs = [], idx = [];
  const cols = segV + 1;
  const pts = [];
  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    for (let j = 0; j <= segV; j++) {
      const v = (j / segV) * 2 - 1;
      const w = width * 0.5 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.8)), 0.9) * (u < 0.04 ? 0.3 : 1);
      const x = v * w;
      const y = u * length;
      const z = fold * Math.abs(v) * w * 0.5 + arch * Math.sin(u * Math.PI * 0.9) * length * 0.12 - arch * u * u * length * 0.18 + wave * Math.sin(u * 22 + v * 3) * Math.abs(v);
      pts.push(new THREE.Vector3(x, y, z));
      uvs.push(u, j / segV);
    }
  }
  const normals = [];
  for (let i = 0; i <= segU; i++) {
    for (let j = 0; j <= segV; j++) {
      const a = pts[Math.min(segU, i + 1) * cols + j].clone().sub(pts[Math.max(0, i - 1) * cols + j]);
      const b = pts[i * cols + Math.min(segV, j + 1)].clone().sub(pts[i * cols + Math.max(0, j - 1)]);
      const n = new THREE.Vector3().crossVectors(b, a).normalize();
      if (!isFinite(n.x) || n.lengthSq() < 0.5) n.set(0, 0, 1);
      normals.push(n);
    }
  }
  for (let k = 0; k < pts.length; k++) {
    const p = pts[k], n = normals[k];
    pos.push(p.x + n.x * thickness, p.y + n.y * thickness, p.z + n.z * thickness);
    nrm.push(n.x, n.y, n.z);
  }
  const off = pts.length;
  for (let k = 0; k < pts.length; k++) {
    const p = pts[k], n = normals[k];
    pos.push(p.x - n.x * thickness, p.y - n.y * thickness, p.z - n.z * thickness);
    nrm.push(-n.x, -n.y, -n.z);
    uvs.push(uvs[k * 2], uvs[k * 2 + 1]);
  }
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * cols + j, b = a + 1, c = a + cols, d = c + 1;
      idx.push(a, b, d, a, d, c);
      idx.push(off + a, off + d, off + b, off + a, off + c, off + d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  swayAttrs(geo, off, (k) => uvs[k * 2]);
  const midrib = [];
  for (let i = 0; i <= segU; i++) midrib.push(pts[i * cols + (segV >> 1)]);
  const edge = [];
  for (let i = 0; i <= segU; i++) edge.push(pts[i * cols]);
  for (let i = segU; i >= 0; i--) edge.push(pts[i * cols + segV]);
  return { geometry: geo, midrib, edge };
}

// Thin tube through points (Catmull-Rom), with optional taper via scaling.
export function tubeThrough(points, radius, tubularSegments = 64, radialSegments = 8, closed = false) {
  const curve = new THREE.CatmullRomCurve3(points, closed, 'centripetal');
  return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed);
}

// Tapered tube: radius varies from r0 to r1 along the curve.
export function taperedTube(curve, r0, r1, tubularSegments = 64, radialSegments = 10) {
  const geo = new THREE.TubeGeometry(curve, tubularSegments, 1, radialSegments, false);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const p = new THREE.Vector3();
  for (let i = 0; i <= tubularSegments; i++) {
    const k = i / tubularSegments;
    const r = r0 + (r1 - r0) * k;
    const c = curve.getPointAt(k);
    for (let j = 0; j <= radialSegments; j++) {
      const vi = i * (radialSegments + 1) + j;
      p.fromBufferAttribute(pos, vi).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(vi, p.x, p.y, p.z);
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}
