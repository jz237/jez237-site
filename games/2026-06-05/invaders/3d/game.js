// Invaders — 3D Edition. Game logic grew out of the Classic Edition's; v3.1 adds Boss Rush and
// Practice, upgrades after each boss, wardens, phantoms, a bonus saucer, the Hive warship,
// controller support, tension music, medals and a share card. stage.js draws it in real-time
// 3D; meta.js holds settings, medals and the share card; the sound set is ElevenLabs.
import { createStage } from "./stage.js?v=2";
import { loadSettings, saveSettings, renderSettings, createMedals, createToast, buildShareCard, canShareFiles, shareCardImage, downloadCardImage } from "./meta.js?v=1";

const canvas = document.getElementById("gl");
const fxCanvas = document.getElementById("fx");
const cabinet = document.querySelector(".cabinet");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const startButton = document.getElementById("startButton");
const scoresButton = document.getElementById("scoresButton");
const scoreEl = document.getElementById("score");
const waveEl = document.getElementById("wave");
const livesEl = document.getElementById("lives");
const weaponEl = document.getElementById("weapon");
const shieldEl = document.getElementById("shield");
const shieldMeter = document.getElementById("shieldMeter");
const shieldFill = document.getElementById("shieldFill");
const scoresPanel = document.getElementById("scoresPanel");
const controlsBar = document.getElementById("controlsBar");
const pauseButton = document.getElementById("pauseButton");
const muteButton = document.getElementById("muteButton");
const controlsHint = document.getElementById("controlsHint");
const dailyNote = document.getElementById("dailyNote");
const dailyButton = document.getElementById("dailyButton");
const bombButton = document.getElementById("bombButton");
const rushButton = document.getElementById("rushButton");
const practiceButton = document.getElementById("practiceButton");
const medalsButton = document.getElementById("medalsButton");
const settingsButton = document.getElementById("settingsButton");
const shareButton = document.getElementById("shareButton");
const settingsPanel = document.getElementById("settingsPanel");
const medalsPanel = document.getElementById("medalsPanel");
const practicePanel = document.getElementById("practicePanel");
const sharePanel = document.getElementById("sharePanel");
const perkOverlay = document.getElementById("perkOverlay");
const perkCards = document.getElementById("perkCards");
const perkTitle = document.getElementById("perkTitle");
const waveLabelEl = document.getElementById("waveLabel");

const VERSION = "v3.1.0";
const TAU = Math.PI * 2;
const LOCAL_SCORES_KEY = "invaders3d_highscores_v1";
const LOCAL_DAILY_PREFIX = "invaders3d_daily_";
const LAST_INITIALS_KEY = "neon_invaders_last_initials";
const MUTE_KEY = "neon_invaders_muted";
// The 3D Edition keeps its own global boards, apart from the Classic Edition's.
const SCORES_BASE = "https://game-scores.jez237.workers.dev/scores/";
const CLASSIC_SLUG = "invaders-3d";
const RUSH_SLUG = "invaders-3d-bossrush";
const LOCAL_RUSH_KEY = "invaders3d_bossrush_v1";
const BEST_WAVE_KEY = "invaders3d_best_wave";
const MODE_LABELS = { classic: "Arcade Run", daily: "Daily Challenge", bossrush: "Boss Rush", practice: "Practice" };
const MUSIC_VOLUME = 0.36;
// New ElevenLabs sound set for this edition (music + effects), see audio/.
const MUSIC = {
  menu: "audio/music-menu.mp3",
  gameplay: "audio/music-game.mp3",
  boss: "audio/music-boss.mp3"
};
const SFX_FILES = {
  shoot: "audio/sfx-shoot.mp3",
  laser: "audio/sfx-laser.mp3",
  spread: "audio/sfx-spread.mp3",
  shatter: "audio/sfx-shatter.mp3",
  shatterBig: "audio/sfx-shatter-big.mp3",
  hit: "audio/sfx-hit.mp3",
  bunker: "audio/sfx-bunker.mp3",
  hurt: "audio/sfx-hurt.mp3",
  lifeLost: "audio/sfx-life-lost.mp3",
  powerup: "audio/sfx-powerup.mp3",
  bomb: "audio/sfx-bomb.mp3",
  overdrive: "audio/sfx-overdrive.mp3",
  warning: "audio/sfx-warning.mp3",
  beam: "audio/sfx-beam.mp3",
  bossArrive: "audio/sfx-boss-arrive.mp3",
  turretDown: "audio/sfx-turret-down.mp3",
  bossDown: "audio/sfx-boss-down.mp3",
  dive: "audio/sfx-dive.mp3",
  wave: "audio/sfx-wave.mp3",
  perfect: "audio/sfx-perfect.mp3",
  select: "audio/sfx-select.mp3",
  gameover: "audio/sfx-gameover.mp3",
  extralife: "audio/sfx-extralife.mp3",
  march: "audio/sfx-march.mp3",
  bossShot: "audio/sfx-boss-shot.mp3",
  enemyShot: "audio/sfx-enemy-shot.mp3",
  heartbeat: "audio/sfx-heartbeat.mp3",
  saucer: "audio/sfx-saucer.mp3",
  saucerDown: "audio/sfx-saucer-down.mp3",
  perkOffer: "audio/sfx-perk-offer.mp3",
  perkPick: "audio/sfx-perk-pick.mp3",
  medal: "audio/sfx-medal.mp3",
  split: "audio/sfx-split.mp3",
  deflect: "audio/sfx-deflect.mp3",
  blink: "audio/sfx-blink.mp3",
  snipe: "audio/sfx-snipe.mp3",
  slowmo: "audio/sfx-slowmo.mp3",
  swoop: "audio/sfx-swoop.mp3",
  sector: "audio/sfx-sector.mp3",
  shutter: "audio/sfx-shutter.mp3"
};

