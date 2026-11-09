# R2 media storage

Music and selected standalone videos migrated on October 11, 2026. The canonical
public origin is `https://media.jez237.com`, backed by `jez237-site-media` R2.
`media-r2-manifest.json` records exact object paths, byte counts and SHA-256 hashes.
Keep these pointers in Git; do not recommit the migrated binaries.

The Amiga player fetches both MP3 soundtracks and original MOD files directly
from R2. Video pages use R2 too. Cloudflare Pages middleware redirects exact old
URLs, including known retired video aliases. The global CSP permits this origin.
R2 CORS allows the existing site, mirror and local test origins.

GitHub Pages has no server-side redirect support for binary URLs. Its build
therefore restores only previously served video files from R2 into the disposable
payload, verifying every checksum. This is an intentional compatibility exception,
not source storage. Do not run `scripts/restore_legacy_media.py` for Cloudflare.

## GitHub mirror size budget (November 9, 2026)

GitHub Pages is a secondary mirror, not the canonical host. Its previous payload
grew to 5.7 GiB on disk (4.97 GB uploaded) and intermittently timed out while
syncing. Successful retries did not resolve the unsupported payload size.

Only in the GitHub workflow, `games/` and `demos/` are now lightweight HTML
entry points opening the matching page on `https://jez237.com/`, preserving
query strings and fragments. All source/game/media files remain in Git and
Cloudflare unchanged. The build derives entry points from the Git tree without
downloading those sections' large assets. Old mirror service workers unregister
and move their own open windows to the canonical game; unrelated apps and caches
are untouched. The mirror 404 also forwards deep navigation in those two sections.
The shared `demos/assets/` thumbnails remain local for the main landing page.
The mirror is no longer an independent offline host for games/demos; raw asset
fetches must use the canonical site. This does not change the checksum-verified
legacy video restoration described above, which still runs after stub generation.

`scripts/prepare_pages_mirror.py check _site` runs **after** restoration and rejects
payloads exceeding 900,000,000 bytes including a per-file tar-header reserve. This
is an aggregate GitHub limit, separate from the Cloudflare 25 MiB per-file guard.
Do not raise the budget or pass this GitHub-only payload to Cloudflare. Further
growth must be addressed by offloading media or routing additional sections.

For new media: upload to R2 without overwriting different existing objects,
verify full public-download checksums and playback, add a manifest entry, and
update the relevant catalog/player URL. Canonical redirects are derived directly
from the manifest by `shared/media-redirects.mjs`; do not duplicate those entries
in a separate map. Only retired URL aliases and separately hosted masters need
explicit legacy mappings. Version parameters in manifest URLs and incoming
query strings are both retained. Run `node --test scripts/media-r2.test.mjs`
before publishing manifest or redirect changes.
The Pages entry point uses a bundler-compatible JSON import; the portable
handler is tested directly. Verify Functions compilation against the hosted
Pages compiler (currently Wrangler 3.114.17), not only the newer local CLI.
Never delete a source copy until verification and an independent backup exist.

The separate `jz237/multimedia` repository holds full-resolution-master pointers
and the legacy-video deployment workflow. Both repositories' selected media history was cleaned with Jez's authorization.
The website's protected main branch normally forbids force pushes. The one-time
rewrite temporarily allows the coordinated update, then restores that protection.
Old clones must resynchronize or transplant only their unpublished changes onto
the rewritten history; never merge or force-push the old history back. The
deployment baseline retains the same protected tree with its mapped commit ID.
GitHub's reported storage may lag until server-side garbage collection.

Deployment watch paths skip root documentation, local agent instructions and
test-only changes. Public content, runtime code and deployment guards still run
their existing validation; genuine site updates are not delayed.
