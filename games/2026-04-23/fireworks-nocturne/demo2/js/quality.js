// Device tiers. Desktops with a real GPU get everything; phones get the same
// scene with fewer sparks, cheaper smoke and smaller offscreen buffers, and the
// resolution scaler keeps the frame rate up from there.

export const TIERS = {
  ultra: { name: 'Ultra', dpr: 2.0, msaa: 4, sparkK: 96, starScale: 1.0, smokeCap: 14000, smokeScale: 1.0, smokeRes: 0.6, reflRes: 0.7, bloomLevels: 8, cloudOct: 5, sparksInReflection: true, crowd: 1.0, gerbs: 180 },
  high: { name: 'High', dpr: 1.5, msaa: 4, sparkK: 44, starScale: 0.8, smokeCap: 9000, smokeScale: 0.7, smokeRes: 0.5, reflRes: 0.4, bloomLevels: 7, cloudOct: 4, sparksInReflection: true, crowd: 0.8, gerbs: 120 },
  mobile: { name: 'Phone', dpr: 1.25, msaa: 0, sparkK: 24, starScale: 0.55, smokeCap: 3500, smokeScale: 0.4, smokeRes: 0.35, reflRes: 0.3, bloomLevels: 6, cloudOct: 3, sparksInReflection: false, crowd: 0.5, gerbs: 60 },
};

export function detectTier(gl) {
  const q = new URLSearchParams(location.search).get('q');
  if (q && TIERS[q]) return q;
  const ua = navigator.userAgent;
  const touch = navigator.maxTouchPoints > 1;
  const small = Math.min(screen.width, screen.height) < 820;
  if (/Android|iPhone|iPod|Mobile/i.test(ua) || (touch && small)) return 'mobile';
  let renderer = '';
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  } catch (e) { /* privacy-masked */ }
  if (/iPad/i.test(ua) || (touch && /Mac/i.test(ua))) return 'mobile';
  if (/NVIDIA|GeForce|RTX|Radeon RX|Radeon Pro|AMD Radeon\(TM\) RX|Arc\(TM\) A|Apple M[2-9] (Pro|Max|Ultra)/i.test(renderer)) return 'ultra';
  return 'high';
}
