// Iron Ridge — main orchestrator: renderer, physics world, fixed-step
// loop, camera rig, combat wiring, waves, and game state machine.

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { EffectComposer } from '../vendor/postprocessing/EffectComposer.js';
import { RenderPass } from '../vendor/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../vendor/postprocessing/UnrealBloomPass.js';

import { FIXED_DT, MAX_FRAME_DT, GRAVITY, SHELL, ENEMY, SCORING, TANK, PLAY_RADIUS, ARTILLERY, PICKUP, PILLBOX } from './config.js';
import { buildTerrain, getHeight, raycastTerrain } from './terrain.js';
import { buildSky } from './sky.js';
import { Foliage } from './foliage.js';
import { Props } from './props.js';
import { Tank } from './tank.js';
import { WaveManager } from './enemy.js';
import { Projectiles } from './projectiles.js';
import { Effects } from './effects.js';
import { GameAudio } from './audio.js';
import { Input, isTouch } from './input.js';
import { Hud } from './hud.js';
import { QualityScaler, LEVELS } from './quality.js';
import { Minimap } from './minimap.js';
import * as LB from './leaderboard.js';

const $ = (id) => document.getElementById(id);

// ---------------------------------------------------------------- setup
const canvas = $('game');
const renderer = new THREE.WebGLRenderer({
  canvas, antialias: true, powerPreference: 'high-performance',
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const FOG_COLOR = 0xc8dfee;
scene.fog = new THREE.Fog(FOG_COLOR, 140, 400);

const camera = new THREE.PerspectiveCamera(58, 1, 0.3, 700);
camera.position.set(0, 8, -14);

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, GRAVITY, 0) });
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.defaultContactMaterial.friction = 0.5;
world.defaultContactMaterial.restitution = 0.05;

// image-based lighting from a tiny procedural sky probe — without this,
// metallic materials have nothing to reflect and render near-black
{
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const sphereGeo = new THREE.SphereGeometry(40, 24, 16);
  const pos = sphereGeo.attributes.position;
  const cols = new Float32Array(pos.count * 3);
  const cSky = new THREE.Color(0x6fa3d8);
  const cHorizon = new THREE.Color(0xd8e6ee);
  const cGround = new THREE.Color(0x5d6b46);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const t = pos.getY(i) / 40;
    if (t >= 0) c.copy(cHorizon).lerp(cSky, Math.pow(t, 0.6));
    else c.copy(cHorizon).lerp(cGround, Math.min(1, -t * 3));
    cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
  }
  sphereGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  envScene.add(new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({
    side: THREE.BackSide, vertexColors: true,
  })));
  // a bright patch standing in for the sun
  const sunBall = new THREE.Mesh(
    new THREE.SphereGeometry(4, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xfff4d8 }),
  );
  sunBall.position.set(18, 26, 12);
  envScene.add(sunBall);
  scene.environment = pmrem.fromScene(envScene, 0.06).texture;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();
}

const terrain = buildTerrain(scene, world);

// cannon-es Ray-vs-Heightfield misses ~8% of casts; merge an exact analytic
// terrain test into every closest-hit raycast (wheels, shells, AI line checks)
{
  const orig = world.raycastClosest.bind(world);
  world.raycastClosest = (from, to, options, result) => {
    orig(from, to, options, result);
    const mask = options?.collisionFilterMask ?? -1;
    if (mask & 1) {
      const t = raycastTerrain(from.x, from.y, from.z, to.x, to.y, to.z);
      if (t && (!result.hasHit || t.distance < result.distance - 1e-6)) {
        result.hasHit = true;
        result.body = terrain.body;
        result.shape = terrain.body.shapes[0];
        result.hitPointWorld.set(t.x, t.y, t.z);
        result.hitNormalWorld.set(t.nx, t.ny, t.nz);
        result.distance = t.distance;
      }
    }
    return result.hasHit;
  };
}
const sky = buildSky(scene);
const foliage = new Foliage(scene, world);
const props = new Props(scene, world);
const effects = new Effects(scene, camera);
const projectiles = new Projectiles(scene, world);
const audio = new GameAudio();
const input = new Input(canvas);
const hud = new Hud();
const waves = new WaveManager();
const minimap = new Minimap($('minimap'));

// post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.25, 0.65, 0.9);
composer.addPass(bloomPass);

// ---------------------------------------------------------------- state
const G = {
  state: 'menu',           // menu | playing | paused | dying | gameover
  player: null,
  score: 0,
  kills: 0,
  shotsFired: 0,
  shotsHit: 0,
  combo: 0,
  comboT: 0,
  wave: 0,
  waveTransition: 0,
  dieT: 0,
  camYaw: 0,
  camPitch: 0.3,
  camDist: 13,
  aimPoint: new THREE.Vector3(0, 0, 100),
  trailAcc: 0,
  dustAcc: 0,
  time: 0,
  simT: 0,
  artilleryT: 12,
  pendingArty: [],
  quietT: 0,
  waveHadTargets: false,
  targetsBonusGiven: false,
  streakKills: 0,
  streakT: 0,
  airstrike: false,
  pendingBombs: [],
  convoyT: 50,
  fovKick: 0,
};

let pendingScore = 0;
let lbMode = 'global';

