// Invaders — 3D Edition. Game logic is the Classic Edition's, unchanged in rules;
// stage.js draws it in real-time 3D and the sound set is a new ElevenLabs suite.
import { createStage } from "./stage.js?v=1";

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

const VERSION = "v3.0.0";
const TAU = Math.PI * 2;
const LOCAL_SCORES_KEY = "invaders3d_highscores_v1";
const LOCAL_DAILY_PREFIX = "invaders3d_daily_";
const LAST_INITIALS_KEY = "neon_invaders_last_initials";
const MUTE_KEY = "neon_invaders_muted";
// The 3D Edition keeps its own global boards, apart from the Classic Edition's.
const SCORES_BASE = "https://game-scores.jez237.workers.dev/scores/";
const CLASSIC_SLUG = "invaders-3d";
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
  enemyShot: "audio/sfx-enemy-shot.mp3"
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
const BOSS_KINDS = ["carrier", "interceptor", "bulwark"];
const BOSS_NAMES = { carrier: "CARRIER", interceptor: "INTERCEPTOR", bulwark: "BULWARK" };

function activeModifier() { return game.mode === "daily" ? DAILY_MODIFIER : MODIFIERS[0]; }
function hasMod(id) { return activeModifier().id === id; }
function scoresSlug() { return game.mode === "daily" ? DAILY_SLUG : CLASSIC_SLUG; }

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
  fpsWindow: 0
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
  fire: "#ff7a2d"
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
    sfxGain.gain.value = 0.85;
    sfxGain.connect(masterGain);
    musicGain = soundCtx.createGain();
    musicGain.gain.value = 1;
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
  try { src.start(); } catch (error) { activeVoices = Math.max(0, activeVoices - 1); return false; }
  return true;
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
  }
};

function sanitizeInitials(value) {
  return (value || "YOU").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3).padEnd(3, "A");
}

function localScoresKey() {
  return game.mode === "daily" ? LOCAL_DAILY_PREFIX + DAILY_KEY.replace(/-/g, "") : LOCAL_SCORES_KEY;
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
  const lastInitials = sanitizeInitials(localStorage.getItem(LAST_INITIALS_KEY) || "YOU");
  const entryHtml = includeEntry && game.score > 0 && !game.scoreSubmitted
    ? `<div class="score-entry"><div class="score-entry-title">Enter Initials</div><input id="initialsInput" maxlength="3" value="${lastInitials}" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="done" aria-label="Initials"><button id="submitScoreButton" type="button">Save Score</button></div>`
    : "";
  scoresPanel.innerHTML = `
    ${entryHtml}
    <h2>Local High Scores</h2>
    <div>${scoreRows(loadLocalScores(), highlightTs)}</div>
    <h2>Global High Scores</h2>
    <div id="globalScoreRows" style="opacity:.68">Loading...</div>
  `;
  fetchGlobalScores().then(scores => {
    const target = document.getElementById("globalScoreRows");
    if (!target) return;
    target.style.opacity = "1";
    target.innerHTML = scoreRows(scores);
  });
}

function showScores(includeEntry = false, highlightTs = 0) {
  renderScores(includeEntry, highlightTs);
  scoresPanel.classList.remove("hidden");
  scoresButton.textContent = "Hide Scores";
}

