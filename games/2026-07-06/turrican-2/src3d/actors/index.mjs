// Shard Assault actor kit: hero, fighter, 23 enemy skins (+ fallbacks), 6 bosses,
// pickups and the morph mine. See README notes at the bottom of this file.
import * as THREE from 'three';
import { makeMaterials, instantiate, disposeInstance, setDetail } from './lib.mjs';
import { buildHero, heroAnimator, buildFighter, fighterAnimator, MUZZLE_LOCAL } from './hero.mjs';
import { ENEMY_SKINS, skinFor } from './enemies.mjs';
import { BOSS_MODELS } from './bosses.mjs';
import { buildPickup, pickupAnimator, buildMine, mineAnimator, PICKUP_TYPES } from './pickups.mjs';

export { PICKUP_TYPES };
export const ENEMY_SKIN_LIST = Object.keys(ENEMY_SKINS);
export const BOSS_KEYS = Object.keys(BOSS_MODELS);

export function createActorKit(ctx = {}) {
  const quality = ctx.quality || 'high';
  const detail = quality === 'low' ? 0.6 : quality === 'ultra' ? 1.25 : 1;
  const mats = makeMaterials(quality, ctx.renderer || null);
  const cache = new Map();
  const tpl = (key, fn) => {
    let t = cache.get(key);
    if (!t) { setDetail(detail); t = fn(); cache.set(key, t); }
    return t;
  };
  const wrap = (inst, anim, extra = {}) => {
    const root = new THREE.Group();
    root.add(inst.group);
    let alive = true;
    return Object.assign({
      root,
      update: anim.update,
      dispose() { if (!alive) return; alive = false; root.remove(inst.group); disposeInstance(inst); },
      _inst: inst, _anim: anim,
    }, extra);
  };

  const kit = {
    quality,
    hero() {
      const inst = instantiate(tpl('hero', buildHero), mats);
      const anim = heroAnimator(inst, mats);
      const actor = wrap(inst, anim);
      actor.muzzle = anim.muzzle; // root-local muzzle point, refreshed every update()
      actor.getMuzzle = (out = new THREE.Vector3()) => { actor.root.updateWorldMatrix(true, false); return out.copy(anim.muzzle).applyMatrix4(actor.root.matrixWorld); };
      return actor;
    },
    fighter() {
      const inst = instantiate(tpl('fighter', buildFighter), mats);
      return wrap(inst, fighterAnimator(inst));
    },
    enemy(e) {
      const skin = skinFor(e);
      const def = ENEMY_SKINS[skin];
      const inst = instantiate(tpl('enemy:' + skin, def.build), mats);
      const anim = def.animator(inst, e);
      return wrap(inst, anim, { skin });
    },
    boss(b) {
      const def = BOSS_MODELS[b.key] || BOSS_MODELS.warden;
      const inst = instantiate(tpl('boss:' + (BOSS_MODELS[b.key] ? b.key : 'warden'), def.build), mats);
      return wrap(inst, def.animator(inst, b));
    },
    pickup(type) {
      const key = PICKUP_TYPES.includes(type) ? type : 'gem';
      const inst = instantiate(tpl('pickup:' + key, () => buildPickup(key)), mats, { shadow: true });
      return wrap(inst, pickupAnimator(inst, key));
    },
    mine() {
      const inst = instantiate(tpl('mine', buildMine), mats);
      return wrap(inst, mineAnimator(inst));
    },
    // Pre-build every template and compile every shader variant (call once at load,
    // with the real scene so lights/fog/shadows match the live program keys).
    warm(renderer, scene, camera) {
      const holder = new THREE.Group(); holder.name = 'actor-warm';
      const made = [kit.hero(), kit.fighter(), kit.mine()];
      for (const skin of ENEMY_SKIN_LIST) made.push(kit.enemy({ skin, type: ENEMY_SKINS[skin].type }));
      for (const k of BOSS_KEYS) made.push(kit.boss({ key: k }));
      for (const p of PICKUP_TYPES) made.push(kit.pickup(p));
      made.forEach((a, i) => { a.root.position.set((i % 8) * 40, -Math.floor(i / 8) * 40, 0); holder.add(a.root); });
      if (scene && renderer && camera) {
        scene.add(holder);
        try { renderer.compile(scene, camera); } finally { scene.remove(holder); }
      }
      for (const a of made) a.dispose();
      return made.length;
    },
    stats() { let tris = 0; for (const [k, t] of cache) tris += t.tris; return { templates: cache.size, tris }; },
    dispose() {
      for (const t of cache.values()) for (const m of t.meshes) m.geometry.dispose();
      cache.clear(); mats.dispose();
    },
    _mats: mats, _cache: cache,
  };
  return kit;
}
