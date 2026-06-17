import { DurableObject } from "cloudflare:workers";

const MAX_ROOM = 24;
const MAX_MESSAGE = 48_000;
const MAX_SPECTATORS = 2;
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
  return String(value || "LOBBY")
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, MAX_ROOM) || "LOBBY";
}

function attachment(ws) {
  try {
    return ws.deserializeAttachment() || {};
  } catch {
    return {};
  }
}

export class SteelDuelRoom extends DurableObject {
  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return json({ ok: true, service: "steel-duel-online" });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    const role = this.nextRole();
    if (!role) {
      return json({ ok: false, error: "room full" }, { status: 429 });
    }
    const id = crypto.randomUUID();

    server.serializeAttachment({ id, role, joinedAt: Date.now() });
    this.ctx.acceptWebSocket(server, [role]);

    server.send(JSON.stringify({
      type: "welcome",
      id,
      role,
      peers: this.peers(),
    }));
    this.broadcast({
      type: "peer",
      peers: this.peers(),
    }, server);

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

    this.broadcast({
      ...data,
      from: meta.id,
      role: meta.role,
      t: Date.now(),
    }, ws);
  }

  async webSocketClose(ws, code, reason) {
    try {
      ws.close(code, reason);
    } catch {}
    this.broadcast({ type: "peer", peers: this.peers() }, ws);
  }

  nextRole() {
    const roles = this.ctx.getWebSockets().map(ws => attachment(ws).role);
    const used = new Set(roles);
    const playerRole = PLAYER_ROLES.find(role => !used.has(role));
    if (playerRole) return playerRole;
    const spectatorCount = roles.filter(role => role === "spectator").length;
    return spectatorCount < MAX_SPECTATORS ? "spectator" : null;
  }

  peers() {
    return this.ctx.getWebSockets().map(ws => {
      const meta = attachment(ws);
      return { id: meta.id, role: meta.role, joinedAt: meta.joinedAt };
    });
  }

  allowed(data, meta) {
    if (!data || typeof data.type !== "string") return false;
    if (data.type === "ping" || data.type === "hello") return true;
    if (meta.role === "p1") return ["start", "snapshot", "chat"].includes(data.type);
    if (meta.role === "p2") return ["input", "chat"].includes(data.type);
    return data.type === "chat";
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
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return json({ ok: true });
    if (url.pathname === "/health") return json({ ok: true });
    if (url.pathname.startsWith("/ws")) {
      const pathRoom = url.pathname.split("/").filter(Boolean)[1];
      const room = cleanRoom(pathRoom || url.searchParams.get("room"));
      const id = env.ROOM.idFromName(room);
      return env.ROOM.get(id).fetch(request);
    }
    return json({ ok: false, error: "not found" }, { status: 404 });
  },
};
