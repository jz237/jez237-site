// Online 1v1 over the site's duel relay (the Steel Duel room server): the first player in a room is
// p1 = the host, the second is p2 = the guest. The host runs the real match and streams snapshots and
// events. The guest runs a local forecast of the host's world (W.predict), flies its own paddle
// locally and reports its own hits; the host holds balls at the guest's shield until a hit report or a
// miss notice arrives, so a save the guest sees on screen is a save that counts.
import { F, POWERUP_KEYS } from './config.js?v=6';
import { applyClaim, releaseHold, advanceBall, newPaddle } from './sim.js?v=6';

export const PROTOCOL = 1;
const RELAY = 'wss://steel-duel-online.jez237.workers.dev';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const QUICK = 'PPB-Q-';
export const ROOM = 'PPB-';
export function randomCode(n) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  let s = '';
  for (const x of b) s += CODE_CHARS[x % CODE_CHARS.length];
  return s;
}
export const cleanCode = (v) => String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const r3 = (v) => Math.round(v * 1000) / 1000;
const r2 = (v) => Math.round(v * 100) / 100;
const FROM = ['paddle', 'drone', 'turret'];
const FX_KEYS = ['titan', 'shrink', 'nova', 'drone', 'ghost', 'magnet', 'magnetT', 'barrier', 'barrierHits', 'chrono', 'scope'];
const METER_KEYS = ['charges', 'max', 'chargeT', 'cool', 'od', 'odTime'];
const STAT_KEYS = ['hits', 'smashes', 'cells', 'coreHits', 'bolts', 'stuns', 'pickups', 'curves'];
const QUIET = new Set(['fxend', 'odend', 'wellend']);

// ------------------------------------------------------------------ world snapshots
export function packWorld(W) {
  const S = { wt: r3(W.t), ov: W.over ? 1 : 0, wn: W.winner, ra: W.rally, mr: W.maxRally, ni: W.nextId, c: [], k: [], f: [], m: [], st: [], P: [], B: [], O: [], Q: [], D: [], V: [], bs: 0 };
  for (const s of [1, -1]) {
    for (const c of W.cells[s]) S.c.push([r2(c.hp), c.max, r3(c.hitT), r3(c.buildT)]);
    const k = W.cores[s];
    S.k.push([k.hp, k.max, r3(k.hitT)]);
    S.f.push(FX_KEYS.map((q) => r3(W.fx[s][q])));
    S.m.push(METER_KEYS.map((q) => r3(W.meter[s][q])));
    S.st.push(STAT_KEYS.map((q) => W.stats[s][q]));
  }
  for (const p of W.paddles) {
    S.P.push([p.id, p.side, r3(p.x), r3(p.z), r3(p.vx), r3(p.vz), r3(p.hwBase), r3(p.scale), r3(p.stun), r3(p.immuneT), r2(p.flash), r3(p.hitT),
      p.caught ? p.caught.id : 0, r3(p.catchT), p.boss ? 1 : 0, p.part, r3(p.xMin), r3(p.xMax), r3(p.zFront), r3(p.zBack), r3(p.homeZ), p.look === 'boss' ? 1 : 0]);
  }
  for (const b of W.balls) {
    S.B.push([b.id, r3(b.x), r3(b.z), r3(b.vx), r3(b.vz), r3(b.spin), b.owner, b.fire ? 1 : 0, r3(b.rally), b.caught ? b.caught.id : 0, r3(b.catchOff || 0),
      b.hits, r3(b.born), b.holdT !== undefined && !b.holdDone ? 1 : 0, b.banks || 0, b.portalT === undefined ? -99 : r3(b.portalT)]);
  }
  for (const o of W.bolts) S.O.push([o.id, o.side, r3(o.x), r3(o.z), o.vz, r3(o.born), FROM.indexOf(o.from)]);
  for (const o of W.orbs) S.Q.push([o.id, POWERUP_KEYS.indexOf(o.kind), r3(o.x), r3(o.z), r3(o.vx), r3(o.vz), r3(o.born), r3(o.life)]);
  for (const d of W.drones) S.D.push([d.id, d.side, r3(d.x), r3(d.z), r3(d.fireT), r3(d.born)]);
  for (const w of W.wells) S.V.push([w.id, r3(w.x), r3(w.z), w.m, r3(w.born), r3(w.life), w.side]);
  if (W.boss) { const B = W.boss, L = B.laser; S.bs = [B.phase, L ? [r3(L.x), r3(L.charge), r3(L.fire)] : 0]; }
  return S;
}