// --- Seeded gameplay RNG (Daily Challenge) -----------------------------
// Daily wave composition + boss rolls go through the position-hashed gpAt(salt)
// below (value depends only on seed+wave+salt, never on draw order). Everything
// that varies with play (drops, dive timing, particles, shake) stays on Math.random
// so it can't desync the shared daily layout across devices. The gp()/grand()/gpick()
// stream helpers below are retained for QA/debug but no longer drive spawns.
let gpState = 1;
function mulberry32() {
  gpState = (gpState + 0x6D2B79F5) | 0;
  let t = gpState;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function seedGameplay(seed) { gpState = (seed | 0) || 1; }
function gp() { return game.mode === "daily" ? mulberry32() : Math.random(); }
function grand(min, max) { return min + gp() * (max - min); }
function gpick(list) { return list[Math.floor(gp() * list.length)]; }

// Position-hashed daily RNG: the value depends only on (seed, wave, salt), NOT on how
// many prior draws happened. So a phone (small formation) and a desktop (large one)
// agree on every overlapping grid cell and every boss roll for the same daily seed —
// sequential-stream consumption can't desync them. Classic mode stays on Math.random.
function gpAt(salt) {
  if (game.mode !== "daily") return Math.random();
  let s = (DAILY_SEED ^ Math.imul(game.wave, 0x9E3779B1) ^ Math.imul(salt | 0, 0x85EBCA77)) >>> 0;
  s = (s + 0x6D2B79F5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function drand(salt, min, max) { return min + gpAt(salt) * (max - min); }

function utcDayKey() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function hashSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const MODIFIERS = [
  { id: "standard", name: "Standard Ops", tip: "A clean fight — no modifiers." },
  { id: "double-divers", name: "Diver Swarm", tip: "Divers everywhere, and they commit to the kill." },
  { id: "iron-bunkers", name: "Iron Bunkers", tip: "Reinforced bunkers soak far more fire." },
  { id: "glass-cannon", name: "Glass Cannon", tip: "One life — but every point counts double." },
  { id: "laser-storm", name: "Laser Storm", tip: "Start with the laser lance; the fleet fires faster." },
  { id: "boss-rush", name: "Boss Rush", tip: "A warship every second wave." },
  { id: "overcharged", name: "Overcharged", tip: "Overdrive builds fast and burns long." }
];
// Recomputed at load and again when a daily run starts, so a tab left open across
// UTC midnight still plays/scores against the correct day.
let DAILY_KEY, DAILY_SEED, DAILY_MODIFIER, DAILY_SLUG;
function refreshDaily() {
  DAILY_KEY = utcDayKey();
  DAILY_SEED = hashSeed("invaders-" + DAILY_KEY);
  DAILY_MODIFIER = MODIFIERS[DAILY_SEED % MODIFIERS.length];
  DAILY_SLUG = "invaders-3d-daily-" + DAILY_KEY.replace(/-/g, "");
}
refreshDaily();
const BOSS_KINDS = ["carrier", "interceptor", "bulwark", "hive"];
const BOSS_NAMES = { carrier: "CARRIER", interceptor: "INTERCEPTOR", bulwark: "BULWARK", hive: "HIVE" };

function activeModifier() { return game.mode === "daily" ? DAILY_MODIFIER : MODIFIERS[0]; }
function hasMod(id) { return activeModifier().id === id; }
function scoresSlug() { return game.mode === "daily" ? DAILY_SLUG : game.mode === "bossrush" ? RUSH_SLUG : CLASSIC_SLUG; }
function scored() { return game.mode !== "practice"; }

// Boss Rush runs its difficulty on the same wave scale (a warship every other step from
// wave 4), but shows the player a simple boss count.
function displayWave() { return game.mode === "bossrush" ? Math.max(1, (game.wave - 2) / 2) : game.wave; }
function sectorForWave() { return game.mode === "bossrush" ? displayWave() - 1 : Math.floor((game.wave - 1) / 4); }

// ---- upgrades offered after each warship ------------------------------------------------
const PERKS = [
  { id: "plating", icon: "🛡️", name: "Hardened Shields", max: 2, desc: "Shield cap +15 and an instant 30% top-up." },
  { id: "overdrive", icon: "⚡", name: "Long Overdrive", max: 3, desc: "Overdrive burns 1.5 s longer." },
  { id: "cycler", icon: "🔥", name: "Rapid Cycler", max: 3, desc: "Every weapon fires 12% faster." },
  { id: "tractor", icon: "🧲", name: "Tractor Field", max: 2, desc: "Power cores drift toward your ship." },
  { id: "bunkers", icon: "🧱", name: "Bunker Weld", max: 2, desc: "Bunker blocks take two more hits." },
  { id: "battery", icon: "🔋", name: "Weapon Battery", max: 2, desc: "Spread and Laser last 4 s longer." },
  { id: "keeper", icon: "🔗", name: "Combo Keeper", max: 2, desc: "Combo chains hold 1.2 s longer." },
  { id: "bombbay", icon: "💣", name: "Bomb Bay", max: 3, desc: "+2 smart bombs now, and carry up to 6." },
  { id: "hull", icon: "❤️", name: "Reserve Hull", max: 1, desc: "+1 life now, and one more life slot." },
  { id: "phase", icon: "💨", name: "Phase Dash", max: 1, desc: "Dash recharges twice as fast and shields you longer.", needsDash: true }
];
function perkLevel(id) { return (game.perks && game.perks[id]) || 0; }
function shieldCap() { return 92 + perkLevel("plating") * 15; }
function overdriveDuration() { return (hasMod("overcharged") ? 6 : 4) + perkLevel("overdrive") * 1.5; }
function maxLives() { return (hasMod("glass-cannon") ? 1 : 3) + perkLevel("hull"); }
function bombCap() { return perkLevel("bombbay") ? 6 : 5; }
function comboWindow() { return 2.8 + perkLevel("keeper") * 1.2; }

let globalScoresCache = {};
let globalScoresCacheTime = {};
const keys = new Set();
const game = {
  state: "ready",
  time: 0,
  last: 0,
  width: 1180,
  height: 760,
  scale: 1,
  score: 0,
  wave: 1,
  lives: 3,
  combo: 1,
  comboTimer: 0,
  shake: 0,
  bossWave: false,
  nextShot: 0,
  nextEnemyShot: 1.3,
  waveClearTimer: 0,
  invaderDir: 1,
  invaderStepTimer: 0,
  invaderMarchTimer: 0,
  invaderFrame: 0,
  nextDive: 0,
  player: null,
  stars: [],
  invaders: [],
  bullets: [],
  enemyBullets: [],
  particles: [],
  powerups: [],
  pickupLabels: [],
  waveBanner: null,
  screenFlash: 0,
  flashColor: "255, 241, 168",
  powerFlash: null,
  shields: [],
  boss: null,
  bossKind: "carrier",
  rings: [],
  scoreSubmitted: false,
  lowPower: false,
  fxLow: false,
  autoLow: false,
  compact: false,
  lastMuzzleBurst: 0,
  mode: "classic",
  bombs: 0,
  nextBombWave: 3,
  overdrive: 0,
  hitStop: 0,
  slowmo: 0,
  waveDamage: 0,
  perfectStreak: 0,
  fpsAcc: 0,
  fpsFrames: 0,
  fpsAvg: 60,
  fpsWindow: 0,
  timeScale: 1,
  cineGuard: 0,
  saucer: null,
  nextSaucer: Infinity,
  perks: {},
  sector: 0,
  chain: 0,
  waveStartCount: 0,
  practiceStart: 1,
  stats: {}
};
const touchAim = {
  active: false,
  x: null,
  pointerId: null
};

const colors = {
  player: "#35f4ff",
  bullet: "#a7ff3d",
  enemy: "#ff3df2",
  enemy2: "#ffd23d",
  enemy3: "#ff4d6d",
  shield: "#35f4ff",
  gold: "#ffd23d",
  fire: "#ff7a2d",
  red: "#ff4d6d",
  warden: "#9a7dff",
  barrier: "#c9b8ff",
  phantom: "#e6e2ff"
};

let soundCtx = null;
let masterGain = null;
let sfxGain = null;
let musicGain = null;
let lastShotSound = 0;
let lastHitSound = 0;
let lastBunkerSound = 0;
let samplesRequested = false;
let activeVoices = 0;
const MAX_VOICES = 22;
const sampleBuffers = {};
const musicBuffers = {};
const musicLoading = {};
const musicVoices = {};
const musicTargets = {};
let currentMusicKey = null;
let muted = false;
try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch (error) {}
let wakeLock = null;
let overlayShownAt = 0;
let viewScale = 1;
let stage = null;
const settings = loadSettings();
let medals = null;
let toast = null;
let shareCanvas = null;
let perkOpenedAt = 0;
let tension = 0;
let heartTimer = 0;
let musicRate = 1;
const qualityPinnedByUrl = /[?&]q=/.test(location.search);

function applyMute() {
  if (masterGain && soundCtx) {
    const now = soundCtx.currentTime;
    masterGain.gain.setTargetAtTime(muted ? 0 : 1, now, 0.02);
  }
  muteButton.textContent = muted ? "🔇" : "🔊";
  muteButton.setAttribute("aria-label", muted ? "Unmute sound" : "Mute sound");
  muteButton.setAttribute("aria-pressed", muted ? "true" : "false");
  muteButton.title = muted ? "Unmute (M)" : "Mute (M)";
}

function toggleMute() {
  muted = !muted;
  try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch (error) {}
  applyMute();
}

function requestWakeLock() {
  if (!navigator.wakeLock || wakeLock) return;
  navigator.wakeLock.request("screen").then(lock => {
    wakeLock = lock;
    lock.addEventListener("release", () => {
      if (wakeLock === lock) wakeLock = null;
    });
  }).catch(() => {});
}

function releaseWakeLock() {
  if (!wakeLock) return;
  try {
    const released = wakeLock.release();
    if (released && released.catch) released.catch(() => {});
  } catch (error) {}
  wakeLock = null;
}

function setControlsVisible(visible) {
  controlsBar.classList.toggle("hidden", !visible);
}

function ensureAudioContext() {
  if (soundCtx) return soundCtx;
  try {
    soundCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = soundCtx.createGain();
    masterGain.gain.value = muted ? 0 : 1;
    masterGain.connect(soundCtx.destination);
    sfxGain = soundCtx.createGain();
    sfxGain.gain.value = 0.85 * settings.sfx / 100;
    sfxGain.connect(masterGain);
    musicGain = soundCtx.createGain();
    musicGain.gain.value = settings.music / 100;
    musicGain.connect(masterGain);
  } catch (error) {
    soundCtx = null;
  }
  return soundCtx;
}

function decode(data) {
  return new Promise((resolve, reject) => soundCtx.decodeAudioData(data, resolve, reject));
}

function loadSamples() {
  if (samplesRequested || !soundCtx) return;
  samplesRequested = true;
  for (const name in SFX_FILES) {
    fetch(SFX_FILES[name])
      .then(response => response.arrayBuffer())
      .then(decode)
      .then(buffer => { sampleBuffers[name] = buffer; })
      .catch(() => {});
  }
}

function panFor(x) {
  return x == null ? 0 : clamp((x / Math.max(1, game.width)) * 2 - 1, -1, 1) * 0.65;
}

// Returns true when it produced sound (or was legitimately dropped for polyphony),
// false when the sample is not ready — callers then fall back to the synth.
function playSample(name, options) {
  if (muted || !soundCtx) return false;
  const buffer = sampleBuffers[name];
  if (!buffer) return false;
  if (activeVoices > MAX_VOICES) return true;
  const opts = options || {};
  const src = soundCtx.createBufferSource();
  src.buffer = buffer;
  src.playbackRate.value = opts.rate || 1;
  const gain = soundCtx.createGain();
  gain.gain.value = opts.gain == null ? 1 : opts.gain;
  let tail = gain;
  let panner = null;
  if (opts.x != null && soundCtx.createStereoPanner) {
    panner = soundCtx.createStereoPanner();
    panner.pan.value = panFor(opts.x);
    gain.connect(panner);
    tail = panner;
  }
  src.connect(gain);
  tail.connect(sfxGain);
  activeVoices += 1;
  src.onended = () => {
    activeVoices = Math.max(0, activeVoices - 1);
    try { src.disconnect(); gain.disconnect(); if (panner) panner.disconnect(); } catch (error) {}
  };
  try { src.start(soundCtx.currentTime + (opts.delay || 0)); } catch (error) { activeVoices = Math.max(0, activeVoices - 1); return false; }
  return true;
}

// A looping effect that follows a moving source (the saucer hum). Returns a handle for
// panLoop / stopLoop, or null when sound is off or not loaded yet.
function startLoop(name, gainValue, x) {
  if (muted || !soundCtx || !sampleBuffers[name]) return null;
  const src = soundCtx.createBufferSource();
  src.buffer = sampleBuffers[name];
  src.loop = true;
  const gain = soundCtx.createGain();
  gain.gain.value = 0;
  gain.gain.setTargetAtTime(gainValue, soundCtx.currentTime, 0.12);
  let tail = gain;
  let panner = null;
  if (soundCtx.createStereoPanner) {
    panner = soundCtx.createStereoPanner();
    panner.pan.value = panFor(x);
    gain.connect(panner);
    tail = panner;
  }
  src.connect(gain);
  tail.connect(sfxGain);
  try { src.start(); } catch (error) { return null; }
  return { src, gain, panner };
}
function panLoop(loop, x) {
  if (loop && loop.panner) loop.panner.pan.value = panFor(x);
}
function stopLoop(loop) {
  if (!loop || !soundCtx) return;
  try {
    loop.gain.gain.setTargetAtTime(0, soundCtx.currentTime, 0.08);
    loop.src.stop(soundCtx.currentTime + 0.4);
    loop.src.onended = () => { try { loop.src.disconnect(); loop.gain.disconnect(); if (loop.panner) loop.panner.disconnect(); } catch (error) {} };
  } catch (error) {}
}

function applyAudioSettings() {
  if (sfxGain) sfxGain.gain.value = 0.85 * settings.sfx / 100;
  if (musicGain) musicGain.gain.value = settings.music / 100;
}

function unlockAudio() {
  ensureAudioContext();
  try { if (soundCtx && soundCtx.state === "suspended" && game.state !== "paused") soundCtx.resume(); } catch (error) {}
  loadSamples();
  // Kick menu music once we have a gesture, if nothing is playing yet.
  if (!currentMusicKey && (game.state === "ready" || game.state === "over")) playMusic("menu");
}

// Music runs through Web Audio so the ElevenLabs loops repeat without a gap.
function loadMusic(key) {
  if (!soundCtx || musicBuffers[key] || musicLoading[key]) return;
  musicLoading[key] = fetch(MUSIC[key])
    .then(response => response.arrayBuffer())
    .then(decode)
    .then(buffer => {
      musicBuffers[key] = buffer;
      if (currentMusicKey === key) startMusicVoice(key);
    })
    .catch(() => { musicLoading[key] = null; });
}

// Skip the few silent frames an MP3 encoder pads onto each end so the loop point is clean.
function loopBounds(buffer) {
  const data = buffer.getChannelData(0);
  const limit = Math.min(data.length, Math.floor(buffer.sampleRate * 0.12));
  let head = 0;
  while (head < limit && Math.abs(data[head]) < 1e-4) head++;
  let tail = data.length - 1;
  while (tail > data.length - limit && Math.abs(data[tail]) < 1e-4) tail--;
  return [head / buffer.sampleRate, (tail + 1) / buffer.sampleRate];
}

function startMusicVoice(key) {
  if (!soundCtx || musicVoices[key]) return;
  const buffer = musicBuffers[key];
  if (!buffer) { loadMusic(key); return; }
  const src = soundCtx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const [start, end] = loopBounds(buffer);
  src.loopStart = start;
  src.loopEnd = end;
  if (key !== "menu") src.playbackRate.value = musicRate;
  const gain = soundCtx.createGain();
  gain.gain.value = 0;
  src.connect(gain).connect(musicGain);
  src.start(0, start);
  musicVoices[key] = { src, gain, vol: 0 };
}

function stopMusicVoice(key) {
  const voice = musicVoices[key];
  if (!voice) return;
  try { voice.src.stop(); voice.src.disconnect(); voice.gain.disconnect(); } catch (error) {}
  delete musicVoices[key];
}

function musicVolumeFor(key) {
  return key === "boss" ? MUSIC_VOLUME * 1.05 : key === "menu" ? MUSIC_VOLUME * 0.8 : MUSIC_VOLUME;
}

function playMusic(key) {
  currentMusicKey = key;
  for (const k in MUSIC) {
    musicTargets[k] = k === key ? musicVolumeFor(k) : 0;
  }
  if (!soundCtx) return;
  for (const k in MUSIC) if (k !== key) loadMusic(k);
  startMusicVoice(key);
}

// Called each frame to smoothly crossfade between menu / gameplay / boss loops.
function stepMusic(dt) {
  for (const key in musicVoices) {
    const voice = musicVoices[key];
    const target = musicTargets[key] == null ? 0 : musicTargets[key];
    if (voice.vol !== target) {
      const rate = 1.4 * dt;
      if (Math.abs(voice.vol - target) <= rate) voice.vol = target;
      else voice.vol += Math.sign(target - voice.vol) * rate;
      voice.gain.gain.value = voice.vol;
    }
    if (target === 0 && voice.vol <= 0.001) stopMusicVoice(key);
  }
  stepTension(dt);
}

// Tension: as the formation thins and creeps down (or a warship nears death, or the shield
// runs low) the battle music speeds up and a heartbeat thumps under it, faster and louder.
function tensionTarget() {
  const p = game.player;
  if (game.state !== "playing" || !p) return 0;
  let t = 0;
  const boss = game.boss;
  if (boss && boss.intro <= 0) t = clamp((0.55 - boss.hp / boss.maxHp) / 0.55, 0, 1) * 0.85;
  if (!game.bossWave && game.invaders.length) {
    let lowest = 0;
    let count = 0;
    for (const inv of game.invaders) {
      if (inv.solo) continue;
      count += 1;
      if (!inv.divePhase) lowest = Math.max(lowest, inv.homeY ?? inv.y);
    }
    const top = game.height * 0.3;
    const low = clamp((lowest - top) / Math.max(1, p.y - 42 - top), 0, 1);
    const thin = game.waveStartCount ? clamp(1 - count / game.waveStartCount, 0, 1) : 0;
    t = Math.max(t, Math.min(1, low * 0.85 + thin * thin * 0.45));
  }
  if (p.shield < 30) t = Math.max(t, 0.5);
  return t;
}

function stepTension(dt) {
  tension += (tensionTarget() - tension) * Math.min(1, dt * 1.2);
  const rate = 1 + 0.085 * tension;
  if (soundCtx && Math.abs(rate - musicRate) > 0.002) {
    musicRate = rate;
    for (const key of ["gameplay", "boss"]) {
      const voice = musicVoices[key];
      if (voice) voice.src.playbackRate.setTargetAtTime(rate, soundCtx.currentTime, 0.4);
    }
  }
  if (game.state === "playing" && tension > 0.22) {
    heartTimer -= dt;
    if (heartTimer <= 0) {
      const k = (tension - 0.22) / 0.78;
      heartTimer = 1.05 - 0.67 * k;
      sfx.heartbeat(k);
      if (stage) stage.events.heartbeat(k);
    }
  } else {
    heartTimer = Math.min(heartTimer, 0.3);
  }
}

// Compatibility wrappers used by the pause / resume / game-over flow.
function startMusic() { playMusic(game.boss ? "boss" : "gameplay"); }
function pauseMusic() {
  try { if (soundCtx && soundCtx.state === "running") soundCtx.suspend(); } catch (error) {}
}
function resumeMusic() {
  try { if (soundCtx && soundCtx.state === "suspended") soundCtx.resume(); } catch (error) {}
}
function stopMusic() {
  currentMusicKey = null;
  for (const key in MUSIC) {
    musicTargets[key] = 0;
    stopMusicVoice(key);
  }
}

function requestImmersiveMode() {
  try {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
      const target = cabinet || document.documentElement;
      const request = target.requestFullscreen || target.webkitRequestFullscreen || target.msRequestFullscreen;
      if (request) {
        const result = request.call(target, { navigationUI: "hide" });
        if (result && result.catch) result.catch(() => {});
      }
    }
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("portrait").catch(() => {});
    }
    setTimeout(() => window.scrollTo(0, 1), 60);
  } catch (error) {}
}

function playTone(freq, duration = 0.06, type = "square", gain = 0.035, endFreq = freq) {
  if (!soundCtx || muted) return;
  const now = soundCtx.currentTime;
  const osc = soundCtx.createOscillator();
  const amp = soundCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.006);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp).connect(masterGain || soundCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playNoise(duration = 0.08, gain = 0.045, filterFreq = 900) {
  if (!soundCtx || muted) return;
  const frames = Math.max(1, Math.floor(soundCtx.sampleRate * duration));
  const buffer = soundCtx.createBuffer(1, frames, soundCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = soundCtx.createBufferSource();
  const filter = soundCtx.createBiquadFilter();
  const amp = soundCtx.createGain();
  src.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = filterFreq;
  filter.Q.value = 0.9;
  amp.gain.value = gain;
  src.connect(filter).connect(amp).connect(masterGain || soundCtx.destination);
  src.start();
}

const sfx = {
  shot(weapon, x) {
    const now = performance.now();
    if (now - lastShotSound < 55) return;
    lastShotSound = now;
    const name = weapon === "laser" ? "laser" : weapon === "spread" ? "spread" : "shoot";
    if (playSample(name, { gain: name === "spread" ? 0.42 : 0.38, rate: 0.97 + Math.random() * 0.07, x })) return;
    playTone(weapon === "laser" ? 1280 : 920, 0.035, "square", 0.024, weapon === "laser" ? 900 : 620);
  },
  step(frame) {
    if (playSample("march", { gain: 0.5, rate: frame ? 1 : 0.84 })) return;
    playTone(frame ? 132 : 110, 0.045, "square", 0.025, frame ? 110 : 92);
  },
  enemy(x) {
    if (playSample("enemyShot", { gain: 0.3, rate: 0.95 + Math.random() * 0.12, x })) return;
    playTone(240, 0.055, "triangle", 0.022, 150);
  },
  bossShot(x) {
    if (playSample("bossShot", { gain: 0.55, rate: 0.95 + Math.random() * 0.1, x })) return;
    playTone(190, 0.12, "sawtooth", 0.03, 80);
  },
  bossCharge(x) {
    if (playSample("warning", { gain: 0.62, x })) return;
    playTone(96, 0.36, "sawtooth", 0.032, 240);
  },
  beam(x) {
    if (playSample("beam", { gain: 0.8, x })) return;
    playTone(190, 0.12, "sawtooth", 0.03, 80);
  },
  hit(x) {
    const now = performance.now();
    if (now - lastHitSound < 40) return;
    lastHitSound = now;
    if (playSample("hit", { gain: 0.32, rate: 0.9 + Math.random() * 0.25, x })) return;
    playTone(520, 0.045, "square", 0.025, 290);
  },
  boom(big = false, combo = 1, x) {
    const rate = big ? 1 : clamp(0.92 + (combo - 1) * 0.16, 0.92, 1.45);
    if (playSample(big ? "shatterBig" : "shatter", { gain: big ? 0.9 : 0.5, rate: rate * (0.97 + Math.random() * 0.06), x })) return;
    playNoise(big ? 0.22 : 0.1, big ? 0.075 : 0.045, big ? 420 : 760);
  },
  bunker(x) {
    const now = performance.now();
    if (now - lastBunkerSound < 70) return;
    lastBunkerSound = now;
    if (playSample("bunker", { gain: 0.32, rate: 0.9 + Math.random() * 0.2, x })) return;
    playNoise(0.06, 0.03, 1400);
  },
  pickup(x) {
    if (playSample("powerup", { gain: 0.75, x })) return;
    playTone(640, 0.04, "triangle", 0.03, 1180);
  },
  hurt(x) {
    if (playSample("hurt", { gain: 0.85, x })) return;
    playNoise(0.16, 0.065, 520);
  },
  lifeLost(x) {
    if (playSample("lifeLost", { gain: 0.95, x })) return;
    playNoise(0.3, 0.08, 300);
  },
  bomb() {
    if (playSample("bomb", { gain: 1 })) return;
    playNoise(0.4, 0.09, 260);
  },
  warning() {
    if (playSample("warning", { gain: 0.7 })) return;
    playTone(96, 0.36, "sawtooth", 0.032, 240);
  },
  wave() {
    if (playSample("wave", { gain: 0.6 })) return;
    playTone(660, 0.12, "triangle", 0.03, 990);
  },
  perfect() {
    if (playSample("perfect", { gain: 0.75 })) return;
    playTone(880, 0.05, "square", 0.028, 1320);
  },
  overdrive() {
    if (playSample("overdrive", { gain: 0.75 })) return;
    playTone(880, 0.05, "square", 0.028, 1320);
  },
  select() {
    if (playSample("select", { gain: 0.5 })) return;
    playTone(520, 0.03, "square", 0.02, 720);
  },
  gameover() {
    if (playSample("gameover", { gain: 0.85 })) return;
    playTone(320, 0.4, "sawtooth", 0.04, 90);
  },
  extralife() {
    if (playSample("extralife", { gain: 0.8 })) return;
    playTone(880, 0.12, "triangle", 0.03, 1320);
  },
  bossAppear() {
    if (playSample("bossArrive", { gain: 0.95 })) return;
    playTone(96, 0.5, "sawtooth", 0.04, 200);
  },
  bossDown(x) {
    if (playSample("bossDown", { gain: 1, x })) return;
    playNoise(0.4, 0.09, 300);
  },
  turretDown(x) {
    if (playSample("turretDown", { gain: 0.75, x })) return;
    playNoise(0.2, 0.07, 500);
  },
  dive(x) {
    if (playSample("dive", { gain: 0.42, rate: 0.95 + Math.random() * 0.12, x })) return;
    playTone(900, 0.3, "sawtooth", 0.02, 300);
  },
  ace(combo = 1, x) {
    if (playSample("shatterBig", { gain: 0.8, rate: clamp(0.95 + (combo - 1) * 0.1, 0.95, 1.3), x })) return;
    playTone(880, 0.05, "square", 0.028, 1320);
    setTimeout(() => playTone(1180, 0.045, "triangle", 0.022, 760), 38);
  },
  heartbeat(k) {
    // lub-dub: a second, softer thump right behind the first
    const gain = 0.32 + 0.5 * k;
    if (!playSample("heartbeat", { gain })) { playTone(62, 0.12, "sine", 0.05 * gain, 44); return; }
    playSample("heartbeat", { gain: gain * 0.62, rate: 0.9, delay: 0.17 });
  },
  saucerHum(x) { return startLoop("saucer", 0.34, x); },
  saucerDown(x) {
    if (playSample("saucerDown", { gain: 0.95, x })) return;
    playNoise(0.3, 0.08, 600);
  },
  perkOffer() {
    if (playSample("perkOffer", { gain: 0.7 })) return;
    playTone(660, 0.12, "triangle", 0.03, 990);
  },
  perkPick() {
    if (playSample("perkPick", { gain: 0.8 })) return;
    playTone(520, 0.1, "square", 0.03, 1040);
  },
  medal() {
    if (playSample("medal", { gain: 0.7 })) return;
    playTone(990, 0.14, "triangle", 0.03, 1480);
  },
  split(x) {
    if (playSample("split", { gain: 0.55, x })) return;
    playNoise(0.08, 0.04, 1200);
  },
  deflect(x) {
    const now = performance.now();
    if (now - lastHitSound < 45) return;
    lastHitSound = now;
    if (playSample("deflect", { gain: 0.42, rate: 0.92 + Math.random() * 0.16, x })) return;
    playTone(1400, 0.05, "triangle", 0.02, 1800);
  },
  blink(x) {
    if (playSample("blink", { gain: 0.5, x })) return;
    playTone(1600, 0.06, "sine", 0.02, 600);
  },
  snipe(x) {
    if (playSample("snipe", { gain: 0.6, x })) return;
    playTone(1800, 0.1, "sawtooth", 0.02, 400);
  },
  slowmo() {
    if (playSample("slowmo", { gain: 0.75 })) return;
    playTone(120, 0.5, "sine", 0.04, 50);
  },
  swoop() {
    if (playSample("swoop", { gain: 0.7 })) return;
    playNoise(0.5, 0.05, 500);
  },
  sector() {
    if (playSample("sector", { gain: 0.8 })) return;
    playTone(220, 0.6, "sawtooth", 0.03, 880);
  },
  shutter() {
    if (playSample("shutter", { gain: 0.8 })) return;
    playNoise(0.05, 0.05, 2400);
  }
};

function buzz(ms) {
  if (settings.rumble !== "on" || !navigator.vibrate) return;
  try { navigator.vibrate(ms); } catch (error) {}
}

function sanitizeInitials(value) {
  return (value || "YOU").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3).padEnd(3, "A");
}

function localScoresKey() {
  return game.mode === "daily" ? LOCAL_DAILY_PREFIX + DAILY_KEY.replace(/-/g, "") : game.mode === "bossrush" ? LOCAL_RUSH_KEY : LOCAL_SCORES_KEY;
}

function loadLocalScores() {
  try {
    return JSON.parse(localStorage.getItem(localScoresKey())) || [];
  } catch (error) {
    return [];
  }
}

function saveLocalScores(scores) {
  try {
    localStorage.setItem(localScoresKey(), JSON.stringify(scores));
  } catch (error) {}
}

function addLocalScore(initials, score, wave) {
  const entry = { initials, score, wave, ts: Date.now() };
  const scores = loadLocalScores();
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  scores.length = Math.min(scores.length, 10);
  saveLocalScores(scores);
  try {
    localStorage.setItem(LAST_INITIALS_KEY, initials);
  } catch (error) {}
  return entry.ts;
}

async function fetchGlobalScores() {
  const slug = scoresSlug();
  const now = Date.now();
  if (globalScoresCache[slug] && now - (globalScoresCacheTime[slug] || 0) < 30000) return globalScoresCache[slug];
  try {
    const response = await fetch(SCORES_BASE + slug);
    if (response.ok) {
      const data = await response.json();
      globalScoresCache[slug] = Array.isArray(data) ? data : (data && data.scores) || [];
      globalScoresCacheTime[slug] = now;
      return globalScoresCache[slug];
    }
  } catch (error) {}
  return globalScoresCache[slug] || [];
}

async function submitGlobalScore(initials, score, wave) {
  const slug = scoresSlug();
  try {
    await fetch(SCORES_BASE + slug, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initials, score, wave, mode: game.mode, modifier: activeModifier().id })
    });
    globalScoresCache[slug] = null;
  } catch (error) {}
}

function scoreRows(scores, highlightTs) {
  if (!scores.length) return `<div style="opacity:.58">No scores yet</div>`;
  return scores.slice(0, 5).map((entry, index) => (
    `<div class="score-row${entry.ts === highlightTs ? " gold" : ""}">`
    + `<span>${index + 1}.</span>`
    + `<span>${entry.initials || "---"}</span>`
    + `<span>W${entry.wave || "?"} ${Number(entry.score || 0).toLocaleString()}</span>`
    + `</div>`
  )).join("");
}

function renderScores(includeEntry = false, highlightTs = 0) {
  let lastInitials = "YOU";
  try { lastInitials = sanitizeInitials(localStorage.getItem(LAST_INITIALS_KEY) || "YOU"); } catch (error) {}
  const entryHtml = includeEntry && scored() && game.score > 0 && !game.scoreSubmitted
    ? `<div class="score-entry"><div class="score-entry-title">Enter Initials</div><input id="initialsInput" maxlength="3" value="${lastInitials}" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="done" aria-label="Initials"><button id="submitScoreButton" type="button">Save Score</button></div>`
    : "";
  // practice runs aren't scored; their board view shows the Arcade tables
  const boardMode = game.mode === "practice" ? "classic" : game.mode;
  const savedMode = game.mode;
  game.mode = boardMode;
  const local = loadLocalScores();
  game.mode = savedMode;
  const label = MODE_LABELS[boardMode] || "Arcade Run";
  scoresPanel.innerHTML = `
    ${entryHtml}
    <h2>Local High Scores · ${label}</h2>
    <div>${scoreRows(local, highlightTs)}</div>
    <h2>Global High Scores · ${label}</h2>
    <div id="globalScoreRows" style="opacity:.68">Loading...</div>
  `;
  game.mode = boardMode;
  const pending = fetchGlobalScores();
  game.mode = savedMode;
  pending.then(scores => {
    const target = document.getElementById("globalScoreRows");
    if (!target) return;
    target.style.opacity = "1";
    target.innerHTML = scoreRows(scores);
  });
}

function showScores(includeEntry = false, highlightTs = 0) {
  hideSubPanels();
  renderScores(includeEntry, highlightTs);
  scoresPanel.classList.remove("hidden");
  scoresButton.textContent = "Hide Scores";
}

function hideScores() {
  scoresPanel.classList.add("hidden");
  scoresButton.textContent = "High Scores";
}

// Settings / medals / practice / share live in the title panel; one shows at a time.
const SUB_PANELS = () => [settingsPanel, medalsPanel, practicePanel, sharePanel];
function hideSubPanels() {
  for (const panel of SUB_PANELS()) panel.classList.add("hidden");
  hideScores();
}
function toggleSubPanel(panel, render) {
  const open = !panel.classList.contains("hidden");
  hideSubPanels();
  if (open) return false;
  render();
  panel.classList.remove("hidden");
  panel.scrollIntoView({ block: "nearest" });
  return true;
}

function bestWave() {
  try { return Math.max(1, parseInt(localStorage.getItem(BEST_WAVE_KEY) || "1", 10) || 1); } catch (error) { return 1; }
}
function noteBestWave(wave) {
  if (wave <= bestWave()) return;
  try { localStorage.setItem(BEST_WAVE_KEY, String(wave)); } catch (error) {}
}

