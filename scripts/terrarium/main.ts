import './style.css';
import * as THREE from 'three';
import {Terrarium} from './lib/Terrarium';
import {UI} from './lib/UI';

const host = document.querySelector<HTMLElement>('#scene')!;
const params = new URLSearchParams(location.search);
if (params.get('ui') === '0') document.body.classList.add('no-ui', 'present');

function fail(message: string) {
  const el = document.getElementById('fatal')!;
  el.textContent = message;
  el.style.display = 'block';
  document.getElementById('veil')?.remove();
}

try {
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) throw new Error('WebGL 2 is not available');
  const t = new Terrarium(host);
  const bar = document.querySelector<HTMLElement>('.veil-bar i');
  let progress = 0.1;
  const tick = setInterval(() => {progress = Math.min(0.92, progress + 0.07); if (bar) bar.style.width = `${progress * 100}%`;}, 250);
  t.ready.then(() => {
    clearInterval(tick);
    if (bar) bar.style.width = '100%';
    const ui = new UI(t, document.body);
    ui.onSound = () => {
      if (!t.audio.running) {t.audio.start(); t.audio.setMuted(false);} else t.audio.setMuted(!t.audio.muted);
      ui.setSoundState(t.audio.running && !t.audio.muted);
    };
    t.addFrameHandler((dt) => ui.update(dt));
    ui.update(0);
    if (params.get('follow') === '1') ui.setFollow(true);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.body.classList.add('ready');
      (window as unknown as {terrariumReady: boolean}).terrariumReady = true;
    }));
  }).catch((e) => {
    console.error(e);
    fail('The terrarium could not load. Please reload the page.');
  });
  if (import.meta.env.DEV) Object.assign(window, {terrarium: t, THREE});
} catch (e) {
  console.error(e);
  fail('This terrarium needs WebGL 2. Try a current version of Chrome, Edge, Firefox or Safari.');
}
