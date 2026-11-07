// Solid rock: plays every sector (waves + boss) with the autopilot and checks every tick that no player, rider,
// ember core in flight or Stormhunter is inside a ledge's slab or the rock under it (beyond a small tolerance),
// and that no rider hangs stuck under a rock (in the air, within 1 m of the same spot for 4 s).
//   node scripts/lancewing/rock_check.mjs [runs=3] [profile=demo]
import { SIM, AI, CFG } from './_game.mjs';
const { makeWorld, step, drainEvents, STEP, inRock, dX } = SIM;
const { Autopilot } = AI;
const { SECTORS, TYPICAL_UP, START_LIVES, F, rockDrop } = CFG;
const runs = +(process.argv[2] || 3), profile = process.argv[3] || 'demo', HUNT = +(process.env.LW_HUNT || 0);   // LW_HUNT=4: the Stormhunter comes 4 s into every wave
// how deep a box (feet y, hw, hh) is inside the slab or rock of ledge L
function depth(L, x, y, hw, hh) {
  const adx = Math.abs(dX(L.x, x)), bot = L.y - F.ledgeT;
  if (L.st === 2 || adx >= L.w + hw || y >= L.y - 0.05) return 0;
  const sideIn = L.w + hw - adx;
  if (y + hh > bot) return Math.min(sideIn, y + hh - bot, L.y - y);
  const c = adx <= hw ? 0 : adx - hw;
  return Math.max(0, Math.min(sideIn, y + hh - (bot - rockDrop(L.w, c))));
}
const TOL = 0.06;
let fail = 0;
const worst = { player: 0, rider: 0, core: 0, hunter: 0 }, count = { player: 0, rider: 0, core: 0, hunter: 0 };
let ticks = 0, stuck = 0, bonks = 0, hunterT = 0, hunterTouch = 0;
for (let s = 0; s < SECTORS.length; s++) for (let i = 0; i < runs; i++) for (const coop of [false, true]) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed: 300 + i * 17 + s, up: TYPICAL_UP[s], lives: START_LIVES + 2, coop });
  const ais = W.players.map((p, k) => new Autopilot(W.seed * 31 + k, profile));
  const still = new Map();
  while (!W.over && W.n < 400 / STEP) {
    W.players.forEach((p, k) => { p.input = ais[k].control(W, p); });
    if (HUNT && W.R) W.R.hunt = HUNT;
    step(W, STEP); ticks++;
    for (const e of drainEvents(W)) if (e.k === 'bonk' && e.rock) bonks++;
    const look = (kind, b, hw, hh, fy = 0) => {
      for (const L of W.ledges) {
        if (kind !== 'core' && b.on === L.id) continue;
        const d = depth(L, b.x, b.y + fy, hw, hh);
        if (d > TOL) { count[kind]++; if (d > worst[kind]) { worst[kind] = d; worst[kind + 'At'] = `S${s + 1} seed ${W.seed} t ${W.t.toFixed(2)} ledge ${L.id} (${b.x.toFixed(2)}, ${b.y.toFixed(2)})`; } }
      }
    };
    for (const p of W.players) if (p.alive) look('player', p, F.hw, F.hh);
    for (const r of W.riders) if (r.alive) {
      look('rider', r, F.hw, F.hh);
      if (r.on < 0 && inRock(W, r.x, r.y + 0.3, F.hw, F.hh)) {
        const k = still.get(r.id);
        if (!k || Math.abs(dX(k.x, r.x)) > 1 || Math.abs(k.y - r.y) > 1) still.set(r.id, { x: r.x, y: r.y, t: W.t });
        else if (W.t - k.t > 4) { stuck++; console.log(`  stuck rider ${r.type} S${s + 1} seed ${W.seed} t ${W.t.toFixed(1)} at (${r.x.toFixed(1)}, ${r.y.toFixed(1)})`); still.delete(r.id); }
      } else still.delete(r.id);
    }
    for (const c of W.cores) if (c.on < 0 && c.st !== 'form') look('core', c, 0.4, 0.8, -0.4);
    if (W.hunter) { hunterT++; look('hunter', W.hunter, 0.9, 1.3); if (inRock(W, W.hunter.x, W.hunter.y + 0.05, 0.95, 1.35) || inRock(W, W.hunter.x, W.hunter.y - 0.05, 0.95, 1.35)) hunterTouch++; }
  }
}
for (const k of Object.keys(count)) {
  const ok = worst[k] <= 0.25;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${k}: ${count[k]} ticks deeper than ${TOL} m in rock, deepest ${worst[k].toFixed(3)} m ${worst[k + 'At'] || ''}`);
}
console.log(`${stuck ? 'FAIL' : 'PASS'}  riders stuck under a rock for 4 s: ${stuck}`);
if (stuck) fail++;
console.log(`rock bonks: ${bonks} · ${ticks} ticks · Stormhunter out ${(hunterT * STEP).toFixed(0)} s, touching a ledge ${(hunterTouch * STEP).toFixed(1)} s`);
process.exit(fail ? 1 : 0);
