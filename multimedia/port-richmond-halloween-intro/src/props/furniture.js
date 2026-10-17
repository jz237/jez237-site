// Procedural furniture for the rowhouse front rooms. Each builder returns a THREE.Group in its own local frame
// (y up, the piece "faces" +Z unless noted), built once at load.
import * as THREE from 'three';
import { box, rbox, cyl, lathe, merge, xform, rod } from './geo.js';
import { fabricTexture, photoTexture, laceTexture } from './textures_interior.js';
import { rng } from './util.js';

const M = {};
export function furnitureMaterials() {
  if (M.ready) return M;
  // upholstery: cloth, not plastic. Sheen (velvety rim light) instead of a dielectric highlight; weak specular.
  // (INTERIOR gfx pass: the sawtooth edge sparkle was the lamp's cube-shadow acne, fixed in room3609.js.)
  M.sofaFabric = new THREE.MeshPhysicalMaterial({ name: 'SofaFabric', color: 0xffffff, map: fabricTexture('sofafab', '#7b6248', { seed: 5, weave: 0.1 }), roughness: 0.97, sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color(0x6e5844), specularIntensity: 0.25 });
  M.sofaFabric.map.repeat.set(3, 3);
  M.chairFabric = new THREE.MeshPhysicalMaterial({ name: 'ChairFabric', color: 0xffffff, map: fabricTexture('chairfab', '#5b4a3c', { seed: 9, weave: 0.14 }), roughness: 0.97, sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color(0x5a4a3a), specularIntensity: 0.25 });
  M.chairFabric.map.repeat.set(3, 3);
  M.wood = new THREE.MeshStandardMaterial({ name: 'StainedWood', color: 0x4a2e1c, roughness: 0.48 });
  M.woodLight = new THREE.MeshStandardMaterial({ name: 'OakWood', color: 0x8a6240, roughness: 0.55 });
  M.paintWhite = new THREE.MeshStandardMaterial({ name: 'TrimWhite', color: 0xe6e1d3, roughness: 0.5 });
  M.ceramic = new THREE.MeshStandardMaterial({ name: 'LampCeramic', color: 0xb8a58a, roughness: 0.3 });
  M.brass = new THREE.MeshStandardMaterial({ name: 'LampBrass', color: 0xb08a40, roughness: 0.35, metalness: 1 });
  M.blackPlastic = new THREE.MeshStandardMaterial({ name: 'TVPlastic', color: 0x0c0c0d, roughness: 0.35 });
  M.screenOff = new THREE.MeshStandardMaterial({ name: 'TVScreenOff', color: 0x050607, roughness: 0.12, metalness: 0.2 });
  M.radiator = new THREE.MeshStandardMaterial({ name: 'RadiatorPaint', color: 0xbdb7a6, roughness: 0.62, metalness: 0.3 });
  M.frameWood = new THREE.MeshStandardMaterial({ name: 'FrameWood', color: 0x3a2618, roughness: 0.5 });
  M.frameGold = new THREE.MeshStandardMaterial({ name: 'FrameGold', color: 0x9a7a3c, roughness: 0.4, metalness: 0.8 });
  M.lace = new THREE.MeshStandardMaterial({ name: 'LaceCurtain', color: 0xfff6e8, map: laceTexture(), transparent: true, alphaTest: 0.02, side: THREE.DoubleSide, roughness: 0.9, depthWrite: false, emissive: 0x8090a8, emissiveMap: laceTexture(), emissiveIntensity: 0.06 });
  M.lace.map.repeat.set(4, 4);
  M.shadeGlow = new THREE.MeshStandardMaterial({ name: 'LampShade', color: 0xd9c29a, emissive: 0xff9f4a, emissiveIntensity: 0.9, roughness: 0.9, side: THREE.DoubleSide });
  M.ready = true;
  return M;
}

