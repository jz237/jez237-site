// Story props: the phone on the 3607 stoop, the tipped candy pail, the recycling toter knocked over at binKnock,
// and the curtain twitch in the 3602 upstairs window.
import * as THREE from 'three';
import { HERO, placeOnKit, kitPoint, kitRotY, findItem } from './site.js';
import { CUES, PLACES } from '../film/cues.js';
import { phoneBuzzTimes, phoneVibration, phoneScreen, PHONE, toterSim, TOTER, binImpactTimes, curtainOpen } from './timings.js';
import { box, rbox, cyl, lathe, merge, xform, sphere, mergeStatic } from './geo.js';
import { canvasTexture } from './textures.js';
import { makeGlass } from './glass.js';
import { rng, hash1, noise1, clamp, smoothstep } from './util.js';

// ---------------------------------------------------------------------------------------------------------------
// PHONE
function phoneScreenTexture(mode) {
  return canvasTexture('phone_' + mode, 384, 820, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, 0, h);
    if (mode === 'call') { bg.addColorStop(0, '#1d2533'); bg.addColorStop(1, '#0b0e14'); } else { bg.addColorStop(0, '#22324a'); bg.addColorStop(0.6, '#3a2c3c'); bg.addColorStop(1, '#14121a'); }
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e8ecf2'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const F = (sz, wt = '') => `${wt} ${sz}px "DejaVu Sans", Arial, Helvetica, sans-serif`;
    // status bar
    g.font = F(22, 'bold'); g.textAlign = 'left'; g.fillText(mode === 'call' ? '10:47' : '', 26, 30);
    g.textAlign = 'right'; g.font = F(20); g.fillText('62%', w - 26, 30);
    for (let i = 0; i < 4; i++) g.fillRect(w - 120 + i * 9, 38 - i * 5 - 6, 6, i * 5 + 6);
    g.textAlign = 'center';
    if (mode === 'call') {
      g.font = F(26); g.fillStyle = '#aab3c2'; g.fillText('incoming call', w / 2, 128);
      g.fillStyle = '#e8ecf2'; g.font = F(64, 'bold'); g.fillText('Mom', w / 2, 200);
      g.font = F(26); g.fillStyle = '#aab3c2'; g.fillText('mobile', w / 2, 250);
      g.fillStyle = '#4a5568'; g.beginPath(); g.arc(w / 2, 410, 92, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#d7dce6'; g.font = F(92, 'bold'); g.fillText('M', w / 2, 414);
      // decline / accept
      g.fillStyle = '#e5484d'; g.beginPath(); g.arc(w * 0.26, h - 150, 46, 0, 7); g.fill();
      g.fillStyle = '#30a46c'; g.beginPath(); g.arc(w * 0.74, h - 150, 46, 0, 7); g.fill();
      g.strokeStyle = '#ffffff'; g.lineWidth = 9; g.lineCap = 'round';
      g.beginPath(); g.arc(w * 0.26, h - 140, 22, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
      g.beginPath(); g.arc(w * 0.74, h - 156, 22, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
      g.fillStyle = '#c9d0db'; g.font = F(22); g.fillText('Decline', w * 0.26, h - 76); g.fillText('Accept', w * 0.74, h - 76);
    } else {
      g.font = F(108, 'bold'); g.fillText('10:48', w / 2, 190);
      g.font = F(26); g.fillStyle = '#d6dbe4'; g.fillText('Saturday, October 31', w / 2, 262);
      g.fillStyle = 'rgba(235,238,245,0.18)'; rr(g, 22, 330, w - 44, 112, 22); g.fill();
      g.fillStyle = '#30a46c'; rr(g, 40, 352, 44, 44, 10); g.fill();
      g.textAlign = 'left'; g.fillStyle = '#f1f3f7'; g.font = F(24, 'bold'); g.fillText('Missed call', 100, 366);
      g.font = F(24); g.fillStyle = '#d6dbe4'; g.fillText('Mom', 100, 404);
      g.textAlign = 'right'; g.font = F(20); g.fillText('now', w - 42, 366);
    }
    // a crack across one corner (the phone was dropped)
    const R = rng(55);
    g.strokeStyle = 'rgba(230,236,245,0.55)'; g.lineWidth = 1.4;
    for (let k = 0; k < 7; k++) {
      g.beginPath(); let x = w - 8, y = h - 40; g.moveTo(x, y);
      const a = Math.PI + 0.2 + k * 0.22 + R() * 0.1;
      for (let s = 0; s < 6; s++) { x += Math.cos(a + (R() - 0.5) * 0.6) * (20 + R() * 40); y += Math.sin(a + (R() - 0.5) * 0.6) * (20 + R() * 40); g.lineTo(x, y); }
      g.stroke();
    }
  }, { wrap: false });
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

export function buildPhone(ctx) {
  const st = HERO.steps3607;
  const group = new THREE.Group();
  group.name = 'Phone3607';
  // on the stoop landing (top at kit bz=0.54, by in [0.004, 0.546]); slightly askew, face up
  const base = kitPoint(st, -0.32, 0.4, 0.54 + 0.0001);
  group.position.copy(base);
  const baseYaw = kitRotY(st) + 0.62;
  group.rotation.y = baseYaw;
  const caseMat = new THREE.MeshStandardMaterial({ name: 'PhoneCase', color: 0x16171a, roughness: 0.62 });
  const body = new THREE.Mesh(rbox(0.0745, 0.0095, 0.151, 0.0075, 0, 0.00475, 0), caseMat);
  body.castShadow = true; body.receiveShadow = true;
  group.add(body);
  const screenMat = new THREE.MeshStandardMaterial({ name: 'PhoneScreen', color: 0x030405, roughness: 0.12, metalness: 0.1, emissive: 0xffffff, emissiveMap: phoneScreenTexture('call'), emissiveIntensity: 0 });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.0665, 0.1425), screenMat);
  screen.rotation.x = -Math.PI / 2; screen.position.y = 0.0097;
  group.add(screen);
  const texCall = screenMat.emissiveMap, texMissed = phoneScreenTexture('missed');
  // anchor + light source
  const pos = base.clone().add(new THREE.Vector3(0, 0.035, 0));   // face-up screen: only a faint spill on the step
  let lightScale = 1;
  const sources = [{ id: 'phone_screen', kind: 'point', position: pos, color: new THREE.Color(0.72, 0.8, 1.0), intensity: 0.012, distance: 0.4, decay: 2, priority: 300,
    enabledAt: (t) => phoneScreen(t).level > 0.01, intensityAt: (t) => phoneScreen(t).level * lightScale }];
  const jit = new THREE.Vector3();
  return {
    group, sources,
    anchors: { phone3607: { position: base.clone(), quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, baseYaw, 0)), note: 'phone lying face-up on the 3607 stoop landing' } },
    api: { group, screen, buzzTimes: phoneBuzzTimes, buzzDur: PHONE.buzzDur, setLightScale(k) { lightScale = k; } },
    update(t) {
      const v = phoneVibration(t);
      // walk: cumulative buzz time rotates/moves the phone slightly
      let cum = 0; for (const b of phoneBuzzTimes) cum += clamp(t - b, 0, PHONE.buzzDur);
      const f = Math.floor(t * 240);
      jit.set((hash1(f) - 0.5) * 0.0013 * v, 0.0004 * v * hash1(f + 7), (hash1(f + 3) - 0.5) * 0.0013 * v);
      group.position.copy(base).add(jit);
      group.position.x += 0.0022 * cum; group.position.z += -0.0012 * cum;
      group.rotation.y = baseYaw + 0.022 * cum + (hash1(f + 11) - 0.5) * 0.006 * v;
      const s = phoneScreen(t);
      screenMat.emissiveMap = s.mode === 'missed' ? texMissed : texCall;
      screenMat.emissiveIntensity = 1.15 * s.level;
    },
  };
}

