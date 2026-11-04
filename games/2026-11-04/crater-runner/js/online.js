// Online 2-player co-op over the site's duel relay (the Steel Duel room server, rooms CR-XXXX and
// CR-Q-XXXXX for quick match). The first player in a room is p1 = the host: it runs the real course
// (threats, enemies, bosses, checkpoints, lives, score) and streams snapshots. The guest drives its
// own rover locally (so jumping never lags), judges its own crashes, and reports its rover and its
// shots; the host re-creates those shots so kills are decided in one place.
import { STEP } from './sim.js?v=2';
import { adoptSegment, groundH } from './sim.js?v=2';

export const PROTOCOL = 1;
const RELAY = 'wss://steel-duel-online.jez237.workers.dev';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const QUICK = 'CR-Q-';
export const ROOM = 'CR-';
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
const QUIET = new Set(['warn', 'jump', 'land', 'fire', 'puff']);

// ------------------------------------------------------------------ snapshots
export function packWorld(W) {
  const h = W.rovers[0], g = W.rovers[1];
  const b = W.boss;
  return {
    wt: r3(W.t), sg: W.seg, cx: W.cpX.map(r2), sp: r3(W.speed), lv: W.lives, sc: W.score, ov: W.over ? 1 : 0, rs: W.result, ct: r2(W.clearT), sf: r2(W.safeT), bd: W.bossDone ? 1 : 0,
    cr: W.craters.map((c) => [c.id, r2(c.x), r3(c.r), r2(c.d), r2(c.rim), c.kill ? 1 : 0, r2(c.grow), c.bomb ? 1 : 0, r2(c.w)]),
    ro: W.rocks.map((r) => [r.id, r.kind === 'wall' ? 1 : 0, r2(r.x), r.r, r.hw, r.top, r.hp, r.seed, r.vx, r.big ? 1 : 0]),
    mi: W.mines.map((m) => [m.id, r2(m.x)]),
    ta: W.tanks.map((t) => [t.id, r2(t.x), t.hp, r2(t.recoil), t.vx]),
    sh: W.shells.map((s) => [s.id, r2(s.x), r2(s.y), s.vx, s.big ? 1 : 0]),
    fl: W.flyers.map((f) => [f.id, r2(f.x), r2(f.y), r2(f.vx)]),
    bo: W.bombs.map((q) => [q.id, r2(q.x), r2(q.y), r2(q.vx), r2(q.vy), r3(q.g), r2(q.tx), r2(q.T), r2(q.t), q.mortar ? 1 : 0]),
    dr: W.drones.map((d) => [d.id, r2(d.x), r2(d.y), r2(d.vx), r2(d.vy)]),
    hs: W.shots.filter((s) => s.rid === 1).map((s) => [s.kind === 'up' ? 1 : 0, r2(s.x), r2(s.y), r2(s.vx), r2(s.vy), r2(s.life), s.id]),
    b: b ? { key: b.key, kind: b.kind, hp: b.hp, max: b.max, x: r2(b.x), y: r2(b.y), gy: r2(b.gy || 0), state: b.state, phase: b.phase, hitT: r2(b.hitT), t: r2(b.t) } : null,
    r1: [r3(h.x), r3(h.y), r3(h.vx), r3(h.vy), r3(h.p), h.air ? 1 : 0, h.alive ? 1 : 0, r2(h.inv), h.shield],
    r2: g ? [g.alive ? 1 : 0, r3(g.x), r2(g.inv), g.shield] : null,
    up: W.up, st: [W.stats.air, W.stats.airKills, W.stats.deaths],
  };
}

