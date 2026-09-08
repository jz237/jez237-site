import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const gameRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const SHELL_ENTRY_PATTERN = /engine\/|game\.js|styles\.css/;

test("Final Blow service worker stays small and Cloudflare-navigation safe", async () => {
  const [worker, game, index] = await Promise.all([
    readFile(join(gameRoot, "sw.js"), "utf8"),
    readFile(join(gameRoot, "game.js"), "utf8"),
    readFile(join(gameRoot, "index.html"), "utf8"),
  ]);

  const cacheName = worker.match(/const CACHE_NAME = "final-blow-shell-([^"]+)";/)?.[1];
  assert.ok(cacheName, "worker cache must use the final-blow-shell-* namespace");

  const shellSource = worker.match(/const SHELL = \[([\s\S]*?)\n\];/)?.[1];
  assert.ok(shellSource, "worker must declare a small SHELL list");
  const shell = [...shellSource.matchAll(/"([^"\n]+)"/g)].map((match) => match[1]);

  // 5.6.9 has 51 startup files (2,794,508 bytes). Keep both request count
  // and actual uncompressed bytes bounded as the engine is split into modules.
  assert.ok(shell.length <= 60, `worker shell grew to ${shell.length} entries`);
  const shellFiles = new Set(["./", "./styles.css", "./game.js", "./manifest.webmanifest", "./icon.svg"]);
  for (const entry of shell) {
    assert.ok(shellFiles.has(entry) || /^\.\/engine\/[a-z0-9-]+\.mjs$/.test(entry),
      `non-shell file must not be precached: ${entry}`);
  }
  const sizes = await Promise.all(shell.map(async (entry) => {
    const info = await stat(join(gameRoot, entry === "./" ? "index.html" : entry));
    assert.ok(info.isFile(), `shell entry must be a file: ${entry}`);
    return info.size;
  }));
  const shellBytes = sizes.reduce((total, bytes) => total + bytes, 0);
  assert.ok(shellBytes <= 3 * 1024 * 1024, `worker shell grew to ${shellBytes} bytes (3 MiB limit)`);
  assert.equal(new Set(shell).size, shell.length, "worker shell contains duplicate entries");
  assert.ok(shell.includes("./"), "worker shell must cache the directory URL");
  assert.ok(shell.includes("./game.js"), "worker shell must cache game.js");
  assert.ok(shell.includes("./engine/rollback.mjs"), "worker shell must cache rollback engine");
  assert.ok(!shell.includes("./index.html"), "redirected index.html must never enter CacheStorage");
  assert.ok(!shell.some((entry) => entry.startsWith("./assets/")), "images and audio must stay out of the install cache");

  assert.match(worker, /event\.request\.mode === "navigate"[\s\S]*caches\.match\("\.\/"\)/);
  assert.doesNotMatch(worker, /caches\.match\("\.\/index\.html"\)/);
  // v5.1 #38 changed this pin: the worker now has a SECOND cache for runtime
  // media (cache-first, build-keyed, capped), so `cache.put` exists — but only
  // inside mediaResponse. The shell path must never put, and the media cache
  // must never be the install cache.
  const shellPath = worker.slice(worker.indexOf("function shellResponse("), worker.indexOf("function isMediaRequest("));
  assert.doesNotMatch(shellPath, /cache\.put\(/, "the shell path must not refill the install cache with media");
  const mediaPath = worker.slice(worker.indexOf("function mediaResponse("), worker.indexOf("function sizeOf("));
  assert.match(mediaPath, /caches\.open\(MEDIA_CACHE_NAME\)/, "media is put into the media cache only");
  assert.match(mediaPath, /cache\.put\(/);
  assert.doesNotMatch(worker.slice(0, worker.indexOf("function mediaResponse(")), /cache\.put\(/);
  assert.match(worker, /const MEDIA_CACHE_NAME = CACHE_NAME\.replace\("final-blow-shell-", "final-blow-media-"\);/,
    "the media cache is keyed by the same build as the shell, so one bump versions both");
  const capBytes = Number(worker.match(/const MEDIA_CACHE_CAP_BYTES = (\d+) \* 1024 \* 1024;/)?.[1]);
  assert.ok(capBytes >= 60 && capBytes <= 160, `media cache cap must stay bounded (got ${capBytes} MB)`);
  assert.match(worker, /if \(mediaBytes <= MEDIA_CACHE_CAP_BYTES\) break;[\s\S]*?cache\.delete\(key\)/, "oldest entries are evicted past the cap");
  assert.match(worker, /request\.headers\.has\("range"\)\) return false;/, "byte-range media requests bypass the cache");
  assert.match(worker, /response\.ok && response\.status === 200 && response\.type === "basic"/, "only whole same-origin 200s are stored");
  assert.match(worker, /name !== CACHE_NAME && name !== MEDIA_CACHE_NAME/, "activate keeps this build's media cache and purges older builds'");
  const mediaPaths = worker.match(/const MEDIA_PATHS = \[([^\]]+)\];/)?.[1] || "";
  assert.ok(mediaPaths.includes('"/assets/"'), "sheets and audio live under assets/");
  assert.ok(!SHELL_ENTRY_PATTERN.test(mediaPaths), "engine and shell files never route through the media cache");
  assert.ok(game.includes(`serviceWorker.register("./sw.js?v=final-blow-${cacheName}")`), "worker registration version must match cache version");
  assert.ok(index.includes(`game.js?v=final-blow-${cacheName}`), "entry script version must match cache version");
});
