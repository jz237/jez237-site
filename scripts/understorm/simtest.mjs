// Headless run of every UNDERSTORM stage with the autopilot. Usage: node scripts/understorm/simtest.mjs [stage] [--real]
import { STAGES } from '../../games/2026-11-20/understorm/js/stages.js';
import { Sim } from '../../games/2026-11-20/understorm/js/sim.js';
import { botInput } from '../../games/2026-11-20/understorm/js/bot.js';
const only = process.argv[2] && !process.argv[2].startsWith('--') ? +process.argv[2] : null;
const real = process.argv.includes('--real');
const diff = (process.argv.find((a) => a.startsWith('--diff=')) || '--diff=normal').slice(7);
for (let i = 0; i < STAGES.length; i++) {
  if (only !== null && only !== i + 1) continue;
  const S = new Sim(STAGES); S.newGame({ stage: i, god: !real, practice: 'stage', diff, loadout: real ? null : { core: 1 + (i % 3), lvl: 2 } });
  const mem = {}, why = {}, cpHits = {}; let ticks = 0, bossT0 = 0, bossT = 0, maxB = 0, maxE = 0, err = null, stuck = 0, lastHits = 0;
  try {
    while (!S.over && S.si === i && ticks < 60 * 420) {
      S.step(botInput(S, mem)); ticks++;
      if (S.boss && !bossT0) bossT0 = ticks; if (bossT0 && !S.boss && !bossT) bossT = ticks - bossT0;
      maxB = Math.max(maxB, S.eb.length); maxE = Math.max(maxE, S.en.length);
      for (const f of S.fx) { if (f.k === 'hitp' || f.k === 'die') { why[f.why] = (why[f.why] || 0) + 1; cpHits[S.cp] = (cpHits[S.cp] || 0) + 1; } }
      S.fx.length = 0;
    }
  } catch (e) { err = e.stack.split('\n').slice(0, 4).join(' | '); }
  const done = S.over && !err && ticks < 60 * 420;
  console.log(`${String(i + 1).padStart(2)} ${STAGES[i].name.padEnd(20)} ${done ? 'CLEAR' : err ? 'ERROR' : 'STUCK'} ${(ticks / 60).toFixed(0).padStart(4)}s boss ${(bossT / 60).toFixed(0).padStart(3)}s ${real ? 'deaths ' + S.deaths : 'hits ' + S.hits} cp ${JSON.stringify(cpHits)} why ${JSON.stringify(why)} maxB ${maxB} maxE ${maxE} score ${S.score}${err ? '\n   ' + err : ''}${done ? '' : ` t=${S.t.toFixed(1)} end=${STAGES[i].endT.toFixed(1)} boss=${S.boss ? S.boss.boss + ' hp ' + S.boss.hp.toFixed(0) : '-'}`}`);
}
