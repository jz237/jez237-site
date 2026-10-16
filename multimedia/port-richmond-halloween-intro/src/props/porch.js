// The 3607 Halloween display, v2 (DRESS): the straw-stuffed scarecrow decoration (assets/props/scarecrow.glb) and
// an EMPTY seat for the infected scarecrow actor share ONE hay bale on the sidewalk in front of the 3607 TV window,
// side by side: a matched pair of scarecrows (Halloween camouflage). The animatronic skeleton in its resin chair sits
// beside them (src/props/animatronic.js); the hero jack-o'-lantern sits on the 3607 landing (dressing.js).
// Layout along the 3607 frontage (world z, +Z = toward E Venango):
//   3609 door 3.63 | 3607 stoop 4.53-5.73 (hero pumpkin on the landing's -Z corner) | bale 5.86-7.17 (decoration on
//   the -Z half, infected seat on the +Z half) | skeleton chair ~7.6 (in front of the 3607 second window)
// Also the 3605 rail-tap bat. Nothing on or against Bauder Graphics (3613-15). The v1 porch-watcher seat is retired.
import * as THREE from 'three';
import { HERO, kitPoint, kitRotY, inBauderZone } from './site.js';
import { railBatAngle, railTapTimes, RAIL_BAT } from './timings.js';
import { cyl, sphere, merge, rbox } from './geo.js';
import { noise1 } from './util.js';

// the display's layout (world z along the 3607 frontage; x from the facade); shared with animatronic.js
export const DISPLAY = {
  bale: { z: 6.52, outFromFacade: 0.36, yawJitter: 0.04 },      // bale centre (long axis along the facade)
  decorationAlong: -0.33,                                         // decoration figure offset along the bale (m, +=+Z)
  seatAlong: 0.34,                                                // infected seat offset along the bale
  seatTop: 0.452,                                                 // bale top (seat contact) above the bale's base
  seatTurn: 0.16,                                                 // infected faces the street, turned toward +Z (the skeleton / P3 camera)
  chair: { z: 7.62, outFromFacade: 0.42, turn: -0.42 },           // skeleton chair; turn<0 = toward -Z (the P2 camera)
};

function placeholderFigure(color, seated = true) {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ name: 'FigurePlaceholder', color, roughness: 0.85 });
  const parts = [rbox(0.4, 0.55, 0.25, 0.08, 0, seated ? 0.75 : 1.1, -0.05), sphere(0.11, 0, seated ? 1.18 : 1.55, 0)];
  if (seated) parts.push(rbox(0.36, 0.14, 0.45, 0.05, 0, 0.47, 0.15), rbox(0.3, 0.45, 0.12, 0.05, 0, 0.22, 0.38));
  const mesh = new THREE.Mesh(merge(parts), m);
  mesh.castShadow = true; mesh.receiveShadow = true;
  g.add(mesh);
  return g;
}

// world point on the sidewalk in front of the 3607 facade at world z, `out` metres from the facade
export function frontage3607(z, out, groundY) {
  const st = HERO.steps3607;   // kit frame: ax = (0.01, -1), out = (-1, -0.01) -> bx = z0 - z
  const p = kitPoint(st, st.p[2] - z, out, 0);
  p.z = z;
  p.y = groundY(p.x, p.z);
  return p;
}