// ---------------------------------------------------------------------------------------------------------------
// CANDY: the tipped plastic jack-o'-lantern pail + spilled candy and wrappers (procedural fallback; the Blender
// model assets/props/candypail.glb replaces the pail/candy meshes when present).
function candyMaterials() {
  const tex = canvasTexture('candyWrappers', 512, 256, (g, w, h) => {
    const cols = [['#c8202a', '#f2d24b'], ['#1f4fa8', '#e8e8e8'], ['#5a3418', '#e8b04a'], ['#e06a1a', '#2a1a10'], ['#6b2a8a', '#f0e6f6'], ['#2a8a3a', '#f4f4f0'], ['#202020', '#d84a1a'], ['#e8d24a', '#8a2a1a']];
    cols.forEach(([a, b], i) => {
      const x = (i % 4) * (w / 4), y = Math.floor(i / 4) * (h / 2);
      g.fillStyle = a; g.fillRect(x, y, w / 4, h / 2);
      g.fillStyle = b; g.fillRect(x + 8, y + h / 4 - 14, w / 4 - 16, 28);
      g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(x, y + 6, w / 4, 4);
      g.fillStyle = 'rgba(0,0,0,0.25)'; for (let k = 0; k < 9; k++) g.fillRect(x + k * 14, y, 2, 8);
    });
  }, { wrap: false });
  return {
    pail: new THREE.MeshPhysicalMaterial({ name: 'PailPlastic', color: 0xe8661a, roughness: 0.32, clearcoat: 0.4, clearcoatRoughness: 0.4 }),
    face: new THREE.MeshStandardMaterial({ name: 'PailFace', color: 0x101010, roughness: 0.5 }),
    handle: new THREE.MeshStandardMaterial({ name: 'PailHandle', color: 0x111111, roughness: 0.4 }),
    wrap: new THREE.MeshStandardMaterial({ name: 'WrapperFoil', map: tex, roughness: 0.28, metalness: 0.35 }),
    tex,
  };
}
function proceduralPail(m) {
  const g = new THREE.Group();
  const pts = [];
  for (let i = 0; i <= 16; i++) { const v = i / 16; pts.push([0.1 + 0.025 * Math.sin(Math.PI * v) - 0.012 * (v < 0.1 ? 1 - v / 0.1 : 0), v * 0.19]); }
  const geo = lathe(pts, 40);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x); const k = 1 - 0.035 * Math.pow(Math.abs(Math.cos(a * 5)), 3); p.setX(i, x * k); p.setZ(i, z * k); }
  geo.computeVertexNormals();
  const shell = new THREE.Mesh(geo, m.pail); shell.material.side = THREE.DoubleSide; shell.castShadow = true; shell.receiveShadow = true; g.add(shell);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.006, 8, 40).rotateX(Math.PI / 2).translate(0, 0.19, 0), m.pail); g.add(rim);
  const face = new THREE.Mesh(merge([xform(new THREE.CircleGeometry(0.022, 3), -0.04, 0.12, 0.118, 0, 0, Math.PI / 2), xform(new THREE.CircleGeometry(0.022, 3), 0.04, 0.12, 0.118, 0, 0, Math.PI / 2), xform(new THREE.PlaneGeometry(0.1, 0.025), 0, 0.07, 0.122)]), m.face);
  g.add(face);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.004, 6, 30, Math.PI).translate(0, 0.19, 0), m.handle); g.add(handle);
  return g;
}
export async function buildCandy(ctx) {
  const m = candyMaterials();
  const group = new THREE.Group(); group.name = 'CandyPail';
  const R = rng(1515);
  const px = PLACES.candyBucket ? PLACES.candyBucket.x : 0, pz = PLACES.candyBucket ? PLACES.candyBucket.z : 0;
  const gy = (x, z) => ctx.groundY(x, z);
  let pail = null, pieces = null;
  try {
    const gltf = await ctx.loadGLTF('candypail.glb');
    pail = gltf.scene.getObjectByName('candy_pail');
    pieces = ['candy_bar_red', 'candy_bar_blue', 'candy_bar_brown', 'candy_bar_orange', 'candy_twist_purple', 'candy_twist_green', 'candy_lollipop', 'candy_box_small', 'wrapper_empty_1', 'wrapper_empty_2', 'wrapper_empty_3'].map((n) => gltf.scene.getObjectByName(n)).filter(Boolean);
    gltf.scene.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    if (!pail) throw new Error('no candy_pail node');
  } catch (e) {
    pail = proceduralPail(m);
    pieces = null;
  }
  // v2 (DRESS): the outdoor tipped pail is retired (not in the v2 film); keep only the candy pieces/materials for
  // the indoor 3609 candy bowl (buildCandyBowl)
  if (!PLACES.candyBucket) return { group, anchors: {}, api: { group, pail: null, pieces: [], candyMeshes: pieces, materials: m }, update() {} };
  // pail tipped over on its side, opening toward the curb/street (-X), slight roll; the handle lies on the ground
  const handle = pail.getObjectByName && pail.getObjectByName('candy_pail_handle');
  if (handle) handle.rotation.x = -1.35;
  const holder = new THREE.Group();
  holder.add(pail);
  pail.position.set(0, -0.0, 0);
  holder.rotation.set(0, 0, 0);
  const tip = new THREE.Group(); tip.add(holder);
  holder.rotation.z = Math.PI / 2 - 0.08;    // lying on its side; the open top points along -X of tip
  holder.position.y = 0.118;
  tip.position.set(px, gy(px, pz), pz);
  const PAIL_YAW = -1.21;               // mouth toward the NE along the sidewalk, slightly toward the curb
  tip.rotation.y = PAIL_YAW;
  group.add(tip);
  // spilled candy: fan out of the pail opening (toward the curb and NE), a few pieces reach the gutter
  const fallbackGeos = [rbox(0.07, 0.012, 0.03, 0.004), rbox(0.035, 0.018, 0.022, 0.008), cyl(0.012, 0.012, 0.06, 0, 0, 0, 0, 0, Math.PI / 2, 8)];
  const dir = new THREE.Vector3(-1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), PAIL_YAW);
  const perp = new THREE.Vector3(-dir.z, 0, dir.x);
  const mouth = new THREE.Vector3(px, 0, pz).addScaledVector(dir, 0.2);
  const n = 26;
  const placed = [];
  for (let i = 0; i < n; i++) {
    const d = 0.02 + Math.pow(R(), 1.7) * 0.75;
    const spread = (R() - 0.5) * (0.1 + d * 0.8);
    let x = mouth.x + dir.x * d + perp.x * spread, z = mouth.z + dir.z * d + perp.z * spread;
    if (x < 3.08 && R() < 0.7) x = 3.08 + R() * 0.15;   // most pieces stop on the sidewalk, a few drop into the gutter
    const kind = i % 11;
    let mesh;
    if (pieces && pieces.length) mesh = pieces[kind % pieces.length].clone();
    else mesh = new THREE.Mesh(fallbackGeos[kind % 3], m.wrap);
    mesh.castShadow = false;
    mesh.position.set(x, gy(x, z) + 0.004, z);
    mesh.rotation.set(0, R() * Math.PI * 2, (R() - 0.5) * 0.2);
    group.add(mesh);
    placed.push(mesh);
  }
  // batch the spilled pieces (static); the pail itself stays a separate group
  tip.userData.noMerge = true;
  mergeStatic(group, () => false);
  return {
    group,
    anchors: { candyBucket: { position: new THREE.Vector3(px, gy(px, pz), pz), quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, PAIL_YAW, 0)), note: 'tipped pumpkin pail (centre on the sidewalk); its mouth points along quaternion*(-X)' } },
    api: { group, pail: tip, pieces: placed, candyMeshes: pieces, materials: m },
    update() {},
  };
}