function renderPractice() {
  const best = Math.min(bestWave(), 60);
  const waves = [];
  for (let w = 1; w <= best; w++) {
    if (best <= 16 || w === 1 || w % 4 === 0 || w % 4 === 1 || w === best) waves.push(w);
  }
  practicePanel.innerHTML = `
    <h2>Practice · start at any wave you've reached</h2>
    <p class="panel-note">Practice runs aren't scored and don't earn medals. Starting later hands you one random upgrade for every warship skipped.</p>
    <div class="wave-chips">
      ${waves.map(w => `<button type="button" class="chip${w % 4 === 0 ? " boss" : ""}" data-wave="${w}">${w}${w % 4 === 0 ? " ★" : ""}</button>`).join("")}
    </div>
    ${best <= 1 ? '<p class="panel-note">Play an Arcade Run or Daily Challenge to unlock later waves.</p>' : ""}`;
}

function unlockMedal(id) {
  if (!medals || !scored()) return;
  medals.unlock(id);
}

function renderDailyNote() {
  if (!dailyNote) return;
  dailyNote.innerHTML = `<span class="daily-badge">Daily · ${DAILY_KEY}</span><span>Today's modifier: <b>${DAILY_MODIFIER.name}</b> — ${DAILY_MODIFIER.tip}</span>`;
}

function resize() {
  // Game logic runs at the Classic Edition's phone-ish dimensions (max ~595x960) so the
  // rules and balance are identical; the 3D stage fills the whole window around it.
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const H = Math.min(vh, 960);
  viewScale = vh / H;
  const W = Math.min(Math.floor(vw / viewScale), Math.max(560, Math.round(H * 0.62)));
  game.compact = W < 560 || (H < 560 && navigator.maxTouchPoints > 0);
  game.lowPower = game.compact || (navigator.maxTouchPoints > 0 && Math.min(vw, vh) < 760);
  game.width = W;
  game.height = H;
  game.scale = Math.min(game.width / 1180, game.height / 760);
  game.fxLow = game.lowPower || game.autoLow;
  if (stage) {
    const root = document.documentElement;
    const placeHud = () => {
      const field = stage.fieldScreen();
      let gutter = Math.max(0, Math.round(Math.min(field.left, vw - field.right)));
      if (gutter < 24) gutter = 0; // a sliver of margin on phones: let the HUD use the full width
      root.style.setProperty("--gutter", gutter + "px");
      return gutter;
    };
    stage.resize(vw, vh);
    // The bomb / pause / mute buttons go beside the arena when there is room; otherwise the
    // HUD drops to four meters so the buttons never cover it.
    const wideGutter = placeHud() >= 170;
    const compactHud = !wideGutter || (window.matchMedia && matchMedia("(max-width: 760px), (pointer: coarse)").matches);
    const before = root.className;
    root.classList.toggle("wide-gutter", wideGutter);
    root.classList.toggle("compact-hud", compactHud);
    if (root.className !== before) {
      // the camera fit keeps the arena below the HUD, so refit once for the new HUD height
      stage.resize(vw, vh);
      placeHud();
    }
  }
  if (game.player) {
    syncPlayerLane();
    if (game.shields.length) makeShields(true);
  }
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distSq(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function movingCircleHit(b, target, radius) {
  const bx1 = b.px ?? b.x;
  const by1 = b.py ?? b.y;
  const tx1 = target.prevX ?? target.x;
  const ty1 = target.prevY ?? target.y;
  return segmentCircleHit(
    bx1 - tx1,
    by1 - ty1,
    b.x - target.x,
    b.y - target.y,
    0,
    0,
    radius
  );
}

function invaderHitRadius(inv, bullet) {
  const diveBonus = inv.divePhase === "swoop" ? 13 : inv.divePhase ? 9 : 3;
  return (bullet.r || 1) + inv.r + diveBonus;
}

function firstInvaderHit(b) {
  let best = null;
  for (const inv of game.invaders) {
    if (inv.ghost) continue;
    const radius = invaderHitRadius(inv, b);
    const t = movingCircleHit(b, inv, radius);
    if (t === null || (best && t >= best.t)) continue;
    best = { inv, t };
  }
  return best;
}

function playerLaneY() {
  const mobile = game.compact;
  const bottomGap = mobile
    ? clamp(game.height * 0.11, 66, 88)
    : Math.max(72, 86 * game.scale);
  return game.height - bottomGap;
}

function syncPlayerLane() {
  if (!game.player) return;
  game.player.y = playerLaneY();
  game.player.x = clamp(game.player.x, 36, game.width - 36);
}

function resetGame(mode, startWave) {
  game.mode = MODE_LABELS[mode] ? mode : "classic";
  game.state = "playing";
  game.time = 0;
  game.last = performance.now();
  game.score = 0;
  game.perks = {};
  game.stats = { saucers: 0, diveTags: 0, overdrives: 0, perks: 0, bosses: 0 };
  game.chain = 0;
  game.cineGuard = 0;
  removeSaucer();
  game.practiceStart = game.mode === "practice" ? Math.max(1, startWave || game.practiceStart || 1) : 1;
  game.wave = game.mode === "bossrush" ? 4 : game.mode === "practice" ? game.practiceStart : 1;
  game.lives = maxLives();
  game.bombs = hasMod("boss-rush") || game.mode === "bossrush" ? 3 : 2;
  game.nextBombWave = game.wave + 2;
  game.combo = 1;
  game.comboTimer = 0;
  game.overdrive = 0;
  game.hitStop = 0;
  game.slowmo = 0;
  game.shake = 0;
  game.rings = [];
  game.waveDamage = 0;
  game.perfectStreak = 0;
  game.bullets = [];
  game.enemyBullets = [];
  game.particles = [];
  game.powerups = [];
  game.pickupLabels = [];
  game.waveBanner = null;
  game.screenFlash = 0;
  game.powerFlash = null;
  game.shields = [];
  game.boss = null;
  game.scoreSubmitted = false;
  overlay.classList.remove("game-over");
  game.nextShot = 0;
  game.nextEnemyShot = 1.35;
  game.waveClearTimer = 0;
  game.lastMuzzleBurst = 0;
  touchAim.active = false;
  touchAim.x = null;
  touchAim.pointerId = null;
  game.player = {
    x: game.width / 2,
    y: playerLaneY(),
    r: 18,
    vx: 0,
    shield: 88,
    invulnerable: 0,
    dash: 0,
    weapon: hasMod("laser-storm") ? "laser" : "pulse",
    weaponTimer: hasMod("laser-storm") ? 1e9 : 0,
    heat: 0
  };
  // Practice from a later wave: one random upgrade per warship skipped.
  if (game.mode === "practice") {
    const kit = Math.floor((game.wave - 1) / 4);
    for (let i = 0; i < kit; i++) {
      const pool = availablePerks();
      if (pool.length) applyPerk(pool[Math.floor(Math.random() * pool.length)], true);
    }
    game.lives = maxLives();
  }
  game.sector = sectorForWave();
  stage.setSector(game.sector, false);
  hideSubPanels();
  shareButton.classList.add("hidden");
  makeShields();
  spawnWave();
  playMusic(game.boss ? "boss" : "gameplay");
  overlay.classList.add("hidden");
  setControlsVisible(true);
  requestWakeLock();
  updateHud();
}

function makeShields(preserveDamage = false) {
  const oldShields = preserveDamage ? game.shields.slice() : [];
  const nextShields = [];
  const shieldHp = (hasMod("iron-bunkers") ? 5 : 3) + perkLevel("bunkers") * 2;
  const mask = [
    "000111111000",
    "001111111100",
    "011111111110",
    "111111111111",
    "111111111111",
    "111111111111",
    "111100001111",
    "111000000111",
    "110000000011"
  ];
  const cell = game.compact ? clamp(game.width / 72, 4.55, 5.9) : clamp(game.width / 57, 5.9, 9.5);
  const bunkerWidth = mask[0].length * cell;
  const bunkerHeight = mask.length * cell;
  const gap = game.width / 4;
  const playerY = playerLaneY();
  const safeGap = game.compact
    ? clamp(game.height * 0.078, 46, 66)
    : clamp(game.height * 0.075, 54, 78);
  const top = playerY - bunkerHeight - safeGap;
  let i = 0;
  for (let s = 1; s <= 3; s++) {
    const left = gap * s - bunkerWidth / 2;
    for (let row = 0; row < mask.length; row++) {
      for (let col = 0; col < mask[row].length; col++) {
        if (mask[row][col] !== "1") continue;
        const oldShield = oldShields[i];
        const oldRatio = oldShield ? clamp(oldShield.hp / Math.max(1, oldShield.maxHp || 1), 0, 1) : 1;
        nextShields.push({
          x: left + col * cell + cell / 2,
          y: top + row * cell + cell / 2,
          w: cell * 0.92,
          h: cell * 0.92,
          hp: oldShield ? Math.ceil(oldRatio * shieldHp) : shieldHp,
          maxHp: shieldHp,
          flash: oldShield ? oldShield.flash || 0 : 0,
          scar: oldShield ? oldShield.scar : rand(0, TAU)
        });
        i += 1;
      }
    }
  }
  game.shields = nextShields;
}

function spawnWave() {
  game.invaders = [];
  game.bullets = [];
  game.enemyBullets = [];
  game.boss = null;
  game.waveDamage = 0;
  removeSaucer();
  const rush = game.mode === "bossrush";
  const bossEvery = hasMod("boss-rush") ? 2 : 4;
  game.bossWave = rush || game.wave % bossEvery === 0;
  const bossOrdinal = rush ? displayWave() : game.bossWave ? Math.floor(game.wave / bossEvery) : 0;
  if (game.bossWave) game.bossKind = BOSS_KINDS[(bossOrdinal - 1) % BOSS_KINDS.length];
  game.invaderDir = 1;
  game.invaderStepTimer = 0;
  game.invaderMarchTimer = 0;
  game.invaderFrame = 0;
  game.nextDive = game.time + drand(9001, 2.4, 4.8);
  // one bonus saucer chance per normal wave
  game.nextSaucer = !game.bossWave && game.wave >= 2 && Math.random() < 0.8 ? game.time + rand(6, 14) : Infinity;
  const bossSub = game.bossKind === "interceptor" ? "Fast strike frigate"
    : game.bossKind === "bulwark" ? "Shielded siege platform"
    : game.bossKind === "hive" ? "Swarm mothership"
    : "Capital ship contact";
  let subtext = game.bossWave ? bossSub : game.wave % 3 === 0 ? "Red dive squadron" : game.wave % 2 === 0 ? "Striker pressure rising" : "Alien formation advancing";
  // a new star sector every few waves: the sky, planet and rings change as the fleet runs
  if (game.state === "playing") {
    const sec = sectorForWave();
    if (sec !== game.sector) {
      game.sector = sec;
      const name = stage.setSector(sec, false);
      subtext = `Sector ${sec + 1} · ${name}`;
      sfx.sector();
      game.screenFlash = Math.max(game.screenFlash, 0.25);
      game.flashColor = "53, 244, 255";
      if (sec >= 2) unlockMedal("sector3");
    }
    if (game.mode === "classic" || game.mode === "daily") {
      noteBestWave(game.wave);
      if (game.wave >= 20) unlockMedal("wave20");
    }
  }
  game.waveBanner = {
    text: game.bossWave ? BOSS_NAMES[game.bossKind] + " INBOUND" : `WAVE ${game.wave}`,
    subtext,
    life: game.bossWave ? 2.8 : 2.05,
    maxLife: game.bossWave ? 2.8 : 2.05,
    boss: game.bossWave
  };
  const mobileFormation = game.compact;
  let cols = game.bossWave
    ? clamp(5 + Math.floor(game.wave / 6), 5, mobileFormation ? 6 : 7)
    : mobileFormation
      ? clamp(6 + Math.floor(game.wave / 4), 6, 8)
      : clamp(8 + Math.floor(game.wave / 2), 8, 13);
  const rowsTarget = game.bossWave ? 2 : clamp(4 + Math.floor(game.wave / 3), 4, mobileFormation ? 8 : 7);
  let spacingX = clamp(game.width / (cols + 1), mobileFormation ? 38 : 52, mobileFormation ? 58 : 84);
  if (!mobileFormation) {
    // Keep the formation narrow enough to march sideways inside the boxed column.
    const usable = game.width - 96;
    while (cols > 6 && (cols - 1) * spacingX > usable) {
      cols -= 1;
      spacingX = clamp(game.width / (cols + 1), 52, 84);
    }
  }
  const spacingY = clamp(44 * game.scale, 34, 52);
  const startX = game.width / 2 - (cols - 1) * spacingX / 2;
  const startY = Math.max(82, 98 * game.scale);
  const reservedBelow = mobileFormation ? 150 : 185;
  const maxRows = Math.max(game.bossWave ? 1 : 2, Math.floor((playerLaneY() - startY - reservedBelow) / spacingY) + 1);
  const rows = Math.min(rowsTarget, maxRows);
  const doubleDivers = hasMod("double-divers");
  const splitterChance = game.wave >= 3 ? clamp(0.1 + game.wave * 0.012, 0.1, 0.32) : 0;
  const zealotChance = doubleDivers ? 0.7 : game.wave >= 5 ? clamp(0.12 + game.wave * 0.015, 0.12, 0.45) : 0;
  const wardenChance = game.wave >= 6 ? clamp(0.08 + game.wave * 0.01, 0.08, 0.26) : 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let type = y === 0 ? "diver" : y < 3 ? "striker" : "drone";
      if (doubleDivers && y === 1) type = "diver";
      if (type === "drone" && gpAt(y * 131 + x * 7 + 1) < splitterChance) type = "splitter";
      if (type === "striker" && gpAt(y * 131 + x * 7 + 3) < wardenChance) type = "warden";
      const zealot = type === "diver" && gpAt(y * 131 + x * 7 + 2) < zealotChance;
      const hp = type === "diver" ? 2 + Math.floor(game.wave / 4)
        : type === "striker" ? 2 + Math.floor(game.wave / 9)
        : type === "splitter" ? 3 + Math.floor(game.wave / 6)
        : type === "warden" ? 2 + Math.floor(game.wave / 7)
        : 1 + Math.floor(game.wave / 11);
      const inv = {
        x: startX + x * spacingX,
        y: startY + y * spacingY,
        baseX: startX + x * spacingX,
        baseY: startY + y * spacingY,
        homeX: startX + x * spacingX,
        homeY: startY + y * spacingY,
        r: type === "drone" ? 14 : type === "splitter" ? 17 : 16,
        type,
        zealot,
        hp,
        maxHp: hp,
        col: x,
        row: y
      };
      if (type === "warden") {
        // a frontal energy barrier soaks straight shots; angled ones get round it
        inv.barrier = 4 + Math.floor(game.wave / 4);
        inv.barrierMax = inv.barrier;
      }
      game.invaders.push(inv);
    }
  }
  // Phantoms: snipers that blink between spots above the formation and fire an aimed needle.
  if (!game.bossWave && game.wave >= 8) {
    const count = game.compact ? 1 : clamp(1 + Math.floor((game.wave - 8) / 6), 1, 3);
    for (let i = 0; i < count; i++) {
      const px = game.width * (i + 1) / (count + 1);
      const py = Math.max(44, startY - spacingY * 0.95);
      const hp = 2 + Math.floor(game.wave / 8);
      game.invaders.push({
        x: px, y: py, baseX: px, baseY: py, homeX: px, homeY: py, anchorX: px, anchorY: py,
        r: 15, type: "phantom", solo: true, zealot: false, hp, maxHp: hp, col: cols + i, row: -1,
        phase: "hover", phaseTime: 0, next: drand(9300 + i, 1.6, 3.2), fade: 1, ghost: false
      });
    }
  }
  game.waveStartCount = game.invaders.filter(inv => !inv.solo).length;
  if (game.bossWave) spawnBoss(game.bossKind);
}

function spawnBoss(kind) {
  game.bossKind = kind;
  const baseHp = 48 + game.wave * 9;
  const hpMul = kind === "interceptor" ? 0.68 : kind === "bulwark" ? 1.5 : kind === "hive" ? 1.1 : 1;
  const hp = Math.round(baseHp * hpMul);
  game.shake = Math.max(game.shake, 7);
  sfx.bossAppear();
  const boss = {
    kind,
    x: game.width / 2,
    y: -88,
    targetY: Math.max(52, 62 * game.scale),
    r: kind === "interceptor" ? 46 : kind === "bulwark" ? 64 : kind === "hive" ? 54 : 58,
    hp,
    maxHp: hp,
    nextPowerDropHp: hp * drand(9100, 0.46, 0.58),
    phase: 0,
    intro: 1.85,
    shot: 0.9,
    attackIndex: 0,
    warning: 0,
    warningX: game.width / 2,
    pendingBeam: false,
    strafe: 0,
    strafeDir: 1,
    turrets: []
  };
  if (kind === "bulwark") {
    const offs = game.compact ? [-52, 52] : [-92, 92];
    const turretHp = 9 + Math.floor(game.wave / 2);
    for (const ox of offs) {
      boss.turrets.push({
        ox,
        oy: 16,
        r: 15,
        hp: turretHp,
        maxHp: turretHp,
        shot: drand(9200 + ox, 0.6, 1.4),
        dead: false,
        flash: 0,
        x: game.width / 2 + ox,
        y: boss.targetY + 16
      });
    }
  }
  if (kind === "hive") {
    // guard drones on an orbit around the hull: they soak shots and grow back
    const n = game.compact ? 4 : 6;
    const satHp = 3 + Math.floor(game.wave / 6);
    boss.sats = [];
    for (let i = 0; i < n; i++) {
      boss.sats.push({ a: i / n * TAU, x: boss.x, y: boss.y, r: 12, hp: satHp, maxHp: satHp, dead: false, regen: 0, type: "drone", sat: true, col: i, row: 0, h: 30 });
    }
  }
  game.boss = boss;
  if (game.state === "playing") {
    playMusic("boss");
    // the camera swoops in to meet it; the escorts hold fire until the swoop is over
    if (stage.events.bossIntro()) sfx.swoop();
  }
  return boss;
}

function bossTurretsAlive(boss) {
  return boss.turrets && boss.turrets.some(t => !t.dead);
}

function firePlayer() {
  if (game.time < game.nextShot || game.state !== "playing") return;
  const p = game.player;
  const od = game.overdrive > 0;
  let rapid = p.weapon === "laser" ? 0.055 : p.weapon === "spread" ? 0.13 : 0.11;
  if (od) rapid *= 0.62;
  rapid *= 1 - perkLevel("cycler") * 0.12;
  game.nextShot = game.time + rapid;
  p.heat = Math.min(1, p.heat + 0.18);
  const pierce = od ? 2 : 0;
  const bonus = od ? 1 : 0;
  if (p.weapon === "spread") {
    [-0.28, -0.13, 0, 0.13, 0.28].forEach(angle => {
      game.bullets.push(makeBullet(p.x, p.y - 24, Math.sin(angle) * 230, -680 * Math.cos(angle), 5, od ? colors.gold : colors.bullet, 1 + bonus, pierce));
    });
  } else if (p.weapon === "laser") {
    game.bullets.push(makeBullet(p.x - 8, p.y - 27, 0, -860, 4, od ? colors.gold : colors.player, 2 + bonus, pierce));
    game.bullets.push(makeBullet(p.x + 8, p.y - 27, 0, -860, 4, od ? colors.gold : colors.player, 2 + bonus, pierce));
  } else {
    game.bullets.push(makeBullet(p.x, p.y - 26, 0, -720, 5, od ? colors.gold : colors.bullet, 1 + bonus, pierce));
    if (od) {
      game.bullets.push(makeBullet(p.x, p.y - 26, -155, -700, 4, colors.gold, 1, pierce));
      game.bullets.push(makeBullet(p.x, p.y - 26, 155, -700, 4, colors.gold, 1, pierce));
    }
  }
  if (!game.fxLow || game.time - game.lastMuzzleBurst > 0.09) {
    game.lastMuzzleBurst = game.time;
    burst(p.x, p.y - 24, od ? colors.gold : colors.player, game.fxLow ? 1 : od ? 5 : 3, 70);
  }
  sfx.shot(p.weapon, p.x);
}

