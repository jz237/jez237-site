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

export function onRequest(context) {
  const path = pathParam(context.params.path);
  if (path === "append-entry.py" || path.endsWith(".py")) {
    return notFound();
  }
  return context.next();
}
