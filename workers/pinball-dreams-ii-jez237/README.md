# Pinball Dreams II routed Worker

This directory preserves the production Worker that owns:

- `/games/2026-07-14/pinball-dreams-ii`
- `/games/2026-07-14/pinball-dreams-ii/*`

`index.js` is the recoverable deployed bundle for Pinball Dreams HD v1.0.2,
published as Cloudflare Worker version
`f115a2ba-b044-46c4-a881-aadc92ad99c2`. The D1 leaderboard remains in
`pinball-dreams-hd-scores`.

The 407 generated audio/image/client assets remain intentionally live-only on
the Worker rather than duplicating 64.0 MiB of generated binaries in Git. Their
public URLs, sizes, content types, and SHA-256 hashes are recorded in
`asset-manifest.json`.

This recovery set includes all 59 physics assets and uses versioned physics
requests. That prevents stale negative CDN/browser cache entries from surfacing
as the game's generic `DISK READ ERROR`.

The normal unversioned game URL redirects to `?release=1.0.2`, whose page shell,
client bundle, physics files, sprites, and table artwork all use cache-safe
release URLs. This also recovers browsers that retained the original immutable
client bundle.

To reconstruct a deployment payload:

```bash
node stage-assets.mjs
wrangler deploy --config wrangler.jsonc
```

The staging command refuses to reuse a non-empty directory and verifies every
download before it can be deployed.

To exercise all four live tables in headless Chrome:

```bash
node smoke-live.mjs
```