// Halloween candy bowl on the 3609 coffee table (ceramic bowl heaped with the same candy as the pail)
export function buildCandyBowl(ctx, anchor, candyApi) {
  const g = new THREE.Group(); g.name = 'CandyBowl3609';
  if (!anchor) return { group: g };
  const bowl = new THREE.Mesh(lathe([[0, 0], [0.05, 0], [0.06, 0.006], [0.1, 0.04], [0.135, 0.085], [0.14, 0.09], [0.132, 0.092], [0.095, 0.05], [0.055, 0.016], [0, 0.014]], 36), new THREE.MeshStandardMaterial({ name: 'BowlCeramic', color: 0xe9e2d2, roughness: 0.25 }));
  bowl.castShadow = true; bowl.receiveShadow = true;
  g.add(bowl);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.137, 0.004, 6, 40).rotateX(Math.PI / 2).translate(0, 0.09, 0), new THREE.MeshStandardMaterial({ name: 'BowlRim', color: 0xd85a12, roughness: 0.3 }));
  g.add(rim);
  const R = rng(3609);
  const srcs = candyApi && candyApi.candyMeshes && candyApi.candyMeshes.length ? candyApi.candyMeshes : null;
  const fb = [rbox(0.07, 0.012, 0.03, 0.004), rbox(0.035, 0.018, 0.022, 0.008)];
  for (let i = 0; i < 26; i++) {
    const a = R() * Math.PI * 2, r = Math.sqrt(R()) * 0.1;
    const layer = Math.floor(i / 11);
    const m = srcs ? srcs[i % Math.min(8, srcs.length)].clone() : new THREE.Mesh(fb[i % 2], candyApi && candyApi.materials ? candyApi.materials.wrap : new THREE.MeshStandardMaterial({ color: 0xaa3322 }));
    m.position.set(Math.cos(a) * r, 0.03 + layer * 0.022 + (0.1 - r) * 0.25, Math.sin(a) * r);
    m.rotation.set((R() - 0.5) * 0.9, R() * 6.28, (R() - 0.5) * 0.9);
    m.castShadow = true;
    g.add(m);
  }
  g.position.copy(anchor.position);
  if (anchor.quaternion) g.quaternion.copy(anchor.quaternion);
  return { group: g };
}

