# Stunt Car Racer routed asset Worker

This Worker owns `/games/2026-07-17/stunt-car-racer/*` and publishes the
committed game directory directly. Deploy only from the final synchronized
`main` commit so the routed asset tree cannot lag behind Cloudflare Pages.

Stage and deploy with:

```bash
node stage-assets.mjs
wrangler deploy --config wrangler.jsonc
```
