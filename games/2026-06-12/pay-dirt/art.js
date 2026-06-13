/* Pay Dirt — art.js
   Procedural HD pixel-art sprites + parallax cave backdrop. No external assets.
   Everything is drawn once into offscreen canvases at load (or lazily per level theme). */
'use strict';
const ART = (() => {

  function cv(w, h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function cx(c){ const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return x; }

  // tiny deterministic rng for texture noise
  function rng(seed){ let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

  const T = 36; // tile px (matches game logical tile)

  // ---------- placeholder tiles (Phase 0/1 — replaced by HD pass in Phase 7) ----------
  const tiles = {};

  function buildTiles(){
    // brick
    let c = cv(T, T), x = cx(c), r = rng(7);
    x.fillStyle = '#7a4a2b'; x.fillRect(0, 0, T, T);
    x.fillStyle = '#5d3620';
    for (let row = 0; row < 3; row++) for (let col = 0; col < 2; col++)
      x.fillRect(col * 18 + (row % 2 ? 9 : 0) - 9, row * 12, 17, 11);
    x.fillStyle = 'rgba(0,0,0,.25)';
    for (let i = 0; i < 30; i++) x.fillRect((r() * T) | 0, (r() * T) | 0, 2, 2);
    tiles.brick = c;

    // solid rock
    c = cv(T, T); x = cx(c); r = rng(13);
    x.fillStyle = '#3d3a4a'; x.fillRect(0, 0, T, T);
    x.fillStyle = '#2c2937';
    for (let i = 0; i < 8; i++) x.fillRect((r() * T) | 0, (r() * T) | 0, 6 + r() * 10, 4 + r() * 8);
    x.strokeStyle = '#555066'; x.strokeRect(1, 1, T - 2, T - 2);
    tiles.solid = c;

    // ladder
    c = cv(T, T); x = cx(c);
    x.fillStyle = '#caa24a';
    x.fillRect(6, 0, 5, T); x.fillRect(T - 11, 0, 5, T);
    for (let yy = 4; yy < T; yy += 11) x.fillRect(6, yy, T - 12, 4);
    tiles.ladder = c;

    // bar
    c = cv(T, T); x = cx(c);
    x.fillStyle = '#c0bccc'; x.fillRect(0, 4, T, 4);
    x.fillStyle = '#807a92'; x.fillRect(0, 8, T, 2);
    tiles.bar = c;

    // gold
    c = cv(T, T); x = cx(c);
    x.fillStyle = '#ffd23f';
    x.beginPath(); x.moveTo(8, 26); x.lineTo(14, 14); x.lineTo(24, 12); x.lineTo(29, 22); x.lineTo(24, 28); x.lineTo(12, 29); x.closePath(); x.fill();
    x.fillStyle = '#fff3b0'; x.fillRect(14, 16, 5, 4);
    tiles.gold = c;
  }
  buildTiles();

  return { T, tiles, cv, cx, rng };
})();
