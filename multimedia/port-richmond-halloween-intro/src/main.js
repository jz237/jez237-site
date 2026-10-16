// PORT RICHMOND — Halloween intro. Boot, preload, render loop and the deterministic capture API.
//
// Every frame is a pure function of film time t: renderAt(t) sets the shot camera, world, props, creatures,
// light pool, post and title overlay from t alone. While playing with sound, t comes from the audio clock.
// v2 "HIDE": the film is a list of shots (src/film/shots.js) with hard cuts; see docs/DESIGN-v2.md.
import * as THREE from 'three';
import { CUES, FILM, SECTIONS } from './film/cues.js';
import { smooth } from './film/tracks.js';
import { initTracks, T as TRACKS, MARKS } from './film/tracks.js';
import { makeShots } from './film/shots.js';
import { LightPool, setLightPool } from './lightpool.js';
import { createPost } from './post/post.js';
import { loadCast, Actor } from './creatures/index.js';
import { clone as skeletonClone } from 'three/addons/utils/SkeletonUtils.js';
import { makeChoreo } from './film/choreo.js';
import { makeStory } from './film/story.js';

const qs = new URLSearchParams(location.search);
const CAPTURE = qs.has('capture');
const DEV = qs.has('dev');
const NODOF = qs.has('nodof') || qs.has('freecam'); // diagnostics: free-camera views without the shot's depth of field

function autoQuality() {
  const forced = qs.get('quality');
  if (forced) return forced;
  try {
    const saved = localStorage.getItem('prh-quality');
    if (saved && saved !== 'auto') return saved;
  } catch (e) { /* private mode */ }
  const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) < 820);
  if (mobile) return 'low';
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) return 'low';
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const r = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
  if (/Intel|UHD|Iris|Mali|Adreno|PowerVR|Apple GPU/i.test(r) && !/Arc/i.test(r)) return 'medium';
  return 'high';
}
let quality = autoQuality();

// ---------------------------------------------------------------- renderer + stage
const stage = document.getElementById('stage') || (() => { const d = document.createElement('div'); d.id = 'stage'; document.body.appendChild(d); return d; })();
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: CAPTURE, stencil: false });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.AgXToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
const maxDpr = quality === 'high' ? 1.5 : 1.0;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
renderer.domElement.className = 'prh-canvas';
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.03, 420);
const pool = new LightPool(scene, { points: quality === 'low' ? 6 : 10, spots: 4, shadowSpots: quality === 'low' ? 1 : 2, quality });
setLightPool(pool);

function stageSize() {
  if (CAPTURE) return { w: window.innerWidth, h: window.innerHeight };
  const r = stage.getBoundingClientRect();
  let w = Math.max(320, r.width || window.innerWidth), h = w * 9 / 16;
  if (r.height && h > r.height + 1 && r.height > 100) { h = r.height; w = h * 16 / 9; }
  if (quality === 'low') { const s = Math.min(1, 1280 / w); w *= s; h *= s; }
  return { w: Math.round(w), h: Math.round(h) };
}

// ---------------------------------------------------------------- loading
const progress = { world: 0, props: 0, cast: 0, audio: 0 };
let ui = null;
function reportProgress() {
  const p = progress.world * 0.45 + progress.props * 0.2 + progress.cast * 0.25 + progress.audio * 0.1;
  ui && ui.setProgress(p, p < 0.99 ? 'Loading Witte St…' : 'Warming up…');
}
async function optional(path) {
  try { return await import(path); } catch (e) { console.warn('[prh] optional module missing', path, e.message); return null; }
}

const uiMod = await optional('./ui/ui.js'); // in capture mode ui.js draws only the title overlay, from t (for the MP4)
let audio = null;
let mode = 'loading'; // loading | ready | playing | title
let clock0 = 0; // wall clock start when audio is unavailable
let filmOffset = 0;
let muted = false;

