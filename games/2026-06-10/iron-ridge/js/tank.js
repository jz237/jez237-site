// Tank: detailed code-built mesh (hull, turret, elevating barrel, tracks,
// road wheels) on a cannon-es RaycastVehicle with skid-steer controls.

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { TANK, SHELL, CG } from './config.js';
import { getHeight } from './terrain.js';

const _conn = new CANNON.Vec3();
const _connW = new CANNON.Vec3();
const _pv = new CANNON.Vec3();
const _f = new CANNON.Vec3();
const _rel = new CANNON.Vec3();
const UP = new CANNON.Vec3(0, 1, 0);
const _v3a = new THREE.Vector3();
const _v3b = new THREE.Vector3();

const SCHEMES = {
  olive: { hull: '#79895a', camo: '#5a6a3d', camo2: '#93a06b', dark: 0x4a553a, barrel: 0x5d6a47, mark: '★' },
  desert: { hull: '#b3a279', camo: '#94815c', camo2: '#c9b990', dark: 0x77694c, barrel: 0x91825f, mark: '◆' },
  scout: { hull: '#8c9680', camo: '#6d7762', camo2: '#a3ab95', dark: 0x59624f, barrel: 0x6e7760, mark: '▲' },
  heavy: { hull: '#80714f', camo: '#62553e', camo2: '#988a68', dark: 0x4e4536, barrel: 0x615641, mark: '☠' },
};

// two-tone camo splotches + grime, shared per scheme
const camoCache = new Map();
function camoTexture(schemeName) {
  if (camoCache.has(schemeName)) return camoCache.get(schemeName);
  const colors = SCHEMES[schemeName] ?? SCHEMES.olive;
  const s = 128;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = colors.hull;
  ctx.fillRect(0, 0, s, s);
  let seed = 0;
  for (let i = 0; i < schemeName.length; i++) seed = (seed * 31 + schemeName.charCodeAt(i)) | 0;
  const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (const [color, n, rMin, rMax] of [[colors.camo, 9, 10, 26], [colors.camo2, 7, 6, 16]]) {
    ctx.fillStyle = color;
    for (let i = 0; i < n; i++) {
      const x = rng() * s, y = rng() * s;
      ctx.beginPath();
      // irregular blob from overlapping ellipses
      for (let b = 0; b < 3; b++) {
        ctx.ellipse(
          (x + (rng() - 0.5) * 18 + s) % s, (y + (rng() - 0.5) * 18 + s) % s,
          rMin + rng() * (rMax - rMin), rMin * 0.6 + rng() * rMax * 0.5,
          rng() * Math.PI, 0, Math.PI * 2,
        );
      }
      ctx.fill();
    }
  }
  // grime speckle
  for (let i = 0; i < 400; i++) {
    const v = rng();
    ctx.fillStyle = v > 0.5 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.05)';
    ctx.fillRect(rng() * s, rng() * s, 1 + rng() * 2, 1 + rng() * 2);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  camoCache.set(schemeName, tex);
  return tex;
}

// box sheared into a trapezoid cross-section (sloped side armor)
function trapPrism(wBottom, wTop, h, len) {
  const g = new THREE.BoxGeometry(1, 1, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const w = p.getY(i) > 0 ? wTop : wBottom;
    p.setXYZ(i, p.getX(i) * w, p.getY(i) * h, p.getZ(i) * len);
  }
  g.computeVertexNormals();
  return g;
}

// ---- track path: closed loop around the wheel run (hull-local y/z) -----
const TRACK_PATH = (() => {
  const raw = [];
  const r = 0.40, cy = 0.42, fz = 1.95, rz = -1.95;
  // bottom run, front -> rear
  for (let z = fz; z >= rz; z -= 0.08) raw.push([0.02, z]);
  // rear semicircle, bottom -> top
  for (let u = 0; u <= Math.PI; u += Math.PI / 12) {
    raw.push([cy - r * Math.cos(u), rz - r * Math.sin(u)]);
  }
  // top run with sag, rear -> front
  for (let z = rz; z <= fz; z += 0.08) {
    raw.push([0.82 - 0.05 * Math.sin(Math.PI * (z - rz) / (fz - rz)), z]);
  }
  // front semicircle, top -> bottom
  for (let u = 0; u <= Math.PI; u += Math.PI / 12) {
    raw.push([cy + r * Math.cos(u), fz + r * Math.sin(u)]);
  }
  // cumulative arclength, then resample uniformly into a lookup table
  let L = 0;
  const cum = [0];
  for (let i = 1; i < raw.length; i++) {
    L += Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]);
    cum.push(L);
  }
  const N = 256;
  const table = []; // {y, z, ang}
  let j = 0;
  for (let i = 0; i < N; i++) {
    const s = (i / N) * L;
    while (j < raw.length - 2 && cum[j + 1] < s) j++;
    const t = (s - cum[j]) / Math.max(1e-6, cum[j + 1] - cum[j]);
    const y = raw[j][0] + (raw[j + 1][0] - raw[j][0]) * t;
    const z = raw[j][1] + (raw[j + 1][1] - raw[j][1]) * t;
    const ang = Math.atan2(raw[j + 1][0] - raw[j][0], raw[j + 1][1] - raw[j][1]);
    table.push({ y, z, ang });
  }
  return { table, L, N };
})();

