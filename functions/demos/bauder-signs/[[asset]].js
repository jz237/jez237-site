import media from "../../../shared/bauder-signs-media.json";

const base = "/demos/bauder-signs/";
const mime = { jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp",
  png: "image/png", gif: "image/gif", woff2: "font/woff2" };

// Some static asset hosts return a full pack even when asked for a byte range.
// Read just the requested file into memory in that case.
async function extract(stream, start, length) {
  const result = new Uint8Array(length);
  const reader = stream.getReader();
  let position = 0;
  let written = 0;
  try {
    while (written < length) {
      const { value, done } = await reader.read();
      if (done) throw new Error("Incomplete Bauder photo pack");
      const skip = Math.max(0, start - position);
      position += value.length;
      if (skip >= value.length) continue;
      const part = value.subarray(skip, skip + length - written);
      result.set(part, written);
      written += part.length;
    }
    return result;
  } finally {
    reader.cancel().catch(() => {});
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  let key;
  try {
    key = decodeURIComponent(url.pathname.slice(base.length));
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!Object.hasOwn(media, key) || !["GET", "HEAD"].includes(request.method)) {
    return context.next();
  }
  const [pack, start, length] = media[key];
  const etag = '"' + pack + "-" + start + '"';
  const headers = {
    "Content-Type": mime[key.slice(key.lastIndexOf(".") + 1).toLowerCase()],
    "Cache-Control": "public, max-age=3600",
    "ETag": etag,
    "X-Content-Type-Options": "nosniff",
  };
  if (request.headers.get("If-None-Match") === etag) return new Response(null, { status: 304, headers });
  headers["Content-Length"] = String(length);
  if (request.method === "HEAD") return new Response(null, { headers });

  const end = start + length - 1;
  const packed = await env.ASSETS.fetch(new Request(new URL(base + "media/" + pack, url), {
    headers: { Range: "bytes=" + start + "-" + end, "Accept-Encoding": "identity" },
  }));
  if (packed.status === 206 && packed.headers.get("Content-Range")?.startsWith("bytes " + start + "-" + end + "/")) {
    return new Response(packed.body, { headers });
  }
  if (packed.status === 200 && packed.body) {
    return new Response(await extract(packed.body, start, length), { headers });
  }
  return new Response("Image unavailable", { status: 502 });
}