if (uiMod && uiMod.createUI) {
  ui = uiMod.createUI({
    stage,
    onStart: (withSound) => start(withSound),
    onSkip: () => skip(),
    onMute: (m) => setMuted(m),
    onReplay: () => start(!muted),
    onQuality: (q) => { try { localStorage.setItem('prh-quality', q); } catch (e) { /* ignore */ } if (q !== quality && q !== 'auto') location.search = '?quality=' + q; },
  });
  ui.setState('loading');
  ui.setQuality && ui.setQuality(qs.get('quality') || 'auto');
}

const worldMod = await import('./world/index.js');
const world = await worldMod.loadWorld({ renderer, scene, quality, lightPool: pool, onProgress: (p) => { progress.world = p; reportProgress(); } });
const propsMod = await optional('./props/index.js');
const props = propsMod ? await propsMod.loadProps({ renderer, scene, world, quality, lightPool: pool, onProgress: (p) => { progress.props = p; reportProgress(); } }) : null;
progress.props = 1;
const cast = await loadCast({ scene, quality, onProgress: (p) => { progress.cast = p; reportProgress(); } });
// background extras for the street waking up: skeleton-aware clones of loaded actors (shared geometry + materials),
// driven by choreo.js (extra0..). Low tier gets fewer.
{
  const plan = quality === 'low' ? ['walker', 'crawler'] : ['walker', 'brute', 'walker', 'screamer', 'crawler', 'walker'];
  plan.forEach((src, i) => {
    const a0 = cast.actors[src];
    if (!a0) return;
    const root = skeletonClone(a0.root);
    root.name = `actor_extra${i}`;
    cast.group.add(root);
    const a = new Actor(`extra${i}`, root);
    a.file = a0.file; a.base = src;
    cast.actors[`extra${i}`] = a;
  });
}
initTracks({ props, world });
let shots = makeShots({ world, props });
const story = makeStory({ scene, world, props, cast, pool, quality, renderer, shots });
let choreo = makeChoreo({ cast, world, props });
// lab hot reload (tools/lab.mjs): re-import choreo.js / shots.js under a fresh URL and swap them in without reloading
// the page. Their own imports (cues, tracks) stay the loaded instances, so tracks.js edits still need a reload.
window.__hot = async (v = Date.now()) => {
  const [c, s] = await Promise.all([import(`./film/choreo.js?v=${v}`), import(`./film/shots.js?v=${v}`)]);
  shots = s.makeShots({ world, props });
  choreo = c.makeChoreo({ cast, world, props });
  if (window.__prh) { window.__prh.shots = shots; window.__prh.choreo = choreo; }
  return true;
};
props && props.api && props.api.rain && props.api.rain.setInside && props.api.rain.setInside((t) => shots.spaceAt(t) !== 'exterior');

if (!CAPTURE || qs.get('audio') === '1') { // capture pages load sound only when asked (offline MP4 render)
  const audioMod = await optional('./audio/index.js');
  if (audioMod) {
    audio = audioMod.createAudio({
      baseUrl: 'assets/audio/',
      events: { footsteps: shots.footsteps, breaths: shots.breaths, breathTimesFacepaint: choreo.breathTimesFacepaint },
      camera: (t) => shots.cameraAt(t),
      space: (t) => shots.spaceAt(t),
    });
    try {
      await audio.load((p) => { progress.audio = p; reportProgress(); });
      audio.setAnchors && audio.setAnchors(props ? props.anchors : {}, world.anchors);
    } catch (e) { console.warn('[prh] audio failed to load; the film will run silently', e); audio = null; }
  }
}
progress.audio = 1;
reportProgress();

const post = createPost(renderer, scene, camera, quality);
function resize() {
  const { w, h } = stageSize();
  renderer.setSize(w, h, false);
  renderer.domElement.style.width = CAPTURE ? '100%' : '';
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  post.setSize(w, h);
}
resize();
window.addEventListener('resize', resize);

