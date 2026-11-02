// Online 1v1 over the site's duel relay (the Steel Duel room server): the first player in a room is
// p1 = the host, the second is p2 = the guest. The host runs the real belt and streams snapshots and
// events. The guest flies its own ship locally (so steering never lags), fires its own shots at once
// (the host re-creates them from the guest's report) and reports the hits it takes on its own screen,
// so a dodge the guest sees is a dodge that counts.
import { F, POWERUP_KEYS, KIND_INDEX } from './config.js?v=3';
import { applyClaim, newShip, wrapX, wrapZ } from './sim.js?v=3';

export const PROTOCOL = 1;
const RELAY = 'wss://steel-duel-online.jez237.workers.dev';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const QUICK = 'A26-Q-';
export const ROOM = 'A26-';
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
const KINDS = Object.keys(KIND_INDEX);
const SHOTS = ['shot', 'rail', 'missile', 'drone', 'boss'];
const FXK = ['triple', 'rapid', 'shield', 'shieldT', 'missiles', 'magnet', 'phase', 'chrono', 'drone', 'rail'];
const QUIET = new Set(['odend', 'wellend', 'dodge']);

// ------------------------------------------------------------------ world snapshots
export function packWorld(W, ack) {
  const S = { wt: r3(W.t), ov: W.over ? 1 : 0, wn: W.winner, ni: W.nextId, ak: ack, s: [], r: [], b: [], o: [], m: [], d: [], v: [], k: [], l: [], a: W.arcs, st: [] };
  for (const s of W.ships) {
    S.s.push([s.id, s.side, r3(s.x), r3(s.z), r3(s.vx), r3(s.vz), r3(s.a), s.hp, s.max, r2(s.inv), r2(s.odTime), r2(s.od), r2(s.dashT), r2(s.dashCD), r2(s.thrustK), s.alive ? 1 : 0, r2(s.hitT),
      FXK.map((k) => r2(s.fx[k])), s.shots]);
  }
  for (const r of W.rocks) S.r.push([r.id, r2(r.x), r2(r.z), r2(r.vx), r2(r.vz), r.size, KIND_INDEX[r.kind], r.hp, r.owner, r2(r.ownT), r.seed, r2(r.hitT), r2(r.life), r2(r.born)]);
  for (const b of W.bullets) S.b.push([b.id, b.side, r2(b.x), r2(b.z), r2(b.vx), r2(b.vz), r2(b.life), SHOTS.indexOf(b.kind), b.dmg, b.pierce ? 1 : 0, b.home, b.cid || 0, b.ship]);
  for (const o of W.orbs) S.o.push([o.id, POWERUP_KEYS.indexOf(o.kind), r2(o.x), r2(o.z), r2(o.vx), r2(o.vz), r2(o.life), r2(o.born)]);
  for (const m of W.mines) S.m.push([m.id, m.side, r2(m.x), r2(m.z), r2(m.vx), r2(m.vz), r2(m.armT), r2(m.life)]);
  for (const d of W.drones) S.d.push([d.id, d.side, d.ship, r3(d.ang), r2(d.x), r2(d.z), r2(d.life)]);
  for (const w of W.wells) S.v.push([w.id, w.side, r2(w.x), r2(w.z), r2(w.vx), r2(w.vz), r2(w.life), r2(w.born)]);
  for (const k of W.strikes) S.k.push([k.id, r2(k.x), r2(k.z), k.r, r2(k.t), k.max]);
  for (const L of W.lanes) S.l.push([r2(L.x), r2(L.z), r3(L.dx), r3(L.dz)]);
  for (const sd of [1, -1]) { const st = W.stats[sd]; S.st.push([st.shots, st.hits, st.rocks, st.shards, st.pickups, st.dodges]); }
  return S;
}

