// Where does the autopilot die? Usage: node scripts/understorm/deaths.mjs <stage> <cp> [n]
import { STAGES } from '../../games/2026-11-20/understorm/js/stages.js';
import { Sim } from '../../games/2026-11-20/understorm/js/sim.js';
import { botInput } from '../../games/2026-11-20/understorm/js/bot.js';
const i = +process.argv[2] - 1, cp = +process.argv[3], n = +(process.argv[4] || 5);
const S = new Sim(STAGES); S.newGame({ stage: i, cp, practice: 'stage' }); S.restore(false);
let mem = {}, d = 0, ticks = 0;
console.log('cps', STAGES[i].cps.map((t) => t.toFixed(1)).join(' '), 'end', STAGES[i].endT.toFixed(1));
while (d < n && ticks < 60 * 200 && S.si === i && !S.over) { S.step(botInput(S, mem)); ticks++; for (const f of S.fx) if (f.k === 'die') { d++; console.log(`die ${f.why} t=${S.t.toFixed(2)} gt=${S.gt.toFixed(2)} x=${f.x.toFixed(1)} y=${f.y.toFixed(1)} floor=${S.floor(f.x).toFixed(1)} ceil=${S.ceil(f.x).toFixed(1)} flood=${S.flood} blocks=${S.ab.filter((b) => Math.abs(b.cx - S.scroll - f.x) < 4).map((b) => `${b.k}@${(b.cx - S.scroll).toFixed(1)},${b.cy.toFixed(1)} ${b.w}x${b.h}`).join(' | ')} vents=${S.vents.filter((v) => Math.abs(v.x - S.scroll - f.x) < 3).map((v) => (v.x - S.scroll).toFixed(1)).join(',')}`); } S.fx.length = 0; }
console.log('end t', S.t.toFixed(1), 'cp', S.cp, 'boss', S.boss ? S.boss.hp.toFixed(0) : '-');
