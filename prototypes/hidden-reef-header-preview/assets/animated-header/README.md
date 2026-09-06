# Animated Hidden Reef header — review copy

Imported from Jez's `D:\projects\hidden reef header` on VENGEANCE, 2026-09-06.
The original machine/project was not modified. Original artwork and live SVG
lettering masks, water shader, fish motion and pointer interactions are retained.

This static iframe adapts the original React component for the existing static
site, with relative asset paths, a pause button, reduced-motion support and
offscreen pausing. It needs no server, external runtime assets or React runtime.

The surrounding header retains the original site width. Its height follows the
source's 72%-cropped responsive scene. Navigation remains directly below it.
The preview also shows the header on mobile (the previous site hid it there).

This entire `hidden-reef-header-preview` tree is for GitHub Pages review only.
The production `hidden-reef` tree and Cloudflare deployment are unchanged.

To rebuild after changes, use esbuild to bundle `header.ts` as browser ESM into
`header.js`. `reef-engine.ts` and `underwater-light.ts` retain the renderer source.
