// Boss registry. Each boss: build() -> template, animator(inst, b) -> { update(b, s, dt, t) }.
import { BOSSES_A } from './bosses-a.mjs';
import { BOSSES_B } from './bosses-b.mjs';
import { bossSignals } from './bkit.mjs';

const DEFS = Object.assign({}, BOSSES_A, BOSSES_B);
function makeAnimator(def) {
  return (inst, b) => {
    const st = { time: 0, yaw: -Math.PI, dir: -1, sT: 0 };
    return {
      st,
      update(bb, s, dt) {
        bb = bb || {}; s = s || {};
        const adt = bossSignals(st, bb, s, dt || 0, inst);
        def.pose(inst.bones, st, bb, s, adt, inst);
        inst.fx.apply(st.flash, st.frost);
      },
    };
  };
}
export const BOSS_MODELS = {};
for (const [k, d] of Object.entries(DEFS)) BOSS_MODELS[k] = { build: d.build, animator: makeAnimator(d) };
