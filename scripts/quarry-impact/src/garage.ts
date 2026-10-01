import {vehicleSpecification} from './vehicle-physics';
export {axleDrive} from './vehicle-physics';
import {normalizeLivery,normalizeGroups,type LiveryLayer,type LiveryGroup} from './livery';
import { DEFINITIONS, CAR_KINDS, type CarKind } from './rules';

export type Tune = { gearing: number; suspension: number; differential: number; brakeBias: number; steering: number };
export type Setup = { paint: number; trim: number; engine: number; tires: number; armor: number; tune: Tune; livery:LiveryLayer[] };
export type Preset = { name: string; setup: Setup };
export type GarageCar = { setup: Setup; presets: Preset[]; groups:LiveryGroup[] };
export type Garage = { version: 1; cars: Record<CarKind, GarageCar> };
export const GARAGE_KEY = 'quarry-impact-garage-v1';
export const KINDS: CarKind[] = CAR_KINDS;
export const TUNE_FIELDS: { key: keyof Tune; label: string; low: string; high: string; help: string }[] = [
  { key: 'gearing', label: 'Final drive', low: 'Top speed', high: 'Acceleration', help: 'Short gearing increases wheel torque and shifts sooner; long gearing raises the speed ceiling.' },
  { key: 'suspension', label: 'Suspension', low: 'Soft', high: 'Firm', help: 'Changes spring stiffness, damping and ride height. Soft absorbs uneven ground; firm limits body movement.' },
  { key: 'differential', label: 'Differential', low: 'Open', high: 'Locked', help: 'More lock maintains drive when one wheel unloads, with more resistance to turning under power.' },
  { key: 'brakeBias', label: 'Brake balance', low: 'Rear', high: 'Front', help: 'Moves braking force between axles. Rear bias makes the car easier to rotate under braking.' },
  { key: 'steering', label: 'Steering range', low: 'Gentle', high: 'Sharp', help: 'Changes maximum steering angle; sharper steering needs smaller inputs at speed.' },
];
const object = (v: unknown): Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {};
const number = (v: unknown, fallback: number, low: number, high: number) => typeof v === 'number' && Number.isFinite(v) ? Math.max(low, Math.min(high, v)) : fallback;
export function stockSetup(kind: CarKind): Setup {
  return { livery:[], paint: DEFINITIONS[kind].color, trim: 0x202529, engine: 0, tires: 0, armor: 0,
    tune: { gearing: 0, suspension: 0, differential: 0, brakeBias: 0, steering: 0 } };
}
export function normalizeSetup(value: unknown, kind: CarKind): Setup {
  const raw = object(value), stock = stockSetup(kind), tune = object(raw.tune);
  return { livery:normalizeLivery(raw.livery), paint: Math.round(number(raw.paint, stock.paint, 0, 0xffffff)), trim: Math.round(number(raw.trim, stock.trim, 0, 0xffffff)),
    engine: Math.round(number(raw.engine, 0, 0, 3)), tires: Math.round(number(raw.tires, 0, 0, 3)), armor: Math.round(number(raw.armor, 0, 0, 3)),
    tune: Object.fromEntries(TUNE_FIELDS.map(({key}) => [key, number(tune[key], 0, -1, 1)])) as Tune };
}
export function readGarage(value?: string | null): Garage {
  let raw: Record<string, unknown> = {};
  try { const parsed = object(JSON.parse(value ?? '{}')); if (parsed.version === 1) raw = object(parsed.cars); } catch {}
  return { version: 1, cars: Object.fromEntries(KINDS.map(kind => {
    const car = object(raw[kind]);
    const presets: Preset[] = Array.isArray(car.presets) ? car.presets.slice(0, 8).flatMap(value => {
      const p = object(value);
      return typeof p.name === 'string' && p.name.trim() ? [{name: p.name.trim().slice(0, 32), setup: normalizeSetup(p.setup, kind)}] : [];
    }) : [];
    return [kind, {setup: normalizeSetup(car.setup, kind), presets, groups:normalizeGroups(car.groups)}];
  })) as Record<CarKind, GarageCar> };
}
export function exportSetup(kind: CarKind, setup: Setup): string {
  return JSON.stringify({format:'quarry-impact-setup', version:1, car:kind, setup:normalizeSetup(setup, kind)}, null, 2);
}
export function importSetup(text: string, kind: CarKind): Setup {
  if (text.length > 65_536) throw new Error('Setup file is too large.');
  let raw: Record<string, unknown>;
  try { raw = object(JSON.parse(text)); } catch { throw new Error('This is not a valid setup file.'); }
  if(raw.format !== 'quarry-impact-setup' || raw.version !== 1) throw new Error('Unsupported setup format or version.');
  if(raw.car !== kind) throw new Error('Choose the matching car before importing this setup.');
  if(!raw.setup || typeof raw.setup !== 'object' || Array.isArray(raw.setup)) throw new Error('Setup data is missing.');
  return normalizeSetup(raw.setup, kind);
}
export function setupPhysics(kind: CarKind, input: Setup) {
  return vehicleSpecification(kind, normalizeSetup(input, kind));
}
