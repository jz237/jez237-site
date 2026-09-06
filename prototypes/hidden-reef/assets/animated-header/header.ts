import { ReefEngine } from './reef-engine';

const stage = document.querySelector<HTMLElement>('.reef-stage')!;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let visible = true;
const engine = new ReefEngine(
  document.querySelector<HTMLCanvasElement>('.water-canvas')!,
  document.querySelector<HTMLCanvasElement>('.life-canvas')!,
  stage,
  () => stage.classList.add('is-ready'),
);
function sync() {
  engine.paused = reduced.matches || !visible;
  stage.classList.toggle('is-paused', engine.paused);
}
reduced.addEventListener('change', sync);
window.addEventListener('message', event => {
  if (event.source !== parent || event.origin !== location.origin || event.data?.type !== 'reef-header-visibility') return;
  visible = event.data.visible === true;
  sync();
});
sync();
