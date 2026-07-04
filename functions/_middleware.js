const GOOGLE_ANALYTICS_ID = "G-S7VKNPPZHV";

class GoogleAnalyticsInjector {
  element(element) {
    element.append(
      `
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GOOGLE_ANALYTICS_ID}');
</script>`,
      { html: true },
    );
  }
}

async function legacyGameFallback(request, response) {
  const url = new URL(request.url);

  if (response.status !== 404 || !url.pathname.startsWith("/games/")) {
    return response;
  }

  const legacyPath = url.pathname.slice("/games/".length);
  if (!legacyPath || legacyPath.includes("..")) {
    return response;
  }

  const legacyUrl = new URL(`https://jz237.github.io/games/${legacyPath}`);
  legacyUrl.search = url.search;

  const legacyResponse = await fetch(legacyUrl, { redirect: "follow" });
  if (legacyResponse.status === 404) {
    return response;
  }

  const headers = new Headers(legacyResponse.headers);
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.set("Access-Control-Allow-Origin", "*");

  return new Response(legacyResponse.body, {
    status: legacyResponse.status,
    statusText: legacyResponse.statusText,
    headers,
  });
}

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

  let response = await context.next();
  response = await legacyGameFallback(context.request, response);
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  return new HTMLRewriter()
    .on("head", new GoogleAnalyticsInjector())
    .transform(response);
}
