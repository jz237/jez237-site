// Central tuning constants for Iron Ridge.

// Daily Ridge: ?mode=daily reseeds the world from the UTC date and scores
// to a per-day leaderboard
const _params = new URLSearchParams(location.search);
export const DAILY = _params.get('mode') === 'daily';
const _d = new Date();
export const DAILY_STAMP = `${_d.getUTCFullYear()}${String(_d.getUTCMonth() + 1).padStart(2, '0')}${String(_d.getUTCDate()).padStart(2, '0')}`;
export const WORLD_SEED = DAILY ? (parseInt(DAILY_STAMP, 10) % 99991) : 0;

export const WORLD_SIZE = 560;          // metres, square terrain
export const WORLD_HALF = WORLD_SIZE / 2;
export const TERRAIN_SEGS = 224;        // visual + physics grid resolution
export const PLAY_RADIUS = 240;         // soft boundary for gameplay

export const FIXED_DT = 1 / 60;         // physics step
export const MAX_FRAME_DT = 0.25;

export const GRAVITY = -9.81;

// --- Tank handling -----------------------------------------------------
export const TANK = {
  chassisHalf: { x: 1.42, y: 0.55, z: 2.3 },
  mass: 700,
  engineForce: 5200,
  reverseForce: 4800,
  brakeForce: 28,
  turnForce: 2200,       // differential track thrust per side (flavor)
  maxYawRate: 1.5,       // rad/s commanded pivot rate at full turn input
  maxSpeed: 13.5,        // m/s forward
  maxReverse: 11.0,      // near-forward reverse: the tank goes where you point
  wheelRadius: 0.42,
  suspensionRest: 0.52,
  suspK: 16000,          // spring N/m per corner
  suspC: 1900,           // damper N·s/m per corner
  latGrip: 3000,         // lateral track grip N per (m/s) of slip
  latGripMax: 6200,      // clamp (≈ µ·m·g)
  rollResist: 950,       // N per (m/s) when coasting
  turretSlewRate: 2.6,   // rad/s
  barrelMinPitch: -0.32, // rad (up is positive here)
  barrelMaxPitch: 0.24,  // rad downward limit (can hit close-in targets)
  hp: 100,
};

// --- Combat ------------------------------------------------------------
export const SHELL = {
  speed: 105,            // m/s muzzle velocity (player)
  enemySpeed: 80,
  gravity: -9.81,
  radius: 0.16,
  maxLife: 7,            // seconds
  maxActive: 24,
  damageDirect: 50,
  damageSplash: 30,
  splashRadius: 6.5,
  impulse: 2600,         // explosion impulse strength
  rackSize: 5,           // ready-rack shells
  chamberTime: 1.7,      // s between shots
  restockTime: 5.0,      // s to refill the rack
};

// --- Player weapons: main-gun shell types + coaxial MG ------------------
export const WEAPONS = {
  ap: { label: 'AP', speed: 125, dmgDirect: 65, dmgSplash: 12, splashRadius: 3.4, impulse: 2200 },
  he: { label: 'HE', speed: 95, dmgDirect: 34, dmgSplash: 42, splashRadius: 8.5, impulse: 3400 },
};

export const MG = {
  rate: 11,            // rounds/sec
  dmgTank: 3,          // per round vs armor
  dmgSoft: 8,          // per round vs trucks/props
  range: 175,
  heatPerShot: 0.055,
  coolRate: 0.34,      // heat/sec
  resumeAt: 0.45,      // after overheat, usable below this heat
  spread: 0.013,       // rad
  truckHp: 26,         // MG rounds to wreck a convoy truck
};

export const REPAIR = {
  fieldRate: 6,        // hp/sec, stationary field repair
  fieldDelay: 1.2,     // sec of stillness before wrenching starts
  combatLockout: 2.5,  // sec after taking damage before repair can start
  depotRate: 9,        // hp/sec inside the depot ring
  depotRadius: 9,
};

// --- Between-wave perk cards (pick 1 of 3, stack for the whole run) -----
export const PERKS = [
  { id: 'loader', name: 'RAPID LOADER', desc: 'Main gun chambers 18% faster' },
  { id: 'plating', name: 'EXTRA PLATING', desc: '+25 max armor, repaired now' },
  { id: 'he_expert', name: 'HE EXPERT', desc: 'HE blast radius +20%' },
  { id: 'ap_expert', name: 'AP EXPERT', desc: 'AP shell damage +20%' },
  { id: 'turbo', name: 'TURBO TRACKS', desc: 'Speed and acceleration +15%' },
  { id: 'magnet', name: 'SUPPLY MAGNET', desc: 'Crates pull in from 80% farther' },
  { id: 'coolant', name: 'MG COOLANT', desc: 'Coax MG cools 45% faster' },
  { id: 'mechanic', name: 'FIELD MECHANIC', desc: 'All repairs 60% faster' },
  { id: 'doctrine', name: 'STRIKE DOCTRINE', desc: 'Airstrike after 2 kills instead of 3' },
];