const LINK_SPACING = 0.165;
const LINKS_PER_SIDE = Math.floor(TRACK_PATH.L / LINK_SPACING);
const linkGeo = new THREE.BoxGeometry(0.46, 0.055, 0.135);
const linkMat = new THREE.MeshStandardMaterial({ color: 0x3b3b3e, roughness: 0.85, metalness: 0.3 });

function markingTexture(mark, tint) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = tint;
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(mark, 32, 36);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildTankMesh(scheme = 'olive') {
  const colors = SCHEMES[scheme] ?? SCHEMES.olive;
  const camo = camoTexture(scheme);

  const hullMat = new THREE.MeshStandardMaterial({ map: camo, roughness: 0.74, metalness: 0.05 });
  const accentMat = new THREE.MeshStandardMaterial({ map: camo, color: 0xc6c6bc, roughness: 0.8, metalness: 0.05 });
  const darkMat = new THREE.MeshStandardMaterial({ color: colors.dark, roughness: 0.8, metalness: 0.05 });
  const barrelMat = new THREE.MeshStandardMaterial({ color: colors.barrel, roughness: 0.45, metalness: 0.3 });
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2e, roughness: 0.95 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x6a6a70, roughness: 0.45, metalness: 0.45 });

  const root = new THREE.Group();

  // ---- hull: trapezoid cross-section with sloped armor ----
  const hull = new THREE.Group();
  root.add(hull);
  const lower = new THREE.Mesh(trapPrism(1.9, 2.3, 0.55, 4.45), hullMat);
  lower.position.y = 0.56;
  hull.add(lower);
  // upper hull slopes inward toward the roof, sponsons overhang the tracks
  const upper = new THREE.Mesh(trapPrism(2.7, 2.34, 0.46, 3.8), hullMat);
  upper.position.set(0, 1.06, -0.25);
  hull.add(upper);
  // sloped glacis plate (well-angled, meets the lower hull nose)
  const glacis = new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.16, 1.7), hullMat);
  glacis.position.set(0, 0.96, 1.78);
  glacis.rotation.x = -0.72;
  hull.add(glacis);
  // weld seams along the glacis edges
  for (const sx of [-1.12, 1.12]) {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 1.55), darkMat);
    seam.position.set(sx, 1.02, 1.76);
    seam.rotation.x = -0.72;
    hull.add(seam);
  }
  const seamTop = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.05, 0.06), darkMat);
  seamTop.position.set(0, 1.27, 1.18);
  hull.add(seamTop);
  // hull MG ball mount on the glacis
  const mgBall = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), darkMat);
  mgBall.position.set(-0.62, 1.06, 1.92);
  hull.add(mgBall);
  const mgBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6), steelMat);
  mgBarrel.rotation.x = Math.PI / 2 - 0.18;
  mgBarrel.position.set(-0.62, 1.12, 2.2);
  hull.add(mgBarrel);
  // rear plate + engine deck grilles
  const rear = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.55, 0.3), hullMat);
  rear.position.set(0, 0.82, -2.22);
  rear.rotation.x = 0.4;
  hull.add(rear);
  for (let gi = 0; gi < 3; gi++) {
    const grille = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.04, 0.3), darkMat);
    grille.position.set(0, 1.305, -1.25 - gi * 0.42);
    hull.add(grille);
  }
  // exhaust stacks (tips exposed for smoke emission)
  const exhausts = [];
  for (const sx of [-0.78, 0.78]) {
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.55, 7), steelMat);
    ex.position.set(sx, 1.22, -2.1);
    ex.rotation.x = 1.05;
    hull.add(ex);
    const tip = new THREE.Object3D();
    tip.position.set(sx, 1.42, -2.32);
    hull.add(tip);
    exhausts.push(tip);
  }
  // fenders over the tracks
  for (const sx of [-1.31, 1.31]) {
    const fender = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 4.5), accentMat);
    fender.position.set(sx, 0.92, 0);
    hull.add(fender);
  }
  // stowage: crate, fuel drum, tarp roll
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.3, 0.9), darkMat);
  crate.position.set(-0.85, 1.42, -1.2);
  hull.add(crate);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.78, 9), darkMat);
  drum.position.set(0.85, 1.4, -1.5);
  drum.rotation.z = Math.PI / 2;
  drum.rotation.y = Math.PI / 2;
  hull.add(drum);
  const tarp = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 1.6, 7), accentMat);
  tarp.rotation.z = Math.PI / 2;
  tarp.position.set(0, 1.33, 0.62);
  hull.add(tarp);
  // headlights with brush guards
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xfff7d0, emissive: 0x55502c, roughness: 0.3 });
  for (const sx of [-0.95, 0.95]) {
    const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.1, 8), lightMat);
    hl.rotation.x = Math.PI / 2 - 0.6;
    hl.position.set(sx, 1.3, 1.62);
    hull.add(hl);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 0.16), steelMat);
    guard.position.set(sx, 1.4, 1.62);
    hull.add(guard);
  }
  // lifting hooks + tow hooks + spare links
  for (const [sx, sz] of [[-1.0, 1.0], [1.0, 1.0], [-1.0, -1.7], [1.0, -1.7]]) {
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.025, 5, 8), steelMat);
    hook.position.set(sx, 1.31, sz);
    hook.rotation.x = Math.PI / 2;
    hull.add(hook);
  }
  for (const sx of [-0.7, 0.7]) {
    const hook = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.24), steelMat);
    hook.position.set(sx, 0.56, 2.3);
    hull.add(hook);
  }
  const spare = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.07, 0.32), darkMat);
  spare.position.set(0.35, 1.12, 1.55);
  spare.rotation.x = -0.72;
  hull.add(spare);
  // pioneer tools on the left fender
  const tool = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 1.4), darkMat);
  tool.position.set(-1.31, 0.97, 0.4);
  hull.add(tool);
  const toolHead = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.22), steelMat);
  toolHead.position.set(-1.31, 0.98, 1.05);
  hull.add(toolHead);
  // mud flaps
  for (const sx of [-1.31, 1.31]) {
    for (const zz of [2.26, -2.26]) {
      const flap = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.3, 0.05), accentMat);
      flap.position.set(sx, 0.74, zz);
      hull.add(flap);
    }
  }

  // ---- running gear: road wheels, sprocket, idler, return rollers ----
  const roadWheels = [];
  const spinning = [];
  const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.3, 14);
  const hubGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.33, 9);
  for (const side of [-1, 1]) {
    const sx = side * 1.06;
    for (let i = 0; i < 5; i++) {
      const grp = new THREE.Group();
      grp.position.set(sx, 0.36, 1.6 - i * 0.8);
      const w = new THREE.Mesh(wheelGeo, rubberMat);
      w.rotation.z = Math.PI / 2;
      grp.add(w);
      const hub = new THREE.Mesh(hubGeo, accentMat);
      hub.rotation.z = Math.PI / 2;
      grp.add(hub);
      hull.add(grp);
      roadWheels.push({ grp, side, z: grp.position.z, baseY: 0.36 });
      spinning.push(grp);
    }
    // drive sprocket (front) with teeth
    const spr = new THREE.Group();
    spr.position.set(sx, 0.42, 1.95);
    const sprBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.3, 12), steelMat);
    sprBody.rotation.z = Math.PI / 2;
    spr.add(sprBody);
    for (let t = 0; t < 8; t++) {
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, 0.07), steelMat);
      const a = (t / 8) * Math.PI * 2;
      tooth.position.set(0, Math.cos(a) * 0.34, Math.sin(a) * 0.34);
      tooth.rotation.x = -a;
      spr.add(tooth);
    }
    hull.add(spr);
    spinning.push(spr);
    // idler (rear)
    const idler = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.26, 12), steelMat);
    idler.rotation.z = Math.PI / 2;
    idler.position.set(sx, 0.42, -1.95);
    hull.add(idler);
    spinning.push(idler);
    // return rollers
    for (const zz of [0.7, -0.7]) {
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.2, 9), rubberMat);
      roller.rotation.z = Math.PI / 2;
      roller.position.set(sx, 0.74, zz);
      hull.add(roller);
      spinning.push(roller);
    }
  }

  // ---- circulating track links (instanced, both sides in one mesh) ----
  const links = new THREE.InstancedMesh(linkGeo, linkMat, LINKS_PER_SIDE * 2);
  links.castShadow = true;
  links.frustumCulled = false; // child of a moving hull; let the tank cull as a whole
  hull.add(links);
  const trackState = { offL: 0, offR: 0 };
  const _lm = new THREE.Matrix4();
  const _lq = new THREE.Quaternion();
  const _le = new THREE.Euler();
  const _lp = new THREE.Vector3();
  const _ls = new THREE.Vector3(1, 1, 1);
  function updateLinks() {
    const { table, L, N } = TRACK_PATH;
    let idx = 0;
    for (const [sideX, off] of [[1.06, trackState.offL], [-1.06, trackState.offR]]) {
      for (let i = 0; i < LINKS_PER_SIDE; i++) {
        let s = (i * LINK_SPACING + off) % L;
        if (s < 0) s += L;
        const e = table[Math.min(N - 1, (s / L * N) | 0)];
        _lp.set(sideX, e.y, e.z);
        _le.set(e.ang, 0, 0);
        _lq.setFromEuler(_le);
        _lm.compose(_lp, _lq, _ls);
        links.setMatrixAt(idx++, _lm);
      }
    }
    links.instanceMatrix.needsUpdate = true;
  }
  updateLinks();
  const tracks = {
    advance(dL, dR) {
      trackState.offL += dL;
      trackState.offR += dR;
      updateLinks();
    },
  };

  // ---- turret: rounded cast profile via lathe, stretched front-to-back ----
  const turret = new THREE.Group();
  turret.position.set(0, 1.3, 0.25);
  root.add(turret);
  const profile = [
    [0.62, 0.0], [0.97, 0.04], [1.04, 0.18], [1.0, 0.34],
    [0.86, 0.5], [0.6, 0.62], [0.32, 0.68], [0.0, 0.7],
  ].map(p => new THREE.Vector2(p[0], p[1]));
  const cast = new THREE.Mesh(new THREE.LatheGeometry(profile, 18), hullMat);
  cast.scale.set(0.92, 1, 1.28);
  turret.add(cast);
  // turret ring collar
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.08, 0.12, 16), accentMat);
  ring.position.y = 0.02;
  turret.add(ring);
  // bustle + stowage rack
  const bustle = new THREE.Mesh(trapPrism(1.5, 1.26, 0.5, 0.9), hullMat);
  bustle.position.set(0, 0.34, -1.25);
  turret.add(bustle);
  const rack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.4), steelMat);
  rack.position.set(0, 0.52, -1.72);
  turret.add(rack);
  const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.05, 7), accentMat);
  roll.rotation.z = Math.PI / 2;
  roll.position.set(0, 0.66, -1.68);
  turret.add(roll);
  // commander's cupola with vision blocks + hatch
  const cupola = new THREE.Group();
  cupola.position.set(-0.34, 0.66, -0.18);
  turret.add(cupola);
  const cupBody = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.29, 0.18, 10), hullMat);
  cupBody.position.y = 0.09;
  cupola.add(cupBody);
  for (let v = 0; v < 6; v++) {
    const a = (v / 6) * Math.PI * 2;
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.03), darkMat);
    block.position.set(Math.sin(a) * 0.27, 0.1, Math.cos(a) * 0.27);
    block.rotation.y = a;
    cupola.add(block);
  }
  const hatchLid = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.05, 10), accentMat);
  hatchLid.position.y = 0.2;
  hatchLid.rotation.z = 0.1;
  cupola.add(hatchLid);
  // pintle-mounted MG at the cupola
  const pintle = new THREE.Group();
  pintle.position.set(-0.1, 0.26, 0.1);
  pintle.rotation.y = -0.5;
  cupola.add(pintle);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.22, 6), steelMat);
  post.position.y = 0.1;
  pintle.add(post);
  const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.42), darkMat);
  receiver.position.set(0, 0.24, 0.06);
  pintle.add(receiver);
  const mgTube = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.5, 6), steelMat);
  mgTube.rotation.x = Math.PI / 2;
  mgTube.position.set(0, 0.25, 0.48);
  pintle.add(mgTube);
  const ammoBox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.16), darkMat);
  ammoBox.position.set(0.1, 0.2, 0);
  pintle.add(ammoBox);
  // loader hatch + gunner's sight + periscopes
  const lHatch = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.07, 9), accentMat);
  lHatch.position.set(0.36, 0.66, -0.2);
  turret.add(lHatch);
  const sight = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.22), darkMat);
  sight.position.set(0.3, 0.62, 0.42);
  turret.add(sight);
  for (const sx of [-0.14, 0.14]) {
    const peri = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.16), darkMat);
    peri.position.set(sx, 0.7, 0.18);
    turret.add(peri);
  }
  // snorkel/antenna
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 1.5, 4), darkMat);
  ant.position.set(0.52, 1.2, -1.3);
  ant.rotation.z = 0.14;
  turret.add(ant);
  // side markings
  const markTex = markingTexture(colors.mark, '#e8e2cf');
  const markMat = new THREE.MeshBasicMaterial({ map: markTex, transparent: true, polygonOffset: true, polygonOffsetFactor: -1 });
  for (const side of [-1, 1]) {
    const mark = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.46), markMat);
    mark.position.set(side * 0.94, 0.3, -0.1);
    mark.rotation.y = side * Math.PI / 2;
    turret.add(mark);
  }
  // grenade smoke dischargers
  for (const side of [-1, 1]) {
    for (let d = 0; d < 3; d++) {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 6), darkMat);
      tube.position.set(side * (0.78 + d * 0.07), 0.36, 0.62 - d * 0.05);
      tube.rotation.x = -0.7;
      tube.rotation.z = side * 0.35;
      turret.add(tube);
    }
  }

  // ---- elevating gun: mantlet, thermal sleeve, fume extractor, brake ----
  const pivot = new THREE.Group();        // pitch pivot
  pivot.position.set(0, 0.34, 0.7);
  turret.add(pivot);
  const mantlet = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 9), hullMat);
  mantlet.scale.set(1.5, 1.1, 0.9);
  mantlet.position.z = 0.12;
  pivot.add(mantlet);
  const recoilGrp = new THREE.Group();    // slides back on fire
  pivot.add(recoilGrp);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.1, 3.3, 12), barrelMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = 1.85;
  recoilGrp.add(barrel);
  for (const [sz, sl] of [[0.9, 0.8], [2.2, 0.7]]) {
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, sl, 10), darkMat);
    sleeve.rotation.x = Math.PI / 2;
    sleeve.position.z = sz;
    recoilGrp.add(sleeve);
  }
  const extractor = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.5, 10), barrelMat);
  extractor.rotation.x = Math.PI / 2;
  extractor.position.z = 1.55;
  recoilGrp.add(extractor);
  const brake = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.125, 0.45, 10), darkMat);
  brake.rotation.x = Math.PI / 2;
  brake.position.z = 3.4;
  recoilGrp.add(brake);
  const muzzle = new THREE.Object3D();
  muzzle.position.z = 3.65;
  recoilGrp.add(muzzle);

  root.traverse(o => { if (o.isMesh) { o.castShadow = true; } });

  return { root, hull, turret, pivot, recoilGrp, muzzle, roadWheels, spinning, tracks, exhausts };
}

