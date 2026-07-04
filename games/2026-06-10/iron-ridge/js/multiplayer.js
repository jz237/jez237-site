// Online co-op for Iron Ridge. The room's senior member (earliest joiner)
// hosts the authoritative enemy simulation and broadcasts it; other clients
// render ghost enemies, forward their shell hits to the host, and replicate
// enemy fire locally. Player poses and cannon fire relay peer-to-peer as
// before.

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { buildTankMesh } from './tank.js?v=3';
import { ENEMY_TYPES, CG, TANK } from './config.js?v=3';

const ROOM_KEY = 'iron_ridge_room';
const MP_NAME_KEY = 'iron_ridge_mp_name';
const DEFAULT_WS = 'wss://iron-ridge-online.jez237.workers.dev/ws';
const RECONNECT_DELAYS = [900, 1800, 3600, 6000, 9000];

const clampText = (value, fallback, max) => {
  const clean = String(value || fallback || '')
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
    .slice(0, max);
  return clean || fallback;
};

export function randomRoom() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(36).padStart(2, '0')).join('').slice(0, 6).toUpperCase();
}

export function cleanRoom(value) { return clampText(value, randomRoom(), 24); }
export function cleanName(value) { return clampText(value, 'TANKER', 12); }

const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const r3 = (v) => Math.round(v * 1000) / 1000;

// visual tank origin sits at ground level; peers send physics-body positions
const BODY_TO_VISUAL_Y = 0.74;

class RemoteTank {
  constructor(scene, world, peer) {
    this.scene = scene;
    this.world = world;
    this.peer = peer;
    this.visual = buildTankMesh('scout');
    this.visual.root.traverse(o => {
      if (o.isMesh && o.material?.color) {
        o.material = o.material.clone();
        o.material.color.lerp(new THREE.Color(0x6aa8d8), 0.28);
      }
    });
    scene.add(this.visual.root);
    this.label = makeNameLabel(peer.name || 'ALLY');
    this.label.position.set(0, 3.2, 0);
    this.visual.root.add(this.label);
    this.targetPos = new THREE.Vector3();
    this.targetQuat = new THREE.Quaternion();
    this.lastSeen = performance.now();
    this.hasState = false;
    this.hp = 100;

    // kinematic proxy body: enemy AI raycasts line-of-sight at it, enemy
    // shells detonate on it, and tanks can't drive through it
    const half = TANK.chassisHalf;
    this.body = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.KINEMATIC,
      collisionFilterGroup: CG.PLAYER,
      collisionFilterMask: -1,
    });
    this.body.addShape(
      new CANNON.Box(new CANNON.Vec3(half.x, half.y, half.z)),
      new CANNON.Vec3(0, 0.55, 0),
    );
    this.body.userData = { kind: 'remoteAlly', peer };
    world.addBody(this.body);
    // adapter the enemy AI can target like a player tank
    this.targetAdapter = { alive: true, body: this.body };
  }

  applyState(s) {
    const now = performance.now();
    const dtState = Math.max(0.05, (now - this.lastSeen) / 1000);
    this.lastSeen = now;
    this.hp = Math.max(0, Number(s.hp) || 0);
    updateNameLabel(this.label, this.peer.name || 'ALLY', this.hp / 100);
    const nx = Number(s.x) || 0, ny = Number(s.y) || 2, nz = Number(s.z) || 0;
    if (this.hasState) {
      this.body.velocity.set(
        (nx - this.targetPos.x) / dtState,
        (ny - this.targetPos.y) / dtState,
        (nz - this.targetPos.z) / dtState,
      );
    }
    this.targetPos.set(nx, ny, nz);
    this.targetQuat.set(Number(s.qx) || 0, Number(s.qy) || 0, Number(s.qz) || 0, Number(s.qw) || 1).normalize();
    this.visual.turret.rotation.y = Number(s.turretYaw) || 0;
    this.visual.pivot.rotation.x = Number(s.barrelPitch) || 0;
    if (!this.hasState) {
      this.visual.root.position.copy(this.targetPos);
      this.visual.root.position.y -= BODY_TO_VISUAL_Y;
      this.visual.root.quaternion.copy(this.targetQuat);
      this.hasState = true;
    }
    this.body.position.set(nx, ny, nz);
  }

  update(dt) {
    if (!this.hasState) return;
    const k = 1 - Math.exp(-16 * dt);
    _lerpTarget.copy(this.targetPos);
    _lerpTarget.y -= BODY_TO_VISUAL_Y;
    this.visual.root.position.lerp(_lerpTarget, k);
    this.visual.root.quaternion.slerp(this.targetQuat, k);
  }

  remove() {
    this.scene.remove(this.visual.root);
    this.world.removeBody(this.body);
    this.label.material.map?.dispose?.();
    this.label.material.dispose();
  }
}
const _lerpTarget = new THREE.Vector3();

