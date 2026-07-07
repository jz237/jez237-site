// /api/ops-snapshot — KV-backed drop box for the home-lab ops snapshot.
//
// POST (authenticated): the home box pushes a pre-redacted snapshot JSON
// every ~10 minutes. Bearer token lives in the OPS_SNAPSHOT_TOKEN project
// secret; the snapshot itself is built and firewalled at the source, and
// re-scanned here as a second layer.
// GET (public, same-origin from /ops/): returns the latest snapshot.

const KV_KEY = "latest";
const MAX_BODY_BYTES = 100 * 1024;
const SCHEMA_VERSION = 1;

// Belt-and-suspenders subset of the generator's redaction firewall.
const SERVER_FIREWALL = [
  /\b(?:\d{1,3}\.){3}\d{1,3}\b/,                    // IPv4
  /\b(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/,    // MAC
  /\b\d{16,20}\b/,                                  // snowflake ids
  /\/home\/|\/Users\/|\/etc\//,                     // absolute paths
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, // emails
];

function json(status, obj, extra = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
      ...extra,
    },
  });
}

function tokenMatches(header, secret) {
  if (!header || !header.startsWith("Bearer ") || !secret) return false;
  const enc = new TextEncoder();
  const given = enc.encode(header.slice(7).trim());
  const expected = enc.encode(secret);
  if (given.byteLength !== expected.byteLength) return false;
  return crypto.subtle.timingSafeEqual(given, expected);
}

export async function onRequest({ request, env }) {
  const method = request.method;

  if (method === "POST") {
    if (!env.OPS_KV) return json(503, { error: "storage not configured" }, { "Cache-Control": "no-store" });
    if (!tokenMatches(request.headers.get("authorization"), env.OPS_SNAPSHOT_TOKEN)) {
      return json(401, { error: "unauthorized" }, { "Cache-Control": "no-store" });
    }
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
      return json(413, { error: "too large" }, { "Cache-Control": "no-store" });
    }
    let doc;
    try {
      doc = JSON.parse(body);
    } catch {
      return json(400, { error: "invalid json" }, { "Cache-Control": "no-store" });
    }
    if (doc?.meta?.schema_version !== SCHEMA_VERSION) {
      return json(422, { error: "unexpected schema_version" }, { "Cache-Control": "no-store" });
    }
    for (const rule of SERVER_FIREWALL) {
      if (rule.test(body)) {
        return json(422, { error: "content rejected" }, { "Cache-Control": "no-store" });
      }
    }
    await env.OPS_KV.put(KV_KEY, body, {
      metadata: { received_at: new Date().toISOString(), bytes: body.length },
    });
    return json(200, { ok: true, bytes: body.length }, { "Cache-Control": "no-store" });
  }

  if (method === "GET" || method === "HEAD") {
    if (!env.OPS_KV) return json(503, { error: "storage not configured" }, { "Cache-Control": "no-store" });
    const value = await env.OPS_KV.get(KV_KEY, { type: "text", cacheTtl: 60 });
    if (value === null) {
      return json(404, { status: "warming_up" }, { "Cache-Control": "no-store" });
    }
    return new Response(method === "HEAD" ? null : value, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=30",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  return new Response("Method not allowed", {
    status: 405,
    headers: { Allow: "GET, HEAD, POST" },
  });
}