// ---------------------------------------------------------------- quality
const quality = new QualityScaler(isTouch ? 1 : 2, (L) => {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, L.pixelRatio));
  composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, L.pixelRatio));
  scene.fog.far = L.fogFar;
  scene.fog.near = L.fogFar * 0.35;
  bloomPass.enabled = L.bloom;
  foliage.setTreeFraction(L.treeFrac);
  foliage.setGrassFraction(L.grassFrac);
  effects.setParticleScale(L.particleScale);
  if (sky.sun.shadow.mapSize.x !== L.shadowSize) {
    sky.sun.shadow.mapSize.set(L.shadowSize, L.shadowSize);
    if (sky.sun.shadow.map) {
      sky.sun.shadow.map.dispose();
      sky.sun.shadow.map = null;
    }
  }
});

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h);
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// ---------------------------------------------------------------- aiming
const _dir = new THREE.Vector3();
const _origin = new THREE.Vector3();

// March the camera-centre ray against the analytic terrain + tank spheres.
function updateAimPoint() {
  camera.getWorldDirection(_dir);
  _origin.copy(camera.position);
  let best = 520;

  // terrain march with bisect refine
  let t = 4;
  let prev = 4;
  while (t < 520) {
    const x = _origin.x + _dir.x * t;
    const y = _origin.y + _dir.y * t;
    const z = _origin.z + _dir.z * t;
    if (y < getHeight(x, z)) {
      let lo = prev, hi = t;
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        const my = _origin.y + _dir.y * mid;
        if (my < getHeight(_origin.x + _dir.x * mid, _origin.z + _dir.z * mid)) hi = mid;
        else lo = mid;
      }
      best = (lo + hi) / 2;
      break;
    }
    prev = t;
    t += t < 60 ? 2.5 : 6;
  }

  // prefer tanks / targets under the reticle
  const sphereHit = (cx, cy, cz, r) => {
    const ox = cx - _origin.x, oy = cy - _origin.y, oz = cz - _origin.z;
    const proj = ox * _dir.x + oy * _dir.y + oz * _dir.z;
    if (proj < 1 || proj > best) return Infinity;
    const d2 = ox * ox + oy * oy + oz * oz - proj * proj;
    return d2 < r * r ? proj : Infinity;
  };
  for (const e of waves.enemies) {
    if (!e.tank.alive) continue;
    const p = e.tank.visual.root.position;
    const d = sphereHit(p.x, p.y + 1.4, p.z, 2.6);
    if (d < best) best = d;
  }
  for (const it of props.items) {
    if (!it.alive || !it.body) continue;
    const p = it.body.position;
    const d = sphereHit(p.x, p.y, p.z, it.radius + 0.4);
    if (d < best) best = d;
  }

  G.aimPoint.copy(_origin).addScaledVector(_dir, best);
}

// ---------------------------------------------------------------- combat
function addScore(points, label, kind = '') {
  const mult = G.combo > 1 ? Math.min(SCORING.comboMax, 1 + (G.combo - 1) * 0.5) : 1;
  const total = Math.round(points * mult);
  G.score += total;
  if (label) hud.floater(`+${total} ${label}`, kind);
}

function bumpCombo() {
  G.combo = G.comboT > 0 ? G.combo + 1 : 1;
  G.comboT = SCORING.comboWindow;
}

function killProp(it, byPlayer) {
  if (!it.alive) return;
  const pos = new THREE.Vector3().copy(it.body.position);
  if (it.kind === 'barrel') {
    props.removeItem(it);
    effects.explosion(pos, 1.25);
    audio.explosion(1.1);
    projectiles.explode(pos, 7.5, 2400);
    applySplashDamage(pos, 7.5, byPlayer, 26);
    if (byPlayer) { bumpCombo(); addScore(SCORING.barrel, 'BARREL', 'good'); }
  } else if (it.kind === 'target') {
    props.removeItem(it);
    effects.spawnDebris(pos, 10, 0.8, 0x9a7c52);
    effects.ring(pos, 4, 0.35);
    if (byPlayer) { bumpCombo(); addScore(SCORING.target, 'TARGET', 'good'); }
  } else if (it.kind === 'pillbox') {
    props.removeItem(it);
    effects.explosion(pos, 1.7);
    audio.explosion(1.4);
    projectiles.explode(pos, 7, 2400);
    effects.spawnDebris(pos, 14, 1.2, 0x9b988e);
    if (byPlayer) { bumpCombo(); addScore(PILLBOX.points, 'PILLBOX', 'kill'); hud.hitmarker(true); }
  } else {
    props.removeItem(it);
    effects.spawnDebris(pos, 5, 0.6, 0xa89a83);
    if (byPlayer) addScore(SCORING.block, '');
  }
}

function damageProp(it, dmg, byPlayer) {
  if (!it.alive) return;
  it.hp -= dmg;
  if (it.hp <= 0) killProp(it, byPlayer);
}

function killEnemy(e) {
  const t = e.tank;
  t.destroyVisual();
  const pos = t.visual.root.position.clone();
  pos.y += 1;
  effects.explosion(pos, 1.6 * (e.type?.scale ?? 1));
  audio.explosion(1.4);
  projectiles.explode(pos, 6, 2000);
  G.kills++;
  bumpCombo();
  addScore(e.type?.points ?? ENEMY.points, 'TANK KILL', 'kill');
  hud.hitmarker(true);
  // kill streak builds toward an airstrike
  G.streakT = 14;
  G.streakKills++;
  if (G.streakKills >= 3 && !G.airstrike) {
    G.airstrike = true;
    G.streakKills = 0;
    hud.setStrike(true);
    hud.banner('AIRSTRIKE READY', 'press F (or tap ✈) to call it in on your reticle', 3);
  }
  // supply drop
  if (Math.random() < PICKUP.dropChance) {
    props.spawnCrate(pos.x + (Math.random() - 0.5) * 4, pos.z + (Math.random() - 0.5) * 4);
  }
}

