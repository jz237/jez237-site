# Marble Madness — Diorama Workshop

**Playable six-course reconstruction; release validation is unfinished.**
The full campaign, local two-player, three bonus courses, replays, ghosts and
course editor run on Three.js/Rapier. Full Amiga parity, timed campaign balance,
original music verification and publication remain open. See the parity ledger.

## Run

Use Node.js 22 or newer:

```sh
npm ci
npm test
npm run build
npm run serve
```

Open `http://127.0.0.1:4173/games/2026-07-13/marble-madness/diorama/`.
The server binds to localhost. `?qa=1` exposes read-only diagnostics, with no
teleport, forced finish, input override or simulation control hooks.

## Included

- Six Amiga course reconstructions, individual campaign clocks/scores,
  carryover, elimination and ending. Demos use untimed normal steering.
- Clockwork Foundry, Magnetic Observatory and Crystal Cascade bonus courses.
- Fixed 120 Hz sphere physics; welded visual/collision geometry; direct
  interpolated rigid-body rotation; CCD; quality-independent simulation.
- Patterned marbles, tiled stone/ceramic/glass/ice, colored sides, shadows,
  contact effects, stable follow camera, zoom and paused/replay/editor orbit.
- Keyboard, mouse-trackball, gamepad and split-touch input paths, turbo,
  sensitivity, pause/restart and local two-player collisions.
- Optional checkpoint assistance, medals and personal-best ghosts.
- Input replays with slow motion and seeking. Full Rapier snapshots remain in
  memory; saved replays reconstruct from inputs to avoid duplicating whole
  course meshes in local storage. Saved long-run seeks can be slower.
- In-world editor: straight/curved tracks, pipes, walls, moving parts,
  launchers, hazards/enemies, start/checkpoint/goal, waypoints, snap, move,
  rotate, undo/redo, local save, validated JSON import/export and playtest.
- Separate music/effects volumes. Effects are procedural; authentic music is
  unavailable until the obtained original rips finish verification.

## Architecture

`src/course.mjs` validates CourseDefinition v1 and compiles shared buffers.
`src/surface-geometry.mjs` handles polygons, ribbons, tubes and pyramids.
`src/physics.mjs` owns the Rapier world and fixed clock. `src/view.mjs` reads
actual body/collider transforms and shares generated geometry. Moving solids
use convex colliders; birds share a convex mesh/hull; acid uses matching shallow
cylinders; disappearing pieces disable both rendering and physical support.

`src/rules.mjs` handles the campaign state machine. `src/enemies.mjs` implements
steelies, munchers, minis and birds. `src/storage.mjs` isolates versions and
record classes. `src/workshop.mjs` uses the normal compiler for authored parts.
The demo only returns ordinary bounded steering/turbo requests.

Dependencies are pinned and bundled locally. No runtime CDN is needed. Graphics
quality may reduce resolution and shadows; it never changes physics geometry,
step rate or accuracy. Hidden tabs pause and clear controls.

Run `node measure.mjs` for the small physics measurements, or
`node measure-campaign.mjs` for every campaign/bonus traversal and recorded
results in `docs/campaign-measurements.json`.

Read [AUDIT.md](docs/AUDIT.md), [PARITY.md](docs/PARITY.md),
[VALIDATION.md](docs/VALIDATION.md) and [MUSIC.md](docs/MUSIC.md).

No money spent. No push or deployment yet. The prior game remains byte-for-byte
at `games/2026-07-13/marble-madness/legacy/` for the eventual release.
