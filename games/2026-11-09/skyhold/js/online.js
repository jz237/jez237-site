// Online 2-player co-op over the site's duel relay (the Steel Duel room server, rooms SH-XXXX and SH-Q-XXXXX for
// quick match). The first player in a room is p1 = the host: it runs the real world (machines, settlers, the
// carrier, lives, score) and streams snapshots 20 times a second. The guest flies its own gunship locally (so it never
// lags), judges the hits it takes, and reports its ship, its beams, novas, catches, landings and pickups as claims;
// the host carries those out so every kill is decided in one place.
import { netDeath, netShield, netCatch, netLand, netPod, netFire, netRam, netNovaAt, netAdopt } from './sim.js?v=3';
import { PW_KEYS } from './config.js?v=3';

export const PROTOCOL = 1;
const RELAY = 'wss://steel-duel-online.jez237.workers.dev';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const QUICK = 'SH-Q-';
export const ROOM = 'SH-';
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
const TYPES = ['lifter', 'husk', 'sower', 'mine', 'hive', 'stinger', 'prowler'];
const EST = ['roam', 'seek', 'down', 'grab', 'lift', 'hunt'];
const SST = ['walk', 'fall', 'held', 'carried', 'dead'];
const PH = ['intro', 'fight', 'break', 'boss', 'clear'];
const BST = ['warp', 'fight', 'dying', 'gone'];
const ATK = ['volley', 'drop', 'rush', 'sweep', 'mines'];
const packPw = (pw) => Object.entries(pw || {}).map(([k, t]) => [PW_KEYS.indexOf(k), Math.round(t * 10) / 10]);
const unpackPw = (a) => { const o = {}; for (const [i, t] of a || []) o[PW_KEYS[i]] = t; return o; };
// events the guest does not need from the host (it makes its own beams, or they are invisible)
const QUIET = new Set(['turn', 'level']);

// ------------------------------------------------------------------ snapshots
export function packWorld(W) {
  const h = W.players[0], g = W.players[1], B = W.boss;
  return {
    wt: r3(W.t), ph: PH.indexOf(W.phase), pt: r2(W.phaseT), lv: W.lives, sc: W.score, k: W.k, wv: W.wave, ov: W.over ? 1 : 0, rs: W.result, st: r2(W.secT), ft: r2(W.fightT), wn: W.waveN, lvl: r3(W.level || 0), fa: W.fallen ? 1 : 0,
    si: W.n % 60 === 0 ? W.sites.map(r2) : null, pl: W.plan ? W.plan.left : 0,
    en: W.enemies.filter((e) => e.hp > 0).map((e) => [e.id, TYPES.indexOf(e.type), r2(e.x), r2(e.y), r2(e.vx), r2(e.vy), e.hp, r2(e.born), EST.indexOf(e.st), r2(e.tell), e.carry, e.face, r2(e.hitT), e.tgt, r2(e.t)]),
    se: W.settlers.map((s) => [s.id, SST.indexOf(s.st), r2(s.x), r2(s.y), s.by, r2(s.dropY), r2(s.vx), r2(s.mark)]),
    bo: W.bolts.map((b) => [b.id, r2(b.x), r2(b.y), r2(b.vx), r2(b.vy), r2(b.t), b.from]),
    pd: W.pods.map((q) => [q.id, PW_KEYS.indexOf(q.kind), r2(q.x), r2(q.y), r2(q.t)]),
    b: B ? [B.key, r2(B.x), r2(B.y), r2(B.vx), r2(B.vy), B.face, BST.indexOf(B.st), r2(B.stT), B.nodes.map((n) => [n.hp, n.max]), r2(B.hitT), B.atk ? [ATK.indexOf(B.atk.kind), r2(B.atk.t), r2(B.atk.T), B.atk.dir, r2(B.atk.y)] : null, r2(B.sweepX), r2(B.t), B.rage ? 1 : 0] : null,
    p1: [r3(h.x), r3(h.y), r2(h.vx), r2(h.vy), h.face, h.alive ? 1 : 0, r2(h.inv), h.shield, h.nova, r2(h.thrust), h.carry, r2(h.hurtT)],
    p2: g ? [g.alive ? 1 : 0, r2(g.x), r2(g.y), r2(g.inv), g.shield, g.nova] : null,
    hs: W.shots.filter((s) => s.pid === 1 && !s.done).map((s) => [r2(s.x0), r2(s.y), s.dir, r3(s.t), s.hitD === undefined ? -1 : r2(s.hitD)]),
    pw1: packPw(h.pw), pw2: g ? packPw(g.pw) : null, ch: [W.chain, r2(Math.min(9, W.t - W.chainT)), W.bestChain],
    sx: [W.stats.caught, W.stats.landed, W.stats.lost, W.stats.lifters, W.stats.husks, W.stats.kills, W.stats.novas, W.stats.deaths],
  };
}