export class Tank {
  constructor(scene, world, opts = {}) {
    this.scene = scene;
    this.world = world;
    this.isPlayer = !!opts.isPlayer;
    this.hp = opts.hp ?? TANK.hp;
    this.maxHp = this.hp;
    this.alive = true;
    const sc = opts.scale ?? 1;
    this.scale = sc;
    // per-variant performance tuning (scouts are nimble, heavies ponderous)
    this.tuning = {
      maxSpeed: opts.maxSpeed ?? TANK.maxSpeed,
      engineForce: opts.engineForce ?? TANK.engineForce,
      maxYawRate: opts.maxYawRate ?? TANK.maxYawRate,
    };
    this.visual = buildTankMesh(opts.scheme ?? (this.isPlayer ? 'olive' : 'desert'));
    this.visual.root.scale.setScalar(sc);
    scene.add(this.visual.root);

    // physics chassis — shape offset up so the centre of mass sits low
    const half = TANK.chassisHalf;
    const body = new CANNON.Body({
      mass: TANK.mass * sc * sc,
      position: new CANNON.Vec3(opts.x ?? 0, (opts.y ?? 2) + 0.7, opts.z ?? 0),
      collisionFilterGroup: this.isPlayer ? CG.PLAYER : CG.ENEMY,
      collisionFilterMask: -1,
      angularDamping: 0.65,
      linearDamping: 0.08,
    });
    body.addShape(
      new CANNON.Box(new CANNON.Vec3(half.x * sc, half.y * sc, half.z * sc)),
      new CANNON.Vec3(0, 0.55 * sc, 0),
    );
    body.allowSleep = false;
    body.userData = { kind: 'tank', tank: this };
    this.body = body;

    // custom track suspension: spring/damper at each corner against the
    // analytic terrain (cannon's RaycastVehicle fights tracked vehicles —
    // its lateral wheel constraints cancel skid-steer entirely)
    this.suspension = [
      { x: -1.05 * sc, z: 1.65 * sc }, { x: 1.05 * sc, z: 1.65 * sc },
      { x: -1.05 * sc, z: -1.65 * sc }, { x: 1.05 * sc, z: -1.65 * sc },
    ].map(p => ({ ...p, contact: false, comp: 0 }));
    this.contacts = 0;
    world.addBody(body);

    // interpolation buffers
    this.prevPos = new CANNON.Vec3().copy(body.position);
    this.prevQuat = new CANNON.Quaternion().copy(body.quaternion);

    // turret state (relative yaw to hull, world-space goal set by aim)
    this.turretYaw = 0;
    this.barrelPitch = 0;
    this.aimPoint = new THREE.Vector3(0, 0, 100);

    // gun state
    this.shellSpeed = opts.shellSpeed ?? SHELL.speed;
    this.rack = SHELL.rackSize;
    this.chamber = 1;          // 0..1 ready
    this.restocking = 0;       // >0 while refilling rack
    this.recoil = 0;

    this.throttle = 0;
    this.turn = 0;
    this.trackScroll = 0;
    this.smokeTimer = 0;
    this.lowHpSmoke = 0;
    this.overturned = 0;
  }

