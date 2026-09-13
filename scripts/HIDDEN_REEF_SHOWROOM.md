# Hidden Reef Living Showroom

The flagship aquarium feature precedes the shopping hero on the homepage. Desktop navigation includes 3D Aquarium; the phone navigation has a permanently visible aquarium entry outside its collapsed menu. Freshwater and help-center pages also invite visitors into the showroom.

The showroom at `prototypes/hidden-reef/showroom/` automatically creates the same-origin 3D iframe on arrival from the store aquarium link. Motion starts when models are ready, with no second play button. The screenshot appears after visitors deliberately close the aquarium and offers a reopen button. Closing removes the iframe. Intersection, page visibility and shopping overlays suspend aquarium rendering without changing the visitor's pause setting. The standalone jez237 aquarium behavior is unchanged unless the Hidden Reef query parameter is set.

The aquarium bridge accepts messages only from its parent window at the same origin. Close-ups and lessons update related care and catalog links. The filter shortcut opens the mechanical-media cutaway directly. The planner reads real catalog options and uses the existing preview-list API/storage, including quantity, copy and print. Aquarium sizing and livestock planning remain conversations with the store; the catalog does not have a matching freshwater tank to recommend as an exact replica. No invented stock or prices.

## Update

1. `npm --prefix scripts/rotatable-aquascape run build`
2. `node scripts/sync_hidden_reef_showroom.mjs`
3. `python scripts/check_hidden_reef_links.py prototypes/hidden-reef`
4. `python scripts/check_hidden_reef_links.py prototypes/hidden-reef-header-preview`

The showroom uses the store’s blue/cyan/violet palette with a solid deep blue aquarium panel. The introductory slogan panel is removed. The outer page retains its water photograph. The same responsive header iframe and `site-masthead.css` used on the other store pages sit above the complete category navigation. The header’s `?still=1` mode holds its motion even when visible; normal headers keep their existing motion behavior. The navigation enhancement is generated from the existing `reef-background.js` function during sync, so no animated page background renderer is required. Entry keeps the top header visible while the aquarium loads automatically; manual reopening scrolls directly to the tank. Standalone aquarium styling stays independent.

The sync script preserves the existing two storefront variants and copies the current aquarium build, models, textures, lighting and study references. Old published content-hashed assets may be retained for rollback. The poster is an actual renderer screenshot; `?showroom=hidden-reef&poster=1` hides the aquarium controls for a fresh capture.

Publishing uses the existing `scripts/deploy_hidden_reef_cloudflare.sh` on the configured Linux deployment host, with its existing Hidden Reef credentials. Run from an isolated clean checkout of the current GitHub main. Do not use the local jez237-site Cloudflare account for Hidden Reef.

## Validation for the initial release

- 105 existing aquarium tests pass; four new bridge tests cover parent/origin isolation, suspension preserving pause state, cutaway routing and standalone isolation.
- Production TypeScript/Vite build and both storefront internal-link checks pass.
- Browser checks: on-demand launch; direct detailed filter view; contextual care/catalog links; real filter added to the preview list and retained on a category page; test item removed; no console errors.
- Desktop and 412px phone-width layout checked. No claim of actual phone frame-rate measurement.
