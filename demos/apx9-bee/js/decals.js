// Surface-conforming decals (text, logos, hazard marks) for armour plates.
import { armorPanel, rectPts } from './geo.js';
import { decal } from './materials.js';

/**
 * decalPatch({ surface, w, h, map, lift = 0.04, maxEdge = 0.45, radius = 0, color, emissive, emissiveIntensity, roughness })
 *  -> { geometry, material }   ->   part.add(d.geometry, d.material)
 * The patch is w x h mm in the surface's (x, y) plate coordinates (same `surface` functions as armorPanel: surf.plane,
 * surf.ellipsoid, surf.revolvedX ...), centred on the surface origin, floating `lift` mm above the paint. The texture
 * is mapped 0..1 across the whole patch, so text reads upright when plate +y is "up" and +x is "right".
 * Do not use it on mirrored parts: the text would read backwards on the mirrored side.
 */
export function decalPatch({ surface, w, h, map, lift = 0.04, maxEdge = 0.45, radius = 0, ...opts }) {
  const g = armorPanel({ shape: rectPts(w, h, radius), surface, thickness: 0.01, bevel: 0, bevelSegments: 1, lift, maxEdge, creaseDeg: 180, uvScale: 1 });
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / w + 0.5, uv.getY(i) / h + 0.5);
  uv.needsUpdate = true;
  return { geometry: g, material: decal(map, opts) };
}