// 3-seat sofa (length along X, faces +Z, back at -Z), seat height 0.45
export function sofa(len = 2.05, mat, pillowMat) {
  const m = furnitureMaterials();
  const g = new THREE.Group();
  const d = 0.9, armW = 0.2, seatH = 0.44;
  const f = [];
  f.push(rbox(len - 2 * armW + 0.02, 0.24, d - 0.12, 0.03, 0, 0.2, 0.04));                 // base
  f.push(rbox(len, 0.62, 0.2, 0.05, 0, 0.5, -d / 2 + 0.1));                                // back frame
  for (const s of [-1, 1]) f.push(rbox(armW, 0.62, d, 0.07, s * (len / 2 - armW / 2), 0.33 + 0.0, 0));  // arms
  const n = 3, cw = (len - 2 * armW) / n;
  for (let i = 0; i < n; i++) {
    const x = -len / 2 + armW + cw * (i + 0.5);
    f.push(rbox(cw - 0.01, 0.15, d - 0.22, 0.06, x, seatH - 0.07, 0.07));                 // seat cushion
    f.push(xform(rbox(cw - 0.02, 0.5, 0.17, 0.07, 0, 0, 0), x, 0.7, -d / 2 + 0.22, -0.18, 0, 0)); // back cushion
  }
  const mesh = new THREE.Mesh(merge(f), mat || m.sofaFabric);
  mesh.castShadow = true; mesh.receiveShadow = true;
  g.add(mesh);
  const legs = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) legs.push(cyl(0.022, 0.016, 0.08, sx * (len / 2 - 0.08), 0.04, sz * (d / 2 - 0.08)));
  const lm = new THREE.Mesh(merge(legs), m.wood); lm.castShadow = true; g.add(lm);
  // a throw pillow
  const p = new THREE.Mesh(rbox(0.42, 0.4, 0.13, 0.06, 0, 0, 0), pillowMat || m.chairFabric);
  p.position.set(len / 2 - armW - 0.25, seatH + 0.17, -0.18); p.rotation.set(-0.3, 0.25, 0.2);
  p.castShadow = true; g.add(p);
  return g;
}

export function armchair(mat) {
  const m = furnitureMaterials();
  const g = new THREE.Group();
  const w = 0.88, d = 0.88, armW = 0.18;
  const f = [];
  f.push(rbox(w - 2 * armW + 0.02, 0.26, d - 0.12, 0.03, 0, 0.21, 0.04));
  f.push(rbox(w, 0.7, 0.2, 0.06, 0, 0.55, -d / 2 + 0.1));
  for (const s of [-1, 1]) f.push(rbox(armW, 0.6, d, 0.07, s * (w / 2 - armW / 2), 0.32, 0));
  f.push(rbox(w - 2 * armW - 0.01, 0.15, d - 0.22, 0.06, 0, 0.38, 0.07));
  f.push(xform(rbox(w - 2 * armW - 0.03, 0.52, 0.16, 0.07, 0, 0, 0), 0, 0.72, -d / 2 + 0.22, -0.2, 0, 0));
  const mesh = new THREE.Mesh(merge(f), mat || m.chairFabric);
  mesh.castShadow = true; mesh.receiveShadow = true;
  g.add(mesh);
  return g;
}

export function coffeeTable(w = 1.1, d = 0.55, h = 0.43) {
  const m = furnitureMaterials();
  const g = new THREE.Group();
  const f = [rbox(w, 0.035, d, 0.008, 0, h - 0.0175, 0), box(w - 0.12, 0.02, d - 0.12, 0, 0.12, 0)];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) f.push(box(0.045, h - 0.035, 0.045, sx * (w / 2 - 0.05), (h - 0.035) / 2, sz * (d / 2 - 0.05)));
  const mesh = new THREE.Mesh(merge(f), m.wood);
  mesh.castShadow = true; mesh.receiveShadow = true;
  g.add(mesh);
  return g;
}