function damageEnemy(e, dmg, hitPoint = null) {
  if (!e.tank.alive) return;
  const killed = e.tank.damage(dmg);
  if (killed) killEnemy(e);
  else {
    hud.hitmarker(false);
    audio.hitTink();
    if (hitPoint) effects.sparks(hitPoint);
  }
}

function damagePlayer(dmg) {
  const p = G.player;
  if (!p || !p.alive || G.state !== 'playing') return;
  const killed = p.damage(dmg);
  hud.damageFlash();
  audio.damaged();
  effects.shake(0.45);
  hud.setHp(p.hp, p.maxHp);
  if (killed) startDeath();
}

function applySplashDamage(pos, radius, byPlayer, baseDmg) {
  for (const e of waves.enemies) {
    if (!e.tank.alive) continue;
    const d = e.tank.body.position.distanceTo(new CANNON.Vec3(pos.x, pos.y, pos.z));
    if (d < radius && byPlayer) damageEnemy(e, baseDmg * (1 - d / radius));
  }
  if (G.player?.alive) {
    const d = G.player.body.position.distanceTo(new CANNON.Vec3(pos.x, pos.y, pos.z));
    if (d < radius) damagePlayer(Math.round(baseDmg * 0.6 * (1 - d / radius)));
  }
}

function killTruck(truck, byPlayer) {
  if (!truck.alive) return;
  truck.alive = false;
  truck.age = 0;
  const pos = new THREE.Vector3().copy(truck.body.position);
  truck.mesh.traverse(o => {
    if (o.isMesh) o.material = new THREE.MeshStandardMaterial({ color: 0x232323, roughness: 1 });
  });
  effects.explosion(pos, 1.3);
  audio.explosion(1.1);
  if (byPlayer) {
    bumpCombo();
    addScore(250, 'CONVOY TRUCK', 'kill');
    hud.hitmarker(true);
    if (waves.trucks?.length === 3 && waves.trucks.every(t => !t.alive)) {
      addScore(500, 'CONVOY DESTROYED', 'kill');
    }
  }
}

function onShellHit(hit) {
  const s = hit.shell;
  const byPlayer = s.fromPlayer;
  const pos = hit.point;
  const power = s.power ?? 1;

  effects.explosion(pos, (byPlayer ? 1 : 0.9) * power);
  const camD = camera.position.distanceTo(pos);
  if (camD < 160) audio.explosion(Math.max(0.4, 1.2 - camD / 160) * power);

  // real impulses into nearby rigid bodies
  const affected = projectiles.explode(pos, SHELL.splashRadius * power, SHELL.impulse * power);

  // direct hit damage
  const shellDmg = s.owner?.shellDmg ?? ENEMY.shellDamage;
  const ud = hit.body?.userData;
  if (ud?.kind === 'tank') {
    const tk = ud.tank;
    if (tk.isPlayer && !byPlayer) {
      damagePlayer(shellDmg + Math.floor(G.wave * 0.8));
    } else if (!tk.isPlayer && byPlayer) {
      const e = waves.enemies.find(e => e.tank === tk);
      if (e) { damageEnemy(e, SHELL.damageDirect, pos); G.shotsHit++; }
    }
  } else if (ud?.kind === 'truck') {
    if (byPlayer) G.shotsHit++;
    killTruck(ud.truck, byPlayer);
  } else if (ud?.kind === 'prop') {
    if (byPlayer) G.shotsHit++;
    damageProp(ud.prop, 2, byPlayer);
  } else if (hit.tree) {
    foliage.topple(hit.tree, s.vel?.x ?? _dir.x, s.vel?.z ?? _dir.z, 1);
    if (byPlayer) addScore(SCORING.tree, '');
  }

  // splash damage to tanks + trucks
  const splashR = SHELL.splashRadius * power;
  for (const e of waves.enemies) {
    if (!e.tank.alive) continue;
    const d = e.tank.body.position.distanceTo(new CANNON.Vec3(pos.x, pos.y, pos.z));
    if (d < splashR && byPlayer && (!hit.body || hit.body !== e.tank.body)) {
      damageEnemy(e, SHELL.damageSplash * power * (1 - d / splashR));
      G.shotsHit++;
    }
  }
  if (byPlayer && waves.trucks) {
    for (const tr of waves.trucks) {
      if (tr.alive && tr.body.position.distanceTo(new CANNON.Vec3(pos.x, pos.y, pos.z)) < splashR) {
        killTruck(tr, true);
      }
    }
  }
  if (G.player?.alive) {
    const d = G.player.body.position.distanceTo(new CANNON.Vec3(pos.x, pos.y, pos.z));
    if (d < SHELL.splashRadius && hit.body !== G.player.body) {
      const dmg = byPlayer ? 6 : (shellDmg * 0.55);
      if (d > 0.01) damagePlayer(Math.round(dmg * (1 - d / SHELL.splashRadius)));
    }
  }

  // splash into props (barrels chain)
  for (const it of [...props.items]) {
    if (!it.alive || !it.body) continue;
    const d = it.body.position.distanceTo(new CANNON.Vec3(pos.x, pos.y, pos.z));
    if (d < SHELL.splashRadius * 0.9) {
      if (it.kind === 'barrel') setTimeout(() => killProp(it, byPlayer), 90 + Math.random() * 150);
      else damageProp(it, 1, byPlayer);
    }
  }

  // shove trees near the blast
  for (const tree of foliage.treesNear(pos.x, pos.z, 4.2)) {
    foliage.topple(tree, tree.x - pos.x, tree.z - pos.z, 0.8);
  }
}

