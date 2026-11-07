// Online 2-player co-op over the site's duel relay (the Steel Duel room server, rooms LW-XXXX and
// LW-Q-XXXXX for quick match). The first player in a room is p1 = the host: it runs the real arena (waves,
// riders, cores, hazards, bosses, lives, score) and streams snapshots at ~20 Hz. The guest flies its own
// rider locally (so flapping never lags), reports it 30 times a second, judges the sea and the hazards it
// flies into, and plays the knockbacks the host decides. The relay overwrites the keys t, from, role and
// start.mode, so none of our messages use them.
import { adoptWave } from './sim.js?v=10';
import { F, PW_KEYS, ENEMY_KEYS } from './config.js?v=10';

export const PROTOCOL = 1;
const RELAY = 'wss://steel-duel-online.jez237.workers.dev';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const QUICK = 'LW-Q-';
export const ROOM = 'LW-';
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
const CST = ['fall', 'rest', 'form'];
const SHOTK = ['shard', 'blob', 'ice', 'orb'];
const QUIET = new Set(['flap', 'land']);
const wrap = (x) => { x %= F.C; return x < 0 ? x + F.C : x; };
const packPw = (pw) => Object.entries(pw || {}).map(([k, t]) => [PW_KEYS.indexOf(k), r2(t)]);
const unpackPw = (a) => { const o = {}; for (const [i, t] of a || []) o[PW_KEYS[i]] = t; return o; };