export function endTable(w = 0.5, h = 0.6) {
  const m = furnitureMaterials();
  const g = new THREE.Group();
  const f = [rbox(w, 0.03, w, 0.006, 0, h - 0.015, 0), box(w - 0.06, 0.18, w - 0.06, 0, h - 0.12, 0), box(w - 0.08, 0.02, w - 0.08, 0, 0.15, 0)];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) f.push(box(0.04, h - 0.03, 0.04, sx * (w / 2 - 0.04), (h - 0.03) / 2, sz * (w / 2 - 0.04)));
  const mesh = new THREE.Mesh(merge(f), m.wood);
  mesh.castShadow = true; mesh.receiveShadow = true;
  g.add(mesh);
  return g;
}

// table lamp: ceramic base + drum shade. Without textures: the old opaque emissive drum (m.shadeGlow). With
// opts.shadeMap + opts.glowMap (textures_interior.js, INTERIOR gfx pass): a translucent linen shade glowing from inside
// (brightest at the bulb's height, seam and binding darker), its inside lit straight by the bulb (seen through the top
// opening), a hot bulb, and soft additive glow across both openings. No light is added: the room's lamp3609 point
// light stays the only real source. Returns { group, bulb: local bulb position, shade, materials: { shade, inner, glow } }
export function tableLamp(opts = {}) {
  const m = furnitureMaterials();
  const g = new THREE.Group();
  const base = new THREE.Mesh(lathe([[0, 0], [0.075, 0], [0.08, 0.02], [0.06, 0.05], [0.095, 0.16], [0.1, 0.22], [0.07, 0.3], [0.03, 0.33], [0.015, 0.36], [0, 0.36]], 28), m.ceramic);
  base.castShadow = true; base.receiveShadow = true;
  g.add(base);
  const harp = new THREE.Mesh(merge([cyl(0.006, 0.006, 0.16, 0, 0.43, 0), rod(new THREE.Vector3(-0.07, 0.4, 0), new THREE.Vector3(0, 0.62, 0), 0.003), rod(new THREE.Vector3(0.07, 0.4, 0), new THREE.Vector3(0, 0.62, 0), 0.003), cyl(0.01, 0.01, 0.02, 0, 0.635, 0)]), m.brass);
  g.add(harp);
  const shadeGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.27, 48, 1, true);
  const textured = !!opts.glowMap;
  // a lit shade is dominated by transmitted light: dark diffuse (so the cold street spill through the front windows
  // can't turn it grey-blue), warm emissive; the glow map carries the falloff + hue (cream at the bulb, amber at the rims)
  const shadeMat = textured
    ? new THREE.MeshStandardMaterial({ name: 'LampShadeLinen', color: 0x5a544c, map: opts.shadeMap || null, emissive: new THREE.Color(1.0, 0.72, 0.45), emissiveMap: opts.glowMap, emissiveIntensity: 1.45, roughness: 0.95, side: THREE.FrontSide })
    : m.shadeGlow;
  const shade = new THREE.Mesh(shadeGeo, shadeMat);
  shade.position.y = 0.5;
  shade.name = 'LampShade';
  shade.castShadow = false;
  g.add(shade);
  const out = { group: g, bulb: new THREE.Vector3(0, 0.5, 0), shade, materials: { shade: shadeMat } };
  // bulb: white-hot (HDR, so the post's bloom catches it through the bottom opening)
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), new THREE.MeshBasicMaterial({ name: 'LampBulb', color: textured ? new THREE.Color(1.0, 0.82, 0.58).multiplyScalar(7) : 0xfff1d6 }));
  bulb.position.y = 0.47;
  bulb.castShadow = false;
  g.add(bulb);
  if (textured) {
    // the inside of the drum, lit straight by the bulb
    // (inverted winding + FrontSide instead of BackSide: shares the basic+map program with the glow cards)
    const innerGeo = shadeGeo.clone();
    { const ix = innerGeo.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } }
    const innerMat = new THREE.MeshBasicMaterial({ name: 'LampShadeInner', map: opts.glowMap, color: new THREE.Color(1.0, 0.64, 0.32).multiplyScalar(2.0), transparent: true, depthWrite: true });   // transparent (alpha 1): no OPAQUE define -> same program as the glow cards
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.y = 0.5; inner.castShadow = false; inner.name = 'LampShadeInner';
    g.add(inner);
    // glow across the two openings (light scattering in the air / off the harp), additive, no depth write
    const glowMat = new THREE.MeshBasicMaterial({ name: 'LampOpeningGlow', map: opts.glowDisc || null, color: new THREE.Color(1.0, 0.66, 0.34).multiplyScalar(0.55), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const top = new THREE.Mesh(new THREE.CircleGeometry(0.148, 40).rotateX(-Math.PI / 2), glowMat);
    top.position.y = 0.5 + 0.135 - 0.004; top.renderOrder = 5; top.name = 'LampTopGlow';
    const bot = new THREE.Mesh(new THREE.CircleGeometry(0.197, 40).rotateX(Math.PI / 2), glowMat);
    bot.position.y = 0.5 - 0.135 + 0.004; bot.renderOrder = 5; bot.name = 'LampBottomGlow';
    g.add(top, bot);
    out.inner = inner;
    out.materials.inner = innerMat; out.materials.glow = glowMat;
  }
  return out;
}

