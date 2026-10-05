import * as THREE from 'three';

// Gear geometry and meshing math.
//
// Gears share a module (tooth size). Two gears mesh when their centre distance
// equals the sum of pitch radii; their angles are linked by the tooth ratio and
// a phase offset that puts a tooth of one into a gap of the other. Nothing in
// the garden spins on its own: every wheel derives its angle from its driver.

const TAU = Math.PI * 2;

export function pitchRadius(teeth, module) {
  return (teeth * module) / 2;
}

function polar(r, a) {
  return new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r);
}

function arcPoints(path, r, a0, a1, steps, move = false) {
  for (let i = 0; i <= steps; i++) {
    const a = a0 + ((a1 - a0) * i) / steps;
    const p = polar(r, a);
    if (i === 0 && move) path.moveTo(p.x, p.y);
    else path.lineTo(p.x, p.y);
  }
}

// Outline of a spur gear with near-involute flanks.
export function gearShape(teeth, module) {
  const r = pitchRadius(teeth, module);
  const ro = r + module * 0.95;
  const rr = Math.max(module * 0.6, r - module * 1.2);
  const pitchAng = TAU / teeth;
  const shape = new THREE.Shape();
  for (let i = 0; i < teeth; i++) {
    const a = i * pitchAng;
    // angular half widths at root, pitch and tip
    const hwRoot = pitchAng * 0.3;
    const hwPitch = pitchAng * 0.25;
    const hwTip = pitchAng * 0.13;
    const pts = [
      [rr, a - pitchAng * 0.5],
      [rr, a - hwRoot - pitchAng * 0.02],
      [rr + (r - rr) * 0.45, a - hwRoot * 0.95],
      [r, a - hwPitch],
      [r + (ro - r) * 0.6, a - hwTip * 1.35],
      [ro, a - hwTip],
      [ro, a + hwTip],
      [r + (ro - r) * 0.6, a + hwTip * 1.35],
      [r, a + hwPitch],
      [rr + (r - rr) * 0.45, a + hwRoot * 0.95],
      [rr, a + hwRoot + pitchAng * 0.02],
    ];
    pts.forEach(([pr, pa], k) => {
      const p = polar(pr, pa);
      if (i === 0 && k === 0) shape.moveTo(p.x, p.y);
      else shape.lineTo(p.x, p.y);
    });
  }
  shape.closePath();
  return { shape, r, ro, rr };
}

// Watch-style escape wheel with club teeth (15 teeth by default).
export function escapeWheelShape(teeth = 15, radius = 1) {
  const shape = new THREE.Shape();
  const pitchAng = TAU / teeth;
  const rr = radius * 0.78;
  for (let i = 0; i < teeth; i++) {
    const a = i * pitchAng;
    const pts = [
      [rr, a],
      [radius * 0.98, a + pitchAng * 0.18], // leading (locking) face, raked forward
      [radius, a + pitchAng * 0.28], // club tip / impulse face
      [radius * 0.93, a + pitchAng * 0.36],
      [rr * 1.02, a + pitchAng * 0.82], // curved back of tooth
    ];
    pts.forEach(([pr, pa], k) => {
      const p = polar(pr, pa);
      if (i === 0 && k === 0) shape.moveTo(p.x, p.y);
      else shape.lineTo(p.x, p.y);
    });
  }
  shape.closePath();
  return shape;
}

// Add a bore and decorative spoke windows to a wheel shape.
export function addWheelHoles(shape, { bore, hub, rim, spokes = 5, spokeWidth = 0.18, curved = 0 }) {
  if (bore > 0) {
    const h = new THREE.Path();
    arcPoints(h, bore, 0, -TAU, 24, true);
    shape.holes.push(h);
  }
  if (spokes > 0 && rim - hub > 0.05) {
    const span = TAU / spokes;
    for (let s = 0; s < spokes; s++) {
      const a0 = s * span;
      const halfSpokeOuter = spokeWidth / rim / 2;
      const halfSpokeInner = spokeWidth / hub / 2;
      const w = new THREE.Path();
      const steps = 14;
      const sOut0 = a0 + halfSpokeOuter + curved;
      const sOut1 = a0 + span - halfSpokeOuter + curved;
      const sIn0 = a0 + halfSpokeInner;
      const sIn1 = a0 + span - halfSpokeInner;
      // outer arc (clockwise for holes)
      arcPoints(w, rim, sOut1, sOut0, steps, true);
      // down the spoke edge to the hub
      const mid0 = polar((rim + hub) / 2, (sOut0 + sIn0) / 2 + curved * 0.3);
      const in0 = polar(hub, sIn0);
      w.quadraticCurveTo(mid0.x, mid0.y, in0.x, in0.y);
      arcPoints(w, hub, sIn0, sIn1, Math.max(4, steps >> 1));
      const mid1 = polar((rim + hub) / 2, (sOut1 + sIn1) / 2 + curved * 0.3);
      const out1 = polar(rim, sOut1);
      w.quadraticCurveTo(mid1.x, mid1.y, out1.x, out1.y);
      shape.holes.push(w);
    }
  }
  return shape;
}

