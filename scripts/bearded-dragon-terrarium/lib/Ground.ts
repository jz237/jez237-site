import {tileFbm} from './Textures';
import {TANK} from './Case';

export const POOL = {cx: 0.64, cz: TANK.d / 2 - 0.075, rx: 0.079, rz: 0.054};
export const WATER_LEVEL = 0.095;
export const CAVE = {
  x: 0.475, z: -0.055, floor: 0.073, rx: 0.14, rz: 0.11, h: 0.075,
  mouth: {x: 0.46, z: 0.09, rx: 0.088, rz: 0.06, h: 0.075},
  den: {x: 0.46, z: -0.06}, approach: {x: 0.46, z: 0.13},
  view: {x: 0.46, y: 0.18, z: TANK.d / 2 + 0.1},
};
export const BASK = {x: -0.46, z: 0.04, y: 0.277};
export function poolDistance(x: number, z: number) {return Math.hypot((x - POOL.cx) / POOL.rx, (z - POOL.cz) / POOL.rz) - 1;}
export function groundHeight(x: number, z: number) {
  const d = poolDistance(x, z);
  if (d < 0) return WATER_LEVEL - 0.01;
  // Compacted sandy soil, with low wind-built mounds against the back wall.
  const dunes = 0.014 * Math.exp(-(((z + TANK.d / 2 - 0.065) / 0.07) ** 2)) * (0.6 + 0.4 * Math.sin(x * 11 + 2));
  return 0.073 + dunes + 0.0025 * (tileFbm((x + 2) * 12, (z + 2) * 12, 48, 3, 14) - 0.5);
}
export function caveKeepClear(x: number, z: number) {return Math.abs(x - CAVE.x) < 0.18 && z < 0.15 && z > -0.2;}
