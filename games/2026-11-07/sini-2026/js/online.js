// Online 2-player co-op over the site's duel relay (the Steel Duel room server, rooms SN-XXXX and SN-Q-XXXXX
// for quick match). The first player in a room is p1 = the host: it runs the real field (rocks, crystals,
// machines, the construct, lives, score) and streams snapshots. The guest flies its own ship locally (so
// steering never lags), judges the hits it takes, and reports its ship, its shots, the crystals and pods it
// scoops and the charges it launches; the host carries those out so every kill is decided in one place.
import { netCollect, netBomb, netPod, netDeath, adoptCp } from './sim.js?v=3';
import { PW_KEYS } from './config.js?v=3';
const packPw = (pw) => Object.entries(pw || {}).map(([k, t]) => [PW_KEYS.indexOf(k), Math.round(t * 10) / 10]);
const unpackPw = (a) => { const o = {}; for (const [i, t] of a || []) o[PW_KEYS[i]] = t; return o; };

export const PROTOCOL = 1;
const RELAY = 'wss://steel-duel-online.jez237.workers.dev';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const QUICK = 'SN-Q-';
export const ROOM = 'SN-';
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
const TYPES = ['gath', 'reaver'];
const R_OF = { gath: 0.95, reaver: 1.25 };
const ST = ['build', 'wake', 'hunt', 'tell', 'pull', 'ltell', 'lunge', 'digest', 'dying', 'gone'];
// events the guest already played itself (or that do not matter on the far side)
const QUIET = new Set(['fire', 'hitrock', 'plink']);

// ------------------------------------------------------------------ snapshots
export function packWorld(W) {
  const h = W.players[0], g = W.players[1], C = W.C;
  return {
    wt: r3(W.t), ph: W.phase, pt: r2(W.phaseT), lv: W.lives, sc: W.score, k: W.k, cp: W.cp, ov: W.over ? 1 : 0, rs: W.result, st: r2(W.secT), ft: r2(W.fightT), wn: W.waveN, lvl: r3(W.level || 0),
    ro: W.rocks.map((q) => [q.id, r2(q.x), r2(q.z), r3(q.vx), r3(q.vz), r2(q.r), q.ore, r3(q.rot), r3(q.spin), r3(q.tilt), q.shape, r2(q.hitT)]),
    cr: W.crystals.map((c) => [c.id, r2(c.x), r2(c.z), r2(c.vx), r2(c.vz), r2(c.life), c.held]),
    en: W.enemies.filter((e) => e.hp > 0).map((e) => [e.id, TYPES.indexOf(e.type), r2(e.x), r2(e.z), r2(e.vx), r2(e.vz), r3(e.a), e.hp, r2(e.born), r2(e.tell), r3(e.aimA), e.carry, r2(e.hitT), e.tgt]),
    bo: W.bolts.map((b) => [b.id, r2(b.x), r2(b.z), r2(b.vx), r2(b.vz), b.r, b.ab ? 1 : 0, r2(b.life)]),
    bm: W.bombs.map((b) => [b.id, r2(b.x), r2(b.z), r3(b.a), r2(b.sp), r2(b.life), b.pid]),
    pd: W.pods.map((q) => [q.id, PW_KEYS.indexOf(q.kind), r2(q.x), r2(q.z), r2(q.life), r2(q.t)]),
    be: W.beams.map((b) => [b.eid, b.rid, r2(b.t)]),
    c: C ? [C.key, r2(C.x), r2(C.z), r2(C.vx), r2(C.vz), r3(C.a), C.N, C.pieces, ST.indexOf(C.st), r2(C.stT), C.hp, C.max, C.R, C.hitR, r2(C.iris), r3(C.lx), r3(C.lz), r3(C.wakeFrac ?? 1), C.cyc === 'open' ? 1 : 0, r2(C.cycT || 0)] : null,
    p1: [r3(h.x), r3(h.z), r2(h.vx), r2(h.vz), r3(h.a), h.alive ? 1 : 0, r2(h.inv), h.shield, h.bombs, r2(h.thrust)],
    p2: g ? [g.alive ? 1 : 0, r2(g.x), r2(g.z), r2(g.inv), g.shield, g.bombs] : null,
    hs: W.shots.filter((s) => s.pid === 1).map((s) => [r2(s.x), r2(s.z), r2(s.vx), r2(s.vz), r2(s.life)]),
    pw1: packPw(h.pw), pw2: g ? packPw(g.pw) : null,
    sx: [W.stats.crystals, W.stats.bombs, W.stats.bombHits, W.stats.gath, W.stats.reav, W.stats.deaths],
  };
}

