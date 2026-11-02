// Online two-player co-op over the site's shared relay worker.
// The host runs the shift (enemies, objects, clock, score, lives); the guest runs its own Mac locally,
// reports what it does, and gets a compact world snapshot back about 12 times a second.
import * as THREE from 'three';
import { Puppet } from './characters.js';

const WS = 'wss://iron-ridge-online.jez237.workers.dev/ws/';
const TAG = 'hhm1'; // every message carries g: TAG, so anyone else who lands in the room is ignored
const CODE = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const MODES = ['idle', 'walk', 'air', 'climb', 'rivet', 'flat', 'hurt', 'cheer', 'crank'];
const CARRY = [null, 'girder', 'crate', 'topbeam'];
const CS = ['rest', 'carried', 'placed', 'falling', 'delivering', 'gone'];
const SS = ['empty', 'placed', 'riveted', 'removed'];
const LAG = .08; // assumed one-way delay when lining up hazard clocks

export function roomCode() { const b = new Uint8Array(5); crypto.getRandomValues(b); return [...b].map(x => CODE[x % CODE.length]).join(''); }
export const cleanName = s => String(s || '').toUpperCase().replace(/[^A-Z0-9 _-]/g, '').trim().slice(0, 12);
export const cleanRoom = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
const r2 = v => Math.round(v * 100) / 100;

// Mac's pose as sent over the wire: x, y, z, yaw, flags, vy
export function poseOf(p) {
  const b = p.body, mode = p.dead ? (p.deathMode === 'flat' ? 'flat' : 'hurt') : p.state === 'climb' ? 'climb' : p.state === 'rivet' ? 'rivet' : p.state === 'crank' ? 'crank' : p.game.cheer ? 'cheer' : !b.onGround ? 'air' : Math.hypot(b.vx, b.vz) > .4 ? 'walk' : 'idle';
  const fl = MODES.indexOf(mode) | (Math.max(0, CARRY.indexOf(p.carry ? p.carry.kind : null)) << 4) | (p.dead ? 64 : 0) | (p.invuln > 0 ? 128 : 0) | (p.shield ? 256 : 0) | (p.swingT > 0 || p.shoveT > 0 ? 512 : 0) | (p.dead && p.deathMode === 'gone' ? 1024 : 0);
  return [r2(b.x), r2(b.y), r2(b.z), Math.round(p.yaw * 1000) / 1000, fl, r2(b.vy)];
}

function nameTag(name) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d');
  x.fillStyle = 'rgba(14,22,36,.8)'; x.fillRect(18, 10, 220, 44); x.strokeStyle = '#6fb7ff'; x.lineWidth = 3; x.strokeRect(18, 10, 220, 44);
  x.fillStyle = '#e4f1ff'; x.font = '26px Bungee, Impact, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(name, 128, 33, 200);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false })); s.scale.set(1.6, .4, 1); s.renderOrder = 9;
  return s;
}

