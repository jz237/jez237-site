// Set dressing for the 3609 front room (INTERIOR graphics pass): what says an old widow lives here alone.
// End table under the lamp: a crocheted doily, the mail + the TV magazine, folded reading glasses, two pill bottles,
// a rosary. Coffee table: the remote, a mug. Sofa back: a 1970s granny-square afghan. Back wall: a crucifix with a
// dried Palm Sunday frond over the kitchen doorway, a church calendar by it. Everything static (merged by the room's
// mergeStatic), a handful of shared materials, no lights. Room-local frame (see room3609.js).
// Returns { group, boxes: [{ name, box (room-local Box3) }] } (boxes feed the probe's sight-line / path check).
import * as THREE from 'three';
import { box, rbox, cyl, merge, xform } from './geo.js';
import { furnitureMaterials } from './furniture.js';
import { CLUTTER_UV } from './textures_interior.js';
import { rng } from './util.js';

// map a geometry's 0..1 UVs into an atlas region [u0, v0, u1, v1]
function atlasUV(geo, r) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, r[0] + (r[2] - r[0]) * uv.getX(i), r[1] + (r[3] - r[1]) * uv.getY(i));
  return geo;
}
// a flat paper rectangle lying on a surface (top face = atlas region), thickness t
function paper(w, d, t, region) {
  const top = atlasUV(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), region);
  top.translate(0, t, 0);
  const g = merge([top, box(w, t, d, 0, t / 2, 0)]);
  return g;
}

