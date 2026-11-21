// Headless run of STARLING with the autopilot. Usage: node scripts/starling/simtest.mjs [--real] [--waves=12]
import { Sim, bot } from '../../games/2026-11-21/starling/js/sim.js';
const real = process.argv.includes('--real'), waves = +((process.argv.find((a) => a.startsWith('--waves=')) || '--waves=12').slice(8));
const S = new Sim(); S.newGame({ god: !real }); const mem = {}; let ticks = 0, grazes = 0, w = 1, wt0 = 0, maxF = 0, maxB = 0; const log = [];
try {
  while (!S.over && S.wave <= waves && ticks < 60 * 60 * 30) { S.step(bot(S, mem)); ticks++; maxF = Math.max(maxF, S.foes.length); maxB = Math.max(maxB, S.eb.length);
    for (const f of S.fx) { if (f.k === 'graze' || f.k === 'die') grazes++; if (f.k === 'clear') log.push(`wave ${String(w).padStart(2)} ${f.kind.padEnd(6)} ${((ticks - wt0) / 60).toFixed(0).padStart(3)}s hits ${grazes} score ${S.score} lives ${S.lives}${f.kind === 'flight' ? ' flight ' + f.hit + '/40' : ''}`); if (f.k === 'wave') { w = f.n; wt0 = ticks; grazes = 0; } }
    S.fx.length = 0; }
} catch (e) { console.log('ERROR', e.stack.split('\n').slice(0, 4).join(' | ')); }
console.log(log.join('\n')); console.log(`end: wave ${S.wave} over ${S.over} time ${(ticks / 60).toFixed(0)}s score ${S.score} maxFoes ${maxF} maxShots ${maxB} accuracy ${(S.hitsLanded / Math.max(1, S.shotsFired) * 100).toFixed(0)}%`);
