import {LIVERY_MESSAGE_LIMIT} from '../src/online-livery';
import {readSavedRoom,roomStorageEntries} from './room-storage';
import { DurableObject } from 'cloudflare:workers';
// prepare-rapier.mjs imports the browser's pinned Rapier with a precompiled WASM.Module.
// @ts-ignore generated module has the same public API as rapier3d-compat
import R from './.generated/rapier-worker.mjs';
import { Room, type Peer, type SavedRoom } from './room';
import { PROTOCOL, parseClientMessage, validRoom, STEP, MAX_PLAYERS } from './protocol';
import { AdmissionLedger, EMPTY_ROOM_MS, JOIN_TIMEOUT_MS, roomDeadline, type AdmissionState, type Lease } from './admission';

/** Only connection admission passes through this small global ledger, never physics or input. */
export class QuarryAdmission extends DurableObject<Env> {
  private ledger = new AdmissionLedger();
  private salt = '';
  private alarmUpdate: Promise<void> = Promise.resolve();
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      const saved = await ctx.storage.get<{ state: AdmissionState; salt: string }>('admission');
      if (saved) { this.ledger = new AdmissionLedger(saved.state); this.salt = saved.salt; }
      else this.salt = crypto.randomUUID();
    });
  }
  private async save() {
    await this.ctx.storage.put('admission', { state: this.ledger.state, salt: this.salt });
    this.alarmUpdate = this.alarmUpdate.catch(() => {}).then(async () => {
      const current = await this.ctx.storage.getAlarm();
      const deadline = this.ledger.nextDeadline(Date.now());
      if (deadline === null) await this.ctx.storage.deleteAlarm();
      else if (current === null || deadline < current) await this.ctx.storage.setAlarm(deadline);
    });
    await this.alarmUpdate;
  }
  async admit(code: string, ip: string) {
    // Raw addresses are never stored or logged. A private durable salt defeats IP-dictionary reversal.
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(this.salt + ':' + ip));
    const key = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    const result = this.ledger.admit(code, key, Date.now());
    await this.save(); return result;
  }
  async activate(code: string, id: string, version: number) { const active = this.ledger.activate(code, id, Date.now(), version); await this.save(); return active; }
  async idle(code: string, id: string, deadline: number, version: number) { this.ledger.idle(code, id, deadline, version); await this.save(); }
  async release(code: string, id: string) { this.ledger.release(code, id); await this.save(); }
  async alarm() { this.ledger.prune(Date.now()); await this.save(); }
}

