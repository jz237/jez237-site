# Unlisted ArtCraft installer downloads

Standalone Worker for `/software-downloads/*`; not a Pages deployment.
It streams only hash-addressed PhotoCraft/VectorCraft EXEs from the existing
site-media R2 bucket. There is no index, upload endpoint or listing operation.
All responses carry `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`.
Successful downloads are attachments with no-store and no-referrer headers.
Do not link these downloads from site pages, navigation, feeds or sitemaps.
Links are unlisted, **not authenticated**: anyone holding a link can download.
Do not add robots.txt Disallow: crawlers must be allowed to read the noindex header.

The authorized local ArtCraft updater publishes only Windows-verified installers,
checks the live download's full SHA-256, then posts to the corresponding private
Discord channel and records its delivery receipt. Binaries and link manifests
are live/local only, never checked into this website repository.

Validate with `node --test index.test.mjs` and `wrangler deploy --dry-run`.
Deploy this Worker alone with `wrangler deploy`; no main-site publication needed.