function makeBullet(x, y, vx, vy, r, color, damage, pierce = 0) {
  return { x, y, vx, vy, r, color, damage, pierce, life: 2.2 };
}

function enemyFire(x, y, speed = 250, spread = 0, options = {}) {
  const p = game.player;
  const dx = p.x - x;
  const dy = p.y - y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx) + spread;
  game.enemyBullets.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: options.r || 6,
    color: options.color || colors.enemy2,
    life: options.life || 4,
    style: options.style || "fireball"
  });
}

function bossBeam(x, y) {
  [-10, 0, 10].forEach(offset => {
    game.enemyBullets.push({
      x: x + offset,
      y,
      vx: offset * 2,
      vy: 460 + game.wave * 11,
      r: 8,
      color: colors.enemy3,
      life: 3,
      style: "beam"
    });
  });
}

function enemyBomb(x, y, speed = 240, drift = 0) {
  game.enemyBullets.push({
    x,
    y,
    vx: drift,
    vy: speed,
    r: 6,
    color: colors.enemy2,
    life: 4
  });
  sfx.enemy(x);
}

function enemyShotDamage() {
  return Math.round(clamp(17 + game.wave * 1.75, 18, 38));
}

function update(realDt) {
  // These run on real time so freeze/slow-mo feel snappy and self-terminate.
  game.hitStop = Math.max(0, game.hitStop - realDt);
  game.slowmo = Math.max(0, game.slowmo - realDt);
  game.cineGuard = Math.max(0, game.cineGuard - realDt);
  // flashes fade on real time, so slow motion never holds the screen white
  game.screenFlash = Math.max(0, game.screenFlash - realDt * 3.8);
  updateRings(realDt);
  adaptQuality(realDt);
  if (game.state !== "playing") { game.timeScale = 1; return; }
  const timeScale = game.hitStop > 0 ? 0 : game.slowmo > 0 ? 0.32 : 1;
  game.timeScale = timeScale;
  const dt = realDt * timeScale;
  if (dt <= 0) return;
  const p = game.player;
  game.time += dt;
  game.overdrive = Math.max(0, game.overdrive - dt);
  syncPlayerLane();
  game.shake = Math.max(0, game.shake - dt * 18);
  game.comboTimer = Math.max(0, game.comboTimer - dt);
  if (game.comboTimer === 0) { game.combo = 1; game.chain = 0; }

  const padX = pad.axisX;
  const left = keys.has("ArrowLeft") || keys.has("KeyA") || padX < -0.02;
  const right = keys.has("ArrowRight") || keys.has("KeyD") || padX > 0.02;
  const fire = keys.has("Space") || keys.has("Enter") || touchAim.active || pad.fire;
  const dashPressed = keys.has("ShiftLeft") || keys.has("ShiftRight") || pad.dash;
  pad.dash = false;
  const accel = 2100;
  const maxSpeed = dashPressed && p.dash <= 0 ? 680 : 410;

  // Keyboard / controller override a parked mouse-hover target; an active press always wins.
  if (!touchAim.active && (left || right)) touchAim.x = null;
  const steering = touchAim.x !== null;
  if (steering) {
    const target = clamp(touchAim.x, 30, game.width - 30);
    const delta = target - p.x;
    p.vx = clamp(delta * 9, -maxSpeed, maxSpeed);
    if (Math.abs(delta) < 3) p.vx *= 0.35;
  } else if (padX) {
    // analog stick: speed follows how far it is pushed
    p.vx += (padX * maxSpeed - p.vx) * Math.min(1, dt * 14);
  } else if (left) p.vx -= accel * dt;
  if (!steering && !padX && right) p.vx += accel * dt;
  if (!steering && !left && !right) p.vx *= Math.pow(0.0008, dt);
  p.vx = clamp(p.vx, -maxSpeed, maxSpeed);
  p.x = clamp(p.x + p.vx * dt, 30, game.width - 30);
  p.invulnerable = Math.max(0, p.invulnerable - dt);
  p.dash = Math.max(0, p.dash - dt);
  p.heat = Math.max(0, p.heat - dt * 0.65);
  if (dashPressed && p.dash <= 0 && (left || right)) {
    p.vx = (right ? 1 : -1) * 760;
    p.dash = perkLevel("phase") ? 0.6 : 1.2;
    p.invulnerable = Math.max(p.invulnerable, perkLevel("phase") ? 0.42 : 0.18);
    burst(p.x, p.y + 8, colors.player, 18, 220);
  }
  if (fire) firePlayer();

  if (p.weaponTimer > 0) {
    p.weaponTimer -= dt;
    if (p.weaponTimer <= 0) p.weapon = "pulse";
  }

  updateInvaders(dt);
  updatePhantoms(dt);
  updateBoss(dt);
  updateSaucer(dt);
  updateBullets(dt);
  updateEnemyBullets(dt);
  updateParticles(dt);
  updatePowerups(dt);
  updatePickupLabels(dt);
  updateWaveBanner(dt);
  updateVisualEffects(dt);
  updateShields(dt);
  checkWaveClear(dt);
  updateHud();
}

function updateInvaders(dt) {
  const formation = game.invaders.filter(inv => !inv.solo);
  const liveCount = Math.max(1, formation.length);
  const urgency = clamp((game.bossWave ? 14 : 52) / liveCount, 1, 3.8);
  game.invaderMarchTimer += dt;
  for (const inv of game.invaders) {
    inv.prevX = inv.x;
    inv.prevY = inv.y;
  }
  const baseInterval = game.bossWave ? 0.72 : 0.68;
  const waveRamp = clamp(1 + game.wave * 0.075, 1, 2.1);
  const timeRamp = clamp(1 + game.invaderMarchTimer * 0.06, 1, 2.85);
  const thinningRamp = 1 + (urgency - 1) * 0.42;
  const interval = baseInterval / (timeRamp * thinningRamp);
  const stepX = (game.compact ? 8.5 : 13) * waveRamp * game.invaderDir;
  const dropY = (game.compact ? 13 : 17) * clamp(1 + game.wave * 0.035, 1, 1.55);
  let lowest = 0;
  game.invaderStepTimer += dt;
  if (game.invaderStepTimer >= interval && formation.length) {
    game.invaderStepTimer = 0;
    game.invaderFrame = 1 - game.invaderFrame;
    sfx.step(game.invaderFrame);
    let hitEdge = false;
    for (const inv of formation) {
      const nextX = (inv.homeX ?? inv.x) + stepX;
      if (nextX < inv.r + 14 || nextX > game.width - inv.r - 14) {
        hitEdge = true;
        break;
      }
    }
    if (hitEdge) {
      game.invaderDir *= -1;
      for (const inv of formation) {
        inv.homeY = (inv.homeY ?? inv.y) + dropY;
        if (!inv.divePhase) inv.y = inv.homeY;
      }
    } else {
      for (const inv of formation) {
        inv.homeX = (inv.homeX ?? inv.x) + stepX;
        if (!inv.divePhase) inv.x = inv.homeX;
      }
    }
  }
  updateDiverAttacks(dt);
  // `lowest` (divers included) picks the firing row as before; `landed` only counts ships
  // still in formation, so a dive the player dodges no longer counts as the fleet landing.
  let landed = 0;
  for (const inv of game.invaders) {
    if (inv.solo) continue;
    lowest = Math.max(lowest, inv.y);
    if (!inv.divePhase) landed = Math.max(landed, inv.y);
  }

  // escorts hold fire while the camera swoops in on an arriving warship
  if (!(game.boss && game.boss.intro > 0)) game.nextEnemyShot -= dt;
  if (game.nextEnemyShot <= 0 && formation.length) {
    const bottomY = lowest; // already = max inv.y over the formation (computed above)
    const shooters = formation.filter(inv => !inv.divePhase && inv.y >= bottomY - 4);
    if (shooters.length) {
      const volley = clamp(1 + Math.floor((game.wave - 3) / 4), 1, game.compact ? 2 : 3);
      for (let i = 0; i < volley; i++) {
        const shooter = shooters[Math.floor(Math.random() * shooters.length)];
        enemyBomb(shooter.x, shooter.y + 14, 205 + game.wave * 13, rand(-24, 24));
      }
    }
    game.nextEnemyShot = clamp(1.34 - game.wave * 0.06, 0.32, 1.34) * (hasMod("laser-storm") ? 0.7 : 1);
  }

  if (landed > game.player.y - 42) hitPlayer(70);
}

function startDiverAttack(inv) {
  inv.divePhase = "warning";
  inv.diveTime = 0;
  inv.diveHit = false;
  inv.diveDir = inv.x < game.width / 2 ? 1 : -1;
  inv.diveCircleStart = rand(0, TAU);
  inv.diveStartX = inv.x;
  inv.diveStartY = inv.y;
  inv.diveWarning = inv.zealot ? 0.5 : 0.72;
  inv.commit = inv.commit || !!inv.zealot;
  inv.tilt = 0;
  burst(inv.x, inv.y, inv.zealot ? colors.gold : colors.enemy3, inv.zealot ? 14 : 8, inv.zealot ? 140 : 90);
}

function updateDiverAttacks(dt) {
  if (!game.bossWave && game.time >= game.nextDive) {
    const activeDive = game.invaders.some(inv => inv.divePhase);
    const candidates = activeDive ? [] : game.invaders.filter(inv => inv.type === "diver" && !inv.divePhase);
    if (candidates.length) startDiverAttack(candidates[Math.floor(Math.random() * candidates.length)]);
    game.nextDive = game.time + rand(game.compact ? 3.2 : 2.6, game.compact ? 5.8 : 4.8);
  }

  for (const inv of game.invaders) {
    if (!inv.divePhase) continue;
    const prevX = inv.x;
    inv.diveTime += dt;
    const p = game.player;
    if (inv.divePhase === "warning") {
      const homeX = inv.homeX ?? inv.baseX;
      const homeY = inv.homeY ?? inv.baseY;
      inv.x = homeX + Math.sin(game.time * 18 + inv.col) * 2.4;
      inv.y = homeY + Math.cos(game.time * 14 + inv.row) * 1.4;
      inv.tilt = Math.sin(game.time * 16) * 0.12;
      if (inv.diveTime >= (inv.diveWarning || 0.72)) {
        inv.divePhase = "circle";
        inv.diveTime = 0;
        inv.diveCircleStart = rand(0, TAU);
        inv.diveStartX = inv.x;
        inv.diveStartY = inv.y;
      }
    } else if (inv.divePhase === "circle") {
      const homeX = inv.homeX ?? inv.baseX;
      const homeY = inv.homeY ?? inv.baseY;
      const radius = game.compact ? 28 : 38;
      const angle = inv.diveCircleStart + inv.diveDir * inv.diveTime * TAU * 0.9;
      inv.x = homeX + Math.cos(angle) * radius;
      inv.y = homeY + Math.sin(angle) * radius * 0.62;
      if (inv.diveTime > 0.85) {
        sfx.dive(inv.x);
        inv.divePhase = "swoop";
        inv.diveTime = 0;
        inv.diveStartX = inv.x;
        inv.diveStartY = inv.y;
      }
    } else if (inv.divePhase === "swoop") {
      const duration = inv.commit
        ? (inv.mini ? 1.05 : clamp(1.5 - game.wave * 0.012, 1.15, 1.6))
        : clamp(2.35 - game.wave * 0.012, 1.75, 2.35);
      const t = clamp(inv.diveTime / duration, 0, 1);
      const ease = t * t * (3 - 2 * t);
      const targetX = p.x;
      const targetY = p.y - 8;
      const swayScale = inv.commit ? 0.55 : 1;
      const sway = Math.sin(t * Math.PI * 1.65) * (game.compact ? 42 : 72) * inv.diveDir * (1 - t * 0.12) * swayScale;
      const arc = Math.sin(t * Math.PI) * (game.compact ? 24 : 38);
      inv.x = inv.diveStartX + (targetX - inv.diveStartX) * ease + sway;
      inv.y = inv.diveStartY + (targetY - inv.diveStartY) * ease - arc;
      if (!inv.diveHit && distSq(inv, p) < (inv.r + p.r + 7) * (inv.r + p.r + 7)) {
        inv.diveHit = true;
        hitPlayer(inv.mini ? Math.round(enemyShotDamage() * 0.55) : enemyShotDamage() + (inv.zealot ? 12 : 8));
        burst(inv.x, inv.y, inv.zealot ? colors.gold : colors.enemy3, 16, 220);
        if (inv.commit) inv._crash = true;
      }
      if (t >= 1) {
        if (inv.commit) {
          burst(inv.x, inv.y, inv.mini ? colors.bullet : colors.enemy3, 18, 200);
          inv._crash = true;
        } else {
          inv.divePhase = "return";
          inv.diveTime = 0;
          inv.diveStartX = inv.x;
          inv.diveStartY = inv.y;
        }
      }
    } else {
      const homeX = inv.homeX ?? inv.baseX;
      const homeY = inv.homeY ?? inv.baseY;
      const duration = 1.25;
      const t = clamp(inv.diveTime / duration, 0, 1);
      const ease = t * t * (3 - 2 * t);
      const returnSway = Math.sin(t * Math.PI * 1.55) * (game.compact ? 30 : 48) * -inv.diveDir * (1 - t);
      const climbArc = Math.sin(t * Math.PI) * (game.compact ? 20 : 32);
      inv.x = inv.diveStartX + (homeX - inv.diveStartX) * ease + returnSway;
      inv.y = inv.diveStartY + (homeY - inv.diveStartY) * ease - climbArc;
      if (t >= 1) {
        inv.x = homeX;
        inv.y = homeY;
        inv.divePhase = null;
        inv.diveHit = false;
        inv.tilt = 0;
      }
    }
    if (inv.divePhase && inv.divePhase !== "warning") inv.tilt = clamp((inv.x - prevX) * 0.035, -0.38, 0.38);
  }
  if (game.invaders.some(i => i._crash)) game.invaders = game.invaders.filter(i => !i._crash);
}

// Phantoms hover above the formation, blink to a new spot, take aim (a dotted line shows
// where) and fire one fast needle. They can't be hit while blinking.
function phantomBandY() {
  let top = Infinity;
  for (const inv of game.invaders) if (!inv.solo && !inv.divePhase) top = Math.min(top, inv.homeY ?? inv.y);
  return clamp((top === Infinity ? 90 : top) - 40, 44, game.height * 0.4);
}

function updatePhantoms(dt) {
  const p = game.player;
  for (const inv of game.invaders) {
    if (inv.type !== "phantom") continue;
    inv.phaseTime += dt;
    if (inv.phase === "hover") {
      inv.fade = 1;
      inv.anchorY = Math.min(inv.anchorY, phantomBandY());
      inv.x = inv.anchorX + Math.sin(game.time * 1.6 + inv.col) * 18;
      inv.y = inv.anchorY + Math.cos(game.time * 1.3 + inv.col) * 6;
      if (inv.phaseTime >= inv.next && !(game.boss && game.boss.intro > 0)) {
        inv.phase = "out";
        inv.phaseTime = 0;
        inv.ghost = true;
        sfx.blink(inv.x);
        stage.events.blink(inv);
      }
    } else if (inv.phase === "out") {
      inv.fade = clamp(1 - inv.phaseTime / 0.32, 0, 1);
      if (inv.phaseTime >= 0.32) {
        inv.anchorX = clamp(p.x + rand(-1, 1) * game.width * 0.4, 50, game.width - 50);
        inv.anchorY = phantomBandY();
        inv.x = inv.anchorX;
        inv.y = inv.anchorY;
        inv.phase = "in";
        inv.phaseTime = 0;
        stage.events.blink(inv);
      }
    } else if (inv.phase === "in") {
      inv.fade = clamp(inv.phaseTime / 0.32, 0, 1);
      if (inv.phaseTime >= 0.32) {
        inv.fade = 1;
        inv.ghost = false;
        inv.phase = "aim";
        inv.phaseTime = 0;
        inv.aimTime = clamp(0.95 - game.wave * 0.008, 0.62, 0.95);
        inv.aimX = p.x;
      }
    } else if (inv.phase === "aim") {
      // tracks the ship loosely, then locks for the last stretch so a sidestep dodges it
      if (inv.phaseTime < inv.aimTime * 0.65) inv.aimX += (p.x - inv.aimX) * Math.min(1, dt * 4);
      if (inv.phaseTime >= inv.aimTime) {
        const dx = inv.aimX - inv.x;
        const dy = p.y - (inv.y + 12);
        const len = Math.max(1, Math.hypot(dx, dy));
        const speed = 520 + game.wave * 6;
        game.enemyBullets.push({ x: inv.x, y: inv.y + 12, vx: dx / len * speed, vy: dy / len * speed, r: 4, color: colors.phantom, life: 3, style: "needle" });
        burst(inv.x, inv.y + 12, colors.phantom, 10, 150, 32);
        sfx.snipe(inv.x);
        inv.phase = "hover";
        inv.phaseTime = 0;
        inv.next = rand(2.6, 4.4);
      }
    }
  }
}

// ---- bonus saucer -------------------------------------------------------------------------
function spawnSaucer() {
  const dir = Math.random() < 0.5 ? 1 : -1;
  const y = clamp(phantomBandY() - 10, 40, 70);
  game.saucer = { x: dir > 0 ? -50 : game.width + 50, y, baseY: y, vx: dir * (150 + Math.min(80, game.wave * 3)), r: 30, phase: 0, hum: null };
  game.saucer.hum = sfx.saucerHum(game.saucer.x);
  game.nextSaucer = Infinity;
}

function removeSaucer() {
  if (!game.saucer) return;
  stopLoop(game.saucer.hum);
  game.saucer = null;
}

function updateSaucer(dt) {
  const s = game.saucer;
  if (!s) {
    if (game.mode !== "bossrush" && !game.bossWave && game.invaders.length >= 4 && !game.waveBanner && game.time >= game.nextSaucer) spawnSaucer();
    return;
  }
  s.phase += dt;
  if (!game.invaders.length) s.vx *= 1 + dt * 2.5; // the wave is gone: it bolts
  s.x += s.vx * dt;
  s.y = s.baseY + Math.sin(s.phase * 2.4) * 5;
  panLoop(s.hum, s.x);
  if (s.x < -70 || s.x > game.width + 70) removeSaucer();
}

function killSaucer() {
  const s = game.saucer;
  if (!s) return;
  const table = [300, 500, 800, 1000];
  const base = Math.round(table[Math.floor(Math.random() * table.length)] * (1 + Math.floor(game.wave / 5) * 0.25) / 50) * 50;
  const got = addScore(base);
  addFloatText(s.x, s.y + 10, `UFO +${got.toLocaleString()}`, colors.player, 1.3);
  burst(s.x, s.y, colors.player, 30, 260, 46);
  burst(s.x, s.y, colors.enemy, 18, 200, 46);
  spawnRing(s.x, s.y, 140, "53, 244, 255", 5, 0.5);
  dropPowerup(s.x, s.y + 16);
  stage.events.saucerDown(s);
  sfx.saucerDown(s.x);
  rumble(0.3, 0.6, 160);
  game.shake = Math.max(game.shake, 6);
  removeSaucer();
  game.stats.saucers += 1;
  unlockMedal("saucer");
  if (game.stats.saucers >= 5) unlockMedal("saucer5");
}

// ---- Hive: a swarm mothership ringed by guard drones -------------------------------------------
function spawnMini(x, y, dir, col, row) {
  game.invaders.push({
    x, y, baseX: x, baseY: y, homeX: x, homeY: y,
    r: 10, type: "mini", zealot: false, hp: 1, maxHp: 1, col, row,
    mini: true, commit: true, divePhase: "swoop", diveTime: 0, diveHit: false,
    diveDir: dir, diveStartX: x, diveStartY: y, tilt: dir * 0.3
  });
}

