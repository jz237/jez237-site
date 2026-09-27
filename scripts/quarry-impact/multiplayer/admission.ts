/** Small, durable admission ledger. Gameplay never passes through this gate. */
export const MAX_ROOMS = 4;
export const ROOM_LIFETIME_MS = 2 * 60 * 60_000;
export const EMPTY_ROOM_MS = 2 * 60_000;
export const JOIN_TIMEOUT_MS = 10_000;
const RESERVATION_MS = 30_000;
const RATE_WINDOW_MS = 60_000;
const CREATE_WINDOW_MS = 10 * 60_000;
const MAX_IP_KEYS = 256;
type Counter = { start: number; count: number };
type Rate = { connect: Counter; create: Counter; touched: number };
export type Lease = { id: string; created: number; expiresAt: number; deadline: number; activityVersion: number };
export type AdmissionState = { rooms: Record<string, Lease>; rates: Record<string, Rate>; global: Counter };
export type AdmissionResult = { ok: true; lease: Lease } | { ok: false; status: 429 | 503; reason: string };
const freshCounter = (now: number): Counter => ({ start: now, count: 0 });
function reset(counter: Counter, now: number, duration: number) { if (now - counter.start >= duration) { counter.start = now; counter.count = 0; } }

export class AdmissionLedger {
  constructor(public state: AdmissionState = { rooms: {}, rates: {}, global: freshCounter(0) }) {}
  prune(now: number) {
    for (const [code, lease] of Object.entries(this.state.rooms)) if (now >= lease.deadline) delete this.state.rooms[code];
    for (const [key, rate] of Object.entries(this.state.rates)) if (now - rate.touched >= CREATE_WINDOW_MS) delete this.state.rates[key];
  }
  admit(code: string, key: string, now: number, id = crypto.randomUUID()): AdmissionResult {
    this.prune(now);
    reset(this.state.global, now, RATE_WINDOW_MS);
    if (++this.state.global.count > 240) return { ok: false, status: 429, reason: 'Too many connection attempts. Try again shortly.' };
    let rate = this.state.rates[key];
    if (!rate) {
      if (Object.keys(this.state.rates).length >= MAX_IP_KEYS) return { ok: false, status: 503, reason: 'Admission is busy. Try again shortly.' };
      rate = this.state.rates[key] = { connect: freshCounter(now), create: freshCounter(now), touched: now };
    }
    rate.touched = now;
    reset(rate.connect, now, RATE_WINDOW_MS); reset(rate.create, now, CREATE_WINDOW_MS);
    if (++rate.connect.count > 60) return { ok: false, status: 429, reason: 'Too many connection attempts from this network. Try again shortly.' };
    const existing = this.state.rooms[code];
    if (existing) return { ok: true, lease: { ...existing } }; // Existing rooms and token reconnects work at capacity.
    if (rate.create.count >= 3) return { ok: false, status: 429, reason: 'This network has created three rooms in ten minutes. Rejoin an existing room or try later.' };
    if (Object.keys(this.state.rooms).length >= MAX_ROOMS) return { ok: false, status: 503, reason: 'All four online rooms are occupied. Try again shortly.' };
    rate.create.count++;
    const lease = this.state.rooms[code] = { id, created: now, expiresAt: now + ROOM_LIFETIME_MS, deadline: now + RESERVATION_MS, activityVersion: 0 };
    return { ok: true, lease: { ...lease } };
  }
  activate(code: string, id: string, now: number, version = 0) {
    this.prune(now); const lease = this.state.rooms[code];
    if (!lease || lease.id !== id) return false;
    if (version >= (lease.activityVersion ?? 0)) { lease.activityVersion = version; lease.deadline = lease.expiresAt; }
    return true;
  }
  idle(code: string, id: string, deadline: number, version = 0) {
    const lease = this.state.rooms[code];
    if (lease?.id === id && version >= (lease.activityVersion ?? 0)) { lease.activityVersion = version; lease.deadline = Math.min(lease.expiresAt, deadline); }
  }
  release(code: string, id: string) { if (this.state.rooms[code]?.id === id) delete this.state.rooms[code]; }
  nextDeadline(now: number) {
    const times = [...Object.values(this.state.rooms).map(x => x.deadline), ...Object.values(this.state.rates).map(x => x.touched + CREATE_WINDOW_MS)];
    return times.length ? Math.max(now + 1, Math.min(...times)) : null;
  }
}

/** One DO alarm exists; calculate the earliest obligation, never extend it on traffic. */
export function roomDeadline(expiresAt: number, emptySince: number | undefined, pendingJoined: number[]) {
  return Math.min(expiresAt, emptySince === undefined ? Infinity : emptySince + EMPTY_ROOM_MS, ...pendingJoined.map(t => t + JOIN_TIMEOUT_MS));
}
