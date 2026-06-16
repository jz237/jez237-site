# Autonomous Painterly Loop Prompt

You are Codex working inside `jez237-website/games/2026-06-12/pay-dirt/`.

Objective: transform Pay Dirt into a beautiful painterly cavern adventure while preserving the tight Lode Runner core. You may change the game boldly, but the result must remain playable in a browser, self-contained, and fast.

Use the existing architecture:

- `index.html` for shell, overlays, touch controls, and CSS.
- `art.js` for procedural painterly sprites, tiles, pickups, and generated-canvas assets.
- `levels.js` for authored maps and Daily Dig generation.
- `game.js` for simulation, rendering, UI flow, scores, and `window.__g` test hooks.
- `assets/painterly-direction-reference.png` as visual direction only; do not make runtime depend on it unless you deliberately wire it in and verify loading.

Creative target:

- Rich hand-painted cavern, visible brush texture, warm lantern light against cool teal shadows.
- Add optional things to pick up, explore, and do beyond gold: relics, blooms, survey maps, lantern oil, hidden nooks, bonuses, discoveries, or short environmental moments.
- Keep player goals readable: collect gold to open the exit; optional discoveries reward exploration but do not block completion.
- Avoid tiny unreadable UI, overlapping text, broken mobile controls, and one-note brown/orange palettes.

Mandatory loop:

Run at least 12 iterations. In every iteration:

1. Choose one concrete improvement to art, gameplay, controls, readability, performance, or delight.
2. Edit the smallest necessary files.
3. Run automated checks:
   - Static parse check for changed JavaScript.
   - Browser smoke test with Playwright.
   - Start a campaign level through `window.__g`, step at least 180 frames, and assert no console errors.
   - Inspect canvas pixels or screenshot to confirm nonblank rendering.
4. Play-test briefly using scripted input or manual browser inspection.
5. Record the result in `ART_LOG.md` as `Iter N`, including what changed, what was tested, and what the next weakness is.
6. Repeat until 12 iterations are complete.

Definition of done:

- Backup exists before edits.
- Game boots from `index.html` via a local server.
- Title and level render nonblank.
- `window.__g.loadLevel(0)` works.
- `window.__g.treasures` or equivalent optional exploration layer exists and is visible in-game.
- No uncaught console errors during the smoke test.
- The final game feels painterly, not merely recolored.
