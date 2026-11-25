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

# Hidden Reef ownership
Read HIDDEN_REEF.md. Do not restore full Hidden Reef storefronts in this repository. Both prototypes paths are redirects only. Its authoritative editable source is on Evo X2, and its live site is https://hidden-reef.pages.dev/.

# How publishing happens in practice (observed 2026-11-17)

Cloudflare Pages also builds this repository from Git: a push to `main` is published within about five to ten minutes
without the wrapper above (`.github/workflows/pages-file-size.yml` says the Git builds publish the repository root, and
commits were confirmed live that way). The Anatomy Studio releases of 2026-11-17 went out by pushing to `main`.

The wrapper cannot be run from a fresh checkout as it stands: it needs `wrangler` resolvable from `scripts/` (it is not
a dependency of this repository) and an upload directory prepared by hand. This note records what was observed; it does
not change the rule above. If the wrapper is still required for some releases, say here which ones.

# Things that block or break a release (learned 2026-11-24)

**History was rewritten on 2026-11-24.** `main`, 17 recent branches and all tags were rewritten to drop superseded
file versions (about 8 GB down to 5.6 GB); every commit ID changed. A checkout made before that date must be re-cloned,
or fetched and reset to `origin/main` — never pushed. The deploy guard's baseline moved with it: the 2026-08-24 Final
Blow 1.9E commit is now `b26fbdb4c9` (was `d8579c5193`) in both `scripts/guard_cloudflare_deploy.mjs` and
`scripts/live-deploy-baseline.json`. `main` forbids force pushes and requires linear history.

**Rotatable Aquascape has a release gate.** `scripts/check_aquarium_release.mjs` runs in the Cloudflare build, the
deploy guard and the mirror workflow. It fails the *whole site's* deploy unless
`scripts/rotatable-aquascape/qa/approved-build.json` matches the committed build in `demos/rotatable-aquascape/`.
Rebuilding that demo changes the hash. Do not commit a rebuild without running `npm run check:release` in
`scripts/rotatable-aquascape` and reviewing its screenshots; never edit the receipt by hand. Before pushing anything
that touches the aquarium, run `node scripts/check_aquarium_release.mjs` from the repository root.

**A failed push leaves the old site up.** When a guard fails, Cloudflare keeps serving the previous deployment, so
check the commit's checks after every push (`gh api repos/jz237/jez237-site/commits/<sha>/check-runs`) rather than
assuming it went live.

**GitHub Pages mirror.** Its deploy step can fail with `No artifacts named "github-pages-<run>-<attempt>"` when
GitHub's artifact listing flickers; the recovery step then refuses to retry by design. Re-run the failed job
(`gh run rerun <run-id> --failed`). The readiness check waits for three consecutive sightings to make this rare.
Cloudflare, which serves jez237.com, is not affected by a mirror failure.

# Housekeeping scripts

- `node scripts/update_sitemap.mjs` reports pages missing from `sitemap.xml` and entries whose page is gone or
  redirects; `--write` fixes both. `.github/workflows/sitemap.yml` adds new pages automatically on push (add-only).
- AI Images factual infographics carry `factualInfographic.group` (see
  `experiments/image-gen-2-benchmark/factual_groups.py` for the list). `append-entry.py` sets it; pass
  `--factual-group` to choose, or omit it to derive the group from the `factual_subtype` note and the title.
- Every factual infographic has a text page (Jez, Nov 25 2026: do for the factual infographics what The Hidden Reef's
  four infographic sections do, "each infographic having a text page with information about whatever it is"). The
  pages are at `/experiments/image-gen-2-benchmark/infographics/<id>/`, built by
  `experiments/image-gen-2-benchmark/build-infographic-articles.py` into the monthly `infographic-articles-*.json`
  packs and served by `functions/experiments/image-gen-2-benchmark/infographics/[id].js`; never edit a pack by hand.
  The written text (introduction, "At a glance", titled sections) is in `infographic-article-text.json`, keyed by
  infographic id. It may only restate that entry's research record (`factualInfographic.evidence`, or its entry in
  `infographic-research-supplements.json`): no fact or figure from memory, hedges kept, American spelling. The
  builder refuses text whose figures are not in the entry's record; `--check <file>` checks a file without building.
  An entry with no written text still gets a page showing its research notes, so a new daily infographic needs its
  text added to that file to match the others. Page styles: `infographic-article.css` (raise `STYLE_VERSION` in the
  builder when it changes). The gallery cards and the enlarged view link to the page ("Read about it").
- Scripts that locate themselves must use `fileURLToPath(import.meta.url)`, not `new URL(import.meta.url).pathname`,
  which yields `D:\D:\...` on Windows.
