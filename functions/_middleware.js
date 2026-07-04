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

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  return new HTMLRewriter()
    .on("head", new GoogleAnalyticsInjector())
    .transform(response);
}