// Bring the guest's world to the host's snapshot S, carried `lead` seconds forward to now.
// `me` is the guest's side: its ship keeps the guest's own position. pending = my unacknowledged damage.
export function applyWorld(W, S, lead, me, pending) {
  W.over = !!S.ov; W.winner = S.wn; W.nextId = Math.max(W.nextId, S.ni);
  W.t = S.wt + lead;
  for (const q of S.s) {
    let s = W.ships.find((x) => x.id === q[0]);
    if (!s) { s = newShip(q[0], q[1], q[2], q[3], q[6]); W.ships.push(s); }
    s.hp = Math.max(0, q[7] - (q[1] === me ? pending : 0)); s.max = q[8];
    s.odTime = q[10]; s.od = q[11]; s.alive = !!q[15];
    if (q[16] > s.hitT) s.hitT = q[16];
    FXK.forEach((k, i) => { s.fx[k] = q[17][i]; });
    if (q[1] !== me) {
      s.remote = true;
      s.x = wrapX(q[2] + q[4] * lead); s.z = wrapZ(q[3] + q[5] * lead); s.vx = q[4]; s.vz = q[5]; s.a = q[6];
      s.inv = q[9]; s.dashT = q[12]; s.dashCD = q[13]; s.thrustK = q[14];
    } else {
      s.dashCD = Math.max(s.dashCD, q[13] - 0.3);
      if (q[9] > s.inv + 0.3) s.inv = q[9];
    }
  }
  W.rocks = S.r.map((q) => ({ id: q[0], x: wrapX(q[1] + q[3] * lead), z: wrapZ(q[2] + q[4] * lead), vx: q[3], vz: q[4], size: q[5], r: F.rockR[q[5]], kind: KINDS[q[6]], hp: q[7],
    owner: q[8], ownT: q[9], seed: q[10], hitT: q[11], life: q[12], born: q[13], portT: 0 }));
  // bullets: the host's copies replace my local ones (matched by my client id)
  const hostIds = new Set();
  const list = S.b.map((q) => {
    if (q[11]) hostIds.add(q[11]);
    return { id: q[0], side: q[1], x: wrapX(q[2] + q[4] * lead), z: wrapZ(q[3] + q[5] * lead), vx: q[4], vz: q[5], life: q[6] - lead, kind: SHOTS[q[7]] || 'shot', dmg: q[8], pierce: !!q[9], home: q[10], cid: q[11], ship: q[12], hits: [], portT: 0, local: 0 };
  });
  for (const b of W.bullets) if (b.local && !hostIds.has(b.id) && W.t - b.born < 0.6 && !b.dead) list.push(b);
  // shots the host already has stay out; a host shot that hit me on my screen stays gone
  W.bullets = list.filter((b) => !(W.gone && W.gone.has(b.id)) && !(b.local && hostIds.has(b.id)));
  W.orbs = S.o.map((q) => ({ id: q[0], kind: POWERUP_KEYS[q[1]], x: wrapX(q[2] + q[4] * lead), z: wrapZ(q[3] + q[5] * lead), vx: q[4], vz: q[5], life: q[6], born: q[7] }));
  W.mines = S.m.map((q) => ({ id: q[0], side: q[1], x: q[2], z: q[3], vx: q[4], vz: q[5], armT: q[6], life: q[7] }));
  W.drones = S.d.map((q) => ({ id: q[0], side: q[1], ship: q[2], ang: q[3], x: q[4], z: q[5], life: q[6], fireT: 1 }));
  W.wells = S.v.map((q) => ({ id: q[0], side: q[1], x: q[2], z: q[3], vx: q[4], vz: q[5], life: q[6], born: q[7] }));
  W.strikes = S.k.map((q) => ({ id: q[0], x: q[1], z: q[2], r: q[3], t: q[4] - lead, max: q[5] }));
  W.lanes = S.l.map((q) => ({ x: q[0], z: q[1], dx: q[2], dz: q[3] }));
  W.arcs = S.a || [];
  [1, -1].forEach((sd, i) => { const st = W.stats[sd], q = S.st[i]; if (q) { st.shots = q[0]; st.hits = q[1]; st.rocks = q[2]; st.shards = q[3]; st.pickups = q[4]; st.dodges = q[5]; } });
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
    this.remote = null; this.shotQ = []; this.claimQ = []; this.odN = 0; this.lastO = 0; this.ack = 0;
    this.seq = 0; this.pending = []; this.outShots = []; this.outClaims = []; this.sentIds = new Set();
    this.stat = { claims: 0, rejects: 0, snaps: 0, inputs: 0, shots: 0 };
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
          if (this.offset === null || rtt < (this.bestRtt || 1e9) * 1.25) { this.offset = this.offset === null ? off : this.offset * 0.6 + off * 0.4; this.bestRtt = Math.min(this.bestRtt || 1e9, rtt); }
        }
        return;
      }
      case 'ready': {
        if (d.g !== 'a26') return;
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

  sendReady(again = false) { this.raw({ type: 'ready', g: 'a26', pv: PROTOCOL, ini: this.me.ini, pilot: this.me.pilot, again }); }
  chat(msg) { this.raw({ type: 'chat', ...msg }); }

  // ---------------------------------------------------------------- match wiring
  bind(W) {
    this.W = W;
    this.inbox = []; this.events = []; this.shotQ = []; this.claimQ = []; this.pending = []; this.outShots = []; this.outClaims = [];
    this.remote = null; this.lastO = this.odN; this.sentIds = new Set();
    const foe = W.ships.find((s) => s.side === -this.side);
    foe.remote = true;
    if (this.side === 1) foe.noDamage = true;
    else { W.predict = true; W.gone = new Set(); }
  }

  // -------------------------------- host
  onInput(d) {
    this.stat.inputs++;
    if (Array.isArray(d.s)) this.remote = { s: d.s, at: performance.now() };
    if (+d.rt > 0) this.peerRtt = +d.rt;
    for (const b of d.f || []) this.shotQ.push(b);
    for (const c of d.c || []) this.claimQ.push(c);
    if ((d.o | 0) > this.lastO) { this.lastO = d.o | 0; this.odWant = true; }
  }

  // before each host tick: move the guest's ship to where the guest says it is, add its shots, apply its reports
  hostTick(W) {
    const s = W.ships.find((q) => q.side === -1);
    if (!s) return;
    const lag = clamp(this.peerRtt / 2000, 0, 0.25);
    if (this.remote && s.alive) {
      const q = this.remote.s, age = lag + (performance.now() - this.remote.at) / 1000;
      s.vx = +q[2] || 0; s.vz = +q[3] || 0;
      s.x = wrapX((+q[0] || 0) + s.vx * Math.min(age, 0.3)); s.z = wrapZ((+q[1] || 0) + s.vz * Math.min(age, 0.3));
      s.a = +q[4] || 0; s.thrustK = clamp(+q[5] || 0, -1, 1); s.dashT = clamp(+q[6] || 0, 0, F.dashTime);
    }
    for (const b of this.shotQ) {
      if (!s.alive || W.over) break;
      const kind = SHOTS.includes(b.k) ? b.k : 'shot';
      const age = clamp(lag + (+b.age || 0), 0, 0.3);
      W.bullets.push({ id: W.nextId++, side: -1, ship: s.id, x: wrapX(+b.x + b.vx * age), z: wrapZ(+b.z + b.vz * age), vx: +b.vx, vz: +b.vz, life: clamp(+b.life || F.shotLife, 0.1, 2) - age,
        dmg: clamp(b.d | 0, 1, 2), kind, pierce: !!b.p, home: b.h | 0, hits: [], born: W.t, portT: 0, cid: b.id | 0, local: 0 });
      W.stats[-1].shots++;
      W.ev.push({ k: 'fire', side: -1, id: s.id, x: s.x, z: s.z, kind, n: 1, remote: 1 });
      this.stat.shots++;
    }
    this.shotQ = [];
    if (this.odWant) {
      this.odWant = false;
      if (s.od >= F.odMax && s.odTime <= 0) { s.odTime = F.odTime; s.od = 0; W.ev.push({ k: 'od', side: -1, x: s.x, z: s.z }); }
    }
    for (const c of this.claimQ) {
      const r = applyClaim(W, c);
      this.ack = Math.max(this.ack, c.q | 0);
      if (r === true) this.stat.claims++; else { this.stat.rejects++; this.stat[r] = (this.stat[r] || 0) + 1; }
    }
    this.claimQ = [];
  }

  hostEvents(list) { for (const e of list) if (!QUIET.has(e.k) && !(e.k === 'fire' && e.side === -1 && e.remote)) this.events.push(e); }

  // after each host frame: stream the world at ~25 Hz
  hostFrame(W, dt) {
    this.sendT -= dt;
    if (this.sendT > 0 || !this.peer) return;
    this.sendT = 1 / 25;
    const ev = this.events.splice(0, 80);
    this.raw({ type: 'snapshot', s: packWorld(W, this.ack), ev, hr: Math.round(this.rtt) });
  }

  // -------------------------------- guest
  // after my local steps: report new shots and the hits I took; send my ship ~30 Hz
  guestFrame(W, dt) {
    const me = W.ships.find((q) => q.side === this.side);
    for (const b of W.bullets) {
      if (!b.local || this.sentIds.has(b.id)) continue;
      this.sentIds.add(b.id);
      this.outShots.push({ id: b.id, x: r2(b.x), z: r2(b.z), vx: r2(b.vx), vz: r2(b.vz), life: r2(b.life), k: b.kind, d: b.dmg, p: b.pierce ? 1 : 0, h: b.home, age: r3(W.t - b.born) });
    }
    if (this.sentIds.size > 400) this.sentIds = new Set([...this.sentIds].slice(-200));
    for (const c of W.claims.splice(0)) {
      const q = ++this.seq;
      this.outClaims.push({ ...c, q });
      this.pending.push({ q, dmg: c.dmg | 0 });
      if (c.src === 'bullet') W.gone.add(c.ref);
    }
    this.sendT -= dt;
    const urgent = this.outShots.length || this.outClaims.length;
    if (!urgent && this.sendT > 0) return;
    this.sendT = 1 / 30;
    if (!me) return;
    this.raw({ type: 'input', s: [r3(me.x), r3(me.z), r3(me.vx), r3(me.vz), r3(me.a), r2(me.thrustK), r2(me.dashT)], f: this.outShots, c: this.outClaims, o: this.odN, rt: Math.round(this.rtt) });
    this.outShots = []; this.outClaims = [];
  }

  // the newest snapshot; returns the host's events to play
  guestSync(W) {
    if (!this.inbox.length) return [];
    const ev = [];
    let last = null;
    this.stat.snaps += this.inbox.length;
    for (const m of this.inbox) { for (const e of m.ev || []) ev.push(e); last = m; }
    this.inbox = [];
    const ack = last.s.ak | 0;
    this.pending = this.pending.filter((p) => p.q > ack);
    const now = this.serverNow;
    const down = now !== null && last.t ? clamp(now - last.t, 0, 400) : this.rtt / 2;
    const lead = clamp(((+last.hr || this.rtt) / 2 + down) / 1000, 0, 0.25);
    applyWorld(W, last.s, lead, this.side, this.pending.reduce((a, p) => a + p.dmg, 0));
    // my own shots, hits and dashes already played here
    return ev.filter((e) => !(e.side === this.side && (e.k === 'fire' || e.k === 'dash' || e.k === 'od' || (e.k === 'hit' && e.src !== 'storm' && e.src !== 'blast' && e.src !== 'mine' && e.src !== 'nova' && e.src !== 'hole' && e.src !== 'ram'))));
  }

  get stale() { return this.lastRecv && performance.now() - this.lastRecv > 4000; }
}
