# Production deployment

For `jez237-site` Cloudflare Pages releases, use:

`node scripts/deploy_jez237_pages.mjs <absolute-public-upload-directory>`

Run it from the current, committed, pushed repository. Preserve the whole site's
current public assets when preparing the separate upload directory. Do not use
raw `wrangler pages deploy` or a static-only API upload for this project.
The wrapper compiles all Pages Functions into the upload, checks a preview before
publishing production, and checks Philadelphia's Cesium permissions and service
routes again on the live domain. It does not apply to the separate Hidden Reef
Cloudflare project or GitHub Pages.

A September 23 static-only deployment removed the Philadelphia Functions and
its route-specific CSP, disabling Cesium and returning 404s for imagery and
aircraft. A successful asset upload alone is not a successful release. After
Philadelphia changes, also open a close-up in a browser and verify that the
status reaches Photographic 3D with visible Cesium models before reporting done.

For aircraft repairs, pass `--require-aircraft` to the deployment wrapper and
verify visible aircraft in the browser. This checks a fresh GET feed, not just
route existence. The private Windows relay is a separate runtime dependency:
check its local health and recovery task when aircraft fail. Do not stop or kill
the home relay as part of preview cleanup. Its Stop shortcut remains authoritative.
The installed helper is `%USERPROFILE%\.philadelphia-relief-aircraft`; its Windows
task is `Philadelphia Relief Aircraft Recovery`. Do not reinstall under AppData:
packaged Codex redirects that folder into its MSIX LocalCache, which Windows
startup tasks cannot access through the same apparent path. Test recovery by
running the scheduled task, not just launching the helper from Codex.