function hideScores() {
  scoresPanel.classList.add("hidden");
  scoresButton.textContent = "High Scores";
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

function resetGame(mode) {
  game.mode = mode === "daily" ? "daily" : "classic";
  game.state = "playing";
  game.time = 0;
  game.last = performance.now();
  game.score = 0;
  game.wave = 1;
  game.lives = hasMod("glass-cannon") ? 1 : 3;
  game.bombs = hasMod("boss-rush") ? 3 : 2;
  game.nextBombWave = 3;
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
  const shieldHp = hasMod("iron-bunkers") ? 5 : 3;
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
  const bossEvery = hasMod("boss-rush") ? 2 : 4;
  game.bossWave = game.wave % bossEvery === 0;
  const bossOrdinal = game.bossWave ? Math.floor(game.wave / bossEvery) : 0;
  if (game.bossWave) game.bossKind = BOSS_KINDS[(bossOrdinal - 1) % BOSS_KINDS.length];
  game.invaderDir = 1;
  game.invaderStepTimer = 0;
  game.invaderMarchTimer = 0;
  game.invaderFrame = 0;
  game.nextDive = game.time + drand(9001, 2.4, 4.8);
  const bossSub = game.bossKind === "interceptor" ? "Fast strike frigate"
    : game.bossKind === "bulwark" ? "Shielded siege platform"
    : "Capital ship contact";
  game.waveBanner = {
    text: game.bossWave ? BOSS_NAMES[game.bossKind] + " INBOUND" : `WAVE ${game.wave}`,
    subtext: game.bossWave ? bossSub : game.wave % 3 === 0 ? "Red dive squadron" : game.wave % 2 === 0 ? "Striker pressure rising" : "Alien formation advancing",
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
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let type = y === 0 ? "diver" : y < 3 ? "striker" : "drone";
      if (doubleDivers && y === 1) type = "diver";
      if (type === "drone" && gpAt(y * 131 + x * 7 + 1) < splitterChance) type = "splitter";
      const zealot = type === "diver" && gpAt(y * 131 + x * 7 + 2) < zealotChance;
      const hp = type === "diver" ? 2 + Math.floor(game.wave / 4)
        : type === "striker" ? 2 + Math.floor(game.wave / 9)
        : type === "splitter" ? 3 + Math.floor(game.wave / 6)
        : 1 + Math.floor(game.wave / 11);
      game.invaders.push({
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
      });
    }
  }
  if (game.bossWave) spawnBoss(game.bossKind);
}