function updateHive(boss, dt, targetY) {
  boss.x = game.width / 2 + Math.sin(boss.phase * 0.55) * game.width * 0.27;
  boss.y = targetY + 6 + Math.sin(boss.phase * 1.1) * 10;
  const R = game.compact ? 62 : 84;
  for (const sat of boss.sats) {
    sat.a += dt * 1.25;
    sat.prevX = sat.x;
    sat.prevY = sat.y;
    sat.x = boss.x + Math.cos(sat.a) * R;
    sat.y = boss.y + Math.sin(sat.a) * R * 0.5 + 8;
    sat.hitFlash = Math.max(0, (sat.hitFlash || 0) - dt * 4);
    if (sat.dead) {
      sat.regen -= dt;
      if (sat.regen <= 0) {
        sat.dead = false;
        sat.hp = sat.maxHp;
        burst(sat.x, sat.y, colors.gold, 10, 120, 30);
      }
    }
  }
  boss.shot -= dt;
  if (boss.shot > 0) return;
  const attack = boss.attackIndex % 3;
  if (attack === 0) {
    // rotating spiral of spores
    const n = game.compact ? 9 : 12;
    const base = boss.attackIndex * 0.37;
    for (let i = 0; i < n; i++) {
      const a = base + i / n * TAU;
      game.enemyBullets.push({
        x: boss.x, y: boss.y + 10,
        vx: Math.cos(a) * (160 + game.wave * 5),
        vy: Math.abs(Math.sin(a)) * (130 + game.wave * 5) + 70,
        r: 5, color: colors.enemy, life: 5, style: "fireball"
      });
    }
    burst(boss.x, boss.y + 10, colors.bullet, 12, 150, 30);
    boss.shot = clamp(1.5 - game.wave * 0.02, 0.95, 1.5);
    sfx.bossShot(boss.x);
  } else if (attack === 1) {
    // launches two minis that dive straight at the ship
    if (game.invaders.filter(i => i.type === "mini").length < 6) {
      spawnMini(boss.x - 34, boss.y + 22, -1, 1, 0);
      spawnMini(boss.x + 34, boss.y + 22, 1, 2, 0);
      sfx.dive(boss.x);
      burst(boss.x, boss.y + 22, colors.bullet, 14, 160, 30);
    }
    boss.shot = 1.3;
  } else {
    // every guard drone fires one aimed shot
    for (const sat of boss.sats) {
      if (sat.dead) continue;
      enemyFire(sat.x, sat.y + 6, 260 + game.wave * 7, 0, { r: 5, color: colors.enemy });
    }
    boss.shot = clamp(1.2 - game.wave * 0.015, 0.8, 1.2);
    sfx.bossShot(boss.x);
  }
  boss.attackIndex += 1;
}

function firstSatHit(b) {
  const boss = game.boss;
  if (!boss || !boss.sats || boss.intro > 0) return null;
  for (const sat of boss.sats) {
    if (sat.dead) continue;
    const rr = (b.r || 1) + sat.r + 3;
    if (distSq(b, sat) < rr * rr) return sat;
  }
  return null;
}

function damageSat(sat, damage) {
  sat.hp -= damage;
  sat.hitFlash = 1;
  burst(sat.x, sat.y, colors.gold, 6, 110, 30);
  sfx.hit(sat.x);
  if (sat.hp > 0) return;
  sat.dead = true;
  sat.regen = 7;
  stage.events.invaderKilled(sat, false);
  sfx.boom(false, game.combo, sat.x);
  addScore(40);
}

function updateBoss(dt) {
  const boss = game.boss;
  if (!boss) return;
  boss.phase += dt;
  const targetY = boss.targetY ?? Math.max(48, 62 * game.scale);
  if (boss.intro > 0) {
    boss.intro = Math.max(0, boss.intro - dt);
    if (boss.intro === 0) boss.fightStart = game.time;
    const t = 1 - boss.intro / 1.85;
    const ease = 1 - Math.pow(1 - clamp(t, 0, 1), 3);
    boss.x = game.width / 2 + Math.sin(game.time * 2.2) * 18 * (1 - ease);
    boss.y = -88 + (targetY - -88) * ease + Math.sin(game.time * 14) * 3;
    game.shake = Math.max(game.shake, (1 - ease) * 6);
    syncBossTurrets(boss);
    return;
  }
  if (boss.kind === "interceptor") updateInterceptor(boss, dt, targetY);
  else if (boss.kind === "bulwark") updateBulwark(boss, dt, targetY);
  else if (boss.kind === "hive") updateHive(boss, dt, targetY);
  else updateCarrier(boss, dt, targetY);
  syncBossTurrets(boss);
  updateBossTurretFire(boss, dt);
}

function syncBossTurrets(boss) {
  if (!boss.turrets) return;
  for (const t of boss.turrets) {
    t.x = boss.x + t.ox;
    t.y = boss.y + t.oy;
    t.flash = Math.max(0, (t.flash || 0) - 0.06);
  }
}

function updateBossTurretFire(boss, dt) {
  if (!boss.turrets) return;
  for (const t of boss.turrets) {
    if (t.dead) continue;
    t.shot -= dt;
    if (t.shot <= 0) {
      enemyFire(t.x, t.y + 6, 250 + game.wave * 7, 0, { r: 5, color: colors.enemy });
      burst(t.x, t.y + 6, colors.enemy, 6, 110);
      t.shot = clamp(1.5 - game.wave * 0.02, 0.85, 1.5);
      sfx.bossShot(t.x);
    }
  }
}

function updateCarrier(boss, dt, targetY) {
  boss.x = game.width / 2 + Math.sin(boss.phase * 0.9) * game.width * 0.32;
  boss.y = targetY + Math.sin(boss.phase * 1.7) * 8;
  if (boss.warning > 0) {
    boss.warning -= dt;
    if (boss.warning <= 0 && boss.pendingBeam) {
      bossBeam(boss.warningX, boss.y + 38);
      burst(boss.warningX, boss.y + 42, colors.enemy3, 28, 250);
      game.shake = Math.max(game.shake, 8);
      boss.pendingBeam = false;
      sfx.beam(boss.warningX);
    }
  }
  boss.shot -= dt;
  if (boss.shot <= 0) {
    const attack = boss.attackIndex % 3;
    if (attack === 0) {
      [-0.28, -0.1, 0.1, 0.28].forEach(a => enemyFire(boss.x, boss.y + 34, 245 + game.wave * 8, a));
      burst(boss.x, boss.y + 32, colors.enemy2, 10, 140);
      boss.shot = clamp(1.22 - game.wave * 0.018, 0.76, 1.22);
      sfx.bossShot(boss.x);
    } else if (attack === 1) {
      [-54, 54].forEach(side => {
        [-0.22, 0, 0.22].forEach(a => enemyFire(boss.x + side, boss.y + 20, 270 + game.wave * 9, a, { r: 5, color: colors.enemy }));
        burst(boss.x + side, boss.y + 20, colors.enemy, 8, 130);
      });
      boss.shot = clamp(1.28 - game.wave * 0.018, 0.82, 1.28);
      sfx.bossShot(boss.x);
    } else {
      boss.warningX = clamp(game.player.x + rand(-26, 26), 28, game.width - 28);
      boss.warning = clamp(0.78 - game.wave * 0.01, 0.56, 0.78);
      boss.pendingBeam = true;
      boss.shot = clamp(0.98 - game.wave * 0.014, 0.66, 0.98);
      burst(boss.warningX, boss.y + 36, colors.enemy3, 12, 160, 26);
      sfx.bossCharge(boss.warningX);
    }
    boss.attackIndex += 1;
  }
}

function updateInterceptor(boss, dt, targetY) {
  // Fast agile frigate: wide quick weave, periodic strafing dips, tight aimed bursts.
  if (boss.strafe > 0) boss.strafe -= dt;
  const dip = boss.strafe > 0 ? Math.sin((1 - boss.strafe / 0.9) * Math.PI) * 120 : 0;
  boss.x = game.width / 2 + Math.sin(boss.phase * 1.7) * game.width * 0.4;
  boss.y = targetY + Math.sin(boss.phase * 2.6) * 12 + dip;
  boss.shot -= dt;
  if (boss.shot <= 0) {
    const attack = boss.attackIndex % 3;
    if (attack === 2) {
      boss.strafe = 0.9;
      for (let i = 0; i < 5; i++) {
        enemyFire(boss.x, boss.y + 20, 320 + game.wave * 10, (i - 2) * 0.12, { r: 5, color: colors.enemy3 });
      }
      burst(boss.x, boss.y + 20, colors.enemy3, 16, 200);
      boss.shot = clamp(1.4 - game.wave * 0.02, 0.9, 1.4);
      sfx.bossCharge(boss.x);
    } else {
      [-0.16, 0, 0.16].forEach(a => enemyFire(boss.x, boss.y + 22, 300 + game.wave * 10, a, { r: 5, color: colors.enemy }));
      burst(boss.x, boss.y + 20, colors.enemy, 8, 130);
      boss.shot = clamp(0.82 - game.wave * 0.014, 0.5, 0.82);
      sfx.bossShot(boss.x);
    }
    boss.attackIndex += 1;
  }
}

function updateBulwark(boss, dt, targetY) {
  // Slow siege platform: gentle drift and downward ring bursts; turrets apply pressure.
  boss.x = game.width / 2 + Math.sin(boss.phase * 0.4) * game.width * 0.16;
  boss.y = targetY + Math.sin(boss.phase * 1.1) * 5;
  boss.shot -= dt;
  if (boss.shot <= 0) {
    const spokes = game.compact ? 7 : 9;
    const base = boss.attackIndex * 0.4;
    for (let i = 0; i < spokes; i++) {
      const a = base + i / spokes * TAU;
      game.enemyBullets.push({
        x: boss.x,
        y: boss.y + 10,
        vx: Math.cos(a) * (150 + game.wave * 5),
        vy: Math.abs(Math.sin(a)) * (120 + game.wave * 5) + 60,
        r: 6,
        color: colors.enemy2,
        life: 5,
        style: "fireball"
      });
    }
    burst(boss.x, boss.y + 10, colors.enemy2, 12, 150);
    boss.shot = clamp(1.9 - game.wave * 0.02, 1.2, 1.9);
    sfx.bossShot(boss.x);
    boss.attackIndex += 1;
  }
}

function updateBullets(dt) {
  for (const b of game.bullets) {
    b.px = b.x;
    b.py = b.y;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
  }
  for (const b of game.bullets) {
    const shieldHit = firstShieldHit(b);
    const invaderHit = firstInvaderHit(b);
    if (invaderHit && (invaderHit.inv.divePhase || !shieldHit || invaderHit.t <= shieldHit.t)) {
      b.x = (b.px ?? b.x) + (b.x - (b.px ?? b.x)) * invaderHit.t;
      b.y = (b.py ?? b.y) + (b.y - (b.py ?? b.y)) * invaderHit.t;
      const inv = invaderHit.inv;
      if (inv.type === "warden" && inv.barrier > 0 && !inv.divePhase && Math.abs(b.vx) < 55 && !(b.pierce > 0)) {
        // straight shots splash off the barrier; angled spread / overdrive shots get round it
        b.life = 0;
        inv.barrier = Math.max(0, inv.barrier - b.damage);
        stage.events.barrierHit(inv);
        burst(b.x, b.y + 6, colors.barrier, 6, 120, 22);
        sfx.deflect(inv.x);
        if (inv.barrier <= 0) {
          stage.events.barrierBreak(inv);
          sfx.turretDown(inv.x);
          addFloatText(inv.x, inv.y - 20, "BARRIER DOWN", colors.barrier, 0.9);
        }
      } else {
        const killed = damageInvader(inv, b.damage);
        if (b.pierce > 0 && killed) b.pierce -= 1;
        else b.life = 0;
      }
    } else if (shieldHit) {
      b.life = 0;
      b.x = shieldHit.x;
      b.y = shieldHit.y;
      damagePlayerShieldHit(shieldHit);
    }
    if (b.life <= 0) continue;
    if (game.boss) {
      const turret = firstTurretHit(b);
      if (turret) {
        b.life = 0;
        damageTurret(turret, b.damage);
        continue;
      }
      const sat = firstSatHit(b);
      if (sat) {
        b.life = 0;
        damageSat(sat, b.damage);
        continue;
      }
      if (game.boss.intro <= 0 && distSq(b, game.boss) < (b.r + game.boss.r) * (b.r + game.boss.r)) {
        b.life = 0;
        damageBoss(b.damage);
        continue;
      }
    }
    if (game.saucer && distSq(b, game.saucer) < (b.r + game.saucer.r) * (b.r + game.saucer.r)) {
      b.life = 0;
      killSaucer();
    }
  }
  game.bullets = game.bullets.filter(b => b.life > 0 && b.y > -40 && b.y < game.height + 40);
  game.shields = game.shields.filter(s => s.hp > 0);
}

function updateEnemyBullets(dt) {
  const p = game.player;
  const bullets = game.enemyBullets;
  for (const b of bullets) {
    // A life-loss inside hitPlayer reassigns game.enemyBullets to []; stop touching the stale array.
    if (game.enemyBullets !== bullets) break;
    b.px = b.x;
    b.py = b.y;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    const shieldHit = firstShieldHit(b);
    if (shieldHit) {
      b.life = 0;
      b.x = shieldHit.x;
      b.y = shieldHit.y;
      damageEnemyShieldHit(shieldHit);
    }
    const shieldRadius = playerShieldRadius() + Math.max(1, b.r || 1);
    const shieldT = p.shield > 0
      ? segmentCircleHit(b.px ?? b.x, b.py ?? b.y, b.x, b.y, p.x, p.y, shieldRadius)
      : null;
    if (b.life > 0 && shieldT !== null) {
      b.x = (b.px ?? b.x) + (b.x - (b.px ?? b.x)) * shieldT;
      b.y = (b.py ?? b.y) + (b.y - (b.py ?? b.y)) * shieldT;
      burst(b.x, b.y, p.shield > 40 ? colors.player : colors.red, 18, 190);
      b.life = 0;
      if (p.invulnerable <= 0) hitPlayer(enemyShotDamage());
    }
  }
  game.enemyBullets = game.enemyBullets.filter(b => b.life > 0 && b.y < game.height + 40 && b.x > -40 && b.x < game.width + 40);
}

function updatePowerups(dt) {
  const p = game.player;
  const tractor = perkLevel("tractor");
  for (const core of game.powerups) {
    core.y += core.vy * (1 + tractor * 0.35) * dt;
    core.phase += dt * 4;
    if (tractor) {
      const pull = (110 + tractor * 90) * dt;
      core.x += clamp(p.x - core.x, -pull, pull);
    }
    if (distSq(core, p) < (core.r + p.r + 8) * (core.r + p.r + 8)) {
      addPickupLabel(core);
      stage.events.pickup(core);
      applyPowerup(core.type);
      core.dead = true;
      burst(core.x, core.y, core.color, 18, 165);
    }
  }
  game.powerups = game.powerups.filter(core => !core.dead && core.y < game.height + 30);
}

function addPickupLabel(core) {
  const labels = {
    spread: "SPREAD",
    laser: "LASER",
    overdrive: "OVERDRIVE",
    bomb: "BOMB",
    shield: "SHIELD",
    repair: "REPAIR"
  };
  game.pickupLabels.push({
    x: core.x,
    y: core.y - 18,
    vy: -34,
    text: labels[core.type] || core.type.toUpperCase(),
    color: core.color,
    life: 0.9,
    maxLife: 0.9
  });
}

function addFloatText(x, y, text, color, life = 0.9) {
  game.pickupLabels.push({
    x,
    y,
    vy: -42,
    text,
    color,
    life,
    maxLife: life
  });
}

function updatePickupLabels(dt) {
  for (const label of game.pickupLabels) {
    label.y += label.vy * dt;
    label.vy *= Math.pow(0.2, dt);
    label.life -= dt;
  }
  game.pickupLabels = game.pickupLabels.filter(label => label.life > 0);
}

function updateWaveBanner(dt) {
  if (!game.waveBanner) return;
  game.waveBanner.life -= dt;
  if (game.waveBanner.life <= 0) game.waveBanner = null;
}

function updateVisualEffects(dt) {
  if (game.powerFlash) {
    game.powerFlash.life -= dt;
    if (game.powerFlash.life <= 0) game.powerFlash = null;
  }
}

function spawnRing(x, y, maxR, color, width, life) {
  game.rings.push({
    x, y,
    r: Math.max(2, maxR * 0.12),
    maxR,
    color: color || "255, 255, 255",
    width: width || 4,
    life: life || 0.5,
    maxLife: life || 0.5
  });
  if (game.rings.length > 24) game.rings.splice(0, game.rings.length - 24);
}

function updateRings(dt) {
  if (!game.rings.length) return;
  for (const ring of game.rings) {
    const t = 1 - ring.life / ring.maxLife;
    ring.r = ring.maxR * (0.12 + t * 0.88);
    ring.life -= dt;
  }
  game.rings = game.rings.filter(ring => ring.life > 0);
}

// Real-time FPS watchdog: drop non-essential effects on a struggling device,
// relax back up when there's headroom. Keeps phones and desktops both smooth.
function adaptQuality(dt) {
  game.fpsAcc += dt;
  game.fpsFrames += 1;
  game.fpsWindow += dt;
  if (game.fpsWindow < 1.2) return;
  const fps = game.fpsFrames / Math.max(0.0001, game.fpsAcc);
  game.fpsAvg = fps;
  game.fpsAcc = 0;
  game.fpsFrames = 0;
  game.fpsWindow = 0;
  // The loop clamps dt to 33ms, so a few long "pause" frames barely move the average
  // fps — a stuttery machine can read ~60fps avg yet feel choppy. Fold in the real
  // hitch count (frames >45ms, measured unclamped in trackPerf) so periodic pauses
  // also trigger a downgrade. Downgrade only when sustained; recover slowly; never
  // rebuild anything on the flip — just relax particle caps / remaining glow.
  const hitches = game.adaptHitches || 0;
  game.adaptHitches = 0;
  if (!game.autoLow) {
    const bad = fps < 40 || hitches >= 4;
    game.lowFpsStreak = bad ? (game.lowFpsStreak || 0) + 1 : 0;
    if (game.lowFpsStreak >= 3) {
      game.autoLow = true;
      game.fxLow = true;
      game.lowFpsStreak = 0;
      game.autoLowFlips = (game.autoLowFlips || 0) + 1;
    }
  } else {
    game.highFpsStreak = (fps > 58 && hitches === 0) ? (game.highFpsStreak || 0) + 1 : 0;
    if (game.highFpsStreak >= 6) {
      game.autoLow = false;
      game.fxLow = game.lowPower;
      game.highFpsStreak = 0;
    }
  }
}

function useBomb() {
  if (game.state !== "playing" || game.bombs <= 0) return;
  game.bombs -= 1;
  game.enemyBullets = [];
  game.screenFlash = Math.max(game.screenFlash, 0.7);
  game.flashColor = "255, 240, 200";
  game.shake = Math.max(game.shake, 12);
  game.slowmo = Math.max(game.slowmo, 0.34);
  const reach = Math.max(game.width, game.height);
  spawnRing(game.player.x, game.player.y, reach * 1.2, "255, 210, 61", 11, 0.62);
  spawnRing(game.player.x, game.player.y, reach * 0.82, "255, 255, 255", 6, 0.5);
  sfx.bomb();
  stage.events.bomb();
  rumble(0.9, 0.6, 420);
  const doomed = game.invaders.slice();
  const formationKills = doomed.filter(inv => inv.type !== "mini").length;
  for (const inv of doomed) {
    burst(inv.x, inv.y, colors.gold, 6, 150);
    damageInvader(inv, 999);
  }
  // A killed Splitter spawns minis mid-loop that aren't in the snapshot — a screen
  // clear shouldn't birth new divers, so sweep them (and any stragglers) out.
  if (game.invaders.some(i => i.type === "mini")) {
    game.invaders = game.invaders.filter(i => i.type !== "mini");
  }
  if (game.boss) {
    if (game.boss.sats) for (const sat of game.boss.sats) if (!sat.dead) damageSat(sat, 999);
    damageBoss(18 + game.wave);
  }
  if (game.saucer) killSaucer();
  if (formationKills >= 30) unlockMedal("bomb30");
  addFloatText(game.player.x, game.player.y - 60, "SMART BOMB", colors.gold, 1.1);
  buzz(60);
  updateHud();
}

