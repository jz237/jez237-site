import * as THREE from 'three';
import { detectQuality } from './core/quality.js';
import { createMaterials } from './materials/library.js';
import { bedTexture, stoneTexture, noiseTexture } from './materials/textures.js';
import { createEnvironments } from './world/environment.js';
import { buildWorld } from './world/world.js';
import { Creatures } from './creatures/manager.js';
import { createShots } from './direction/shots.js';
import { Director } from './direction/director.js';
import { Pipeline } from './render/pipeline.js';
import { DURATION, B } from './direction/beats.js';
import { Controls } from './ui/controls.js';
import { Score, renderScore, bufferToWav } from './audio/score.js';
import { clamp, sseg } from './core/ease.js';

// The Clockwork Garden – entry point.
//   ?t=12.5     start at a timestamp        ?paused=1   start paused
//   ?clean=1    recording mode (no UI)      ?quality=low|med|high
//   ?motion=reduced  gentle-motion version  ?capture=1  frame-capture API only

const params = new URLSearchParams(location.search);
const quality = detectQuality(params);
const clean = params.get('clean') === '1';
const capture = params.get('capture') === '1';
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let reduced = params.get('motion') === 'reduced' || (params.get('motion') !== 'full' && prefersReduced);

const canvas = document.getElementById('film');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: capture, stencil: false });
renderer.setPixelRatio(quality.pixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NoToneMapping; // tone mapping happens in the grade pass
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor('#000000');

function size() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  return renderer.getDrawingBufferSize(new THREE.Vector2());
}

