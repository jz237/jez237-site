# Choplifter — Rescue Run, 3D Edition

Play at https://jez237.com/games/2026-06-09/choplifter/ or the GitHub Pages mirror at https://jz237.github.io/jez237-site/games/2026-06-09/choplifter/.

The original five-wave rescue game now uses locally bundled Three.js meshes, lit materials, shadows, terrain, animated rotors and survivors, smoke, rotor wash, and explosions. A 2D fallback remains available if WebGL cannot initialize or loses its context. All runtime assets are included; there is no build step or runtime CDN dependency.

## Controls

W / ↑ climbs; S / ↓ descends; A/D or ←/→ flies and turns. Releasing the keys brakes and holds a steady hover. Space/F fires, B drops bombs, P/Escape pauses, and M mutes. Mouse and touch dragging steer toward the pointer; touch keeps the helicopter above the finger, and releasing a drag gently settles. Analog gamepads support precision movement. Land by survivors and return them to the rescue pad.

Flight assistance provides prompt acceleration, shorter stopping distance, responsive reversals, altitude hold, and automatic landing flare. Losing focus clears held controls and pauses the mission. Existing local records and the global leaderboard are preserved.

## Development

Run `npm start` in this directory, then open http://127.0.0.1:8790/. `PORT` overrides the port. On Windows, `Play-Choplifter.cmd` starts the same local server. Use HTTP rather than opening the HTML file directly because the renderer uses JavaScript modules.

Run `npm test` for handling checks covering acceleration, braking, hover stability, direction reversal, touchdown, mouse targeting, touch offset and release, fuel loss, and analog input.

`game.js` contains the mission simulation and input integration; `flight-controls.js` contains the flight assistance; `renderer.js` contains the 3D presentation; `style.css` contains the HUD and overlay styling. Deploy `index.html`, these runtime files, `vendor/`, and `assets/` together.

Publishing is managed in the parent `jz237/jez237-site` repository. Follow its `AGENTS.md` and `scripts/deploy_jez237_pages.mjs` for Cloudflare releases so the rest of the site's assets and Functions are retained. The repository's GitHub Pages workflow publishes the mirror.

Original game and audio: Jez237 / original creators; underlying rights retained. Three.js 0.180.0 is included under its MIT license in `vendor/THREE-LICENSE.txt`.