const geoCache = new Map();

export function gearGeometry({ teeth = 24, module = 0.1, thickness = 0.12, spokes = 5, bore = null, curved = 0, bevel = true, segments = 1 }) {
  const key = JSON.stringify([teeth, module, thickness, spokes, bore, curved, bevel, segments]);
  if (geoCache.has(key)) return geoCache.get(key);
  const { shape, r, rr } = gearShape(teeth, module);
  const boreR = bore ?? Math.max(module * 0.5, r * 0.08);
  const hub = Math.max(boreR * 2.2, r * 0.22);
  const rim = rr - module * 0.9;
  addWheelHoles(shape, { bore: boreR, hub, rim, spokes: teeth >= 16 ? spokes : 0, spokeWidth: Math.max(module * 1.2, r * 0.12), curved });
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: bevel,
    bevelThickness: thickness * 0.12,
    bevelSize: module * 0.08,
    bevelSegments: 2,
    curveSegments: 6,
    steps: segments,
  });
  geo.translate(0, 0, -thickness / 2);
  geo.computeVertexNormals();
  geoCache.set(key, geo);
  return geo;
}

export function escapeWheelGeometry({ teeth = 15, radius = 1, thickness = 0.08, spokes = 4 }) {
  const shape = escapeWheelShape(teeth, radius);
  addWheelHoles(shape, { bore: radius * 0.05, hub: radius * 0.18, rim: radius * 0.66, spokes, spokeWidth: radius * 0.07, curved: 0.25 });
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.15,
    bevelSize: radius * 0.006,
    bevelSegments: 2,
    curveSegments: 8,
  });
  geo.translate(0, 0, -thickness / 2);
  return geo;
}

// Meshing: returns the angle of `child` given the parent's angle.
// `dir` is the angle of the line from parent centre to child centre.
export function meshAngle(parentAngle, parentTeeth, childTeeth, dir) {
  const a1 = ((dir - parentAngle) * parentTeeth) / TAU;
  return dir + Math.PI - (TAU / childTeeth) * (0.5 - a1);
}

// A simple gear train. Gears are placed relative to a parent at a given
// direction; compound gears (same arbor) share the parent's angle.
export class GearTrain {
  constructor(module) {
    this.module = module;
    this.gears = [];
  }
  // root gear driven directly by the train input
  addRoot({ teeth, x = 0, y = 0, ratio = 1, phase = 0, ...rest }) {
    const g = { teeth, x, y, kind: 'root', ratio, phase, ...rest };
    this.gears.push(g);
    return g;
  }
  // gear meshing with `parent` in direction `dir`
  addMesh(parent, { teeth, dir, ...rest }) {
    const d = pitchRadius(parent.teeth, this.module) + pitchRadius(teeth, this.module);
    const g = {
      teeth,
      x: parent.x + Math.cos(dir) * d,
      y: parent.y + Math.sin(dir) * d,
      parent,
      dir,
      kind: 'mesh',
      ...rest,
    };
    this.gears.push(g);
    return g;
  }
  // gear fixed on the same arbor as `parent` (compound gear), different teeth
  addCompound(parent, { teeth, ...rest }) {
    const g = { teeth, x: parent.x, y: parent.y, parent, kind: 'compound', ...rest };
    this.gears.push(g);
    return g;
  }
  solve(inputAngle) {
    for (const g of this.gears) {
      if (g.kind === 'root') g.angle = inputAngle * g.ratio + g.phase;
      else if (g.kind === 'compound') g.angle = g.parent.angle;
      else g.angle = meshAngle(g.parent.angle, g.parent.teeth, g.teeth, g.dir);
    }
  }
}