export const ENEMY = {
  hp: 100,
  shellDamage: 14,
  engageRange: 130,
  preferredRange: 62,
  minRange: 34,
  reloadBase: 4.6,       // s, shrinks slightly with wave
  aimNoiseBase: 0.06,    // rad, shrinks with wave
  maxCount: 4,
  points: 500,
};

export const SCORING = {
  target: 100,
  barrel: 150,
  block: 10,
  tree: 5,
  comboWindow: 5.0,
  comboMax: 4,
  waveAccuracyBonus: 300, // scaled by accuracy
  waveClearHeal: 35,
};

// --- World scatter -----------------------------------------------------
export const SCATTER = {
  trees: 2600,
  rocks: 380,
  bushes: 700,
  logs: 90,
  stumps: 70,
  grass: 4200,
  flowers: 900,
  maxFallingTrees: 12,
  treadMarks: 360,
  scorch: 100,
};

// --- Enemy variants ------------------------------------------------------
export const ENEMY_TYPES = {
  scout: {
    scheme: 'scout', scale: 0.85, hp: 60, points: 400,
    shellDamage: 10, reload: 3.4, aimNoise: 0.07,
    maxSpeed: 13.6, engineForce: 5200, maxYawRate: 1.35,
    preferredRange: 48, minRange: 26,
  },
  standard: {
    scheme: 'desert', scale: 1.0, hp: 100, points: 500,
    shellDamage: 14, reload: 4.4, aimNoise: 0.055,
    maxSpeed: 10.6, engineForce: 5200, maxYawRate: 1.1,
    preferredRange: 62, minRange: 34,
  },
  heavy: {
    scheme: 'heavy', scale: 1.18, hp: 200, points: 900,
    shellDamage: 24, reload: 5.6, aimNoise: 0.045,
    maxSpeed: 7.2, engineForce: 6200, maxYawRate: 0.8,
    preferredRange: 75, minRange: 45,
  },
  // the Iron Colossus: every-5th-wave breakthrough monster
  boss: {
    scheme: 'boss', scale: 1.5, hp: 520, points: 2500,
    shellDamage: 30, reload: 5.2, aimNoise: 0.04,
    maxSpeed: 6.4, engineForce: 7200, maxYawRate: 0.68,
    preferredRange: 78, minRange: 46,
  },
};

export const PILLBOX = {
  hp: 3,             // direct hits to kill
  points: 350,
  range: 120,
  reload: 3.8,
  shellDamage: 12,
  aimNoise: 0.05,
};

export const ARTILLERY = {
  startWave: 5,
  period: 18,        // seconds between barrages
  shellCount: 6,
  warnTime: 1.4,     // red marker lead time
  spread: 26,        // metres around the player
  damage: 30,
};

export const PICKUP = {
  dropChance: 0.45,  // from tank kills
  heal: 30,
  ttl: 25,
  magnetRadius: 7,
};

// persistent field caches: heal, vanish, reappear somewhere else
export const CACHE = {
  count: 3,
  respawnDelay: 8,   // seconds after pickup before it pops up elsewhere
};

// escape boost: burst of track power to shake off tailgaters
export const BOOST = {
  force: 1.9,        // engine force multiplier while boosting
  speed: 1.45,       // max speed multiplier
  time: 1.8,         // seconds of burn
  cooldown: 9,
};

// ground infantry: chip damage in, big MG/splash payouts out
export const INFANTRY = {
  max: 60,
  speed: 3.2,        // m/s advance
  stopRange: 30,     // halt and shoot inside this
  fireRange: 62,
  reload: 1.7,       // seconds between rifle shots (jittered)
  dmg: 1,
  hitChance: 0.45,
  points: 25,
  crushRadius: 1.8,  // tracks are the best melee weapon
};

export const SCORES_API = 'https://game-scores.jez237.workers.dev/scores/iron-ridge';
export const HS_KEY = 'iron_ridge_highscores_v1';
export const MUTE_KEY = 'iron_ridge_muted';
export const NAME_KEY = 'iron_ridge_initials';
export const REVERSE_LOOK_KEY = 'iron_ridge_reverse_look';

// Collision groups
export const CG = {
  TERRAIN: 1,
  PLAYER: 2,
  ENEMY: 4,
  PROP: 8,
  DEBRIS: 16,
};
