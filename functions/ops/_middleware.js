// Password-gate the Operations & Statistics dashboard with HTTP Basic Auth.
// The username is ignored (leave it blank) — only the password is checked,
// against the Pages secret OPS_PAGE_PASSWORD. Change the password anytime with:
//   wrangler pages secret put OPS_PAGE_PASSWORD --project-name jez237-site
// (or Cloudflare dashboard → Pages → jez237-site → Settings → Variables).
// No code change or redeploy is needed to rotate it.
//
// The /api/ops-snapshot data endpoint is intentionally NOT gated here: its
// contents are already redacted for public consumption, and the page fetches
// it same-origin. Gating it would break that fetch (the browser only replays
// Basic credentials within the /ops/ path space).

const REALM = "jez237 ops — password only, no username";

function unauthorized() {
  return new Response("Authentication required.\n", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

function passwordFromHeader(header) {
  if (!header || !header.startsWith("Basic ")) return null;
  let decoded;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return null;
  }
  const colon = decoded.indexOf(":");
  return colon === -1 ? decoded : decoded.slice(colon + 1);
}

export async function onRequest(context) {
  const expected = context.env.OPS_PAGE_PASSWORD;
  const given = passwordFromHeader(context.request.headers.get("Authorization"));

  // Fail closed: if no password is configured, deny rather than expose.
  if (!expected || given === null || given !== expected) {
    return unauthorized();
  }

  const response = await context.next();
  // Belt-and-suspenders: keep the protected dashboard out of search indexes
  // even when it is served to an authenticated viewer.
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