// ---------------------------------------------------------------- per-frame grading: fades, cut to black, impacts
function grade(t) {
  let fade = smooth(0, FILM.fadeInEnd, t);
  if (t >= CUES.cutToBlack && t < CUES.titleFadeIn) fade = 0;
  if (t >= CUES.titleFadeIn) fade = smooth(CUES.titleFadeIn, CUES.titleFadeIn + 1.6, t);
  let impact = 0;
  for (const [t0, a, d] of [[CUES.windowSmash, 1.0, 0.4], [CUES.smashGrab, 0.35, 0.25], [CUES.fallAsphalt, 0.3, 0.25], [CUES.contact2, 0.9, 0.45], [CUES.nearMiss, 0.3, 0.3], [CUES.doorSlam, 0.25, 0.25], [CUES.reveal3, 0.35, 0.3], [CUES.contact3, 1.0, 0.5]]) {
    if (t >= t0) impact = Math.max(impact, a * Math.exp(-(t - t0) / d));
  }
  const shot = shots.shotAt(t);
  // tension: the inspected close-up under car B and the false-relief room tighten the frame
  const tense = Math.max(smooth(CUES.inspectStart, CUES.gazeLock2, t) * (1 - smooth(CUES.contact2, CUES.contact2 + 1.2, t)), smooth(CUES.lookPhoto, CUES.creak3, t) * (t < CUES.cutToBlack ? 1 : 0));
  const vig = shot.kind === 'insert' ? 0.36 : shot.kind === 'high' || shot.kind === 'title' ? 0.26 : shot.space === 'underB' ? 0.4 : 0.3;
  return { fade, impact, vignette: vig + 0.12 * tense, bloom: t >= CUES.titleFadeIn ? 0.28 : 0.32, dof: NODOF ? null : shots.dofAt(t) };
}

function renderAt(t) {
  shots.apply(t, camera);
  world.update(t, camera);
  props && props.update(t, camera);
  story.update(t, camera);
  choreo.update(t, camera);
  pool.update(t, camera);
  post.render(t, grade(t));
  ui && ui.updateTitle && ui.updateTitle(t);
}

// the family photo's portrait loads asynchronously: wait for it (bounded) so no frame shows the placeholder
try { const pr = props && props.api && props.api.room3609 && props.api.room3609.photoReady; if (pr) await Promise.race([pr, new Promise((r) => setTimeout(r, 8000))]); } catch (e) { /* placeholder stays */ }
// warm shaders + upload textures before the viewer can press start
renderer.compile(scene, camera);
// one render per shot (start + middle) so every material/light/shadow variant compiles now, not mid-film (a first
// appearance can cost ~0.5 s of shader compilation = a visible hitch in real-time playback)
const WARM_LATER = [13.5, 15, 18, 21, 24, 26, 28.7, 29.6, 30.5, 32, 34.5, 38, 42, 44, 46.5, 47.9, 49, 50.5, 52.5,
  54.5, 56, 57.8, 58.6, 60, 62, 63.5, 65, 66.5, 69, 72, 75, 76.5, 77.5, 79];
for (const t of [0.5, 3, 6, 11, 82]) renderAt(t); // the opening shots and the title view: before the start card

// ---------------------------------------------------------------- playback
function filmTime() {
  if (audio && audio.state !== 'idle' && audio.state !== 'stopped' && audio.state !== 'ready') return audio.currentTime;
  return (performance.now() - clock0) / 1000 + filmOffset;
}
function start(withSound) {
  muted = !withSound;
  filmOffset = 0;
  clock0 = performance.now();
  if (audio) {
    try { audio.start(0); audio.setMuted(muted); } catch (e) { console.warn('[prh] audio start failed', e); }
  }
  mode = 'playing';
  ui && ui.setState('playing');
  ui && ui.setMuted && ui.setMuted(muted);
}
function skip() {
  if (audio) { try { audio.skipToTitle(); } catch (e) { /* ignore */ } }
  filmOffset = FILM.duration;
  clock0 = performance.now();
  mode = 'title';
  ui && ui.setState('title');
}
function setMuted(m) {
  muted = m;
  if (audio) audio.setMuted(m);
  ui && ui.setMuted && ui.setMuted(m);
}

