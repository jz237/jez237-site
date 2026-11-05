// Online 2-player co-op over the site's duel relay (the Steel Duel room server, rooms SB-XXXX and
// SB-Q-XXXXX for quick match). The first player in a room is p1 = the host: it runs the real arena
// (waves, machines, survivors, bosses, lives, score) and streams snapshots. The guest runs its own
// Warden locally (so moving and aiming never lag), judges the hits it takes, and reports its Warden,
// its shots and its PULSEs; the host re-creates those shots so kills are decided in one place.
import { adoptWave, pulse } from './sim.js?v=2';

export const PROTOCOL = 1;
const RELAY = 'wss://steel-duel-online.jez237.workers.dev';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const QUICK = 'SB-Q-';
export const ROOM = 'SB-';
export function randomCode(n) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  let s = '';
  for (const x of b) s += CODE_CHARS[x % CODE_CHARS.length];
  return s;
}
export const cleanCode = (v) => String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const r2 = (v) => Math.round(v * 100) / 100;
const r3 = (v) => Math.round(v * 1000) / 1000;
const TYPES = ['dummy', 'crawler', 'brute', 'spitter', 'hive', 'dart', 'pylon', 'splitter', 'shard'];
// events the guest already played itself (or that do not matter on the far side)
const QUIET = new Set(['fire', 'wallhit']);

// ------------------------------------------------------------------ snapshots
export function packWorld(W) {
  const h = W.players[0], g = W.players[1], B = W.boss;
  return {
    wt: r3(W.t), ph: W.phase, pt: r2(W.phaseT), wv: W.wave, wn: W.waveN, wT: r2(W.waveT), ft: r2(W.fightT), lv: W.lives, sc: W.score, ch: W.chain, k: W.k, ov: W.over ? 1 : 0, rs: W.result, st: r2(W.secT),
    en: W.enemies.filter((e) => e.hp > 0).map((e) => [e.id, TYPES.indexOf(e.type), r2(e.x), r2(e.z), r2(e.vx), r2(e.vz), e.hp, r2(e.born), r2(e.a), r2(e.aimT), r3(e.aimA), r2(e.aimLock || 0), e.arc, e.link, r2(e.tell || 0), r2(e.hitT), e.max]),
    su: W.survivors.map((s) => [s.id, r2(s.x), r2(s.z), r2(s.vx), r2(s.vz), s.look]),
    bo: W.bolts.map((b) => [b.id, r2(b.x), r2(b.z), r2(b.vx), r2(b.vz), b.r, b.big ? 1 : 0, r2(b.life)]),
    po: W.portals.map((P) => [P.id, r2(P.x), r2(P.z), r2(P.t), r2(P.T), P.types.map((t) => TYPES.indexOf(t)), P.x2 ?? null, P.z2 ?? null, P.inside ? 1 : 0]),
    hz: W.hazards.map((q) => ({ ...q })),
    b: B ? { key: B.key, x: r2(B.x), z: r2(B.z), hp: B.hp, max: B.max, r: B.r, state: B.state, a: r3(B.a), phase: B.phase, hitT: r2(B.hitT), spin: r2(B.spin), st: r2(B.st), orbs: B.orbs.map((o) => [r2(o.x), r2(o.z), o.hp, r3(o.a), o.max]), cur: B.cur ? { kind: B.cur.kind, t: r2(B.cur.t), T: r2(B.cur.T) } : null } : null,
    p1: [r3(h.x), r3(h.z), r2(h.vx), r2(h.vz), r3(h.aim), h.alive ? 1 : 0, r2(h.inv), h.shield, h.pulses, r2(h.walk)],
    p2: g ? [g.alive ? 1 : 0, r2(g.x), r2(g.z), r2(g.inv), g.shield, g.pulses] : null,
    hs: W.shots.filter((s) => s.pid === 1).map((s) => [r2(s.x), r2(s.z), r2(s.vx), r2(s.vz), r2(s.life)]),
    sx: [W.stats.kills, W.stats.rescued, W.stats.surv, W.stats.lost, W.stats.deaths],
  };
}

