import { ReefEngine } from './reef-engine';

const stage = document.querySelector<HTMLElement>('.reef-stage')!;
const pause = document.querySelector<HTMLButtonElement>('.embed-pause')!;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let manuallyPaused = reduced.matches;
let visible = true;
const engine = new ReefEngine(
  document.querySelector<HTMLCanvasElement>('.water-canvas')!,
  document.querySelector<HTMLCanvasElement>('.life-canvas')!,
  stage,
  () => stage.classList.add('is-ready'),
);
function sync() {
  engine.paused = manuallyPaused || !visible;
  stage.classList.toggle('is-paused', engine.paused);
  pause.textContent = manuallyPaused ? 'Play animation' : 'Pause animation';
  pause.setAttribute('aria-pressed', String(manuallyPaused));
}
pause.addEventListener('click', () => { manuallyPaused = !manuallyPaused; sync(); });
reduced.addEventListener('change', () => { manuallyPaused = reduced.matches; sync(); });
window.addEventListener('message', event => {
  if (event.source !== parent || event.origin !== location.origin || event.data?.type !== 'reef-header-visibility') return;
  visible = event.data.visible === true;
  sync();
});
sync();
