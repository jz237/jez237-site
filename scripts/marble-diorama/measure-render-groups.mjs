import { writeFileSync } from "node:fs";
import { campaignCourses } from "./src/campaign.mjs";
import { bonusCourses } from "./src/bonus.mjs";
import { compileCourse } from "./src/course.mjs";
import { surfaceGeometry } from "./src/render-surface.mjs";
import { PHYSICS_VERSION } from "./src/physics.mjs";

const report = {
  physics: PHYSICS_VERSION,
  method:
    "Count course mesh material groups before and after draw-index batching. These exclude decorations, marbles and extra shadow passes; they are not FPS measurements.",
  courses: [],
};
for (const course of [...campaignCourses(), ...bonusCourses()]) {
  const compiled = compileCourse(course);
  let before = 0,
    after = 0,
    triangles = 0;
  for (const mesh of [...compiled.statics, ...compiled.moving]) {
    before += mesh.roles.filter(
      (role, i) => i === 0 || role !== mesh.roles[i - 1],
    ).length;
    const geometry = surfaceGeometry(mesh);
    after += geometry.groups.length;
    triangles += mesh.indices.length / 3;
    geometry.dispose();
  }
  report.courses.push({ course: course.id, before, after, triangles });
}
writeFileSync(
  new URL("./docs/render-group-measurements.json", import.meta.url),
  JSON.stringify(report, null, 2) + "\n",
);
console.table(report.courses);