// The other player's Mac: a blue-vested puppet with a name tag, played back ~110 ms behind its poses.
export class Partner {
  constructor(game, name) {
    this.g = game; this.name = name; this.rig = new Puppet('mac2'); this.root = this.rig.root; game.scene.add(this.root);
    this.body = { x: 0, y: -100, z: 0, vx: 0, vy: 0, vz: 0, r: .33, h: 1.75 };
    this.yaw = 0; this.dead = true; this.invuln = 1; this.shield = false; this.buf = []; this.hitCd = 0; this.held = null;
    this.tag = nameTag(name); this.root.add(this.tag); this.tag.position.y = 2.4; this.root.visible = false;
  }
  push(p, t) { this.buf.push({ t, x: p[0], y: p[1], z: p[2], yaw: p[3], fl: p[4], vy: p[5] || 0 }); if (this.buf.length > 24) this.buf.shift(); }
  update(dt, now) {
    this.hitCd -= dt;
    const B = this.buf; if (!B.length) { this.root.visible = false; return; }
    const rt = now - 110; let a = B[B.length - 1], b = a;
    for (let i = 0; i < B.length - 1; i++) if (B[i].t <= rt && B[i + 1].t >= rt) { a = B[i]; b = B[i + 1]; break; }
    const k = b.t > a.t ? Math.min(1, Math.max(0, (rt - a.t) / (b.t - a.t))) : 1;
    const pb = this.body, x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k, z = a.z + (b.z - a.z) * k;
    pb.vx = (x - pb.x) / Math.max(dt, 1e-3); pb.vz = (z - pb.z) / Math.max(dt, 1e-3); pb.vy = b.vy; pb.x = x; pb.y = y; pb.z = z;
    let dy = b.yaw - a.yaw; if (dy > Math.PI) dy -= Math.PI * 2; if (dy < -Math.PI) dy += Math.PI * 2;
    this.yaw = a.yaw + dy * k;
    const fl = b.fl, mode = MODES[fl & 15] || 'idle'; this.carryKind = CARRY[(fl >> 4) & 3];
    this.dead = !!(fl & 64); this.invuln = fl & 128 ? 1 : 0; this.shield = !!(fl & 256);
    const swing = fl & 512 ? (this.swingT = (this.swingT || 0) + dt) : (this.swingT = 0);
    this.root.visible = !(fl & 1024) && this.g.state !== 'title';
    this.root.position.set(x, y, z); this.root.rotation.y = this.yaw;
    const speed = Math.min(1.4, Math.hypot(pb.vx, pb.vz) / 5.4);
    this.rig.update(dt, { mode, speed, vy: pb.vy, carry: this.carryKind, climbPhase: now * .009, swing: swing ? Math.min(1, swing / .45) : 0 });
    if (this.rig.hatMat) this.rig.hatMat.color.setHex(this.shield ? 0xffd84a : 0xf4f4f4);
  }
  attach(o) {
    const m = o.mesh; this.held = o;
    if (o.kind === 'girder') { this.rig.shoulderAnchor.add(m); m.position.set(0, .08, 0); m.rotation.set(0, Math.PI / 2, 0); m.scale.setScalar(.72); }
    else if (o.kind === 'topbeam') { this.rig.frontAnchor.add(m); m.position.set(0, -.15, .05); m.rotation.set(0, 0, 0); m.scale.setScalar(.6); }
    else { this.rig.frontAnchor.add(m); m.position.set(0, -.3, .1); m.rotation.set(0, 0, 0); m.scale.setScalar(.85); }
  }
  dispose() { this.g.scene.remove(this.root); }
}

