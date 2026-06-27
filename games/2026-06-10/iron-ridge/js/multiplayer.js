// Lightweight online room presence for Iron Ridge. The solo game remains
// authoritative locally; rooms relay player poses and fire events so friends
// can drop visible co-op tanks into the same ridge.

import * as THREE from 'three';
import { buildTankMesh } from './tank.js';

const ROOM_KEY = 'iron_ridge_room';
const MP_NAME_KEY = 'iron_ridge_mp_name';
const DEFAULT_WS = 'wss://iron-ridge-online.jez237.workers.dev/ws';

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

class RemoteTank {
  constructor(scene, peer) {
    this.scene = scene;
    this.peer = peer;
    this.visual = buildTankMesh('scout');
    this.visual.root.traverse(o => {
      if (o.isMesh && o.material?.color) {
        o.material = o.material.clone();
        o.material.color.lerp(new THREE.Color(0x6aa8d8), 0.28);
      }
    });
    scene.add(this.visual.root);
    this.targetPos = new THREE.Vector3();
    this.targetQuat = new THREE.Quaternion();
    this.lastSeen = performance.now();
    this.hasState = false;
  }

  applyState(s) {
    this.lastSeen = performance.now();
    this.targetPos.set(Number(s.x) || 0, Number(s.y) || 2, Number(s.z) || 0);
    this.targetQuat.set(Number(s.qx) || 0, Number(s.qy) || 0, Number(s.qz) || 0, Number(s.qw) || 1).normalize();
    this.visual.turret.rotation.y = Number(s.turretYaw) || 0;
    this.visual.pivot.rotation.x = Number(s.barrelPitch) || 0;
    if (!this.hasState) {
      this.visual.root.position.copy(this.targetPos);
      this.visual.root.quaternion.copy(this.targetQuat);
      this.hasState = true;
    }
  }

  update(dt) {
    if (!this.hasState) return;
    const k = 1 - Math.exp(-16 * dt);
    this.visual.root.position.lerp(this.targetPos, k);
    this.visual.root.quaternion.slerp(this.targetQuat, k);
  }

  remove() {
    this.scene.remove(this.visual.root);
  }
}

export class Multiplayer {
  constructor({ scene, effects, onRemoteFire, onStatus }) {
    this.scene = scene;
    this.effects = effects;
    this.onRemoteFire = onRemoteFire;
    this.onStatus = onStatus || (() => {});
    this.ws = null;
    this.id = null;
    this.room = localStorage.getItem(ROOM_KEY) || '';
    this.name = localStorage.getItem(MP_NAME_KEY) || '';
    this.peers = new Map();
    this.lastState = 0;
    this.connected = false;
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

  connect(room, name) {
    this.disconnect(false);
    this.room = cleanRoom(room || this.room || randomRoom());
    this.name = cleanName(name || this.name || 'TANKER');
    localStorage.setItem(ROOM_KEY, this.room);
    localStorage.setItem(MP_NAME_KEY, this.name);
    this.status(`Connecting to ${this.room}...`);

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
        this.connected = true;
        this.send({ type: 'hello', name: this.name });
        this.status(`Room ${this.room} connected`);
        settle(true, this);
      };
      ws.onclose = () => {
        if (this.ws === ws) {
          this.connected = false;
          this.ws = null;
          this.status(this.room ? `Room ${this.room} disconnected` : 'Disconnected');
        }
        settle(false, new Error('room closed'));
      };
      ws.onerror = () => {
        this.status('Room connection failed');
        settle(false, new Error('room connection failed'));
      };
      ws.onmessage = (event) => this.handle(event.data);
    });
  }

  disconnect(clear = true) {
    if (this.ws) {
      try { this.ws.close(1000, 'leave'); } catch {}
    }
    this.ws = null;
    this.connected = false;
    this.id = null;
    for (const peer of this.peers.values()) peer.remote?.remove();
    this.peers.clear();
    if (clear) this.status('Disconnected');
  }

  send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    this.ws.send(JSON.stringify(data));
    return true;
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
    if (data.type === 'peers') {
      const live = new Set((data.peers || []).filter(p => p.id !== this.id).map(p => p.id));
      for (const [id, peer] of this.peers) {
        if (!live.has(id)) {
          peer.remote?.remove();
          this.peers.delete(id);
        }
      }
      for (const p of data.peers || []) {
        if (!p.id || p.id === this.id) continue;
        const peer = this.peers.get(p.id) || { id: p.id, name: cleanName(p.name || 'ALLY'), remote: null };
        peer.name = cleanName(p.name || peer.name);
        this.peers.set(p.id, peer);
      }
      this.status(`Room ${this.room} · ${this.peers.size + 1} online`);
      return;
    }
    if (!data.from || data.from === this.id) return;
    const peer = this.peers.get(data.from) || { id: data.from, name: cleanName(data.name || 'ALLY'), remote: null };
    peer.name = cleanName(data.name || peer.name);
    if (data.type === 'state' && data.state) {
      if (!peer.remote) peer.remote = new RemoteTank(this.scene, peer);
      peer.remote.applyState(data.state);
      this.peers.set(peer.id, peer);
    } else if (data.type === 'fire') {
      this.onRemoteFire?.(data.shot, peer);
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

  update(dt, packet) {
    const now = performance.now();
    for (const [id, peer] of this.peers) {
      peer.remote?.update(dt);
      if (peer.remote && now - peer.remote.lastSeen > 12000) {
        peer.remote.remove();
        this.peers.delete(id);
      }
    }
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