export function applyWorld(W, S, lead) {
  const ext = (x, vx) => x + vx * lead;
  W.t = S.wt + lead; W.phase = S.ph; W.phaseT = S.pt; W.waveT = S.wT; W.fightT = S.ft; W.lives = S.lv; W.score = S.sc; W.chain = S.ch; W.k = S.k; W.over = !!S.ov; W.result = S.rs; W.secT = S.st;
  adoptWave(W, S.wv, S.wn);
  const old = new Map(W.enemies.map((e) => [e.id, e]));
  W.enemies = S.en.map((q) => {
    const e = old.get(q[0]) || {};
    return Object.assign(e, { id: q[0], type: TYPES[q[1]], x: ext(q[2], q[4]), z: ext(q[3], q[5]), vx: q[4], vz: q[5], hp: q[6], born: q[7], a: q[8], aimT: q[9], aimA: q[10], aimLock: q[11], arc: q[12], link: q[13], tell: q[14], hitT: q[15], max: q[16], r: R_OF[TYPES[q[1]]], t: e.t || 0, st: 1, life: 9, remote: true });
  });
  W.survivors = S.su.map((q) => ({ id: q[0], x: ext(q[1], q[3]), z: ext(q[2], q[4]), vx: q[3], vz: q[4], look: q[5], a: Math.atan2(q[4], q[3]), t: 1 }));
  W.bolts = S.bo.map((q) => ({ id: q[0], x: ext(q[1], q[3]), z: ext(q[2], q[4]), vx: q[3], vz: q[4], r: q[5], big: q[6], life: q[7] - lead }));
  W.portals = S.po.map((q) => ({ id: q[0], x: q[1], z: q[2], t: q[3] + lead, T: q[4], types: q[5].map((i) => TYPES[i]), x2: q[6] ?? undefined, z2: q[7] ?? undefined, inside: !!q[8], g: { types: [] } }));
  W.hazards = S.hz;
  if (S.b) {
    const B = W.boss && W.boss.key === S.b.key ? W.boss : {};
    Object.assign(B, S.b, { orbs: S.b.orbs.map((o, i) => ({ i, x: o[0], z: o[1], hp: o[2], a: o[3], max: o[4] })), vx: 0, vz: 0, t: B.t || 0 });
    W.boss = B;
  } else W.boss = null;
  const h = W.players[0], q = S.p1;
  h.remote = true;
  h.x = q[0] + q[2] * lead; h.z = q[1] + q[3] * lead; h.vx = q[2]; h.vz = q[3]; h.aim = q[4]; h.alive = !!q[5]; h.inv = q[6]; h.shield = q[7]; h.pulses = q[8]; h.walk = q[9];
  const me = W.players[1], m = S.p2;
  if (me && m) {
    if (m[0] && !me.alive) { // the host brought me back
      me.alive = true; me.x = m[1]; me.z = m[2]; me.vx = me.vz = 0; me.inv = m[3]; me.deadT = 0;
      W.ev.push({ k: 'spawn', pid: 2, x: me.x, z: me.z });
    }
    me.shield = Math.min(me.shield, m[4]); me.pulses = Math.min(me.pulses, m[5]);
    // a new wave refills both
    if (S.ph === 'intro') { me.shield = m[4]; me.pulses = m[5]; }
  }
  W.shots = W.shots.filter((s) => s.pid !== 1).concat(S.hs.map((q) => ({ id: 0, pid: 1, x: q[0] + q[2] * lead, z: q[1] + q[3] * lead, vx: q[2], vz: q[3], life: q[4] - lead, ghost: true })));
  [W.stats.kills, W.stats.rescued, W.stats.surv, W.stats.lost, W.stats.deaths] = S.sx;
}
const R_OF = { dummy: 0.55, crawler: 0.48, brute: 1.0, spitter: 0.6, hive: 1.05, dart: 0.34, pylon: 0.42, splitter: 0.8, shard: 0.42 };

// ------------------------------------------------------------------ the connection
// hooks: status(text, kind), joined(peer), start(cfg), left(reason), chat(msg)
export class Online {
  constructor(hooks, opts = {}) {
    this.h = hooks;
    this.relay = opts.relay || RELAY;
    this.lag = opts.lag || 0;
    this.ws = null;
    this.reset();
  }
  reset() {
    this.role = null; this.room = null; this.intent = null; this.peer = null; this.peers = [];
    this.rtt = 150; this.W = null; this.inbox = []; this.sendT = 0; this.lastRecv = 0;
    this.events = []; this.remote = null; this.shotQ = []; this.claimQ = []; this.outShots = []; this.sent = new WeakSet();
    this.stat = { snaps: 0, inputs: 0, shots: 0, deaths: 0 };
    clearInterval(this.pingT); clearInterval(this.helloT); clearInterval(this.pollT);
  }
  get open() { return this.ws && this.ws.readyState === 1; }
  get http() { return this.relay.replace(/^ws/, 'http'); }
  get host() { return this.role === 'p1'; }

