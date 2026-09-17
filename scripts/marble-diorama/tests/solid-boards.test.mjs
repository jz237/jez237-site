import test from "node:test";
import assert from "node:assert/strict";
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  Raycaster,
  Vector3,
} from "three";
import { DioramaView } from "../src/view.mjs";
import { partGeometry } from "../src/course.mjs";
import { campaignCourses } from "../src/campaign.mjs";
import { bonusCourses } from "../src/bonus.mjs";

function closedShell(geometry, label) {
  const edges = new Map();

  for (let i = 0; i < geometry.indices.length; i += 3) {
    const ids = Array.from(geometry.indices.slice(i, i + 3));

    for (let j = 0; j < 3; j++) {
      const a = ids[j],
        b = ids[(j + 1) % 3];
      const key = `${Math.min(a, b)},${Math.max(a, b)}`;
      const edge = edges.get(key) ?? { count: 0 };
      edge.count++;
      edges.set(key, edge);
    }
  }
  for (const edge of edges.values()) {
    assert.equal(edge.count, 2, `${label}: no open edges`);
  }
}

test("every campaign/bonus polygon has closed walls and underside", () => {
  let checked = 0;
  for (const course of [...campaignCourses(), ...bonusCourses()])
    for (const p of course.parts.filter((p) => p.kind === "polygon")) {
      closedShell(partGeometry(p), `${course.id}/${p.id}`);
      checked++;
    }
  assert.ok(checked >= 5);
});

test("clockwise and counterclockwise boards expose all four walls and the bottom to an outside camera", () => {
  const outline = [
    { x: -4, z: -3 },
    { x: 4, z: -3 },
    { x: 4, z: 3 },
    { x: -4, z: 3 },
  ];
  for (const points of [outline, [...outline].reverse()]) {
    const data = partGeometry({ kind: "polygon", outline: points, h: 6 });
    closedShell(data, "test board");
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(data.vertices, 3));
    geometry.setIndex(new BufferAttribute(data.indices, 1));
    const material = DioramaView.prototype.material.call({}, "stone", true);
    const mesh = new Mesh(geometry, material);
    for (const [origin, direction, distance] of [
      [[10, -3, 0], [-1, 0, 0], 6],
      [[-10, -3, 0], [1, 0, 0], 6],
      [[0, -3, 10], [0, 0, -1], 7],
      [[0, -3, -10], [0, 0, 1], 7],
      [[0, -10, 0], [0, 1, 0], 4],
      [[0, 10, 0], [0, -1, 0], 10],
    ]) {
      const hits = new Raycaster(
        new Vector3(...origin),
        new Vector3(...direction),
      ).intersectObject(mesh);
      assert.ok(hits.length, `Outside ray ${origin} sees a solid face`);
      assert.ok(
        Math.abs(hits[0].distance - distance) < 1e-5,
        "Near wall is visible, not the opposite interior wall",
      );
    }
    geometry.dispose();
    material.dispose();
  }
});

test("display foundations reach the plinth on every course without changing track geometry", async () => {
  const { foundationGeometry } = await import("../src/foundations.mjs");
  for (const course of [...campaignCourses(), ...bonusCourses()]) {
    let count = 0;
    const base =
      Math.min(
        ...course.parts.map((p) => {
          const g = partGeometry(p);
          let low = Infinity;
          for (let i = 1; i < g.vertices.length; i += 3)
            low = Math.min(low, g.vertices[i] + p.y);
          return low;
        }),
      ) - 0.04;
    for (const part of course.parts) {
      const before = partGeometry(part);
      const g = foundationGeometry(part, base);
      assert.deepEqual(partGeometry(part), before);
      if (!g) continue;
      count++;
      for (let i = 0; i < g.vertices.length; i += 12) {
        assert.ok(Math.abs(g.vertices[i + 7] - base) < 1e-4);
        assert.ok(Math.abs(g.vertices[i + 10] - base) < 1e-4);
        assert.equal(g.vertices[i], g.vertices[i + 9]);
        assert.equal(g.vertices[i + 3], g.vertices[i + 6]);
      }
    }
    assert.ok(count > 0, course.id);
  }
});
