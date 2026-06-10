// Central tuning constants for Iron Ridge.

export const WORLD_SIZE = 560;          // metres, square terrain
export const WORLD_HALF = WORLD_SIZE / 2;
export const TERRAIN_SEGS = 180;        // visual + physics grid resolution
export const PLAY_RADIUS = 240;         // soft boundary for gameplay

export const FIXED_DT = 1 / 60;         // physics step
export const MAX_FRAME_DT = 0.25;

export const GRAVITY = -9.81;

// --- Tank handling -----------------------------------------------------
export const TANK = {
  chassisHalf: { x: 1.42, y: 0.55, z: 2.3 },
  mass: 700,
  engineForce: 5200,
  reverseForce: 3600,
  brakeForce: 28,
  turnForce: 2200,       // differential track thrust per side (flavor)
  maxYawRate: 1.15,      // rad/s commanded pivot rate at full turn input
  maxSpeed: 13.5,        // m/s forward
  maxReverse: 6.0,
  wheelRadius: 0.42,
  suspensionRest: 0.52,
  suspK: 16000,          // spring N/m per corner
  suspC: 1900,           // damper N·s/m per corner
  latGrip: 3000,         // lateral track grip N per (m/s) of slip
  latGripMax: 6200,      // clamp (≈ µ·m·g)
  rollResist: 950,       // N per (m/s) when coasting
  turretSlewRate: 2.6,   // rad/s
  barrelMinPitch: -0.32, // rad (up is positive here)
  barrelMaxPitch: 0.14,  // rad downward limit
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
  trees: 2400,
  rocks: 380,
  grass: 2600,
  maxFallingTrees: 12,
  treadMarks: 360,
};

export const SCORES_API = 'https://game-scores.jez237.workers.dev/scores/iron-ridge';
export const HS_KEY = 'iron_ridge_highscores_v1';
export const MUTE_KEY = 'iron_ridge_muted';
export const NAME_KEY = 'iron_ridge_initials';

// Collision groups
export const CG = {
  TERRAIN: 1,
  PLAYER: 2,
  ENEMY: 4,
  PROP: 8,
  DEBRIS: 16,
};
