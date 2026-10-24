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

For new media: upload to R2 without overwriting different existing objects,
verify full public-download checksums and playback, add a manifest entry, and
update the relevant catalog/player URL. Canonical redirects are derived directly
from the manifest by `shared/media-redirects.mjs`; do not duplicate those entries
in a separate map. Only retired URL aliases and separately hosted masters need
explicit legacy mappings. Version parameters in manifest URLs and incoming
query strings are both retained. Run `node --test scripts/media-r2.test.mjs`
before publishing manifest or redirect changes.
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