export function buildDressing3609({ T, LAY, room, stair = null, rugMat = null }) {
  const fm = furnitureMaterials();
  const group = new THREE.Group(); group.name = 'Dressing3609';
  const boxes = [];
  const mats = {
    paper: new THREE.MeshStandardMaterial({ name: 'Clutter3609', map: T.clutter || null, color: T.clutter ? 0xffffff : 0xd8d2c4, roughness: 0.8 }),
    amber: new THREE.MeshStandardMaterial({ name: 'PillAmber3609', color: 0x7a3c0c, roughness: 0.22 }),
    cap: new THREE.MeshStandardMaterial({ name: 'PillCap3609', color: 0xe8e6e0, roughness: 0.5 }),
    lace: new THREE.MeshStandardMaterial({ name: 'Crochet3609', map: T.doily || null, color: 0xffffff, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 1 }),
    afghan: new THREE.MeshStandardMaterial({ name: 'Afghan3609', map: T.afghan || null, color: 0xffffff, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 1 }),
    beads: new THREE.MeshStandardMaterial({ name: 'RosaryBeads3609', color: 0x2a1a14, roughness: 0.35 }),
    // the stair runner: the rug's weave at a smaller scale, darker (worn, in the stair's shadow)
    runner: null,
  };
  if (rugMat && rugMat.map) {
    const t = rugMat.map.clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(0.42, 0.42); t.offset.set(0.31, 0.22); t.needsUpdate = true;
    mats.runner = new THREE.MeshStandardMaterial({ name: 'StairRunner3609', map: t, color: 0xb0a090, roughness: 0.97 });
  }
  const add = (geo, mat, name, cast = true) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.castShadow = cast; m.receiveShadow = true; group.add(m); return m; };
  const R = rng(3609);

  // ---------------------------------------------------------------- end table under the lamp (top y 0.62)
  {
    const cx = LAY.lamp.x, cz = LAY.lamp.z, top = 0.62;
    const at = (g, dx, dz, yaw, dy = 0) => xform(g, cx + dx, top + dy, cz + dz, 0, yaw, 0);
    // doily under the lamp base
    if (T.doily) add(at(new THREE.CircleGeometry(0.17, 48).rotateX(-Math.PI / 2), 0, 0, 0.4, 0.0012), mats.lace, 'Doily3609', false);
    // TV magazine + two envelopes on it (front-left of the lamp, toward the room)
    const mag = at(paper(0.2, 0.265, 0.004, CLUTTER_UV.magazine), -0.115, 0.115, 0.32, 0.0015);
    const env1 = at(paper(0.235, 0.105, 0.0015, CLUTTER_UV.envelopeB), -0.1, 0.1, 0.05, 0.0058);
    const env2 = at(paper(0.235, 0.105, 0.0015, CLUTTER_UV.envelopeA), -0.13, 0.13, -0.22, 0.0076);
    add(merge([mag, env1, env2]), mats.paper, 'Mail3609', false);
    // folded reading glasses on the mail (gold rims)
    {
      const gl = [];
      for (const s of [-1, 1]) {
        gl.push(xform(new THREE.TorusGeometry(0.021, 0.0018, 6, 22), s * 0.026, 0.0024, 0, Math.PI / 2, 0, 0, 1, 0.82, 1));
        gl.push(box(0.003, 0.002, 0.11, s * 0.045, 0.006, -0.05));           // folded temples
      }
      gl.push(box(0.012, 0.002, 0.003, 0, 0.003, 0.004));                    // bridge
      add(at(merge(gl), -0.11, 0.12, 0.5, 0.0095), fm.brass, 'Glasses3609', false);
    }
    // two pill bottles (amber, white caps, white labels), back-right of the lamp
    {
      const body = [], caps = [], labels = [];
      for (const [dx, dz, h, r] of [[0.15, -0.12, 0.075, 0.018], [0.105, -0.17, 0.06, 0.016]]) {
        body.push(cyl(r, r, h, cx + dx, top + h / 2, cz + dz, 0, 0, 0, 16));
        caps.push(cyl(r * 1.08, r * 1.08, 0.016, cx + dx, top + h + 0.008, cz + dz, 0, 0, 0, 16));
        labels.push(atlasUV(new THREE.CylinderGeometry(r * 1.01, r * 1.01, h * 0.62, 18, 1, true), CLUTTER_UV.pillLabel).translate(cx + dx, top + h * 0.5, cz + dz));
      }
      add(merge(body), mats.amber, 'PillBottles3609');
      add(merge(caps), mats.cap, 'PillCaps3609');
      add(merge(labels), mats.paper, 'PillLabels3609', false);
    }
    // a rosary pooled at the front edge: 5 decades of small beads + 6 larger, a loop, a little crucifix
    {
      const beads = [], cross = [];
      const n = 59;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const rx = 0.07 + 0.012 * Math.sin(a * 3 + 1.3), rz = 0.035 + 0.008 * Math.cos(a * 2);
        const big = i % 11 === 0;
        const rad = big ? 0.0052 : 0.0038;
        beads.push(xform(new THREE.SphereGeometry(rad, 7, 5), Math.cos(a) * rx, rad, Math.sin(a) * rz));
      }
      // the pendant: a few beads + the crucifix trailing off the loop
      for (let i = 1; i <= 4; i++) beads.push(xform(new THREE.SphereGeometry(i === 1 ? 0.0052 : 0.0038, 7, 5), 0.075 + i * 0.011, 0.004, 0.012 + i * 0.006));
      cross.push(box(0.008, 0.002, 0.034, 0.135, 0.002, 0.052, 0, 0.4, 0), box(0.022, 0.002, 0.007, 0.13, 0.002, 0.044, 0, 0.4, 0));
      add(at(merge(beads), -0.02, 0.185, -0.25, 0.0005), mats.beads, 'Rosary3609');
      add(at(merge(cross), -0.02, 0.185, -0.25, 0.0005), fm.brass, 'RosaryCross3609', false);
    }
    boxes.push({ name: 'endTableClutter', box: new THREE.Box3(new THREE.Vector3(cx - 0.25, top, cz - 0.25), new THREE.Vector3(cx + 0.25, top + 0.12, cz + 0.27)) });
  }

  // ---------------------------------------------------------------- coffee table (top y 0.43): remote + a mug
  {
    const cx = LAY.coffee.x, cz = LAY.coffee.z, top = 0.43;
    // remote (left part of the table, the candy bowl sits on the right)
    const rem = xform(rbox(0.05, 0.02, 0.2, 0.008), 0, 0.01, 0);
    add(xform(rem, cx - 0.32, top, cz + 0.06, 0, 0.42, 0), fm.blackPlastic, 'Remote3609');
    add(xform(atlasUV(new THREE.PlaneGeometry(0.042, 0.19).rotateX(-Math.PI / 2), CLUTTER_UV.remote), cx - 0.32, top + 0.0205, cz + 0.06, 0, 0.42, 0), mats.paper, 'RemoteFace3609', false);
    // mug (cold tea), the lamp's ceramic glaze
    const mug = [new THREE.LatheGeometry([[0, 0], [0.038, 0], [0.04, 0.005], [0.041, 0.09], [0.037, 0.09], [0.036, 0.008], [0, 0.008]].map(([r, h]) => new THREE.Vector2(r, h)), 20),
      xform(new THREE.TorusGeometry(0.024, 0.006, 6, 12, Math.PI), 0.041, 0.045, 0, 0, 0, -Math.PI / 2)];
    add(xform(merge(mug), cx - 0.5, top, cz - 0.1, 0, 1.1, 0), fm.ceramic, 'Mug3609');
    // a dark tea surface inside
    add(xform(new THREE.CircleGeometry(0.036, 16).rotateX(-Math.PI / 2), cx - 0.5, top + 0.07, cz - 0.1), mats.beads, 'MugTea3609', false);
    boxes.push({ name: 'coffeeTableClutter', box: new THREE.Box3(new THREE.Vector3(cx - 0.56, top, cz - 0.16), new THREE.Vector3(cx - 0.24, top + 0.1, cz + 0.18)) });
  }

  // ---------------------------------------------------------------- the afghan over the sofa back
  // drape profile across the back (room z, y), seat side -> over the cushions -> down the back toward the door
  if (T.afghan) {
    const S = LAY.sofa;
    const prof = [[-2.565, 0.84], [-2.528, 0.95], [-2.46, 1.04], [-2.38, 1.035], [-2.32, 1.012], [-2.27, 0.92], [-2.225, 0.885], [-2.198, 0.84], [-2.188, 0.72], [-2.184, 0.58], [-2.182, 0.47]];
    const x0 = S.x - 0.84, x1 = S.x + 0.34;    // ~1.2 m wide, off-centre toward the lamp end (starts at the cushions, not over the arm)
    const nx = 36, np = 44;
    // arc-length parametrise the profile
    const seg = []; let L = 0;
    for (let i = 1; i < prof.length; i++) { const l = Math.hypot(prof[i][0] - prof[i - 1][0], prof[i][1] - prof[i - 1][1]); seg.push(l); L += l; }
    const at = (s) => { let i = 0; while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; } const t = Math.min(1, s / seg[i]); return [prof[i][0] + (prof[i + 1][0] - prof[i][0]) * t, prof[i][1] + (prof[i + 1][1] - prof[i][1]) * t]; };
    const geo = new THREE.PlaneGeometry(1, 1, nx, np);
    const p = geo.attributes.position, uv = geo.attributes.uv;
    const ph = R() * 6;
    for (let i = 0; i < p.count; i++) {
      const u = uv.getX(i), v = 1 - uv.getY(i);                 // v: 0 at the seat-side edge -> 1 at the hanging hem
      const s = v * L;
      let [z, y] = at(s);
      const x = x0 + (x1 - x0) * u;
      // folds in the hanging part (outward only, away from the sofa) and a sag between the cushions on top
      const hang = Math.max(0, (s - L * 0.55) / (L * 0.45));
      z += hang * 0.018 * (1 + Math.sin(x * 21 + ph)) + hang * hang * 0.012 * (1 + Math.sin(x * 47 + ph * 2));
      y -= (1 - hang) * 0.012 * Math.max(0, Math.sin(((x - (S.x - S.len / 2 + 0.2)) / ((S.len - 0.4) / 3)) * Math.PI) * -1 + 0.5);
      y += hang * 0.01 * Math.sin(x * 13 + ph);
      p.setXYZ(i, x, y, z);
      uv.setXY(i, u * (x1 - x0) / 0.6, (1 - v) * L / 0.6);
    }
    geo.computeVertexNormals();
    add(geo, mats.afghan, 'Afghan3609');
    boxes.push({ name: 'afghan', box: new THREE.Box3(new THREE.Vector3(x0, 0.45, -2.57), new THREE.Vector3(x1, 1.06, -2.15)) });
  }

  // ---------------------------------------------------------------- crucifix + palm over the kitchen doorway
  {
    const cx = -1.125, cy = 2.36, z = room.BW + 0.01;
    const crossG = merge([box(0.028, 0.26, 0.014, 0, 0, 0), box(0.15, 0.028, 0.014, 0, 0.05, 0), box(0.04, 0.02, 0.016, 0, -0.12, 0.001)]);
    add(xform(crossG, cx, cy, z + 0.007), fm.wood, 'Crucifix3609');
    const corpus = merge([box(0.016, 0.085, 0.008, 0, -0.005, 0), box(0.11, 0.009, 0.007, 0, 0.05, 0), xform(new THREE.SphereGeometry(0.0085, 8, 6), 0, 0.048 + 0.012, 0.002),
      box(0.008, 0.05, 0.007, -0.004, -0.07, 0, 0, 0, 0.08), box(0.008, 0.05, 0.007, 0.004, -0.07, 0, 0, 0, -0.08)]);
    add(xform(corpus, cx, cy, z + 0.018), fm.brass, 'Corpus3609', false);
    // dried palm frond tucked behind the cross (Palm Sunday), curling to one side
    const palm = [];
    for (let i = 0; i < 6; i++) palm.push(box(0.012, 0.05, 0.002, 0.03 + i * 0.022, 0.07 - i * i * 0.006, 0.0, 0, 0, -0.35 - i * 0.12));
    add(xform(merge(palm), cx, cy, z + 0.002), new THREE.MeshStandardMaterial({ name: 'Palm3609', color: 0x9c8452, roughness: 0.8 }), 'Palm3609', false);
  }
  // ---------------------------------------------------------------- stair runner + brass rods (if the stair is passed)
  if (stair && mats.runner) {
    const { x0, x1, z0, n, rise, run } = stair;
    const cx = (x0 + x1) / 2, w = 0.62;
    const pieces = [], rods = [];
    for (let i = 0; i < n; i++) {
      const zf = z0 - i * run;                      // riser i front face at zf + 0.02, tread i top at (i + 1) * rise
      const yTop = (i + 1) * rise;
      // on the riser (below the nosing)
      pieces.push(box(w, rise - 0.03, 0.006, cx, i * rise + (rise - 0.03) / 2, zf + 0.023));
      if (i < n - 1) {
        pieces.push(box(w, 0.006, run + 0.025, cx, yTop + 0.003, zf - run / 2 + 0.0125));   // on the tread
        pieces.push(box(w, 0.036, 0.006, cx, yTop - 0.015, zf + 0.028));                   // wrapped round the nosing
        rods.push(cyl(0.0045, 0.0045, w + 0.06, cx, yTop + 0.011, zf - run + 0.031, 0, 0, Math.PI / 2, 8));   // rod in the crease (on the runner, against the next riser)
      }
    }
    add(merge(pieces), mats.runner, 'StairRunner3609');
    add(merge(rods), fm.brass, 'StairRods3609', false);
  }

  // ---------------------------------------------------------------- coats on a hook rail by the kitchen doorway
  // (the back wall between the stair skirt and the doorway casing: x -2.6 .. -1.65; nothing walks there)
  {
    const z = room.BW, y0 = 1.76;
    add(box(0.7, 0.075, 0.022, -2.17, y0, z + 0.011), fm.wood, 'HookRail3609');
    const hooks = [];
    for (const hx of [-2.42, -2.17, -1.92]) { hooks.push(cyl(0.006, 0.006, 0.05, hx, y0 - 0.005, z + 0.045, Math.PI / 2, 0, 0, 8)); hooks.push(xform(new THREE.SphereGeometry(0.009, 8, 6), hx, y0 - 0.005, z + 0.07)); }
    add(merge(hooks), fm.brass, 'Hooks3609', false);
    // a hanging coat: a half tube open at the back (against the wall), shoulders narrowing to the hook, folds
    // deepening toward the hem
    const coat = (hx, len, wTop, wBot, depth, seed) => {
      const Rr = rng(seed);
      const geo = new THREE.PlaneGeometry(1, 1, 16, 20);
      const p = geo.attributes.position, uv = geo.attributes.uv;
      const ph = Rr() * 6, ph2 = Rr() * 6;
      for (let i = 0; i < p.count; i++) {
        const u = uv.getX(i), v = 1 - uv.getY(i);               // v: 0 at the hook -> 1 at the hem
        const sh = Math.min(1, v / 0.13);
        const w = (0.1 + (wTop - 0.1) * (sh * (2 - sh))) + (wBot - wTop) * Math.max(0, v - 0.13) / 0.87;
        let x = hx + (u - 0.5) * w;
        let zz = z + 0.03 + depth * Math.sin(Math.PI * u) * (0.35 + 0.65 * sh);
        zz += v * 0.022 * Math.sin(u * Math.PI * 7 + ph) * Math.sin(Math.PI * u) + v * v * 0.012 * Math.sin(u * Math.PI * 13 + ph2);
        x += v * 0.008 * Math.sin(v * 9 + ph);
        p.setXYZ(i, x, y0 - 0.02 - v * len, zz);
      }
      geo.computeVertexNormals();
      return geo;
    };
    add(coat(-2.42, 0.98, 0.42, 0.56, 0.11, 71), new THREE.MeshStandardMaterial({ name: 'WoolCoat3609', color: 0x232838, roughness: 1 }), 'Coat3609');
    add(coat(-2.15, 0.86, 0.4, 0.5, 0.1, 72), new THREE.MeshStandardMaterial({ name: 'RainCoat3609', color: 0x7a6c52, roughness: 0.75 }), 'Raincoat3609');
    // a black umbrella hung by its crook from the third hook
    const um = [new THREE.CylinderGeometry(0.012, 0.045, 0.62, 10, 1).translate(0, -0.42, 0), cyl(0.005, 0.005, 0.12, 0, -0.06, 0, 0, 0, 0, 6),
      xform(new THREE.TorusGeometry(0.03, 0.006, 6, 12, Math.PI), 0.03, 0.0, 0, 0, 0, 0)];
    add(xform(merge(um), -1.92, y0 - 0.015, z + 0.075), fm.blackPlastic, 'Umbrella3609');
    boxes.push({ name: 'coats', box: new THREE.Box3(new THREE.Vector3(-2.72, 0.7, z), new THREE.Vector3(-1.85, 1.82, z + 0.2)) });
  }

  // church calendar hanging on a nail right of the doorway
  {
    const cal = atlasUV(new THREE.PlaneGeometry(0.3, 0.19), CLUTTER_UV.calendar);
    add(xform(cal, -0.38, 1.6, room.BW + 0.004, 0, 0, 0.025), mats.paper, 'Calendar3609', false);
  }
  return { group, boxes, materials: mats };
}