export function applyWorld(W, S, lead) {
  const ext = (x, vx) => x + vx * lead;
  W.t = S.wt + lead; W.phase = S.ph; W.phaseT = S.pt; W.lives = S.lv; W.score = S.sc; W.over = !!S.ov; W.result = S.rs; W.secT = S.st; W.fightT = S.ft; W.waveN = S.wn;
  W.level = S.lvl;
  adoptCp(W, S.cp, S.k, S.lvl);
  W.rocks = S.ro.map((q) => ({ id: q[0], x: ext(q[1], q[3]), z: ext(q[2], q[4]), vx: q[3], vz: q[4], r: q[5], ore: q[6], rot: q[7] + q[8] * lead, spin: q[8], tilt: q[9], shape: q[10], hitT: q[11], hits: 0 }));
  const oldC = new Map(W.crystals.map((c) => [c.id, c]));
  W.crystals = S.cr.filter((q) => !(oldC.get(q[0]) || {}).taken).map((q) => Object.assign(oldC.get(q[0]) || { spin: 0 }, { id: q[0], x: ext(q[1], q[3]), z: ext(q[2], q[4]), vx: q[3], vz: q[4], life: q[5], held: q[6], claim: 0 }));
  const old = new Map(W.enemies.map((e) => [e.id, e]));
  W.enemies = S.en.map((q) => Object.assign(old.get(q[0]) || { t: 0, orb: 0 }, { id: q[0], type: TYPES[q[1]], x: ext(q[2], q[4]), z: ext(q[3], q[5]), vx: q[4], vz: q[5], a: q[6], hp: q[7], max: q[7], born: q[8], tell: q[9], aimA: q[10], carry: q[11], hitT: q[12], tgt: q[13], r: R_OF[TYPES[q[1]]], remote: true }));
  W.bolts = S.bo.map((q) => ({ id: q[0], x: ext(q[1], q[3]), z: ext(q[2], q[4]), vx: q[3], vz: q[4], r: q[5], ab: q[6], life: q[7] - lead }));
  W.bombs = S.bm.map((q) => ({ id: q[0], x: ext(q[1], Math.cos(q[3]) * q[4]), z: ext(q[2], Math.sin(q[3]) * q[4]), a: q[3], sp: q[4], max: q[4], life: q[5] - lead, pid: q[6], tgt: 0, think: 9, ghost: true }));
  W.pods = S.pd.map((q) => ({ id: q[0], kind: PW_KEYS[q[1]], x: q[2], z: q[3], vx: 0, vz: 0, life: q[4] - lead, t: q[5] }));
  W.beams = S.be.map((q) => ({ eid: q[0], rid: q[1], t: q[2] }));
  if (S.c) {
    const q = S.c;
    const C = W.C && W.C.key === q[0] ? W.C : { t: 0, selfT: 9, pullCD: 9, lungeCD: 9, summonCD: 9, drift: 0, hitT: 0 };
    Object.assign(C, { key: q[0], x: ext(q[1], q[3]), z: ext(q[2], q[4]), vx: q[3], vz: q[4], a: q[5], N: q[6], pieces: q[7], st: ST[q[8]], stT: q[9], hp: q[10], max: q[11], R: q[12], hitR: q[13], iris: q[14], lx: q[15], lz: q[16], wakeFrac: q[17] ?? 1, cyc: q[18] ? 'open' : 'shut', cycT: q[19] || 0 });
    W.C = C;
  } else W.C = null;
  const h = W.players[0], p = S.p1;
  h.remote = true;
  h.x = p[0] + p[2] * lead; h.z = p[1] + p[3] * lead; h.vx = p[2]; h.vz = p[3]; h.a = p[4]; h.alive = !!p[5]; h.inv = p[6]; h.shield = p[7]; h.bombs = p[8]; h.thrust = p[9];
  h.pw = unpackPw(S.pw1);
  const me = W.players[1], m = S.p2;
  if (me && m) {
    if (m[0] && !me.alive) { // the host brought me back
      me.alive = true; me.x = m[1]; me.z = m[2]; me.vx = me.vz = 0; me.inv = m[3]; me.deadT = 0;
      W.ev.push({ k: 'spawn', pid: 2, x: me.x, z: me.z });
    }
    me.bombs = m[5];
    if (m[4] > me.shield) me.shield = m[4];
    const pw = unpackPw(S.pw2);
    for (const k in pw) if (!me.pw[k] || pw[k] > me.pw[k] + 0.5) me.pw[k] = pw[k];
  }
  W.shots = W.shots.filter((s) => s.pid !== 1).concat(S.hs.map((q) => ({ id: 0, pid: 1, x: q[0] + q[2] * lead, z: q[1] + q[3] * lead, vx: q[2], vz: q[3], life: q[4] - lead, ghost: true })));
  [W.stats.crystals, W.stats.bombs, W.stats.bombHits, W.stats.gath, W.stats.reav, W.stats.deaths] = S.sx;
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
    this.stat = { snaps: 0, inputs: 0, shots: 0, deaths: 0, bombs: 0, grabs: 0 };
    clearInterval(this.pingT); clearInterval(this.helloT); clearInterval(this.pollT);
  }
  get open() { return this.ws && this.ws.readyState === 1; }
  get http() { return this.relay.replace(/^ws/, 'http'); }
  get host() { return this.role === 'p1'; }

  async rooms() { const r = await fetch(this.http + '/rooms', { cache: 'no-store' }); const d = await r.json(); return Array.isArray(d.rooms) ? d.rooms : []; }
  async quick(me) {
    this.h.status('Looking for a wingmate…', 'wait');
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
      this.raw({ type: 'hello', name: me.ini || 'PILOT' });
      this.ping();
      this.pingT = setInterval(() => this.ping(), 2000);
      this.helloT = setInterval(() => { if (!this.peer) this.raw({ type: 'hello', name: me.ini || 'PILOT' }); }, 50000);
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
        this.h.status(d.role === 'p1' ? 'waiting' : 'Connecting to your wingmate…', d.role === 'p1' ? 'wait' : 'info');
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
        if (d.g !== 'sn') return;
        if (d.pv !== PROTOCOL) { this.h.status('Your wingmate is on a different version: refresh both pages', 'error'); return; }
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
  sendReady() { this.raw({ type: 'ready', g: 'sn', pv: PROTOCOL, ini: this.me.ini }); }
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
      g.vx = +q[2] || 0; g.vz = +q[3] || 0; g.x = (+q[0] || 0) + g.vx * age; g.z = (+q[1] || 0) + g.vz * age; g.a = +q[4] || 0; g.thrust = +q[6] || 0;
    }
    for (const b of this.shotQ) {
      if (!g.alive || W.over) break;
      const age = clamp(lag, 0, 0.3);
      W.shots.push({ id: W.nextId++, pid: 2, x: +b.x + b.vx * age, z: +b.z + b.vz * age, vx: +b.vx, vz: +b.vz, life: clamp(+b.l || 0.5, 0.05, 0.7) - age });
      this.stat.shots++;
    }
    this.shotQ = [];
    for (const c of this.claimQ) {
      if (c.died) { netDeath(W, g, c.cause); this.stat.deaths++; }
      if (c.shield !== undefined) g.shield = c.shield | 0;
      if (c.grab) { netCollect(W, c.grab | 0, g); this.stat.grabs++; }
      if (c.bomb) { netBomb(W, g, +c.bomb[0], +c.bomb[1], +c.bomb[2]); this.stat.bombs++; }
      if (c.pod) netPod(W, c.pod | 0, g);
    }
    this.claimQ = [];
  }
  hostEvents(list) { for (const e of list) if (!QUIET.has(e.k) && !(e.pid === 2 && (e.remote || e.k === 'collect'))) this.events.push(e); }
  hostFrame(W, dt) {
    this.sendT -= dt;
    if (this.sendT > 0 || !this.peer) return;
    this.sendT = 1 / 20;
    this.raw({ type: 'snapshot', s: packWorld(W), ev: this.events.splice(0, 100), hr: Math.round(this.rtt) });
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
    this.raw({ type: 'input', s: [r3(me.x), r3(me.z), r2(me.vx), r2(me.vz), r3(me.a), me.alive ? 1 : 0, r2(me.thrust || 0)], f: this.outShots, c: claims });
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
    // my own hits, deaths and pickups already played here
    return ev.filter((e) => !(e.pid === 2 && (e.k === 'shield' || e.k === 'death' || e.k === 'spawn' || e.k === 'pickup' || e.k === 'bomb')));
  }
  get stale() { return this.lastRecv && performance.now() - this.lastRecv > 4000; }
}
