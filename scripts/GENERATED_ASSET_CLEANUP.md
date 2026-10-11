# Bounded generated-asset retention

The October 11 cleanup retains the current and one previous distinct JS/CSS
release for five reviewed gallery demos. Their `generated-bundles.json` files
explicitly identify owned files. They are not lists of every asset in a demo.

`publishGeneratedAssets(sourceBuild, destinationDemo)` copies a complete build
and retires only manifest-owned JS/CSS older than those two releases. It keeps
lazy chunks, models, textures, source art, wrapper files and unknown files.
Repeating the same build does not rotate away the rollback generation. A missing
or invalid manifest fails closed; never populate one by claiming every file in
an existing destination is disposable.

The freshwater, reef and filtration publishers use this helper. When importing
a new external build for `demos/h2d-explorer` or `demos/living-aquascape`, use the
same helper rather than copying over the previous build without retiring output:

```js
import {publishGeneratedAssets} from './scripts/publish_generated_assets.mjs';
publishGeneratedAssets('/absolute/path/to/complete/dist', 'demos/h2d-explorer');
```

Run `node --test scripts/publish_generated_assets.test.mjs` after helper changes.
Keep all existing application release gates and browser/visual checks. Do not
regenerate the aquarium approval receipt to hide a changed runtime hash.

Old browser tabs beyond the retained previous release may need a reload before
requesting a lazy chunk. The main Cloudflare site was intentionally left
unchanged during this GitHub cleanup, as Jez's recovery reference. Its future
normal guarded releases will inherit the cleaned source, not a full-site copy
or an unverified rebuild created just for this cleanup.

## GitHub Actions uploads

`Prune superseded Pages artifacts` runs after successful GitHub Pages mirror
deployments. It keeps the two newest successful uploads and every active,
unknown, rerun or unrelated artifact. Only completed uploads belonging to
`pages.yml` on `main` are eligible. It rechecks each run before deletion. The
one-day expiry remains a backstop. A failed cleanup job stays visible.

Manual dry run: `GH_REPO=jz237/jez237-site node scripts/prune_pages_artifacts.mjs`.
Add `--apply` only for an authorized cleanup. Neither this workflow nor the
bundle publisher rewrites Git history or deletes active media.