// ghost of a host-simulated enemy tank on a client's screen
const ENEMY_TYPE_CHARS = {
  s: { name: 'scout', scheme: 'scout' },
  t: { name: 'standard', scheme: 'desert' },
  h: { name: 'heavy', scheme: 'heavy' },
  b: { name: 'boss', scheme: 'boss' },
};

class RemoteEnemy {
  constructor(scene, world, id, typeChar) {
    const spec = ENEMY_TYPE_CHARS[typeChar] || ENEMY_TYPE_CHARS.t;
    const T = ENEMY_TYPES[spec.name];
    this.scene = scene;
    this.world = world;
    this.id = id;
    this.typeName = spec.name;
    this.scale = T.scale;
    this.hp = T.hp;
    this.maxHp = T.hp;
    this.alive = true;
    this.deadT = 0;
    this.visual = buildTankMesh(spec.scheme);
    this.visual.root.scale.setScalar(T.scale);
    scene.add(this.visual.root);
    this.targetPos = new THREE.Vector3();
    this.targetQuat = new THREE.Quaternion();
    this.hasState = false;

    const half = TANK.chassisHalf;
    this.body = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.KINEMATIC,
      collisionFilterGroup: CG.ENEMY,
      collisionFilterMask: -1,
    });
    this.body.addShape(
      new CANNON.Box(new CANNON.Vec3(half.x * T.scale, half.y * T.scale, half.z * T.scale)),
      new CANNON.Vec3(0, 0.55 * T.scale, 0),
    );
    this.body.userData = { kind: 'remoteEnemy', remoteEnemy: this, id };
    world.addBody(this.body);
  }

  applyState(x, y, z, qx, qy, qz, qw, turretYaw, barrelPitch, hp) {
    this.hp = hp;
    this.targetPos.set(x, y, z);
    this.targetQuat.set(qx, qy, qz, qw).normalize();
    this.visual.turret.rotation.y = turretYaw;
    this.visual.pivot.rotation.x = barrelPitch;
    if (!this.hasState) {
      this.visual.root.position.copy(this.targetPos);
      this.visual.root.position.y -= BODY_TO_VISUAL_Y * this.scale;
      this.visual.root.quaternion.copy(this.targetQuat);
      this.hasState = true;
    }
    this.body.position.set(x, y, z);
  }

  update(dt) {
    if (!this.hasState) return;
    if (!this.alive) {
      this.deadT += dt;
      return;
    }
    const k = 1 - Math.exp(-14 * dt);
    _lerpTarget.copy(this.targetPos);
    _lerpTarget.y -= BODY_TO_VISUAL_Y * this.scale;
    this.visual.root.position.lerp(_lerpTarget, k);
    this.visual.root.quaternion.slerp(this.targetQuat, k);
  }

  // charred wreck stays as scenery for a while; the body goes immediately
  die() {
    if (!this.alive) return;
    this.alive = false;
    this.world.removeBody(this.body);
    this.visual.root.traverse(o => {
      if (o.isMesh && o.material && !o.userData.charred) {
        o.userData.charred = true;
        o.material = new THREE.MeshStandardMaterial({ color: 0x232323, roughness: 1 });
      }
    });
  }

  remove() {
    this.scene.remove(this.visual.root);
    if (this.alive) this.world.removeBody(this.body);
  }
}

