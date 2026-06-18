export async function onRequest(context) {
  const url = new URL(context.request.url);
  const retiredPaths = [
    "/games/2026-06-06/missile-command-3js",
    "/games/2026-06-06/missile-command-3js/",
    "/games/2026-06-06/missile-command-3js/index.html",
  ];

  if (url.hostname === "www.jez237.com") {
    url.hostname = "jez237.com";
    return Response.redirect(url.toString(), 301);
  }

  if (retiredPaths.includes(url.pathname)) {
    return new Response("Not Found\n", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  return context.next();
}