// in place, by id: the renderer's views keep references to these objects
function syncList(list, rows, apply) {
  const by = new Map(list.map((o) => [o.id, o]));
  return rows.map((q) => { const o = by.get(q[0]) || { id: q[0] }; apply(o, q); return o; });
}

// Bring the guest's forecast world to the host's snapshot S, carried `lead` seconds forward to now.
// `me` is the guest's side: its paddle stays where the guest put it. keepBall(b, row) says a ball is
// the guest's to move right now (it just hit it, or the host is holding it for a report).
export function applyWorld(W, S, lead, me, keepBall) {
  W.over = !!S.ov; W.winner = S.wn; W.rally = S.ra; W.maxRally = S.mr; W.nextId = S.ni;
  W.t = S.wt + lead;
  let ci = 0;
  [1, -1].forEach((s, j) => {
    for (const c of W.cells[s]) { const q = S.c[ci++]; c.hp = q[0]; c.max = q[1]; c.hitT = q[2]; c.buildT = q[3]; }
    const core = W.cores[s], k = S.k[j];
    core.hp = k[0]; core.max = k[1]; core.hitT = k[2];
    FX_KEYS.forEach((q, n) => { W.fx[s][q] = S.f[j][n]; });
    METER_KEYS.forEach((q, n) => { W.meter[s][q] = S.m[j][n]; });
    STAT_KEYS.forEach((q, n) => { W.stats[s][q] = S.st[j][n]; });
  });
  // paddles
  const pids = new Set();
  for (const q of S.P) {
    pids.add(q[0]);
    let p = W.paddles.find((x) => x.id === q[0]);
    if (!p) { p = newPaddle(q[0], q[1]); W.paddles.push(p); }
    p.hwBase = q[6]; p.scale = q[7]; p.hw = p.hwBase * p.scale;
    p.immuneT = q[9]; p.boss = !!q[14]; p.part = q[15];
    p.xMin = q[16]; p.xMax = q[17]; p.zFront = q[18]; p.zBack = q[19]; p.homeZ = q[20];
    if (q[21]) p.look = 'boss';
    p.stun = Math.max(0, q[8] - lead);
    if (p.side !== me) {
      p.remote = true;
      p.flash = q[10]; p.hitT = q[11]; p.catchT = q[13];
      p.vx = q[4]; p.vz = q[5];
      const z0 = Math.min(p.zFront, p.zBack), z1 = Math.max(p.zFront, p.zBack);
      const moving = p.stun <= 0 ? lead : 0;
      p.x = clamp(q[2] + q[4] * moving, p.xMin + p.hw, p.xMax - p.hw);
      p.z = clamp(q[3] + q[5] * moving, z0, z1);
    }
  }
  W.paddles = W.paddles.filter((p) => pids.has(p.id));
  // balls
  const byId = new Map(W.balls.map((b) => [b.id, b]));
  const out = [], hold = new Map();
  for (const q of S.B) {
    let b = byId.get(q[0]);
    byId.delete(q[0]);
    if (b && keepBall(b, q)) { out.push(b); hold.set(b, b.caught ? b.caught.id : 0); continue; }
    const fresh = !b;
    if (!b) b = { id: q[0], r: F.ballR, ox: 0, oz: 0 };
    const px = b.x, pz = b.z;
    b.x = q[1]; b.z = q[2]; b.vx = q[3]; b.vz = q[4]; b.spin = q[5]; b.owner = q[6]; b.fire = !!q[7]; b.rally = q[8];
    b.catchOff = q[10]; b.hits = q[11]; b.born = q[12]; b.held = !!q[13]; b.banks = q[14]; b.portalT = q[15] === -99 ? undefined : q[15];
    b.gone = 0; b.holdT = undefined; b.caught = null;
    hold.set(b, q[9]);
    out.push(b);
    if (!q[9] && !b.held) advanceBall(W, b, lead);
    if (!fresh) {
      // how far the forecast had drifted (kept for the network stats)
      const C = W.corr || (W.corr = { n: 0, sum: 0, max: 0, big: 0 });
      const e = Math.hypot(px - b.x, pz - b.z);
      C.n++; C.sum += e; C.max = Math.max(C.max, e); if (e > 2.5) C.big++;
      b.ox = (b.ox || 0) + px - b.x; b.oz = (b.oz || 0) + pz - b.z;
      if (Math.hypot(b.ox, b.oz) > 6) { b.ox = 0; b.oz = 0; }
    }
  }
  // the guest's own balls the host hasn't caught up with yet stay a moment longer
  for (const b of byId.values()) if (keepBall(b, null)) { out.push(b); hold.set(b, b.caught ? b.caught.id : 0); }
  W.balls = out;
  for (const p of W.paddles) p.caught = null;
  for (const [b, pid] of hold) {
    b.caught = null;
    const p = pid && W.paddles.find((x) => x.id === pid);
    if (p) { b.caught = p; p.caught = b; }
  }
  // bolts: the guest's own shots stay until the host's copy turns up
  const bolts = S.O.map((q) => ({ id: q[0], side: q[1], x: q[2], z: q[3] + q[4] * lead, vz: q[4], born: q[5], from: FROM[q[6]] }));
  for (const lo of W.bolts) {
    if (!lo.local || W.t - lo.born > 0.45) continue;
    const m = bolts.find((o) => !o.m && o.side === lo.side && o.from === 'paddle' && Math.abs(o.x - lo.x) < 0.7 && Math.abs(o.z - lo.z) < 3);
    if (m) m.m = 1; else bolts.push(lo);
  }
  W.bolts = bolts;
  W.orbs = syncList(W.orbs, S.Q, (o, q) => { o.kind = POWERUP_KEYS[q[1]]; o.vx = q[4]; o.vz = q[5]; o.x = q[2] + q[4] * lead; o.z = q[3] + q[5] * lead; o.born = q[6]; o.life = q[7] - lead; o.r = 0.62; });
  W.drones = syncList(W.drones, S.D, (d, q) => { d.side = q[1]; d.x = q[2]; d.z = q[3]; d.fireT = q[4]; d.born = q[5]; });
  W.wells = syncList(W.wells, S.V, (w, q) => { w.x = q[1]; w.z = q[2]; w.m = q[3]; w.born = q[4]; w.life = q[5] - lead; w.side = q[6]; });
  if (W.boss && S.bs) { W.boss.phase = S.bs[0]; const L = S.bs[1]; W.boss.laser = L ? { x: L[0], charge: L[1] - lead, fire: L[2] } : null; }
}

