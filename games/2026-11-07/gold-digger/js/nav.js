// Navigation graph for the autopilot and the level validator. Nodes are cells a digger can be in:
//   stand (feet on a floor, plank or ladder top), climb (on a ladder or rope cell), swim (in water).
// Edges: walking, climbing and stepping off ladders are local; every jump and drop is PROBED with the real
// physics (physics.js stepBody) from the node's centre, so the graph says exactly where a jump lands and how
// far it falls. Walls of rubble, boulders and locked gates give "dig" edges the planner can open with the
// pick, dynamite or a key.
import { T, SOLID, PHYS, STEP, PICK_HP } from './config.js?v=10';
import { tileAt, standable, solidT, climbT, makeBody, stepBody, fallHurt } from './physics.js?v=10';

export const K_STAND = 1, K_CLIMB = 2, K_SWIM = 3;
const BREAK = new Set([T.SOFT, T.HARD, T.DOOR, T.CRUMBLE, T.VEIN, T.GEMV, T.FOSSIL]);

export function nodeKind(M, x, y) {
  const t = tileAt(M, x, y);
  if (SOLID[t] || t === T.LAVA || t === T.SPIKES) return 0;   // spikes: jump them, never plan to stand on them
  if (t === T.WATER) return K_SWIM;
  if (t === T.LADDER || t === T.ROPE) return SOLID[tileAt(M, x, y + 1)] && t === T.ROPE ? 0 : K_CLIMB;
  if (standable(M, x, y)) return K_STAND;
  return 0;
}

// probe actions: [name, mx, kind]  kind: 'jump' (jump at once), 'run' (walk, jump at the cell edge), 'off' (walk off), 'up', 'cj' (jump off a ladder)
const PROBES = [['jl', -1, 'jump'], ['jr', 1, 'jump'], ['rl', -1, 'run'], ['rr', 1, 'run'], ['ol', -1, 'off'], ['or', 1, 'off'], ['ju', 0, 'up'], ['hl', -1, 'hop'], ['hr', 1, 'hop'], ['ul', -1, 'upside'], ['ur', 1, 'upside'], ['ll', -1, 'low'], ['lr', 1, 'low']];
const CPROBES = [['cl', -1, 'cj'], ['cr', 1, 'cj']];
export const probeInput = (kind, mx, t, B, x0) => {
  // the input the probe (and the executor) holds at time t after the start
  if (kind === 'jump') return { mx, my: 0, jump: t < 0.45 };
  if (kind === 'hop') return { mx: t < 0.18 ? mx : 0, my: 0, jump: t < 0.12 };
  if (kind === 'up') return { mx: 0, my: 0, jump: t < 0.45 };
  if (kind === 'run') { const past = mx > 0 ? B.x > x0 + 0.42 : B.x < x0 - 0.42; if (past && B.runT === undefined) B.runT = t; return { mx, my: 0, jump: B.runT !== undefined && t - B.runT < 0.45 }; }
  if (kind === 'off') return { mx: t < 0.5 ? mx * 0.5 : 0, my: 0, jump: false };
  if (kind === 'upside') return { mx: t > 0.22 ? mx : 0, my: 0, jump: t < 0.45 };
  if (kind === 'low') return { mx, my: 0, jump: t < 0.07 };   // a flat hop under a low ceiling
  if (kind === 'cj') return { mx, my: 0, jump: t < 0.3 };
  return { mx: 0, my: 0, jump: false };
};

