/* Pay Dirt — art.js
   Procedural HD pixel-art sprites + parallax cave backdrop. No external assets.
   Sprites are painted with fillRect blocks on small "logical-pixel" canvases and
   scaled up with imageSmoothing off → crisp pixel edges, controllable animation. */
'use strict';
const ART = (() => {

  function cv(w, h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function cx(c){ const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return x; }
  function rng(seed){ let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

  const T = 36; // tile px

  /* ---------------- tiles ---------------- */
  const tiles = {};
  function shade(x, c, n, a){ x.fillStyle = a == null ? c : c; x.globalAlpha = a == null ? 1 : a; }

  function buildTiles(){
    let c, x, r;

    // diggable brick — earthy, beveled courses, speckle
    c = cv(T, T); x = cx(c); r = rng(7);
    x.fillStyle = '#6b4326'; x.fillRect(0, 0, T, T);
    const bh = 9;
    for (let row = 0, ry = 0; ry < T; row++, ry += bh){
      const off = (row % 2) ? -12 : 0;
      for (let bx = off; bx < T; bx += 24){
        x.fillStyle = '#7d5230'; x.fillRect(bx + 1, ry + 1, 22, bh - 2);
        x.fillStyle = '#915e36'; x.fillRect(bx + 1, ry + 1, 22, 2);          // top highlight
        x.fillStyle = '#532f1a'; x.fillRect(bx + 1, ry + bh - 2, 22, 1);     // bottom shadow
      }
    }
    x.globalAlpha = .5;
    for (let i = 0; i < 50; i++){ x.fillStyle = (r() < .5 ? '#3c2212' : '#a06e42'); x.fillRect((r() * T) | 0, (r() * T) | 0, 1, 1); }
    x.globalAlpha = 1;
    tiles.brick = c;

    // solid rock — cool, faceted, undiggable
    c = cv(T, T); x = cx(c); r = rng(13);
    x.fillStyle = '#3a3550'; x.fillRect(0, 0, T, T);
    for (let i = 0; i < 10; i++){
      x.fillStyle = ['#332e47', '#433d5e', '#2c2840'][i % 3];
      const w = 8 + r() * 16, h = 6 + r() * 12;
      x.fillRect((r() * (T - w)) | 0, (r() * (T - h)) | 0, w | 0, h | 0);
    }
    x.fillStyle = 'rgba(150,140,180,.25)'; x.fillRect(0, 0, T, 2);
    x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(0, T - 2, T, 2);
    tiles.solid = c;

    // ladder — wooden rails + rungs, highlight
    c = cv(T, T); x = cx(c);
    x.fillStyle = '#3a2c1c'; x.fillRect(0, 0, T, T); x.clearRect(0, 0, T, T);
    x.fillStyle = '#a9803f'; x.fillRect(6, 0, 5, T); x.fillRect(T - 11, 0, 5, T);
    x.fillStyle = '#c79a52'; x.fillRect(6, 0, 2, T); x.fillRect(T - 11, 0, 2, T);
    for (let yy = 3; yy < T; yy += 10){
      x.fillStyle = '#b78a47'; x.fillRect(6, yy, T - 12, 5);
      x.fillStyle = '#d6a85c'; x.fillRect(6, yy, T - 12, 2);
    }
    tiles.ladder = c;
    // exit ladder — glowing teal variant
    c = cv(T, T); x = cx(c);
    x.fillStyle = '#2aa79b'; x.fillRect(6, 0, 5, T); x.fillRect(T - 11, 0, 5, T);
    x.fillStyle = '#6ff0e2'; x.fillRect(6, 0, 2, T); x.fillRect(T - 11, 0, 2, T);
    for (let yy = 3; yy < T; yy += 10){ x.fillStyle = '#3fd2c7'; x.fillRect(6, yy, T - 12, 5); x.fillStyle = '#9ff7ec'; x.fillRect(6, yy, T - 12, 2); }
    tiles.exit = c;

    // bar — brass pipe with sheen
    c = cv(T, T); x = cx(c);
    x.fillStyle = '#9a7b3a'; x.fillRect(0, 4, T, 7);
    x.fillStyle = '#d8b85e'; x.fillRect(0, 4, T, 2);
    x.fillStyle = '#5e4a22'; x.fillRect(0, 10, T, 1);
    tiles.bar = c;

    // gold nugget — faceted with highlight
    c = cv(T, T); x = cx(c);
    const gx = 18, gy = 20;
    x.fillStyle = '#b8860b';
    x.beginPath(); x.moveTo(gx - 10, gy + 2); x.lineTo(gx - 6, gy - 8); x.lineTo(gx + 6, gy - 9); x.lineTo(gx + 11, gy + 1); x.lineTo(gx + 5, gy + 9); x.lineTo(gx - 7, gy + 9); x.closePath(); x.fill();
    x.fillStyle = '#ffd23f';
    x.beginPath(); x.moveTo(gx - 8, gy + 1); x.lineTo(gx - 4, gy - 6); x.lineTo(gx + 5, gy - 6); x.lineTo(gx + 8, gy); x.lineTo(gx + 3, gy + 7); x.lineTo(gx - 6, gy + 7); x.closePath(); x.fill();
    x.fillStyle = '#fff3b0'; x.fillRect(gx - 4, gy - 4, 5, 3);
    tiles.gold = c;

    // TNT crate — wood + red bands + fuse
    c = cv(T, T); x = cx(c);
    x.fillStyle = '#8a5a2b'; x.fillRect(2, 2, T - 4, T - 4);
    x.fillStyle = '#6b4220'; x.fillRect(2, 2, T - 4, 3); x.fillRect(2, T - 5, T - 4, 3);
    x.fillStyle = '#c43b2a'; x.fillRect(2, 14, T - 4, 8);
    x.fillStyle = '#e85a44'; x.fillRect(2, 14, T - 4, 2);
    x.fillStyle = '#1c1018'; x.font = 'bold 9px sans-serif'; x.textAlign = 'center'; x.fillText('TNT', T / 2, 21);
    tiles.crate = c;

    // crumbling brick — cracked, lighter mortar
    c = cv(T, T); x = cx(c); r = rng(21);
    x.drawImage(tiles.brick, 0, 0);
    x.strokeStyle = 'rgba(20,10,4,.7)'; x.lineWidth = 1.5;
    x.beginPath(); x.moveTo(4, 6); x.lineTo(14, 16); x.lineTo(9, 26); x.moveTo(20, 3); x.lineTo(24, 18); x.lineTo(31, 28); x.stroke();
    tiles.crumble = c;

    // conveyor — metal deck + roller studs (direction drawn dynamically)
    for (const dir of ['L', 'R']){
      c = cv(T, T); x = cx(c);
      x.fillStyle = '#454152'; x.fillRect(0, 0, T, T);
      x.fillStyle = '#5a5568'; x.fillRect(0, 2, T, 5);
      x.fillStyle = '#2e2b3a'; x.fillRect(0, T - 6, T, 6);
      for (let i = 4; i < T; i += 9){ x.fillStyle = '#6f6a80'; x.fillRect(i, 10, 5, 5); }
      tiles['belt' + dir] = c;
    }
    tiles.T = T;
  }
  buildTiles();

  /* ---------------- figures (player + guards) ---------------- */
  // Painted on an 18x24 logical-pixel canvas, anchored feet-at-bottom-center.
  const FW = 18, FH = 24;
  function fcanvas(){ return cv(FW, FH); }

  // palette: {outline, skinned hat hi, hat, face, coat, coatHi, coatDk, legs, boot, accent}
  function paintFigure(pose, fi, pal){
    const c = fcanvas(), x = cx(c);
    const R = (px, py, w, h, col) => { x.fillStyle = col; x.fillRect(px, py, w, h); };
    // limb phase
    const swing = pose === 'run' ? [0, 1, 0, -1][fi % 4] : 0;
    const climbA = pose === 'climb' ? (fi % 2 ? 1 : -1) : 0;
    const bob = pose === 'idle' ? (fi % 2) : 0;
    const top = 2 + bob;

    // shadow
    R(4, FH - 1, 10, 1, 'rgba(0,0,0,.35)');

    // legs
    if (pose === 'fall'){
      R(3, 17, 4, 5, pal.legs); R(11, 17, 4, 5, pal.legs);
      R(3, 21, 4, 2, pal.boot); R(11, 21, 4, 2, pal.boot);
    } else if (pose === 'climb'){
      R(6, 17, 3, 5 - climbA, pal.legs); R(9, 17, 3, 5 + climbA, pal.legs);
      R(6, 22 - climbA, 3, 2, pal.boot); R(9, 22 + climbA, 3, 2, pal.boot);
    } else if (pose === 'dig'){
      R(5, 17, 4, 5, pal.legs); R(10, 17, 4, 5, pal.legs);
      R(5, 21, 4, 2, pal.boot); R(10, 21, 4, 2, pal.boot);
    } else { // idle / run / bar
      R(6 - swing, 17, 3, 5, pal.legs); R(9 + swing, 17, 3, 5, pal.legs);
      R(6 - swing, 21, 4, 2, pal.boot); R(9 + swing, 21, 4, 2, pal.boot);
    }

    // torso / coat
    R(4, 9 + top, 10, 8, pal.coat);
    R(4, 9 + top, 10, 2, pal.coatHi);
    R(4, 15 + top, 10, 2, pal.coatDk);
    R(5, 13 + top, 8, 1, pal.accent); // belt/strap

    // arms
    if (pose === 'climb'){
      R(3, 8 + top + (climbA < 0 ? 0 : 3), 3, 5, pal.coat);
      R(12, 8 + top + (climbA < 0 ? 3 : 0), 3, 5, pal.coat);
    } else if (pose === 'bar'){
      R(2, 6 + top, 3, 5, pal.coat); R(13, 6 + top, 3, 5, pal.coat); // reaching up
    } else if (pose === 'dig'){
      R(13, 11 + top, 5, 3, pal.coat); // arm forward
      R(2, 11 + top, 3, 4, pal.coat);
    } else {
      R(2 + swing, 10 + top, 3, 6, pal.coat); R(13 - swing, 10 + top, 3, 6, pal.coat);
    }

    // head + face
    R(5, 4 + top, 8, 6, pal.face);
    R(11, 6 + top, 2, 2, pal.outline); // eye (facing right)
    // hard hat
    R(4, 2 + top, 10, 3, pal.hat);
    R(4, 2 + top, 10, 1, pal.hatHi);
    R(6, 0 + top, 6, 2, pal.hat);
    R(6, 0 + top, 6, 1, pal.hatHi);

    // lantern (player only) — small glowing box on the front hand
    if (pal.lantern && pose !== 'climb' && pose !== 'bar'){
      const lx = pose === 'dig' ? 16 : 15 + swing;
      R(lx, 13 + top, 3, 4, '#3a2a12');
      R(lx, 14 + top, 3, 2, pal.lantern);
    }
    // dig tool
    if (pose === 'dig'){ R(16, 9 + top, 2, 6, '#9aa0ad'); R(15, 8 + top, 4, 2, '#c8cdd8'); }

    // guard-type marks (readability)
    if (pal.mark === 'antenna'){ R(8, top - 2, 2, 2, pal.hatHi); R(8, top - 4, 2, 2, '#ffe66b'); } // scout: bright antenna
    if (pal.mark === 'trowel' && pose !== 'climb' && pose !== 'bar'){ R(15, 12 + top, 5, 2, '#b8bcc6'); R(17, 13 + top, 2, 4, '#7e8490'); } // mason: trowel

    return c;
  }

  function buildFrames(pal){
    return {
      idle: [paintFigure('idle', 0, pal), paintFigure('idle', 1, pal)],
      run: [0, 1, 2, 3].map(i => paintFigure('run', i, pal)),
      climb: [paintFigure('climb', 0, pal), paintFigure('climb', 1, pal)],
      bar: [paintFigure('bar', 0, pal), paintFigure('bar', 1, pal)],
      fall: [paintFigure('fall', 0, pal)],
      dig: [paintFigure('dig', 0, pal)],
      stun: [paintFigure('fall', 0, pal)],
    };
  }

  const PAL = {
    player: { outline: '#10202a', face: '#e8b07a', hat: '#ffb02e', hatHi: '#ffd676', coat: '#2f8f86', coatHi: '#46b3a8', coatDk: '#1d5f59', legs: '#26405a', boot: '#161f2e', accent: '#13302c', lantern: '#fff3b0' },
    guard:  { outline: '#2a0c12', face: '#d89a6a', hat: '#b23a3a', hatHi: '#e06868', coat: '#8f2f3a', coatHi: '#b3464f', coatDk: '#5f1d24', legs: '#3a1a22', boot: '#1f0c10', accent: '#5a1a20', mark: null },
    scout:  { outline: '#2a1a06', face: '#e8c07a', hat: '#ff8b2e', hatHi: '#ffc070', coat: '#c46a1f', coatHi: '#e09040', coatDk: '#8a4710', legs: '#5a3210', boot: '#2a1808', accent: '#7a3e0f', mark: 'antenna' },
    mason:  { outline: '#101820', face: '#cdb89a', hat: '#7a8694', hatHi: '#a8b4c0', coat: '#4a5560', coatHi: '#646f7c', coatDk: '#2e353e', legs: '#2a3038', boot: '#181c22', accent: '#343a44', mark: 'trowel' },
  };

  const frames = {
    player: buildFrames(PAL.player),
    guard: buildFrames(PAL.guard),
    scout: buildFrames(PAL.scout),
    mason: buildFrames(PAL.mason),
  };

  /* ---------------- power-up icons ---------------- */
  const PUPS = {};
  function buildPups(){
    const mk = (draw) => { const c = cv(24, 24), x = cx(c); draw(x); return c; };
    PUPS[1] = mk(x => { x.fillStyle = '#8a5a2b'; x.fillRect(4, 6, 16, 14); x.fillStyle = '#c43b2a'; x.fillRect(4, 11, 16, 5); x.fillStyle = '#fff3b0'; x.fillRect(11, 2, 2, 5); }); // TNT
    PUPS[2] = mk(x => { x.fillStyle = '#3fd2c7'; x.fillRect(5, 12, 14, 8); x.fillRect(5, 7, 6, 8); x.fillStyle = '#9ff7ec'; x.fillRect(5, 7, 6, 2); }); // boots
    PUPS[3] = mk(x => { x.globalAlpha = .85; x.fillStyle = '#b07fff'; x.beginPath(); x.arc(12, 12, 8, 0, 7); x.fill(); x.globalAlpha = 1; x.fillStyle = '#e0ccff'; x.fillRect(9, 9, 2, 2); }); // cloak
    PUPS[4] = mk(x => { x.strokeStyle = '#ff5c5c'; x.lineWidth = 4; x.beginPath(); x.arc(12, 11, 6, Math.PI * .15, Math.PI * .85, true); x.stroke(); x.fillStyle = '#ff5c5c'; x.fillRect(5, 13, 4, 5); x.fillRect(15, 13, 4, 5); x.fillStyle = '#cfd6e0'; x.fillRect(5, 16, 4, 3); x.fillRect(15, 16, 4, 3); }); // magnet
    PUPS[5] = mk(x => { x.fillStyle = '#7fd24a'; x.fillRect(10, 4, 4, 11); x.beginPath(); x.moveTo(6, 14); x.lineTo(18, 14); x.lineTo(12, 21); x.closePath(); x.fill(); x.fillStyle = '#b6f08a'; x.fillRect(10, 4, 2, 11); }); // shovel
  }
  buildPups();

  return { T, tiles, frames, PUPS, PAL, cv, cx, rng, FW, FH };
})();
