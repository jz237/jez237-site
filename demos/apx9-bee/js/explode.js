// Explode-spec helper shared by every assembly. Three nesting levels run on one global 0..1 timeline so a
// whole assembly leaves first, its sub-assemblies follow and individual components slide off last:
//   top  = a container part (head-shell, thorax-armor, leg-front-r ...)
//   mid  = a sub-assembly inside a container (eye module, bearing stack, servo block)
//   fine = a single component inside a sub-assembly (shaft, plate, screw ring, spring)
export const LEVEL = {
  top: { delay: 0, span: 0.45 },
  mid: { delay: 0.18, span: 0.45 },
  fine: { delay: 0.36, span: 0.5 },
};

/**
 * ex([dx, dy, dz], level = 'mid', rot = null, space = 'bee') -> explode spec for Part options / part.setExplode().
 *  The vector's length is the travel in mm. Directions are bee-space (+X forward, +Y up, +Z bee-right) unless
 *  space is 'local' (the parent's own axes). rot = [degX, degY, degZ] spins the part about its own origin.
 *  A nested part's travel is added on top of its parent's travel.
 */
export function ex(v, level = 'mid', rot = null, space = 'bee') {
  const a = Array.isArray(v) ? v : [v.x, v.y, v.z];
  const dist = Math.hypot(a[0], a[1], a[2]);
  const L = typeof level === 'string' ? LEVEL[level] : level;
  if (!L) throw new Error(`ex(): unknown level "${level}"`);
  const dir = dist > 0 ? [a[0] / dist, a[1] / dist, a[2] / dist] : null;
  return { dir, dist, delay: L.delay, span: L.span, rot, space };
}