// flat TV (43"), screen faces +Z. Returns { group, screen (mesh) }
export function flatTV(screenMat) {
  const m = furnitureMaterials();
  const g = new THREE.Group();
  const sw = 0.95, sh = 0.54;
  const bez = new THREE.Mesh(merge([rbox(sw + 0.03, sh + 0.03, 0.05, 0.006, 0, 0, -0.025), box(0.3, 0.012, 0.18, 0, -sh / 2 - 0.08, 0.0), box(0.05, 0.08, 0.04, 0, -sh / 2 - 0.04, -0.03)]), m.blackPlastic);
  bez.castShadow = true;
  g.add(bez);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), screenMat || m.screenOff);
  screen.position.z = 0.0012;
  screen.name = 'TVScreen';
  g.add(screen);
  g.userData.screenSize = [sw, sh];
  g.userData.standOffset = sh / 2 + 0.086; // from screen centre down to the stand foot
  return { group: g, screen };
}

export function tvStand(w = 1.2, d = 0.42, h = 0.52) {
  const m = furnitureMaterials();
  const g = new THREE.Group();
  const f = [rbox(w, 0.03, d, 0.005, 0, h - 0.015, 0), box(w, 0.03, d, 0, 0.06, 0), box(0.03, h - 0.06, d, -w / 2 + 0.015, h / 2, 0), box(0.03, h - 0.06, d, w / 2 - 0.015, h / 2, 0), box(0.03, h - 0.1, d - 0.02, 0, h / 2, 0), box(w, h - 0.06, 0.01, 0, h / 2, -d / 2 + 0.005)];
  const mesh = new THREE.Mesh(merge(f), m.wood);
  mesh.castShadow = true; mesh.receiveShadow = true;
  g.add(mesh);
  return g;
}

// cast-iron column radiator, length along X
export function radiator(len = 0.75, h = 0.62) {
  const m = furnitureMaterials();
  const n = Math.round(len / 0.064);
  const f = [];
  for (let i = 0; i < n; i++) {
    const x = -len / 2 + (i + 0.5) * (len / n);
    f.push(rbox(0.05, h - 0.1, 0.16, 0.018, x, h / 2, 0));
    f.push(cyl(0.012, 0.012, 0.11, x, 0.05, 0.04)); // feet / bottom nipples
  }
  f.push(cyl(0.02, 0.02, len, 0, h - 0.06, 0, 0, 0, Math.PI / 2, 10));
  f.push(cyl(0.02, 0.02, len, 0, 0.1, 0, 0, 0, Math.PI / 2, 10));
  const mesh = new THREE.Mesh(merge(f), m.radiator);
  mesh.castShadow = true; mesh.receiveShadow = true;
  const g = new THREE.Group(); g.add(mesh);
  return g;
}

