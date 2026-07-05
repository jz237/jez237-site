const GOOGLE_ANALYTICS_ID = "G-S7VKNPPZHV";

const BLOCKED_SOURCE_PREFIXES = [
  "/.claude/",
  "/.git/",
  "/.github/",
  "/.wrangler/",
  "/functions/",
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
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  return new HTMLRewriter()
    .on("head", new GoogleAnalyticsInjector())
    .transform(response);
}