type Attachment = { joined: number; generation: string; id?: number };
type Metadata = { code: string; lease: Lease; emptySince?: number; activityVersion: number };
export class QuarryRoom extends DurableObject<Env> {
  private room?: Room;
  private meta?: Metadata;
  private peers = new Map<WebSocket, { peer: Peer; id: number }>();
  private timer?: ReturnType<typeof setInterval>;
  private last = 0;
  private accumulator = 0;
  private saveTick = 0;
  private flushInFlight?: Promise<void>;
  private saveRequested = false;
  private closing = false;
  private alarmUpdate: Promise<void> = Promise.resolve();
  private prepared: Promise<void>;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.prepared = ctx.blockConcurrencyWhile(async () => {
      this.meta = await ctx.storage.get<Metadata>('metadata');
      if (this.meta) this.meta.activityVersion ??= 0;
      if (!this.meta || this.hasExpired()) {
        for (const ws of ctx.getWebSockets()) ws.close(4000, 'Room expired');
        await ctx.storage.deleteAll(); this.meta = undefined; return;
      }
      const saved = await readSavedRoom(ctx.storage);
      if (saved) { R.init(); this.room = new Room(this.meta.code, R); this.room.restore(saved); }
      for (const ws of ctx.getWebSockets()) {
        const attachment = ws.deserializeAttachment() as Attachment;
        if (attachment.generation !== this.meta.lease.id) { ws.close(4000, 'Room expired'); continue; }
        if (attachment.id === undefined) continue; // Pending hello stays lightweight through hibernation.
        const previous = saved?.sessions.find(s => s.member.id === attachment.id);
        if (!this.room || !previous) { ws.close(1012, 'Room unavailable'); continue; }
        const peer: Peer = { sendBinary:message=>ws.send(message),sendEncoded:message=>ws.send(message),send: m => ws.send(JSON.stringify(m)), close: (c, r) => ws.close(c, r) };
        const id = this.room.connect(peer, JSON.stringify({ type: 'hello', protocol: PROTOCOL, ...previous.member, token: previous.token,maxPlayers:24,eventRules:previous.eventRules,wire:previous.wire }));
        if (id !== null) this.peers.set(ws, { peer, id });
      }
      if (this.room?.activeCount) this.meta.emptySince = undefined;
      else this.meta.emptySince ??= saved?.updated ?? Date.now();
      this.startLoop(); await this.scheduleAlarm();
    });
  }
  private gate() { return this.env.ADMISSION.getByName('quarry-admission-v1'); }
  private hasExpired(now = Date.now()) {
    return !!this.meta && (now >= this.meta.lease.expiresAt || (this.meta.emptySince !== undefined && now >= this.meta.emptySince + EMPTY_ROOM_MS));
  }
  private pendingJoined() {
    return this.ctx.getWebSockets().filter(ws => ws.readyState === WebSocket.OPEN).map(ws => ws.deserializeAttachment() as Attachment)
      .filter(a => a.generation === this.meta?.lease.id && a.id === undefined).map(a => a.joined);
  }
  private scheduleAlarm() {
    // Prior RPC continuations may overlap: serialize updates and read current obligations inside the queue.
    this.alarmUpdate = this.alarmUpdate.catch(() => {}).then(async () => {
      const current = await this.ctx.storage.getAlarm();
      if (this.closing || !this.meta) return;
      const deadline = Math.max(Date.now() + 1, roomDeadline(this.meta.lease.expiresAt, this.meta.emptySince, this.pendingJoined()));
      if (current === null || deadline < current) await this.ctx.storage.setAlarm(deadline);
    });
    return this.alarmUpdate;
  }
  private async expire(reason: string) {
    if (this.closing) return;
    this.closing = true; const meta = this.meta;
    clearInterval(this.timer); this.timer = undefined;
    for (const ws of this.ctx.getWebSockets()) try { ws.close(4000, reason); } catch {}
    this.peers.clear(); this.room?.dispose(); this.room = undefined; this.meta = undefined;
    await this.ctx.storage.deleteAll();
    if (meta) await this.gate().release(meta.code, meta.lease.id);
  }
  async fetch(request: Request) {
    await this.prepared;
    const code = new URL(request.url).pathname.split('/').pop()!;
    if (!validRoom(code)) return new Response('Invalid room code', { status: 400 });
    // This header is overwritten by our Worker after admission; clients cannot address the DO directly.
    let lease: Lease;
    try { lease = JSON.parse(request.headers.get('X-Quarry-Lease') ?? 'null'); } catch { return new Response('Admission required', { status: 403 }); }
    if (!lease || typeof lease.id !== 'string' || !Number.isFinite(lease.expiresAt) || lease.expiresAt <= Date.now()) return new Response('Room expired', { status: 410 });
    if (this.hasExpired()) await this.expire('Room expired');
    if (this.meta && this.meta.lease.id !== lease.id) return new Response('Room generation mismatch', { status: 409 });
    if (!this.meta) { this.closing = false; this.meta = { code, lease, emptySince: Date.now(), activityVersion: lease.activityVersion ?? 0 }; await this.ctx.storage.put('metadata', this.meta); }
    // Permit a token reconnect to replace an old peer even when all player slots are occupied.
    if (this.ctx.getWebSockets().filter(ws => ws.readyState === WebSocket.OPEN).length >= MAX_PLAYERS+8) return new Response('Too many pending connections', { status: 429 });
    const pair = new WebSocketPair(), client = pair[0], ws = pair[1];
    this.ctx.acceptWebSocket(ws);
    ws.serializeAttachment({ joined: Date.now(), generation: lease.id } satisfies Attachment);
    await this.scheduleAlarm();
    return new Response(null, { status: 101, webSocket: client });
  }
  async webSocketMessage(ws: WebSocket, data: string | ArrayBuffer) {
    await this.prepared;
    if (this.closing || !this.meta) { ws.close(4000, 'Room expired'); return; }
    if (this.hasExpired()) { await this.expire('Room expired'); return; }
    if(typeof data!=='string'||data.length>LIVERY_MESSAGE_LIMIT||new TextEncoder().encode(data).byteLength>LIVERY_MESSAGE_LIMIT){ws.close(1009,'Message exceeds 32 KiB');return;}
    if(new TextEncoder().encode(data).byteLength>1024&&(!this.peers.has(ws)||parseClientMessage(data)?.type!=='livery')){ws.close(1009,'Message exceeds 1 KiB');return;}
    let session = this.peers.get(ws);
    if (!session) {
      const attachment = ws.deserializeAttachment() as Attachment;
      if (attachment.generation !== this.meta.lease.id || Date.now() >= attachment.joined + JOIN_TIMEOUT_MS) { ws.close(1008, 'Join timeout'); return; }
      const hello = parseClientMessage(data);
      if (!hello || hello.type !== 'hello') { ws.close(1008, 'Expected valid hello'); return; }
      const meta = this.meta;
      if (!this.room?.activeCount) {
        if (!await this.gate().activate(meta.code, meta.lease.id, ++meta.activityVersion)) { await this.expire('Room reservation expired'); return; }
        if (this.closing || this.meta?.lease.id !== meta.lease.id || this.hasExpired() || ws.readyState !== WebSocket.OPEN) { ws.close(4000, 'Room expired'); return; }
      }
      // The heavy terrain and car world is allocated only after a validated hello and admission.
      if (!this.room) { R.init(); this.room = new Room(meta.code, R); }
      const peer: Peer = { sendBinary:message=>ws.send(message),sendEncoded:message=>ws.send(message),send: m => ws.send(JSON.stringify(m)), close: (c, r) => ws.close(c, r) };
      const id = this.room.connect(peer, data); if (id === null) return;
      session = { peer, id }; this.peers.set(ws, session);
      ws.serializeAttachment({ ...attachment, id } satisfies Attachment);
      this.meta.emptySince = undefined;
      // A pending peer may have closed while the initial admission RPC was awaited.
      // Commit the established active state with a newer version; stale idle RPCs cannot shorten it.
      if (!await this.gate().activate(meta.code, meta.lease.id, ++meta.activityVersion)) { await this.expire('Room reservation expired'); return; }
      await this.persist(); await this.scheduleAlarm();
    } else {
      const changed=this.room?.receive(session.id, session.peer, data);
      // Persist quiet result-screen votes/round changes before this object hibernates.
      if(changed)await this.persist();
    }
    this.startLoop();
  }
  private startLoop() {
    if (this.timer || !this.room || !this.room.activeCount || !['countdown', 'playing'].includes(this.room.sim.phase)) return;
    this.last = Date.now(); this.accumulator = 0;
    this.timer = setInterval(() => {
      if (!this.room) return;
      const now = Date.now();
      if (this.hasExpired(now)) { this.ctx.waitUntil(this.expire('Room reached its two-hour limit')); return; }
      this.accumulator += Math.min(.15, (now - this.last) / 1000); this.last = now;
      while (this.accumulator >= STEP) { this.room.step(); this.accumulator -= STEP; }
      this.room.broadcast();
      if (++this.saveTick >= 100) { this.saveTick = 0; this.ctx.waitUntil(this.persist()); }
      if (!this.room.activeCount || this.room.sim.phase === 'result') { clearInterval(this.timer); this.timer = undefined; this.ctx.waitUntil(this.persist()); }
    }, 50);
  }
  private persist(): Promise<void> {
    if (!this.room || !this.meta || this.closing) return Promise.resolve();
    this.saveRequested = true;
    if (!this.flushInFlight) {
      this.flushInFlight = (async () => {
        do {
          this.saveRequested = false;
          if (!this.room || !this.meta || this.closing) break;
          await this.ctx.storage.put({ ...roomStorageEntries(this.room.save()), metadata: this.meta });
        } while (this.saveRequested);
      })().finally(() => { this.flushInFlight = undefined; if (this.saveRequested) return this.persist(); });
    }
    return this.flushInFlight;
  }
  async webSocketClose(ws: WebSocket, code = 1000, reason = 'Disconnected') {
    try { ws.close(code === 1005 || code === 1006 ? 1000 : code, reason); } catch {}
    const attachment = ws.deserializeAttachment() as Attachment;
    if (this.closing || !this.meta || attachment.generation !== this.meta.lease.id) return;
    const session = this.peers.get(ws);
    if (session) { this.room?.disconnect(session.id, session.peer); this.peers.delete(ws); }
    if (!this.room?.activeCount) {
      clearInterval(this.timer); this.timer = undefined;
      this.meta.emptySince ??= Date.now();
      if (!this.room && this.pendingJoined().length === 0) { await this.expire('Room left empty'); return; }
      await this.gate().idle(this.meta.code, this.meta.lease.id, this.meta.emptySince + EMPTY_ROOM_MS, ++this.meta.activityVersion);
    }
    await this.persist(); await this.scheduleAlarm();
  }
  async webSocketError(ws: WebSocket) { await this.webSocketClose(ws); }
  async alarm() {
    if (!this.meta || this.closing) return;
    if (this.hasExpired()) { await this.expire('Room expired'); return; }
    for (const ws of this.ctx.getWebSockets()) {
      const a = ws.deserializeAttachment() as Attachment;
      if (a.id === undefined && Date.now() >= a.joined + JOIN_TIMEOUT_MS) ws.close(1008, 'Join timeout');
    }
    if (!this.room && this.pendingJoined().length === 0) { await this.expire('Room left empty'); return; }
    await this.scheduleAlarm();
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const u = new URL(request.url);
    if (u.pathname === '/health') return Response.json({ ok: true, protocol: PROTOCOL, service: 'quarry-impact-online' });
    if (request.method !== 'GET' || request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') return new Response('WebSocket endpoint', { status: 426 });
    const origin = request.headers.get('Origin') ?? '';
    if (!env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).includes(origin)) return new Response('Origin denied', { status: 403 });
    const code = u.pathname.match(/^\/rooms\/([A-HJ-NP-Z2-9]{6})$/)?.[1];
    if (!code) return new Response('Invalid room code', { status: 400 });
    const admission = await env.ADMISSION.getByName('quarry-admission-v1').admit(code, request.headers.get('CF-Connecting-IP') ?? 'local-development');
    if (!admission.ok) {
      // Browser WebSocket APIs hide HTTP response text; a bounded rejection socket carries the reason.
      const pair = new WebSocketPair(); pair[1].accept();
      pair[1].send(JSON.stringify({ type: 'error', message: admission.reason })); pair[1].close(4004, admission.reason.slice(0, 120));
      return new Response(null, { status: 101, webSocket: pair[0] });
    }
    const forwarded = new Request(request); forwarded.headers.set('X-Quarry-Lease', JSON.stringify(admission.lease));
    return env.ROOMS.getByName(code).fetch(forwarded);
  }
} satisfies ExportedHandler<Env>;