export function buildNav(M) {
  // the exit cage is a floor over its shaft while it waits: build the graph with planks standing in for it
  const cage = M.exit ? [M.exit.x0, M.exit.x0 + 1].map((x) => [x, M.exit.y - 1, M.tiles[(M.exit.y - 1) * M.w + x]]) : [];
  for (const [x, y] of cage) M.tiles[y * M.w + x] = T.PLANK;
  try { return buildNavInner(M); } finally { for (const [x, y, t] of cage) M.tiles[y * M.w + x] = t; }
}
function buildNavInner(M) {
  const W = M.w, H = M.h, N = W * H;
  const kind = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) kind[y * W + x] = nodeKind(M, x, y);
  const edges = new Array(N);
  for (let i = 0; i < N; i++) edges[i] = null;
  const add = (a, b, cost, act, extra) => { if (b < 0 || b >= N || !kind[b] || a === b) return; (edges[a] ||= []).push({ to: b, cost, act, ...extra }); };
  const id = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? -1 : y * W + x;
  const run = PHYS.run;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, k = kind[i];
    if (!k) continue;
    if (k === K_STAND || k === K_CLIMB) {
      // walk sideways onto a neighbour you can stand in (a ladder cell at floor level holds you up)
      for (const d of [-1, 1]) {
        const j = id(x + d, y);
        if (j >= 0 && kind[j] && kind[j] !== K_SWIM) {
          const floorOk = kind[j] === K_STAND || (kind[j] === K_CLIMB && (solidT(M, x + d, y - 1) || tileAt(M, x + d, y - 1) === T.LADDER || tileAt(M, x + d, y - 1) === T.PLANK));
          const fromOk = k === K_STAND || solidT(M, x, y - 1) || tileAt(M, x, y - 1) === T.LADDER || tileAt(M, x, y - 1) === T.PLANK;
          if (floorOk && fromOk && !solidT(M, x + d, y + 1)) add(i, j, 1 / run, k === K_CLIMB ? 'stepoff' : 'walk', { dir: d });
        }
        // dig: a breakable wall in the way (body cells y and y+1), floor beyond
        // (the wall may be a few cells thick; the edge leads to the first cell beyond it)
        if (k === K_STAND) {
          const cells = [];
          let need = 'pick', hp = 0, kk = 1, ok = true;
          for (; kk <= 4; kk++) {
            const xx = x + d * kk, t0 = tileAt(M, xx, y), t1 = tileAt(M, xx, y + 1);
            if (!BREAK.has(t0) && !BREAK.has(t1)) break;
            if ((SOLID[t0] && !BREAK.has(t0)) || (SOLID[t1] && !BREAK.has(t1)) || !(solidT(M, xx, y - 1) || tileAt(M, xx, y - 1) === T.PLANK)) { ok = false; break; }
            for (const [t, yy] of [[t0, y], [t1, y + 1]]) if (BREAK.has(t)) { cells.push([xx, yy]); hp += PICK_HP[t] || 0; if (t === T.DOOR) need = 'key'; else if (t === T.HARD && need !== 'key') need = 'dyn'; }
          }
          const j2 = id(x + d * kk, y);
          if (ok && cells.length && kk <= 4 && j2 >= 0 && kind[j2] === K_STAND)
            (edges[i] ||= []).push({ to: j2, cost: need === 'dyn' ? 8 : need === 'key' ? 1 : 1 + hp * 0.36, act: 'dig', dir: d, need, cells });
        }
      }
    }
    if (k === K_CLIMB) {
      const up = id(x, y + 1), dn = id(x, y - 1);
      if (up >= 0 && kind[up] === K_CLIMB) add(i, up, 1 / PHYS.climb, 'climb', { dir: 1 });
      else if (up >= 0 && kind[up] === K_STAND && tileAt(M, x, y) === T.LADDER) add(i, up, 1 / PHYS.climb, 'climb', { dir: 1 });
      if (dn >= 0 && kind[dn] === K_CLIMB) add(i, dn, 1 / PHYS.climb, 'climb', { dir: -1 });
      // step off sideways onto a floor
      for (const d of [-1, 1]) { const j = id(x + d, y); if (j >= 0 && kind[j] === K_STAND && !(edges[i] || []).some((e) => e.to === j)) add(i, j, 0.4, 'stepoff', { dir: d }); }
      // into the water beside or below
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, -1]]) { const j = id(x + dx, y + dy); if (j >= 0 && kind[j] === K_SWIM) add(i, j, 0.6, 'swim', { dx, dy }); }
    }
    if (k === K_STAND) {
      // climb down from a ladder top
      const dn = id(x, y - 1);
      if (dn >= 0 && kind[dn] === K_CLIMB) add(i, dn, 1 / PHYS.climb, 'climb', { dir: -1 });
      const up = id(x, y + 1);
      if (tileAt(M, x, y) === T.AIR && up >= 0 && kind[up] === K_CLIMB) add(i, up, 1 / PHYS.climb, 'climb', { dir: 1 });
    }
    if (k === K_SWIM) {
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const j = id(x + dx, y + dy); if (j >= 0 && (kind[j] === K_SWIM || kind[j] === K_CLIMB)) add(i, j, 1 / PHYS.swimRun, kind[j] === K_CLIMB ? 'grab' : 'swim', { dx, dy }); }
      // surface: hop out onto a floor beside, or stand up where it is shallow
      if (tileAt(M, x, y + 1) !== T.WATER) {
        for (const d of [-1, 0, 1]) for (const dy of [1, 2]) { const j = id(x + d, y + dy); if (j >= 0 && (kind[j] === K_STAND || (kind[j] === K_CLIMB && d !== 0))) add(i, j, 0.8, 'hop', { dir: d, grab: kind[j] === K_CLIMB }); }
      }
    }
  }
  // probes (jumps and drops), shared body to keep garbage low
  const probe = (x, y, k) => {
    const out = [];
    for (const [name, mx, pk] of (k === K_CLIMB ? CPROBES : PROBES)) {
      if ((pk === 'off') && kind[id(x + mx, y)] === K_STAND) continue;   // walking there is a plain walk
      if ((pk === 'off' || pk === 'run') && solidT(M, x + mx, y)) continue;
      const B = makeBody(x + 0.5, y);
      if (k === K_CLIMB) { B.state = 'climb'; B.climbX = x + 0.5; B.ground = false; }
      let t = 0, res = null, spikes = false;
      const x0 = x + 0.5;
      for (let s = 0; s < 360; s++) {
        const inp = probeInput(pk, mx, t, B, x0);
        stepBody(M, B, inp, STEP, null);
        t += STEP;
        const cx = Math.floor(B.x), cy = Math.floor(B.y + 0.01);
        if (tileAt(M, cx, cy) === T.SPIKES) spikes = true;
        if (tileAt(M, cx, Math.floor(B.y + 0.3)) === T.LAVA) { res = null; break; }
        if (B.inWater && s > 2) { res = { x: cx, y: Math.floor(B.y + 0.6), k: K_SWIM, fall: 0 }; break; }
        if (B.ground && s > 2 && Math.abs(B.vx) < 0.4 + (pk === 'off' ? 3 : 0)) {
          const ny = Math.round(B.y);
          res = { x: cx, y: ny, fall: B.peakY - B.y, k: kind[id(cx, ny)] };
          // fall was measured on landing; stepBody records it in landed
          break;
        }
        if (B.ground && s > 2 && B.landed) { res = { x: cx, y: Math.round(B.y), fall: B.landed, k: kind[id(cx, Math.round(B.y))] }; break; }
      }
      if (!res || !res.k) continue;
      const j = id(res.x, res.y);
      if (j === y * W + x) continue;
      out.push({ to: j, cost: t + 0.25, act: 'probe', p: name, mx, pk, fall: Math.max(0, res.fall), spikes });
    }
    return out;
  };
  // falls are recorded from the probe's own peak tracking
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, k = kind[i];
    if (k !== K_STAND && k !== K_CLIMB) continue;
    if (k === K_CLIMB && tileAt(M, x, y) === T.ROPE && !climbT(M, x, y)) continue;
    for (const e of probe(x, y, k)) {
      // drop duplicates that land where a cheaper local edge already goes
      const list = (edges[i] ||= []);
      const dup = list.find((f) => f.to === e.to);
      if (dup && dup.cost <= e.cost && !dup.fall) continue;
      list.push(e);
    }
  }
  return { W, H, kind, edges };
}

