import { elsewhere } from './app/catalog';

const selector = document.querySelector<HTMLSelectElement>('#graphics-mode')!;
const url = new URL(location.href);
const key = 'betta.graphics';
const valid = (value: string | null) => value === 'low' || value === 'full' || value === 'auto';
let choice = url.searchParams.get('power');
if (!valid(choice)) {
  try { choice = localStorage.getItem(key); } catch { /* Storage is optional. */ }
}
if (!valid(choice)) choice = 'auto';
selector.value = choice!;
selector.addEventListener('change', () => {
  try { localStorage.setItem(key, selector.value); } catch { /* The URL carries the choice. */ }
  url.searchParams.set('power', selector.value);
  location.assign(url);
});

/** Keep explicit solver and QA settings reproducible. Auto chooses the raster bowl before any
 * WebGPU workers or pipelines start, including on browsers with an API but no hardware adapter. */
async function lowPower(): Promise<boolean> {
  if (choice !== 'auto') return choice === 'low';
  if (!navigator.gpu) return true;
  const desktop = !matchMedia('(pointer: coarse)').matches;
  try {
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) return true;
    if (['lite', 'bench', 'res', 'aa', 'manual', 'mode'].some(k => url.searchParams.has(k))) return false;
    const info = adapter.info;
    if (info?.isFallbackAdapter || /swiftshader|llvmpipe|software/i.test(info?.description ?? '')) return true;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    return desktop && ((navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4)
      || (memory !== undefined && memory > 0 && memory <= 4)
      || /intel.*\b(gen-?9|gen-?11|uhd|hd graphics)\b/i.test([info?.vendor, info?.architecture, info?.description].join(' ')));
  } catch { return true; }
}

async function start() {
  const away = elsewhere(url.searchParams.get('globe') ?? '');
  if (away) {
    url.searchParams.delete('globe');
    const dest = new URL(away, location.href);
    url.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
    location.replace(dest);
    return;
  }
  if (await lowPower()) {
    document.documentElement.dataset.graphics = 'low';
    if (choice === 'auto') selector.options[0].text = 'Auto · Low power';
    const { startLowPowerBowl } = await import('./lowPower/bowl.mjs');
    await startLowPowerBowl();
  } else {
    document.documentElement.dataset.graphics = 'full';
    if (choice === 'auto') window.addEventListener('betta-start-failed', () => {
      // A new document releases the partially allocated WebGPU scene and its workers.
      url.searchParams.set('power', 'low');
      location.replace(url);
    }, { once: true });
    (window as Window & { prepareBettaBowl?: () => void }).prepareBettaBowl?.();
    await import('./main');
  }
}

void start().catch((err: unknown) => {
  console.error('[betta] startup:', err);
  const notice = document.createElement('p');
  notice.className = 'globes-error';
  notice.setAttribute('role', 'alert');
  notice.textContent = err instanceof Error && err.message === 'WebGL2 unavailable'
    ? 'Low power needs WebGL 2. Enable hardware acceleration in your browser or try Full simulation in Graphics.'
    : 'The bowl could not load. Reload to try again, or choose another graphics mode.';
  document.getElementById('stage')!.replaceChildren(notice);
});
