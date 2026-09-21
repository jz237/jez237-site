import test from "node:test";
import assert from "node:assert/strict";
import {
  compileCourse,
  part,
  proofCourse,
  partGeometry,
} from "../src/course.mjs";
import { joinedBoardParts } from "../src/board-joins.mjs";
import { campaignCourses } from "../src/campaign.mjs";
const covers = (g, x, z, y) =>
  g.roles.reduce((n, role, t) => {
    if (role !== "top") return n;
    const [a, b, c] = [0, 1, 2].map((k) =>
      Array.from(
        g.vertices.slice(
          g.indices[t * 3 + k] * 3,
          g.indices[t * 3 + k] * 3 + 3,
        ),
      ),
    );
    if ([a, b, c].some((p) => Math.abs(p[1] - y) > 1e-5)) return n;
    const den = (b[2] - c[2]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[2] - c[2]);
    const u = ((b[2] - c[2]) * (x - c[0]) + (c[0] - b[0]) * (z - c[2])) / den;
    const v = ((c[2] - a[2]) * (x - c[0]) + (a[0] - c[0]) * (z - c[2])) / den;
    return n + (u > 1e-6 && v > 1e-6 && u + v < 1 - 1e-6 ? 1 : 0);
  }, 0);
test("overlapping boards form one sheet, with separate elevations and holes preserved", () => {
  const c = proofCourse();
  c.parts = [
    part("a", -1, 0, 4, 4, 0),
    part("b", 1, 0, 4, 4, 0),
    part("overpass", 0, 0, 2, 2, 3),
  ];
  let g = compileCourse(c).statics[0];
  assert.equal(covers(g, 0.137, 0.283, 0), 1);
  assert.equal(covers(g, 0.137, 0.283, 3), 1);
  c.parts = [
    part("left", -3, 0, 2, 8, 0),
    part("right", 3, 0, 2, 8, 0),
    part("near", 0, -3, 4, 2, 0),
    part("far", 0, 3, 4, 2, 0),
  ];
  g = compileCourse(c).statics[0];
  assert.equal(covers(g, 0.137, 0.283, 0), 0);
  assert.equal(covers(g, -3.137, 0.283, 0), 1);
});
test("joining all campaign boards leaves authored parts intact and produces finite shared meshes", () => {
  let joins = 0;
  for (const c of campaignCourses()) {
    const original = JSON.stringify(c.parts),
      parts = joinedBoardParts(c.parts);
    assert.equal(JSON.stringify(c.parts), original);
    for (const p of parts) {
      if (!p.joins) continue;
      for (const [end, j] of Object.entries(p.joins)) {
        joins++;
        if (!j.cross) continue;
        const q = p.path[Number(end)],
          v = partGeometry(p).vertices;
        const expected = [
          q.x + (j.cross.x * j.width) / 2,
          q.y + j.bank,
          q.z + (j.cross.z * j.width) / 2,
        ];
        const cs = Math.cos(p.angle ?? 0),
          sn = Math.sin(p.angle ?? 0);
        const world = [
          expected[0] * cs - expected[2] * sn,
          expected[1],
          expected[0] * sn + expected[2] * cs,
        ];
        assert.ok(
          Array.from({ length: v.length / 3 }, (_, i) =>
            Math.hypot(
              v[i * 3] - world[0],
              v[i * 3 + 1] - world[1],
              v[i * 3 + 2] - world[2],
            ),
          ).some((d) => d < 1e-4),
          p.id + " shared end profile",
        );
      }
    }
    for (const g of compileCourse(c).statics)
      assert.ok(g.vertices.every(Number.isFinite));
  }
  assert.ok(joins > 30);
});
