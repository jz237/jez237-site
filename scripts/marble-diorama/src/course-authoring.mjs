import { part, point } from "./course.mjs";
export const ISO = -Math.PI / 4;
const SQ = Math.SQRT1_2;
export const worldPoint = (l, height, d) =>
  point((l + d) * SQ, height, (d - l) * SQ);
export const deck = (id, l, d, w, length, height, extra = {}) => {
  const p = worldPoint(l, height, d);
  return part(id, p.x, p.z, w, length, height, { angle: ISO, ...extra });
};
export const outline = (id, points, height, h = 8) =>
  deck(id, 0, 0, 25, 60, height, {
    kind: "polygon",
    h,
    outline: points.map(([x, z]) => ({ x, z })),
  });
export const ribbon = (id, path, width, bank = 0) =>
  deck(id, 0, 0, 25, 60, 0, {
    kind: "ribbon",
    width,
    bank,
    bottom: -3,
    path: path.map(([x, z, y, sectionBank]) => ({
      x,
      y,
      z,
      ...(sectionBank === undefined ? {} : { bank: sectionBank }),
    })),
  });
export const routePoint = (l, h, d, extra = {}) => ({
  ...worldPoint(l, h, d),
  ...extra,
});
