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

    // ---- carved stone-block tile builder (beveled blocks, mortar, cracks, veins) ----
    function stoneTile(p){
      const cc = cv(T, T), xx = cx(cc), rr = rng(p.seed);
      xx.fillStyle = p.mortar; xx.fillRect(0, 0, T, T);          // mortar shows in the gaps
      const bh = 12;
      for (let row = 0, ry = 0; ry < T; row++, ry += bh){
        const off = (row % 2) ? -10 : 1;                          // running bond
        for (let bx = off; bx < T; bx += 19){
          const x0 = bx + 1, y0 = ry + 1, w = 18, h = bh - 2;
          xx.fillStyle = p.base; xx.fillRect(x0, y0, w, h);
          xx.fillStyle = p.hi;   xx.fillRect(x0, y0, w, 2); xx.fillRect(x0, y0, 2, h);      // lit top+left bevel
          xx.fillStyle = p.sh;   xx.fillRect(x0, y0 + h - 2, w, 2); xx.fillRect(x0 + w - 2, y0, 2, h); // dark bottom+right
          // speckle
          xx.globalAlpha = .5;
          for (let k = 0; k < 7; k++){ xx.fillStyle = rr() < .5 ? p.sh : p.hi; xx.fillRect(x0 + (rr() * w) | 0, y0 + (rr() * h) | 0, 1, 1); }
          xx.globalAlpha = 1;
          // occasional crack
          if (rr() < .35){ xx.strokeStyle = p.crack; xx.lineWidth = 1; xx.beginPath(); let px2 = x0 + 3 + rr() * (w - 6), py2 = y0 + 1; xx.moveTo(px2, py2); for (let s = 0; s < 3; s++){ px2 += (rr() - .5) * 6; py2 += h / 3; xx.lineTo(px2, py2); } xx.stroke(); }
          // gold vein fleck
          if (p.vein && rr() < .22){ xx.fillStyle = '#e9c64a'; xx.fillRect(x0 + 3 + (rr() * (w - 6)) | 0, y0 + 3 + (rr() * (h - 6)) | 0, 2, 1); }
        }
      }
      return cc;
    }
    tiles.brick = stoneTile({ seed: 7,  mortar: '#2c1d10', base: '#7a5836', hi: '#9a7548', sh: '#4e3720', crack: 'rgba(20,10,4,.6)', vein: true });
    tiles.solid = stoneTile({ seed: 13, mortar: '#181628', base: '#3c3a52', hi: '#54506e', sh: '#26233a', crack: 'rgba(8,6,16,.6)', vein: false });

    // mossy-cap variants (used on the TOP row of a platform — context-aware in the renderer)
    function withMossCap(src){
      const cc = cv(T, T), xx = cx(cc), rr = rng(99);
      xx.drawImage(src, 0, 0);
      xx.fillStyle = '#4a7a32'; xx.fillRect(0, 0, T, 4);                  // moss band
      xx.fillStyle = '#5f9a40'; xx.fillRect(0, 0, T, 2);                  // lit moss
      xx.fillStyle = '#356026'; xx.fillRect(0, 4, T, 1);                  // moss underline
      for (let i = 0; i < T; i += 2){ if (rr() < .5){ const bl = 2 + (rr() * 4) | 0; xx.fillStyle = rr() < .5 ? '#6fb34a' : '#4a7a32'; xx.fillRect(i, 4 - bl + 1, 1, bl); } } // grass blades
      // a few dangling moss bits
      for (let k = 0; k < 4; k++){ const mx = (rr() * T) | 0; xx.fillStyle = '#3c6a28'; xx.fillRect(mx, 4, 1, 2 + (rr() * 3) | 0); }
      return cc;
    }
    tiles.brickTop = withMossCap(tiles.brick);
    tiles.solidTop = withMossCap(tiles.solid);

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

    // bar — solid brass pipe with bolt joints + bright sheen (reads as connected segments)
    c = cv(T, T); x = cx(c);
    { const py0 = 3, ph = 9;
      x.fillStyle = '#8a6f34'; x.fillRect(0, py0, T, ph);
      x.fillStyle = '#caa75a'; x.fillRect(0, py0 + 1, T, 3);
      x.fillStyle = '#f2da8c'; x.fillRect(0, py0 + 1, T, 1);                 // bright top highlight
      x.fillStyle = '#5e4a22'; x.fillRect(0, py0 + ph - 2, T, 2);           // underside shadow
      x.fillStyle = '#6e5a2c'; x.fillRect(2, py0, 3, ph); x.fillRect(T - 5, py0, 3, ph); x.fillRect(T / 2 - 1, py0, 3, ph); // bolt collars
      x.fillStyle = '#efd684'; x.fillRect(3, py0 + 2, 1, 1); x.fillRect(T - 4, py0 + 2, 1, 1); x.fillRect(T / 2, py0 + 2, 1, 1); }
    tiles.bar = c;

    // gold nugget — multi-facet gem with bright core (richer + brighter)
    c = cv(T, T); x = cx(c);
    const gx = 18, gy = 19;
    x.fillStyle = '#9a6e0a'; x.beginPath(); x.moveTo(gx - 11, gy + 1); x.lineTo(gx - 6, gy - 9); x.lineTo(gx + 7, gy - 10); x.lineTo(gx + 12, gy); x.lineTo(gx + 6, gy + 10); x.lineTo(gx - 8, gy + 10); x.closePath(); x.fill();
    x.fillStyle = '#e0a91c'; x.beginPath(); x.moveTo(gx - 8, gy); x.lineTo(gx - 4, gy - 7); x.lineTo(gx + 5, gy - 7); x.lineTo(gx + 9, gy - 1); x.lineTo(gx + 4, gy + 8); x.lineTo(gx - 6, gy + 8); x.closePath(); x.fill();
    x.fillStyle = '#ffd23f'; x.beginPath(); x.moveTo(gx - 5, gy - 1); x.lineTo(gx - 2, gy - 5); x.lineTo(gx + 4, gy - 5); x.lineTo(gx + 6, gy + 1); x.lineTo(gx + 2, gy + 6); x.lineTo(gx - 4, gy + 5); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(110,72,0,.45)'; x.lineWidth = 1; x.beginPath(); x.moveTo(gx - 4, gy - 5); x.lineTo(gx, gy); x.lineTo(gx + 4, gy - 5); x.moveTo(gx, gy); x.lineTo(gx + 1, gy + 6); x.stroke();
    x.fillStyle = '#fff6c8'; x.fillRect(gx - 3, gy - 4, 3, 2); x.fillRect(gx - 1, gy - 2, 1, 1);
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
  // Higher-res figures (art area 32x46 + 1px outline margin → 34x48). Built on a temp
  // canvas, a dark silhouette is derived and stamped at 8 offsets for a clean outline,
  // and corners are rounded with clearRect so the silhouette doesn't read as a box.
  // Rendered downscaled+smoothed in-game, so it looks crisp but not chunky.
  const FW = 34, FH = 48, M = 1;

  function darken(src){
    const s = cv(FW, FH), x = cx(s);
    x.drawImage(src, 0, 0);
    x.globalCompositeOperation = 'source-in';
    x.fillStyle = '#0b0712';
    x.fillRect(0, 0, FW, FH);
    return s;
  }

  // Draw the un-outlined figure. Art coords ~0..31 x, 0..45 y (offset by M).
  function paintBody(pose, fi, pal){
    const c = cv(FW, FH), x = cx(c);
    const R = (px, py, w, h, col) => { x.fillStyle = col; x.fillRect(px + M, py + M, w, h); };
    const CL = (px, py, w, h) => x.clearRect(px + M, py + M, w, h);   // for rounding corners
    const skin = pal.face, skinSh = mix(skin, '#000', 0.26), skinHi = mix(skin, '#fff', 0.16);
    const coat = pal.coat, coatHi = pal.coatHi, coatDk = pal.coatDk;
    const legs = pal.legs, legsHi = mix(legs, '#fff', 0.16), boot = pal.boot, bootHi = mix(boot, '#fff', 0.18);
    const moust = mix(skin, '#4a2c12', 0.78);
    const back = pose === 'climb';

    // animation params
    const stride = pose === 'run' ? [4, 0, -4, 0][fi % 4] : 0;
    const lift = pose === 'run' ? [0, 3, 0, 3][fi % 4] : 0;
    const climbA = pose === 'climb' ? (fi % 2 ? 3 : -3) : 0;
    const bob = (pose === 'idle' && fi % 2) ? 1 : 0;
    const T = bob;

    const ty = (pose === 'dig' ? 23 : 22 + T);   // torso top
    const hy = (pose === 'dig' ? 9 : 8 + T);      // hat/head anchor
    const ly = 34;                                // legs top (feet stay grounded)

    // ===== LEGS =====
    function leg(px, len, bx){ R(px, ly, 5, len, legs); R(px, ly, 1, len, legsHi); R(bx, ly + len, 6, 3, boot); R(bx, ly + len + 2, 6, 1, bootHi); }
    if (pose === 'fall'){
      R(8, ly, 5, 8, legs); R(19, ly, 5, 8, legs); R(6, ly + 8, 6, 3, boot); R(19, ly + 8, 6, 3, boot);
    } else if (pose === 'bar'){
      leg(13, 9, 12); leg(17, 9, 16);
    } else if (pose === 'climb'){
      leg(11, 9 - climbA, 10); leg(17, 9 + climbA, 16);
    } else if (pose === 'dig'){
      R(9, ly, 6, 7, legs); R(17, ly, 6, 7, legs); R(7, ly + 7, 7, 3, boot); R(17, ly + 7, 7, 3, boot);
    } else if (pose === 'run'){
      leg(11 - stride, 9 - lift, 9 - stride); leg(16 + stride, 9, 16 + stride);
    } else { // idle
      leg(11, 9, 10); leg(17, 9, 16);
    }

    // ===== TORSO / HOODIE =====
    R(8, ty, 17, 4, coat);                       // shoulders
    R(9, ty + 4, 15, 9, coat);                   // body
    R(8, ty, 17, 2, coatHi);                     // top light
    R(9, ty + 11, 15, 2, coatDk);                // hem shade
    R(23, ty + 4, 1, 9, coatDk);                 // right edge shade
    R(13, ty, 8, 2, coatDk);                     // hood collar
    R(16, ty + 2, 1, 10, pal.accent);            // zipper
    R(10, ty + 8, 13, 1, coatDk);                // pocket seam
    CL(8, ty, 1, 1); CL(24, ty, 1, 1);           // round shoulder corners
    CL(9, ty + 12, 1, 1); CL(23, ty + 12, 1, 1); // round waist corners

    // ===== ARMS =====
    if (pose === 'climb'){
      R(6, 16 + (climbA < 0 ? 0 : 6), 4, 8, coat); R(5, 14 + (climbA < 0 ? 0 : 6), 4, 3, skin);
      R(24, 16 + (climbA < 0 ? 6 : 0), 4, 8, coat); R(25, 14 + (climbA < 0 ? 6 : 0), 4, 3, skin);
    } else if (pose === 'bar'){
      R(8, 4, 4, 16, coat); R(22, 4, 4, 16, coat);
      R(7, 2, 5, 3, skin); R(22, 2, 5, 3, skin);   // gripping hands
    } else if (pose === 'dig'){
      R(6, ty + 3, 4, 8, coatDk);                  // back arm
      R(23, ty + 3, 7, 4, coat); R(29, ty + 4, 4, 3, skin); // front arm thrust
    } else if (pose === 'fall'){
      R(5, 16, 4, 7, coat); R(24, 16, 4, 7, coat);
      R(4, 14, 4, 3, skin); R(25, 14, 4, 3, skin);
    } else { // idle / run
      const sw = stride;
      R(6 - (sw < 0 ? sw : 0), ty + 3, 4, 9, coatDk);  R(6 - (sw < 0 ? sw : 0), ty + 11, 4, 3, skin);
      R(23 + (sw > 0 ? sw : 0), ty + 3, 4, 9, coat);   R(23 + (sw > 0 ? sw : 0), ty + 11, 4, 3, skin);
    }

    // ===== HEAD / FACE =====
    if (back){
      R(11, hy + 4, 11, 8, mix(skin, '#000', 0.42)); // back of head
      R(11, hy + 4, 11, 2, mix(skin, '#000', 0.55));
    } else {
      R(11, hy + 3, 11, 9, skin);
      R(11, hy + 3, 11, 2, skinSh);              // brow shadow under brim
      R(11, hy + 3, 1, 9, skinSh);               // left cheek shadow
      R(20, hy + 4, 2, 7, skinHi);               // lit cheek
      R(11, hy + 11, 11, 1, skinSh);             // jaw
      R(17, hy + 5, 3, 1, mix(skin, '#000', 0.45)); // eyebrow
      R(18, hy + 6, 2, 2, pal.outline);          // eye
      R(19, hy + 6, 1, 1, '#ffffff');            // eye glint
      R(21, hy + 7, 1, 2, skinSh);               // nose
      R(12, hy + 9, 9, 2, moust);                // moustache
    }

    // ===== HARD HAT (rounded dome) =====
    R(12, hy - 6, 8, 2, pal.hat);                // dome top
    R(10, hy - 4, 12, 4, pal.hat);               // dome body
    R(10, hy - 4, 12, 1, pal.hatHi);             // dome highlight
    R(15, hy - 4, 1, 4, mix(pal.hat, '#000', 0.22)); // ridge
    R(10, hy - 1, 12, 1, mix(pal.hat, '#000', 0.18)); // dome base
    CL(12, hy - 6, 1, 1); CL(19, hy - 6, 1, 1);  // round dome top corners
    R(7, hy, 18, 2, pal.hat);                    // brim
    R(7, hy, 18, 1, pal.hatHi);
    R(7, hy + 2, 18, 1, mix(pal.hat, '#000', 0.3)); // brim underside
    if (!back) R(20, hy + 2, 5, 1, pal.hat);     // front brim dip
    CL(7, hy, 1, 1); CL(24, hy, 1, 1);           // round brim corners
    if (pal.lampOnHat && !back){ R(20, hy - 3, 4, 2, '#2a2012'); R(23, hy - 2, 1, 1, pal.lantern); } // headlamp

    // ===== LANTERN (player) =====
    if (pal.lantern && pose !== 'climb' && pose !== 'bar'){
      const lx = pose === 'dig' ? 30 : 25 + (pose === 'run' ? Math.max(0, stride) : 0);
      R(lx, ty + 12, 5, 6, '#33260f');           // frame
      R(lx + 1, ty + 13, 3, 4, pal.lantern);     // glass
      R(lx + 1, ty + 13, 3, 1, '#ffffff');       // top glint
      R(lx + 1, ty + 11, 3, 1, '#6b5126');       // handle
    }

    // ===== dig tool =====
    if (pose === 'dig'){ R(28, hy + 6, 4, 3, '#cfd6e0'); R(30, hy + 9, 3, 8, '#9aa0ad'); }

    // ===== guard marks =====
    if (pal.mark === 'antenna' && !back){ R(15, hy - 9, 1, 3, '#2a1a06'); R(14, hy - 11, 3, 2, '#ffe66b'); }
    if (pal.mark === 'trowel' && pose !== 'climb' && pose !== 'bar'){ R(26, ty + 6, 6, 2, '#c2c7d0'); R(29, ty + 8, 3, 4, '#7e8490'); }

    return c;
  }

  function paintFigure(pose, fi, pal){
    const body = paintBody(pose, fi, pal);
    const sil = darken(body);
    const c = cv(FW, FH), x = cx(c);
    x.fillStyle = 'rgba(0,0,0,.3)'; x.fillRect(9, FH - 2, 16, 2); // ground shadow
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
