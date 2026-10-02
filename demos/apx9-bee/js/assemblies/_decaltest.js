// Decal calibration: text + bee logo + hazard on an ellipsoid plate and on a drum. Load with ?demo=_decaltest&only=none
export function build(ctx) {
  const { bee, M, V3, armorPanel, surf, rectPts, sphere, cyl, T, decalPatch, decal, M4 } = ctx;
  const p = bee.part('dt-plate', { name: 'Decal test plate', group: 'thorax-armor', tag: 'shell', info: 'decal test plate for calibration', explode: [0, 0, 0] });
  const eli = (dir, up, roll = 0) => surf.ellipsoid({ center: V3(0, 0, 0), radii: V3(4.3, 4.2, 4.2), dir, up, roll });
  p.add(sphere(4.18, { segments: 48, rings: 32, sx: 4.3 / 4.18, sy: 4.2 / 4.18, sz: 4.2 / 4.18 }), M.black);
  const s = eli(V3(0.3, 0.9, 0.6), V3(1, 0, 0));
  p.add(armorPanel({ shape: rectPts(6, 4.4, 0.6), surface: s, thickness: 0.34, lift: 0.02, bevel: 0.1 }), M.yellow);
  const t = decalPatch({ surface: s, w: 4.6, h: 1.15, map: T.textDecal(['APX-9', 'POLLINATION UNIT'], { w: 512, h: 128, size: 52, weight: 800, color: '#101010', spacing: 1.0 }), lift: 0.36 });
  p.add(t.geometry, t.material);
  const drum = bee.part('dt-drum', { name: 'Decal test drum', group: 'pollination', tag: 'shell', info: 'decal test drum for calibration', explode: [0, -3, 0] });
  drum.add(cyl(2.2, 5, { bevel: 0.2, axis: 'x', segments: 64 }), M.yellow, { p: [0, -9, 0] });
  const logo = decalPatch({ surface: surf.cylinderX(2.2 + 0.0, { x0: 0, theta0: 0, origin: V3(0, -9, 0) }), w: 2.6, h: 2.6, map: T.beeDecal({ size: 256, color: '#101010' }), lift: 0.02 });
  drum.add(logo.geometry, logo.material);
  const hz = decalPatch({ surface: surf.cylinderX(2.2, { x0: -2, theta0: 40, origin: V3(0, -9, 0) }), w: 1.2, h: 3.4, map: T.hazard ? T.hazard({ stripes: 5 }) : T.textDecal(['////']), lift: 0.02 });
  drum.add(hz.geometry, hz.material);
  void decal; void M4;
}
