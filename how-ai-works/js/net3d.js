/* Lab.net3d: a layered network drawn in 3D on a plain 2D canvas.
   Each layer is a grid of neurons (rows x columns) and the layers are stacked in depth. The caller
   owns the numbers: it hands over the weights and, for each pass, every neuron's value. This file
   only draws them and handles turning, zooming, hovering, pinning and stepping.

     const view = Lab.net3d(canvas, {
       layers:  [{ r: 6, c: 6, name: 'INPUT', short: 'IN' }, ...],
       weights: g => Float32Array,          // between layer g and g+1, laid out [to * fromCount + from]
       header:  small => 'text for the top-left corner',
       color:   (layer, index, value) => '#hex',
       describe:(layer, index, value) => ['line one', 'line two'],     // the hover label
       onCycle: () => {},                   // a pass has finished showing: feed the next one
       onStage: layer => {},                // the wave has just reached this layer
       onPin:   k => {}                     // a neuron was clicked (k = -1 when cleared)
     });
     view.setPass({ vals, mags, edges, dir, tint, keep })   // start a wave through the network
*/
(function () {
  'use strict';
  const L = Lab, C = L.C;
  const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  const T_IN = 700, T_GAP = 640, T_FADE = 1350, CAM = 58;

  // a soft glow drawn once per colour, then stamped (much cheaper than shadowBlur on every dot)
  const sprite = {};
  const glowOf = hex => {
    if (sprite[hex]) return sprite[hex];
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, L.rgba(hex, 0.95)); gr.addColorStop(0.22, L.rgba(hex, 0.5)); gr.addColorStop(0.55, L.rgba(hex, 0.12)); gr.addColorStop(1, L.rgba(hex, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return (sprite[hex] = c);
  };
  const stamp = (ctx, hex, cx, cy, size, alpha) => {
    if (alpha <= 0.015) return;
    ctx.globalAlpha = Math.min(1, alpha); ctx.drawImage(glowOf(hex), cx - size / 2, cy - size / 2, size, size); ctx.globalAlpha = 1;
  };

  L.net3d = function (cv, o) {
    const layers = o.layers, G = layers.length - 1, shape = layers.map(l => l.r * l.c), off = [];
    const YAW0 = o.yaw == null ? -0.8 : o.yaw, PITCH0 = o.pitch == null ? 0.3 : o.pitch, HOLD = o.hold || 1400, SPEED = o.speed || 1.7;
    let N = 0; shape.forEach(n => { off.push(N); N += n; });
    const wx = new Float32Array(N), wy = new Float32Array(N), wz = new Float32Array(N), nl = new Uint8Array(N);
    const px = new Float32Array(N), py = new Float32Array(N), ps = new Float32Array(N), pz = new Float32Array(N), order = new Uint16Array(N);
    for (let k = 0; k < N; k++) order[k] = k;
    let small = false, gapX = 4.6, key = '', unit = 30, fresh = true, zoom = 1, placed = false;
    let rest = [], lit = [], heads = [], vals = null, mags = null, shownV = null, shownM = null;
    let dir = 1, tint = [C.cyan, C.rose], keep = 0, clock = 1e9, limit = Infinity, stepping = false, stage = 0, told = -1, cycled = true, passes = 0;
    let yaw = YAW0, pitch = PITCH0, vyaw = 0, phase = 0, drift = 1, drag = null, mouse = null, over = false, hover = -1, pinned = -1, used = false, hint = 1;
    let quality = 2, cost = 2, slow = 0, quick = 0;
    const touches = new Map(); let pinch = 0;
    const coarse = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);

    function place() {
      layers.forEach((ly, l) => { for (let r = 0; r < ly.r; r++) for (let c = 0; c < ly.c; c++) {
        const k = off[l] + r * ly.c + c;
        wx[k] = (l - G / 2) * gapX; wy[k] = r - (ly.r - 1) / 2; wz[k] = c - (ly.c - 1) / 2; nl[k] = l;
      } });
    }
    // the resting web: only the heavier weights are drawn, measured against the typical weight in that gap
    function refreshWeb() {
      rest = [];
      for (let g = 0; g < G; g++) {
        const W = o.weights(g), nIn = shape[g], nOut = shape[g + 1], faint = [], strong = [];
        let sq = 0; for (let n = 0; n < W.length; n++) sq += W[n] * W[n];
        const rms = Math.sqrt(sq / W.length) || 1;
        // a budget per gap, so a large layer does not turn into a solid sheet: the heaviest 300, then the next 900
        const mag = Float32Array.from(W, Math.abs).sort(), cut = n => (W.length > n ? mag[W.length - n] : 0);
        const hi = Math.max(2.1 * rms, cut(300)), lo = Math.max(1.5 * rms, cut(1200));
        for (let j = 0; j < nOut; j++) for (let i = 0; i < nIn; i++) {
          const m = Math.abs(W[j * nIn + i]);
          if (m > hi) strong.push(off[g] + i, off[g + 1] + j); else if (m > lo) faint.push(off[g] + i, off[g + 1] + j);
        }
        rest.push([Int32Array.from(faint), Int32Array.from(strong), rms]);
      }
      L.kick();
    }
    const pos = l => (dir > 0 ? l : G - l);                       // how many hops the wave needs to reach layer l
    const arrive = l => (pos(l) ? T_IN + pos(l) * T_GAP : 0);

    function setPass(p) {
      dir = p.dir || 1; tint = p.tint || [C.cyan, C.rose]; keep = p.keep ? 0.55 : 0;
      vals = p.vals;
      mags = p.mags || vals.map(a => Float32Array.from(a, v => Math.min(1, Math.abs(v))));
      if (!shownV) { shownV = vals.map(a => Float32Array.from(a)); shownM = mags.map(a => Float32Array.from(a)); }
      lit = []; heads = [];
      for (let g = 0; g < G; g++) {
        const nIn = shape[g], nOut = shape[g + 1], W = o.weights(g), given = p.edges && p.edges[g], src = vals[g];
        let top = 1e-9;
        const con = given || new Float32Array(nIn * nOut);
        for (let j = 0; j < nOut; j++) for (let i = 0; i < nIn; i++) {
          const n = j * nIn + i;
          if (!given) con[n] = W[n] * src[i];
          if (Math.abs(con[n]) > top) top = Math.abs(con[n]);
        }
        // only connections carrying a real share of the signal light up; sorted once into strength buckets
        // at most about 900 lit connections per gap: raise the cut-off until that many are left
        const hist = new Uint32Array(64);
        for (let n = 0; n < con.length; n++) hist[Math.min(63, Math.floor(Math.abs(con[n]) / top * 64))]++;
        let floor = 63, kept = 0;
        while (floor > 23 && kept + hist[floor] <= 900) kept += hist[floor--];
        const low = (floor + 1) / 64, span = (1 - low) / 4, hot = low + span * 2;
        const buckets = [[], [], [], [], [], [], [], []], hd = [];
        for (let j = 0; j < nOut; j++) for (let i = 0; i < nIn; i++) {
          const c = con[j * nIn + i], m = Math.abs(c) / top;
          if (m < low) continue;
          const a = dir > 0 ? off[g] + i : off[g + 1] + j, b = dir > 0 ? off[g + 1] + j : off[g] + i;
          buckets[(Math.min(3, Math.floor((m - low) / span)) << 1) | (c < 0 ? 1 : 0)].push(a, b);
          if (m > hot && hd.length < 70) hd.push([a, b, c < 0, m]);
        }
        lit.push(buckets.map(b => Int32Array.from(b))); heads.push(hd);
      }
      passes++; cycled = false; told = -1;
      if (p.settled) { clock = T_IN + G * T_GAP + 400; shownV = vals.map(a => Float32Array.from(a)); shownM = mags.map(a => Float32Array.from(a)); told = G; }
      else clock = 0;
      if (stepping) { stage = 0; limit = T_IN; blank(); }
      L.kick();
    }
    // in step mode the layers the wave has not reached yet go dark, so it is clear where the signal is
    function blank() { if (shownM) for (let l = 0; l <= G; l++) if (pos(l) > 0) shownM[l].fill(0); }

    function layout(v) {
      const sm = v.w < 560, k = (sm ? 's' : 'l') + v.w + 'x' + v.h;
      if (k === key) return;
      key = k; fresh = true;
      if (sm !== small || !placed) { placed = true; small = sm; gapX = sm ? (o.gapSmall || 3.7) : (o.gap || 4.6); place(); refreshWeb(); }
    }
    const midY = v => v.h / 2 + 6;
    function project(v, cyaw, syaw, cp, sp, X, Y, Z) {
      const x1 = X * cyaw + Z * syaw, z1 = -X * syaw + Z * cyaw, y1 = Y * cp - z1 * sp, z2 = Y * sp + z1 * cp, s = CAM / (CAM + z2);
      return [v.w / 2 + x1 * unit * s, midY(v) + y1 * unit * s, s, z2];
    }
    function nodeAt(m) {
      let best = 1e9, hit = -1;
      const R = L.clamp(unit * 0.17, 2.4, 6.5);
      for (let k = 0; k < N; k++) {
        const dx = px[k] - m[0], dy = py[k] - m[1], d = dx * dx + dy * dy, lim = Math.max(coarse ? 15 : 11, R * ps[k] * 2.1);
        if (d < lim * lim && d + pz[k] * 3 < best) { best = d + pz[k] * 3; hit = k; }
      }
      return hit;
    }

    /* ---------- pointer, touch and keyboard ---------- */
    const at = ev => { const b = cv.getBoundingClientRect(); return [ev.clientX - b.left, ev.clientY - b.top]; };
    cv.addEventListener('pointerdown', ev => {
      touches.set(ev.pointerId, [ev.clientX, ev.clientY]);
      mouse = at(ev); used = true; vyaw = 0;
      if (touches.size === 2) { const q = Array.from(touches.values()); pinch = Math.hypot(q[0][0] - q[1][0], q[0][1] - q[1][1]) || 1; drag = null; }
      else drag = { x: ev.clientX, y: ev.clientY, sx: ev.clientX, sy: ev.clientY, t: performance.now() };
      try { cv.setPointerCapture(ev.pointerId); } catch (e) { /* older browsers */ }
      L.kick();
    });
    cv.addEventListener('pointermove', ev => {
      mouse = at(ev); over = true;
      if (touches.has(ev.pointerId)) touches.set(ev.pointerId, [ev.clientX, ev.clientY]);
      if (touches.size === 2 && pinch) {
        const q = Array.from(touches.values()), d = Math.hypot(q[0][0] - q[1][0], q[0][1] - q[1][1]) || 1;
        zoom = L.clamp(zoom * d / pinch, 0.6, 3); pinch = d;
      } else if (drag) {
        const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
        drag.x = ev.clientX; drag.y = ev.clientY;
        yaw += dx * 0.0085; vyaw = dx * 0.0085; pitch = L.clamp(pitch + dy * 0.006, -1.15, 1.15);
      }
      L.kick();
    });
    const drop = ev => {
      // a press that did not move is a click: pin the neuron under it, or clear the pin
      if (drag && ev.type === 'pointerup' && Math.hypot(ev.clientX - drag.sx, ev.clientY - drag.sy) < 6 && performance.now() - drag.t < 600) {
        const k = nodeAt(at(ev));
        pinned = k === pinned ? -1 : k; vyaw = 0;
        if (o.onPin) o.onPin(pinned);
      }
      touches.delete(ev.pointerId); if (touches.size < 2) pinch = 0;
      drag = null; L.kick();
    };
    cv.addEventListener('pointerup', drop);
    cv.addEventListener('pointercancel', drop);
    cv.addEventListener('pointerleave', () => { over = false; mouse = null; L.kick(); });
    cv.addEventListener('dblclick', () => { yaw = YAW0; pitch = PITCH0; vyaw = 0; zoom = 1; L.kick(); });
    // pinch on a trackpad arrives as ctrl + wheel; plain scrolling is left to the page
    cv.addEventListener('wheel', ev => { if (!ev.ctrlKey && !ev.metaKey) return; ev.preventDefault(); zoom = L.clamp(zoom * Math.exp(-ev.deltaY * 0.01), 0.6, 3); used = true; L.kick(); }, { passive: false });
    cv.addEventListener('keydown', ev => {
      const k = ev.key;
      if (k === 'ArrowLeft') yaw -= 0.14; else if (k === 'ArrowRight') yaw += 0.14;
      else if (k === 'ArrowUp') pitch = L.clamp(pitch - 0.1, -1.15, 1.15); else if (k === 'ArrowDown') pitch = L.clamp(pitch + 0.1, -1.15, 1.15);
      else if (k === '+' || k === '=') zoom = L.clamp(zoom * 1.15, 0.6, 3); else if (k === '-' || k === '_') zoom = L.clamp(zoom / 1.15, 0.6, 3);
      else if (k === 'Home' || k === '0') { yaw = YAW0; pitch = PITCH0; zoom = 1; } else return;
      ev.preventDefault(); used = true; vyaw = 0; L.kick();
    });

    /* ---------- one frame ---------- */
    L.scene(cv, dt => {
      if (!vals) return;
      const began = performance.now();
      const v = L.fit(cv), ctx = v.ctx;
      layout(v);
      const settle = T_IN + G * T_GAP, total = settle + HOLD, focused = document.activeElement === cv;
      // the pass
      if (L.reduce) clock = Math.min(stepping ? limit : settle + 400, settle + 400);
      else clock = Math.min(clock + dt * SPEED, stepping ? limit : 1e9);
      const kk = L.reduce ? 1 : 1 - Math.exp(-dt * SPEED / 110);
      for (let l = 0; l <= G; l++) if (clock >= arrive(l)) for (let i = 0; i < shape[l]; i++) { shownV[l][i] += (vals[l][i] - shownV[l][i]) * kk; shownM[l][i] += (mags[l][i] - shownM[l][i]) * kk; }
      const reached = Math.floor(L.clamp((clock - T_IN) / T_GAP, 0, G));       // hops completed
      if (reached > told) { for (let h = told + 1; h <= reached; h++) if (o.onStage) o.onStage(dir > 0 ? h : G - h); told = reached; }
      if (!stepping && !cycled && clock >= total) { cycled = true; if (o.onCycle) o.onCycle(); }
      // the camera: a slow sway that stops while the pointer is on the network, plus drag and a little coast
      const still = L.reduce || drag || over || focused || pinned >= 0 || stepping || o.sway === false;
      drift += ((still ? 0 : 1) - drift) * (1 - Math.exp(-dt / 500));
      phase += dt / (o.swayMs || 3400) * drift;
      if (!drag && dt) { yaw += vyaw; vyaw *= Math.exp(-dt / 260); if (Math.abs(vyaw) < 0.0002) vyaw = 0; }
      if (used && hint > 0) hint = Math.max(0, hint - (dt || 16) / 700);
      const yawNow = yaw + (L.reduce ? 0 : 0.24 * Math.sin(phase)), pitchNow = pitch + (L.reduce ? 0 : 0.06 * Math.sin(phase * 0.7 + 1));
      const cyaw = Math.cos(yawNow), syaw = Math.sin(yawNow), cp = Math.cos(pitchNow), sp = Math.sin(pitchNow);
      let ex = 0.01, ey = 0.01;
      for (let k = 0; k < N; k++) {
        const x1 = wx[k] * cyaw + wz[k] * syaw, z1 = -wx[k] * syaw + wz[k] * cyaw, y1 = wy[k] * cp - z1 * sp, z2 = wy[k] * sp + z1 * cp, s = CAM / (CAM + z2);
        px[k] = x1 * s; py[k] = y1 * s; ps[k] = s; pz[k] = z2;
        if (Math.abs(px[k]) > ex) ex = Math.abs(px[k]);
        if (Math.abs(py[k]) > ey) ey = Math.abs(py[k]);
      }
      // the scale follows the turn so the network fills the canvas at any angle
      const want = Math.min((v.w / 2 - (small ? 14 : 46)) / (ex + 0.8), (v.h / 2 - (small ? 30 : 40)) / (ey + 0.8)) * zoom;
      unit = fresh || L.reduce ? want : unit + (want - unit) * (1 - Math.exp(-(dt || 16) / 260));
      fresh = false;
      for (let k = 0; k < N; k++) { px[k] = v.w / 2 + px[k] * unit; py[k] = midY(v) + py[k] * unit; }
      const R = L.clamp(unit * 0.17, 2.4, 6.5);
      hover = mouse && !drag && touches.size < 2 ? nodeAt(mouse) : -1;
      cv.style.cursor = drag ? 'grabbing' : hover >= 0 ? 'pointer' : 'grab';
      const focus = hover >= 0 ? hover : pinned;

      ctx.clearRect(0, 0, v.w, v.h);
      // the layer plates, far ones first
      const plates = layers.map((ly, l) => {
        const X = (l - G / 2) * gapX, hr = (ly.r - 1) / 2 + 0.72, hc = (ly.c - 1) / 2 + 0.72;
        return { l, ly, c: [[-hr, -hc], [-hr, hc], [hr, hc], [hr, -hc]].map(q => project(v, cyaw, syaw, cp, sp, X, q[0], q[1])), mid: project(v, cyaw, syaw, cp, sp, X, 0, 0), top: project(v, cyaw, syaw, cp, sp, X, -hr - 0.62, 0) };
      });
      plates.slice().sort((a, b) => b.mid[3] - a.mid[3]).forEach(pl => {
        const t = arrive(pl.l), flash = L.reduce || clock < t ? 0 : 1 - L.clamp((clock - t) / 700, 0, 1);
        ctx.beginPath(); pl.c.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
        ctx.fillStyle = 'rgba(22,66,126,' + (0.09 + 0.07 * flash) + ')'; ctx.fill();
        ctx.strokeStyle = flash > 0.02 ? L.rgba(C.gold, 0.25 + 0.55 * flash) : 'rgba(86,170,235,0.3)'; ctx.lineWidth = 1; ctx.stroke();
      });
      // the resting web (dropped first when frames run slow)
      for (let g = 0; g < G && quality > 0; g++) for (let lvl = quality > 1 ? 0 : 1; lvl < 2; lvl++) {
        const e = rest[g][lvl];
        ctx.beginPath();
        for (let n = 0; n < e.length; n += 2) { ctx.moveTo(px[e[n]], py[e[n]]); ctx.lineTo(px[e[n + 1]], py[e[n + 1]]); }
        ctx.strokeStyle = 'rgba(86,170,235,' + (lvl ? 0.1 : 0.045) + ')'; ctx.lineWidth = 1; ctx.stroke();
      }
      // the signal: each lit connection is drawn as far as the wave has reached
      ctx.globalCompositeOperation = 'lighter';
      const floor = stepping ? 0.6 : keep;
      for (let g = 0; g < G; g++) {
        const q = dir > 0 ? g : G - 1 - g, t0 = T_IN + q * T_GAP, p = L.clamp((clock - t0) / T_GAP, 0, 1);
        const fade = L.reduce ? 0.7 : Math.max(floor, 1 - L.clamp((clock - t0 - T_GAP) / T_FADE, 0, 1));
        if (p <= 0 || fade <= 0) continue;
        for (let b = (2 - quality) * 2; b < 8; b++) {
          const e = lit[g][b], lvl = b >> 1;
          if (!e.length) continue;
          ctx.beginPath();
          for (let n = 0; n < e.length; n += 2) { const a = e[n], c = e[n + 1]; ctx.moveTo(px[a], py[a]); ctx.lineTo(px[a] + (px[c] - px[a]) * p, py[a] + (py[c] - py[a]) * p); }
          ctx.strokeStyle = L.rgba(tint[b & 1], (0.04 + 0.12 * lvl) * fade); ctx.lineWidth = 0.7 + lvl * 0.4; ctx.stroke();
        }
        if (p < 1) { const hd = heads[g], cnt = Math.min(hd.length, [14, 36, 70][quality]); for (let n = 0; n < cnt; n++) {
          const h = hd[n], a = h[0], c = h[1], s = ps[a] + (ps[c] - ps[a]) * p;
          stamp(ctx, tint[h[2] ? 1 : 0], px[a] + (px[c] - px[a]) * p, py[a] + (py[c] - py[a]) * p, (8 + h[3] * 11) * s, 0.3 + h[3] * 0.55);
        } }
      }
      // the hovered or pinned neuron shows every weight into and out of it
      if (focus >= 0) {
        const hl = nl[focus], loc = focus - off[hl];
        [[hl - 1, true], [hl, false]].forEach(side => {
          const g = side[0]; if (g < 0 || g >= G) return;
          const nIn = shape[g], cnt = side[1] ? nIn : shape[g + 1], W = o.weights(g), rms = rest[g][2];
          for (let b = 0; b < 6; b++) {
            ctx.beginPath();
            for (let q = 0; q < cnt; q++) {
              const w = side[1] ? W[loc * nIn + q] : W[q * nIn + loc], m = Math.abs(w) / rms;
              if ((w < 0 ? 1 : 0) !== (b & 1) || (m < 0.6 ? 0 : m < 1.4 ? 1 : 2) !== (b >> 1)) continue;
              const other = side[1] ? off[g] + q : off[g + 1] + q;
              ctx.moveTo(px[focus], py[focus]); ctx.lineTo(px[other], py[other]);
            }
            ctx.strokeStyle = L.rgba(b & 1 ? C.rose : C.cyan, [0.1, 0.36, 0.85][b >> 1]); ctx.lineWidth = 0.8 + (b >> 1) * 0.5; ctx.stroke();
          }
        });
      }
      // neurons: glow first, then the discs from the back of the scene to the front
      const colOf = (l, i, val) => (o.color ? o.color(l, i, val) : val < 0 ? C.rose : C.cyan);
      for (let k = 0; k < N; k++) {
        const l = nl[k], i = k - off[l], m = shownM[l][i];
        if (m < (quality ? 0.08 : 0.3)) continue;
        const t = arrive(l), flash = L.reduce || clock < t ? 0 : 1 - L.clamp((clock - t) / 520, 0, 1);
        stamp(ctx, colOf(l, i, shownV[l][i]), px[k], py[k], R * ps[k] * (3.6 + 4.2 * m + flash * 3), 0.1 + 0.5 * m + flash * 0.25);
      }
      ctx.globalCompositeOperation = 'source-over';
      order.sort((a, b) => pz[b] - pz[a]);
      for (let n = 0; n < N; n++) {
        const k = order[n], l = nl[k], i = k - off[l], m = shownM[l][i], col = colOf(l, i, shownV[l][i]), r = R * ps[k], on = k === hover, pin = k === pinned;
        ctx.beginPath(); ctx.arc(px[k], py[k], r + (on || pin ? 2 : 0), 0, 6.2832); ctx.fillStyle = '#04101f'; ctx.fill();
        ctx.strokeStyle = pin ? C.gold : L.rgba(col, on ? 1 : 0.4 + 0.55 * m); ctx.lineWidth = on || pin ? 2 : 1.1; ctx.stroke();
        ctx.beginPath(); ctx.arc(px[k], py[k], Math.max(0.5, (r - 1.2) * (0.16 + 0.84 * m)), 0, 6.2832); ctx.fillStyle = L.rgba(col, 0.3 + 0.7 * m); ctx.fill();
      }

      // labels, drawn flat on top: nearest layer first, skipping one that would land on a name already drawn
      ctx.textBaseline = 'middle'; ctx.textAlign = 'center'; ctx.font = '700 ' + (small ? 8 : 10) + 'px ' + mono;
      const front = dir > 0 ? reached : G - reached, placed = [];
      plates.slice().sort((a, b) => a.mid[3] - b.mid[3]).forEach(pl => {
        if (placed.some(q => Math.abs(q[0] - pl.top[0]) < (small ? 44 : 78) && Math.abs(q[1] - pl.top[1]) < 13)) return;
        placed.push(pl.top);
        ctx.fillStyle = !L.reduce && pl.l === front && clock < settle + 400 ? L.rgba(C.gold, 0.95) : L.rgba(C.muted, 0.85);
        ctx.fillText((small ? pl.ly.short || pl.ly.name : pl.ly.name) + ' ' + pl.ly.r + '×' + pl.ly.c, pl.top[0], pl.top[1]);
      });
      ctx.textAlign = 'left'; ctx.fillStyle = L.rgba(C.dim, 0.95);
      if (o.header) ctx.fillText(o.header(small), small ? 10 : 16, 14);
      if (hint > 0.01) {
        ctx.textAlign = 'center'; ctx.fillStyle = L.rgba(C.gold, 0.85 * hint);
        ctx.fillText(coarse ? 'SWIPE TO TURN  ·  PINCH TO ZOOM  ·  TAP A NEURON' : 'DRAG TO TURN  ·  CLICK A NEURON TO PIN IT  ·  DOUBLE-CLICK TO RESET', v.w / 2, small ? 32 : v.h - 14);
      }
      if (hover >= 0) {
        const hl = nl[hover], loc = hover - off[hl], val = shownV[hl][loc], ly = layers[hl];
        const d = o.describe ? o.describe(hl, loc, val) : [ly.name.toLowerCase() + '  ·  row ' + (Math.floor(loc / ly.c) + 1) + ', col ' + (loc % ly.c + 1) + ':  ' + (val >= 0 ? '+' : '−') + Math.abs(val).toFixed(2), (hl ? shape[hl - 1] + ' weights in' : 'fed from outside') + (hl < G ? '  ·  ' + shape[hl + 1] + ' weights out' : '')];
        ctx.textAlign = 'left'; ctx.font = '700 11px ' + mono;
        const tw = Math.max(ctx.measureText(d[0]).width, ctx.measureText(d[1]).width) + 18, r = R * ps[hover];
        const bx = L.clamp(px[hover] - tw / 2, 6, Math.max(6, v.w - tw - 6)), by = py[hover] > 70 ? py[hover] - r - 48 : py[hover] + r + 10;
        L.rr(ctx, bx, by, tw, 38, 7); ctx.fillStyle = 'rgba(3,12,24,0.94)'; ctx.fill(); ctx.strokeStyle = L.rgba(C.cyan, 0.6); ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = C.text; ctx.fillText(d[0], bx + 9, by + 13);
        ctx.fillStyle = L.rgba(C.muted, 0.95); ctx.font = '600 10px ' + mono; ctx.fillText(d[1], bx + 9, by + 27);
      }

      // if drawing is taking too long on this device, show fewer connections rather than stutter
      cost += (performance.now() - began - cost) * 0.08;
      if (cost > 9) { quick = 0; if (++slow > 45 && quality > 0) { quality--; slow = 0; cost = 5; } }
      else if (cost < 2.5) { slow = 0; if (++quick > 600 && quality < 2) { quality++; quick = 0; } }
      else { slow = 0; quick = 0; }
    });

    return {
      setPass, refreshWeb,
      // step mode: the wave waits at each layer until step() is called
      step() {
        if (!stepping) { stepping = true; stage = 0; clock = 0; told = -1; limit = T_IN; blank(); L.kick(); return; }   // first press: back to the input
        if (stage >= G) { if (o.onCycle) o.onCycle(); if (stage >= G) { stage = 0; clock = 0; told = -1; limit = T_IN; blank(); } }
        else { stage++; limit = T_IN + stage * T_GAP + 60; }
        L.kick();
      },
      play() { stepping = false; limit = Infinity; L.kick(); },
      pin(k) { pinned = k; L.kick(); },
      resetView() { yaw = YAW0; pitch = PITCH0; zoom = 1; vyaw = 0; L.kick(); },
      // the angle the visitor has turned it to, for a link that reopens the same view
      viewAngle() { return { yaw: Math.atan2(Math.sin(yaw), Math.cos(yaw)), pitch, zoom }; },
      setView(a) { yaw = +a.yaw || 0; pitch = L.clamp(+a.pitch || 0, -1.15, 1.15); zoom = L.clamp(+a.zoom || 1, 0.6, 3); vyaw = 0; used = true; L.kick(); },
      where(k) { const l = nl[k], i = k - off[l]; return { layer: l, index: i, row: Math.floor(i / layers[l].c), col: i % layers[l].c }; },
      index(l, i) { return off[l] + i; },
      get stepping() { return stepping; }, get stage() { return stage; }, get pinned() { return pinned; }, get passes() { return passes; }, get quality() { return quality; }
    };
  };
})();