function playerFire() {
  const p = G.player;
  if (!p) return;
  if (!p.canFire()) {
    if (p.restocking <= 0 && p.chamber >= 1) audio.click();
    return;
  }
  const shot = p.fire();
  if (!shot) return;
  G.fovKick = 1;
  G.shotsFired++;
  audio.fire();
  effects.muzzleFlash(shot.origin, shot.dir);
  effects.shake(0.32);
  projectiles.spawn(shot.origin, shot.dir, SHELL.speed, p, onShellHit);
  if (p.rack === 0) hud.floater('RESTOCKING…', 'warn');
}

// ---------------------------------------------------------------- waves
function compassDir(dx, dz) {
  // north = -z (matches the minimap)
  const oct = Math.round(Math.atan2(dx, -dz) / (Math.PI / 4)) & 7;
  return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][oct];
}

function announceContacts(spawned, label = 'ARMOR INBOUND') {
  if (!spawned.length || !G.player) return;
  const pp = G.player.body.position;
  const e0 = spawned[0].tank.body.position;
  hud.banner(label, `contact ${compassDir(e0.x - pp.x, e0.z - pp.z)} — check the minimap`, 2.2);
  for (const e of spawned) minimap.ping(e.tank.body.position.x, e.tank.body.position.z);
  audio.click();
}

function startWave(w) {
  G.wave = w;
  G.targetsBonusGiven = false;
  // last wave's uncollected bonus targets despawn; cap barrel clutter
  for (const it of [...props.items]) {
    if (it.alive && it.kind === 'target') props.removeItem(it);
  }
  const barrels = props.items.filter(i => i.alive && i.kind === 'barrel');
  for (let i = 0; i < barrels.length - 8; i++) props.removeItem(barrels[i]);
  const before = waves.enemies.length;
  const spec = waves.spawnWave(w, props, scene, world, G.player.body.position);
  G.waveHadTargets = spec.targets > 0;
  const parts = [];
  const armor = spec.tanks.length + spec.pillboxes;
  if (armor) parts.push(`${armor} hostile${armor > 1 ? 's' : ''} — destroy them to advance`);
  if (spec.targets) parts.push('targets = bonus');
  hud.banner(`WAVE ${w}`, parts.join(' • '));
  announceContacts(waves.enemies.slice(before));
  if (w > 1 && G.player.alive) {
    G.player.hp = Math.min(G.player.maxHp, G.player.hp + SCORING.waveClearHeal);
    hud.setHp(G.player.hp, G.player.maxHp);
  }
}

function checkWaveClear(dt) {
  if (G.waveTransition > 0) {
    G.waveTransition -= dt;
    if (G.waveTransition <= 0) startWave(G.wave + 1);
    return;
  }
  // bonus objective: clearing all target boards pays out, never gates
  if (!G.targetsBonusGiven && G.waveHadTargets && props.countAlive('target') === 0) {
    G.targetsBonusGiven = true;
    G.score += 400;
    G.player.hp = Math.min(G.player.maxHp, G.player.hp + 10);
    hud.setHp(G.player.hp, G.player.maxHp);
    hud.floater('+400 ALL TARGETS +10 ARMOR', 'good');
  }
  // the gate: enemy armor only
  const armorLeft = waves.aliveEnemies().length + props.countAlive('pillbox');
  if (armorLeft === 0) {
    const acc = G.shotsFired > 0 ? Math.min(1, G.shotsHit / G.shotsFired) : 0;
    const bonus = Math.round(SCORING.waveAccuracyBonus * acc);
    if (G.wave > 0) {
      G.score += bonus;
      hud.banner(`WAVE ${G.wave} CLEAR`, `accuracy ${(acc * 100) | 0}% — +${bonus} bonus — next wave incoming`);
    }
    G.waveTransition = 4.5;
  }

  // patrol pressure: never let the field stay quiet
  let nearest = Infinity;
  const pp = G.player.body.position;
  for (const e of waves.aliveEnemies()) {
    nearest = Math.min(nearest, Math.hypot(e.tank.pos.x - pp.x, e.tank.pos.z - pp.z));
  }
  if (nearest > 150) G.quietT += dt;
  else G.quietT = 0;
  if (G.quietT > 25) {
    G.quietT = 0;
    const spawned = waves.spawnPatrol(scene, world, pp, G.wave);
    announceContacts(spawned, 'PATROL INBOUND');
  }
}

// ---------------------------------------------------------------- lifecycle
function resetGame() {
  waves.reset();
  props.clearAll();
  projectiles.clear();
  if (G.player) { G.player.removeFromWorld(); G.player = null; }
  G.score = 0; G.kills = 0; G.shotsFired = 0; G.shotsHit = 0;
  G.combo = 0; G.comboT = 0; G.wave = 0; G.waveTransition = 0;
  G.camYaw = 0; G.camPitch = 0.3;
  G.simT = 0; G.artilleryT = 12; G.pendingArty = [];
  G.quietT = 0; G.streakKills = 0; G.streakT = 0; G.airstrike = false;
  G.pendingBombs = []; G.convoyT = 50; G.fovKick = 0;
  waves.clearConvoy?.(scene, world);
  hud.setStrike(false);
}

function startGame() {
  resetGame();
  G.player = new Tank(scene, world, {
    x: 0, z: 0, y: getHeight(0, 0) + 1.2, isPlayer: true, scheme: 'olive',
  });
  hud.setHp(G.player.hp, G.player.maxHp);
  G.state = 'playing';
  hud.showScreen(null);
  audio.ensure();
  audio.resume();
  audio.startEngine();
  input.requestLock();
  startWave(1);
}

function startDeath() {
  if (G.state !== 'playing') return;
  G.state = 'dying';
  G.dieT = 0;
  const p = G.player;
  p.destroyVisual();
  const pos = p.visual.root.position.clone();
  pos.y += 1;
  effects.explosion(pos, 2);
  audio.explosion(1.6);
  audio.stopEngine();
  projectiles.explode(pos, 8, 3000);
}

