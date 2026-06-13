/* Pay Dirt — art.js
   Procedural HD pixel-art sprites + parallax cave backdrop. No external assets.
   Sprites are painted with fillRect blocks on small "logical-pixel" canvases and
   scaled up with imageSmoothing off → crisp pixel edges, controllable animation. */
'use strict';
const ART = (() => {

  function cv(w, h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function cx(c){ const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return x; }
  function rng(seed){ let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  // blend two #rrggbb colors; t=0 -> a, t=1 -> b
  function mix(a, b, t){
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
    const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
    const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }

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

    // ladder — clean rails + rounded rungs. Rungs are spaced 12px (centres 6/18/30)
    // so vertically-stacked tiles tile SEAMLESSLY with perfectly even spacing.
    function buildLadder(p){
      const cc = cv(T, T), xx = cx(cc);
      const LX = 7, RX = 25, RW = 4;            // rail x positions, width 4
      // rail outline (dark) for definition against brick/background
      xx.fillStyle = p.edge;
      xx.fillRect(LX - 1, 0, RW + 2, T); xx.fillRect(RX - 1, 0, RW + 2, T);
      // rails
      xx.fillStyle = p.rail; xx.fillRect(LX, 0, RW, T); xx.fillRect(RX, 0, RW, T);
      xx.fillStyle = p.railHi; xx.fillRect(LX, 0, 1, T); xx.fillRect(RX, 0, 1, T);       // left highlight
      xx.fillStyle = p.edge;   xx.fillRect(LX + RW - 1, 0, 1, T); xx.fillRect(RX + RW - 1, 0, 1, T); // right shade
      // rungs (between the rails) at y = 6, 18, 30
      const rL = LX + RW, rR = RX, rw = rR - rL;
      for (const yc of [6, 18, 30]){
        xx.fillStyle = p.edge;   xx.fillRect(rL, yc - 3, rw, 6);   // rung outline
        xx.fillStyle = p.rung;   xx.fillRect(rL, yc - 2, rw, 4);   // rung body
        xx.fillStyle = p.rungHi; xx.fillRect(rL, yc - 2, rw, 1);   // top highlight
        xx.fillStyle = p.edge;   xx.fillRect(rL, yc + 1, rw, 1);   // bottom shade
      }
      return cc;
    }
    tiles.ladder = buildLadder({ edge: '#4a3115', rail: '#9c6b32', railHi: '#c89250', rung: '#b07d3c', rungHi: '#d8a85e' });
    tiles.exit   = buildLadder({ edge: '#0f5048', rail: '#2aa79b', railHi: '#6ff0e2', rung: '#3fd2c7', rungHi: '#b6fff5' });

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
  // Art area is 16x26 with a 1px outline margin → 18x28 canvas. The body is painted
  // on a temp canvas, a dark silhouette is derived from it, and the silhouette is
  // stamped at 8 offsets to give every sprite a clean 1px outline (the thing that
  // makes pixel art read). Anchored feet-at-bottom-center.
  const FW = 18, FH = 28, M = 1;

  function darken(src){
    const s = cv(FW, FH), x = cx(s);
    x.drawImage(src, 0, 0);
    x.globalCompositeOperation = 'source-in';
    x.fillStyle = '#0b0712';
    x.fillRect(0, 0, FW, FH);
    return s;
  }

  // Draw the un-outlined figure. Art coords 0..15 x, 0..25 y (offset by M).
  function paintBody(pose, fi, pal){
    const c = cv(FW, FH), x = cx(c);
    const R = (px, py, w, h, col) => { x.fillStyle = col; x.fillRect(px + M, py + M, w, h); };
    const skinSh = mix(pal.face, '#000', 0.28);

    // animation params
    const run4 = [0, 1, 2, 1][fi % 4];          // 0..2 stride
    const stride = pose === 'run' ? [2, 0, -2, 0][fi % 4] : 0;
    const lift = pose === 'run' ? [0, 1, 0, 1][fi % 4] : 0;
    const climbA = pose === 'climb' ? (fi % 2 ? 1 : -1) : 0;
    const bob = (pose === 'idle' && fi % 2) ? 1 : 0;
    const T = bob;                               // vertical bob offset

    // ---- LEGS ----
    if (pose === 'fall'){
      R(3, 19, 3, 5, pal.legs); R(10, 19, 3, 5, pal.legs);
      R(2, 22, 4, 2, pal.boot); R(10, 22, 4, 2, pal.boot);
    } else if (pose === 'bar'){
      R(6, 19, 4, 6, pal.legs); R(6, 24, 5, 2, pal.boot);
    } else if (pose === 'climb'){
      R(5, 19, 3, 5 - climbA, pal.legs); R(9, 19, 3, 5 + climbA, pal.legs);
      R(5, 24 - climbA, 3, 2, pal.boot); R(9, 24 + climbA, 3, 2, pal.boot);
    } else if (pose === 'dig'){
      R(4, 20, 4, 4, pal.legs); R(9, 20, 4, 4, pal.legs);
      R(3, 23, 5, 2, pal.boot); R(9, 23, 5, 2, pal.boot);
    } else if (pose === 'run'){
      R(5 - stride, 19 + lift, 3, 5 - lift, pal.legs); R(8 + stride, 19, 3, 5, pal.legs);
      R(4 - stride, 23 + lift, 4, 2, pal.boot);        R(8 + stride, 23, 5, 2, pal.boot);
    } else { // idle
      R(5, 19, 3, 5, pal.legs); R(9, 19, 3, 5, pal.legs);
      R(4, 23, 4, 2, pal.boot); R(9, 23, 4, 2, pal.boot);
    }

    // ---- TORSO / COAT ----
    const ty = (pose === 'dig') ? 12 : 11 + T;
    R(4, ty, 9, 8, pal.coat);
    R(4, ty, 9, 2, pal.coatHi);                 // top highlight
    R(4, ty + 6, 9, 2, pal.coatDk);             // bottom shade
    R(12, ty + 1, 1, 6, pal.coatDk);            // right edge shade
    R(7, ty + 1, 1, 6, pal.accent);             // center strap

    // ---- ARMS ----
    const armCol = pal.coatDk;
    if (pose === 'climb'){
      R(3, 8 + (climbA < 0 ? 0 : 4), 2, 5, pal.coat);  R(2, 7 + (climbA < 0 ? 0 : 4), 2, 2, pal.face);
      R(12, 8 + (climbA < 0 ? 4 : 0), 2, 5, pal.coat); R(13, 7 + (climbA < 0 ? 4 : 0), 2, 2, pal.face);
    } else if (pose === 'bar'){
      R(4, 2, 2, 9, pal.coat); R(11, 2, 2, 9, pal.coat);  // reaching straight up
      R(4, 1, 2, 2, pal.face); R(11, 1, 2, 2, pal.face);  // hands gripping
    } else if (pose === 'dig'){
      R(3, ty + 1, 2, 5, armCol);                       // back arm
      R(12, ty + 1, 4, 2, pal.coat); R(15, ty + 2, 2, 2, pal.face); // front arm thrust
    } else if (pose === 'fall'){
      R(2, 9, 2, 4, pal.coat); R(13, 9, 2, 4, pal.coat); // flailing up
      R(2, 8, 2, 2, pal.face); R(13, 8, 2, 2, pal.face);
    } else { // idle / run — back arm + front arm swinging
      const sw = pose === 'run' ? stride : 0;
      R(3 - (sw < 0 ? sw : 0), ty + 1, 2, 6, armCol);
      R(12 + (sw > 0 ? sw : 0), ty + 1, 2, 6, pal.coat);
      R(12 + (sw > 0 ? sw : 0), ty + 6, 2, 2, pal.face); // front hand
    }

    // ---- HEAD ----
    const hy = pose === 'dig' ? 6 : 5 + T;
    const back = pose === 'climb';
    if (back){
      // back of head: hat + hair, no face
      R(5, hy + 1, 7, 5, mix(pal.face, '#000', 0.4));
    } else {
      R(5, hy, 7, 6, pal.face);
      R(5, hy, 7, 1, skinSh);                   // brow shadow under brim
      R(5, hy + 5, 7, 1, skinSh);               // jaw shade
      // face — looking right
      R(10, hy + 2, 1, 2, pal.outline);         // eye
      R(6, hy + 4, 4, 1, mix(pal.face, '#5a3a1e', 0.7)); // moustache
      R(11, hy + 3, 1, 1, skinSh);              // nose tip
    }

    // ---- HARD HAT ----
    R(3, hy - 1, 11, 2, pal.hat);               // brim
    R(3, hy - 1, 11, 1, pal.hatHi);
    R(5, hy - 4, 7, 3, pal.hat);                // dome
    R(5, hy - 4, 7, 1, pal.hatHi);
    R(8, hy - 4, 1, 3, mix(pal.hat, '#000', 0.25)); // dome ridge
    if (pal.lampOnHat){ R(7, hy - 5, 3, 1, '#3a2a12'); R(8, hy - 5, 1, 1, pal.lantern); } // headlamp

    // ---- LANTERN (player) ----
    if (pal.lantern && pose !== 'climb' && pose !== 'bar'){
      const lx = pose === 'dig' ? 16 : 14 + (pose === 'run' ? Math.max(0, stride) : 0);
      R(lx, ty + 6, 3, 4, '#3a2a12');           // frame
      R(lx, ty + 7, 3, 2, pal.lantern);         // glass
      R(lx + 1, ty + 5, 1, 1, '#6b5126');       // handle
    }

    // ---- dig tool ----
    if (pose === 'dig'){ R(15, hy + 4, 3, 2, '#cfd6e0'); R(16, hy + 6, 2, 5, '#9aa0ad'); }

    // ---- guard marks ----
    if (pal.mark === 'antenna' && !back){ R(8, hy - 6, 1, 2, '#2a1a06'); R(7, hy - 7, 2, 2, '#ffe66b'); }
    if (pal.mark === 'trowel' && pose !== 'climb' && pose !== 'bar'){ R(14, ty + 3, 4, 2, '#c2c7d0'); R(16, ty + 5, 2, 3, '#7e8490'); }

    return c;
  }

  function paintFigure(pose, fi, pal){
    const body = paintBody(pose, fi, pal);
    const sil = darken(body);
    const c = cv(FW, FH), x = cx(c);
    // shadow
    x.fillStyle = 'rgba(0,0,0,.3)'; x.fillRect(4, FH - 2, 10, 2);
    // 8-way outline from the silhouette
    for (const o of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) x.drawImage(sil, o[0], o[1]);
    x.drawImage(body, 0, 0);
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
    player: { outline: '#10202a', face: '#e8b07a', hat: '#ffb02e', hatHi: '#ffd676', coat: '#2f8f86', coatHi: '#46b3a8', coatDk: '#1d5f59', legs: '#26405a', boot: '#161f2e', accent: '#13302c', lantern: '#fff3b0', lampOnHat: true },
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
