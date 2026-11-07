// Loads the game's modules at the version the page uses (the ?v=N on main.js, or 1 before main.js exists), so
// every script shares ONE instance of each module with the game's own imports.
import fs from 'fs';
export const GAME = new URL('../../games/2026-11-07/shock-horror/', import.meta.url);
const JS = new URL('js/', GAME);
let v = '1';
try { v = (fs.readFileSync(new URL('main.js', JS), 'utf8').match(/\.js\?v=(\d+)/) || [0, '1'])[1]; } catch { /* no main yet */ }
export const V = v;
const imp = (name) => import(new URL(`${name}.js?v=${V}`, JS).href);
export const [CFG, GEN, NAV, PHY, SIM, AI, REP] = await Promise.all(['config', 'levelgen', 'nav', 'physics', 'sim', 'ai', 'replay'].map((n) => imp(n).catch(() => null)));
export const load = imp;

// play one level (or boss lair) with an autopilot; returns the outcome
export function playLevel(o) {
  const W = SIM.makeWorld(o);
  const ap = new AI.Autopilot(o.profile || 'human', (o.seed || 1) * 13 + (o.depth || 0));
  const maxT = o.maxT || 600;
  const deaths = [];
  const startLives = W.lives;
  while (!W.clear && !W.over && W.t < maxT) {
    W.players[0].input = ap.control(W);
    SIM.step(W);
    for (const e of SIM.drainEvents(W)) if (e.k === 'death') deaths.push(e.cause);
  }
  return { W, clear: W.clear, over: W.over, t: W.t, deaths, hits: W.stats.hits, livesLost: startLives - W.lives, score: W.score, finds: W.stats.finds, seen: W.openCells ? W.stats.seen / W.openCells : 0 };
}