async function boot() {
  const status = document.getElementById('loading');
  const step = async (msg) => {
    if (status) status.dataset.step = msg;
    await new Promise((r) => setTimeout(r, 0));
  };
  size();
  await step('materials');
  const mat = createMaterials(quality);
  const tex = {
    bed: bedTexture(21, quality.tier === 'low' ? 512 : 1024),
    stone: stoneTexture(31, 512),
    moss: noiseTexture(51, 256, { cells: 6, octaves: 4, lo: 0.7, hi: 1.3, tint: [190, 210, 170] }),
  };
  await step('light');
  const envs = createEnvironments(renderer);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#000000');
  await step('garden');
  const world = buildWorld(scene, mat, tex, quality);
  await step('creatures');
  world.creatures = new Creatures(world, mat, quality);
  scene.add(world.creatures.group);
  scene.updateMatrixWorld(true);
  const shots = createShots(world);
  const pipeline = new Pipeline(renderer, scene, quality);
  const director = new Director({ scene, world, shots, pipeline, envs, quality, reducedMotion: reduced });
  // look-dev: orbit a named object (?look=bee&yaw=0.6&pitch=0.3&dist=6&fov=30)
  if (params.get('look')) {
    const C = world.creatures;
    const targets = {
      escapement: () => world.escapement.group.position.clone().add(new THREE.Vector3(0, 0.6, 0)),
      crown: () => world.crown.group.localToWorld(new THREE.Vector3(0, 2, 0)),
      flower: () => world.flower.head.getWorldPosition(new THREE.Vector3()),
      stem: () => new THREE.Vector3(0, 16, 0),
      skep: () => world.skep.group.position.clone().add(new THREE.Vector3(0, 6, 0)),
      lily: () => world.lily.perchWorld(),
      reed: () => world.reed.surfacePoint(0.5, 0.6),
      blossom: () => world.blossom.mouthWorld(),
      tree: () => world.tree.perchWorld(),
      bee: () => C.hero.group.getWorldPosition(new THREE.Vector3()),
      monarch: () => C.monarch?.group.getWorldPosition(new THREE.Vector3()),
      beetle: () => C.beetle?.group.getWorldPosition(new THREE.Vector3()),
      ladybird: () => C.ladybird?.group.getWorldPosition(new THREE.Vector3()),
      hummingbird: () => C.hummingbird?.group.getWorldPosition(new THREE.Vector3()),
      songbird: () => C.songbird?.group.getWorldPosition(new THREE.Vector3()),
      dragonfly: () => C.dragonfly?.group.getWorldPosition(new THREE.Vector3()),
      origin: () => new THREE.Vector3(0, 20, 0),
    };
    const name = params.get('look');
    const yaw = parseFloat(params.get('yaw') || '0.6');
    const pitch = parseFloat(params.get('pitch') || '0.25');
    const dist = parseFloat(params.get('dist') || '8');
    const fov = parseFloat(params.get('fov') || '30');
    director.lookdev = (t) => {
      const c = targets[name]();
      const pos = c.clone().add(new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)).multiplyScalar(dist));
      return { pos, target: c, fov, focus: dist, aperture: parseFloat(params.get('ap') || '0'), roll: 0 };
    };
  }

  const resize = () => {
    const s = size();
    pipeline.setSize(s.x, s.y);
    director.aspect = s.x / s.y;
    director.pixelRatio = renderer.getPixelRatio();
  };
  resize();
  window.addEventListener('resize', resize);

  // warm up: compile every shader by rendering representative frames
  await step('compile');
  for (const t of [0.5, 10, 16, 24, 30, 34, 38, 45]) director.render(t);
  renderer.compile(scene, director.camA);

  const title = document.getElementById('title');
  const updateTitle = (t) => {
    const k = sseg(t, B.titleIn[0], B.titleIn[1]) * (1 - sseg(t, B.fadeOut[0], B.fadeOut[1] - 0.3));
    title.style.opacity = k.toFixed(3);
    title.style.setProperty('--rise', ((1 - k) * 10).toFixed(2) + 'px');
    title.style.letterSpacing = (0.32 + (1 - k) * 0.08).toFixed(3) + 'em';
  };

  const state = { t: clamp(parseFloat(params.get('t') || '0') || 0, 0, DURATION), playing: !capture && params.get('paused') !== '1' };
  const score = new Score();
  const renderAt = (t) => {
    state.t = clamp(t, 0, DURATION);
    director.reducedMotion = reduced;
    director.render(state.t);
    updateTitle(state.t);
    controls?.sync(state);
  };

  let controls = null;
  if (!clean && !capture) {
    controls = new Controls({
      onPlayPause: () => {
        if (state.t >= DURATION - 0.01) state.t = 0;
        state.playing = !state.playing;
        state.playing ? score.play(state.t) : score.pause();
      },
      onReplay: () => {
        state.t = 0;
        state.playing = true;
        score.play(0);
      },
      onSeek: (t) => {
        state.t = t;
        renderAt(t);
        if (state.playing) score.play(t);
      },
      onSound: async () => {
        const on = await score.toggle(state.t, state.playing);
        return on;
      },
      onMotion: () => {
        reduced = !reduced;
        return reduced;
      },
      duration: DURATION,
      reduced: () => reduced,
    });
    if (prefersReduced && params.get('motion') !== 'full') {
      // respect the system preference: wait for the viewer to start
      state.playing = false;
      controls.showGentleNotice();
    }
  }
  document.body.classList.toggle('clean', clean || capture);

  // public API for review and frame capture
  window.__cg = {
    duration: DURATION,
    renderAt: (t) => { renderAt(t); return true; },
    seek: (t) => renderAt(t),
    play: () => { state.playing = true; },
    pause: () => { state.playing = false; },
    state,
    shot: () => director.current,
    info: () => renderer.info,
    world: capture ? world : undefined, // debugging aid in capture mode only
    // render the procedural score offline and return it as base64 WAV
    audioWav: async () => {
      const buf = await renderScore();
      const blob = bufferToWav(buf);
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let s = '';
      for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      return btoa(s);
    },
  };

  status?.remove();
  document.body.classList.add('ready');
  renderAt(state.t);
  if (capture) return;

  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (state.playing) {
      state.t += dt;
      if (state.t >= DURATION) {
        state.t = DURATION;
        state.playing = false;
        score.pause();
        controls?.ended();
      }
      renderAt(state.t);
    } else if (controls?.dirty) {
      controls.dirty = false;
      renderAt(state.t);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

boot().catch((e) => {
  console.error(e);
  const el = document.getElementById('loading');
  if (el) el.textContent = 'The garden could not wake: ' + e.message;
});