function spawnBoss(kind) {
  game.bossKind = kind;
  const baseHp = 48 + game.wave * 9;
  const hpMul = kind === "interceptor" ? 0.68 : kind === "bulwark" ? 1.5 : 1;
  const hp = Math.round(baseHp * hpMul);
  game.shake = Math.max(game.shake, 7);
  sfx.bossAppear();
  const boss = {
    kind,
    x: game.width / 2,
    y: -88,
    targetY: Math.max(52, 62 * game.scale),
    r: kind === "interceptor" ? 46 : kind === "bulwark" ? 64 : 58,
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
  game.boss = boss;
  if (game.state === "playing") playMusic("boss");
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
  updateRings(realDt);
  adaptQuality(realDt);
  if (game.state !== "playing") return;
  const timeScale = game.hitStop > 0 ? 0 : game.slowmo > 0 ? 0.32 : 1;
  const dt = realDt * timeScale;
  if (dt <= 0) return;
  const p = game.player;
  game.time += dt;
  game.overdrive = Math.max(0, game.overdrive - dt);
  syncPlayerLane();
  game.shake = Math.max(0, game.shake - dt * 18);
  game.comboTimer = Math.max(0, game.comboTimer - dt);
  if (game.comboTimer === 0) game.combo = 1;

  const left = keys.has("ArrowLeft") || keys.has("KeyA");
  const right = keys.has("ArrowRight") || keys.has("KeyD");
  const fire = keys.has("Space") || keys.has("Enter") || touchAim.active;
  const dashPressed = keys.has("ShiftLeft") || keys.has("ShiftRight");
  const accel = 2100;
  const maxSpeed = dashPressed && p.dash <= 0 ? 680 : 410;

  // Keyboard overrides a parked mouse-hover target; an active press always wins.
  if (!touchAim.active && (left || right)) touchAim.x = null;
  const steering = touchAim.x !== null;
  if (steering) {
    const target = clamp(touchAim.x, 30, game.width - 30);
    const delta = target - p.x;
    p.vx = clamp(delta * 9, -maxSpeed, maxSpeed);
    if (Math.abs(delta) < 3) p.vx *= 0.35;
  } else if (left) p.vx -= accel * dt;
  if (!steering && right) p.vx += accel * dt;
  if (!steering && !left && !right) p.vx *= Math.pow(0.0008, dt);
  p.vx = clamp(p.vx, -maxSpeed, maxSpeed);
  p.x = clamp(p.x + p.vx * dt, 30, game.width - 30);
  p.invulnerable = Math.max(0, p.invulnerable - dt);
  p.dash = Math.max(0, p.dash - dt);
  p.heat = Math.max(0, p.heat - dt * 0.65);
  if (dashPressed && p.dash <= 0 && (left || right)) {
    p.vx = (right ? 1 : -1) * 760;
    p.dash = 1.2;
    p.invulnerable = Math.max(p.invulnerable, 0.18);
    burst(p.x, p.y + 8, colors.player, 18, 220);
  }
  if (fire) firePlayer();

  if (p.weaponTimer > 0) {
    p.weaponTimer -= dt;
    if (p.weaponTimer <= 0) p.weapon = "pulse";
  }

  updateInvaders(dt);
  updateBoss(dt);
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
  const liveCount = Math.max(1, game.invaders.length);
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
  if (game.invaderStepTimer >= interval && game.invaders.length) {
    game.invaderStepTimer = 0;
    game.invaderFrame = 1 - game.invaderFrame;
    sfx.step(game.invaderFrame);
    let hitEdge = false;
    for (const inv of game.invaders) {
      const nextX = (inv.homeX ?? inv.x) + stepX;
      if (nextX < inv.r + 14 || nextX > game.width - inv.r - 14) {
        hitEdge = true;
        break;
      }
    }
    if (hitEdge) {
      game.invaderDir *= -1;
      for (const inv of game.invaders) {
        inv.homeY = (inv.homeY ?? inv.y) + dropY;
        if (!inv.divePhase) inv.y = inv.homeY;
      }
    } else {
      for (const inv of game.invaders) {
        inv.homeX = (inv.homeX ?? inv.x) + stepX;
        if (!inv.divePhase) inv.x = inv.homeX;
      }
    }
  }
  updateDiverAttacks(dt);
  for (const inv of game.invaders) lowest = Math.max(lowest, inv.y);

  game.nextEnemyShot -= dt;
  if (game.nextEnemyShot <= 0 && game.invaders.length) {
    const bottomY = lowest; // already = max inv.y over all invaders (computed above)
    const shooters = game.invaders.filter(inv => !inv.divePhase && inv.y >= bottomY - 4);
    if (shooters.length) {
      const volley = clamp(1 + Math.floor((game.wave - 3) / 4), 1, game.compact ? 2 : 3);
      for (let i = 0; i < volley; i++) {
        const shooter = shooters[Math.floor(Math.random() * shooters.length)];
        enemyBomb(shooter.x, shooter.y + 14, 205 + game.wave * 13, rand(-24, 24));
      }
    }
    game.nextEnemyShot = clamp(1.34 - game.wave * 0.06, 0.32, 1.34) * (hasMod("laser-storm") ? 0.7 : 1);
  }

  if (lowest > game.player.y - 42) hitPlayer(70);
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

function updateBoss(dt) {
  const boss = game.boss;
  if (!boss) return;
  boss.phase += dt;
  const targetY = boss.targetY ?? Math.max(48, 62 * game.scale);
  if (boss.intro > 0) {
    boss.intro = Math.max(0, boss.intro - dt);
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
      const killed = damageInvader(invaderHit.inv, b.damage);
      if (b.pierce > 0 && killed) b.pierce -= 1;
      else b.life = 0;
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
      if (game.boss.intro <= 0 && distSq(b, game.boss) < (b.r + game.boss.r) * (b.r + game.boss.r)) {
        b.life = 0;
        damageBoss(b.damage);
      }
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
  for (const core of game.powerups) {
    core.y += core.vy * dt;
    core.phase += dt * 4;
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
  game.screenFlash = Math.max(0, game.screenFlash - dt * 3.8);
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
  const doomed = game.invaders.slice();
  for (const inv of doomed) {
    burst(inv.x, inv.y, colors.gold, 6, 150);
    damageInvader(inv, 999);
  }
  // A killed Splitter spawns minis mid-loop that aren't in the snapshot — a screen
  // clear shouldn't birth new divers, so sweep them (and any stragglers) out.
  if (game.invaders.some(i => i.type === "mini")) {
    game.invaders = game.invaders.filter(i => i.type !== "mini");
  }
  if (game.boss) damageBoss(18 + game.wave);
  addFloatText(game.player.x, game.player.y - 60, "SMART BOMB", colors.gold, 1.1);
  if (navigator.vibrate) { try { navigator.vibrate(60); } catch (error) {} }
  updateHud();
}

function triggerOverdrive() {
  const dur = hasMod("overcharged") ? 6 : 4;
  const fresh = game.overdrive <= 0;
  game.overdrive = Math.max(game.overdrive, dur);
  if (fresh) {
    addFloatText(game.player.x, game.player.y - 66, "OVERDRIVE!", colors.gold, 1.05);
    spawnRing(game.player.x, game.player.y, 170, "255, 210, 61", 5, 0.55);
    game.screenFlash = Math.max(game.screenFlash, 0.3);
    game.flashColor = "255, 210, 61";
    sfx.overdrive();
  }
}

function grantBomb(count = 1) {
  game.bombs = Math.min(5, game.bombs + count);
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
  if (game.waveDamage === 0) {
    game.perfectStreak += 1;
    const bonus = 200 * game.wave + game.perfectStreak * 100;
    game.score += bonus;
    addFloatText(game.player.x, game.player.y - 80, "PERFECT WAVE +" + bonus.toLocaleString(), colors.bullet, 1.4);
    spawnRing(game.player.x, game.player.y, 220, "167, 255, 61", 5, 0.6);
    game.screenFlash = Math.max(game.screenFlash, 0.35);
    game.flashColor = "167, 255, 61";
    sfx.perfect();
  } else {
    game.perfectStreak = 0;
  }
  game.wave += 1;
  game.waveClearTimer = 0;
  game.player.shield = Math.min(92, game.player.shield + 7);
  if (game.wave >= game.nextBombWave) {
    grantBomb(1);
    game.nextBombWave = game.wave + 3;
    addFloatText(game.player.x, game.player.y - 56, "SMART BOMB +1", colors.gold, 1.1);
  }
  sfx.wave();
  makeShields();
  spawnWave();
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
  const base = inv.type === "diver" ? 45 : inv.type === "splitter" ? 40 : inv.type === "striker" ? 30 : inv.type === "mini" ? 12 : 20;
  addScore(base);
  game.shake = Math.max(game.shake, 4);
  if (inv.type === "splitter") splitInvader(inv);
  if (wasDiving) {
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
  return true;
}

function maybeComboPopup(inv) {
  // Occasional multiplier callouts so streaks read without spamming the screen.
  if (Math.random() > 0.22) return;
  addFloatText(inv.x, inv.y - 18, "x" + game.combo.toFixed(1), colors.gold, 0.7);
}

function splitInvader(inv) {
  for (let i = 0; i < 2; i++) {
    const dir = i === 0 ? -1 : 1;
    game.invaders.push({
      x: inv.x,
      y: inv.y,
      baseX: inv.x,
      baseY: inv.y,
      homeX: inv.x,
      homeY: inv.y,
      r: 10,
      type: "mini",
      zealot: false,
      hp: 1,
      maxHp: 1,
      col: inv.col,
      row: inv.row,
      mini: true,
      commit: true,
      divePhase: "swoop",
      diveTime: 0,
      diveHit: false,
      diveDir: dir,
      diveStartX: inv.x,
      diveStartY: inv.y,
      tilt: dir * 0.3
    });
  }
  burst(inv.x, inv.y, colors.bullet, 12, 180);
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
  game.shake = 16;
  game.slowmo = Math.max(game.slowmo, 0.45);
  game.screenFlash = Math.max(game.screenFlash, 0.6);
  game.flashColor = "255, 220, 150";
  game.boss = null;
  grantBomb(1);
  addFloatText(boss.x, boss.y - 30, "WARSHIP DOWN  +💣", colors.gold, 1.3);
  for (let i = 0; i < 3; i++) dropPowerup(boss.x + rand(-50, 50), boss.y + rand(-10, 35));
  if (game.state === "playing") playMusic("gameplay");
}

function addScore(points) {
  const step = hasMod("overcharged") ? 0.14 : 0.08;
  game.combo = clamp(game.combo + step, 1, 3);
  game.comboTimer = 2.8;
  const mult = hasMod("glass-cannon") ? 2 : 1;
  game.score += Math.round(points * game.combo * mult);
  if (game.combo >= 3 && game.overdrive <= 0) triggerOverdrive();
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
  const maxLives = hasMod("glass-cannon") ? 1 : 3;
  if (type === "spread" || type === "laser") {
    p.weapon = type;
    p.weaponTimer = 8;
  } else if (type === "overdrive") {
    game.overdrive = Math.max(game.overdrive, hasMod("overcharged") ? 10 : 8);
  } else if (type === "bomb") {
    grantBomb(1);
  } else if (type === "shield") {
    p.shield = Math.min(105, p.shield + 22);
  } else if (type === "repair") {
    game.lives = Math.min(maxLives, game.lives + 1);
    p.shield = Math.min(100, p.shield + 8);
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
  if (p.invulnerable > 0) return;
  p.shield -= damage;
  game.waveDamage += 1;
  game.shake = 14;
  game.screenFlash = Math.max(game.screenFlash, 0.3);
  game.flashColor = "255, 77, 109";
  p.invulnerable = 1.3;
  burst(p.x, p.y, colors.red, 36, 270, 14);
  sfx.hurt(p.x);
  stage.events.playerHit(false);
  if (navigator.vibrate) {
    try { navigator.vibrate(p.shield <= 0 ? 90 : 35); } catch (error) {}
  }
  if (p.shield <= 0) {
    sfx.lifeLost(p.x);
    stage.events.playerHit(true);
    game.lives -= 1;
    game.combo = 1;
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
  sfx.gameover();
  stopMusic();
  playMusic("menu");
  const modeLabel = game.mode === "daily" ? `Daily Challenge · ${activeModifier().name}` : "Arcade run";
  message.textContent = `${modeLabel} — final score ${game.score.toLocaleString()}, wave ${game.wave}. The fleet regroups.`;
  startButton.textContent = game.mode === "daily" ? "Retry Daily" : "Play Again";
  overlay.classList.add("game-over");
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
  ]
};
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
  waveEl.textContent = String(game.wave);
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
  if (event.target && event.target.tagName === "INPUT") {
    if (event.code === "Enter") {
      event.preventDefault();
      document.getElementById("submitScoreButton")?.click();
    }
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

function beginRun(mode) {
  if (mode === "daily") { refreshDaily(); renderDailyNote(); }
  requestImmersiveMode();
  unlockAudio();
  hideScores();
  sfx.select();
  resetGame(mode);
}

startButton.addEventListener("click", () => {
  requestImmersiveMode();
  unlockAudio();
  if (game.state === "paused") {
    togglePause();
    return;
  }
  hideScores();
  sfx.select();
  resetGame(game.mode || "classic");
});

dailyButton.addEventListener("click", () => {
  dailyButton.blur();
  beginRun("daily");
});

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
      patterns: { invaderSprites, playerPattern, bossPattern: bossCarrierPattern },
      helpers: { playerShieldRadius, waveBannerY, hasMod }
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
  if (/[?&]perf/i.test(location.search)) game.showPerf = true;
  controlsHint.textContent = window.matchMedia && matchMedia("(pointer: coarse)").matches
    ? "Drag anywhere — your ship follows your finger and auto-fires. Tap 💣 for a smart bomb. Chain kills to trigger Overdrive."
    : "Mouse steers · Fire: hold mouse or Space · Move: ← → / A D · Dash: Shift · Bomb: B · Pause: P · Mute: M · Chain kills for Overdrive.";
  renderDailyNote();
  try { stage.paintRoster(document.querySelectorAll("[data-enemy-sprite]")); } catch (error) {}
  renderScores(false);
  document.body.classList.add("ready");
  for (const button of [startButton, dailyButton, scoresButton]) button.disabled = false;
  game.last = performance.now();
  requestAnimationFrame(loop);
}

boot();
