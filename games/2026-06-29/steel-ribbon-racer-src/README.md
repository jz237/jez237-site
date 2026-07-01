# Steel Ribbon Racer — source

Source project for the game deployed at `games/2026-06-29/steel-ribbon-racer/`.

## History

The game was originally maintained as a minified Vite bundle only — no source was ever
committed. This project was recovered from that bundle (2026-07-01): the bundle was
pretty-printed, Three.js r181 was factored back out to the npm dependency, and every
mangled Three.js identifier was mapped back to its real export name via scope-aware
analysis. Behavior parity with the shipped bundle was verified by telemetry comparison
and screenshot diffing before any improvements were made. Internal game identifiers
(short names like `u`, `Qe`, `St`) are original minifier output; new code uses readable
names.

## Layout

- `src/main.js` — the whole game (world gen, physics, cameras, UI, audio, debug API)
- `src/style.css` — HUD/cockpit/menu styles
- `index.html` — page shell
- `tests/smoke.mjs` — Playwright smoke + regression probes (serves the built game)
- `vite.config.js` — builds into `../steel-ribbon-racer` (the deployed path)

## Commands

```sh
npm install
npm run dev      # dev server with HMR
npm run build    # build into ../steel-ribbon-racer (this is what gets deployed)
node tests/smoke.mjs   # run probes against the built game (build first)
```

## Debug API (for tests / probes)

`window.__steelRibbonTelemetry` — per-frame state (mode, speed, score, position, camera).
Published from both track and roam modes.

`window.__steelRibbonDebug` — setSpeed, setTrackPosition, setRoamPos, setCourse,
setTrackView, flyCam, listCourses, listBoostPads, gapJumpReport, rampSurfaceReport,
probeDown, sceneryCounters, viewInfo, stats.

Headless Chromium renders far below real time, so the sim runs in slow motion under
Playwright — probes must poll with generous timeouts rather than fixed waits, and the
browser needs `--disable-backgrounding-occluded-windows` etc. so occluded pages keep
their rAF loop (see tests/smoke.mjs).

## View modes

Track modes default to a chase camera (player car visible, `C` toggles the classic
cockpit view; choice persists in localStorage under `steel-ribbon-view`).
