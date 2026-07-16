const notFound = () =>
  new Response("Not found", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });

function pathParam(value) {
  return Array.isArray(value) ? value.join("/") : String(value || "");
}

function escapeAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Resolve the issue a request refers to (?date=<historicDate|currentDate>,
// else the newest) from the derived archive index.
async function resolveIssue(context, url) {
  const indexUrl = new URL("/computer-chronicle/data/index.json", url);
  const response = await context.env.ASSETS.fetch(new Request(indexUrl));
  if (!response.ok) return null;
  const data = await response.json();
  const issues = Array.isArray(data.issues) ? data.issues : [];
  if (!issues.length) return null;
  const requested = url.searchParams.get("date");
  if (!requested) return issues[0];
  return issues.find(
    (issue) => issue.historicDate === requested || issue.currentDate === requested
  ) || null;
}

class RemoveElement {
  element(el) {
    el.remove();
  }
}

class InjectIntoHead {
  constructor(html) {
    this.html = html;
  }
  element(el) {
    el.append(this.html, { html: true });
  }
}

export async function onRequest(context) {
  const path = pathParam(context.params.path);
  if (path.endsWith(".mjs")) {
    return notFound();
  }

  // Per-issue OpenGraph tags on the chronicle page itself; everything else
  // passes straight through.
  if (path !== "" && path !== "index.html") {
    return context.next();
  }

  const response = await context.next();
  try {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return response;

    const url = new URL(context.request.url);
    const issue = await resolveIssue(context, url);
    if (!issue) return response;

    const pageUrl = url.searchParams.get("date")
      ? `${url.origin}/computer-chronicle/?date=${encodeURIComponent(issue.historicDate)}`
      : `${url.origin}/computer-chronicle/`;
    const heroUrl = issue.hero ? `${url.origin}/computer-chronicle/${issue.hero}` : "";
    const title = `Computer Chronicle — ${issue.displayDate || issue.historicDate}${issue.leadHeadline ? `: ${issue.leadHeadline}` : ""}`;
    const storyHeadlines = Array.isArray(issue.storyHeadlines) ? issue.storyHeadlines : [];
    const description = [
      issue.morningLine || "",
      storyHeadlines.length ? `Also this week: ${storyHeadlines.join(" · ")}.` : "",
    ].filter(Boolean).join(" ")
      || "A weekly early-1980s computer newspaper rebuilt from the historical record.";

    const tags = [
      `<meta property="og:title" content="${escapeAttr(title)}">`,
      `<meta property="og:description" content="${escapeAttr(description)}">`,
      `<meta property="og:type" content="article">`,
      `<meta property="og:url" content="${escapeAttr(pageUrl)}">`,
      `<meta property="og:site_name" content="jez237.com">`,
      heroUrl ? `<meta property="og:image" content="${escapeAttr(heroUrl)}">` : "",
      heroUrl ? `<meta property="og:image:width" content="1024">` : "",
      heroUrl ? `<meta property="og:image:height" content="1536">` : "",
      `<meta name="twitter:card" content="${heroUrl ? "summary_large_image" : "summary"}">`,
      heroUrl ? `<meta name="twitter:image" content="${escapeAttr(heroUrl)}">` : "",
    ].filter(Boolean).join("\n    ");

    return new HTMLRewriter()
      .on('meta[property^="og:"]', new RemoveElement())
      .on("head", new InjectIntoHead(`\n    ${tags}\n`))
      .transform(response);
  } catch (_error) {
    // Never let unfurl decoration break the page.
    return response;
  }
}