export class Coop {
  constructor(game) { this.g = game; this.ws = null; this.role = null; this.room = ''; this.name = 'MAC'; this.id = null; this.partnerId = null; this.partnerName = ''; this.status = 'Not connected.'; this.sendT = 0; this.onStatus = null; }
  get linked() { return !!(this.ws && this.partnerId); }
  setStatus(t) { this.status = t; this.onStatus && this.onStatus(t); }
  connect(role, room, name) {
    this.leave(true);
    this.role = role; this.room = cleanRoom(room); this.name = cleanName(name) || 'MAC';
    let ws; try { ws = new WebSocket(WS + 'HHM-' + this.room); } catch { this.setStatus('Could not reach the co-op server.'); return; }
    this.ws = ws; this.setStatus(`Connecting to room ${this.room}…`);
    ws.onopen = () => { try { ws.send(JSON.stringify({ type: 'hello', name: this.name })); } catch {} };
    ws.onmessage = ev => this.onMsg(ev.data);
    ws.onclose = () => { if (this.ws === ws) { this.ws = null; this.lost('Connection closed.'); } };
    ws.onerror = () => { if (this.ws === ws) this.setStatus('Connection failed. Check the room code and try again.'); };
  }
  leave(quiet = false) {
    const had = !!this.partnerId;
    if (this.ws) { const w = this.ws; this.ws = null; try { w.close(1000, 'leave'); } catch {} }
    this.partnerId = null; this.role = null;
    if (had) this.g.coopPartnerLeft(null);
    if (!quiet) this.setStatus('Not connected.');
  }
  lost(msg) { const had = !!this.partnerId; this.partnerId = null; this.setStatus(msg); if (had) this.g.coopPartnerLeft(msg); }
  send(type, data) {
    if (!this.ws || this.ws.readyState !== 1) return;
    const s = JSON.stringify(Object.assign({ type, g: TAG }, data));
    if (s.length < 4000) try { this.ws.send(s); } catch {}
  }
  hello() { this.send('pg', { k: 'hi', role: this.role, name: this.name }); }
  onMsg(raw) {
    let d; try { d = JSON.parse(raw); } catch { return; }
    if (!d || typeof d !== 'object') return;
    if (d.type === 'welcome') { this.id = d.id; this.setStatus(this.role === 'host' ? `Room ${this.room} is open. Waiting for a partner to join…` : `Connected to room ${this.room}. Looking for the host…`); this.hello(); return; }
    if (d.type === 'peers') {
      const live = new Set((d.peers || []).map(p => p.id));
      if (this.partnerId && !live.has(this.partnerId)) this.lost(`${this.partnerName} left the room.`);
      if (!this.partnerId) this.hello();
      return;
    }
    if (d.g !== TAG || !d.from || d.from === this.id) return;
    if (d.type === 'pg' && d.k === 'hi') {
      if (this.partnerId || !d.role) return;
      if (d.role === this.role) { this.setStatus(d.role === 'host' ? 'That room already has a host. Join it instead, or host a new room.' : `Room ${this.room}: still waiting for the host…`); return; }
      this.partnerId = d.from; this.partnerName = cleanName(d.name) || 'MAC'; this.hello();
      this.setStatus(this.role === 'host' ? `${this.partnerName} joined! Pick a shift and start.` : `Joined ${this.partnerName}'s room. Waiting for them to start…`);
      this.g.coopPartnerJoined(this.partnerName);
      return;
    }
    if (d.from === this.partnerId) this.g.coopMessage(d);
  }
  // ---------------- host: world snapshot ----------------
  snapshot() {
    const G = this.g, o = G.objects, L = G.level;
    const holder = c => c.holder === 'g' ? 2 : c.state === 'carried' ? 1 : 0;
    return {
      k: 'w', t: r2(G.time), lt: Math.round(G.timeLeft * 10) / 10, sc: G.score, lv: G.lives, fz: G.frozen ? r2(G.freezeT) : 0,
      hp: poseOf(G.player),
      en: G.enemies.map(e => [r2(e.body.x), r2(e.body.y), r2(e.body.z), Math.round(e.yaw * 100) / 100, (e.ko > 0 ? 1 : 0) | (e.staggered ? 2 : 0) | (e.state === 'climb' ? 4 : 0) | (e.state === 'yank' ? 8 : 0), r2(e.ko)]),
      ca: o.carry.map(c => [CS.indexOf(c.state), r2(c.pos.x), r2(c.pos.y), r2(c.pos.z), c.axis === 'z' ? 1 : 0, holder(c)]),
      so: o.sockets.map(s => [SS.indexOf(s.state), s.rivets, s.girder ? o.carry.indexOf(s.girder) : -1]),
      pk: o.pickups.reduce((m, p, i) => p.taken ? m | (1 << i) : m, 0),
      st: o.stations.map(s => s.on ? -1 : Math.round(s.prog * 10) / 10),
      cp: o.checkpoints.reduce((m, c, i) => c.active ? m | (1 << i) : m, 0), cc: G.checkpoint ? o.checkpoints.indexOf(G.checkpoint) : -1,
      dl: o.delivered, tb: G.topBeam ? 1 : 0,
      mv: [...L.movers, ...L.hazards].map(h => h.sync ? h.sync() : 0),
    };
  }
  // ---------------- guest: apply the host's snapshot ----------------
  apply(s, now) {
    const G = this.g, o = G.objects, L = G.level, p = G.player;
    G.score = s.sc; G.lives = s.lv;
    if (Math.abs(G.timeLeft - s.lt) > .4) G.timeLeft = s.lt;
    G.frozen = s.fz > 0; G.freezeT = s.fz;
    if (G.partner) G.partner.push(s.hp, now);
    s.en.forEach((a, i) => { const e = G.enemies[i]; if (e && !(e.netLock > now)) e.net = a; });
    const H = [...L.movers, ...L.hazards];
    (s.mv || []).forEach((v, i) => { const h = H[i]; if (h && h.setSync && v) h.setSync(v, LAG); });
    if (s.tb && !G.topBeam) { G.topBeam = o.spawnTopBeam(); }
    // carryables
    s.ca.forEach((a, i) => {
      const c = o.carry[i]; if (!c || c.netLock > now) return;
      const st = CS[a[0]], hold = a[5];
      if (p.carry === c) { if (hold === 1) { p.carry = null; this.detach(c); } return; } // the host got it first
      if (hold === 1) { if (!(c.state === 'carried' && G.partner && G.partner.held === c) && G.partner) { c.state = 'carried'; c.beacon.visible = false; G.partner.attach(c); } return; }
      if (G.partner && G.partner.held === c && st !== 'carried') { G.partner.held = null; this.detach(c); }
      if (st === 'rest' || st === 'falling') {
        if (c.state === 'carried' || c.state === 'gone' || c.state === 'delivering') this.detach(c);
        if (Math.hypot(c.pos.x - a[1], c.pos.y - a[2], c.pos.z - a[3]) > .05) { c.pos.set(a[1], a[2], a[3]); c.axis = a[4] ? 'z' : 'x'; c.mesh.position.copy(c.pos); c.mesh.rotation.set(0, a[4] ? Math.PI / 2 : 0, 0); }
        if (st === 'rest') { c.state = 'rest'; c.vy = 0; } else if (c.state !== 'falling') { c.state = 'falling'; c.vy = 0; }
      } else if (st === 'gone' || st === 'delivering') {
        if (c.state !== 'gone' && c.state !== 'delivering') { if (o.bin && c.kind === 'girder') o.deliver(c, G, o.bin); else if (o.hopper) o.deliver(c, G); else { c.state = 'gone'; c.mesh.visible = false; } }
      }
    });
    // sockets (including old demolition beams)
    s.so.forEach(([code, rivets, ci], i) => {
      const k = o.sockets[i]; if (!k || k.netLock > now) return;
      const want = SS[code];
      if (want === 'empty' && (k.state === 'placed' || k.state === 'riveted') && !k.demo) o.unplace(k);
      else if ((want === 'placed' || want === 'riveted') && k.state === 'empty' && ci >= 0 && o.carry[ci]) { const c = o.carry[ci]; if (p.carry === c) p.carry = null; if (G.partner && G.partner.held === c) G.partner.held = null; o.place(c, k, G); G.audio.play('place', { pos: k.center, vol: .7 }); }
      else if (want === 'removed' && k.state === 'riveted' && k.demo) { o.unbolt(k); G.audio.play('place', { pos: k.center, vol: .7, rate: .8 }); }
      if (want === 'riveted' && k.state !== 'riveted' && !k.demo) { k.state = 'riveted'; k.anim = 1; for (const d of k.rivetDots) d.visible = false; G.audio.play('rivet_done', { pos: k.center, vol: .8, rate: .8 }); }
      if (k.state === 'placed' || (k.demo && k.state === 'riveted')) { k.rivets = rivets; k.rivetDots.forEach((d, j) => { if (k.demo) d.visible = j < rivets; else d.material.color.setHex(j < rivets ? 0x3a3a3a : 0xffe14a); }); }
    });
    o.pickups.forEach((pk, i) => { if ((s.pk >> i) & 1 && !pk.taken) { pk.taken = true; o.group.remove(pk.mesh, pk.halo); if (pk.beacon) o.group.remove(pk.beacon); G.audio.play('lunchbox', { pos: pk.pos, vol: .6 }); } });
    o.stations.forEach((st, i) => { const v = s.st[i]; if (st.netLock > now || v === undefined) return; if (v < 0 && !st.on) { o.stationOn(st); G.audio.play(st.kind === 'valve' ? 'pump_on' : 'switch_on', { pos: st.dev, vol: .8 }); } else if (v >= 0 && !st.on) st.prog = Math.max(st.prog, v); });
    o.checkpoints.forEach((c, i) => { if ((s.cp >> i) & 1 && !c.active) { c.active = true; c.flagMat.color.setHex(0x37d66b); c.flagMat.emissive.setHex(0x1f8f45); c.ringMat.color.setHex(0x37d66b); } });
    if (s.cc >= 0) G.checkpoint = o.checkpoints[s.cc];
    if (s.dl > o.delivered) { o.delivered = s.dl; G.audio.play(o.bin ? 'scrap_drop' : 'hopper', { vol: .6 }); }
  }
  detach(c) { const o = this.g.objects; o.group.attach(c.mesh); c.mesh.scale.setScalar(1); c.mesh.visible = true; c.mesh.position.copy(c.pos); c.mesh.rotation.set(0, c.axis === 'z' ? Math.PI / 2 : 0, 0); if (c.state === 'carried' || c.state === 'gone') c.state = 'rest'; c.beacon.visible = true; }
  // guest: move the render-only enemies toward the host's positions
  enemies(dt, now) {
    const G = this.g;
    for (const e of G.enemies) {
      const a = e.net; if (!a) continue;
      const b = e.body, k = 1 - Math.exp(-14 * dt), jump = Math.hypot(a[0] - b.x, a[2] - b.z) > 4;
      b.vx = (a[0] - b.x) * k / Math.max(dt, 1e-3); b.vz = (a[2] - b.z) * k / Math.max(dt, 1e-3);
      if (jump) { b.x = a[0]; b.y = a[1]; b.z = a[2]; } else { b.x += (a[0] - b.x) * k; b.y += (a[1] - b.y) * k; b.z += (a[2] - b.z) * k; }
      let dy = a[3] - e.yaw; if (dy > Math.PI) dy -= Math.PI * 2; if (dy < -Math.PI) dy += Math.PI * 2; e.yaw += dy * k;
      if (!(e.netLock > now)) { e.ko = a[4] & 1 ? Math.max(a[5], .01) : 0; e.staggered = !!(a[4] & 2); e.state = a[4] & 4 ? 'climb' : a[4] & 8 ? 'yank' : 'patrol'; }
      e.climbPh = (e.climbPh || 0) + dt * 7;
    }
  }
}