// --------------------------------------------------------------- search
// Dijkstra from `from` (node index); opts.cost(e) may add penalties or return Infinity to forbid an edge.
export function search(nav, from, opts = {}) {
  const N = nav.W * nav.H;
  const dist = opts.dist || new Float64Array(N);
  dist.fill(Infinity);
  const prev = opts.prev || new Int32Array(N);
  const prevE = opts.prevE || new Array(N);
  prev.fill(-1);
  dist[from] = 0;
  // binary heap of [d, i]
  const hd = [], hi = [];
  const push = (d, i) => { hd.push(d); hi.push(i); let k = hd.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (hd[p] <= hd[k]) break; [hd[p], hd[k]] = [hd[k], hd[p]]; [hi[p], hi[k]] = [hi[k], hi[p]]; k = p; } };
  const pop = () => { const d = hd[0], i = hi[0]; const ld = hd.pop(), li = hi.pop(); if (hd.length) { hd[0] = ld; hi[0] = li; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let m = k; if (l < hd.length && hd[l] < hd[m]) m = l; if (r < hd.length && hd[r] < hd[m]) m = r; if (m === k) break; [hd[m], hd[k]] = [hd[k], hd[m]]; [hi[m], hi[k]] = [hi[k], hi[m]]; k = m; } } return [d, i]; };
  push(0, from);
  const stopAt = opts.stopAt;
  while (hd.length) {
    const [d, i] = pop();
    if (d > dist[i]) continue;
    if (stopAt && stopAt(i)) return { dist, prev, prevE, found: i };
    const es = nav.edges[i];
    if (!es) continue;
    for (const e of es) {
      const c = opts.cost ? opts.cost(e, i) : e.cost;
      if (!(c < Infinity)) continue;
      const nd = d + c;
      if (nd < dist[e.to]) { dist[e.to] = nd; prev[e.to] = i; prevE[e.to] = e; push(nd, e.to); }
    }
  }
  return { dist, prev, prevE, found: -1 };
}
export function pathTo(res, to) {
  const out = [];
  let i = to;
  while (i >= 0 && res.prev[i] >= 0) { out.push({ ...res.prevE[i], from: res.prev[i] }); i = res.prev[i]; }
  return out.reverse();
}
// node index for a body position (feet), searching the cells around it
export function nodeAt(nav, M, x, y) {
  const cx = Math.floor(x), cy = Math.floor(y + 0.02);
  for (const [dx, dy] of [[0, 0], [0, 1], [0, -1], [-1, 0], [1, 0], [0, 2]]) {
    const xx = cx + dx, yy = cy + dy;
    if (xx < 0 || yy < 0 || xx >= nav.W || yy >= nav.H) continue;
    if (nav.kind[yy * nav.W + xx]) return yy * nav.W + xx;
  }
  return -1;
}
// is `to` reachable from `from` with the given tools? (level validation)
export function reachable(nav, from, to, tools = { pick: true, dyn: true, key: true, hurt: 0 }) {
  const r = search(nav, from, { cost: (e) => {
    if (e.act === 'dig' && !tools[e.need]) return Infinity;
    if (e.fall && fallHurt(e.fall) > (tools.hurt || 0)) return Infinity;
    return e.cost;
  }, stopAt: (i) => i === to });
  return r.found === to;
}

