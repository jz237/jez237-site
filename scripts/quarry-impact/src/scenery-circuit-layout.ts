import * as T from 'three';
import { trackPoint } from './rules';
import approachBounds from './quarry-road-approach-bounds.json';

/** Visual coordinates only. Driving surfaces continue to use rules.surfaceAt. */
export const CIRCUIT_SEGMENTS = 360;
export const CIRCUIT_ATTRIBUTE = 'circuitMetres';
const centers = Array.from({ length: CIRCUIT_SEGMENTS + 1 }, (_, i) => trackPoint(i / CIRCUIT_SEGMENTS));
export const CIRCUIT_ARC_METRES: readonly number[] = Object.freeze(centers.reduce<number[]>((arc, p, i) => {
  arc.push(i ? arc[i - 1] + Math.hypot(p.x - centers[i - 1].x, p.z - centers[i - 1].z) : 0);
  return arc;
}, []));
export const CIRCUIT_LENGTH = CIRCUIT_ARC_METRES[CIRCUIT_SEGMENTS];

/** Exact surviving asphalt material-group rule, including the authored gap. */
export function isCircuitAsphaltCell(index: number) {
  if (!Number.isInteger(index)) throw new RangeError('Expected an integer circuit cell');
  const cell = ((index % CIRCUIT_SEGMENTS) + CIRCUIT_SEGMENTS) % CIRCUIT_SEGMENTS;
  return !(cell >= approachBounds.startSegment && cell < approachBounds.endSegmentExclusive) && centers[cell].z >= -20;
}

/** The old lane uses a .2-cell forward difference; roadRibbon uses .1 cell. */
export function circuitFrame(cell: number, lookAheadCells = .2) {
  if (!Number.isInteger(cell) || cell < 0 || cell > CIRCUIT_SEGMENTS || !Number.isFinite(lookAheadCells) || lookAheadCells <= 0)
    throw new RangeError('Expected a circuit cross-section 0..360 and positive finite look-ahead');
  const center = centers[cell], next = trackPoint((cell + lookAheadCells) / CIRCUIT_SEGMENTS);
  const tangent = new T.Vector2(next.x - center.x, next.z - center.z).normalize();
  return { center: { ...center }, tangent: { x: tangent.x, z: tangent.y }, lateral: { x: tangent.y, z: -tangent.x }, s: CIRCUIT_ARC_METRES[cell] };
}

/** Adds one attribute to the actual two-vertex ribbon; does not rebuild or
 * touch its position, normal, UV, index, groups, or asymmetric outer edge. */
export function attachCircuitCoordinates(geometry: T.BufferGeometry, lookAheadCells = .2) {
  const position = geometry.getAttribute('position');
  if (!position || position.itemSize !== 3 || position.count !== (CIRCUIT_SEGMENTS + 1) * 2)
    throw new Error('Circuit coordinates require the existing 361 × 2 ribbon vertices');
  const metres = new Float32Array(position.count * 2);
  for (let i = 0; i <= CIRCUIT_SEGMENTS; i++) {
    const { center, lateral, s } = circuitFrame(i, lookAheadCells);
    for (let edge = 0; edge < 2; edge++) {
      const v = i * 2 + edge;
      const d = (position.getX(v) - center.x) * lateral.x + (position.getZ(v) - center.z) * lateral.z;
      if (!Number.isFinite(d)) throw new Error('Circuit ribbon contains a non-finite vertex');
      metres[v * 2] = s;
      metres[v * 2 + 1] = d;
    }
  }
  geometry.setAttribute(CIRCUIT_ATTRIBUTE, new T.BufferAttribute(metres, 2));
  return geometry;
}