export function applyWorld(W, S, lead) {
  const ext = (x, vx) => x + vx * lead;
  W.t = S.wt + lead; W.phase = PH[S.ph]; W.phaseT = S.pt; W.lives = S.lv; W.score = S.sc; W.over = !!S.ov; W.result = S.rs; W.secT = S.st; W.fightT = S.ft; W.waveN = S.wn; W.fallen = !!S.fa;
  netAdopt(W, S.wv, S.k, S.lvl, S.si);
  W.plan = { left: S.pl, extra: [], groupT: 0, prowlT: 0 };
  const old = new Map(W.enemies.map((e) => [e.id, e]));
  W.enemies = S.en.map((q) => Object.assign(old.get(q[0]) || {}, { id: q[0], type: TYPES[q[1]], x: ext(q[2], q[4]), y: ext(q[3], q[5]), vx: q[4], vy: q[5], hp: q[6], born: q[7], st: EST[q[8]] || 'hunt', tell: q[9], carry: q[10], face: q[11], hitT: q[12], tgt: q[13], t: q[14], remote: true }));
  const me = W.players[1];
  const oldS = new Map(W.settlers.map((s) => [s.id, s]));
  W.settlers = S.se.map((q) => {
    const s = Object.assign(oldS.get(q[0]) || { t: 0, home: q[2] }, { id: q[0], st: SST[q[1]], x: q[2], y: q[3], by: q[4], dropY: q[5], vx: q[6], mark: q[7] });
    // a settler I caught stays with me until the host confirms it
    if (me && me.carry === s.id && s.st === 'fall') { s.st = 'carried'; s.by = me.id; }
    return s;
  });
  W.bolts = S.bo.map((q) => ({ id: q[0], x: ext(q[1], q[3]), y: ext(q[2], q[4]), vx: q[3], vy: q[4], t: q[5] + lead, from: q[6] }));
  W.pods = S.pd.map((q) => ({ id: q[0], kind: PW_KEYS[q[1]], x: q[2], y: q[3], t: q[4] }));
  if (S.b) {
    const q = S.b;
    const B = W.boss && W.boss.key === q[0] ? W.boss : { t: 0 };
    Object.assign(B, { key: q[0], x: ext(q[1], q[3]), y: ext(q[2], q[4]), vx: q[3], vy: q[4], face: q[5], st: BST[q[6]], stT: q[7], nodes: q[8].map(([hp, max]) => ({ hp, max })), hitT: q[9],
      atk: q[10] ? { kind: ATK[q[10][0]], t: q[10][1], T: q[10][2], dir: q[10][3], y: q[10][4], n: 1 } : null, sweepX: q[11], t: q[12], rage: q[13] || 0 });
    W.boss = B;
  } else W.boss = null;
  const h = W.players[0], p = S.p1;
  h.remote = true;
  h.x = p[0] + p[2] * lead; h.y = p[1] + p[3] * lead; h.vx = p[2]; h.vy = p[3]; h.face = p[4]; h.alive = !!p[5]; h.inv = p[6]; h.shield = p[7]; h.nova = p[8]; h.thrust = p[9]; h.carry = p[10]; h.hurtT = p[11];
  h.pw = unpackPw(S.pw1);
  const m = S.p2;
  if (me && m) {
    if (m[0] && !me.alive) { // the host brought me back
      me.alive = true; me.x = m[1]; me.y = m[2]; me.vx = me.vy = 0; me.inv = m[3]; me.deadT = 0; me.carry = 0;
      W.ev.push({ k: 'spawn', pid: 2, x: me.x, y: me.y });
    }
    me.nova = m[5];
    if (m[4] > me.shield) me.shield = m[4];
    const pw = unpackPw(S.pw2);
    for (const k in pw) if (!me.pw[k] || pw[k] > me.pw[k] + 0.5) me.pw[k] = pw[k];
  }
  W.shots = W.shots.filter((s) => s.pid !== 1).concat(S.hs.map((q) => ({ id: 0, pid: 1, x0: q[0], y: q[1], dir: q[2], t: q[3] + lead, hitD: q[4] < 0 ? undefined : q[4], done: false })));
  if (S.ch) { W.chain = S.ch[0]; W.chainT = W.t - S.ch[1]; W.bestChain = S.ch[2]; }
  [W.stats.caught, W.stats.landed, W.stats.lost, W.stats.lifters, W.stats.husks, W.stats.kills, W.stats.novas, W.stats.deaths] = S.sx;
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
    this.events = []; this.remote = null; this.claimQ = [];
    this.stat = { snaps: 0, inputs: 0, shots: 0, deaths: 0, catches: 0 };
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
        if (d.g !== 'sh') return;
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
  sendReady() { this.raw({ type: 'ready', g: 'sh', pv: PROTOCOL, ini: this.me.ini }); }
  sendStart(cfg) { this.raw({ type: 'start', cfg }); }

  bind(W) {
    this.W = W; this.inbox = []; this.events = []; this.claimQ = []; this.remote = null;
    W.net = this.host ? 'host' : 'guest';
    if (this.host) W.players[1].remote = true; else W.players[0].remote = true;
  }

  // -------------------------------- host
  onInput(d) {
    this.stat.inputs++;
    if (Array.isArray(d.s)) this.remote = { s: d.s, at: performance.now() };
    for (const c of d.c || []) this.claimQ.push(c);
  }
  hostTick(W) {
    const g = W.players[1];
    if (!g) return;
    const lag = clamp(this.rtt / 2000, 0, 0.25);
    if (this.remote && g.alive && this.remote.s[5]) {
      const q = this.remote.s, age = Math.min(0.3, lag + (performance.now() - this.remote.at) / 1000);
      g.vx = +q[2] || 0; g.vy = +q[3] || 0; g.x = (+q[0] || 0) + g.vx * age; g.y = (+q[1] || 0) + g.vy * age; g.face = q[4] < 0 ? -1 : 1; g.thrust = +q[6] || 0; g.carry = q[7] | 0;
    }
    for (const c of this.claimQ) {
      if (W.over) break;
      if (c.fire && g.alive) { netFire(W, g, +c.fire[0], +c.fire[1], c.fire[2] < 0 ? -1 : 1, !!c.fire[3]); this.stat.shots++; }
      if (c.died) { netDeath(W, g, String(c.died)); this.stat.deaths++; }
      if (c.shield !== undefined) netShield(W, g, c.shield | 0);
      if (c.nova && g.alive) netNovaAt(W, g, +c.nova[0], +c.nova[1]);
      if (c.catch) { g.carry = 0; netCatch(W, g, c.catch | 0); this.stat.catches++; }
      if (c.land) { g.carry = c.land | 0; netLand(W, g); }
      if (c.pod) netPod(W, c.pod | 0, g);
      if (c.ram) netRam(W, g, c.ram | 0);
    }
    this.claimQ = [];
  }
  hostEvents(list) { for (const e of list) if (!QUIET.has(e.k) && !(e.pid === 2 && (e.k === 'fire' || e.k === 'remotehit'))) this.events.push(e); }
  hostFrame(W, dt) {
    this.sendT -= dt;
    if (this.sendT > 0 || !this.peer) return;
    this.sendT = 1 / 20;
    this.raw({ type: 'snapshot', s: packWorld(W), ev: this.events.splice(0, 120), hr: Math.round(this.rtt) });
    this.stat.snaps++;
  }

  // -------------------------------- guest
  guestFrame(W, dt) {
    const me = W.players[1];
    const claims = W.claims.splice(0);
    this.sendT -= dt;
    if (!claims.length && this.sendT > 0) return;
    this.sendT = 1 / 30;
    if (!me) return;
    this.raw({ type: 'input', s: [r3(me.x), r3(me.y), r2(me.vx), r2(me.vy), me.face, me.alive ? 1 : 0, r2(me.thrust || 0), me.carry || 0], c: claims });
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
    // my own hits, deaths, catches, landings, novas and pickups already played here
    return ev.filter((e) => !(e.pid === 2 && ['shield', 'death', 'spawn', 'pickup', 'catch', 'land', 'nova', 'fire', 'blink', 'blinkin'].includes(e.k)));
  }
  get stale() { return this.lastRecv && performance.now() - this.lastRecv > 4000; }
}
