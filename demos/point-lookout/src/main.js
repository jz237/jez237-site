// Point Lookout — bootstrap, module orchestration and the render loop.
//
// Every scene module lives in its own file and exports `default async function create(ctx)`
// returning `{ update?(t, dt), dispose?() }`. Modules are imported dynamically and isolated with
// try/catch so one failing module never takes the whole experience down.
//
// URL parameters (dev / capture):
//   ?capture=1&w=1276&h=718   deterministic screenshot / video export mode, exposes window.__capture
//   ?camh=2160                frame height of the emulated camera (post-processing scale, default 718)
//   ?only=sky,ocean           load only these scene modules
//   ?t=4.5                    start time offset
//   ?debug=name               free-form flag modules may read from ctx.params
import * as THREE from 'three';
import { CONFIG, DEG } from './config.js';
import { gustAt, windSpeedAt, WIND_DIR } from './core/wind.js';
import * as layout from './world/layout.js';
import { createLoader } from './ui/loader.js';

const params = new URLSearchParams(location.search);
const CAPTURE = params.has('capture');
const ONLY = params.get('only') ? params.get('only').split(',').map((s) => s.trim()) : null;

// Scene modules in build order. `weight` feeds the loading bar.
const SCENE_MODULES = [
  { name: 'sky', load: () => import('./sky/sky.js'), weight: 2 },
  { name: 'terrain', load: () => import('./terrain/terrain.js'), weight: 3 },
  { name: 'ocean', load: () => import('./ocean/ocean.js'), weight: 4 },
  { name: 'spray', load: () => import('./ocean/spray.js'), weight: 1 },
  { name: 'trees', load: () => import('./vegetation/trees.js'), weight: 3 },
  { name: 'shrubs', load: () => import('./vegetation/shrubs.js'), weight: 1 },
  { name: 'grass', load: () => import('./vegetation/grass.js'), weight: 2 },
];

const loader = CAPTURE ? null : createLoader();
if (CAPTURE) {
  document.getElementById('loader')?.remove();
  document.body.classList.add('is-playing');
  document.getElementById('scene').style.transition = 'none';
}
const status = {};

function linearColor(hex, intensity = 1) {
  return new THREE.Color(hex).multiplyScalar(intensity); // THREE.Color converts sRGB hex -> linear
}

