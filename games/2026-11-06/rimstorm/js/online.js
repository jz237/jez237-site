// Online 2-player co-op over the site's duel relay (the Steel Duel room server, rooms RS-XXXX and
// RS-Q-XXXXX for quick match). Two Rimrunners share one web. The first player in a room is p1 = the host:
// it runs the real web (enemies, bolts, strikes, bosses, lives, score) and streams snapshots ~20 times a
// second. The guest steers its own Rimrunner locally (so moving never lags) and reports where it is, the
// shots it fires and its PURGE / HOP presses; the host re-creates those, so every hit and every death is
// decided in one place. The relay overwrites the keys t, from, role and start.mode: none are used here.
import { adoptWeb, purge, laneDist, laneOf } from './sim.js?v=5';
import { PW_KEYS, ENEMY_KEYS, F } from './config.js?v=5';

export const PROTOCOL = 1;
const RELAY = 'wss://steel-duel-online.jez237.workers.dev';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const QUICK = 'RS-Q-';
export const ROOM = 'RS-';
export function randomCode(n) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  let s = '';
  for (const x of b) s += CODE_CHARS[x % CODE_CHARS.length];
  return s;
}
// a typed code or a whole room name from a link (RS-ABCD): the 4-letter code
export const cleanCode = (v) => String(v || '').toUpperCase().replace(/^\s*RS-(Q-)?/, '').replace(/[^A-Z0-9]/g, '').slice(0, 4);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const r2 = (v) => Math.round(v * 100) / 100;
const r3 = (v) => Math.round(v * 1000) / 1000;
const ZK = ['shock', 'sweep', 'lunge', 'flare', 'beam', 'pull'];
const BK = ['lance', 'reflect', 'boss', 'spit'];
const QUIET = new Set(['fire']);
const packPw = (pw) => Object.entries(pw || {}).map(([k, t]) => [PW_KEYS.indexOf(k), r2(t)]);
const unpackPw = (a) => { const o = {}; for (const [i, t] of a || []) o[PW_KEYS[i]] = t; return o; };

// ------------------------------------------------------------------ snapshots
export function packWorld(W) {
  const h = W.players[0], g = W.players[1], B = W.boss;
  const pp = (p) => [r3(p.pos), r3(p.d), p.alive ? 1 : 0, r2(p.inv), p.plate, p.purges, p.partials, r2(p.hop), p.hops, r2(p.tilt), r2(p.drag), p.lane, packPw(p.pw)];
  return {
    wt: r3(W.t), ph: W.phase, pt: r2(W.phaseT), wb: W.web, wn: W.webN, se: W.sector, md: W.mode, lv: W.lives, sc: W.score, k: W.k, ov: W.over ? 1 : 0, rs: W.result, st: r2(W.secT), ft: r2(W.fightT), dv: [r2(W.diveT), r2(W.diveDur)], rot: r3(W.rot),
    en: W.enemies.filter((e) => e.hp > 0).map((e) => [e.id, ENEMY_KEYS.indexOf(e.type), r3(e.lane), r3(e.d), e.hp, e.rim ? 1 : 0, r2(e.tell), r2(e.grabT), e.fl ? [r3(e.fl.a), r3(e.fl.b), r2(e.fl.t), r2(e.fl.T)] : 0, e.sh, e.cool, r2(e.born), r2(e.hitT), r2(e.fireT), e.state === 'hover' ? 1 : 0, e.pounce ? r2(e.tellT) : 0]),
    bo: W.bolts.map((b) => [b.id, b.lane, r3(b.d), r3(b.v), BK.indexOf(b.kind)]),
    zp: W.zaps.map((z) => [z.id, z.lane, r2(z.t), r2(z.T), r2(z.live), ZK.indexOf(z.kind), z.src]),
    pk: W.pods.map((q) => [q.id, PW_KEYS.indexOf(q.kind), q.lane, r3(q.d)]),
    dr: W.droids.map((q) => [q.id, q.pid, q.lane, r2(q.t)]),
    sp: W.spine.map(r3),
    b: B ? { key: B.key, hp: B.hp, max: B.max, d: r3(B.d), state: B.state, t: r2(B.t), phase: B.phase, rot: r3(B.rot), segs: B.segs, heads: B.heads.map((q) => [q.lane, r3(q.d), q.hp, q.max, r2(q.hitT), r2(q.lunge)]), eye: B.eye ? [B.eye.lane, B.eye.open, r2(B.eye.t)] : null, hitT: r2(B.hitT), pull: B.pull ? [B.pull.lane, r2(B.pull.t)] : null, cur: B.cur ? { kind: B.cur.kind, t: r2(B.cur.t), T: r2(B.cur.T), lanes: B.cur.lanes, passive: B.cur.passive || 0 } : null } : null,
    p1: pp(h), p2: g ? pp(g) : null,
    hs: W.shots.filter((s) => s.pid === 1 || s.droid).map((s) => [s.lane, r3(s.d), r3(s.v), s.twin, s.droid ? 1 : 0]),
    sx: [W.stats.kills, W.stats.deaths, W.stats.shots, W.stats.hits],
  };
}

