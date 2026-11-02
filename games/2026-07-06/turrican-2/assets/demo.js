/* Shard Assault : demo.js
 * ATTRACT MODE autopilot. It plays the real engine through the whole campaign
 * by returning one pad frame per 60 Hz tick: no recordings, no teleports.
 *
 * Platform stages are routed, not just reacted to. At stage start the pilot
 * maps every spot the trooper can stand on (tile tops, one-way ledges, water)
 * and lazily simulates the walks, drops and jumps between them with an exact
 * copy of the engine's player physics (it calls the engine's own moveBox).
 * Every re-plan runs Dijkstra over that graph to pick the cheapest crystal,
 * power-up or secret vault, commits to it (no flip-flopping), and re-checks
 * each take-off and landing in simulation from the live state.
 * UMD: usable in Node (headless bot tests) and the browser.
 */
(function (root, factory) {
  const node = typeof module === 'object' && module.exports;
  const D = node ? require('./data.js') : root.TData;
  const E = node ? require('./engine.js') : root.TEngine;
  const mod = factory(D, E);
  if (node) module.exports = mod;
  else root.TDemo = mod;
})(typeof self !== 'undefined' ? self : this, function (D, E) {
  'use strict';

  const { TILE, T, VIEW_W } = D;
  const DT = D.DT, PH = D.PHYS;
  // tick counts below were tuned for 1/60 s ticks: tk() keeps the same span of game time at any D.SPEED
  const tk = (n) => Math.round(n / (60 * DT));

  // ---- tile probes (mirror the engine's rules exactly) ---------------------
  function tileAt(lvl, tx, ty) {
    if (ty >= lvl.rows) return T.EMPTY;                 // below the map = open air
    if (tx < 0 || tx >= lvl.cols || ty < 0) return T.SOLID;
    return lvl.tiles[ty * lvl.cols + tx];
  }
  const isSolid = (t) => t === T.SOLID || t === T.CRATE;
  function solidAt(lvl, px, py) { return isSolid(tileAt(lvl, Math.floor(px / TILE), Math.floor(py / TILE))); }
  function spikeHit(lvl, b) {
    const x0 = Math.floor(b.x / TILE), x1 = Math.floor((b.x + b.w) / TILE);
    const y0 = Math.floor(b.y / TILE), y1 = Math.floor((b.y + b.h) / TILE);
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (tileAt(lvl, tx, ty) === T.SPIKE) return true;
    return false;
  }
  // swimming body centre for a water cell: the 14x30 body must clear the rock and the centre stay in
  // this cell (above the surface row the swimmer would breach); aim mid-cell, or mid-window when tight
  function swimY(lvl, n) {
    if (n.fitY !== undefined) return n.fitY;
    const top = n.ty * TILE;
    const fits = (cy) => {
      for (let r = Math.floor((cy - 15) / TILE); r <= Math.floor((cy + 15 - 0.01) / TILE); r++) if (isSolid(tileAt(lvl, n.tx, r))) return false;
      return true;
    };
    let lo = null, hi = null;
    for (let cy = top + 1; cy <= top + 19; cy++) if (fits(cy)) { if (lo == null) lo = cy; hi = cy; }
    if (lo == null) return (n.fitY = null);
    return (n.fitY = hi - lo >= 3 ? Math.max(lo + 1.5, Math.min(hi - 1.5, top + 10)) : (lo + hi) / 2);
  }
  function onFloor(lvl, b) { const y = b.y + b.h + 1; return solidAt(lvl, b.x + 2, y) || solidAt(lvl, b.x + b.w - 2, y); }
  const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  // shmup: the clear flight gap at a column, measured from SOLID only (crates
  // sit *inside* the gap and are meant to be shot through, not flown around)
  function tunnelGap(lvl, px) {
    const tx = Math.max(0, Math.min(lvl.cols - 1, Math.floor(px / TILE)));
    let top = 0, bot = lvl.rows - 1;
    while (top < lvl.rows && tileAt(lvl, tx, top) === T.SOLID) top++;
    while (bot > top && tileAt(lvl, tx, bot) === T.SOLID) bot--;
    return { top: top * TILE, bot: (bot + 1) * TILE };
  }
  function crateAhead(lvl, px, span) {
    const t0 = Math.floor(px / TILE), t1 = Math.floor((px + span) / TILE);
    for (let tx = t0; tx <= t1; tx++)
      for (let ty = 0; ty < lvl.rows; ty++)
        if (tileAt(lvl, tx, ty) === T.CRATE) return tx * TILE;
    return -1;
  }

  function blankInput() {
    return {
      left: false, right: false, up: false, down: false, jump: false, fire: false, morph: false,
      jumpPressed: false, jumpReleased: false, upPressed: false, downPressed: false,
      leftPressed: false, rightPressed: false, firePressed: false, morphPressed: false,
      switchPressed: false, bombPressed: false, linePressed: false,
      pausePressed: false, mutePressed: false, startPressed: false,
    };
  }

  // ---- exact player physics (platform mode, standing trooper) --------------
  // A line-for-line copy of the engine's updatePlayer movement: accel/friction,
  // jump buffer + coyote, the single release cut, breach hop, wind, updraft,
  // auto step-up, swimming, moveBox collision and one-way ledges with belts.
  function bodyOf(p) {
    return { x: p.x, y: p.y, w: p.w, h: p.h, vx: p.vx, vy: p.vy, g: !!p.onGround,
      coy: p._coyote || 0, buf: 0, wet: !!p.inWater, hurt: false, dead: false };
  }
  function stepBody(lvl, b, mv, jp, jr, up, frame, wind) {
    const accel = b.g ? PH.runAccel : PH.airAccel, maxSpd = b.wet ? PH.runSpeed * 0.7 : PH.runSpeed;
    if (mv) { b.vx += mv * accel * DT; if (b.vx > maxSpd) b.vx = maxSpd; else if (b.vx < -maxSpd) b.vx = -maxSpd; }
    else {
      const fr = (b.g ? PH.friction : PH.friction * 0.22) * DT;
      if (b.vx > 0) b.vx = Math.max(0, b.vx - fr); else if (b.vx < 0) b.vx = Math.min(0, b.vx + fr);
    }
    const was = b.wet;
    b.wet = tileAt(lvl, Math.floor((b.x + b.w / 2) / TILE), Math.floor((b.y + b.h / 2) / TILE)) === T.WATER;
    if (was && !b.wet && b.vy < 0) { b.vy *= 1.15; b.coy = PH.coyote; }
    b.coy = b.g ? PH.coyote : Math.max(0, b.coy - DT);
    b.buf = jp ? PH.jumpBuffer : Math.max(0, b.buf - DT);
    if (b.buf > 0 && b.coy > 0 && !b.wet) { b.vy = -PH.jumpVel; b.coy = 0; b.buf = 0; b.g = false; }
    if (jr && b.vy < 0 && !b.wet) b.vy *= PH.jumpCut;
    if (wind && lvl.windX && !b.g && !b.wet) b.vx += Math.sin(frame * DT * 0.45) * lvl.windX * DT;
    const ud = lvl.updraft;
    if (ud && b.x + b.w / 2 > ud.x0 && b.x + b.w / 2 < ud.x1 && !b.g && !b.wet) { b.vy -= 2400 * DT; if (b.vy < -290) b.vy = -290; }
    if (b.g && mv) {                                       // auto step-up (1 tile)
      const aheadX = mv > 0 ? b.x + b.w + 2 : b.x - 2, footY = b.y + b.h - 3;
      if (solidAt(lvl, aheadX, footY) && !solidAt(lvl, aheadX, footY - TILE - 2) &&
          !solidAt(lvl, b.x + 2, b.y - TILE - 2) && !solidAt(lvl, b.x + b.w - 2, b.y - TILE - 2)) b.y -= TILE + 2;
    }
    if (b.wet) {
      b.vy += PH.gravity * 0.22 * DT; if (up) b.vy -= 2100 * DT;
      b.vy = Math.max(-160, Math.min(175, b.vy));
    } else { b.vy += PH.gravity * DT; if (b.vy > PH.maxFall) b.vy = PH.maxFall; }
    const prevBottom = b.y + b.h;
    const info = E.moveBox(lvl, b, b.vx * DT, b.vy * DT);
    if (info.hitX) b.vx = 0;
    if (info.hitY) { if (info.onGround) b.g = true; b.vy = 0; }
    b.g = info.onGround || (b.g && !info.hitY && b.vy >= 0 && onFloor(lvl, b));
    if (!info.onGround) b.g = onFloor(lvl, b);
    if (b.vy >= 0 && lvl.platforms) {
      const feet = b.y + b.h;
      for (const pl of lvl.platforms) {
        const plx = pl.x * TILE, ply = pl.y * TILE, plw = pl.w * TILE;
        if (b.x + b.w > plx + 2 && b.x < plx + plw - 2 && prevBottom <= ply + 3 && feet >= ply) {
          b.y = ply - b.h; b.vy = 0; b.g = true;
          if (pl.belt) b.x += pl.belt * 46 * DT;
          break;
        }
      }
    }
    if (spikeHit(lvl, b)) b.hurt = true;
    if (b.y > lvl.rows * TILE + 8) b.dead = true;
  }

  // Fly one action: jump now (hold ticks then release) or walk off (no jump),
  // with a fixed horizontal input in the air. Stops on landing, water, death.
  function fly(lvl, b, o) {
    const touched = o.reg ? new Set() : null;
    let air = false, jumpAt = o.jump ? 0 : -1, wasWet = b.wet;
    const max = o.max || tk(110);
    for (let t = 0; t < max; t++) {
      if (o.breach && jumpAt < 0 && wasWet && !b.wet) jumpAt = t;
      const jp = t === jumpAt, jr = (jumpAt >= 0 && t === jumpAt + o.hold) || (o.rel != null && t === o.rel);
      const mv = (!air && o.groundMv != null) ? o.groundMv : o.mv;
      wasWet = b.wet;
      stepBody(lvl, b, mv, jp, jr, o.breach ? b.wet : !!o.up, o.frame + t, o.wind);
      if (o.breach && b.wet && t > tk(70)) return { ok: false, t, b, touched };
      if (touched) o.reg.touch(b, touched);
      if (o.item && !o.got) {
        const it = o.item, iy = it.baseY + Math.sin((it.t + (t + 1) * DT) * 3) * 3;
        if (b.x < it.x + it.w && b.x + b.w > it.x && b.y < iy + it.h && b.y + b.h > iy) o.got = true;
      }
      if (b.dead || b.hurt) return { ok: false, t, b, touched };
      if (b.wet && !o.swim && !o.breach) return { ok: true, wet: true, t, b, touched };
      if (!b.g) air = true;
      else if (air) {
        if (o.settle) {
          const land = { x: b.x, y: b.y };
          for (let k = 0; k < o.settle; k++) { stepBody(lvl, b, o.settleMv || 0, false, false, false, o.frame + t + k + 1, o.wind); if (b.dead || b.hurt || b.wet || !b.g) return { ok: false, t, b, touched }; }
          b.x = land.x; b.y = land.y;
        }
        return { ok: true, t, b, touched };
      }
      else if (!o.jump && t > tk(24)) return { ok: false, t, b, touched };   // never left the ledge
    }
    return { ok: false, t: max, b, touched };
  }

  // ---- pickup registry: which tiles each crystal / power-up overlaps -------
  function Registry(items) {
    this.items = items.slice(); this.ids = new Map(); this.grid = new Map();
    this.items.forEach((it, i) => {
      this.ids.set(it, i);
      const y0 = (it.baseY != null ? it.baseY : it.y) - 3;
      for (let tx = Math.floor(it.x / TILE); tx <= Math.floor((it.x + 16) / TILE); tx++)
        for (let ty = Math.floor(y0 / TILE); ty <= Math.floor((y0 + 22) / TILE); ty++) {
          const k = tx * 64 + ty; if (!this.grid.has(k)) this.grid.set(k, []); this.grid.get(k).push(i);
        }
    });
  }
  Registry.prototype.touch = function (b, out) {
    for (let tx = Math.floor(b.x / TILE); tx <= Math.floor((b.x + b.w) / TILE); tx++)
      for (let ty = Math.floor(b.y / TILE); ty <= Math.floor((b.y + b.h) / TILE); ty++) {
        const list = this.grid.get(tx * 64 + ty); if (!list) continue;
        for (const i of list) {
          const it = this.items[i], by = (it.baseY != null ? it.baseY : it.y);
          if (b.x < it.x + 16 && b.x + b.w > it.x && b.y < by + 19 && b.y + b.h > by - 3) out.add(i);
        }
      }
  };

  // ---- navigation graph ----------------------------------------------------
  // Nodes: a standing spot per column and surface (solid/crate tops with two
  // tiles of headroom, one-way ledges) plus swim cells. Edges are computed
  // lazily by flying the real physics from the node.
  const JUMPS = [];
  const FULL = tk(30);                                   // a full-height hold
  for (const d of [-1, 1]) for (const run of [0, 1]) for (const hold of [6, 11, 17, 30]) JUMPS.push({ d, run, hold: tk(hold), air: d });
  for (const hold of [12, 30]) JUMPS.push({ d: 0, run: 0, hold: tk(hold), air: 0 });
  for (const d of [-1, 1]) JUMPS.push({ d, run: 0, hold: FULL, air: 0, lift: true });   // pop straight up from a walk

  function Graph(s) {
    this.l = s.level; this.nodes = new Map(); this.reg = new Registry(s.pickups);
    this.ver = 0; this.crates = [];
    const l = this.l;
    for (let ty = 0; ty < l.rows; ty++) for (let tx = 0; tx < l.cols; tx++) if (l.tiles[ty * l.cols + tx] === T.CRATE) this.crates.push(ty * l.cols + tx);
    this.build(0, l.cols - 1);
    this.vaults = this.findVaults();
  }
  Graph.prototype.key = (tx, ty, swim) => ((tx + 4) * 32 + ty) * 2 + (swim ? 1 : 0);
  Graph.prototype.get = function (tx, ty, swim) { return this.nodes.get(this.key(tx, ty, swim)); };
  Graph.prototype.build = function (c0, c1) {
    const l = this.l;
    for (const [k, n] of this.nodes) if (n.tx >= c0 && n.tx <= c1) this.nodes.delete(k);
    const add = (tx, ty, swim, plat) => {
      const n = { tx, ty, swim, plat, x: tx * TILE + 10, y: swim ? ty * TILE + 10 : ty * TILE, edges: null,
        wet: !swim && tileAt(l, tx, ty - 1) === T.WATER, gems: null };
      this.nodes.set(this.key(tx, ty, swim), n);
    };
    for (let tx = c0; tx <= c1; tx++) for (let ty = 1; ty < l.rows; ty++) {
      const t = tileAt(l, tx, ty), a1 = tileAt(l, tx, ty - 1), a2 = tileAt(l, tx, ty - 2);
      if (isSolid(t) && !isSolid(a1) && !isSolid(a2) && a1 !== T.SPIKE && a2 !== T.SPIKE) add(tx, ty, false, false);
      if (t === T.WATER) add(tx, ty, true, false);
    }
    for (const pl of (l.platforms || [])) for (let tx = pl.x; tx < pl.x + pl.w; tx++) {
      if (tx < c0 || tx > c1 || this.get(tx, pl.y, false)) continue;
      if (!isSolid(tileAt(l, tx, pl.y - 1)) && !isSolid(tileAt(l, tx, pl.y - 2))) add(tx, pl.y, false, true);
    }
    // standing-touch: crystals a trooper collects just by walking over the spot
    for (const n of this.nodes.values()) if (n.tx >= c0 && n.tx <= c1) {
      const set = new Set();
      if (!n.swim) this.reg.touch({ x: n.x - 7, y: n.y - 30, w: 14, h: 30 }, set);
      else this.reg.touch({ x: n.x - 7, y: n.y - 15, w: 14, h: 30 }, set);
      n.gems = set.size ? [...set] : null;
    }
  };
  // a tile changed (a crate was shot): rebuild those columns, re-fly neighbours
  Graph.prototype.dirty = function (tx) {
    this.build(Math.max(0, tx - 1), Math.min(this.l.cols - 1, tx + 1));
    for (const n of this.nodes.values()) if (Math.abs(n.tx - tx) <= 9) n.edges = null;
    this.ver++;
  };
  Graph.prototype.at = function (b) {
    const tx = Math.floor((b.x + b.w / 2) / TILE);
    if (b.wet) return this.get(tx, Math.floor((b.y + b.h / 2) / TILE), true) || null;
    const ty = Math.round((b.y + b.h) / TILE);
    return this.get(tx, ty, false) || this.get(tx - 1, ty, false) || this.get(tx + 1, ty, false) || null;
  };
  // inside an updraft column nothing lands until you glide out the far side
  Graph.prototype.lift = function (x) { const u = this.l.updraft; return !!u && x > u.x0 - 120 && x < u.x1 + 40; };
  Graph.prototype.edges = function (n) {
    if (n.edges) return n.edges;
    const l = this.l, out = [], lift = this.lift(n.x), max = tk(lift ? 460 : 110);
    if (n.swim) {
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        if (!dx && !dy) continue;
        const m = this.get(n.tx + dx, n.ty + dy, true);
        if (m && swimY(l, m) != null) out.push({ kind: 'swim', from: n, to: m, cost: dx && dy ? 0.21 : 0.15 });
      }
      const floor = this.get(n.tx, n.ty + 1, false);
      if (floor) out.push({ kind: 'swim', from: n, to: floor, cost: 0.2 });
      if (tileAt(l, n.tx, n.ty - 1) !== T.WATER) {            // surface cell: breach-hop to a bank
        for (const d of [-1, 0, 1]) {
          const r = fly(l, { x: n.x - 7, y: n.y - 15, w: 14, h: 30, vx: d * 120, vy: -120, g: false, coy: 0, buf: 0, wet: true, hurt: false, dead: false },
            { breach: true, hold: FULL, mv: d, frame: 0, reg: this.reg, max: tk(150) });
          const m = r.ok ? this.at(r.b) : null;
          if (m && !m.swim && !m.wet) out.push({ kind: 'breach', from: n, to: m, d, cost: r.t * DT + 0.1, gems: r.touched.size ? [...r.touched] : null });
        }
      }
      return (n.edges = out);
    }
    if (n.wet) { const up = this.get(n.tx, n.ty - 1, true); if (up) out.push({ kind: 'swim', from: n, to: up, cost: 0.15 }); }
    const base = { x: n.x - 7, y: n.y - 30.01, w: 14, h: 30, vx: 0, vy: 0, g: true, coy: PH.coyote, buf: 0, wet: n.wet, hurt: false, dead: false };
    const land = (r) => (r.ok ? this.at(r.b) : null);
    for (const d of [-1, 1]) {
      const flat = this.get(n.tx + d, n.ty, false), step = this.get(n.tx + d, n.ty - 1, false);
      if (flat) out.push({ kind: 'walk', from: n, to: flat, d, cost: 0.1 });
      else if (step && !step.plat && !isSolid(tileAt(l, n.tx, n.ty - 3))) out.push({ kind: 'walk', from: n, to: step, d, cost: 0.14 });   // auto step-up only mounts solid ledges
      else if (!isSolid(tileAt(l, n.tx + d, n.ty - 1)) && !isSolid(tileAt(l, n.tx + d, n.ty - 2))) {
        for (const mv of [d, 0]) {                               // run off, or step off and drop straight
          const r = fly(l, Object.assign({}, base, { vx: d * (mv ? 205 : 60) }), { groundMv: d, mv, frame: 0, reg: this.reg, max });
          const m = land(r);
          if (m && m !== n) out.push({ kind: mv ? 'fall' : 'drop', from: n, to: m, d, air: mv, cost: r.t * DT + 0.05, gems: r.touched.size ? [...r.touched] : null });
        }
      }
    }
    for (const c of (l.crawls || [])) {                          // a crawlspace: roll through to the far mouth
      if (n.wet || n.plat || n.ty !== c.gy || (n.tx !== c.x0 - 1 && n.tx !== c.x1 + 1)) continue;
      const d = n.tx < c.x0 ? 1 : -1, m = this.get(d > 0 ? c.x1 + 1 : c.x0 - 1, c.gy, false);
      if (!m) continue;
      const got = new Set();
      this.reg.touch({ x: c.x0 * TILE, y: (c.gy - 1) * TILE + 4, w: (c.x1 - c.x0 + 1) * TILE, h: 16 }, got);
      out.push({ kind: 'crawl', from: n, to: m, d, crawl: c, cost: (c.x1 - c.x0 + 3) * TILE / PH.morphSpeed + 0.6, gems: got.size ? [...got] : null });
    }
    const close = (a, b) => a && b && (a === b || (a.swim === b.swim && a.ty === b.ty && Math.abs(a.tx - b.tx) <= 1));
    if (!n.wet) for (const a of (lift ? JUMPS.filter(j => j.hold === FULL && !j.lift) : JUMPS)) {
      const o = { jump: true, hold: a.hold, mv: a.air, groundMv: a.lift ? a.d : null, frame: 0, max };
      const r = fly(l, Object.assign({}, base, { vx: a.run ? a.d * 205 : 0 }), Object.assign({ reg: this.reg }, o));
      const m = land(r);
      if (!m) continue;
      if (m === n && !r.touched.size) continue;
      let robust = true;
      if (!lift) for (const off of [-2.5, 2.5]) {
        const q = fly(l, Object.assign({}, base, { x: base.x + off, vx: a.run ? a.d * 205 : 0 }), o);
        if (!close(land(q), m)) { robust = false; break; }
      }
      out.push({ kind: 'jump', from: n, to: m, act: a, d: a.d, cost: r.t * DT + (robust ? 0.12 : 1.2), fragile: !robust, gems: r.touched.size ? [...r.touched] : null });
    }
    return (n.edges = out);
  };
  // secret vaults: crate plugs at ground level with a buried chamber below
  Graph.prototype.findVaults = function () {
    const l = this.l, out = [], seen = new Set();
    for (const i of this.crates) {
      if (seen.has(i)) continue;
      const tx = i % l.cols, ty = (i / l.cols) | 0;
      if (tileAt(l, tx + 1, ty) !== T.CRATE || tileAt(l, tx, ty + 1) === T.SOLID) continue;
      seen.add(i); seen.add(i + 1);
      const gems = [];
      this.reg.items.forEach((it, k) => { if (it.x >= (tx - 2) * TILE && it.x <= (tx + 3) * TILE && it.y > ty * TILE && it.y < (ty + 5) * TILE) gems.push(k); });
      if (gems.length) out.push({ tx, ty, gems, tries: 0 });
    }
    return out;
  };

  // binary-heap Dijkstra over the window around the trooper
  function dijkstra(G, start, xa, xb, budget) {
    const dist = new Map([[start, 0]]), prev = new Map(), heap = [[0, start]];
    const push = (e) => { heap.push(e); let i = heap.length - 1; while (i) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = i * 2 + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
    const t0 = Date.now();
    while (heap.length) {
      const [d, n] = pop();
      if (d > dist.get(n)) continue;
      if (!n.edges && budget && Date.now() - t0 > budget && Math.abs(n.x - start.x) > 110) continue;   // out of time: leave the far frontier unflown
      for (const e of G.edges(n)) {
        if (e.to.x < xa || e.to.x > xb) continue;
        const nd = d + e.cost;
        if (nd < (dist.has(e.to) ? dist.get(e.to) : Infinity)) { dist.set(e.to, nd); prev.set(e.to, e); push([nd, e.to]); }
      }
    }
    return { dist, prev };
  }

  // ---- the pilot -----------------------------------------------------------
  function createPilot() {
    const P = {
      jumpT: 0, dodgeCd: 0, bombCd: 0, switchCd: 0, lineCd: 0, morphT: 0, morphCd: 0, rolls: 0, switches: 0,
      rescues: 0, deaths: 0, wasDead: false, bossT: 0, elapsed: 0, held: blankInput(),
      intent: 'Finding a safe route',
    };
    let G = null, level = null;

    function reset(state) {
      P.jumpT = P.dodgeCd = P.bombCd = P.switchCd = P.lineCd = 0;
      P.morphT = P.morphCd = 0; P.bossT = 0; P.elapsed = 0; P.lastMorph = -1e9; P.roll = null; P.safeT = 0; P.crawl = null;
      P.held = blankInput(); P.goal = null; P.path = []; P.air = null; P.replanT = 0;
      P.banned = new Map(); P.blast = 0; P.forceSpread = false; P.progressX = -1e9; P.progressT = 0;
      P.airMv = 0; P.airHold = 0; P.hopCd = 0; P.runup = 0; P.wasWet = false; P.lastNode = null;
      P.intent = 'Finding a safe route';
      G = null; level = null;
      if (state && state.level && state.level.type !== 'shmup') { level = state.level; G = new Graph(state); warm(state); }
    }

    function frame(state) {
      const inp = blankInput();
      const p = state.player, lvl = state.level;
      P.elapsed += DT;
      for (const k of ['dodgeCd', 'bombCd', 'switchCd', 'morphCd', 'hopCd']) if (P[k] > 0) P[k] -= DT;

      if (p.dead) {
        if (!P.wasDead) { P.deaths++; P.wasDead = true; }
        P.jumpT = 0; P.morphT = 0; P.goal = null; P.path = []; P.air = null; P.blast = 0; P.roll = null; P.crawl = null;
        return finish(inp);
      }
      P.wasDead = false;

      if (lvl.type === 'shmup') flyShip(state, inp);
      else {
        if (lvl !== level) { level = lvl; G = new Graph(state); warm(state); }
        runAndGun(state, inp);
      }
      tactics(state, inp);
      if (lvl.type !== 'shmup') precompute(state, 0.8);
      return finish(inp);
    }

    // fly the edges around the start before the first decision
    function warm(state) { if (!G) return; const n = G.at(bodyOf(state.player)) || nearestNode(state); if (n) dijkstra(G, n, n.x - 300, n.x + 760); }
    // spend spare milliseconds flying the graph ahead of the trooper
    function precompute(state, ms) {
      if (!G) return;
      const t0 = Date.now(), px = state.player.x;
      if (!P.pre || P.pre.ver !== G.ver || Math.abs(P.pre.px - px) > 120) {
        // nearest first (re-flown vault surroundings), then the road ahead
        const rank = (n) => (Math.abs(n.x - px) < 300 ? Math.abs(n.x - px) : 300 + Math.abs(n.x - px - 300));
        P.pre = { ver: G.ver, px, list: [...G.nodes.values()].filter(n => !n.edges && n.x > px - 320 && n.x < px + 1100).sort((a, b) => rank(a) - rank(b)) };
      }
      while (P.pre.list.length && Date.now() - t0 < ms) G.edges(P.pre.list.shift());
    }
    function nearestNode(state) {
      const p = state.player; let best = null, bd = 1e9;
      for (const n of G.nodes.values()) { if (n.swim) continue; const d = Math.abs(n.x - (p.x + p.w / 2)) + Math.abs(n.y - (p.y + p.h)) * 1.5; if (d < bd) { bd = d; best = n; } }
      return best;
    }

    // ---- choosing what to do next ------------------------------------------
    const VALUE = {
      gem: () => 0, pu_weapon: (p) => (p.weapons[p.weapon] < 3 ? 0.9 : 0.3), pu_energy: (p) => (p.energy < 70 ? 2.2 : 0.15),
      pu_life: () => 1.4, pu_bomb: () => 0.5, pu_line: () => 0.35,
    };
    function plan(s, cur) {
      const p = s.player, px = p.x + p.w / 2;
      if (P.goal && P.goal.kind !== 'advance' && P.elapsed - (P.goal.since || P.elapsed) > Math.max(4, (P.goal.cost || 0) * 2.5 + 2.5)) {
        if (P.goal.it) P.banned.set(P.goal.it, P.elapsed + 30);
        if (P.goal.v) { P.goal.v.tries++; P.banned.set(P.goal.v, P.elapsed + 30); }
        P.goal = null; P.giveUps = (P.giveUps || 0) + 1;
      }
      const xa = px - 280, xb = px + 700;
      const { dist, prev } = dijkstra(G, cur, xa, xb, 3);
      const late = s.time < 45;
      if (P.debug) { P.cands = []; P.dbgDist = dist; }
      // best way to collect each pickup: stand on a spot, or an arc through it
      const opt = new Map();
      const offer = (i, cost, n, e) => { const o = opt.get(i); if (!o || cost < o.cost) opt.set(i, { cost, n, e }); };
      for (const [n, d] of dist) {
        if (n.gems) for (const i of n.gems) offer(i, d, n, null);
        if (n.edges) for (const e of n.edges) if (e.gems) for (const i of e.gems) offer(i, d + e.cost, n, e);
      }
      let best = null;
      const consider = (g) => { if (!best || g.score < best.score) best = g; };
      for (const it of s.pickups) {
        if (it.taken || (P.banned.get(it) || 0) > P.elapsed) continue;
        const i = G.reg.ids.get(it);
        let o = i != null ? opt.get(i) : null;
        if (!o) {                                               // boss drops: walk onto them
          for (const [n, d] of dist) if (!n.swim && Math.abs(n.x - (it.x + 8)) < 14 && Math.abs(n.y - (it.y + 16)) < 30 && (!o || d < o.cost)) o = { cost: d, n, e: null };
        }
        if (!o || o.cost > (late ? 1.5 : 7)) continue;
        // sweep left to right (cheap back-tracks, a nudge against racing ahead) and favour clusters,
        // so a cheap crystal ahead never cuts the route off from a rich shelf behind
        const back = it.x + 8 < px - 30 ? 0.12 + (px - it.x) / 900 : 0;
        const ahead = Math.max(0, it.x - px) * 0.007;
        let cluster = 0;
        for (const q of s.pickups) if (q !== it && q.type === 'gem' && Math.abs(q.x - it.x) < 64 && Math.abs(q.y - it.y) < 64) cluster += 0.12;
        const bias = back + ahead - Math.min(0.6, cluster) - (VALUE[it.type] || VALUE.gem)(p);
        consider({ kind: 'pickup', it, n: o.n, e: o.e, score: o.cost + bias, cost: o.cost, bias });
        if (P.debug) P.cands.push({ x: it.x, y: Math.round(it.baseY), score: +(o.cost + bias).toFixed(2) });
      }
      if (!late) for (const v of G.vaults) {
        if (v.tries > 3 || (P.banned.get(v) || 0) > P.elapsed) continue;
        if (tileAt(s.level, v.tx, v.ty) !== T.CRATE && tileAt(s.level, v.tx + 1, v.ty) !== T.CRATE) continue;
        const left = v.gems.filter(k => s.pickups.includes(G.reg.items[k])).length;
        if (!left) continue;
        const n = G.get(v.tx, v.ty, false) || G.get(v.tx + 1, v.ty, false);
        if (!n || !dist.has(n)) continue;
        consider({ kind: 'vault', v, n, e: null, score: dist.get(n) + 0.8 - left * 0.45, cost: dist.get(n), bias: 0.8 - left * 0.45 });
      }
      // otherwise advance: the furthest reachable spot on the way to the exit
      if (!best) {
        let far = null;
        for (const [n, d] of dist) if (!n.swim && (!far || n.x > far.x + 4 || (Math.abs(n.x - far.x) <= 4 && d < dist.get(far)))) far = n;
        if (far && far !== cur) best = { kind: 'advance', n: far, e: null, score: 99, cost: dist.get(far) };
      }
      // commitment: only drop the current goal for a clearly better one
      const same = (a, b) => a && b && a.kind === b.kind && ((a.it && a.it === b.it) || (a.v && a.v === b.v));
      if (P.goal && best && same(P.goal, best)) { best.since = P.goal.since; best.tries = P.goal.tries; }
      else if (P.goal && best && P.goal.kind !== 'advance' && valid(s, P.goal) && dist.has(P.goal.n)) {
        const keep = dist.get(P.goal.n) + (P.goal.e ? P.goal.e.cost : 0) + (P.goal.bias || 0);
        if (keep <= best.score + 0.35) best = Object.assign(P.goal, { score: keep, cost: keep - (P.goal.bias || 0) });
      }
      if (best && !best.since) best.since = P.elapsed;
      P.goal = best;
      // the route: edges from here to the goal's spot, then the goal's action
      P.path = [];
      if (best) {
        let n = best.n;
        while (n !== cur && prev.has(n)) { const e = prev.get(n); P.path.unshift(e); n = e.from; }
        if (best.e) P.path.push(best.e);
      }
      P.intent = !best ? 'Finding a safe route' :
        best.kind === 'vault' ? 'Cracking a secret vault' :
        best.kind === 'advance' ? (s.boss && !s.bossDead ? 'Advancing on the guardian' : 'Pushing forward') :
        best.it.type === 'gem' ? (best.e && best.e.kind === 'jump' ? 'Leaping for crystals' : 'Collecting crystals') : 'Grabbing a power-up';
      P.replanT = 0.35;
    }
    function valid(s, g) {
      if (g.kind === 'pickup') return s.pickups.includes(g.it);
      if (g.kind === 'vault') return tileAt(s.level, g.v.tx, g.v.ty) === T.CRATE || tileAt(s.level, g.v.tx + 1, g.v.ty) === T.CRATE;
      return true;
    }

    // ---- platform stages ---------------------------------------------------
    function runAndGun(state, inp) {
      const p = state.player, b = state.boss;
      inp.fire = !p.morph;
      syncTiles(state);

      if (b && b.alive && b.awake && !b.dying) { P.goal = null; P.path = []; duel(state, inp); return; }
      P.bossT = 0;

      P.groundT = p.onGround ? (P.groundT || 0) + 1 : 0;
      watchdog(state);
      const e0 = P.path[0];
      if (P.crawl || (e0 && e0.kind === 'crawl' && p.onGround && !p.inWater && G.at(bodyOf(p)) === e0.from)) crawl(state, inp);
      else if (p.morph && !p.onGround && !p.inWater && P.roll && P.roll.drop) inp[P.roll.drop > 0 ? 'right' : 'left'] = true;   // rolling off a step
      else {
        if (p.morph && (p.inWater || !p.onGround)) unroll(inp);     // the wheel sinks and can't steer a jump
        if (p.inWater) swim(state, inp);
        else if (!p.onGround) airborne(state, inp);
        else if (!wheel(state, inp)) grounded(state, inp);
      }
      P.wasWet = !!p.inWater;

      // straight-overhead threat: aim the fan skyward (not while cracking a vault)
      if (!P.blast && !p.inWater && !p.morph) {
        const pcx = p.x + p.w / 2;
        for (const e of state.enemies) if (e.alive) {
          const ex = e.x + e.w / 2 - pcx, ey = e.y + e.h / 2 - (p.y + 11);
          if (ey < -30 && ey > -200 && Math.abs(ex) < 50) { inp.up = true; break; }
        }
      }
      if (P.jumpT > 0) { inp.jump = true; P.jumpT--; }
    }

    // a shot crate opens the ground: refresh those columns of the map
    function syncTiles(state) {
      const l = state.level;
      for (let k = G.crates.length - 1; k >= 0; k--) {
        const i = G.crates[k];
        if (l.tiles[i] !== T.CRATE) { G.crates.splice(k, 1); G.dirty(i % l.cols); P.replanT = 0; }
      }
    }

    // never stand around: no progress toward the goal for a while = drop it
    function watchdog(state) {
      const p = state.player;
      const moved = Math.abs(p.x - P.progressX) > 18 || Math.abs(p.y - (P.progressY || 0)) > 30 || state.pickups.length !== P.progressN;
      if (moved) { P.progressX = p.x; P.progressY = p.y; P.progressN = state.pickups.length; P.progressT = 0; P.stuckT = 0; return; }
      P.progressT += DT; P.stuckT = (P.stuckT || 0) + DT;
      if (P.progressT > 1.1 && P.goal && P.goal.kind !== 'advance') {
        if (P.goal.it) P.banned.set(P.goal.it, P.elapsed + 12);
        else if (P.goal.v) { P.goal.v.tries++; P.banned.set(P.goal.v, P.elapsed + 10); }
        P.goal = null; P.path = []; P.replanT = 0; P.progressT = 0; P.giveUps = (P.giveUps || 0) + 1;
      } else if (P.stuckT > 2.2 && p.onGround) {                     // last resort: any safe hop forward
        escape(state); P.stuckT = 0.8; P.progressT = 0;
      }
    }

    function grounded(state, inp) {
      const p = state.player;
      P.air = null;
      if (P.jumpT > 0 && P.held.jump && P.groundT > 2) P.jumpT = 0;
      const cur = G.at(bodyOf(p));
      if (!cur) { const n = nearestNode(state); if (n) inp[n.x > p.x + 7 ? 'right' : 'left'] = true; return; }
      if (P.blast > 0) { P.blast = 0; P.replanT = 0; }
      P.forceSpread = false;
      // landed somewhere new or the route ran out: think again
      if (P.launched && P.groundT <= 1) {
        const e = P.launched; P.launched = null;
        const ok = cur === e.to || (cur && cur.ty === e.to.ty && Math.abs(cur.tx - e.to.tx) <= 1);
        if (!ok && ++e.fails >= 2) { const i = e.from.edges ? e.from.edges.indexOf(e) : -1; if (i >= 0) e.from.edges.splice(i, 1); }
      }
      // backing up for a running jump leaves the take-off spot on purpose: keep the plan
      const runup = P.runup > 0 && P.path[0] && P.path[0].kind === 'jump' && cur.ty === P.path[0].from.ty && Math.abs(cur.tx - P.path[0].from.tx) <= 3;
      if (cur !== P.lastNode && !runup) {
        while (P.path.length && P.path[0].from !== cur && P.path.some(e => e.from === cur)) P.path.shift();
        if (!P.path.length || P.path[0].from !== cur) P.replanT = 0;
        P.lastNode = cur;
      }
      P.replanT -= DT;
      if ((P.replanT <= 0 && !runup) || !P.goal || !valid(state, P.goal)) plan(state, cur);
      const e = P.path[0];
      if (p.morph && !rollable(e) && !(e && e.kind === 'crawl')) { inp.left = inp.right = false; unroll(inp); return; }   // jumps, drops and pickups need feet
      if (!e && overhead(state, inp, cur)) return;

      if (!e) {
        if (P.goal && P.goal.kind === 'vault' && P.goal.n === cur) { crack(state, inp, cur); return; }
        if (P.goal && P.goal.kind === 'pickup' && (!cur.gems || cur.gems.includes(G.reg.ids.get(P.goal.it)))) {
          // standing under/at it: step to the centre, then a little hop if the bob keeps it just out of reach
          const it = P.goal.it, dx = it.x + 8 - (p.x + p.w / 2);
          if (Math.abs(dx) > 6) { inp[dx > 0 ? 'right' : 'left'] = true; P.nudgeT = 0; return; }
          P.nudgeT = (P.nudgeT || 0) + DT;
          if (P.nudgeT > 0.3 && canPress()) {
            for (const a of JUMPS) {
              const o = { jump: true, hold: a.hold, mv: a.air, groundMv: a.lift ? a.d : null, frame: state.frame + 1, wind: true, item: it, settle: tk(8) };
              const r = fly(state.level, bodyOf(p), o);
              if (r.ok && o.got && G.at(r.b)) { P.jumpT = a.hold; P.air = { mv: a.air, to: G.at(r.b) }; P.lastNode = null; P.nudgeT = 0; return; }
            }
            P.banned.set(it, P.elapsed + 15); P.goal = null; P.replanT = 0; P.nudgeT = 0;
          }
          return;
        }
        // nothing to do here: drift toward the exit so the camera keeps moving
        inp[state.level.exit.x + 10 > p.x + 7 ? 'right' : 'left'] = true;
        return;
      }
      if (e.kind === 'walk' || e.kind === 'fall' || e.kind === 'drop') {
        if (!p.morph && hopEnemy(state, inp, e.d)) return;
        inp[e.d > 0 ? 'right' : 'left'] = true;
        P.air = { mv: e.kind === 'drop' ? 0 : e.d, to: e.to, gems: e.gems, edge: e };
        return;
      }
      if (e.kind === 'swim') { inp[e.to.x > p.x + 7 ? 'right' : 'left'] = true; return; }
      if (e.kind === 'jump') takeoff(state, inp, cur, e);
    }

    // Line up and jump only when a simulation from the live state says the
    // arc lands where the plan wants (trying the other jump shapes if needed).
    function takeoff(state, inp, cur, e) {
      const p = state.player, a = e.act, px = p.x + p.w / 2, dx = e.from.x - px;
      const item = P.goal && P.goal.e === e && P.goal.it ? P.goal.it : null;
      const close = (m, to) => m && (m === to || (m.swim === to.swim && m.ty === to.ty && Math.abs(m.tx - to.tx) <= 1));
      const tryJump = (act) => {
        const o = { jump: true, hold: act.hold, mv: act.air, groundMv: act.lift ? act.d : null, frame: state.frame + 1, wind: true, item, settle: tk(8) };
        const r = fly(state.level, bodyOf(p), o);
        return r.ok && (item ? o.got && G.at(r.b) : close(G.at(r.b), e.to)) ? r : null;
      };
      const near = Math.abs(dx) < 16;
      if (near || (a.run && Math.sign(p.vx) === a.d && Math.abs(p.vx) > 150 && Math.abs(dx) < 30)) {
        if (tryJump(a)) return launch(a, e);
        if (near) for (const alt of JUMPS) if (alt !== a && tryJump(alt)) return launch(alt, e);
        if (near && Math.abs(p.vx) < 30) {
          P.failT = P.failEdge === e ? P.failT + 1 : 1; P.failEdge = e;
          if (P.failT > 18) { const i = e.from.edges ? e.from.edges.indexOf(e) : -1; if (i >= 0) e.from.edges.splice(i, 1); P.failT = 0; P.replanT = 0; P.path = []; return; }
        }
      }
      // not lined up yet: get to the take-off, with a run-up when the plan needs one
      if (a.run) {
        const fast = Math.sign(p.vx) === a.d && Math.abs(p.vx) > 150;
        if (!fast && P.runup <= 0 && Math.abs(dx) < 24) P.runup = 0.3;
        if (P.runup > 0) { P.runup -= DT; if (!blockedBehind(state, -a.d)) { inp[a.d > 0 ? 'left' : 'right'] = true; return; } P.runup = 0; }
        inp[a.d > 0 ? 'right' : 'left'] = true;
      } else if (Math.abs(dx) > 3) {
        if (Math.abs(dx) < 10 && Math.abs(p.vx) > 90) return;      // coast to a stop on the spot
        inp[dx > 0 ? 'right' : 'left'] = true;
      }
    }
    function blockedBehind(state, d) {
      const p = state.player, x = p.x + p.w / 2 + d * 26;
      return solidAt(state.level, x, p.y + 10) || !solidAt(state.level, x, p.y + p.h + 4);
    }
    // the engine jumps on the PRESS edge: a button still held from the last
    // jump (it landed before the release) must come up for a tick first
    function canPress() { if (P.held.jump) { P.jumpT = 0; return false; } return true; }
    function launch(a, e) {
      if (!canPress()) return;
      if (P.goal && P.goal.e === e && P.goal.it) {
        P.goal.tries = (P.goal.tries || 0) + 1;
        if (P.goal.tries > 3) { P.banned.set(P.goal.it, P.elapsed + 20); P.goal = null; P.path = []; P.replanT = 0; return; }
      }
      P.jumpT = a.hold; P.air = { mv: a.air, to: e.to, gems: e.gems, edge: e, lift: a.lift ? a.d : 0 };
      e.fails = e.fails || 0; P.launched = (P.goal && P.goal.e === e) ? null : e;
      P.airMv = a.air; P.airHold = 0; P.path.shift(); P.lastNode = null;
    }

    // Airborne: re-fly the rest of the arc for each stick choice every few
    // ticks and keep the planned one unless another lands much better.
    function airborne(state, inp) {
      const p = state.player;
      if (P.blast > 0) {                                     // cracking a vault: fan straight down
        P.blast -= DT; inp.down = true; inp.fire = true; P.forceSpread = true;
        const cx = P.blastX != null ? P.blastX : p.x + p.w / 2, dx = cx - (p.x + p.w / 2);
        inp.left = dx < -1.5; inp.right = dx > 1.5; return;
      }
      // riding an updraft: drift under the crystals we will rise through
      if (G.lift(p.x + p.w / 2) && p.vy < -40) {
        const px = p.x + p.w / 2; let g = null, gs = 1e9;
        for (const it of state.pickups) if (it.type === 'gem' && it.y + 16 < p.y + 4 && Math.abs(it.x + 8 - px) < 150) {
          const sc = Math.abs(it.x + 8 - px) + (p.y - it.y) * 0.25; if (sc < gs) { gs = sc; g = it; }
        }
        if (g) { const dx = g.x + 8 - px; P.airMv = Math.abs(dx) > 4 ? Math.sign(dx) : 0; P.airHold = tk(2); inp.left = P.airMv < 0; inp.right = P.airMv > 0; P.intent = 'Riding the updraft for crystals'; return; }
      }
      if (P.air && P.air.breach && !P.breachJumped && P.wasWet && p.vy < 0 && canPress()) { P.jumpT = FULL; P.breachJumped = true; P.path.shift(); P.lastNode = null; }
      const target = P.air && P.air.to;
      if (P.airHold-- <= 0) {
        const want = P.air ? P.air.mv : 0, prevMv = P.airMv;
        let best = want, bestScore = -1e9;
        const long = G.lift(p.x + p.w / 2), max = tk(long ? 460 : 90);
        const near = (m) => m && target && (m === target || (m.swim === target.swim && m.ty === target.ty && Math.abs(m.tx - target.tx) <= 1));
        const release = P.jumpT > 0 ? P.jumpT : null;
        const sim = (mv) => fly(state.level, bodyOf(p), { jump: false, mv, frame: state.frame + 1, wind: true, max, settle: tk(10), settleMv: 0, hold: release, rel: release });
        const planned = P.air && P.air.edge ? sim(want) : null;
        const cands = planned && planned.ok && (!target || near(G.at(planned.b))) ? [want] : [prevMv, want, 0, -prevMv || 1];
        for (const mv of cands) {
          const r = cands.length === 1 ? planned : sim(mv);
          let sc = r.ok ? 1000 : (r.b.dead ? -2000 : -500);
          if (r.ok && target) { const m = G.at(r.b); sc -= near(m) ? 0 : 40 + Math.abs(r.b.x + 7 - target.x) * 0.5; }
          else if (r.ok) sc += (r.b.x - p.x) * Math.sign(state.level.exit.x - p.x) * 0.05;
          if (mv === want) sc += 6;
          if (mv === prevMv) sc += 12;                    // stickiness: no twitching between near-equal choices
          else if (prevMv && mv === -prevMv) sc -= 10;   // reversing mid-air looks frantic
          if (sc > bestScore) { bestScore = sc; best = mv; }
        }
        P.airMv = best; P.airHold = tk(long ? 8 : 3);
      }
      inp.left = P.airMv < 0; inp.right = P.airMv > 0;
    }

    // Water: swim at the next spot on the route; breach-hop onto banks.
    function swim(state, inp) {
      const p = state.player;
      const cur = G.at(bodyOf(p));
      P.replanT -= DT;
      if (cur && (cur !== P.lastNode || P.replanT <= 0 || !P.goal)) { P.lastNode = cur; plan(state, cur); }
      const e = P.path[0];
      let tx, ty;
      if (e) { tx = e.to.x; ty = e.to.swim ? swimY(state.level, e.to) : e.to.y - 40; if (e.kind === 'breach') ty = -1e9; }
      else { tx = state.level.exit.x; ty = p.y; }
      const px = p.x + p.w / 2, py = p.y + p.h / 2;
      const hx = e && e.kind === 'breach' ? (e.d ? e.d * 1e9 : 0) : tx - px;
      if (Math.abs(hx) > (P.swimDir ? 2 : 8)) { P.swimDir = Math.sign(hx); inp[hx > 0 ? 'right' : 'left'] = true; } else P.swimDir = 0;
      // ease onto the target depth: water is floaty, so brake with the opposite stroke instead of overshooting
      const want = Math.max(-150, Math.min(150, (ty - py) * 10));
      if (p.vy > want + 8) inp.up = true; else if (p.vy < want - 8) inp.down = true;
      P.air = e && e.kind === 'breach' ? { mv: e.d, to: e.to, breach: true } : null; P.breachJumped = false;
    }

    // a crate in the roof within a few tiles (half-opened vault plug): get under it, shoot up
    function overhead(state, inp, cur) {
      const l = state.level, p = state.player;
      for (let dx = 0; dx <= 2; dx++) for (const sgn of dx ? [-1, 1] : [1]) {
        const tx = cur.tx + dx * sgn;
        for (let ty = cur.ty - 2; ty >= cur.ty - 6; ty--) {
          const t = tileAt(l, tx, ty);
          if (t === T.SOLID) break;
          if (t !== T.CRATE) continue;
          const cx = tx * TILE + 10, ddx = cx - (p.x + p.w / 2);
          P.forceSpread = true; P.intent = 'Blasting out of the vault';
          if (Math.abs(ddx) > 4) inp[ddx > 0 ? 'right' : 'left'] = true;
          else if (p.weapon === 'spread') { inp.up = true; inp.fire = true; }
          return true;
        }
      }
      return false;
    }
    function crack(state, inp, cur) {
      const p = state.player, v = P.goal.v, cx = (v.tx + 1) * TILE;
      const dx = cx - (p.x + p.w / 2);
      if (Math.abs(dx) > 3) { if (!(Math.abs(dx) < 8 && Math.abs(p.vx) > 60)) inp[dx > 0 ? 'right' : 'left'] = true; return; }
      if (p.weapon !== 'spread') { P.forceSpread = true; return; }
      if (!canPress()) return;
      v.tries++; P.blast = 0.9; P.jumpT = tk(14); P.blastX = cx; P.air = null; P.progressT = 0; P.progressX = p.x - 100;
    }

    // a walker in our lane: hop it if a safe arc exists
    function hopEnemy(state, inp, d) {
      if (P.hopCd > 0) return false;
      const p = state.player, px = p.x + p.w / 2;
      const foe = state.enemies.find(e => e.alive && (e.x + e.w / 2 - px) * d > 0 && Math.abs(e.x + e.w / 2 - px) < 40 &&
        e.y < p.y + p.h && e.y + e.h > p.y + 4 && state.freeze <= 0);
      if (!foe || !canPress()) return false;
      for (const hold of [tk(17), FULL]) {
        const r = fly(state.level, bodyOf(p), { jump: true, hold, mv: d, frame: state.frame + 1, wind: true, settle: tk(8) });
        if (r.ok && G.at(r.b) && (r.b.x - foe.x) * d > 0) { P.jumpT = hold; P.air = { mv: d, to: G.at(r.b) }; P.hopCd = 0.8; P.lastNode = null; return true; }
      }
      return false;
    }
    function escape(state) {
      if (!canPress()) return;
      const p = state.player, dir = state.level.exit.x > p.x ? 1 : -1;
      let best = null;
      for (const a of JUMPS) {
        const r = fly(state.level, bodyOf(p), { jump: true, hold: a.hold, mv: a.air, frame: state.frame + 1, wind: true, settle: tk(8) });
        if (!r.ok) continue;
        const sc = (r.b.x - p.x) * dir + (G.at(r.b) ? 50 : 0);
        if (!best || sc > best.sc) best = { a, sc, to: G.at(r.b) };
      }
      if (best) { P.jumpT = best.a.hold; P.air = { mv: best.a.air, to: best.to }; P.lastNode = null; P.goal = null; P.path = []; }
    }

    // ---- the wheel ------------------------------------------------------------
    // Rolled up, the trooper shrugs off shots and contact, grinds ground troops,
    // lays mines and outruns a walk, but it can't jump, climb a ledge or ride a
    // one-way ledge: it only rolls along flat, solid stretches of the route.
    const rollable = (e) => e && !e.from.plat && !e.to.plat && !e.to.wet && ((e.kind === 'walk' && e.to.ty === e.from.ty) || rollDrop(e));
    function rollDrop(e) {
      if (e.kind !== 'fall' || e.to.ty !== e.from.ty + 1) return false;
      for (let k = 1; k <= 4; k++) { const m = G.get(e.from.tx + k * e.d, e.to.ty, false); if (!m || m.plat || m.wet || wheelMisses(m)) return false; }
      return true;
    }
    function wheelMisses(n) {                 // a crystal at chest height: the wheel would pass under it
      if (n.gems) for (const i of n.gems) { const it = G.reg.items[i]; if (!it.taken && (it.baseY != null ? it.baseY : it.y) < n.y - 32) return true; }
      return false;
    }
    function flatRun() {                      // rollable route edges straight ahead
      let k = 0;
      for (const e of P.path) { if (!rollable(e) || e.d !== P.path[0].d || wheelMisses(e.to)) break; k++; }
      return k;
    }
    function incoming(s, horizon) {           // an enemy shot that will pass through us soon
      const p = s.player, cx = p.x + p.w / 2, cy = p.y + p.h / 2;
      return s.eshots.some(q => {
        if (q.life <= 0) return false;
        const vx = (q.vx || 0) - p.vx, vy = (q.vy || 0) - p.vy, dx = q.x - cx, dy = q.y - cy;
        const t = Math.max(0, Math.min(horizon, -(dx * vx + dy * vy) / (vx * vx + vy * vy || 1)));
        return t > 0 && Math.hypot(dx + vx * t, dy + vy * t) < 25;
      });
    }
    function laneFoe(s, d, range) {           // a ground trooper in our lane ahead
      const p = s.player, px = p.x + p.w / 2, feet = p.y + p.h;
      return s.enemies.find(e => e.alive && (e.x + e.w / 2 - px) * d > 0 && Math.abs(e.x + e.w / 2 - px) < range && e.y + e.h > feet - 26 && e.y < feet + 2);
    }
    function unroll(inp) {
      if (P.morphCd > 0) return;
      inp.morphPressed = true; P.morphCd = 0.3; P.roll = null; P.lastMorph = P.elapsed;
    }
    // true = the wheel handled this tick (grounded() sits it out)
    function wheel(state, inp) {
      const p = state.player, e = P.path[0];
      const cur = G.at(bodyOf(p));
      const solid = cur && !cur.plat && !cur.wet && !P.blast && !p.inWater;
      const run = solid ? flatRun() : 0, d = e ? e.d : 0;
      const threat = incoming(state, 0.45);
      const bossZone = state.level.bossSpawn && p.x > state.level.bossSpawn.wakeX - 360;
      if (!p.morph) {
        if (!solid || P.morphCd > 0 || bossZone) return false;
        let why = null;
        if (threat && (run >= 2 || !e)) why = 'shield';                                         // shots pass over the wheel
        else if (run >= 3 && laneFoe(state, d, Math.min(150, run * TILE))) why = 'grind';         // roll through, mine the lane
        else if (run >= 4 && P.elapsed - P.lastMorph > 0.6) why = 'cruise';                       // a flat stretch: roll it
        if (!why) return false;
        inp.morphPressed = true; P.morphCd = 0.3; P.roll = { why, t: 0 }; P.safeT = 0; P.rolls++;
        inp.left = inp.right = false;
        return true;
      }
      const R = P.roll || (P.roll = { why: 'cruise', t: 0 });
      R.t += DT; P.safeT = threat ? 0 : P.safeT + DT;
      R.drop = e && e.kind === 'fall' && run ? e.d : 0;
      if (threat) R.why = 'shield';
      else if (R.why === 'shield' && P.safeT > 0.35) R.why = run >= 6 ? 'cruise' : laneFoe(state, d, 150) ? 'grind' : 'done';
      else if (R.why === 'grind' && !laneFoe(state, d, 150) && !laneFoe(state, -d, 40)) R.why = run >= 6 ? 'cruise' : 'done';
      P.intent = R.why === 'shield' ? 'Rolling under incoming fire' : R.why === 'grind' ? 'Rolling assault · mining the lane' : 'Rolling at full speed';
      const need = 2;                                                  // stand up with room to stop before the flat ends
      const keep = R.t < 6 && R.why !== 'done' && (run >= need || (R.why === 'shield' && threat && solid));
      if (!keep) { inp.left = inp.right = false; unroll(inp); return true; }
      if (run < need) { inp.left = inp.right = false; return true; }   // shots still flying: sit tight, rolled up
      return false;                                                     // grounded() steers the walk edges
    }

    // a crawlspace: roll up at the mouth, roll through, stand up clear of the roof
    function crawl(state, inp) {
      const p = state.player;
      if (!P.crawl) { P.crawl = { e: P.path[0], t: 0 }; P.rolls++; }
      const C = P.crawl, e = C.e, c = e.crawl, d = e.d;
      C.t += DT;
      P.intent = 'Rolling through a crawlspace';
      inp.fire = false;
      if (C.t > 5) { P.crawl = null; P.lastNode = null; P.replanT = 0; if (p.morph) unroll(inp); return; }   // knocked about: think again
      const mouth = d > 0 ? c.x0 * TILE : (c.x1 + 1) * TILE;                                   // the roof's near edge
      const out = d > 0 ? p.x >= (c.x1 + 1) * TILE + 1 : p.x + p.w <= c.x0 * TILE - 1;           // wholly past the far edge
      if (!p.morph) {
        if (out) { P.crawl = null; if (P.path[0] === e) P.path.shift(); P.lastNode = null; P.replanT = 0; return; }
        const room = d > 0 ? mouth - (p.x + 16) : p.x - mouth;                                  // the wheel is wider than the trooper
        if (room < 0.5) { inp[d > 0 ? 'left' : 'right'] = true; return; }
        if (room > 24) { inp[d > 0 ? 'right' : 'left'] = true; return; }
        if (P.morphCd <= 0 && p.onGround) { inp.morphPressed = true; P.morphCd = 0.3; P.roll = { why: 'crawl', t: 0 }; P.lastMorph = P.elapsed; }
        return;
      }
      if (!out) { inp[d > 0 ? 'right' : 'left'] = true; return; }
      unroll(inp);                                                                               // waits out the cooldown
    }

    // ---- boss duels: roll under the barrage ---------------------------------
    // ---- weapons, bombs, dodges --------------------------------------------
    function tactics(s, i) {
      const p = s.player, cx = p.x + p.w / 2, cy = p.y + p.h / 2;
      const near = s.enemies.filter(e => e.alive && Math.abs(e.x - cx) < 230 && Math.abs(e.y - cy) < 150);
      let target = near.slice().sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy))[0];
      if (s.boss && s.boss.alive && s.boss.awake && !s.boss.dying) target = s.boss;
      const danger = s.eshots.some(q => {
        const vx = (q.vx || 0) - p.vx, vy = (q.vy || 0) - p.vy, dx = q.x - cx, dy = q.y - cy;
        const t = Math.max(0, Math.min(.45, -(dx * vx + dy * vy) / (vx * vx + vy * vy || 1)));
        return t > 0 && Math.hypot(dx + vx * t, dy + vy * t) < 25;
      });
      if (p.morph) { i.fire = near.length > 0 && Math.floor(P.elapsed * 8) % 2 === 0; return; }
      P.calmT = target ? 0 : (P.calmT || 0) + DT;
      let desired = P.calmT > 1.5 ? 'spread' : (P.lastWeapon || p.weapon);   // keep the gun in hand between targets
      if (P.forceSpread) desired = 'spread';
      else if (target) {
        const tx = target.x + target.w / 2 - cx, ty = target.y + target.h / 2 - cy;
        const obstructed = solidAt(s.level, cx + tx * .5, cy + ty * .5);
        desired = obstructed || (Math.abs(ty) > 35 && Math.abs(tx) > 60) ? 'bounce' : (near.length <= 2 && Math.abs(tx) < 220 ? 'beam' : 'spread');
        if (desired === 'beam' && Math.sign(tx) !== p.facing) desired = 'spread';
        if (near.length) P.intent = desired === 'beam' ? 'Tracking target · arc lance' : desired === 'bounce' ? 'Ricocheting around cover' : 'Suppressing enemies · scatter';
        if (p.weapon === 'beam' && s.level.type !== 'shmup' && !p.inWater) {
          if (Math.sign(tx) !== p.facing || Math.abs(tx) > 230) i.fire = false;
          else {
            const want = Math.atan2(ty, Math.abs(tx)), angle = p.beamAngle || 0;
            // firing the lance, DOWN aims (never crouches) - but only on the ground: DOWN in the air drops through ledges
            i.up = want < angle - .06; i.down = want > angle + .06 && p.onGround;
          }
        }
      } else if (p.weapon === 'beam') i.fire = false;
      // switch with purpose: hold a weapon at least a second unless the vault plug needs the scatter fan
      if (p.weapon !== desired && p.weapons[desired] > 0 && (P.switchCd <= 0 || (P.forceSpread && desired === 'spread'))) {
        i.switchPressed = true; P.switchCd = 1.1; i.fire = false; P.switches++;
      }
      if (target || P.forceSpread) P.lastWeapon = desired;
      if ((danger || near.length >= 3) && p.bombs > 0 && P.bombCd <= 0 && s.freeze <= 0 && (p.energy < 65 || near.length >= 3)) {
        i.bombPressed = true; P.bombCd = 7; P.intent = 'Freezing incoming threats';
      }
      if (p.lines > 0 && P.elapsed > P.lineCd && near.some(e => Math.abs(e.x + e.w / 2 - cx) < 21)) {
        i.linePressed = true; P.lineCd = P.elapsed + 3; P.intent = 'Shockwall · vertical strike';
      }
      if (danger && p.onGround && !p.inWater && P.dodgeCd <= 0 && G && s.level.type !== 'shmup' && !(s.boss && s.boss.awake && s.boss.alive) && !P.held.jump && !i.morphPressed) {
        const d = i.right ? 1 : i.left ? -1 : 0;
        for (const hold of [tk(12), tk(17)]) {
          const r = fly(s.level, bodyOf(p), { jump: true, hold, mv: d, frame: s.frame + 1, wind: true, settle: tk(8) });
          if (r.ok && G.at(r.b)) { P.jumpT = hold; P.air = { mv: d, to: G.at(r.b) }; P.dodgeCd = .6; P.lastNode = null; i.jump = true; P.intent = 'Evading incoming fire'; break; }
        }
      }
    }
    // fill in the edge flags the engine expects from a real pad
    function finish(inp) {
      const prev = P.held;
      inp.jumpPressed = inp.jump && !prev.jump;
      inp.jumpReleased = !inp.jump && prev.jump;
      inp.firePressed = inp.fire && !prev.fire;
      inp.upPressed = inp.up && !prev.up;
      inp.downPressed = inp.down && !prev.down;
      inp.leftPressed = inp.left && !prev.left;
      inp.rightPressed = inp.right && !prev.right;
      P.held = inp;
      return inp;
    }

    // ---- boss duels --------------------------------------------------------
    function duel(state, inp) {
      const p = state.player, b = state.boss;
      const pcx = p.x + p.w / 2, bcx = b.x + b.w / 2;
      const side = bcx > pcx ? 1 : -1;
      const gap = Math.abs(bcx - pcx);
      P.bossT += DT;
      P.intent = b.open ? 'Core exposed · pouring it on' : 'Dueling the guardian';
      const STAND = 150;
      const dash = b.state === 'attack' && b.attack && b.attack.kind === 'dash' && gap < 150;
      const shots = state.eshots.some(q => q.life > 0 && q.kind !== 'wave') && incoming(state, 0.35);
      const cur = G && G.at(bodyOf(p));
      if (p.morph) {
        P.safeT = shots || dash ? 0 : P.safeT + DT;
        P.intent = dash ? 'Rolling through the charge' : 'Rolling under the barrage';
        if (P.safeT > 0.3 || !p.onGround) unroll(inp);
        else if (gap < STAND - 30) inp[side > 0 ? 'left' : 'right'] = true;
        return;
      }
      if ((shots || dash) && p.onGround && !p.inWater && P.morphCd <= 0 && cur && !cur.plat) {
        inp.morphPressed = true; P.morphCd = 0.3; P.safeT = 0; P.rolls++; P.roll = { why: 'shield', t: 0 };
        return;
      }
      inp.fire = true;
      if (gap > STAND + 20) inp[side > 0 ? 'right' : 'left'] = true;
      else if (gap < STAND - 30) inp[side > 0 ? 'left' : 'right'] = true;
      else if (p.facing !== side) inp[side > 0 ? 'right' : 'left'] = true;
      if (b.state === 'attack' && b.attack && b.attack.kind === 'dash' && gap < 140)
        { inp[side > 0 ? 'left' : 'right'] = true; inp[side > 0 ? 'right' : 'left'] = false; }
      if (p.bombs > 0 && P.bombCd <= 0 && state.freeze <= 0 && P.bossT > 1.2) { inp.bombPressed = true; P.bombCd = 6; }
      if (p.onGround && P.dodgeCd <= 0 && !P.held.jump) {
        for (const s of state.eshots) {
          const dx = s.x - pcx, dy = s.y - (p.y + p.h / 2);
          const closing = (s.vx || 0) * -Math.sign(dx || 1) > 0;
          const wave = s.kind === 'wave';
          if (Math.abs(dx) < (wave ? 110 : 76) && Math.abs(dy) < 40 && closing) { P.jumpT = tk(wave ? 17 : 13); P.dodgeCd = 0.42; break; }
        }
      }
      if (P.jumpT > 0) { inp.jump = true; P.jumpT--; }
    }

    // ---- shmup stages (World 3) --------------------------------------------
    // nearest crystal ahead inside the flight gap (measured best of the variants tried)
    function nextCrystal(s, g) {
      return s.pickups.filter(it => !it.taken && it.x > s.player.x && it.x < s.player.x + 190 && it.y > g.top + 24 && it.y < g.bot - 30).sort((a, b) => a.x - b.x)[0];
    }
    function flyShip(state, inp) {
      const p = state.player, lvl = state.level, b = state.boss;
      inp.fire = true;
      const pcy = p.y + p.h / 2;
      const boss = b && b.alive && b.awake && !b.dying;
      const camMax = lvl.cols * TILE - VIEW_W;
      const endRun = state.bossDead && (state.cam.x >= camMax - 4 || lvl.exit.x - (p.x + p.w) < 240);
      if (endRun) inp.right = true;
      else {
        const wantX = state.cam.x + (boss ? 140 : 120);
        if (p.x < wantX - 14) inp.right = true;
        else if (p.x > wantX + 14) inp.left = true;
      }
      const here = tunnelGap(lvl, p.x + p.w / 2);
      let wantY;
      const crate = crateAhead(lvl, p.x + p.w, 140);
      P.intent = 'Threading the rift';
      if (boss) {
        wantY = b.y + b.h / 2; P.intent = 'Strafing the gunship';
        if (b.x - (p.x + p.w) < 90) { inp.left = true; inp.right = false; }
        if (p.bombs > 0 && P.bombCd <= 0 && state.freeze <= 0) { inp.bombPressed = true; P.bombCd = 6; }
      } else if (crate >= 0) {
        const g = tunnelGap(lvl, crate + TILE / 2);
        wantY = Math.min(Math.max(pcy, g.top + 28), g.bot - 28); P.intent = 'Drilling the barrier';
      } else {
        const look = 46 + (lvl.scroll || 70) * 0.55;
        const g = tunnelGap(lvl, p.x + p.w + look);
        wantY = (g.top + g.bot) / 2;
        const crystal = nextCrystal(state, g);
        if (crystal) { wantY = crystal.y + 8; P.intent = 'Sweeping a crystal trail'; }
      }
      for (const s of state.eshots) {
        const dx = s.x - p.x, dy = s.y - pcy;
        if (dx > -12 && dx < 130 && Math.abs(dy) < 26) wantY += dy > 0 ? -36 : 36;
      }
      for (const e of state.enemies) {
        if (!e.alive) continue;
        const dx = (e.x + e.w / 2) - p.x, dy = (e.y + e.h / 2) - pcy;
        if (dx > -10 && dx < 80 && Math.abs(dy) < 24) wantY += dy > 0 ? -28 : 28;
      }
      wantY = Math.max(here.top + p.h / 2 + 5, Math.min(here.bot - p.h / 2 - 5, wantY));
      wantY = Math.max(44, Math.min(lvl.rows * TILE - 30, wantY));
      if (pcy > wantY + 4) inp.up = true;
      else if (pcy < wantY - 4) inp.down = true;
      if (boss) P.bossT += DT;
    }

    return {
      frame, reset, stats: P,
      get deaths() { return P.deaths; },
      get rescues() { return P.rescues; },
    };
  }

  // headless helper: how many crystals the map lets a trooper reach at all
  function reachable(state) {
    if (state.level.type === 'shmup') return state.pickups.filter(it => it.type === 'gem').length;
    const G = new Graph(state), start = G.at(bodyOf(state.player)) || [...G.nodes.values()].find(n => !n.swim);
    const seen = new Set([start]), q = [start], got = new Set();
    while (q.length) {
      const n = q.pop();
      if (n.gems) n.gems.forEach(i => got.add(i));
      for (const e of G.edges(n)) { if (e.gems) e.gems.forEach(i => got.add(i)); if (!seen.has(e.to)) { seen.add(e.to); q.push(e.to); } }
    }
    for (const v of G.vaults) v.gems.forEach(i => got.add(i));       // shootable plugs open these
    return [...got].filter(i => G.reg.items[i].type === 'gem').length;
  }

  return { createPilot, reachable, _Graph: Graph };
});
