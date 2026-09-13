# Living Aquascape publishing preference

The user wants all 3D aquarium improvements kept synchronized across their sites.
Maintain one source here and publish the same tested build to:

- jez237: `demos/rotatable-aquascape/`
- Hidden Reef: `prototypes/hidden-reef/showroom/aquarium/`
- Hidden Reef preview: `prototypes/hidden-reef-header-preview/showroom/aquarium/`

Use `npm run build:sites` from this directory to build and synchronize all copies.
Run the aquarium tests and `node scripts/check_aquarium_sync.mjs` from the repository root.
Publish GitHub main, Hidden Reef Pages, and jez237 Pages using the existing guarded
deployment workflows; verify the active JS/CSS bundles on both production domains.
Do not report the sites synchronized until both deployments are verified. Preserve
site-specific colors, navigation and embedding behavior. The photographic aquarium
is a separate implementation; this preference refers to the 3D aquarium.

Preserve full model/texture detail and the established independent animal motion,
body/fin flexibility, schooling, exploration and collision behavior. Do not spend
money without explicit authorization.
