// A competent little gardener: coverage-scored placements weighted toward
// the late path, synergy-aware build order, steady upgrades. Drives the
// title-screen attract demo (and mirrors tools/balance.js).

import { TOWERS } from './content.js';

const BUILD = ['coral', 'spire', 'bramble', 'bloom', 'tesla', 'coral', 'urchin', 'bulb',
  'tesla', 'bloom', 'spire', 'coral', 'bramble', 'urchin'];

function scoreSpots(sim) {
  const spots = [];
  for (let x = 80; x < 1920 - 80; x += 60) {
    for (let y = 80; y < 1080 - 60; y += 60) {
      if (!sim.canPlace(x, y)) continue;
      let score = 0;
      for (const path of sim.paths) {
        for (let i = 0; i < path.pts.length; i += 8) {
          const dx = path.pts[i][0] - x, dy = path.pts[i][1] - y;
          if (dx * dx + dy * dy < 300 * 300) score += 1 + 1.2 * (path.arc[i] / path.total);
        }
      }
      spots.push({ x, y, score });
    }
  }
  spots.sort((a, b) => b.score - a.score);
  return spots;
}

export function botStep(sim) {
  if (!sim.__botSpots) sim.__botSpots = scoreSpots(sim);
  const nextType = BUILD[Math.min(sim.towers.length, BUILD.length - 1)];
  const cost = TOWERS[nextType].cost;
  const buffer = sim.towers.length < 3 ? 0 : 60;
  if (sim.gold >= cost + buffer && sim.towers.length < 18) {
    for (const sp of sim.__botSpots) {
      if (sim.canPlace(sp.x, sp.y) && sim.place(nextType, sp.x, sp.y)) break;
    }
  }
  if (sim.gold > 260) {
    let best = null, bestCost = 1e9;
    for (const t of sim.towers) {
      const lv = t.def.levels[t.level + 1];
      if (lv && lv.cost < bestCost && sim.gold >= lv.cost + 120) { best = t; bestCost = lv.cost; }
    }
    if (best) sim.upgrade(best);
  }
  // fuse when flush: apexes are the endgame
  if (sim.gold > 450 && sim.fuse) {
    for (const t of sim.towers) {
      if (sim.canFuse(t)) { sim.fuse(t); break; }
    }
  }
}
