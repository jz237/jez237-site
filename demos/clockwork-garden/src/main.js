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
import { Explore } from './explore/explore.js';
import { Input } from './input/input.js';
import { Hud } from './ui/hud.js';
import { showLanding } from './ui/landing.js';
import { LiveAudio } from './audio/live.js';

// The Clockwork Garden – entry point.
//   ?t=12.5     start at a timestamp        ?paused=1   start paused
//   ?clean=1    recording mode (no UI)      ?quality=low|med|high
//   ?motion=reduced  gentle-motion version  ?capture=1  frame-capture API only
//   ?mode=film|fly|follow   open a mode directly (otherwise a landing screen asks)
//   ?tod=0..1   time of day in the interactive modes (0 midnight, 0.5 dawn, 1 golden hour)
//   ?touch=1|0  force the touch interface on or off

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
    // ?look=bee&stage=landed|flight|walk: inspect the hero bee in a clear spot
    // above the bloom (inside the shot's light) in a chosen pose, facing +Z
    const stage = params.get('stage');
    if (stage && C?.hero) {
      const update = C.updateHero.bind(C);
      C.updateHero = (t, ctx) => {
        update(t, ctx);
        const g = C.hero.group;
        g.visible = true;
        g.position.copy(C.land).add(new THREE.Vector3(0, 4.5, 0));
        g.rotation.set(0, 0, 0);
        const poses = {
          landed: { t, flap: 0, grip: 1, fold: 0.7, pollen: 0.5 },
          folded: { t, flap: 0, grip: 1, fold: 1, pollen: 0 },
          flight: { t, flap: 1, grip: 0, fold: 0, pollen: 0 },
          walk: { t, flap: 0, grip: 1, fold: 1, walk: t * 3 },
          display: { t, flap: 0, grip: 1, fold: 0.1, pollen: 0 },
        };
        C.hero.setPose(poses[stage] || poses.landed);
      };
      // &key=1: a studio-style three-quarter key from the camera's side
      if (params.get('key') === '1') {
        const applyRig = director.applyRig.bind(director);
        director.applyRig = (shot, t, cam) => {
          applyRig(shot, t, cam);
          const c = C.hero.group.position;
          const f = cam.position.clone().sub(c).setY(0).normalize();
          const sd = new THREE.Vector3(-f.z, 0, f.x);
          world.lighting.focusShadow(c, 5);
          world.lighting.aimBeam(c, 4, f.multiplyScalar(0.7).addScaledVector(sd, 0.8).add(new THREE.Vector3(0, 1.0, 0)).normalize(), 4.0, '#ffe2bd', 1.2);
        };
      }
    }
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

  let explore = null;
  const resize = () => {
    const s = size();
    pipeline.setSize(s.x, s.y);
    director.aspect = s.x / s.y;
    director.pixelRatio = renderer.getPixelRatio();
    if (explore) { explore.aspect = director.aspect; explore.pixelRatio = director.pixelRatio; }
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

  // ---- interactive modes (built after the film, so the film's state is untouched) ----
  const touch = params.get('touch') === '1' || (params.get('touch') !== '0' && (window.matchMedia('(pointer: coarse)').matches || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)));
  const audio = new LiveAudio();
  const makeExplore = () => {
    if (!explore) {
      explore = new Explore({ renderer, scene, world, pipeline, quality, mat, audio });
      explore.aspect = director.aspect;
      explore.pixelRatio = renderer.getPixelRatio();
      explore.reduced = reduced;
      explore.touch = touch;
      const tod = parseFloat(params.get('tod'));
      if (Number.isFinite(tod)) explore.tod.value = clamp(tod, 0, 1);
    }
    return explore;
  };
  if (!capture) {
    await step('garden life');
    makeExplore();
    // compile the interactive modes' shaders now, at night and by day
    const keep = explore.tod.value;
    explore.enter('follow');
    for (const v of [keep, 0.1]) { explore.tod.value = v; explore.update(1 / 60, null); explore.render(1 / 60); }
    explore.tod.value = keep;
    explore.exit();
  }

  const state = { t: clamp(parseFloat(params.get('t') || '0') || 0, 0, DURATION), playing: !capture && params.get('paused') !== '1' };
  const score = new Score();
  const renderAt = (t) => {
    state.t = clamp(t, 0, DURATION);
    director.reducedMotion = reduced;
    director.render(state.t);
    updateTitle(state.t);
    controls?.sync(state);
  };

  // which mode to open in: ?mode=film|fly|follow; film-only parameters imply
  // the film; otherwise the landing screen asks
  const filmOnly = clean || capture || params.has('t') || params.has('look') || params.get('paused') === '1';
  let mode = ['film', 'fly', 'follow'].includes(params.get('mode')) ? params.get('mode') : filmOnly ? 'film' : null;
  if (capture) mode = 'film';
  let landing = null;

  let controls = null;
  let hud = null;
  let input = null;
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
        if (explore) explore.reduced = reduced;
        hud?.setGentle(reduced);
        return reduced;
      },
      onMode: (m) => setMode(m),
      duration: DURATION,
      reduced: () => reduced,
    });
    input = new Input(canvas, { touch });
    hud = new Hud({
      onMode: (m) => setMode(m),
      onSwap: () => setMode(mode === 'fly' ? 'follow' : 'fly'),
      onTime: (v) => explore.setTime(v),
      onSound: async () => { const on = await audio.toggle(); return on; },
      onPhoto: () => togglePhoto(),
      onSave: () => savePhoto(),
      onGentle: () => { reduced = !reduced; explore.reduced = reduced; controls.motionBtn.setAttribute('aria-pressed', String(reduced)); return reduced; },
      onPanel: (open) => { if (open && input.locked) document.exitPointerLock?.(); },
    });
    hud.setTime(explore.tod.value);
    hud.setGentle(reduced);
    explore.on('time', (v) => hud.setTime(v));
    wireHints(explore, hud, () => mode, touch);
  }
  document.body.classList.toggle('clean', clean || capture);

  const setURL = (m) => {
    const u = new URL(location.href);
    u.searchParams.set('mode', m);
    history.replaceState(null, '', u);
  };
  const setMode = (m, { fromLanding = false } = {}) => {
    const prev = mode;
    if (m === prev && !fromLanding) return;
    mode = m;
    if (landing) { landing = null; }
    if (m === 'film') {
      explore?.exit();
      input?.enable(false);
      hud?.show(false);
      controls?.enable(true);
      audio.disable();
      document.body.classList.remove('explore', 'photo');
      state.t = 0;
      state.playing = true;
      score.play(0);
      renderAt(0);
    } else {
      if (prev === 'film' || prev === null) {
        state.playing = false;
        score.pause();
        controls?.enable(false);
        title.style.opacity = '0';
      }
      const fresh = prev === 'film' || (prev === null && !fromLanding);
      explore.enter(m);
      if (m === 'fly' && (prev === 'film' || fromLanding)) explore.spawnAtSkep();
      if (fresh && m === 'fly') explore.spawnAtSkep();
      input.enable(true);
      input.setMode(m);
      hud.show(true);
      hud.setMode(m, { touch });
      if (score.enabled && !audio.enabled) audio.enable().then(() => hud.setSound(true));
    }
    setURL(m);
  };
  const togglePhoto = () => {
    if (!explore?.active) return;
    explore.togglePhoto();
    input.setMode(explore.photo ? 'photo' : mode);
    if (explore.photo) { hud.togglePanel(false); hud.toggleHelp(false); }
  };
  const savePhoto = () => {
    if (!explore?.photo) return;
    explore.render(0);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `clockwork-garden-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    audio.shutter();
    hud.flash();
    hud.flashHint('Saved a photograph', 2);
  };
  const handleActions = (acts) => {
    for (const a of acts) {
      if (a === 'help') hud.toggleHelp();
      else if (a === 'menu') hud.togglePanel();
      else if (a === 'sound') audio.toggle().then((on) => hud.setSound(on));
      else if (a === 'photo') togglePhoto();
      else if (a === 'swap' && !explore.photo) setMode(mode === 'fly' ? 'follow' : 'fly');
      else if (a === 'timeCycle') explore.cycleTime();
      else if (a === 'timeUp') explore.setTime(explore.tod.value + 0.05);
      else if (a === 'timeDown') explore.setTime(explore.tod.value - 0.05);
      else if (a === 'save') savePhoto();
      else if (a === 'escape') { if (explore.photo) togglePhoto(); else if (hud.overlayOpen) { hud.togglePanel(false); hud.toggleHelp(false); } }
    }
  };
  // touch: tapping closes the help card
  window.addEventListener('pointerdown', (e) => { if (hud && !hud.help.hidden && !e.target.closest('.hud-help, .hud-panel, button')) hud.toggleHelp(false); });

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
    mode: () => mode,
    setMode: (m) => setMode(m),
    // review hooks for the interactive modes (state, scripted input, stills)
    explore: () => makeExplore(),
    exploreView: (v) => {
      const ex = makeExplore();
      ex.enter('fly');
      if (v.tod !== undefined) ex.tod.value = v.tod;
      if (v.clock !== undefined) ex.clock = v.clock;
      ex.debugView = v.pos ? { pos: new THREE.Vector3(...v.pos), target: new THREE.Vector3(...v.target), fov: v.fov, aperture: v.aperture, shadowRadius: v.shadowRadius } : null;
      // reachable: move the viewpoint out of solids, as the flight camera would be
      if (ex.debugView && v.reachable) { const p = ex.debugView.pos, d = ex.debugView.target.clone().sub(p); ex.bounds.pushOut(p, 2.5); ex.debugView.target.copy(p).add(d); }
      ex.update(v.dt ?? 0, null);
      ex.render(v.dt ?? 0);
      return true;
    },
    exploreExit: () => { explore?.exit(); return true; },
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
  if (mode === 'film' || capture) {
    controls?.enable(true);
    // respect the system preference: wait for the viewer to start
    if (!capture && prefersReduced && params.get('motion') !== 'full') { state.playing = false; controls?.showGentleNotice(); }
    renderAt(state.t);
  } else if (mode) {
    const m = mode;
    mode = null;
    setMode(m);
  } else {
    // landing: the garden is alive behind the title; APX-9 is at work
    controls?.enable(false);
    explore.enter('follow');
    hud.show(false);
    landing = showLanding({ reducedMotion: reduced, touch, onChoose: (m) => setMode(m, { fromLanding: true }) });
  }
  if (capture) return;

  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (mode === 'film') {
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
    } else if (explore) {
      const inp = input && input.enabled ? input.frame(dt) : null;
      if (inp) handleActions(inp.actions);
      explore.update(dt, hud?.overlayOpen && inp ? { ...inp, move: { x: 0, y: 0 }, lift: 0, look: { dx: 0, dy: 0 }, boost: false } : inp);
      explore.render(dt);
      hud?.update(explore.hudState());
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

// standing hints and one-off messages for the interactive modes
function wireHints(explore, hud, getMode, touch) {
  let firstLantern = true, firstBell = true;
  const say = (t, s) => hud.flashHint(t, s);
  explore.on('pollinate', ({ landable, first, who }) => {
    if (who !== 'player') return;
    say(first ? `You pollinated ${landable.name}: it answers` : `${landable.name[0].toUpperCase() + landable.name.slice(1)}: more pollen`, 3);
  });
  explore.on('deposit', ({ site, who, honey }) => {
    const whoS = who === 'player' ? 'Pollen delivered' : 'APX-9 delivers its pollen';
    say(site ? `${whoS}: glass blooms are sprouting ${site.name}` : `${whoS} (${honey})`, 5);
  });
  explore.on('wind', ({ source }) => say(source === 'player' ? 'You wound the garden: watch the bloom wave' : 'APX-9 winds the garden', 5));
  explore.on('kindle', () => { if (firstLantern && getMode() === 'fly') { firstLantern = false; say('Lanterns kindle as you pass', 3); } });
  explore.on('bell', () => { if (firstBell && getMode() === 'fly') { firstBell = false; say('The porcelain bells are tuned to the garden', 3); } });
  explore.on('hint', (t) => say(t, 3.5));
  explore.on('photo', (on) => { if (on) say(touch ? 'Photo mode: drag to look, joystick to move' : 'Photo mode: drag or WASD to frame, wheel to zoom, Enter to save', 4); });
}

boot().catch((e) => {
  console.error(e);
  const el = document.getElementById('loading');
  if (el) el.textContent = 'The garden could not wake: ' + e.message;
});