function showGameOver() {
  G.state = 'gameover';
  input.releaseLock();
  pendingScore = G.score;
  $('over-score').textContent = G.score.toLocaleString();
  $('over-wave').textContent = G.wave;
  $('over-kills').textContent = G.kills;
  const acc = G.shotsFired > 0 ? Math.round(100 * G.shotsHit / G.shotsFired) : 0;
  $('over-acc').textContent = `${acc}%`;
  $('submit-block').style.display = G.score > 0 ? 'block' : 'none';
  $('lb-block-over').classList.add('hidden');
  $('name-input').value = LB.lastInitials();
  hud.showScreen('screen-over');
}

function pauseGame() {
  if (G.state !== 'playing') return;
  G.state = 'paused';
  audio.stopEngine();
  input.releaseLock();
  hud.showScreen('screen-pause');
}

function resumeGame() {
  if (G.state !== 'paused') return;
  G.state = 'playing';
  hud.showScreen(null);
  audio.resume();
  audio.startEngine();
  input.requestLock();
}

// auto-pause when pointer lock is lost mid-game (e.g. Esc)
document.addEventListener('pointerlockchange', () => {
  if (!isTouch && G.state === 'playing' && document.pointerLockElement !== canvas) {
    pauseGame();
  }
});

// click to re-grab the mouse if a quick resume beat the browser's
// pointer-lock cooldown (Chrome blocks relock for ~1.3s after Esc)
canvas.addEventListener('mousedown', () => {
  if (!isTouch && G.state === 'playing' && !input.locked) input.requestLock();
});

// ---------------------------------------------------------------- physics step
function fixedStep(dt) {
  const p = G.player;

  if (p) {
    p.savePrev();
    if (G.state === 'playing') {
      p.throttle = input.throttle;
      p.turn = input.turn;
    } else {
      p.throttle = 0; p.turn = 0;
    }
    p.applyControls(dt);

    // soft boundary: shove back toward the arena
    const r = Math.hypot(p.body.position.x, p.body.position.z);
    if (r > PLAY_RADIUS + 14) {
      const f = (r - PLAY_RADIUS - 14) * 60;
      p.body.applyForce(new CANNON.Vec3(
        -p.body.position.x / r * f * p.body.mass * 0.02,
        0,
        -p.body.position.z / r * f * p.body.mass * 0.02,
      ));
    }
  }

  for (const e of waves.enemies) {
    e.tank.savePrev();
    if (G.state === 'playing') {
      const shot = e.think(dt, p, world, dt);
      if (shot) {
        const d = camera.position.distanceTo(shot.origin);
        if (d < 200) audio.fire(Math.max(0.12, 0.85 - d / 240));
        effects.muzzleFlash(shot.origin, shot.dir);
        projectiles.spawn(shot.origin, shot.dir, SHELL.enemySpeed, e.tank, onShellHit);
      }
    } else {
      e.tank.applyControls(dt);
    }
  }

  world.step(dt);
  projectiles.step(dt, foliage);

  // shell smoke trails
  for (const s of projectiles.active) effects.shellTrail(s.pos);

  // tanks crush small trees
  const crush = (tank) => {
    if (!tank.alive) return;
    const v = tank.body.velocity.length();
    if (v < 2.5) return;
    const pos = tank.body.position;
    for (const tree of foliage.treesNear(pos.x, pos.z, 2.6)) {
      if (tree.scale > 1.25) continue; // big trees stop you (visually pass-through is worse)
      foliage.topple(tree, tank.body.velocity.x, tank.body.velocity.z, 0.7);
      tank.body.velocity.scale(0.86, tank.body.velocity);
      if (tank.isPlayer) { effects.shake(0.12); addScore(SCORING.tree, ''); }
    }
  };
  if (p) crush(p);
  for (const e of waves.enemies) crush(e.tank);

  if (G.state === 'playing') {
    G.simT += dt;
    G.comboT -= dt;
    if (G.comboT <= 0) G.combo = 0;

    // pillbox guns
    const shots = waves.updatePillboxes(dt, p, world, props, _pillboxLos);
    for (const sh of shots) {
      const d = camera.position.distanceTo(sh.origin);
      if (d < 200) audio.fire(Math.max(0.12, 0.8 - d / 240));
      effects.muzzleFlash(sh.origin, sh.dir);
      projectiles.spawn(sh.origin, sh.dir, SHELL.enemySpeed, sh.owner, onShellHit);
    }

    // artillery barrages on later waves
    if (G.wave >= ARTILLERY.startWave && p?.alive) {
      G.artilleryT -= dt;
      if (G.artilleryT <= 0) {
        G.artilleryT = ARTILLERY.period * (0.85 + Math.random() * 0.3);
        hud.floater('⚠ INCOMING', 'warn');
        audio.whistle();
        const pp = p.body.position, pv = p.body.velocity;
        for (let i = 0; i < ARTILLERY.shellCount; i++) {
          const tx = pp.x + pv.x * 1.3 + (Math.random() - 0.5) * ARTILLERY.spread * 2;
          const tz = pp.z + pv.z * 1.3 + (Math.random() - 0.5) * ARTILLERY.spread * 2;
          G.pendingArty.push({ warnAt: G.simT + i * 0.3, fireAt: G.simT + i * 0.3 + 0.25, x: tx, z: tz, warned: false, fired: false });
        }
      }
      for (const a of G.pendingArty) {
        if (!a.warned && G.simT >= a.warnAt) {
          a.warned = true;
          effects.ring(new THREE.Vector3(a.x, 0, a.z), 4, ARTILLERY.warnTime, 0xff5a3c);
        }
        if (!a.fired && G.simT >= a.fireAt) {
          a.fired = true;
          const origin = new THREE.Vector3(a.x + (Math.random() - 0.5) * 2, getHeight(a.x, a.z) + 58, a.z + (Math.random() - 0.5) * 2);
          projectiles.spawn(origin, new THREE.Vector3(0, -1, 0), 42,
            { isPlayer: false, shellDmg: ARTILLERY.damage }, onShellHit);
        }
      }
      G.pendingArty = G.pendingArty.filter(a => !a.fired);
    }

    // streak decay
    G.streakT -= dt;
    if (G.streakT <= 0) G.streakKills = 0;

    // airstrike bombs falling
    for (const b of G.pendingBombs) {
      if (!b.fired && G.simT >= b.fireAt) {
        b.fired = true;
        const origin = new THREE.Vector3(b.x + (Math.random() - 0.5) * 2, getHeight(b.x, b.z) + 65, b.z + (Math.random() - 0.5) * 2);
        projectiles.spawn(origin, new THREE.Vector3(0, -1, 0), 60,
          { isPlayer: true, shellDmg: 0 }, onShellHit, 1.8);
      }
    }
    G.pendingBombs = G.pendingBombs.filter(b => !b.fired);

    // bonus convoy crossings from wave 3
    if (G.wave >= 3) {
      G.convoyT -= dt;
      if (G.convoyT <= 0 && (!waves.trucks || waves.trucks.length === 0)) {
        G.convoyT = 80 + Math.random() * 25;
        const trucks = waves.spawnConvoy(scene, world, p.body.position);
        hud.banner('SUPPLY CONVOY SPOTTED', '250 per truck — intercept before they escape!', 2.6);
        for (const t of trucks) minimap.ping(t.body.position.x, t.body.position.z, '#52d8ff');
        audio.click();
      }
    }
    waves.stepTrucks(dt, scene, world);

    // supply crate pickup
    for (const it of props.items) {
      if (!it.alive || it.kind !== 'crate' || !p?.alive) continue;
      const d = Math.hypot(it.x - p.body.position.x, it.z - p.body.position.z);
      if (d < PICKUP.magnetRadius) {
        props.removeItem(it, false);
        G.player.hp = Math.min(G.player.maxHp, G.player.hp + PICKUP.heal);
        hud.setHp(G.player.hp, G.player.maxHp);
        hud.floater(`+${PICKUP.heal} ARMOR`, 'good');
        audio.reloadDone();
      }
    }

    checkWaveClear(dt);
  }
}
const _pillboxLos = new CANNON.RaycastResult();