async function boot() {
  window.__started = true; // tells the inline guard in index.html that the module graph loaded
  const canvas = document.getElementById('scene');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // MSAA happens on the HDR target in post
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      preserveDrawingBuffer: CAPTURE,
    });
  } catch (e) {
    console.error(e);
    loader?.error('WebGL 2 is not available in this browser.');
    if (CAPTURE) window.__capture = { ready: true, status: { boot: 'error: WebGL 2 is not available' } };
    return;
  }
  if (!renderer.capabilities.isWebGL2) {
    loader?.error('WebGL 2 is not available in this browser.');
    if (CAPTURE) window.__capture = { ready: true, status: { boot: 'error: WebGL 2 is not available' } };
    return;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.info.autoReset = true;

  const W = CAPTURE ? Number(params.get('w') || 1276) : window.innerWidth;
  const H = CAPTURE ? Number(params.get('h') || 718) : window.innerHeight;

  const scene = new THREE.Scene();
  const cam = CONFIG.camera;
  const camera = new THREE.PerspectiveCamera(cam.vfovDeg, W / H, cam.near, cam.far);
  camera.position.fromArray(cam.position);
  camera.rotation.order = 'YXZ';
  camera.rotation.set(cam.pitchDeg * DEG, cam.yawDeg * DEG, cam.rollDeg * DEG);
  camera.updateMatrixWorld();

  const sunDir = new THREE.Vector3().fromArray(CONFIG.sun.direction).normalize();
  const sunColor = linearColor(CONFIG.sun.color, CONFIG.sun.intensity);

  // Shared uniforms: materials reference these objects directly; main updates them once per frame.
  const uniforms = {
    uTime: { value: 0 },
    uSunDir: { value: sunDir },
    uSunColor: { value: sunColor },
    uSkyZenith: { value: linearColor(CONFIG.sky.zenith) },
    uSkyHorizon: { value: linearColor(CONFIG.sky.horizon) },
    uHazeColor: { value: linearColor(CONFIG.haze.color) },
    uHazeSunColor: { value: linearColor(CONFIG.haze.sunColor) },
    uHazeDensity: { value: CONFIG.haze.density },
    uHazeFalloff: { value: CONFIG.haze.heightFalloff },
    uWindDir: { value: new THREE.Vector2(WIND_DIR[0], WIND_DIR[1]) },
    uGust: { value: gustAt(0) },
    uWindSpeed: { value: windSpeedAt(0) },
    // wind-field advection distance (m), wrapped so noise inputs stay small; see core/wind.js
    uWindAdv: { value: 0 },
  };

  // Key light (sun) with a shadow frustum fitted to the foreground headland + trees.
  const sunLight = new THREE.DirectionalLight(new THREE.Color(CONFIG.sun.color), CONFIG.sun.intensity);
  sunLight.position.copy(sunDir).multiplyScalar(400).add(new THREE.Vector3(20, 25, -50));
  sunLight.target.position.set(20, 25, -50);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  const sc = sunLight.shadow.camera;
  sc.left = -110; sc.right = 110; sc.top = 90; sc.bottom = -90; sc.near = 50; sc.far = 800;
  sunLight.shadow.bias = -0.0004;
  sunLight.shadow.normalBias = 0.04;
  scene.add(sunLight, sunLight.target);

  const hemi = new THREE.HemisphereLight(linearColor(CONFIG.sky.zenith), new THREE.Color(0x5a5a42), 0.9);
  scene.add(hemi);

  const tier = params.get('tier') || (CAPTURE ? 'high' : detectTier(renderer));
  // pixel budget of the HDR scene target per tier: caps DPR on huge/retina screens and seeds the
  // dynamic-resolution scale so weaker GPUs do not start at 4x the pixels they can afford
  const PX_BUDGET = { high: 2.3e6, medium: 1.1e6, low: 0.55e6 }[tier] || 2.3e6;
  const MAX_PX = { high: 3.7e6, medium: 2.1e6, low: 1.0e6 }[tier] || 3.7e6;
  const quality = {
    tier,
    scale: 1, // dynamic resolution scale of the scene target (post uses it)
    maxDpr: CAPTURE ? 1 : Math.min(window.devicePixelRatio || 1, 2),
  };
  if (!CAPTURE) {
    const px = window.innerWidth * window.innerHeight * quality.maxDpr * quality.maxDpr;
    quality.scale = Math.max(0.5, Math.min(1, Math.sqrt(PX_BUDGET / Math.max(1, px))));
  }

  const ctx = {
    THREE,
    renderer,
    scene,
    camera,
    config: CONFIG,
    layout,
    params,
    capture: CAPTURE,
    uniforms,
    quality,
    sunLight,
    hemiLight: hemi,
    wind: { gustAt, windSpeedAt, dir: WIND_DIR },
    size: { width: W, height: H },
    env: null, // environment texture (set by sky)
    modules: {},
    progress: () => {},
  };

  // ---- load scene modules -------------------------------------------------------------------
  const selected = SCENE_MODULES.filter((m) => !ONLY || ONLY.includes(m.name));
  loader?.add('boot', 1);
  for (const m of selected) loader?.add(m.name, m.weight);
  if (!CAPTURE && !params.has('mute')) loader?.add('audio', 2);
  loader?.add('compile', 3);
  loader?.set('boot', 1, 'Preparing');

  const updaters = [];
  for (const m of selected) {
    ctx.progress = (v, text) => loader?.set(m.name, v, text);
    loader?.set(m.name, 0.02, labelFor(m.name));
    await nextFrame();
    try {
      const mod = await m.load();
      const inst = await mod.default(ctx);
      ctx.modules[m.name] = inst || {};
      if (inst && inst.update) updaters.push(inst);
      status[m.name] = 'ok';
    } catch (e) {
      status[m.name] = 'error: ' + (e && e.message ? e.message : String(e));
      console.error(`[${m.name}]`, e);
    }
    loader?.set(m.name, 1);
  }
  ctx.progress = () => {};

  // camera motion + post-processing (fall back to plain rendering if missing/broken)
  let handheld = null;
  try {
    handheld = await (await import('./camera/handheld.js')).default(ctx);
    status.camera = 'ok';
  } catch (e) { status.camera = 'error: ' + e.message; console.error('[camera]', e); }

  let post = null;
  try {
    post = await (await import('./post/post.js')).default(ctx);
    status.post = 'ok';
  } catch (e) {
    status.post = 'error: ' + e.message; console.error('[post]', e);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
  }

  let audio = null;
  if (!CAPTURE && !params.has('mute')) {
    ctx.progress = (v, text) => loader?.set('audio', v, text);
    loader?.set('audio', 0.05, 'Sound');
    try {
      audio = await (await import('./audio/audio.js')).default(ctx);
      status.audio = 'ok';
    } catch (e) { status.audio = 'error: ' + e.message; console.error('[audio]', e); }
    loader?.set('audio', 1);
    ctx.progress = () => {};
  }

  // ---- sizing ----------------------------------------------------------------------------------
  let curDpr = 1;
  function resize() {
    const w = CAPTURE ? W : window.innerWidth;
    const h = CAPTURE ? H : window.innerHeight;
    let dpr = Math.min(quality.maxDpr, CAPTURE ? 1 : window.devicePixelRatio || 1);
    if (!CAPTURE) dpr = Math.max(0.5, Math.min(dpr, Math.sqrt(MAX_PX / Math.max(1, w * h))));
    curDpr = dpr;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, !CAPTURE);
    camera.aspect = w / h;
    // Keep the reference framing: fixed vertical FOV for landscape; widen gently for portrait
    // so the frame behaves like a centred 'cover' crop of the 16:9 shot.
    const aspect = w / h;
    const base = CONFIG.camera.vfovDeg;
    camera.userData.baseFov = aspect >= 1.2 ? base : Math.min(62, base + (1.2 - aspect) * 22);
    camera.fov = camera.userData.baseFov;
    camera.updateProjectionMatrix();
    ctx.size.width = w; ctx.size.height = h;
    post?.setSize(w, h, dpr);
  }
  camera.userData.baseFov = CONFIG.camera.vfovDeg;
  resize();
  if (!CAPTURE) {
    // debounced: every resize reallocates the MSAA/bloom targets
    let rz = 0;
    const onResize = () => { clearTimeout(rz); rz = setTimeout(resize, 150); };
    window.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('resize', onResize);
    // devicePixelRatio changes (window dragged to another monitor) fire no resize event
    const watchDpr = () => {
      const mq = window.matchMedia?.(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      mq?.addEventListener?.('change', () => {
        quality.maxDpr = Math.min(window.devicePixelRatio || 1, 2);
        onResize();
        watchDpr();
      }, { once: true });
    };
    watchDpr();
  }

  // ---- per-frame update --------------------------------------------------------------------------
  function update(t, dt) {
    // wrapped so float32 precision holds for hours; every shader time use is periodic over 3600 s
    // (vegetation 60 s, gusts 3600 s, post grain per frame; the ocean and clouds have their own wraps)
    uniforms.uTime.value = t % 3600;
    uniforms.uGust.value = gustAt(t);
    uniforms.uWindSpeed.value = windSpeedAt(t);
    uniforms.uWindAdv.value = (CONFIG.wind.speed * t) % 2000;
    handheld?.update(t, dt);
    camera.updateMatrixWorld();
    for (const u of updaters) {
      try { u.update(t, dt); } catch (e) { if (!u.__err) { console.error(e); u.__err = true; } }
    }
    if (audio) {
      try { audio.update?.(t, dt); } catch (e) { console.error('[audio]', e); audio.suspend?.(); audio = null; }
    }
  }

  function draw() {
    if (post) post.render(scene, camera);
    else renderer.render(scene, camera);
  }

  // warm-up: compile every program before the visitor enters
  loader?.set('compile', 0.1, 'Compiling shaders');
  const t0 = Number(params.get('t') || 0);
  update(t0, 1 / 60);
  // Compile against the HDR target that real frames render into (a null target would compile
  // the sRGB-output variants and the real ones would then compile synchronously on frame 1).
  const prevRT = renderer.getRenderTarget();
  try {
    if (post?.target) renderer.setRenderTarget(post.target);
    if (renderer.compileAsync) {
      await Promise.race([renderer.compileAsync(scene, camera), new Promise((r) => setTimeout(r, 20000))]);
    }
  } catch (e) { console.warn('compileAsync failed', e); } finally { renderer.setRenderTarget(prevRT); }
  loader?.set('compile', 0.6);
  draw();
  loader?.set('compile', 1);

  if (CAPTURE) {
    // a lost context (GPU reset) cannot be recovered in place (the bakes are gone): fail loudly
    // instead of capturing black frames
    let glLost = false;
    canvas.addEventListener('webglcontextlost', () => { glLost = true; });
    const gl = renderer.getContext();
    const finish = () => {
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
      if (glLost || gl.isContextLost()) throw new Error('WebGL context lost (GPU reset)');
      return true;
    };
    window.__capture = {
      ready: true,
      status,
      async renderAt(t) {
        // a few updates so any temporal filtering in post settles deterministically
        for (let i = 3; i >= 0; i--) { update(t - i / 30, 1 / 30); draw(); }
        return finish();
      },
      // video export (tools/video.mjs): one frame of continuous playback, so the temporal filters
      // run exactly as they do live
      step(t, dt) {
        update(t, dt); draw();
        return finish();
      },
      // the live soundscape rendered offline against the visual timeline (audio/offline.js); the
      // PCM stays in the page and is fetched with audioChunk()
      async renderAudio(t0, dur, opts = {}) {
        const { renderAudio } = await import('./audio/offline.js');
        return renderAudio(ctx, t0, dur, opts);
      },
      async audioChunk(i0, n) {
        const { audioChunk } = await import('./audio/offline.js');
        return audioChunk(i0, n);
      },
      async releaseAudio() {
        (await import('./audio/offline.js')).releaseAudio();
      },
      perf(n = 20) {
        const gl = renderer.getContext();
        const px = new Uint8Array(4);
        renderer.info.autoReset = false;
        const start = performance.now();
        for (let i = 0; i < n; i++) { renderer.info.reset(); update(i / 60, 1 / 60); draw(); }
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        const ms = (performance.now() - start) / n;
        // counts cover one whole frame: shadow pass + scene + every post pass
        const info = { msPerFrame: +ms.toFixed(1), calls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
          programs: renderer.info.programs?.length, textures: renderer.info.memory.textures, geometries: renderer.info.memory.geometries };
        renderer.info.autoReset = true;
        return info;
      },
    };
    return;
  }

  // ---- interactive start ------------------------------------------------------------------------
  await loader.ready();
  try { await audio?.start?.(); } catch (e) { console.error('[audio start]', e); }
  document.body.classList.add('is-playing');
  loader.hide();
  hideCursorWhenIdle();

  // WebGL context loss (GPU reset, iOS backgrounding): bakes (clouds, environment, far shadow)
  // cannot be recovered in place, so pause and reload once the context comes back.
  let glLost = false;
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); glLost = true; audio?.suspend?.(); });
  canvas.addEventListener('webglcontextrestored', () => { location.reload(); });

  let last = performance.now();
  const startedAt = last - t0 * 1000;
  const dyn = createDynamicResolution(quality, () => post?.setSize(ctx.size.width, ctx.size.height, curDpr));
  let frameErr = false;
  function frame(now) {
    requestAnimationFrame(frame); // first, so an exception can never stop the loop
    if (glLost) return;
    const dtRaw = (now - last) / 1000;
    const dt = Math.min(0.1, dtRaw);
    last = now;
    const t = (now - startedAt) / 1000;
    try {
      update(t, dt);
      draw();
    } catch (e) {
      if (!frameErr) { frameErr = true; console.error('[frame]', e); }
    }
    if (!document.hidden && dtRaw < 0.5) dyn.sample(dtRaw);
  }
  requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audio?.suspend?.(); else audio?.resume?.();
  });
}

