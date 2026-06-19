import { DurableObject } from "cloudflare:workers";

const MAX_ROOM = 24;
const MAX_MESSAGE = 64_000;
const ROOM_TTL = 120_000;
const PLAYER_ROLES = ["p1", "p2"];

function json(data, init = {}) {
  return Response.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      ...(init.headers || {}),
    },
    ...init,
  });
}

function cleanRoom(value) {
  return String(value || "VECTOR")
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, MAX_ROOM) || "VECTOR";
}

function cleanName(value) {
  return String(value || "PLAYER")
    .toUpperCase()
    .replace(/[^A-Z0-9 _-]/g, "")
    .trim()
    .slice(0, 12) || "PLAYER";
}

function attachment(ws) {
  try {
    return ws.deserializeAttachment() || {};
  } catch {
    return {};
  }
}

export class NeonVectorLobby extends DurableObject {
  async fetch() {
    return json({ ok: true, service: "neon-vector-lobby" });
  }

  async updateRoom(room, info) {
    const key = cleanRoom(room);
    if (!info) {
      await this.ctx.storage.delete(key);
      return { ok: true };
    }
    const item = {
      room: key,
      host: cleanName(info.host),
      players: Math.max(1, Math.min(2, Number(info.players) || 1)),
      spectators: Math.max(0, Number(info.spectators) || 0),
      updatedAt: Date.now(),
    };
    await this.ctx.storage.put(key, item);
    return { ok: true, room: item };
  }

  async listRooms() {
    const now = Date.now();
    const entries = await this.ctx.storage.list();
    const rooms = [];
    const stale = [];
    for (const [key, value] of entries) {
      if (!value || now - Number(value.updatedAt || 0) > ROOM_TTL) {
        stale.push(key);
        continue;
      }
      rooms.push(value);
    }
    if (stale.length) await this.ctx.storage.delete(stale);
    rooms.sort((a, b) => b.updatedAt - a.updatedAt);
    return rooms.slice(0, 20);
  }
}

export class NeonVectorRoom extends DurableObject {
  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return json({ ok: true, service: "neon-vector-room" });
    }

    const url = new URL(request.url);
    const pathRoom = url.pathname.split("/").filter(Boolean)[1];
    const room = cleanRoom(pathRoom || url.searchParams.get("room"));
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    const role = this.nextRole();
    if (!role) return json({ ok: false, error: "room full" }, { status: 429 });
    const id = crypto.randomUUID();

    server.serializeAttachment({ id, role, room, name: role.toUpperCase(), joinedAt: Date.now() });
    this.ctx.acceptWebSocket(server, [role]);
    server.send(JSON.stringify({ type: "welcome", id, role, peers: this.peers() }));
    this.broadcast({ type: "peer", peers: this.peers() }, server);
    await this.syncLobby(room);

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, message) {
    if (typeof message !== "string" || message.length > MAX_MESSAGE) {
      ws.close(1009, "message too large");
      return;
    }

    let data;
    try {
      data = JSON.parse(message);
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "bad json" }));
      return;
    }

    const meta = attachment(ws);
    if (!this.allowed(data, meta)) {
      ws.send(JSON.stringify({ type: "error", message: "message not allowed" }));
      return;
    }

    if (data.type === "hello") {
      const updated = { ...meta, name: cleanName(data.name) };
      ws.serializeAttachment(updated);
      data.name = updated.name;
    }

    this.broadcast({ ...data, from: meta.id, role: meta.role, t: Date.now() }, ws);
    if (["hello", "ready", "start", "over"].includes(data.type)) await this.syncLobby(meta.room);
  }

  async webSocketClose(ws, code, reason) {
    const meta = attachment(ws);
    try {
      ws.close(code, reason);
    } catch {}
    this.broadcast({ type: "peer", peers: this.peers(meta.id), left: meta.role }, ws);
    await this.syncLobby(meta.room, meta.id);
  }

  nextRole() {
    const roles = this.ctx.getWebSockets().map(ws => attachment(ws).role);
    const used = new Set(roles);
    const playerRole = PLAYER_ROLES.find(role => !used.has(role));
    if (playerRole) return playerRole;
    return roles.filter(role => role === "spectator").length < 2 ? "spectator" : null;
  }

  peers(exceptId) {
    return this.ctx.getWebSockets().map(ws => {
      const meta = attachment(ws);
      return { id: meta.id, role: meta.role, name: meta.name, joinedAt: meta.joinedAt };
    }).filter(peer => peer.id && peer.id !== exceptId);
  }

  allowed(data, meta) {
    if (!data || typeof data.type !== "string") return false;
    if (data.type === "ping" || data.type === "hello" || data.type === "chat") return true;
    if (meta.role === "p1") return ["ready", "start", "snapshot", "over"].includes(data.type);
    if (meta.role === "p2") return ["ready", "input"].includes(data.type);
    return false;
  }

  broadcast(data, except) {
    const payload = JSON.stringify(data);
    for (const ws of this.ctx.getWebSockets()) {
      if (ws === except) continue;
      try {
        ws.send(payload);
      } catch {}
    }
  }

  async syncLobby(room, exceptId) {
    if (!this.env.LOBBY) return;
    const key = cleanRoom(room);
    const peers = this.peers(exceptId);
    const p1 = peers.find(peer => peer.role === "p1");
    const p2 = peers.find(peer => peer.role === "p2");
    const spectators = peers.filter(peer => peer.role === "spectator").length;
    const lobby = this.env.LOBBY.get(this.env.LOBBY.idFromName("global"));
    if (!p1 || p2) {
      await lobby.updateRoom(key, null);
      return;
    }
    await lobby.updateRoom(key, { host: p1.name || "P1", players: p2 ? 2 : 1, spectators });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return json({ ok: true });
    if (url.pathname === "/health") return json({ ok: true, service: "neon-vector-online" });
    if (url.pathname === "/rooms") {
      const lobby = env.LOBBY.get(env.LOBBY.idFromName("global"));
      return json({ ok: true, rooms: await lobby.listRooms() });
    }
    if (url.pathname.startsWith("/ws")) {
      const pathRoom = url.pathname.split("/").filter(Boolean)[1];
      const room = cleanRoom(pathRoom || url.searchParams.get("room"));
      const id = env.ROOM.idFromName(room);
      return env.ROOM.get(id).fetch(request);
    }
    return json({ ok: false, error: "not found" }, { status: 404 });
  },
};
