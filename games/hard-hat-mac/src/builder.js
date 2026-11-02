// Level construction kit: geometry helpers + physics boxes, merged by material at finish().
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PhysWorld } from './physics.js';
import { signTexture, cutaway } from './textures.js';

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Euler();

// Box with UVs scaled to world size so textures keep a constant texel density.
export function boxGeo(w, h, d, tile = 2, x = 0, y = 0, z = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  const offs = [[z, y], [z, y], [x, z], [x, z], [x, y], [x, y]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
    const i = f * 4 + k;
    uv.setXY(i, uv.getX(i) * dims[f][0] / tile + offs[f][0] / tile * .37, uv.getY(i) * dims[f][1] / tile + offs[f][1] / tile * .37);
  }
  g.translate(x, y, z);
  return g;
}

function cylGeo(r, h, seg, x, y, z, axis = 'y', r2 = r) {
  const g = new THREE.CylinderGeometry(r2, r, h, seg, 1);
  if (axis === 'x') g.rotateZ(Math.PI / 2); else if (axis === 'z') g.rotateX(Math.PI / 2);
  g.translate(x, y, z);
  return g;
}

export class Builder {
  constructor(M) {
    this.M = M; this.world = new PhysWorld(); this.group = new THREE.Group();
    this.buckets = new Map();
    this.ladders = []; this.items = []; this.sockets = []; this.movers = []; this.hazards = [];
    this.lights = []; this.lamps = []; this.signs = []; this.navExtra = []; this.enemies = [];
  }
  geo(g, mat) { let a = this.buckets.get(mat); if (!a) this.buckets.set(mat, a = []); a.push(g); return g; }
  solid(x0, y0, z0, x1, y1, z1, props = {}) { return this.world.add(Object.assign({ x0, y0, z0, x1, y1, z1, surf: 'steel' }, props)); }
  block(x0, y0, z0, x1, y1, z1, mat, props = {}, tile = 2) {
    this.geo(boxGeo(x1 - x0, y1 - y0, z1 - z0, tile, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), mat);
    return props.visualOnly ? null : this.solid(x0, y0, z0, x1, y1, z1, props);
  }
  // Horizontal I-beam along 'x' or 'z' from a0..a1, top flange at yTop, centred on c.
  ibeam(axis, a0, a1, yTop, c, H = 0.42, W = 0.3, mat = this.M.beam) {
    const L = a1 - a0, m = (a0 + a1) / 2, tf = 0.05, tw = 0.04;
    const parts = axis === 'x'
      ? [[L, tf, W, m, yTop - tf / 2, c], [L, tf, W, m, yTop - H + tf / 2, c], [L, H - 2 * tf, tw, m, yTop - H / 2, c]]
      : [[W, tf, L, c, yTop - tf / 2, m], [W, tf, L, c, yTop - H + tf / 2, m], [tw, H - 2 * tf, L, c, yTop - H / 2, m]];
    for (const p of parts) this.geo(boxGeo(p[0], p[1], p[2], 2, p[3], p[4], p[5]), mat);
  }
  column(x, z, y0, y1, solid = true, S = 0.36) {
    const tf = 0.05, H = y1 - y0, ym = (y0 + y1) / 2;
    this.geo(boxGeo(S, H, tf, 2, x, ym, z - S / 2 + tf / 2), this.M.beam);
    this.geo(boxGeo(S, H, tf, 2, x, ym, z + S / 2 - tf / 2), this.M.beam);
    this.geo(boxGeo(0.045, H, S - 2 * tf, 2, x, ym, z), this.M.beam);
    if (solid) this.solid(x - S / 2, y0, z - S / 2, x + S / 2, y1, z + S / 2, { surf: 'steel', column: true });
  }
  // Walkable deck with I-beam stringers underneath. top = walking height.
  deck(x0, z0, x1, z1, top, opts = {}) {
    const { mat = this.M.deck, th = 0.12, beams = true, surf = 'steel', edge = true } = opts;
    this.geo(boxGeo(x1 - x0, th, z1 - z0, 2, (x0 + x1) / 2, top - th / 2, (z0 + z1) / 2), mat);
    if (beams) {
      const long = (x1 - x0) >= (z1 - z0);
      if (long) { this.ibeam('x', x0, x1, top - th, z0 + 0.18); this.ibeam('x', x0, x1, top - th, z1 - 0.18); }
      else { this.ibeam('z', z0, z1, top - th, x0 + 0.18); this.ibeam('z', z0, z1, top - th, x1 - 0.18); }
    }
    if (edge && opts.toe) {
      // hazard-striped toe boards on requested sides
      for (const s of opts.toe) {
        if (s === 'z0') this.geo(boxGeo(x1 - x0, 0.1, 0.04, 1, (x0 + x1) / 2, top + 0.05, z0 + 0.02), this.M.hazard);
        if (s === 'z1') this.geo(boxGeo(x1 - x0, 0.1, 0.04, 1, (x0 + x1) / 2, top + 0.05, z1 - 0.02), this.M.hazard);
        if (s === 'x0') this.geo(boxGeo(0.04, 0.1, z1 - z0, 1, x0 + 0.02, top + 0.05, (z0 + z1) / 2), this.M.hazard);
        if (s === 'x1') this.geo(boxGeo(0.04, 0.1, z1 - z0, 1, x1 - 0.02, top + 0.05, (z0 + z1) / 2), this.M.hazard);
      }
    }
    return opts.visualOnly ? null : this.solid(x0, top - Math.max(th, 0.45), z0, x1, top, z1, { surf, deck: true });
  }
  plankDeck(x0, z0, x1, z1, top, opts = {}) { return this.deck(x0, z0, x1, z1, top, Object.assign({ mat: this.M.plank, surf: 'wood', th: 0.08, beams: false }, opts)); }
  // Railing along a straight line at deck height y (solid low wall so you can't walk off).
  rail(x0, z0, x1, z1, y, opts = {}) {
    const { h = 1.05, mat = this.M.yellow, solid = true, posts = 1.5 } = opts;
    const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / posts)), alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0);
    for (let i = 0; i <= n; i++) { const t = i / n; this.geo(boxGeo(0.06, h, 0.06, 1, x0 + (x1 - x0) * t, y + h / 2, z0 + (z1 - z0) * t), mat); }
    for (const hh of [h, h * 0.52]) {
      if (alongX) this.geo(cylGeo(0.03, L, 6, (x0 + x1) / 2, y + hh, z0, 'x'), mat);
      else this.geo(cylGeo(0.03, L, 6, x0, y + hh, (z0 + z1) / 2, 'z'), mat);
    }
    if (solid) {
      const t = 0.08;
      return this.solid(Math.min(x0, x1) - t, y, Math.min(z0, z1) - t, Math.max(x0, x1) + t, y + h, Math.max(z0, z1) + t, { rail: true, noFloor: true });
    }
  }
  // Ladder whose rail plane is centred at (x,z); climber stands on side `face` ('+x','-x','+z','-z').
  ladder(x, z, y0, y1, face, opts = {}) {
    const fx = face === '+x' ? 1 : face === '-x' ? -1 : 0, fz = face === '+z' ? 1 : face === '-z' ? -1 : 0;
    const w = 0.5, top = y1 + 1.0, H = top - y0, mat = opts.mat || this.M.galv;
    const px = fz !== 0 ? 1 : 0, pz = fx !== 0 ? 1 : 0; // perpendicular (width) axis
    for (const s of [-1, 1]) this.geo(boxGeo(px ? 0.06 : 0.05, H, pz ? 0.06 : 0.05, 1, x + px * s * w * .5, y0 + H / 2, z + pz * s * w * .5), mat);
    for (let y = y0 + 0.3; y < top - 0.05; y += 0.3) this.geo(cylGeo(0.022, w, 6, x, y, z, px ? 'x' : 'z'), mat);
    const L = { x, z, y0, y1, fx, fz, w: 0.9 };
    this.ladders.push(L);
    return L;
  }
  // Moving belt: physics box carries riders at (vx, vz); texture scrolls to match.
  conveyor(x0, z0, x1, z1, top, vx, vz) {
    const alongX = Math.abs(vx) > Math.abs(vz), key = alongX ? 'beltTexX' : 'beltTexZ';
    if (!this[key]) {
      const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
      g.fillStyle = '#26282b'; g.fillRect(0, 0, 128, 128);
      g.fillStyle = '#3a3d41'; for (let k = 0; k < 128; k += 32) alongX ? g.fillRect(k, 0, 12, 128) : g.fillRect(0, k, 128, 12);
      g.fillStyle = 'rgba(242,177,10,.55)'; if (alongX) { g.fillRect(0, 0, 128, 5); g.fillRect(0, 123, 128, 5); } else { g.fillRect(0, 0, 5, 128); g.fillRect(123, 0, 5, 128); }
      this[key] = new THREE.CanvasTexture(c); this[key].colorSpace = THREE.SRGBColorSpace;
    }
    const tex = this[key].clone();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.needsUpdate = true;
    const mat = cutaway(new THREE.MeshStandardMaterial({ map: tex, roughness: .85, metalness: .1 }));
    const mesh = new THREE.Mesh(boxGeo(x1 - x0, .1, z1 - z0, 1, (x0 + x1) / 2, top - .05, (z0 + z1) / 2), mat);
    mesh.receiveShadow = true; mesh.castShadow = true; this.group.add(mesh);
    if (alongX) { this.geo(boxGeo(x1 - x0, .3, .1, 2, (x0 + x1) / 2, top - .25, z0 - .05), this.M.yellow); this.geo(boxGeo(x1 - x0, .3, .1, 2, (x0 + x1) / 2, top - .25, z1 + .05), this.M.yellow); }
    else { this.geo(boxGeo(.1, .3, z1 - z0, 2, x0 - .05, top - .25, (z0 + z1) / 2), this.M.yellow); this.geo(boxGeo(.1, .3, z1 - z0, 2, x1 + .05, top - .25, (z0 + z1) / 2), this.M.yellow); }
    (this.belts = this.belts || []).push({ tex, alongX, speed: alongX ? vx : vz });
    return this.solid(x0, top - .4, z0, x1, top, z1, { conv: { x: vx, z: vz }, surf: 'steel' });
  }
  sign(lines, x, y, z, w, h, rotY = 0, opts = {}) {
    const tex = signTexture(lines, Object.assign({ w: 1024, h: Math.round(1024 * h / w) }, opts));
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: .6, metalness: .1, emissive: opts.glow ? new THREE.Color(1, 1, 1) : new THREE.Color(0), emissiveMap: opts.glow ? tex : null, emissiveIntensity: opts.glow || 0 });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), cutaway(mat));
    m.position.set(x, y, z); m.rotation.y = rotY; m.receiveShadow = true;
    this.group.add(m); this.signs.push(m);
    const back = new THREE.Mesh(new THREE.BoxGeometry(w + .08, h + .08, .05), this.M.dark);
    back.position.set(0, 0, -.03); m.add(back); back.castShadow = true;
    return m;
  }
  // ---- props ----
  container(x, y, z, axis, color, opts = {}) {
    const L = 6.06, H = 2.59, W = 2.44;
    const [w, d] = axis === 'x' ? [L, W] : [W, L];
    const mat = this.M.corr(color);
    this.geo(boxGeo(w, H, d, 2.4, x, y + H / 2, z), mat);
    // frame rails
    const fr = this.M.paint(new THREE.Color(color).multiplyScalar(.6).getHex(), .6, .3);
    for (const sy of [y + 0.06, y + H - 0.06]) {
      if (axis === 'x') { this.geo(boxGeo(L + .04, .12, .14, 1, x, sy, z - W / 2), fr); this.geo(boxGeo(L + .04, .12, .14, 1, x, sy, z + W / 2), fr); }
      else { this.geo(boxGeo(.14, .12, L + .04, 1, x - W / 2, sy, z), fr); this.geo(boxGeo(.14, .12, L + .04, 1, x + W / 2, sy, z), fr); }
    }
    // door bars on one end
    for (let k = -1; k <= 1; k += 2) for (const s of [-.35, .35]) {
      if (axis === 'x') this.geo(cylGeo(.025, H - .3, 6, x + k * (L / 2 + .02), y + H / 2, z + s * W / 2.2), this.M.galv);
      else this.geo(cylGeo(.025, H - .3, 6, x + s * W / 2.2, y + H / 2, z + k * (L / 2 + .02)), this.M.galv);
    }
    return opts.visualOnly ? null : this.solid(x - w / 2, y, z - d / 2, x + w / 2, y + H, z + d / 2, { surf: 'steel' });
  }
  crate(x, y, z, s = 1.1, solid = true) {
    this.geo(boxGeo(s, s, s, 1.2, x, y + s / 2, z), this.M.wood);
    for (const k of [-1, 1]) this.geo(boxGeo(s + .02, .1, s + .02, 1, x, y + s / 2 + k * s * .38, z), this.M.wood);
    return solid ? this.solid(x - s / 2, y, z - s / 2, x + s / 2, y + s, z + s / 2, { surf: 'wood' }) : null;
  }
  barrel(x, y, z, color = 0x2f5d8a) {
    this.geo(cylGeo(.3, .9, 14, x, y + .45, z), this.M.paint(color, .5, .4));
    return this.solid(x - .3, y, z - .3, x + .3, y + .9, z + .3);
  }
  cone(x, y, z) {
    this.geo(cylGeo(.17, .55, 10, x, y + .3, z, 'y', .02), this.M.paint(0xff5a14, .5, 0));
    this.geo(boxGeo(.4, .04, .4, 1, x, y + .02, z), this.M.paint(0xff5a14, .5, 0));
  }
  pipes(x, y, z, axis, n = 3, r = .3, len = 6, color = 0x6d7176) {
    const mat = this.M.paint(color, .5, .7); let k = 0;
    for (let row = 0; row < n; row++) for (let i = 0; i < n - row; i++, k++) {
      const off = (i - (n - row - 1) / 2) * r * 2.05, yy = y + r + row * r * 1.75;
      if (axis === 'x') this.geo(cylGeo(r, len, 14, x, yy, z + off, 'x'), mat); else this.geo(cylGeo(r, len, 14, x + off, yy, z, 'z'), mat);
    }
    const hw = n * r * 1.03, H = r * 2 + (n - 1) * r * 1.75;
    return axis === 'x' ? this.solid(x - len / 2, y, z - hw, x + len / 2, y + H, z + hw) : this.solid(x - hw, y, z - len / 2, x + hw, y + H, z + len / 2);
  }
  barrier(x, y, z, axis, len = 3) {
    const [w, d] = axis === 'x' ? [len, .5] : [.5, len];
    this.geo(boxGeo(w, .8, d, 2, x, y + .4, z), this.M.concrete);
    this.geo(boxGeo(axis === 'x' ? len : .52, .18, axis === 'x' ? .52 : len, 1, x, y + .6, z), this.M.hazard);
    return this.solid(x - w / 2, y, z - d / 2, x + w / 2, y + .8, z + d / 2, { surf: 'concrete' });
  }
  lampPost(x, y, z, h = 7, color = 0xfff1d6, dir = 0) {
    this.geo(boxGeo(.14, h, .14, 1, x, y + h / 2, z), this.M.dark);
    this.geo(boxGeo(.9, .35, .5, 1, x + Math.cos(dir) * .2, y + h, z + Math.sin(dir) * .2), this.M.dark);
    const head = new THREE.Mesh(new THREE.BoxGeometry(.8, .08, .42), this.M.glow(color, 0));
    head.position.set(x + Math.cos(dir) * .2, y + h - .2, z + Math.sin(dir) * .2);
    this.group.add(head);
    this.lamps.push({ mesh: head, pos: new THREE.Vector3(x, y + h - .5, z), color });
    this.solid(x - .1, y, z - .1, x + .1, y + h, z + .1, { noFloor: true });
  }
  trailer(x, y, z, axis = 'x') {
    const [w, d] = axis === 'x' ? [8, 3] : [3, 8];
    this.geo(boxGeo(w, 2.7, d, 2.4, x, y + .6 + 1.35, z), this.M.corr(0xe9e4d6));
    for (let k = -1; k <= 1; k++) {
      if (axis === 'x') { this.geo(boxGeo(1.1, .7, .05, 1, x + k * 2.4, y + 2.2, z + d / 2 + .01), this.M.glass); }
      else this.geo(boxGeo(.05, .7, 1.1, 1, x + w / 2 + .01, y + 2.2, z + k * 2.4), this.M.glass);
    }
    this.geo(boxGeo(w - .4, .6, d - .4, 1, x, y + .3, z), this.M.dark);
    return this.solid(x - w / 2, y, z - d / 2, x + w / 2, y + 3.3, z + d / 2, { surf: 'steel' });
  }
  // Lattice mast for tower cranes (visual), square section s, from y0 to y1.
  lattice(x, z, y0, y1, s = 1.6, mat = this.M.yellow, seg = 1.8) {
    const h = s / 2, t = .1;
    for (const [dx, dz] of [[-h, -h], [h, -h], [h, h], [-h, h]]) this.geo(boxGeo(t, y1 - y0, t, 1, x + dx, (y0 + y1) / 2, z + dz), mat);
    for (let y = y0; y < y1 - .01; y += seg) {
      const yn = Math.min(y1, y + seg), dl = Math.hypot(s, yn - y), ang = Math.atan2(yn - y, s);
      for (let f = 0; f < 4; f++) {
        const g = new THREE.BoxGeometry(dl, .06, .06);
        g.rotateZ(f & 1 ? -ang : ang); g.rotateY(f * Math.PI / 2);
        const ox = [0, h, 0, -h][f], oz = [h, 0, -h, 0][f];
        g.translate(x + ox, (y + yn) / 2, z + oz); this.geo(g, mat);
      }
      this.geo(boxGeo(s, .06, .06, 1, x, y, z - h), mat); this.geo(boxGeo(s, .06, .06, 1, x, y, z + h), mat);
      this.geo(boxGeo(.06, .06, s, 1, x - h, y, z), mat); this.geo(boxGeo(.06, .06, s, 1, x + h, y, z), mat);
    }
  }
  // Horizontal lattice boom built into a Group (so it can rotate). Returns group.
  boom(len, s = 1.2, mat = this.M.yellow, back = 0) {
    const geos = [], h = s / 2, t = .09, x0 = -back, L = len + back;
    for (const [dy, dz] of [[0, -h], [0, h], [s, 0]]) geos.push(boxGeo(L, t, t, 1, x0 + L / 2, dy, dz));
    for (let x = x0; x < len - .01; x += 1.5) {
      for (const [a, b] of [[[0, -h], [s, 0]], [[0, h], [s, 0]], [[0, -h], [0, h]]]) {
        const dy = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dy, dz), g = new THREE.BoxGeometry(.05, l, .05);
        g.rotateX(Math.atan2(dz, dy)); g.translate(x, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); geos.push(g);
      }
    }
    const m = new THREE.Mesh(mergeGeometries(geos), mat);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  }
  finish() {
    for (const [mat, list] of this.buckets) {
      const g = mergeGeometries(list, false);
      for (const x of list) x.dispose();
      const mesh = new THREE.Mesh(g, mat);
      mesh.castShadow = true; mesh.receiveShadow = true; mesh.matrixAutoUpdate = false;
      this.group.add(mesh);
    }
    this.buckets.clear();
    return this;
  }
}
