import type { CarKind, Mode } from '../src/rules';

export const PROTOCOL = 1;
export const MAX_PLAYERS = 8;
export const STEP = 1 / 60;
export const SNAPSHOT_HZ = 20;
export const NEUTRAL = { throttle: 0, steer: 0, brake: 1, handbrake: false };
export type Controls = typeof NEUTRAL;
export type Vec3 = { x: number; y: number; z: number };
export type Quat = Vec3 & { w: number };
export type Member = { id: number; name: string; kind: CarKind; connected: boolean; host: boolean };
export type DamageEvent = { id: number; tick: number; car: number; point: Vec3; direction: Vec3; localPoint: Vec3; localDirection: Vec3; repair: number; damage: number };
export type Dent = Pick<DamageEvent,'id'|'localPoint'|'localDirection'|'damage'|'repair'>;
export type PropState = {id:number;p:Vec3;q:Quat;v:Vec3;av:Vec3};
export type CarState = {
  id: number; kind: CarKind; p: Vec3; q: Quat; v: Vec3; av: Vec3;
  health: number; inflicted: number; damageLeft: number; damageRight: number;
  steering: number; speed: number; rpm: number; gear: number;
  wheels: { suspension: number; rotation: number; contact: boolean }[];
  input: Controls; passed: number; nextCheckpoint: number; lap: number;
  finished: boolean; finishTime: number; penalty: number; repair: number;
  surface: 'asphalt' | 'gravel'; slip: number;
  /** Complete visual damage since repair; included in welcome/persistence only. */
  dents?: Dent[];
};
export type Snapshot = {
  type: 'snapshot'; tick: number; elapsed: number; countdown: number;
  mode: Mode; phase: 'lobby' | 'countdown' | 'playing' | 'result';
  cars: CarState[]; damage: DamageEvent[]; ranking: number[];
  members: Member[]; ack: Record<number, number>;
  props: PropState[];
};
export type ClientMessage =
  | { type: 'hello'; protocol: number; name: string; kind: CarKind; token?: string }
  | { type: 'input'; seq: number; controls: Controls }
  | { type: 'start'; mode: Mode }
  | { type: 'recover' }
  | { type: 'ping'; sent: number };
export type ServerMessage =
  | { type: 'welcome'; protocol: number; room: string; id: number; token: string; snapshot: Snapshot }
  | Snapshot
  | { type: 'pong'; sent: number }
  | { type: 'error'; message: string };

export function parseClientMessage(raw: string): ClientMessage | null {
  if (raw.length > 1024) return null;
  let d: Record<string, unknown>;
  try { d = JSON.parse(raw); } catch { return null; }
  if (!d || typeof d !== 'object' || Array.isArray(d)) return null;
  const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
  if (d.type === 'hello' && d.protocol === PROTOCOL && typeof d.name === 'string' &&
      ['coupe', 'sedan', 'hatch'].includes(String(d.kind)) &&
      (d.token === undefined || typeof d.token === 'string' && d.token.length <= 64)) {
    return { type: 'hello', protocol: PROTOCOL,
      name: d.name.replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 18) || 'DRIVER',
      kind: d.kind as CarKind, token: d.token as string | undefined };
  }
  if (d.type === 'input' && Number.isSafeInteger(d.seq) && Number(d.seq) >= 0 &&
      d.controls && typeof d.controls === 'object') {
    const c = d.controls as Record<string, unknown>;
    if (!finite(c.throttle) || !finite(c.steer) || !finite(c.brake) || typeof c.handbrake !== 'boolean') return null;
    return { type: 'input', seq: Number(d.seq), controls: {
      throttle: Math.max(-1, Math.min(1, c.throttle)), steer: Math.max(-1, Math.min(1, c.steer)),
      brake: Math.max(0, Math.min(1, c.brake)), handbrake: c.handbrake } };
  }
  if (d.type === 'start' && ['derby', 'race', 'playground'].includes(String(d.mode))) return { type: 'start', mode: d.mode as Mode };
  if (d.type === 'recover') return { type: 'recover' };
  if (d.type === 'ping' && finite(d.sent)) return { type: 'ping', sent: d.sent };
  return null;
}

export function validRoom(code: string) { return /^[A-HJ-NP-Z2-9]{6}$/.test(code); }
export function createRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(6)), n => chars[n % 32]).join('');
}
