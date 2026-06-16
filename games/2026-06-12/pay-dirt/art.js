/* Pay Dirt — art.js
   Procedural painterly sprites, tiles, pickups, and cave props. The game still uses
   tiny generated canvases for speed, but the marks are layered like gouache instead
   of hard pixel stamps. */
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

  function dab(x, px, py, w, h, col, a, rot){
    x.save();
    x.translate(px, py);
    x.rotate(rot || 0);
    x.globalAlpha = a == null ? 1 : a;
    x.fillStyle = col;
    x.beginPath();
    x.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    x.fill();
    x.restore();
    x.globalAlpha = 1;
  }

  function brushNoise(x, w, h, rr, colors, count, alpha){
    for (let i = 0; i < count; i++){
      const col = colors[(rr() * colors.length) | 0];
      dab(x, rr() * w, rr() * h, 2 + rr() * 6, .6 + rr() * 2.2, col, alpha * (0.45 + rr() * 0.7), (rr() - .5) * 2.2);
    }
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
      xx.imageSmoothingEnabled = true;
      xx.fillStyle = p.mortar; xx.fillRect(0, 0, T, T);          // mortar shows in the gaps
      brushNoise(xx, T, T, rr, [p.sh, p.mortar, p.base], 26, .16);
      const bh = 12;
      for (let row = 0, ry = 0; ry < T; row++, ry += bh){
        const off = (row % 2) ? -10 : 1;                          // running bond
        for (let bx = off; bx < T; bx += 19){
          const x0 = bx + 1, y0 = ry + 1, w = 18, h = bh - 2;
          xx.fillStyle = p.base; xx.fillRect(x0, y0, w, h);
          xx.fillStyle = p.hi;   xx.fillRect(x0, y0, w, 1.5); xx.fillRect(x0, y0, 1.5, h);
          xx.fillStyle = p.sh;   xx.fillRect(x0, y0 + h - 2, w, 2); xx.fillRect(x0 + w - 2, y0, 2, h);
          brushNoise(xx, w, h, rr, [p.hi, p.sh, mix(p.base, '#fff', .14)], 8, .20);
          // occasional crack
          if (rr() < .35){ xx.strokeStyle = p.crack; xx.lineWidth = 1; xx.beginPath(); let px2 = x0 + 3 + rr() * (w - 6), py2 = y0 + 1; xx.moveTo(px2, py2); for (let s = 0; s < 3; s++){ px2 += (rr() - .5) * 6; py2 += h / 3; xx.lineTo(px2, py2); } xx.stroke(); }
          // gold vein fleck
          if (p.vein && rr() < .22){ xx.fillStyle = '#e9c64a'; xx.fillRect(x0 + 3 + (rr() * (w - 6)) | 0, y0 + 3 + (rr() * (h - 6)) | 0, 2, 1); }
        }
      }
      return cc;
    }
    tiles.brick = stoneTile({ seed: 7,  mortar: '#2b2118', base: '#806443', hi: '#b28a56', sh: '#4b3826', crack: 'rgba(35,22,12,.5)', vein: true });
    tiles.solid = stoneTile({ seed: 13, mortar: '#151a2b', base: '#3d465f', hi: '#647089', sh: '#252b3e', crack: 'rgba(8,10,18,.55)', vein: false });

    // mossy-cap variants (used on the TOP row of a platform — context-aware in the renderer)
    function withMossCap(src){
      const cc = cv(T, T), xx = cx(cc), rr = rng(99);
      xx.drawImage(src, 0, 0);
      xx.fillStyle = '#4f7f42'; xx.fillRect(0, 0, T, 4);
      xx.fillStyle = '#79a95b'; xx.fillRect(0, 0, T, 2);
      xx.fillStyle = '#314f2d'; xx.fillRect(0, 4, T, 1);
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

    // gold ore cluster — painterly chunk the player actually collects
    c = cv(T, T); x = c.getContext('2d'); x.imageSmoothingEnabled = true;
    { const gx = 18, gy = 19;
      x.globalAlpha = .5; x.fillStyle = '#fff0a8'; x.beginPath(); x.ellipse(gx, gy, 15, 12, 0, 0, 7); x.fill(); x.globalAlpha = 1;
      const ore = x.createLinearGradient(7, 7, 28, 29); ore.addColorStop(0, '#5f4124'); ore.addColorStop(.55, '#9a6527'); ore.addColorStop(1, '#2f2118');
      x.fillStyle = ore; x.beginPath(); x.moveTo(7, 22); x.quadraticCurveTo(6, 11, 15, 8); x.quadraticCurveTo(24, 5, 29, 15); x.quadraticCurveTo(30, 26, 18, 29); x.quadraticCurveTo(10, 30, 7, 22); x.fill();
      const gold = x.createRadialGradient(18, 16, 2, 18, 18, 14); gold.addColorStop(0, '#fff8ba'); gold.addColorStop(.35, '#ffd23f'); gold.addColorStop(.78, '#d18a12'); gold.addColorStop(1, '#6f4306');
      for (const p of [[15,15,7,5,-.4],[22,17,6,8,.45],[13,22,6,4,.1],[20,23,8,4,-.25]]){
        x.save(); x.translate(p[0], p[1]); x.rotate(p[4]); x.fillStyle = gold; x.beginPath(); x.ellipse(0, 0, p[2], p[3], 0, 0, 7); x.fill(); x.restore();
      }
      x.strokeStyle = 'rgba(70,38,8,.42)'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(10, 18); x.bezierCurveTo(15, 14, 21, 19, 27, 14); x.moveTo(13, 24); x.quadraticCurveTo(19, 20, 26, 23); x.stroke();
      x.fillStyle = '#fff9d6'; x.fillRect(16, 12, 4, 2); x.fillRect(22, 15, 2, 2); }
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
      R(18, hy + 6, 2, 2, pal.eye || pal.outline);    // eye
      R(19, hy + 6, 1, 1, pal.eyeGlint || '#ffffff'); // eye glint
      if (pal.eye){ R(17, hy + 6, 1, 1, pal.eye); }    // menacing wider glow for guards
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
    guard:  { outline: '#2a0c12', face: '#d89a6a', hat: '#b23a3a', hatHi: '#e06868', coat: '#8f2f3a', coatHi: '#b3464f', coatDk: '#5f1d24', legs: '#3a1a22', boot: '#1f0c10', accent: '#5a1a20', mark: null, eye: '#ff3a2a', eyeGlint: '#ffd2c0' },
    scout:  { outline: '#2a1a06', face: '#e8c07a', hat: '#ff8b2e', hatHi: '#ffc070', coat: '#c46a1f', coatHi: '#e09040', coatDk: '#8a4710', legs: '#5a3210', boot: '#2a1808', accent: '#7a3e0f', mark: 'antenna', eye: '#ffb020', eyeGlint: '#fff0c0' },
    mason:  { outline: '#101820', face: '#cdb89a', hat: '#7a8694', hatHi: '#a8b4c0', coat: '#4a5560', coatHi: '#646f7c', coatDk: '#2e353e', legs: '#2a3038', boot: '#181c22', accent: '#343a44', mark: 'trowel', eye: '#ff5040', eyeGlint: '#ffd2c0' },
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
    const mk = (draw) => {
      const c = cv(30, 30), x = c.getContext('2d');
      x.imageSmoothingEnabled = true;
      x.globalAlpha = .55; x.fillStyle = '#fff6c8'; x.beginPath(); x.ellipse(15, 17, 13, 10, 0, 0, 7); x.fill(); x.globalAlpha = 1;
      draw(x);
      return c;
    };
    PUPS[1] = mk(x => { // TNT satchel
      const g = x.createLinearGradient(7, 7, 22, 25); g.addColorStop(0, '#e85a44'); g.addColorStop(.55, '#a92e25'); g.addColorStop(1, '#5a201a');
      x.fillStyle = '#6f4524'; x.beginPath(); x.roundRect ? x.roundRect(5, 9, 20, 15, 4) : x.rect(5, 9, 20, 15); x.fill();
      x.fillStyle = g; x.beginPath(); x.roundRect ? x.roundRect(7, 8, 16, 15, 5) : x.rect(7, 8, 16, 15); x.fill();
      x.strokeStyle = '#ffd18a'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(9, 12); x.lineTo(21, 19); x.moveTo(21, 12); x.lineTo(9, 20); x.stroke();
      x.strokeStyle = '#3a2411'; x.lineWidth = 2; x.beginPath(); x.moveTo(15, 8); x.quadraticCurveTo(13, 3, 19, 3); x.stroke();
      x.fillStyle = '#fff0a8'; x.beginPath(); x.arc(20, 3, 2.5, 0, 7); x.fill();
    });
    PUPS[2] = mk(x => { // explorer boots
      const g = x.createLinearGradient(6, 6, 24, 24); g.addColorStop(0, '#8efff0'); g.addColorStop(.5, '#2bb7ad'); g.addColorStop(1, '#12585a');
      x.fillStyle = g; x.beginPath(); x.roundRect ? x.roundRect(7, 8, 8, 16, 3) : x.rect(7, 8, 8, 16); x.fill();
      x.beginPath(); x.roundRect ? x.roundRect(15, 11, 8, 13, 3) : x.rect(15, 11, 8, 13); x.fill();
      x.fillStyle = '#10202a'; x.fillRect(5, 21, 11, 4); x.fillRect(14, 21, 11, 4);
      x.fillStyle = '#cffff8'; x.fillRect(8, 9, 3, 10); x.fillRect(16, 12, 3, 8);
    });
    PUPS[3] = mk(x => { // phase cloak
      const g = x.createRadialGradient(15, 12, 2, 15, 15, 13); g.addColorStop(0, '#f0dcff'); g.addColorStop(.4, '#a66cff'); g.addColorStop(1, '#341f62');
      x.fillStyle = g; x.beginPath(); x.moveTo(15, 5); x.bezierCurveTo(6, 10, 7, 22, 4, 25); x.quadraticCurveTo(15, 21, 26, 25); x.bezierCurveTo(22, 20, 24, 10, 15, 5); x.fill();
      x.globalCompositeOperation = 'lighter'; x.fillStyle = 'rgba(240,220,255,.55)'; x.beginPath(); x.ellipse(15, 14, 5, 9, 0, 0, 7); x.fill(); x.globalCompositeOperation = 'source-over';
    });
    PUPS[4] = mk(x => { // magnet relic
      x.strokeStyle = '#ff5959'; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.arc(15, 14, 8, Math.PI * .12, Math.PI * .88, true); x.stroke();
      x.strokeStyle = '#ffd0d0'; x.lineWidth = 2; x.beginPath(); x.arc(15, 14, 8, Math.PI * .18, Math.PI * .82, true); x.stroke();
      x.fillStyle = '#d8e2ed'; x.beginPath(); x.roundRect ? x.roundRect(5, 16, 7, 8, 2) : x.rect(5, 16, 7, 8); x.fill();
      x.beginPath(); x.roundRect ? x.roundRect(18, 16, 7, 8, 2) : x.rect(18, 16, 7, 8); x.fill();
    });
    PUPS[5] = mk(x => { // enchanted shovel
      x.strokeStyle = '#8b5c2e'; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(17, 5); x.lineTo(13, 20); x.stroke();
      const g = x.createLinearGradient(9, 16, 21, 28); g.addColorStop(0, '#c8ff9b'); g.addColorStop(.45, '#69c94a'); g.addColorStop(1, '#2d6a30');
      x.fillStyle = g; x.beginPath(); x.moveTo(9, 18); x.quadraticCurveTo(15, 15, 21, 18); x.quadraticCurveTo(19, 25, 15, 27); x.quadraticCurveTo(11, 25, 9, 18); x.fill();
      x.fillStyle = '#efffd8'; x.fillRect(13, 18, 2, 6);
    });
  }
  buildPups();

  const TREASURES = {};
  function buildTreasures(){
    const mk = (draw) => { const c = cv(30, 30), x = c.getContext('2d'); x.imageSmoothingEnabled = true; draw(x); return c; };
    TREASURES.relic = mk(x => {
      x.fillStyle = 'rgba(255,222,137,.18)'; x.beginPath(); x.ellipse(15, 16, 13, 10, 0, 0, 7); x.fill();
      x.fillStyle = '#8c6f4b'; x.beginPath(); x.moveTo(7, 20); x.lineTo(12, 7); x.lineTo(22, 9); x.lineTo(24, 20); x.closePath(); x.fill();
      x.fillStyle = '#c9a76b'; x.beginPath(); x.moveTo(10, 18); x.lineTo(14, 9); x.lineTo(20, 11); x.lineTo(21, 18); x.closePath(); x.fill();
      x.strokeStyle = '#fff0b8'; x.lineWidth = 1.4; x.beginPath(); x.arc(16, 14, 4, 0, 7); x.stroke();
    });
    TREASURES.bloom = mk(x => {
      x.fillStyle = '#4a8054'; x.fillRect(14, 15, 3, 9);
      for (let i = 0; i < 6; i++){ x.save(); x.translate(15, 14); x.rotate(i * Math.PI / 3); x.fillStyle = i % 2 ? '#7fd7b7' : '#a6efd1'; x.beginPath(); x.ellipse(0, -6, 4, 8, 0, 0, 7); x.fill(); x.restore(); }
      x.fillStyle = '#fff5b8'; x.beginPath(); x.arc(15, 14, 3.2, 0, 7); x.fill();
    });
    TREASURES.map = mk(x => {
      x.fillStyle = '#d8bf86'; x.beginPath(); x.moveTo(6, 8); x.quadraticCurveTo(12, 5, 18, 8); x.quadraticCurveTo(23, 11, 24, 21); x.quadraticCurveTo(16, 18, 7, 22); x.closePath(); x.fill();
      x.strokeStyle = '#7f5932'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(10, 12); x.bezierCurveTo(13, 10, 17, 17, 21, 13); x.stroke();
      x.fillStyle = '#c44d3d'; x.beginPath(); x.arc(18, 16, 2.2, 0, 7); x.fill();
    });
    TREASURES.oil = mk(x => {
      x.fillStyle = '#393247'; x.beginPath(); x.roundRect ? x.roundRect(10, 7, 10, 18, 3) : x.rect(10, 7, 10, 18); x.fill();
      x.fillStyle = '#f1b34e'; x.fillRect(12, 13, 6, 8);
      x.fillStyle = '#fff0b8'; x.fillRect(13, 13, 2, 8);
      x.strokeStyle = '#c8b690'; x.lineWidth = 1.5; x.beginPath(); x.arc(15, 8, 5, Math.PI, 0); x.stroke();
    });
  }
  buildTreasures();

  return { T, tiles, frames, PUPS, TREASURES, PAL, cv, cx, rng, FW, FH };
})();