  async rooms() { const r = await fetch(this.http + '/rooms', { cache: 'no-store' }); const d = await r.json(); return Array.isArray(d.rooms) ? d.rooms : []; }
  async quick(me) {
    this.h.status('Looking for a partner…', 'wait');
    let list = [];
    try { list = await this.rooms(); } catch { /* lobby unreachable: wait in a room */ }
    const open = list.filter((r) => String(r.room).startsWith(QUICK)).sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));
    if (open.length) { this.connect(open[0].room, 'quick', me); return; }
    const room = QUICK + randomCode(5);
    this.connect(room, 'quick', me);
    this.pollT = setInterval(async () => {
      if (this.peer || this.room !== room) { clearInterval(this.pollT); return; }
      let l = [];
      try { l = await this.rooms(); } catch { return; }
      const other = l.find((r) => String(r.room).startsWith(QUICK) && r.room !== room && r.room < room);
      if (other && !this.peer && this.room === room) this.connect(other.room, 'quick', me);
    }, 2500);
  }
  connect(room, intent, me) {
    this.close(true);
    this.reset();
    this.room = room; this.intent = intent; this.me = me;
    let ws;
    try { ws = new WebSocket(`${this.relay}/ws/${encodeURIComponent(room)}`); } catch { this.h.status('Could not reach the online server', 'error'); return; }
    this.ws = ws;
    ws.onopen = () => {
      this.raw({ type: 'hello', name: me.ini || 'WARDEN' });
      this.ping();
      this.pingT = setInterval(() => this.ping(), 2000);
      this.helloT = setInterval(() => { if (!this.peer) this.raw({ type: 'hello', name: me.ini || 'WARDEN' }); }, 50000);
    };
    ws.onmessage = (ev) => { if (this.ws === ws) this.recv(ev.data); };
    ws.onerror = () => { if (this.ws === ws && !this.role) this.h.status('Could not reach the online server', 'error'); };
    ws.onclose = () => { if (this.ws !== ws) return; this.ws = null; if (!this.role) this.h.status('Could not reach the online server', 'error'); else this.h.left('lost'); };
  }
  close(silent) {
    clearInterval(this.pingT); clearInterval(this.helloT); clearInterval(this.pollT);
    const ws = this.ws;
    this.ws = null;
    if (ws) { try { if (!silent && ws.readyState === 1) ws.send(JSON.stringify({ type: 'chat', k: 'bye' })); ws.close(); } catch { /* gone */ } }
  }
  raw(obj) {
    if (!this.open) return;
    const s = JSON.stringify(obj);
    if (this.lag) { const ws = this.ws; setTimeout(() => { try { if (ws.readyState === 1) ws.send(s); } catch { /* gone */ } }, this.lag); } else this.ws.send(s);
  }
  ping() { this.raw({ type: 'ping', sent: performance.now() }); }
  recv(text) {
    let d;
    try { d = JSON.parse(text); } catch { return; }
    if (this.lag && d.type !== 'pong') { setTimeout(() => this.handle(d), this.lag); return; }
    this.handle(d);
  }
  handle(d) {
    this.lastRecv = performance.now();
    switch (d.type) {
      case 'welcome': {
        this.role = d.role; this.peers = d.peers || [];
        if (d.role === 'spectator') {
          this.close(true); this.role = null;
          if (this.intent === 'quick') setTimeout(() => this.quick(this.me), 400); else this.h.status('That room is full', 'error');
          return;
        }
        if (d.role === 'p1' && this.intent === 'join') { this.close(true); this.role = null; this.h.status(`No room with code ${this.room.slice(ROOM.length)}`, 'error'); return; }
        if (d.role === 'p2') this.sendReady();
        this.h.status(d.role === 'p1' ? 'waiting' : 'Connecting to your partner…', d.role === 'p1' ? 'wait' : 'info');
        return;
      }
      case 'peer': {
        const had = !!this.peer;
        this.peers = d.peers || [];
        const other = this.peers.find((p) => p.role === (this.role === 'p1' ? 'p2' : 'p1'));
        if (!other && had) { this.peer = null; this.h.left('left'); return; }
        if (other && this.role === 'p1' && !had) this.sendReady();
        return;
      }
      case 'pong': {
        const now = performance.now(), rtt = now - (+d.sent || now);
        if (rtt > 0 && rtt < 5000) this.rtt = this.rtt * 0.7 + rtt * 0.3;
        return;
      }
      case 'ready': {
        if (d.g !== 'sb') return;
        if (d.pv !== PROTOCOL) { this.h.status('Your partner is on a different version: refresh both pages', 'error'); return; }
        const first = !this.peer;
        this.peer = { ini: String(d.ini || '').replace(/[^A-Z0-9]/gi, '').slice(0, 4) };
        if (first) { clearInterval(this.pollT); this.h.joined(this.peer); }
        return;
      }
      case 'start': if (this.role === 'p2') this.h.start(d.cfg || {}); return;
      case 'snapshot': if (this.role === 'p2') this.inbox.push(d); return;
      case 'input': if (this.role === 'p1') this.onInput(d); return;
      case 'chat': if (d.k === 'bye') { this.peer = null; this.h.left('left'); return; } this.h.chat(d); return;
    }
  }
  sendReady() { this.raw({ type: 'ready', g: 'sb', pv: PROTOCOL, ini: this.me.ini }); }
  sendStart(cfg) { this.raw({ type: 'start', cfg }); }

  bind(W) {
    this.W = W; this.inbox = []; this.events = []; this.shotQ = []; this.claimQ = []; this.outShots = []; this.sent = new WeakSet(); this.remote = null;
    W.net = this.host ? 'host' : 'guest';
    if (this.host) W.players[1].remote = true; else W.players[0].remote = true;
  }

  // -------------------------------- host
  onInput(d) {
    this.stat.inputs++;
    if (Array.isArray(d.s)) this.remote = { s: d.s, at: performance.now() };
    for (const b of d.f || []) this.shotQ.push(b);
    for (const c of d.c || []) this.claimQ.push(c);
  }
  hostTick(W) {
    const g = W.players[1];
    if (!g) return;
    const lag = clamp(this.rtt / 2000, 0, 0.25);
    if (this.remote && g.alive && this.remote.s[5]) {
      const q = this.remote.s, age = Math.min(0.3, lag + (performance.now() - this.remote.at) / 1000);
      g.vx = +q[2] || 0; g.vz = +q[3] || 0; g.x = (+q[0] || 0) + g.vx * age; g.z = (+q[1] || 0) + g.vz * age; g.aim = +q[4] || 0; g.walk = +q[6] || 0;
    }
    for (const b of this.shotQ) {
      if (!g.alive || W.over) break;
      const age = clamp(lag, 0, 0.3);
      W.shots.push({ id: W.nextId++, pid: 2, x: +b.x + b.vx * age, z: +b.z + b.vz * age, vx: +b.vx, vz: +b.vz, life: clamp(+b.l || 0.5, 0.05, 0.8) - age });
      this.stat.shots++;
    }
    this.shotQ = [];
    for (const c of this.claimQ) {
      if (c.dead && g.alive) {
        g.alive = false; g.deadT = 0; W.lives = Math.max(0, W.lives - 1); W.stats.deaths++; W.chain = 0; W.lastDeathN = W.n;
        W.ev.push({ k: 'death', pid: 2, x: g.x, z: g.z, cause: c.cause || 'hit', remote: 1, lives: W.lives });
        this.stat.deaths++;
      }
      if (c.shield !== undefined) g.shield = c.shield | 0;
      if (c.pulse && g.alive) pulse(W, g, true);
    }
    this.claimQ = [];
  }
  hostEvents(list) { for (const e of list) if (!QUIET.has(e.k) && !(e.pid === 2 && (e.remote || e.k === 'pulse'))) this.events.push(e); }
  hostFrame(W, dt) {
    this.sendT -= dt;
    if (this.sendT > 0 || !this.peer) return;
    this.sendT = 1 / 20;
    this.raw({ type: 'snapshot', s: packWorld(W), ev: this.events.splice(0, 80), hr: Math.round(this.rtt) });
    this.stat.snaps++;
  }

  // -------------------------------- guest
  guestFrame(W, dt) {
    const me = W.players[1];
    for (const s of W.shots) {
      if (s.pid !== 2 || this.sent.has(s)) continue;
      this.sent.add(s);
      s.ghost = true;
      this.outShots.push({ x: r2(s.x), z: r2(s.z), vx: r2(s.vx), vz: r2(s.vz), l: r2(s.life) });
    }
    const claims = W.claims.splice(0);
    this.sendT -= dt;
    if (!claims.length && !this.outShots.length && this.sendT > 0) return;
    this.sendT = 1 / 30;
    if (!me) return;
    this.raw({ type: 'input', s: [r3(me.x), r3(me.z), r2(me.vx), r2(me.vz), r3(me.aim), me.alive ? 1 : 0, r2(me.walk)], f: this.outShots, c: claims });
    this.outShots = [];
  }
  guestSync(W) {
    if (!this.inbox.length) return [];
    const ev = [];
    let last = null;
    this.stat.snaps += this.inbox.length;
    for (const m of this.inbox) { for (const e of m.ev || []) ev.push(e); last = m; }
    this.inbox = [];
    const lead = clamp(((+last.hr || this.rtt) / 2) / 1000, 0, 0.25);
    applyWorld(W, last.s, lead);
    // my own hits, deaths and pulses already played here
    return ev.filter((e) => !(e.pid === 2 && (e.k === 'shield' || e.k === 'death' || e.k === 'pulse' || e.k === 'spawn')));
  }
  get stale() { return this.lastRecv && performance.now() - this.lastRecv > 4000; }
}