// ------------------------------------------------------------------ the connection
// hooks: status(text, kind), joined(), start(cfg), events(list), left(reason), chat(msg)
export class Online {
  constructor(hooks, opts = {}) {
    this.h = hooks;
    this.relay = opts.relay || RELAY;
    this.lag = opts.lag || 0; // test hook: extra one-way delay (ms) on everything we send
    this.ws = null;
    this.reset();
  }

  reset() {
    this.role = null; this.side = 0; this.id = null; this.room = null; this.intent = null;
    this.peer = null; this.peers = []; this.rtt = 150; this.offset = null; this.peerRtt = 150;
    this.W = null; this.inbox = []; this.sendT = 0; this.lastRecv = 0; this.events = [];
    this.remote = { x: 0, z: 0, vx: 0, vz: 0, f: 0, o: 0, n: 0 }; this.fireN = 0; this.odN = 0; this.lastF = 0; this.lastO = 0;
    this.claims = new Map(); this.misses = new Set(); this.rejected = []; this.outbox = { c: [], m: [] }; this.queue = [];
    this.stat = { claims: 0, rejects: 0, misses: 0, snaps: 0, inputs: 0 };
    this.noClaim = new Map(); // "ball:hits" the host turned down: don't keep asking
    clearInterval(this.pingT); clearInterval(this.helloT); clearInterval(this.pollT);
  }

  get open() { return this.ws && this.ws.readyState === 1; }
  get http() { return this.relay.replace(/^ws/, 'http'); }

