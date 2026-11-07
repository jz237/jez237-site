// Loads the game's modules at the version the page uses (the ?v=N on main.js), so every script shares ONE
// instance of each module with the game's own imports (config.js?v=1 and config.js?v=2 would be two different
// modules in Node, and a setting changed in one would not reach the other).
//   import { SIM, AI, CFG, REP, ONL, V, GAME } from './_game.mjs';
import fs from 'fs';

export const GAME = new URL('../../games/2026-11-06/lancewing/', import.meta.url);
const JS = new URL('js/', GAME);
export const V = (fs.readFileSync(new URL('main.js', JS), 'utf8').match(/\.js\?v=(\d+)/) || [0, '1'])[1];
const imp = (name) => import(new URL(`${name}.js?v=${V}`, JS).href);
export const [SIM, AI, CFG, REP] = await Promise.all(['sim', 'ai', 'config', 'replay'].map(imp));
// online.js touches browser globals only when a connection opens; Node 22+ has WebSocket, fetch and crypto
export const ONL = await imp('online');
