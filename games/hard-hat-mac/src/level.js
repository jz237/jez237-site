// Builds a playable level from a LEVELS entry: geometry, hazards, objects, lights, nav grid.
import * as THREE from 'three';
import { Builder } from './builder.js';
import { LEVELS } from './levels.js';
import { makeMover, makeHazard, Molten } from './hazards.js';
import { Objects } from './objects.js';
import { NavGrid } from './enemies.js';

export function buildLevel(index, M, quality) {
  const B = new Builder(M);
  B.citySeed = 1000 + index * 77;
  LEVELS[index](B);
  B.finish();
  const ctx = { world: B.world, M, group: B.group, B };
  const L = {
    index, name: B.name, time: B.time, brief: B.brief, sky: B.sky, music: B.music, amb: B.amb, voice: B.voice, timeLimit: B.timeLimit,
    spawn: B.spawn, camYaw: B.camYaw || 0, killY: B.killY, bounds: B.bounds, high: !!B.high, indoor: !!B.indoor, tower: B.tower, citySeed: B.citySeed,
    group: B.group, world: B.world, ladders: B.ladders, lamps: B.lamps, belts: B.belts || [], cranes: B.cranes || [], spinners: B.spinners || [],
    enemyDefs: B.enemies, objectiveType: B.objective.type,
  };
  L.movers = B.movers.map(d => makeMover(d, ctx)).filter(Boolean);
  L.hazards = B.hazards.map(d => makeHazard(d, ctx)).filter(Boolean);
  const molten = L.hazards.find(h => h instanceof Molten);
  if (molten) L.molten = { contains: p => p.x > molten.d.x0 && p.x < molten.d.x1 && p.z > molten.d.z0 && p.z < molten.d.z1 && p.y < molten.d.y + .4 };
  L.objects = new Objects(B, ctx);
  // a few real lights from the lamp posts (fixed count per level so shaders compile once)
  const maxLamps = [0, 3, 6, 8][quality] ?? 4;
  L.lampLights = [];
  if (B.sky !== 'morning' && maxLamps) {
    const sorted = [...B.lamps].sort((a, b) => a.pos.length() - b.pos.length()).slice(0, B.indoor ? maxLamps + 2 : maxLamps);
    for (const lp of sorted) {
      const l = new THREE.PointLight(lp.color, B.indoor ? 95 : B.sky === 'night' ? 60 : 30, B.indoor ? 28 : 22, 1.5);
      l.position.copy(lp.pos); B.group.add(l); L.lampLights.push(l);
    }
  }
  const [x0, z0, x1, z1] = B.bounds;
  const avoid = molten ? [{ x0: molten.d.x0 - .5, z0: molten.d.z0 - .5, x1: molten.d.x1 + .5, z1: molten.d.z1 + .5 }] : [];
  L.nav = new NavGrid(B.world, [x0 - 1, z0 - 1, x1 + 1, z1 + 1], B.ladders, { avoid });
  // the crane magnet is the only way onto the silo in the Crane Yard (demo bot route)
  for (const m of L.movers) if (m.constructor.name === 'CraneMagnet') {
    const d = m.d, bx = d.cx + Math.cos(d.aB) * d.R, bz = d.cz + Math.sin(d.aB) * d.R, ax = d.cx + Math.cos(d.aA) * d.R, az = d.cz + Math.sin(d.aA) * d.R;
    L.nav.addRide({ x: ax, y: 0, z: az + d.size / 2 + 1.7 }, { x: bx - d.size / 2 - .35, y: d.yDrop - .32, z: bz }, { mover: m }, 80);
  }
  L.update = (dt, game) => {
    for (const m of L.movers) m.update(dt, game);
    for (const h of L.hazards) h.update(dt, game);
    for (const b of L.belts) { if (b.alongX) b.tex.offset.x -= b.speed * dt; else b.tex.offset.y += b.speed * dt; }
    for (const c of L.cranes) c.top.rotation.y = Math.sin(game.time * c.spin + c.phase) * 1.2 + c.phase;
    for (const s of L.spinners) s.obj.rotateOnAxis(new THREE.Vector3(0, 1, 0), s.speed * dt);
  };
  L.clearTransient = () => { for (const h of L.hazards) h.clear && h.clear(); };
  L.dispose = () => {
    B.group.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const m of mats) if (!m.userData.shared) { if (m.map && m.map.isCanvasTexture && !m.map.userData.shared) m.map.dispose(); m.dispose(); }
    });
  };
  return L;
}
