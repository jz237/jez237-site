import test from "node:test";
import assert from "node:assert/strict";
import { reliefField } from "../src/relief-field.mjs";
function surface(height) {
  const vertices = [],
    indices = [],
    roles = [];
  for (let z = -6; z <= 6; z += 0.5)
    for (let x = -6; x <= 6; x += 0.5) vertices.push(x, height(x, z), z);
  for (let z = 0; z < 24; z++)
    for (let x = 0; x < 24; x++) {
      const a = z * 25 + x,
        b = a + 1,
        c = a + 25,
        d = c + 1;
      indices.push(a, c, b, b, c, d);
      roles.push("top", "top");
    }
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    roles,
  };
}
function at(field, x, z) {
  const ix = Math.round((x - field.minX) / field.step),
    iz = Math.round((z - field.minZ) / field.step);
  return field.data.slice(
    (iz * field.width + ix) * 4,
    (iz * field.width + ix) * 4 + 4,
  );
}
test("relief colors leave a planar ramp neutral and preserve shared geometry", () => {
  const mesh = surface((x, z) => 0.3 * x + 0.1 * z),
    original = mesh.vertices.slice(),
    field = reliefField([mesh]);
  for (const x of [-2, 0, 2])
    assert.ok(Math.abs(at(field, x, 0)[0] - 128) <= 1);
  assert.deepEqual(mesh.vertices, original);
  assert.equal(at(field, 0, 0)[1], 0);
});
test("relief distinguishes a valley from a ridge and marks an exposed boundary", () => {
  const valley = reliefField([surface((x) => 0.12 * x * x)]),
    ridge = reliefField([surface((x) => -0.12 * x * x)]);
  assert.ok(at(valley, 0, 0)[0] < 110);
  assert.ok(at(ridge, 0, 0)[0] > 145);
  assert.ok(at(valley, 5.85, 0)[1] > 0);
  assert.equal(at(valley, 0, 0)[3], 255);
});
