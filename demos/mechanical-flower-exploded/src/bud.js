import * as THREE from 'three';
import { ENAMEL, rng } from './materials.js';

// A smooth teardrop for the fully closed bud: two overlapping tiers of pointed enamel petals painted onto one lathe,
// so the closed state reads as one clean overlapped bud instead of flared, intersecting petal geometry.
const R_MAX = 1.75;
const Y0 = -1.9;
const H = 5.4;
const N = 9;
const KINDS = ['leafBlue', 'crimson', 'tealViolet', 'leafBlue', 'crimson', 'tealViolet', 'crimson', 'leafBlue', 'tealViolet'];
const GOLD = '#e6b445';

const profile = (t) => ({ r: Math.max(0.001, R_MAX * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.5)), 0.8)), y: Y0 + H * t });

function drawPetal(g, cx, w, h, tipV, halfW, kind, rand, bump) {
  const base = h;
  const tip = h * (1 - tipV);
  const path = new Path2D();
  const side = (s) => {
    const x = (f) => cx + s * halfW * f;
    return [x(1.0), base, x(1.12), h * 0.55, x(0.55), tip + (base - tip) * 0.2, cx, tip];
  };
  const L = side(-1);
  const R = side(1);
  path.moveTo(L[0], L[1]);
  path.bezierCurveTo(L[2], L[3], L[4], L[5], L[6], L[7]);
  path.bezierCurveTo(R[4], R[5], R[2], R[3], R[0], R[1]);
  path.closePath();

  const pal = ENAMEL[kind];
  if (bump) {
    const gr = g.createLinearGradient(cx - halfW, 0, cx + halfW, 0);
    gr.addColorStop(0, '#303030');
    gr.addColorStop(0.5, '#e0e0e0');
    gr.addColorStop(1, '#303030');
    g.fillStyle = gr;
    g.fill(path);
  } else {
    const gr = g.createLinearGradient(0, base, 0, tip);
    gr.addColorStop(0, pal[0]);
    gr.addColorStop(0.45, pal[1]);
    gr.addColorStop(0.85, pal[2]);
    gr.addColorStop(1, pal[3]);
    g.fillStyle = gr;
    g.fill(path);
    const hl = g.createLinearGradient(cx - halfW, 0, cx + halfW, 0);
    hl.addColorStop(0, 'rgba(0,0,0,0.30)');
    hl.addColorStop(0.42, 'rgba(255,255,255,0.10)');
    hl.addColorStop(0.58, 'rgba(255,255,255,0.10)');
    hl.addColorStop(1, 'rgba(0,0,0,0.30)');
    g.fillStyle = hl;
    g.fill(path);
  }
  g.lineJoin = 'round';
  g.strokeStyle = bump ? '#ffffff' : GOLD;
  g.lineWidth = bump ? 8 : 7;
  g.stroke(path);
  if (!bump) {
    g.save();
    g.translate(cx, tip + (base - tip) * 0.5);
    g.scale(0.86, 0.9);
    g.translate(-cx, -(tip + (base - tip) * 0.5));
    g.strokeStyle = 'rgba(240,200,110,0.75)';
    g.lineWidth = 2.5;
    g.stroke(path);
    g.restore();
    g.strokeStyle = 'rgba(240,200,110,0.8)';
    g.lineWidth = 2.5;
    g.beginPath();
    g.moveTo(cx, base);
    g.lineTo(cx, tip + (base - tip) * 0.12);
    g.stroke();
  }
}

export function buildBud() {
  const w = 2048;
  const h = 1024;
  const rand = rng(515);
  const mk = (bump) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d');
    g.fillStyle = bump ? '#202020' : '#3a0a28';
    g.fillRect(0, 0, w, h);
    const slot = w / N;
    // back tier: offset half a slot, taller tips
    for (let i = 0; i < N; i++) {
      for (const wrap of [-1, 0, 1]) drawPetal(g, (i + 1) * slot + wrap * w, w, h, 0.98, slot * 0.9, KINDS[(i + 4) % N], rand, bump);
    }
    // front tier overlaps the seams
    for (let i = 0; i < N; i++) {
      g.save();
      g.shadowColor = 'rgba(0,0,0,0.6)';
      g.shadowBlur = 26;
      for (const wrap of [-1, 0, 1]) drawPetal(g, (i + 0.5) * slot + wrap * w, w, h, 0.7, slot * 0.82, KINDS[i], rand, bump);
      g.restore();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = bump ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.anisotropy = 8;
    return t;
  };
  const pts = [];
  const STEPS = 40;
  for (let i = 0; i <= STEPS; i++) {
    const p = profile(i / STEPS);
    pts.push(new THREE.Vector2(p.r, p.y));
  }
  const mesh = new THREE.Mesh(
    new THREE.LatheGeometry(pts, 96),
    new THREE.MeshPhysicalMaterial({
      map: mk(false),
      bumpMap: mk(true),
      bumpScale: 2.2,
      roughness: 0.34,
      metalness: 0.12,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.9,
      side: THREE.DoubleSide,
    }),
  );
  mesh.name = 'budShell';

  const r = rng(808);
  const glints = [];
  const hues = [[1, 0.8, 0.4], [1, 0.4, 0.6], [0.5, 0.8, 1], [0.6, 1, 0.8], [1, 0.97, 0.88]];
  for (let k = 0; k < 70; k++) {
    const slot = k % N;
    const u = (slot + 0.5 + (r() < 0.5 ? 0 : 0.5) + (r() - 0.5) * 0.7) / N;
    const t = 0.1 + r() * 0.8;
    const p = profile(t);
    const a = u * Math.PI * 2;
    const rr = p.r + 0.05;
    glints.push({
      pos: [rr * Math.sin(a), p.y, rr * Math.cos(a)],
      color: hues[Math.floor(r() * hues.length)],
      size: 0.1 + r() * 0.14,
      hot: 1,
      rate: 1.4 + r() * 3.6,
    });
  }
  mesh.userData.glints = glints;
  return mesh;
}