// a lace cloth draped along a profile (local frame of the piece of furniture it lies on): x across, profile in (z, y)
function drape(x0, x1, prof, nx = 12, np = 16) {
  const seg = []; let L = 0;
  for (let i = 1; i < prof.length; i++) { const l = Math.hypot(prof[i][0] - prof[i - 1][0], prof[i][1] - prof[i - 1][1]); seg.push(l); L += l; }
  const at = (s) => { let i = 0; while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; } const t = Math.min(1, s / seg[i]); return [prof[i][0] + (prof[i + 1][0] - prof[i][0]) * t, prof[i][1] + (prof[i + 1][1] - prof[i][1]) * t]; };
  const geo = new THREE.PlaneGeometry(1, 1, nx, np);
  const p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) { const u = uv.getX(i), v = 1 - uv.getY(i); const [z, y] = at(v * L); p.setXYZ(i, x0 + (x1 - x0) * u, y, z); }
  geo.computeVertexNormals();
  return geo;
}
// (INTERIOR gfx) the antimacassar over the armchair's back cushion and a doily on the sofa's lamp-end arm (never the
// gap end: the homeowner crawls round it). Added as children of the furniture groups, in their local frames.
export function dressFurniture3609({ chair, sofa, lace, sofaLen }) {
  if (!lace) return [];
  const a = new THREE.Mesh(drape(-0.2, 0.2, [[-0.152, 0.86], [-0.17, 0.95], [-0.186, 0.996], [-0.272, 0.988], [-0.36, 0.966], [-0.405, 0.915], [-0.447, 0.88], [-0.452, 0.8]]), lace);
  a.name = 'Antimacassar3609'; a.receiveShadow = true; chair.add(a);
  const ax = sofaLen / 2 - 0.1;                     // the arm at local +x = the lamp end once the sofa is turned round
  const d = new THREE.Mesh(drape(ax - 0.09, ax + 0.09, [[0.1, 0.644], [0.38, 0.644], [0.43, 0.632], [0.452, 0.6], [0.456, 0.54], [0.457, 0.47]]), lace);
  d.name = 'ArmDoily3609'; d.receiveShadow = true; sofa.add(d);
  return [a, d];
}