  async rooms() {
    const r = await fetch(this.http + '/rooms', { cache: 'no-store' });
    const d = await r.json();
    return Array.isArray(d.rooms) ? d.rooms : [];
  }

  // find someone waiting, or wait in a fresh quick-match room (two waiting rooms merge: the later name joins the earlier)
  async quick(me) {
    this.h.status('Searching for a rival…', 'wait');
    let list = [];
    try { list = await this.rooms(); } catch { /* lobby unreachable: just wait in a room */ }
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

  // intent: 'host' (private room), 'join' (by code), 'quick'
  connect(room, intent, me) {
    this.close(true);
    this.reset();
    this.room = room; this.intent = intent; this.me = me;
    let ws;
    try { ws = new WebSocket(`${this.relay}/ws/${encodeURIComponent(room)}`); } catch { this.h.status('Could not reach the online server', 'error'); return; }
    this.ws = ws;
    ws.onopen = () => {
      this.raw({ type: 'hello', name: me.ini || 'PLAYER' });
      this.ping();
      this.pingT = setInterval(() => this.ping(), 2000);
      // keep the room listed while waiting (the lobby forgets rooms after two minutes)
      this.helloT = setInterval(() => { if (!this.peer) this.raw({ type: 'hello', name: me.ini || 'PLAYER' }); }, 50000);
    };
    ws.onmessage = (ev) => { if (this.ws === ws) this.recv(ev.data); };
    ws.onerror = () => { if (this.ws === ws && !this.role) this.h.status('Could not reach the online server', 'error'); };
    ws.onclose = () => {
      if (this.ws !== ws) return;
      this.ws = null;
      if (!this.role) this.h.status('Could not reach the online server', 'error');
      else this.h.left('lost');
    };
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
    if (this.lag) { const ws = this.ws; setTimeout(() => { try { if (ws.readyState === 1) ws.send(s); } catch { /* gone */ } }, this.lag); }
    else this.ws.send(s);
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
        this.id = d.id; this.role = d.role; this.peers = d.peers || [];
        if (d.role === 'spectator') {
          this.close(true); this.role = null;
          if (this.intent === 'quick') setTimeout(() => this.quick(this.me), 400);
          else this.h.status('That room is full', 'error');
          return;
        }
        this.side = d.role === 'p1' ? 1 : -1;
        if (d.role === 'p1' && this.intent === 'join') {
          // nobody was waiting in there
          this.close(true); this.role = null;
          this.h.status(`No room with code ${this.room.slice(ROOM.length)}`, 'error');
          return;
        }
        if (d.role === 'p2') this.sendReady();
        this.h.status(d.role === 'p1' ? 'waiting' : 'Connecting to your rival…', d.role === 'p1' ? 'wait' : 'info');
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
        const now = performance.now();
        const rtt = now - (+d.sent || now);
        if (rtt > 0 && rtt < 5000) {
          this.rtt = this.rtt * 0.7 + rtt * 0.3;
          const off = (+d.t || 0) - (d.sent + rtt / 2);
          // keep the offset from the fastest round trips
          if (this.offset === null || rtt < (this.bestRtt || 1e9) * 1.25) { this.offset = this.offset === null ? off : this.offset * 0.6 + off * 0.4; this.bestRtt = Math.min(this.bestRtt || 1e9, rtt); }
        }
        return;
      }
      case 'ready': {
        if (d.g !== 'ppb') return;
        if (d.pv !== PROTOCOL) { this.h.status('Your rival is on a different version: refresh both pages', 'error'); return; }
        const first = !this.peer;
        this.peer = { ini: String(d.ini || '').replace(/[^A-Z0-9]/gi, '').slice(0, 4), pilot: String(d.pilot || 'p1'), again: !!d.again };
        if (first) { clearInterval(this.pollT); this.h.joined(this.peer); }
        else if (d.again) this.h.chat({ k: 'again' });
        return;
      }
      case 'start': if (this.role === 'p2') this.h.start(d); return;
      case 'snapshot': if (this.role === 'p2') this.inbox.push(d); return;
      case 'input': if (this.role === 'p1') this.onInput(d); return;
      case 'chat':
        if (d.k === 'bye') { this.peer = null; this.h.left('left'); return; }
        this.h.chat(d);
        return;
    }
  }

  sendReady(again = false) {
    this.raw({ type: 'ready', g: 'ppb', pv: PROTOCOL, ini: this.me.ini, pilot: this.me.pilot, again });
  }
  chat(msg) { this.raw({ type: 'chat', ...msg }); }

  // ---------------------------------------------------------------- match wiring
  bind(W) {
    this.W = W;
    this.inbox = []; this.events = []; this.claims.clear(); this.misses.clear(); this.rejected = []; this.queue = [];
    this.outbox = { c: [], m: [] };
    this.lastF = this.remote.f; this.lastO = this.remote.o;
    const foe = W.paddles.find((p) => p.side === -this.side);
    if (this.side === 1) {
      foe.remote = true; foe.claimOnly = true;
      foe.x = this.remote.x || 0; foe.z = foe.homeZ;
      W.hold = { side: -1, max: 0.35 };
    } else {
      W.predict = true;
      foe.remote = true;
    }
  }

  // -------------------------------- host
  onInput(d) {
    this.stat.inputs++;
    const R = this.remote;
    R.x = +d.x || 0; R.z = +d.z || 0; R.vx = +d.vx || 0; R.vz = +d.vz || 0;
    R.f = d.f | 0; R.o = d.o | 0;
    if (+d.rt > 0) this.peerRtt = +d.rt;
    for (const c of d.c || []) this.queue.push({ claim: c });
    for (const m of d.m || []) this.queue.push({ miss: m | 0 });
  }

  // before each host tick: move the remote paddle, apply reports
  hostTick(W) {
    const p = W.paddles.find((q) => q.side === -1);
    if (!p) return;
    const R = this.remote;
    if (p.stun <= 0) {
      const z0 = Math.min(p.zFront, p.zBack), z1 = Math.max(p.zFront, p.zBack);
      p.x = clamp(R.x, p.xMin + p.hw, p.xMax - p.hw); p.z = clamp(R.z, z0, z1);
      p.vx = R.vx; p.vz = R.vz;
    } else { p.vx = 0; p.vz = 0; }
    if (R.f > this.lastF) { this.lastF = R.f; p.input.fire = true; }
    if (R.o > this.lastO) { this.lastO = R.o; p.input.od = true; }
    for (const q of this.queue) {
      if (q.claim) {
        const r = applyClaim(W, q.claim);
        if (r === true) this.stat.claims++;
        else { this.rejected.push(q.claim.id); this.stat.rejects++; this.stat[r] = (this.stat[r] || 0) + 1; }
      }
      else { releaseHold(W, q.miss); this.stat.misses++; }
    }
    this.queue = [];
  }

  hostEvents(list) { for (const e of list) if (!QUIET.has(e.k)) this.events.push(e); }

  // after each host frame: stream the world at ~30 Hz
  hostFrame(W, dt) {
    this.sendT -= dt;
    if (this.sendT > 0 || !this.peer) return;
    this.sendT = 1 / 30;
    const ev = this.events.splice(0, 60);
    this.raw({ type: 'snapshot', s: packWorld(W), ev, rj: this.rejected.splice(0), hr: Math.round(this.rtt) });
  }

  // -------------------------------- guest
  // the guest's own paddle input, ~30 Hz plus at once for every report
  guestFrame(W, dt, force) {
    // ease out visual corrections
    const k = Math.exp(-dt * 14);
    for (const b of W.balls) if (b.ox || b.oz) { b.ox *= k; b.oz *= k; if (Math.abs(b.ox) + Math.abs(b.oz) < 0.002) { b.ox = 0; b.oz = 0; } }
    // a ball that sailed past my paddle: tell the host not to wait for a report
    const me = W.paddles.find((q) => q.side === this.side);
    if (me) {
      // past my paddle, or about to reach the line where the host holds it (whichever is first)
      const hold = (W.fx[this.side].barrier > 0 ? F.cellZ - F.cellHD - 0.55 : F.cellZ - F.cellHD) - 0.7;
      const lim = Math.min(this.side * me.z + me.hd + 0.12, hold);
      for (const b of W.balls) {
        if (b.caught || b.vz * this.side <= 0 || this.claims.has(b.id) || this.misses.has(b.id + ':' + b.hits)) continue;
        if (this.side * b.z - b.r > lim) { this.misses.add(b.id + ':' + b.hits); this.outbox.m.push(b.id); force = true; }
      }
    }
    this.sendT -= dt;
    if (!force && this.sendT > 0) return;
    this.sendT = 1 / 30;
    if (!me) return;
    this.raw({ type: 'input', x: r3(me.x), z: r3(me.z), vx: r3(me.vx), vz: r3(me.vz), f: this.fireN, o: this.odN, c: this.outbox.c, m: this.outbox.m, rt: Math.round(this.rtt) });
    this.outbox = { c: [], m: [] };
  }

  // events from the guest's own forecast: keep my own hits / shots, report my hits to the host
  guestLocal(W, list) {
    const mine = [];
    for (const e of list) {
      if (e.side !== this.side) continue;
      if (e.k === 'hit' && !e.claim) {
        const b = W.balls.find((q) => q.id === e.id);
        if (!b || e.id <= 0) continue;
        const key = b.id + ':' + (b.hits - 1);
        if (performance.now() - (this.noClaim.get(key) || -1e9) < 1500) continue;
        const c = { kind: 'hit', id: b.id, pid: e.pid, hits: b.hits - 1, at: r3(W.t), x: r3(b.x), z: r3(b.z), vx: r3(b.vx), vz: r3(b.vz), spin: r3(b.spin), rally: r3(b.rally), fire: b.fire ? 1 : 0, speed: r3(e.speed), smash: r3(e.smash), u: r3(e.u) };
        this.claims.set(b.id, { hits: b.hits, at: performance.now() });
        this.outbox.c.push(c);
        this.guestFrame(W, 0, true);
        mine.push(e);
      } else if (e.k === 'catch') {
        const b = W.balls.find((q) => q.id === e.id);
        if (!b) continue;
        this.claims.set(b.id, { hits: b.hits, at: performance.now(), caught: true });
        this.outbox.c.push({ kind: 'catch', id: b.id, pid: b.caught ? b.caught.id : 0, hits: b.hits, at: r3(W.t), off: r3(b.catchOff || 0) });
        this.guestFrame(W, 0, true);
        mine.push(e);
      } else if (e.k === 'bolt' && e.from === 'paddle') mine.push(e);
      else if (e.k === 'release') mine.push(e);
    }
    return mine;
  }

  // apply the newest snapshot; returns the host's events to play
  guestSync(W) {
    if (!this.inbox.length) return [];
    const ev = [];
    let last = null;
    this.stat.snaps += this.inbox.length;
    for (const m of this.inbox) {
      for (const e of m.ev || []) ev.push(e);
      for (const id of m.rj || []) { const c = this.claims.get(id); if (c) this.noClaim.set(id + ':' + (c.hits - 1), performance.now()); this.claims.delete(id); }
      last = m;
    }
    this.inbox = [];
    // how far behind is this snapshot? host -> relay (half its ping) + relay -> me (from the relay's clock)
    const now = this.serverNow;
    const down = now !== null && last.t ? clamp(now - last.t, 0, 400) : this.rtt / 2;
    const lead = clamp(((+last.hr || this.rtt) / 2 + down) / 1000, 0, 0.25);
    const nowMs = performance.now();
    const keep = (b, q) => {
      const c = this.claims.get(b.id);
      if (c) {
        // the host has my hit when its copy of the ball shows one more return than before
        if (q && q[11] >= c.hits && !(c.caught && !q[9])) { this.claims.delete(b.id); return false; }
        if (nowMs - c.at < 700) return true;
        this.claims.delete(b.id);
        return false;
      }
      if (b.gone && W.t - b.gone < 0.5) return true;          // forecast says it went into a core
      if (q && q[13] && b.vz * this.side > 0) return true;    // held for my report: keep my view
      return false;
    };
    applyWorld(W, last.s, lead, this.side, keep);
    // my own shots and hits already played
    return ev.filter((e) => !(e.side === this.side && ((e.k === 'hit' && e.claim) || (e.k === 'catch' && e.claim) || (e.k === 'bolt' && e.from === 'paddle'))));
  }

  get stale() { return this.lastRecv && performance.now() - this.lastRecv > 4000; }
}
