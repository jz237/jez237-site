import './style.css';
import * as THREE from 'three';
import {Terrarium} from './lib/Terrarium';
import {UI} from './lib/UI';

const host = document.querySelector<HTMLElement>('#scene')!;
const params = new URLSearchParams(location.search);
if (params.get('ui') === '0') document.body.classList.add('no-ui', 'present');

// Errors (a shader a GPU will not compile, a frame that throws) are kept for the diagnostics panel
const glErrors: string[] = [];
const keep = (text: string) => {if (glErrors.length < 20) glErrors.push(text.slice(0, 400));};
{
  const err = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const text = args.map((a) => (a instanceof Error ? `${a.message} ${a.stack?.split('\n')[1]?.trim() ?? ''}` : String(a))).join(' ');
    if (/THREE|WebGL|GL_|Terrarium/.test(text)) keep(text);
    err(...args);
  };
  addEventListener('error', (e) => keep(`error: ${e.message} (${e.filename?.split('/').pop()}:${e.lineno})`));
  addEventListener('unhandledrejection', (e) => keep(`rejection: ${e.reason}`));
}

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
  t.onContextLost = () => {
    // a phone's GPU can drop the page under load: come back once in the lighter mode
    if (!params.has('lite')) {
      fail('The graphics processor reset. Reloading in a lighter mode…');
      params.set('lite', '1');
      setTimeout(() => location.replace(`${location.pathname}?${params}${location.hash}`), 1200);
    } else fail('The graphics processor reset. Please reload the page.');
  };
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
    const debug = diagnostics(t);
    if (params.has('debug')) debug.show('');
    // nothing drawn, or every fallback used up: show what we know instead of a blank case
    t.onFrameError = () => debug.show('A frame failed to draw.');
    let lastFrames = -1, stillFor = 0;
    setInterval(() => {
      if (document.visibilityState !== 'visible' || params.has('frames')) {stillFor = 0; return;}
      stillFor = t.framesDrawn === lastFrames ? stillFor + 2 : 0;
      lastFrames = t.framesDrawn;
      if (stillFor >= 14) debug.show(`No frame has finished drawing for ${stillFor} s.`);
      if (t.fallbacks.includes('post-processing')) debug.show('The picture kept coming out black.');
    }, 2000);
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

/**
 * The diagnostics panel: what the GPU offers, which build is running, what the
 * terrarium had to turn off and any errors. Shown with ?debug, and on its own
 * when drawing fails, so a phone report can be a screenshot.
 */
function diagnostics(t: Terrarium) {
  const gl = t.renderer.getContext() as WebGL2RenderingContext;
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  const ext = ['EXT_color_buffer_float', 'EXT_color_buffer_half_float', 'OES_texture_float_linear', 'EXT_float_blend', 'KHR_parallel_shader_compile']
    .map((e) => `${gl.getExtension(e) ? '✓' : '✗'} ${e}`);
  const build = document.querySelector<HTMLScriptElement>('script[type="module"][src]')?.src.split('/').pop() ?? 'dev';
  const el = document.createElement('pre');
  el.style.cssText = 'position:fixed;left:8px;top:132px;z-index:30;max-width:calc(100vw - 16px);margin:0;padding:8px 10px;font:10px/1.35 ui-monospace,monospace;color:#f4efe6;background:rgba(0,0,0,0.78);border-radius:8px;white-space:pre-wrap;pointer-events:none;display:none';
  document.body.append(el);
  let note = '', last = t.framesDrawn, lastT = performance.now();
  const update = () => {
    const now = performance.now();
    const fps = ((t.framesDrawn - last) * 1000) / (now - lastT);
    last = t.framesDrawn; lastT = now;
    const s = t.post.settings;
    el.textContent = [
      ...(note ? [note, 'A screenshot of this panel helps fix it.', ''] : []),
      `build ${build}`,
      `GPU ${gpu}`,
      `buffer ${gl.drawingBufferWidth}×${gl.drawingBufferHeight} · dpr ${devicePixelRatio.toFixed(2)} · ratio ${t.renderer.getPixelRatio()}${params.has('lite') ? ' · lite' : ''}${gl.isContextLost() ? ' · CONTEXT LOST' : ''}`,
      `${fps.toFixed(1)} fps · ${t.framesDrawn} frames · programs ${t.renderer.info.programs?.length ?? '?'} · max samples ${gl.getParameter(gl.MAX_SAMPLES)}`,
      `ao ${s.ao} · bloom ${s.bloom} · dof ${s.dof} · msaa ${t.post.samples}`,
      `turned off: ${t.fallbacks.join(', ') || 'nothing'}`,
      ...ext,
      ...glErrors.map((e) => `! ${e}`),
    ].join('\n');
  };
  let timer = 0;
  return {
    show(why: string) {
      if (why && !note) note = why;
      el.style.display = 'block';
      if (!timer) {update(); timer = window.setInterval(update, 1000);}
    },
  };
}