// ---------------------------------------------------------------- camera
const _camTarget = new THREE.Vector3();
const _camDesired = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _dirCam = new THREE.Vector3();
const _exhaustPos = new THREE.Vector3();

function updateCamera(dt) {
  const p = G.player;
  if (!p) return;

  if (G.state === 'playing') {
    const { dx, dy } = input.consumeLook();
    G.camYaw -= dx * 0.0024;
    G.camPitch = THREE.MathUtils.clamp(G.camPitch + dy * 0.0021, -0.18, 0.9);
    G.camDist = THREE.MathUtils.clamp(G.camDist + input.consumeZoom() * 1.4, 6.5, 22);
  }

  const root = p.visual.root.position;
  _camTarget.set(root.x, root.y + 2.6, root.z);
  // lookahead in the direction of travel
  _camTarget.addScaledVector(
    new THREE.Vector3(p.body.velocity.x, 0, p.body.velocity.z), 0.1,
  );

  // free-aim rig: the camera's own yaw/pitch defines where the reticle
  // points; the tank sits low in frame instead of being the look target
  const cp = G.camPitch, cy = G.camYaw;
  _dirCam.set(Math.sin(cy) * Math.cos(cp), -Math.sin(cp) + 0.18, Math.cos(cy) * Math.cos(cp)).normalize();

  // pull in front of tree trunks blocking the view line
  let dist = G.camDist;
  for (let t = 2; t < dist; t += 1.2) {
    const px = _camTarget.x - _dirCam.x * t;
    const py = _camTarget.y - _dirCam.y * t;
    const pz = _camTarget.z - _dirCam.z * t;
    let blocked = false;
    for (const tree of foliage.treesNear(px, pz, 1.5)) {
      const dx = px - tree.x, dz = pz - tree.z;
      if (dx * dx + dz * dz < (tree.radius + 0.7) ** 2 &&
          py < tree.y + tree.height * 0.8) { blocked = true; break; }
    }
    if (blocked) { dist = Math.max(3, t - 0.8); break; }
  }

  _camDesired.copy(_camTarget).addScaledVector(_dirCam, -dist);
  // never go underground
  const minY = getHeight(_camDesired.x, _camDesired.z) + 0.7;
  if (_camDesired.y < minY) _camDesired.y = minY;

  const k = 1 - Math.exp(-14 * dt);
  camera.position.lerp(_camDesired, k);
  _lookTarget.copy(camera.position).add(_dirCam);
  camera.lookAt(_lookTarget);

  // FOV punch on firing
  G.fovKick *= 1 - Math.min(1, dt * 7);
  const fov = 58 + G.fovKick * 2.6;
  if (Math.abs(camera.fov - fov) > 0.02) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }

  effects.applyShake(camera);
}

// ---------------------------------------------------------------- UI wiring
$('btn-play').addEventListener('click', () => {
  audio.ensure(); audio.resume();
  startGame();
});
$('btn-resume').addEventListener('click', resumeGame);
$('btn-quit').addEventListener('click', () => {
  resetGame();
  G.state = 'menu';
  audio.stopEngine();
  showMenu();
});
$('btn-again').addEventListener('click', startGame);
$('btn-title').addEventListener('click', () => {
  resetGame();
  G.state = 'menu';
  showMenu();
});

