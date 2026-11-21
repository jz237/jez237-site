// What does the autopilot do with the Anchor? Usage: node scripts/understorm/aicheck.mjs
import { STAGES } from '../../games/2026-11-20/understorm/js/stages.js';
import { Sim } from '../../games/2026-11-20/understorm/js/sim.js';
import { botInput } from '../../games/2026-11-20/understorm/js/bot.js';
for (let i = 0; i < STAGES.length; i++) {
  const S = new Sim(STAGES); S.newGame({ stage: i, practice: 'stage', loadout: { core: 1, lvl: 1 } });
  const mem = {}, n = { swap: 0, launch: 0, rearTicks: 0, outTicks: 0, tether: 0 }; let ticks = 0;
  while (!S.over && S.si === i && ticks < 60 * 420) { S.step(botInput(S, mem)); ticks++; if (S.a.st === 2) n.rearTicks++; if (S.a.st >= 3) n.outTicks++; for (const f of S.fx) { if (f.k === 'swap') n.swap++; if (f.k === 'launch') n.launch++; } S.fx.length = 0; }
  console.log(`${String(i + 1).padStart(2)} ${STAGES[i].name.padEnd(20)} deaths ${S.deaths} throws ${n.launch} swaps ${n.swap} astern ${(n.rearTicks / 60).toFixed(0)}s out ${(n.outTicks / 60).toFixed(0)}s tetherKills ${S.tetherKills} bestChain x${S.maxChain}`);
}
