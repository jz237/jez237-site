const MAX_CLIENTS = 12;
const MAX_MESSAGE = 4096;
const ROOM_TTL = 45000;

// co-op sync events relayed verbatim (see games/2026-06-10/iron-ridge/js/multiplayer.js):
// es=enemy state, ek=enemy kill, ef=enemy fire, wv=wave start, wc=wave clear,
// hit=damage forward to host, down=player destroyed, pg=squad ping,
// cv=convoy spawn, ck=convoy truck kill
const COOP_TYPES = new Set(['es', 'ek', 'ef', 'wv', 'wc', 'hit', 'down', 'pg', 'cv', 'ck']);

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      ...(init.headers || {}),
    },
  });
}

function cleanRoom(raw) {
  return String(raw || 'RIDGE')
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
    .slice(0, 24) || 'RIDGE';
}

function cleanName(raw) {
  return String(raw || 'TANKER')
    .toUpperCase()
    .replace(/[^A-Z0-9 _-]/g, '')
    .trim()
    .slice(0, 12) || 'TANKER';
}

function randomRoom() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) code += chars[byte % chars.length];
  return code;
}

export class IronRidgeRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.clients = new Map();
    this.room = 'RIDGE';
  }

  fetch(request) {
    if (request.headers.get('upgrade') !== 'websocket') {
      return new Response('Expected WebSocket\n', { status: 426 });
    }
    if (this.clients.size >= MAX_CLIENTS) {
      return new Response('Room full\n', { status: 409 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    server.accept();

    const url = new URL(request.url);
    const room = cleanRoom(url.pathname.split('/').filter(Boolean).pop());
    this.room = room;
    const id = crypto.randomUUID();
    const meta = { id, name: 'TANKER', joinedAt: Date.now(), ws: server };
    this.clients.set(id, meta);

    this.send(server, { type: 'welcome', id, room, count: this.clients.size });
    this.broadcastPeers();
    this.reportRoom();

    server.addEventListener('message', (event) => {
      if (typeof event.data !== 'string' || event.data.length > MAX_MESSAGE) return;
      let data;
      try { data = JSON.parse(event.data); } catch { return; }
      if (!data || typeof data !== 'object') return;

      if (data.type === 'hello') {
        meta.name = cleanName(data.name);
        this.broadcastPeers();
        this.reportRoom();
        return;
      }

      if (data.type === 'ping') {
        this.send(server, {
          type: 'pong',
          t: finite(data.t),
          count: this.clients.size,
          serverNow: Date.now(),
        });
        this.reportRoom();
        return;
      }

      if (data.type === 'state') {
        this.broadcast(id, {
          type: 'state',
          from: id,
          name: meta.name,
          state: sanitizeState(data.state),
        });
        return;
      }

      if (data.type === 'fire') {
        this.broadcast(id, {
          type: 'fire',
          from: id,
          name: meta.name,
          shot: sanitizeShot(data.shot),
        });
        return;
      }

      // co-op sync events (host-authoritative enemies): relay as-is with a
      // trusted sender id. Payloads are size-capped above and validated
      // client-side.
      if (COOP_TYPES.has(data.type)) {
        this.broadcast(id, { ...data, from: id, name: meta.name });
      }
    });

    const close = () => {
      if (this.clients.delete(id)) {
        this.broadcastPeers();
        this.reportRoom();
      }
    };
    server.addEventListener('close', close);
    server.addEventListener('error', close);

    return new Response(null, { status: 101, webSocket: client });
  }

  peers() {
    return [...this.clients.values()].map(({ id, name, joinedAt }) => ({ id, name, joinedAt }));
  }

  send(ws, data) {
    try { ws.send(JSON.stringify(data)); } catch {}
  }

  broadcast(skipId, data) {
    const body = JSON.stringify(data);
    for (const [id, client] of this.clients) {
      if (id === skipId) continue;
      try { client.ws.send(body); } catch {}
    }
  }

  broadcastPeers() {
    const body = JSON.stringify({ type: 'peers', peers: this.peers() });
    for (const client of this.clients.values()) {
      try { client.ws.send(body); } catch {}
    }
  }

  reportRoom() {
    const lobby = this.env.IRON_RIDGE_LOBBY?.getByName('global');
    if (!lobby) return;
    const peers = this.peers();
    const host = peers[0]?.name || 'TANKER';
    const request = new Request('https://iron-ridge-lobby/upsert', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        room: this.room,
        host,
        count: peers.length,
        updatedAt: Date.now(),
      }),
    });
    this.state.waitUntil(lobby.fetch(request).catch(() => {}));
  }
}