const muteBtns = [$('btn-mute'), $('btn-mute-pause')];
function syncMute() {
  for (const b of muteBtns) if (b) b.textContent = audio.muted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
}
for (const b of muteBtns) {
  b?.addEventListener('click', () => {
    audio.ensure();
    audio.setMuted(!audio.muted);
    syncMute();
  });
}
syncMute();

$('btn-submit').addEventListener('click', async () => {
  const name = LB.cleanInitials($('name-input').value);
  $('submit-block').style.display = 'none';
  $('lb-block-over').classList.remove('hidden');
  const list = $('lb-list-over');
  list.innerHTML = '<div class="lb-empty">Submitting…</div>';
  await LB.submitScore(name, pendingScore, `w${G.wave} k${G.kills}`);
  renderBoardOver('global', name);
});

function tabSetup(prefix, renderFn) {
  $(`tab-global${prefix}`).addEventListener('click', () => renderFn('global'));
  $(`tab-local${prefix}`).addEventListener('click', () => renderFn('local'));
}

async function renderBoardMenu(mode) {
  lbMode = mode;
  $('tab-global-menu').classList.toggle('active', mode === 'global');
  $('tab-local-menu').classList.toggle('active', mode === 'local');
  const list = $('lb-list-menu');
  if (mode === 'local') {
    hud.renderBoard(list, LB.getLocal(), null, 0);
  } else {
    list.innerHTML = '<div class="lb-empty">Loading…</div>';
    const rows = await LB.fetchGlobal();
    hud.renderBoard(list, rows, null, 0);
  }
}

async function renderBoardOver(mode, you = null) {
  $('tab-global-over').classList.toggle('active', mode === 'global');
  $('tab-local-over').classList.toggle('active', mode === 'local');
  const list = $('lb-list-over');
  if (mode === 'local') {
    hud.renderBoard(list, LB.getLocal(), you, pendingScore);
  } else {
    list.innerHTML = '<div class="lb-empty">Loading…</div>';
    const rows = await LB.fetchGlobal(true);
    hud.renderBoard(list, rows, you, pendingScore);
  }
}

tabSetup('-menu', renderBoardMenu);
tabSetup('-over', (m) => renderBoardOver(m, LB.cleanInitials($('name-input').value)));

function showMenu() {
  hud.showScreen('screen-menu');
  renderBoardMenu('global');
}

// ---------------------------------------------------------------- main loop
let last = performance.now();
let acc = 0;
let fpsTimer = 0;

