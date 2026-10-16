// 3609 Witte St front door: hinged leaf with a small 4-lite window, knob, deadbolt, kick plate, frame, and keys
// on a ring hanging in the OUTSIDE lock. The leaf swings inward; the hinge is on the side away from the 3607
// party wall, so the corner behind the open door (between door and window) is the scare-three crouch corner.
import * as THREE from 'three';
import { HERO, placeOnKit, kitRotY } from './site.js';
import { doorAngleAt, simulateKeys, defaultKeySim, KEYS, deadboltAngleAt, doorSlapAt } from './timings.js';
import { CUES } from '../film/cues.js';
import { box, rbox, cyl, merge, xform } from './geo.js';
import { canvasTexture } from './textures.js';
import { rng, noise1 } from './util.js';

const W = 0.908, H = 2.021, T = 0.045;      // leaf (from the game's SM_R_Door_Panel6 opening)
const HINGE = new THREE.Vector3(-0.454, 0.028, -0.175); // door-frame local (origin = kit p: threshold, facade face)

function planarUV(geo, fu, fv) {
  const p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, fu(p.getX(i), p.getY(i), p.getZ(i)), fv(p.getX(i), p.getY(i), p.getZ(i)));
  return geo;
}

function doorGrimeTexture() {
  return canvasTexture('door3609grime', 256, 512, (g, w, h) => {
    const R = rng(3609);
    g.fillStyle = '#e9e6dc'; g.fillRect(0, 0, w, h);
    // yellowing + dirt toward the bottom and around the knob (latch side = right in UV)
    const gr = g.createLinearGradient(0, h, 0, h * 0.6);
    gr.addColorStop(0, 'rgba(90,80,60,0.45)'); gr.addColorStop(1, 'rgba(90,80,60,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const kx = w * 0.93, ky = h * (1 - 0.95 / H);
    const rg = g.createRadialGradient(kx, ky, 4, kx, ky, 70);
    rg.addColorStop(0, 'rgba(70,60,45,0.45)'); rg.addColorStop(1, 'rgba(70,60,45,0)');
    g.fillStyle = rg; g.fillRect(0, 0, w, h);
    // scuffs and chips
    for (let i = 0; i < 40; i++) {
      const y = h * (0.86 + 0.14 * R()), x = R() * w;
      g.fillStyle = `rgba(70,60,48,${0.06 + R() * 0.16})`; g.fillRect(x, y, 3 + R() * 18, 1 + R() * 1.5);
    }
    for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(150,140,125,0.25)'; g.beginPath(); g.arc(R() * w, h * (0.55 + 0.45 * R()), 0.8 + R() * 1.2, 0, 7); g.fill(); }
  }, { wrap: false });
}

function keyShape(len, bowR, teeth, seed) {
  const R = rng(seed);
  const s = new THREE.Shape();
  // bow (round) at the top, blade going down (-y)
  s.absarc(0, 0, bowR, -Math.PI * 0.35, Math.PI * 1.35, false);
  const bw = 0.0045;
  s.lineTo(-bw, -bowR * 0.9);
  s.lineTo(-bw, -len);
  s.lineTo(bw * 0.2, -len - 0.003);
  // teeth along the right edge
  let y = -len + 0.002;
  for (let i = 0; i < teeth; i++) { s.lineTo(bw + 0.002 + R() * 0.0025, y + 0.002); y += 0.004 + R() * 0.002; s.lineTo(bw, y); }
  s.lineTo(bw, -bowR * 0.9);
  const hole = new THREE.Path(); hole.absarc(0, bowR * 0.35, bowR * 0.32, 0, Math.PI * 2, true);
  s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.0018, bevelEnabled: false, curveSegments: 10 });
  g.translate(0, -bowR * 0.35, -0.0009); // hang point (hole) at the origin
  return g;
}