export class IronRidgeLobby {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.rooms = new Map();
  }

  async fetch(request) {
    const url = new URL(request.url);
    const now = Date.now();

    const cleanup = () => {
      for (const [room, info] of this.rooms) {
        if (now - info.updatedAt > ROOM_TTL || info.count <= 0) this.rooms.delete(room);
      }
    };

    if (request.method === 'POST' && url.pathname === '/upsert') {
      let data;
      try { data = await request.json(); } catch { return json({ ok: false }, { status: 400 }); }
      const room = cleanRoom(data.room);
      const count = Math.max(0, Math.min(MAX_CLIENTS, finite(data.count) | 0));
      if (count <= 0) this.rooms.delete(room);
      else this.rooms.set(room, {
        room,
        host: cleanName(data.host),
        count,
        updatedAt: finite(data.updatedAt, Date.now()),
      });
      return json({ ok: true });
    }

    if (url.pathname === '/match') {
      cleanup();
      let match = null;
      for (const info of this.rooms.values()) {
        if (info.count === 1) {
          if (!match || info.updatedAt < match.updatedAt) match = info;
        }
      }
      if (!match) {
        const room = randomRoom();
        match = { room, host: 'WAITING', count: 1, updatedAt: now };
        this.rooms.set(room, match);
      }
      return json({ room: match.room, host: match.host, count: match.count });
    }

    cleanup();
    const rooms = [];
    for (const [room, info] of this.rooms) {
      if (info.count > 0 && info.count < 2) rooms.push(info);
    }
    rooms.sort((a, b) => b.updatedAt - a.updatedAt);
    return json({ rooms: rooms.slice(0, 12) });
  }
}

function finite(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function sanitizeState(s = {}) {
  return {
    state: s.state === 'playing' ? 'playing' : 'idle',
    score: Math.max(0, finite(s.score) | 0),
    wave: Math.max(0, finite(s.wave) | 0),
    kills: Math.max(0, finite(s.kills) | 0),
    hp: Math.max(0, Math.min(100, finite(s.hp, 100))),
    x: finite(s.x), y: finite(s.y, 2), z: finite(s.z),
    qx: finite(s.qx), qy: finite(s.qy), qz: finite(s.qz), qw: finite(s.qw, 1),
    turretYaw: finite(s.turretYaw),
    barrelPitch: finite(s.barrelPitch),
  };
}

function sanitizeShot(s = {}) {
  return {
    ox: finite(s.ox), oy: finite(s.oy, 2), oz: finite(s.oz),
    dx: finite(s.dx), dy: finite(s.dy), dz: finite(s.dz, 1),
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return json({ ok: true });
    if (url.pathname === '/health') return json({ ok: true, service: 'iron-ridge-online' });
    if (url.pathname === '/rooms' || url.pathname === '/match') {
      const id = env.IRON_RIDGE_LOBBY.idFromName('global');
      return env.IRON_RIDGE_LOBBY.get(id).fetch(request);
    }
    if (!url.pathname.startsWith('/ws/')) return new Response('Not found\n', { status: 404 });
    const room = cleanRoom(url.pathname.slice('/ws/'.length));
    const id = env.IRON_RIDGE_ROOMS.idFromName(room);
    return env.IRON_RIDGE_ROOMS.get(id).fetch(request);
  },
};