function triggerOverdrive() {
  const dur = overdriveDuration();
  const fresh = game.overdrive <= 0;
  game.overdrive = Math.max(game.overdrive, dur);
  if (fresh) {
    addFloatText(game.player.x, game.player.y - 66, "OVERDRIVE!", colors.gold, 1.05);
    spawnRing(game.player.x, game.player.y, 170, "255, 210, 61", 5, 0.55);
    game.screenFlash = Math.max(game.screenFlash, 0.3);
    game.flashColor = "255, 210, 61";
    sfx.overdrive();
    game.stats.overdrives += 1;
    if (game.stats.overdrives >= 10) unlockMedal("overdrive10");
  }
}

function grantBomb(count = 1) {
  game.bombs = Math.min(bombCap(), game.bombs + count);
  updateHud();
}

function updateShields(dt) {
  for (const shield of game.shields) {
    shield.flash = Math.max(0, (shield.flash || 0) - dt * 4.5);
  }
}

function damageShieldBlock(shield, x, y, sparks = 5) {
  shield.hp -= 1;
  shield.flash = 1;
  shield.scar = rand(0, TAU);
  const color = shield.hp <= 1 ? colors.enemy3 : shield.hp <= 2 ? colors.gold : colors.shield;
  burst(x, y, color, sparks + (shield.hp <= 0 ? 12 : 2), shield.hp <= 0 ? 180 : 120, 12);
  if (shield.hp <= 0) { stage.events.blockLost(shield, color); sfx.bunker(x); }
  for (let i = 0; i < (shield.hp <= 0 ? 5 : 2); i++) {
    game.particles.push({
      x: shield.x + rand(-shield.w * 0.45, shield.w * 0.45),
      y: shield.y + rand(-shield.h * 0.45, shield.h * 0.45),
      vx: rand(-80, 80),
      vy: rand(-120, 40),
      r: rand(0.8, 2.1),
      color,
      life: rand(0.18, 0.44)
    });
  }
}

function craterShieldBlock(shield, x, y, sparks = 4) {
  shield.hp = 0;
  shield.flash = 1;
  burst(x, y, colors.enemy3, sparks, 120, 12);
  stage.events.blockLost(shield, colors.enemy3);
  sfx.bunker(x);
}

function damageEnemyShieldHit(hit) {
  const cell = Math.max(hit.shield.w, hit.shield.h);
  const radius = cell * 2.65;
  const maxBlocks = game.compact ? 5 : 7;
  const targets = game.shields
    .filter(shield => shield.hp > 0)
    .map(shield => {
      const dx = shield.x - hit.x;
      const dy = shield.y - hit.y;
      return { shield, d: dx * dx + dy * dy };
    })
    .filter(entry => entry.d <= radius * radius)
    .sort((a, b) => a.d - b.d)
    .slice(0, maxBlocks);
  if (!targets.length) {
    craterShieldBlock(hit.shield, hit.x, hit.y, 8);
    return;
  }
  for (const entry of targets) {
    const close = entry.shield === hit.shield || entry.d < cell * cell * 1.25;
    craterShieldBlock(entry.shield, close ? hit.x : entry.shield.x, close ? hit.y : entry.shield.y, close ? 7 : 3);
  }
}

function damagePlayerShieldHit(hit) {
  damageShieldBlock(hit.shield, hit.x, hit.y, 5);
  let nearest = null;
  let nearestD = Infinity;
  const reach = Math.max(hit.shield.w, hit.shield.h) * 2.45;
  for (const shield of game.shields) {
    if (shield === hit.shield || shield.hp <= 0) continue;
    const dx = shield.x - hit.shield.x;
    const dy = shield.y - hit.shield.y;
    const d = dx * dx + dy * dy;
    if (d > reach * reach || d >= nearestD) continue;
    nearest = shield;
    nearestD = d;
  }
  if (nearest) damageShieldBlock(nearest, nearest.x, nearest.y, 3);
}

function updateParticles(dt) {
  for (const part of game.particles) {
    part.x += part.vx * dt;
    part.y += part.vy * dt;
    part.vx *= Math.pow(0.08, dt);
    part.vy *= Math.pow(0.08, dt);
    if (part.vh) {
      part.h += part.vh * dt;
      part.vh *= Math.pow(0.08, dt);
    }
    part.life -= dt;
    part.r *= Math.pow(0.25, dt);
  }
  game.particles = game.particles.filter(part => part.life > 0 && part.r > 0.2);
}

function checkWaveClear(dt) {
  if (game.invaders.length || game.boss) return;
  game.waveClearTimer += dt;
  if (game.waveClearTimer <= 1.1) return;
  game.waveClearTimer = 0;
  if (game.waveDamage === 0) {
    game.perfectStreak += 1;
    const bonus = 200 * game.wave + game.perfectStreak * 100;
    game.score += bonus;
    addFloatText(game.player.x, game.player.y - 80, "PERFECT WAVE +" + bonus.toLocaleString(), colors.bullet, 1.4);
    spawnRing(game.player.x, game.player.y, 220, "167, 255, 61", 5, 0.6);
    game.screenFlash = Math.max(game.screenFlash, 0.35);
    game.flashColor = "167, 255, 61";
    sfx.perfect();
    unlockMedal("perfect");
    if (game.perfectStreak >= 5) unlockMedal("flawless5");
  } else {
    game.perfectStreak = 0;
  }
  // after a warship: pick an upgrade before the next wave
  if (game.bossWave && availablePerks().length) openPerkPick(advanceWave);
  else advanceWave();
}

function advanceWave() {
  game.wave += game.mode === "bossrush" ? 2 : 1;
  game.waveClearTimer = 0;
  game.player.shield = Math.min(shieldCap(), game.player.shield + 7);
  if (game.wave >= game.nextBombWave) {
    grantBomb(1);
    game.nextBombWave = game.wave + 3;
    addFloatText(game.player.x, game.player.y - 56, "SMART BOMB +1", colors.gold, 1.1);
  }
  sfx.wave();
  makeShields();
  spawnWave();
}

// ---- upgrade pick ------------------------------------------------------------------------------
function canDash() {
  return pad.connected || !(window.matchMedia && matchMedia("(pointer: coarse)").matches);
}

function availablePerks() {
  return PERKS.filter(perk => perkLevel(perk.id) < perk.max && (!perk.needsDash || canDash()));
}

function rollPerks() {
  const pool = availablePerks().slice();
  const offer = [];
  for (let i = 0; i < 3 && pool.length; i++) {
    // Daily runs roll from the shared seed so everyone sees the same choices
    const pick = Math.floor(gpAt(7000 + i * 13) * pool.length) % pool.length;
    offer.push(pool.splice(pick, 1)[0]);
  }
  return offer;
}

function applyPerk(perk, silent = false) {
  const p = game.player;
  game.perks[perk.id] = perkLevel(perk.id) + 1;
  if (perk.id === "plating") p.shield = Math.min(shieldCap(), p.shield + 30);
  else if (perk.id === "bombbay") grantBomb(2);
  else if (perk.id === "hull") game.lives = Math.min(maxLives(), game.lives + 1);
  if (silent) return;
  game.stats.perks += 1;
  if (game.stats.perks >= 5) unlockMedal("perks5");
  addFloatText(p.x, p.y - 70, perk.name.toUpperCase(), colors.gold, 1.3);
  spawnRing(p.x, p.y, 160, "255, 210, 61", 5, 0.5);
  game.screenFlash = Math.max(game.screenFlash, 0.25);
  game.flashColor = "255, 210, 61";
  updateHud();
}

function openPerkPick(done) {
  const offer = rollPerks();
  if (!offer.length) { done(); return; }
  game.state = "perk";
  game.perkDone = done;
  game.perkOffer = offer;
  keys.clear();
  touchAim.active = false;
  touchAim.pointerId = null;
  perkTitle.textContent = `${BOSS_NAMES[game.bossKind] || "WARSHIP"} DOWN — CHOOSE AN UPGRADE`;
  perkCards.innerHTML = offer.map((perk, i) => {
    const level = perkLevel(perk.id);
    const pips = perk.max > 1 ? `<span class="perk-level">${"◆".repeat(level + 1)}${"◇".repeat(perk.max - level - 1)}</span>` : "";
    return `<button class="perk-card" type="button" data-perk="${perk.id}"><span class="perk-key">${i + 1}</span><span class="perk-icon" aria-hidden="true">${perk.icon}</span><b>${perk.name}</b><span class="perk-desc">${perk.desc}</span>${pips}</button>`;
  }).join("");
  perkOverlay.classList.remove("hidden");
  setControlsVisible(false);
  perkOpenedAt = performance.now();
  sfx.perkOffer();
  if (pad.connected) focusFirst(perkCards);
}

function choosePerk(id) {
  if (game.state !== "perk" || performance.now() - perkOpenedAt < 650) return;
  const perk = PERKS.find(item => item.id === id);
  if (!perk) return;
  perkOverlay.classList.add("hidden");
  game.state = "playing";
  game.last = performance.now();
  setControlsVisible(true);
  applyPerk(perk);
  sfx.perkPick();
  rumble(0.2, 0.45, 100);
  const done = game.perkDone;
  game.perkDone = null;
  if (done) done();
}

function damageInvader(inv, damage) {
  if (inv.dead) return false;
  inv.hp -= damage;
  if (inv.hp > 0) {
    inv.hitFlash = 1;
    burst(inv.x, inv.y, colors.enemy2, 7, 90, 22);
    sfx.hit(inv.x);
    game.shake = Math.max(game.shake, 1);
    return false;
  }
  inv.dead = true;
  const wasDiving = !!inv.divePhase;
  stage.events.invaderKilled(inv, wasDiving);
  burst(inv.x, inv.y, colors.enemy, 22, 210, 22);
  const idx = game.invaders.indexOf(inv);
  if (idx >= 0) game.invaders.splice(idx, 1);
  const base = inv.type === "diver" ? 45 : inv.type === "splitter" ? 40 : inv.type === "striker" ? 30 : inv.type === "mini" ? 12
    : inv.type === "warden" ? 50 : inv.type === "phantom" ? 60 : 20;
  game.chain = game.comboTimer > 0 ? game.chain + 1 : 1;
  if (game.chain >= 50) unlockMedal("chain50");
  addScore(base);
  game.shake = Math.max(game.shake, 4);
  if (inv.type === "splitter") splitInvader(inv);
  if (inv.type === "warden" && inv.barrier > 0 && damage < 999) {
    addScore(40);
    addFloatText(inv.x, inv.y - 20, "FLANKED +40", colors.barrier, 0.9);
    unlockMedal("flank");
  }
  if (inv.type === "phantom" && inv.phase === "aim" && damage < 999) {
    addFloatText(inv.x, inv.y - 20, "GHOSTED", colors.phantom, 0.9);
    unlockMedal("ghost");
  }
  if (wasDiving) {
    game.stats.diveTags += 1;
    if (game.stats.diveTags >= 10) unlockMedal("divetag10");
    burst(inv.x, inv.y, colors.gold, 32, 270);
    burst(inv.x, inv.y, "#ffffff", 14, 180);
    addFloatText(inv.x, inv.y - 22, inv.zealot ? "ZEALOT DOWN +45" : "DIVE TAG +45", colors.gold, 1.05);
    spawnRing(inv.x, inv.y, 120, "255, 210, 61", 4, 0.42);
    game.screenFlash = Math.max(game.screenFlash, 0.55);
    game.flashColor = "255, 241, 168";
    game.shake = Math.max(game.shake, 9);
    sfx.ace(game.combo, inv.x);
  } else if (game.combo > 1.6) {
    maybeComboPopup(inv);
  }
  maybeDrop(inv.x, inv.y);
  if (!wasDiving) sfx.boom(false, game.combo, inv.x);
  if (!game.invaders.length && !game.boss && game.state === "playing") waveWiped(inv);
  return true;
}

// Last enemy of a wave: a slow-motion close-up on it (Camera moments setting).
function waveWiped(inv) {
  if (!stage.events.killCam(inv.x, inv.y, false)) return;
  game.slowmo = Math.max(game.slowmo, 0.95);
  game.cineGuard = Math.max(game.cineGuard, 1.6);
  clearEnemyFire();
  sfx.slowmo();
}

// Shots in flight fizzle when a kill cam takes the view off the player's ship.
function clearEnemyFire() {
  for (const b of game.enemyBullets) burst(b.x, b.y, colors.gold, 3, 80, 15);
  game.enemyBullets = [];
}

function maybeComboPopup(inv) {
  // Occasional multiplier callouts so streaks read without spamming the screen.
  if (Math.random() > 0.22) return;
  addFloatText(inv.x, inv.y - 18, "x" + game.combo.toFixed(1), colors.gold, 0.7);
}

function splitInvader(inv) {
  spawnMini(inv.x, inv.y, -1, inv.col, inv.row);
  spawnMini(inv.x, inv.y, 1, inv.col, inv.row);
  burst(inv.x, inv.y, colors.bullet, 12, 180);
  sfx.split(inv.x);
}

function firstTurretHit(b) {
  const boss = game.boss;
  if (!boss || boss.intro > 0 || !boss.turrets || !boss.turrets.length) return null;
  for (const t of boss.turrets) {
    if (t.dead) continue;
    const rr = b.r + t.r;
    if (distSq(b, t) < rr * rr) return t;
  }
  return null;
}

function damageTurret(turret, damage) {
  turret.hp -= damage;
  turret.flash = 1;
  burst(turret.x, turret.y, colors.enemy, 8, 130, 34);
  sfx.hit(turret.x);
  if (turret.hp <= 0 && !turret.dead) {
    turret.dead = true;
    stage.events.turretDown(turret);
    sfx.turretDown(turret.x);
    burst(turret.x, turret.y, colors.enemy2, 26, 220);
    spawnRing(turret.x, turret.y, 90, "255, 77, 109", 4, 0.4);
    addScore(120);
    game.shake = Math.max(game.shake, 6);
    if (game.boss && !bossTurretsAlive(game.boss)) {
      addFloatText(game.boss.x, game.boss.y + 30, "CORE EXPOSED", colors.gold, 1.2);
      game.screenFlash = Math.max(game.screenFlash, 0.4);
      game.flashColor = "255, 210, 61";
    }
  }
}

function damageBoss(damage) {
  const boss = game.boss;
  if (!boss || boss.intro > 0) return;
  // Bulwark core is armoured until its turrets fall — clear them first.
  const eff = boss.kind === "bulwark" && bossTurretsAlive(boss) ? Math.max(1, Math.round(damage * 0.35)) : damage;
  boss.hp -= eff;
  boss.hitFlash = 1;
  burst(boss.x + rand(-28, 28), boss.y + rand(-18, 24), colors.enemy2, 8, 110, 30);
  sfx.hit(boss.x);
  game.shake = Math.max(game.shake, 2);
  if (boss.hp > 0 && boss.nextPowerDropHp > 0 && boss.hp <= boss.nextPowerDropHp) {
    dropPowerup(boss.x + rand(-42, 42), boss.y + rand(6, 42));
    boss.nextPowerDropHp -= boss.maxHp * rand(0.24, 0.34);
  }
  if (boss.hp <= 0) defeatBoss(boss);
}

function defeatBoss(boss) {
  addScore(650 + game.wave * 50);
  burst(boss.x, boss.y, colors.enemy2, game.fxLow ? 40 : 90, 360);
  burst(boss.x, boss.y, "#ffffff", game.fxLow ? 16 : 34, 260);
  spawnRing(boss.x, boss.y, Math.max(game.width, game.height) * 0.95, "255, 210, 61", 9, 0.7);
  spawnRing(boss.x, boss.y, 260, "255, 255, 255", 5, 0.5);
  stage.events.bossDown(boss);
  sfx.bossDown(boss.x);
  rumble(1, 0.8, 700);
  game.shake = 16;
  game.slowmo = Math.max(game.slowmo, 0.45);
  game.screenFlash = Math.max(game.screenFlash, 0.6);
  game.flashColor = "255, 220, 150";
  game.boss = null;
  // slow-motion close-up on the wreck (Camera moments setting)
  if (game.state === "playing" && stage.events.killCam(boss.x, boss.y, true)) {
    game.slowmo = Math.max(game.slowmo, 1.35);
    game.cineGuard = Math.max(game.cineGuard, 2.1);
    clearEnemyFire();
    sfx.slowmo();
  }
  grantBomb(1);
  addFloatText(boss.x, boss.y - 30, "WARSHIP DOWN  +💣", colors.gold, 1.3);
  for (let i = 0; i < 3; i++) dropPowerup(boss.x + rand(-50, 50), boss.y + rand(-10, 35));
  if (game.state === "playing") playMusic("gameplay");
  game.stats.bosses += 1;
  unlockMedal("firstboss");
  if (boss.fightStart != null && game.time - boss.fightStart < 30) unlockMedal("quickboss");
  if (scored() && medals && medals.noteBossKind(boss.kind) >= BOSS_KINDS.length) unlockMedal("fleet");
  if (game.mode === "bossrush" && game.stats.bosses >= 4) unlockMedal("rush4");
}

// Adds points (with the combo and modifier multipliers) and returns what was added.
function addScore(points) {
  const step = hasMod("overcharged") ? 0.14 : 0.08;
  game.combo = clamp(game.combo + step, 1, 3);
  game.comboTimer = comboWindow();
  const mult = hasMod("glass-cannon") ? 2 : 1;
  const added = Math.round(points * game.combo * mult);
  game.score += added;
  if (game.score >= 100000) unlockMedal("ace100k");
  if (game.combo >= 3 && game.overdrive <= 0) triggerOverdrive();
  return added;
}

function maybeDrop(x, y) {
  if (Math.random() < 0.035 + Math.min(0.035, game.wave * 0.003)) dropPowerup(x, y);
}

function dropPowerup(x, y) {
  const types = [
    ["spread", "#ff3df2", 4.6],
    ["laser", "#35f4ff", 4.6],
    ["overdrive", "#ffd23d", 2.2],
    ["bomb", "#ff4d6d", 1.5],
    ["shield", "#a7ff3d", 0.7],
    ["repair", "#ffffff", 0.24]
  ];
  let pick = Math.random() * types.reduce((sum, entry) => sum + entry[2], 0);
  let type = "spread";
  let color = "#ff3df2";
  for (const entry of types) {
    pick -= entry[2];
    if (pick > 0) continue;
    [type, color] = entry;
    break;
  }
  game.powerups.push({ x, y, vy: 120, r: 13, type, color, phase: rand(0, TAU) });
}

function applyPowerup(type) {
  const p = game.player;
  const labels = {
    spread: ["SPREAD CANNON", "#ff3df2"],
    laser: ["LASER LANCE", "#35f4ff"],
    overdrive: ["OVERDRIVE CORE", "#ffd23d"],
    bomb: ["SMART BOMB +1", "#ff4d6d"],
    shield: ["SHIELD SURGE", "#a7ff3d"],
    repair: ["REPAIR CORE", "#ffffff"]
  };
  const plating = perkLevel("plating") * 15;
  if (type === "spread" || type === "laser") {
    p.weapon = type;
    p.weaponTimer = 8 + perkLevel("battery") * 4;
  } else if (type === "overdrive") {
    game.overdrive = Math.max(game.overdrive, (hasMod("overcharged") ? 10 : 8) + perkLevel("overdrive") * 1.5);
  } else if (type === "bomb") {
    grantBomb(1);
  } else if (type === "shield") {
    p.shield = Math.min(105 + plating, p.shield + 22);
  } else if (type === "repair") {
    game.lives = Math.min(maxLives(), game.lives + 1);
    p.shield = Math.min(100 + plating, p.shield + 8);
  }
  const [text, color] = labels[type] || [type.toUpperCase(), colors.gold];
  game.powerFlash = { type, text, color, life: 0.82, maxLife: 0.82 };
  game.screenFlash = Math.max(game.screenFlash, 0.22);
  game.flashColor = "255, 241, 168";
  if (type === "bomb") sfx.extralife();
  else sfx.pickup(p.x);
  updateHud();
}