function makeNameLabel(name) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: renderNameTexture(name, 1),
    transparent: true,
    depthTest: false,
    depthWrite: false,
  }));
  sprite.scale.set(3.6, 0.9, 1);
  sprite.userData.labelKey = `${cleanName(name || 'ALLY')}|10`;
  return sprite;
}

function updateNameLabel(sprite, name, hpFrac = 1) {
  const clean = cleanName(name || 'ALLY');
  // bucket hp to tenths so the texture doesn't redraw every packet
  const bucket = Math.max(0, Math.min(10, Math.ceil(hpFrac * 10)));
  const key = `${clean}|${bucket}`;
  if (!sprite || sprite.userData.labelKey === key) return;
  const old = sprite.material.map;
  sprite.material.map = renderNameTexture(clean, bucket / 10);
  sprite.userData.labelKey = key;
  old?.dispose?.();
}

function renderNameTexture(name, hpFrac = 1) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 80;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = 'rgba(5, 10, 6, 0.74)';
  roundRect(ctx, 12, 6, 232, 42, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(130, 190, 255, 0.9)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#dcedff';
  ctx.font = '800 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(cleanName(name || 'ALLY'), 128, 28, 210);
  // armour bar under the name
  ctx.fillStyle = 'rgba(5, 10, 6, 0.74)';
  roundRect(ctx, 48, 56, 160, 14, 7);
  ctx.fill();
  if (hpFrac > 0) {
    ctx.fillStyle = hpFrac > 0.5 ? '#7fd24f' : hpFrac > 0.25 ? '#e8c84a' : '#e0563c';
    roundRect(ctx, 51, 59, 154 * hpFrac, 8, 4);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export class Multiplayer {
  constructor({ scene, world, effects, onRemoteFire, onStatus, onEnemyFire, onEnemyKill, onHitForward, onWave, onWaveClear, onRoleChange, onPing, onConvoy, onTruckKill }) {
    this.scene = scene;
    this.world = world;
    this.effects = effects;
    this.onRemoteFire = onRemoteFire;
    this.onStatus = onStatus || (() => {});
    this.onEnemyFire = onEnemyFire || (() => {});
    this.onEnemyKill = onEnemyKill || (() => {});
    this.onHitForward = onHitForward || (() => {});
    this.onWave = onWave || (() => {});
    this.onWaveClear = onWaveClear || (() => {});
    this.onRoleChange = onRoleChange || (() => {});
    this.onPing = onPing || (() => {});
    this.onConvoy = onConvoy || (() => {});
    this.onTruckKill = onTruckKill || (() => {});
    this.ws = null;
    this.id = null;
    this.joinedAt = 0;
    this.room = localStorage.getItem(ROOM_KEY) || '';
    this.name = localStorage.getItem(MP_NAME_KEY) || '';
    this.peers = new Map();
    this.remoteEnemies = new Map();
    this.remoteWave = 0;
    this.lastState = 0;
    this.lastEnemyState = 0;
    this.wasHost = true;
    this.localActive = false; // main sets this while a run is live
    this.coopBroken = false;  // set when the relay won't pass co-op events
    this.clientSince = 0;
    this.lastEs = 0;
    this.connected = false;
    this.connecting = false;
    this.manualClose = false;
    this.reconnectAttempts = 0;
    this.heartbeatTimer = 0;
    this.reconnectTimer = 0;
    this.latency = 0;
    this.lastPong = 0;
  }

  // The senior IN-BATTLE member (earliest joiner, id as tie-break) hosts the
  // authoritative enemy sim. Members idling in the menu don't count — their
  // sim isn't running. Solo/offline players host trivially.
  isHost() {
    if (this.coopBroken) return true; // legacy relay: everyone self-hosts
    if (!this.connected || !this.id) return true;
    const now = performance.now();
    let bestId = null;
    let bestJoin = Infinity;
    if (this.localActive) {
      bestId = this.id;
      bestJoin = this.joinedAt || Infinity;
    }
    for (const peer of this.peers.values()) {
      if (!peer.remote || now - peer.remote.lastSeen > 6000) continue; // not in battle
      const j = peer.joinedAt ?? Infinity;
      if (j < bestJoin || (j === bestJoin && (bestId === null || peer.id < bestId))) {
        bestJoin = j;
        bestId = peer.id;
      }
    }
    return bestId === null || bestId === this.id;
  }

  checkRole() {
    const host = this.isHost();
    if (host !== this.wasHost) {
      this.wasHost = host;
      this.onRoleChange(host);
    }
  }

  // alive allies the enemy AI can target
  allyTargets() {
    const out = [];
    const now = performance.now();
    for (const peer of this.peers.values()) {
      if (!peer.remote || peer.down) continue;
      if (now - peer.remote.lastSeen > 6000) continue;
      if (peer.remote.hp <= 0) continue;
      out.push(peer.remote.targetAdapter);
    }
    return out;
  }

  anyAllyAlive() {
    return this.connected && this.allyTargets().length > 0;
  }

  // allies for the minimap / HUD arrows
  allyBlips() {
    const out = [];
    const now = performance.now();
    for (const peer of this.peers.values()) {
      if (!peer.remote || !peer.remote.hasState) continue;
      if (now - peer.remote.lastSeen > 15000) continue;
      out.push({
        name: peer.name,
        hp: peer.remote.hp,
        down: !!peer.down,
        x: peer.remote.visual.root.position.x,
        z: peer.remote.visual.root.position.z,
        position: peer.remote.visual.root.position,
      });
    }
    return out;
  }

  // live remote enemies shaped like WaveManager entries so the minimap,
  // HUD arrows, and aim assist can consume them unchanged
  enemyBlips() {
    const out = [];
    for (const re of this.remoteEnemies.values()) {
      if (!re.alive || !re.hasState) continue;
      out.push({ tank: { alive: true, body: re.body, visual: re.visual, scale: re.scale } });
    }
    return out;
  }

  clearRemoteEnemies() {
    for (const re of this.remoteEnemies.values()) re.remove();
    this.remoteEnemies.clear();
  }

  wsBase() {
    if (window.IRON_RIDGE_WS) return window.IRON_RIDGE_WS;
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return 'ws://127.0.0.1:8787/ws';
    return DEFAULT_WS;
  }

  status(text) { this.onStatus(text, this); }

  url(room) {
    return `${this.wsBase().replace(/\/+$/, '')}/${encodeURIComponent(cleanRoom(room))}`;
  }

  httpBase() {
    return this.wsBase()
      .replace(/^wss:/, 'https:')
      .replace(/^ws:/, 'http:')
      .replace(/\/ws\/?$/, '');
  }

  async fetchRooms() {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 6000);
    try {
      const res = await fetch(`${this.httpBase()}/rooms`, { cache: 'no-store', signal: ctl.signal });
      const data = await res.json();
      return Array.isArray(data.rooms) ? data.rooms.map(room => ({
        room: cleanRoom(room.room),
        host: cleanName(room.host || 'TANKER'),
        count: Math.max(0, Number(room.count) || 0),
      })) : [];
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  async findMatch() {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 6000);
    try {
      const res = await fetch(`${this.httpBase()}/match`, { cache: 'no-store', signal: ctl.signal });
      const data = await res.json();
      return data?.room ? {
        room: cleanRoom(data.room),
        host: cleanName(data.host || 'TANKER'),
        count: Math.max(0, Number(data.count) || 0),
      } : null;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  onlineCount() {
    return this.connected ? this.peers.size + 1 : 0;
  }

  connect(room, name, opts = {}) {
    this.disconnect(false);
    this.manualClose = false;
    this.connecting = true;
    this.room = cleanRoom(room || this.room || randomRoom());
    this.name = cleanName(name || this.name || 'TANKER');
    localStorage.setItem(ROOM_KEY, this.room);
    localStorage.setItem(MP_NAME_KEY, this.name);
    this.status(opts.reconnect ? `Reconnecting to ${this.room}...` : `Connecting to ${this.room}...`);

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.url(this.room));
      let settled = false;
      const settle = (ok, value) => {
        if (settled) return;
        settled = true;
        if (ok) resolve(value);
        else reject(value);
      };
      this.ws = ws;
      ws.onopen = () => {
        this.connecting = false;
        this.connected = true;
        this.reconnectAttempts = 0;
        this.lastPong = performance.now();
        this.send({ type: 'hello', name: this.name });
        this.startHeartbeat();
        this.status(`Room ${this.room} connected`);
        settle(true, this);
      };
      ws.onclose = () => {
        if (this.ws === ws) {
          this.connecting = false;
          this.connected = false;
          this.ws = null;
          this.stopHeartbeat();
          for (const peer of this.peers.values()) peer.remote?.remove();
          this.peers.clear();
          this.clearRemoteEnemies();
          this.checkRole(); // offline → back to hosting your own battle
          if (!this.manualClose && this.room) this.scheduleReconnect();
          else this.status(this.room ? `Room ${this.room} disconnected` : 'Disconnected');
        }
        settle(false, new Error('room closed'));
      };
      ws.onerror = () => {
        this.connecting = false;
        this.status('Room connection failed');
        settle(false, new Error('room connection failed'));
      };
      ws.onmessage = (event) => this.handle(event.data);
    });
  }

  disconnect(clear = true) {
    this.manualClose = true;
    this.stopHeartbeat();
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = 0;
    this.connecting = false;
    if (this.ws) {
      try { this.ws.close(1000, 'leave'); } catch {}
    }
    this.ws = null;
    this.connected = false;
    this.id = null;
    this.joinedAt = 0;
    this.coopBroken = false;
    this.clientSince = 0;
    this.lastEs = 0;
    for (const peer of this.peers.values()) peer.remote?.remove();
    this.peers.clear();
    this.clearRemoteEnemies();
    this.checkRole();
    if (clear) this.status('Disconnected');
  }

  send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    this.ws.send(JSON.stringify(data));
    return true;
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (!this.connected) return;
      const now = performance.now();
      this.send({ type: 'ping', t: now });
      if (this.lastPong && now - this.lastPong > 22000) {
        this.status(`Room ${this.room} connection stalled`);
      }
    }, 5000);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = 0;
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return;
    const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempts, RECONNECT_DELAYS.length - 1)];
    this.reconnectAttempts++;
    this.status(`Connection dropped. Reconnecting in ${Math.ceil(delay / 1000)}s...`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = 0;
      this.connect(this.room, this.name, { reconnect: true }).catch(() => {});
    }, delay);
  }

  handle(raw) {
    let data;
    try { data = JSON.parse(raw); } catch { return; }
    if (data.type === 'welcome') {
      this.id = data.id;
      this.room = cleanRoom(data.room || this.room);
      this.status(`Room ${this.room} · ${Math.max(1, Number(data.count) || 1)} online`);
      return;
    }
    if (data.type === 'pong') {
      this.lastPong = performance.now();
      this.latency = Math.max(0, Math.round(this.lastPong - (Number(data.t) || this.lastPong)));
      return;
    }
    if (data.type === 'peers') {
      const live = new Set((data.peers || []).filter(p => p.id !== this.id).map(p => p.id));
      for (const [id, peer] of this.peers) {
        if (!live.has(id)) {
          peer.remote?.remove();
          this.peers.delete(id);
        }
      }
      for (const p of data.peers || []) {
        if (!p.id) continue;
        if (p.id === this.id) {
          this.joinedAt = Number(p.joinedAt) || this.joinedAt;
          continue;
        }
        const peer = this.peers.get(p.id) || { id: p.id, name: cleanName(p.name || 'ALLY'), remote: null, down: false, joinedAt: Infinity };
        peer.name = cleanName(p.name || peer.name);
        peer.joinedAt = Number(p.joinedAt) || peer.joinedAt;
        this.peers.set(p.id, peer);
      }
      this.status(`Room ${this.room} · ${this.peers.size + 1} online`);
      this.checkRole();
      return;
    }
    if (!data.from || data.from === this.id) return;
    const peer = this.peers.get(data.from) || { id: data.from, name: cleanName(data.name || 'ALLY'), remote: null, down: false, joinedAt: Infinity };
    peer.name = cleanName(data.name || peer.name);
    if (data.type === 'state' && data.state) {
      if (!peer.remote) peer.remote = new RemoteTank(this.scene, this.world, peer);
      if (data.state.state === 'playing' && (Number(data.state.hp) || 0) > 0) peer.down = false;
      peer.remote.applyState(data.state);
      this.peers.set(peer.id, peer);
    } else if (data.type === 'fire') {
      this.onRemoteFire?.(data.shot, peer);
    } else if (data.type === 'down') {
      peer.down = true;
      this.peers.set(peer.id, peer);
    } else if (data.type === 'hit') {
      // a client reports its shell connected with one of my enemies
      if (this.isHost()) {
        this.onHitForward(String(data.id ?? ''), Math.max(0, Math.min(120, Number(data.dmg) || 0)), peer);
      }
    } else if (data.type === 'es') {
      this.applyEnemyState(data);
    } else if (data.type === 'ek') {
      if (this.isHost()) return;
      const id = String(data.id ?? '');
      const re = this.remoteEnemies.get(id);
      const pos = new THREE.Vector3(Number(data.x) || 0, Number(data.y) || 0, Number(data.z) || 0);
      if (re?.alive && re.hasState) pos.copy(re.visual.root.position);
      re?.die();
      this.onEnemyKill(id, pos, String(data.credit ?? ''));
    } else if (data.type === 'ef') {
      if (this.isHost()) return;
      const origin = new THREE.Vector3(Number(data.ox) || 0, Number(data.oy) || 2, Number(data.oz) || 0);
      const dir = new THREE.Vector3(Number(data.dx) || 0, Number(data.dy) || 0, Number(data.dz) || 1);
      if (dir.lengthSq() < 1e-6) return;
      this.onEnemyFire(origin, dir.normalize(), Math.max(0, Math.min(60, Number(data.dmg) || 14)));
    } else if (data.type === 'wv') {
      if (this.isHost()) return;
      this.remoteWave = Math.max(0, Number(data.w) || 0);
      this.onWave(this.remoteWave, Math.max(0, Number(data.n) || 0));
    } else if (data.type === 'wc') {
      if (this.isHost()) return;
      this.onWaveClear(Math.max(0, Number(data.w) || 0));
    } else if (data.type === 'pg') {
      // squad ping — throttle to 1/s per peer so it can't be spammed
      const now = performance.now();
      if (now - (peer.lastPingAt || 0) < 1000) return;
      peer.lastPingAt = now;
      this.peers.set(peer.id, peer);
      this.onPing(
        new THREE.Vector3(Number(data.x) || 0, Number(data.y) || 0, Number(data.z) || 0),
        peer.name,
      );
    } else if (data.type === 'cv') {
      if (this.isHost()) return;
      const layout = {
        cx: Number(data.cx) || 0, cz: Number(data.cz) || 0,
        dirX: Number(data.dx) || 1, dirZ: Number(data.dz) || 0,
      };
      const len = Math.hypot(layout.dirX, layout.dirZ) || 1;
      layout.dirX /= len; layout.dirZ /= len;
      this.onConvoy(layout);
    } else if (data.type === 'ck') {
      this.onTruckKill(Math.max(0, Number(data.i) | 0));
    }
  }

  // host broadcast, applied on clients: wave number + all living enemies
  applyEnemyState(data) {
    this.lastEs = performance.now();
    if (this.isHost() || !Array.isArray(data.l)) return;
    this.remoteWave = Math.max(this.remoteWave, Number(data.w) || 0);
    const seen = new Set();
    for (const row of data.l) {
      if (!Array.isArray(row) || row.length < 12) continue;
      const id = String(row[0]);
      const tc = String(row[1]);
      seen.add(id);
      let re = this.remoteEnemies.get(id);
      if (!re) {
        re = new RemoteEnemy(this.scene, this.world, id, tc);
        this.remoteEnemies.set(id, re);
      }
      if (!re.alive) continue;
      re.applyState(
        Number(row[2]) || 0, Number(row[3]) || 0, Number(row[4]) || 0,
        Number(row[5]) || 0, Number(row[6]) || 0, Number(row[7]) || 0, Number(row[8]) || 1,
        Number(row[9]) || 0, Number(row[10]) || 0,
        Math.max(0, Number(row[11]) || 0),
      );
    }
    // living ghosts missing from the host list despawned host-side
    for (const [id, re] of this.remoteEnemies) {
      if (re.alive && re.hasState && !seen.has(id)) {
        re.remove();
        this.remoteEnemies.delete(id);
      }
    }
  }

  sendFire(shot) {
    if (!shot) return;
    this.send({
      type: 'fire',
      shot: {
        ox: shot.origin.x, oy: shot.origin.y, oz: shot.origin.z,
        dx: shot.dir.x, dy: shot.dir.y, dz: shot.dir.z,
      },
    });
  }

  // ---- co-op sync senders -------------------------------------------
  sendHit(enemyId, dmg) {
    this.send({ type: 'hit', id: enemyId, dmg: Math.round(dmg * 10) / 10 });
  }

  sendEnemyKill(enemyId, pos, creditId) {
    this.send({
      type: 'ek', id: enemyId, credit: creditId || '',
      x: r1(pos.x), y: r1(pos.y), z: r1(pos.z),
    });
  }

  sendEnemyFire(shot, dmg) {
    this.send({
      type: 'ef', dmg,
      ox: r2(shot.origin.x), oy: r2(shot.origin.y), oz: r2(shot.origin.z),
      dx: r3(shot.dir.x), dy: r3(shot.dir.y), dz: r3(shot.dir.z),
    });
  }

  sendWave(w, hostiles) { this.send({ type: 'wv', w, n: hostiles }); }
  sendWaveClear(w) { this.send({ type: 'wc', w }); }
  sendDown() { this.send({ type: 'down' }); }
  sendPing(x, y, z) { this.send({ type: 'pg', x: r1(x), y: r1(y), z: r1(z) }); }
  sendConvoy(layout) {
    this.send({
      type: 'cv',
      cx: r1(layout.cx), cz: r1(layout.cz),
      dx: r3(layout.dirX), dz: r3(layout.dirZ),
    });
  }
  sendTruckKill(cid) { this.send({ type: 'ck', i: cid }); }

  // host: broadcast living enemies at ~8Hz
  sendEnemyState(enemies, wave) {
    const now = performance.now();
    if (!this.connected || this.peers.size === 0 || now - this.lastEnemyState < 120) return;
    this.lastEnemyState = now;
    const l = [];
    for (const e of enemies) {
      const t = e.tank;
      if (!t.alive) continue;
      const b = t.body;
      l.push([
        e.id, e.typeName === 'standard' ? 't' : e.typeName[0],
        r2(b.position.x), r2(b.position.y), r2(b.position.z),
        r3(b.quaternion.x), r3(b.quaternion.y), r3(b.quaternion.z), r3(b.quaternion.w),
        r3(t.turretYaw), r3(t.barrelPitch),
        Math.ceil(t.hp),
      ]);
    }
    this.send({ type: 'es', w: wave, l });
  }

  update(dt, packet) {
    const now = performance.now();
    for (const [id, peer] of this.peers) {
      peer.remote?.update(dt);
      if (peer.remote && now - peer.remote.lastSeen > 12000) {
        peer.remote.remove();
        this.peers.delete(id);
      }
    }
    for (const [id, re] of this.remoteEnemies) {
      re.update(dt);
      if (!re.alive && re.deadT > 25) {
        re.remove();
        this.remoteEnemies.delete(id);
      }
    }
    // legacy-relay fallback: if we've been a client for 8s without a single
    // enemy-state broadcast, the relay (or the host's build) predates co-op
    // sync — revert to hosting our own battle rather than an empty field
    if (this.connected && this.localActive && !this.coopBroken && !this.isHost()) {
      if (!this.clientSince) this.clientSince = now;
      if (now - Math.max(this.clientSince, this.lastEs) > 8000 && this.remoteEnemies.size === 0) {
        this.coopBroken = true;
      }
    } else if (this.isHost()) {
      this.clientSince = 0;
    }
    this.checkRole(); // freshness-based election: re-evaluate continuously
    if (!this.connected || !packet || now - this.lastState < 75) return;
    this.lastState = now;
    this.send({ type: 'state', state: packet, name: this.name });
  }

  shareUrl() {
    const url = new URL(location.href);
    url.searchParams.set('room', cleanRoom(this.room || randomRoom()));
    return url.toString();
  }
}