// framed photo, picture faces +Z
export function photoFrame(w, h, seed, gold = false) {
  const m = furnitureMaterials();
  const g = new THREE.Group();
  const b = 0.025;
  const fr = new THREE.Mesh(merge([box(w + 2 * b, b, 0.02, 0, h / 2 + b / 2, 0), box(w + 2 * b, b, 0.02, 0, -h / 2 - b / 2, 0), box(b, h, 0.02, -w / 2 - b / 2, 0, 0), box(b, h, 0.02, w / 2 + b / 2, 0, 0)]), gold ? m.frameGold : m.frameWood);
  fr.castShadow = true;
  g.add(fr);
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ name: 'Photo' + seed, map: photoTexture(seed), roughness: 0.25 }));
  pic.position.z = -0.002;
  g.add(pic);
  return g;
}

// lace curtain panel hanging in folds, width w, height h; hangs from y=0 down, folds along X
export function laceCurtain(w, h, seed = 1) {
  const m = furnitureMaterials();
  const R = rng(seed);
  const geo = new THREE.PlaneGeometry(w, h, 48, 8);
  const p = geo.attributes.position;
  const ph = R() * 6;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const v = (h / 2 - y) / h;
    p.setZ(i, 0.022 * Math.sin(x * 34 + ph) + 0.012 * Math.sin(x * 13 + ph * 2) * (0.6 + v));
  }
  geo.translate(0, -h / 2, 0);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, m.lace);
  mesh.renderOrder = 3;
  return mesh;
}

// double-hung white vinyl window (frame + 2 sashes), in its local frame: x across, y up from the sill, z toward
// the street (glass at z ~ -0.15 / -0.12 like the game's SM_R_WinDH_M). Returns { group, glassLower, glassUpper }.
export function doubleHungWindow(glassMat, { w = 0.86, h = 1.4 } = {}) {
  const m = furnitureMaterials();
  const g = new THREE.Group();
  const f = [];
  const fw = 0.055;
  f.push(box(w, fw, 0.1, 0, fw / 2, -0.13), box(w, fw, 0.1, 0, h - fw / 2, -0.13));
  f.push(box(fw, h, 0.1, -w / 2 + fw / 2, h / 2, -0.13), box(fw, h, 0.1, w / 2 - fw / 2, h / 2, -0.13));
  // sashes (lower at z=-0.15, upper at z=-0.12), meeting rail around y = 0.69
  const sash = (y0, y1, z) => {
    const s = 0.045;
    return [box(w - 2 * fw, s, 0.035, 0, y0 + s / 2, z), box(w - 2 * fw, s, 0.035, 0, y1 - s / 2, z), box(s, y1 - y0, 0.035, -w / 2 + fw + s / 2, (y0 + y1) / 2, z), box(s, y1 - y0, 0.035, w / 2 - fw - s / 2, (y0 + y1) / 2, z)];
  };
  f.push(...sash(fw, 0.71, -0.152), ...sash(0.67, h - fw, -0.12));
  const frame = new THREE.Mesh(merge(f), m.paintWhite);
  frame.castShadow = true; frame.receiveShadow = true;
  g.add(frame);
  const gw = w - 2 * fw - 0.09;
  const glassLower = new THREE.Mesh(new THREE.PlaneGeometry(gw, 0.71 - fw - 0.09), glassMat);
  glassLower.position.set(0, (fw + 0.71) / 2, -0.152);
  const glassUpper = new THREE.Mesh(new THREE.PlaneGeometry(gw, h - fw - 0.67 - 0.09), glassMat);
  glassUpper.position.set(0, (0.67 + h - fw) / 2, -0.12);
  for (const q of [glassLower, glassUpper]) { q.renderOrder = 2; g.add(q); }
  return { group: g, glassLower, glassUpper };
}
