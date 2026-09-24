# Tidewater hosted edition 1

Upstream: https://github.com/dgreenheck/tidewater
Commit: `1438b1abfcaee3267092b75573014f4d9b4a983c`
Imported: 2026-09-24
Upstream version: 1.0.0

Built with `npm ci --ignore-scripts && npm run build` (Vite; relative base `./`).
The full `dist/` is hosted here with the upstream LICENSE and CREDITS.md.
Hosting-only additions: index title/description, version/creator/controls and navigation in the loader, this provenance file, and about.html. No gameplay changes.
To update, build the desired pinned upstream revision, copy dist here, preserve these hosting additions, update the visible hosted version, and verify WebGPU startup and both subpaths.

Original game saves are origin-local; copies do not share saves. Keyboard/mouse required.
