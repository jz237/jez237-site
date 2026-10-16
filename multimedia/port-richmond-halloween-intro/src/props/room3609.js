// The 3609 Witte St front room: the refuge of scare three. Built in the 3609 door's kit frame:
//   local +Z = toward the street (front wall interior face at z = -0.25), local +X = toward E Venango
//   (world +Z), y = 0 at the door threshold. Room: x in [XL, XR] (~4.27 m), z in [BW, FW] (6.4 m), ceiling 2.6 m.
// Critical staging: the hinge-side corner behind the open door (between the door and window b) stays empty for
// the crouching homeowner (anchor refugeCrouch).
import * as THREE from 'three';
import { HERO, placeOnKit, kitRotY } from './site.js';
import { CUES } from '../film/cues.js';
import { box, rbox, cyl, merge, wallWithHoles, xform, rod, mergeStatic } from './geo.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { wallpaperTexture, plasterTexture, woodFloorTexture, rugTexture } from './textures.js';
import { furnitureMaterials, sofa, armchair, coffeeTable, endTable, tableLamp, flatTV, tvStand, radiator, photoFrame, laceCurtain, doubleHungWindow } from './furniture.js';
import { kelvinRGB, smoothstep } from './util.js';
import { interiorize } from './interior.js';

export const ROOM3609 = { XL: -3.65, XR: 0.62, FW: -0.25, BW: -6.65, H: 2.6, floor: -0.012 };

// v2 layout (room-local; world x = 5.531 - z, world z = 3.629 + x). Sofa back plane at local z -2.22 (world x 7.75),
// seat front at -3.18 (world x 8.71); right end at local x -0.05 (world z 3.58) -> 0.67 m gap to the right wall.
export const ROOM3609_LAYOUT = {
  sofa: { len: 2.1, x: -1.10, z: -2.697, yScale: 1.07, depth: 0.954, backTop: 0.99 },
  strip: { x0: -2.05, x1: -0.12, z0: -3.18, z1: -3.98 },        // hidden floor strip in front of the seat
  gap: { x0: -0.05, x1: 0.62, z0: -2.22, z1: -3.18 },            // crawl gap at the sofa's right end
  lamp: { x: -2.45, z: -2.5 },                                   // end table + lamp at the far (left) end
  coffee: { x: -1.1, z: -4.38 },
  rug: { x: -1.45, z: -4.05, w: 1.8, d: 2.2 },                   // right edge at local x -0.55 (world z 3.08): clear of the path
  tv: { x: -0.08, z: -5.62, yaw: -0.336 },
  chair: { x: -2.78, z: -1.37, yaw: 2.55 },
  photo: { z: -1.42, y: 1.52, w: 0.3, h: 0.4 },                  // right wall, centre 1.52 m above the floor, world x 6.95
};

// The framed family photo: dark wood frame, cream mat, the homeowner's portrait (assets/creatures/portrait_homeowner.jpg,
// made by the CREATURES agent; a neutral placeholder until it exists - reload-safe), glass with a faint reflection.
// Built facing +Z in its own frame.
function photoPlaceholder() {
  const c = document.createElement('canvas'); c.width = 240; c.height = 320;
  const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 320); gr.addColorStop(0, '#7d6f5e'); gr.addColorStop(1, '#4e443a');
  g.fillStyle = gr; g.fillRect(0, 0, 240, 320);
  g.filter = 'blur(6px)';
  g.fillStyle = '#a89a88'; g.beginPath(); g.ellipse(120, 300, 92, 90, 0, 0, Math.PI * 2); g.fill();      // shoulders
  g.fillStyle = '#c8b9a6'; g.beginPath(); g.ellipse(120, 150, 46, 58, 0, 0, Math.PI * 2); g.fill();      // face
  g.fillStyle = '#d8d4cc'; g.beginPath(); g.ellipse(120, 112, 58, 40, 0, Math.PI, 0); g.fill();          // grey hair
  g.fillStyle = '#c86a22'; g.beginPath(); g.ellipse(150, 282, 34, 26, 0, 0, Math.PI * 2); g.fill();      // the pumpkin she holds
  g.filter = 'none';
  const vg = g.createRadialGradient(120, 160, 60, 120, 160, 200); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,12,6,0.55)');
  g.fillStyle = vg; g.fillRect(0, 0, 240, 320);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function buildFamilyPhoto(ctx, L) {
  const g = new THREE.Group(); g.name = 'FamilyPhoto3609';
  const fm = furnitureMaterials();
  const W = L.w, H = L.h, b = 0.032, mat = 0.045;
  const frame = new THREE.Mesh(merge([box(W + 2 * b, b, 0.026, 0, H / 2 + b / 2, 0.013), box(W + 2 * b, b, 0.026, 0, -H / 2 - b / 2, 0.013),
    box(b, H, 0.026, -W / 2 - b / 2, 0, 0.013), box(b, H, 0.026, W / 2 + b / 2, 0, 0.013), box(W + 0.01, H + 0.01, 0.006, 0, 0, 0.003)]), fm.frameWood);
  frame.castShadow = true; frame.receiveShadow = true; frame.name = 'FamilyPhotoFrame';
  g.add(frame);
  const matMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshStandardMaterial({ name: 'PhotoMat', color: 0xe8dfcc, roughness: 0.9 }));
  matMesh.position.z = 0.0075; g.add(matMesh);
  const picMat = new THREE.MeshStandardMaterial({ name: 'FamilyPhotoPrint', map: photoPlaceholder(), roughness: 0.35 });
  const pw = W - 2 * mat, ph = H - 2 * mat;
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), picMat);
  pic.position.z = 0.0085; pic.name = 'FamilyPhotoPrint'; g.add(pic);
  // glass: faint env reflection + a soft diagonal sheen (reads as glass over the print from the floor)
  const sheen = document.createElement('canvas'); sheen.width = 64; sheen.height = 64;
  { const s = sheen.getContext('2d'); const gr = s.createLinearGradient(0, 64, 64, 0); gr.addColorStop(0.0, 'rgba(255,255,255,0)'); gr.addColorStop(0.42, 'rgba(255,255,255,0)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.62, 'rgba(255,255,255,0.15)'); gr.addColorStop(0.75, 'rgba(255,255,255,0.5)'); gr.addColorStop(0.8, 'rgba(255,255,255,0)'); s.fillStyle = gr; s.fillRect(0, 0, 64, 64); }
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshPhysicalMaterial({ name: 'PhotoGlass', color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.07, depthWrite: false, envMapIntensity: 1.4 }));
  glass.position.z = 0.012; glass.renderOrder = 3; g.add(glass);
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ name: 'PhotoGlassSheen', map: new THREE.CanvasTexture(sheen), transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, color: new THREE.Color(1.0, 0.85, 0.65) }));
  sh.position.z = 0.0125; sh.renderOrder = 4; g.add(sh);
  // the real portrait, when the CREATURES agent has written it (a missing file just keeps the placeholder)
  const url = new URL('../../assets/creatures/portrait_homeowner.jpg', import.meta.url).href;
  const state = { loaded: false };
  // (lead) `ready` resolves once the portrait is in (or definitely missing), so main.js can await it before
  // __ready: capture renders must not show the placeholder by timing luck
  let done; state.ready = new Promise((r) => { done = r; });
  if (typeof fetch === 'function') {
    fetch(url, { method: 'HEAD', cache: 'no-store' }).then((r) => {
      if (!r.ok) { done(false); return; }
      new THREE.TextureLoader().load(url + '?v=' + (r.headers.get('last-modified') || '').replace(/\W/g, ''), (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
        const ia = tex.image.width / tex.image.height, fa = pw / ph;   // cover-fit into the mat opening
        if (ia > fa) { tex.repeat.set(fa / ia, 1); tex.offset.set((1 - fa / ia) / 2, 0); } else { tex.repeat.set(1, ia / fa); tex.offset.set(0, (1 - ia / fa) / 2); }
        picMat.map = tex; picMat.needsUpdate = true; state.loaded = true; done(true);
      }, undefined, () => done(false));
    }).catch(() => done(false));
  } else done(false);
  g.userData.noMerge = true;
  return { group: g, picture: pic, state, size: [W + 2 * b, H + 2 * b] };
}

