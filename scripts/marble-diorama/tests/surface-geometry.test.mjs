import test from "node:test";
import assert from "node:assert/strict";
import { BufferAttribute, BufferGeometry } from "three";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";
import { surfaceGeometry } from "../src/render-surface.mjs";
import { compileCourse, motionAt } from "../src/course.mjs";
import { campaignCourses } from "../src/campaign.mjs";
import { bonusCourses } from "../src/bonus.mjs";

function checkTriangles(geometry, compiled, vertices = compiled.vertices) {
  const seen = new Set();
  for (const group of geometry.groups) {
    for (
      let offset = group.start;
      offset < group.start + group.count;
      offset += 3
    ) {
      const first = geometry.index.getX(offset);
      assert.equal(first % 3, 0);
      const triangle = first / 3;
      assert.ok(!seen.has(triangle), "A face must not be drawn twice");
      seen.add(triangle);
      assert.equal(
        group.materialIndex,
        compiled.roles[triangle] === "top" ? 0 : 1,
      );
      for (let corner = 0; corner < 3; corner++) {
        const drawVertex = geometry.index.getX(offset + corner);
        assert.equal(drawVertex, first + corner, "Preserve triangle winding");
        const colliderVertex = compiled.indices[triangle * 3 + corner];
        for (let axis = 0; axis < 3; axis++)
          assert.equal(
            geometry.attributes.position.array[drawVertex * 3 + axis],
            vertices[colliderVertex * 3 + axis],
            "Rendered corners must exactly match the shared collider",
          );
      }
    }
  }
  assert.equal(
    seen.size,
    compiled.indices.length / 3,
    "Every face remains visible",
  );
}

test("batched surfaces preserve all campaign and bonus triangles, materials and creased normals", () => {
  for (const course of [...campaignCourses(), ...bonusCourses()]) {
    const mesh = compileCourse(course);
    for (const compiled of [...mesh.statics, ...mesh.moving]) {
      const vertices = compiled.vertices.slice(),
        indices = compiled.indices.slice();
      const geometry = surfaceGeometry(compiled);
      assert.ok(geometry.groups.length <= 2);
      checkTriangles(geometry, compiled);
      const original = new BufferGeometry();
      original.setAttribute(
        "position",
        new BufferAttribute(compiled.vertices, 3),
      );
      original.setIndex(new BufferAttribute(compiled.indices, 1));
      const reference =
        compiled.part?.motion?.axis === "wave"
          ? original.toNonIndexed()
          : toCreasedNormals(original, Math.PI / 5);
      if (compiled.part?.motion?.axis === "wave")
        reference.computeVertexNormals();
      assert.deepEqual(
        geometry.attributes.position.array,
        reference.attributes.position.array,
      );
      assert.deepEqual(
        geometry.attributes.normal.array,
        reference.attributes.normal.array,
      );
      assert.deepEqual(compiled.vertices, vertices);
      assert.deepEqual(compiled.indices, indices);
      geometry.dispose();
      reference.dispose();
      original.dispose();
    }
  }
});

test("batched wave draws retain the compiler-order vertex updates through a full cycle", () => {
  const compiled = compileCourse(campaignCourses()[2]);
  const waves = compiled.moving.filter((g) => g.part.motion?.axis === "wave");
  assert.ok(waves.length > 0);
  for (const wave of waves) {
    const geometry = surfaceGeometry(wave);
    for (let phase = 0; phase <= 1; phase += 0.125) {
      const { vertices } = motionAt(wave.part, phase * wave.part.motion.period);
      for (let j = 0; j < wave.indices.length; j++)
        for (let k = 0; k < 3; k++)
          geometry.attributes.position.array[j * 3 + k] =
            vertices[wave.indices[j] * 3 + k];
      geometry.computeVertexNormals();
      checkTriangles(geometry, wave, vertices);
      assert.ok(geometry.attributes.normal.array.every(Number.isFinite));
    }
    geometry.dispose();
  }
});