function hitPlayer(damage) {
  const p = game.player;
  if (p.invulnerable > 0 || game.cineGuard > 0) return;
  p.shield -= damage;
  game.waveDamage += 1;
  game.shake = 14;
  game.screenFlash = Math.max(game.screenFlash, 0.3);
  game.flashColor = "255, 77, 109";
  p.invulnerable = 1.3;
  burst(p.x, p.y, colors.red, 36, 270, 14);
  sfx.hurt(p.x);
  stage.events.playerHit(false);
  buzz(p.shield <= 0 ? 90 : 35);
  if (p.shield <= 0) rumble(1, 1, 480);
  else rumble(0.45, 0.7, 180);
  if (p.shield <= 0) {
    sfx.lifeLost(p.x);
    stage.events.playerHit(true);
    game.lives -= 1;
    game.combo = 1;
    game.chain = 0;
    game.overdrive = 0;
    p.shield = 82;
    p.weapon = "pulse";
    p.weaponTimer = 0;
    game.enemyBullets = [];
    game.bullets = [];
    game.slowmo = Math.max(game.slowmo, 0.35);
    spawnRing(p.x, p.y, Math.max(game.width, game.height) * 0.7, "255, 77, 109", 7, 0.55);
    burst(p.x, p.y, "#ffffff", 70, 360);
    if (game.lives <= 0) endGame();
  }
}

function endGame() {
  game.state = "over";
  releaseWakeLock();
  setControlsVisible(false);
  overlayShownAt = performance.now();
  touchAim.active = false;
  touchAim.x = null;
  touchAim.pointerId = null;
  game.overdrive = 0;
  removeSaucer();
  sfx.gameover();
  stopMusic();
  playMusic("menu");
  if (game.mode === "daily") unlockMedal("daily");
  if (game.score >= 100000) unlockMedal("ace100k");
  const modeLabel = game.mode === "daily" ? `Daily Challenge · ${activeModifier().name}` : MODE_LABELS[game.mode];
  const reached = game.mode === "bossrush" ? `warship ${displayWave()}` : `wave ${game.wave}`;
  message.textContent = game.mode === "practice"
    ? `Practice from wave ${game.practiceStart} — reached wave ${game.wave} with ${game.score.toLocaleString()} points. Practice runs aren't scored.`
    : `${modeLabel} — final score ${game.score.toLocaleString()}, ${reached}. The fleet regroups.`;
  startButton.textContent = game.mode === "daily" ? "Retry Daily" : game.mode === "bossrush" ? "Retry Rush" : game.mode === "practice" ? "Retry Practice" : "Play Again";
  overlay.classList.add("game-over");
  shareButton.classList.remove("hidden");
  shareCanvas = null;
  showScores(true);
  overlay.classList.remove("hidden");
  if (!window.matchMedia || matchMedia("(pointer: fine)").matches) {
    requestAnimationFrame(() => document.getElementById("initialsInput")?.focus());
  }
}

function pointRect(x, y, rect) {
  return x >= rect.x - rect.w / 2 && x <= rect.x + rect.w / 2 && y >= rect.y - rect.h / 2 && y <= rect.y + rect.h / 2;
}

function playerShieldRadius() {
  return 38 + Math.sin(game.time * 5) * 2;
}

function segmentCircleHit(x1, y1, x2, y2, cx, cy, radius) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const fx = x1 - cx;
  const fy = y1 - cy;
  const a = dx * dx + dy * dy;
  if (a === 0) return fx * fx + fy * fy <= radius * radius ? 0 : null;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - radius * radius;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const root = Math.sqrt(discriminant);
  const t1 = (-b - root) / (2 * a);
  const t2 = (-b + root) / (2 * a);
  if (t1 >= 0 && t1 <= 1) return t1;
  if (t2 >= 0 && t2 <= 1) return t2;
  return null;
}

function firstShieldHit(b) {
  let best = null;
  for (const shield of game.shields) {
    if (shield.hp <= 0) continue;
    const pad = Math.max(1, b.r || 1);
    const left = shield.x - shield.w / 2 - pad;
    const right = shield.x + shield.w / 2 + pad;
    const top = shield.y - shield.h / 2 - pad;
    const bottom = shield.y + shield.h / 2 + pad;
    const t = segmentRectHit(b.px ?? b.x, b.py ?? b.y, b.x, b.y, left, top, right, bottom);
    if (t === null || (best && t >= best.t)) continue;
    best = {
      shield,
      t,
      x: (b.px ?? b.x) + (b.x - (b.px ?? b.x)) * t,
      y: (b.py ?? b.y) + (b.y - (b.py ?? b.y)) * t
    };
  }
  return best;
}

function segmentRectHit(x1, y1, x2, y2, left, top, right, bottom) {
  let t0 = 0;
  let t1 = 1;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const clip = (p, q) => {
    if (Math.abs(p) < 0.00001) return q >= 0;
    const r = q / p;
    if (p < 0) {
      if (r > t1) return false;
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return false;
      if (r < t1) t1 = r;
    }
    return true;
  };
  if (!clip(-dx, x1 - left)) return null;
  if (!clip(dx, right - x1)) return null;
  if (!clip(-dy, y1 - top)) return null;
  if (!clip(dy, bottom - y1)) return null;
  return t0;
}

function burst(x, y, color, count, force, h = 16) {
  const actualCount = Math.max(1, Math.round(count * (game.fxLow ? 0.34 : game.compact ? 0.5 : 0.88)));
  const maxParticles = game.fxLow ? 78 : game.compact ? 120 : 220;
  if (game.particles.length > maxParticles) game.particles.splice(0, game.particles.length - maxParticles);
  for (let i = 0; i < actualCount; i++) {
    const a = rand(0, TAU);
    const s = rand(force * 0.25, force);
    game.particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      h,
      vh: rand(-0.55, 0.85) * s,
      r: rand(1.4, 4.4),
      color,
      life: rand(0.25, 0.8)
    });
  }
}

const invaderSprites = {
  diver: [
    ["000111100000","001111110000","011111111000","111011101100","111111111100","001011101000","010111110100","101011101010","010100010100","100000000010"],
    ["000111100000","001111110000","011111111000","111011101100","111111111100","001011101000","101111111010","010011100100","001100011000","010000000100"]
  ],
  striker: [
    ["001001001000","001111111000","011111111100","110110110110","111111111110","101111111010","101000001010","001100011000","010011100100","100000000010"],
    ["001001001000","001111111000","011111111100","110110110110","111111111110","101111111010","001000001000","010100010100","100011100010","000100001000"]
  ],
  drone: [
    ["000011000000","000111100000","001111110000","011011011000","111111111100","101111110100","101000010100","001011101000","010100010100","100000000010"],
    ["000011000000","000111100000","001111110000","011011011000","111111111100","101111110100","001000010000","010111110100","100100010010","000010100000"]
  ],
  warden: [
    ["000011110000","001111111100","011011110110","111111111111","110111111011","111111111111","011100001110","001100001100","011000000110","110000000011"],
    ["000011110000","001111111100","011011110110","111111111111","110111111011","111111111111","011100001110","001100001100","000110011000","000011110000"]
  ],
  phantom: [
    ["000001100000","000011110000","000111111000","001101101100","011111111110","111011110111","100011110001","000110011000","001100001100","011000000110"],
    ["000001100000","000011110000","000111111000","001101101100","011111111110","111011110111","100011110001","000011110000","000110011000","000100001000"]
  ]
};
const bossHivePattern = [
  "000000111111111111000000",
  "000011111111111111110000",
  "001111110011110011111100",
  "011111111111111111111110",
  "111100111111111111001111",
  "111111111100001111111111",
  "111111111100001111111111",
  "011111111111111111111110",
  "001111011111111110111100",
  "000111001111111100111000",
  "000011000111111000110000",
  "000001000011110000100000"
];
const bossCarrierPattern = [
  "000000001111111100000000",
  "000001111111111111100000",
  "000111111111111111111000",
  "011111111111111111111110",
  "111101111111111111101111",
  "111111111111111111111111",
  "011111111100001111111110",
  "001111110000000011111100",
  "000111100111111001111000",
  "001111000111111000111100",
  "011110000011110000011110",
  "111000000001100000000111"
];

const playerPattern = [
  "0000001000000",
  "0000011100000",
  "0000111110000",
  "0001111111000",
  "0011111111100",
  "0111011101110",
  "1111111111111",
  "1110111110111",
  "0111111111110",
  "0011011101100",
  "0001001001000"
];

function waveBannerY(height) {
  const formationBottoms = game.invaders
    .filter(inv => inv.divePhase !== "swoop")
    .map(inv => inv.y + inv.r + 8);
  if (game.boss) formationBottoms.push(game.boss.y + game.boss.r + 10);
  const formationBottom = formationBottoms.length ? Math.max(...formationBottoms) : game.height * 0.22;
  const shieldTop = game.shields.length
    ? Math.min(...game.shields.map(shield => shield.y - shield.h / 2))
    : playerLaneY() - 120;
  const minY = Math.max(game.height * 0.28, formationBottom + height * 0.72);
  const maxY = Math.max(game.height * 0.34, Math.min(playerLaneY() - 140, shieldTop - height * 0.62));
  if (minY <= maxY) return clamp(minY, game.height * 0.28, maxY);
  return clamp(minY, game.height * 0.3, playerLaneY() - height * 0.55);
}

function updateHud() {
  if (!game.player) return;
  scoreEl.textContent = game.score.toLocaleString();
  waveEl.textContent = String(displayWave());
  if (waveLabelEl) waveLabelEl.textContent = game.mode === "bossrush" ? "BOSS" : "WAVE";
  livesEl.textContent = "◆".repeat(Math.max(0, game.lives));
  const weaponLabels = { pulse: "PULSE", spread: "SPRD", laser: "LASER" };
  weaponEl.textContent = game.overdrive > 0 ? "O-DRIVE" : (weaponLabels[game.player.weapon] || game.player.weapon.toUpperCase());
  bombButton.dataset.count = String(game.bombs);
  const shieldValue = Math.max(0, Math.round(game.player.shield));
  shieldEl.textContent = `${shieldValue}%`;
  shieldFill.style.transform = `scaleX(${clamp(shieldValue / 100, 0, 1)})`;
  shieldMeter.classList.toggle("low", shieldValue <= 35);
}

function loop(now) {
  const rawMs = now - game.last;
  const dt = Math.min(0.033, Math.max(0, rawMs / 1000 || 0));
  game.last = now;
  trackPerf(rawMs);
  pollPad(dt);
  update(dt);
  stage.render(dt);
  stepMusic(dt);
  requestAnimationFrame(loop);
}

// Rolling frame-time diagnostic surfaced by the on-screen perf meter (toggle: F / ?perf).
function trackPerf(rawMs) {
  if (!(rawMs > 0) || rawMs > 5000) return;
  game.pfWorst = Math.max(game.pfWorst || 0, rawMs);
  if (rawMs > 45) { game.pfHitch = (game.pfHitch || 0) + 1; game.adaptHitches = (game.adaptHitches || 0) + 1; }
  game.pfCount = (game.pfCount || 0) + 1;
  game.pfWin = (game.pfWin || 0) + rawMs;
  if (game.pfWin >= 1000) {
    game.pfFps = Math.round(game.pfCount * 1000 / game.pfWin);
    game.pfWorstShown = Math.round(game.pfWorst);
    game.pfHitchShown = game.pfHitch || 0;
    game.pfWorst = 0;
    game.pfHitch = 0;
    game.pfCount = 0;
    game.pfWin = 0;
  }
}

// ---- game controller -----------------------------------------------------------------------------
// Standard mapping: stick / d-pad steer, A / RT / RB fire, X / LB dash, B / Y smart bomb,
// Start pause. On menus the d-pad moves between buttons, A presses, B closes a panel.
const pad = { index: -1, prev: [], axisX: 0, fire: false, dash: false, connected: false, navCooldown: 0, navHeld: false };

function getPad() {
  if (!navigator.getGamepads) return null;
  let pads;
  try { pads = navigator.getGamepads(); } catch (error) { return null; }
  if (!pads) return null;
  const current = pads[pad.index];
  if (current && current.connected) return current;
  for (const gp of pads) {
    if (gp && gp.connected && gp.buttons.length >= 10) { pad.index = gp.index; return gp; }
  }
  return null;
}

function rumble(strong, weak, ms) {
  if (settings.rumble !== "on" || !pad.connected) return;
  const gp = getPad();
  const act = gp && gp.vibrationActuator;
  if (!act || !act.playEffect) return;
  try {
    const result = act.playEffect("dual-rumble", { startDelay: 0, duration: ms, strongMagnitude: strong, weakMagnitude: weak });
    if (result && result.catch) result.catch(() => {});
  } catch (error) {}
}

function menuItems() {
  const root = game.state === "perk" ? perkCards : overlay;
  return [...root.querySelectorAll("button:not([disabled]), input[type=range], a[href]")].filter(el => el.offsetParent !== null);
}

function focusItem(el) {
  for (const old of document.querySelectorAll(".pad-focus")) old.classList.remove("pad-focus");
  if (!el) return;
  el.focus({ preventScroll: true });
  el.classList.add("pad-focus");
  el.scrollIntoView({ block: "nearest" });
}

function focusFirst(root) {
  const first = root.querySelector("button:not([disabled])");
  if (first) focusItem(first);
}

function moveFocus(dir) {
  const items = menuItems();
  if (!items.length) return;
  const idx = items.indexOf(document.activeElement);
  focusItem(items[idx < 0 ? 0 : (idx + dir + items.length) % items.length]);
}

function onPadConnected() {
  if (toast) toast.show("🎮", "Controller connected", "Stick steers · A fires · X dashes · B bombs · Start pauses");
  controlsHint.textContent = "Controller: left stick or d-pad steers · A / RT fire · X / LB dash · B / Y smart bomb · Start pause. Chain kills for Overdrive.";
}

function pollPad(dt) {
  const gp = getPad();
  if (!gp) {
    pad.axisX = 0;
    pad.fire = false;
    pad.connected = false;
    pad.prev = [];
    return;
  }
  if (!pad.connected) {
    pad.connected = true;
    onPadConnected();
  }
  const now = gp.buttons.map(b => !!b && (b.pressed || b.value > 0.5));
  const edge = i => now[i] && !pad.prev[i];
  let ax = gp.axes[0] || 0;
  ax = Math.abs(ax) < 0.2 ? 0 : Math.sign(ax) * (Math.abs(ax) - 0.2) / 0.8;
  if (now[14]) ax = -1;
  if (now[15]) ax = 1;
  pad.axisX = ax;
  pad.fire = !!(now[0] || now[7] || now[5]);
  if (edge(2) || edge(4)) pad.dash = true;
  if (game.state === "playing") {
    if (edge(1) || edge(3)) useBomb();
    if (edge(9)) togglePause();
  } else if (game.state === "perk" || !overlay.classList.contains("hidden")) {
    pad.fire = false;
    const horiz = now[14] ? -1 : now[15] ? 1 : Math.abs(gp.axes[0] || 0) > 0.6 ? Math.sign(gp.axes[0]) : 0;
    const vert = now[12] ? -1 : now[13] ? 1 : Math.abs(gp.axes[1] || 0) > 0.6 ? Math.sign(gp.axes[1]) : 0;
    const focused = document.activeElement;
    pad.navCooldown -= dt;
    if (horiz && focused && focused.type === "range") {
      if (pad.navCooldown <= 0) {
        focused.value = String(clamp(Number(focused.value) + horiz * 5, 0, 100));
        focused.dispatchEvent(new Event("input", { bubbles: true }));
        pad.navCooldown = 0.1;
      }
    } else if (vert || horiz) {
      if (pad.navCooldown <= 0) {
        moveFocus(vert || horiz);
        pad.navCooldown = pad.navHeld ? 0.14 : 0.32;
        pad.navHeld = true;
      }
    } else {
      pad.navCooldown = 0;
      pad.navHeld = false;
    }
    if (edge(0)) {
      const items = menuItems();
      if (items.includes(focused) && focused.type !== "range") focused.click();
      else if (game.state === "perk") focusFirst(perkCards);
      else startButton.click();
    }
    if (edge(9) && game.state !== "perk") startButton.click();
    if (edge(1) && game.state !== "perk") hideSubPanels();
  }
  pad.prev = now;
}

function togglePause() {
  if (game.state === "playing") {
    game.state = "paused";
    pauseMusic();
    releaseWakeLock();
    setControlsVisible(false);
    overlayShownAt = performance.now();
    message.textContent = "Paused. The alien fleet is being polite about it.";
    startButton.textContent = "Resume";
    overlay.classList.remove("hidden");
  } else if (game.state === "paused") {
    game.state = "playing";
    resumeMusic();
    requestWakeLock();
    setControlsVisible(true);
    game.last = performance.now();
    overlay.classList.add("hidden");
  }
}

window.addEventListener("resize", resize);
if (window.visualViewport) window.visualViewport.addEventListener("resize", resize);
window.addEventListener("keydown", event => {
  if (event.target && event.target.tagName === "INPUT" && event.target.type !== "range") {
    if (event.code === "Enter") {
      event.preventDefault();
      document.getElementById("submitScoreButton")?.click();
    }
    return;
  }
  if (game.state === "perk") {
    // 1 / 2 / 3 pick a card; arrows move between them; Enter / Space take the focused one
    event.preventDefault();
    if (event.repeat) return;
    const cards = [...perkCards.querySelectorAll("[data-perk]")];
    const n = { Digit1: 0, Digit2: 1, Digit3: 2, Numpad1: 0, Numpad2: 1, Numpad3: 2 }[event.code];
    if (n != null && cards[n]) choosePerk(cards[n].dataset.perk);
    else if (event.code === "ArrowLeft" || event.code === "ArrowUp") moveFocus(-1);
    else if (event.code === "ArrowRight" || event.code === "ArrowDown") moveFocus(1);
    else if ((event.code === "Enter" || event.code === "Space") && cards.includes(document.activeElement)) choosePerk(document.activeElement.dataset.perk);
    return;
  }
  if (["ArrowLeft", "ArrowRight", "Space", "Enter"].includes(event.code)) event.preventDefault();
  if ((event.code === "KeyP" || event.code === "Escape") && !event.repeat) togglePause();
  if (event.code === "KeyM" && !event.repeat) toggleMute();
  if (event.code === "KeyB" && !event.repeat) useBomb();
  if (event.code === "KeyF" && !event.repeat) game.showPerf = !game.showPerf;
  if ((event.code === "Enter" || event.code === "Space") && !event.repeat
    && (game.state === "ready" || game.state === "over" || game.state === "paused")
    && performance.now() - overlayShownAt > 500) {
    startButton.click();
    return;
  }
  keys.add(event.code);
});
window.addEventListener("keyup", event => keys.delete(event.code));
window.addEventListener("blur", () => keys.clear());
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // Returning to a menu / game-over screen: resume the menu loop we paused on hide.
    if (game.state === "ready" || game.state === "over") resumeMusic();
    return;
  }
  keys.clear();
  if (game.state === "playing") togglePause();
  else pauseMusic();
});

function beginRun(mode, startWave) {
  if (mode === "daily") { refreshDaily(); renderDailyNote(); }
  requestImmersiveMode();
  unlockAudio();
  hideSubPanels();
  sfx.select();
  resetGame(mode, startWave);
}