export function buildRoom3609(ctx) {
  const { XL, XR, FW, BW, H } = ROOM3609;
  const it = HERO.door3609;
  const group = new THREE.Group();
  group.name = 'Room3609';
  placeOnKit(group, it);
  const fm = furnitureMaterials();

  // ---- materials ----
  const wpTex = wallpaperTexture().clone(); wpTex.needsUpdate = true; wpTex.repeat.set(1 / 0.62, 1 / 0.62);
  const wallpaper = new THREE.MeshStandardMaterial({ name: 'Wallpaper3609', map: wpTex, roughness: 0.85, side: THREE.FrontSide });
  const plTex = plasterTexture('plaster3609', '#d9d2c2').clone(); plTex.needsUpdate = true; plTex.repeat.set(0.6, 0.6);
  const ceilingMat = new THREE.MeshStandardMaterial({ name: 'Ceiling3609', map: plTex, roughness: 0.95 });
  const flTex = woodFloorTexture().clone(); flTex.needsUpdate = true; flTex.repeat.set(1, 1);
  const floorMat = new THREE.MeshStandardMaterial({ name: 'Floor3609', map: flTex, roughness: 0.42 });
  const rugMat = new THREE.MeshStandardMaterial({ name: 'Rug3609', map: rugTexture(), roughness: 0.97 });
  const trim = fm.paintWhite;
  const darkVoid = new THREE.MeshStandardMaterial({ name: 'Void', color: 0x020202, roughness: 1 });

  const shell = [];  // wallpaper surfaces
  const add = (geo, mat, { cast = true, recv = true, name } = {}) => { const m = new THREE.Mesh(geo, mat); m.castShadow = cast; m.receiveShadow = recv; if (name) m.name = name; group.add(m); return m; };

  // ---- floor / ceiling ----
  const floorGeo = new THREE.PlaneGeometry(XR - XL, FW - BW + 0.25);
  floorGeo.rotateX(-Math.PI / 2);
  { const uv = floorGeo.attributes.uv, p = floorGeo.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getZ(i), p.getX(i)); }
  floorGeo.translate((XL + XR) / 2, ROOM3609.floor, (FW + 0.25 + BW) / 2 - 0.125);
  add(floorGeo, floorMat, { cast: false, name: 'Floor3609' });
  // ceiling with the stairwell opening (x in [XL, XL+1.0], z in [BW, -4.25])
  const ceilShape = wallWithHoles(XL, BW, XR, FW, [[XL + 0.001, BW + 0.001, XL + 1.0, -4.25]]);
  ceilShape.rotateX(Math.PI / 2); // shape XY -> XZ (shape y becomes z), facing -Y (down)
  ceilShape.translate(0, H, 0);
  add(ceilShape, ceilingMat, { name: 'Ceiling3609' });

  // ---- walls ----
  // front wall (interior face at z=FW, facing -Z/into the room). Shape in its own XY with x mirrored.
  const wa = HERO.win3609a, wb = HERO.win3609b;
  const winX = (w) => (w.p[2] - it.p[2]);           // world z offset -> local x (kit frame is ~axis aligned)
  const xa = winX(wa), xb = winX(wb);
  const sillY = wa.p[1] - it.p[1];                  // 0.90
  const holes = [[xa - 0.43, sillY, xa + 0.43, sillY + 1.4], [xb - 0.43, sillY, xb + 0.43, sillY + 1.4], [-0.5, 0, 0.5, 2.1]];
  const fwGeo = wallWithHoles(-XR, 0, -XL, H, holes.map(([a, b, c, d]) => [-c, b, -a, d]));
  fwGeo.rotateY(Math.PI); fwGeo.translate(0, 0, FW);
  add(fwGeo, wallpaper, { name: 'FrontWall3609' });
  // reveals through the inner part of the wall (z from FW to -0.18) for the windows
  const rv = [];
  for (const [a, b, c, d] of holes.slice(0, 2)) {
    rv.push(box(c - a, 0.001, 0.07, (a + c) / 2, b, -0.215), box(c - a, 0.001, 0.07, (a + c) / 2, d, -0.215));
    rv.push(box(0.001, d - b, 0.07, a, (b + d) / 2, -0.215), box(0.001, d - b, 0.07, c, (b + d) / 2, -0.215));
    // window stool (interior sill board) + casing
    rv.push(box(c - a + 0.12, 0.025, 0.12, (a + c) / 2, b - 0.012, FW - 0.03));
    rv.push(box(c - a + 0.1, 0.07, 0.015, (a + c) / 2, d + 0.035, FW - 0.008));
    rv.push(box(0.06, d - b, 0.015, a - 0.03, (b + d) / 2, FW - 0.008), box(0.06, d - b, 0.015, c + 0.03, (b + d) / 2, FW - 0.008));
  }
  add(merge(rv), trim, { name: 'WindowTrim3609' });
  // party walls
  const lw = new THREE.PlaneGeometry(FW - BW, H); lw.rotateY(Math.PI / 2); lw.translate(XL, H / 2, (FW + BW) / 2);
  { const uv = lw.attributes.uv, p = lw.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getZ(i), p.getY(i)); }
  add(lw, wallpaper, { name: 'LeftWall3609' });
  const rw = new THREE.PlaneGeometry(FW - BW, H); rw.rotateY(-Math.PI / 2); rw.translate(XR, H / 2, (FW + BW) / 2);
  { const uv = rw.attributes.uv, p = rw.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getZ(i), p.getY(i)); }
  add(rw, wallpaper, { name: 'RightWall3609' });
  // back wall with the kitchen doorway
  const kx0 = -1.55, kx1 = -0.7, kh = 2.05;
  const bwGeo = wallWithHoles(XL, 0, XR, H, [[kx0, 0, kx1, kh]]);
  bwGeo.translate(0, 0, BW);
  add(bwGeo, wallpaper, { name: 'BackWall3609' });
  // walls are thick enough to cast shadows (keep the lamp light inside): outer skins, dark, back-side
  const skin = [];
  skin.push(box(XR - XL + 0.5, H + 0.4, 0.05, (XL + XR) / 2, H / 2, BW - 0.15));
  skin.push(box(0.05, H + 0.4, FW - BW + 0.3, XL - 0.06, H / 2, (FW + BW) / 2));
  skin.push(box(0.05, H + 0.4, FW - BW + 0.3, XR + 0.06, H / 2, (FW + BW) / 2));
  skin.push(box(XR - XL + 0.5, 0.05, FW - BW + 0.4, (XL + XR) / 2, H + 0.3, (FW + BW) / 2));
  const skinMesh = add(merge(skin), darkVoid, { recv: false, name: 'Shell3609' });
  skinMesh.material = darkVoid;
  // front wall shadow skin (with holes), just behind the facade so street light enters only via the openings
  const fsk = wallWithHoles(-XR - 0.2, -0.05, -XL + 0.2, H + 0.3, holes.map(([a, b, c, d]) => [-c, b, -a, d]));
  fsk.rotateY(Math.PI); fsk.translate(0, 0, -0.205);
  const fskMesh = add(fsk, darkVoid, { recv: false, name: 'FrontSkin3609' });
  fskMesh.material = new THREE.MeshStandardMaterial({ color: 0x050505, side: THREE.DoubleSide, colorWrite: false, depthWrite: false });
  fskMesh.castShadow = true;

  // baseboards + chair-rail-free plaster corners
  const bb = [];
  const bh = 0.13, bt = 0.018;
  bb.push(box(FW - BW, bh, bt, XL + bt / 2, bh / 2, (FW + BW) / 2, 0, Math.PI / 2, 0));
  bb.push(box(FW - BW - 1.4, bh, bt, XR - bt / 2, bh / 2, (FW + BW) / 2 - 0.7, 0, Math.PI / 2, 0));
  bb.push(box(kx0 - XL, bh, bt, (XL + kx0) / 2, bh / 2, BW + bt / 2));
  bb.push(box(XR - kx1, bh, bt, (kx1 + XR) / 2, bh / 2, BW + bt / 2));
  bb.push(box(-0.5 - XL, bh, bt, (XL - 0.5) / 2, bh / 2, FW - bt / 2));
  // kitchen doorway casing
  bb.push(box(0.07, kh + 0.04, 0.016, kx0 - 0.035, (kh + 0.04) / 2, BW + 0.008), box(0.07, kh + 0.04, 0.016, kx1 + 0.035, (kh + 0.04) / 2, BW + 0.008), box(kx1 - kx0 + 0.14, 0.08, 0.016, (kx0 + kx1) / 2, kh + 0.04, BW + 0.008));
  // crown-ish ceiling trim
  bb.push(box(FW - BW, 0.05, 0.03, XR - 0.015, H - 0.025, (FW + BW) / 2, 0, Math.PI / 2, 0));
  add(merge(bb), trim, { name: 'Trim3609' });

  // ---- stairs along the left (3611) party wall, rising toward the back ----
  const st = { x0: XL, x1: XL + 0.92, z0: -3.2, n: 14, rise: 2.85 / 14, run: 0.235 };
  const treads = [], risers = [], skirt = [];
  for (let i = 0; i < st.n; i++) {
    const zf = st.z0 - i * st.run;           // front edge of tread i (top at (i+1)*rise)
    const y = (i + 1) * st.rise;
    if (i < st.n - 1) treads.push(box(st.x1 - st.x0, 0.03, st.run + 0.025, (st.x0 + st.x1) / 2, y - 0.015, zf - st.run / 2 + 0.0125));
    risers.push(box(st.x1 - st.x0, st.rise, 0.02, (st.x0 + st.x1) / 2, y - st.rise / 2, zf + 0.01));
  }
  add(merge(treads), fm.wood, { name: 'StairTreads3609' });
  add(merge(risers), trim, { name: 'StairRisers3609' });
  // closed side under the stairs (triangular skirt wall) + stringer
  const sk = new THREE.Shape();
  sk.moveTo(0, 0); sk.lineTo(st.n * st.run, 0); sk.lineTo(st.n * st.run, st.n * st.rise); sk.lineTo(0, st.rise * 0.5); sk.lineTo(0, 0);
  const skGeo = new THREE.ShapeGeometry(sk);
  skGeo.rotateY(Math.PI / 2); // shape x -> -z
  skGeo.translate(st.x1, 0, st.z0);
  add(skGeo, wallpaper, { name: 'StairSkirt3609' });
  const strA = new THREE.Vector3(st.x1 + 0.02, st.rise * 0.6, st.z0 + 0.05), strB = new THREE.Vector3(st.x1 + 0.02, st.n * st.rise + 0.05, st.z0 - st.n * st.run);
  skirt.push(rod(strA, strB, 0.05, 4));
  add(merge(skirt), trim, { name: 'Stringer3609' });
  // handrail, balusters, newel
  const hr = [], bal = [];
  const hA = new THREE.Vector3(st.x1 - 0.03, 0.95, st.z0 - 0.05), hB = new THREE.Vector3(st.x1 - 0.03, st.n * st.rise + 0.9, st.z0 - st.n * st.run);
  hr.push(rod(hA, hB, 0.028, 10));
  for (let i = 0; i < st.n - 1; i++) {
    const zf = st.z0 - i * st.run - st.run * 0.5;
    const y = (i + 1) * st.rise;
    const top = 0.95 + (hB.y - hA.y) * ((st.z0 - 0.05 - zf) / (hA.z - hB.z));
    bal.push(cyl(0.013, 0.013, top - y, st.x1 - 0.03, y + (top - y) / 2, zf, 0, 0, 0, 8));
  }
  add(merge(hr), fm.wood, { name: 'Handrail3609' });
  add(merge(bal), trim, { name: 'Balusters3609' });
  const newel = add(merge([box(0.1, 1.05, 0.1, st.x1 - 0.03, 0.525, st.z0 + 0.02), box(0.13, 0.04, 0.13, st.x1 - 0.03, 1.07, st.z0 + 0.02), xform(new THREE.SphereGeometry(0.045, 14, 10), st.x1 - 0.03, 1.12, st.z0 + 0.02)]), fm.wood, { name: 'Newel3609' });
  void newel;
  // upper landing void (dark) above the stairwell
  add(box(1.2, 0.02, 2.6, XL + 0.6, st.n * st.rise, BW + 1.2), darkVoid, { name: 'UpperLanding3609' });
  add(box(1.3, 2.2, 0.05, XL + 0.65, H + 1.1, -4.2), darkVoid, { name: 'UpperWall3609' });

  // ---- kitchen beyond the back doorway (dark, faint details) ----
  const kitchen = new THREE.Group(); kitchen.name = 'Kitchen3609';  // culled unless the camera is in the room
  group.add(kitchen);
  const kWall = new THREE.MeshStandardMaterial({ name: 'KitchenWall', color: 0x8b8a7a, roughness: 0.9 });
  const kFloor = new THREE.MeshStandardMaterial({ name: 'KitchenFloor', color: 0x5a5148, roughness: 0.6 });
  const kz0 = BW - 0.12, kz1 = BW - 2.1, kxl = -2.6, kxr = XR; // stays inside the 3609 shell (rear wall x ~14.6)
  const kgeo = [];
  kgeo.push(box(kxr - kxl, 0.02, kz0 - kz1, (kxl + kxr) / 2, -0.01, (kz0 + kz1) / 2));
  const kf = new THREE.Mesh(merge(kgeo), kFloor); kf.receiveShadow = true; kitchen.add(kf);
  const kw = [box(0.02, H, kz0 - kz1, kxl, H / 2, (kz0 + kz1) / 2), box(0.02, H, kz0 - kz1, kxr, H / 2, (kz0 + kz1) / 2), box(kxr - kxl, H, 0.02, (kxl + kxr) / 2, H / 2, kz1), box(kxr - kxl, 0.02, kz0 - kz1, (kxl + kxr) / 2, H, (kz0 + kz1) / 2)];
  kitchen.add(new THREE.Mesh(merge(kw), kWall));
  // counters + upper cabinets on the right, fridge at the back left
  const cab = new THREE.MeshStandardMaterial({ name: 'Cabinets', color: 0x6b5236, roughness: 0.6 });
  kitchen.add(new THREE.Mesh(merge([box(0.62, 0.9, 2.4, kxr - 0.31, 0.45, (kz0 + kz1) / 2 - 0.3), box(0.35, 0.7, 2.4, kxr - 0.18, 1.85, (kz0 + kz1) / 2 - 0.3)]), cab));
  kitchen.add(new THREE.Mesh(box(0.66, 0.03, 2.42, kxr - 0.31, 0.915, (kz0 + kz1) / 2 - 0.3), new THREE.MeshStandardMaterial({ name: 'Counter', color: 0x3c3a36, roughness: 0.35 })));
  kitchen.add(new THREE.Mesh(rbox(0.75, 1.75, 0.7, 0.03, kxl + 0.45, 0.875, kz1 + 0.4), new THREE.MeshStandardMaterial({ name: 'Fridge', color: 0xc9c6bc, roughness: 0.3 })));
  // back window (night) with blinds, faint cold glow
  const kwin = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.9), new THREE.MeshStandardMaterial({ name: 'KitchenWindow', color: 0x000000, emissive: 0x1a2a40, emissiveIntensity: 0.35, roughness: 1 }));
  kwin.position.set(-0.9, 1.45, kz1 + 0.012); kitchen.add(kwin);
  const blinds = [];
  for (let i = 0; i < 16; i++) blinds.push(box(0.84, 0.008, 0.035, -0.9, 1.04 + i * 0.055, kz1 + 0.04, 0.6, 0, 0));
  kitchen.add(new THREE.Mesh(merge(blinds), new THREE.MeshStandardMaterial({ name: 'Blinds', color: 0x9c968a, roughness: 0.7 })));
  // the stove clock: tiny green glow
  const clock = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.016), new THREE.MeshBasicMaterial({ color: 0x2bff6a }));
  clock.position.set(kxr - 0.62 - 0.001, 1.0, (kz0 + kz1) / 2 - 1.0); clock.rotation.y = -Math.PI / 2;
  kitchen.add(clock);

  // ---- furniture (v2 layout, the lead's scare-three decision; room-local: +X = world +Z = the RIGHT wall as
  // seen sitting against the door looking in, -Z = into the house). LAYOUT is exported (docs/props-notes.md). ----
  // The sofa floats mid-room with its back to the door (faces the TV at the back); its RIGHT end leaves a clear
  // ~0.67 m crawl gap to the right (3607 party) wall; the hidden strip is the floor in front of the seat; the lamp
  // stands at the far (left) end and rakes across toward the right wall; the family photo hangs on the right wall.
  const LAY = ROOM3609_LAYOUT;
  const sofaG = sofa(LAY.sofa.len); sofaG.scale.set(1, LAY.sofa.yScale, 1.06);
  sofaG.position.set(LAY.sofa.x, 0, LAY.sofa.z); sofaG.rotation.y = Math.PI; group.add(sofaG);
  const endT = endTable(0.5, 0.62); endT.position.set(LAY.lamp.x, 0, LAY.lamp.z); group.add(endT);
  const lamp = tableLamp(); lamp.group.scale.setScalar(1.12); lamp.group.position.set(LAY.lamp.x, 0.62, LAY.lamp.z); group.add(lamp.group);
  const lampBulbLocal = lamp.bulb.clone().multiplyScalar(1.12).add(lamp.group.position);
  const ct = coffeeTable(1.1, 0.55, 0.43); ct.position.set(LAY.coffee.x, 0, LAY.coffee.z); group.add(ct);
  const rugGeo = new THREE.PlaneGeometry(LAY.rug.w, LAY.rug.d); rugGeo.rotateX(-Math.PI / 2);
  const rug = new THREE.Mesh(rugGeo, rugMat); rug.position.set(LAY.rug.x, 0.004, LAY.rug.z); rug.receiveShadow = true; rug.name = 'Rug3609'; group.add(rug);
  // TV on its stand against the back part of the right wall, turned toward the sofa; it stays clear of the sight line
  // from the door to the kitchen doorway (R2)
  const stand = tvStand(1.0, 0.42, 0.5); stand.position.set(LAY.tv.x, 0, LAY.tv.z); stand.rotation.y = LAY.tv.yaw; group.add(stand);
  const tv = flatTV(); tv.group.position.set(LAY.tv.x, 0.5 + tv.group.userData.standOffset, LAY.tv.z); tv.group.rotation.y = LAY.tv.yaw; group.add(tv.group);
  const chair = armchair(); chair.position.set(LAY.chair.x, 0, LAY.chair.z); chair.rotation.y = LAY.chair.yaw; group.add(chair);
  const rad = radiator(0.76, 0.62); rad.position.set(xa, 0, FW - 0.11); group.add(rad);
  // other framed photos: climbing the stair wall (left), one on the TV stand
  const frames = [
    [0.3, 0.4, 4, XL + 0.012, 1.75, -3.9, Math.PI / 2], [0.4, 0.3, 5, XL + 0.012, 2.25, -4.9, Math.PI / 2], [0.26, 0.34, 3, XL + 0.012, 1.55, -1.6, Math.PI / 2],
  ];
  for (const [w, h, s, x, y, z, ry] of frames) { const f = photoFrame(w, h, s, s === 2); f.position.set(x, y, z); f.rotation.y = ry; group.add(f); }
  const smallFrame = photoFrame(0.13, 0.18, 6, true);
  smallFrame.position.copy(new THREE.Vector3(-0.32, 0.5 + 0.11, 0.05).applyAxisAngle(new THREE.Vector3(0, 1, 0), LAY.tv.yaw).add(new THREE.Vector3(LAY.tv.x, 0, LAY.tv.z)));
  smallFrame.rotation.set(-0.12, LAY.tv.yaw + 0.3, 0); group.add(smallFrame);
  // THE family photo (scare three, R4): right wall, readable from the floor at the door; glass with a faint reflection
  const fp = buildFamilyPhoto(ctx, LAY.photo);
  fp.group.position.set(XR - 0.003, LAY.photo.y, LAY.photo.z); fp.group.rotation.y = -Math.PI / 2; group.add(fp.group);
  // vinyl roller shades (pulled ~2/3 down) behind the lace, then lace curtains (rod + panel)
  const shadeMat = new THREE.MeshStandardMaterial({ name: 'RollerShade', color: 0xd9d2bf, roughness: 0.75, side: THREE.DoubleSide });
  for (const [x, drop] of [[xa, 0.92], [xb, 0.78]]) {
    add(box(0.9, drop, 0.004, x, sillY + 1.4 - drop / 2, FW - 0.02), shadeMat, { name: 'RollerShade3609' });
    add(merge([cyl(0.012, 0.012, 0.92, x, sillY + 1.4 - drop, FW - 0.022, 0, 0, Math.PI / 2, 8), cyl(0.022, 0.022, 0.94, x, sillY + 1.43, FW - 0.024, 0, 0, Math.PI / 2, 10)]), fm.paintWhite, { name: 'ShadeRoller3609' });
    add(new THREE.TorusGeometry(0.012, 0.002, 6, 16).translate(x, sillY + 1.4 - drop - 0.03, FW - 0.024), fm.brass, { cast: false });
  }
  for (const x of [xa, xb]) {
    const c = laceCurtain(0.98, 1.52, x > -2 ? 7 : 8); c.position.set(x, sillY + 1.52, FW - 0.06); group.add(c);
    add(cyl(0.008, 0.008, 1.1, x, sillY + 1.54, FW - 0.05, 0, 0, Math.PI / 2, 8), fm.brass, { cast: false });
  }
  // ceiling fixture (off) + smoke detector
  add(new THREE.SphereGeometry(0.16, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI).translate(-1.4, H, -2.6), new THREE.MeshStandardMaterial({ name: 'Globe', color: 0xd8d2c6, roughness: 0.2, transparent: true, opacity: 0.85 }), { cast: false });
  add(cyl(0.06, 0.06, 0.03, -1.6, H - 0.015, -4.4), trim, { cast: false });

  // the candy bowl lives on the coffee table (filled by the candy module through api.candyBowlAnchor)
  const candyBowlLocal = new THREE.Vector3(LAY.coffee.x + 0.18, 0.43, LAY.coffee.z + 0.04);

  // ---- the doorway's own windows (sashes + glass), the game kit also has WinDH_M here ----
  const glassMat = new THREE.MeshPhysicalMaterial({ name: 'Glass3609', color: 0xe4ecef, roughness: 0.04, transparent: true, opacity: 0.16, depthWrite: false, envMapIntensity: 1.2 });
  const sashes = [];
  [[wa, ctx.open.win3609a], [wb, ctx.open.win3609b]].forEach(([w, isOpen]) => {
    if (ctx.hasWorld && !isOpen) return;          // the world's opaque night glass + back cap is in place
    const win = doubleHungWindow(glassMat);
    if (ctx.hasWorld) { win.group.children[0].visible = false; } // world keeps frame + sashes: glass only
    placeOnKit(win.group, w);
    win.group.name = 'Sash3609';
    sashes.push(win.group);
  });

  // ---- lights ----
  const [lr, lg, lb] = kelvinRGB(2600);
  const lamp3609 = new THREE.PointLight(new THREE.Color(lr, lg, lb), 0, 7.5, 2);
  lamp3609.name = 'Lamp3609';
  const shadows = ctx.quality === 'high';   // lamp cube shadows on high only (geometry cost x6)
  lamp3609.castShadow = shadows;
  if (shadows) {
    const s = ctx.quality === 'high' ? 1024 : 512;
    lamp3609.shadow.mapSize.set(s, s);
    lamp3609.shadow.bias = -0.003;
    lamp3609.shadow.normalBias = 0.025;
    lamp3609.shadow.radius = 4;
    lamp3609.shadow.camera.near = 0.08;
    lamp3609.shadow.camera.far = 10;
  }
  const LAMP_CD = 22; // candela-ish (60-75 W bulb behind a shade); scaled by api.lightScale

  // street spill (cold) through the front windows during the refuge sequence: pool spot source
  group.updateMatrixWorld(true);
  const W = (x, y, z) => group.localToWorld(new THREE.Vector3(x, y, z));
  const spillPos = W((xa + xb) / 2 + 0.3, 3.4, 4.2), spillTarget = W((xa + xb) / 2 - 0.4, 0.0, -2.2);
  const fillPos = W(-1.6, 2.3, -2.8);
  lamp3609.position.copy(W(lampBulbLocal.x, lampBulbLocal.y, lampBulbLocal.z)); // world space: the pool owns the light
  const sources = [
    // Interior sources are weak next to the cobra-head LEDs, so inside their time window they take a very high pool
    // priority (the world's fake-lamp layer keeps every street lamp lit when it loses its real slot).
    { id: 'room3609_streetSpill', kind: 'spot', position: spillPos, target: spillTarget, color: new THREE.Color(...kelvinRGB(6500)).multiplyScalar(0.9), intensity: 6, distance: 12, decay: 2, angle: 0.42, penumbra: 0.6, priority: 400, wantsShadow: true,
      enabledAt: (t) => t > CUES.runForDoor + 1 && t < CUES.cutToBlack + 0.1 },
    { id: 'room3609_fill', kind: 'point', position: fillPos, color: new THREE.Color(...kelvinRGB(3000)), intensity: 1.3, distance: 6.5, decay: 2, priority: 600,
      enabledAt: (t) => t > CUES.doorEnter - 0.5 && t < CUES.cutToBlack + 0.1 },
  ];

  // ---- anchors ----
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, kitRotY(it), 0));
  const qLocal = (yaw) => q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)));
  // crouch: floor point between the hinge side of the door and window b; facing into the room diagonally
  const crouchLocal = new THREE.Vector3(-0.95, ROOM3609.floor, -0.68);
  const anchors = {
    refugeCrouch: { position: W(crouchLocal.x, crouchLocal.y, crouchLocal.z), quaternion: qLocal(Math.PI + 0.6), size: [0.8, 0.8],
      note: 'floor centre of the ~0.8x0.8 m hidden corner behind the open 3609 door (hinge side); quaternion faces into the room (local -Z of the facade frame rotated toward the door). Hidden from the doorway while the door is open >= ~85 deg.' },
    refugeRoom: { position: W(-1.4, ROOM3609.floor, -3.2), quaternion: q.clone(), note: 'room centre on the floor; local +Z of quaternion = toward the street' },
    roomLamp: { position: W(lampBulbLocal.x, lampBulbLocal.y, lampBulbLocal.z), quaternion: q.clone() },
    candyBowl3609: { position: W(candyBowlLocal.x, candyBowlLocal.y, candyBowlLocal.z), quaternion: q.clone() },
    stairsFoot3609: { position: W(st.x1 - 0.4, 0, st.z0 + 0.3), quaternion: qLocal(Math.PI) },
    kitchenDoorway3609: { position: W((kx0 + kx1) / 2, 0, BW), quaternion: qLocal(Math.PI) },
    refugeLookIn: { position: W(0.0, 1.62, -0.9), quaternion: qLocal(0), note: 'eye point just inside the door (camera suggestion); looking down local -Z into the room = quaternion * (0,0,1) reversed' },
  };
  // ---- v2 scare-three anchors (world space; floor y = 0.382) ----
  {
    const S = LAY.sofa, hl = S.len / 2, hd = S.depth / 2;
    const sofaBox = new THREE.Box3().setFromPoints([W(S.x - hl, 0, S.z - hd), W(S.x + hl, S.backTop, S.z + hd)]);
    anchors.roomSofa = { position: W(S.x, 0.46, S.z), quaternion: qLocal(Math.PI), box: sofaBox, backTop: sofaBox.max.y, seatFront: W(S.x, 0, S.z - hd).x, back: W(S.x, 0, S.z + hd).x,
      note: 'sofa floating mid-room, back to the door, facing +X (the TV); box = world bounds (back top 0.99 m above the floor); quaternion local +Z = the way it faces' };
    const R = LAY.strip;
    anchors.sofaFloorStrip = { position: W((R.x0 + R.x1) / 2, ROOM3609.floor, (R.z0 + R.z1) / 2), quaternion: qLocal(Math.PI),
      extent: [Math.abs(R.x1 - R.x0), Math.abs(R.z1 - R.z0)], box: new THREE.Box3().setFromPoints([W(R.x0, ROOM3609.floor, R.z0), W(R.x1, 0.45, R.z1)]),
      rightEnd: W(R.x1 - 0.25, ROOM3609.floor, (R.z0 + R.z1) / 2),
      note: 'hidden floor strip in front of the sofa seat (world x 8.71-9.51, z 1.58-3.51): out of sight from a standing eye at the door for anything <~0.35 m tall within ~0.45 m of the seat front (see docs/props-notes.md sight lines); rightEnd = where she starts her slip' };
    const G = LAY.gap;
    const gx = (G.x0 + G.x1) / 2;
    anchors.sofaEndGap = { position: W(gx, ROOM3609.floor, (G.z0 + G.z1) / 2), quaternion: qLocal(Math.PI / 2), width: Math.abs(G.x1 - G.x0),
      path: [W(R.x1 - 0.1, ROOM3609.floor, -3.5), W(gx - 0.02, ROOM3609.floor, -3.3), W(gx, ROOM3609.floor, (G.z0 + G.z1) / 2), W(gx + 0.02, ROOM3609.floor, -1.6), W(gx + 0.04, ROOM3609.floor, -0.95)],
      note: 'clear floor path (0.67 m wide) between the sofa\'s right end and the right (3607) wall; path = strip -> around the end -> along the right wall under the photo -> beside the door (homeowner crawl guide, nothing in the way)' };
    anchors.familyPhoto = { position: W(XR - 0.025, LAY.photo.y, LAY.photo.z), quaternion: qLocal(-Math.PI / 2), normal: W(XR - 1.025, LAY.photo.y, LAY.photo.z).sub(W(XR - 0.025, LAY.photo.y, LAY.photo.z)).normalize(),
      size: fp.size, note: 'framed homeowner portrait on the right wall (3607 party wall), glass front centre; normal points into the room (-Z world); ~1.36 m from door3609Inside' };
  }

  // interior lighting: no outdoor sky fill inside (practicals carry the room); then batch the static meshes
  interiorize(group, 0.2);
  kitchen.userData.noMerge = true;
  mergeStatic(kitchen);
  mergeStatic(group);
  // the room's meshes only need to cast shadows for the lamp (high) and the street spill during the refuge
  // sequence; outside it they would only add work to the streetlights' shadow maps
  // One shadow proxy (all casters' positions merged, depth only) replaces ~40 meshes per cube-map face: the visible
  // meshes keep receiving shadows but never cast; the proxy casts only during the refuge sequence.
  const proxyGeos = [];
  group.updateMatrixWorld(true);
  const invG = new THREE.Matrix4().copy(group.matrixWorld).invert();
  group.traverse((o) => {
    if (!o.isMesh || !o.castShadow) return;
    if (o.name === 'FrontSkin3609') return;   // stays a caster: shapes the doorway spill into a wedge through the gap
    if (o.parent === kitchen || kitchen.children.includes(o)) { o.castShadow = false; return; }
    const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    for (const k of Object.keys(g.attributes)) if (k !== 'position') g.deleteAttribute(k);
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(invG, o.matrixWorld));
    proxyGeos.push(g);
    o.castShadow = false;
  });
  const proxyMat = new THREE.MeshBasicMaterial({ name: 'ShadowProxy3609', colorWrite: false, depthWrite: false, side: THREE.DoubleSide });
  const proxy = new THREE.Mesh(mergeGeometries(proxyGeos, false), proxyMat);
  proxy.name = 'Room3609ShadowProxy';
  proxy.frustumCulled = false;
  proxy.castShadow = true;
  group.add(proxy);
  let castersOn = true;
  const setCasters = (on) => { if (on === castersOn) return; castersOn = on; proxy.castShadow = on; };
  // portal culling: the room is only drawn when the camera is inside or can see the doorway / an open window
  const roomBox = new THREE.Box3(W(XR + 0.1, -0.1, FW + 0.3), W(XL - 0.1, H + 0.2, BW - 2.3));
  roomBox.min.min(W(XL - 0.1, -0.1, BW - 2.3)); roomBox.max.max(W(XR + 0.1, H + 0.2, FW + 0.3));
  const doorPts = [W(-0.5, 0.05, 0), W(0.5, 0.05, 0), W(0.5, 2.05, 0), W(-0.5, 2.05, 0)];
  const winPts = [[wa, ctx.open.win3609a], [wb, ctx.open.win3609b]].filter((q) => q[1]).map(([w]) => [W(winX(w) - 0.4, sillY + 0.1, 0), W(winX(w) + 0.4, sillY + 1.3, 0)]);
  const frustum = new THREE.Frustum(), pm = new THREE.Matrix4(), camPos = new THREE.Vector3(), roomC = roomBox.getCenter(new THREE.Vector3());
  const seen = (pts) => pts.some((p) => frustum.containsPoint(p));
  let shadowFrozen = false;
  // far LOD: beyond ~13 m from the doorway the room is replaced by a warm card behind the door (the gap still glows)
  const farCard = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.3), new THREE.MeshBasicMaterial({ name: 'RoomFarGlow', color: new THREE.Color(0.55, 0.32, 0.14) }));
  farCard.position.copy(W(0.1, 1.1, -1.4)); farCard.quaternion.setFromEuler(new THREE.Euler(0, kitRotY(it), 0));
  farCard.name = 'Room3609FarGlow';
  const doorC = W(0, 1.0, 0);
  // Sealed-room portal: with the camera inside, the door shut and no see-through window, the street is only visible
  // through the door's 4-lite window. ctx.portal holds the frustum through that window; index.js / house3607.js hide
  // street props whose bounds miss it (saves ~130 draw calls per frame in the refuge shots, no visible change).
  const doorWin = [W(-0.209, 1.388, -0.15), W(0.209, 1.388, -0.15), W(0.209, 1.858, -0.15), W(-0.209, 1.858, -0.15)];
  const doorWinC = W(0, 1.623, -0.15);
  const outward = W(0, 1.623, 1.0).sub(doorWinC).normalize();
  const portal = { active: false, planes: [0, 1, 2, 3, 4].map(() => new THREE.Plane()) };
  ctx.portal = portal;
  const probe = new THREE.Vector3();
  function cull(t, camera) {
    if (!camera) { group.visible = true; farCard.visible = false; portal.active = false; return; }
    camera.getWorldPosition(camPos);
    const inside = roomBox.containsPoint(camPos);
    pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(pm);
    const doorOpen = (ctx.doorAngleAt ? ctx.doorAngleAt(t) : 0.4) > 0.015;
    const vis = inside || (doorOpen && seen(doorPts)) || winPts.some((w) => seen(w));
    const far = !inside && camPos.distanceTo(doorC) > 13;
    group.visible = vis && !far;
    farCard.visible = vis && far;
    kitchen.visible = inside || camPos.distanceTo(roomC) < 4;
    portal.active = inside && !doorOpen && winPts.length === 0;
    if (portal.active) {
      probe.subVectors(doorWinC, camPos).normalize().multiplyScalar(6).add(doorWinC);   // a point well inside the portal
      for (let i = 0; i < 4; i++) {
        const pl = portal.planes[i];
        pl.setFromCoplanarPoints(camPos, doorWin[i], doorWin[(i + 1) % 4]);
        if (pl.distanceToPoint(probe) < 0) pl.negate();
      }
      portal.planes[4].setFromNormalAndCoplanarPoint(outward, doorWinC);
    }
  }

  let lightScale = 1;
  return {
    group,
    extras: [...sashes, farCard],
    anchors,
    sources,
    lamp: lamp3609,
    api: {
      lamp: lamp3609,
      setLightScale(k) { lightScale = k; },
      lampIntensityAt(t) { return LAMP_CD * lightScale; },
      candyBowlLocal,
      photoReady: fp.state.ready,
    },
    update(t, camera) {
      // stable warm lamp; a tiny filament wobble only
      lamp3609.intensity = LAMP_CD * lightScale * (1 + 0.01 * Math.sin(t * 7.3));
      fm.shadeGlow.emissiveIntensity = 0.55 * lightScale;
      cull(t, camera);
      setCasters(t > CUES.runForDoor && t < CUES.cutToBlack + 0.5);
      // the cube shadow map is re-rendered only during the refuge sequence (and once when entering a frozen span)
      if (lamp3609.castShadow) {
        const live = t > CUES.doorEnter - 1.5 && t < CUES.cutToBlack + 0.5;
        lamp3609.shadow.autoUpdate = live;
        if (!live && !shadowFrozen) { lamp3609.shadow.needsUpdate = true; shadowFrozen = true; }
        if (live) shadowFrozen = false;
      }
    },
  };
}
