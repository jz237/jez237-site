// Cloudflare Access protects jez237.com/ops* at the edge. Keep the Pages
// hostname closed so it cannot be used to bypass the Access application.

const PROTECTED_HOSTNAME = "jez237.com";

function notFound() {
  return new Response("Not found.\n", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

export async function onRequest(context) {
  const { hostname } = new URL(context.request.url);
  if (hostname !== PROTECTED_HOSTNAME) return notFound();

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
