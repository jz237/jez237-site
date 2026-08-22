const GOOGLE_ANALYTICS_ID = "G-S7VKNPPZHV";
const FINAL_BLOW_SERVICE_WORKER_PATH = "/games/2026-08-20/final-blow/sw.js";

const BLOCKED_SOURCE_PREFIXES = [
  "/.claude/",
  "/.git/",
  "/.github/",
  "/.wrangler/",
  "/functions/",
  "/public/spreadsheets/",
  "/scripts/",
  "/stock-market-src/",
  "/tmp/",
  "/workers/",
];

const BLOCKED_SOURCE_PATHS = new Set([
  "/.claude",
  "/.git",
  "/.github",
  "/.wrangler",
  "/functions",
  "/ops/migrate_amiga_audio_to_r2.sh",
  "/public/spreadsheets",
  "/scripts",
  "/stock-market-src",
  "/tmp",
  "/workers",
]);

const BLOCKED_SOURCE_FILE_NAMES = new Set([
  ".env",
  ".env.local",
  ".npmrc",
  ".yarnrc",
  "package-lock.json",
  "package.json",
  "pnpm-lock.yaml",
  "wrangler.toml",
  "yarn.lock",
]);

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

function notFound() {
  return new Response("Not Found\n", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

function isBlockedSourcePath(pathname) {
  if (pathname === "/.well-known" || pathname.startsWith("/.well-known/")) {
    return false;
  }

  if (BLOCKED_SOURCE_PATHS.has(pathname)) return true;
  if (BLOCKED_SOURCE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  const fileName = pathname.split("/").filter(Boolean).pop();
  return Boolean(fileName && BLOCKED_SOURCE_FILE_NAMES.has(fileName));
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

  if (isBlockedSourcePath(url.pathname)) {
    return notFound();
  }

  if (retiredPaths.includes(url.pathname)) {
    return notFound();
  }

  const response = await context.next();

  if (url.pathname === FINAL_BLOW_SERVICE_WORKER_PATH) {
    const headers = new Headers(response.headers);
    // Pages' default four-hour JavaScript cache can pin a broken service
    // worker in browsers even after a deployment. Worker updates must always
    // reach the current production script.
    headers.set("Cache-Control", "no-store");
    headers.set("Service-Worker-Allowed", "/games/2026-08-20/final-blow/");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  return new HTMLRewriter()
    .on("head", new GoogleAnalyticsInjector())
    .transform(response);
}