startButton.addEventListener("click", () => {
  requestImmersiveMode();
  unlockAudio();
  if (game.state === "paused") {
    togglePause();
    return;
  }
  hideSubPanels();
  sfx.select();
  // the title screen's big button is the Arcade Run; after a run it replays that mode
  resetGame(game.state === "ready" ? "classic" : game.mode || "classic", game.practiceStart);
});

dailyButton.addEventListener("click", () => {
  dailyButton.blur();
  beginRun("daily");
});

rushButton.addEventListener("click", () => {
  rushButton.blur();
  beginRun("bossrush");
});

practiceButton.addEventListener("click", () => {
  unlockAudio();
  toggleSubPanel(practicePanel, renderPractice);
});

practicePanel.addEventListener("click", event => {
  const chip = event.target.closest("[data-wave]");
  if (!chip) return;
  beginRun("practice", Number(chip.dataset.wave));
});

medalsButton.addEventListener("click", () => {
  unlockAudio();
  toggleSubPanel(medalsPanel, () => medals.render(medalsPanel));
});

settingsButton.addEventListener("click", () => {
  unlockAudio();
  toggleSubPanel(settingsPanel, () => renderSettings(settingsPanel, settings, onSettingsChange));
});

shareButton.addEventListener("click", () => {
  unlockAudio();
  toggleSubPanel(sharePanel, renderSharePanel);
});

sharePanel.addEventListener("click", async event => {
  const action = event.target.closest("[data-share]");
  if (!action || !shareCanvas) return;
  const filename = `invaders-3d-${game.score}.png`;
  const text = `I scored ${game.score.toLocaleString()} in Invaders 3D — can you beat it? https://jez237.com/games/2026-06-05/invaders/3d/`;
  const result = action.dataset.share === "share"
    ? await shareCardImage(shareCanvas, { title: "Invaders 3D", text, filename })
    : await downloadCardImage(shareCanvas, filename);
  const note = sharePanel.querySelector(".share-status");
  if (note) note.textContent = result === "shared" ? "Shared." : result === "downloaded" ? "Saved to your downloads." : result === "cancelled" ? "" : "Couldn't share — try Save Image.";
});

perkCards.addEventListener("click", event => {
  const card = event.target.closest("[data-perk]");
  if (card) choosePerk(card.dataset.perk);
});

function renderSharePanel() {
  sfx.shutter();
  if (!shareCanvas) {
    const modeName = game.mode === "daily" ? `Daily · ${activeModifier().name}` : MODE_LABELS[game.mode];
    shareCanvas = buildShareCard({
      shot: stage.snapshot(),
      score: game.score,
      waveLabel: game.mode === "bossrush" ? `WARSHIP ${displayWave()}` : `WAVE ${game.wave}`,
      mode: modeName,
      sector: stage.sectorName(game.sector),
      medals: medals.count(),
      total: medals.total,
      url: "jez237.com/games/2026-06-05/invaders/3d"
    });
  }
  const canShare = canShareFiles();
  sharePanel.innerHTML = `
    <h2>Share Card</h2>
    <img class="share-preview" alt="Share card: score ${game.score.toLocaleString()}" src="${shareCanvas.toDataURL("image/jpeg", 0.86)}">
    <div class="share-actions">
      ${canShare ? '<button type="button" data-share="share">Share</button>' : ""}
      <button type="button" class="secondary" data-share="save">Save Image</button>
    </div>
    <p class="share-status panel-note"></p>`;
}

function onSettingsChange(next, key) {
  saveSettings(next);
  applySettings(key);
}

function applySettings(key = "*") {
  applyAudioSettings();
  stage.setOptions({
    shake: { off: 0, low: 0.45, full: 1 }[settings.shake] ?? 1,
    flash: { off: 0, low: 0.45, full: 1 }[settings.flash] ?? 1,
    glow: { low: 0.55, normal: 1, high: 1.4 }[settings.glow] ?? 1,
    colorblind: settings.palette === "cb",
    cinema: settings.cinema === "on"
  });
  if ((key === "*" || key === "quality") && !qualityPinnedByUrl) stage.setQuality(settings.quality);
  if (key === "palette") { try { stage.paintRoster(document.querySelectorAll("[data-enemy-sprite]")); } catch (error) {} }
}

bombButton.addEventListener("click", () => {
  bombButton.blur();
  useBomb();
});

scoresPanel.addEventListener("click", event => {
  if (event.target.id !== "submitScoreButton") return;
  const input = document.getElementById("initialsInput");
  const initials = sanitizeInitials(input ? input.value : "YOU");
  const highlightTs = addLocalScore(initials, game.score, game.wave);
  game.scoreSubmitted = true;
  overlayShownAt = performance.now();
  message.textContent = `Score saved for ${initials}. Final score: ${game.score.toLocaleString()}.`;
  showScores(false, highlightTs);
  submitGlobalScore(initials, game.score, game.wave).then(() => showScores(false, highlightTs));
});

scoresButton.addEventListener("click", () => {
  if (scoresPanel.classList.contains("hidden")) {
    showScores(false);
  } else {
    hideScores();
  }
});

scoresPanel.addEventListener("input", event => {
  if (event.target.id !== "initialsInput") return;
  const clean = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3);
  if (event.target.value !== clean) event.target.value = clean;
});

function pointerCanvasX(event) {
  return stage.pointerToGameX(event.clientX, event.clientY);
}

// Steering listens on the whole window so the ship keeps tracking when the
// pointer crosses into the letterbox gutters; buttons and overlays opt out.
function steerTarget(event) {
  return !(event.target && event.target.closest && event.target.closest("button, input, a, .overlay, .controls"));
}

function setTouchAim(event, active) {
  if (active && game.state !== "playing") return;
  if (!active && touchAim.pointerId !== null && event.pointerId !== touchAim.pointerId) return;
  if ((active || touchAim.active) && event.cancelable) event.preventDefault();
  touchAim.active = active;
  touchAim.pointerId = active ? event.pointerId : null;
  if (active) touchAim.x = pointerCanvasX(event);
  else if (event.pointerType !== "mouse") touchAim.x = null;
  if (active && canvas.setPointerCapture) {
    try { canvas.setPointerCapture(event.pointerId); } catch (error) {}
  }
}

window.addEventListener("pointerdown", event => {
  if (!steerTarget(event)) return;
  unlockAudio();
  setTouchAim(event, true);
});
window.addEventListener("pointermove", event => {
  if (game.state !== "playing" || !steerTarget(event)) return;
  if (event.pointerType === "mouse") {
    // Mouse follows without holding a button; holding it (or Space) fires.
    touchAim.x = pointerCanvasX(event);
    return;
  }
  if (!touchAim.active) return;
  if (touchAim.pointerId !== null && event.pointerId !== touchAim.pointerId) return;
  if (event.cancelable) event.preventDefault();
  touchAim.x = pointerCanvasX(event);
});
window.addEventListener("pointerup", event => setTouchAim(event, false));
window.addEventListener("pointercancel", event => setTouchAim(event, false));
document.addEventListener("contextmenu", event => {
  if (game.state === "playing") event.preventDefault();
});

pauseButton.addEventListener("click", () => {
  pauseButton.blur();
  togglePause();
});

muteButton.addEventListener("click", () => {
  muteButton.blur();
  toggleMute();
});

window.__invadersQA = {
  version: VERSION,
  game,
  daily() { return { key: DAILY_KEY, seed: DAILY_SEED, modifier: DAILY_MODIFIER, slug: DAILY_SLUG }; },
  setMode(mode) {
    game.mode = mode === "daily" ? "daily" : "classic";
    if (game.mode === "daily") seedGameplay(DAILY_SEED);
    return game.mode;
  },
  startRun(mode) { beginRun(mode || "classic"); return { mode: game.mode, modifier: activeModifier().id }; },
  // Deterministic layout signature for a given wave/mode — used to prove the
  // daily challenge produces identical waves across devices/runs.
  layoutFor(wave, mode) {
    const saved = { mode: game.mode, wave: game.wave, state: game.state, invaders: game.invaders, boss: game.boss, bossKind: game.bossKind };
    game.mode = mode || "daily";
    game.wave = wave;
    game.state = "ready";
    spawnWave();
    const sig = game.invaders.map(i => i.type[0] + (i.zealot ? "z" : "")).join("") + "|" + (game.bossWave ? game.bossKind : "-");
    game.mode = saved.mode; game.wave = saved.wave; game.state = saved.state;
    game.invaders = saved.invaders; game.boss = saved.boss; game.bossKind = saved.bossKind;
    return sig;
  },
  spawnBossKind(kind) {
    if (!game.invaders.length && game.state !== "playing") game.invaders = [];
    game.wave = Math.max(game.wave, 4);
    spawnBoss(kind);
    return { kind: game.boss.kind, hp: game.boss.hp, turrets: game.boss.turrets.length };
  },
  tick(dt = 0.016, n = 1) {
    for (let i = 0; i < n; i++) { update(dt); }
    return this.snapshot();
  },
  profile(n = 400, dt = 0.016) {
    const times = new Array(n);
    const spikes = [];
    const flips0 = game.autoLowFlips || 0;
    for (let i = 0; i < n; i++) {
      const t0 = performance.now();
      update(dt);
      stage.render(dt);
      const d = performance.now() - t0;
      times[i] = d;
    }
    const sorted = times.slice().sort((a, b) => a - b);
    const sum = times.reduce((s, x) => s + x, 0);
    for (let i = 1; i < n; i++) if (times[i] > sorted[Math.floor(n * 0.5)] * 3 + 1) spikes.push({ frame: i, ms: +times[i].toFixed(2) });
    return {
      n,
      avg: +(sum / n).toFixed(3),
      p50: +sorted[Math.floor(n * 0.5)].toFixed(3),
      p95: +sorted[Math.floor(n * 0.95)].toFixed(3),
      p99: +sorted[Math.floor(n * 0.99)].toFixed(3),
      max: +sorted[n - 1].toFixed(3),
      spikeCount: spikes.length,
      spikes: spikes.slice(0, 10),
      stage: stage.info(),
      autoLowFlips: (game.autoLowFlips || 0) - flips0,
      fxLow: game.fxLow,
      particles: game.particles.length,
      bullets: game.bullets.length,
      enemyBullets: game.enemyBullets.length
    };
  },
  startMode(mode, wave) { beginRun(mode, wave); return { mode: game.mode, wave: game.wave, display: displayWave(), sector: game.sector, perks: { ...game.perks }, lives: game.lives }; },
  forceWave(wave) { game.wave = wave; spawnWave(); return { wave: game.wave, boss: game.bossWave, kind: game.bossKind, types: [...new Set(game.invaders.map(i => i.type))], sector: game.sector }; },
  openPerks() { openPerkPick(advanceWave); perkOpenedAt = 0; return game.perkOffer ? game.perkOffer.map(p => p.id) : []; },
  pickPerk(i = 0) { const card = perkCards.querySelectorAll("[data-perk]")[i]; if (card) choosePerk(card.dataset.perk); return { state: game.state, perks: { ...game.perks }, wave: game.wave }; },
  spawnSaucer() { game.nextSaucer = 0; game.waveBanner = null; spawnSaucer(); return { x: game.saucer.x, y: game.saucer.y, hum: !!game.saucer.hum }; },
  shootSaucer() { const s = game.saucer; if (!s) return null; const before = game.score; game.bullets.push({ x: s.x, y: s.y + 30, px: s.x, py: s.y + 40, vx: 0, vy: -700, r: 4, damage: 1, pierce: 0, color: colors.bullet, life: 1 }); updateBullets(0.016); return { killed: !game.saucer, gained: game.score - before, powerups: game.powerups.length }; },
  wardenTest() {
    const w = game.invaders.find(i => i.type === "warden");
    if (!w) return null;
    const savedShields = game.shields;
    game.shields = [];
    const shoot = vx => { game.bullets.push({ x: w.x - vx * 0.05, y: w.y + 40, px: w.x - vx * 0.08, py: w.y + 60, vx, vy: -700, r: 4, damage: 1, pierce: 0, color: colors.bullet, life: 1 }); updateBullets(0.03); };
    const b0 = w.barrier, h0 = w.hp;
    shoot(0);
    const afterStraight = { barrier: w.barrier, hp: w.hp };
    shoot(160);
    const afterAngled = { barrier: w.barrier, hp: w.hp };
    game.shields = savedShields;
    return { b0, h0, afterStraight, afterAngled };
  },
  phantomState() { return game.invaders.filter(i => i.type === "phantom").map(i => ({ phase: i.phase, x: Math.round(i.x), y: Math.round(i.y), fade: i.fade, ghost: i.ghost })); },
  hiveState() { const b = game.boss; return b && b.sats ? { kind: b.kind, sats: b.sats.filter(s => !s.dead).length, intro: b.intro } : null; },
  killBoss() { if (!game.boss) return null; game.boss.intro = 0; damageBoss(99999); return { boss: !!game.boss, cine: stage.cineState(), slowmo: game.slowmo }; },
  setSector(i) { game.sector = i; return stage.setSector(i, false); },
  tension() { return { tension, target: tensionTarget(), musicRate, heartTimer }; },
  settings() { return { ...settings }; },
  medals() { return { count: medals.count(), total: medals.total }; },
  unlock(id) { return medals.unlock(id); },
  pad() { return { ...pad, prev: undefined }; },
  shareCard() { shareCanvas = null; toggleSubPanel(sharePanel, renderSharePanel); return { w: shareCanvas.width, h: shareCanvas.height }; },
  endRun() { game.lives = 1; game.player.invulnerable = 0; game.cineGuard = 0; game.player.shield = 1; hitPlayer(999); return game.state; },
  clearInvaders() { game.invaders = []; return true; },
  killAll(damage = 99) {
    for (const inv of game.invaders.slice()) damageInvader(inv, damage);
    return game.invaders.length;
  },
  makeSplitter() {
    if (!game.invaders.length) return null;
    const inv = game.invaders[game.invaders.length - 1];
    inv.type = "splitter";
    const before = game.invaders.length;
    damageInvader(inv, 99);
    return { before, after: game.invaders.length, minis: game.invaders.filter(i => i.type === "mini").length };
  },
  grantOverdrive() { triggerOverdrive(); return game.overdrive; },
  addBomb(n = 1) { grantBomb(n); return game.bombs; },
  fireBomb() { const before = game.bombs; useBomb(); return { before, after: game.bombs }; },
  snapshot() {
    return {
      version: VERSION,
      mode: game.mode,
      modifier: activeModifier().id,
      wave: game.wave,
      bombs: game.bombs,
      overdrive: game.overdrive,
      bossKind: game.bossKind,
      boss: !!game.boss,
      invaders: game.invaders.length,
      fxLow: game.fxLow,
      fpsAvg: Math.round(game.fpsAvg),
      samplesLoaded: Object.keys(sampleBuffers).length,
      musicKey: currentMusicKey,
      stage: stage.info()
    };
  },
  forceDiverSwoop() {
    if (!game.player) return null;
    if (!game.invaders.length) spawnWave();
    const inv = game.invaders.find(enemy => enemy.type === "diver") || game.invaders[0];
    inv.type = "diver";
    inv.divePhase = "swoop";
    inv.diveTime = 0.5;
    inv.diveDir = 1;
    inv.diveStartX = game.player.x - 90;
    inv.diveStartY = game.player.y - 180;
    inv.prevX = inv.diveStartX - 80;
    inv.prevY = inv.diveStartY + 15;
    inv.x = game.player.x - 8;
    inv.y = game.player.y - 92;
    inv.hp = 1;
    inv.maxHp = 1;
    return { x: inv.x, y: inv.y, phase: inv.divePhase };
  },
  forceDiverWarning() {
    if (!game.player) return null;
    if (!game.invaders.length) spawnWave();
    const inv = game.invaders.find(enemy => enemy.type === "diver") || game.invaders[0];
    inv.type = "diver";
    startDiverAttack(inv);
    return { x: inv.x, y: inv.y, phase: inv.divePhase, warning: inv.diveWarning };
  },
  testMovingDiverHit() {
    const inv = game.invaders.find(enemy => enemy.divePhase === "swoop")
      || game.invaders.find(enemy => enemy.type === "diver")
      || null;
    if (!inv) return false;
    const savedShields = game.shields;
    game.shields = [];
    inv.prevX = inv.x - 2;
    inv.prevY = inv.y + 1;
    const countBefore = game.invaders.length;
    const bullet = {
      x: inv.x,
      y: inv.y + 84,
      px: inv.x,
      py: inv.y + 84,
      vx: 0,
      vy: -620,
      r: 4,
      damage: 99,
      color: colors.bullet,
      life: 1
    };
    game.bullets.push(bullet);
    updateBullets(0.22);
    const hit = game.invaders.length < countBefore;
    game.shields = savedShields;
    return hit;
  },
  forceBossWave() {
    game.wave = 4;
    game.time = Math.max(game.time, 0.1);
    spawnWave();
    return {
      boss: !!game.boss,
      intro: game.boss ? game.boss.intro : 0,
      banner: game.waveBanner ? game.waveBanner.text : null
    };
  },
  triggerPowerFlash(type = "laser") {
    if (!game.player) return null;
    applyPowerup(type);
    return game.powerFlash ? { text: game.powerFlash.text, type: game.powerFlash.type } : null;
  },
  testPolishState() {
    return {
      version: this.version,
      waveBannerSubtext: !!(game.waveBanner && game.waveBanner.subtext),
      powerFlash: !!game.powerFlash,
      screenFlash: game.screenFlash,
      diverCueReady: game.invaders.some(enemy => enemy.divePhase === "warning" || enemy.divePhase === "swoop")
    };
  },
  waveBannerPlacement() {
    const h = game.waveBanner && game.waveBanner.subtext ? 86 : 68;
    const bottom = game.invaders.length ? Math.max(...game.invaders.map(inv => inv.y + inv.r)) : 0;
    return {
      version: this.version,
      y: waveBannerY(h),
      top: waveBannerY(h) - h / 2,
      formationBottom: bottom,
      belowFormation: waveBannerY(h) - h / 2 > bottom + 8
    };
  }
};

function boot() {
  try {
    stage = createStage({
      canvas,
      fxCanvas,
      game,
      colors,
      version: VERSION,
      patterns: { invaderSprites, playerPattern, bossPattern: bossCarrierPattern, hivePattern: bossHivePattern },
      helpers: { playerShieldRadius, waveBannerY, hasMod, overdriveDuration }
    });
  } catch (error) {
    document.body.classList.add("no-webgl");
    message.innerHTML = 'This 3D Edition needs WebGL 2, which this browser could not start. <a href="../classic/">Play the Classic Edition</a> instead.';
    return;
  }
  window.__invadersQA.stage = stage;
  resize();
  game.player = {
    x: game.width / 2,
    y: playerLaneY(),
    r: 18,
    vx: 0,
    shield: 100,
    invulnerable: 0,
    dash: 0,
    weapon: "pulse",
    weaponTimer: 0,
    heat: 0
  };
  makeShields();
  updateHud();
  applyMute();
  toast = createToast(document.getElementById("toast"));
  medals = createMedals(medal => {
    toast.show(medal.icon, "Medal unlocked", medal.name);
    sfx.medal();
  });
  applySettings();
  if (/[?&]perf/i.test(location.search)) game.showPerf = true;
  controlsHint.textContent = window.matchMedia && matchMedia("(pointer: coarse)").matches
    ? "Drag anywhere — your ship follows your finger and auto-fires. Tap 💣 for a smart bomb. Chain kills to trigger Overdrive."
    : "Mouse steers · Fire: hold mouse or Space · Move: ← → / A D · Dash: Shift · Bomb: B · Pause: P · Mute: M · Controllers work too.";
  renderDailyNote();
  try { stage.paintRoster(document.querySelectorAll("[data-enemy-sprite]")); } catch (error) {}
  renderScores(false);
  document.body.classList.add("ready");
  for (const button of [startButton, dailyButton, scoresButton, rushButton, practiceButton, medalsButton, settingsButton]) button.disabled = false;
  game.last = performance.now();
  requestAnimationFrame(loop);
}

boot();
