import * as THREE from 'three';
import { makePost } from './post.js';
import { makeWorld } from './world.js';
import { makeShots, beat } from './shots.js';
import { PHASE, DUR, ENV, LYRICS } from './data.js';

const $ = id => document.getElementById(id);
const canvas = $('c'), audio = $('song'), capEl = $('caption'), titleEl = $('title');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x000000, 0.01);
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
const post = makePost(renderer, scene, camera);
const W = makeWorld(scene);
const shots = makeShots(W, camera, post);

function resize() {
  const w = Math.max(innerWidth, 64), h = Math.max(innerHeight, 64), pr = Math.min(devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(pr); renderer.setSize(w, h, false); post.resize(w, h, pr); camera.aspect = w / h;
}
addEventListener('resize', resize); resize();

// ---- audio: live analyser while playing, baked envelope while paused/scrubbing
let ctx, analyser, freq;
function initAudio() {
  if (ctx) return; ctx = new (window.AudioContext || window.webkitAudioContext)();
  const src = ctx.createMediaElementSource(audio); analyser = ctx.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.6;
  src.connect(analyser); analyser.connect(ctx.destination); freq = new Uint8Array(analyser.frequencyBinCount);
}
const A = { bass: 0, mid: 0, hi: 0, pulse: 0, beatN: 0 };
const env = (arr, t) => arr[Math.max(0, Math.min(arr.length - 1, Math.round(t / 0.05)))];
function react(t) {
  let b = env(ENV.bass, t), m = env(ENV.mid, t), hi = 0;
  if (analyser && !audio.paused) {
    analyser.getByteFrequencyData(freq); const avg = (a, z) => { let s = 0; for (let i = a; i < z; i++) s += freq[i]; return s / (z - a) / 255; };
    b = Math.pow(avg(1, 5), 2) * 1.2; m = avg(8, 60) * 0.9; hi = avg(100, 250);
  }
  A.bass += (b - A.bass) * 0.5; A.mid += (m - A.mid) * 0.4; A.hi = hi;
  const bp = (t - PHASE) / beat; A.beatN = Math.floor(bp); A.pulse = t > 21.9 && t < 118 ? Math.exp(-(bp - Math.floor(bp)) * 4.5) : 0;
}

// ---- captions
let capLine = null, capWords = [];
function captions(t, cls) {
  const line = LYRICS.find(L => t >= L.s - 0.12 && t <= L.e) || null;
  if (line !== capLine) {
    capLine = line; capEl.innerHTML = ''; capWords = [];
    if (line) for (const [w, wt] of line.w) { const s = document.createElement('span'); s.textContent = w; capEl.appendChild(s); capEl.appendChild(document.createTextNode(' ')); capWords.push([s, wt]); }
  }
  capEl.className = 'cap-' + cls + (line ? ' show' : '');
  for (const [s, wt] of capWords) s.classList.toggle('on', t >= wt - 0.03);
}

// ---- ui
const startEl = $('start'), bar = $('bar'), timeEl = $('time'), playBtn = $('play'), ui = $('ui');
const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
bar.max = DUR; let scrubbing = false;
const play = () => { initAudio(); ctx.resume(); audio.play(); startEl.classList.add('gone'); };
const toggle = () => audio.paused ? play() : audio.pause();
$('go').onclick = play; playBtn.onclick = toggle; canvas.onclick = () => { if (startEl.classList.contains('gone')) toggle(); };
bar.oninput = () => { scrubbing = true; audio.currentTime = +bar.value; }; bar.onchange = () => { scrubbing = false; };
$('fs').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); toggle(); } if (e.code === 'ArrowRight') audio.currentTime += 5; if (e.code === 'ArrowLeft') audio.currentTime -= 5; });
let idle; const wake = () => { ui.classList.remove('idle'); clearTimeout(idle); idle = setTimeout(() => ui.classList.add('idle'), 2500); }; addEventListener('mousemove', wake); wake();
audio.onended = () => { startEl.classList.remove('gone'); $('go').textContent = '↻ Watch again'; audio.currentTime = 0; };

// test hooks: ?t=45 freezes the video at 45s; window.__seek(t) jumps
const qs = new URLSearchParams(location.search); let fixedT = qs.has('t') ? +qs.get('t') : null; if (fixedT !== null) startEl.classList.add('gone');
window.__seek = t => { fixedT = null; audio.currentTime = t; }; window.__fix = t => { fixedT = t; };
window.__stats = { frames: 0, ms: 0 };
if (qs.has('export')) document.body.classList.add('export');   // clean frames for video export: no controls, no CSS transitions

let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = now - last; last = now; window.__stats.frames++; window.__stats.ms += dt;
  const t = Math.min(fixedT !== null ? fixedT : audio.currentTime, DUR - 0.01);
  react(t);
  let i = shots.length - 1; while (i > 0 && shots[i].t0 > t) i--; const s = shots[i], l = t - s.t0;
  W.reset(); post.u.lines.value = 0; post.u.flash.value = 0; post.u.fade.value = s.fadeIn ? Math.min(1, l / s.fadeIn) : 1;
  W.style(s.style, post, s.skin ? s.skin(t) : undefined);
  W.skyU.time.value = W.waterU.time.value = t;
  s.fn(l, t, A);
  if (W.shake) camera.fov *= 1 - Math.min(W.shake, 0.1) * A.pulse * 0.7;   // smooth zoom punch on the beat instead of camera shake
  post.u.reveal.value = s.cap === 'chalk' ? Math.min(1, l / 1.1) : 1;
  camera.updateProjectionMatrix(); W.sky.position.copy(camera.position);
  post.u.time.value = t; post.u.beat.value = A.pulse; post.u.bass.value = A.bass;
  post.u.glitch.value = s.glitch && i > 0 ? Math.max(0, 1 - l / 0.16) : 0;
  post.composer.render();
  titleEl.style.opacity = W.titleOp; titleEl.style.transform = `translate(-50%,-50%) scale(${1 + (1 - W.titleOp) * 0.4 + A.bass * 0.03})`;
  captions(t, s.cap);
  if (!scrubbing) bar.value = t; timeEl.textContent = fmt(t) + ' / ' + fmt(DUR); playBtn.textContent = audio.paused ? '▶' : '❚❚';
  window.__drawn = fixedT;
}
requestAnimationFrame(frame);
