# Pinball Dreams II routed Worker

This directory preserves the production Worker that owns:

- `/games/2026-07-14/pinball-dreams-ii`
- `/games/2026-07-14/pinball-dreams-ii/*`

`index.js` is the recoverable deployed bundle for Pinball Dreams HD v1.0.3,
published as Cloudflare Worker version
`2c74a452-b7ba-4b30-810d-59eca38c643e`. The D1 leaderboard remains in
`pinball-dreams-hd-scores`.

The 407 generated audio/image/client assets remain intentionally live-only on
the Worker rather than duplicating 64.0 MiB of generated binaries in Git. Their
public URLs, sizes, content types, and SHA-256 hashes are recorded in
`asset-manifest.json`.

This recovery set includes all 59 physics assets and uses versioned physics
requests. That prevents stale negative CDN/browser cache entries from surfacing
as the game's generic `DISK READ ERROR`.

The normal unversioned game URL redirects to `?release=1.0.3`. This release
uses a new client directory and a new `1.0.3` cache key for every critical
physics, sprite, manifest, UI, and table-art request. v1.0.2 had changed the
client directory but accidentally reused v1.0.1's `r15`/`r16` generated-asset
keys, so a returning browser could still retain an earlier failed response.
Non-successful asset responses are now served with `Cache-Control: no-store`
to prevent a future partial deployment from poisoning a browser cache.

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
