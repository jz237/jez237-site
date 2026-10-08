import {CLASSIC_VEHICLES} from './classic-vehicle-specs';
import { circuitSurfaceAt } from './circuit-grip';
export type Mode = 'derby' | 'playground' | 'race';
export type CarKind = 'coupe' | 'sedan' | 'hatch' | 'muscle' | 'wagon' | 'utility' | 'compact' | 'van' | 'tern' | 'marten' | 'buggy' | 'shuttle';
export const clamp = (n: number, a: number, b: number) =>
  Math.max(a, Math.min(b, n));
export const wrap = (v: number) => Math.atan2(Math.sin(v), Math.cos(v));
export const DEFINITIONS = {
  coupe: {
    name: 'VESPER GT',
    subtitle: '5.0 V8 · Rear-wheel drive',
    mass: 1480,
    force: 11300,
    halfLength: 2.325,
    halfWidth: 0.99,
    wheelbase: 2.72,
    color: 0xc9d4ca,
  },
  sedan: {
    name: 'KESSLER R6',
    subtitle: 'Twin-turbo six · All-wheel drive',
    mass: 1650,
    force: 12400,
    halfLength: 2.475,
    halfWidth: 0.96,
    wheelbase: 2.98,
    color: 0x40566d,
  },
  hatch: {
    name: 'STRYDE RS',
    subtitle: 'Turbo four · All-wheel drive',
    mass: 1290,
    force: 9700,
    halfLength: 2.075,
    halfWidth: 0.92,
    wheelbase: 2.46,
    color: 0xafa044,
  },
  ...CLASSIC_VEHICLES,
};
export const CAR_KINDS=Object.keys(DEFINITIONS)as CarKind[];
export const isCarKind=(value:unknown):value is CarKind=>typeof value==='string'&&Object.hasOwn(DEFINITIONS,value);
export function damageFromImpulse(impulse: number) {
  return clamp((impulse - 1700) / 930, 0, 28);
}
export function derbyOrder<
  T extends { health: number; inflicted: number; id: number },
>(cars: T[]) {
  return [...cars].sort(
    (a, b) => b.health - a.health || b.inflicted - a.inflicted || a.id - b.id,
  );
}
export function trackPoint(t: number) {
  const a = t * Math.PI * 2;
  return {
    x: 108 * Math.sin(a) + 12 * Math.sin(a * 3),
    z: 88 * Math.cos(a) + 9 * Math.sin(a * 2),
  };
}
export const CHECKPOINTS = Array.from({ length: 24 }, (_, i) =>
  trackPoint(i / 24),
);
export function terrainHeight(x: number, z: number) {
  const d = Math.hypot(x / 1.08, z);
  if (d < 60) return 0;
  const rim = clamp((d - 137) / 50, 0, 1);
  return (
    Math.sin(x * 0.034) *
      Math.sin(z * 0.041) *
      Math.min((d - 60) / 35, 1) *
      1.7 +
    rim * rim * (40 + 5 * Math.sin(Math.atan2(z, x) * 7))
  );
}
export function surfaceAt(x: number, z: number) {
  const radius = Math.hypot(x, z);
  if (radius < 44) return 'gravel';
  return circuitSurfaceAt(x, z);
}
export function advanceCheckpoint(
  x: number,
  z: number,
  next: number,
  lastDistance: number,
) {
  const p = CHECKPOINTS[next];
  const distance = Math.hypot(x - p.x, z - p.z);
  return { passed: distance < 12 && distance < lastDistance, distance };
}
