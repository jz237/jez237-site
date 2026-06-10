// localStorage persistence: wallet, upgrades, journal, dug tiles, position.

import { SAVE_KEY } from './config.js';
import { world } from './world.js';
import { state } from './ui.js';

export function save(player) {
  try {
    const mod = [];
    for (const [i, t] of world.modified) mod.push(i, t);
    const data = {
      v: 1,
      wallet: state.wallet,
      journal: state.journal,
      stats: state.stats,
      upgrades: player.upgrades,
      bag: player.bag,
      energy: player.energy,
      pos: [Math.round(player.x), Math.round(player.y)],
      mod,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) { /* storage full / private mode — play on without saving */ }
}

export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

export function applySave(data, player) {
  state.wallet = data.wallet || 0;
  state.journal = data.journal || {};
  state.stats = data.stats || { dug: 0, banked: 0 };
  player.upgrades = Object.assign({ pick: 0, lantern: 0, satchel: 0 }, data.upgrades);
  player.bag = data.bag || [];
  player.energy = data.energy ?? player.energyMax;
  world.modified.clear();
  const mod = data.mod || [];
  for (let i = 0; i < mod.length; i += 2) world.modified.set(mod[i], mod[i + 1]);
  if (data.pos) { player.x = data.pos[0]; player.y = data.pos[1]; }
}

export function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
}
