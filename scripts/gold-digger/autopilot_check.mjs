// The demo autopilot plays the whole campaign the way the AI PLAYTHROUGH does (store purchases between depths,
// retries a level on game over) and must reach the later depths. Reports levels cleared, finds and time.
//   node scripts/gold-digger/autopilot_check.mjs [maxMinutes=90]
import { CFG, SIM, AI } from './_game.mjs';
const maxT = +(process.argv[2] || 90) * 60;
let carry = { up: {} }, purse = 0, simT = 0, finds = 0, retries = 0;
const order = ['lamp', 'heart', 'boots', 'pick', 'satchel', 'helmet', 'pouch', 'lamp', 'heart', 'pick', 'boots', 'lamp'];
const t0 = Date.now();
let d = 0, l = 0, reachedBoss5 = false, won = false;
while (simT < maxT && !won) {
  const W = SIM.makeWorld({ seed: 4242 + d * 10 + l + retries * 1000, depth: d, level: l, carry });
  const ap = new AI.Autopilot('demo', d * 7 + l + retries);
  while (!W.clear && !W.over && W.t < 900) { W.players[0].input = ap.control(W); SIM.step(W); for (const e of SIM.drainEvents(W)) { if (e.k === 'gold' || e.k === 'gem' || e.k === 'chest') purse += e.v || 0; if (e.k === 'find' && e.kind !== 'creature') finds++; } }
  simT += W.t;
  console.log(`D${d + 1} ${l === 3 ? 'GUARDIAN' : 'L' + (l + 1)}: ${W.clear ? 'clear' : W.over ? 'game over (retry)' : 'timeout (retry)'} in ${W.t.toFixed(0)} s, score ${W.score}, finds ${W.stats.finds}`);
  if (!W.clear) { retries++; carry = { up: carry.up }; if (retries > 12) break; continue; }
  carry = SIM.carryOut(W);
  if (d === 4 && l === 3) { won = true; break; }
  if (l === 3) {
    for (const k of order) { const u = CFG.UPGRADES.find((x) => x.key === k); const lv = carry.up[k] || 0; if (lv < u.max && purse >= u.cost[lv]) { purse -= u.cost[lv]; carry.up = { ...carry.up, [k]: lv + 1 }; if (k === 'satchel') carry.dyn += 2; if (k === 'pouch') carry.flares += 2; if (k === 'heart') carry.hp++; } }
    d++; l = 0; carry.oil = 999;
  } else l++;
  if (d === 4 && l === 3) reachedBoss5 = true;
}
console.log(`${won || reachedBoss5 ? 'PASS' : d >= 3 ? 'PASS (reached depth ' + (d + 1) + ')' : 'FAIL'} autopilot_check: reached D${d + 1}${won ? ' and beat the Molten Heart' : ''}, ${finds} finds, ${retries} retries, ${(simT / 60).toFixed(0)} game minutes, ${((Date.now() - t0) / 1000).toFixed(0)} s cpu, upgrades ${JSON.stringify(carry.up)}`);