export function applyWorld(W, S, lead) {
  W.t = S.wt + lead; W.phase = S.ph; W.phaseT = S.pt; W.lives = S.lv; W.score = S.sc; W.k = S.k; W.over = !!S.ov; W.result = S.rs; W.secT = S.st; W.fightT = S.ft; W.rot = S.rot;
  [W.diveT, W.diveDur] = S.dv;
  adoptWeb(W, S.wb, S.wn, S.se, S.md);
  const old = new Map(W.enemies.map((e) => [e.id, e]));
  const sdt = W.snapT !== undefined ? S.wt - W.snapT : 0;
  W.snapT = S.wt;
  W.enemies = S.en.map((q) => {
    const e = old.get(q[0]) || { t: 0, st: 0, state: 'climb', goal: 0, zapN: 0, boss: false, shotsLeft: 0, hover: 0 };
    // drift rates from the last two snapshots (no drift across a flip, a wrap or a long gap)
    if (e.sd !== undefined && sdt > 0.02 && sdt < 0.3 && !q[8]) {
      const dl = q[2] - e.sl;
      e.vd = (q[3] - e.sd) / sdt; e.vl = Math.abs(dl) < 0.6 ? dl / sdt : 0;
    } else { e.vd = 0; e.vl = 0; }
    e.sd = q[3]; e.sl = q[2]; e.age = 0;
    return Object.assign(e, { id: q[0], type: ENEMY_KEYS[q[1]], lane: q[2], d: q[3], hp: q[4], max: e.max || q[4], rim: !!q[5], tell: q[6], grabT: q[7], fl: q[8] ? { a: q[8][0], b: q[8][1], t: q[8][2], T: q[8][3] } : null, sh: q[9], cool: q[10], born: q[11], hitT: q[12], fireT: q[13], state: q[14] ? 'hover' : 'climb', pounce: q[15] ? 1 : 0, tellT: q[15] || 0, remote: true });
  });
  W.bolts = S.bo.map((q) => ({ id: q[0], lane: q[1], d: Math.max(0, q[2] - q[3] * lead), d0: q[2], v: q[3], kind: BK[q[4]] || 'lance' }));
  W.zaps = S.zp.map((q) => ({ id: q[0], lane: q[1], t: q[2] + lead, T: q[3], live: q[4], kind: ZK[q[5]] || 'shock', src: q[6], on: q[2] >= 0 ? 1 : 0 }));
  W.pods = S.pk.map((q) => ({ id: q[0], kind: PW_KEYS[q[1]], lane: q[2], d: Math.max(0, q[3] - F.podV * lead), t: 0 }));
  W.droids = S.dr.map((q) => ({ id: q[0], pid: q[1], lane: q[2], t: q[3], fireT: 0 }));
  if (S.sp.length === W.nl) W.spine = S.sp.slice();
  if (S.b) {
    const B = W.boss && W.boss.key === S.b.key ? W.boss : {};
    B.rotV = B.srot !== undefined && sdt > 0.02 && sdt < 0.3 ? (S.b.rot - B.srot) / sdt : 0;
    B.srot = S.b.rot; B.age = 0;
    Object.assign(B, S.b, { d0: S.b.d, heads: S.b.heads.map((q) => ({ lane: q[0], d: q[1], hp: q[2], max: q[3], hitT: q[4], lunge: q[5] })), eye: S.b.eye ? { lane: S.b.eye[0], open: S.b.eye[1], t: S.b.eye[2] } : null, pull: S.b.pull ? { lane: S.b.pull[0], t: S.b.pull[1], v: 2.2 } : null, cd: 1, ai: 0, stun: 0, exposed: 0 });
    W.boss = B;
  } else W.boss = null;
  const set = (p, q, own) => {
    if (!own) { p.pos = q[0]; p.aim = p.tgt = q[11]; p.lane = q[11]; p.d = q[1]; p.tilt = q[9]; }
    const was = p.alive;
    p.alive = !!q[2]; p.inv = q[3]; p.plate = q[4]; p.purges = q[5]; p.partials = q[6]; p.hop = q[7]; p.hops = q[8]; p.drag = q[10]; p.pw = unpackPw(q[12]);
    if (own && was && !p.alive) { p.deadT = 0; }
    if (own && !was && p.alive) { p.pos = p.aim = p.tgt = p.lane = q[11]; W.ev.push({ k: 'spawn', pid: p.id, lane: p.lane }); }
    if (own && W.phase === 'dive') p.d = q[1];
  };
  set(W.players[0], S.p1, false);
  W.players[0].remote = true;
  if (W.players[1] && S.p2) set(W.players[1], S.p2, true);
  W.shots = W.shots.filter((s) => s.pid === 2 && !s.droid).concat(S.hs.map((q) => ({ id: 0, pid: 1, lane: q[0], d: q[1] + q[2] * lead, v: q[2], dmg: 1, pierce: 0, twin: q[3], droid: q[4], ghost: true })));
  [W.stats.kills, W.stats.deaths, W.stats.shots, W.stats.hits] = S.sx;
}

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
    this.stat = { snaps: 0, inputs: 0, shots: 0, kills2: 0, deaths2: 0, claims: 0, bytes: 0, maxBytes: 0 };
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
      this.raw({ type: 'hello', name: me.ini || 'RUNNER' });
      this.ping();
      this.pingT = setInterval(() => this.ping(), 2000);
      this.helloT = setInterval(() => { if (!this.peer) this.raw({ type: 'hello', name: me.ini || 'RUNNER' }); }, 50000);
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
    if (!this.open) return 0;
    const s = JSON.stringify(obj);
    if (this.lag) { const ws = this.ws; setTimeout(() => { try { if (ws.readyState === 1) ws.send(s); } catch { /* gone */ } }, this.lag); } else this.ws.send(s);
    return s.length;
  }
  ping() { this.raw({ type: 'ping', sent: performance.now() }); }
  recv(text) {
    let d;
    try { d = JSON.parse(text); } catch { return; }
    if (this.lag) { setTimeout(() => this.handle(d), this.lag); return; }
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
      case 'pong': { const now = performance.now(), rtt = now - (+d.sent || now); if (rtt > 0 && rtt < 5000) this.rtt = this.rtt * 0.7 + rtt * 0.3; return; }
      case 'ready': {
        if (d.g !== 'rs') return;
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
  sendReady() { this.raw({ type: 'ready', g: 'rs', pv: PROTOCOL, ini: this.me.ini }); }
  sendStart(cfg) { this.raw({ type: 'start', mode: 'coop', cfg }); }

  bind(W) {
    this.W = W; this.inbox = []; this.events = []; this.shotQ = []; this.claimQ = []; this.outShots = []; this.sent = new WeakSet(); this.remote = null;
    W.net = this.host ? 'host' : 'guest';
    if (this.host) W.players[1].remote = true; else W.players[0].remote = true;
  }

  // -------------------------------- host
  onInput(d) {
    this.stat.inputs++;
    if (Array.isArray(d.s)) this.remote = { s: d.s, at: performance.now(), hr: +d.hr || 0 };
    for (const b of d.f || []) this.shotQ.push(b);
    for (const c of d.c || []) this.claimQ.push(c);
  }
  hostTick(W) {
    const g = W.players[1];
    if (!g) return;
    g.input = { mx: 0, dx: 0, fire: false, purge: false, hop: false };
    if (this.remote && g.alive) {
      const q = this.remote.s;
      const tgt = clamp(Math.round(+(q[4] ?? q[1]) || 0), 0, W.nl - 1);
      let pos = clamp(+q[0] || 0, 0, W.nl);
      // the report is one trip old: carry it on toward the lane the guest is gliding to
      const lead = clamp(((this.rtt + (this.remote.hr || this.rtt)) / 4) / 1000 + (performance.now() - this.remote.at) / 1000, 0, 0.15);
      const dist = laneDist(W, pos, tgt), stp = F.glide * lead;
      pos += clamp(dist, -stp, stp);
      if (W.closed) pos = ((pos % W.nl) + W.nl) % W.nl; else pos = clamp(pos, 0, W.nl - 1);
      g.pos = pos; g.aim = g.tgt = tgt; g.lane = laneOf(W, pos); g.tilt = +q[2] || 0;
    }
    for (const b of this.shotQ) {
      if (!g.alive || W.over) break;
      W.shots.push({ id: W.nextId++, pid: 2, lane: clamp(b[0] | 0, 0, W.nl - 1), d: clamp(+b[1] || 0, 0, 1), v: F.shotV * (1 + 0.18 * (W.up.barrel || 0)), dmg: (1 + 0.25 * (W.up.barrel || 0)) * (g.pw.twin ? 2 : 1), pierce: (W.up.barrel || 0) >= 2 ? 1 : 0, twin: g.pw.twin ? 1 : 0 });
      W.stats.shots++; this.stat.shots++;
    }
    this.shotQ = [];
    for (const c of this.claimQ) {
      if (!g.alive) continue;
      this.stat.claims++;
      if (c.purge && W.phase !== 'intro') { if (g.purges > 0) { g.purges--; purge(W, g, true); } else if (g.partials > 0) { g.partials--; purge(W, g, false); } }
      if (c.hop && g.hops > 0 && g.hop <= 0) { g.hops--; g.hop = F.hopT; W.ev.push({ k: 'hop', pid: 2, lane: g.lane }); }
    }
    this.claimQ = [];
  }
  hostEvents(list) {
    for (const e of list) {
      if (e.pid === 2 && e.k === 'kill') this.stat.kills2++;
      if (e.pid === 2 && e.k === 'death') this.stat.deaths2++;
      if (!QUIET.has(e.k)) this.events.push(e);
    }
  }
  hostFrame(W, dt) {
    this.sendT -= dt;
    // the snapshot that ends the run goes out at once: after it the host's loop stops
    if ((this.sendT > 0 && !W.over) || !this.peer || this.overSent === W) return;
    if (W.over) this.overSent = W;
    this.sendT = 1 / 20;
    const n = this.raw({ type: 'snapshot', s: packWorld(W), ev: this.events.splice(0, 80), hr: Math.round(this.rtt) });
    this.stat.snaps++; this.stat.bytes += n; this.stat.maxBytes = Math.max(this.stat.maxBytes, n);
  }

  // -------------------------------- guest
  guestFrame(W, dt) {
    const me = W.players[1];
    if (!me) return;
    for (const s of W.shots) {
      if (s.pid !== 2 || this.sent.has(s)) continue;
      this.sent.add(s);
      this.outShots.push([s.lane, r3(s.d)]);
    }
    const I = me.input || {};
    const claims = [];
    if (I.purge && !this.purgeHeld) claims.push({ purge: 1 });
    if (I.hop && !this.hopHeld) claims.push({ hop: 1 });
    this.purgeHeld = !!I.purge; this.hopHeld = !!I.hop;
    this.sendT -= dt;
    if (!claims.length && !this.outShots.length && this.sendT > 0) return;
    this.sendT = 1 / 30;
    this.raw({ type: 'input', s: [r3(me.pos), me.lane, r2(me.tilt), me.alive ? 1 : 0, me.tgt], f: this.outShots, c: claims, hr: Math.round(this.rtt) });
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
    return ev;
  }
  get stale() { return this.lastRecv && performance.now() - this.lastRecv > 4000; }
}