export async function buildPorch(ctx) {
  const st = HERO.steps3607;
  const group = new THREE.Group(); group.name = 'Display3607';
  const facadeYaw = kitRotY(st);            // local +Z -> the street (-X)
  const sources = [];
  const anchors = {};

  // ---- the hay bale + the decoration scarecrow ----
  const D = DISPLAY;
  const baleBase = frontage3607(D.bale.z, D.bale.outFromFacade, ctx.groundY);
  const bale = new THREE.Group(); bale.name = 'ScarecrowPair3607';
  bale.position.copy(baleBase);
  bale.rotation.y = facadeYaw + D.bale.yawJitter;   // bale local +X -> world +Z (along the facade), +Z -> street
  let decoFigure = null;
  try {
    const g = await ctx.loadGLTF('scarecrow.glb');
    const scene = g.scene.clone(true);
    scene.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true; o.receiveShadow = true;
      // alpha-tested straw cards thin out at a distance: a lower cut-off keeps them full
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m && /Straw/.test(m.name) && m.alphaTest > 0) m.alphaTest = 0.3;
    });
    const fig = scene.getObjectByName('Scarecrow');
    if (fig) {
      fig.position.x += D.decorationAlong;   // slide the figure onto the bale's -Z half; the actor takes the +Z half
      fig.rotation.y = -0.1;                 // slumped a little toward its partner
      decoFigure = fig;
    }
    bale.add(scene);
  } catch (e) {
    const b = new THREE.Mesh(rbox(1.3, 0.45, 0.6, 0.04, 0, 0.225, 0), new THREE.MeshStandardMaterial({ name: 'HayProc', color: 0xa88a48, roughness: 1 }));
    b.castShadow = true; bale.add(b);
    const fig = placeholderFigure(0x7a2a24); fig.position.set(D.decorationAlong, -0.03, 0); bale.add(fig);
    decoFigure = fig;
  }
  if (!inBauderZone(baleBase.x, baleBase.z)) group.add(bale);
  group.updateMatrixWorld(true);

  // ---- displaySeatInfected: the empty half of the bale (buttocks contact point + facing) ----
  const seatLocal = new THREE.Vector3(D.seatAlong, D.seatTop, 0.02);
  const seat = bale.localToWorld(seatLocal.clone());
  const qSeat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, facadeYaw + D.seatTurn, 0));
  const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(qSeat);
  const feet = seat.clone().addScaledVector(fwd, 0.52); feet.y = ctx.groundY(feet.x, feet.z);
  anchors.displaySeatInfected = {
    position: seat, quaternion: qSeat, feet, baleTop: seat.y, ground: ctx.groundY(seat.x, seat.z),
    note: 'empty seat for the infected scarecrow actor: the +Z half of the hay bale in front of the 3607 TV window, right beside the straw scarecrow decoration (matched pair, same bale, same height). position = buttocks contact on the bale top; quaternion: local +Z = facing (the street, turned ~9 deg toward +Z / the skeleton); feet = sidewalk point in front of the bale',
  };
  anchors.scarecrowDecoration = { position: decoFigure ? decoFigure.getWorldPosition(new THREE.Vector3()) : baleBase.clone(), quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, facadeYaw - 0.06, 0)), note: 'the straw scarecrow decoration (bale -Z half)' };
  anchors.scarecrowBale = { position: baleBase.clone(), quaternion: bale.quaternion.clone(), size: [1.31, 0.47, 0.62], note: 'hay bale base centre; local +X = along the facade (+Z world)' };
  anchors.porchFigures = { position: baleBase.clone().add(new THREE.Vector3(0, 0.6, 0)), quaternion: qSeat.clone(), note: 'centre of the 3607 display (v2)' };
  anchors.scarecrow = anchors.scarecrowDecoration;

  // ---- 3605 rail-tap bat (re-timed by CUES.railTapStart / railTapEnd in timings.js) ----
  const st5 = HERO.steps3605;
  const railBx = -0.66;
  const f = 0.42;
  const hang = kitPoint(st5, railBx - 0.012, 0.06 + f, 1.44 - 0.4 * f);
  const batPivot = new THREE.Group(); batPivot.name = 'RailTapBat';
  batPivot.position.copy(hang);
  batPivot.rotation.y = kitRotY(st5);
  group.add(batPivot);
  const swing = new THREE.Group(); batPivot.add(swing);
  const L = RAIL_BAT.L;
  const lineMat = new THREE.MeshBasicMaterial({ name: 'FishingLine', color: 0x2a2a2a, transparent: true, opacity: 0.45 });
  const line = new THREE.Mesh(cyl(0.0006, 0.0006, L - 0.05, 0, -(L - 0.05) / 2, 0, 0, 0, 0, 4), lineMat);
  swing.add(line);
  const batShape = new THREE.Shape();
  const bw = 0.11;
  batShape.moveTo(0, 0.03);
  batShape.quadraticCurveTo(bw * 0.4, 0.05, bw, 0.03); batShape.quadraticCurveTo(bw * 0.85, -0.0, bw * 0.92, -0.035);
  batShape.quadraticCurveTo(bw * 0.7, -0.02, bw * 0.6, -0.05); batShape.quadraticCurveTo(bw * 0.45, -0.025, bw * 0.3, -0.055); batShape.quadraticCurveTo(bw * 0.18, -0.03, 0, -0.045);
  batShape.quadraticCurveTo(-bw * 0.18, -0.03, -bw * 0.3, -0.055); batShape.quadraticCurveTo(-bw * 0.45, -0.025, -bw * 0.6, -0.05); batShape.quadraticCurveTo(-bw * 0.7, -0.02, -bw * 0.92, -0.035);
  batShape.quadraticCurveTo(-bw * 0.85, 0, -bw, 0.03); batShape.quadraticCurveTo(-bw * 0.4, 0.05, 0, 0.03);
  const batGeo = new THREE.ExtrudeGeometry(batShape, { depth: 0.006, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 1, curveSegments: 6 });
  batGeo.translate(0, 0, -0.003);
  const batBody = new THREE.Group();
  const batMesh = new THREE.Mesh(batGeo, new THREE.MeshStandardMaterial({ name: 'PlasticBat', color: 0x0a0a0c, roughness: 0.35 }));
  batMesh.castShadow = true;
  batBody.add(batMesh);
  const eyes = new THREE.Mesh(merge([sphere(0.004, -0.008, 0.012, 0.005), sphere(0.004, 0.008, 0.012, 0.005)]), new THREE.MeshStandardMaterial({ name: 'BatEyes', color: 0x550000, emissive: 0x330000, roughness: 0.2 }));
  batBody.add(eyes);
  batBody.position.y = -L;
  batBody.rotation.y = Math.PI / 2;
  swing.add(batBody);
  anchors.railTapBat = { position: hang.clone(), quaternion: batPivot.quaternion.clone(), note: 'pivot of the bat on its line (taps the 3605 iron railing); taps at railTapTimes' };

  return {
    group, anchors, sources,
    api: { scarecrow: decoFigure, bale, railTapBat: batPivot, railTapTimes, layout: DISPLAY },
    update(t) {
      const th = railBatAngle(t);
      swing.rotation.z = th;
      batBody.rotation.y = Math.PI / 2 + 0.5 * noise1(t * 0.9, 61) + 0.25 * noise1(t * 2.7, 62);
      batBody.rotation.x = 0.15 * noise1(t * 1.7, 63);
    },
  };
}
