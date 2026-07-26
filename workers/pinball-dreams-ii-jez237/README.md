# Pinball Dreams II routed Worker

This directory preserves the production Worker that owns:

- `/games/2026-07-14/pinball-dreams-ii`
- `/games/2026-07-14/pinball-dreams-ii/*`

`index.js` is the recoverable deployed bundle captured from Cloudflare Worker
version `a05b517b-d012-404e-91ef-63da2e69d371`. The D1 leaderboard remains in
`pinball-dreams-hd-scores`.

The 358 generated audio/image/client assets remain intentionally live-only on
the Worker rather than duplicating 61.8 MB of generated binaries in Git. Their
public URLs, sizes, content types, and SHA-256 hashes are recorded in
`asset-manifest.json`.

To reconstruct a deployment payload:

```bash
node stage-assets.mjs
wrangler deploy --config wrangler.jsonc
```

The staging command refuses to reuse a non-empty directory and verifies every
download before it can be deployed.