function gameFrame(dt) {

  input.poll();

  // touch drive is camera-relative: push the stick toward where you want
  // to go on screen and the hull auto-steers that way; pull back to reverse
  if ((isTouch || window.__forceTouch) && G.player && G.state === 'playing') {
    const m = Math.hypot(input.stickX ?? 0, input.stickY ?? 0);
    if (m < 0.02) {
      input.throttle = 0;
      input.turn = 0;
    } else {
      const stickAng = Math.atan2(input.stickX, input.stickY); // up = 0
      if (Math.abs(stickAng) > 2.35) {
        // pulling back: straight reverse with gentle steering
        input.throttle = -Math.min(1, m);
        input.turn = THREE.MathUtils.clamp(input.stickX * 0.7, -0.6, 0.6);
      } else {
        const want = G.camYaw + stickAng;
        const cur = G.player.visualYaw();
        let err = want - cur;
        err = Math.atan2(Math.sin(err), Math.cos(err));
        input.turn = THREE.MathUtils.clamp(-err * 1.5, -1, 1);
        // keep rolling while turning, but don't charge off the wrong way
        input.throttle = Math.min(1, m) * THREE.MathUtils.clamp(Math.cos(err) + 0.35, 0, 1);
      }
    }
  }

  if (input.consumePause()) {
    if (G.state === 'playing') pauseGame();
    else if (G.state === 'paused') resumeGame();
  }
  if (input.consumeMute()) { audio.ensure(); audio.setMuted(!audio.muted); syncMute(); }

  const playingish = G.state === 'playing' || G.state === 'dying';

  if (playingish) {
    acc += dt;
    while (acc >= FIXED_DT) {
      fixedStep(FIXED_DT);
      acc -= FIXED_DT;
    }
  }
  const alpha = acc / FIXED_DT;

  if (G.state === 'playing') {
    updateAimPoint();
    G.player.setAim(G.aimPoint);
    if (input.consumeFire()) playerFire();
    if (input.consumeReload()) {
      if (G.player.reloadNow()) audio.click();
    }
    if (input.consumeStrike() && G.airstrike) {
      G.airstrike = false;
      hud.setStrike(false);
      audio.whistle();
      hud.banner('AIRSTRIKE INBOUND', 'danger close!', 1.8);
      camera.getWorldDirection(_dir);
      const fx = _dir.x, fz = _dir.z;
      const fl = Math.hypot(fx, fz) || 1;
      for (let i = 0; i < 5; i++) {
        const bx = G.aimPoint.x + (fx / fl) * (i - 2) * 8 + (Math.random() - 0.5) * 5;
        const bz = G.aimPoint.z + (fz / fl) * (i - 2) * 8 + (Math.random() - 0.5) * 5;
        G.pendingBombs.push({ fireAt: G.simT + 0.5 + i * 0.15, x: bx, z: bz, fired: false });
        effects.ring(new THREE.Vector3(bx, 0, bz), 4, 1.4, 0x8fd6ff);
      }
    }
    audio.engine(G.player.throttle, G.player.speedAlongForward());

    // dust + tread marks
    const sp = Math.abs(G.player.speedAlongForward());
    if (sp > 2) {
      G.dustAcc += dt * sp;
      if (G.dustAcc > 1.4) {
        G.dustAcc = 0;
        const bp = G.player.body.position;
        effects.dustPuff(bp.x, getHeight(bp.x, bp.z), bp.z, Math.min(2, sp / 6));
      }
      G.trailAcc += sp * dt;
      if (G.trailAcc > 0.85) {
        G.trailAcc = 0;
        const yaw = G.player.visualYaw();
        const bp = G.player.body.position;
        const cos = Math.cos(yaw), sin = Math.sin(yaw);
        effects.treadMark(bp.x - cos * 1.06, bp.z + sin * 1.06, yaw);
        effects.treadMark(bp.x + cos * 1.06, bp.z - sin * 1.06, yaw);
      }
    }
  }

  // battle-damage smoke states for the player
  if (G.state === 'playing' && G.player.alive) {
    effects.damageSmoke(G.player.visual.root.position, G.player.hp / G.player.maxHp, dt);
  }

  if (G.state === 'dying') {
    G.dieT += dt;
    if (G.dieT > 0.6 && Math.random() < 0.25) {
      effects.burningWreck(G.player.visual.root.position);
    }
    if (G.dieT > 2.2) showGameOver();
  }

  // visuals
  if (G.player) {
    G.player.syncVisual(alpha, dt);
    updateCamera(dt);
  }
  for (const e of waves.enemies) {
    const near = camera.position.distanceTo(e.tank.visual.root.position) < 170;
    e.tank.syncVisual(alpha, dt, near);
    // battle-damage smoke for wounded enemies
    if (near && e.tank.alive) {
      effects.damageSmoke(e.tank.visual.root.position, e.tank.hp / e.tank.maxHp, dt);
    }
  }
  waves.cleanup(scene, world, effects);

  // exhaust puffs under load (player + nearby enemies)
  G.exhaustAcc = (G.exhaustAcc ?? 0) + dt;
  if (G.exhaustAcc > 0.13) {
    G.exhaustAcc = 0;
    const puffFrom = (tank) => {
      const load = Math.abs(tank.throttle);
      if (load < 0.2 || !tank.alive) return;
      for (const tip of tank.visual.exhausts) {
        tip.getWorldPosition(_exhaustPos);
        effects.exhaustPuff(_exhaustPos, load);
      }
    };
    if (G.player && G.state === 'playing') puffFrom(G.player);
    for (const e of waves.enemies) {
      if (camera.position.distanceTo(e.tank.visual.root.position) < 90) puffFrom(e.tank);
    }
  }
  props.update(dt, G.time);

  // shell whiz-by for incoming fire
  for (const s of projectiles.active) {
    if (!s.fromPlayer && !s.whizzed && camera.position.distanceTo(s.pos) < 10) {
      s.whizzed = true;
      audio.whiz();
    }
  }
  foliage.update(dt, camera.position.x, camera.position.z);
  effects.update(dt);
  sky.update(dt, G.player ? G.player.visual.root.position : camera.position);

  // HUD
  if (playingish && G.player) {
    hud.setGun(
      G.player.rack,
      G.player.chamber,
      G.player.restocking > 0,
      1 - G.player.restocking / SHELL.restockTime,
    );
    hud.setScore(G.score, G.wave, G.kills, G.combo > 1 ? Math.min(SCORING.comboMax, 1 + (G.combo - 1) * 0.5) : 1);
    hud.updateArrows(waves.aliveEnemies(), camera);
    minimap.draw(G.player, waves.enemies, props, G.camYaw, waves.trucks || []);
  }

}

// menu idle camera: slow orbit over the valley
function menuFrame(dt) {
  const t = G.time * 0.05;
  const r = 60;
  camera.position.set(Math.cos(t) * r, 26 + Math.sin(t * 0.7) * 6, Math.sin(t) * r);
  camera.lookAt(0, 6, 0);
  foliage.update(dt, camera.position.x, camera.position.z);
  effects.update(dt);
  sky.update(dt, camera.position);
}

let pumping = false;
function loop(now) {
  if (!pumping) requestAnimationFrame(loop);
  if (window.__IR) window.__IR.frames++;
  let dt = (now - last) / 1000;
  last = now;
  if (dt > MAX_FRAME_DT) dt = MAX_FRAME_DT;
  if (!(dt > 0)) dt = 0.0001; // guard against clock skew / duplicate rAF
  G.time += dt;

  if (G.state === 'menu') menuFrame(dt);
  else gameFrame(dt);

  fpsTimer += dt;
  if (fpsTimer > 0.5) {
    fpsTimer = 0;
    hud.setPerf(1 / quality.emaDt, LEVELS[quality.level].name);
  }
  quality.frame(dt);
  composer.render();
}

showMenu();
requestAnimationFrame(loop);

// debug/testing handle (harmless in production)
window.__IR = {
  G, quality, world, startGame, waves, props, projectiles, effects, input, camera,
  onShellHit, audio,
  player: () => G.player, frames: 0,
  // drive frames manually when rAF is suspended (headless testing)
  pump(n = 1, stepMs = 16.7) {
    pumping = true;
    for (let i = 0; i < n; i++) loop(last + stepMs);
    pumping = false;
    last = performance.now();
    return this.frames;
  },
  shot(w = 960, q = 0.6) {
    const c = document.getElementById('game');
    const h = Math.round(w * c.height / c.width);
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    off.getContext('2d').drawImage(c, 0, 0, w, h);
    return off.toDataURL('image/jpeg', q);
  },
};