// A level is good when, from the start and without taking fall damage, the digger can reach the exit, every
// camp, every key (without using a key), and every find (fossils: a cell beside the seam).
export function validateLevel(M) {
  const nav = buildNav(M);
  const from = nodeAt(nav, M, M.start.x, M.start.y);
  if (from < 0) return false;
  const r = search(nav, from, { cost: (e) => (e.act === 'dig' && e.need === 'key') || (e.fall && fallHurt(e.fall) > 0) ? Infinity : e.cost });
  const rk = search(nav, from, { cost: (e) => (e.fall && fallHurt(e.fall) > 0) ? Infinity : e.cost });
  const ok = (res, x, y) => { const n = nodeAt(nav, M, x, y); return n >= 0 && res.dist[n] < Infinity; };
  const near = (res, x, y) => [[-1, 0], [1, 0], [0, 1], [-1, -1], [1, -1]].some(([dx, dy]) => { const xx = Math.floor(x) + dx, yy = Math.floor(y) + dy; const i = yy * M.w + xx; return xx >= 0 && yy >= 0 && xx < M.w && yy < M.h && nav.kind[i] && res.dist[i] < Infinity; });
  if (M.exit && !ok(rk, M.exit.x - 0.5, M.exit.y) && !ok(rk, M.exit.x + 0.5, M.exit.y)) return false;
  for (const c of M.camps) if (!ok(rk, c.x, c.y)) return false;
  for (const k of M.spawns.keys) if (!ok(r, k.x, k.y)) return false;
  for (const f of M.finds) {
    if (f.kind === 'fossil') { if (!near(rk, f.x, f.y)) return false; }
    else if (f.kind === 'cache') { if (!ok(rk, f.x, f.y + 1)) return false; }
    else if (!ok(rk, f.x, f.y)) return false;
  }
  // traps: every place you can reach (non-lethal falls allowed) must still lead to the exit
  if (M.exit) {
    const rev = new Array(nav.W * nav.H);
    for (let i = 0; i < nav.edges.length; i++) { const es = nav.edges[i]; if (!es) continue; for (const e of es) { if (e.fall && fallHurt(e.fall) >= 99) continue; (rev[e.to] ||= []).push(i); } }
    const ex = [nodeAt(nav, M, M.exit.x - 0.5, M.exit.y), nodeAt(nav, M, M.exit.x + 0.5, M.exit.y)].filter((i) => i >= 0);
    const back = new Uint8Array(nav.W * nav.H), q = [...ex];
    for (const i of ex) back[i] = 1;
    while (q.length) { const i = q.pop(); for (const j of rev[i] || []) if (!back[j]) { back[j] = 1; q.push(j); } }
    const fwd = search(nav, from, { cost: (e) => (e.fall && fallHurt(e.fall) >= 99) ? Infinity : e.cost });
    for (let i = 0; i < fwd.dist.length; i++) if (fwd.dist[i] < Infinity && !back[i] && nav.kind[i] !== K_SWIM) return false;
  }
  M.navCache = null;
  return true;
}