  get pos() { return this.body.position; }

  speedAlongForward() {
    const fwd = this.body.quaternion.vmult(new CANNON.Vec3(0, 0, 1));
    return this.body.velocity.dot(fwd);
  }

  // called every fixed step BEFORE world.step
  applyControls(dt) {
    const body = this.body;
    const q = body.quaternion;
    const up = q.vmult(UP);

    // ---- suspension: spring/damper per corner vs analytic terrain ----
    const sc = this.scale, sc2 = sc * sc;
    let contacts = 0;
    for (const w of this.suspension) {
      _conn.set(w.x, 0.1 * sc, w.z);
      body.pointToWorldFrame(_conn, _connW);
      const groundY = getHeight(_connW.x, _connW.z);
      const comp = (TANK.suspensionRest + TANK.wheelRadius) * sc - (_connW.y - groundY);
      w.contact = comp > 0 && up.y > 0.25;
      w.comp = Math.max(0, comp);
      if (!w.contact) continue;
      contacts++;
      body.getVelocityAtWorldPoint(_connW, _pv);
      let F = TANK.suspK * sc2 * Math.min(comp, 0.45) - TANK.suspC * sc2 * _pv.y;
      if (F < 0) F = 0;
      if (F > 6200 * sc2) F = 6200 * sc2; // ~3.5x static share — soaks impacts without launching
      _f.set(0, F, 0);
      _connW.vsub(body.position, _rel); // applyForce wants a COM-relative point
      body.applyForce(_f, _rel);
    }
    this.contacts = contacts;
    const traction = contacts / 4;

    if (this.alive && traction > 0) {
      const speed = this.speedAlongForward();
      // flattened forward axis (slope-projected drive direction)
      const fwd = q.vmult(new CANNON.Vec3(0, 0, 1));
      fwd.y = 0;
      if (fwd.length() > 0.01) {
        fwd.normalize();
        let force = 0;
        if (this.throttle > 0.01) {
          force = speed < this.tuning.maxSpeed ? this.tuning.engineForce * sc2 * this.throttle : 0;
        } else if (this.throttle < -0.01) {
          force = speed > -TANK.maxReverse ? -TANK.reverseForce * sc2 * -this.throttle : 0;
        } else {
          // tracks resist rolling when coasting
          force = -THREE.MathUtils.clamp(speed * TANK.rollResist * sc2, -2800 * sc2, 2800 * sc2);
        }
        _f.set(fwd.x * force * traction, 0, fwd.z * force * traction);
        body.applyForce(_f);

        // lateral track grip (kills sideways sliding)
        const right = q.vmult(new CANNON.Vec3(1, 0, 0));
        right.y = 0;
        right.normalize();
        const latV = body.velocity.dot(right);
        const grip = THREE.MathUtils.clamp(-latV * TANK.latGrip * sc2, -TANK.latGripMax * sc2, TANK.latGripMax * sc2);
        _f.set(right.x * grip * traction, 0, right.z * grip * traction);
        body.applyForce(_f);
      }

      // commanded yaw rate — how tracked steering actually behaves
      const dir = speed < -0.5 ? -1 : 1;
      if (Math.abs(this.turn) > 0.01) {
        const targetRate = -this.turn * dir * this.tuning.maxYawRate * traction;
        body.angularVelocity.y += (targetRate - body.angularVelocity.y) * Math.min(1, dt * 10);
      } else {
        body.angularVelocity.y *= 1 - Math.min(1, dt * 6);
      }
    }

    if (!this.alive) {
      // dead tank: brake to a stop
      body.velocity.x *= 1 - Math.min(1, dt * 2);
      body.velocity.z *= 1 - Math.min(1, dt * 2);
      return;
    }

    // self-right when overturned (real tanks have recovery crews; we don't)
    if (up.y < 0.35) this.overturned += dt;
    else this.overturned = Math.max(0, this.overturned - dt * 2);
    if (this.overturned > 1.8) {
      const fwd2 = this.body.quaternion.vmult(new CANNON.Vec3(0, 0, 1));
      const yaw = Math.atan2(fwd2.x, fwd2.z);
      const upright = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 1, 0), yaw);
      this.body.quaternion.slerp(upright, 4 * dt, this.body.quaternion);
      this.body.position.y += 1.5 * dt;
      this.body.angularVelocity.scale(0.85, this.body.angularVelocity);
      this.body.velocity.scale(0.92, this.body.velocity);
      if (up.y > 0.92) this.overturned = 0;
    }

    // gun timers
    if (this.restocking > 0) {
      this.restocking -= dt;
      if (this.restocking <= 0) { this.rack = SHELL.rackSize; this.chamber = 1; }
    } else if (this.chamber < 1) {
      this.chamber = Math.min(1, this.chamber + dt / SHELL.chamberTime);
    }
    this.recoil = Math.max(0, this.recoil - dt * 3.2);
  }

  canFire() {
    return this.alive && this.rack > 0 && this.chamber >= 1 && this.restocking <= 0;
  }

  // returns {origin, dir} muzzle ray or null
  fire() {
    if (!this.canFire()) return null;
    this.rack--;
    this.chamber = 0;
    if (this.rack <= 0) this.restocking = SHELL.restockTime;
    this.recoil = 1;

    this.visual.root.updateMatrixWorld(true);
    const origin = new THREE.Vector3();
    this.visual.muzzle.getWorldPosition(origin);
    const back = new THREE.Vector3();
    this.visual.pivot.getWorldPosition(back);
    const dir = origin.clone().sub(back).normalize();

    // physical recoil shove (slightly above COM for a nose-lift kick)
    const imp = dir.clone().multiplyScalar(-this.body.mass * 1.45);
    this.body.applyImpulse(
      new CANNON.Vec3(imp.x, imp.y * 0.3, imp.z),
      new CANNON.Vec3(0, 0.9, 0),
    );
    return { origin, dir };
  }

  reloadNow() {
    if (this.restocking > 0 || this.rack >= SHELL.rackSize) return false;
    this.restocking = SHELL.restockTime * (1 - this.rack / SHELL.rackSize) + 1.2;
    this.rack = 0;
    return true;
  }

  setAim(point) { this.aimPoint.copy(point); }

  // turret slew toward aim point. Ballistic zeroing happens in world space
  // (gravity is vertical), then the virtual target is transformed into the
  // hull's local frame so slopes/hull tilt never throw the gun off.
  updateTurret(dt) {
    const root = this.visual.root;
    root.updateMatrixWorld(true);
    const pivotW = _v3a.setFromMatrixPosition(this.visual.pivot.matrixWorld);

    const dx = this.aimPoint.x - pivotW.x;
    const dz = this.aimPoint.z - pivotW.z;
    const flat = Math.hypot(dx, dz);
    const dy = this.aimPoint.y - pivotW.y;

    // exact low-arc launch elevation through the aim point
    const v2 = this.shellSpeed * this.shellSpeed;
    const g = 9.81;
    const disc = v2 * v2 - g * (g * flat * flat + 2 * dy * v2);
    let aimAngle;
    if (disc > 0 && flat > 1) {
      aimAngle = Math.atan((v2 - Math.sqrt(disc)) / (g * flat));
    } else {
      const tof = flat / this.shellSpeed;
      aimAngle = Math.atan2(dy + 0.5 * g * tof * tof, Math.max(flat, 1));
    }

    // virtual target sitting on that elevation line, in hull-local space
    _v3b.set(this.aimPoint.x, pivotW.y + Math.tan(aimAngle) * flat, this.aimPoint.z);
    root.worldToLocal(_v3b);
    _v3b.sub(this.visual.turret.position); // relative to turret ring

    const desired = Math.atan2(_v3b.x, _v3b.z);
    let delta = desired - this.turretYaw;
    delta = Math.atan2(Math.sin(delta), Math.cos(delta));
    const maxStep = TANK.turretSlewRate * dt;
    this.turretYaw += THREE.MathUtils.clamp(delta, -maxStep, maxStep);
    this.turretYaw = Math.atan2(Math.sin(this.turretYaw), Math.cos(this.turretYaw));

    const flatLocal = Math.hypot(_v3b.x, _v3b.z);
    const pitchDes = THREE.MathUtils.clamp(
      -Math.atan2(_v3b.y - this.visual.pivot.position.y, flatLocal),
      TANK.barrelMinPitch, TANK.barrelMaxPitch,
    );
    this.barrelPitch = THREE.MathUtils.damp(this.barrelPitch, pitchDes, 9, dt);

    this.visual.turret.rotation.y = this.turretYaw;
    this.visual.pivot.rotation.x = this.barrelPitch;
    this.visual.recoilGrp.position.z = -this.recoil * 0.34;
  }

  visualYaw() {
    const e = new THREE.Euler().setFromQuaternion(this.visual.root.quaternion, 'YXZ');
    return e.y;
  }

  // ratio 0..1 of how closely the barrel points at `point`
  aimAlignment(point) {
    this.visual.root.updateMatrixWorld(true);
    const origin = new THREE.Vector3();
    this.visual.muzzle.getWorldPosition(origin);
    const back = new THREE.Vector3();
    this.visual.pivot.getWorldPosition(back);
    const dir = origin.sub(back).normalize();
    const want = new THREE.Vector3().subVectors(point, back).normalize();
    return dir.dot(want);
  }

  savePrev() {
    this.prevPos.copy(this.body.position);
    this.prevQuat.copy(this.body.quaternion);
  }

  syncVisual(alpha, dt, animDetail = true) {
    const r = this.visual.root;
    r.position.set(
      this.prevPos.x + (this.body.position.x - this.prevPos.x) * alpha,
      this.prevPos.y + (this.body.position.y - this.prevPos.y) * alpha,
      this.prevPos.z + (this.body.position.z - this.prevPos.z) * alpha,
    );
    const q = this.prevQuat;
    const b = this.body.quaternion;
    r.quaternion.set(
      q.x + (b.x - q.x) * alpha,
      q.y + (b.y - q.y) * alpha,
      q.z + (b.z - q.z) * alpha,
      q.w + (b.w - q.w) * alpha,
    ).normalize();
    // visual origin sits at ground level; wheel contact rest point is
    // connection.y - restLength - radius below the body origin
    r.position.y -= ((0.52 + TANK.wheelRadius - 0.1) - 0.1) * this.scale;

    // running gear animation (skipped for far-away tanks)
    if (animDetail) {
      const speed = this.speedAlongForward();
      const yawV = this.body.angularVelocity.y;
      const halfW = 1.06 * this.scale;
      // differential track speeds: outer track runs faster through a turn
      const vL = (speed - yawV * halfW) / this.scale;
      const vR = (speed + yawV * halfW) / this.scale;
      this.visual.tracks.advance(vL * dt, vR * dt);

      for (const s of this.visual.spinning) s.rotation.x += (speed / this.scale) * dt * 2.6;

      // road wheels ride the suspension: interpolate corner compression
      // along the hull; rest compression ≈ static weight / spring rate
      const REST = 0.107;
      const sus = this.suspension;
      for (const w of this.visual.roadWheels) {
        const fi = w.side > 0 ? 1 : 0;   // front corner index for this side
        const ri = w.side > 0 ? 3 : 2;   // rear corner index
        const t = (w.z + 1.6) / 3.2;
        const comp = sus[ri].comp + (sus[fi].comp - sus[ri].comp) * t;
        const lift = THREE.MathUtils.clamp((comp / this.scale) - REST, -0.1, 0.16);
        w.grp.position.y = w.baseY + lift;
      }
    }

    this.updateTurret(dt);
  }

  damage(amount) {
    if (!this.alive) return false;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      return true; // killed
    }
    return false;
  }

  destroyVisual() {
    // charred wreck: darken everything
    this.visual.root.traverse(o => {
      if (o.isMesh && o.material && !o.userData.charred) {
        o.userData.charred = true;
        o.material = new THREE.MeshStandardMaterial({ color: 0x232323, roughness: 1 });
      }
    });
  }

  removeFromWorld() {
    this.scene.remove(this.visual.root);
    this.world.removeBody(this.body);
  }
}