function labelFor(name) {
  return {
    sky: 'Sky and light',
    terrain: 'Headland and dunes',
    ocean: 'Ocean',
    spray: 'Spray',
    trees: 'She-oaks',
    shrubs: 'Scrub',
    grass: 'Grass',
  }[name] || name;
}

function detectTier(renderer) {
  const gl = renderer.getContext();
  const ua = navigator.userAgent;
  let name = '';
  try {
    const ext = /Firefox\//.test(ua) ? null : gl.getExtension('WEBGL_debug_renderer_info');
    name = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  } catch (e) { /* ignore */ }
  // iPadOS reports a desktop "Macintosh" user agent
  const mobile = /Android|iPhone|iPad|Mobile/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (/SwiftShader|llvmpipe|Software|Basic Render/i.test(name)) return 'low';
  if (/Intel|Iris|UHD|HD Graphics|Radeon\(TM\) Graphics|Radeon Vega|Vega \d+ Graphics|Mali|Adreno|PowerVR/i.test(name)) {
    return mobile ? 'low' : 'medium';
  }
  return mobile ? 'medium' : 'high';
}

// Dynamic resolution of the scene target: steps the scale on the median frame time with
// cooldowns so it never oscillates. A downscale that does not speed frames up (a display capped
// at 30 Hz in low-power mode, not a slow GPU) is undone and not retried.
function createDynamicResolution(quality, apply) {
  const buf = [];
  const refresh = 1 / 60; // target frame interval (never chase 120 Hz at the cost of sharpness)
  let hold = 180; // frames to wait before the first decision
  let ceil = 1;
  let lastDown = null; // { scale, median } of the last downscale, to verify it helped
  const median = () => { const a = buf.slice().sort((x, y) => x - y); return a[a.length >> 1]; };
  return {
    sample(dt) {
      buf.push(dt);
      if (buf.length > 60) buf.shift();
      if (hold > 0) { hold--; return; }
      if (buf.length < 60) return;
      const m = median();
      if (lastDown) {
        // the previous downscale did not help (display-capped cadence): undo it and stop trying
        if (m > lastDown.median * 0.92) {
          quality.scale = lastDown.scale; ceil = quality.scale; apply();
          lastDown = null; hold = 3600; buf.length = 0; return;
        }
        lastDown = null;
      }
      if (m > refresh * 1.3 && quality.scale > 0.5) {
        lastDown = { scale: quality.scale, median: m };
        quality.scale = Math.max(0.5, quality.scale * 0.85);
        ceil = quality.scale + 0.05;
        apply(); hold = 90; buf.length = 0;
      } else if (m < refresh * 1.05 && quality.scale < Math.min(1, ceil)) {
        quality.scale = Math.min(1, ceil, quality.scale * 1.08);
        apply(); hold = 600; buf.length = 0;
      }
    },
  };
}

function hideCursorWhenIdle() {
  let timer = 0;
  window.addEventListener('pointermove', () => {
    document.body.classList.add('cursor-visible');
    clearTimeout(timer);
    timer = setTimeout(() => document.body.classList.remove('cursor-visible'), 1800);
  });
}

function nextFrame() {
  return new Promise((r) => requestAnimationFrame(() => r()));
}

boot().catch((e) => {
  console.error(e);
  loader?.error(String(e && e.message ? e.message : e));
  if (CAPTURE) window.__capture = { ready: true, status: { boot: 'error: ' + e.message }, renderAt() {}, perf() { return {}; } };
});
