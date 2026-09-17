import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
const productionHeaders = await readFile(path.join(root, "_headers"), "utf8");
const policy = productionHeaders.match(
  /^\s*Content-Security-Policy:\s*(.+)$/m,
)?.[1];
http
  .createServer(async (req, res) => {
    try {
      const route = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const p = path.resolve(
        root,
        "." + route + (route.endsWith("/") ? "index.html" : ""),
      );
      if (!p.startsWith(root)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const bytes = await readFile(p);
      if (policy)
        res.setHeader(
          "Content-Security-Policy",
          policy.replace("upgrade-insecure-requests", ""),
        );
      res.setHeader(
        "Content-Type",
        {
          ".html": "text/html",
          ".js": "text/javascript",
          ".mjs": "text/javascript",
          ".css": "text/css",
          ".json": "application/json",
          ".wasm": "application/wasm",
          ".png": "image/png",
        }[path.extname(p)] ?? "application/octet-stream",
      );
      res.setHeader("Cache-Control", "no-store");
      res.end(bytes);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(4173, "127.0.0.1", () =>
    console.log(
      "Preview: http://127.0.0.1:4173/games/2026-07-13/marble-madness/diorama/",
    ),
  );