// ---- DRESS v2: hand slap (hand silhouette + the smeared print it leaves) on the door window's outer face ----
function handPath(g, s, ox, oy) {
  // palm-forward hand, fingers up; units: canvas px scaled by s around (ox, oy) = palm centre
  const cap = (x0, y0, x1, y1, r) => { g.beginPath(); g.lineCap = 'round'; g.lineWidth = r * 2 * s; g.moveTo(ox + x0 * s, oy + y0 * s); g.lineTo(ox + x1 * s, oy + y1 * s); g.stroke(); };
  g.beginPath(); g.ellipse(ox, oy, 46 * s, 54 * s, 0, 0, Math.PI * 2); g.fill();
  cap(-34, -40, -46, -112, 10.5); cap(-11, -50, -14, -132, 11.5); cap(13, -50, 15, -128, 11); cap(34, -40, 44, -100, 9.5);   // fingers
  cap(-44, 10, -86, -30, 12);   // thumb
}
function handTextures() {
  const mk = (draw) => { const c = document.createElement('canvas'); c.width = 256; c.height = 384; const g = c.getContext('2d'); draw(g); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const hand = mk((g) => { g.fillStyle = '#fff'; g.strokeStyle = '#fff'; g.filter = 'blur(1.5px)'; handPath(g, 1, 128, 168); });
  const print = mk((g) => {
    const R = rng(3610);
    // streaks dragged down from the palm/fingertips (revealed progressively by uDrag), drawn first, under the print
    g.filter = 'blur(2px)';
    for (let i = 0; i < 9; i++) {
      const x = 128 + (R() - 0.5) * 120, y0 = 120 + R() * 90, len = 60 + R() * 150, w = 3 + R() * 9;
      const gr = g.createLinearGradient(0, y0, 0, y0 + len); gr.addColorStop(0, 'rgba(70,22,16,0.75)'); gr.addColorStop(1, 'rgba(70,22,16,0)');
      g.fillStyle = gr; g.fillRect(x - w / 2, y0, w, len);
    }
    // the print: uneven, broken contact (ridges of the palm and finger pads), grime + thinned blood
    g.filter = 'blur(2.5px)';
    g.fillStyle = 'rgba(80,30,20,0.55)'; g.strokeStyle = 'rgba(80,30,20,0.55)'; handPath(g, 0.97, 128, 168);
    g.filter = 'none';
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(0,0,0,${0.3 + R() * 0.6})`; g.beginPath(); g.arc(60 + R() * 140, 30 + R() * 200, 1 + R() * 4, 0, 7); g.fill(); }
    g.globalCompositeOperation = 'source-over';
  });
  return { hand, print };
}
function buildHandSlap(wx0, wx1, wy0, wy1, T) {
  const tex = handTextures();
  const group = new THREE.Group(); group.name = 'Door3609HandSlap';
  const cx = wx0 + (wx1 - wx0) * 0.58, cy = wy0 + (wy1 - wy0) * 0.6;
  const W = 0.15, H = 0.225;   // 256x384 canvas mapped to 15 x 22.5 cm (a large hand)
  // the hand itself: dark grimy skin pressed on the glass, lit faintly by the room; reads as a silhouette against the street
  const handMat = new THREE.MeshStandardMaterial({ name: 'SlapHand', color: 0x3a2a24, roughness: 0.75, alphaMap: tex.hand, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const hand = new THREE.Mesh(new THREE.PlaneGeometry(W, H), handMat);
  hand.position.set(cx, cy, T + 0.007); hand.renderOrder = 3; hand.visible = false;
  group.add(hand);
  // the print on the outer face of the glass (stays); streaks revealed by uDrag
  const uDrag = { value: 0 };
  const printMat = new THREE.MeshStandardMaterial({ name: 'SlapPrint', map: tex.print, transparent: true, opacity: 0, roughness: 0.3, depthWrite: false, side: THREE.DoubleSide, color: 0xffffff });
  printMat.onBeforeCompile = (sh) => {
    sh.uniforms.uDrag = uDrag;
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uDrag;')
      .replace('#include <map_fragment>', '#include <map_fragment>\n  diffuseColor.a *= smoothstep(0.0, 0.08, vMapUv.y - (0.56 - 0.56 * uDrag));');
  };
  printMat.customProgramCacheKey = () => 'slapPrint';
  const print = new THREE.Mesh(new THREE.PlaneGeometry(W, H * 1.6), printMat);
  // the print texture's palm sits at the top 60%: align the palm with the hand's first contact
  print.position.set(cx, cy - H * 0.3, T + 0.0018); print.renderOrder = 3; print.visible = false;
  group.add(print);
  return {
    group,
    update(t) {
      const s = doorSlapAt(t);
      hand.visible = s.hand > 0.001; handMat.opacity = Math.min(1, s.hand) * 0.96;
      hand.position.y = cy - 0.06 * s.drag;
      hand.scale.setScalar(1 + 0.03 * s.press);
      print.visible = s.print > 0.001; printMat.opacity = 0.9 * s.print;
      uDrag.value = s.drag;
    },
  };
}

export function buildDoor3609(ctx) {
  const it = HERO.door3609;
  const group = new THREE.Group();
  group.name = 'Door3609';
  placeOnKit(group, it);

  const paint = new THREE.MeshStandardMaterial({ name: 'Door3609Paint', color: 0xffffff, map: doorGrimeTexture(), roughness: 0.42, metalness: 0 });
  const trim = new THREE.MeshStandardMaterial({ name: 'Door3609Trim', color: 0xe4e0d4, roughness: 0.55 });
  const brass = new THREE.MeshStandardMaterial({ name: 'Brass', color: 0xc9a04f, roughness: 0.32, metalness: 1 });
  const nickel = new THREE.MeshStandardMaterial({ name: 'KeyNickel', color: 0xc8c8c2, roughness: 0.28, metalness: 1 });
  const keyBrass = new THREE.MeshStandardMaterial({ name: 'KeyBrass', color: 0xd4b066, roughness: 0.3, metalness: 1 });
  const alu = new THREE.MeshStandardMaterial({ name: 'Aluminium', color: 0xa9aaa6, roughness: 0.62, metalness: 0.85 });
  const dark = new THREE.MeshStandardMaterial({ name: 'DarkMetal', color: 0x151515, roughness: 0.5, metalness: 0.6 });
  const glass = new THREE.MeshPhysicalMaterial({ name: 'Door3609Glass', color: 0xdfe8ec, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.18, depthWrite: false, envMapIntensity: 1.0 });

  // ---------------- leaf (pivot at the hinge) ----------------
  const pivot = new THREE.Group();
  pivot.name = 'Door3609Hinge';
  pivot.position.copy(HINGE);
  group.add(pivot);

  const wx0 = 0.245, wx1 = 0.663, wy0 = 1.36, wy1 = 1.83; // 4-lite window cut-out (pivot-local)
  const core = 0.025, face = (T - core) / 2;
  const parts = [];
  // core slab with window hole
  const zc = T / 2;
  parts.push(box(W, wy0, core, W / 2, wy0 / 2, zc));
  parts.push(box(W, H - wy1, core, W / 2, (wy1 + H) / 2, zc));
  parts.push(box(wx0, wy1 - wy0, core, wx0 / 2, (wy0 + wy1) / 2, zc));
  parts.push(box(W - wx1, wy1 - wy0, core, (wx1 + W) / 2, (wy0 + wy1) / 2, zc));
  // stiles and rails on both faces (panels recessed between them)
  const st = 0.115;
  for (const z of [face / 2, T - face / 2]) {
    parts.push(box(st, H, face, st / 2, H / 2, z));
    parts.push(box(st, H, face, W - st / 2, H / 2, z));
    parts.push(box(W - 2 * st, 0.21, face, W / 2, 0.105, z));            // bottom rail
    parts.push(box(W - 2 * st, 0.2, face, W / 2, 1.13, z));               // lock rail
    parts.push(box(W - 2 * st, H - 1.96, face, W / 2, (1.96 + H) / 2, z)); // top rail
    parts.push(box(0.05, 1.03 - 0.21, face, W / 2, (0.21 + 1.03) / 2, z)); // centre stile (lower)
    parts.push(box(wx0 - st, 1.96 - 1.23, face, (st + wx0) / 2, (1.23 + 1.96) / 2, z));
    parts.push(box(W - st - wx1, 1.96 - 1.23, face, (wx1 + W - st) / 2, (1.23 + 1.96) / 2, z));
    parts.push(box(wx1 - wx0, wy0 - 1.23, face, (wx0 + wx1) / 2, (1.23 + wy0) / 2, z));
    parts.push(box(wx1 - wx0, 1.96 - wy1, face, (wx0 + wx1) / 2, (wy1 + 1.96) / 2, z));
    // raised panel fields
    const pz = z < T / 2 ? face + 0.0 : T - face;
    for (const [x0, x1] of [[st + 0.025, W / 2 - 0.05], [W / 2 + 0.05, W - st - 0.025]]) {
      parts.push(rbox(x1 - x0, 0.75, 0.01, 0.004, (x0 + x1) / 2, (0.24 + 1.0) / 2, pz + (z < T / 2 ? -0.002 : 0.002)));
    }
  }
  const leafGeo = merge(parts);
  planarUV(leafGeo, (x) => x / W, (x, y) => y / H);
  const leaf = new THREE.Mesh(leafGeo, paint);
  leaf.name = 'Door3609Leaf';
  leaf.castShadow = true; leaf.receiveShadow = true;
  pivot.add(leaf);
  // window: glass + muntins + beads
  const mun = [];
  mun.push(box(0.018, wy1 - wy0, T * 0.6, (wx0 + wx1) / 2, (wy0 + wy1) / 2, T / 2));
  mun.push(box(wx1 - wx0, 0.018, T * 0.6, (wx0 + wx1) / 2, (wy0 + wy1) / 2, T / 2));
  for (const z of [0.004, T - 0.004]) {
    mun.push(box(wx1 - wx0, 0.012, 0.008, (wx0 + wx1) / 2, wy0 + 0.006, z));
    mun.push(box(wx1 - wx0, 0.012, 0.008, (wx0 + wx1) / 2, wy1 - 0.006, z));
    mun.push(box(0.012, wy1 - wy0, 0.008, wx0 + 0.006, (wy0 + wy1) / 2, z));
    mun.push(box(0.012, wy1 - wy0, 0.008, wx1 - 0.006, (wy0 + wy1) / 2, z));
  }
  const munMesh = new THREE.Mesh(merge(mun), trim);
  munMesh.castShadow = true;
  pivot.add(munMesh);
  const gl = new THREE.Mesh(box(wx1 - wx0, wy1 - wy0, 0.004, (wx0 + wx1) / 2, (wy0 + wy1) / 2, T / 2), glass);
  gl.name = 'Door3609Glass';
  gl.renderOrder = 2;
  pivot.add(gl);
  // hardware (outer face z = T; inner face z = 0), latch side x ~ W - 0.065
  const kx = W - 0.068;
  const hw = [];
  const knobY = 0.92, boltY = 1.075;
  for (const side of [1, -1]) {
    const z0 = side > 0 ? T : 0;
    hw.push(cyl(0.031, 0.031, 0.008, kx, knobY, z0 + side * 0.004, Math.PI / 2, 0, 0, 20));     // rose
    hw.push(cyl(0.008, 0.008, 0.045, kx, knobY, z0 + side * 0.03, Math.PI / 2, 0, 0, 10));      // spindle
    hw.push(xform(new THREE.SphereGeometry(0.029, 20, 14), kx, knobY, z0 + side * 0.062, 0, 0, 0, 1, 1, 0.78)); // knob
    hw.push(cyl(0.028, 0.03, 0.012, kx, boltY, z0 + side * 0.006, Math.PI / 2, 0, 0, 20));      // deadbolt rose
  }
  const hwMesh = new THREE.Mesh(merge(hw), brass);
  hwMesh.castShadow = true;
  pivot.add(hwMesh);
  // DRESS v2: the inside thumb turn of the deadbolt turns at CUES.deadbolt (vertical = open -> horizontal = locked)
  const thumb = new THREE.Group(); thumb.name = 'Door3609ThumbTurn';
  thumb.position.set(kx, boltY, -0.008);
  const thumbMesh = new THREE.Mesh(merge([rbox(0.013, 0.036, 0.011, 0.004, 0, 0, -0.008), cyl(0.008, 0.008, 0.008, 0, 0, -0.002, Math.PI / 2, 0, 0, 12)]), brass);
  thumbMesh.castShadow = true;
  thumb.add(thumbMesh);
  pivot.add(thumb);
  // DRESS v2: the hand slap on the 4-lite window from outside (doorSlapAt): the hand pressed on the glass (seen
  // against the street from inside) and the smeared print it leaves (grime + blood, lit from the street)
  const slap = buildHandSlap(wx0, wx1, wy0, wy1, T);
  pivot.add(slap.group);
  const keyway = new THREE.Mesh(box(0.0035, 0.014, 0.002, kx, boltY + 0.002, T + 0.0125), dark);
  pivot.add(keyway);
  const kick = new THREE.Mesh(box(W - 0.06, 0.2, 0.0015, W / 2, 0.11, T + 0.0009), alu);
  pivot.add(kick);
  // hinges (knuckles on the inside at the hinge edge)
  const hg = [];
  for (const y of [0.24, 1.0, 1.78]) { hg.push(cyl(0.008, 0.008, 0.1, 0, y, 0.0, 0, 0, 0, 10)); hg.push(box(0.05, 0.1, 0.003, 0.02, y, -0.002)); }
  const hinges = new THREE.Mesh(merge(hg), brass);
  pivot.add(hinges);

  // ---------------- frame (static) ----------------
  // The ported world keeps the game's door frame/casing at 3609 (opening_3609_door: frame kept, leaf removed), so
  // the jambs, stops and exterior moulding are only built when running without the world.
  const fr = [];
  const jd0 = -0.05, jd1 = -0.25, jt = 0.035;
  if (!ctx.hasWorld) {
    fr.push(box(jt, 2.1, jd0 - jd1, -0.5 + jt / 2, 1.05, (jd0 + jd1) / 2));
    fr.push(box(jt, 2.1, jd0 - jd1, 0.5 - jt / 2, 1.05, (jd0 + jd1) / 2));
    fr.push(box(1.0, jt, jd0 - jd1, 0, 2.1 - jt / 2, (jd0 + jd1) / 2));
    for (const s2 of [-1, 1]) fr.push(box(0.055, 2.13, 0.03, s2 * (0.5 + 0.0275), 1.065, jd0 + 0.015));
    fr.push(box(1.11, 0.06, 0.03, 0, 2.1 + 0.03, jd0 + 0.015));
  }
  // stops (the leaf closes against them from inside) + interior casing (the room side is ours in both cases)
  fr.push(box(0.012, 2.06, 0.03, -0.5 + jt + 0.006, 1.03, -0.115));
  fr.push(box(0.012, 2.06, 0.03, 0.5 - jt - 0.006, 1.03, -0.115));
  fr.push(box(0.93, 0.012, 0.03, 0, 2.1 - jt - 0.006, -0.115));
  for (const s2 of [-1, 1]) fr.push(box(0.075, 2.14, 0.016, s2 * (0.5 + 0.0375), 1.07, jd1 - 0.008));
  fr.push(box(1.15, 0.085, 0.016, 0, 2.1 + 0.042, jd1 - 0.008));
  // inner reveal between the game frame and the room wall (z -0.2 .. -0.25)
  fr.push(box(0.012, 2.1, 0.06, -0.5 + 0.006, 1.05, -0.225), box(0.012, 2.1, 0.06, 0.5 - 0.006, 1.05, -0.225), box(1.0, 0.012, 0.06, 0, 2.1 - 0.006, -0.225));
  const frame = new THREE.Mesh(merge(fr), trim);
  frame.castShadow = true; frame.receiveShadow = true;
  frame.name = 'Door3609Frame';
  group.add(frame);
  const sill = new THREE.Mesh(box(1.0, 0.018, 0.2, 0, 0.009, -0.15), alu);
  sill.receiveShadow = true;
  group.add(sill);

  // ---------------- keys on a ring in the outside lock ----------------
  const keysRoot = new THREE.Group(); // at the bow hole of the inserted key
  keysRoot.name = 'Door3609Keys';
  keysRoot.position.set(kx, boltY + 0.006, T + 0.036);
  pivot.add(keysRoot);
  // inserted key bow (static relative to the door)
  // the inserted key: blade into the lock (-z), bow plate perpendicular to the door, hole axis along x
  const inserted = new THREE.Mesh(keyShape(0.014, 0.0125, 0, 1), nickel);
  inserted.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0)));
  inserted.position.copy(keysRoot.position);
  inserted.castShadow = true;
  pivot.add(inserted);
  const swingO = new THREE.Group(); // out-of-plane swing (about x)
  const swingS = new THREE.Group(); // in-plane swing (about z)
  keysRoot.add(swingO); swingO.add(swingS);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.015, 0.0011, 6, 28), nickel);
  ring.position.set(0, -0.015, 0);
  swingS.add(ring);
  const hang = [];
  const defs = [
    { len: 0.055, bow: 0.012, mat: keyBrass, ang: -0.55, seed: 11 },
    { len: 0.048, bow: 0.011, mat: nickel, ang: -0.15, seed: 12 },
    { len: 0.062, bow: 0.013, mat: keyBrass, ang: 0.25, seed: 13 },
    { len: 0.044, bow: 0.01, mat: nickel, ang: 0.6, seed: 14 },
  ];
  for (const d of defs) {
    const k = new THREE.Group();
    const a = d.ang;
    k.position.set(Math.sin(a) * 0.015, -0.015 - Math.cos(a) * 0.015, 0.0015 * Math.sign(a));
    const m = new THREE.Mesh(keyShape(d.len, d.bow, 6, d.seed), d.mat);
    m.rotation.z = a * 0.6;
    m.castShadow = true;
    k.add(m);
    swingS.add(k);
    hang.push(k);
  }
  // a small generic plastic fob
  const fob = new THREE.Group();
  fob.position.set(0.004, -0.031, -0.002);
  const fobMesh = new THREE.Mesh(rbox(0.026, 0.04, 0.006, 0.004, 0, -0.024, 0), new THREE.MeshStandardMaterial({ name: 'FobPlastic', color: 0x1f3a6b, roughness: 0.5 }));
  fob.add(fobMesh);
  fob.rotation.z = 0.15;
  swingS.add(fob);
  hang.push(fob);

  // ---------------- animation ----------------
  let override = null;           // number (radians) when api.door.setAngle() was called
  let angleFn = doorAngleAt;     // timeline function
  let keySim = defaultKeySim;    // precomputed key pendulum for the timeline
  const tmp = new THREE.Vector3();

  function angleAt(t) { return override !== null ? override : angleFn(t); }
  function update(t) {
    const a = angleAt(t);
    pivot.rotation.y = a;
    thumb.rotation.z = deadboltAngleAt(t);
    slap.update(t);
    let o = 0, s = 0;
    if (override === null) {
      [o, s] = keySim.at(t);
      // faint draught sway while the door hangs ajar
      if (t < keySim.t0 + 0.5) { o += 0.025 * noise1(t * 0.9, 21); s += 0.04 * noise1(t * 0.7, 22); }
    }
    swingO.rotation.x = -o;
    swingS.rotation.z = s;
    for (let i = 0; i < hang.length; i++) hang[i].rotation.z = 0.08 * s * (i % 2 ? 1 : -1) + 0.05 * Math.sin(t * 7 + i) * Math.min(1, Math.abs(o) + Math.abs(s));
  }

  // anchors (world space)
  group.updateMatrixWorld(true);
  const toWorld = (x, y, z) => group.localToWorld(new THREE.Vector3(x, y, z));
  const hingeBottom = toWorld(HINGE.x, 0.0, HINGE.z), hingeTop = toWorld(HINGE.x, 2.05, HINGE.z);
  const qDoor = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, kitRotY(it), 0));
  const anchors = {
    door3609Hinge: { position: hingeBottom.clone(), quaternion: qDoor.clone(), axis: new THREE.Vector3(0, 1, 0), top: hingeTop, note: 'hinge axis (vertical line from position to top); door opens inward with + angle' },
    door3609Closed: {
      position: toWorld(0, 1.05, -0.13), quaternion: qDoor.clone(),
      corners: [toWorld(-0.454, 0.028, -0.13), toWorld(0.454, 0.028, -0.13), toWorld(0.454, H + 0.028, -0.13), toWorld(-0.454, H + 0.028, -0.13)],
      width: W, height: H, note: 'closed leaf rectangle (outer face); corners: hinge-bottom, latch-bottom, latch-top, hinge-top',
    },
    door3609Threshold: { position: toWorld(0, 0.0, -0.12), quaternion: qDoor.clone(), note: 'centre of the threshold; +Z local = street' },
    door3609Keys: { position: new THREE.Vector3(), quaternion: qDoor.clone(), note: 'keys in the outside lock (updated live by update())' },
    // DRESS v2: just inside the closed door (scare three): position = sitting eye 0.82 m above the floor, 0.25 m in
    // from the leaf's inner face; floor / sitEye / standEye / back given separately; quaternion local +Z = into the room
    door3609Inside: {
      position: toWorld(0, 0.82, -0.175 - 0.25), quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, kitRotY(it) + Math.PI, 0)),
      floor: toWorld(0, 0, -0.175 - 0.25), sitEye: toWorld(0, 0.82, -0.175 - 0.25), standEye: toWorld(0, 1.6, -0.175 - 0.25),
      back: toWorld(0, 0.45, -0.18), buttocks: toWorld(0, 0.02, -0.175 - 0.12), window: toWorld(0, 1.623, -0.15),
      note: '0.25 m inside the closed 3609 door (leaf inner face at world x 5.706); floor y 0.382; sitting with the back against the door: buttocks / back points; window = centre of the 4-lite window (hand slap at CUES.doorSlap)',
    },
  };

  const api = {
    hinge: pivot,
    leaf,
    keys: keysRoot,
    thumbTurn: thumb,
    handSlap: slap.group,
    deadboltAngleAt, doorSlapAt,
    setAngle(rad) { override = (rad === null || rad === undefined) ? null : rad; },
    setAngleFunction(fn) { angleFn = fn || doorAngleAt; override = null; keySim = fn ? simulateKeys(fn, CUES.doorEnter - 6, CUES.doorSlam + 6) : defaultKeySim; },
    useTimeline() { angleFn = doorAngleAt; override = null; keySim = defaultKeySim; },
    angleAt,
    keyParams: KEYS,
  };

  update(0);
  keysRoot.getWorldPosition(anchors.door3609Keys.position);
  ctx.doorAngleAt = angleAt;
  // warm lamp light spilling out through the ajar door's gap onto the stoop: reads "door open, lights on inside"
  // even from a grazing street angle where the gap itself is hidden. Shadowed (door leaf + the room's front skin
  // shape it into a wedge) when the pool can give it a shadow slot.
  const spillFrom = toWorld(0.3, 1.75, -1.15), spillTo = toWorld(0.75, -0.45, 1.6);
  const sources = [{ id: 'door3609_gapSpill', kind: 'spot', position: spillFrom, target: spillTo, color: new THREE.Color(1.0, 0.66, 0.36), intensity: 4.5, distance: 7, decay: 2, angle: 0.55, penumbra: 0.5, priority: 200, wantsShadow: true,
    enabledAt: (t) => t > CUES.candyBucket - 1.5 && t < CUES.doorEnter - 0.15 && override === null,
    intensityAt: (t) => Math.min(1, Math.max(0, angleFn(t) - 0.03) / 0.3) }];
  return {
    group,
    anchors,
    sources,
    api,
    update(t) {
      update(t);
      keysRoot.getWorldPosition(anchors.door3609Keys.position);
    },
    materials: { paint, trim, brass, glass },
    _tmp: tmp,
  };
}