// ------------------------------------------------------------------ snapshots
export function packWorld(W) {
  const h = W.players[0], g = W.players[1], B = W.boss, Hn = W.hunter;
  return {
    wt: r3(W.t), ph: W.phase, pt: r2(W.phaseT), wv: W.wave, wn: W.waveN, kd: W.kind, wT: r2(W.waveT), ft: r2(W.fightT), lv: W.lives, sc: W.score, ch: W.chain, k: W.k, ov: W.over ? 1 : 0, rs: W.result, st: r2(W.secT), sl: r2(W.slow),
    ld: W.ledges.filter((L) => L.st).map((L) => [L.id, L.st, r2(L.t), r2(L.T)]),
    rd: W.riders.map((r) => [r.id, ENEMY_KEYS.indexOf(r.type), r2(r.x), r2(r.y), r2(r.vx), r2(r.vy), r.face, r.on, r2(r.beat), r.elite ? 1 : 0, r2(r.run)]),
    co: W.cores.map((c) => [c.id, r2(c.x), r2(c.y), r2(c.t), r2(c.T), CST.indexOf(c.st), r2(c.fT), c.rush ? 1 : 0, c.on]),
    pk: W.pickups.map((q) => [q.id, PW_KEYS.indexOf(q.kind), r2(q.x), r2(q.y), r2(q.t), q.life]),
    hz: W.haz.map((q) => ({ ...q })),
    sh: W.shots.map((s) => [SHOTK.indexOf(s.kind), r2(s.x), r2(s.y), r2(s.vx), r2(s.vy), s.r, r2(s.life), s.id]),
    po: W.portals.map((P) => [P.id, r2(P.x), r2(P.y), r2(P.t), r2(P.T), ENEMY_KEYS.indexOf(P.type)]),
    hu: Hn ? [r2(Hn.x), r2(Hn.y), r2(Hn.vx), r2(Hn.vy), Hn.face, Hn.st] : null,
    b: B ? { key: B.key, x: r2(B.x), y: r2(B.y), vx: r2(B.vx), vy: r2(B.vy), face: B.face, hp: B.hp, max: B.max, st: B.st, stT: r2(B.stT), phase: B.phase, hitT: r2(B.hitT), t: r2(B.t),
      pts: B.pts.map((q) => [q.hp, q.on ? 1 : 0]), seg: B.seg.map((s) => [r2(s.x), r2(s.y)]), cur: B.cur ? { ...B.cur } : null } : null,
    p1: [r3(h.x), r3(h.y), r2(h.vx), r2(h.vy), h.face, h.on, h.alive ? 1 : 0, r2(h.inv), h.armor, r2(h.beat), r2(h.run), h.gliding ? 1 : 0],
    p2: g ? [g.alive ? 1 : 0, r2(g.x), r2(g.y), r2(g.inv), g.armor] : null,
    pw1: packPw(h.pw), pw2: g ? packPw(g.pw) : null,
    sx: [W.stats.kills, W.stats.cores, W.stats.deaths, W.stats.hatched],
    sp: [r2(W.specT), W.rushN, W.rushGot],   // the HUD's survival / core-rush counters
  };
}
export function applyWorld(W, S, lead) {
  W.snapAge = 0;
  W.t = S.wt + lead; W.phase = S.ph; W.phaseT = S.pt; W.waveT = S.wT; W.fightT = S.ft; W.lives = S.lv; W.score = S.sc; W.chain = S.ch; W.over = !!S.ov; W.result = S.rs; W.secT = S.st; W.slow = S.sl;
  adoptWave(W, S.wv, S.wn, S.kd, S.k);
  for (const L of W.ledges) { L.st = 0; L.t = 0; }
  for (const [id, st, t, T] of S.ld) { const L = W.ledges[id]; if (L) { L.st = st; L.t = t; L.T = T; } }
  const old = new Map(W.riders.map((r) => [r.id, r]));
  W.riders = S.rd.map((q) => Object.assign(old.get(q[0]) || { b: {} }, { id: q[0], type: ENEMY_KEYS[q[1]], x: wrap(q[2] + q[4] * lead), y: q[3] + q[5] * lead, vx: q[4], vy: q[5], face: q[6], on: q[7], beat: q[8], elite: !!q[9], run: q[10], alive: true, hitT: 0, remote: true }));
  W.cores = S.co.map((q) => ({ id: q[0], x: q[1], y: q[2], t: q[3], T: q[4], st: CST[q[5]], fT: q[6], rush: !!q[7], on: q[8], vx: 0, vy: 0 }));
  W.pickups = S.pk.map((q) => ({ id: q[0], kind: PW_KEYS[q[1]], x: q[2], y: q[3], t: q[4], life: q[5] }));
  W.haz = S.hz;
  W.shots = S.sh.map((q) => ({ kind: SHOTK[q[0]], x: wrap(q[1] + q[3] * lead), y: q[2] + q[4] * lead, vx: q[3], vy: q[4], r: q[5], life: q[6], id: q[7], home: 0 }));
  W.portals = S.po.map((q) => ({ id: q[0], x: q[1], y: q[2], t: q[3] + lead, T: q[4], type: ENEMY_KEYS[q[5]] }));
  W.hunter = S.hu ? { x: S.hu[0], y: S.hu[1], vx: S.hu[2], vy: S.hu[3], face: S.hu[4], st: S.hu[5] } : null;
  if (S.b) {
    const B = W.boss && W.boss.key === S.b.key ? W.boss : { pts: [], seg: [] };
    Object.assign(B, S.b, { pts: S.b.pts.map((q, i) => ({ ...(B.pts[i] || {}), i, hp: q[0], on: !!q[1] })), seg: S.b.seg.map((q) => ({ x: q[0], y: q[1] })) });
    W.boss = B;
  } else W.boss = null;
  const h = W.players[0], q = S.p1;
  h.remote = true;
  h.x = wrap(q[0] + q[2] * lead); h.y = q[1] + q[3] * lead; h.vx = q[2]; h.vy = q[3]; h.face = q[4]; h.on = q[5]; h.alive = !!q[6]; h.inv = q[7]; h.armor = q[8]; h.beat = q[9]; h.run = q[10]; h.gliding = !!q[11];
  h.pw = unpackPw(S.pw1);
  const me = W.players[1], m = S.p2;
  if (me && m) {
    if (m[0] && !me.alive) { me.alive = true; me.x = m[1]; me.y = m[2]; me.vx = me.vy = 0; me.inv = m[3]; me.deadT = 0; me.on = -1; W.ev.push({ k: 'spawn', pid: 2, x: me.x, y: me.y }); }
    if (!m[0] && me.alive && me.inv <= 0) { me.alive = false; me.deadT = 0; W.ev.push({ k: 'death', pid: 2, x: me.x, y: me.y, cause: 'lance', lives: W.lives }); }
    me.armor = m[4];
    const pw = unpackPw(S.pw2);
    for (const k in pw) if (!me.pw[k] || pw[k] > me.pw[k] + 0.5) me.pw[k] = pw[k];
  }
  [W.stats.kills, W.stats.cores, W.stats.deaths, W.stats.hatched] = S.sx;
  if (S.sp) [W.specT, W.rushN, W.rushGot] = S.sp;
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
    this.events = []; this.remote = null; this.claimQ = []; this.lastSnap = 0; this.away = false; this.hostAway = false;
    this.stat = { snaps: 0, inputs: 0, deaths: 0 };
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
      this.raw({ type: 'hello', name: me.ini || 'LANCER' });
      this.ping();
      this.pingT = setInterval(() => this.ping(), 2000);
      this.helloT = setInterval(() => { if (!this.peer) this.raw({ type: 'hello', name: me.ini || 'LANCER' }); }, 50000);
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
      case 'pong': { const now = performance.now(), rtt = now - (+d.sent || now); if (rtt > 0 && rtt < 5000) this.rtt = this.rtt * 0.7 + rtt * 0.3; return; }
      case 'ready': {
        if (d.g !== 'lw') return;
        if (d.pv !== PROTOCOL) { this.h.status('Your wingmate is on a different version: refresh both pages', 'error'); return; }
        const first = !this.peer;
        this.peer = { ini: String(d.ini || '').replace(/[^A-Z0-9]/gi, '').slice(0, 4) };
        if (first) { clearInterval(this.pollT); this.h.joined(this.peer); }
        return;
      }
      case 'start': if (this.role === 'p2') this.h.start(d.cfg || {}); return;
      case 'snapshot': if (this.role === 'p2') { this.inbox.push(d); this.lastSnap = performance.now(); } return;
      case 'input': if (this.role === 'p1') this.onInput(d); return;
      case 'chat': if (d.k === 'bye') { this.peer = null; this.h.left('left'); return; } this.h.chat(d); return;
    }
  }
  sendReady() { this.raw({ type: 'ready', g: 'lw', pv: PROTOCOL, ini: this.me.ini }); }
  sendStart(cfg) { this.raw({ type: 'start', cfg }); }
  bind(W) {
    this.W = W; this.inbox = []; this.events = []; this.claimQ = []; this.remote = null; this.lastSnap = this.host ? 0 : performance.now(); this.hostAway = false;
    W.net = this.host ? 'host' : 'guest';
    if (this.host) W.players[1].remote = true; else W.players[0].remote = true;
  }
  // -------------------------------- host
  onInput(d) {
    this.stat.inputs++;
    if (Array.isArray(d.s)) this.remote = { s: d.s, at: performance.now() };
    for (const c of d.c || []) this.claimQ.push(c);
  }
  hostTick(W, applyClaim) {
    const g = W.players[1];
    if (!g) return;
    const lag = clamp(this.rtt / 2000, 0, 0.25);
    if (this.remote && g.alive && this.remote.s[6]) {
      const q = this.remote.s, age = Math.min(0.3, lag + (performance.now() - this.remote.at) / 1000);
      g.vx = +q[2] || 0; g.vy = +q[3] || 0; g.x = wrap((+q[0] || 0) + g.vx * age); g.y = (+q[1] || 0) + g.vy * age; g.face = q[4] < 0 ? -1 : 1; g.on = q[5] | 0; g.beat = +q[7] || 0; g.gliding = !!q[8];
    }
    for (const c of this.claimQ) applyClaim(W, g, c);
    this.claimQ = [];
  }
  hostEvents(list) { for (const e of list) if (!QUIET.has(e.k) && !(e.pid === 2 && e.remote)) this.events.push(e); }
  hostFrame(W, dt) {
    this.sendT -= dt;
    if (this.sendT > 0 || !this.peer) return;
    this.sendT = Math.max(-0.05, this.sendT) + 1 / 20;   // keep the 20 Hz cadence even when frames are uneven
    this.raw({ type: 'snapshot', s: packWorld(W), ev: this.events.splice(0, 80), hr: Math.round(this.rtt), aw: this.away ? 1 : 0 });   // aw: my tab is in the background (autopilot)
    this.stat.snaps++;
  }
  // -------------------------------- guest
  guestFrame(W, dt) {
    const me = W.players[1];
    const claims = W.claims.splice(0);
    this.sendT -= dt;
    if (!claims.length && this.sendT > 0) return;
    this.sendT = Math.max(-0.05, this.sendT) + 1 / 30;
    if (!me) return;
    this.raw({ type: 'input', s: [r3(me.x), r3(me.y), r2(me.vx), r2(me.vy), me.face, me.on, me.alive ? 1 : 0, r2(me.beat), me.gliding ? 1 : 0], c: claims });
  }
  guestSync(W) {
    if (!this.inbox.length) return [];
    const ev = [];
    let last = null;
    this.stat.snaps += this.inbox.length;
    for (const m of this.inbox) { for (const e of m.ev || []) ev.push(e); last = m; }
    this.inbox = [];
    this.hostAway = !!last.aw;
    const lead = clamp(((+last.hr || this.rtt) / 2) / 1000, 0, 0.25);
    applyWorld(W, last.s, lead);
    // knockbacks the host decided for my rider
    const me = W.players[1];
    for (const e of ev) {
      if (e.pid !== 2 || !me || !me.alive) continue;
      if (e.k === 'clang' && e.bx) { me.vx = e.bx; me.vy = Math.max(me.vy, 1.5); me.on = -1; }
      if (e.k === 'unhorse') { me.vy = Math.max(me.vy, 3.6); me.on = -1; }
      if (e.k === 'armor') { me.inv = F.hitInv; me.vy = Math.max(me.vy, 3.5); me.on = -1; }
      if (e.k === 'bosshit') { me.vy = Math.max(me.vy, 7.2); me.on = -1; }
    }
    return ev.filter((e) => !(e.pid === 2 && (e.k === 'death' || e.k === 'spawn' || e.k === 'flap')));
  }
  get stale() { return this.lastRecv && performance.now() - this.lastRecv > 4000; }
}

