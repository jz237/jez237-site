# Animated Hidden Reef header

Imported from Jez's `D:\projects\hidden reef header` on VENGEANCE, 2026-09-06.
The original machine/project was not modified. Original artwork and live SVG
lettering masks, water shader, fish motion and pointer interactions are retained.

This static iframe adapts the original React component for the existing static
site, with relative asset paths, automatic reduced-motion support and
offscreen pausing. It needs no server, external runtime assets or React runtime.

The surrounding header retains the original site width. Its height follows the
source's 72%-cropped responsive scene. Navigation remains directly below it.
The preview also shows the header on mobile (the previous site hid it there).

Jez approved the optimized, button-free header for Cloudflare deployment on
2026-09-06. This is the production copy; the separate
`hidden-reef-header-preview` tree remains available for GitHub review.

To rebuild after changes, use esbuild to bundle `header.ts` as browser ESM into
`header.js`. `reef-engine.ts` and `underwater-light.ts` retain the renderer source.

## Performance tuning (2026-09-06)

- Cache the fish atlas at 512×512 instead of repeatedly sampling 1254×1254.
- Use smaller fish/fin meshes and one draw for each distant schooling fish.
- Limit scene updates to 30 fps and cached fin updates to 15 fps.
- Detect sustained render/cadence pressure, then retain an economy mode for
  the page: simpler meshes, fewer particles, lower water resolution and
  15 fps water/10 fps fin updates. Live SVG lettering stays full resolution.
- Stop the header animation loop while offscreen, paused or in a hidden tab;
  invalidate a single frame when resizing or loading assets while paused.
- The surrounding page's background is also limited to 30 fps, uses a
  bounded water-rendering resolution, and stops rendering in hidden tabs.

Verification: TypeScript check; desktop/mobile animation, zero header buttons,
navigation alignment, offscreen pause/resume and dynamic reduced-motion checks.
Headless Chrome software-rendering measurements are comparative, not a claim
about a visitor's actual hardware FPS. Before optimization the header issued
about 3,096 image draws per frame; the optimized mesh/caching path uses far fewer.
