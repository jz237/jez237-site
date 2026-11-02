// Enemy registry: one model per roster skin (+ 'shardling' fallback flyer).
import { SKINS_A } from './skins-a.mjs';
import { SKINS_B } from './skins-b.mjs';
import { common, finish, TAU } from './ekit.mjs';

const DEFS = Object.assign({}, SKINS_A, SKINS_B);
// fallbacks for skin-less spawns (null skin) by archetype
const FALLBACK = { turret: 'walltur', walker: 'beltdrone', flyer: 'shardling', hopper: 'rockmite', spawner: 'armhub', drifter: 'seeker', eel: 'eel', spinner: 'boltspin', egg: 'eggpod', hugger: 'hugger' };

function makeAnimator(def) {
  return (inst, e) => {
    const st = { time: Math.random() * 4, yaw: (e && e.facing > 0) ? 0 : -Math.PI, phase: Math.random() * TAU, pitch: 0, flash: 0, frost: 0 };
    return {
      st,
      update(en, s, dt) {
        en = en || {}; s = s || {};
        const adt = common(st, inst, en, s, dt || 0);
        def.pose(inst.bones, st, en, s, adt, inst);
        finish(st, inst);
      },
    };
  };
}

export const ENEMY_SKINS = {};
for (const [k, d] of Object.entries(DEFS)) ENEMY_SKINS[k] = { type: d.type, build: d.build, animator: makeAnimator(d) };

export function skinFor(e) {
  if (e && e.skin && ENEMY_SKINS[e.skin]) return e.skin;
  return FALLBACK[(e && e.type) || 'walker'] || 'beltdrone';
}