export function applyWorld(W, S, lead) {
  const ext = (x, vx) => x + vx * lead;
  W.t = S.wt + lead; W.speed = S.sp; W.lives = S.lv; W.score = S.sc; W.over = !!S.ov; W.result = S.rs; W.clearT = S.ct; W.safeT = S.sf; W.bossDone = !!S.bd;
  W.cpX = S.cx; adoptSegment(W, S.sg);
  W.up = S.up;
  W.craters = S.cr.map((q) => ({ id: q[0], x: q[1], r: q[2], d: q[3], rim: q[4], kill: !!q[5], grow: q[6], bomb: !!q[7], w: q[8], sig: true, sigT: W.t }));
  W.rocks = S.ro.map((q) => ({ id: q[0], kind: q[1] ? 'wall' : 'boulder', x: ext(q[2], q[8]), r: q[3], hw: q[4], top: q[5], hp: q[6], seed: q[7], vx: q[8], big: !!q[9], sig: true, sigT: W.t }));
  W.mines = S.mi.map((q) => ({ id: q[0], x: q[1], sig: true, sigT: W.t }));
  W.tanks = S.ta.map((q) => ({ id: q[0], x: ext(q[1], q[4]), hp: q[2], recoil: q[3], vx: q[4], fireT: 9, sig: true, sigT: W.t }));
  W.shells = S.sh.map((q) => ({ id: q[0], x: ext(q[1], q[3]), y: q[2], vx: q[3], vy: 0, big: !!q[4], life: 3, sig: true, sigT: W.t }));
  W.flyers = S.fl.map((q) => ({ id: q[0], x: ext(q[1], q[3]), y: q[2], vx: q[3], rel: 0, ph: 0, life: 9, fireT: 9, hp: 1, out: false, sig: true, sigT: W.t, remote: true }));
  W.bombs = S.bo.map((q) => { const t = q[8] + lead; return { id: q[0], x: ext(q[1], q[3]), y: q[2] + q[4] * lead - 0.5 * q[5] * lead * lead, vx: q[3], vy: q[4] - q[5] * lead, g: q[5], tx: q[6], T: q[7], t, mortar: !!q[9], crater: true, sig: true, sigT: W.t }; });
  W.drones = S.dr.map((q) => ({ id: q[0], x: ext(q[1], q[3]), y: q[2] + q[4] * lead, vx: q[3], vy: q[4], hp: 1, life: 9, sig: true, sigT: W.t }));
  // the host's shots (mine stay local as ghosts)
  W.shots = W.shots.filter((s) => s.rid !== 1).concat(S.hs.map((q) => ({ id: 'h' + q[6], rid: 1, kind: q[0] ? 'up' : 'fwd', x: q[1] + q[3] * lead, y: q[2] + q[4] * lead, vx: q[3], vy: q[4], life: q[5] - lead, ghost: true })));
  if (S.b) { W.boss = Object.assign(W.boss && W.boss.key === S.b.key ? W.boss : {}, S.b); } else W.boss = null;
  const h = W.rovers[0], q = S.r1;
  h.remote = true;
  h.x = q[0] + q[2] * lead; h.y = q[1] + q[3] * lead; h.vx = q[2]; h.vy = q[3]; h.p = q[4]; h.air = !!q[5]; h.alive = !!q[6]; h.inv = q[7]; h.shield = q[8];
  const me = W.rovers[1], m = S.r2;
  if (me && m) {
    if (m[0] && !me.alive) { // the host brought me back
      me.alive = true; me.x = m[1]; me.y = groundH(W, m[1]) + 0.6; me.vy = 0; me.air = true; me.inv = m[2]; me.deadT = 0; me.vx = W.speed;
      W.ev.push({ k: 'spawn', rid: 2, x: me.x });
    }
    me.shield = Math.min(me.shield, m[3]) || m[3];
  }
  W.stats.air = S.st[0]; W.stats.airKills = S.st[1]; W.stats.deaths = S.st[2];
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
    this.role = null; this.side = 0; this.room = null; this.intent = null; this.peer = null; this.peers = [];
    this.rtt = 150; this.offset = null; this.W = null; this.inbox = []; this.sendT = 0; this.lastRecv = 0;
    this.events = []; this.remote = null; this.shotQ = []; this.claimQ = []; this.outShots = []; this.sent = new Set();
    this.stat = { snaps: 0, inputs: 0, shots: 0, deaths: 0 };
    clearInterval(this.pingT); clearInterval(this.helloT); clearInterval(this.pollT);
  }
  get open() { return this.ws && this.ws.readyState === 1; }
  get http() { return this.relay.replace(/^ws/, 'http'); }
  get host() { return this.role === 'p1'; }

  async rooms() { const r = await fetch(this.http + '/rooms', { cache: 'no-store' }); const d = await r.json(); return Array.isArray(d.rooms) ? d.rooms : []; }
  async quick(me) {
    this.h.status('Looking for a co-driver…', 'wait');
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
      this.raw({ type: 'hello', name: me.ini || 'DRIVER' });
      this.ping();
      this.pingT = setInterval(() => this.ping(), 2000);
      this.helloT = setInterval(() => { if (!this.peer) this.raw({ type: 'hello', name: me.ini || 'DRIVER' }); }, 50000);
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
  get serverNow() { return this.offset === null ? null : performance.now() + this.offset; }
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
        this.h.status(d.role === 'p1' ? 'waiting' : 'Connecting to your co-driver…', d.role === 'p1' ? 'wait' : 'info');
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
        if (rtt > 0 && rtt < 5000) {
          this.rtt = this.rtt * 0.7 + rtt * 0.3;
          const off = (+d.t || 0) - (d.sent + rtt / 2);
          if (this.offset === null || rtt < (this.bestRtt || 1e9) * 1.25) { this.offset = this.offset === null ? off : this.offset * 0.6 + off * 0.4; this.bestRtt = Math.min(this.bestRtt || 1e9, rtt); }
        }
        return;
      }
      case 'ready': {
        if (d.g !== 'cr') return;
        if (d.pv !== PROTOCOL) { this.h.status('Your co-driver is on a different version: refresh both pages', 'error'); return; }
        const first = !this.peer;
        this.peer = { ini: String(d.ini || '').replace(/[^A-Z0-9]/gi, '').slice(0, 4), again: !!d.again };
        if (first) { clearInterval(this.pollT); this.h.joined(this.peer); } else if (d.again) this.h.chat({ k: 'again' });
        return;
      }
      case 'start': if (this.role === 'p2') this.h.start(d.cfg || {}); return;
      case 'snapshot': if (this.role === 'p2') this.inbox.push(d); return;
      case 'input': if (this.role === 'p1') this.onInput(d); return;
      case 'chat': if (d.k === 'bye') { this.peer = null; this.h.left('left'); return; } this.h.chat(d); return;
    }
  }
  sendReady(again = false) { this.raw({ type: 'ready', g: 'cr', pv: PROTOCOL, ini: this.me.ini, again }); }
  sendStart(cfg) { this.raw({ type: 'start', cfg }); }
  chat(msg) { this.raw({ type: 'chat', ...msg }); }

  bind(W) {
    this.W = W; this.inbox = []; this.events = []; this.shotQ = []; this.claimQ = []; this.outShots = []; this.sent = new Set(); this.remote = null;
    W.net = this.host ? 'host' : 'guest';
    if (this.host) W.rovers[1].remote = true; else W.rovers[0].remote = true;
  }

  // -------------------------------- host
  onInput(d) {
    this.stat.inputs++;
    if (Array.isArray(d.s)) this.remote = { s: d.s, at: performance.now() };
    for (const b of d.f || []) this.shotQ.push(b);
    for (const c of d.c || []) this.claimQ.push(c);
  }
  hostTick(W) {
    const g = W.rovers[1];
    if (!g) return;
    const lag = clamp(this.rtt / 2000, 0, 0.25);
    if (this.remote && g.alive && this.remote.s[6]) {
      const q = this.remote.s, age = Math.min(0.3, lag + (performance.now() - this.remote.at) / 1000);
      g.vx = +q[2] || 0; g.x = (+q[0] || 0) + g.vx * age; g.y = +q[1] || 0; g.vy = +q[3] || 0; g.p = +q[4] || 0; g.air = !!q[5];
    }
    for (const b of this.shotQ) {
      if (!g.alive || W.over) break;
      const age = clamp(lag + (+b.a || 0), 0, 0.3);
      W.shots.push({ id: W.nextId++, rid: 2, kind: b.k === 1 ? 'up' : 'fwd', x: +b.x + b.vx * age, y: +b.y + b.vy * age, vx: +b.vx, vy: +b.vy, life: clamp(+b.l || 0.8, 0.1, 1.2) - age });
      this.stat.shots++;
    }
    this.shotQ = [];
    for (const c of this.claimQ) {
      if (c.dead && g.alive) {
        g.alive = false; g.deadT = 0; W.lives = Math.max(0, W.lives - 1); W.stats.deaths++; W.lastDeathN = W.n;
        W.ev.push({ k: 'crash', rid: 2, x: g.x, y: g.y + 0.8, cause: c.cause || 'crash', vx: g.vx, remote: 1 });
        this.stat.deaths++;
      }
      if (c.shield !== undefined) g.shield = c.shield | 0;
    }
    this.claimQ = [];
  }
  hostEvents(list) { for (const e of list) if (!QUIET.has(e.k) && !(e.rid === 2 && e.k === 'crash' && e.remote)) this.events.push(e); }
  hostFrame(W, dt) {
    this.sendT -= dt;
    if (this.sendT > 0 || !this.peer) return;
    this.sendT = 1 / 20;
    this.raw({ type: 'snapshot', s: packWorld(W), ev: this.events.splice(0, 60), hr: Math.round(this.rtt) });
    this.stat.snaps++;
  }

  // -------------------------------- guest
  guestFrame(W, dt) {
    const me = W.rovers[1];
    for (const s of W.shots) {
      if (s.rid !== 2 || this.sent.has(s.id)) continue;
      this.sent.add(s.id);
      s.ghost = true;
      this.outShots.push({ k: s.kind === 'up' ? 1 : 0, x: r2(s.x), y: r2(s.y), vx: r2(s.vx), vy: r2(s.vy), l: r2(s.life), a: 0 });
    }
    if (this.sent.size > 400) this.sent = new Set([...this.sent].slice(-200));
    const claims = W.claims.splice(0);
    this.sendT -= dt;
    if (!claims.length && !this.outShots.length && this.sendT > 0) return;
    this.sendT = 1 / 30;
    if (!me) return;
    this.raw({ type: 'input', s: [r3(me.x), r3(me.y), r3(me.vx), r3(me.vy), r3(me.p), me.air ? 1 : 0, me.alive ? 1 : 0], f: this.outShots, c: claims });
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
    // my own crash already played here
    return ev.filter((e) => !(e.rid === 2 && (e.k === 'crash' || e.k === 'shield' || e.k === 'spawn')));
  }
  get stale() { return this.lastRecv && performance.now() - this.lastRecv > 4000; }
}
void STEP;