// ---------------------------------------------------------------------------------------------------------------
// RECYCLING TOTER (blue, wheeled, hinged lid) knocked over at binKnock; bottles/cans roll into the NW gutter.
// lofted rounded-rectangle shell through sections [{y, w, d, r}], open top; outward normals; uv = (around, y)
function toterBodyGeometry(sections, seg = 5) {
  const pos = [], idx = [], uvs = [];
  const perim = (w, d, r) => {
    const pts = [];
    const cx = [w / 2 - r, -w / 2 + r, -w / 2 + r, w / 2 - r], cz = [d / 2 - r, d / 2 - r, -d / 2 + r, -d / 2 + r];
    for (let c = 0; c < 4; c++) for (let s2 = 0; s2 <= seg; s2++) { const a = (c * Math.PI) / 2 + (s2 / seg) * (Math.PI / 2); pts.push([cx[c] + Math.cos(a) * r, cz[c] + Math.sin(a) * r]); }
    return pts;
  };
  const P = perim(1, 1, 0.1).length;
  for (const sec of sections) {
    const ring = perim(sec.w, sec.d, sec.r);
    ring.forEach(([x, z], i) => { pos.push(x, sec.y, z); uvs.push(i / P * 2.6, sec.y); });
  }
  for (let k = 0; k < sections.length - 1; k++) for (let i = 0; i < P; i++) {
    const a = k * P + i, b = k * P + ((i + 1) % P), c = (k + 1) * P + i, d = (k + 1) * P + ((i + 1) % P);
    idx.push(a, c, b, b, c, d);
  }
  const ci = pos.length / 3; pos.push(0, sections[0].y, 0); uvs.push(0.5, 0);
  for (let i = 0; i < P; i++) idx.push(ci, i, (i + 1) % P);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
function toterGrimeTexture() {
  return canvasTexture('toterGrime', 512, 256, (g, w, h) => {
    const R = rng(77);
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    // dirt band toward the bottom (v=0 is the bottom: canvas bottom), splashes, scuffs
    const gr = g.createLinearGradient(0, h, 0, h * 0.55);
    gr.addColorStop(0, 'rgba(70,60,45,0.55)'); gr.addColorStop(1, 'rgba(70,60,45,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(${40 + R() * 40},${36 + R() * 30},${30 + R() * 20},${0.1 + R() * 0.3})`; g.fillRect(R() * w, h * (0.5 + 0.5 * R()), 1 + R() * 3, 1 + R() * 3); }
    for (let i = 0; i < 26; i++) { g.strokeStyle = `rgba(230,235,240,${0.1 + R() * 0.2})`; g.lineWidth = 1; const x = R() * w, y = R() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R() - 0.5) * 40, y + (R() - 0.5) * 8); g.stroke(); }
    // generic recycling arrows decal (white, worn) on the front face area
    g.save(); g.translate(w * 0.13, h * 0.42); g.strokeStyle = 'rgba(240,240,236,0.75)'; g.lineWidth = 7;
    for (let k = 0; k < 3; k++) { g.rotate((Math.PI * 2) / 3); g.beginPath(); g.moveTo(-14, 22); g.lineTo(14, 22); g.stroke(); g.beginPath(); g.moveTo(14, 22); g.lineTo(6, 14); g.moveTo(14, 22); g.lineTo(6, 30); g.stroke(); }
    g.restore();
  }, { wrap: true });
}
function bottleGeo(kind) {
  if (kind === 'can') return lathe([[0, 0], [0.028, 0], [0.033, 0.01], [0.033, 0.11], [0.027, 0.122], [0.025, 0.124], [0, 0.124]], 18);
  if (kind === 'plastic') return lathe([[0, 0], [0.033, 0], [0.036, 0.02], [0.034, 0.12], [0.036, 0.15], [0.016, 0.2], [0.012, 0.22], [0, 0.22]], 16);
  return lathe([[0, 0], [0.03, 0], [0.031, 0.01], [0.031, 0.15], [0.026, 0.18], [0.012, 0.215], [0.012, 0.24], [0.014, 0.245], [0, 0.245]], 16);
}
export function buildToter(ctx) {
  const group = new THREE.Group(); group.name = 'RecyclingToter';
  const grime = toterGrimeTexture();
  const blue = new THREE.MeshStandardMaterial({ name: 'ToterBlue', color: 0x1f4f9e, map: grime, roughness: 0.62, side: THREE.DoubleSide });
  const blueLid = new THREE.MeshStandardMaterial({ name: 'ToterLid', color: 0x1d4893, roughness: 0.5 });
  const rubber = new THREE.MeshStandardMaterial({ name: 'ToterWheel', color: 0x121212, roughness: 0.85 });
  const hubMat = new THREE.MeshStandardMaterial({ name: 'ToterHub', color: 0x3a3a3a, roughness: 0.6 });
  const { w, d, h } = TOTER;
  const body = new THREE.Group();
  // tapered body with the stepped top band typical of wheeled carts (back = +x: wheels, axle, handle, hinge)
  const secs = [
    { y: 0.03, w: 0.47, d: 0.54, r: 0.07 }, { y: 0.1, w: 0.48, d: 0.56, r: 0.07 }, { y: 0.78, w: 0.55, d: 0.65, r: 0.07 },
    { y: 0.8, w: 0.585, d: 0.69, r: 0.07 }, { y: h - 0.05, w: w, d: d, r: 0.065 }, { y: h - 0.03, w: w + 0.012, d: d + 0.012, r: 0.07 },
  ];
  const bodyMesh = new THREE.Mesh(toterBodyGeometry(secs), blue);
  bodyMesh.castShadow = true; bodyMesh.receiveShadow = true;
  body.add(bodyMesh);
  // front vertical ribs + rim lip
  const ribs = [];
  for (const zz of [-0.16, 0.16]) ribs.push(xform(rbox(0.03, 0.62, 0.05, 0.012, 0, 0, 0), -0.262, 0.43, zz, 0, 0, 0.055));
  ribs.push(rbox(w + 0.03, 0.035, 0.035, 0.012, 0, h - 0.035, d / 2 + 0.005), rbox(w + 0.03, 0.035, 0.035, 0.012, 0, h - 0.035, -d / 2 - 0.005));
  ribs.push(rbox(0.035, 0.035, d + 0.03, 0.012, -w / 2 - 0.005, h - 0.035, 0));
  const ribMesh = new THREE.Mesh(merge(ribs), blueLid); ribMesh.castShadow = true; body.add(ribMesh);
  // wheels with tread blocks, axle, wheel wells
  const wheelGeo = (zc) => {
    const parts = [cyl(0.124, 0.124, 0.055, 0, 0, 0, Math.PI / 2, 0, 0, 24)];
    for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; parts.push(xform(new THREE.BoxGeometry(0.018, 0.012, 0.056), Math.cos(a) * 0.126, Math.sin(a) * 0.126, 0, 0, 0, a)); }
    return xform(merge(parts), w / 2 - 0.015, 0.125, zc);
  };
  const wheels = new THREE.Mesh(merge([wheelGeo(0.27), wheelGeo(-0.27), cyl(0.011, 0.011, 0.64, w / 2 - 0.015, 0.125, 0, Math.PI / 2, 0, 0, 8)]), rubber);
  wheels.castShadow = true; body.add(wheels);
  body.add(new THREE.Mesh(merge([cyl(0.06, 0.06, 0.06, w / 2 - 0.015, 0.125, 0.271, Math.PI / 2, 0, 0, 16), cyl(0.06, 0.06, 0.06, w / 2 - 0.015, 0.125, -0.271, Math.PI / 2, 0, 0, 16)]), hubMat));
  // handle bar on two bosses at the back top
  const handle = new THREE.Mesh(merge([cyl(0.018, 0.018, 0.52, w / 2 + 0.055, h - 0.04, 0, Math.PI / 2, 0, 0, 12), rbox(0.07, 0.06, 0.05, 0.015, w / 2 + 0.03, h - 0.045, 0.22), rbox(0.07, 0.06, 0.05, 0.015, w / 2 + 0.03, h - 0.045, -0.22)]), blueLid);
  handle.castShadow = true; body.add(handle);
  // lid, hinged at the back-top edge; slightly domed with a front grip lip
  const lidPivot = new THREE.Group(); lidPivot.position.set(w / 2 + 0.02, h - 0.012, 0); body.add(lidPivot);
  const lidGeo = merge([rbox(w + 0.07, 0.03, d + 0.06, 0.012, -(w + 0.07) / 2, 0.0, 0), rbox(w - 0.08, 0.02, d - 0.1, 0.01, -(w + 0.07) / 2, 0.022, 0), rbox(0.04, 0.05, d * 0.42, 0.01, -w - 0.06, -0.015, 0), cyl(0.016, 0.016, 0.1, 0, 0.0, 0.2, Math.PI / 2, 0, 0, 10), cyl(0.016, 0.016, 0.1, 0, 0.0, -0.2, Math.PI / 2, 0, 0, 10)]);
  const lid = new THREE.Mesh(lidGeo, blueLid);
  lid.castShadow = true; lidPivot.add(lid);
  // a bottle neck poking out under the lid (overfull), lid sits ajar a few degrees
  const neck = new THREE.Mesh(lathe([[0, 0], [0.03, 0], [0.031, 0.08], [0.012, 0.13], [0.012, 0.16], [0, 0.16]], 12), new THREE.MeshStandardMaterial({ name: 'BottleGreenNeck', color: 0x1c4a26, roughness: 0.1, transparent: true, opacity: 0.8 }));
  neck.position.set(-0.2, h - 0.12, 0.08); neck.rotation.set(0.35, 0, 0.9); body.add(neck);
  const LID_REST = -0.06;
  // generic sticker with the house number (hand-written)
  const sticker = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.08), new THREE.MeshStandardMaterial({ name: 'ToterSticker', map: canvasTexture('toterNum', 128, 96, (g, W2, H2) => { g.fillStyle = '#e8e4d8'; g.fillRect(0, 0, W2, H2); g.fillStyle = '#111'; g.font = 'bold 44px "DejaVu Sans", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('3610', W2 / 2, H2 / 2 + 2); }, { wrap: false }), roughness: 0.6 }));
  sticker.position.set(-0.27, h * 0.68, 0.0); sticker.rotation.y = -Math.PI / 2 - 0.06; body.add(sticker);
  // tip pivot at the back-bottom edge (x = +w/2)
  const tipPivot = new THREE.Group(); tipPivot.position.set(w / 2, 0, 0);
  body.position.set(-w / 2, 0, 0); tipPivot.add(body);
  group.add(tipPivot);
  // bottles and cans
  const glassG = new THREE.MeshStandardMaterial({ name: 'BottleGreen', color: 0x1c4a26, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.75 });
  const glassB = new THREE.MeshStandardMaterial({ name: 'BottleBrown', color: 0x4a2208, roughness: 0.08, transparent: true, opacity: 0.8 });
  const alu = new THREE.MeshStandardMaterial({ name: 'CanAlu', color: 0xb8bcc2, roughness: 0.3, metalness: 1 });
  const plastic = new THREE.MeshStandardMaterial({ name: 'BottlePlastic', color: 0xcfe3ea, roughness: 0.15, transparent: true, opacity: 0.5 });
  const items = toterSim.items.map((it, i) => {
    const mat = it.kind === 'can' ? alu : it.kind === 'plastic' ? plastic : i % 2 ? glassB : glassG;
    const m = new THREE.Mesh(bottleGeo(it.kind), mat);
    m.geometry.translate(0, -(it.kind === 'can' ? 0.062 : it.kind === 'plastic' ? 0.11 : 0.12), 0); // centre on its length
    m.castShadow = true;
    m.visible = false;
    group.add(m);
    return m;
  });
  // placement: PLACES.recyclingBin (parking lane); tip direction (+x local) = along the street toward E Venango
  // (world +Z), +z local = toward the NW curb (world -X). rotation.y = -PI/2 maps local +x -> +Z, +z -> -X.
  const wb = ctx.worldAnchor('recyclingBin');
  const bx = wb ? wb.position.x : PLACES.recyclingBin.x, bz = wb ? wb.position.z : PLACES.recyclingBin.z;
  group.position.set(bx, ctx.groundY(bx, bz), bz);
  group.rotation.y = -Math.PI / 2;
  const t0 = CUES.binKnock;
  const sampleHz = TOTER.sampleHz;
  const lerpTab = (tab, x) => { const n = tab.length; const f = clamp(x * sampleHz, 0, n - 1.001); const i = Math.floor(f), u = f - i; return tab[i] * (1 - u) + tab[i + 1] * u; };
  const qa = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2), qb = new THREE.Quaternion(), Yax = new THREE.Vector3(0, 1, 0);
  return {
    group,
    anchors: { recyclingBin: { position: group.position.clone(), quaternion: group.quaternion.clone(), tipDir: new THREE.Vector3(0, 0, 1), note: 'toter footprint centre; at binKnock it falls along the street toward E Venango (+Z, the retreat direction); clip its NE (-Z) side; bottles roll into the NW gutter' } },
    api: { group, impactTimes: binImpactTimes, knockTime: t0 },
    update(t) {
      const x = t - t0;
      const th = x <= 0 ? 0 : lerpTab(toterSim.body, x);
      // wobble just before the fall is fixed by the knock (none before t0)
      tipPivot.rotation.z = -th;
      lidPivot.rotation.z = LID_REST + (x <= 0 ? 0 : -lerpTab(toterSim.lid, x));
      neck.visible = x < 0.5;
      for (let i = 0; i < items.length; i++) {
        const it = toterSim.items[i];
        const tt = x - it.ts;
        const m = items[i];
        if (tt < 0) { m.visible = false; continue; }
        m.visible = true;
        const f = clamp(tt * sampleHz, 0, it.n - 1.001), k = Math.floor(f), u = f - k;
        const P = it.P, o = k * 5, o2 = o + 5;
        const px = P[o] * (1 - u) + P[o2] * u, py = P[o + 1] * (1 - u) + P[o2 + 1] * u, pz = P[o + 2] * (1 - u) + P[o2 + 2] * u;
        const roll = P[o + 3] * (1 - u) + P[o2 + 3] * u, hd = P[o + 4] * (1 - u) + P[o2 + 4] * u;
        // local toter frame -> group frame (group already rotated); bottle lies on its side, axis perpendicular to heading
        const wx = px, wz = pz;
        const gx = group.position.x - wz, gz = group.position.z + wx; // rotation.y = -PI/2: local (x,z) -> world (-z, x)
        m.position.set(wx, 0, wz);
        m.position.y = Math.max(0, py) + it.rad + (ctx.groundY(gx, gz) - group.position.y);
        // lathe axis (Y) -> lying along (-sin hd, 0, cos hd), i.e. perpendicular to the rolling direction
        qb.setFromAxisAngle(Yax, -hd + Math.PI / 2);
        m.quaternion.copy(qb).multiply(qa);
        m.rotateY(roll);
      }
    },
  };
}

// ---------------------------------------------------------------------------------------------------------------
// CURTAIN in the 3605 upstairs front window (SE side, world anchor win_3605_u1, the game's SM_R_WinDH_Oriel):
// a dimly lamp-lit room; at curtainMove a hand pulls the curtain aside and a dark figure stands behind it.
// If the world leaves the window see-through, a real room sits behind the glass. Otherwise (the world's opaque
// night glass is in place) each glass pane gets its own thin layered set just in front of the world's glass:
// lamp glow, figure, curtain, hand, clear glass - cut to the pane so the game's sash bars stay in front.
function lampGlowTexture() {
  return canvasTexture('curtainGlow', 256, 512, (g, w, h) => {
    const gr = g.createRadialGradient(w * 0.32, h * 0.82, 10, w * 0.4, h * 0.65, h * 0.75);
    gr.addColorStop(0, '#ffcf8a'); gr.addColorStop(0.35, '#d9904a'); gr.addColorStop(1, '#3a2010');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }, { wrap: false });
}
function silhouetteTexture() {
  return canvasTexture('silhouette', 256, 512, (g, w, h) => {
    const R = rng(4747);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const q = c.getContext('2d');
    q.fillStyle = '#070504';
    // head tilted, uneven, with ragged hair; a neck; one shoulder lower than the other; arms hanging
    q.save(); q.translate(w * 0.52, h * 0.235); q.rotate(0.16);
    q.beginPath();
    for (let a = 0; a <= 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      const hair = t > Math.PI * 1.05 && t < Math.PI * 1.95 ? 1 + 0.12 * Math.abs(Math.sin(t * 9 + R())) + 0.05 * R() : 1;
      const rx = w * 0.135 * hair, ry = h * 0.1 * hair * (t > 0.2 && t < 2.9 ? 1.08 : 1);
      q.lineTo(Math.cos(t) * rx, Math.sin(t) * ry);
    }
    q.closePath(); q.fill();
    q.restore();
    q.beginPath(); q.moveTo(w * 0.44, h * 0.31); q.lineTo(w * 0.6, h * 0.31); q.lineTo(w * 0.62, h * 0.37);
    q.quadraticCurveTo(w * 0.93, h * 0.385, w * 0.97, h * 0.58); q.lineTo(w * 0.99, h); q.lineTo(w * 0.01, h); q.lineTo(w * 0.04, h * 0.62);
    q.quadraticCurveTo(w * 0.07, h * 0.43, w * 0.4, h * 0.375); q.closePath(); q.fill();
    // soft edges (a backlit figure a step behind the glass is slightly out of focus)
    g.clearRect(0, 0, w, h);
    g.filter = 'blur(2.5px)'; g.drawImage(c, 0, 0); g.filter = 'none';
    // faint warm rim on the lamp side (left)
    g.globalCompositeOperation = 'source-atop';
    const gr = g.createLinearGradient(0, 0, w * 0.5, 0); gr.addColorStop(0, 'rgba(120,70,30,0.55)'); gr.addColorStop(0.18, 'rgba(60,30,12,0.15)'); gr.addColorStop(0.4, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'source-over';
  }, { wrap: false });
}
export function buildCurtain(ctx) {
  const win = findItem('SM_R_WinDH_Oriel', 12.17, 1) || HERO.win3605a;
  const group = new THREE.Group(); group.name = 'Curtain3605';
  placeOnKit(group, win);            // local +Z = street (-X world), y from the sill, x across the window
  const inside = !!(ctx.open && ctx.open.win3605u1);
  const glowTex = lampGlowTexture(), figTex = silhouetteTexture();
  const glowMat = new THREE.MeshStandardMaterial({ name: 'CurtainRoomGlow', color: 0x000000, emissive: 0xffffff, emissiveMap: glowTex, emissiveIntensity: 0.8 });
  const figMat = new THREE.MeshBasicMaterial({ name: 'Silhouette', map: figTex, transparent: true, depthWrite: false, color: 0xffffff });
  const curtainMat = new THREE.MeshStandardMaterial({ name: 'Curtain3605', color: 0xcbbfa8, roughness: 0.95, side: THREE.DoubleSide, emissive: 0x8a6038, emissiveIntensity: 0.6 });
  const handMat = new THREE.MeshBasicMaterial({ name: 'HandSil', color: 0x050403, transparent: true, alphaTest: 0.3, map: canvasTexture('handSil', 64, 128, (g, w, h) => { g.fillStyle = '#050403'; g.beginPath(); g.ellipse(w / 2, h * 0.62, w * 0.36, h * 0.25, 0, 0, 7); g.fill(); for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(w * (0.22 + i * 0.18), h * 0.3, w * 0.075, h * 0.19, (i - 1.5) * 0.08, 0, 7); g.fill(); } }, { wrap: false }) });
  const glassMat = makeGlass({ name: 'Glass3605Up', grime: 0.45, opacity: 0.12, metres: [0.5, 0.55], envMap: ctx.envMap });
  // window-local pane rectangles of SM_R_WinDH_Oriel (x across, y up from the sill, z = glass depth)
  const PANES = inside
    ? [{ x0: -0.25, x1: 0.25, y0: 0.11, y1: 1.2, z: -0.3 }]
    : [{ x0: -0.244, x1: 0.244, y0: 0.116, y1: 0.629, z: -0.146 }, { x0: -0.244, x1: 0.244, y0: 0.658, y1: 1.189, z: -0.116 }];
  const WX0 = -0.25, WX1 = 0.25, WY0 = 0.11, WY1 = 1.2;      // the curtain/figure image space (whole glazing)
  const curtains = [];
  if (inside) {
    const wall = new THREE.MeshStandardMaterial({ name: 'Room3605Up', color: 0x2a2622, roughness: 1 });
    group.add(new THREE.Mesh(merge([box(3.0, 2.6, 0.05, 0, 0.9, -3.2), box(0.05, 2.6, 3.0, -1.4, 0.9, -1.7), box(0.05, 2.6, 3.0, 1.4, 0.9, -1.7)]), wall));
    const back = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.4), glowMat); back.position.set(0.3, 0.6, -3.1); group.add(back);
  }
  for (const P of PANES) {
    const pw = P.x1 - P.x0, ph = P.y1 - P.y0, cx = (P.x0 + P.x1) / 2, cy = (P.y0 + P.y1) / 2;
    const dz = inside ? [ -2.9, -0.9, -0.3, -0.27, -0.12 ] : [ 0, 0.0025, 0.005, 0.0068, 0.0085 ];  // glow, figure, curtain, hand, glass
    if (!inside) { const glow = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), glowMat); glow.position.set(cx, cy, P.z + dz[0]); group.add(glow); }
    // figure: sub-rectangle of the silhouette image mapped onto this pane
    const fg = new THREE.PlaneGeometry(pw, ph);
    const fuv = fg.attributes.uv, fp = fg.attributes.position;
    for (let i = 0; i < fuv.count; i++) {
      const x = cx + fp.getX(i), y = cy + fp.getY(i);
      fuv.setXY(i, (x - (WX0 - 0.06)) / (WX1 - WX0 + 0.12), (y - (WY0 - 0.25)) / (WY1 - WY0 + 0.25));
    }
    const fig = new THREE.Mesh(fg, figMat); fig.position.set(cx, cy, inside ? -0.9 : P.z + dz[1]); fig.name = 'CurtainFigure'; group.add(fig);
    // curtain piece over this pane, deformed in window coordinates
    const cg = new THREE.PlaneGeometry(pw, ph, 20, 8);
    cg.translate(cx, cy, 0);
    const base = cg.attributes.position.array.slice();
    const cm = new THREE.Mesh(cg, curtainMat); cm.position.z = inside ? -0.3 : P.z + dz[2]; group.add(cm);
    curtains.push({ geo: cg, base, P });
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), glassMat); gl.position.set(cx, cy, inside ? -0.12 : P.z + dz[4]); gl.renderOrder = 2; group.add(gl);
  }
  // the hand pulling the curtain's edge (in the upper pane)
  const up = PANES[PANES.length - 1];
  const hand = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.14), handMat);
  hand.position.set(0.15, 0.86, inside ? -0.27 : up.z + 0.0068); group.add(hand);
  const figs = []; group.traverse((o) => { if (o.name === 'CurtainFigure') figs.push(o); });
  const figX0 = figs.map((f) => f.position.x);
  group.updateMatrixWorld(true);
  const centre = group.localToWorld(new THREE.Vector3(0, 0.65, -0.1));
  return {
    group,
    anchors: { curtainWindow: { position: centre, quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, kitRotY(win), 0)), window: 'win_3605_u1', note: '3605 upstairs front window (SE side, world anchor win_3605_u1): lamp-lit; curtain pulled aside at CUES.curtainMove, dark figure behind' } },
    api: { group, figures: figs, openAt: curtainOpen, window: 'win_3605_u1' },
    update(t) {
      const o = curtainOpen(t);
      const pull = o * 0.36;                          // the curtain gathers toward the left jamb
      for (const c of curtains) {
        const pos = c.geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const bx = c.base[i * 3], by = c.base[i * 3 + 1];
          const u = (bx - WX0) / (WX1 - WX0);
          const k = smoothstep(0.25, 1.0, u) * (0.75 + 0.25 * (by - WY0) / (WY1 - WY0));
          const nx = Math.max(c.P.x0, bx - pull * k);
          pos.setXYZ(i, nx, by, 0.0008 * Math.sin(bx * 90) * (1 + o * 3));
        }
        pos.needsUpdate = true;
      }
      hand.visible = o > 0.04;
      hand.position.x = 0.17 - pull * 0.95;
      // the figure barely shifts its weight while it is exposed (subtle, deterministic)
      const sway = 0.012 * Math.sin((t - 47.5) * 1.3) * o;
      for (let i = 0; i < figs.length; i++) figs[i].position.x = figX0[i] + sway;
    },
  };
}
