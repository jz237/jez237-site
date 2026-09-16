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

When effects need to be reduced for performance, adapt only on computers that show sustained slow frames. Powerful computers must retain full effects. Keep model/texture detail and animal behavior intact; provide an Always full override and restore effects when sustained headroom permits. Do not use GPU model names or desktop/mobile labels alone to reduce quality.


Feeding cardinals should pursue individual actual food particles with brief fast
bursts, controlled upright 3D turns, braking, mouth-range capture, short bite pauses
and movement clear of the feeding spot. Preserve individual timing, competition,
retargeting of lost or stalled food, collision constraints and the unchanged food
nitrogen accounting. Motion constants are illustrative, not measured species data.
