// Calibration scene: exercises the kit (paint, chrome, carbon, glass, eye dome, fur, glow) before the real assemblies exist.
// Load with ?demo=_kitdemo&only=none
export function build(ctx) {
  const { bee, M, V3, armorPanel, surf, plate, cyl, torus, gear, sphere, facetedDome, revolve, sweep, makeFur, ellipsoidSampler, hose, circleHole, rectPts, screw, ringPoints, instances, D2R, T, decal } = ctx;

  /* yellow clearcoat shell on an ellipsoid, with a black under-layer */
  const shell = bee.part('cal-shell', { name: 'Calibration shell', tag: 'shell', group: 'thorax-armor', explode: [0, 6, 0] });
  const eli = (dir, up, roll = 0) => surf.ellipsoid({ center: V3(0, 0, 0), radii: V3(4.3, 4.2, 4.2), dir, up, roll });
  shell.add(sphere(4.18, { segments: 48, rings: 32, sx: 4.3 / 4.18, sy: 4.2 / 4.18, sz: 4.2 / 4.18 }), M.black);
  const plates = [
    { dir: V3(0.1, 1, 0), w: 5.6, h: 6.4 },
    { dir: V3(0.2, 0.8, 0.9), w: 4.6, h: 5.0 },
    { dir: V3(0.2, 0.8, -0.9), w: 4.6, h: 5.0 },
    { dir: V3(0.9, 0.5, 0), w: 4.0, h: 5.6 },
    { dir: V3(-0.9, 0.5, 0), w: 4.0, h: 5.6 },
  ];
  for (const pl of plates) {
    shell.add(armorPanel({
      shape: [[-pl.w / 2, -pl.h / 2, 0.8], [pl.w / 2, -pl.h / 2, 0.8], [pl.w / 2, pl.h / 2, 0.8], [-pl.w / 2, pl.h / 2, 0.8]],
      surface: eli(pl.dir, V3(1, 0, 0)), thickness: 0.34, lift: 0.02, bevel: 0.1,
    }), M.yellow);
  }

  /* chrome bearing + gold hub + hex screws */
  const bearing = bee.part('cal-bearing', { name: 'Calibration bearing', group: 'wing-mount', explode: [0, 7, 7] });
  bearing.add(cyl(2.4, 0.9, { rIn: 1.5, bevel: 0.14, axis: 'z' }), M.chrome, { p: [9, 0, 0] });
  bearing.add(torus(1.95, 0.3, { radial: 20, tubular: 96 }), M.steel, { p: [9, 0, 0.5] });
  bearing.add(cyl(1.1, 1.3, { bevel: 0.2, axis: 'z' }), M.gold, { p: [9, 0, 0.1] });
  bearing.add(cyl(0.45, 1.5, { bevel: 0.08, axis: 'z', rIn: 0.18 }), M.chrome, { p: [9, 0, 0.1] });
  bearing.inst(screw(0.22, 0.2), M.steel, ringPoints(8, 2.0, { axis: 'z', center: [9, 0, 0.45] }).map((r) => ({ p: r.p, n: [0, 0, 1], s: 1 })));

  /* carbon plate with hazard stripe and a brushed gear */
  const carbon = bee.part('cal-carbon', { name: 'Calibration carbon plate', group: 'stabilizer', explode: [0, -6, 0] });
  carbon.add(plate([[-3, -2, 0.5], [3, -2, 0.5], [3, 2, 0.5], [-3, 2, 0.5]], 0.5, { holes: [circleHole(0.6, -1.5, 0.6)] }), M.carbon, { p: [-9, -1, -2], r: [-90, 0, 0] });
  carbon.add(plate([[-3, -0.4, 0.1], [3, -0.4, 0.1], [3, 0.4, 0.1], [-3, 0.4, 0.1]], 0.1, {}), M.hazard, { p: [-9, -1.55, 2.6], r: [-90, 0, 0] });
  const gearPart = bee.part('cal-gear', { name: 'Calibration gear', group: 'stabilizer', explode: [-5, 0, 6] });
  gearPart.add(gear({ teeth: 18, rOut: 1.6, rRoot: 1.32, holes: 5, holeR: 0.22, holeRing: 0.62, bore: 0.3 }, 0.5, 0.05), M.brushed, { p: [-9, 2.4, 1], r: [90, 0, 0] });

  /* compound-eye dome + glass lens */
  const eye = bee.part('cal-eye', { name: 'Calibration compound eye', group: 'optics', explode: [5, 2, 7] });
  const dome = facetedDome({ radius: 2.6, freq: 12, cap: 105, gap: 0.12, squash: [1, 1.1, 0.9] });
  eye.add(dome.geometry, M.eye, { p: [4, -8, 4], r: [0, 0, -90] });
  eye.add(sphere(2.5, { segments: 48, rings: 28, sx: 1, sy: 1.1, sz: 0.9 }), M.black, { p: [4, -8, 4], r: [0, 0, -90] });
  const lens = bee.part('cal-lens', { name: 'Calibration lens', group: 'optics', explode: [5, -3, 5] });
  lens.add(sphere(1.1, { segments: 32, rings: 20 }), M.glassBlue, { p: [9, -8, 4] });
  lens.add(cyl(1.0, 0.5, { bevel: 0.12, axis: 'z' }), M.lens, { p: [9, -8, 3.6] });
  lens.add(torus(1.12, 0.12, { radial: 12, tubular: 36 }), M.chrome, { p: [9, -8, 3.5] });

  /* fur patch on a gold ball */
  const fur = bee.part('cal-fur', { name: 'Calibration fur ball', group: 'abdomen-shell', tag: 'shell', explode: [-6, 3, -7] });
  fur.add(sphere(2.9, { segments: 32, rings: 20 }), M.yellowDeep, { p: [-8, -8, -4] });
  const mesh = makeFur({ seed: 5, count: 9000, length: 0.8, sample: ellipsoidSampler({ center: [-8, -8, -4], radii: [2.95, 2.95, 2.95], comb: [-1, 0, 0] }) });
  fur.addMesh(mesh, { layers: [2], cast: false, receive: false, pick: false });
  fur.idProxy(sphere(1, { segments: 24, rings: 14 }), { p: [-8, -8, -4], s: 3.6 });

  /* antenna: black segmented stalk with a gold tip and a glowing sensor */
  const ant = bee.part('cal-antenna', { name: 'Calibration antenna', group: 'antenna', explode: [4, 6, -3] });
  const path = [V3(0, 0, 0), V3(1.5, 1.6, 0.4), V3(3.4, 2.8, 1.0), V3(5.4, 3.0, 1.9), V3(7.2, 2.2, 2.7)];
  ant.add(sweep(path, { radius: (u) => 0.28 - 0.12 * u, radial: 12 }), M.black, { p: [-1, 6, -6] });
  ant.add(sphere(0.34, { segments: 16, rings: 10 }), M.gold, { p: [6.2, 8.2, -3.3] });
  ant.add(sphere(0.18, { segments: 12, rings: 8 }), M.glowCyan, { p: [6.2, 8.2, -2.9] });
  ant.add(hose(V3(0, 0, 0), V3(3, 0.5, 2), { radius: 0.12, sag: 0.5 }), M.copper, { p: [-6, 5, 5] });

  /* power cell glow */
  const core = bee.part('cal-core', { name: 'Calibration power cell', group: 'core', explode: [0, -8, -4] });
  core.add(cyl(1.4, 4.4, { bevel: 0.3, axis: 'x', segments: 40 }), M.coreBlue, { p: [0, -8, 0] });
  core.add(cyl(0.6, 4.6, { bevel: 0.2, axis: 'x', segments: 28 }), M.coreInner, { p: [0, -8, 0] });
  core.add(cyl(1.5, 0.3, { bevel: 0.08, axis: 'x', segments: 40 }), M.chrome, { p: [-2.4, -8, 0] });
  core.add(cyl(1.5, 0.3, { bevel: 0.08, axis: 'x', segments: 40 }), M.chrome, { p: [2.4, -8, 0] });
  void revolve; void rectPts; void decal; void T; void D2R; void instances;
}