// adaptive resolution: if the device can't hold ~38 fps, render fewer pixels (and give them back when it recovers).
// Only the pixel ratio changes; every frame is still the same pure function of t.
let dprScale = 1, ftAvg = 16, lastFrameAt = 0, lastScaleAt = 0;
function adapt(now) {
  if (lastFrameAt) ftAvg += (Math.min(100, now - lastFrameAt) - ftAvg) * 0.05;
  lastFrameAt = now;
  if (now - lastScaleAt < 2000) return;
  let next = dprScale;
  if (ftAvg > 26 && dprScale > 0.55) next = Math.max(0.55, dprScale * 0.85);
  else if (ftAvg < 13 && dprScale < 1) next = Math.min(1, dprScale * 1.12);
  if (next !== dprScale) {
    dprScale = next; lastScaleAt = now;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr) * dprScale);
    resize();
  }
}
document.addEventListener('visibilitychange', () => { lastFrameAt = 0; });

let lastT = 0;
function loop(now) {
  requestAnimationFrame(loop);
  if (CAPTURE) return;
  adapt(now);
  let t;
  if (mode === 'loading' || mode === 'ready') t = DEV ? +(qs.get('t') || 82.5) : 82.5; // title view behind the start card
  else t = filmTime();
  if (mode === 'playing' && t >= CUES.titleFadeIn + 0.5) { mode = 'title'; ui && ui.setState('title'); }
  // after the film the title shot simply holds: rain, the flickering lamp and the infected keep going (pure in t)
  lastT = t;
  renderAt(t);
}

mode = 'ready';
ui && ui.setState('ready');
requestAnimationFrame(loop);
// compile the rest of the film's shader/shadow variants while the start card is up (a shot per step, then the title
// view is redrawn in the same task so nothing flashes behind the card); continues briefly into playback if the
// viewer is quick, always on frames far ahead of the playhead
if (!CAPTURE) {
  let wi = 0;
  const step = () => {
    if (wi >= WARM_LATER.length) return;
    const tw = WARM_LATER[wi++];
    if (mode === 'playing' && tw < filmTime() + 6) { setTimeout(step, 0); return; }
    renderAt(tw);
    if (mode === 'ready' || mode === 'loading') renderAt(82.5); else renderAt(filmTime());
    setTimeout(step, mode === 'playing' ? 120 : 16);
  };
  setTimeout(step, 50);
}

// ---------------------------------------------------------------- capture / dev API
// __renderAt(t, { view }) : view 'free:x,y,z,lx,ly,lz,fov' renders from an arbitrary camera at film time t
window.__renderAt = (t, opts = {}) => {
  if (opts.view && String(opts.view).startsWith('free:')) {
    const v = String(opts.view).slice(5).split(/[,_]/).map(Number);
    shots.apply(t, camera);
    world.update(t, camera);
    props && props.update(t, camera);
    story.update(t, camera);
    choreo.update(t, camera);
    camera.position.set(v[0], v[1], v[2]);
    camera.lookAt(v[3], v[4], v[5]);
    camera.fov = v[6] || 50; camera.updateProjectionMatrix();
    pool.update(t, camera);
    post.render(t, grade(t));
    ui && ui.updateTitle && ui.updateTitle(t);
    return;
  }
  renderAt(t);
};
window.__info = () => ({ quality, calls: renderer.info.render.calls, tris: renderer.info.render.triangles, programs: renderer.info.programs?.length, geos: renderer.info.memory.geometries, tex: renderer.info.memory.textures, cast: Object.keys(cast.actors), files: cast.files });
window.__prh = { renderer, scene, camera, world, props, cast, shots, choreo, story, tracks: { T: TRACKS, MARKS }, pool, post, audio, CUES, SECTIONS, FILM };
window.__ready = true;
