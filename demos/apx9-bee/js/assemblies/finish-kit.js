// Precision mechanical primitives shared by the completed internal assemblies.
import { THREE, V3, M, ex, cyl, box, plate, circlePts, screw, gear, sweep, torus } from '../kit.js';
export { THREE, V3, M, ex, cyl, box, plate, circlePts, screw, gear, sweep, torus };
export const child = (p, id, name, info, dir = [0, 0, 0], level = 'fine') =>
  p.part(id, {
    name,
    info,
    explode: ex(dir, level),
    specs: { Material: 'Machined titanium, steel and anodised composite' },
  });
export function at(p, n = [0, 1, 0]) {
  return new THREE.Matrix4().compose(
    V3(...p),
    new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), V3(...n).normalize()),
    V3(1, 1, 1),
  );
}
export function rod(p, a, b, r, mat = M.steel) {
  const A = V3(...a),
    B = V3(...b),
    D = B.clone().sub(A);
  p.add(
    cyl(r, D.length(), { segments: 20, bevel: r * 0.18 }),
    mat,
    at(A.add(B).multiplyScalar(0.5).toArray(), D.toArray()),
  );
}
export function boltRing(p, c, r, n = 10, axis = [1, 0, 0], br = 0.1) {
  const m = at(c, axis),
    g = screw(br, br * 0.8);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    p.add(g, M.steel, m.clone().multiply(new THREE.Matrix4().makeTranslation(Math.cos(a) * r, 0, Math.sin(a) * r)));
  }
}
export function bearing(p, c, r, bore, axis = [1, 0, 0], width = 0.35) {
  const m = at(c, axis);
  p.add(cyl(r, width, { rIn: bore, segments: 48, bevel: 0.05 }), M.gunmetalDark, m);
  for (const s of [-1, 1]) {
    p.add(
      cyl(r * 0.97, 0.07, { rIn: r * 0.8, segments: 48, bevel: 0.02 }),
      M.chrome,
      m.clone().multiply(new THREE.Matrix4().makeTranslation(0, s * (width * 0.5 + 0.025), 0)),
    );
    p.add(
      cyl(bore * 1.14, 0.08, { rIn: bore, segments: 40, bevel: 0.015 }),
      M.steel,
      m.clone().multiply(new THREE.Matrix4().makeTranslation(0, s * (width * 0.5 + 0.03), 0)),
    );
  }
  const balls = new THREE.SphereGeometry(Math.min((r - bore) * 0.25, 0.13), 10, 6);
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    p.add(
      balls,
      M.chrome,
      m
        .clone()
        .multiply(
          new THREE.Matrix4().makeTranslation(
            Math.cos(a) * (r + bore) * 0.5,
            width * 0.55,
            Math.sin(a) * (r + bore) * 0.5,
          ),
        ),
    );
  }
}
export function axialPlate(p, points, x, t, holes, mat = M.gunmetal) {
  const g = plate(points, t, { holes, bevel: 0.05, bevelSegments: 2 });
  g.rotateY(Math.PI / 2);
  g.translate(x, 0, 0);
  p.add(g, mat);
}
export function harness(p, points, r = 0.09, mat = M.black) {
  p.add(sweep(points, { radius: r, radial: 8, segments: 30 }), mat);
}
